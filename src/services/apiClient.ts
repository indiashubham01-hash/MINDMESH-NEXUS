/**
 * MINDMESH-NEXUS Unified Backend API Client
 * Connects React Frontend with FastAPI Brain Gateway (http://127.0.0.1:8000)
 */

export interface BackendHealth {
  connected: boolean;
  project?: string;
  description?: string;
  primaryLlm?: string;
  rateLimit?: string;
  latencyMs?: number;
  timestamp: string;
}

class ApiClient {
  // Uses Vite proxy in development or direct base URL
  private baseUrl = '';
  private directUrl = (import.meta as any).env?.VITE_BACKEND_URL || 'https://mindmesh-nexus.onrender.com';
  private isOnline = true;
  private lastHealthCheck: BackendHealth = {
    connected: false,
    timestamp: new Date().toISOString()
  };

  constructor() {
    this.checkHealth();
  }

  /**
   * Helper fetch method that tries proxy first, then direct fallback
   */
  private async request<T = any>(
    path: string,
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: string | null; isBackend: boolean }> {
    const url = path.startsWith('/') ? path : `/${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    };

    // 1. Try relative path (Vite proxy)
    try {
      const resp = await fetch(url, { ...options, headers });
      if (resp.ok) {
        const data = await resp.json();
        this.isOnline = true;
        return { data, error: null, isBackend: true };
      }
    } catch (e) {
      // Relative proxy error, try direct backend URL
    }

    // 2. Direct fallback
    try {
      const resp = await fetch(`${this.directUrl}${url}`, { ...options, headers });
      if (resp.ok) {
        const data = await resp.json();
        this.isOnline = true;
        return { data, error: null, isBackend: true };
      }
      const errText = await resp.text();
      return { data: null, error: `HTTP ${resp.status}: ${errText}`, isBackend: true };
    } catch (err: any) {
      this.isOnline = false;
      return { data: null, error: err?.message || 'Backend unreachable', isBackend: false };
    }
  }

  /**
   * Check backend health and latency
   */
  public async checkHealth(): Promise<BackendHealth> {
    const start = performance.now();
    const res = await this.request<any>('/');
    const latencyMs = Math.round(performance.now() - start);

    if (res.data) {
      this.lastHealthCheck = {
        connected: true,
        project: res.data.project,
        description: res.data.description,
        primaryLlm: res.data.primary_llm,
        rateLimit: res.data.rate_limit,
        latencyMs,
        timestamp: new Date().toISOString()
      };
    } else {
      this.lastHealthCheck = {
        connected: false,
        latencyMs,
        timestamp: new Date().toISOString()
      };
    }
    return this.lastHealthCheck;
  }

  public getHealthStatus(): BackendHealth {
    return this.lastHealthCheck;
  }

  // --- VOICE & LESSON PLAN ROUTES ---

  public async sendVoiceRequest(transcript: string, studentIds?: string[]) {
    return this.request('/voice-request', {
      method: 'POST',
      body: JSON.stringify({
        transcript,
        audio_transcript: transcript,
        student_ids: studentIds
      })
    });
  }

  public async generateLessonPlan(params: {
    topic: string;
    grade: number;
    subject: string;
    durationMinutes: number;
    languages: string[];
    teacherNotes?: string;
  }) {
    return this.request('/plans/generate', {
      method: 'POST',
      body: JSON.stringify({
        topic: params.topic,
        grade: params.grade,
        subject: params.subject,
        duration_minutes: params.durationMinutes,
        languages: params.languages,
        teacher_notes: params.teacherNotes
      })
    });
  }

  public async reviseLessonPlan(planId: string, revisionInstruction: string) {
    return this.request(`/plans/${planId}/revise`, {
      method: 'POST',
      body: JSON.stringify({
        revision_instruction: revisionInstruction
      })
    });
  }

  public async approveLessonPlan(planId: string) {
    return this.request(`/plans/${planId}/approve`, {
      method: 'POST'
    });
  }

  public async getLessonPlan(planId: string) {
    return this.request(`/plans/${planId}`);
  }

  // --- LEARNERS & ANALYTICS ---

  public async getClassRiskReport(classId: string = 'class-7a') {
    return this.request(`/class/${classId}/risk-report`);
  }

  public async getStudentProfile(studentId: string) {
    return this.request(`/learners/${studentId}/profile`);
  }

  public async getMlMetrics() {
    return this.request('/ml/model-metrics');
  }

  public async getRiiidMetrics() {
    return this.request('/ml/riiid-metrics');
  }

  // --- RESOURCES & SOURCES ---

  public async getResources() {
    return this.request('/resources');
  }

  public async uploadResource(body: {
    title: string;
    filename: string;
    file_type?: string;
    version_year: number;
    raw_text: string;
    authority_score?: number;
  }) {
    return this.request('/resources/upload', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  // --- QUIZZES ---

  public async getQuiz(quizId: string = 'quiz-photo-1') {
    return this.request(`/quizzes/${quizId}`);
  }

  public async submitQuizAttempt(quizId: string, studentId: string, answers: Record<number, number>) {
    return this.request(`/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({
        student_id: studentId,
        answers
      })
    });
  }

  // --- GNN & GRAPH ROUTES ---

  public async getGraphTopology(subject: string = 'Science') {
    return this.request(`/gnn/graph-topology?subject=${encodeURIComponent(subject)}`);
  }

  public async evaluateGNN(studentName: string, subject: string = 'Science') {
    return this.request('/gnn/evaluate', {
      method: 'POST',
      body: JSON.stringify({
        student_name: studentName,
        subject
      })
    });
  }

  public async extractGraph(curriculumText: string, topicTitle: string = 'Curriculum Module') {
    return this.request('/gnn/extract-graph', {
      method: 'POST',
      body: JSON.stringify({
        curriculum_text: curriculumText,
        topic_title: topicTitle
      })
    });
  }

  public async reroutePath(studentName: string, proactiveGaps: any[], curriculumText?: string) {
    return this.request('/gnn/reroute-path', {
      method: 'POST',
      body: JSON.stringify({
        student_name: studentName,
        proactive_gaps: proactiveGaps,
        curriculum_text: curriculumText
      })
    });
  }

  // --- AUTH & WHATSAPP OTP ---

  public async loginUser(identifier: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password })
    });
  }

  public async registerUser(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: string;
    preferred_language?: string;
    grade?: number;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  public async sendWhatsAppOtp(phone: string, name: string = 'User', purpose: string = 'register') {
    return this.request('/auth/send-whatsapp-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, name, purpose })
    });
  }

  public async verifyOtp(phone: string, otp: string) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp })
    });
  }

  // --- AGNES AI PLATFORM ---

  public async agnesChat(body: {
    prompt?: string;
    messages?: any[];
    verified_curriculum?: string;
    student_gap_data?: any;
    custom_api_key?: string;
    temperature?: number;
  }) {
    return this.request('/api/agnes/chat', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  public async agnesMetrics() {
    return this.request('/api/agnes/metrics');
  }

  public async agnesGenerateImage(prompt: string, size: string = '1024x1024', customKey?: string) {
    return this.request('/api/agnes/image', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        size,
        custom_api_key: customKey
      })
    });
  }

  // --- BHASHINI INDIC AI ---

  public async bhashiniStatus() {
    return this.request('/api/bhashini/status');
  }

  public async bhashiniAsr(audioBase64: string, language: string = 'en') {
    return this.request('/api/bhashini/asr', {
      method: 'POST',
      body: JSON.stringify({
        audio_base64: audioBase64,
        language
      })
    });
  }

  public async bhashiniTts(text: string, language: string = 'en', gender: string = 'female') {
    return this.request('/api/bhashini/tts', {
      method: 'POST',
      body: JSON.stringify({
        text,
        language,
        gender
      })
    });
  }

  public async bhashiniTranslate(text: string, sourceLang: string = 'en', targetLang: string = 'hi') {
    return this.request('/api/bhashini/translate', {
      method: 'POST',
      body: JSON.stringify({
        text,
        source_language: sourceLang,
        target_language: targetLang
      })
    });
  }

  // --- GOOGLE GEMINI AI ---

  public async geminiStatus() {
    return this.request('/api/gemini/status');
  }

  public async geminiChat(prompt: string, domain: string = 'Science / Engineering', language: string = 'English', customKey?: string) {
    return this.request('/api/gemini/chat', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        domain,
        language,
        custom_api_key: customKey
      })
    });
  }
}

export const apiClient = new ApiClient();
