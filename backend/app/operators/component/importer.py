from ..crud.component import crud_component
from ..pdf.importer import PDFImporter


class ComponentImporter:

    @staticmethod
    def import_component(
        name,
        pdf_path,
        component_type=None,
        manufacturer=None,
        reference=None,
        serial_number=None,
        location=None,
        description=None
    ):

        print("=" * 60)
        print("🔧 Création d'un nouveau composant")
        print("=" * 60)

        print("➡️ Création du composant...")

        component = crud_component.add(

            name=name,
            type=component_type,
            manufacturer=manufacturer,
            reference=reference,
            serial_number=serial_number,
            location=location,
            description=description

        )

        print(f"✅ Composant créé (id={component.id})")

        print("➡️ Import de la notice technique...")

        result = PDFImporter.import_pdf(

            pdf_path=pdf_path,

            title=name,

            document_type="manual",

            component_id=component.id

        )

        print("✅ Notice importée")
        print("=" * 60)

        return {

            "success": True,

            "component_id": component.id,

            "component_name": component.name,

            "pdf": result

        }