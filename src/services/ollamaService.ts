/**
 * Local Ollama Open-Source AI Service
 * Supports direct localhost execution (http://localhost:11434) and FastAPI gateway proxy
 * Models: Llama 3.2, Llama 3.1, Qwen 2.5, Mistral, Gemma 2, Phi 3, DeepSeek R1
 */

import { VoiceCommandIntent, CalendarEvent } from '../types';
import { sharedState } from './sharedStateManager';

export interface OllamaParsedIntent {
  action: 'schedule_class' | 'schedule_intervention' | 'edit_marks' | 'generate_lesson' | 'replan_duration' | 'replan_lesson' | 'socratic_qa' | 'general_qa' | 'navigate';
  topic: string;
  module?: string;
  durationMinutes: number;
  scheduledOffsetMinutes: number;
  specificTimeStr?: string;
  studentName?: string;
  marks?: { score: number; maxScore: number };
  confidence: number;
  voiceResponse: string;
  targetTab?: 'lesson' | 'curriculum' | 'calendar' | 'sources' | 'students' | 'graph';
}

export interface OllamaModelTag {
  name: string;
  modified_at?: string;
  size?: number;
  digest?: string;
}

const DEFAULT_HOST = 'http://localhost:11434';
const DEFAULT_MODEL = 'qwen2.5:3b';
const BACKEND_PROXY_URL = (import.meta as any).env?.VITE_BACKEND_URL ? `${(import.meta as any).env.VITE_BACKEND_URL}/api/ollama` : '/api/ollama';

class OllamaService {
  private hostUrl: string;
  private selectedModel: string;
  private isOnline: boolean = false;
  private installedModels: string[] = ['qwen2.5:3b'];

  constructor() {
    this.hostUrl = (typeof window !== 'undefined' ? localStorage.getItem('mm_ollama_host') : null) || DEFAULT_HOST;
    const stored = typeof window !== 'undefined' ? localStorage.getItem('mm_ollama_model') : null;
    this.selectedModel = (stored && stored !== 'llama3.2') ? stored : DEFAULT_MODEL;
  }

  public getHostUrl(): string {
    return this.hostUrl;
  }

  public setHostUrl(url: string) {
    if (url && url.trim()) {
      this.hostUrl = url.trim().replace(/\/+$/, '');
      localStorage.setItem('mm_ollama_host', this.hostUrl);
    }
  }

  public getSelectedModel(): string {
    return this.selectedModel;
  }

  public setSelectedModel(model: string) {
    if (model && model.trim()) {
      this.selectedModel = model.trim();
      localStorage.setItem('mm_ollama_model', this.selectedModel);
    }
  }

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  public resolveActiveModel(override?: string): string {
    if (override && override.trim()) return override.trim();
    if (this.installedModels.length > 0) {
      const match = this.installedModels.find(m => 
        m === this.selectedModel || 
        m.startsWith(this.selectedModel) || 
        this.selectedModel.startsWith(m.split(':')[0])
      );
      if (match) return match;
      return this.installedModels[0];
    }
    return this.selectedModel || 'qwen2.5:3b';
  }

  /**
   * Health Check: tests direct localhost:11434 connection or backend /api/ollama/status
   */
  public async checkStatus(): Promise<{
    status: 'ONLINE' | 'OFFLINE';
    host: string;
    version?: string;
    activeModel: string;
    models: string[];
    source: 'direct' | 'proxy' | 'none';
  }> {
    // 1. Try Direct Localhost Fetch
    try {
      const directController = new AbortController();
      const directTimeout = setTimeout(() => directController.abort(), 2000);

      const resp = await fetch(`${this.hostUrl}/api/version`, {
        method: 'GET',
        signal: directController.signal
      });
      clearTimeout(directTimeout);

      if (resp.ok) {
        const data = await resp.json();
        this.isOnline = true;
        const models = await this.getAvailableModels();
        const active = this.resolveActiveModel();
        this.selectedModel = active;
        return {
          status: 'ONLINE',
          host: this.hostUrl,
          version: data.version || 'v0.5.0+',
          activeModel: active,
          models: models.length > 0 ? models : [active],
          source: 'direct'
        };
      }
    } catch {
      // Direct localhost might fail if CORS is restricted or offline; try backend proxy next
    }

    // 2. Try FastAPI Backend Gateway Proxy
    try {
      const proxyController = new AbortController();
      const proxyTimeout = setTimeout(() => proxyController.abort(), 3500);

      const proxyResp = await fetch(`${BACKEND_PROXY_URL}/status`, {
        method: 'GET',
        signal: proxyController.signal
      });
      clearTimeout(proxyTimeout);

      if (proxyResp.ok) {
        const proxyData = await proxyResp.json();
        this.isOnline = proxyData.status === 'ONLINE';
        const modelNames = proxyData.installed_models?.map((m: any) => m.name) || [];
        if (modelNames.length > 0) {
          this.installedModels = modelNames;
        }
        if (proxyData.active_model) {
          this.selectedModel = proxyData.active_model;
        } else {
          this.selectedModel = this.resolveActiveModel();
        }

        return {
          status: proxyData.status === 'ONLINE' ? 'ONLINE' : 'OFFLINE',
          host: proxyData.host || this.hostUrl,
          version: proxyData.version || undefined,
          activeModel: this.selectedModel,
          models: this.installedModels.length > 0 ? this.installedModels : ['qwen2.5:3b'],
          source: 'proxy'
        };
      }
    } catch {
      // Backend proxy unavailable
    }

    this.isOnline = false;
    return {
      status: 'OFFLINE',
      host: this.hostUrl,
      activeModel: this.selectedModel,
      models: this.installedModels,
      source: 'none'
    };
  }

  /**
   * Fetch list of locally downloaded models
   */
  public async getAvailableModels(): Promise<string[]> {
    // Try direct tags
    try {
      const resp = await fetch(`${this.hostUrl}/api/tags`, { method: 'GET' });
      if (resp.ok) {
        const data = await resp.json();
        const models = (data.models || []).map((m: OllamaModelTag) => m.name);
        if (models.length > 0) {
          this.installedModels = models;
          if (!models.some((m: string) => m === this.selectedModel || m.startsWith(this.selectedModel.split(':')[0]))) {
            this.selectedModel = models[0];
          }
          return this.installedModels;
        }
      }
    } catch {
      // Direct tags error
    }

    // Try backend proxy
    try {
      const proxyResp = await fetch(`${BACKEND_PROXY_URL}/models`);
      if (proxyResp.ok) {
        const proxyData = await proxyResp.json();
        if (proxyData.model_names?.length) {
          this.installedModels = proxyData.model_names;
          if (!this.installedModels.some(m => m === this.selectedModel || m.startsWith(this.selectedModel.split(':')[0]))) {
            this.selectedModel = this.installedModels[0];
          }
          return this.installedModels;
        }
      }
    } catch {
      // Proxy tags error
    }

    return this.installedModels.length > 0 ? this.installedModels : ['qwen2.5:3b'];
  }

  /**
   * Voice Command Intent Parsing and Calendar Synchronization via Ollama
   */
  public async parseVoiceCommandAndSchedule(spokenText: string, modelOverride?: string): Promise<VoiceCommandIntent | null> {
    const text = spokenText.trim();
    if (!text) return null;

    const modelToUse = this.resolveActiveModel(modelOverride);
    const sysPrompt = `You are MINDMESH-NEXUS Local Voice Intent Parser.
Analyze the voice command and output ONLY valid JSON matching this schema:
{
  "action": "schedule_class" | "schedule_intervention" | "edit_marks" | "generate_lesson" | "replan_lesson" | "socratic_qa" | "general_qa" | "navigate",
  "topic": "The exact topic or concept mentioned",
  "module": "Academic module name",
  "durationMinutes": 20,
  "scheduledOffsetMinutes": 10,
  "studentName": "Student name if mentioned",
  "marks": { "score": 9, "maxScore": 10 },
  "confidence": 0.95,
  "voiceResponse": "Professional spoken response."
}`;

    // 1. Direct fetch to local Ollama
    try {
      const directController = new AbortController();
      const directTimeout = setTimeout(() => directController.abort(), 30000);

      const resp = await fetch(`${this.hostUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: directController.signal,
        body: JSON.stringify({
          model: modelToUse,
          messages: [
            { role: 'system', content: sysPrompt },
            { role: 'user', content: text }
          ],
          stream: false,
          format: 'json',
          options: { temperature: 0.1, num_predict: 350 }
        })
      });
      clearTimeout(directTimeout);

      if (resp.ok) {
        const data = await resp.json();
        const content = data.message?.content?.trim();
        if (content) {
          const parsed = JSON.parse(content.replace(/```json/g, '').replace(/```/g, '').trim()) as OllamaParsedIntent;
          return this.convertParsedToIntent(parsed, text, `Local Ollama (${modelToUse})`);
        }
      }
    } catch {
      // Direct call failed, fall back to backend route
    }

    // 2. Fallback to FastAPI backend proxy
    try {
      const proxyController = new AbortController();
      const proxyTimeout = setTimeout(() => proxyController.abort(), 35000);

      const proxyResp = await fetch(`${BACKEND_PROXY_URL}/parse-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: proxyController.signal,
        body: JSON.stringify({ utterance: text, model: modelToUse })
      });
      clearTimeout(proxyTimeout);

      if (proxyResp.ok) {
        const proxyData = await proxyResp.json();
        if (proxyData.parsed) {
          return this.convertParsedToIntent(proxyData.parsed, text, proxyData.provider || `Ollama Proxy (${modelToUse})`);
        }
      }
    } catch {
      // Fallback failed
    }

    return null;
  }

  /**
   * Fast Local LLM Chat Query
   */
  public async chat(prompt: string, modelOverride?: string): Promise<string> {
    const modelToUse = this.resolveActiveModel(modelOverride);
    const sysPrompt = 'You are MINDMESH-NEXUS, an expert AI Teaching Co-Pilot in Engineering & Science. Provide a clear, technically precise explanation in 2 to 3 sentences.';

    // Try direct
    try {
      const directController = new AbortController();
      const directTimeout = setTimeout(() => directController.abort(), 30000);

      const resp = await fetch(`${this.hostUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: directController.signal,
        body: JSON.stringify({
          model: modelToUse,
          messages: [
            { role: 'system', content: sysPrompt },
            { role: 'user', content: prompt }
          ],
          stream: false,
          options: { temperature: 0.2, num_predict: 300 }
        })
      });
      clearTimeout(directTimeout);

      if (resp.ok) {
        const data = await resp.json();
        return data.message?.content?.trim() || '';
      }
    } catch {
      // Try backend proxy
    }

    try {
      const proxyController = new AbortController();
      const proxyTimeout = setTimeout(() => proxyController.abort(), 35000);

      const proxyResp = await fetch(`${BACKEND_PROXY_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: proxyController.signal,
        body: JSON.stringify({ prompt, model: modelToUse })
      });
      clearTimeout(proxyTimeout);

      if (proxyResp.ok) {
        const data = await proxyResp.json();
        return data.response || '';
      }
    } catch {
      // All failed
    }

    return '';
  }

  private convertParsedToIntent(
    parsed: OllamaParsedIntent,
    rawText: string,
    providerName: string
  ): VoiceCommandIntent {
    const duration = parsed.durationMinutes || 20;
    const offset = parsed.scheduledOffsetMinutes || 10;
    const topic = parsed.topic || 'Computer Networks TCP Flow Control';
    const moduleName = parsed.module || (topic.toLowerCase().includes('tcp') || topic.toLowerCase().includes('network')
      ? 'Module 3: Transport Layer & TCP Flow'
      : topic.toLowerCase().includes('tree') || topic.toLowerCase().includes('bst')
      ? 'Module 2: Trees & Hierarchical Graphs'
      : 'NCERT Grade 7 Science');

    if (parsed.action === 'schedule_class') {
      const now = new Date();
      const startTime = new Date(now.getTime() + offset * 60 * 1000);
      const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
      const timeStr = parsed.specificTimeStr || `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      const dateStr = new Date().toISOString().split('T')[0];

      const calendarEvent: CalendarEvent = {
        id: `evt-ollama-${Date.now()}`,
        title: topic,
        topicId: `topic-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        module: moduleName,
        date: dateStr,
        time: timeStr,
        type: 'lesson',
        status: 'scheduled',
        objectives: [
          `Master core mechanics of ${topic}`,
          `Interactive formative diagnostic (${duration}m)`
        ],
        prerequisites: ['Foundational Concepts'],
        prerequisiteCompleted: true,
        resources: [
          {
            title: `${topic} Local Ollama Summary`,
            type: 'notes',
            url: '#'
          }
        ]
      };

      return {
        rawText,
        action: 'schedule_class',
        topic,
        subject: moduleName,
        durationMinutes: duration,
        actionOutcome: {
          type: 'schedule_class',
          payload: calendarEvent,
          targetTab: 'calendar',
          voiceResponse: parsed.voiceResponse || `Scheduled a ${duration}-minute class on "${topic}" in ${offset} minutes via ${providerName}.`
        }
      };
    }

    if (parsed.action === 'schedule_intervention') {
      const studentName = parsed.studentName || 'Rahul Sharma';
      const studentId = studentName.toLowerCase().includes('aarav') ? 'std-1' : 'std-0';
      const concept = topic.includes('TCP') ? 'Slow Start (Exponential Doubling)' : topic;

      return {
        rawText,
        action: 'schedule_intervention',
        topic: moduleName,
        actionOutcome: {
          type: 'schedule_intervention',
          payload: {
            studentId,
            studentName,
            topic: moduleName,
            concept,
            notes: `Targeted intervention generated via ${providerName}.`
          },
          targetTab: 'students',
          voiceResponse: parsed.voiceResponse || `Intervention staged for ${studentName} on ${concept}.`
        }
      };
    }

    if (parsed.action === 'edit_marks' && parsed.marks) {
      const studentName = parsed.studentName || 'Aarav Sharma';
      const studentId = studentName.toLowerCase().includes('rahul') ? 'std-0' : 'std-1';

      return {
        rawText,
        action: 'edit_marks',
        actionOutcome: {
          type: 'edit_marks',
          payload: {
            studentId,
            studentName,
            concept: topic,
            score: parsed.marks.score,
            maxScore: parsed.marks.maxScore
          },
          targetTab: 'students',
          voiceResponse: parsed.voiceResponse || `Updated marks for ${studentName} to ${parsed.marks.score}/${parsed.marks.maxScore}.`
        }
      };
    }

    if (parsed.action === 'general_qa' || parsed.action === 'socratic_qa') {
      return {
        rawText,
        action: 'general_qa',
        actionOutcome: {
          type: 'general_qa',
          voiceResponse: parsed.voiceResponse || `Answered query on ${topic} using ${providerName}.`
        }
      };
    }

    let finalAction: VoiceCommandIntent['action'] = 'generate_lesson';
    if (parsed.action === 'replan_lesson' || parsed.action === 'replan_duration') {
      finalAction = 'replan_duration';
    } else if (parsed.action === 'navigate') {
      finalAction = 'navigate';
    }

    return {
      rawText,
      topic,
      grade: 7,
      subject: moduleName,
      durationMinutes: duration,
      languages: ['English'],
      action: finalAction
    };
  }
}

export const ollamaService = new OllamaService();
