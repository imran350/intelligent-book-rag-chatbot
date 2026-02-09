# Quick Reference Guide

Handy commands and quick start instructions for the Intelligent Book RAG Chatbot project.

## 🚀 Quick Start (Pick One)

### Option 1: Automated Setup
```bash
# Clone repo
git clone https://github.com/your-username/book-rag-chatbot.git
cd book-rag-chatbot

# Run setup script
bash setup.sh
```

### Option 2: Docker
```bash
docker-compose up -d
# All services running on:
# - Frontend: http://localhost:3000 (via nginx)
# - Backend: http://localhost:8000
# - Postgres: localhost:5432
# - Qdrant: localhost:6333
```

### Option 3: Manual Setup
```bash
# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup (new terminal)
cd book
npm install
npm start

# Run backend (in first terminal)
cd backend
source venv/bin/activate
python -m uvicorn main:app --reload
```

---

## 📝 Common Commands

### Backend Commands

```bash
# Start development server
cd backend && python -m uvicorn main:app --reload

# Run tests
cd backend && pytest

# Initialize database
python -c "from database import init_db; init_db()"

# View API docs
# Open: http://localhost:8000/docs

# Create superuser (optional)
python manage.py createsuperuser
```

### Frontend Commands

```bash
# Development server
cd book && npm start

# Build for production
cd book && npm run build

# Preview production build
cd book && npm run serve

# Clear cache and rebuild
rm -rf build .docusaurus && npm install && npm run build

# Deploy to GitHub Pages
cd book && npm run deploy
```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart backend

# Build images
docker-compose build

# Run command in container
docker-compose exec backend python -c "from database import init_db; init_db()"
```

---

## 🔧 Configuration Quick Links

| Task | Command |
|------|---------|
| Create .env file | `cp backend/.env.example backend/.env` |
| Install backend deps | `pip install -r requirements.txt` |
| Install frontend deps | `npm install` |
| Init database | `python -c "from database import init_db; init_db()"` |
| Start backend | `python -m uvicorn main:app --reload` |
| Start frontend | `npm start` |
| Build frontend | `npm run build` |
| View API docs | `http://localhost:8000/docs` |
| View frontend | `http://localhost:3000` |

---

## 📚 Project Structure Quick Navigation

```
book-rag-chatbot/
├── backend/               # 🔧 FastAPI backend
│   ├── main.py           # Core endpoints
│   ├── auth.py           # Authentication
│   └── requirements.txt   # Dependencies
├── book/                  # 📚 Docusaurus book
│   ├── docs/             # Chapters
│   └── package.json      # Frontend deps
├── chatbot-ui/           # 💬 React components
│   ├── ChatBot.tsx       # Main component
│   └── AuthForm.tsx      # Auth form
└── .github/workflows/    # 🔄 GitHub Actions
```

---

## 🔑 Environment Variables

### Minimum Required
```env
OPENAI_API_KEY=sk-...
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=...
SECRET_KEY=your-secret-key
```

### All Variables
See [CONFIGURATION.md](CONFIGURATION.md) for complete reference.

---

## 📖 Documentation Map

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Project overview and features |
| [INTEGRATION.md](INTEGRATION.md) | How to integrate components |
| [CONFIGURATION.md](CONFIGURATION.md) | Detailed configuration guide |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Completion summary |
| `/backend/README.md` | Backend-specific docs |
| `/chatbot-ui/README.md` | UI components docs |

---

## 🧪 Testing Commands

### Frontend Testing
```bash
cd book

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# E2E testing (optional)
npx cypress open
```

### Backend Testing
```bash
cd backend

# Install test dependencies
pip install pytest pytest-asyncio

# Run tests
pytest

# Run specific test
pytest tests/test_auth.py

# With coverage
pytest --cov=.
```

### API Testing
```bash
# Health check
curl http://localhost:8000/api/health

# Chat endpoint
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'

# Signup
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "User",
    "password": "secure123",
    "background": {
      "softwareExperience": "beginner",
      "programmingLanguages": ["Python"]
    }
  }'
```

---

## 🐛 Troubleshooting Commands

```bash
# Check Python version
python --version  # Should be 3.8+

# Check Node version
node --version    # Should be 18+
npm --version

# Check if ports are in use
lsof -i :8000     # Backend
lsof -i :3000     # Frontend
lsof -i :5432     # Database
lsof -i :6333     # Qdrant

# Test database connection
psql postgresql://user:password@host/dbname

# Test Qdrant connection
curl http://localhost:6333/health

# Test OpenAI API
python -c "from openai import OpenAI; print('OK' if OpenAI().api_key else 'Missing API key')"

# View backend logs
tail -f /var/log/backend.log

# Clear cache
rm -rf backend/__pycache__ book/build .docusaurus
```

---

## 🚀 Deployment Commands

### GitHub Pages
```bash
cd book
npm run deploy
# or push to main branch - GitHub Actions handles it
```

### Docker Push
```bash
# Build image
docker build -t your-username/book-api:latest backend/

# Push to Docker Hub
docker push your-username/book-api:latest

# Or ECR
aws ecr get-login-password | docker login --username AWS --password-stdin account-id.dkr.ecr.region.amazonaws.com
docker tag book-api:latest account-id.dkr.ecr.region.amazonaws.com/book-api:latest
docker push account-id.dkr.ecr.region.amazonaws.com/book-api:latest
```

### Vercel
```bash
npm i -g vercel
cd backend
vercel
# Follow prompts to configure
```

### Railway
```bash
# Push code to GitHub
git push origin main

# Configure on Railway dashboard
# All environment variables in Settings → Variables
```

---

## 📊 API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Login
- `GET /api/auth/me` - Get profile
- `PUT /api/auth/preferences` - Update prefs
- `POST /api/auth/logout` - Logout

### Chat & RAG
- `POST /api/chat` - Chat with RAG
- `POST /api/add-content` - Add content

### Personalization
- `POST /api/personalize` - Save preferences
- `POST /api/personalize-chapter` - Get adapted chapter

### Translation
- `POST /api/translate` - Translate text
- `POST /api/translate-chapter` - Translate chapter
- `POST /api/get-glossary` - Get term translations

### Health
- `GET /api/health` - Health check

---

## 💾 Database Commands

### PostgreSQL
```bash
# Connect to database
psql postgresql://user:password@host/dbname

# Common SQL commands
\dt                  -- List tables
\d table_name        -- Show table structure
SELECT * FROM users; -- Query data

# Reset database
DROP DATABASE book_db;
CREATE DATABASE book_db;
```

### Qdrant
```bash
# Get collections
curl http://localhost:6333/collections

# Get collection info
curl http://localhost:6333/collections/book_content

# Clear collection
curl -X DELETE http://localhost:6333/collections/book_content
```

---

## 🔒 Security Commands

```bash
# Generate strong secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Hash password (for testing)
python -c "import bcrypt; print(bcrypt.hashpw(b'password', bcrypt.gensalt()).decode())"

# Check API key length
echo $OPENAI_API_KEY | wc -c

# Verify SSL certificate
openssl x509 -in cert.pem -text -noout
```

---

## 📈 Performance Commands

```bash
# Check backend startup time
time python -m uvicorn main:app --reload

# Load test
ab -n 1000 -c 10 http://localhost:8000/api/health

# Profile request
python -m cProfile -s cumtime manage.py runserver

# Check memory usage
top -p $(pgrep -f uvicorn)
```

---

## 🆘 Getting Help

```bash
# View API documentation
# Open browser to: http://localhost:8000/docs

# Check logs
docker-compose logs backend
tail -f backend_error.log

# Read documentation
cat README.md
cat INTEGRATION.md
cat CONFIGURATION.md

# Check status
docker-compose ps
ps aux | grep uvicorn
ps aux | grep npm
```

---

## ⚡ Pro Tips

1. **Use aliases**
   ```bash
   alias backend="cd /path/to/backend && source venv/bin/activate && uvicorn main:app --reload"
   alias frontend="cd /path/to/book && npm start"
   alias docker-dev="docker-compose up -d && docker-compose logs -f"
   ```

2. **Development setup**
   ```bash
   # Open split terminal and run:
   # Terminal 1: backend command
   # Terminal 2: frontend command
   # Terminal 3: docker-compose logs
   ```

3. **Quick test**
   ```bash
   # Make simple requests quickly
   alias health="curl -s http://localhost:8000/api/health | jq ."
   alias docs="open http://localhost:8000/docs"
   ```

---

## 📞 Support Resources

- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **GitHub Repo**: https://github.com/your-username/book-rag-chatbot
- **OpenAI**: https://platform.openai.com
- **Docusaurus**: https://docusaurus.io
- **FastAPI**: https://fastapi.tiangolo.com
- **React**: https://react.dev

---

## 🎓 Learning Resources

- [Python FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Docusaurus Docs](https://docusaurus.io/docs)
- [React Documentation](https://react.dev)
- [OpenAI API Guide](https://platform.openai.com/docs)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/)

---

**Happy developing! 🚀**

*Last updated: February 9, 2026*
