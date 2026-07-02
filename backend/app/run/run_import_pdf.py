import json
import os
import sys

sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)

from operators.pdf.importer import PDFImporter

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

if __name__ == "__main__":

    if len(sys.argv) < 3:
        print(json.dumps({
            "success": False,
            "error": "Usage: python run_import_pdf.py <pdf_path> <title>"
        }))
        sys.exit(1)

    pdf_path = sys.argv[1]
    title = sys.argv[2]

    result = PDFImporter.import_pdf(
        pdf_path=pdf_path,
        title=title 
    )

    print(json.dumps(result))

'''
Ensuite ajouter dans le backend un truc en mode :
exec(
  `python app/run/run_import_pdf.py "${pdfPath}" "${title}"`,
  (error, stdout, stderr) => {
      ...
  }
)
'''