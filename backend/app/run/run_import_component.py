import json
import sys

from operators.component.importer import ComponentImporter


if __name__ == "__main__":

    try:

        if len(sys.argv) < 3:
            raise Exception(
                "Usage : python run/run_import_component.py <pdf_path> <component_name>"
            )

        pdf_path = sys.argv[1]
        component_name = sys.argv[2]
        if len(sys.argv) > 3:
            manufacturer = sys.argv[3]
            reference = sys.argv[4]
            serial_number = sys.argv[5]
            location = sys.argv[6]
            description = sys.argv[7]
            
        else:
            manufacturer = None
            reference = None
            serial_number = None
            location = None
            description = None

        result = ComponentImporter.import_component(

            name=component_name,

            pdf_path=pdf_path,

            component_type=None,

            manufacturer=manufacturer,

            reference=reference,

            serial_number=serial_number,

            location=location,

            description=description

        )

        print(json.dumps(result))

    except Exception as e:

        print(json.dumps({
            "success": False,
            "error": str(e)
        }))