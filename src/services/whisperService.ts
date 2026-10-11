/**
 * Faster-Whisper & Open-Source Whisper Voice Transcription Service
 * Supports local offline ASR execution and unified pipeline with Ollama
 */

const BACKEND_BASE = 'http://127.0.0.1:8000';

export interface WhisperTranscriptionResult {
  status: 'SUCCESS' | 'FALLBACK' | 'ERROR';
  provider: string;
  transcript: string;
  confidence: number;
  detectedLanguage?: string;
  latencyMs?: number;
}

export interface VoicePipelineResult {
  status: string;
  pipeline: string;
  transcript: string;
  parsedIntent?: any;
  voiceResponse?: string;
}

class WhisperService {
  private defaultModelSize: string = 'base';

  public async getStatus(): Promise<{ status: string; provider: string; supportedModels: string[] }> {
    try {
      const resp = await fetch('/api/whisper/status').catch(() => fetch(`${BACKEND_BASE}/api/whisper/status`));
      if (resp && resp.ok) {
        const data = await resp.json();
        return {
          status: data.status,
          provider: data.provider || 'Faster-Whisper (CTranslate2 Local ASR)',
          supportedModels: data.supported_models || ['tiny', 'base', 'small', 'medium', 'large-v3']
        };
      }
    } catch {
      // Backend not reached
    }

    return {
      status: 'STANDBY',
      provider: 'Faster-Whisper Acoustic Engine',
      supportedModels: ['tiny', 'base', 'small', 'medium', 'large-v3']
    };
  }

  /**
   * Transcribes base64-encoded audio directly via local Faster-Whisper
   */
  public async transcribeAudio(
    audioBase64: string,
    language: string = 'en',
    modelSize?: string
  ): Promise<WhisperTranscriptionResult> {
    try {
      const cleanB64 = audioBase64.includes(',') ? audioBase64.split(',')[1] : audioBase64;
      const lower = (language || '').toLowerCase();
      const targetLang = lower.includes('hi') ? 'hi' : (lower.includes('kn') ? 'kn' : 'en');
      const payload = JSON.stringify({
        audio_base64: cleanB64,
        language: targetLang,
        model_size: modelSize || this.defaultModelSize
      });

      // 1. Try relative URL via Vite proxy (zero CORS, zero port mismatch)
      try {
        const resp = await fetch('/api/whisper/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload
        });
        if (resp.ok) {
          const data = await resp.json();
          return {
            status: data.status === 'SUCCESS' ? 'SUCCESS' : 'FALLBACK',
            provider: data.provider || `Faster-Whisper (${modelSize || this.defaultModelSize})`,
            transcript: data.transcript || '',
            confidence: data.confidence || 0.98,
            detectedLanguage: data.detected_language,
            latencyMs: data.latency_ms
          };
        }
      } catch (proxyErr) {
        // Fallback to direct backend URL
      }

      // 2. Direct fallback to BACKEND_BASE
      const resp = await fetch(`${BACKEND_BASE}/api/whisper/transcribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      });

      if (resp.ok) {
        const data = await resp.json();
        return {
          status: data.status === 'SUCCESS' ? 'SUCCESS' : 'FALLBACK',
          provider: data.provider || `Faster-Whisper (${modelSize || this.defaultModelSize})`,
          transcript: data.transcript || '',
          confidence: data.confidence || 0.98,
          detectedLanguage: data.detected_language,
          latencyMs: data.latency_ms
        };
      }
    } catch (e: any) {
      console.warn('[WhisperService] Local transcription notice:', e);
    }

    return {
      status: 'FALLBACK',
      provider: 'Whisper Acoustic Engine',
      transcript: '',
      confidence: 0.0
    };
  }

  /**
   * End-to-End Local Voice AI Loop: Audio ➔ Faster-Whisper STT ➔ Local Ollama NLU
   */
  public async runVoiceToOllamaPipeline(
    audioBase64: string,
    language: string = 'en',
    whisperModel: string = 'base',
    ollamaModel: string = 'qwen2.5:3b'
  ): Promise<VoicePipelineResult | null> {
    try {
      const cleanB64 = audioBase64.includes(',') ? audioBase64.split(',')[1] : audioBase64;
      const targetOllama = (ollamaModel && ollamaModel !== 'llama3.2') ? ollamaModel : 'qwen2.5:3b';
      const resp = await fetch(`${BACKEND_BASE}/api/whisper/voice-pipeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio_base64: cleanB64,
          language: language === 'Bilingual' ? 'en' : (language === 'Hindi' ? 'hi' : 'en'),
          whisper_model: whisperModel,
          ollama_model: targetOllama
        })
      });

      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      console.warn('[WhisperService] Voice to Ollama pipeline notice:', e);
    }
    return null;
  }
}

export const whisperService = new WhisperService();
