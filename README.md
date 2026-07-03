# LKB

Ce projet combine une interface utilisateur sur une app Web, un serveur backend et un pipeline de RAG. Elle permet aux chercheurs d'importer des publications, de documenter des fiches techniques de composants, et de déclarer des pannes et problèmes rencontrer pour alimenter la base de connaissances d'un Chatbot IA.

## Installation & Configuration

**Prérequis**
Installer :
* [Node.js](https://nodejs.org/) (v18 ou supérieur)
* [Python](https://www.python.org/) (v3.9 ou supérieur)
* [PostgreSQL](https://www.postgresql.org/) (v16 ou supérieur)
* Git


**Cloner le projet**
```bash
git clone git@github.com:samy-bouchentouf/LKB.git
cd LKB
```


**Installations nécessaires**
```bash
pip install -r requirements.txt
```

Installation des dépendances Node.js (pour le Backend)
Bien s'assurer d'être à la racine du projet 

``` bash
npm install

```

**Configurer PostgreSQL**

On peut utiliser pgAdmin4 pour paramétrer la base de donnée.

Créer une base PostgreSQL (par exemple `lab_knowledge`) puis renseigner les paramètres de connexion dans `backend/app/operators/database.py`

Format :

```python
DATABASE_URL = "postgresql://postgres:password@localhost/lab_knowledge"
```

Enfin, créer les tables de la base de données :

```bash
python backend/app/create_db.py
```
**Configuration des variables d'environnement**

Créer un fichier `.env` à la racine du projet :

```env
MISTRAL_API_KEY=votre_cle_api_mistral
```

## Lancer l'application

Le projet utilise deux serveurs distincts qui doivent être démarrés simultanément pour permettre au Chatbot IA de fonctionner correctement.

Créer un fichier `.env` à la racine du projet contenant :

MISTRAL_API_KEY=votre_cle_api_mistral

1. Lancer le serveur Node.js

Ouvrir un premier terminal à la racine du projet puis exécuter :

node backend/src/server.js

Le serveur démarre sur http://localhost:3000

2. Lancer le serveur RAG (FastAPI)

Ouvrir un second terminal à la racine du projet puis exécuter :

uvicorn backend.app.rag_api:app --reload --port 8000

Le serveur démarre sur http://localhost:8000

Une documentation de l'API est accessible à l'adresse :

http://localhost:8000/docs

3. Lancer l'application Web

Ouvrir le fichier frontend_site.html dans un navigateur.

Les deux serveurs doivent rester actifs simultanément pour permettre au Chatbot IA de répondre aux questions.

### Manuel Utilisateur

L'application est divisée en 5 onglets principaux accessibles depuis la barre de navigation latérale :

1. Accueil
    Utilisation : Point d'entrée de l'application. Cette page présente les principales fonctionnalités de la plateforme et permet d'accéder rapidement au Chatbot IA, aux Documents Techniques et au module de Troubleshooting.
    Résultat : L'utilisateur dispose d'une vue d'ensemble des outils disponibles au sein du laboratoire.

2. Chatbot IA
    Utilisation : Posez vos questions en langage naturel sur les manips ou l'historique du labo.
    Fonctionnement : L'IA va chercher en temps réel les réponses dans les PDF et rapports importés.

3. Onglet Publications
    Utilisation : Glissez-déposez (Drag & Drop) vos articles scientifiques ou thèses au format PDF.
    Résultat : Le fichier est instantanément sauvegardé sur le serveur et apparaît dans la liste "Ajoutés récemment".

4. Onglet Documents Tech
    Utilisation : Déposez la notice PDF officielle d'un appareil. Une fenêtre pop-up (Modale) s'ouvre pour vous demander de remplir les critères du composant (Nom (obligatoire), Constructeur, Référence, Numéro de série, Stock, Description). Le système convertit ces informations logistiques pour enrichir le PDF. L'IA saura ainsi vous dire à la fois comment aligner un laser et dans quelle armoire il est rangé. Il y a aussi une  partie pour faire son schéma d'experience et l'enregistrer. 

5. Onglet Troubleshooting (Pannes)
    Utilisation : Pour signaler un problème rencontré :
    Cliquez sur le ou les composants en panne (Boutons multi-sélection). Vous donnez un titre au problème, faites une description, et donnez une solution si celle-ci a été trouvé. 
    Résultat : L'IA a connaissance des problèmes rencontrés et solutions trouvées.