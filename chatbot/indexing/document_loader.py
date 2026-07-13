"""
Document loading module.

Extracts raw text from supported document formats:
PDF, DOCX, TXT and Markdown files.
"""

import json

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


def load_json(
    file_path: str,
) -> str:
    """Extract text from a JSON file."""

    with open(
        file_path,
        "r",
        encoding="utf-8",
    ) as file:

        return file.read()


def load_diagram(
    file_path: str,
) -> str:
    """
    Extract searchable text from
    a diagram JSON file.
    """

    with open(
        file_path,
        "r",
        encoding="utf-8",
    ) as file:

        diagram = json.load(file)

    diagram_name = diagram.get(
        "name",
        ""
    )

    node_names = {}

    for node in diagram.get(
        "nodes",
        []
    ):

        node_names[
            node["id"]
        ] = node["name"]

    component_names = [

        node["name"]
        for node in diagram.get(
            "nodes",
            []
        )

    ]

    lines = [

        f"Diagram name: {diagram_name}",

        "",

        "Components:"

    ]

    for component in component_names:

        lines.append(
            f"- {component}"
        )

    lines.append("")
    lines.append("Connections:")

    connection_descriptions = []

    connections = diagram.get(
        "connections",
        []
    )

    if not connections:

        lines.append(
            "- This diagram has no connections."
        )

    for connection in connections:

        source = node_names.get(
            connection["from"],
            connection["from"]
        )

        target = node_names.get(
            connection["to"],
            connection["to"]
        )

        label = connection.get(
            "name",
            ""
        )

        if label:

            description = (
                f'Connection "{label}" '
                f'between {source} '
                f'and {target}'
            )

        else:

            description = (
                f"Connection between "
                f"{source} and {target}"
            )

        lines.append(
            f"- {description}"
        )

        connection_descriptions.append(
            description
        )

    lines.append("")
    lines.append("Summary:")

    lines.append(
        f'The diagram "{diagram_name}" '
        f'contains {len(component_names)} '
        f'components.'
    )

    if component_names:

        lines.append(
            "Components present: "
            + ", ".join(
                component_names
            )
            + "."
        )

    if connection_descriptions:

        lines.append(
            f'The diagram contains '
            f'{len(connection_descriptions)} '
            f'connections.'
        )

        for description in (
            connection_descriptions
        ):

            lines.append(
                f"- {description}"
            )

    else:

        lines.append(
            "The diagram contains no connections."
        )

    return "\n".join(lines)
    

def load_document(file_path: str) -> str:
    """
    Load a document and return its raw text content.

    Supported formats:
    - PDF
    - DOCX
    - TXT
    - MD
    - JSON
    """

    path = Path(file_path)

    extension = path.suffix.lower()

    if (
        extension == ".json"
        and path.parent.name
        == "diagrams"
    ):

        return load_diagram(
            file_path
        )

    loaders = {
        ".pdf": load_pdf,
        ".docx": load_docx,
        ".txt": load_txt,
        ".md": load_md,
        ".json": load_json,
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