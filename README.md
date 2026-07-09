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

**Configurer PostgreSQL (facultatif)**

On peut utiliser pgAdmin4 pour paramétrer/regarder la base de donnée.

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

Créer un fichier `.env` à la racine du projet (dans LKB) :

```env
MISTRAL_API_KEY=votre_cle_api_mistral
```
ici la clé API est dans rag.ipynb (dans fichier run dans app)


## Lancer l'application

Le projet utilise deux serveurs distincts qui doivent être démarrés simultanément pour permettre au Chatbot IA de fonctionner correctement.

Créer un fichier `.env` à la racine du projet contenant :

MISTRAL_API_KEY=votre_cle_api_mistral

0. Pour lancer le projet sur une nouvelle machine, Construire la base vectorielle utilisée par le RAG.

Ouvrir le terminal, se placer au backend et taper:

python ingest.py

1. Lancer le serveur Node.js

Ouvrir un premier terminal à la racine du projet puis exécuter :

node backend/src/server.js

Le serveur démarre sur http://localhost:3000

2. Lancer le serveur RAG (FastAPI)

Ouvrir un second terminal à la racine du projet puis exécuter :

uvicorn backend.app.rag_api:app --reload --port 8000

Le serveur démarre sur http://localhost:8000


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

### Document Synchronization

The chatbot automatically updates its knowledge base when documents are managed through the web application. Any document uploaded or deleted via the website is immediately reflected in the Chroma vector database and becomes available to the chatbot without requiring a server restart.

However, manual modifications performed directly in the `documents/` directory are not detected in real time. If a document is added, modified, renamed, or deleted outside of the web application, the chatbot will only take these changes into account after the server is restarted. During startup, the `sync_documents()` routine synchronizes the contents of the `documents/` directory with the Chroma database by indexing new documents and removing obsolete ones.

**Summary:**
- Uploading or deleting documents through the web application: **no restart required**
- Immediate availability of new documents uploaded through the application
- Adding, modifying, renaming, or deleting files directly on disk: **server restart required**
- The Chroma database is automatically synchronized during server startup


# Functional Specification

## Overview

The LKB AI Hub is a web platform designed to centralize the laboratory knowledge base and provide researchers with a unified interface for:

- Querying documentation through an AI assistant
- Managing scientific publications
- Managing technical component documentation
- Creating and storing experimental diagrams
- Creating and storing troubleshooting reports

The chatbot relies on a Retrieval-Augmented Generation (RAG) pipeline connected to the laboratory document repository.

---

# Application Structure

The application is organized around six main pages:

```text
Home
Chat
Publications
Components
Diagrams
Incidents
```

Each page has a specific purpose and associated features.

---

# Home

## Purpose

Provide an overview of the platform and offer quick access to the AI assistant.

## Features

### Quick Question

The user can enter a question directly from the home page.

```text
Question
↓
Click "Ask"
↓
Redirect to Chat page
↓
Question automatically sent
↓
Assistant response displayed
```

### Knowledge Base Dashboard

Display the number of documents stored in each category.

Example:

```text
Publications : 154
Components   : 72
Diagrams     : 18
Incidents    : 41
```

Values must be calculated dynamically from:

```text
documents/publications/
documents/components/
documents/diagrams/
documents/incidents/
```

---

# Chat

## Purpose

Interact with the RAG assistant.

## Features

### Question Answering

Users can submit natural language questions regarding:

- Publications
- Technical documentation
- Experimental diagrams
- Incident reports

### Source Display

Each answer should display the documents used by the retrieval system.

Example:

```text
Sources:
- mplc_manual.pdf
- incident_qpd_2026.pdf
```

### Conversation History

Messages remain visible throughout the current session.

---

# Publications

## Purpose

Manage scientific publications and research documents.

## Storage Location

```text
documents/publications/
```

## Features

### Upload

Two upload methods must be supported.

#### Drag & Drop

```text
Drop file into upload zone
```

#### File Explorer

Clicking the upload area opens the operating system file explorer.

### Search

Search documents by filename.

### Document Actions

Each publication must support:

```text
Open
Download
Rename
Delete
```

#### Open

Open the document inside the browser.

#### Download

Download the document locally.

#### Rename

Rename the physical file on disk.

#### Delete

Delete the physical file from disk.

### Knowledge Base Synchronization

Execute:

```python
sync_documents()
```

after:

```text
Upload
Delete
```

Do not execute synchronization after:

```text
Rename
```

because the file content remains unchanged and therefore the hash remains unchanged.

---

# Components

## Purpose

Manage technical documentation and equipment manuals.

## Storage Location

```text
documents/components/
```

## Features

Identical to the Publications page:

```text
Upload
Search
Open
Download
Rename
Delete
```

### Knowledge Base Synchronization

Execute:

```python
sync_documents()
```

after:

```text
Upload
Delete
```

Do not execute synchronization after:

```text
Rename
```

---

# Diagrams

## Purpose

Create and manage experimental setup schematics.

## Storage Location

```text
documents/diagrams/
```

## Features

### Diagram Builder

Interactive editor allowing users to:

```text
Place components
Create connections
Design experiment layouts
```

Examples of components:

```text
PC
Laser
MPLC
QPD
Oscilloscope
```

### Diagram Storage

Saved diagrams must be exported as:

```text
PNG
```

and stored inside:

```text
documents/diagrams/
```

### Diagram Library

Users can:

```text
Search
Open
Download
Rename
Delete
```

existing diagrams.

### Knowledge Base Synchronization

No synchronization is required for diagrams because they are not intended to be indexed by the RAG system.

---

# Incidents

## Purpose

Create and maintain a laboratory troubleshooting knowledge base.

## Storage Location

```text
documents/incidents/
```

## Features

### Incident Report Builder

Each report contains:

```text
Affected Components

Incident Title

Problem Description

Root Cause

Corrective Action
```

### Report Generation

Reports must be exported as:

```text
PDF
```

and stored in:

```text
documents/incidents/
```

Example:

```text
signal-loss-qpd.pdf
```

### Incident Library

Users can:

```text
Search
Open
Download
Rename
Delete
```

existing incident reports.

### Knowledge Base Synchronization

Execute:

```python
sync_documents()
```

after:

```text
Create report
Delete report
```

Do not execute synchronization after:

```text
Rename
```

because the file content remains unchanged.

---

# Knowledge Base Synchronization Rules

The chatbot vector database must be updated only when document content is added or removed.

## Synchronization Required

```text
Upload Publication
Delete Publication

Upload Component
Delete Component

Create Incident Report
Delete Incident Report
```

Trigger:

```python
sync_documents()
```

---

## Synchronization Not Required

```text
Rename Publication
Rename Component
Rename Diagram
Rename Incident
```

because document content remains unchanged.

---

# Development Strategy

The project will be developed in the following order:

```text
1. Frontend architecture
2. Frontend mockup validation
3. Functional specification
4. API contract definition
5. Backend implementation
6. Frontend ↔ Backend integration
7. RAG integration
```

The frontend mockup is considered validated and serves as the reference specification for the backend implementation.