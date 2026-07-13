"""
Chatbot API.

Exposes the chatbot functionality through
HTTP endpoints used by the web application.
"""

from fastapi import FastAPI
from pydantic import BaseModel

import logging

from .rag_api import ask_question
from ..indexing.indexer import sync_documents
from ..retrieval.lexical_search import (
    reload_bm25_index,
)


logger = logging.getLogger(
    "uvicorn"
)


app = FastAPI(
    title="LKB Chatbot API"
)


@app.on_event("startup")
async def startup_event() -> None:

    reload_bm25_index()

    logger.info(
        "=================================="
    )

    logger.info(
        "[INFO] LKB AI Hub Chatbot Started"
    )

    logger.info(
        "[INFO] Chatbot running on port 8000"
    )

    logger.info(
        "[INFO] API documentation available at http://localhost:8000/docs"
    )

    logger.info(
        "=================================="
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