from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from pipeline import get_answer, translate_text

load_dotenv()

app = FastAPI(
    title="Language Agnostic Campus Chatbot API",
    description="Backend API for student query RAG chatbot supporting multiple languages."
)

# Enable CORS for the frontend AI
# Pull from environment or default to local development ports
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    session_id: str = "default_session"

class ChatResponse(BaseModel):
    response: str

class TranslateRequest(BaseModel):
    text: str
    target_lang: str

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    try:
        # Fetch the response from the RAG pipeline
        answer = get_answer(request.message, request.language)
        return ChatResponse(response=answer)
    except Exception as e:
        # Handles Gemini quota errors, missing API keys, etc.
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/translate")
async def translate_endpoint(request: TranslateRequest):
    """Retranslate existing chat history to a new language."""
    if not request.text.strip():
        return {"translated_text": ""}
    
    try:
        translated = translate_text(request.text, request.target_lang)
        return {"translated_text": translated}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Language Agnostic Chatbot Backend is running."}

if __name__ == "__main__":
    import uvicorn
    # Use 0.0.0.0 to allow external access in network/deployment
    # Port pulled from env for Render/Railway compatibility
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
