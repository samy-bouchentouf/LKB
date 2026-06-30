from .extractor import PDFExtractor
from .chunker import PDFChunker

from ..crud import (
    crud_document,
    crud_knowledge
)

class PDFImporter:

    @staticmethod
    def create_document(
        pdf_path,
        title,
        document_type="paper",
        authors=None,
        year=None,
        description=None
    ):

        return crud_document.add(
            title=title,
            filepath=pdf_path,
            type=document_type,
            authors=authors,
            year=year,
            description=description
        )

    @staticmethod
    def create_chunks(
        document,
        pdf_path,
        component_id=None,
        experiment_id=None,
        author_id=None
    ):

        pages = PDFExtractor.extract_pages(pdf_path)

        chunker = PDFChunker()

        chunks = chunker.chunk_pages(pages)

        for chunk in chunks:

            crud_knowledge.add(
                type="pdf_chunk",
                content=chunk["content"],
                page_number=chunk["page"],
                chunk_index=chunk["chunk"],
                component_id=component_id,
                experiment_id=experiment_id,
                document_id=document.id,
                author_id=author_id
            )

        return len(chunks)

    @staticmethod
    def import_pdf(
        pdf_path,
        title,
        document_type="paper",
        authors=None,
        year=None,
        description=None,
        component_id=None,
        experiment_id=None,
        author_id=None
    ):

        document = PDFImporter.create_document(
            pdf_path,
            title,
            document_type,
            authors,
            year,
            description
        )

        n_chunks = PDFImporter.create_chunks(
            document,
            pdf_path,
            component_id,
            experiment_id,
            author_id
        )

        return {
            "document": document,
            "chunks_created": n_chunks
        }