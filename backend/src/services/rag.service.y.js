/**
 * Nouveau système RAG – Explication des changements
 *
 * Avant :
 * --------
 * Le backend appelait un script Python externe via `exec("python run_rag.py")`.
 * À chaque question utilisateur, un nouveau processus Python était lancé :
 *    - rechargement complet de ChromaDB
 *    - rechargement des embeddings
 *    - rechargement du modèle Mistral
 *    - exécution du script puis fermeture du process
 *
 * Ce fonctionnement était très lent, instable, difficile à déployer
 * et le script run_rag.py n'était plus maintenu.
 *
 * Maintenant :
 * ------------
 * Le RAG tourne dans un serveur Python FastAPI (rag_api.py).
 * FastAPI charge ChromaDB, les embeddings et le modèle Mistral UNE SEULE FOIS
 * au démarrage, puis expose une API HTTP : POST /rag.
 *
 * Ce fichier rag.service.js n'exécute plus de script Python.
 * Il envoie simplement la question à FastAPI via HTTP et récupère la réponse.
 */



export const runRag = async (message) => {
  const response = await fetch("http://localhost:8000/rag", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: message })
  });

  const data = await response.json();
  return data.answer;
};
