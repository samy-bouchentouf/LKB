# LKB AI Hub Architecture

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

# Backend

```text
backend/
│
├── controllers/
│   ├── chat.controller.js
│   ├── components.controller.js
│   ├── diagrams.controller.js
│   ├── home.controller.js
│   ├── incidents.controller.js
│   └── publications.controller.js
│
├── routes/
│   ├── chat.routes.js
│   ├── components.routes.js
│   ├── diagrams.routes.js
│   ├── home.routes.js
│   ├── incidents.routes.js
│   └── publications.routes.js
│
├── services/
│   ├── chat.service.js
│   ├── components.service.js
│   ├── diagrams.service.js
│   ├── home.service.js
│   ├── incidents.service.js
│   ├── publications.service.js
│   └── sync.service.js
│
├── app.js
│
└── server.js
```

## app.js

```text
Express application configuration.

Registers middleware, routes and shared application settings.
```

## server.js

```text
Application entry point.

Starts the Express server and exposes the LKB API.
```

### Controllers

#### chat.controller.js

```text
Chat controller.

Handles chatbot requests and returns generated answers to the frontend.
```

#### components.controller.js

```text
[DOCSTRING]
```

#### diagrams.controller.js

```text
[DOCSTRING]
```

#### home.controller.js

```text
Home controller.

Handles home page requests and returns knowledge base statistics.
```

#### incidents.controller.js

```text
[DOCSTRING]
```

#### publications.controller.js

```text
Publications controller. 

Handles publication requests and returns publication data to the frontend.
```

### Routes

#### chat.routes.js

```text
Chat routes.

Defines API endpoints used to interact with the chatbot.
```

#### components.routes.js

```text
[DOCSTRING]
```

#### diagrams.routes.js

```text
[DOCSTRING]
```

#### home.routes.js

```text
Home routes.

Defines API endpoints used to retrieve home page information.
```

#### incidents.routes.js

```text
[DOCSTRING]
```

#### publications.routes.js

```text
Publications routes.

Defines API endpoints used to manage scientific publications.
```

### Services

#### chat.service.js

```text
Chat service.

Communicates with the FastAPI chatbot service and retrieves generated answers.
```

#### components.service.js

```text
[DOCSTRING]
```

#### diagrams.service.js

```text
[DOCSTRING]
```

#### home.service.js

```text
Home service.

Retrieves knowledge base statistics from the document repositories.
```

#### incidents.service.js

```text
[DOCSTRING]
```

#### publications.service.js

```text
Publications service.

Handles publication retrieval and filesystem operations.
```

#### sync.service.js

```text
Synchronization service.

Updates the chatbot knowledge base after document additions or deletions.
```

---

# Chatbot

```text
chatbot/
│
├── chroma_db/
│
├── engine/
│   ├── api.py
│   ├── llm.py
│   └── rag_api.py
│
├── indexing/
│   ├── chunker.py
│   ├── document_loader.py
│   ├── embedding.py
│   ├── hashing.py
│   └── indexer.py
│
└── retrieval/
    ├── prompt_builder.py
    └── retriever.py
```

## Engine

### api.py

```text
FastAPI application.

Exposes chatbot endpoints used by the Express backend.
```

### llm.py

```text
Language model interface.

Handles communication with the Mistral LLM and generates answers from prompts built using retrieved document context.
```

### rag_api.py

```text
Retrieval-Augmented Generation orchestration.

Coordinates document retrieval, prompt construction and response generation.
```

## Indexing

### chunker.py

```text
Document chunking utilities.

Splits documents into retrieval-friendly chunks for vector indexing.
```

### document_loader.py

```text
Document loading utilities.

Extracts text from supported document formats.
```

### embedding.py

```text
Embedding generation utilities.

Creates vector embeddings using Mistral embedding models.
```

### hashing.py

```text
Document hashing utilities.

Computes content hashes used to detect document additions, deletions and updates.
```

### indexer.py

```text
Document indexing pipeline.

Indexes documents into Chroma and synchronizes the vector database with the filesystem.
```

## Retrieval

### prompt_builder.py

```text
Prompt construction utilities.

Builds prompts from retrieved document context and user questions.
```

### retriever.py

```text
Document retrieval utilities.

Retrieves the most relevant chunks from Chroma for a given query.
```

---

# Documents

```text
documents/
│
├── components/
├── diagrams/
├── incidents/
└── publications/
```

### components/

```text
Technical documentation for laboratory hardware and equipment.
```

### diagrams/

```text
Experimental and technical diagrams used throughout the laboratory.
```

### incidents/

```text
Incident reports and generated incident documentation.
```

### publications/

```text
Scientific papers, publications and research articles.
```

---

# Frontend

```text
frontend/
│
├── assets/
│   │
│   ├── css/
│   │   └── main.css
│   │   
|   ├── images/  
│   │
│   └── js/
│       ├── chat.js
│       ├── diagrams.js
│       ├── documents.js
│       ├── home.js
│       ├── main.js
│       └── navigation.js
│
├── pages/
│   ├── chat.html
│   ├── components.html
│   ├── diagrams.html
│   ├── home.html
│   ├── incidents.html
│   └── publications.html
│
└── index.html
```

## index.html

```text
Main application shell.

Hosts the navigation menu and dynamically loaded page content.
```

### Pages

#### chat.html

```text
Chatbot user interface.
```

#### components.html

```text
Component management interface.
```

#### diagrams.html

```text
Diagram management and visualization interface.
```

#### home.html

```text
Application dashboard and quick access page.
```

#### incidents.html

```text
Incident report management interface.
```

#### publications.html

```text
Scientific publication management interface.
```

### JavaScript

#### chat.js

```text
Chat module.

Handles user interactions with the chatbot interface.
```

#### diagrams.js

```text
Diagram management module.

Handles diagram creation, editing and export operations.
```

#### documents.js

```text
Document management module.

Handles document listing, uploading and retrieval operations.
```

#### home.js

```text
Home module.

Handles home page interactions and dashboard statistics.
```

#### main.js

```text
Application bootstrap.

Initializes the frontend application.
```

#### navigation.js

```text
Navigation module.

Handles page loading and navigation throughout the application.
```

### Stylesheets

#### main.css

```text
Global application styles.
```

#### images

```text
Application images and visual assets.
```
