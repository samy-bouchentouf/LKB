"""
Retrieval scoring module.

Normalizes retrieval scores and computes
hybrid relevance scores.
"""

from ..models.search_result import SearchResult


VECTOR_WEIGHT = 0.5
BM25_WEIGHT = 0.5


def normalize_scores(
    results: list[SearchResult],
) -> None:
    """Normalize vector and BM25 scores."""

    if not results:
        return

    vector_scores = [
        result.vector_score
        for result in results
        if result.vector_score > 0
    ]

    bm25_scores = [
        result.bm25_score
        for result in results
        if result.bm25_score > 0
    ]

    min_vector = (
        min(vector_scores)
        if vector_scores
        else 0.0
    )

    max_vector = (
        max(vector_scores)
        if vector_scores
        else 0.0
    )

    min_bm25 = (
        min(bm25_scores)
        if bm25_scores
        else 0.0
    )

    max_bm25 = (
        max(bm25_scores)
        if bm25_scores
        else 0.0
    )

    for result in results:

        # Chroma returns distances.
        # Smaller distance = better match.
        if result.vector_score == 0:

            vector_score = 0.0

        elif max_vector > min_vector:

            vector_score = (
                max_vector
                - result.vector_score
            ) / (
                max_vector
                - min_vector
            )

        else:

            vector_score = 1.0

        # BM25 returns similarity scores.
        # Larger score = better match.
        if result.bm25_score == 0:

            bm25_score = 0.0

        elif max_bm25 > min_bm25:

            bm25_score = (
                result.bm25_score
                - min_bm25
            ) / (
                max_bm25
                - min_bm25
            )

        else:

            bm25_score = 1.0

        result.vector_score = (
            vector_score
        )

        result.bm25_score = (
            bm25_score
        )


def compute_hybrid_scores(
    results: list[SearchResult],
) -> None:
    """Compute hybrid retrieval scores."""

    normalize_scores(results)

    for result in results:

        result.hybrid_score = (
            VECTOR_WEIGHT
            * result.vector_score
            +
            BM25_WEIGHT
            * result.bm25_score
        )