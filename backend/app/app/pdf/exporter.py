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

                    "component": item.component.name if item.component else None,

                    "experiment": item.experiment.name if item.experiment else None,

                    "author": item.author.name if item.author else None,

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

                    "component": item.component.name if item.component else None,

                    "experiment": item.experiment.name if item.experiment else None,

                    "author": item.author.name if item.author else None,

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

        with open(filename, "w", encoding="utf-8") as f:

            json.dump(
                data,
                f,
                indent=4,
                ensure_ascii=False
            )

        return filename