"""
Language model interface.

Handles communication with the Mistral LLM
and generates answers from prompts built
using retrieved document context.
"""

import os

from dotenv import load_dotenv
from mistralai.client import Mistral


load_dotenv()


client = Mistral(
    api_key=os.getenv("MISTRAL_API_KEY")
)


def generate_answer(prompt: str) -> str:
    """Generate an answer from the given prompt."""

    try:

        response = client.chat.complete(
            model="mistral-large-latest",
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )

        return response.choices[0].message.content

    except Exception as error:

        if (
            "Rate limit exceeded" in str(error)
            or "Status 429" in str(error)
        ):

            return (
                "The chatbot has temporarily reached the request limit.\n\n"
                "Please wait a few moments and try again."
            )

        raise