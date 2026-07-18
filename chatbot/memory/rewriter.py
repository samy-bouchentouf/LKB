"""
Question rewriting module.

Rewrites user questions using conversation
history to resolve implicit references
before document retrieval.
"""

from ..engine.llm import generate_answer

from .history import (
    get_extended_history,
    format_history,
)


def build_rewrite_prompt(
    question: str,
    messages: list[dict]
    ) -> str:
    """
    Build the prompt used to transform an
    implicit user question into a fully
    explicit and self-contained question.
    """

    history = format_history(
        get_extended_history(
            messages
        )
    )

    return f"""
You are a query rewriting assistant.

Your task is to rewrite the user's latest
question so that it becomes completely
self-contained and explicit.

Use the conversation history to resolve
references such as:

- it
- this component
- this detector
- that incident
- this publication
- this diagram
- the previous issue

Do not answer the question.
If the question is already explicit,
return it unchanged.

Do not add information that is not present
in the conversation.

Return only the rewritten question.

Conversation History:

{history}

Current Question:

{question}

Rewritten Question:
""".strip()


def rewrite_question(
    question: str,
    messages: list[dict]
) -> str:
    """
    Rewrite the user's question using
    conversation history to resolve
    implicit references before retrieval.
    """

    if not messages:
        return question

    prompt = build_rewrite_prompt(
        question,
        messages
    )

    rewritten_question = (
        generate_answer(
            prompt
        )
        .strip()
    )

    return (
        rewritten_question
        or question
    )