"""
Document indexing pipeline.

Coordinates document loading, chunking,
embedding generation and storage of indexed
data used by the retrieval system.
"""

import json

from pathlib import Path
from chromadb import PersistentClient

from .document_loader import load_document
from .chunker import create_chunks
from .embedding import create_embeddings
from .hashing import compute_file_hash

from ..retrieval.lexical_search import (
    reload_bm25_index,
)


CHROMA_PATH = Path("chatbot/data/chroma_db")

CHUNKS_PATH = Path(
    "chatbot/data/chunks.json"
)

client = PersistentClient(path=str(CHROMA_PATH))

collection = client.get_or_create_collection(
    name="knowledge_base"
)


def load_chunks_store() -> list:
    """Load chunks from the JSON store."""

    if not CHUNKS_PATH.exists():
        return []

    with open(
        CHUNKS_PATH,
        "r",
        encoding="utf-8",
    ) as file:
        return json.load(file)


def save_chunks_store(
    chunks: list,
) -> None:
    """Save chunks to the JSON store."""

    CHUNKS_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with open(
        CHUNKS_PATH,
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            chunks,
            file,
            ensure_ascii=False,
            indent=4,
        )


def index_document(
    file_path: str,
) -> None:
    """
    Index a document and store its chunks
    for semantic and lexical retrieval.
    """

    text = load_document(file_path)

    chunks = create_chunks(text)

    embeddings = create_embeddings(chunks)

    source = Path(file_path).name
    category = Path(file_path).parent.name

    document_hash = compute_file_hash(
        file_path
    )

    ids = []
    metadatas = []

    stored_chunks = load_chunks_store()

    for index, chunk in enumerate(chunks):

        ids.append(
            f"{document_hash}_{index}"
        )

        metadata = {
            "source": source,
            "category": category,
            "chunk_index": index,
            "document_hash": document_hash,
        }

        metadatas.append(metadata)

        stored_chunks.append(
            {
                **metadata,
                "chunk_text": chunk,
            }
        )

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    save_chunks_store(
        stored_chunks
    )


def sync_documents() -> bool:
    """
    Synchronize indexed data with the documents
    directory on disk.
    """

    documents_root = Path("documents")

    supported_extensions = {
        ".pdf",
        ".docx",
        ".txt",
        ".md",
    }

    # Build a mapping of document hashes to file paths
    # for all supported documents currently on disk.
    disk_documents = {}

    for file_path in documents_root.rglob("*"):

        if not file_path.is_file():
            continue

        if (
            file_path.suffix.lower()
            not in supported_extensions
        ):
            continue

        document_hash = compute_file_hash(
            str(file_path)
        )

        disk_documents[
            document_hash
        ] = str(file_path)

    disk_hashes = set(
        disk_documents.keys()
    )

    # Build a mapping of document hashes currently
    # indexed in Chroma.
    chroma_documents = {}

    stored_metadatas = collection.get(
        include=["metadatas"]
    )

    for metadata in stored_metadatas[
        "metadatas"
    ]:

        document_hash = metadata[
            "document_hash"
        ]

        if (
            document_hash
            not in chroma_documents
        ):
            chroma_documents[
                document_hash
            ] = (
                f"{metadata['category']}/"
                f"{metadata['source']}"
            )

    chroma_hashes = set(
        chroma_documents.keys()
    )

    hashes_to_add = (
        disk_hashes - chroma_hashes
    )

    hashes_to_remove = (
        chroma_hashes - disk_hashes
    )

    # Index documents that are present on disk
    # but missing from the retrieval data stores.
    for document_hash in hashes_to_add:

        file_path = disk_documents[
            document_hash
        ]

        print(
            f"Indexing document: "
            f"{file_path}"
        )

        index_document(file_path)

    # Remove chunks belonging to deleted documents
    # from the lexical retrieval store.
    if hashes_to_remove:

        stored_chunks = load_chunks_store()

        stored_chunks = [
            chunk
            for chunk in stored_chunks
            if chunk["document_hash"]
            not in hashes_to_remove
        ]

        save_chunks_store(
            stored_chunks
        )

    # Remove deleted documents from Chroma.
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

    documents_changed = (
        bool(hashes_to_add)
        or bool(hashes_to_remove)
    )

    # Rebuild the BM25 index whenever the
    # chunk store has been modified.
    if documents_changed:

        reload_bm25_index()

    return documents_changed