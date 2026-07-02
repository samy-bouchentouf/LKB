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


## 3. Difficultés Rencontrées et Solutions

- **Saturation des API (Rate Limiting) :** Lors de la vectorisation de la base de connaissances, l'envoi massif de requêtes simultanées provoquait des erreurs `429 (Too Many Requests)` chez Mistral, ou prenait un temps très long à être executé. 

- **Communication entre backend et frontend :** Comme nous travaillions tous sur un "bloc" du code, un de nos enjeux majeurs en fin de semaine a été de connecter toutes les pièces entre elles. Nous avons du corriger les erreurs de nomenclature et vérifier les destinations indiquées par chaque code.

Pour surmonter ces obstacles, nous avons mis en place des solutions robustes :
- **Architecture d'ingestion unique :** Nous avons scripté la vectorisation pour qu'elle s'exécute en tâche de fond une seule fois. Les embeddings étant sauvegardés localement, le chatbot n'a plus à recalculer la base à chaque question.


## 5. Pistes d'améliorations 

Avec un délai supplémentaire, nous aurions exploré les axes d'amélioration suivants :

- **Modèle hybride de RAG et base de données plus légère:** Nous aurions souhaité trouver une alternative aux deux RAG nous permettant d'avoir la main sur les paramètres de calcul et les méthodes d'embedding tout en gardant l'efficacité des fonctions Python. Nous aurions également cherché à remplacer le fichier local `knowledge_vect.json` par une instance de *ChromaDB* ou *Pinecone* pour permettre le passage à l'échelle sur des milliers de publications.

