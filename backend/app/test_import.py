from app.pdf.importer import PDFImporter

result = PDFImporter.import_pdf(
    pdf_path="fichiers\Liu et al. - 2019 - Quantum Fisher information matrix and multiparameter estimation.pdf",
    title="Mon deuxième test",
    authors="David"
)

print(result)