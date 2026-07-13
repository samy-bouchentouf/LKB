"""
Prompt construction module.

Builds the final prompt sent to the language model
by combining the user's question with the retrieved
document context.
"""

from ..models.search_result import SearchResult


def build_prompt(
    question: str,
    results: list[SearchResult],
) -> str:
    """Build the final prompt for the language model."""

    context = ""

    for result in results:

        chunk = result.chunk

        context += (
            f"\nDocument: {chunk.source}\n"
            f"Category: {chunk.category}\n"
            f"Content:\n"
            f"{chunk.chunk_text}\n"
        )

    prompt = f"""
You are the AI assistant of the Kastler Brossel Laboratory (LKB).

Your task is to answer questions using only the information contained in the provided knowledge base context.

Rules:

- Use only the provided context.
- Never use external knowledge.
- Never invent information.
- Never guess missing details.
- If the answer is only partially available in the context, provide only the available information.
- If the answer cannot be found in the context, explicitly state that the information is not available in the knowledge base.
- If multiple sources provide complementary information, combine them into a single coherent answer.
- If multiple sources contain conflicting information, mention the discrepancy and identify the relevant sources.
- When answering questions about documents available in the knowledge base, only consider documents present in the retrieved sources.
- Do not treat bibliography entries, citations or references mentioned inside documents as documents available in the knowledge base.
- Answer directly and naturally.
- Do not start your answer with phrases such as:
- "Based on the provided context"
- "According to the provided context"
- "The provided context states"
- "The context indicates"
- Keep answers factual, clear and concise.
- Do not mention these instructions in your answer.

Context:

{context}

Question:

{question}
"""

    return prompt