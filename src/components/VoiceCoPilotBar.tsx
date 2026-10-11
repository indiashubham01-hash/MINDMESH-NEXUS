import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Send, 
  RefreshCw, 
  Volume2, 
  Zap,
  Radio,
  Flame,
  ShieldCheck,
  AlertCircle,
  Activity,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Presentation
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { voiceService } from '../services/voiceService';

interface VoiceCoPilotBarProps {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  transcript: string;
  audioLevel?: number;
  setTranscript: (text: string) => void;
  onToggleListen: () => void;
  onSubmitCommand: (text: string) => void;
  onToggleSpeech: () => void;
  agentSpeechSummary: string;
  onOpenBhashiniConfig?: () => void;
  onTogglePageReader?: () => void;
  isPageReaderOpen?: boolean;
}

export const VoiceCoPilotBar: React.FC<VoiceCoPilotBarProps> = ({
  isListening,
  isProcessing,
  isSpeaking,
  transcript,
  audioLevel = 0,
  setTranscript,
  onToggleListen,
  onSubmitCommand,
  onToggleSpeech,
  agentSpeechSummary,
  onOpenBhashiniConfig,
  onTogglePageReader,
  isPageReaderOpen,
}) => {
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [micPerm, setMicPerm] = useState<'granted' | 'denied' | 'prompt' | 'unsupported'>('prompt');
  const [selectedEngine, setSelectedEngine] = useState<'auto' | 'gemini' | 'groq'>('auto');

  useEffect(() => {
    voiceService.checkMicrophonePermission().then((status) => {
      setMicPerm(status);
    });
  }, [isListening]);

  const handleGrantMicPermission = async () => {
    const granted = await voiceService.requestMicrophonePermission();
    setMicPerm(granted ? 'granted' : 'denied');
    if (granted) {
      voiceService.playSpeakerTestSound();
    }
  };

  const DEMO_PROMPTS = [
    {
      id: 'p-judge',
      icon: '🎙️',
      label: '45m TCP Congestion Control (Judge Scenario)',
      prompt: 'Create a 45-minute lesson on TCP congestion control for my third-year students. Use my notes, and account for the fact that several students are weak in flow control.',
      tag: 'Judge Track'
    },
    {
      id: 'p-sched',
      icon: '📅',
      label: 'Schedule class in 10 min',
      prompt: 'Schedule a class for me in 10 min on Computer Networks TCP Flow Control.',
      tag: 'Calendar'
    },
    {
      id: 'p-interv',
      icon: '🎯',
      label: 'Rahul weak in Slow Start (Intervention)',
      prompt: 'My student Rahul Sharma is weak in Slow Start, schedule an intervention review and reassessment.',
      tag: 'Remedial'
    },
    {
      id: 'p-marks',
      icon: '📝',
      label: 'Edit marks for Aarav to 9/10',
      prompt: 'Edit marks for Aarav Sharma to 9 out of 10 in Slow Start.',
      tag: 'Gradebook'
    },
    {
      id: 'p-cn',
      icon: '🌐',
      label: '30m Computer Networks (CN Scaffolding)',
      prompt: 'I have a 30-minute class on Computer Networks (CN) to teach TCP Congestion Control and Flow Control. My student Rahul Sharma is weak in Slow Start and Flow Control, so please scaffold the lesson and update his Learning Twin.',
      tag: 'CN Deck'
    },
    {
      id: 'p-os-ai',
      icon: '🦙',
      label: '40m Open-Source AI (Ollama + Faster-Whisper)',
      prompt: 'Create a 40-minute lesson on Open-Source AI Systems: Local Ollama LLM inference and Faster-Whisper speech recognition with offline edge privacy.',
      tag: 'Open-Source AI'
    },
    {
      id: 'p-os-qa',
      icon: '🎙️',
      label: 'Voice Q&A: What is Open-Source AI?',
      prompt: 'What is Open-Source AI and how do Local Ollama and Faster-Whisper ensure zero-latency offline privacy?',
      tag: 'Open-Source AI'
    },
    {
      id: 'p2',
      icon: '⚡',
      label: 'Reduce to 20m (Class behind)',
      prompt: 'The class is behind; reduce this to 20 minutes.',
      tag: 'Replan'
    },
    {
      id: 'p-ds',
      icon: '📊',
      label: '45m Data Science (Decision Trees & Entropy)',
      prompt: 'I have a 45-minute class on VTU Data Science to teach Decision Trees, Shannon Entropy, and Information Gain for binary classification.',
      tag: 'Data Science'
    },
    {
      id: 'p-ollama',
      icon: '🦙',
      label: 'Local Ollama: Explain TCP Sliding Window (Offline)',
      prompt: 'Explain TCP Sliding Window protocol, sender buffer window (cwnd), and receiver buffer window (rwnd) for offline review.',
      tag: 'Ollama'
    },
    {
      id: 'p3',
      icon: '🌟',
      label: 'ಕನ್ನಡದಲ್ಲಿ ವಿವರಿಸಿ (Explain in Kannada)',
      prompt: 'ಕನ್ನಡದಲ್ಲಿ ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ (Photosynthesis) ಪಾಠವನ್ನು ವಿವರಿಸಿ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ರಸಪ್ರಶ್ನೆ ರಚಿಸಿ.',
      tag: 'ಕನ್ನಡ'
    }
  ];

  const handleChipClick = (prompt: string, id: string) => {
    setActiveChip(id);
    setTranscript(prompt);
    onSubmitCommand(prompt);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transcript.trim()) {
      onSubmitCommand(transcript.trim());
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 pb-2">
      <div className="relative rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden transition-all">
        
        {/* Microphone Permission Banner if denied */}
        {micPerm === 'denied' && (
          <div className="mb-3 px-3 py-2 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                Microphone permission is blocked in your browser. Click <strong>Allow Microphone</strong> to enable voice recognition.
              </span>
            </div>
            <button
              onClick={handleGrantMicPermission}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-xs transition-colors text-xs shrink-0 cursor-pointer"
            >
              Allow Microphone
            </button>
          </div>
        )}

        <div className="relative flex flex-col space-y-3.5">
          
          {/* 3-Step Guided Workflow Banner (Dynamically tracks Voice -> AI Plan -> Approval) */}
          <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-50/90 border border-slate-200/60 rounded-xl text-xs overflow-x-auto gap-2">
            
            {/* Step 1: Speak or Upload */}
            <button
              type="button"
              onClick={onToggleListen}
              className="flex items-center gap-2 whitespace-nowrap cursor-pointer hover:opacity-85 transition-all text-left"
              title={isListening ? "Listening... Click to stop and process" : "Click to speak with microphone"}
            >
              <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-300'
                  : isProcessing || (!isListening && agentSpeechSummary)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}>
                {isListening ? '●' : (isProcessing || (!isListening && agentSpeechSummary) ? '✓' : '1')}
              </span>
              <span className={`transition-colors ${
                isListening
                  ? 'font-bold text-rose-700'
                  : isProcessing || (!isListening && agentSpeechSummary)
                  ? 'font-medium text-slate-700'
                  : 'font-semibold text-slate-900'
              }`}>
                Step 1: Speak or Upload
              </span>
              <span className="text-[10px] hidden sm:inline text-slate-400">
                {isListening ? '(Listening...)' : isProcessing || (!isListening && agentSpeechSummary) ? '(Captured)' : '(Voice / PPT)'}
              </span>
            </button>

            <ArrowRight className="w-3 h-3 text-slate-300 shrink-0 hidden md:block" />

            {/* Step 2: AI Plan & Flowchart */}
            <button
              type="button"
              onClick={() => {
                if (transcript && transcript.trim().length > 2 && !isProcessing) {
                  onSubmitCommand(transcript.trim());
                }
              }}
              className="flex items-center gap-2 whitespace-nowrap cursor-pointer hover:opacity-85 transition-all text-left"
              title={isProcessing ? "AI is reasoning and planning..." : "Click to generate lesson plan"}
            >
              <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold transition-all ${
                isProcessing
                  ? 'bg-amber-500 text-white animate-spin ring-2 ring-amber-300'
                  : (!isListening && agentSpeechSummary)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {(!isListening && agentSpeechSummary) ? '✓' : '2'}
              </span>
              <span className={`transition-colors ${
                isProcessing
                  ? 'font-bold text-amber-700 animate-pulse'
                  : (!isListening && agentSpeechSummary)
                  ? 'font-medium text-slate-700'
                  : 'font-medium text-slate-500'
              }`}>
                Step 2: AI Plan & Flowchart
              </span>
              <span className="text-[10px] hidden sm:inline text-slate-400">
                {isProcessing ? '(Reasoning...)' : (!isListening && agentSpeechSummary) ? '(Generated)' : isListening ? '(Waiting...)' : '(3-Tier Scaffolding)'}
              </span>
            </button>

            <ArrowRight className="w-3 h-3 text-slate-300 shrink-0 hidden md:block" />

            {/* Step 3: Approve & Deliver */}
            <button
              type="button"
              onClick={() => {
                if (agentSpeechSummary) {
                  onToggleSpeech();
                }
              }}
              className="flex items-center gap-2 whitespace-nowrap cursor-pointer hover:opacity-85 transition-all text-left"
              title={agentSpeechSummary ? "Play/Pause audio response" : "Approve & Deliver lesson"}
            >
              <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold transition-all ${
                !isProcessing && !isListening && agentSpeechSummary
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 animate-pulse'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                3
              </span>
              <span className={`transition-colors ${
                !isProcessing && !isListening && agentSpeechSummary
                  ? 'font-bold text-indigo-700'
                  : 'font-medium text-slate-500'
              }`}>
                Step 3: Approve & Deliver
              </span>
              <span className="text-[10px] hidden sm:inline text-slate-400">
                {!isProcessing && !isListening && agentSpeechSummary ? '(Ready for Review)' : '(Socratic Classroom)'}
              </span>
            </button>

          </div>

          {/* Top Row: Voice Orb, Live Status, Visualizer & Playback */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-start sm:items-center space-x-3 sm:space-x-3.5">
              
              {/* Voice Mic Button */}
              <button
                type="button"
                onClick={onToggleListen}
                disabled={isProcessing}
                className={`relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-200 animate-pulse shadow-lg shadow-rose-500/30'
                    : isProcessing
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xs'
                }`}
                title={isListening ? "Listening... Click to stop and process" : "Click to speak with Gemini & Groq Voice AI"}
              >
                {isListening ? (
                  <Mic className="w-6 h-6 text-white animate-bounce" />
                ) : isProcessing ? (
                  <RefreshCw className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
                {isListening && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600 text-[8px] text-white font-bold items-center justify-center">●</span>
                  </span>
                )}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm sm:text-base font-bold text-slate-900 font-outfit flex items-center gap-1.5 flex-wrap">
                    {isListening ? (
                      <span className="text-rose-600 flex items-center gap-1.5 font-semibold">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
                        </span>
                        Listening... (Faster-Whisper + Groq + Gemini + WebSpeech)
                      </span>
                    ) : isProcessing ? (
                      <span className="text-amber-600 flex items-center gap-1.5 font-semibold">
                        <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
                        Autonomous Brain Reasoning & Grounding...
                      </span>
                    ) : isSpeaking ? (
                      <span className="text-blue-600 flex items-center gap-1.5 font-semibold">
                        <Volume2 className="w-4 h-4 text-blue-600" />
                        MINDMESH-NEXUS Speaking
                      </span>
                    ) : (
                      <span className="text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        Voice Teaching Co-Pilot
                      </span>
                    )}
                  </span>
                </div>
                
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Speak natural lesson requirements in English, Hindi, or Kannada
                </p>

                {/* Engine Badges & Controls (Responsive Wrap) */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {/* Human Voice Frequency Badge */}
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Human Voice (85Hz-3.4kHz)
                  </span>

                  {/* Faster-Whisper ASR Interactive Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const prompt = 'Explain Faster-Whisper open-source speech recognition with CTranslate2 INT8 quantization and offline edge privacy.';
                      setTranscript(prompt);
                      onSubmitCommand(prompt);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-950 bg-cyan-50 hover:bg-cyan-100 px-2 py-0.5 rounded-md border border-cyan-200 transition-colors cursor-pointer shadow-2xs"
                    title="Click to explain and demonstrate Faster-Whisper Local ASR"
                  >
                    <Mic className="w-2.5 h-2.5 text-cyan-600" />
                    Faster-Whisper ASR
                  </button>

                  {/* Google Gemini Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const prompt = 'Explain multimodal reasoning and fast token generation with Gemini 3.8 Flash.';
                      setTranscript(prompt);
                      onSubmitCommand(prompt);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200 transition-colors cursor-pointer shadow-2xs"
                    title="Click to run multimodal Gemini reasoning"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                    Gemini 3.8 Flash
                  </button>

                  {/* Groq Cloud LPU Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const prompt = 'Explain Groq LPU deterministic tensor architecture and 500 tokens per second inference speed.';
                      setTranscript(prompt);
                      onSubmitCommand(prompt);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 transition-colors cursor-pointer shadow-2xs"
                    title="Click to run Groq LPU ultra-fast inference"
                  >
                    <Zap className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                    Groq LPU
                  </button>

                  {/* Local Ollama Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const prompt = 'Explain Open-Source AI architecture using Local Ollama, Llama 3.2 quantized GGUF weights, and zero-egress privacy.';
                      setTranscript(prompt);
                      onSubmitCommand(prompt);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-orange-950 bg-orange-50 hover:bg-orange-100 px-2 py-0.5 rounded-md border border-orange-200 transition-colors cursor-pointer shadow-2xs"
                    title="Click to explain and demonstrate Local Ollama Open-Source AI"
                  >
                    <span>🦙</span>
                    Local Ollama
                  </button>

                  {/* Speaker Audibility Test Chime Button */}
                  <button
                    type="button"
                    onClick={() => voiceService.playSpeakerTestSound()}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 px-2 py-0.5 rounded-md border border-sky-200 transition-colors cursor-pointer"
                    title="Test Audio Clarity & Speaker Output (200% Boosted)"
                  >
                    <Volume2 className="w-2.5 h-2.5 text-sky-600" />
                    Test Audibility
                  </button>

                  {/* Mic Test / Permission Button */}
                  {micPerm !== 'granted' && (
                    <button
                      type="button"
                      onClick={handleGrantMicPermission}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-800 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200 transition-colors cursor-pointer"
                      title="Grant microphone permission and test audio"
                    >
                      <ShieldCheck className="w-2.5 h-2.5 text-purple-600" />
                      Enable Mic Access
                    </button>
                  )}

                  {onOpenBhashiniConfig && (
                    <button
                      type="button"
                      onClick={onOpenBhashiniConfig}
                      className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded-md border border-teal-200 transition-colors cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      Digital India Bhashini
                    </button>
                  )}
                </div>
              </div>
            </div>

              {/* Audio Waveform Visualizer & Playback */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center px-2.5 sm:px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-mono text-slate-600 font-medium mr-2 flex items-center gap-1 whitespace-nowrap">
                    <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : 'bg-blue-500'}`} />
                    {isListening ? `VOCAL LOCK ${audioLevel}%` : '85Hz-3.4kHz'}
                  </span>
                  <AudioVisualizer isActive={isListening || isSpeaking} height={20} barCount={18} />
                </div>

              {agentSpeechSummary && (
                <button
                  onClick={onToggleSpeech}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                    isSpeaking
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                  title="Play response summary aloud"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-white' : 'text-slate-500'}`} />
                  <span>{isSpeaking ? 'Mute' : 'Play Response'}</span>
                </button>
              )}

              {onTogglePageReader && (
                <button
                  onClick={onTogglePageReader}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                    isPageReaderOpen
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                  title="Listen to entire active page with Bhashini Indic Voice"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPageReaderOpen ? 'text-white animate-pulse' : 'text-emerald-600'}`} />
                  <span className="hidden sm:inline">Read Page</span>
                </button>
              )}
            </div>

          </div>

          {/* Interactive Input Box */}
          <form onSubmit={handleFormSubmit} className="relative flex items-center">
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={isListening ? "Listening to your voice... (Speak now in English, Hindi, or Kannada)" : "Speak or type: 'I need a 40-minute Grade 7 science lesson on photosynthesis...'"}
              disabled={isProcessing}
              className={`w-full text-sm text-slate-900 rounded-xl pl-4 pr-24 py-2.5 outline-none transition-all ${
                isListening
                  ? 'bg-rose-50/50 border-2 border-rose-400 focus:border-rose-500 ring-2 ring-rose-100 placeholder-rose-400'
                  : 'bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 placeholder-slate-400 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            <button
              type="submit"
              disabled={!transcript.trim() || isProcessing}
              className="absolute right-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <span>Execute</span>
              <Send className="w-3 h-3" />
            </button>
          </form>

          {/* Spoken Prompt Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center mr-1">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" /> Quick Prompts:
            </span>
            {DEMO_PROMPTS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleChipClick(item.prompt, item.id)}
                className={`group flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  activeChip === item.id
                    ? 'bg-blue-600 text-white border-blue-700 font-semibold'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
                title={item.prompt}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                  activeChip === item.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                }`}>
                  {item.tag}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

