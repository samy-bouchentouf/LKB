"""
Hybrid search module.

Combines semantic retrieval and lexical retrieval
to produce a unified ranked list of document chunks.
"""

from ..models.search_result import SearchResult

from .vector_search import vector_search
from .lexical_search import lexical_search
from .scorer import compute_hybrid_scores


def hybrid_search(
    question: str,
    vector_top_k: int = 50,
    lexical_top_k: int = 50,
    final_top_k: int = 15,
) -> list[SearchResult]:
    """Retrieve and rank chunks using hybrid search."""

    vector_results = vector_search(
        question=question,
        top_k=vector_top_k,
    )

    lexical_results = lexical_search(
        question=question,
        top_k=lexical_top_k,
    )

    merged_results = {}

    for result in vector_results:

        key = (
            result.chunk.source,
            result.chunk.chunk_index,
        )

        merged_results[key] = result

    for result in lexical_results:

        key = (
            result.chunk.source,
            result.chunk.chunk_index,
        )

        if key in merged_results:

            merged_results[
                key
            ].bm25_score = (
                result.bm25_score
            )

        else:

            merged_results[key] = result

    results = list(
        merged_results.values()
    )

    compute_hybrid_scores(
        results
    )

    results.sort(
        key=lambda result:
        result.hybrid_score,
        reverse=True,
    )

    return results[:final_top_k]