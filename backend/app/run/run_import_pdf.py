import json
import sys

from operators.pdf.importer import PDFImporter

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
  `python app/run_import_pdf.py "${pdfPath}" "${title}"`,
  (error, stdout, stderr) => {
      ...
  }
)
'''