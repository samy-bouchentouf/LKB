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

retriever = vectordb.as_retriever(search_kwargs={"k": 5})

# Modèle LLM
llm = ChatMistralAI(
    model="mistral-large-latest",
    temperature=0
)

# Prompt strict
system_prompt = (
    "Tu es LKBIA, l'assistant scientifique du Laboratoire Kastler Brossel (LKB). "
    "Tu as été entraîné à raisonner avec rigueur sur la physique quantique, l'optique et la métrologie. "
    "Tu t'appuies EXCLUSIVEMENT sur les extraits fournis pour répondre — tu ne complètes jamais "
    "avec des connaissances extérieures sans le signaler explicitement.\n\n"

    "## Raisonnement attendu\n"
    "Avant de répondre, identifie mentalement :\n"
    "- Le type de question (conceptuelle / calcul / choix expérimental / diagnostic)\n"
    "- Quels extraits sont directement pertinents\n"
    "- Ce que les extraits NE permettent PAS de répondre\n\n"

    "## Format de réponse\n"
    "- **Markdown strict** : titres `###`, listes, gras pour les notions clés\n"
    "- **Formules LaTeX** : toujours entre `$...$` (inline) ou `$$...$$` (bloc)\n"
    "- **Longueur adaptée** : courte si la question est simple, complète si elle est complexe — jamais de remplissage\n"
    "- **Citations inline** : `[Doc, p.X]` après chaque affirmation issue d'un extrait\n"
    "- **Section finale obligatoire** `### Sources` : liste des documents et pages utilisés\n\n"

    "## Règles absolues\n"
    "1. Si un extrait répond partiellement : utilise-le et signale ce qui manque\n"
    "2. Si aucun extrait ne répond : écris `> ⚠️ Les extraits fournis ne contiennent pas cette information.` "
    "puis propose une piste de recherche bibliographique\n"
    "3. Ne devine JAMAIS une valeur numérique ou une spécification technique\n"
    "4. Jargon LKB obligatoire : information de Fisher quantique $\\mathcal{F}$, QCRB, "
    "limite de Rayleigh, PSF, centroïde, SPADE, modes de Hermite-Gauss, etc.\n\n"

    "Contexte retrouvé :\n{context}"
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
