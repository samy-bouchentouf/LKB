"""
Document indexing pipeline.

Coordinates document loading, chunking,
embedding generation and storage of indexed
data used by the retrieval system.
"""

import json
import logging

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
logger = logging.getLogger(__name__)


def safe_console_text(
    text: str,
    ) -> str:
    """
    Convert text to a format that can always be
    displayed by the Windows console.
    """

    return text.encode(
        "cp1252",
        errors="replace",
    ).decode(
        "cp1252"
    )


def load_chunks_store() -> list:
    """Load chunks from the JSON store."""

    if not CHUNKS_PATH.exists():
        return []

    try:

        with open(
            CHUNKS_PATH,
            "r",
            encoding="utf-8",
        ) as file:

            return json.load(file)

    except json.JSONDecodeError:

        return []


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


def get_disk_documents() -> dict:
    """
    Return all supported documents
    currently present on disk.
    """

    documents_root = Path("documents")

    supported_extensions = {
        ".pdf",
        ".docx",
        ".txt",
        ".md",
        ".json",
    }

    documents = {}

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

        documents[
            document_hash
        ] = str(file_path)

    return documents


def get_chroma_documents() -> dict:
    """
    Return all documents currently
    indexed in Chroma.
    """

    documents = {}

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
            not in documents
        ):
            documents[
                document_hash
            ] = (
                f"{metadata['category']}/"
                f"{metadata['source']}"
            )

    return documents


def get_chunks_store_documents(
    stored_chunks: list,
    ) -> dict:
    """
    Return all documents currently
    stored in chunks.json.
    """

    documents = {}

    for chunk in stored_chunks:

        document_hash = chunk[
            "document_hash"
        ]

        if (
            document_hash
            not in documents
        ):
            documents[
                document_hash
            ] = (
                f"{chunk['category']}/"
                f"{chunk['source']}"
            )

    return documents


def add_document_to_chroma(
    file_path: str,
    document_hash: str,
    ) -> None:
    """Add a document to Chroma."""

    text = load_document(file_path)

    category = Path(file_path).parent.name

    if category == "diagrams":

        chunks = [text]

    else:

        chunks = create_chunks(text)

    embeddings = create_embeddings(
        chunks
    )

    source = Path(file_path).name
    category = Path(file_path).parent.name

    ids = []
    metadatas = []

    for index, chunk in enumerate(chunks):

        ids.append(
            f"{document_hash}_{index}"
        )

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


def remove_document_from_chroma(
    document_hash: str,
    ) -> None:
    """Remove a document from Chroma."""

    collection.delete(
        where={
            "document_hash": document_hash
        }
    )


def add_document_to_chunks_store(
    file_path: str,
    document_hash: str,
    stored_chunks: list,
    ) -> None:
    """Add a document to the chunk store."""

    text = load_document(file_path)

    source = Path(file_path).name
    category = Path(file_path).parent.name

    if category == "diagrams":

        chunks = [text]

    else:

        chunks = create_chunks(text)

    for index, chunk in enumerate(chunks):

        stored_chunks.append(
            {
                "source": source,
                "category": category,
                "chunk_index": index,
                "document_hash": document_hash,
                "chunk_text": chunk,
            }
        )


def remove_document_from_chunks_store(
    document_hashes: set,
    stored_chunks: list,
    ) -> list:
    """Remove documents from the chunk store."""

    return [
        chunk
        for chunk in stored_chunks
        if chunk["document_hash"]
        not in document_hashes
    ]


def sync_documents() -> bool:
    """
    Synchronize indexed data with the documents
    directory on disk.
    """

    disk_documents = (
        get_disk_documents()
    )

    chroma_documents = (
        get_chroma_documents()
    )

    stored_chunks = (
        load_chunks_store()
    )

    json_documents = (
        get_chunks_store_documents(
            stored_chunks
        )
    )

    disk_hashes = set(
        disk_documents.keys()
    )

    chroma_hashes = set(
        chroma_documents.keys()
    )

    json_hashes = set(
        json_documents.keys()
    )

    chroma_hashes_to_add = (
        disk_hashes - chroma_hashes
    )

    chroma_hashes_to_remove = (
        chroma_hashes - disk_hashes
    )

    json_hashes_to_add = (
        disk_hashes - json_hashes
    )

    json_hashes_to_remove = (
        json_hashes - disk_hashes
    )

    # Synchronize Chroma.

    if chroma_hashes_to_add:

        for document_hash in chroma_hashes_to_add:

            file_path = disk_documents[
                document_hash
            ]

            logger.warning(
                f"Indexing in Chroma: "
                f"{safe_console_text(file_path)}"
            )

            add_document_to_chroma(
                file_path,
                document_hash,
            )

    if chroma_hashes_to_remove:

        for document_hash in chroma_hashes_to_remove:

            logger.warning(
                f"Removing from Chroma: "
                f"{safe_console_text(chroma_documents[document_hash])}"
            )

            remove_document_from_chroma(
                document_hash
            )

    # Synchronize chunks.json.

    if json_hashes_to_add:

        for document_hash in json_hashes_to_add:

            file_path = disk_documents[
                document_hash
            ]

            logger.warning(
                f"Indexing in chunks.json: "
                f"{safe_console_text(file_path)}"
            )

            add_document_to_chunks_store(
                file_path,
                document_hash,
                stored_chunks,
            )

    if json_hashes_to_remove:

        for document_hash in json_hashes_to_remove:

            logger.warning(
                f"Removing from chunks.json: "
                f"{safe_console_text(json_documents[document_hash])}"
            )

        stored_chunks = (
            remove_document_from_chunks_store(
                json_hashes_to_remove,
                stored_chunks,
            )
        )

    if (
        json_hashes_to_add
        or json_hashes_to_remove
    ):

        save_chunks_store(
            stored_chunks
        )

    if (
        json_hashes_to_add
        or json_hashes_to_remove
    ):

        reload_bm25_index()
        
    documents_changed = (

        bool(chroma_hashes_to_add)
        or bool(chroma_hashes_to_remove)
        or bool(json_hashes_to_add)
        or bool(json_hashes_to_remove)

    )

    return documents_changed