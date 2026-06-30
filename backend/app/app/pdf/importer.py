from .extractor import PDFExtractor
from .chunker import PDFChunker
from .exporter import JSONExporter

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
        description=None,
        component_id=None
    ):

        return crud_document.add(
            title=title,
            filepath=pdf_path,
            type=document_type,
            authors=authors,
            year=year,
            description=description,
            component_id=component_id
        )

    @staticmethod
    def create_chunks(
        document,
        pdf_path,
        component_id=None,
        experiment_id=None,
        author_id=None
    ):

        print(f"📄 Lecture de {pdf_path}")
        pages = PDFExtractor.extract_pages(pdf_path)
        print(f"✓ {len(pages)} pages extraites")

        chunker = PDFChunker()

        chunks = chunker.chunk_pages(pages)
        print(f"✓ {len(chunks)} chunks créés")

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

        print("=" * 60)
        print("📄 Début de l'import PDF")
        print(f"📁 Fichier : {pdf_path}")
        print(f"📝 Titre   : {title}")
        print("=" * 60)

        # Création du document
        print("➡️ Création du document dans PostgreSQL...")
        document = PDFImporter.create_document(
            pdf_path=pdf_path,
            title=title,
            document_type=document_type,
            authors=authors,
            year=year,
<<<<<<< Updated upstream
            description=description,
            component_id=component_id
=======
            description=description
>>>>>>> Stashed changes
        )
        print(f"✅ Document créé (id={document.id})")

        # Chunking
        print("➡️ Extraction et découpage du PDF...")
        n_chunks = PDFImporter.create_chunks(
            document=document,
            pdf_path=pdf_path,
            component_id=component_id,
            experiment_id=experiment_id,
            author_id=author_id
        )
        print(f"✅ {n_chunks} chunks enregistrés")

        # Export JSON
        print("➡️ Génération de knowledge.json...")
        json_path = JSONExporter.export_to_json()
        print(f"✅ JSON généré : {json_path}")

        print("🎉 Import terminé avec succès !")
        print("=" * 60)

        return {
           "success": True,
           "document_id": document.id,
           "title": document.title,
           "chunks_created": n_chunks,
           "knowledge_json_updated": True
        }