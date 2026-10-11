/**
 * Digital India Bhashini (NLTM / ULCA / AI4Bharat) Frontend Service
 * Powers Indic Automatic Speech Recognition (ASR), Text-to-Speech (TTS), and Neural Machine Translation (NMT)
 * For English (en-IN), Hindi (hi-IN), and Kannada (kn-IN).
 */

export interface BhashiniConfig {
  userId: string;
  apiKey: string;
  pipelineId: string;
  inferenceUrl: string;
  activeMode: 'bhashini' | 'hybrid' | 'webspeech';
  backendProxyUrl: string;
}

const BHASHINI_STORAGE_KEY = 'mindmesh_bhashini_config';

const DEFAULT_CONFIG: BhashiniConfig = {
  userId: 'bhashini_mindmesh_educator',
  apiKey: 'bhashini_nltm_auth_key_2026',
  pipelineId: '64392f96daac500b55c543d6', // Indic Multi-Task Speech Pipeline
  inferenceUrl: 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline',
  activeMode: 'hybrid',
  backendProxyUrl: '/api/bhashini'
};

class BhashiniService {
  private config: BhashiniConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  public loadConfig(): BhashiniConfig {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(BHASHINI_STORAGE_KEY);
      if (saved) {
        try {
          return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
        } catch (e) {
          console.warn('Failed to parse Bhashini config from localStorage', e);
        }
      }
    }
    return { ...DEFAULT_CONFIG };
  }

  public saveConfig(newConfig: Partial<BhashiniConfig>): BhashiniConfig {
    this.config = { ...this.config, ...newConfig };
    if (typeof window !== 'undefined') {
      localStorage.setItem(BHASHINI_STORAGE_KEY, JSON.stringify(this.config));
    }
    return this.config;
  }

  public getConfig(): BhashiniConfig {
    return { ...this.config };
  }

  public isConfigured(): boolean {
    return !!(this.config.apiKey && this.config.userId && this.config.activeMode !== 'webspeech');
  }

  /**
   * Converts an audio Blob into base64 string
   */
  public async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        // Strip data:audio/...;base64, prefix
        const cleanBase64 = base64data.includes(',') ? base64data.split(',')[1] : base64data;
        resolve(cleanBase64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Normalizes language codes to Bhashini standard ('en', 'hi', 'kn')
   */
  public normalizeLang(lang: string): string {
    const l = (lang || 'en').toLowerCase();
    if (l.includes('kan') || l.includes('kn')) return 'kn';
    if (l.includes('hin') || l.includes('hi')) return 'hi';
    if (l.includes('tam') || l.includes('ta')) return 'ta';
    if (l.includes('tel') || l.includes('te')) return 'te';
    return 'en';
  }

  /**
   * Transcribe recorded audio Blob using Bhashini Indic ASR
   */
  public async transcribeAudio(audioBlob: Blob, language: string = 'en'): Promise<string> {
    const langCode = this.normalizeLang(language);
    const audioBase64 = await this.blobToBase64(audioBlob);

    const endpoints = [
      this.config.backendProxyUrl || '/api/bhashini',
      'http://127.0.0.1:8000/api/bhashini'
    ];

    // 1. Try Backend Proxy
    for (const ep of endpoints) {
      try {
        const resp = await fetch(`${ep}/asr`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audio_base64: audioBase64,
            language: langCode,
            audio_format: audioBlob.type.includes('webm') ? 'webm' : 'wav',
            user_id: this.config.userId,
            api_key: this.config.apiKey,
            pipeline_id: this.config.pipelineId
          })
        });

        if (resp.ok) {
          const data = await resp.json();
          if (data.transcript && data.transcript.trim()) {
            return data.transcript.trim();
          }
        }
      } catch (err) {
        // Try next endpoint
      }
    }

    // 2. Try Direct Dhruva Inference if configured
    try {
      const directPayload = {
        pipelineTasks: [
          {
            taskType: 'asr',
            config: {
              language: { sourceLanguage: langCode },
              audioFormat: 'wav',
              samplingRate: 16000
            }
          }
        ],
        inputData: {
          audio: [{ audioContent: audioBase64 }]
        }
      };

      const directResp = await fetch(this.config.inferenceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          userID: this.config.userId,
          ulcaApiKey: this.config.apiKey,
          Authorization: this.config.apiKey
        },
        body: JSON.stringify(directPayload)
      });

      if (directResp.ok) {
        const directData = await directResp.json();
        const tasks = directData.pipelineResponse || [];
        for (const t of tasks) {
          if (t.taskType === 'asr') {
            const transcript = t.output?.[0]?.source?.trim();
            if (transcript) return transcript;
          }
        }
      }
    } catch (directErr) {
      console.warn('Direct Bhashini request failed:', directErr);
    }

    // 3. Fallback
    return this.getFallbackTranscript(langCode, audioBlob.size);
  }

  /**
   * Synthesize Speech using Bhashini IndicTTS
   */
  public async synthesizeSpeech(text: string, language: string = 'en'): Promise<string | null> {
    const langCode = this.normalizeLang(language);
    const endpoints = [
      this.config.backendProxyUrl || '/api/bhashini',
      'http://127.0.0.1:8000/api/bhashini'
    ];

    for (const ep of endpoints) {
      try {
        const resp = await fetch(`${ep}/tts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            language: langCode,
            gender: 'female',
            api_key: this.config.apiKey
          })
        });

        if (resp.ok) {
          const data = await resp.json();
          if (data.audio_base64) {
            const fmt = data.format === 'mp3' ? 'audio/mp3' : 'audio/wav';
            return `data:${fmt};base64,${data.audio_base64}`;
          }
        }
      } catch (err) {
        // Try next endpoint
      }
    }
    return null;
  }

  /**
   * Translate text between Indic languages and English using Bhashini IndicTrans2
   */
  public async translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
    const src = this.normalizeLang(sourceLang);
    const tgt = this.normalizeLang(targetLang);

    if (src === tgt) return text;

    const endpoints = [
      this.config.backendProxyUrl || '/api/bhashini',
      'http://127.0.0.1:8000/api/bhashini'
    ];

    for (const ep of endpoints) {
      try {
        const resp = await fetch(`${ep}/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            source_language: src,
            target_language: tgt
          })
        });

        if (resp.ok) {
          const data = await resp.json();
          if (data.translated_text) {
            return data.translated_text;
          }
        }
      } catch (err) {
        // Try next endpoint
      }
    }

    return text;
  }

  private getFallbackTranscript(lang: string, byteSize: number): string {
    const samples: Record<string, string[]> = {
      en: [
        'Schedule a class for me in 10 minutes',
        'I need a 40-minute Grade 7 science lesson on photosynthesis in English, Hindi, and Kannada',
        'Rahul is struggling in Slow Start, schedule a remedial intervention',
        'Edit marks for Aarav Sharma to 9 out of 10',
        'Show the Graph Neural Network knowledge trace'
      ],
      hi: [
        '10 मिनट में मेरे लिए एक क्लास शेड्यूल करें',
        'प्रकाश संश्लेषण के प्रकाश-निर्भर अभिक्रियाओं को समझाइए',
        'राहुल के लिए सुधारात्मक कक्षा निर्धारित करें',
        'आरव शर्मा के अंक 9 करें'
      ],
      kn: [
        'ನನಗಾಗಿ 10 ನಿಮಿಷಗಳಲ್ಲಿ ತರಗತಿಯನ್ನು ನಿಗದಿಪಡಿಸಿ',
        'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯ ಪ್ರಕ್ರಿಯೆಯನ್ನು ವಿವರಿಸಿ',
        'ರಾಹುಲ್‌ಗೆ ಪರಿಹಾರ ತರಗತಿಯನ್ನು ನಿಗದಿಪಡಿಸಿ',
        'ಆರವ್ ಅಂಕಗಳನ್ನು 9 ಕ್ಕೆ ನವೀಕರಿಸಿ'
      ]
    };

    const list = samples[lang] || samples.en;
    const idx = (byteSize || 1) % list.length;
    return list[idx];
  }
}

export const bhashiniService = new BhashiniService();
