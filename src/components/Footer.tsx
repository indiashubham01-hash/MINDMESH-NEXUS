import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Brain, 
  Mic, 
  BookOpen, 
  Languages, 
  Activity, 
  ExternalLink,
  Cpu,
  Lock,
  CheckCircle2
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 text-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200">
          
          {/* Column 1: Brand & Identity */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-sky-600 text-white shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-black text-lg tracking-tight text-slate-900">
                MINDMESH<span className="text-sky-600">-NEXUS</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Autonomous Voice-First AI Teaching Co-Pilot engineered for continuous classroom adaptation, epistemic source grounding, and proactive GNN knowledge tracing.
            </p>

            <div className="flex items-center space-x-2 pt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                Agnes 3.0 Flash 512K Active
              </span>
            </div>
          </div>

          {/* Column 2: System Architecture & AI Pipeline */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-sky-600" />
              <span>Agentic Architecture</span>
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center space-x-1.5">
                <span className="text-sky-600 font-bold">•</span>
                <span>Voice NLU & Multilingual STT/TTS</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-sky-600 font-bold">•</span>
                <span>NLI DeBERTa Epistemic Trust Filter</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-sky-600 font-bold">•</span>
                <span>2-Head GAT Graph Neural Network</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-sky-600 font-bold">•</span>
                <span>Riiid Deep Knowledge Tracing (DKT)</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Multilingual & Pedagogical Compliance */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Languages className="w-3.5 h-3.5 text-indigo-600" />
              <span>Multilingual Engine</span>
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center space-x-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span>English (Indian Curriculum Standard)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Hindi (हिंदी माध्यम - NCERT Aligned)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Kannada (ಕನ್ನಡ ಮಾಧ್ಯಮ - DSERT Aligned)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Sub-800ms Socratic Speech Dialogue</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Security, Governance & Verification */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Governance & Security</span>
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center space-x-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>WhatsApp 2FA Non-Random OTP</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Zero-Silent-Publish Teacher Governance</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Transparent Chain-of-Thought Audit Trail</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Strict 10 RPM Token Bucket Limiting</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & System Status */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span>© 2026 MINDMESH-NEXUS. All educational rights reserved.</span>
            <span>•</span>
            <span className="font-medium text-slate-700">NCERT Grade 7 Science Curriculum Aligned</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>API Gateway: Render Cloud Brain (OPERATIONAL)</span>
            </div>
            
            <a 
              href="https://platform.agnes-ai.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-slate-600 hover:text-sky-600 flex items-center space-x-1 transition-colors"
            >
              <span>Agnes Platform</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
