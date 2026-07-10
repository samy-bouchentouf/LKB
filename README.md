# LKB AI Hub

LKB AI Hub is a knowledge management platform designed for the Kastler Brossel Laboratory.

The application centralizes and structures laboratory knowledge through:

- Scientific publications
- Technical component documentation
- Experimental diagrams
- Incident reports
- AI-assisted knowledge retrieval

The platform relies on a Retrieval-Augmented Generation (RAG) pipeline powered by:

- Chroma Vector Database
- Mistral Embeddings
- Mistral Large Language Models

---

# Architecture

The application is composed of three layers:

```text
Frontend
    ↓
Node.js / Express
    ↓
FastAPI Chatbot Service
    ↓
ChromaDB + Mistral
```

## Frontend

Provides the user interface and document management tools.

```text
Home
Chat
Publications
Components
Diagrams
Incidents
```

## Express Backend

Handles:

- File management
- REST API endpoints
- Document operations
- Communication with the chatbot service

## FastAPI Chatbot

Handles:

- Document indexing
- Vector retrieval
- Prompt generation
- Question answering
- Knowledge base synchronization

---

# Prerequisites

Install:

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- Git

---

# Installation

## Clone the repository

```bash
git clone git@github.com:samy-bouchentouf/LKB.git

cd LKB
```

## Install Python dependencies

```bash
pip install -r requirements.txt
```

## Install Node.js dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file at the project root:

```env
MISTRAL_API_KEY=your_mistral_api_key
```

---

# Project Structure

```text
LKB/
│
├── backend/
│
├── chatbot/
│   │
│   ├── engine/
│   ├── indexing/
│   └── retrieval/
│
├── frontend/
│
├── documents/
│   ├── publications/
│   ├── components/
│   ├── diagrams/
│   └── incidents/
│
└── requirements.txt
```

---

# Running the Application

The system uses two servers.

## 1. Start the Chatbot Service

From the project root:

```bash
uvicorn chatbot.engine.api:app --reload --port 8000
```

FastAPI will start on:

```text
http://localhost:8000
```

Interactive API documentation:

```text
http://localhost:8000/docs
```

---

## 2. Start the Express Backend

From the project root:

```bash
node backend/server.js
```

The backend will start on:

```text
http://localhost:3000
```

---

## 3. Open the Application

Open:

```text
http://localhost:3000
```

The Express server automatically serves the frontend.

---

# Functional Overview

The application is organized around six pages:

```text
Home
Chat
Publications
Components
Diagrams
Incidents
```

---

# Home

Provides:

- Knowledge base statistics
- Quick Question entry point
- Direct access to laboratory resources

Displays:

```text
Publications
Components
Diagrams
Incidents
```

counts based on the contents of the `documents/` folders.

## Quick Question

Questions asked from the Home page are automatically forwarded to the Chat page.

```text
Home
↓
Quick Question
↓
Chat
↓
Answer
```

---

# Chat

Allows users to interact with the laboratory AI assistant.

Questions are processed through:

```text
Question
↓
Embedding Generation
↓
Chroma Retrieval
↓
Prompt Construction
↓
Mistral
↓
Answer
```

The assistant displays:

- Generated answer
- Source documents

The chatbot can answer questions using:

- Publications
- Components
- Incident reports
- Diagram descriptions

stored in the knowledge base.

---

# Publications

Storage location:

```text
documents/publications/
```

Features:

- Drag & Drop upload
- File Explorer upload
- Search
- Sorting
- Download
- Rename
- Delete

Supported formats:

```text
PDF
DOCX
TXT
Markdown
```

---

# Components

Storage location:

```text
documents/components/
```

Features:

- Drag & Drop upload
- File Explorer upload
- Search
- Sorting
- Download
- Rename
- Delete

Supported formats:

```text
PDF
DOCX
TXT
Markdown
```

---

# Diagrams

Storage location:

```text
documents/diagrams/
```

Features:

- Diagram creation
- Diagram editing
- Diagram search
- PNG export
- Download
- Rename
- Delete

Diagrams are stored as structured documents and can be referenced by the chatbot.

---

# Incidents

Storage location:

```text
documents/incidents/
```

Features:

- Incident report creation
- Incident report editing
- PDF export
- Search
- Download
- Rename
- Delete

Incident reports become searchable by the chatbot after synchronization.

---

# Knowledge Base Synchronization

The chatbot uses a persistent Chroma database.

Documents are indexed only when the knowledge base changes.

## Synchronization Required

```text
Upload Publication
Delete Publication

Upload Component
Delete Component

Create Incident Report
Delete Incident Report

Create Diagram
Delete Diagram
```

These actions trigger:

```python
sync_documents()
```

through:

```text
POST /sync
```

on the FastAPI chatbot service.

## Synchronization Not Required

```text
Rename Publication
Rename Component
Rename Diagram
Rename Incident
```

because document hashes are based on file content rather than file names.

---

# Chatbot Architecture

The chatbot is implemented as an independent FastAPI service.

It exposes two endpoints:

```text
POST /ask
POST /sync
```

## Question Answering

```text
Frontend
↓
POST /api/chat
↓
Express
↓
POST /ask
↓
ask_question()
↓
Retrieve Context
↓
Generate Answer
↓
Response
```

## Knowledge Base Synchronization

```text
Document Modification
↓
Express
↓
POST /sync
↓
sync_documents()
↓
Chroma Update
```

## Benefits

- Persistent Python process
- Reused Chroma connection
- Reused Mistral client
- Faster response times
- Automatic knowledge base updates
- Cleaner separation of concerns
- Modular architecture
- Scalable design