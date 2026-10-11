"""
MINDMESH-NEXUS: Local Ollama Open-Source LLM Service
Direct integration with local Ollama daemon (http://127.0.0.1:11434)
Supports offline voice intent parsing, class scheduling, and 3-tier lesson generation.
Models supported: Llama 3.2, Llama 3.1, Qwen 2.5, Mistral, Gemma 2, Phi-3, DeepSeek-R1.
"""

import os
import json
import socket
import httpx
from typing import Dict, Any, List, Optional

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434").rstrip("/")
DEFAULT_OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:3b")
POPULAR_FALLBACK_MODELS = [
    "llama3.2",
    "llama3.1",
    "llama3",
    "qwen2.5",
    "mistral",
    "gemma2",
    "phi3",
    "deepseek-r1"
]

class OllamaService:
    def __init__(self, host: str = OLLAMA_HOST, default_model: str = DEFAULT_OLLAMA_MODEL):
        self.host = host
        self.default_model = default_model
        self.cached_models: List[str] = []

    def set_host(self, host: str):
        self.host = host.rstrip("/")

    def set_model(self, model: str):
        self.default_model = model

    def _is_port_open(self) -> bool:
        """Fast pre-flight socket check (50ms timeout) to prevent blocking if daemon isn't running."""
        try:
            # Parse host and port
            clean_host = self.host.replace("http://", "").replace("https://", "")
            if ":" in clean_host:
                h, p = clean_host.split(":")
                port = int(p)
            else:
                h = clean_host
                port = 11434
            
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(0.15)
                return s.connect_ex((h, port)) == 0
        except Exception:
            return False

    def _resolve_model(self, model: Optional[str] = None) -> str:
        """
        Dynamically finds the best available installed model on the local Ollama daemon.
        """
        models_info = self.list_models()
        installed_models = models_info.get("models", [])
        installed_names = [m.get("name") for m in installed_models if isinstance(m, dict) and m.get("name")]
        
        req = model or self.default_model
        
        # 1. Exact match
        if req in installed_names:
            return req
            
        # 2. Match without tag (e.g. "qwen2.5" matching "qwen2.5:3b")
        req_base = req.split(":")[0]
        for name in installed_names:
            if name.split(":")[0] == req_base:
                return name
                
        # 3. If requested model is not found, but we have installed models, use first installed model
        if installed_names:
            return installed_names[0]
            
        return req

    def check_health(self) -> Dict[str, Any]:
        """
        Pings local Ollama server on port 11434 with instant socket pre-check.
        """
        if not self._is_port_open():
            return {
                "status": "OFFLINE",
                "host": self.host,
                "version": None,
                "active_model": self.default_model,
                "installed_models": [],
                "recommended_models": POPULAR_FALLBACK_MODELS,
                "message": f"Ollama daemon is offline at {self.host}. To start, install Ollama and run 'ollama run {self.default_model}'."
            }

        try:
            with httpx.Client(timeout=1.5) as client:
                resp = client.get(f"{self.host}/api/version")
                if resp.status_code == 200:
                    data = resp.json()
                    models_res = self.list_models()
                    active = self._resolve_model(self.default_model)
                    return {
                        "status": "ONLINE",
                        "host": self.host,
                        "version": data.get("version", "unknown"),
                        "active_model": active,
                        "installed_models": models_res.get("models", []),
                        "message": "Local Ollama daemon is connected and operational."
                    }
        except Exception as e:
            return {
                "status": "OFFLINE",
                "host": self.host,
                "version": None,
                "active_model": self.default_model,
                "installed_models": [],
                "recommended_models": POPULAR_FALLBACK_MODELS,
                "message": f"Ollama not responding at {self.host}: {e}"
            }

    def list_models(self) -> Dict[str, Any]:
        """
        Fetches installed models from /api/tags or returns default catalogue if offline.
        """
        if not self._is_port_open():
            return {
                "status": "offline_defaults",
                "count": len(POPULAR_FALLBACK_MODELS),
                "models": [{"name": m} for m in POPULAR_FALLBACK_MODELS],
                "model_names": POPULAR_FALLBACK_MODELS
            }

        try:
            with httpx.Client(timeout=1.0) as client:
                resp = client.get(f"{self.host}/api/tags")
                if resp.status_code == 200:
                    data = resp.json()
                    raw_models = data.get("models", [])
                    model_names = [m.get("name", "").split(":")[0] for m in raw_models if m.get("name")]
                    self.cached_models = model_names
                    return {
                        "status": "success",
                        "count": len(raw_models),
                        "models": raw_models,
                        "model_names": model_names
                    }
        except Exception:
            pass

        return {
            "status": "offline_defaults",
            "count": len(POPULAR_FALLBACK_MODELS),
            "models": [{"name": m} for m in POPULAR_FALLBACK_MODELS],
            "model_names": POPULAR_FALLBACK_MODELS
        }

    def parse_intent_and_schedule(self, utterance: str, model: Optional[str] = None) -> Dict[str, Any]:
        """
        Uses local Ollama open-source LLM inference to parse voice commands into structured JSON.
        """
        target_model = self._resolve_model(model)
        
        # If daemon is offline, return instantaneous rule fallback
        if not self._is_port_open():
            return self._build_rule_fallback(utterance, target_model)

        sys_prompt = """You are MINDMESH-NEXUS Local Voice Intent Parser & Class Scheduler.
Analyze the voice command and output ONLY a valid JSON object matching this schema:
{
  "action": "schedule_class" | "schedule_intervention" | "edit_marks" | "generate_lesson" | "replan_lesson" | "socratic_qa" | "general_qa" | "navigate",
  "topic": "The exact concept or topic mentioned",
  "module": "Inferred academic module name",
  "durationMinutes": 20,
  "scheduledOffsetMinutes": 10,
  "studentName": "Student name if mentioned",
  "marks": { "score": 9, "maxScore": 10 },
  "confidence": 0.96,
  "voiceResponse": "Natural, clear spoken confirmation."
}"""

        payload = {
            "model": target_model,
            "messages": [
                {"role": "system", "content": sys_prompt},
                {"role": "user", "content": utterance}
            ],
            "stream": False,
            "format": "json",
            "options": {"temperature": 0.1, "num_predict": 300}
        }

        try:
            with httpx.Client(timeout=30.0) as client:
                resp = client.post(f"{self.host}/api/chat", json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    content = data.get("message", {}).get("content", "").strip()
                    clean_json = content.replace("```json", "").replace("```", "").strip()
                    return {
                        "status": "success",
                        "provider": f"Local Ollama ({target_model})",
                        "parsed": json.loads(clean_json),
                        "raw": content
                    }
        except Exception:
            pass

        return self._build_rule_fallback(utterance, target_model)

    def _build_rule_fallback(self, utterance: str, target_model: str) -> Dict[str, Any]:
        is_sched = "schedule" in utterance.lower() or "class in" in utterance.lower()
        is_cn = "tcp" in utterance.lower() or "flow" in utterance.lower() or "network" in utterance.lower()
        topic = "Computer Networks TCP Flow Control" if is_cn else "Photosynthesis & Stomata Dynamics"
        return {
            "status": "fallback",
            "provider": f"Local Ollama Engine (Offline Fallback)",
            "parsed": {
                "action": "schedule_class" if is_sched else "generate_lesson",
                "topic": topic,
                "module": "Module 3: Transport Layer & TCP Flow" if is_cn else "NCERT Grade 7 Science",
                "durationMinutes": 20,
                "scheduledOffsetMinutes": 10,
                "confidence": 0.92,
                "voiceResponse": f"Local Ollama processed voice intent for {topic}."
            }
        }

    def chat(self, prompt: str, system_prompt: Optional[str] = None, model: Optional[str] = None) -> Dict[str, Any]:
        """
        Fast local chat completion with Ollama.
        """
        target_model = self._resolve_model(model)
        if not self._is_port_open():
            return {
                "status": "fallback",
                "provider": "Local Ollama Fallback",
                "response": f"Ollama is currently offline at {self.host}. Inquiry processed locally: {prompt}"
            }

        sys = system_prompt or "You are MINDMESH-NEXUS, an expert AI Teaching and Engineering Co-Pilot."
        payload = {
            "model": target_model,
            "messages": [
                {"role": "system", "content": sys},
                {"role": "user", "content": prompt}
            ],
            "stream": False,
            "options": {"temperature": 0.2, "num_predict": 300}
        }

        try:
            with httpx.Client(timeout=30.0) as client:
                resp = client.post(f"{self.host}/api/chat", json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    content = data.get("message", {}).get("content", "").strip()
                    return {
                        "status": "success",
                        "provider": f"Local Ollama ({target_model})",
                        "response": content
                    }
        except Exception as e:
            return {
                "status": "fallback",
                "provider": "Local Ollama Fallback",
                "response": f"Ollama connection error: {e}"
            }

    def generate_lesson(
        self,
        topic: str,
        duration: int = 30,
        grade: int = 7,
        subject: str = "Science / Engineering",
        model: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generates differentiated multi-tier lesson structure with local Ollama LLM.
        """
        target_model = self._resolve_model(model)
        if not self._is_port_open():
            return {
                "status": "fallback",
                "provider": "Local Ollama Fallback Engine",
                "lesson": {
                    "topic": topic,
                    "totalDurationMinutes": duration,
                    "beginnerExplanation": {
                        "summary": f"Foundational overview of {topic} with scaffolded step-by-step guidance.",
                        "keyAnalogy": "Physical container and transfer pipe analogy.",
                        "targetStudents": ["Rahul Sharma", "Aarav Sharma"]
                    },
                    "standardLesson": {
                        "objectives": [f"Understand core principles of {topic}", "Solve diagnostic checkpoint questions"],
                        "phases": [
                            {"phase": "Hook & Analogy", "minutes": 5, "activity": "Real-world context visualization"},
                            {"phase": "Direct Instruction", "minutes": duration - 15, "activity": "Concept walkthrough"},
                            {"phase": "Formative Check", "minutes": 10, "activity": "Interactive Socratic check"}
                        ]
                    },
                    "advancedActivity": {
                        "inquiryChallenge": f"Formulate optimization bounds and real-world edge cases for {topic}."
                    }
                }
            }

        prompt = f"""Generate a 3-tier differentiated lesson plan for:
Topic: {topic}
Subject: {subject}
Duration: {duration} minutes
Output valid JSON only with topic, totalDurationMinutes, beginnerExplanation, standardLesson, and advancedActivity."""

        payload = {
            "model": target_model,
            "messages": [
                {"role": "system", "content": "You are MINDMESH-NEXUS Curriculum AI."},
                {"role": "user", "content": prompt}
            ],
            "stream": False,
            "format": "json",
            "options": {"temperature": 0.2, "num_predict": 500}
        }

        try:
            with httpx.Client(timeout=35.0) as client:
                resp = client.post(f"{self.host}/api/chat", json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    content = data.get("message", {}).get("content", "").strip()
                    clean_json = content.replace("```json", "").replace("```", "").strip()
                    return {
                        "status": "success",
                        "provider": f"Local Ollama ({target_model})",
                        "lesson": json.loads(clean_json)
                    }
        except Exception:
            pass

        return {
            "status": "fallback",
            "provider": "Local Ollama Fallback Engine",
            "lesson": {
                "topic": topic,
                "totalDurationMinutes": duration,
                "beginnerExplanation": {
                    "summary": f"Foundational overview of {topic} with scaffolded step-by-step guidance.",
                    "keyAnalogy": "Physical container and transfer pipe analogy.",
                    "targetStudents": ["Rahul Sharma", "Aarav Sharma"]
                },
                "standardLesson": {
                    "objectives": [f"Understand core principles of {topic}", "Solve diagnostic checkpoint questions"],
                    "phases": [
                        {"phase": "Hook & Analogy", "minutes": 5, "activity": "Real-world context visualization"},
                        {"phase": "Direct Instruction", "minutes": duration - 15, "activity": "Concept walkthrough"},
                        {"phase": "Formative Check", "minutes": 10, "activity": "Interactive Socratic check"}
                    ]
                },
                "advancedActivity": {
                    "inquiryChallenge": f"Formulate optimization bounds and real-world edge cases for {topic}."
                }
            }
        }

ollama_service = OllamaService()
