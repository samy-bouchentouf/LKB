"""
Document loading module.

Extracts raw text from supported document formats:
PDF, DOCX, TXT and Markdown files.
"""

from pathlib import Path
from pypdf import PdfReader
from docx import Document


def load_pdf(file_path: str) -> str:
    """Extract text from a PDF file."""

    reader = PdfReader(file_path)

    text = []

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text.append(page_text)

    return "\n".join(text)


def load_docx(file_path: str) -> str:
    """Extract text from a DOCX file."""

    document = Document(file_path)

    paragraphs = [
        paragraph.text
        for paragraph in document.paragraphs
        if paragraph.text.strip()
    ]

    return "\n".join(paragraphs)


def load_txt(file_path: str) -> str:
    """Extract text from a TXT file."""

    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()


def load_md(file_path: str) -> str:
    """Extract text from a Markdown file."""

    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()


def load_document(file_path: str) -> str:
    """
    Load a document and return its raw text content.

    Supported formats:
    - PDF
    - DOCX
    - TXT
    - MD
    """

    extension = Path(file_path).suffix.lower()

    loaders = {
        ".pdf": load_pdf,
        ".docx": load_docx,
        ".txt": load_txt,
        ".md": load_md,
    }

    if extension not in loaders:
        raise ValueError(
            f"Unsupported file format: {extension}"
        )

    try:
        text = loaders[extension](file_path)
    except Exception as error:
        raise ValueError(
            f"Failed to load document '{file_path}': {error}"
        ) from error

    if not text.strip():
        raise ValueError(
            f"No text could be extracted from {file_path}"
        )

    return text