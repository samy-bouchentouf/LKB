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

    return {
        "answer": answer,
        "sources": [
            {
                "source": chunk["source"],
                "category": chunk["category"],
            }
            for chunk in chunks
        ],
    }