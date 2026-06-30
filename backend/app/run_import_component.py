import json
import sys

from app.component.importer import ComponentImporter


if __name__ == "__main__":

    try:

        if len(sys.argv) < 3:
            raise Exception(
                "Usage : python run_import_component.py <pdf_path> <component_name>"
            )

        pdf_path = sys.argv[1]
        component_name = sys.argv[2]

        result = ComponentImporter.import_component(

            name=component_name,

            pdf_path=pdf_path

        )

        print(json.dumps(result))

    except Exception as e:

        print(json.dumps({
            "success": False,
            "error": str(e)
        }))