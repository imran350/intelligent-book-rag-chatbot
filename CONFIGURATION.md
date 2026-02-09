# Configuration Guide

Complete guide to configuring your Intelligent Book RAG Chatbot project.

## Table of Contents

1. [Backend Configuration](#backend-configuration)
2. [Frontend Configuration](#frontend-configuration)
3. [Database Configuration](#database-configuration)
4. [API Keys Setup](#api-keys-setup)
5. [Deployment Configuration](#deployment-configuration)
6. [Environment Variables Reference](#environment-variables-reference)

---

## Backend Configuration

### .env File Setup

Create `.env` file in the `/backend` directory:

```bash
cd backend
cp .env.example .env
# Edit .env with your values
```

### Required Environment Variables

```env
# OpenAI API
OPENAI_API_KEY=sk-your-key-here

# Database
NEON_DATABASE_URL=postgresql://user:password@host/dbname
DATABASE_URL=postgresql://user:password@host/dbname

# Vector Database
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your-api-key

# Security
SECRET_KEY=your-secret-key-change-in-production

# Environment
ENVIRONMENT=development
DEBUG=True
```

### Dependencies Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Database Initialization

```bash
# Initialize database tables
python -c "from database import init_db; init_db()"
```

---

## Frontend Configuration

### Environment Setup

Create `.env.local` in `/book` directory:

```bash
cd book
cat > .env.local << EOF
REACT_APP_API_URL=http://localhost:8000
REACT_APP_BACKEND_URL=http://localhost:8000
EOF
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm start
# Opens at http://localhost:3000
```

### Build for Production

```bash
npm run build
# Output in ./build directory
```

---

## Database Configuration

### Neon PostgreSQL Setup

1. **Create Neon Account**
   - Visit https://neon.tech
   - Sign up for free account
   - Create a new project

2. **Get Connection String**
   - Copy the connection string from Neon dashboard
   - Format: `postgresql://user:password@host/dbname`

3. **Add to Backend .env**
   ```env
   NEON_DATABASE_URL=your-connection-string
   DATABASE_URL=your-connection-string
   ```

### Qdrant Vector Database Setup

#### Option 1: Cloud
1. Visit https://qdrant.cloud
2. Create a free cluster
3. Get API key
4. Configure in .env:
   ```env
   QDRANT_URL=https://your-cluster.qdrant.io
   QDRANT_API_KEY=your-api-key
   ```

#### Option 2: Local
```bash
# Using Docker
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant

# Configure in .env
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=
```

---

## API Keys Setup

### OpenAI API Key

1. **Create Account**
   - Visit https://platform.openai.com
   - Sign up or log in
   - Go to API keys section

2. **Create API Key**
   - Click "Create new secret key"
   - Copy the key (you won't see it again)
   - Store securely in .env

3. **Configure Billing**
   - Add payment method
   - Set usage limits (recommended)

4. **Test the Key**
   ```bash
   cd backend
   python -c "from openai import OpenAI; print(OpenAI().api_key)"
   ```

### Other API Keys

- **Neon**: Get from dashboard
- **Qdrant**: Generate in cluster settings
- **JWT Secret**: Generate any strong random string

---

## Deployment Configuration

### GitHub Pages (Book)

1. **Update docusaurus.config.ts**
   ```typescript
   const config: Config = {
     url: 'https://your-username.github.io',
     baseUrl: '/book-rag-chatbot/',
     organizationName: 'your-username',
     projectName: 'book-rag-chatbot',
   };
   ```

2. **Create Repository**
   - Create GitHub repo: `book-rag-chatbot`
   - Push code
   - Enable GitHub Pages in Settings

3. **GitHub Actions**
   - Workflow runs automatically on push
   - Builds and deploys to gh-pages branch
   - Available at: `https://your-username.github.io/book-rag-chatbot/`

### Backend Deployment Options

#### Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd backend
   vercel
   ```

3. **Set Environment Variables**
   - Go to Vercel dashboard
   - Add all .env variables in Settings → Environment Variables

#### Railway

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect on Railway**
   - Visit railway.app
   - Create new project
   - Select GitHub repo

3. **Add Environment Variables**
   - Railway dashboard → Variables
   - Add all .env variables

#### Docker

1. **Build Image**
   ```bash
   cd backend
   docker build -t book-api .
   ```

2. **Run Container**
   ```bash
   docker run -p 8000:8000 \
     -e OPENAI_API_KEY=sk-... \
     -e QDRANT_URL=http://localhost:6333 \
     book-api
   ```

3. **Push to Registry**
   - Docker Hub: `docker push username/book-api`
   - ECR: AWS Elastic Container Registry

#### AWS Lambda

1. **Install Serverless Framework**
   ```bash
   npm install -g serverless
   ```

2. **Deploy**
   ```bash
   serverless deploy
   ```

3. **Configure API Gateway**
   - Set up REST API endpoints
   - Enable CORS
   - Set authorization

---

## Environment Variables Reference

### Complete Variable List

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `OPENAI_API_KEY` | ✅ YES | - | OpenAI API authentication |
| `NEON_DATABASE_URL` | ✅ YES | - | PostgreSQL connection |
| `QDRANT_URL` | ✅ YES | http://localhost:6333 | Vector DB endpoint |
| `QDRANT_API_KEY` | ✅ YES | - | Vector DB authentication |
| `SECRET_KEY` | ✅ YES | - | JWT signing secret |
| `ENVIRONMENT` | No | development | App environment |
| `DEBUG` | No | True | Debug mode |
| `BACKEND_URL` | No | http://localhost:8000 | API base URL |
| `FRONTEND_URL` | No | http://localhost:3000 | Frontend URL for CORS |

---

## CORS Configuration

### Backend CORS Setup

In `main.py`, CORS is configured for all origins:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Production CORS

For production, restrict to specific domains:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-username.github.io",
        "https://your-api-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

---

## SSL/HTTPS Configuration

### Backend HTTPS

```bash
# Using Uvicorn with SSL
uvicorn main:app \
  --ssl-keyfile=/path/to/key.pem \
  --ssl-certfile=/path/to/cert.pem
```

### Using Nginx Reverse Proxy

```nginx
server {
    listen 443 ssl;
    server_name api.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Performance Configuration

### Database Optimization

```python
# Connection pooling
from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool

engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,  # For serverless
)
```

### Caching

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_embedding(text: str):
    # Cached embeddings
    pass
```

### Rate Limiting

```bash
pip install slowapi
```

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/api/chat")
@limiter.limit("10/minute")
async def chat(request: ChatRequest):
    pass
```

---

## Monitoring & Logging

### Application Logging

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

logger.info("Application started")
logger.error("Error message", exc_info=True)
```

### Health Checks

All services have health check endpoints:

```bash
# Backend
curl http://localhost:8000/api/health

# Expected response
{"status": "ok", "timestamp": "2026-02-09T..."}
```

---

## Troubleshooting Configuration

### Common Issues

1. **Module not found errors**
   ```bash
   pip install -r requirements.txt
   ```

2. **Database connection failed**
   - Verify connection string format
   - Check network connectivity
   - Test credentials

3. **OpenAI API errors**
   - Verify API key is correct
   - Check account has credits
   - Check rate limits

4. **CORS errors in browser**
   - Verify CORS config in main.py
   - Check frontend URL is allowed
   - Test with curl first

5. **Qdrant connection issues**
   - Verify Qdrant is running
   - Check URL and API key
   - Test with curl: `curl http://localhost:6333/health`

---

## Security Checklist

- [ ] Change SECRET_KEY before production
- [ ] Use environment variables, not hardcoded values
- [ ] Enable HTTPS/SSL
- [ ] Restrict CORS to specific domains
- [ ] Enable rate limiting
- [ ] Use strong passwords
- [ ] Keep dependencies updated
- [ ] Enable database password authentication
- [ ] Use API key rotation
- [ ] Monitor access logs
- [ ] Set up backups
- [ ] Enable database encryption

---

## Docker Configuration

### Docker Compose

```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
```

### Environment File for Docker

Create `.env` in project root:

```env
OPENAI_API_KEY=sk-...
NEON_DATABASE_URL=postgresql://...
QDRANT_URL=qdrant
QDRANT_API_KEY=...
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
POSTGRES_DB=book_db
```

---

## Getting Help

1. **Check logs**
   ```bash
   docker-compose logs backend
   ```

2. **API documentation**
   - http://localhost:8000/docs (Swagger)
   - http://localhost:8000/redoc (ReDoc)

3. **Test API**
   ```bash
   curl -X POST http://localhost:8000/api/health
   ```

4. **Review configuration**
   - Check .env file
   - Review docusaurus.config.ts
   - Check package.json versions

---

For more information, see:
- [README.md](README.md)
- [INTEGRATION.md](INTEGRATION.md)
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
