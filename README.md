# LKB AI Hub

LKB AI Hub is a knowledge management platform designed for the Kastler Brossel Laboratory.

The platform centralizes, structures and enriches laboratory knowledge through:

- Scientific publications
- Technical component documentation
- Experimental diagrams
- Incident reports
- AI-assisted knowledge retrieval

The application combines modern document management with a conversational hybrid Retrieval-Augmented Generation (RAG) architecture powered by:

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
Conversation Memory

├── Question Rewriter
├── Conversation History
└── Prompt Construction

    ↓
Hybrid Retrieval Layer

├── Chroma Semantic Search
└── BM25 Lexical Search

    ↓
Mistral Large
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

and all user-facing knowledge management interfaces.

## Express Backend

Handles:

- File management
- REST API endpoints
- Document operations
- Diagram persistence
- Incident report generation
- Knowledge base synchronization requests
- Communication with the chatbot service
- Conversation persistence
- Conversation retrieval
- Static document serving

## FastAPI Chatbot

Handles:

- Conversation-aware question rewriting
- Conversation history management
- Document indexing
- Embedding generation
- Semantic retrieval
- Lexical retrieval
- Hybrid retrieval
- Context construction
- Question answering
- Knowledge base synchronization
- Source attribution generation

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
- Direct access to all platform modules

Displayed statistics include:

```text
Publications
Components
Diagrams
Incidents
```

For diagrams, only PNG visualization files are counted.

## Quick Question

Questions entered from the Home page are automatically transferred to the chat system.

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

Conversations are persistent and remain available across application restarts.

Each conversation is automatically created after the first successful user interaction and can later be reopened from the conversation sidebar.

## Conversation Features

```text
Persistent Conversations
Conversation History
Conversation Reopening
Automatic Conversation Creation
Conversation Continuation
Context-Aware Questions
Conversational RAG
```

## Conversational Retrieval Pipeline

The assistant supports context-aware follow-up questions.

Example:

```text
User:
What is the PDA50B2?

Assistant:
The PDA50B2 is a photodetector.

User:
What wavelength range does it support?
```

The system automatically rewrites the question into:

```text
What wavelength range does the PDA50B2 support?
```

before retrieval.

Questions are processed through:

```text
Question
↓
Extended Conversation History
↓
Question Rewriter
↓
Explicit Question
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
Recent Conversation History
        +
Retrieved Context
        +
Current Question
↓
Mistral Large
↓
Answer
```

Responses include:

- Generated answer
- Supporting source documents
- Clickable source references
- Markdown-rendered formatting
- Tables
- Lists
- Bold text
- Progressive response streaming
- One-click response copy

The assistant can use information extracted from:

- Publications
- Components
- Incidents
- Diagrams

## Conversation Memory

Two levels of conversation memory are used.

### Extended History

Used during question rewriting.

```text
Last 30 conversation exchanges
```

This allows the assistant to resolve references to previously discussed entities such as:

```text
it
this detector
that component
that incident
the previous issue
this diagram
```

### Recent History

Used when generating answers.

```text
Last 5 conversation exchanges
```

This keeps prompts compact while preserving conversational context.

## Chat Features

```text
Persistent Conversations
Conversation History
Conversational RAG
Question Rewriting
Markdown Rendering
Progressive Response Streaming
Source Attribution
Clickable Sources
Hybrid Retrieval
Copy Response
Loading Indicator
Responsive Conversation Layout
Quick Question Integration
```

## Source References

Every response includes the list of retrieved source documents used during context construction.

Each source exposes:

```text
Category
Document Name
Document URL
```

Sources can be opened directly from the chat interface.

### Publications

```text
Click Source
↓
Open PDF / Document
```

### Components

```text
Click Source
↓
Open Technical Documentation
```

### Incidents

```text
Click Source
↓
Open Incident Report
```

### Diagrams

Diagram retrieval uses the JSON representation for indexing while source links automatically open the corresponding PNG visualization.

```text
diagram-name.json
        ↓
Indexed

diagram-name.png
        ↓
Opened From Chat
```

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

Vector and BM25 scores are normalized independently before ranking.

```text
Vector Search
↓
Normalized Score

BM25 Search
↓
Normalized Score
```

Documents retrieved by only one retrieval engine receive a contribution from that engine only.

```text
Vector Only
↓
0.5 × Vector Score

BM25 Only
↓
0.5 × BM25 Score
```

Documents retrieved by both retrieval engines receive:

```text
Hybrid Score
=
0.5 × Vector Score
+
0.5 × BM25 Score
```

This hybrid strategy combines:

```text
Semantic Similarity
+
Keyword Matching
```

The 15 highest-ranked chunks are used to build the final context provided to the language model.

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
- Duplicate name conflict management

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
- Duplicate name conflict management

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
- Automatic PNG preview generation
- Automatic JSON generation
- Save conflict management
- Component-to-component visual linking

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

Connection labels are rendered directly on the diagram and stored inside the JSON representation.

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

The PNG representation is used for visualization and preview.

Only PNG files are exposed through the diagram library.

## Knowledge Base Integration

Diagrams are automatically indexed by the chatbot.

The JSON representation of each diagram is transformed into a searchable textual description containing:

- Diagram name
- Component list
- Connection list
- Diagram summary

Each diagram is indexed as a single chunk to preserve diagram structure.

Diagram JSON files are transformed into synthetic textual descriptions before indexing, allowing diagrams to be retrieved through natural language queries.

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
- Save conflict management

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

Incident retrieval supports:

- Incident title
- Problem description
- Root cause
- Corrective action
- Semantic similarity search
- Keyword search

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

Diagram name suggestions are automatically generated when conflicts occur.

## Incidents

### Save Conflict

```text
Cancel
Rename
Overwrite
```

Overwrite replaces the existing PDF report.

Incident name suggestions are automatically generated when conflicts occur.

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

Existing indexed content is skipped automatically through SHA256 hash comparison.

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
Load Conversation History
↓
POST /ask
↓
Extended History
↓
Question Rewriter
↓
Explicit Question
↓
Vector Search
        +
BM25 Search
↓
Hybrid Ranking
↓
Recent History
        +
Retrieved Context
        +
Current Question
↓
Mistral Large
↓
Response + Sources
```

## Source Resolution Flow

```text
Retrieved Chunk
↓
Source Metadata
↓
Source URL Generation

├── Publication
├── Component
├── Incident
└── Diagram

↓
Frontend Source Links
↓
Direct Document Access
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
- Persistent conversations
- Conversation continuation
- Conversation-aware retrieval
- Question rewriting
- Conversational RAG
- Hybrid semantic retrieval
- Hybrid lexical retrieval
- Hybrid ranking strategy
- AI-assisted information retrieval
- Progressive answer generation
- Markdown-rendered chatbot responses
- Clickable source references
- Direct access to supporting documents
- One-click response copy
- Automatic diagram indexing
- Automatic incident indexing
- Diagram-aware retrieval
- Incident-aware retrieval
- Persistent vector database
- Persistent BM25 retrieval store
- Incremental hash-based indexing
- Static document serving
- Diagram creation and management
- Structured incident reporting
- Professional PDF generation
- Conflict-safe save and upload operations
- Automatic conflict resolution workflows
- Unified document libraries
- Modular backend architecture
- Scalable conversational RAG infrastructure
- Clean separation between frontend, backend and AI services