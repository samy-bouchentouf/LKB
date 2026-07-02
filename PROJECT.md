# Projet numéro 24 : Assistant IA & RAG pour le LKB

Ce document présente la démarche, les choix techniques et l'organisation mis en œuvre pour développer l'assistant de recherche scientifique du Laboratoire Kastler Brossel (LKB).



## 1. Le projet
Un des principaux problèmes dans les laboratoires de recherche est la transmission des savoirs entre les générations successives de chercheurs. Il est fréquent que des problèmes se répètent et que les chercheurs perdent du temps à retrouver une solution. Le laboratoire LKB nous donc a proposé de travailler sur un projet d'application Web rassemblant les connaissances scientifiques de leurs chercheurs, des articles et un chatbot entraîné sur cette base de connaissances. 

## 2. Choix Techniques
Nous avons choisi une répartition assez classique avec un backend et un frontend communiquants. 

Dans le frontend, nous avons codé l'interface en html dans le fichier `test.html`.

 
 ### RAG
Deux codes différents de RAG ont été developpés indépendamment. Chacun présentait ses avantages et spécificités. 

 Pour le premier, nous utilisons le modèle `mistral-embed` de **Mistral AI**, très performant et économique pour vectoriser et indexer localement nos documents au format JSON (`knowledge_vect.json`). Pour la génération de texte (LLM), nous avons intégré **Claude 3.5 Sonnet (Anthropic)** en raison de ses capacités d'analyse logique supérieures, de sa gestion native des formules mathématiques complexe en LaTeX, et de son efficacité. Dans ce modèle, nous avons developpé manuellement toutes les fonctionnalités du RAG: embedding, calcul des distances entre vecteurs, FAISS...Cela nous permettait d'avoir la main sur tous les paramètres mais nous obligeait à developper notre propre méthode de chunking des documents PDF. Cela altérait visiblement la compréhension du document par le LLM. Finalement, cette méthode s'est avérée très coûteuse en temps, bien qu'utile pour comprendre le fonctionnement précis d'un RAG.


## 3. Difficultés Rencontrées
Durant le développement, nous avons été confrontés à trois défis majeurs :
- **Saturation des API (Rate Limiting) :** Lors de la vectorisation de la base de connaissances, l'envoi massif de requêtes simultanées provoquait des erreurs `429 (Too Many Requests)` chez Mistral, ou prenait un temps très long à être executé. 


## 4. Solutions Trouvées
Pour surmonter ces obstacles, nous avons mis en place des solutions robustes :
- **Architecture d'ingestion unique :** Nous avons scripté la vectorisation pour qu'elle s'exécute en tâche de fond une seule fois. Les embeddings étant sauvegardés localement, le chatbot n'a plus à recalculer la base à chaque question.


## 5. Notre Organisation
Le projet a été mené suivant une méthodologie agile itérative, centrée sur le prototypage rapide. Nous avons d'abord validé l'algorithme mathématique de similarité cosinus dans un environnement de sandbox (Jupyter Notebook). Une fois le moteur de recherche sémantique stabilisé, nous avons migré le code vers une architecture modulaire propre sous Node.js (`src/server.js`, `src/services/documents.service.js`) pour le lier au système de fichiers du laboratoire.

## 6. Perspectives et Améliorations (Si nous avions eu plus de temps)
Avec un délai supplémentaire, nous aurions exploré les axes d'amélioration suivants :
- **Intégration d'une base de données vectorielle dédiée :** Remplacer le fichier local `knowledge_vect.json` par une instance de *ChromaDB* ou *Pinecone* pour permettre le passage à l'échelle sur des milliers de publications.
- **Reranking des résultats (Reranker) :** Ajouter une étape de re-classement des chunks récupérés (via un modèle de Cross-Encoder) pour s'assurer que les extraits envoyés à Claude soient d'une pertinence absolue.
- **Parser de PDF avancé :** Améliorer le découpage initial des documents pour extraire proprement les tableaux et les images des articles de physique, souvent mal interprétés par un découpage textuel brut.