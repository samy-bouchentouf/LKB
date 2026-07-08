"""
Document chunking module.

Splits raw text into smaller chunks that can
be embedded and stored in the vector database.
"""

from langchain_text_splitters import RecursiveCharacterTextSplitter


def create_chunks(
    text: str,
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
    ) -> list [str]:
    """Split raw text into overlapping chunks of specified size."""

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )

    return splitter.split_text(text)