import os
from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma

from langchain_mistralai import MistralAIEmbeddings

# Charger la clé API du fichier .env
load_dotenv()

def preparer_base_de_donnees():
    print(" Étape 1 : Lecture des PDF du labo...")
    loader = DirectoryLoader('./uploads-pdf', glob="**/*.pdf", loader_cls=PyPDFLoader)
    documents = loader.load()
    
    if len(documents) == 0:
        print(" Attention : Aucun PDF trouvé dans le dossier 'uploads-pdf'. L'opération s'arrête.")
        return
        
    print(f"-> {len(documents)} pages lues.")

    print(" Étape 2 : Découpage du texte en morceaux (Chunks)...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    morceaux = text_splitter.split_documents(documents)
    print(f"-> {len(morceaux)} morceaux créés.")

    print(" Étape 3 : Conversion en vecteurs avec Mistral et stockage dans ChromaDB...")
    
    # Vérification de sécurité pour la clé Mistral
    if not os.getenv("MISTRAL_API_KEY"):
        print(" ERREUR : La clé MISTRAL_API_KEY est introuvable dans le fichier .env !")
        return
        
    embeddings = MistralAIEmbeddings(model="mistral-embed")
    
    Chroma.from_documents(
        documents=morceaux,
        embedding=embeddings,
        persist_directory="./chroma_db"
    )
    print("Succès ! Le dossier ./chroma_db a été généré avec Mistral.")

if __name__ == "__main__":
    preparer_base_de_donnees()