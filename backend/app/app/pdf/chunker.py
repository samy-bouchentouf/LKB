from langchain_text_splitters import RecursiveCharacterTextSplitter


class PDFChunker:

    def __init__(
        self,
        chunk_size=600,
        chunk_overlap=100
    ):

        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=[
                "\n\n",
                "\n",
                ". ",
                " ",
                ""
            ]
        )

    def chunk_pages(self, pages):

        chunks = []

        for page in pages:

            page_chunks = self.splitter.split_text(
                page["text"]
            )

            for i, chunk in enumerate(page_chunks):

                chunks.append({
                    "page": page["page"],
                    "chunk": i,
                    "content": chunk
                })

        return chunks