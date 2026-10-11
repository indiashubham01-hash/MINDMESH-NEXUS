"""
MINDMESH-NEXUS: Local Ollama AI Routes
Endpoints for Ollama daemon status, installed models, intent parsing, chat, and lesson generation
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from ..services.ollama_service import ollama_service, POPULAR_FALLBACK_MODELS

router = APIRouter(prefix="/api/ollama", tags=["Local Ollama AI"])

class OllamaParseIntentRequest(BaseModel):
    utterance: Optional[str] = None
    text: Optional[str] = None
    prompt: Optional[str] = None
    model: Optional[str] = None

class OllamaChatRequest(BaseModel):
    prompt: str
    system_prompt: Optional[str] = None
    model: Optional[str] = None

class OllamaLessonRequest(BaseModel):
    topic: str
    duration: Optional[int] = 30
    grade: Optional[int] = 7
    subject: Optional[str] = "Science / Engineering"
    model: Optional[str] = None

class OllamaConfigRequest(BaseModel):
    host: Optional[str] = None
    model: Optional[str] = None

@router.get("/status")
def get_ollama_status():
    """
    Checks if local Ollama daemon is running and lists installed models.
    """
    return ollama_service.check_health()

@router.get("/models")
def get_ollama_models():
    """
    Returns available local models in Ollama with fallback catalogue.
    """
    return ollama_service.list_models()

@router.post("/config")
def update_ollama_config(req: OllamaConfigRequest):
    """
    Updates the target Ollama host or default model.
    """
    if req.host:
        ollama_service.set_host(req.host)
    if req.model:
        ollama_service.set_model(req.model)
    return {
        "status": "updated",
        "host": ollama_service.host,
        "active_model": ollama_service.default_model
    }

@router.post("/parse-intent")
def parse_voice_intent(req: OllamaParseIntentRequest):
    """
    Parses spoken voice command into structured JSON using local Ollama model.
    """
    utterance_text = (req.utterance or req.text or req.prompt or "").strip()
    if not utterance_text:
        raise HTTPException(status_code=400, detail="Utterance, text, or prompt cannot be empty")
    return ollama_service.parse_intent_and_schedule(utterance_text, req.model)

@router.post("/chat")
def chat_ollama(req: OllamaChatRequest):
    """
    Runs local LLM inference via Ollama for Socratic queries or classroom Q&A.
    """
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    return ollama_service.chat(req.prompt, req.system_prompt, req.model)

@router.post("/generate-lesson")
def generate_lesson_ollama(req: OllamaLessonRequest):
    """
    Generates structured 3-tier differentiated lesson plan using local Ollama LLM.
    """
    if not req.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty")
    return ollama_service.generate_lesson(
        topic=req.topic,
        duration=req.duration or 30,
        grade=req.grade or 7,
        subject=req.subject or "Science / Engineering",
        model=req.model
    )
