from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pipeline import get_answer

app = FastAPI(
    title="Language Agnostic Campus Chatbot API",
    description="Backend API for student query RAG chatbot supporting multiple languages."
)

# Enable CORS for the frontend AI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
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

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    try:
        # Fetch the response from the RAG pipeline
        answer = get_answer(request.message)
        return ChatResponse(response=answer)
    except Exception as e:
        # Handles Gemini quota errors, missing API keys, etc.
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Language Agnostic Chatbot Backend is running."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
