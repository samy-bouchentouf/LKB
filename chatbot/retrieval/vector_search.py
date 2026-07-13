"""
Vector search module.

Retrieves the most relevant document chunks
using semantic similarity search in Chroma.
"""

from pathlib import Path

from chromadb import PersistentClient

from ..indexing.embedding import create_embedding
from ..models.chunk import Chunk
from ..models.search_result import SearchResult


CHROMA_PATH = Path("chatbot/data/chroma_db")

client = PersistentClient(path=str(CHROMA_PATH))

collection = client.get_or_create_collection(
    name="knowledge_base"
)


def vector_search(
    question: str,
    top_k: int = 50,
) -> list[SearchResult]:
    """Retrieve chunks using semantic similarity search."""

    question_embedding = create_embedding(question)

    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=top_k,
    )

    search_results = []

    distances = results["distances"][0]

    for document, metadata, distance in zip(
        results["documents"][0],
        results["metadatas"][0],
        distances,
    ):
        chunk = Chunk(
            source=metadata["source"],
            category=metadata["category"],
            chunk_index=metadata["chunk_index"],
            chunk_text=document,
        )

        search_results.append(
            SearchResult(
                chunk=chunk,
                vector_score=distance,
            )
        )

    print("\n=== VECTOR RESULTS ===")

    for result in search_results:

        print(
            f"{result.vector_score:.3f} | "
            f"{result.chunk.category} | "
            f"{result.chunk.source}"
        )

    return search_results