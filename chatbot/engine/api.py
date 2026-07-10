"""
Chatbot API.

Exposes the chatbot functionality through
HTTP endpoints used by the web application.
"""

from fastapi import FastAPI
from pydantic import BaseModel

from .rag_api import ask_question
from ..indexing.indexer import sync_documents


app = FastAPI(
    title="LKB Chatbot API"
)


class QuestionRequest(BaseModel):
    """Question payload received from the web application."""

    question: str


@app.post("/ask")
def ask(request: QuestionRequest) -> dict:
    """Answer a user question using the knowledge base."""

    return ask_question(
        request.question
    )


@app.post("/sync")
def synchronize() -> dict:
    """Synchronize Chroma with the documents directory."""

    sync_documents()

    return {
        "message": "Knowledge base synchronized."
    }