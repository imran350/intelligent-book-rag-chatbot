from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import json
from datetime import datetime
from auth import router as auth_router
from database import init_db
from personalizer import ContentPersonalizer
from translator import ContentTranslator

load_dotenv()

OPENAI_CHAT_MODEL = os.getenv("OPENAI_CHAT_MODEL", "gpt-4.1-mini")
OPENAI_TRANSLATE_MODEL = os.getenv("OPENAI_TRANSLATE_MODEL", OPENAI_CHAT_MODEL)

# Initialize FastAPI app
app = FastAPI(title="Book RAG Chatbot API", version="1.0.0")

# Initialize personalizer and translator
personalizer = ContentPersonalizer()
translator = ContentTranslator()

# Include auth router
app.include_router(auth_router)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI and Qdrant clients
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL", "http://localhost:6333"),
    api_key=os.getenv("QDRANT_API_KEY")
)

# Models
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None
    selected_text: Optional[str] = None
    conversation_history: Optional[List[Message]] = None

class ChatResponse(BaseModel):
    message: str
    sources: Optional[List[str]] = None
    timestamp: str

class ContentChunk(BaseModel):
    text: str
    chapter: str
    section: Optional[str] = None

class TranslationRequest(BaseModel):
    text: str
    target_language: str = "urdu"

class PersonalizationRequest(BaseModel):
    user_id: str
    preferences: dict
    background: dict

# Vector store initialization
COLLECTION_NAME = "book_content"

@app.on_event("startup")
async def startup_event():
    """Initialize vector store on startup"""
    try:
        # Try to delete existing collection if it exists
        try:
            qdrant_client.delete_collection(collection_name=COLLECTION_NAME)
        except:
            pass
        
        # Create new collection
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
        )
    except Exception as e:
        print(f"Warning: Could not initialize vector store: {e}")

@app.post("/api/chat")
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Main chat endpoint with RAG capabilities
    """
    try:
        # Get embedding for the user query
        query_embedding = get_embedding(request.message)
        
        # Search relevant documents in Qdrant
        try:
            search_results = qdrant_client.search(
                collection_name=COLLECTION_NAME,
                query_vector=query_embedding,
                limit=3
            )
        except Exception as e:
            # If search fails (collection doesn't exist or empty), continue without RAG
            print(f"Qdrant search error: {e}")
            search_results = []
        
        # Build context from search results
        context = ""
        sources = []
        
        for result in search_results:
            if result.payload.get("text"):
                context += result.payload.get("text", "") + "\n"
                sources.append(result.payload.get("source", "unknown"))
        
        # Handle selected text context
        if request.selected_text:
            context = f"User selected text: {request.selected_text}\n\n{context}"
        
        # Prepare messages for OpenAI
        system_prompt = """You are a helpful AI assistant for a book. 
Answer questions based on the provided book content. 
If the answer is not in the provided context, say so clearly.
Keep answers concise and informative."""
        
        messages = [
            {"role": "system", "content": system_prompt}
        ]
        
        # Add conversation history if provided
        if request.conversation_history:
            for msg in request.conversation_history:
                messages.append({"role": msg.role, "content": msg.content})
        
        # Add the context and current message
        messages.append({
            "role": "user",
            "content": f"Context from the book:\n{context}\n\nUser question: {request.message}"
        })
        
        # Get response from OpenAI
        response = openai_client.chat.completions.create(
            model=OPENAI_CHAT_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        
        return ChatResponse(
            message=response.choices[0].message.content,
            sources=list(set(sources)),
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/add-content")
async def add_content(chunk: ContentChunk) -> dict:
    """
    Add content chunks to the vector store
    """
    try:
        embedding = get_embedding(chunk.text)
        
        # Create point for Qdrant
        point = PointStruct(
            id=hash(chunk.text) % 2**31,  # Use hash as ID
            vector=embedding,
            payload={
                "text": chunk.text,
                "chapter": chunk.chapter,
                "section": chunk.section,
                "source": f"{chunk.chapter}/{chunk.section or 'main'}"
            }
        )
        
        # Upsert to Qdrant
        qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            points=[point]
        )
        
        return {"status": "success", "message": "Content added to vector store"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/translate")
async def translate_content(request: TranslationRequest) -> dict:
    """
    Translate content to target language (e.g., Urdu)
    """
    try:
        response = openai_client.chat.completions.create(
            model=OPENAI_TRANSLATE_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": f"You are a professional translator. Translate the following text to {request.target_language}. Only provide the translation, no explanations."
                },
                {
                    "role": "user",
                    "content": request.text
                }
            ],
            temperature=0.3,
            max_tokens=1000
        )
        
        return {
            "original": request.text,
            "translated": response.choices[0].message.content,
            "language": request.target_language,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/personalize")
async def personalize_content(request: PersonalizationRequest) -> dict:
    """
    Personalize content based on user background and preferences
    """
    try:
        # Store personalization preferences
        personalization_data = {
            "user_id": request.user_id,
            "preferences": request.preferences,
            "background": request.background,
            "timestamp": datetime.now().isoformat()
        }
        
        return {
            "status": "success",
            "message": "Personalization preferences saved",
            "data": personalization_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    """Root endpoint - Welcome message"""
    return {
        "message": "Book RAG Chatbot API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/api/health")
async def health_check() -> dict:
    """Health check endpoint"""
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

def get_embedding(text: str) -> List[float]:
    """Get embedding from OpenAI API"""
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

# Additional models for personalization
class PersonalizeChapterRequest(BaseModel):
    chapter_title: str
    chapter_content: str
    user_id: Optional[str] = None
    background: dict

class TranslateChapterRequest(BaseModel):
    chapter_title: str
    chapter_content: str
    target_language: str = "urdu"

# New endpoints for personalization and translation
@app.post("/api/personalize-chapter")
async def personalize_chapter(request: PersonalizeChapterRequest) -> dict:
    """
    Personalize entire chapter based on user background
    """
    try:
        personalized_chapter = personalizer.create_personalized_chapter(
            request.chapter_content,
            request.background
        )
        
        return {
            "status": "success",
            "chapter_title": request.chapter_title,
            **personalized_chapter
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/translate-chapter")
async def translate_chapter(request: TranslateChapterRequest) -> dict:
    """
    Translate entire chapter to target language
    """
    try:
        translated_chapter = translator.translate_chapter(
            request.chapter_title,
            request.chapter_content,
            request.target_language
        )
        
        return {
            "status": "success",
            **translated_chapter
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/get-glossary")
async def get_glossary(terms: List[str], target_language: str = "urdu") -> dict:
    """
    Get glossary of technical terms in target language
    """
    try:
        glossary = translator.get_glossary(terms, target_language)
        
        return {
            "status": "success",
            "terms": glossary,
            "target_language": target_language
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
