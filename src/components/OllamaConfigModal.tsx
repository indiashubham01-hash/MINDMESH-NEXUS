import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Terminal, 
  ExternalLink, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Play, 
  X,
  Server,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { ollamaService } from '../services/ollamaService';

interface OllamaConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEngineSelect?: (engine: string) => void;
}

export const OllamaConfigModal: React.FC<OllamaConfigModalProps> = ({
  isOpen,
  onClose,
  onEngineSelect
}) => {
  const [hostUrl, setHostUrl] = useState(ollamaService.getHostUrl());
  const [selectedModel, setSelectedModel] = useState(ollamaService.getSelectedModel());
  const [models, setModels] = useState<string[]>([]);
  const [status, setStatus] = useState<'ONLINE' | 'OFFLINE' | 'CHECKING'>('CHECKING');
  const [version, setVersion] = useState<string | undefined>(undefined);
  const [source, setSource] = useState<'direct' | 'proxy' | 'none'>('none');
  const [isTesting, setIsTesting] = useState(false);
  const [testPrompt, setTestPrompt] = useState('Explain TCP Congestion Control in 2 short sentences.');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const POPULAR_MODELS = [
    { name: 'llama3.2', tag: 'Meta 3B/1B', desc: 'Fastest lightweight instruction model for edge devices' },
    { name: 'llama3.1', tag: 'Meta 8B', desc: 'Standard high-reasoning general intelligence' },
    { name: 'qwen2.5', tag: 'Alibaba 7B/3B', desc: 'Top tier multilingual and STEM math reasoning' },
    { name: 'mistral', tag: 'Mistral 7B', desc: 'Balanced fast European open weights model' },
    { name: 'deepseek-r1', tag: 'DeepSeek R1', desc: 'Open reasoning & chain-of-thought engine' },
    { name: 'gemma2', tag: 'Google 9B/2B', desc: 'Efficient Google open architecture model' },
    { name: 'phi3', tag: 'Microsoft 3.8B', desc: 'High reasoning density in small parameters' },
  ];

  const refreshStatus = async () => {
    setStatus('CHECKING');
    try {
      const res = await ollamaService.checkStatus();
      setStatus(res.status);
      setVersion(res.version);
      setSource(res.source);
      if (res.activeModel) {
        setSelectedModel(res.activeModel);
      }
      if (res.models && res.models.length > 0) {
        setModels(res.models);
      }
    } catch {
      setStatus('OFFLINE');
    }
  };

  useEffect(() => {
    if (isOpen) {
      setHostUrl(ollamaService.getHostUrl());
      setSelectedModel(ollamaService.getSelectedModel());
      refreshStatus();
    }
  }, [isOpen]);

  const handleSave = () => {
    ollamaService.setHostUrl(hostUrl);
    ollamaService.setSelectedModel(selectedModel);
    refreshStatus();
  };

  const handleTestInference = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const reply = await ollamaService.chat(testPrompt, selectedModel);
      setTestResult(reply || 'No response received. Verify model is loaded.');
    } catch (e: any) {
      setTestResult(`Error: ${e.message || 'Failed to connect to Ollama'}`);
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-600 text-white shadow-xs">
              <span className="text-base font-bold">🦙</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-outfit flex items-center gap-2">
                Local Ollama Engine
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  status === 'ONLINE'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : status === 'CHECKING'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {status === 'ONLINE' ? `● Connected (${source})` : status === 'CHECKING' ? 'Checking...' : '○ Offline / Standby'}
                </span>
              </h3>
              <p className="text-xs text-slate-500">Run open-source LLMs locally on your machine with 0 external API cost</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Status & Connection Card */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${status === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              <div>
                <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <span>Daemon URL:</span>
                  <code className="text-[11px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono">
                    {hostUrl}
                  </code>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {status === 'ONLINE' 
                    ? `Ollama version ${version || 'v0.5+'} detected. Ready for low-latency offline voice parsing.`
                    : 'Daemon not detected on localhost:11434. Start Ollama on your PC to enable.'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={refreshStatus}
                disabled={status === 'CHECKING'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${status === 'CHECKING' ? 'animate-spin' : ''}`} />
                <span>Re-check</span>
              </button>
            </div>
          </div>

          {/* Model Selector & Host Config */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Active Ollama Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  ollamaService.setSelectedModel(e.target.value);
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
              >
                <optgroup label="Popular Verified Models">
                  {POPULAR_MODELS.map(m => (
                    <option key={m.name} value={m.name}>
                      {m.name} ({m.tag})
                    </option>
                  ))}
                </optgroup>
                {models.filter(m => !POPULAR_MODELS.some(pm => pm.name === m)).length > 0 && (
                  <optgroup label="Locally Installed Models">
                    {models.filter(m => !POPULAR_MODELS.some(pm => pm.name === m)).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ollama Host URL
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={hostUrl}
                  onChange={(e) => setHostUrl(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Quick Terminal Launcher Commands */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-slate-500" />
              <span>How to launch models locally (Run in Windows Terminal / Command Prompt):</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-900 text-slate-100 flex items-center justify-between font-mono text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-sans">Meta Llama 3.2 (3B - Fast & Lightweight)</div>
                  <span className="text-emerald-400 font-bold">ollama run llama3.2</span>
                </div>
                <button
                  onClick={() => copyToClipboard('ollama run llama3.2', 'c1')}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Copy command"
                >
                  {copiedCmd === 'c1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 text-slate-100 flex items-center justify-between font-mono text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-sans">Qwen 2.5 (7B - Math & STEM Reasoning)</div>
                  <span className="text-cyan-400 font-bold">ollama run qwen2.5</span>
                </div>
                <button
                  onClick={() => copyToClipboard('ollama run qwen2.5', 'c2')}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Copy command"
                >
                  {copiedCmd === 'c2' ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Test Inference Sandbox */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                Test Local LLM Prompt Execution
              </span>
              <span className="text-[10px] font-mono text-slate-500">model: {selectedModel}</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                placeholder="Enter prompt..."
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button
                onClick={handleTestInference}
                disabled={isTesting}
                className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isTesting ? 'Generating...' : 'Run Test'}</span>
              </button>
            </div>

            {testResult && (
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-sans leading-relaxed whitespace-pre-wrap">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Local Output:
                </div>
                {testResult}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/80">
          <div className="text-[11px] text-slate-500">
            Multi-Engine Cascade: Groq LPU ➔ Gemini 3.8 Flash ➔ Local Ollama
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
