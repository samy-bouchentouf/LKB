"""
Embedding generation module.

Transforms text chunks and user questions into
vector embeddings using Mistral Embeddings.
"""

import os
from dotenv import load_dotenv
from langchain_mistralai import MistralAIEmbeddings


load_dotenv()


embedding_model = MistralAIEmbeddings(
    model="mistral-embed",
    api_key=os.getenv("MISTRAL_API_KEY")
)


def create_embedding(text: str) -> list[float]:
    """Generate an embedding vector for a single text."""

    return embedding_model.embed_query(text)


def create_embeddings(texts: list[str]) -> list[list[float]]:
    """Generate embedding vectors for multiple texts."""

    return embedding_model.embed_documents(texts)