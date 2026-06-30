from app.pdf.importer import PDFImporter

result = PDFImporter.import_pdf(
    pdf_path="fichiers/R╠îehac╠îek et al. - 2017 - Multiparameter quantum metrology of incoherent point sources Towards realistic superresolution.pdf",
    title="Mon premier test",
    authors="David"
)

print(result)