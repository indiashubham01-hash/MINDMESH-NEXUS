"""
MINDMESH-NEXUS: Local Whisper Speech-to-Text & Ollama Voice AI Routes
Fast offline voice transcription and end-to-end voice-to-action pipeline
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from ..services.whisper_service import whisper_service

router = APIRouter(prefix="/api/whisper", tags=["Whisper Voice ASR Engine"])

class TranscribeAudioRequest(BaseModel):
    audio_base64: str
    language: Optional[str] = "en"
    model_size: Optional[str] = "base"

class VoicePipelineRequest(BaseModel):
    audio_base64: str
    language: Optional[str] = "en"
    whisper_model: Optional[str] = "base"
    ollama_model: Optional[str] = None

@router.get("/status")
def get_whisper_status():
    """
    Returns Faster-Whisper local engine health, model size, and capabilities.
    """
    return whisper_service.get_status()

@router.post("/transcribe")
def transcribe_voice_audio(req: TranscribeAudioRequest):
    """
    Transcribes spoken voice audio (WAV, WebM, MP3, OGG) using local Faster-Whisper.
    """
    if not req.audio_base64.strip():
        raise HTTPException(status_code=400, detail="audio_base64 cannot be empty")
    return whisper_service.transcribe_audio_base64(
        audio_base64=req.audio_base64,
        language=req.language,
        model_size=req.model_size
    )

@router.post("/voice-pipeline")
def run_voice_to_ollama_pipeline(req: VoicePipelineRequest):
    """
    End-to-End Local Voice AI Pipeline:
    Transcribes spoken audio with Whisper ➔ pipes directly to Ollama for structured action & lesson synthesis.
    """
    if not req.audio_base64.strip():
        raise HTTPException(status_code=400, detail="audio_base64 cannot be empty")
    return whisper_service.voice_to_ollama_pipeline(
        audio_base64=req.audio_base64,
        language=req.language,
        whisper_model=req.whisper_model,
        ollama_model=req.ollama_model
    )
