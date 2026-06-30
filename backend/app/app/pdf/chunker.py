from langchain_text_splitters import RecursiveCharacterTextSplitter


class PDFChunker:

    def __init__(
        self,
        chunk_size=1000,
        chunk_overlap=200
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
        """
        pages =
        [
            {
                "page": 1,
                "text": "..."
            }
        ]

        retourne

        [
            {
                "page": 1,
                "chunk": 0,
                "content": "..."
            }
        ]
        """

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