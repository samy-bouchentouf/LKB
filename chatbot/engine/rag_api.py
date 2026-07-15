"""
Main entry point of the chatbot.

Receives user questions,
retrieves relevant document chunks,
builds the final prompt,
queries the language model,
and returns the generated answer.
"""

from ..indexing.indexer import sync_documents
from ..retrieval.hybrid_search import hybrid_search
from .prompt_builder import build_prompt

from .llm import generate_answer


# Synchronize retrieval data with the documents
# directory when the chatbot starts.
sync_documents()


def ask_question(question: str) -> dict:
    """
    Answer a user question using the knowledge base.
    """

    results = hybrid_search(question)

    prompt = build_prompt(
        question,
        results,
    )

    answer = generate_answer(prompt)

    sources = []
    seen_sources = set()

    for result in results:

        chunk = result.chunk

        source = chunk.source

        if source in seen_sources:
            continue

        seen_sources.add(source)

        if chunk.category == "diagrams":

            url = (
                f"/documents/diagrams/"
                f"{source.replace('.json', '.png')}"
            )

        else:

            url = (
                f"/documents/"
                f"{chunk.category}/"
                f"{source}"
            )

        display_source = source

        if chunk.category == "diagrams":

            display_source = (
                source.replace(
                    ".json",
                    ".png"
                )
            )

        sources.append(
            {
                "source": display_source,
                "category": chunk.category,
                "url": url,
            }
        )

    return {
        "answer": answer,
        "sources": sources,
    }