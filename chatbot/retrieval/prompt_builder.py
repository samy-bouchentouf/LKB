"""
Prompt construction module.

Builds the final prompt sent to the language model
by combining the user's question with the retrieved
document context.
"""


def build_prompt(
    question: str,
    chunks: list,
) -> str:
    """Build the final prompt for the language model."""

    context = ""

    for chunk in chunks:

        context += (
            f"\nSource: {chunk['source']}\n"
            f"{chunk['chunk_text']}\n"
        )

    prompt = f"""
        You are a scientific assistant for the Kastler Brossel Laboratory (LKB).

        Your role is to answer questions using only the information provided in the knowledge base context.

        Instructions:
        - Use only the provided context.
        - Do not invent information.
        - Do not use external knowledge.
        - If the answer cannot be found in the context, state clearly that the information is not available in the knowledge base.
        - Provide a clear, concise and factual answer.
        - When relevant, mention the source documents used.
        - If multiple sources provide complementary information, combine them into a single coherent answer.

        Context:
        {context}

        Question:
        {question}
        """

    return prompt