# Projet numéro 24 : Assistant IA & RAG pour le LKB

Ce document présente la démarche, les choix techniques et l'organisation mis en œuvre pour développer l'assistant de recherche scientifique du Laboratoire Kastler Brossel (LKB).



## 1. Le projet
Un des principaux problèmes dans les laboratoires de recherche est la transmission des savoirs entre les générations successives de chercheurs. Il est fréquent que des problèmes se répètent et que les chercheurs perdent du temps à retrouver une solution. Le laboratoire LKB nous donc a proposé de travailler sur un projet d'application Web rassemblant les connaissances scientifiques de leurs chercheurs, des articles de recherche, des notices techniques de composants utilisés pour les expériences du laboratoire, et un historique des problèmes rencontrés dans le passé ainsi que leur solution. L'objectif est de mettre a disposition sur cette application Web un chatbot entraîné sur cette base de connaissances. 

## 2. Choix Techniques
Nous avons choisi une répartition assez classique avec un backend et un frontend communiquants. 

Dans le frontend, nous avons codé l'interface en html dans le fichier `test.html`.


 ### Backend

Le backend de l'application a été développé avec Node.js et Express.js. Son rôle est d'assurer la communication entre l'interface utilisateur et les différents services de traitement. Il expose plusieurs routes API permettant :

l'envoi des questions du chatbot ;
l'upload des documents techniques ;
l'upload des publications scientifiques ;
l'enregistrement des rapports de panne ;
la consultation des documents déjà présents dans la base de connaissances.

Le backend agit également comme intermédiaire entre le frontend et le système RAG. Dans la première version du projet, il lançait directement un script Python via exec() afin d'effectuer la recherche documentaire et la génération de réponse. Dans la version finale, cette architecture a été remplacée par un serveur FastAPI dédié afin de conserver en mémoire le moteur RAG, évitant ainsi de recharger l'ensemble des modèles et de la base vectorielle à chaque question.


 ### Frontend - Backend

 Les échanges entre le frontend et le backend sont réalisés à l'aide de requêtes HTTP utilisant l'API fetch() du navigateur. Les données sont transmises sous forme JSON pour les questions utilisateur et sous forme FormData pour les fichiers déposés dans l'application.
Cette architecture permet de séparer clairement la couche d'interface utilisateur de la logique métier et facilite les évolutions futures du projet.


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
- **Frontend drag and drop** Réussir à enregistrer les documents qu’on importe avec le drag and drop au bon endroit. En effet, tout (que ça soit sur publications ou tech) s’enregistrer au même endroit et on ne les voyait pas au début. Nous avons donc séparer les directions et les endroits où ca s’enregistrait et nous les avons fait visible sur la page. 
- **Format des fichiers**Au début le serveur backend n’acceptait à l’origine que les formats académiques stricts (PDF). Cela posait problème quand nous voulions enregistrer les schémas créés, le server les rejetait. Pour ne pas perdre de temps à réécrire tout le code du serveur. Dès qu'un utilisateur crée un schéma ou remplit un rapport, le code convertit automatiquement ces informations en pdf.
- **Pull et Push** Nous avons aussi rencontré beaucoup de problèmes avec les pull and push. Comme nous ne travaillons tous sur une partie nous étions souvent plusieurs sur Main ce qui posait problèmes.
- **Faire le lien entre tout** Nous avons aussi du tout relier. En effet, nous avions séparé le frontend du backend du RAG or a la fin tout doit être relié. Cela a pris un peu de temps pour mettre les bonnes directions et que tout fonctionne. 


## 5. Pistes d'améliorations 

Avec un délai supplémentaire, nous aurions exploré les axes d'amélioration suivants :

- **Modèle hybride de RAG et base de données plus légère:** Nous aurions souhaité trouver une alternative aux deux RAG nous permettant d'avoir la main sur les paramètres de calcul et les méthodes d'embedding tout en gardant l'efficacité des fonctions Python. Nous aurions également cherché à remplacer le fichier local `knowledge_vect.json` par une instance de *ChromaDB* ou *Pinecone* pour permettre le passage à l'échelle sur des milliers de publications.

- **Réaliser les Troubleshoots:**  un historique des tous les problèmes rencontrés dans le passé, et de leur résolution. On peut imaginer pouvoir « signaler un nouveau problème » via le chatbot.

- **Amélioration Backend:** Une amélioration importante consisterait à mettre en place un système d'authentification et de gestion des utilisateurs. Actuellement, toute personne ayant accès à l'application peut consulter et ajouter des documents. À terme, il serait intéressant de créer différents niveaux d'autorisation (chercheur, doctorant, administrateur, etc.) afin de mieux contrôler l'accès aux ressources du laboratoire. Cette évolution permettrait également de conserver un historique des contributions de chaque utilisateur, de renforcer la sécurité des données et de faciliter la traçabilité des modifications apportées à la base de connaissances.
- **Frontend publications scientifiques et thèses** pour l’instant nous avons uniquement un drag and drop pour les déposer. Or nous aurions aimé pouvoir le connecter à Zootero. C’est à dire une fois sur l’onglet Publications nous aurions un bouton Zootero qui nous y donnerait accès et nous pourrions sélectionner et télécharger direct depuis ce site pour que l’IA apprenne. 
- **Frontend schémas:**, peut-être faire un bouton pour ajouter des composants et des liens. Aussi une fois fait, qu’on puisse déplacer les composants et en supprimer que certain plutôt que de tout réinitialiser. Et rendre l’IA capable d’en faire. De plus, si on rechante un schéma avec le même nom, pouvoir créer une "V2, V3" pour que l'IA connaisse l'historique des modifications du banc optique.
- **Frontend troubleshooting:** lorsque l'utilisateur commence à taper le nom d'une panne, l'IA suggère des pannes similaires déjà résolues par le passé pour faire gagner du temps.