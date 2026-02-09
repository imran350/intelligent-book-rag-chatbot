from sqlalchemy import create_engine, Column, String, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
# For Neon Postgres (Production): postgresql://user:password@host/dbname
# For SQLite (Development): sqlite:///./test.db
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    pool_pre_ping=True  # Check connection health before using
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    password_hash = Column(String)
    background = Column(JSON)  # Software/hardware background
    preferences = Column(JSON)  # Personalization preferences
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ChatHistory(Base):
    __tablename__ = "chat_history"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, index=True)
    message = Column(String)
    response = Column(String)
    selected_text = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class ContentChunk(Base):
    __tablename__ = "content_chunks"
    
    id = Column(String, primary_key=True)
    chapter = Column(String, index=True)
    section = Column(String)
    text = Column(String)
    embedding = Column(JSON)  # Vector embedding
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables
def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
