import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { VoiceCoPilotBar } from './components/VoiceCoPilotBar';
import { LessonPlanView } from './components/LessonPlanView';
import { ConflictResolutionView } from './components/ConflictResolutionView';
import { LearnerRiskDashboard } from './components/LearnerRiskDashboard';
import { InteractiveKnowledgeGraph } from './components/InteractiveKnowledgeGraph';
import { CurriculumMapView } from './components/CurriculumMapView';
import { CalendarView } from './components/CalendarView';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentDeliveryModal } from './components/StudentDeliveryModal';
import { ApprovalBar } from './components/ApprovalBar';
import { Footer } from './components/Footer';
import { AuditTrailModal } from './components/AuditTrailModal';
import { AgnesConfigModal } from './components/AgnesConfigModal';
import { BhashiniConfigModal } from './components/BhashiniConfigModal';
import { TeacherAuthModal } from './components/TeacherAuthModal';
import { AuthPortal } from './components/AuthPortal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileQuickDrawer } from './components/MobileQuickDrawer';
import { ExplainableAIChatBot } from './components/ExplainableAIChatBot';
import { PageVoiceReader } from './components/PageVoiceReader';
import { HierarchicalCurriculumBreadcrumb } from './components/HierarchicalCurriculumBreadcrumb';
import { PPTDocumentStudio } from './components/PPTDocumentStudio';
import { TeacherClassroomHub } from './components/TeacherClassroomHub';
import { voiceService } from './services/voiceService';
import { AgentEngine } from './services/agentEngine';
import { authService, AuthUser } from './services/authService';
import { sharedState } from './services/sharedStateManager';
import { curriculumStateManager } from './services/curriculumState';
import { 
  DEFAULT_OPEN_SOURCE_AI_LESSON_40MIN,
  DEFAULT_PHOTOSYNTHESIS_LESSON_40MIN, 
  INITIAL_DOCUMENTS, 
  INITIAL_STUDENTS 
} from './data/mockData';
import { 
  AgentDecisionStep, 
  DocumentSource, 
  LessonPlan, 
  Student,
  CurriculumTopic,
  CalendarEvent
} from './types';
import confetti from 'canvas-confetti';

export function App() {
  // Global Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());

  const [currentPersona, setCurrentPersona] = useState<'teacher' | 'student'>(() => {
    const user = authService.getCurrentUser();
    return user ? user.role : 'student';
  });
  const [activeTeacherTab, setActiveTeacherTab] = useState<'lesson' | 'curriculum' | 'calendar' | 'sources' | 'students' | 'graph' | 'documents'>('lesson');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Kannada' | 'Bilingual'>(() => {
    const user = authService.getCurrentUser();
    return user?.preferredLanguage || 'English';
  });
  const [lessonPlan, setLessonPlan] = useState<LessonPlan>(() => {
    const activeCurr = curriculumStateManager.getState();
    return activeCurr?.subject?.lessonPlan || DEFAULT_OPEN_SOURCE_AI_LESSON_40MIN;
  });
  const [documents, setDocuments] = useState<DocumentSource[]>(() => sharedState.getDocuments());
  const [students, setStudents] = useState<Student[]>(() => sharedState.getStudents());
  const [curriculumTopics, setCurriculumTopics] = useState<CurriculumTopic[]>(() => sharedState.getCurriculumTopics());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => sharedState.getCalendarEvents());
  
  // Teacher Authentication State
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(() => {
    const user = authService.getCurrentUser();
    return user ? user.role === 'teacher' : true;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  
  // Agent & Voice States
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [agentSpeechSummary, setAgentSpeechSummary] = useState<string>(
    'Welcome teacher! I am MINDMESH-NEXUS, your voice-first AI teaching co-pilot. Speak naturally in English, Hindi, or Kannada to generate or replan your lessons, resolve document conflicts, and scaffold for at-risk students.'
  );
  const [steps, setSteps] = useState<AgentDecisionStep[]>([]);
  const [isAuditTrailOpen, setIsAuditTrailOpen] = useState<boolean>(false);
  const [isAgnesModalOpen, setIsAgnesModalOpen] = useState<boolean>(false);
  const [isBhashiniModalOpen, setIsBhashiniModalOpen] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isPageReaderOpen, setIsPageReaderOpen] = useState<boolean>(false);
  const lastExecutedCommandRef = useRef<{ cmd: string; time: number }>({ cmd: '', time: 0 });

  // Initialize Speech Recognition callbacks & Auto-Read Page on Open
  useEffect(() => {
    voiceService.setCallbacks(
      (text: string, isFinal: boolean) => {
        setTranscript(text);
        if (isFinal && text.trim().length > 3) {
          handleExecuteCommand(text);
        }
      },
      (listening: boolean) => {
        setIsListening(listening);
        if (!listening) setAudioLevel(0);
      },
      (level: number) => {
        setAudioLevel(level);
      }
    );

    // Subscribe to multi-tab shared browser storage synchronization
    const unsubscribeSharedState = sharedState.subscribe(() => {
      setStudents(sharedState.getStudents());
      setCurriculumTopics(sharedState.getCurriculumTopics());
      setCalendarEvents(sharedState.getCalendarEvents());
      setDocuments(sharedState.getDocuments());
    });

    // Subscribe to real-time hierarchical curriculum changes (University > Scheme > Branch > Subject)
    const unsubscribeCurriculum = curriculumStateManager.subscribe((currState) => {
      if (currState?.subject?.lessonPlan) {
        setLessonPlan(currState.subject.lessonPlan);
        const welcomeAnnouncement = `Curriculum context synchronized: ${currState.university.name} - ${currState.scheme.name} - ${currState.subject.code} ${currState.subject.title}`;
        setAgentSpeechSummary(welcomeAnnouncement);
      }
    });

    // Universal Welcome Speech on Page Open
    const welcomeIntro =
      selectedLanguage === 'Hindi'
        ? 'माइंडमेश नेक्सस में आपका स्वागत है! आपका वॉयस एआई शिक्षण सह-पायलट सक्रिय है। किसी भी विषय पर पाठ योजना बनाने या सवाल पूछने के लिए माइक दबाएं।'
        : selectedLanguage === 'Kannada'
        ? 'ಮೈಂಡ್‌ಮೆಶ್ ನೆಕ್ಸಸ್‌ಗೆ ಸುಸ್ವಾಗತ! ನಿಮ್ಮ ಧ್ವನಿ ಎಐ ಬೋಧನಾ ಸಹಾಯಕ ಸಕ್ರಿಯವಾಗಿದೆ. ಯಾವುದೇ ವಿಷಯದ ಪಾಠ ಯೋಜನೆ ರಚಿಸಲು ಅಥವಾ ಪ್ರಶ್ನೆ ಕೇಳಲು ಮೈಕ್ ಕ್ಲಿಕ್ ಮಾಡಿ.'
        : 'Welcome to MINDMESH-NEXUS! Your Voice AI Teaching Co-Pilot is active across all subjects. Tap the microphone to ask questions or create lesson plans in English, Hindi, or Kannada.';

    setAgentSpeechSummary(welcomeIntro);
    
    // Initial pipeline execution to populate initial audit trail without hardcoded topic
    AgentEngine.executePipeline('System initialization: Autonomous curriculum reasoning and voice engine online').then((res) => {
      setSteps(res.steps);
    }).catch(err => {
      console.warn('Initial pipeline warm up notice:', err);
    });

    return () => {
      unsubscribeSharedState();
      unsubscribeCurriculum();
    };
  }, []);

  // Handle Dynamic Language Switching with Instant Voice Readout
  const handleLanguageChange = (newLang: 'English' | 'Hindi' | 'Kannada' | 'Bilingual') => {
    setSelectedLanguage(newLang);
    const user = authService.getCurrentUser();
    if (user) {
      authService.updateUserLanguage(user.id, newLang);
      setCurrentUser(prev => prev ? { ...prev, preferredLanguage: newLang } : null);
    }

    const langFeedback: Record<string, { summary: string; voiceLang: string }> = {
      English: {
        summary: 'English curriculum active. Voice AI Teaching Co-Pilot ready with 3-tier differentiated scaffolding across all subjects.',
        voiceLang: 'en-IN'
      },
      Hindi: {
        summary: 'हिंदी पाठ्यक्रम सक्रिय है। आपका वॉयस एआई शिक्षण सह-पायलट सभी विषयों में सहायता के लिए तैयार है।',
        voiceLang: 'hi-IN'
      },
      Kannada: {
        summary: 'ಕನ್ನಡ ಪಠ್ಯಕ್ರಮ ಸಕ್ರಿಯವಾಗಿದೆ. ಧ್ವನಿ ಎಐ ಬೋಧನಾ ಸಹಾಯಕ ಎಲ್ಲಾ ವಿಷಯಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಲು ಸಿದ್ಧವಾಗಿದೆ.',
        voiceLang: 'kn-IN'
      },
      Bilingual: {
        summary: 'Multilingual mode active in English, Hindi, and Kannada. ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ ಅಥವಾ ಪಾಠ ಯೋಜನೆ ರಚಿಸಿ.',
        voiceLang: 'Bilingual'
      }
    };

    const target = langFeedback[newLang] || langFeedback.English;
    setAgentSpeechSummary(target.summary);
    setIsSpeaking(true);
    voiceService.speak(target.summary, () => {
      setIsSpeaking(false);
    }, target.voiceLang);
  };

  // Handle Voice Command Execution
  const handleExecuteCommand = async (commandText: string) => {
    if (!commandText || !commandText.trim()) return;

    const trimmed = commandText.trim();
    if (trimmed.toLowerCase().startsWith('transcribing') || trimmed.toLowerCase().startsWith('listening')) {
      return;
    }

    const now = Date.now();
    if (lastExecutedCommandRef.current.cmd.toLowerCase() === trimmed.toLowerCase() && (now - lastExecutedCommandRef.current.time) < 1500) {
      return;
    }
    lastExecutedCommandRef.current = { cmd: trimmed, time: now };

    setIsProcessing(true);
    await voiceService.stopListening().catch(() => {});

    try {
      const pipelinePromise = AgentEngine.executePipeline(commandText.trim(), (newStep) => {
        setSteps(prev => [...prev, newStep]);
      });

      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Pipeline execution timeout')), 18000)
      );

      const result = await Promise.race([pipelinePromise, timeoutPromise]).catch(async (e) => {
        console.warn('Pipeline race timeout, executing local fallback:', e);
        return await AgentEngine.executePipeline(commandText.trim());
      });

      if (result) {
        if (result.intent?.action !== 'general_qa' && result.lessonPlan) {
          setLessonPlan(result.lessonPlan);
        }
        setSteps(result.steps);
        setAgentSpeechSummary(result.speechSummary);

        // Multi-tab shared state sync
        setStudents(sharedState.getStudents());
        setCalendarEvents(sharedState.getCalendarEvents());
        setCurriculumTopics(sharedState.getCurriculumTopics());

        // Route persona if requested
        if (result.intent?.actionOutcome?.targetPersona) {
          setCurrentPersona(result.intent.actionOutcome.targetPersona);
        }

        // Route tab if requested, else maintain or switch to lesson
        if (result.intent?.actionOutcome?.targetTab) {
          setActiveTeacherTab(result.intent.actionOutcome.targetTab);
        } else if (!result.intent?.actionOutcome && result.intent?.action !== 'general_qa') {
          setActiveTeacherTab('lesson');
        }

        // Trigger celebratory confetti if approval action
        if (result.intent?.action === 'approve') {
          confetti({
            particleCount: 75,
            spread: 60,
            origin: { y: 0.85 }
          });
        }

        // Speak Siri/Alexa response aloud to the user in the matching human language
        if (result.speechSummary) {
          setIsSpeaking(true);
          const isKannada = /[\u0C80-\u0CFF]/.test(result.speechSummary) || /[\u0C80-\u0CFF]/.test(commandText);
          const isHindi = /[\u0900-\u097F]/.test(result.speechSummary) || /[\u0900-\u097F]/.test(commandText);
          const responseVoiceLang = isKannada ? 'kn-IN' : (isHindi ? 'hi-IN' : (selectedLanguage === 'Kannada' ? 'kn-IN' : (selectedLanguage === 'Hindi' ? 'hi-IN' : 'en-IN')));
          voiceService.speak(result.speechSummary, () => {
            setIsSpeaking(false);
          }, responseVoiceLang);
        }
      }

    } catch (err) {
      console.error('Pipeline execution error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleListen = async () => {
    if (isSpeaking) {
      voiceService.stopSpeaking();
      setIsSpeaking(false);
    }
    if (isListening) {
      setIsListening(false);
      const text = await voiceService.stopListening();
      const rawCmd = (text && text.trim().length > 2) ? text.trim() : transcript.trim();
      const isPlaceholder = rawCmd.toLowerCase().startsWith('transcribing') || rawCmd.toLowerCase().startsWith('listening');
      const commandToRun = isPlaceholder ? '' : rawCmd;
      if (commandToRun.length > 2) {
        setTranscript(commandToRun);
        handleExecuteCommand(commandToRun);
      }
    } else {
      const langCode = selectedLanguage === 'Kannada' ? 'kn-IN' : (selectedLanguage === 'Hindi' ? 'hi-IN' : 'en-IN');
      setTranscript('');
      setAgentSpeechSummary('');
      voiceService.setCallbacks(
        (text: string, isFinal: boolean) => {
          setTranscript(text);
          const isPlaceholder = text.toLowerCase().startsWith('transcribing') || text.toLowerCase().startsWith('listening');
          if (isFinal && !isPlaceholder && text.trim().length > 2) {
            handleExecuteCommand(text.trim());
          }
        },
        (listening: boolean) => {
          setIsListening(listening);
          if (!listening) setAudioLevel(0);
        },
        (level: number) => {
          setAudioLevel(level);
        }
      );
      setIsListening(true);
      await voiceService.startListening(langCode);
    }
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      voiceService.stopSpeaking();
      setIsSpeaking(false);
    } else if (agentSpeechSummary) {
      setIsSpeaking(true);
      voiceService.speak(agentSpeechSummary, () => {
        setIsSpeaking(false);
      }, selectedLanguage);
    }
  };

  const handleSpeakCustomText = (text: string, lang?: string) => {
    setIsSpeaking(true);
    voiceService.speak(text, () => {
      setIsSpeaking(false);
    }, lang || (selectedLanguage === 'Bilingual' ? 'Bilingual' : selectedLanguage));
  };

  const handleApprove = () => {
    setLessonPlan(prev => ({
      ...prev,
      approvalState: 'approved',
      lastUpdated: 'Just now (Approved by Teacher)'
    }));

    // Workflow Item 4: Approval publishes the lesson and adds its topic to the student path
    sharedState.publishLesson(
      lessonPlan.topic,
      lessonPlan.subject || 'NCERT Grade 7 Science',
      ['Chloroplast Anatomy', 'Stomata Gas Dynamics', 'Balanced Stoichiometry']
    );

    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.85 }
    });
  };

  const handleTriggerReplan = () => {
    const replanPrompt = 'The class is behind; reduce this to 20 minutes.';
    setTranscript(replanPrompt);
    handleExecuteCommand(replanPrompt);
  };

  const handleDeliverToStudents = () => {
    setCurrentPersona('student');
    setLessonPlan(prev => ({
      ...prev,
      approvalState: 'delivered'
    }));
  };

  const handleUpdateStudentScore = (studentId: string, score: number) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          const newRisk = Math.max(12, s.riskScore - score * 16);
          const updatedTwin = s.learningTwin ? {
            ...s.learningTwin,
            conceptBreakdown: s.learningTwin.conceptBreakdown.map(c => {
              if (c.status === 'struggling') {
                const newPct = Math.min(95, c.masteryPercentage + score * 12);
                return {
                  ...c,
                  masteryPercentage: newPct,
                  status: newPct >= 75 ? ('mastered' as const) : (newPct >= 60 ? ('moderate' as const) : ('struggling' as const)),
                  trend: 'improving' as const
                };
              }
              return c;
            }),
            learningTrajectory: [
              ...s.learningTwin.learningTrajectory,
              {
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                concept: s.weakConcepts[0] || 'Formative Quiz Check',
                deltaScore: Math.round((score / 3) * 100),
                action: 'Quiz Completed in Student View'
              }
            ]
          } : undefined;

          return {
            ...s,
            riskScore: newRisk,
            riskReason: score >= 2 ? 'Mastery dynamically improved through formative checkpoint!' : s.riskReason,
            learningTwin: updatedTwin
          };
        }
        return s;
      })
    );
  };

  const handleRequestTeacherAccess = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthenticateTeacher = () => {
    setIsTeacherAuthenticated(true);
    setCurrentPersona('teacher');
  };

  const handleLockTeacherAccess = () => {
    setIsTeacherAuthenticated(false);
    setCurrentPersona('student');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setCurrentPersona(user.role);
    setIsTeacherAuthenticated(user.role === 'teacher');
    if (user.preferredLanguage) {
      setSelectedLanguage(user.preferredLanguage);
    }
  };

  // If user is not authenticated, show the full WhatsApp 2FA Auth Portal
  if (!currentUser) {
    return <AuthPortal onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 bg-mesh-radial text-slate-900 flex flex-col selection:bg-blue-500/20 selection:text-blue-900 relative overflow-x-hidden">
      
      {/* Top Navigation with Persona Switcher & Auth Profile */}
      <Navbar
        currentPersona={currentPersona}
        setCurrentPersona={setCurrentPersona}
        activeTeacherTab={activeTeacherTab}
        setActiveTeacherTab={setActiveTeacherTab}
        lessonPlan={lessonPlan}
        isSpeaking={isSpeaking}
        onToggleSpeech={handleToggleSpeech}
        onOpenAuditTrail={() => setIsAuditTrailOpen(true)}
        onOpenAgnesConfig={() => setIsAgnesModalOpen(true)}
        onOpenBhashiniConfig={() => setIsBhashiniModalOpen(true)}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={handleLanguageChange}
        isTeacherAuthenticated={isTeacherAuthenticated}
        onRequestTeacherAccess={handleRequestTeacherAccess}
        onLockTeacherAccess={handleLockTeacherAccess}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        onTogglePageReader={() => setIsPageReaderOpen(prev => !prev)}
        isPageReaderOpen={isPageReaderOpen}
      />

      {/* Hierarchical Curriculum Breadcrumb Selector Bar (University > Scheme > Branch/Sem > Subject) */}
      <HierarchicalCurriculumBreadcrumb />

      {/* Main Dynamic View Content (Safe bottom margin for mobile dock) */}
      <main className="flex-1 pb-24 md:pb-12">
        {currentPersona === 'teacher' ? (
          <>
            {/* Teacher Dashboard Tabs */}
            {activeTeacherTab === 'lesson' && (
              <>
                {/* Main Voice Co-Pilot Bar for Teacher (Visible only on the first page / lesson tab) */}
                <VoiceCoPilotBar
                  isListening={isListening}
                  isProcessing={isProcessing}
                  isSpeaking={isSpeaking}
                  transcript={transcript}
                  audioLevel={audioLevel}
                  setTranscript={setTranscript}
                  onToggleListen={handleToggleListen}
                  onSubmitCommand={handleExecuteCommand}
                  onToggleSpeech={handleToggleSpeech}
                  agentSpeechSummary={agentSpeechSummary}
                  onOpenBhashiniConfig={() => setIsBhashiniModalOpen(true)}
                  onTogglePageReader={() => setIsPageReaderOpen(prev => !prev)}
                  isPageReaderOpen={isPageReaderOpen}
                />

                {/* Teacher Classroom Control Hub (Visible only on the first page / lesson tab) */}
                <TeacherClassroomHub />
                <LessonPlanView
                  lessonPlan={lessonPlan}
                  selectedLanguage={selectedLanguage}
                  onSpeakText={handleSpeakCustomText}
                />
              </>
            )}

            {activeTeacherTab === 'curriculum' && (
              <CurriculumMapView
                currentPersona="teacher"
                topics={curriculumTopics}
                onOpenLesson={(topicId) => setActiveTeacherTab('lesson')}
                onScheduleTopic={(topic) => setActiveTeacherTab('calendar')}
              />
            )}

            {activeTeacherTab === 'calendar' && (
              <CalendarView
                currentPersona="teacher"
                events={calendarEvents}
                onOpenLesson={(topicId) => setActiveTeacherTab('lesson')}
              />
            )}

            {activeTeacherTab === 'documents' && (
              <PPTDocumentStudio
                onOpenCalendar={() => setActiveTeacherTab('calendar')}
                onOpenLesson={(topicId) => setActiveTeacherTab('lesson')}
              />
            )}

            {activeTeacherTab === 'sources' && (
              <ConflictResolutionView
                documents={documents}
                lessonPlan={lessonPlan}
                onUploadMockDoc={(newDoc) => setDocuments(prev => [newDoc, ...prev.filter(d => d.id !== newDoc.id)])}
              />
            )}

            {activeTeacherTab === 'students' && (
              <LearnerRiskDashboard
                students={students}
                onOpenGraphTab={() => setActiveTeacherTab('graph')}
              />
            )}

            {activeTeacherTab === 'graph' && (
              <InteractiveKnowledgeGraph
                students={students}
                onLaunchMicroLesson={(concept) => {
                  const prompt = `Explain the prerequisite concept '${concept}' using a bilingual analogy and generate an inquiry checkpoint.`;
                  setTranscript(prompt);
                  handleExecuteCommand(prompt);
                }}
              />
            )}

            {/* Sticky Bottom Teacher Approval & Governance Bar */}
            <ApprovalBar
              lessonPlan={lessonPlan}
              onApprove={handleApprove}
              onDeliverToStudents={handleDeliverToStudents}
              onTriggerReplan={handleTriggerReplan}
            />
          </>
        ) : (
          /* Student Multimodal Voice Workspace Dashboard (Isolated Account) */
          <StudentDashboard
            lessonPlan={lessonPlan}
            documents={documents}
            students={students}
            currentUser={currentUser}
            onUpdateStudentScore={handleUpdateStudentScore}
            onSpeakText={handleSpeakCustomText}
            isSpeaking={isSpeaking}
            onToggleSpeech={handleToggleSpeech}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Dock for Easy One-Thumb Access */}
      <MobileBottomNav
        currentPersona={currentPersona}
        setCurrentPersona={setCurrentPersona}
        activeTeacherTab={activeTeacherTab}
        setActiveTeacherTab={setActiveTeacherTab}
        isListening={isListening}
        isProcessing={isProcessing}
        onToggleListen={handleToggleListen}
        lessonPlan={lessonPlan}
        isTeacherAuthenticated={isTeacherAuthenticated}
        onRequestTeacherAccess={handleRequestTeacherAccess}
      />

      {/* Mobile Quick Drawer / Actions Sheet */}
      <MobileQuickDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        currentPersona={currentPersona}
        setCurrentPersona={setCurrentPersona}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={handleLanguageChange}
        isSpeaking={isSpeaking}
        onToggleSpeech={handleToggleSpeech}
        onOpenAuditTrail={() => setIsAuditTrailOpen(true)}
        onOpenAgnesConfig={() => setIsAgnesModalOpen(true)}
        onOpenBhashiniConfig={() => setIsBhashiniModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSelectPrompt={(p) => {
          setTranscript(p);
          handleExecuteCommand(p);
        }}
        lessonPlan={lessonPlan}
      />

      {/* Institutional Footer */}
      <Footer />

      {/* Educator Passcode Protection Modal */}
      <TeacherAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticate={handleAuthenticateTeacher}
      />

      {/* Agent Decision Audit Trail Modal */}
      <AuditTrailModal
        isOpen={isAuditTrailOpen}
        onClose={() => setIsAuditTrailOpen(false)}
        steps={steps}
        lessonPlan={lessonPlan}
      />

      {/* Official Agnes 3.0 Flash & Rate Limiter Configuration Modal */}
      <AgnesConfigModal
        isOpen={isAgnesModalOpen}
        onClose={() => setIsAgnesModalOpen(false)}
      />

      {/* Digital India Bhashini Indic Voice AI Configuration & Mic Diagnostics Modal */}
      <BhashiniConfigModal
        isOpen={isBhashiniModalOpen}
        onClose={() => setIsBhashiniModalOpen(false)}
      />

      {/* Grounded Photosynthesis Explainable AI (XAI) Socratic Chatbot */}
      <ExplainableAIChatBot
        currentLanguage={selectedLanguage}
        students={students}
        onSpeakText={handleSpeakCustomText}
      />

      {/* Floating Indic Voice Page Reader Toolbar */}
      {isPageReaderOpen && (
        <PageVoiceReader
          activeTab={currentPersona === 'student' ? 'learners' : activeTeacherTab}
          selectedLanguage={selectedLanguage}
          lessonPlan={lessonPlan}
          students={students}
          conflicts={documents}
          isOpen={isPageReaderOpen}
          onToggleOpen={() => setIsPageReaderOpen(!isPageReaderOpen)}
        />
      )}

    </div>
  );
}

export default App;
