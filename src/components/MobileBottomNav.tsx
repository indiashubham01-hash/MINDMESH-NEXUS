import React from 'react';
import { 
  BookOpen, 
  FileText, 
  Users, 
  Network, 
  Mic, 
  MicOff, 
  Sparkles,
  MessageSquare,
  GraduationCap,
  Layers,
  HelpCircle,
  Volume2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { LessonPlan } from '../types';

interface MobileBottomNavProps {
  currentPersona: 'teacher' | 'student';
  setCurrentPersona: (persona: 'teacher' | 'student') => void;
  activeTeacherTab: 'lesson' | 'curriculum' | 'calendar' | 'sources' | 'students' | 'graph' | 'documents';
  setActiveTeacherTab: (tab: 'lesson' | 'curriculum' | 'calendar' | 'sources' | 'students' | 'graph' | 'documents') => void;
  isListening: boolean;
  isProcessing: boolean;
  onToggleListen: () => void;
  lessonPlan: LessonPlan;
  onOpenMobileVoiceSheet?: () => void;
  onRequestTeacherAccess?: () => void;
  isTeacherAuthenticated?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPersona,
  setCurrentPersona,
  activeTeacherTab,
  setActiveTeacherTab,
  isListening,
  isProcessing,
  onToggleListen,
  lessonPlan,
  onOpenMobileVoiceSheet,
  onRequestTeacherAccess,
  isTeacherAuthenticated = true,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around relative">
        
        {currentPersona === 'teacher' ? (
          <>
            {/* 1. Lesson Plan Studio */}
            <button
              onClick={() => setActiveTeacherTab('lesson')}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
                activeTeacherTab === 'lesson'
                  ? 'text-sky-600 font-bold bg-sky-50/80'
                  : 'text-slate-500 hover:text-slate-900 active:bg-slate-100'
              }`}
            >
              <div className="relative">
                <BookOpen className="w-5 h-5" />
                {lessonPlan.isReplanned && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Studio</span>
            </button>

            {/* 2. Sources & Trust */}
            <button
              onClick={() => setActiveTeacherTab('sources')}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
                activeTeacherTab === 'sources'
                  ? 'text-indigo-600 font-bold bg-indigo-50/80'
                  : 'text-slate-500 hover:text-slate-900 active:bg-slate-100'
              }`}
            >
              <div className="relative">
                <FileText className="w-5 h-5" />
                {lessonPlan.ignoredSources.length > 0 && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Sources</span>
            </button>

            {/* 3. Center Floating Action Mic */}
            <div className="flex flex-col items-center justify-center -mt-5 px-1">
              <button
                onClick={onToggleListen}
                disabled={isProcessing}
                className={`flex items-center justify-center w-13 h-13 rounded-full shadow-lg transition-all duration-300 cursor-pointer active:scale-95 ${
                  isListening
                    ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse shadow-rose-300'
                    : isProcessing
                    ? 'bg-amber-500 text-white shadow-amber-200 animate-spin'
                    : 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                }`}
                title={isListening ? "Stop listening" : "Tap to speak voice command"}
              >
                {isListening ? (
                  <MicOff className="w-6 h-6 text-white" />
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
              </button>
              <span className={`text-[9px] font-bold mt-1 ${isListening ? 'text-rose-600 animate-pulse' : 'text-slate-600'}`}>
                {isListening ? 'Listening' : 'Voice'}
              </span>
            </div>

            {/* 4. Learners Risk Radar */}
            <button
              onClick={() => setActiveTeacherTab('students')}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
                activeTeacherTab === 'students'
                  ? 'text-teal-600 font-bold bg-teal-50/80'
                  : 'text-slate-500 hover:text-slate-900 active:bg-slate-100'
              }`}
            >
              <div className="relative">
                <Users className="w-5 h-5" />
                {lessonPlan.predictedGapsCount > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[8px] font-black bg-rose-500 text-white leading-none">
                    {lessonPlan.predictedGapsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Learners</span>
            </button>

            {/* 5. Knowledge Graph */}
            <button
              onClick={() => setActiveTeacherTab('graph')}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
                activeTeacherTab === 'graph'
                  ? 'text-sky-600 font-bold bg-sky-50/80'
                  : 'text-slate-500 hover:text-slate-900 active:bg-slate-100'
              }`}
            >
              <Network className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Graph</span>
            </button>
          </>
        ) : (
          <>
            {/* Student View Items */}
            {/* 1. Study Canvas */}
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer text-indigo-600 font-bold bg-indigo-50/80"
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Canvas</span>
            </button>

            {/* 2. Socratic Chat */}
            <button
              onClick={() => {
                const el = document.getElementById('student-voice-chat');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer text-slate-500 hover:text-slate-900 active:bg-slate-100"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Tutor</span>
            </button>

            {/* 3. Center Mic for Student Q&A */}
            <div className="flex flex-col items-center justify-center -mt-5 px-1">
              <button
                onClick={onToggleListen}
                disabled={isProcessing}
                className={`flex items-center justify-center w-13 h-13 rounded-full shadow-lg transition-all duration-300 cursor-pointer active:scale-95 ${
                  isListening
                    ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse shadow-rose-300'
                    : 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                }`}
                title="Tap to speak your question"
              >
                {isListening ? (
                  <MicOff className="w-6 h-6 text-white" />
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
              </button>
              <span className={`text-[9px] font-bold mt-1 ${isListening ? 'text-rose-600 animate-pulse' : 'text-slate-600'}`}>
                {isListening ? 'Listening' : 'Ask AI'}
              </span>
            </div>

            {/* 4. Formative Quiz Check */}
            <button
              onClick={() => {
                const el = document.getElementById('student-quiz-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer text-slate-500 hover:text-slate-900 active:bg-slate-100"
            >
              <GraduationCap className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Quiz</span>
            </button>

            {/* 5. Schedule & Timetable */}
            <button
              onClick={() => {
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
              className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer text-slate-500 hover:text-slate-900 active:bg-slate-100"
            >
              <CalendarIcon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Schedule</span>
            </button>
          </>
        )}

      </div>
    </div>
  );
};
