# Intelligent Book Project with RAG Chatbot

A comprehensive book creation and publishing project built with Docusaurus, featuring an integrated RAG chatbot, authentication, and personalization features.

## Project Overview

This is a full-stack project with three main components:
- **Book Frontend**: Docusaurus-based book with interactive UI
- **Backend API**: FastAPI with RAG capabilities, database integration
- **Chatbot UI**: Embedded chatbot component for book interaction

## Technologies Used

- **Frontend**: Docusaurus 3, React, TypeScript
- **Backend**: FastAPI, Python
- **Database**: Neon Serverless Postgres, Qdrant Vector Database
- **AI/ML**: OpenAI API, LangChain
- **Authentication**: better-auth
- **Deployment**: GitHub Pages

## Key Features

### Core Features (100 points)
1. Docusaurus-based book deployment
2. RAG chatbot with OpenAI API integration
3. FastAPI backend with Neon Postgres & Qdrant
4. Chatbot answer based on selected text

### Bonus Features
1. **Claude Code Subagents** (50 points) - Reusable intelligence components
2. **Better-Auth Integration** (50 points) - User authentication with background questionnaire
3. **Content Personalization** (50 points) - Dynamic content based on user profile
4. **Urdu Translation** (50 points) - Chapter translation capability

## Project Setup Checklist

- [x] Create project directory structure
- [ ] Set up Docusaurus book
- [ ] Create FastAPI backend
- [ ] Configure databases (Neon, Qdrant)
- [ ] Integrate RAG chatbot
- [ ] Implement authentication
- [ ] Add personalization features
- [ ] Add translation features
- [ ] Deploy to GitHub Pages

## Environment Variables

Create a `.env` file in the `backend` directory with:

```
OPENAI_API_KEY=your_key_here
NEON_DATABASE_URL=your_neon_url
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_key
```

## Running the Project

### Book Development
```bash
cd book
npm install
npm start
```

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Full Stack
Run both frontend and backend in separate terminals for full development experience.

## Deployment

The book is deployed to GitHub Pages using GitHub Actions.

## Documentation

See individual README.md files in each directory for detailed setup instructions.
