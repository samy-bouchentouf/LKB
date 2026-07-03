import streamlit as st
import os
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_mistralai import MistralAIEmbeddings, ChatMistralAI
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# 1. Chargement de la clé API
load_dotenv()

# Configuration esthétique de la page web
st.set_page_config(page_title="Assistant Labo LKB", page_icon="🔬")
st.title("🔬 Assistant IA du Laboratoire")

# Sécurités : On vérifie que tout est prêt avant de démarrer
if not os.getenv("MISTRAL_API_KEY"):
    st.error("⚠️ Clé MISTRAL_API_KEY introuvable. Veuillez vérifier votre fichier .env.")
    st.stop()

if not os.path.exists("./chroma_db"):
    st.error("⚠️ Base de données introuvable. Avez-vous bien lancé 'python ingest.py' ?")
    st.stop()

# 2. Initialisation du "Cerveau" (Mise en cache pour la rapidité)
@st.cache_resource
def initialiser_rag():
    # A. Le moteur de recherche (Embeddings)
    embeddings = MistralAIEmbeddings(model="mistral-embed")
    
    # B. Connexion à votre dossier chroma_db
    vectordb = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
    retriever = vectordb.as_retriever(search_kwargs={"k": 4}) # On demande les 4 meilleurs paragraphes
    
    # C. Le modèle qui va parler (Mistral Large)
    llm = ChatMistralAI(model="mistral-large-latest", temperature=0) # Température 0 = pas d'hallucination
    
    # D. Les consignes strictes données à l'IA
    system_prompt = (
        "Tu es un assistant de recherche strict et professionnel pour le laboratoire LKB. "
        "Utilise UNIQUEMENT le contexte fourni ci-dessous pour répondre à la question. "
        "Si l'information n'est pas dans le contexte, dis clairement que tu ne trouves pas l'information dans tes documents. "
        "N'invente jamais de réponse.\n\n"
        "Contexte retrouvé : {context}"
    )
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])
    
    # E. Assemblage du pipeline complet
    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)
    
    return rag_chain

# On lance la machine
rag_chain = initialiser_rag()

# 3. Gestion de l'historique de la conversation
if "messages" not in st.session_state:
    st.session_state.messages = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# 4. Zone de Chat
if question := st.chat_input("Posez votre question sur les documents du labo..."):
    # Afficher la question
    st.session_state.messages.append({"role": "user", "content": question})
    with st.chat_message("user"):
        st.markdown(question)

    # Réfléchir et afficher la réponse
    with st.chat_message("assistant"):
        with st.spinner("Recherche dans les archives..."):
            try:
                # On pose la question à notre RAG
                reponse = rag_chain.invoke({"input": question})
                texte_final = reponse["answer"]
                
                # On l'affiche
                st.markdown(texte_final)
                
                # On sauvegarde dans l'historique
                st.session_state.messages.append({"role": "assistant", "content": texte_final})
            except Exception as e:
                st.error(f"Une erreur de connexion est survenue : {e}")