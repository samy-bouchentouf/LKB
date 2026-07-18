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
├── conversations/
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

## Controllers

### chat.controller.js

```text
Chat controller.

Handles chatbot requests and returns generated answers to the frontend.
```

### components.controller.js

```text
Components controller.

Handles component requests and returns component data to the frontend.
```

### diagrams.controller.js

```text
Diagrams controller.

Handles diagram requests and returns diagram data to the frontend.
```

### home.controller.js

```text
Home controller.

Handles home page requests and returns knowledge base statistics.
```

### incidents.controller.js

```text
Incidents controller.

Handles incident requests and returns incident data to the frontend.
```

### publications.controller.js

```text
Publications controller.

Handles publication requests and returns publication data to the frontend.
```

## Conversations

```text
Conversation storage.

Stores user conversations for
later access and continuation.
```

## Routes

### chat.routes.js

```text
Chat routes.

Defines API endpoints used to interact with the chatbot.
```

### components.routes.js

```text
Components routes.

Defines API endpoints used to manage technical documentation.
```

### diagrams.routes.js

```text
Diagrams routes.

Defines API endpoints used to manage experiment diagrams.
```

### home.routes.js

```text
Home routes.

Defines API endpoints used to retrieve home page information.
```

### incidents.routes.js

```text
Incidents routes.

Defines API endpoints used to manage incident reports.
```

### publications.routes.js

```text
Publications routes.

Defines API endpoints used to manage scientific publications.
```

## Services

### chat.service.js

```text
Chat service.

Communicates with the FastAPI chatbot service and retrieves generated answers.
```

### components.service.js

```text
Components service.

Handles component retrieval and filesystem operations.
```

### diagrams.service.js

```text
Diagrams service.

Handles diagram retrieval, persistence and filesystem operations.
```

### home.service.js

```text
Home service.

Computes knowledge base statistics displayed on the home page.
```

### incidents.service.js

```text
Incidents service.

Handles incident retrieval, persistence and filesystem operations.
```

### publications.service.js

```text
Publications service.

Handles publication retrieval and filesystem operations.
```

### sync.service.js

```text
Synchronization service.

Updates the chatbot knowledge base after document additions or deletions.
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

---

# Chatbot

```text
chatbot/
│
├── data/
│   ├── chroma_db/
│   └── chunks.json
│
├── engine/
│   ├── api.py
│   ├── llm.py
│   ├── prompt_builder.py
│   └── rag_api.py
│
├── indexing/
│   ├── chunker.py
│   ├── document_loader.py
│   ├── embedding.py
│   ├── hashing.py
│   └── indexer.py
│
├── memory/
│   ├── history.py
│   └── rewriter.py
│
├── models/
│   ├── chunk.py
│   └── search_result.py
│
└── retrieval/
    ├── hybrid_search.py
    ├── lexical_search.py
    ├── scorer.py
    └── vector_search.py
```

## Data

### chroma_db/

```text
Persistent Chroma vector database.

Stores document embeddings used for
semantic retrieval.
```

### chunks.json

```text
Chunk storage.

Stores indexed document chunks used
to build the BM25 lexical index.
```

## Engine

### api.py

```text
Chatbot API.

Exposes the chatbot functionality through
HTTP endpoints used by the web application.
```

### llm.py

```text
Language model interface.

Handles communication with the Mistral LLM
and generates answers from prompts built
using retrieved document context.
```

### prompt_builder.py

```text
Prompt construction module.

Builds the final prompt sent to the language model
by combining the user's question with the retrieved
document context.
```

### rag_api.py

```text
Main entry point of the chatbot.

Receives user questions,
retrieves relevant document chunks,
builds the final prompt,
queries the language model,
and returns the generated answer.
```

## Indexing

### chunker.py

```text
Document chunking module.

Splits raw text into smaller chunks that can
be embedded and stored in the vector database.
```

### document_loader.py

```text
Document loading module.

Extracts raw text from supported document formats:
PDF, DOCX, TXT and Markdown files.
```

### embedding.py

```text
Embedding generation module.

Transforms text chunks and user questions into
vector embeddings using Mistral Embeddings.
```

### hashing.py

```text
Document hashing module.

Generates a unique hash for a document based
on its content.
```

### indexer.py

```text
Document indexing pipeline.

Coordinates document loading, chunking,
embedding generation and storage of indexed
data used by the retrieval system.
```

## Memory

### history.py

```text
Conversation history module.

Extracts, formats and limits conversation
history used by the conversational
retrieval and response generation pipeline.
```

### rewriter.py

```text
Question rewriting module.

Rewrites user questions using conversation
history to resolve implicit references
before document retrieval.
```

## Models

### chunk.py

```text
Chunk data model.

Represents a document chunk and its
associated metadata.
```

### search_result.py

```text
Search result data model.

Represents a retrieved document chunk
and its retrieval scores.
```

## Retrieval

### hybrid_search.py

```text
Hybrid search module.

Combines semantic retrieval and lexical retrieval
to produce a unified ranked list of document chunks.
```

### lexical_search.py

```text
Lexical search module.

Retrieves the most relevant document chunks
using BM25 keyword-based search.
```

### scorer.py

```text
Retrieval scoring module.

Normalizes retrieval scores and computes
hybrid relevance scores.
```

### vector_search.py

```text
Vector search module.

Retrieves the most relevant document chunks
using semantic similarity search in Chroma.
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

## components/

```text
Technical documentation for laboratory hardware and equipment.
```

## diagrams/

```text
Experimental and technical diagrams used throughout the laboratory.
```

## incidents/

```text
Incident reports and generated incident documentation.
```

## publications/

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
│   ├── images/
│   │
│   └── js/
│       ├── chat.js
│       ├── diagrams.js
│       ├── documents.js
│       ├── home.js
│       ├── incidents.js
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

## Assets

### CSS

#### main.css

```text
Global stylesheet.

Defines the shared visual appearance of the LKB platform.
```

### Images

```text
Application images and visual assets.
```

### JavaScript

#### chat.js

```text
Chat module.

Handles user interactions with the LKB chatbot.
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

#### incidents.js

```text
Incident management module.

Handles incident report creation and library initialization.
```

#### main.js

```text
Frontend initialization module.

Loads and initializes the application.
```

#### navigation.js

```text
Navigation module.

Handles page loading and navigation throughout the application.
```

## Pages

### chat.html

```text
Chat page.

Provides the interface used to interact with the LKB documentation chatbot.
```

### components.html

```text
Components page.

Displays technical documentation and laboratory component information.
```

### diagrams.html

```text
Diagrams page.

Provides tools for creating and managing experiment diagrams.
```

### home.html

```text
Home page.

Provides an overview of the LKB platform and laboratory resources.
```

### incidents.html

```text
Incidents page.

Displays and manages troubleshooting reports and incident documentation.
```

### publications.html

```text
Publications page.

Displays and manages scientific publications stored in the knowledge base.
```

## index.html

```text
Frontend entry point.

Defines the global application layout and loads shared frontend resources.
```

---