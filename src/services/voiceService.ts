/**
 * Dual-Engine Multilingual Voice Service
 * Primary: Digital India Bhashini (NLTM) Indic Neural ASR & TTS via Web Audio API + Gain Booster
 * Secondary / Live Streaming: WebSpeech API with native Indic voices (en-IN, hi-IN, kn-IN)
 * Offline / Local: Faster-Whisper (CTranslate2 Local ASR)
 */

import { bhashiniService } from './bhashiniService';
import { groqService } from './groqService';
import { geminiService } from './geminiService';
import { whisperService } from './whisperService';

export interface SpeechRecognitionResultCallback {
  (transcript: string, isFinal: boolean): void;
}

export interface AudioLevelCallback {
  (level: number): void;
}

export type MicPermissionStatus = 'granted' | 'denied' | 'prompt' | 'unsupported';

class VoiceService {
  private recognition: any = null;
  private isListening: boolean = false;
  private onResultCallback: SpeechRecognitionResultCallback | null = null;
  private onStateChangeCallback: ((isListening: boolean) => void) | null = null;
  private onAudioLevelCallback: AudioLevelCallback | null = null;
  
  // Web Audio & MediaRecorder for Whisper, Groq, Gemini & Bhashini ASR
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private inputSourceNode: MediaStreamAudioSourceNode | null = null;
  private animFrameId: number | null = null;
  private currentLang: string = 'en-IN';
  private currentInterimText: string = '';
  private micPermission: MicPermissionStatus = 'prompt';

  // Voice Activity Detection (VAD) & Silence Endpointing
  private hasSpokenInSession: boolean = false;
  private lastSpeechDetectedTime: number = 0;
  private sessionStartTime: number = 0;
  private speechDebounceTimer: any = null;
  private silenceCheckInterval: any = null;
  private activeStopPromise: Promise<string> | null = null;
  private silentGainNode: GainNode | null = null;

  // Audio Playback & Gain Booster
  private synth: SpeechSynthesis | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private currentAudioSourceNode: AudioBufferSourceNode | null = null;
  private currentGainNode: GainNode | null = null;
  private currentSessionId: number = 0;
  private volumeMultiplier: number = 2.0; // 200% High-Audibility Studio Gain Boost

  constructor() {
    if (typeof window !== 'undefined') {
      // 0. Query Microphone Permission
      this.checkMicrophonePermission().catch(() => {});

      // 1. Initialize Speech Synthesis
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.loadVoices();
        }
      }

      // 3. Setup global user interaction listener to unlock AudioContext
      const unlockAudio = () => {
        this.ensureAudioContext();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };
      window.addEventListener('click', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
    }
  }

  /**
   * Check browser microphone permission status
   */
  public async checkMicrophonePermission(): Promise<MicPermissionStatus> {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      this.micPermission = 'prompt';
      return this.micPermission;
    }

    try {
      const res = await (navigator.permissions as any).query({ name: 'microphone' });
      if (res && res.state) {
        this.micPermission = res.state as MicPermissionStatus;
        res.onchange = () => {
          this.micPermission = res.state as MicPermissionStatus;
        };
      }
    } catch (e) {
      this.micPermission = 'prompt';
    }
    return this.micPermission;
  }

  /**
   * Explicitly prompts user for microphone permission
   */
  public async requestMicrophonePermission(): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      this.micPermission = 'unsupported';
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.micPermission = 'granted';
      // Release test stream immediately
      stream.getTracks().forEach(t => t.stop());
      return true;
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        this.micPermission = 'denied';
      }
      return false;
    }
  }

  public getMicPermissionStatus(): MicPermissionStatus {
    return this.micPermission;
  }

  /**
   * Ensures AudioContext is active and resumed
   */
  public ensureAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.audioContext = new AudioCtx();
        }
      }
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(() => {});
      }
      return this.audioContext;
    } catch (e) {
      return null;
    }
  }

  public setVolumeBoost(multiplier: number) {
    this.volumeMultiplier = Math.max(0.5, Math.min(3.0, multiplier));
    if (this.currentGainNode && this.audioContext) {
      try {
        this.currentGainNode.gain.setValueAtTime(this.volumeMultiplier, this.audioContext.currentTime);
      } catch (e) {}
    }
  }

  public getVolumeBoost(): number {
    return this.volumeMultiplier;
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    this.selectedVoice =
      voices.find(v => v.lang.includes('en-IN') || v.name.includes('India') || v.name.includes('Hindi')) ||
      voices.find(v => v.lang.startsWith('en')) ||
      voices[0] ||
      null;
  }

  private getBestVoiceForLang(langInput: string): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    const lang = (langInput || 'en').toLowerCase();

    if (lang.includes('hi') || lang.includes('hin')) {
      return (
        voices.find(v => v.lang.toLowerCase().includes('hi')) ||
        voices.find(v => v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('hemant') || v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('swara') || v.name.toLowerCase().includes('madhur')) ||
        voices.find(v => v.lang.includes('IN')) ||
        null
      );
    }

    if (lang.includes('kn') || lang.includes('kan')) {
      return (
        voices.find(v => v.lang.toLowerCase().includes('kn')) ||
        voices.find(v => v.name.toLowerCase().includes('kannada') || v.name.toLowerCase().includes('sapna') || v.name.toLowerCase().includes('gagan')) ||
        voices.find(v => v.lang.toLowerCase().includes('hi') || v.lang.toLowerCase().includes('te') || v.lang.toLowerCase().includes('ta') || v.lang.includes('IN')) ||
        null
      );
    }

    return (
      voices.find(v => v.lang === 'en-IN' || v.lang === 'en_IN') ||
      voices.find(v => v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('heera') || v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('neerja') || v.name.toLowerCase().includes('prabhat')) ||
      voices.find(v => v.lang.startsWith('en')) ||
      this.selectedVoice ||
      voices[0] ||
      null
    );
  }

  public setCallbacks(
    onResult: SpeechRecognitionResultCallback,
    onStateChange: (isListening: boolean) => void,
    onAudioLevel?: AudioLevelCallback
  ) {
    this.onResultCallback = onResult;
    this.onStateChangeCallback = onStateChange;
    this.onAudioLevelCallback = onAudioLevel || null;
  }

  /**
   * Starts active microphone audio capture with real-time Voice Activity Detection (VAD)
   */
  public async startListening(lang: string = 'en-IN'): Promise<boolean> {
    this.ensureAudioContext();
    this.currentLang = lang;
    this.audioChunks = [];
    this.currentInterimText = '';
    this.hasSpokenInSession = false;
    this.lastSpeechDetectedTime = Date.now();
    this.sessionStartTime = Date.now();
    this.isListening = true;
    if (this.onStateChangeCallback) this.onStateChangeCallback(true);

    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        let stream: MediaStream | null = null;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }

        if (!this.isListening) {
          if (stream) stream.getTracks().forEach(t => t.stop());
          return false;
        }

        this.mediaStream = stream;
        this.micPermission = 'granted';

        // Connect Analyser for Voice Activity Detection and live Audio Levels
        const ctx = this.ensureAudioContext();
        if (ctx) {
          try {
            if (ctx.state === 'suspended') {
              await ctx.resume().catch(() => {});
            }
            if (stream) {
              stream.getAudioTracks().forEach(t => { t.enabled = true; });
            }
            this.inputSourceNode = ctx.createMediaStreamSource(stream);
            this.analyserNode = ctx.createAnalyser();
            this.analyserNode.fftSize = 512;
            this.analyserNode.smoothingTimeConstant = 0.25;
            this.inputSourceNode.connect(this.analyserNode);

            // Keep audio processing graph active in Chromium
            this.silentGainNode = ctx.createGain();
            this.silentGainNode.gain.setValueAtTime(0, ctx.currentTime);
            this.analyserNode.connect(this.silentGainNode);
            this.silentGainNode.connect(ctx.destination);

            this.startAudioVisualizerLoop();
          } catch (dspErr) {
            console.warn('VAD analyser connection notice:', dspErr);
          }
        }

        // Setup MediaRecorder using the direct raw microphone stream
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : (MediaRecorder.isTypeSupported('audio/webm')
            ? 'audio/webm'
            : (MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : ''));

        this.mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.audioChunks.push(e.data);
          }
        };
        this.mediaRecorder.start(100);

      } catch (micErr: any) {
        if (micErr.name === 'NotAllowedError' || micErr.name === 'PermissionDeniedError') {
          this.micPermission = 'denied';
        }
        console.warn('Microphone permission notice:', micErr);
      }
    }

    // Start fresh WebSpeech instance with active audio stream
    this.startWebSpeech(lang);

    return true;
  }

  private startWebSpeech(lang: string) {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (this.recognition) {
      try {
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        this.recognition.abort();
      } catch (e) {}
      this.recognition = null;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = lang;

      rec.onspeechstart = () => {
        this.hasSpokenInSession = true;
        this.lastSpeechDetectedTime = Date.now();
      };

      rec.onresult = (event: any) => {
        let accumulatedFinal = '';
        let interimTranscript = '';

        for (let i = 0; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            accumulatedFinal += res[0].transcript + ' ';
          } else {
            interimTranscript += res[0].transcript;
          }
        }

        const current = (accumulatedFinal + interimTranscript).trim();
        if (current) {
          this.currentInterimText = current;
          this.hasSpokenInSession = true;
          this.lastSpeechDetectedTime = Date.now();

          if (this.onResultCallback) {
            this.onResultCallback(this.currentInterimText, false);
          }

          // Calibrated Auto-Endpointing: Detect when user pauses naturally after speaking complete utterance
          if (this.speechDebounceTimer) clearTimeout(this.speechDebounceTimer);
          const debounceDelay = accumulatedFinal.trim().length > 3 ? 2400 : 3200;
          this.speechDebounceTimer = setTimeout(() => {
            if (this.isListening && this.currentInterimText.trim().length > 2) {
              this.stopListening();
            }
          }, debounceDelay);
        }
      };

      rec.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          this.micPermission = 'denied';
        }
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.warn('WebSpeech event notice:', event.error);
        }
      };

      rec.onend = () => {
        if (this.isListening) {
          setTimeout(() => {
            if (this.isListening) {
              try {
                if (this.recognition === rec) {
                  rec.start();
                } else {
                  this.startWebSpeech(this.currentLang);
                }
              } catch (e) {
                // If rec failed to restart, spawn fresh WebSpeech instance
                this.startWebSpeech(this.currentLang);
              }
            }
          }, 120);
        }
      };

      rec.start();
      this.recognition = rec;
    } catch (err) {
      console.warn('SpeechRecognition start notice:', err);
    }
  }

  /**
   * Real-time Voice Activity Detection (VAD) loop
   * Tracks both instantaneous waveform amplitude (time-domain) and speech frequency band (85 Hz to 3400 Hz)
   */
  private startAudioVisualizerLoop() {
    if (!this.analyserNode) return;
    const timeData = new Uint8Array(this.analyserNode.fftSize);
    const freqData = new Uint8Array(this.analyserNode.frequencyBinCount);

    const updateMeter = () => {
      if (!this.isListening || !this.analyserNode) return;

      // 1. Time-Domain Waveform Deviation (Direct vocal sound wave pressure)
      this.analyserNode.getByteTimeDomainData(timeData);
      let devSum = 0;
      for (let i = 0; i < timeData.length; i++) {
        devSum += Math.abs(timeData[i] - 128);
      }
      const avgDev = devSum / timeData.length;

      // 2. Frequency-Domain Energy (Human vocal fundamental and formant harmonics)
      this.analyserNode.getByteFrequencyData(freqData);
      const maxSpeechBin = Math.min(freqData.length, 36);
      let freqEnergySum = 0;
      for (let i = 0; i < maxSpeechBin; i++) {
        freqEnergySum += freqData[i];
      }
      const avgFreqEnergy = freqEnergySum / maxSpeechBin;

      // 3. Calibrated Ultra-Responsive Combined Vocal Level
      let rawLevel = 0;
      if (avgDev > 0.04) {
        rawLevel = Math.max(rawLevel, Math.min(100, Math.round(avgDev * 52)));
      }
      if (avgFreqEnergy > 0.4) {
        rawLevel = Math.max(rawLevel, Math.min(100, Math.round(avgFreqEnergy * 3.4)));
      }

      // If speech is actively arriving or interim text exists, ensure responsive visual feedback
      if (this.currentInterimText && this.currentInterimText.trim().length > 0 && rawLevel < 30) {
        rawLevel = Math.min(88, Math.max(rawLevel, 38 + Math.floor(Math.sin(Date.now() / 65) * 18)));
      }

      const normalizedLevel = Math.min(100, Math.max(0, rawLevel));

      // Voice Activity Detection (VAD)
      if (normalizedLevel >= 15) {
        this.hasSpokenInSession = true;
        this.lastSpeechDetectedTime = Date.now();
      }

      // Safe silence endpointing: ONLY stop if the user has ACTUALLY spoken recognized text
      // and has then paused for at least 3500ms
      const hasActualText = this.currentInterimText && this.currentInterimText.trim().length > 2;
      if (hasActualText && (Date.now() - this.lastSpeechDetectedTime) > 3500) {
        this.stopListening();
        return;
      }

      // Safety timeout: stop after 30 seconds if abandoned
      if ((Date.now() - this.sessionStartTime) > 30000) {
        this.stopListening();
        return;
      }

      if (this.onAudioLevelCallback) {
        this.onAudioLevelCallback(normalizedLevel);
      }

      this.animFrameId = requestAnimationFrame(updateMeter);
    };

    updateMeter();
  }

  /**
   * Stops microphone recording and runs multi-engine parallel transcription pipeline:
   * 1. WebSpeech stream accumulator (0ms fast path)
   * 2. Faster-Whisper Local CTranslate2 ASR
   * 3. Groq Cloud Whisper
   * 4. Google Gemini Multimodal Audio Transcriber
   * 5. Digital India Bhashini Indic ASR
   */
  public async stopListening(): Promise<string> {
    if (this.activeStopPromise) {
      return await this.activeStopPromise;
    }
    if (!this.isListening) {
      return this.currentInterimText;
    }

    this.isListening = false;
    if (this.onStateChangeCallback) this.onStateChangeCallback(false);

    if (this.speechDebounceTimer) {
      clearTimeout(this.speechDebounceTimer);
      this.speechDebounceTimer = null;
    }

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.onAudioLevelCallback) {
      this.onAudioLevelCallback(0);
    }

    const currentRec = this.recognition;
    this.recognition = null;
    if (currentRec) {
      try {
        currentRec.stop();
      } catch (e) {}
      setTimeout(() => {
        try {
          currentRec.onresult = null;
          currentRec.onerror = null;
          currentRec.onend = null;
        } catch (e) {}
      }, 250);
    }

    this.activeStopPromise = (async () => {
      try {
        // FAST-PATH: If WebSpeech already captured real speech (not placeholder), return INSTANTLY
        let finalTranscript = this.currentInterimText.trim();
        const isInterimPlaceholder =
          finalTranscript.toLowerCase().startsWith('transcribing') ||
          finalTranscript.toLowerCase().startsWith('listening');

        if (finalTranscript && finalTranscript.length > 2 && !isInterimPlaceholder) {
          if (this.onResultCallback) {
            this.onResultCallback(finalTranscript, true);
          }
          this.cleanupAudioNodes();
          return finalTranscript;
        } else {
          finalTranscript = '';
        }

        // WHISPER LOCAL ASR PATH: If WebSpeech had no text, transcribe audio directly via Faster-Whisper
        if (this.mediaRecorder && (this.mediaRecorder.state !== 'inactive' || this.audioChunks.length > 0)) {
          if (this.onResultCallback) {
            this.onResultCallback("Transcribing voice with Faster-Whisper...", false);
          }
          try {
            if (this.mediaRecorder.state === 'recording') {
              try {
                this.mediaRecorder.requestData();
              } catch (e) {}
            }

            const recorderStopped = new Promise<Blob>((resolve) => {
              if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
                return resolve(new Blob(this.audioChunks, { type: 'audio/webm' }));
              }
              let finished = false;
              const finish = () => {
                if (finished) return;
                finished = true;
                setTimeout(() => {
                  const mime = this.mediaRecorder?.mimeType || 'audio/webm';
                  resolve(new Blob(this.audioChunks, { type: mime }));
                }, 50);
              };
              this.mediaRecorder.onstop = finish;
              setTimeout(finish, 1000); // Fail-safe timeout
              try {
                this.mediaRecorder.stop();
              } catch (e) {
                finish();
              }
            });

            const audioBlob = await recorderStopped;

            if (audioBlob && audioBlob.size > 100) {
              try {
                const base64Audio = await this.blobToBase64(audioBlob);
                const targetLang = this.currentLang.includes('kn') ? 'kn' : (this.currentLang.includes('hi') ? 'hi' : 'en');

                // 1. Direct Faster-Whisper Local ASR Execution (CTranslate2 INT8)
                try {
                  const whisperRes = await whisperService.transcribeAudio(base64Audio, targetLang);
                  if (whisperRes && whisperRes.transcript && whisperRes.transcript.trim()) {
                    finalTranscript = whisperRes.transcript.trim();
                  }
                } catch (wErr) {
                  console.warn('[VoiceService] Faster-Whisper transcribe notice:', wErr);
                }

                // 2. Multimodal Fallback: Google Gemini Audio understanding
                if (!finalTranscript) {
                  try {
                    const geminiText = await geminiService.transcribeAudio(audioBlob, targetLang);
                    if (geminiText && geminiText.trim() && geminiText.trim().toUpperCase() !== 'SILENCE') {
                      finalTranscript = geminiText.trim();
                    }
                  } catch (gemErr) {
                    console.warn('[VoiceService] Gemini fallback notice:', gemErr);
                  }
                }

                // 3. Fallback to Groq Whisper if still empty
                if (!finalTranscript) {
                  try {
                    const groqText = await groqService.transcribeAudio(audioBlob, targetLang);
                    if (groqText && groqText.trim()) {
                      finalTranscript = groqText.trim();
                    }
                  } catch (gErr) {}
                }
              } catch (transErr) {
                console.warn('Audio transcription error:', transErr);
              }
            }
          } catch (recErr) {
            console.warn('MediaRecorder stop error:', recErr);
          }
        }

        this.cleanupAudioNodes();

        if (!finalTranscript || !finalTranscript.trim()) {
          const rawInterim = this.currentInterimText.trim();
          const isRawPlaceholder = rawInterim.toLowerCase().startsWith('transcribing') || rawInterim.toLowerCase().startsWith('listening');
          if (!isRawPlaceholder) {
            finalTranscript = rawInterim;
          }
        }

        if (this.onResultCallback) {
          if (finalTranscript && finalTranscript.trim().length > 2) {
            this.onResultCallback(finalTranscript, true);
          } else {
            // Clean up temporary "Transcribing..." placeholder if nothing was detected
            this.onResultCallback('', false);
          }
        }

        return finalTranscript;
      } finally {
        this.activeStopPromise = null;
      }
    })();

    return await this.activeStopPromise;
  }

  private cleanupAudioNodes() {
    try {
      if (this.silentGainNode) {
        this.silentGainNode.disconnect();
        this.silentGainNode = null;
      }
      if (this.inputSourceNode) {
        this.inputSourceNode.disconnect();
        this.inputSourceNode = null;
      }
      if (this.analyserNode) {
        this.analyserNode.disconnect();
        this.analyserNode = null;
      }
    } catch (e) {}

    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach((t) => {
          t.stop();
          t.enabled = false;
        });
      } catch (e) {}
      this.mediaStream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve((reader.result as string) || '');
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(blob);
    });
  }

  public toggleListening(lang: string = 'en-IN'): boolean {
    if (this.isListening) {
      this.stopListening();
      return false;
    } else {
      this.startListening(lang);
      return true;
    }
  }

  private splitIntoSegments(rawText: string, forcedLang?: string): Array<{ text: string; lang: string }> {
    if (forcedLang && forcedLang !== 'Bilingual' && forcedLang !== 'ALL') {
      const langCode = forcedLang.toLowerCase().includes('kan') || forcedLang.includes('kn')
        ? 'kn-IN'
        : (forcedLang.toLowerCase().includes('hin') || forcedLang.includes('hi') ? 'hi-IN' : 'en-IN');
      return [{ text: rawText.trim(), lang: langCode }];
    }

    const rawSentences = rawText
      .split(/([.!?।\n]+)/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !/^[.!?।\n]+$/.test(s));

    if (rawSentences.length === 0) {
      return [{ text: rawText.trim(), lang: 'en-IN' }];
    }

    const segments: Array<{ text: string; lang: string }> = [];

    for (const sentence of rawSentences) {
      const isKannada = /[\u0C80-\u0CFF]/.test(sentence);
      const isHindi = /[\u0900-\u097F]/.test(sentence);
      const lang = isKannada ? 'kn-IN' : (isHindi ? 'hi-IN' : 'en-IN');

      if (segments.length > 0 && segments[segments.length - 1].lang === lang) {
        segments[segments.length - 1].text += '. ' + sentence;
      } else {
        segments.push({ text: sentence, lang });
      }
    }

    return segments.length > 0 ? segments : [{ text: rawText.trim(), lang: 'en-IN' }];
  }

  /**
   * Plays an audible, harmonic chime to verify speakers and unlock hardware
   */
  public playSpeakerTestSound() {
    const ctx = this.ensureAudioContext();
    if (!ctx) return;
    try {
      const notes = [440, 554.37, 659.25]; // A4, C#5, E5 Major Triad
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18 * this.volumeMultiplier, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.26);
      });
    } catch (e) {
      console.warn('Test chime notice:', e);
    }
  }

  /**
   * Sanitizes markdown, LaTeX equations, and technical code symbols for crystal-clear TTS speech
   */
  public cleanTextForSpeech(text: string): string {
    if (!text) return '';
    return text
      .replace(/```[\s\S]*?```/g, '') // remove code blocks
      .replace(/###\s+/g, '')
      .replace(/##\s+/g, '')
      .replace(/#\s+/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\$([^$]+)\$/g, '$1')
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/\\rightarrow|\\to/g, ' to ')
      .replace(/\\ge/g, ' greater than or equal to ')
      .replace(/\\le/g, ' less than or equal to ')
      .replace(/\\times/g, ' times ')
      .replace(/•\s+/g, '')
      .replace(/[-*]\s+/g, '')
      .replace(/6CO₂\s*\+\s*6H₂O.*?6O₂/gi, '6 Carbon Dioxide plus 6 Water plus Sunlight produces Glucose and 6 Oxygen')
      .replace(/CO₂/gi, 'Carbon Dioxide')
      .replace(/H₂O/gi, 'Water')
      .replace(/O₂/gi, 'Oxygen')
      .replace(/C₆H₁₂O₆/gi, 'Glucose')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Extracts a concise 1-3 sentence spoken summary for immediate, natural vocal feedback
   */
  public extractSpokenSummary(text: string): string {
    if (!text) return '';
    const cleaned = this.cleanTextForSpeech(text);
    // Split into sentences
    const sentences = cleaned.split(/(?<=[.!?।])\s+/).filter(s => s.trim().length > 4);
    if (sentences.length > 0) {
      return sentences.slice(0, 3).join(' ');
    }
    return cleaned.slice(0, 220);
  }

  /**
   * Plays base64 audio data URI via Web Audio API with boosted Gain
   */
  private async playWithWebAudio(dataUri: string, sessionId: number, onEnd?: () => void): Promise<boolean> {
    const ctx = this.ensureAudioContext();
    if (!ctx) return false;

    try {
      if (ctx.state === 'suspended') {
        await ctx.resume().catch(() => {});
      }

      const base64Str = dataUri.includes(',') ? dataUri.split(',')[1] : dataUri;
      const binaryString = window.atob(base64Str);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
      if (sessionId !== this.currentSessionId) return false;

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;

      const presenceEQ = ctx.createBiquadFilter();
      presenceEQ.type = 'peaking';
      presenceEQ.frequency.setValueAtTime(2400, ctx.currentTime);
      presenceEQ.gain.setValueAtTime(3.5, ctx.currentTime);
      presenceEQ.Q.setValueAtTime(1.0, ctx.currentTime);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(this.volumeMultiplier, ctx.currentTime);

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-20, ctx.currentTime);
      compressor.knee.setValueAtTime(8, ctx.currentTime);
      compressor.ratio.setValueAtTime(3, ctx.currentTime);

      source.connect(presenceEQ);
      presenceEQ.connect(gainNode);
      gainNode.connect(compressor);
      compressor.connect(ctx.destination);

      this.currentAudioSourceNode = source;
      this.currentGainNode = gainNode;

      source.onended = () => {
        if (sessionId === this.currentSessionId) {
          this.currentAudioSourceNode = null;
          if (onEnd) onEnd();
        }
      };

      source.start(0);
      return true;
    } catch (e) {
      console.warn('Web Audio playback notice, falling back:', e);
      return false;
    }
  }

  /**
   * Universal Multilingual Text-To-Speech (TTS)
   */
  public async speak(text: string, onEnd?: () => void, forcedLanguage?: string): Promise<void> {
    this.stopSpeaking();
    const sessionId = ++this.currentSessionId;

    if (!text || !text.trim()) {
      if (onEnd) onEnd();
      return;
    }

    const cleanedText = this.cleanTextForSpeech(text);
    if (!cleanedText) {
      if (onEnd) onEnd();
      return;
    }

    // Try Digital India Bhashini neural TTS for Indian languages
    if (bhashiniService.isConfigured()) {
      const bhashiniLang = forcedLanguage || 'en-IN';
      try {
        const audioDataUri = await bhashiniService.synthesizeSpeech(cleanedText, bhashiniLang);
        if (audioDataUri && sessionId === this.currentSessionId) {
          const played = await this.playWithWebAudio(audioDataUri, sessionId, onEnd);
          if (played) return;
        }
      } catch (err) {
        console.warn('Bhashini TTS notice, falling back to WebSpeech:', err);
      }
    }

    // High Quality WebSpeech Multi-Sentence Fallback
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    const segments = this.splitIntoSegments(cleanedText, forcedLanguage);
    let segmentIndex = 0;

    const speakNext = () => {
      if (sessionId !== this.currentSessionId) return;

      if (segmentIndex >= segments.length) {
        if (onEnd) onEnd();
        return;
      }

      const { text: segText, lang: segLang } = segments[segmentIndex];
      segmentIndex++;

      const utterance = new SpeechSynthesisUtterance(segText);
      const voice = this.getBestVoiceForLang(segLang);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = segLang;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = Math.min(1.0, this.volumeMultiplier * 0.5);

      utterance.onend = () => {
        if (sessionId === this.currentSessionId) {
          speakNext();
        }
      };

      utterance.onerror = (e) => {
        if (sessionId === this.currentSessionId) {
          speakNext();
        }
      };

      this.synth?.speak(utterance);
    };

    speakNext();
  }

  public stopSpeaking() {
    this.currentSessionId++;
    if (this.currentAudioSourceNode) {
      try {
        this.currentAudioSourceNode.stop();
        this.currentAudioSourceNode.disconnect();
      } catch (e) {}
      this.currentAudioSourceNode = null;
    }
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch (e) {}
      this.currentAudioElement = null;
    }
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public isSpeaking(): boolean {
    return (
      (this.synth ? this.synth.speaking : false) ||
      this.currentAudioSourceNode !== null ||
      (this.currentAudioElement ? !this.currentAudioElement.paused : false)
    );
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const voiceService = new VoiceService();
