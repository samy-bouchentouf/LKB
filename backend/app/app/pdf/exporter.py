from pathlib import Path
import json

from ..database import SessionLocal
from ..models import KnowledgeItem


class JSONExporter:

    @staticmethod
    def export_all():

        db = SessionLocal()

        knowledge_items = db.query(KnowledgeItem).all()

        data = []

        for item in knowledge_items:

            data.append({

                "id": item.id,

                "content": item.content,

                "metadata": {

                    "source": item.type,

                    "document": item.document.title if item.document else None,

                    "document_id": item.document_id,

                    "filepath": item.document.filepath if item.document else None,

                    "component": item.component.name if item.component else None,

                    "component_id": item.component_id,

                    "experiment": item.experiment.name if item.experiment else None,

                    "experiment_id": item.experiment_id,

                    "author": item.author.name if item.author else None,

                    "author_id": item.author_id,

                    "page": item.page_number,

                    "chunk": item.chunk_index,

                    "created_at": str(item.created_at)

                }

            })

        db.close()

        return data

    @staticmethod
    def export_document(document_id):

        db = SessionLocal()

        knowledge_items = (
            db.query(KnowledgeItem)
            .filter(KnowledgeItem.document_id == document_id)
            .all()
        )

        data = []

        for item in knowledge_items:

            data.append({

                "id": item.id,

                "content": item.content,

                "metadata": {

                    "source": item.type,

                    "document": item.document.title if item.document else None,

                    "document_id": item.document_id,

                    "filepath": item.document.filepath if item.document else None,

                    "component": item.component.name if item.component else None,

                    "component_id": item.component_id,

                    "experiment": item.experiment.name if item.experiment else None,

                    "experiment_id": item.experiment_id,

                    "author": item.author.name if item.author else None,

                    "author_id": item.author_id,

                    "page": item.page_number,

                    "chunk": item.chunk_index,

                    "created_at": str(item.created_at)

                }

            })

        db.close()

        return data

    @staticmethod
    def export_to_json(filename="knowledge.json"):

        data = JSONExporter.export_all()

        # Dossier backend (racine du projet)
        backend_root = Path(__file__).resolve().parents[2]

        output_file = backend_root / filename

        with open(output_file, "w", encoding="utf-8") as f:

            json.dump(
                data,
                f,
                indent=4,
                ensure_ascii=False
            )

        return str(output_file)
    
    @staticmethod

    def export_document_to_json(document_id):

        data = JSONExporter.export_document(document_id)

        filename = f"document_{document_id}.json"

        with open(filename, "w", encoding="utf-8") as f:

            json.dump(
            data,
            f,
            indent=4,
            ensure_ascii=False
            )

        return filename