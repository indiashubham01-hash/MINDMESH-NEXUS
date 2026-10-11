import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.voice import router as voice_router
from .routes.resources import router as resources_router
from .routes.learners import router as learners_router
from .routes.plans import router as plans_router
from .routes.quizzes import router as quizzes_router
from .routes.gnn_routes import router as gnn_router
from .routes.auth_routes import router as auth_router
from .routes.agnes_routes import router as agnes_router
from .routes.bhashini_routes import router as bhashini_router
from .routes.gemini_routes import router as gemini_router
from .routes.groq_routes import router as groq_router
from .routes.ollama_routes import router as ollama_router
from .routes.whisper_routes import router as whisper_router
from .routes.engineering_model_routes import router as engineering_router
from .services.agnes_client import AgnesService, token_queue

app = FastAPI(
    title="MINDMESH-NEXUS Backend Brain",
    description="Autonomous Voice-First AI Teaching Co-Pilot Backend with Groq Cloud LPU, Local Ollama, Faster-Whisper ASR, Graph Neural Network (GNN), Google Gemini, Agnes 3.0 Flash, Digital India Bhashini Indic Voice AI, and EngineeringConcepts-Instruct-v1 Fine-Tuning Engine",
    version="2.5.0"
)

# Enable CORS for frontend dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include All Routers
app.include_router(auth_router)
app.include_router(voice_router)
app.include_router(resources_router)
app.include_router(learners_router)
app.include_router(plans_router)
app.include_router(quizzes_router)
app.include_router(gnn_router)
app.include_router(agnes_router)
app.include_router(bhashini_router)
app.include_router(gemini_router)
app.include_router(groq_router)
app.include_router(ollama_router)
app.include_router(whisper_router)
app.include_router(engineering_router)

from fastapi import Request, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))
ASSETS_DIR = os.path.join(DIST_DIR, "assets")
ENV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
ENV_EXAMPLE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env.example"))

@app.get("/api/download-env")
def download_env():
    """Direct browser HTTP download endpoint for .env configuration"""
    if os.path.exists(ENV_PATH):
        return FileResponse(
            ENV_PATH,
            media_type="text/plain",
            filename=".env",
            headers={"Content-Disposition": "attachment; filename=.env"}
        )
    raise HTTPException(status_code=404, detail=".env file not found")

@app.get("/api/download-env-example")
def download_env_example():
    """Direct browser HTTP download endpoint for .env.example configuration"""
    if os.path.exists(ENV_EXAMPLE_PATH):
        return FileResponse(
            ENV_EXAMPLE_PATH,
            media_type="text/plain",
            filename=".env.example",
            headers={"Content-Disposition": "attachment; filename=.env.example"}
        )
    raise HTTPException(status_code=404, detail=".env.example file not found")

if os.path.exists(ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

@app.get("/")
def root_info(request: Request):
    accept = request.headers.get("accept", "")
    index_path = os.path.join(DIST_DIR, "index.html")
    # If opened in a web browser, serve the interactive React frontend directly
    if "text/html" in accept and os.path.exists(index_path):
        return FileResponse(index_path)

    # Programmatic API response for status checks
    return {
        "project": "MINDMESH-NEXUS",
        "description": "Voice-First AI Teaching Co-Pilot (Unified Brain & Frontend)",
        "frontend_url": "http://127.0.0.1:8000/",
        "status": "OPERATIONAL",
        "primary_llm": "gemini-3.8-flash (Google Gemini AI)",
        "gemini_project": "projects/586089963185",
        "endpoints": [
            "POST /api/gemini/chat",
            "POST /api/gemini/parse-intent",
            "POST /api/gemini/transcribe",
            "POST /api/engineering/query",
            "POST /voice-request",
            "POST /resources/upload",
            "POST /plans/generate",
            "POST /plans/{plan_id}/revise",
            "POST /plans/{plan_id}/approve",
            "GET  /learners/{student_id}/profile",
            "GET  /class/{class_id}/risk-report",
            "POST /quizzes/{quiz_id}/submit"
        ],
        "governance_rule": "Never let the AI silently publish content. Requires explicit teacher approval."
    }

@app.get("/ui")
@app.get("/app")
@app.get("/dashboard")
def serve_ui():
    index_path = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"status": "Frontend not built yet. Run npm run build."}

@app.get("/api/system/status")
def system_status():
    return {
        "project": "MINDMESH-NEXUS",
        "status": "OPERATIONAL",
        "rpm_limit": 10,
        "token_queue_interval_seconds": 6.0,
        "active_models": {
            "gemini": "gemini-3.8-flash (Project 586089963185)",
            "llm": "agnes-3.0-flash",
            "image": "agnes-image-2.5-flash",
            "video": "agnes-video-2.5",
            "nli": "cross-encoder/nli-deberta-v3-small",
            "dkt": "LSTM-Knowledge-State"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
