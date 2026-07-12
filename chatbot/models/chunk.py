"""
Chunk data model.

Represents a document chunk and its
associated metadata.
"""

from dataclasses import dataclass


@dataclass
class Chunk:
    """Represent a document chunk."""

    source: str
    category: str
    chunk_index: int
    chunk_text: str