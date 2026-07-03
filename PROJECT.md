# Projet numéro 24 : Assistant IA & RAG pour le LKB

Ce document présente la démarche, les choix techniques et l'organisation mis en œuvre pour développer l'assistant de recherche scientifique du Laboratoire Kastler Brossel (LKB).



## 1. Le projet
Un des principaux problèmes dans les laboratoires de recherche est la transmission des savoirs entre les générations successives de chercheurs. Il est fréquent que des problèmes se répètent et que les chercheurs perdent du temps à retrouver une solution. Le laboratoire LKB nous donc a proposé de travailler sur un projet d'application Web rassemblant les connaissances scientifiques de leurs chercheurs, des articles de recherche, des notices techniques de composants utilisés pour les expériences du laboratoire, et un historique des problèmes rencontrés dans le passé ainsi que leur solution. L'objectif est de mettre a disposition sur cette application Web un chatbot entraîné sur cette base de connaissances. 

## 2. Choix Techniques
Nous avons choisi une répartition assez classique avec un backend et un frontend communiquants. 

Dans le frontend, nous avons codé l'interface en html dans le fichier `test.html`.

 
 ### RAG
 Deux codes différents de RAG ont été developpés indépendamment. Chacun présentait ses avantages et spécificités. 

 Pour le premier, nous utilisons le modèle `mistral-embed` de **Mistral AI**, très performant et économique pour vectoriser et indexer localement nos documents au format JSON (`knowledge_vect.json`). Pour la génération de texte (LLM), nous avons intégré **Claude 3.5 Sonnet (Anthropic)** en raison de ses capacités d'analyse logique supérieures, de sa gestion native des formules mathématiques complexe en LaTeX, et de son efficacité. Dans ce modèle, nous avons developpé manuellement toutes les fonctionnalités du RAG: embedding, calcul des distances entre vecteurs, FAISS...Cela nous permettait d'avoir la main sur tous les paramètres mais nous obligeait à developper notre propre méthode de chunking des documents PDF. Cela altérait visiblement la compréhension du document par le LLM. Finalement, cette méthode s'est avérée très coûteuse en temps, bien qu'utile pour comprendre le fonctionnement précis d'un RAG.

 Le second système du RAG est entièrement basé sur LangChain et ChromaDB. Les documents sont ingérés une seule fois via un script dédié (ingest.py), puis indexés localement dans une base vectorielle persistée. Pour la génération, nous avons choisi le modèle mistral-large-latest de Mistral AI, plus stable et plus adapté à un usage strict en contexte scientifique. Afin d’intégrer proprement ce RAG Python dans l’application Web, nous avons remplacé l’ancien appel exec() par un serveur FastAPI dédié. Le backend Express communique désormais avec FastAPI via une route /rag, ce qui permet de charger le modèle et la base vectorielle une seule fois, d’améliorer fortement les performances et de rendre l’architecture beaucoup plus robuste.

 ### Gestion de la base de connaissance
 Après discussion avec notre encadrant, nous avons souhaité garantir une bonne séparation entre les données et l'interface Web via une base SQL. S'assurer que cette séparation est faite proprement n'est pas strictement nécessaire pour les premiers objectifs de l'application Web, mais le deviendra rapidement lors de développement futurs (exemples donnés plus tard dans cette section).
 
 Ainsi, nous avons développé un backend Python chargé de la gestion de la base de connaissances. Ce backend s'appuie sur une base de données PostgreSQL et sur l'ORM SQLAlchemy afin de stocker de manière structurée les différentes entités manipulées par l'application : publications scientifiques, composants expérimentaux, expériences et éléments de connaissance utilisés par le chatbot (knowledge), ainsi que les différents utilisateurs qui vont intéragir avec la base de données.

 Le choix d'une base de données relationnelle permet de conserver les relations entre les différents objets (par exemple l'association d'une notice technique à un composant précis, ou d'un composant précis et d'une expérience) ce qui facilitera les futures évolutions de l'application. Par exemple, on peut imaginer dans le futur vouloir étudier les interactions entre deux composants dans une même expérience, demander des informations sur les composants d'une expérience précise etc.

 Les documents PDF (articles scientifiques ou notices techniques de composants) sont importés automatiquement via un pipeline dédié. Lorsqu'un utilisateur ajoute un document, celui-ci est d'abord enregistré dans la base de données avec toutes les informations données par l'utilisateur, puis son texte est extrait à l'aide de PyMuPDF. Le contenu est ensuite découpé en fragments ("chunks") grâce au découpage récursif proposé par LangChain (RecursiveCharacterTextSplitter). Chaque fragment est enregistré dans la base comme une unité de connaissance indépendante, accompagnée de ses métadonnées (document d'origine, numéro de page, composant associé, etc.). Ce découpage est nécessaire pour le fonctionnement du RAG, qui a besoin de morceaux d'informations de petite taille (un pdf de plusieurs pages non chunké entrainerait plusieurs minutes pour l'exécution).

 À l'issue de l'import, un fichier knowledge.json est automatiquement mis à jour. Celui-ci constitue l'interface entre la base relationnelle et le système de RAG : il rassemble l'ensemble des connaissances disponibles sous un format exploitable pour la génération des embeddings et l'indexation vectorielle. Cette architecture permet de séparer clairement la couche de stockage de la couche de recherche sémantique, tout en simplifiant l'intégration avec le backend de l'application.

 Depuis l'interface frontend, il est également possible d'ajouter un troubleshooting. Il s'agit simplement de renseigner un problème rencontré, et la solution qu'on lui a trouvé. Cette information est directement ajoutée dans la base de données, et dans le fichier knowledge.json afin d'être exploitable par le RAG. Dans le futur, on peut imaginer qu'à l'issue d'une conversation, le chatbot puisse proposer la création automatique d'un troubleshooting pour enregistrer la solution trouvée pendant l'échange.

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

