import json
import sys

from operators.troubleshooting.importer import TroubleshootingImporter


if __name__ == "__main__":

    try:

        if len(sys.argv) < 6:
            raise Exception(
                "Usage: python run_import_troubleshooting.py "
                "<title> <problem> <cause> <solution> <component_id>"
            )

        result = TroubleshootingImporter.import_troubleshooting(

            title=sys.argv[1],

            problem=sys.argv[2],

            cause=sys.argv[3],

            solution=sys.argv[4],

            component_id=int(sys.argv[5]),

            experiment_id=int(sys.argv[6]) if len(sys.argv) > 6 else None,

            author_id=int(sys.argv[7]) if len(sys.argv) > 7 else None,

            notes=sys.argv[8] if len(sys.argv) > 8 else None

        )

        print(json.dumps(result))

    except Exception as e:

        print(json.dumps({

            "success": False,

            "error": str(e)

        }))