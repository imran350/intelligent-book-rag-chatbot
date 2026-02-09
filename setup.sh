#!/bin/bash
# Quick Start Setup Script

echo "🚀 Intelligent Book RAG Chatbot - Quick Setup"
echo "=============================================="

# Check Python version
echo "✓ Checking Python installation..."
python3 --version

# Check Node.js version
echo "✓ Checking Node.js installation..."
node --version
npm --version

# Prompt for API keys
echo ""
echo "📝 Enter your API credentials:"
read -p "OpenAI API Key: " OPENAI_KEY
read -p "Qdrant URL (default: http://localhost:6333): " QDRANT_URL
QDRANT_URL=${QDRANT_URL:-http://localhost:6333}
read -p "Qdrant API Key: " QDRANT_KEY
read -p "Neon Database URL: " NEON_URL

# Setup Backend
echo ""
echo "🔧 Setting up Backend..."
cd backend || exit 1

# Create .env file
cat > .env << EOF
OPENAI_API_KEY=$OPENAI_KEY
NEON_DATABASE_URL=$NEON_URL
QDRANT_URL=$QDRANT_URL
QDRANT_API_KEY=$QDRANT_KEY
SECRET_KEY=change-this-in-production-$(date +%s)
ENVIRONMENT=development
DEBUG=True
EOF

echo "✓ .env file created"

# Create virtual environment
echo "✓ Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo "✓ Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Initialize database
echo "✓ Initializing database..."
python -c "from database import init_db; init_db()"

cd ..

# Setup Frontend
echo ""
echo "📚 Setting up Frontend..."
cd book || exit 1

echo "✓ Installing npm dependencies..."
npm install

# Create .env file for frontend
cat > .env.local << EOF
REACT_APP_API_URL=http://localhost:8000
REACT_APP_BACKEND_URL=http://localhost:8000
EOF

echo "✓ Frontend .env created"

cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📖 To start the development environment:"
echo ""
echo "# Terminal 1 - Backend:"
echo "  cd backend"
echo "  source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "  python -m uvicorn main:app --reload"
echo ""
echo "# Terminal 2 - Frontend:"
echo "  cd book"
echo "  npm start"
echo ""
echo "# The book will be available at:"
echo "  http://localhost:3000"
echo ""
echo "# API Documentation:"
echo "  http://localhost:8000/docs"
echo ""
echo "🎉 Happy learning!"
