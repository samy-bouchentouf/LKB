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

 Le second système du RAG est entièrement basé sur LangChain et ChromaDB. Les documents sont ingérés une seule fois via un script dédié (ingest.py), puis indexés localement dans une base vectorielle persistée. Pour la génération, nous avons choisi le modèle mistral-large-latest de Mistral AI, plus stable et plus adapté à un usage strict en contexte scientifique. Afin d’intégrer proprement ce RAG Python dans l’application Web, nous avons remplacé l’ancien appel exec() par un serveur FastAPI dédié. Le backend Express communique désormais avec FastAPI via une route /rag, ce qui permet de charger le modèle et la base vectorielle une seule fois, d’améliorer fortement les performances et de rendre l’architecture beaucoup plus robuste.



## 3. Difficultés Rencontrées et Solutions

- **Saturation des API (Rate Limiting) :** Lors de la vectorisation de la base de connaissances, l'envoi massif de requêtes simultanées provoquait des erreurs `429 (Too Many Requests)` chez Mistral, ou prenait un temps très long à être executé. 

- **Communication entre backend et frontend :** Comme nous travaillions tous sur un "bloc" du code, un de nos enjeux majeurs en fin de semaine a été de connecter toutes les pièces entre elles. Nous avons du corriger les erreurs de nomenclature et vérifier les destinations indiquées par chaque code.

Pour surmonter ces obstacles, nous avons mis en place des solutions robustes :
- **Architecture d'ingestion unique :** Nous avons scripté la vectorisation pour qu'elle s'exécute en tâche de fond une seule fois. Les embeddings étant sauvegardés localement, le chatbot n'a plus à recalculer la base à chaque question.

- **Conflits de dépendances:** Nous avons tenté d'utiliser lors de la réalisation du RAG d'une clé API Google Gemini. Des instabilités majeures ont été rencontrées avec l'API Google Gemini suite à la transition forcée de Google vers un nouveau format de clés d'authentification (préfixe AQ... au lieu du format standard AIza...).
Cette transition  rend les anciennes implémentations et de nombreuses bibliothèques tierces incompatibles malgré les commandes Upgrade, nous avons eu des erreurs incomprises et la détection de l'origine du problème a du nous prendre du temps.


## 5. Pistes d'améliorations 

Avec un délai supplémentaire, nous aurions exploré les axes d'amélioration suivants :

- **Modèle hybride de RAG et base de données plus légère:** Nous aurions souhaité trouver une alternative aux deux RAG nous permettant d'avoir la main sur les paramètres de calcul et les méthodes d'embedding tout en gardant l'efficacité des fonctions Python. Nous aurions également cherché à remplacer le fichier local `knowledge_vect.json` par une instance de *ChromaDB* ou *Pinecone* pour permettre le passage à l'échelle sur des milliers de publications.

- **Réaliser les Troubleshoots:**  un historique des tous les problèmes rencontrés dans le passé, et de leur résolution. On peut imaginer pouvoir « signaler un nouveau problème » via le chatbot.

