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

from ..memory.history import (
    get_recent_history,
)

from ..memory.rewriter import (
    rewrite_question,
)

from .prompt_builder import build_prompt
from .llm import generate_answer


# Synchronize retrieval data with the documents
# directory when the chatbot starts.
sync_documents()


def ask_question(
    question: str,
    conversation_id: str | None = None,
    messages: list[dict] | None = None
    ) -> dict:
    """
    Answer a user question using the knowledge base.
    """

    messages = messages or []

    rewritten_question = rewrite_question(
        question,
        messages
    )

    results = hybrid_search(
        rewritten_question
    )
    
    recent_history = get_recent_history(
        messages
    )

    prompt = build_prompt(
        question=rewritten_question,
        results=results,
        history=recent_history,
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