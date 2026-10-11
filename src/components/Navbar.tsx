import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  Users, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Languages, 
  CheckCircle2, 
  LogOut, 
  Lock, 
  Cpu, 
  Network, 
  Menu, 
  Calendar as CalendarIcon, 
  Layers,
  Flame,
  Zap,
  ChevronDown,
  Presentation
} from 'lucide-react';
import { LessonPlan } from '../types';
import { AuthUser } from '../services/authService';
import { OllamaConfigModal } from './OllamaConfigModal';
import { ollamaService } from '../services/ollamaService';
import { sharedState } from '../services/sharedStateManager';

interface NavbarProps {
  currentPersona: 'teacher' | 'student';
  setCurrentPersona: (persona: 'teacher' | 'student') => void;
  activeTeacherTab: 'lesson' | 'curriculum' | 'calendar' | 'sources' | 'students' | 'graph' | 'documents';
  setActiveTeacherTab: (tab: 'lesson' | 'curriculum' | 'calendar' | 'sources' | 'students' | 'graph' | 'documents') => void;
  lessonPlan: LessonPlan;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
  onOpenAuditTrail: () => void;
  onOpenAgnesConfig: () => void;
  onOpenBhashiniConfig?: () => void;
  selectedLanguage: 'English' | 'Hindi' | 'Kannada' | 'Bilingual';
  setSelectedLanguage: (lang: 'English' | 'Hindi' | 'Kannada' | 'Bilingual') => void;
  isTeacherAuthenticated: boolean;
  onRequestTeacherAccess: () => void;
  onLockTeacherAccess: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onOpenMobileDrawer?: () => void;
  onTogglePageReader?: () => void;
  isPageReaderOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPersona,
  setCurrentPersona,
  activeTeacherTab,
  setActiveTeacherTab,
  lessonPlan,
  isSpeaking,
  onToggleSpeech,
  onOpenAuditTrail,
  onOpenAgnesConfig,
  onOpenBhashiniConfig,
  selectedLanguage,
  setSelectedLanguage,
  isTeacherAuthenticated,
  onRequestTeacherAccess,
  onLockTeacherAccess,
  currentUser,
  onLogout,
  onOpenMobileDrawer,
  onTogglePageReader,
  isPageReaderOpen,
}) => {
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [showOllamaModal, setShowOllamaModal] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      
      {/* 1. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 sm:h-16 gap-2 sm:gap-4">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-600 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 font-outfit">
                  MINDMESH<span className="text-blue-600 font-normal">.NEXUS</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold tracking-wide border border-slate-200/60">
                  <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                  VOICE AI
                </span>
              </div>
            </div>
          </div>

          {/* Center: Role Switcher if not locked */}
          <div className="hidden md:flex items-center">
            {currentUser ? (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100/80 rounded-full text-xs font-medium text-slate-600 border border-slate-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{currentPersona === 'teacher' ? '👨‍🏫 Educator Workspace' : '🎓 Student Socratic Workspace'}</span>
              </div>
            ) : (
              <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/60">
                <button
                  onClick={() => setCurrentPersona('teacher')}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    currentPersona === 'teacher'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>👨‍🏫 Teacher</span>
                </button>

                <button
                  onClick={() => setCurrentPersona('student')}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    currentPersona === 'student'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🎓 Student</span>
                </button>
              </div>
            )}

            {/* Quick Classroom Code Pill */}
            <div className="hidden lg:flex items-center ml-2.5">
              {currentPersona === 'teacher' ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50/90 border border-amber-200/90 rounded-lg text-xs font-semibold text-amber-950 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-amber-700">Class:</span>
                  <span className="font-mono font-black text-slate-900 tracking-wider">{sharedState.getClassroomCode()}</span>
                </div>
              ) : (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border shadow-xs ${
                  sharedState.isStudentConnected() 
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-200' 
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sharedState.isStudentConnected() ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  <span>{sharedState.isStudentConnected() ? `Synced: ${sharedState.getClassroomCode()}` : 'Class Offline'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Consolidated Action Toolbar */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            
            {/* Language Selector Pill */}
            <div className="flex items-center bg-slate-100/90 border border-slate-200/80 rounded-lg p-0.5 text-xs">
              <Languages className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-0.5 hidden lg:inline" />
              <button
                onClick={() => setSelectedLanguage('English')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedLanguage === 'English' 
                    ? 'bg-white text-blue-700 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="English Curriculum"
              >
                EN
              </button>
              <button
                onClick={() => setSelectedLanguage('Hindi')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedLanguage === 'Hindi' 
                    ? 'bg-white text-blue-700 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="हिंदी (Hindi)"
              >
                हिं
              </button>
              <button
                onClick={() => setSelectedLanguage('Kannada')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedLanguage === 'Kannada' 
                    ? 'bg-white text-blue-700 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="ಕನ್ನಡ (Kannada)"
              >
                ಕನ್ನ
              </button>
              <button
                onClick={() => setSelectedLanguage('Bilingual')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedLanguage === 'Bilingual' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Multilingual Tri-Lingual Mode"
              >
                ALL
              </button>
            </div>

            {/* Voice TTS Speaker Toggle */}
            <button
              onClick={onToggleSpeech}
              title={isSpeaking ? "Mute Voice Tutor" : "Play Socratic Voice Audio"}
              className={`p-2 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                isSpeaking 
                  ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-200'
                  : 'bg-white border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              {isSpeaking ? (
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-white rounded-full animate-bounce" />
                  <span className="w-1 h-4 bg-white rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {/* Bhashini Page Reader Toggle Button */}
            {onTogglePageReader && (
              <button
                onClick={onTogglePageReader}
                className={`hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  isPageReaderOpen
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
                title="Open Bhashini Indic Page Reader to listen to this view"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPageReaderOpen ? 'text-white animate-pulse' : 'text-emerald-600'}`} />
                <span>Read Page</span>
              </button>
            )}

            {/* AI Brain Hub Modal Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowAiMenu(!showAiMenu)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold transition-all cursor-pointer"
                title="AI Brain Engines (Bhashini Indic AI, Agnes 3.0, FastAPI 8000)"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="hidden sm:inline">AI Engines</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* AI Engines Dropdown Menu */}
              {showAiMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-lg p-2.5 space-y-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setShowAiMenu(false)}
                >
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1.5 py-1">
                    Connected AI Engines
                  </div>

                  {/* Groq Cloud Ultra-Fast AI */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/80 hover:bg-amber-100/80 text-amber-950 text-xs font-medium border border-amber-200 transition-all text-left">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                      <div>
                        <div className="font-semibold flex items-center gap-1">
                          <span>Groq Cloud LPU</span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-200 text-amber-900 font-mono font-bold">1st Layer</span>
                        </div>
                        <div className="text-[10px] text-amber-700">Voice Recognition & Dynamic Scheduler</div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-200/80 text-[9px] text-emerald-950 font-bold">&lt;200ms</span>
                  </div>

                  {onOpenBhashiniConfig && (
                    <button
                      onClick={() => { setShowAiMenu(false); onOpenBhashiniConfig(); }}
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 text-xs font-medium border border-emerald-200 transition-all text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🇮🇳</span>
                        <div>
                          <div className="font-semibold">Bhashini Indic AI</div>
                          <div className="text-[10px] text-emerald-700">Conformer ASR & IndicTTS</div>
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-200/80 text-[9px] text-emerald-950 font-bold">Active</span>
                    </button>
                  )}

                  {/* Local Ollama Open-Source AI */}
                  <button
                    onClick={() => { setShowAiMenu(false); setShowOllamaModal(true); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-orange-50/90 hover:bg-orange-100 text-orange-950 text-xs font-medium border border-orange-200 transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🦙</span>
                      <div>
                        <div className="font-semibold flex items-center gap-1">
                          <span>Local Ollama</span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-orange-200 text-orange-900 font-mono font-bold">Llama 3.2</span>
                        </div>
                        <div className="text-[10px] text-orange-700">:11434 Offline LLM Engine</div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-orange-200/80 text-[9px] text-orange-950 font-bold">Local</span>
                  </button>

                  <button
                    onClick={() => { setShowAiMenu(false); onOpenAgnesConfig(); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-blue-50 hover:bg-blue-100/80 text-blue-900 text-xs font-medium border border-blue-200 transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-semibold">Agnes 3.0 Flash</div>
                        <div className="text-[10px] text-blue-700">512K Context Gateway</div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-blue-200/80 text-[9px] text-blue-950 font-bold">10 RPM</span>
                  </button>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <div className="font-semibold">FastAPI Brain</div>
                        <div className="text-[10px] text-slate-500">Render Cloud GNN Engine</div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-slate-200 text-[9px] text-slate-700 font-mono font-bold">Live</span>
                  </div>

                  <button
                    onClick={() => { setShowAiMenu(false); onOpenAuditTrail(); }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all text-left cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                    <span>View AI Decision Audit Trail</span>
                  </button>
                </div>
              )}
            </div>

            {/* Authenticated User Profile Chip */}
            {currentUser && (
              <div className="flex items-center space-x-1.5 pl-1.5 sm:pl-2 border-l border-slate-200">
                <div className="flex items-center space-x-2 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-md bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-900 leading-none truncate max-w-[90px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {currentUser.role === 'teacher' ? '👨‍🏫 Educator' : '⭐ Student'}
                    </span>
                  </div>
                </div>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    title="Sign Out"
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Mobile Drawer Toggle */}
            {onOpenMobileDrawer && (
              <button
                onClick={onOpenMobileDrawer}
                className="md:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                title="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

          </div>

        </div>
      </div>

      {/* 2. Minimalist Secondary Teacher Command Ribbon */}
      {currentPersona === 'teacher' && (
        <div className="hidden md:block w-full bg-white/70 backdrop-blur-sm border-t border-slate-200/60 py-1.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 overflow-x-auto">
            
            {/* Teacher Category Tabs */}
            <div className="flex items-center space-x-1 overflow-x-auto py-0.5 scrollbar-none">
              <button
                onClick={() => setActiveTeacherTab('lesson')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeTeacherTab === 'lesson'
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100/70 hover:bg-slate-200/60 text-slate-700 font-medium'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>3-Tier Studio</span>
                {lessonPlan.isReplanned && (
                  <span className={`ml-1 px-1.5 py-0.2 text-[9px] rounded font-bold ${
                    activeTeacherTab === 'lesson' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
                  }`}>
                    20m
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTeacherTab('documents')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeTeacherTab === 'documents'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100/70 hover:bg-slate-200/60 text-slate-700 font-medium'
                }`}
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>PPT & Flowchart</span>
                <span className={`ml-1 px-1.5 py-0.2 text-[9px] rounded font-bold ${
                  activeTeacherTab === 'documents' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-900'
                }`}>
                  DAG
                </span>
              </button>

              <button
                onClick={() => setActiveTeacherTab('calendar')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeTeacherTab === 'calendar'
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100/70 hover:bg-slate-200/60 text-slate-700 font-medium'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Planner</span>
              </button>

              <button
                onClick={() => setActiveTeacherTab('students')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeTeacherTab === 'students'
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100/70 hover:bg-slate-200/60 text-slate-700 font-medium'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Learners & Risk</span>
                <span className={`ml-1 px-1.5 py-0.2 text-[9px] rounded font-bold ${
                  activeTeacherTab === 'students' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'
                }`}>
                  {lessonPlan.predictedGapsCount} At Risk
                </span>
              </button>

              <button
                onClick={() => setActiveTeacherTab('sources')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeTeacherTab === 'sources'
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100/70 hover:bg-slate-200/60 text-slate-700 font-medium'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Source Trust</span>
                {lessonPlan.ignoredSources.length > 0 && (
                  <span className={`ml-1 px-1.5 py-0.2 text-[9px] rounded font-bold ${
                    activeTeacherTab === 'sources' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'
                  }`}>
                    1 Excluded
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTeacherTab('curriculum')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeTeacherTab === 'curriculum'
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100/70 hover:bg-slate-200/60 text-slate-700 font-medium'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Modules</span>
              </button>

              <button
                onClick={() => setActiveTeacherTab('graph')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeTeacherTab === 'graph'
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100/70 hover:bg-slate-200/60 text-slate-700 font-medium'
                }`}
              >
                <Network className="w-3.5 h-3.5 text-blue-500" />
                <span>GNN Graph</span>
              </button>
            </div>

            {/* Right: Approval State & Lock */}
            <div className="flex items-center space-x-2">
              <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border ${
                lessonPlan.approvalState === 'approved' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : lessonPlan.approvalState === 'reviewing'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}>
                {lessonPlan.approvalState === 'approved' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                )}
                <span className="uppercase tracking-wide text-[11px]">{lessonPlan.approvalState}</span>
              </div>

              <button
                onClick={onLockTeacherAccess}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-xs text-slate-600 hover:text-rose-700 transition-all cursor-pointer font-medium"
                title="Lock Teacher Controls"
              >
                <Lock className="w-3 h-3 text-slate-500" />
                <span>Lock</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Local Ollama Configuration Modal */}
      <OllamaConfigModal
        isOpen={showOllamaModal}
        onClose={() => setShowOllamaModal(false)}
      />

    </header>
  );
};
