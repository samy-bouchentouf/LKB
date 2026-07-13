# LKB AI Hub

LKB AI Hub is a knowledge management platform designed for the Kastler Brossel Laboratory.

The platform centralizes, structures and enriches laboratory knowledge through:

- Scientific publications
- Technical component documentation
- Experimental diagrams
- Incident reports
- AI-assisted knowledge retrieval

The application combines modern document management with a hybrid Retrieval-Augmented Generation (RAG) architecture powered by:

- Chroma Vector Database
- BM25 Lexical Search
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
Hybrid Retrieval Layer
    ↓
ChromaDB + BM25 + Mistral
```

## Frontend

Provides:

```text
Home
Chat
Publications
Components
Diagrams
Incidents
```

and all user-facing document management tools.

## Express Backend

Handles:

- File management
- REST API endpoints
- Document operations
- Diagram persistence
- Incident report generation
- Knowledge base synchronization requests
- Communication with the chatbot service

## FastAPI Chatbot

Handles:

- Document indexing
- Embedding generation
- Semantic retrieval
- Lexical retrieval
- Hybrid retrieval
- Context construction
- Question answering
- Knowledge base synchronization

---

# Prerequisites

Install:

- Node.js v18 or higher
- Python v3.9 or higher
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
│
├── documents/
│   ├── components/
│   ├── diagrams/
│   ├── incidents/
│   └── publications/
│
├── frontend/
│
├── .env
├── package.json
├── requirements.txt
├── README.md
└── ARCHITECTURE.md
```

---

# Running the Application

The application uses a single command to start both services.

## Start the Application

```bash
npm run dev
```

or:

```bash
npm start
```

Both commands start:

```text
FastAPI Chatbot Service
http://localhost:8000

Express Backend
http://localhost:3000
```

The chatbot API documentation is available at:

```text
http://localhost:8000/docs
```

The web application is available at:

```text
http://localhost:3000
```

---

# Functional Overview

The platform is organized around six modules:

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

The Home page provides:

- Knowledge base statistics
- Quick Question entry point
- Direct access to all resources

Displayed statistics include:

```text
Publications
Components
Diagrams
Incidents
```

For diagrams, only PNG preview files are counted.

## Quick Question

```text
Home
↓
Quick Question
↓
Chat
↓
Generated Answer
```

---

# Chat

The Chat page exposes the AI assistant.

Questions are processed through:

```text
Question
↓
Mistral Embedding Generation
↓
Vector Search (Top 50)
        +
BM25 Search (Top 50)
↓
Candidate Union
↓
Hybrid Score Computation
↓
Top 15 Chunks
↓
Context Construction
↓
Mistral Large
↓
Answer
```

Responses include:

- Generated answer
- Supporting source documents

The assistant can use information extracted from:

- Publications
- Components
- Incidents
- Diagrams

---

# Hybrid Retrieval

The chatbot combines semantic and lexical retrieval.

## Semantic Retrieval

Uses:

```text
Mistral Embeddings
+
Chroma Vector Database
```

Effective for conceptual questions:

```text
What is quantum Fisher information?
```

## Lexical Retrieval

Uses:

```text
BM25
```

Effective for:

```text
Author names
Product references
Model numbers
Acronyms
Specific terminology
Incident titles
Diagram names
```

Examples:

```text
Karuseichyk
Koheras ADJUSTIK
PDA50B2
NIDAQ
Signal loss
Laser Lock System
```

## Hybrid Ranking

Both retrieval systems independently retrieve candidate chunks.

```text
Vector Search
↓
Top 50

BM25 Search
↓
Top 50
```

Candidate chunks are merged.

### Retrieval Scoring

Documents found by only one retrieval system receive half of the maximum possible score.

```text
Vector Only
↓
0.5 × Vector Score

BM25 Only
↓
0.5 × BM25 Score
```

Documents found by both retrieval systems receive:

```text
Hybrid Score
=
0.5 × Vector Score
+
0.5 × BM25 Score
```

Scores are normalized independently for vector retrieval and BM25 retrieval before hybrid scoring.

The 15 highest-ranked chunks are used to build the final context.

---

# Publications

Storage location:

```text
documents/publications/
```

## Features

- Drag & Drop upload
- File Explorer upload
- Search
- Sorting
- Open
- Download
- Rename
- Delete

## Supported Formats

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

## Features

- Drag & Drop upload
- File Explorer upload
- Search
- Sorting
- Open
- Download
- Rename
- Delete

## Supported Formats

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

Diagrams are created using a visual editor.

## Diagram Builder

Supports:

- Component creation
- Component editing
- Component deletion
- Drag & Drop positioning
- Component color customization
- Connection creation
- Connection editing
- Connection deletion
- Diagram reset
- Diagram export
- Diagram saving

## Components

Each component stores:

```text
Name
Color
Position
```

## Connections

Each connection stores:

```text
Name
Color
Source Component
Target Component
```

## Diagram Persistence

Saving a diagram generates:

```text
diagram-name.png
diagram-name.json
```

The JSON representation stores:

```text
Components
Connections
Positions
Colors
Names
```

The PNG representation is used for visualization.

Only PNG files are exposed through the diagram library.

## Knowledge Base Integration

Diagrams are automatically indexed by the chatbot.

The JSON representation of each diagram is transformed into a searchable textual description containing:

- Diagram name
- Component list
- Connection list
- Diagram summary

Example:

```text
Diagram name: Laser Lock System

Components:
- Laser
- Photodiode
- PID Controller

Connections:
- Connection "Feedback Loop" between Laser and Photodiode

Summary:
The diagram "Laser Lock System" contains 3 components.
Components present: Laser, Photodiode, PID Controller.
The diagram contains 1 connection.
```

Each diagram is indexed as a single chunk to preserve its structure during retrieval.

## Diagram Library

Features:

- Search
- Sorting
- Open
- Download
- Rename
- Delete

---

# Incidents

Storage location:

```text
documents/incidents/
```

Incident reports are generated as professional PDF documents.

## Features

- Incident report creation
- Automatic PDF generation
- Search
- Open
- Download
- Rename
- Delete

## Incident Report Structure

Each report contains:

```text
Title
Date
Problem Description
Root Cause
Corrective Action
```

Generated PDFs include:

- LKB branding
- Structured layout
- Automatic date generation
- Professional formatting
- Dynamic content sizing

## Knowledge Base Integration

Incident reports are automatically indexed and become searchable by the chatbot.

Users can ask questions such as:

```text
What was the root cause of the Signal loss incident?

How was the Signal loss incident resolved?

What incidents mention a lamp?
```

---

# File Conflict Management

The platform prevents accidental data loss caused by duplicate file names.

Whenever a conflict is detected, a dedicated modal is displayed.

## Publications & Components

Conflicts are detected during:

- Upload
- Rename

### Upload Conflict

```text
Cancel
Rename
Overwrite
```

### Rename Conflict

```text
Cancel
Rename
```

Overwriting through rename is not permitted.

## Diagrams

### Save Conflict

```text
Cancel
Rename
Overwrite
```

Overwrite replaces:

```text
diagram-name.png
diagram-name.json
```

## Incidents

### Save Conflict

```text
Cancel
Rename
Overwrite
```

Overwrite replaces the existing PDF report.

---

# Knowledge Base Synchronization

The chatbot uses two synchronized retrieval stores:

```text
Chroma Vector Database
+
chunks.json
```

where:

```text
Chroma
→ Semantic Retrieval

chunks.json
→ BM25 Retrieval
```

Synchronization is incremental and hash-based.

Every indexed document receives a SHA256 content hash.

```text
Document
↓
SHA256 Hash
↓
Comparison With Indexed Documents
↓
Add / Remove Operations
```

Only documents whose content is not already indexed are processed.

Whenever indexed content changes:

```text
chunks.json Updated
↓
BM25 Rebuilt
```

## Synchronization Triggers

The following actions automatically trigger synchronization:

```text
Upload Publication
Delete Publication

Upload Component
Delete Component

Save Diagram
Delete Diagram

Create Incident
Delete Incident
```

Synchronization is performed through:

```text
POST /sync
```

## No Synchronization Required

```text
Rename Publication
Rename Component
Rename Diagram
Rename Incident
```

because document content remains unchanged.

---

# Chatbot Architecture

The chatbot is implemented as an independent FastAPI service.

Endpoints:

```text
POST /ask
POST /sync
```

## Startup

At startup:

```text
FastAPI Start
↓
Load chunks.json
↓
Build BM25 Index
↓
Ready
```

## Question Answering Flow

```text
Frontend
↓
POST /api/chat
↓
Express Backend
↓
POST /ask
↓
Vector Search
        +
BM25 Search
↓
Hybrid Ranking
↓
Context Construction
↓
Mistral Large
↓
Response
```

## Synchronization Flow

```text
Document Modification
↓
Express Backend
↓
POST /sync
↓
SHA256 Comparison
↓
Index Update

├── Chroma
└── chunks.json

↓
BM25 Rebuild
```

---

# Benefits

- Centralized laboratory knowledge
- Hybrid semantic and lexical retrieval
- AI-assisted information retrieval
- Automatic diagram indexing
- Automatic incident indexing
- Persistent vector database
- Persistent BM25 index
- Incremental hash-based indexing
- Diagram management system
- Structured incident reporting
- Professional PDF generation
- Conflict-safe save and upload operations
- Unified document libraries
- Modular backend architecture
- Scalable RAG infrastructure
- Clean separation between frontend, backend and AI services