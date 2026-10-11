"""
Google Gemini AI Routes
POST /api/gemini/chat
POST /api/gemini/transcribe
POST /api/gemini/parse-intent
GET  /api/gemini/status
"""

from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..services.gemini_service import GeminiService, GEMINI_MODEL, GEMINI_API_KEY

router = APIRouter(prefix="/api/gemini", tags=["Google Gemini AI"])

class GeminiChatRequest(BaseModel):
    prompt: str
    domain: str = "Science / Engineering"
    language: str = "English"
    custom_api_key: Optional[str] = None

class GeminiTranscribeRequest(BaseModel):
    audio_base64: str
    mime_type: Optional[str] = "audio/webm"
    language: Optional[str] = "en"
    custom_api_key: Optional[str] = None

class GeminiParseIntentRequest(BaseModel):
    utterance: Optional[str] = None
    text: Optional[str] = None
    prompt: Optional[str] = None
    custom_api_key: Optional[str] = None

@router.get("/status")
def gemini_status():
    return {
        "status": "OPERATIONAL",
        "provider": "Google AI Studio",
        "project": "projects/586089963185",
        "model": GEMINI_MODEL,
        "api_key_configured": bool(GEMINI_API_KEY),
        "capabilities": [
            "Multimodal Scientific Reasoning",
            "Multimodal Audio Speech-to-Text Transcription",
            "Explainable AI Feature Attributions",
            "Voice Intent Parsing & Class Scheduling",
            "Multi-Tier Curriculum Scaffolding",
            "Universal Engineering Socratic QA"
        ]
    }

@router.post("/chat")
async def chat_gemini(req: GeminiChatRequest):
    result = await GeminiService.generate_socratic_response(
        prompt=req.prompt,
        domain=req.domain,
        language=req.language,
        custom_key=req.custom_api_key
    )
    return result

@router.post("/transcribe")
async def transcribe_gemini(req: GeminiTranscribeRequest):
    if not req.audio_base64.strip():
        raise HTTPException(status_code=400, detail="audio_base64 cannot be empty")
    return await GeminiService.transcribe_audio_base64(
        audio_base64=req.audio_base64,
        mime_type=req.mime_type or "audio/webm",
        language=req.language,
        custom_key=req.custom_api_key
    )

@router.post("/parse-intent")
async def parse_intent_gemini(req: GeminiParseIntentRequest):
    utterance_text = (req.utterance or req.text or req.prompt or "").strip()
    if not utterance_text:
        raise HTTPException(status_code=400, detail="Utterance cannot be empty")
    return await GeminiService.parse_intent_and_schedule(
        utterance=utterance_text,
        custom_key=req.custom_api_key
    )

