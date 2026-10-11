import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Sparkles,
  Volume2,
  VolumeX,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  BarChart3,
  Brain,
  ShieldAlert,
  ShieldCheck,
  ChevronDown,
  Layers,
  Flame,
  Target,
  Zap,
  Info,
  Lightbulb,
  BookOpen,
  Check,
  X,
  Radio,
  RefreshCw,
  Clock,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FormativeQuizItem, LessonPlan, Student } from '../types';
import { voiceService } from '../services/voiceService';
import { apiClient } from '../services/apiClient';
import { sharedState } from '../services/sharedStateManager';

interface FormativeQuizEngineProps {
  lessonPlan: LessonPlan;
  students?: Student[];
  currentStudentId?: string;
  selectedLanguage?: 'English' | 'Hindi' | 'Kannada' | 'Bilingual';
  onUpdateStudentScore?: (studentId: string, quizScore: number) => void;
  onSpeakText?: (text: string, lang?: string) => void;
  initialMode?: 'quiz' | 'telemetry';
  className?: string;
}

export const FormativeQuizEngine: React.FC<FormativeQuizEngineProps> = ({
  lessonPlan,
  students = [],
  currentStudentId,
  selectedLanguage = 'English',
  onUpdateStudentScore,
  onSpeakText,
  initialMode = 'quiz',
  className = ''
}) => {
  // Active student selection
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    currentStudentId || (students.length > 0 ? students[0].id : 's-rahul')
  );

  // View mode: 'quiz' | 'telemetry'
  const [activeViewMode, setActiveViewMode] = useState<'quiz' | 'telemetry'>(initialMode);

  // Active language state (allows per-quiz language switching)
  const [quizLanguage, setQuizLanguage] = useState<'English' | 'Hindi' | 'Kannada'>(
    selectedLanguage === 'Hindi' ? 'Hindi' : (selectedLanguage === 'Kannada' ? 'Kannada' : 'English')
  );

  // Synchronize language if prop changes
  useEffect(() => {
    if (selectedLanguage === 'Hindi') setQuizLanguage('Hindi');
    else if (selectedLanguage === 'Kannada') setQuizLanguage('Kannada');
    else if (selectedLanguage === 'English') setQuizLanguage('English');
  }, [selectedLanguage]);

  // Questions state (initialized with 11 questions from lessonPlan, extensible via AI generation)
  const [quizQuestions, setQuizQuestions] = useState<FormativeQuizItem[]>(() => {
    return lessonPlan.formativeQuiz && lessonPlan.formativeQuiz.length > 0
      ? lessonPlan.formativeQuiz
      : [];
  });

  // Current question index & student answers
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showImmediateFeedback, setShowImmediateFeedback] = useState<boolean>(true);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // UI Modals & Popovers
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);
  const [isAutoGenerateOpen, setIsAutoGenerateOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationMessage, setGenerationMessage] = useState<string>('');
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState<boolean>(false);

  const currentStudent = students.find(s => s.id === selectedStudentId) || {
    id: 's-rahul',
    name: 'Rahul Sharma',
    riskScore: 78,
    riskLevel: 'high' as const,
    learningTwin: {
      profileType: 'Visual-Analogy Learner',
      masteryLevel: 20
    }
  };

  const totalQuestions = quizQuestions.length;
  const safeQIndex = Math.min(currentQIndex, Math.max(0, totalQuestions - 1));
  const currentQ = quizQuestions[safeQIndex] || quizQuestions[0];

  // Group questions by difficulty for DKT breakdown
  const easyQuestions = useMemo(() => quizQuestions.filter(q => q.difficulty === 'Easy'), [quizQuestions]);
  const mediumQuestions = useMemo(() => quizQuestions.filter(q => q.difficulty === 'Medium'), [quizQuestions]);
  const hardQuestions = useMemo(() => quizQuestions.filter(q => q.difficulty === 'Hard'), [quizQuestions]);

  // Dynamic Telemetry Metrics Computation
  const telemetryData = useMemo(() => {
    let easyCorrect = 0;
    let mediumCorrect = 0;
    let hardCorrect = 0;
    let totalCorrect = 0;

    const conceptStats: Record<string, { correct: number; total: number }> = {
      'Stomata Gas Exchange': { correct: 0, total: 0 },
      'Chloroplast Function': { correct: 0, total: 0 },
      'Chemical Equation Balancing': { correct: 0, total: 0 },
      'Balanced Stoichiometry': { correct: 0, total: 0 },
      'Water Transport Dynamics': { correct: 0, total: 0 },
      'Iodine Starch Test': { correct: 0, total: 0 },
      'Limiting Reactant Dynamics': { correct: 0, total: 0 },
      'Light Compensation Point': { correct: 0, total: 0 }
    };

    quizQuestions.forEach((q, idx) => {
      const concept = q.targetedConcept || 'General Photosynthesis';
      if (!conceptStats[concept]) {
        conceptStats[concept] = { correct: 0, total: 0 };
      }
      conceptStats[concept].total += 1;

      const chosen = selectedAnswers[idx];
      if (chosen !== undefined && chosen === q.correctAnswerIndex) {
        totalCorrect += 1;
        conceptStats[concept].correct += 1;
        if (q.difficulty === 'Easy') easyCorrect += 1;
        else if (q.difficulty === 'Medium') mediumCorrect += 1;
        else if (q.difficulty === 'Hard') hardCorrect += 1;
      }
    });

    // 1x for Easy, 2x for Medium, 3x for Hard
    const easyWeight = 1;
    const medWeight = 2;
    const hardWeight = 3;

    const weightedScore = (easyCorrect * easyWeight) + (mediumCorrect * medWeight) + (hardCorrect * hardWeight);
    const maxWeightedScore = (easyQuestions.length * easyWeight) + (mediumQuestions.length * medWeight) + (hardQuestions.length * hardWeight);
    
    // Level of understanding percentage
    const levelOfUnderstanding = maxWeightedScore > 0 ? Math.round((weightedScore / maxWeightedScore) * 100) : 0;
    
    // Topic Clarity Score (10% to 100%)
    const topicClarityScore = Math.max(10, Math.round(levelOfUnderstanding * 0.9 + (totalCorrect > 0 ? 5 : 0)));
    
    // Risk Gap computation (e.g. -45% when struggling)
    const riskGap = Math.min(0, Math.round(-55 + (levelOfUnderstanding * 0.55)));

    // Concept Clarity Matrix
    const conceptMatrix = Object.entries(conceptStats)
      .filter(([_, data]) => data.total > 0)
      .map(([concept, data]) => {
        const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 10;
        return {
          concept,
          percentage: pct === 0 && selectedAnswers[0] === undefined ? 10 : pct,
          correct: data.correct,
          total: data.total
        };
      });

    // Difficulty Percentages
    const easyPct = easyQuestions.length > 0 ? Math.round((easyCorrect / easyQuestions.length) * 100) : 0;
    const medPct = mediumQuestions.length > 0 ? Math.round((mediumCorrect / mediumQuestions.length) * 100) : 0;
    const hardPct = hardQuestions.length > 0 ? Math.round((hardCorrect / hardQuestions.length) * 100) : 0;

    // AI Socratic Diagnostic Insight
    let diagnosticInsight = '';
    let recommendedNext = 'LEVEL 1 (EASY)';

    if (levelOfUnderstanding < 35) {
      diagnosticInsight = `Foundational gaps detected. Recommend reviewing the concrete analogy and glossary before proceeding.`;
      recommendedNext = 'LEVEL 1 (EASY)';
    } else if (levelOfUnderstanding < 70) {
      diagnosticInsight = `Foundational concepts solid (${easyPct}% Easy). Focus on conceptual mechanisms of stomatal turgor and balanced equations.`;
      recommendedNext = 'LEVEL 2 (MEDIUM)';
    } else {
      diagnosticInsight = `High topic mastery demonstrated (${levelOfUnderstanding}%). Ready for multi-variable analytical inquiries and limiting reactant dynamics.`;
      recommendedNext = 'LEVEL 3 (HARD)';
    }

    return {
      easyCorrect,
      easyTotal: easyQuestions.length,
      easyPct,
      mediumCorrect,
      mediumTotal: mediumQuestions.length,
      medPct,
      hardCorrect,
      hardTotal: hardQuestions.length,
      hardPct,
      totalCorrect,
      totalAnswered: Object.keys(selectedAnswers).length,
      weightedScore,
      maxWeightedScore,
      levelOfUnderstanding,
      topicClarityScore,
      riskGap,
      conceptMatrix,
      diagnosticInsight,
      recommendedNext
    };
  }, [quizQuestions, selectedAnswers, easyQuestions, mediumQuestions, hardQuestions]);

  // Handle Option Click
  const handleSelectOption = (optIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [safeQIndex]: optIndex
    }));
  };

  // Handle Next Question
  const handleNext = () => {
    if (safeQIndex < totalQuestions - 1) {
      setCurrentQIndex(prev => prev + 1);
      setIsHintOpen(false);
    } else {
      // Completed all questions
      setIsQuizCompleted(true);
      setActiveViewMode('telemetry');
      
      if (onUpdateStudentScore) {
        onUpdateStudentScore(selectedStudentId, telemetryData.totalCorrect);
      }

      if (telemetryData.levelOfUnderstanding >= 70) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.75 }
        });
      }
    }
  };

  // Reset Quiz
  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentQIndex(0);
    setIsQuizCompleted(false);
    setIsHintOpen(false);
  };

  // Speak Current Question aloud using Bhashini Indic Voice
  const handleSpeakQuestion = () => {
    if (!currentQ) return;
    
    let textToSpeak = '';
    if (quizLanguage === 'Hindi') {
      textToSpeak = `${currentQ.questionHindi || currentQ.question}. विकल्प: ${(currentQ.optionsHindi || currentQ.options).join(', ')}`;
    } else if (quizLanguage === 'Kannada') {
      textToSpeak = `${currentQ.questionKannada || currentQ.question}. ಆಯ್ಕೆಗಳು: ${(currentQ.optionsKannada || currentQ.options).join(', ')}`;
    } else {
      textToSpeak = `${currentQ.question}. Options: ${currentQ.options.join(', ')}`;
    }

    setIsVoiceSpeaking(true);
    if (onSpeakText) {
      onSpeakText(textToSpeak, quizLanguage);
    } else {
      voiceService.speak(textToSpeak, () => setIsVoiceSpeaking(false), quizLanguage);
    }
  };

  // AI Auto-Generate Adaptive Question via Groq LPU / Agnes
  const handleGenerateAdaptive = async (difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy') => {
    setIsGenerating(true);
    setIsAutoGenerateOpen(false);
    setGenerationMessage(`Groq Cloud LPU generating ${difficulty} adaptive question...`);

    try {
      const targetConcept = currentQ?.targetedConcept || 'Photosynthesis Mechanisms';
      const quizPayload = JSON.stringify({
        topic: lessonPlan.topic,
        difficulty,
        concept: targetConcept,
        student_name: currentStudent.name,
        target_language: quizLanguage
      });

      let resp: Response | null = null;
      try {
        resp = await fetch('/quizzes/generate-adaptive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: quizPayload
        });
      } catch {
        // Fallback to Render URL
      }

      if (!resp || !resp.ok) {
        resp = await fetch('https://mindmesh-nexus.onrender.com/quizzes/generate-adaptive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: quizPayload
        });
      }

      if (resp.ok) {
        const data = await resp.json();
        const genQ: FormativeQuizItem = data.generated_question;
        if (genQ) {
          setQuizQuestions(prev => [...prev, genQ]);
          setCurrentQIndex(quizQuestions.length); // Jump to new question
          setGenerationMessage(`✨ Generated new ${difficulty} question successfully!`);
        }
      } else {
        // Create fallback adaptive question locally
        createLocalAdaptiveQuestion(difficulty);
      }
    } catch (e) {
      createLocalAdaptiveQuestion(difficulty);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationMessage(''), 3000);
    }
  };

  const createLocalAdaptiveQuestion = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    const newId = `q-${quizQuestions.length + 1}-adaptive`;
    const newQ: FormativeQuizItem = {
      id: newId,
      question: `Adaptive Investigation (${difficulty}): How does water availability directly affect stomatal conductance in leaf epidermis?`,
      questionHindi: `अनुकूली जांच (${difficulty}): जल की उपलब्धता पत्ती की बाह्यत्वचा में रंध्रों के खुलने और बंद होने को कैसे प्रभावित करती है?`,
      questionKannada: `ಹೊಂದಾಣಿಕೆಯ ಪ್ರಶ್ನೆ (${difficulty}): ನೀರಿನ ಲಭ್ಯತೆಯು ಪತ್ರರಂಧ್ರಗಳ ಕಾರ್ಯನಿರ್ವಹಣೆಯ ಮೇಲೆ ಹೇಗೆ ನೇರ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ?`,
      options: [
        'Abundant water causes guard cells to swell turgid and open',
        'Water causes guard cells to dissolve completely',
        'Water blocks carbon dioxide from entering leaves',
        'Water turns chlorophyll purple'
      ],
      optionsHindi: [
        'प्रचुर जल द्वार कोशिकाओं को फुलाकर रंध्रों को खोल देता है',
        'जल द्वार कोशिकाओं को नष्ट कर देता है',
        'जल कार्बन डाइऑक्साइड को अंदर जाने से रोकता है',
        'जल क्लोरोफिल को बैंगनी कर देता है'
      ],
      optionsKannada: [
        'ಸಾಕಷ್ಟು ನೀರು ಕಾವಲು ಕೋಶಗಳನ್ನು ಉಬ್ಬಿಸಿ ರಂಧ್ರವನ್ನು ತೆರೆಯುತ್ತದೆ',
        'ನೀರು ಕಾವಲು ಕೋಶಗಳನ್ನು ಕರಗಿಸುತ್ತದೆ',
        'ನೀರು CO2 ಪ್ರವೇಶವನ್ನು ತಡೆಯುತ್ತದೆ',
        'ನೀರು ಕ್ಲೋರೋಫಿಲ್ ಅನ್ನು ನೇರಳೆ ಬಣ್ಣಕ್ಕೆ ತಿರುಗಿಸುತ್ತದೆ'
      ],
      correctAnswerIndex: 0,
      explanation: 'Turgor pressure inside guard cells stretches their elastic outer walls, mechanically pulling the central pore open.',
      explanationHindi: 'द्वार कोशिकाओं में स्फीति दाब (Turgor Pressure) रंध्र को खोलता है।',
      explanationKannada: 'ಕಾವಲು ಕೋಶಗಳಲ್ಲಿನ ನೀರಿನ ಒತ್ತಡವು ಪತ್ರರಂಧ್ರವನ್ನು ತೆರೆಯುವಂತೆ ಮಾಡುತ್ತದೆ.',
      targetedConcept: 'Stomata Gas Exchange',
      difficulty
    };

    setQuizQuestions(prev => [...prev, newQ]);
    setCurrentQIndex(quizQuestions.length);
    setGenerationMessage(`✨ Generated new ${difficulty} adaptive question!`);
  };

  // Get active text based on language
  const getDisplayQuestion = (q: FormativeQuizItem) => {
    if (quizLanguage === 'Hindi') return q.questionHindi || q.question;
    if (quizLanguage === 'Kannada') return q.questionKannada || q.question;
    return q.question;
  };

  const getDisplayOptions = (q: FormativeQuizItem) => {
    if (quizLanguage === 'Hindi' && q.optionsHindi && q.optionsHindi.length > 0) return q.optionsHindi;
    if (quizLanguage === 'Kannada' && q.optionsKannada && q.optionsKannada.length > 0) return q.optionsKannada;
    return q.options;
  };

  const getDisplayExplanation = (q: FormativeQuizItem) => {
    if (quizLanguage === 'Hindi') return q.explanationHindi || q.explanation;
    if (quizLanguage === 'Kannada') return q.explanationKannada || q.explanation;
    return q.explanation;
  };

  const currentOptions = currentQ ? getDisplayOptions(currentQ) : [];
  const selectedOptionForCurrent = selectedAnswers[safeQIndex];
  const isCurrentAnswered = selectedOptionForCurrent !== undefined;
  const isCurrentCorrect = isCurrentAnswered && selectedOptionForCurrent === currentQ.correctAnswerIndex;

  // Level Badge helper
  const getDifficultyBadge = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
      case 'Easy':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            LEVEL 1 · EASY
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-300">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            LEVEL 2 · MEDIUM
          </span>
        );
      case 'Hard':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-300">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            LEVEL 3 · HARD
          </span>
        );
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto space-y-5 ${className}`}>
      
      {/* Top Header Mode Toggle & Student Selector Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        
        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveViewMode('quiz')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeViewMode === 'quiz'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>Formative Check (11 Qs)</span>
          </button>
          <button
            onClick={() => setActiveViewMode('telemetry')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeViewMode === 'telemetry'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Topic Clarity & Telemetry</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </button>
        </div>

        {/* Trilingual Switcher & Student Selector */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          {/* Trilingual buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
            {(['English', 'Hindi', 'Kannada'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setQuizLanguage(lang)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  quizLanguage === lang
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'English' ? 'EN' : (lang === 'Hindi' ? 'हिंदी' : 'ಕನ್ನಡ')}
              </button>
            ))}
          </div>

          {/* Student Selector */}
          {students.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-xs"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.preferredLanguage || 'Bilingual'})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

      </div>

      {/* Generation Status Toast */}
      {generationMessage && (
        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
            <span>{generationMessage}</span>
          </div>
          <button onClick={() => setGenerationMessage('')} className="text-slate-400 hover:text-slate-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: FORMATIVE CHECK ADAPTIVE QUIZ ENGINE (MATCHING SCREENSHOT 1)      */}
      {/* ========================================================================= */}
      {activeViewMode === 'quiz' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 md:p-8 space-y-6 animate-fadeIn">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
            
            {/* Title & Concept with Medal Icon */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-outfit uppercase tracking-tight">
                  FORMATIVE CHECK: Q{safeQIndex + 1} OF {totalQuestions}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Concept: <strong className="text-slate-900">{currentQ.targetedConcept}</strong>
                </p>
              </div>
            </div>

            {/* Level Badge + Auto-Generate Dropdown */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              {getDifficultyBadge(currentQ.difficulty)}

              {/* Auto-Generate Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setIsAutoGenerateOpen(prev => !prev)}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Auto-Generate</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAutoGenerateOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isAutoGenerateOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-30 animate-fadeIn text-xs">
                    <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-extrabold text-slate-400 border-b border-slate-100">
                      ⚡ Groq LPU Adaptive Gen
                    </div>
                    <button
                      onClick={() => handleGenerateAdaptive('Easy')}
                      className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 flex items-center gap-2 font-medium"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Level 1: Foundational Recall</span>
                    </button>
                    <button
                      onClick={() => handleGenerateAdaptive('Medium')}
                      className="w-full text-left px-3 py-2 hover:bg-sky-50 text-slate-800 hover:text-sky-900 flex items-center gap-2 font-medium"
                    >
                      <span className="w-2 h-2 rounded-full bg-sky-500" />
                      <span>Level 2: Conceptual Mechanism</span>
                    </button>
                    <button
                      onClick={() => handleGenerateAdaptive('Hard')}
                      className="w-full text-left px-3 py-2 hover:bg-purple-50 text-slate-800 hover:text-purple-900 flex items-center gap-2 font-medium"
                    >
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>Level 3: Analytical Inquiry</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Stepper Progress Pill Bar (11 Rounded Step Indicators) */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
              {quizQuestions.map((q, idx) => {
                const isCurrent = idx === safeQIndex;
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isCorrect = isAnswered && selectedAnswers[idx] === q.correctAnswerIndex;

                let pillColor = 'bg-slate-200';
                if (isCurrent) {
                  pillColor = 'bg-indigo-600 ring-2 ring-indigo-300 ring-offset-1';
                } else if (isAnswered) {
                  pillColor = isCorrect ? 'bg-emerald-500' : 'bg-rose-400';
                }

                return (
                  <button
                    key={q.id || idx}
                    onClick={() => {
                      setCurrentQIndex(idx);
                      setIsHintOpen(false);
                    }}
                    title={`Q${idx + 1}: ${q.targetedConcept} (${q.difficulty})`}
                    className={`h-2.5 flex-1 min-w-[24px] sm:min-w-[32px] rounded-full transition-all cursor-pointer ${pillColor}`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
              <span>Step {safeQIndex + 1} of {totalQuestions}</span>
              <span>{Object.keys(selectedAnswers).length} answered</span>
            </div>
          </div>

          {/* Main Question Box */}
          <div className="space-y-3 pt-1">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug font-outfit">
              {getDisplayQuestion(currentQ)}
            </h3>

            {/* Bilingual Subtitle if Kannada/Hindi active */}
            {quizLanguage !== 'English' && (
              <p className="text-xs text-slate-500 font-medium">
                {currentQ.question}
              </p>
            )}
          </div>

          {/* MCQ Option Cards (A, B, C, D) */}
          <div className="space-y-3 pt-1">
            {currentOptions.map((optionText, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
              const isSelected = selectedOptionForCurrent === optIdx;
              const isCorrectOption = optIdx === currentQ.correctAnswerIndex;
              const hasAnswered = selectedOptionForCurrent !== undefined;

              // Styles based on state
              let cardClasses = 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 text-slate-800';
              let badgeClasses = 'bg-slate-100 text-slate-600 border-slate-300';

              if (isSelected) {
                if (hasAnswered && showImmediateFeedback) {
                  if (isCorrectOption) {
                    cardClasses = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-200';
                    badgeClasses = 'bg-emerald-600 text-white border-emerald-600';
                  } else {
                    cardClasses = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-200';
                    badgeClasses = 'bg-rose-600 text-white border-rose-600';
                  }
                } else {
                  cardClasses = 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-2 ring-indigo-200';
                  badgeClasses = 'bg-indigo-600 text-white border-indigo-600';
                }
              } else if (hasAnswered && showImmediateFeedback && isCorrectOption) {
                cardClasses = 'bg-emerald-50/60 border-emerald-300 text-emerald-950';
                badgeClasses = 'bg-emerald-500 text-white border-emerald-500';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer shadow-xs ${cardClasses}`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs flex-shrink-0 font-mono transition-colors ${badgeClasses}`}>
                      {letter}
                    </span>
                    <span className="text-sm sm:text-base font-semibold leading-relaxed">
                      {optionText}
                    </span>
                  </div>

                  {/* Feedback Icons */}
                  {hasAnswered && showImmediateFeedback && (
                    <div className="flex-shrink-0">
                      {isCorrectOption ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-rose-500" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Socratic Explanation Card (Revealed upon answering) */}
          {isCurrentAnswered && (
            <div className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-1.5 transition-all animate-fadeIn ${
              isCurrentCorrect
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-center gap-1.5 font-bold">
                {isCurrentCorrect ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Correct! NCERT Concept Grounding:</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>Socratic Scaffolding Explanation:</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed font-medium">
                {getDisplayExplanation(currentQ)}
              </p>
            </div>
          )}

          {/* Socratic Hint Popover */}
          {isHintOpen && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Socratic Analogy Hint (Plant Kitchen):</span>
                </div>
                <button onClick={() => setIsHintOpen(false)} className="text-amber-700 hover:text-amber-900">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="font-medium leading-relaxed">
                {quizLanguage === 'Hindi'
                  ? 'सोचिए कि पत्ती एक सौर रसोई है! हवा से क्या लिया जाता है और सूरज की रोशनी में कौन सा गैस भोजन पकाने के लिए मुख्य घटक है?'
                  : quizLanguage === 'Kannada'
                  ? 'ಎಲೆಯನ್ನು ಸೌರ ಅಡುಗೆಮನೆ ಎಂದು ಭಾವಿಸಿ! ಸಸ್ಯವು ಗಾಳಿಯಿಂದ ಯಾವ ಅನಿಲವನ್ನು ಹೀರಿಕೊಂಡು ಸಕ್ಕರೆ ತಯಾರಿಸಲು ಬಳಸುತ್ತದೆ?'
                  : 'Think of the leaf like a busy solar kitchen! Stomata are tiny mouth openings that take in the gaseous ingredient from air, while roots drink water.'}
              </p>
            </div>
          )}

          {/* Bottom Action Toolbar (Listen, Hint, Next Question) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            
            {/* Left Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeakQuestion}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-bold text-xs transition-all cursor-pointer"
              >
                {isVoiceSpeaking ? (
                  <Volume2 className="w-4 h-4 text-sky-600 animate-bounce" />
                ) : (
                  <Volume2 className="w-4 h-4 text-sky-600" />
                )}
                <span>Listen</span>
              </button>

              <button
                onClick={() => setIsHintOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs transition-all cursor-pointer"
              >
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Hint</span>
              </button>

              <button
                onClick={() => setActiveViewMode('telemetry')}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                <BarChart3 className="w-4 h-4 text-slate-600" />
                <span>Telemetry</span>
              </button>
            </div>

            {/* Right Action Button */}
            <div className="flex items-center justify-end gap-2">
              {safeQIndex > 0 && (
                <button
                  onClick={() => setCurrentQIndex(prev => prev - 1)}
                  className="px-4 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-all cursor-pointer"
                >
                  Previous
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={!isCurrentAnswered}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{safeQIndex < totalQuestions - 1 ? 'Next Question' : 'View Telemetry →'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: TOPIC CLARITY & MASTERY TELEMETRY (MATCHING SCREENSHOT 2)         */}
      {/* ========================================================================= */}
      {activeViewMode === 'telemetry' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 md:p-8 space-y-6 animate-fadeIn">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-outfit uppercase tracking-tight">
                  TOPIC CLARITY & MASTERY TELEMETRY
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {lessonPlan.topic}
                </p>
              </div>
            </div>

            {/* DKT Live Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                DKT Live
              </span>

              <button
                onClick={() => setActiveViewMode('quiz')}
                className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
              >
                Back to Quiz
              </button>
            </div>

          </div>

          {/* Top 2 KPI Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Card 1: LEVEL OF UNDERSTANDING */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                LEVEL OF UNDERSTANDING
              </span>
              
              <div className="flex items-baseline gap-3">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit">
                  {telemetryData.levelOfUnderstanding}%
                </div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
                  MASTERY
                </span>

                {/* Badge */}
                <div className="ml-auto">
                  {telemetryData.levelOfUnderstanding < 50 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Needs Reinforcement
                    </span>
                  ) : telemetryData.levelOfUnderstanding < 80 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Zap className="w-3.5 h-3.5" />
                      Developing Mastery
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Concept Mastered
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-500 font-medium">
                Weighted by Level 1 (1x), Level 2 (2x), & Level 3 (3x).
              </p>
            </div>

            {/* Card 2: TOPIC CLARITY SCORE */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  TOPIC CLARITY SCORE
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-outfit">
                  {telemetryData.topicClarityScore}%
                </span>
              </div>

              {/* Progress Bar (Pink/Red to purple) */}
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${telemetryData.topicClarityScore}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold pt-1">
                <span className="text-slate-600">
                  Misconceptions: <strong className="text-slate-900">Scaffold Active</strong>
                </span>
                <span className="text-indigo-600 font-bold">
                  Risk Gap: {telemetryData.riskGap}%
                </span>
              </div>
            </div>

          </div>

          {/* Section: Understanding by Question Difficulty Level */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 font-outfit">
                  Understanding by Question Difficulty Level
                </h3>
              </div>
              <span className="text-xs text-indigo-600 font-bold">
                Adaptive Path
              </span>
            </div>

            {/* 3 Level Rows */}
            <div className="space-y-2.5">
              
              {/* Level 1 Easy */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      LEVEL 1 · EASY
                    </span>
                    <span className="text-slate-700 font-bold">Foundational Recall</span>
                  </div>
                  <div className="text-slate-900 font-bold font-mono">
                    {telemetryData.easyCorrect}/{telemetryData.easyTotal} Correct <span className="ml-1 text-emerald-700">{telemetryData.easyPct}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${telemetryData.easyPct}%` }}
                  />
                </div>
              </div>

              {/* Level 2 Medium */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800">
                      LEVEL 2 · MEDIUM
                    </span>
                    <span className="text-slate-700 font-bold">Conceptual Mechanism</span>
                  </div>
                  <div className="text-slate-900 font-bold font-mono">
                    {telemetryData.mediumCorrect}/{telemetryData.mediumTotal} Correct <span className="ml-1 text-sky-700">{telemetryData.medPct}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${telemetryData.medPct}%` }}
                  />
                </div>
              </div>

              {/* Level 3 Hard */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
                      LEVEL 3 · HARD
                    </span>
                    <span className="text-slate-700 font-bold">Analytical Inquiry</span>
                  </div>
                  <div className="text-slate-900 font-bold font-mono">
                    {telemetryData.hardCorrect}/{telemetryData.hardTotal} Correct <span className="ml-1 text-purple-700">{telemetryData.hardPct}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${telemetryData.hardPct}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Section: CONCEPT CLARITY MATRIX */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-outfit uppercase tracking-tight">
                  CONCEPT CLARITY MATRIX
                </h3>
              </div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 font-mono">
                AUTO-EVALUATED
              </span>
            </div>

            {/* Matrix 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {telemetryData.conceptMatrix.slice(0, 6).map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{item.concept}</span>
                    <span className="font-mono text-amber-800">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(8, item.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Diagnostic Insight Card */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-indigo-950 text-xs sm:text-sm flex items-start gap-3 shadow-2xs">
            <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-indigo-900">
                AI Diagnostic Insight for {currentStudent.name}:
              </p>
              <p className="text-slate-700 font-medium leading-relaxed">
                {telemetryData.diagnosticInsight}
              </p>
            </div>
          </div>

          {/* Bottom Recommended Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Recommended Next: <strong className="text-slate-900">{telemetryData.recommendedNext}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetQuiz}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Check</span>
              </button>

              <button
                onClick={() => handleGenerateAdaptive(telemetryData.recommendedNext.includes('EASY') ? 'Easy' : (telemetryData.recommendedNext.includes('MEDIUM') ? 'Medium' : 'Hard'))}
                disabled={isGenerating}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Generate Adaptive Q &gt;</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
