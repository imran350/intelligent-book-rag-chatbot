# Intelligent Book Project with RAG Chatbot

A comprehensive full-stack book creation and publishing project featuring an integrated RAG (Retrieval-Augmented Generation) chatbot, user authentication, content personalization, and Urdu translation capabilities.

## 🎯 Project Overview

This project combines multiple technologies to create an intelligent, interactive learning experience:

```
┌─────────────────────────────────────────────────────┐
│         Intelligent Book Platform                   │
├──────────────────┬──────────────────┬──────────────┤
│  Docusaurus      │  FastAPI         │  React UI    │
│  Book            │  Backend         │  Components  │
│  (GitHub Pages)  │  (RAG Chatbot)   │  (Auth)      │
└──────────────────┴──────────────────┴──────────────┘
         ↓              ↓                    ↓
    Publishers    OpenAI API + Qdrant + PostgreSQL
```

## 📦 Project Components

### 1. **Book Frontend** (`/book`)
- Built with Docusaurus 3 and React/TypeScript
- Deployed to GitHub Pages
- Features:
  - Responsive markdown-based book chapters
  - Embedded RAG chatbot interface
  - User authentication UI
  - Personalization controls
  - Translation toggles

### 2. **Backend API** (`/backend`)
- FastAPI Python backend
- RESTful APIs for:
  - Chat with RAG capabilities
  - User authentication & authorization
  - Content personalization
  - Document translation
  - Vector database management

### 3. **Chatbot UI** (`/chatbot-ui`)
- Reusable React components
- `ChatBot.tsx`: Main chat interface with RAG
- `AuthForm.tsx`: User signup/signin with background questionnaire
- `PersonalizationPanel.tsx`: Content adaptation interface
- Full TypeScript support

## 🚀 Core Features (100 points)

✅ **Docusaurus-based Book Deployment**
- Professional book format with GitHub Pages hosting
- SEO-friendly static site generation
- Interactive navigation and search

✅ **RAG Chatbot Integration**
- OpenAI API for embeddings and chat completions
- Qdrant vector database for semantic search
- Context-aware responses based on book content
- Support for selected text queries

✅ **FastAPI Backend**
- Neon PostgreSQL for user data
- Qdrant Cloud for vector embeddings
- RESTful API architecture
- CORS enabled for frontend integration

## 🎁 Bonus Features (Up to 200 bonus points)

### 1. **Claude Code Integration** (50 points)
- Spec-Kit Plus integration for intelligent development
- Reusable Claude Code Subagents for specific tasks
- Agent skills for specialized operations

### 2. **Better-Auth Integration** (50 points)
- User signup with background questionnaire
  - Software experience (beginner/intermediate/advanced)
  - Hardware knowledge
  - Programming languages
  - Areas of interest
- Secure authentication with JWT tokens
- User profile management

### 3. **Content Personalization** (50 points)
- Adaptive content difficulty based on user level
- Language-specific code examples
- Interest-based content filtering
- Personalized learning paths
- Difficulty hints for each section

### 4. **Urdu Translation** (50 points)
- Chapter-by-chapter translation to Urdu
- Technical term glossary
- Code preservation in translation
- Language-specific formatting

## 🛠 Technology Stack

### Frontend
- **Docusaurus 3**: Documentation framework
- **React 18**: UI library
- **TypeScript**: Type safety
- **Axios**: HTTP client
- **CSS3**: Styling with animations

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM for database
- **Pydantic**: Data validation
- **OpenAI API**: LLM integration
- **Qdrant**: Vector database
- **Neon**: Serverless PostgreSQL

### Authentication & Security
- **JWT**: Token-based authentication
- **bcrypt**: Password hashing
- **CORS**: Cross-origin resource sharing

### Deployment
- **GitHub Pages**: Book hosting
- **GitHub Actions**: CI/CD pipeline
- **Docker**: (Optional) containerization

## 📋 Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.8+
- Git
- GitHub account
- API keys (OpenAI, Qdrant)

### Step 1: Clone Repository

```bash
git clone https://github.com/your-username/book-rag-chatbot.git
cd book-rag-chatbot
```

### Step 2: Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your API keys
```

### Step 3: Frontend Setup

```bash
cd ../book
npm install
npm start  # Runs on http://localhost:3000
```

### Step 4: Start Backend Server

```bash
cd ../backend
python -m uvicorn main:app --reload
# Backend runs on http://localhost:8000
```

### Step 5: Configure GitHub Pages

1. Push your repository to GitHub
2. Go to Settings → Pages
3. Set source to "GitHub Actions"
4. The workflow will automatically build and deploy

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Create new user with background
- `POST /api/auth/signin` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/preferences` - Update preferences
- `POST /api/auth/logout` - Logout

### Chat & RAG Endpoints
- `POST /api/chat` - Send message, get RAG response
- `POST /api/add-content` - Add content to vector store

### Personalization & Translation
- `POST /api/personalize` - Save personalization preferences
- `POST /api/personalize-chapter` - Get personalized chapter
- `POST /api/translate` - Translate text
- `POST /api/translate-chapter` - Translate full chapter
- `POST /api/get-glossary` - Get technical term translations

### Health
- `GET /api/health` - Health check

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```
OPENAI_API_KEY=sk-...
NEON_DATABASE_URL=postgresql://...
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=...
SECRET_KEY=your-secret-key
```

**Frontend (optional)**
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_BACKEND_URL=http://localhost:8000
```

## 📂 Project Structure

```
book-rag-chatbot/
├── book/                    # Docusaurus book
│   ├── docs/               # Chapter content
│   ├── src/
│   │   ├── components/     # React components
│   │   └── css/            # Styling
│   ├── docusaurus.config.ts
│   └── package.json
├── backend/                 # FastAPI server
│   ├── main.py            # Main app
│   ├── auth.py            # Authentication
│   ├── database.py        # Database models
│   ├── personalizer.py    # Content personalization
│   ├── translator.py      # Translation service
│   ├── requirements.txt
│   └── .env.example
├── chatbot-ui/             # React components
│   ├── ChatBot.tsx        # Main chatbot
│   ├── AuthForm.tsx       # Auth form
│   ├── PersonalizationPanel.tsx
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Pages deployment
└── README.md              # This file
```

## 🔐 Security Considerations

1. **API Keys**: Never commit .env files to git
2. **Authentication**: JWT tokens with expiration
3. **CORS**: Configure allowed origins
4. **Database**: Use environment variables for connection strings
5. **Passwords**: Hashed with bcrypt

## 🚀 Deployment

### GitHub Pages (Automatic)
Push to main branch → GitHub Actions builds and deploys automatically

### Backend Deployment Options
- **Vercel**: Auto-deploy with serverless functions
- **Railway**: Simple git push deployment
- **AWS Lambda**: Serverless with API Gateway
- **Docker**: Container deployment with Docker Hub/ECR

## 📖 Usage Examples

### Using the Chatbot
```typescript
import ChatBot from './ChatBot';

<ChatBot 
  apiUrl="http://localhost:8000"
  userId={userId}
  onPersonalize={handlePersonalize}
/>
```

### Personalizing Content
```python
from personalizer import ContentPersonalizer

personalizer = ContentPersonalizer()
personalized = personalizer.personalize_content(
    content="Chapter content...",
    background={
        "softwareExperience": "intermediate",
        "programmingLanguages": ["Python", "JavaScript"]
    }
)
```

### Translating to Urdu
```python
from translator import ContentTranslator

translator = ContentTranslator()
translation = translator.translate_text(
    "Hello World",
    target_language="urdu"
)
```

## 🐛 Troubleshooting

### Backend won't start
- Check Python version (3.8+)
- Verify dependencies: `pip install -r requirements.txt`
- Check .env file for required keys

### Docusaurus build fails
- Clear cache: `rm -rf book/.docusaurus build`
- reinstall deps: `cd book && npm install && npm run clean`

### Chatbot not responding
- Verify backend is running
- Check OPENAI_API_KEY is set
- Ensure Qdrant vector database is accessible

## 📚 Learning Resources

- [Docusaurus Documentation](https://docusaurus.io)
- [FastAPI Guide](https://fastapi.tiangolo.com)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Qdrant Documentation](https://qdrant.tech/documentation)
- [React Documentation](https://react.dev)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🎓 Credits

Built with:
- OpenAI GPT-3.5 & Embeddings
- Docusaurus by Meta
- FastAPI by Sebastián Ramírez
- Qdrant Vector Database
- Neon Serverless Postgres

## 📞 Support

For issues, questions, or suggestions:
1. Open an issue on GitHub
2. Check existing documentation
3. Review the API docs at `/api/docs`

---

**Happy learning! 📚**
