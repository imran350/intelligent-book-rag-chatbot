# Backend API

FastAPI-based backend for the Book RAG Chatbot system.

## Features

- RAG (Retrieval-Augmented Generation) chatbot powered by OpenAI
- Vector database integration with Qdrant
- PostgreSQL database with Neon
- User authentication and personalization
- Content translation support
- Chat history management

## Setup

### 1. Install Dependencies

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `OPENAI_API_KEY`: Your OpenAI API key
- `QDRANT_URL`: Your Qdrant instance URL
- `QDRANT_API_KEY`: Your Qdrant API key
- `DATABASE_URL`: Your Neon PostgreSQL URL

### 3. Initialize Database

```bash
python -c "from database import init_db; init_db()"
```

### 4. Run Development Server

```bash
uvicorn main:app --reload
```

Server will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

## API Endpoints

### Chat
- `POST /api/chat` - Send message and get RAG response
- `POST /api/add-content` - Add content chunks to vector store

### Personalization
- `POST /api/personalize` - Save user preferences
- `POST /api/translate` - Translate content to target language

### Health
- `GET /api/health` - Health check endpoint

## Architecture

- **OpenAI API**: For embeddings and chat completions
- **Qdrant**: Vector database for semantic search
- **Neon**: PostgreSQL for user data and chat history
- **SQLAlchemy**: ORM for database operations

## Deployment

For production, use:

```bash
gunicorn main:app -w 4 -b 0.0.0.0:8000
```

Or with Docker:

```bash
docker build -t book-api .
docker run -p 8000:8000 --env-file .env book-api
```
