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

                "content": item.content,

                "metadata": {

                    "id": item.id,

                    "type": item.type,

                    "page": item.page_number,

                    "chunk": item.chunk_index,

                    "component_id": item.component_id,

                    "experiment_id": item.experiment_id,

                    "document_id": item.document_id,

                    "author_id": item.author_id,

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