"""
Retrieval module.

Converts user questions into embeddings and
retrieves the most relevant chunks from Chroma
using semantic similarity search.
"""

from pathlib import Path
from chromadb import PersistentClient
from ..indexing.embedding import create_embedding


CHROMA_PATH = Path("chatbot/chroma_db")

client = PersistentClient(path=str(CHROMA_PATH))

collection = client.get_or_create_collection(name="knowledge_base")


def retrieve_chunks(
    question: str,
    n_results: int = 5,
) -> list:
    """Retrieve the most relevant document chunks for a given question."""

    question_embedding = create_embedding(question)

    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=n_results,
    )

    retrieved_chunks = []

    for document, metadata in zip(
        results["documents"][0],
        results["metadatas"][0],
    ):

        retrieved_chunks.append(
            {
                "source": metadata["source"],
                "category": metadata["category"],
                "chunk_index": metadata["chunk_index"],
                "chunk_text": document,
            }
        )

    return retrieved_chunks