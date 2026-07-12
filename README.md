# LKB AI Hub

LKB AI Hub is a knowledge management platform designed for the Kastler Brossel Laboratory.

The platform centralizes, structures and enriches laboratory knowledge through:

- Scientific publications
- Technical component documentation
- Experimental diagrams
- Incident reports
- AI-assisted knowledge retrieval

The application combines modern document management with a Retrieval-Augmented Generation (RAG) architecture powered by:

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
- Vector retrieval
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
│   ├── engine/
│   ├── indexing/
│   └── retrieval/
│
├── frontend/
│   ├── assets/
│   ├── pages/
│   └── templates/
│
├── documents/
│   ├── publications/
│   ├── components/
│   ├── diagrams/
│   └── incidents/
│
├── requirements.txt
└── package.json
```

---

# Running the Application

The application uses a single command to start both services:

- FastAPI Chatbot Service
- Express Backend

## Start the Application

From the project root:

```bash
npm run dev
```

Alternatively:

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

The Express backend automatically serves the frontend.

During startup, both services display their status directly in the terminal.

Example:

```text
[CHATBOT] ==================================
[CHATBOT] [INFO] LKB AI Hub Chatbot Started
[CHATBOT] [INFO] Chatbot running on port 8000
[CHATBOT] [INFO] API documentation available at http://localhost:8000/docs
[CHATBOT] ==================================

[BACKEND] ==================================
[BACKEND] [INFO] LKB AI Hub Backend Started
[BACKEND] [INFO] Server running on port 3000
[BACKEND] [INFO] Application available at http://localhost:3000
[BACKEND] ==================================
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

For diagrams, only user-visible PNG files are counted.

## Quick Question

Questions entered from the Home page automatically redirect users to the Chat page.

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
Embedding Generation
↓
Chroma Retrieval
↓
Context Construction
↓
Mistral
↓
Answer
```

Responses include:

- Generated answer
- Supporting source documents

The assistant can use information from:

- Publications
- Components
- Incident reports
- Diagram descriptions

stored inside the knowledge base.

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

Components can be freely positioned and moved inside the canvas.

## Connections

Each connection stores:

```text
Name
Color
Source Component
Target Component
```

Users can:

- Create connections
- Rename connections
- Delete connections
- Edit connection attributes

Updates are automatically reflected throughout the diagram.

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

The PNG representation is intended for visualization.

Only PNG files are displayed in the diagram library.

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

---

# File Conflict Management

The platform prevents accidental data loss caused by duplicate file names.

Whenever a conflict is detected, a dedicated modal is displayed.

---

## Publications & Components

File name conflicts are detected during both:

- Upload operations
- Rename operations

### Upload Conflict

```text
File Conflict
↓
Cancel
Rename
Overwrite
```

#### Cancel

Aborts the upload.

#### Rename

Uploads the document under an automatically generated temporary name and immediately opens the Rename workflow, allowing the user to choose a final name.

#### Overwrite

Replaces the existing document with the uploaded version.

### Rename Conflict

```text
File Conflict
↓
Cancel
Rename
```

Existing files cannot be overwritten through a rename operation.

---

## Diagrams

When saving an existing diagram:

```text
Save Diagram
↓
Name Already Exists
↓
Cancel
Rename
Overwrite
```

### Cancel

Aborts the save.

### Rename

Allows another diagram name to be specified.

### Overwrite

Replaces both:

```text
diagram-name.png
diagram-name.json
```

with the new version.

---

## Incidents

When saving an existing incident report:

```text
Save Incident
↓
Title Already Exists
↓
Cancel
Rename
Overwrite
```

### Cancel

Aborts the save.

### Rename

Allows another title to be specified.

### Overwrite

Replaces the existing PDF report.

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
```

These actions trigger:

```text
POST /sync
```

towards the chatbot service.

## Synchronization Not Required

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

Available endpoints:

```text
POST /ask
POST /sync
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
Question Processing
↓
Vector Retrieval
↓
Context Construction
↓
Mistral
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
Knowledge Base Update
↓
Chroma Refresh
```

---

# Benefits

- Centralized laboratory knowledge
- AI-assisted information retrieval
- Persistent vector database
- Automatic indexing
- Diagram management system
- Structured incident reporting
- Professional PDF generation
- Conflict-safe save and upload operations
- Unified document libraries
- Modular backend architecture
- Scalable RAG infrastructure
- Clean separation between frontend, backend and AI services