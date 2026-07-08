import json

from operators.pdf.exporter import JSONExporter


if __name__ == "__main__":

    try:

        json_path = JSONExporter.export_to_json()

        print(json.dumps({
            "success": True,
            "knowledge_json": json_path
        }))

    except Exception as e:

        print(json.dumps({
            "success": False,
            "error": str(e)
        }))