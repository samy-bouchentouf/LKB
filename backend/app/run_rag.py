import sys
from rag import rag_answer_expert

# récupérer la question
query = sys.argv[1]

# appeler le RAG
response = rag_answer_expert(query)

# renvoyer vers Node
print(response)