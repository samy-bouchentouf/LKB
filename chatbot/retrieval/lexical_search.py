"""
Lexical search module.

Retrieves the most relevant document chunks
using BM25 keyword-based search.
"""

import json

from pathlib import Path

from rank_bm25 import BM25Okapi

from ..models.chunk import Chunk
from ..models.search_result import SearchResult


CHUNKS_PATH = Path(
    "chatbot/data/chunks.json"
)


bm25_index = None
stored_chunks = []


def load_bm25_index() -> None:
    """Load chunks and build the BM25 index."""

    global bm25_index
    global stored_chunks

    if not CHUNKS_PATH.exists():

        stored_chunks = []
        bm25_index = None

        return

    with open(
        CHUNKS_PATH,
        "r",
        encoding="utf-8",
    ) as file:

        stored_chunks = json.load(file)

    tokenized_corpus = [

        chunk["chunk_text"].lower().split()

        for chunk in stored_chunks
    ]

    bm25_index = BM25Okapi(
        tokenized_corpus
    )


def reload_bm25_index() -> None:
    """Rebuild the BM25 index."""

    load_bm25_index()


def lexical_search(
    question: str,
    top_k: int = 50,
    ) -> list[SearchResult]:
    """Retrieve chunks using BM25 search."""

    if bm25_index is None:

        print("BM25 INDEX NOT LOADED")
        
        return []

    query_tokens = (
        question.lower().split()
    )

    scores = bm25_index.get_scores(
        query_tokens
    )

    ranked_results = sorted(
        zip(stored_chunks, scores),
        key=lambda item: item[1],
        reverse=True,
    )

    search_results = []

    for chunk_data, score in ranked_results[
        :top_k
    ]:

        chunk = Chunk(
            source=chunk_data["source"],
            category=chunk_data["category"],
            chunk_index=chunk_data[
                "chunk_index"
            ],
            chunk_text=chunk_data[
                "chunk_text"
            ],
        )

        search_results.append(
            SearchResult(
                chunk=chunk,
                bm25_score=float(score),
            )
        )
        
    return search_results