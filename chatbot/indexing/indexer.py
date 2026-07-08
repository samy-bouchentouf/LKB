"""
Document indexing pipeline.

Coordinates document loading, chunking,
embedding generation and storage in Chroma.

Triggered whenever a new document is added
to the knowledge base.
"""

from pathlib import Path
from chromadb import PersistentClient
from .document_loader import load_document
from .chunker import create_chunks
from .embeddings import create_embeddings
from .hashing import compute_file_hash


CHROMA_PATH = Path("chatbot/chroma_db")

client = PersistentClient(path=str(CHROMA_PATH))

collection = client.get_or_create_collection(
    name="knowledge_base"
)


def index_document(file_path: str) -> None:
    """Index a document and store its chunks in Chroma."""

    text = load_document(file_path)

    chunks = create_chunks(text)

    embeddings = create_embeddings(chunks)

    source = Path(file_path).name
    category = Path(file_path).parent.name
    document_hash = compute_file_hash(file_path)

    ids = []
    metadatas = []

    for index, chunk in enumerate(chunks):
        ids.append(f"{source}_{index}")

        metadatas.append(
            {
                "source": source,
                "category": category,
                "chunk_index": index,
                "document_hash": document_hash,
            }
        )

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
    )


def sync_documents() -> None:
    """
    Synchronize Chroma with the documents directory on disk.
    - Index documents that are present on disk but not in Chroma.
    - Remove documents that are present in Chroma but not on disk.
    """

    documents_root = Path("documents")

    supported_extensions = {
        ".pdf",
        ".docx",
        ".txt",
        ".md",
    }

    # Build a mapping of document hashes to file paths for documents currently on disk
    disk_documents = {}

    for file_path in documents_root.rglob("*"):

        if not file_path.is_file():
            continue

        if file_path.suffix.lower() not in supported_extensions:
            continue

        document_hash = compute_file_hash(
            str(file_path)
        )

        disk_documents[document_hash] = str(file_path)

    disk_hashes = set(disk_documents.keys())

    # Build a mapping of document hashes to file paths for documents currently stored in Chroma
    chroma_documents = {}

    stored_metadatas = collection.get(
        include=["metadatas"]
    )

    for metadata in stored_metadatas["metadatas"]:

        document_hash = metadata["document_hash"]

        if document_hash not in chroma_documents:

            chroma_documents[document_hash] = (
                f"{metadata['category']}/"
                f"{metadata['source']}"
            )

    chroma_hashes = set(chroma_documents.keys())

    hashes_to_add = disk_hashes - chroma_hashes

    hashes_to_remove = chroma_hashes - disk_hashes

    # Index documents that are on disk but not in Chroma
    for document_hash in hashes_to_add:

        file_path = disk_documents[document_hash]

        print(
            f"Indexing document: {file_path}"
        )

        index_document(file_path)

    # Remove documents that are in Chroma but not on disk
    for document_hash in hashes_to_remove:

        print(
            f"Removing document: "
            f"{chroma_documents[document_hash]}"
        )

        collection.delete(
            where={
                "document_hash": document_hash
            }
        )