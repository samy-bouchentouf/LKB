"""
Main entry point of the chatbot.

Receives user questions,
retrieves relevant document chunks,
builds the final prompt,
queries the language model,
and returns the generated answer.
"""

from .indexing.indexer import sync_documents
from .retrieval.retriever import retrieve_chunks
from .retrieval.prompt_builder import build_prompt
from .llm import generate_answer


# Synchronize Chroma with the documents directory when the chatbot starts.
sync_documents()


def ask_question(question: str) -> dict:
    """
    Answer a user question using the knowledge base.
    """

    chunks = retrieve_chunks(question)

    prompt = build_prompt(
        question,
        chunks,
    )

    answer = generate_answer(prompt)

    sources = []
    seen_sources = set()

    for chunk in chunks:

        source = chunk["source"]

        if source in seen_sources:
            continue

        seen_sources.add(source)

        sources.append(
            {
                "source": source,
                "category": chunk["category"],
            }
        )

    return {
        "answer": answer,
        "sources": sources,
    }