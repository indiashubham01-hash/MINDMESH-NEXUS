import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Copy, 
  Check, 
  RefreshCw, 
  Radio, 
  ShieldCheck, 
  Calendar as CalendarIcon, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { sharedState } from '../services/sharedStateManager';

export const TeacherClassroomHub: React.FC = () => {
  const [classroomCode, setClassroomCode] = useState<string>(() => sharedState.getClassroomCode());
  const [connectedStudents, setConnectedStudents] = useState<string[]>(() => sharedState.getConnectedStudents());
  const [copied, setCopied] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  useEffect(() => {
    const unsub = sharedState.subscribe(() => {
      setClassroomCode(sharedState.getClassroomCode());
      setConnectedStudents(sharedState.getConnectedStudents());
    });
    return unsub;
  }, []);

  const handleCopyCode = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(classroomCode);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateNewCode = () => {
    setIsRegenerating(true);
    const newCode = sharedState.generateNewClassroomCode();
    setClassroomCode(newCode);
    setTimeout(() => setIsRegenerating(false), 400);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-4">
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-700/50 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left: Info & Live Broadcast Indicator */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Radio className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-extrabold text-white tracking-tight">
                  Teacher Classroom Control & Live Portal Hub
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Broadcast
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  <CalendarIcon className="w-2.5 h-2.5 text-cyan-300" />
                  Auto-Sync
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                Students connect using this active Classroom Code to synchronize course calendar, live timetable updates, and broadcasted lessons.
              </p>
            </div>
          </div>

          {/* Right: Classroom Code Card with Copy & Regenerate */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 min-w-[140px] md:w-48 px-3.5 py-2 rounded-xl border border-indigo-400/30 bg-slate-950/80 shadow-xs flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Code:</span>
              <span className="text-sm font-bold font-mono tracking-wider text-amber-300 select-all">{classroomCode}</span>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              title="Copy Classroom Code"
              className={`flex-1 sm:flex-initial px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap active:scale-95 ${
                copied
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleGenerateNewCode}
              title="Generate New Random Classroom Code"
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-600/30 whitespace-nowrap active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>New Code</span>
            </button>
          </div>

        </div>

        {/* Bottom Status Bar: Connected Students Telemetry */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-white/10 text-[11px] text-slate-300">
          <div className="flex items-center gap-2 flex-wrap">
            <Users className="w-3.5 h-3.5 text-indigo-300" />
            <span className="text-slate-300 text-xs">Connected Students:</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              connectedStudents.length > 0 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {connectedStudents.length} Connected
            </span>
            {connectedStudents.length > 0 && (
              <div className="flex items-center gap-1.5 ml-1">
                {connectedStudents.map((name, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-white/10 text-slate-200 text-[10px] font-semibold">
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Live State Isolation: Unconnected students cannot view real-time changes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
