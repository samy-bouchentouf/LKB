"""
Search result data model.

Represents a retrieved document chunk
and its retrieval scores.
"""

from dataclasses import dataclass

from .chunk import Chunk


@dataclass
class SearchResult:
    """Represent a retrieval result."""

    chunk: Chunk

    vector_score: float = 0.0
    bm25_score: float = 0.0
    hybrid_score: float = 0.0