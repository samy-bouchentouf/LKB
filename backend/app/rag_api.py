from fastapi import FastAPI
from pydantic import BaseModel
from langchain_chroma import Chroma
from langchain_mistralai import MistralAIEmbeddings, ChatMistralAI
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Vérification clé API
if not os.getenv("MISTRAL_API_KEY"):
    raise Exception("MISTRAL_API_KEY manquante dans .env")

# Charger embeddings
embeddings = MistralAIEmbeddings(model="mistral-embed")

# Charger ChromaDB
vectordb = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings
)

retriever = vectordb.as_retriever(search_kwargs={"k": 4})

# Modèle LLM
llm = ChatMistralAI(
    model="mistral-large-latest",
    temperature=0
)

# Prompt strict
system_prompt = (
    "Tu es un assistant de recherche strict et professionnel pour le laboratoire LKB. "
    "Utilise UNIQUEMENT le contexte fourni ci-dessous pour répondre à la question. "
    "Si l'information n'est pas dans le contexte, dis clairement que tu ne trouves pas l'information dans tes documents. "
    "N'invente jamais de réponse.\n\n"
    "Contexte retrouvé : {context}"
)


prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}")
])

qa_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, qa_chain)

class Question(BaseModel):
    question: str

@app.post("/rag")
def rag_endpoint(payload: Question):
    result = rag_chain.invoke({"input": payload.question})
    return {"answer": result["answer"]}
