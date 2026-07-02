import fitz


class PDFExtractor:

    @staticmethod
    def extract_pages(pdf_path):
        doc = fitz.open(pdf_path)
        pages = []

        for i, page in enumerate(doc):
            text = page.get_text("text").strip()

            if not text:
                continue

            pages.append({
                "page": i + 1,
                "text": text
            })

        doc.close()

        return pages