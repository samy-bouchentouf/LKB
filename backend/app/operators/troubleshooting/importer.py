from ..crud import crud_knowledge
from ..pdf.exporter import JSONExporter


class TroubleshootingImporter:

    @staticmethod
    def import_troubleshooting(
        title,
        problem,
        cause,
        solution,
        component_id,
        experiment_id=None,
        author_id=None,
        notes=None
    ):

        print("=" * 60)
        print("🛠️ Ajout d'un troubleshooting")
        print("=" * 60)

        print("➡️ Construction du contenu...")

        content = f"""Title:
{title}

Problem:
{problem}

Cause:
{cause}

Solution:
{solution}
"""

        if notes:
            content += f"\nNotes:\n{notes}\n"

        print("➡️ Enregistrement dans PostgreSQL...")

        knowledge = crud_knowledge.add(

            type="troubleshooting",

            content=content,

            component_id=component_id,

            experiment_id=experiment_id,

            author_id=author_id

        )

        print(f"✅ Troubleshooting créé (id={knowledge.id})")

        print("➡️ Génération de knowledge.json...")

        json_path = JSONExporter.export_to_json()

        print(f"✅ JSON généré : {json_path}")

        print("=" * 60)
        print("🎉 Troubleshooting importé avec succès !")
        print("=" * 60)

        return {

            "success": True,

            "knowledge_id": knowledge.id,

            "knowledge_json_updated": True

        }
    
