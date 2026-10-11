import { Student, DocumentSource, LessonPlan, AdaptiveRoute, TeacherCopilotRecommendation } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-0',
    name: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    grade: 11,
    learningPace: 'slow',
    preferredLanguage: 'Bilingual',
    recentScores: [
      { quizName: 'TCP Handshake & Headers', score: 9, maxScore: 10, date: '2026-10-01' },
      { quizName: 'Flow & Sliding Window', score: 7, maxScore: 10, date: '2026-10-04' },
      { quizName: 'Slow Start & Congestion Control', score: 4, maxScore: 10, date: '2026-10-07' }
    ],
    weakConcepts: ['Slow Start Exponential Growth', 'Congestion Avoidance (AIMD)', 'Bufferbloat Dynamics'],
    masteredConcepts: ['TCP Basics & 3-Way Handshake', 'Port Numbers & Sockets'],
    riskScore: 82,
    riskReason: 'Confuses receiver-driven Flow Control (rwnd) with network-driven Congestion Control (cwnd); struggles with exponential window doubling calculations.',
    recommendedScaffolding: 'Use the "Water Pipe and Funnel" physical reservoir analogy with step-by-step RTT doubling worksheets.',
    learningTwin: {
      studentName: 'Rahul Sharma',
      subjectDomain: 'Computer Networks (CN) & CSE',
      conceptBreakdown: [
        { conceptName: 'TCP Basics & Handshake', masteryPercentage: 91, trend: 'improving', category: 'Foundational', status: 'mastered' },
        { conceptName: 'Flow Control (rwnd)', masteryPercentage: 72, trend: 'stable', category: 'Intermediate', status: 'moderate' },
        { conceptName: 'Slow Start (Exponential)', masteryPercentage: 48, trend: 'declining', category: 'Bottleneck', status: 'struggling' },
        { conceptName: 'Congestion Control (AIMD)', masteryPercentage: 55, trend: 'declining', category: 'Downstream', status: 'struggling' }
      ],
      cognitiveTraits: {
        strongAt: ['Physical real-world examples & packet analogies', 'Definition recall & socket basics'],
        weakAt: ['Multi-step window calculations', 'Application questions under timed pressure'],
        modalityPreference: 'Prefers voice explanations in Hindi/English + interactive visual simulators',
        learningPace: 'slow'
      },
      predictedDifficulty: {
        targetConcept: 'Congestion Avoidance & Window Scaling',
        riskPercentage: 82,
        recommendedIntervention: 'Provide bilingual "Water Pipe & Funnel" scaffold with interactive RTT packet doubling simulator.'
      },
      learningTrajectory: [
        { timestamp: '2026-10-01', concept: 'TCP Basics', deltaScore: 91, action: 'Quiz 1 Mastered' },
        { timestamp: '2026-10-04', concept: 'Flow Control', deltaScore: 72, action: 'Worksheet Passed' },
        { timestamp: '2026-10-07', concept: 'Slow Start', deltaScore: 48, action: 'Intervention Required' }
      ],
      explainableAdaptation: {
        studentName: 'Rahul Sharma',
        conceptName: 'Flow Control & Slow Start',
        adaptationHeadline: 'We moved Flow Control earlier because:',
        whyShikshaDidThis: [
          '4 recent answers were incorrect on TCP sliding window calculations',
          'Average response time increased 31% (42s avg vs 18s class baseline)',
          'Flow Control (rwnd) is a strict prerequisite before Congestion Control (cwnd)'
        ],
        previousPath: [
          'Flow Control',
          'Congestion Control',
          'Slow Start'
        ],
        newPath: [
          'Flow Control Revision (rwnd)',
          'Water Pipe Physical Analogy',
          'Quick Diagnostic Assessment (3 questions)',
          'Congestion Control (AIMD)'
        ],
        noveltyMessage: 'Don\'t just show: "AI personalized your path." Show: "Here\'s exactly why your path changed."'
      },
      conceptEvidences: [
        {
          conceptName: 'Slow Start',
          masteryPercentage: 48,
          evidenceItems: [
            { type: 'correct', icon: '✓', text: '3 correct conceptual definitions (Handshake & MSS size)', severity: 'success' },
            { type: 'mistake', icon: '✗', text: '2 application mistakes on cwnd exponential doubling formula', severity: 'danger' },
            { type: 'latency', icon: '⚠', text: 'High response latency (42.6s avg per calculation)', severity: 'warning' },
            { type: 'confidence', icon: '⚠', text: 'Low self-reported confidence rating (0.34)', severity: 'warning' },
            { type: 'repetition', icon: '↺', text: 'Repeated mistake: Confusing linear +1 MSS with exponential *2 growth', severity: 'danger' }
          ],
          evidenceFlow: [
            { step: 'Question', value: 'TCP cwnd = 4 MSS, 4 ACKs return. What is new cwnd?' },
            { step: 'Concept tested', value: 'Slow Start Exponential Doubling' },
            { step: 'Correct / incorrect', value: 'Incorrect (Selected 5 MSS instead of 8 MSS)' },
            { step: 'Confidence', value: '0.34 (Hesitant)' },
            { step: 'Time taken', value: '46.2 seconds (+31% hesitation)' },
            { step: 'Repeated mistake?', value: 'Yes (Confused additive increase with exponential doubling)' },
            { step: 'Mastery update', value: 'Mastery recalibrated: 58% → 48%' }
          ]
        },
        {
          conceptName: 'Flow Control',
          masteryPercentage: 72,
          evidenceItems: [
            { type: 'correct', icon: '✓', text: '4 correct answers on receiver buffer rwnd advertised window', severity: 'success' },
            { type: 'mistake', icon: '✗', text: '1 edge case mistake on Zero Window Probe (ZWP)', severity: 'warning' },
            { type: 'latency', icon: '✓', text: 'Normal response latency (18.2s avg)', severity: 'success' },
            { type: 'confidence', icon: '✓', text: 'High confidence rating (0.78)', severity: 'success' }
          ]
        }
      ]
    }
  },
  {
    id: 'std-1',
    name: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    grade: 7,
    learningPace: 'slow',
    preferredLanguage: 'Hindi',
    recentScores: [
      { quizName: 'Plant Cell Structure', score: 5, maxScore: 10, date: '2026-09-28' },
      { quizName: 'Nutrient Transport in Plants', score: 4, maxScore: 10, date: '2026-10-02' }
    ],
    weakConcepts: ['Chloroplast Function', 'Chemical Equation Balancing', 'Light Reactions'],
    masteredConcepts: ['Plant Roots', 'Water Absorption'],
    riskScore: 86,
    riskReason: 'Struggles with abstract multi-step chemical reactions; needs visual & bilingual analogies.',
    recommendedScaffolding: 'Use the "Kitchen of the Plant" analogy in Hindi with step-by-step diagram highlights.',
    learningTwin: {
      studentName: 'Aarav Sharma',
      subjectDomain: 'Biology / Science',
      conceptBreakdown: [
        { conceptName: 'Plant Roots & Water', masteryPercentage: 94, trend: 'improving', category: 'Foundational', status: 'mastered' },
        { conceptName: 'Chloroplast Function', masteryPercentage: 70, trend: 'stable', category: 'Intermediate', status: 'moderate' },
        { conceptName: 'Stomata Gas Exchange', masteryPercentage: 42, trend: 'declining', category: 'Bottleneck', status: 'struggling' },
        { conceptName: 'Chemical Equation Balancing', masteryPercentage: 45, trend: 'declining', category: 'Downstream', status: 'struggling' }
      ],
      cognitiveTraits: {
        strongAt: ['Concrete visual analogies & "Plant Kitchen" metaphors', 'Recognizing plant structures'],
        weakAt: ['Abstract multi-step chemical reaction balancing', 'Formulas with subscripts'],
        modalityPreference: 'Prefers bilingual Hindi/English voice explanations + annotated diagrams',
        learningPace: 'slow'
      },
      predictedDifficulty: {
        targetConcept: 'Chemical Stoichiometry & Light Reaction ATP Fixation',
        riskPercentage: 86,
        recommendedIntervention: 'Deploy the "Kitchen of the Leaf" bilingual recipe with step-by-step molecular counts.'
      },
      learningTrajectory: [
        { timestamp: '2026-09-28', concept: 'Plant Cell Structure', deltaScore: 50, action: 'Diagnostic Quiz' },
        { timestamp: '2026-10-02', concept: 'Nutrient Transport', deltaScore: 40, action: 'Remedial Review' }
      ]
    }
  },
  {
    id: 'std-2',
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    grade: 7,
    learningPace: 'slow',
    preferredLanguage: 'Bilingual',
    recentScores: [
      { quizName: 'Plant Cell Structure', score: 6, maxScore: 10, date: '2026-09-28' },
      { quizName: 'Nutrient Transport in Plants', score: 5, maxScore: 10, date: '2026-10-02' }
    ],
    weakConcepts: ['Stomata Gas Exchange', 'Chlorophyll role in light capture'],
    masteredConcepts: ['Leaf anatomy basics'],
    riskScore: 78,
    riskReason: 'Confuses respiratory gas exchange with photosynthetic gas exchange.',
    recommendedScaffolding: 'Provide bilingual side-by-side comparison table for CO2 vs O2 movement.',
    learningTwin: {
      studentName: 'Priya Patel',
      subjectDomain: 'Biology / Science',
      conceptBreakdown: [
        { conceptName: 'Leaf Anatomy Basics', masteryPercentage: 88, trend: 'improving', category: 'Foundational', status: 'mastered' },
        { conceptName: 'Chlorophyll Photons', masteryPercentage: 74, trend: 'stable', category: 'Intermediate', status: 'moderate' },
        { conceptName: 'Stomata Gas Dynamics', masteryPercentage: 46, trend: 'declining', category: 'Bottleneck', status: 'struggling' },
        { conceptName: 'Photosynthetic Respiration', masteryPercentage: 52, trend: 'declining', category: 'Downstream', status: 'struggling' }
      ],
      cognitiveTraits: {
        strongAt: ['Visual diagram inspection & color-coded worksheets', 'Pair learning discussions'],
        weakAt: ['Distinguishing daytime CO2 absorption from nighttime O2 release'],
        modalityPreference: 'Prefers side-by-side bilingual comparative tables + audio hints',
        learningPace: 'slow'
      },
      predictedDifficulty: {
        targetConcept: 'Guard Cell Osmotic Turgidity & Transpiration Pull',
        riskPercentage: 78,
        recommendedIntervention: 'Provide side-by-side dual-column table for Daytime vs Nighttime stomata movement.'
      },
      learningTrajectory: [
        { timestamp: '2026-09-28', concept: 'Plant Cell Structure', deltaScore: 60, action: 'Quiz 1' },
        { timestamp: '2026-10-02', concept: 'Nutrient Transport', deltaScore: 50, action: 'Formative Check' }
      ]
    }
  },
  {
    id: 'std-3',
    name: 'Rohan Verma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    grade: 7,
    learningPace: 'slow',
    preferredLanguage: 'Hindi',
    recentScores: [
      { quizName: 'Plant Cell Structure', score: 4, maxScore: 10, date: '2026-09-28' },
      { quizName: 'Nutrient Transport in Plants', score: 4, maxScore: 10, date: '2026-10-02' }
    ],
    weakConcepts: ['Chemical Equation Balancing', 'Stroma vs Thylakoids'],
    masteredConcepts: ['Sunlight necessity'],
    riskScore: 84,
    riskReason: 'Low test stamina; requires bite-sized 2-minute checkpoint questions.',
    recommendedScaffolding: 'Pair with peer buddy for guided inquiry; offer phonetic Hindi audio terms.',
    learningTwin: {
      studentName: 'Rohan Verma',
      subjectDomain: 'Biology / Science',
      conceptBreakdown: [
        { conceptName: 'Sunlight Energy Basics', masteryPercentage: 92, trend: 'stable', category: 'Foundational', status: 'mastered' },
        { conceptName: 'Chloroplast Stroma', masteryPercentage: 68, trend: 'stable', category: 'Intermediate', status: 'moderate' },
        { conceptName: 'Thylakoid Light Reaction', masteryPercentage: 45, trend: 'declining', category: 'Bottleneck', status: 'struggling' },
        { conceptName: 'Chemical Equation Balancing', masteryPercentage: 42, trend: 'declining', category: 'Downstream', status: 'struggling' }
      ],
      cognitiveTraits: {
        strongAt: ['Hands-on leaf tactile inspection', 'Short bite-sized questions'],
        weakAt: ['Long multi-paragraph texts', 'Calculations without visual diagrams'],
        modalityPreference: 'Prefers bite-sized 2-minute voice checkpoints and peer buddy pairing',
        learningPace: 'slow'
      },
      predictedDifficulty: {
        targetConcept: 'Chemical Equation Stoichiometry & Glucose Storage',
        riskPercentage: 84,
        recommendedIntervention: 'Break questions into 2-minute micro-steps with immediate audio verification.'
      },
      learningTrajectory: [
        { timestamp: '2026-09-28', concept: 'Plant Cell Structure', deltaScore: 40, action: 'Quiz 1' },
        { timestamp: '2026-10-02', concept: 'Nutrient Transport', deltaScore: 40, action: 'Review' }
      ]
    }
  },
  {
    id: 'std-4',
    name: 'Sneha Gupta',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    grade: 7,
    learningPace: 'standard',
    preferredLanguage: 'English',
    recentScores: [
      { quizName: 'Plant Cell Structure', score: 8, maxScore: 10, date: '2026-09-28' },
      { quizName: 'Nutrient Transport in Plants', score: 7, maxScore: 10, date: '2026-10-02' }
    ],
    weakConcepts: ['Transpiration pull'],
    masteredConcepts: ['Chloroplast Function', 'Stomata Gas Exchange'],
    riskScore: 32,
    riskReason: 'Consistent performer; ready for standard pacing.',
    recommendedScaffolding: 'Standard interactive worksheets and active group discussions.',
    learningTwin: {
      studentName: 'Sneha Gupta',
      subjectDomain: 'Biology / Science',
      conceptBreakdown: [
        { conceptName: 'Plant Cell Structure', masteryPercentage: 92, trend: 'improving', category: 'Foundational', status: 'mastered' },
        { conceptName: 'Stomata Mechanics', masteryPercentage: 85, trend: 'improving', category: 'Intermediate', status: 'mastered' },
        { conceptName: 'Equation Balancing', masteryPercentage: 78, trend: 'stable', category: 'Core', status: 'moderate' },
        { conceptName: 'Transpiration Pull', masteryPercentage: 62, trend: 'stable', category: 'Extension', status: 'moderate' }
      ],
      cognitiveTraits: {
        strongAt: ['Note-taking & color-coded notebook worksheets', 'Group discussion facilitation'],
        weakAt: ['Advanced physics of water capillary tension'],
        modalityPreference: 'Standard written worksheets + interactive digital quizzes',
        learningPace: 'standard'
      },
      predictedDifficulty: {
        targetConcept: 'Transpiration Xylem Tension Mechanics',
        riskPercentage: 32,
        recommendedIntervention: 'Assign standard lab worksheet with peer buddy review.'
      },
      learningTrajectory: [
        { timestamp: '2026-09-28', concept: 'Plant Cell Structure', deltaScore: 80, action: 'Passed' },
        { timestamp: '2026-10-02', concept: 'Nutrient Transport', deltaScore: 70, action: 'Passed' }
      ]
    }
  },
  {
    id: 'std-5',
    name: 'Vihaan Reddy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    grade: 7,
    learningPace: 'fast',
    preferredLanguage: 'English',
    recentScores: [
      { quizName: 'Plant Cell Structure', score: 10, maxScore: 10, date: '2026-09-28' },
      { quizName: 'Nutrient Transport in Plants', score: 9, maxScore: 10, date: '2026-10-02' }
    ],
    weakConcepts: [],
    masteredConcepts: ['All cellular processes', 'Equation balancing', 'Light spectra'],
    riskScore: 12,
    riskReason: 'High mastery; requires extension activities to avoid disengagement.',
    recommendedScaffolding: 'Assign the Advanced Calvin Cycle & Rate of Photosynthesis experiment challenge.',
    learningTwin: {
      studentName: 'Vihaan Reddy',
      subjectDomain: 'Biology / Science',
      conceptBreakdown: [
        { conceptName: 'Cellular Biochemistry', masteryPercentage: 98, trend: 'improving', category: 'Advanced', status: 'mastered' },
        { conceptName: 'Light Reactions & Photons', masteryPercentage: 96, trend: 'improving', category: 'Advanced', status: 'mastered' },
        { conceptName: 'Calvin Cycle & Fixation', masteryPercentage: 92, trend: 'improving', category: 'Extension', status: 'mastered' },
        { conceptName: 'Rate of Photosynthesis (BBR)', masteryPercentage: 88, trend: 'improving', category: 'Extension', status: 'mastered' }
      ],
      cognitiveTraits: {
        strongAt: ['High-order hypothesis formulation', 'Experimental data analysis & curve fitting'],
        weakAt: ['Routine repetitive worksheets (causes disengagement)'],
        modalityPreference: 'Prefers open-ended inquiry challenges & computer simulations',
        learningPace: 'fast'
      },
      predictedDifficulty: {
        targetConcept: 'C4/CAM Desert Plant Carbon Fixation Pathways',
        riskPercentage: 12,
        recommendedIntervention: 'Offer the Advanced Calvin Cycle & Hydrilla light wavelength experiment challenge.'
      },
      learningTrajectory: [
        { timestamp: '2026-09-28', concept: 'Cell Biochemistry', deltaScore: 100, action: 'Exceeded' },
        { timestamp: '2026-10-02', concept: 'Nutrient Transport', deltaScore: 90, action: 'Exceeded' }
      ]
    }
  },
  {
    id: 'std-7',
    name: 'Prajwal Gowda',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    grade: 7,
    learningPace: 'slow',
    preferredLanguage: 'Kannada',
    recentScores: [
      { quizName: 'Plant Cell Structure', score: 4, maxScore: 10, date: '2026-09-28' },
      { quizName: 'Nutrient Transport in Plants', score: 5, maxScore: 10, date: '2026-10-02' }
    ],
    weakConcepts: ['Stomata Gas Dynamics', 'Chemical Stoichiometry'],
    masteredConcepts: ['Plant Roots', 'Sunlight absorption'],
    riskScore: 82,
    riskReason: 'Struggles with English-only chemistry terms; thrives with Kannada (ಕನ್ನಡ) visual analogies and audio hints.',
    recommendedScaffolding: 'Provide bilingual Kannada-English "ಸಸ್ಯದ ಅಡುಗೆಮನೆ" (Plant Kitchen) scaffolding with voice prompts.',
    learningTwin: {
      studentName: 'Prajwal Gowda',
      subjectDomain: 'Biology / Science',
      conceptBreakdown: [
        { conceptName: 'Plant Roots & Sunlight', masteryPercentage: 90, trend: 'stable', category: 'Foundational', status: 'mastered' },
        { conceptName: 'Chlorophyll Absorption', masteryPercentage: 72, trend: 'stable', category: 'Intermediate', status: 'moderate' },
        { conceptName: 'Stomata Gas Dynamics', masteryPercentage: 44, trend: 'declining', category: 'Bottleneck', status: 'struggling' },
        { conceptName: 'Chemical Stoichiometry', masteryPercentage: 48, trend: 'declining', category: 'Downstream', status: 'struggling' }
      ],
      cognitiveTraits: {
        strongAt: ['Kannada audio explanations & experiential nature observations'],
        weakAt: ['English-only terminology without Kannada bridge vocabulary'],
        modalityPreference: 'Prefers Kannada (ಕನ್ನಡ) audio with bilingual visual cards',
        learningPace: 'slow'
      },
      predictedDifficulty: {
        targetConcept: 'Chemical Stoichiometry Equation Balancing',
        riskPercentage: 82,
        recommendedIntervention: 'Provide bilingual Kannada-English "ಸಸ್ಯದ ಅಡುಗೆಮನೆ" (Plant Kitchen) audio hints.'
      },
      learningTrajectory: [
        { timestamp: '2026-09-28', concept: 'Plant Roots', deltaScore: 40, action: 'Quiz 1' },
        { timestamp: '2026-10-02', concept: 'Nutrient Transport', deltaScore: 50, action: 'Remedial Kannada' }
      ]
    }
  }
];

export const INITIAL_DOCUMENTS: DocumentSource[] = [
  {
    id: 'doc-open-source-ai-spec',
    title: 'Open-Source AI Systems & Edge Architecture Specification (2026)',
    filename: 'OpenSource_AI_Systems_Ollama_Whisper_2026.pdf',
    type: 'curriculum_guide',
    uploadDate: '2026-10-01',
    versionYear: 2026,
    trustScore: 99,
    fileSize: '3.8 MB',
    status: 'active',
    relevantPages: 'Pages 1–18 (Local Ollama GGUF Quantization & Faster-Whisper ASR)',
    summary: 'Authoritative specification for 100% offline edge AI deployment. Details INT4/INT8 GGUF model quantization, CTranslate2 acoustic transformer pipelines, sub-300ms speech inference, and zero cloud data egress.',
    extractedSnippet: 'Open-source AI execution models enforce absolute data sovereignty: all audio streams and prompt tokens are computed on localhost without external API dependencies or recurring cloud billing.',
    citationKey: 'IEEE Open-Source AI Spec 2026, pp. 1-18',
    pdfPages: [
      {
        pageNumber: 1,
        title: 'Section 1: Open-Source AI vs Cloud Black-Box Systems',
        content: 'Open-Source AI decouples state-of-the-art reasoning from proprietary commercial APIs. By executing quantized open weights (Llama 3.2, Mistral, Qwen) directly on consumer CPU and GPU hardware, organizations achieve zero-egress data privacy, guaranteed uptime, and zero per-token cost.',
        keyPoints: [
          'Data Sovereignty: Voice and text data remain 100% offline within the local firewall.',
          'Cost Predictability: Infinite token generation without per-token API charges.',
          'Explainability: Full transparency into model weights, attention maps, and activations.'
        ]
      },
      {
        pageNumber: 2,
        title: 'Section 2: Faster-Whisper CTranslate2 & Ollama Architecture',
        content: 'Faster-Whisper leverages CTranslate2 to execute 8-bit quantized matrix multiplication and fused attention kernels, reducing memory by 70% and accelerating inference by 4x over vanilla Whisper. Ollama streams tokens via local HTTP sockets with GGUF quantization.',
        keyPoints: [
          'CTranslate2 INT8 Quantization: Sub-300ms acoustic decoding on standard laptop CPUs.',
          'GGUF Format: Single-file quantized model weights optimized for fast memory mapping.',
          'Edge Orchestration: Autonomous multi-agent verification with human-in-the-loop oversight.'
        ]
      }
    ]
  },
  {
    id: 'doc-ncert-2026',
    title: 'NCERT Grade 7 Science - Chapter 1: Nutrition in Plants (2026 Revised)',
    filename: 'NCERT_Grade7_Science_Ch1_2026.pdf',
    type: 'textbook',
    uploadDate: '2026-09-15',
    versionYear: 2026,
    trustScore: 98,
    fileSize: '4.2 MB',
    status: 'active',
    relevantPages: 'Pages 12–16 (Section 1.2: Photosynthesis — Food Making Process in Plants)',
    summary: 'Official 2026 curriculum textbook. Outlines the balanced equation 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂, stomatal guard cells mechanism, chlorophyll light absorption, and iodine starch test.',
    extractedSnippet: 'Section 1.2: Leaves are the food factories of plants. Water and minerals are transported to leaves by vessels which run like pipes through roots, stem, branches and leaves (Xylem). Carbon dioxide from air is taken in through tiny pores on leaf surface called Stomata.',
    citationKey: 'NCERT 2026, Ch. 1, pp. 12-16',
    pdfPages: [
      {
        pageNumber: 1,
        title: 'Chapter 1: Nutrition in Plants - Introduction & Autotrophs',
        content: 'In Class 6 you learned that food is essential for all living organisms. Carbohydrates, proteins, fats, vitamins and minerals are components of food called nutrients. Plants are the only organisms that can prepare food for themselves by using water, carbon dioxide and minerals. The mode of nutrition in which organisms make food themselves from simple substances is called autotrophic (auto = self, trophos = nourishment) nutrition.',
        keyPoints: [
          'Autotrophs: Organisms that synthesize organic nutrients from inorganic raw materials.',
          'Nutrients required: Water (H2O), Carbon Dioxide (CO2), Sunlight, Minerals.',
          'Chlorophyll: Green pigment in leaves that traps radiant photon energy from sunlight.'
        ],
        diagramDescription: 'Figure 1.1: General classification of autotrophic vs heterotrophic nutritional pathways in flora.'
      },
      {
        pageNumber: 2,
        title: 'Section 1.2: Photosynthesis — Food Making Process in Plants',
        content: 'Leaves are the food factories of plants. Therefore, all the raw materials must reach the leaf. Water and minerals present in the soil are absorbed by the roots and transported to the leaves by xylem vessels. Carbon dioxide from air is taken in through tiny pores present on the surface of leaves. These pores are surrounded by ‘guard cells’. Such pores are called stomata. During photosynthesis, chlorophyll-containing cells of leaves synthesize carbohydrates using CO2 and water in presence of sunlight.',
        keyPoints: [
          'Balanced Equation: 6CO₂ + 6H₂O + Sunlight + Chlorophyll → C₆H₁₂O₆ (Glucose) + 6O₂ (Oxygen)',
          'Stomata: Microscopic pores bounded by two kidney-shaped guard cells regulating gas exchange and transpiration.',
          'Carbohydrates produced are ultimately stored in leaves and stems as Starch.'
        ],
        diagramDescription: 'Figure 1.2: Cross-section of a green leaf showing epidermis, stomatal pore, guard cells, and chloroplasts in mesophyll cells.'
      },
      {
        pageNumber: 3,
        title: 'Section 1.3: Activity 1.1 — The Starch Iodine Laboratory Test',
        content: 'Take two potted plants of the same kind. Keep one in the dark room for 72 hours and the other in continuous sunlight. Perform an iodine test with the leaves of both plants as you did in Class 6. Record your results. Now leave the pot which was earlier kept in the dark, in the sunlight for 3–4 days and perform the iodine test again on its leaves.',
        keyPoints: [
          'Observation: Leaf exposed to sunlight turns deep blue-black upon application of dilute Iodine solution.',
          'Control Leaf: Leaf kept in darkness does not turn blue-black (no starch synthesis without photon excitation).',
          'Scientific Conclusion: Sunlight and chlorophyll are non-negotiable prerequisites for photosynthesis.'
        ],
        diagramDescription: 'Figure 1.3: Iodine test on green leaf (Boiling in alcohol bath, washing in warm water, and iodine drop test).'
      },
      {
        pageNumber: 4,
        title: 'Section 1.4: Synthesis of Plant Food other than Carbohydrates',
        content: 'You have just learned that plants synthesize carbohydrates through photosynthesis. The carbohydrates are made of carbon, hydrogen and oxygen. These are used to synthesize other components of food such as proteins and fats. But proteins are nitrogenous substances which contain nitrogen. Nitrogen is present in abundance in gaseous form (78%) in the air, but plants cannot absorb it in this form. Soil has certain bacteria (e.g. Rhizobium) that convert gaseous nitrogen into a usable form and release it into the soil.',
        keyPoints: [
          'Carbohydrates provide the C-H-O skeleton for organic synthesis.',
          'Nitrogen fixation: Symbiotic Rhizobium bacteria in leguminous root nodules fix atmospheric N2 into soluble nitrates.',
          'Fertilizers: Farmers replenish soil nitrogen via NPK supplements.'
        ]
      }
    ]
  },
  {
    id: 'doc-notes-2021',
    title: 'Teacher Archive Notes - Photosynthesis 2021 (Old Syllabus)',
    filename: 'Class7_Science_Photosynthesis_Notes_2021.pdf',
    type: 'notes',
    uploadDate: '2026-08-10',
    versionYear: 2021,
    trustScore: 42,
    fileSize: '1.1 MB',
    status: 'outdated_ignored',
    relevantPages: 'Page 3-4',
    summary: 'Outdated handwritten classroom summary from 2021 containing superseded terminology and an unbalanced word formula without oxygen molecule stoichiometry.',
    extractedSnippet: 'Old Note excerpt: "Plants make food using sunlight + water + carbon dioxide to make sugar. No need to teach 6CO2 balanced stoichiometry in Class 7."',
    conflictReason: 'Direct curriculum conflict: 2026 NCERT specifically mandates introducing the balanced 6-carbon molecular formula and modern terminology for stomata guard cell turgidity.',
    citationKey: 'Old Notes 2021 (Ignored)',
    pdfPages: [
      {
        pageNumber: 1,
        title: 'Teacher Notes (2021 Archive) - Photosynthesis Quick Review',
        content: 'Plants prepare their food in leaves. Raw materials: Water from soil, carbon dioxide from atmosphere, sunlight from sun. The food produced is glucose/sugar. Note for teachers: Keep equations simple, do not introduce chemical formulas or molecular balancing in Grade 7.',
        keyPoints: [
          'Simple word equation: Water + Carbon Dioxide -> Sugar + Oxygen (No balancing)',
          'No mention of chloroplast thylakoids or guard cell osmotic turgidity.',
          'Status: Flagged as Outdated by Epistemic Trust Engine.'
        ]
      }
    ]
  },
  {
    id: 'doc-curriculum-guideline',
    title: 'CBSE / State Educational Board Pedagogical Guideline 2026-27',
    filename: 'Pedagogical_Framework_MiddleSchool_Science_2026.pdf',
    type: 'curriculum_guide',
    uploadDate: '2026-09-01',
    versionYear: 2026,
    trustScore: 95,
    fileSize: '3.8 MB',
    status: 'active',
    relevantPages: 'Pages 45–48',
    summary: 'Prescribes experiential learning, bilingual scaffolded glossary in Hindi/vernacular, and formative risk checks before the mid-term examinations.',
    extractedSnippet: 'Recommend active visual analogies for biological processes. Teachers must provide tiered explanations for first-generation multilingual learners.',
    citationKey: 'Board Guideline 2026, p. 46',
    pdfPages: [
      {
        pageNumber: 1,
        title: 'Pedagogical Framework 2026 - Multilingual Scaffolding Directives',
        content: 'For foundational science concepts in middle school (Grades 6-8), teachers are strongly advised to incorporate dual-language terminology. In multilingual classrooms with Hindi and Kannada speakers, conceptual anchor words (such as Photosynthesis / प्रकाश संश्लेषण / ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ) should be reinforced with everyday analogies (e.g., "The Plant Kitchen").',
        keyPoints: [
          'Mandate: Multimodal instruction with visual, auditory, and experiential components.',
          'Target: At-risk learners requiring Tier-2 and Tier-3 scaffolding.',
          'Bilingual vocabulary sheets required before formative quizzes.'
        ]
      }
    ]
  },
  {
    id: 'doc-fractions-math',
    title: 'NCERT Grade 6 Mathematics - Chapter 7: Fractions',
    filename: 'NCERT_Grade6_Math_Fractions_2026.pdf',
    type: 'textbook',
    uploadDate: '2026-09-10',
    versionYear: 2026,
    trustScore: 99,
    fileSize: '5.4 MB',
    status: 'active',
    relevantPages: 'Pages 134–142',
    summary: 'Covers Equivalent fractions using visual strip models, pizza slices, and cross-multiplication verification.',
    extractedSnippet: 'Two or more fractions are equivalent if they represent the same portion of a whole. Multiplying or dividing both numerator and denominator by same non-zero number yields an equivalent fraction.',
    citationKey: 'NCERT Math 2026, Ch. 7, pp. 134-142',
    pdfPages: [
      {
        pageNumber: 1,
        title: 'Chapter 7: Fractions - Equivalent Fractions & Visual Strips',
        content: 'A fraction is a number representing part of a whole. The whole may be a single object or a group of objects. When looking at equivalent fractions like 1/2, 2/4, 3/6, and 4/8, each fraction represents the exact same shaded fraction of the strip model.',
        keyPoints: [
          'To find equivalent fractions, multiply or divide numerator and denominator by the same number.',
          'Visual strip modeling reinforces concrete understanding before abstract arithmetic.',
          'Simplest form: When numerator and denominator have no common factor except 1.'
        ],
        diagramDescription: 'Figure 7.4: Fraction strip breakdown comparing 1/2, 2/4, 4/8, and 8/16.'
      }
    ]
  }
];

export const DEFAULT_OPEN_SOURCE_AI_LESSON_40MIN: LessonPlan = {
  id: 'lesson-os-ai-40',
  topic: 'Open-Source AI Systems: Local Ollama LLM, Faster-Whisper ASR & Edge Orchestration',
  topicHindi: 'ओपन-सोर्स एआई प्रणाली: स्थानीय ओलामा एलएलएम और फास्टर-व्हिस्पर एएसआर',
  topicKannada: 'ಓಪನ್ ಸೋರ್ಸ್ ಎಐ ಸಿಸ್ಟಮ್ಸ್: ಲೋಕಲ್ ಒಲಾಮಾ ಎಲ್‌ಎಲ್‌ಎಂ ಮತ್ತು ಫಾಸ್ಟರ್-ವಿಸ್ಪರ್ ಎಎಸ್‌ಆರ್',
  grade: 12,
  subject: 'Computer Science & Artificial Intelligence (Open-Source AI)',
  totalDurationMinutes: 40,
  targetExamDate: 'Next Friday (Oct 17, 2026)',
  languages: ['English', 'Hindi', 'Kannada'],
  predictedGapsCount: 2,
  highRiskStudents: ['Rahul Sharma', 'Aarav Sharma'],
  approvalState: 'draft',
  lastUpdated: 'Just now',
  
  sourcesUsed: [
    {
      sourceId: 'doc-open-source-ai-spec',
      citation: 'Open-Source AI Systems Specification 2026 (IEEE & Apache 2.0)',
      reason: 'Authoritative ground truth for local quantized inference (GGUF), Faster-Whisper CTranslate2, and edge data sovereignty.'
    },
    {
      sourceId: 'doc-ctranslate2-whisper',
      citation: 'Faster-Whisper CTranslate2 Engine Architecture (Harvard NLP)',
      reason: 'Acoustic transformer pipeline with INT8 quantization yielding sub-300ms speech-to-text without cloud dependencies.'
    }
  ],

  ignoredSources: [
    {
      sourceId: 'doc-proprietary-cloud-api',
      reason: 'Excluded closed-source proprietary cloud API notes due to telemetry tracking, privacy egress violations, and recurring token subscription fees.'
    }
  ],

  beginnerExplanation: {
    summary: 'Cloud AI is like ordering food from a big commercial restaurant where strangers see your order and charge you every bite. Open-Source AI brings the entire kitchen (Ollama LLM + Faster-Whisper ASR) right into your home laptop—100% private, free, and works without internet!',
    summaryHindi: 'क्लाउड एआई एक रेस्तरां से खाना मंगाने जैसा है जहाँ आपका डेटा बाहरी सर्वर पर जाता है। ओपन-सोर्स एआई पूरी रसोई (ओलामा एलएलएम और फास्टर-व्हिस्पर) को आपके अपने लैपटॉप पर स्थापित करता है—पूरी तरह सुरक्षित, मुफ़्त और बिना इंटरनेट काम करने वाला!',
    summaryKannada: 'ಕ್ಲೌಡ್ ಎಐ ಎಂಬುದು ಹೊರಗಿನ ಹೋಟೆಲ್‌ನಿಂದ ಆಹಾರ ತರಿಸಿಕೊಂಡಂತೆ, ಅಲ್ಲಿ ನಿಮ್ಮ ಡೇಟಾ ಹೊರಗೆ ಹೋಗುತ್ತದೆ. ಓಪನ್ ಸೋರ್ಸ್ ಎಐ ಸಂಪೂರ್ಣ ಅಡುಗೆಮನೆಯನ್ನು (ಒಲಾಮಾ ಮತ್ತು ಫಾಸ್ಟರ್-ವಿಸ್ಪರ್) ನಿಮ್ಮದೇ ಲ್ಯಾಪ್‌ಟಾಪ್‌ನಲ್ಲಿ ಇರಿಸುತ್ತದೆ—ಸಂಪೂರ್ಣ ಖಾಸಗಿ, ಉಚಿತ ಮತ್ತು ಆಫ್‌ಲೈನ್!',
    keyAnalogy: 'The "Edge Kitchen vs Cloud Commissary": Local Ollama = Private Chef on your laptop, Quantized GGUF Weights = Concentrated recipe book fitting inside your RAM, Faster-Whisper = High-speed ear transcribing your speech in 0.3s without sending sound waves outside your room.',
    keyAnalogyHindi: 'निजी रसोई सादृश्य: स्थानीय ओलामा = आपका अपना शेफ, क्वांटाइज़्ड जीजीयूएफ = संपीड़ित रेसिपी बुक, फास्टर-व्हिस्पर = तेज़ कान जो आपकी आवाज़ को तुरंत टेक्स्ट में बदलता है।',
    keyAnalogyKannada: 'ಖಾಸಗಿ ಅಡುಗೆಮನೆ ರೂಪಕ: ಲೋಕಲ್ ಒಲಾಮಾ = ನಿಮ್ಮದೇ ಖಾಸಗಿ ಮಾಸ್ಟರ್ ಚೆಫ್, ಜಿಜಿಯುಎಫ್ ತೂಕಗಳು = ನಿಮ್ಮ ಮೆಮೊರಿಯಲ್ಲಿ ಸುಲಭವಾಗಿ ಹೊಂದಿಕೊಳ್ಳುವ ಸೂತ್ರಗಳು, ಫಾಸ್ಟರ್-ವಿಸ್ಪರ್ = 0.3 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಧ್ವನಿಯನ್ನು ಗ್ರಹಿಸುವ ಸ್ಥಳೀಯ ಕಿವಿ.',
    visualCues: [
      'Microphone input routed directly to local 127.0.0.1 Faster-Whisper daemon (0ms cloud egress)',
      'Ollama runtime streaming quantized Llama 3.2 tokens into the React UI',
      'Living Learning Twin GNN visualizing student concept mastery gaps in real time'
    ],
    vocabularyGlossary: [
      { term: 'Open-Source AI', hindiTerm: 'ओपन-सोर्स एआई', kannadaTerm: 'ಓಪನ್ ಸೋರ್ಸ್ ಎಐ', definition: 'Artificial Intelligence systems with publicly accessible weights, architecture, and code running locally without vendor lock-in' },
      { term: 'Ollama & GGUF', hindiTerm: 'ओलामा और जीजीयूएफ', kannadaTerm: 'ಒಲಾಮಾ ಮತ್ತು ಜಿಜಿಯುಎಫ್', definition: 'Local runtime and quantized file format compressing large models to run smoothly on consumer CPU/RAM' },
      { term: 'Faster-Whisper', hindiTerm: 'फास्टर-व्हिस्पर', kannadaTerm: 'ಫಾಸ್ಟರ್-ವಿಸ್ಪರ್', definition: 'CTranslate2-powered speech recognition running locally with sub-300ms latency' },
      { term: 'Data Sovereignty', hindiTerm: 'डेटा संप्रभुता (Data Sovereignty)', kannadaTerm: 'ಡೇಟಾ ಸಾರ್ವಭೌಮತ್ವ', definition: 'Full ownership and control of prompts and voice recordings without cloud transmission' }
    ],
    targetStudents: ['Rahul Sharma', 'Aarav Sharma']
  },

  standardLesson: {
    objectives: [
      'Explain the architectural difference between closed-source cloud APIs and open-source local inference (Ollama + Faster-Whisper).',
      'Demonstrate how INT8/INT4 quantization reduces VRAM requirements by 4x without substantial loss in model perplexity.',
      'Deploy an end-to-end local speech pipeline: Microphone -> Faster-Whisper CTranslate2 -> Ollama Llama 3.2 -> Local Audio TTS.'
    ],
    objectivesHindi: [
      'क्लोज्ड-सोर्स क्लाउड एपीआई और ओपन-सोर्स लोकल इन्फरेंस (ओलामा + फास्टर-व्हिस्पर) के बीच अंतर स्पष्ट करें।',
      'INT8/INT4 क्वांटाइज़ेशन के माध्यम से VRAM खपत को 70% कम करने की विधि प्रदर्शित करें।',
      'एंड-टू-एंड स्थानीय स्पीच पाइपलाइन लागू करें: माइक्रोफ़ोन -> फास्टर-व्हिस्पर -> ओलामा लामा 3.2 -> स्थानीय ऑडियो।'
    ],
    sections: [
      {
        id: 'sec-os-1',
        timeAllocationMinutes: 8,
        title: 'Hook & Foundation: The Rise of Open-Source AI & Data Sovereignty',
        titleHindi: 'प्रारंभिक परिचय: ओपन-सोर्स एआई और डेटा संप्रभुता',
        titleKannada: 'ಪೀಠಿಕೆ: ಓಪನ್ ಸೋರ್ಸ್ ಎಐ ಮತ್ತು ಡೇಟಾ ಸಾರ್ವಭೌಮತ್ವದ ಮಹತ್ವ',
        icon: 'Sparkles',
        teacherTalkingPoints: [
          'Show how closed-source cloud APIs introduce latency, API costs, downtime risk, and data privacy leaks.',
          'Introduce the open-source alternative: Local open weights (Llama 3.2, Mistral, Qwen) executed via Ollama.',
          'Demonstrate the local port 8000 Faster-Whisper endpoint responding in 280ms on local CPU.'
        ],
        teacherTalkingPointsHindi: [
          'क्लाउड एपीआई की कमियों (डेटा प्राइवेसी, लागत, विलंबता) को समझाएं।',
          'लोकल ओलामा और फास्टर-व्हिस्पर का लाइव प्रदर्शन करें।'
        ],
        teacherTalkingPointsKannada: [
          'ಕ್ಲೌಡ್ ಎಐನ ಮಿತಿಗಳು (ವೆಚ್ಚ, ಗೌಪ್ಯತೆ ಉಲ್ಲಂಘನೆ) ಮತ್ತು ಓಪನ್ ಸೋರ್ಸ್ ಎಐನ ಪ್ರಯೋಜನಗಳನ್ನು ವಿವರಿಸಿ.',
          'ಸ್ಥಳೀಯ ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ ನೇರವಾಗಿ ಚಲಿಸುವ ಒಲಾಮಾ ಮತ್ತು ಫಾಸ್ಟರ್-ವಿಸ್ಪರ್ ಡೆಮೊ ತೋರಿಸಿ.'
        ],
        studentActivities: [
          'Inspect network tab to verify zero packets leaving localhost during speech transcription.',
          'Identify 3 real-world scenarios requiring 100% offline AI (hospitals, schools, defense).'
        ],
        scaffoldingTips: 'Highlight the Private Kitchen analogy for Rahul and Aarav.',
        groundedInCitation: 'IEEE Open-Source AI Spec 2026, Section 2.1'
      },
      {
        id: 'sec-os-2',
        timeAllocationMinutes: 12,
        title: 'Direct Instruction: Model Quantization & llama.cpp / Ollama Engine',
        titleHindi: 'प्रत्यक्ष शिक्षण: मॉडल क्वांटाइज़ेशन और ओलामा आर्किटेक्चर',
        titleKannada: 'ಮುಖ್ಯ ಬೋಧನೆ: ಮಾಡೆಲ್ ಕ್ವಾಂಟೈಸೇಶನ್ ಮತ್ತು ಒಲಾಮಾ ಎಂಜಿನ್',
        icon: 'Cpu',
        teacherTalkingPoints: [
          'Explain weight quantization: Converting 16-bit floating point (FP16) weights to 4-bit/8-bit integers (INT4/INT8 GGUF).',
          'Show the memory math: An 8B parameter model at FP16 requires 16 GB VRAM; quantized to Q4_K_M it fits comfortably in under 5.5 GB RAM!',
          'Illustrate the Ollama HTTP streaming protocol: client sends JSON prompt, receives token-by-token NDJSON response stream.'
        ],
        teacherTalkingPointsHindi: [
          'एफपी16 से आईएनटी4 में क्वांटाइज़ेशन का गणित समझाएं: 16 जीबी का मॉडल 5.5 जीबी रैम में समा जाता है।',
          'ओलामा के टोकन स्ट्रीमिंग प्रोटोकॉल का अध्ययन करें।'
        ],
        teacherTalkingPointsKannada: [
          'ತೂಕ ಕ್ವಾಂಟೈಸೇಶನ್ ತಂತ್ರಜ್ಞಾನ: 16 ಜಿಬಿ ಮೆಮೊರಿ ಬದಲಿಗೆ ಕೇವಲ 5.5 ಜಿಬಿಯಲ್ಲಿ 8 ಬಿಲಿಯನ್ ಪ್ಯಾರಾಮೀಟರ್ ಮಾಡೆಲ್ ಚಾಲನೆ.',
          'ಒಲಾಮಾ ಲೈವ್ ಸ್ಟ್ರೀಮಿಂಗ್ ಮೂಲಕ ಒಂದೊಂದೇ ಪದಗಳನ್ನು ಉತ್ಪಾದಿಸುವ ವಿಧಾನ.'
        ],
        studentActivities: [
          'Calculate RAM requirement for a 7B model at FP16 vs INT4 quantization.',
          'Execute a test curl request to Ollama endpoint: http://localhost:11434/api/generate.'
        ],
        scaffoldingTips: 'Provide pre-calculated memory comparison matrix on the student portal.',
        groundedInCitation: 'Ollama Technical Whitepaper (GGUF Format Spec)'
      },
      {
        id: 'sec-os-3',
        timeAllocationMinutes: 10,
        title: 'Acoustic Processing: Faster-Whisper CTranslate2 Speech Pipeline',
        titleHindi: 'ध्वनिक प्रसंस्करण: फास्टर-व्हिस्पर CTranslate2 पाइपलाइन',
        titleKannada: 'ಧ್ವನಿ ಸಂಸ್ಕರಣೆ: ಫಾಸ್ಟರ್-ವಿಸ್ಪರ್ ಮತ್ತು ಸಿಟ್ರಾನ್ಸ್‌ಲೇಟ್2 ಆರ್ಕಿಟೆಕ್ಚರ್',
        icon: 'Mic',
        teacherTalkingPoints: [
          'Explain how raw audio is converted into 80-channel log Mel-Spectrograms at 16kHz sampling rate.',
          'Introduce CTranslate2: A custom C++ inference engine that implements kernel fusion and 8-bit matrix multiplication.',
          'Contrast with vanilla Whisper: Faster-Whisper is 4x faster with 70% less memory usage, achieving sub-second voice turnaround.'
        ],
        teacherTalkingPointsHindi: [
          'ऑडियो को 80-चैनल मेल-स्पेक्ट्रोग्राम में बदलना और CTranslate2 के तीव्र C++ कर्नेल से प्रोसेस करना।'
        ],
        teacherTalkingPointsKannada: [
          'ಧ್ವನಿ ತರಂಗಗಳನ್ನು ಸ್ಪೆಕ್ಟ್ರೋಗ್ರಾಮ್ ಆಗಿ ಪರಿವರ್ತಿಸಿ ಸಿಟ್ರಾನ್ಸ್‌ಲೇಟ್2 ಮೂಲಕ ಅತ್ಯಂತ ವೇಗವಾಗಿ ಡಿಕೋಡ್ ಮಾಡುವ ತಂತ್ರಜ್ಞಾನ.'
        ],
        studentActivities: [
          'Speak a test voice command into the microphone and inspect the instantaneous transcript in the debug log.',
          'Measure end-to-end latency from speech stop to token generation.'
        ],
        scaffoldingTips: 'Explain the difference between WebSpeech browser fallback and local Faster-Whisper.',
        groundedInCitation: 'CTranslate2 Research Documentation (Harvard NLP)'
      },
      {
        id: 'sec-os-4',
        timeAllocationMinutes: 6,
        title: 'Formative AI Checkpoint: Open-Source Architecture Quiz',
        titleHindi: 'रचनात्मक मूल्यांकन: ओपन-सोर्स एआई क्विज़',
        titleKannada: 'ರಚನಾತ್ಮಕ ಮೌಲ್ಯಮಾಪನ: ಓಪನ್ ಸೋರ್ಸ್ ಎಐ ರಸಪ್ರಶ್ನೆ',
        icon: 'HelpCircle',
        teacherTalkingPoints: [
          'Administer 3 formative questions to evaluate student grasp of local inference, quantization, and offline ASR.',
          'Review Living Learning Twin telemetry to ensure prerequisite gaps are closed.'
        ],
        teacherTalkingPointsHindi: [
          'क्वांटाइज़ेशन और डेटा प्राइवेसी पर 3-प्रश्न क्विज़ हल कराएं।'
        ],
        teacherTalkingPointsKannada: [
          'ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ 3 ಪ್ರಶ್ನೆಗಳ ರಸಪ್ರಶ್ನೆ ನೀಡಿ ಅವರ ಕಲಿಕಾ ಮಟ್ಟವನ್ನು ಪರಿಶೀಲಿಸಿ.'
        ],
        studentActivities: [
          'Complete the 3 interactive diagnostic questions on student tablet.'
        ],
        scaffoldingTips: 'Review Rahul’s score in GGUF Quantization.',
        groundedInCitation: 'Formative Evaluation Framework 2026'
      },
      {
        id: 'sec-os-5',
        timeAllocationMinutes: 4,
        title: 'Wrap-Up & Human-in-the-Loop XAI Audit',
        titleHindi: 'समीक्षा एवं मानव-नियंत्रित एक्सएआई ऑडिट',
        titleKannada: 'ಮುಕ್ತಾಯ ಮತ್ತು ಎಕ್ಸ್‌ಪ್ಲೇನಬಲ್ ಎಐ ಲೆಡ್ಜರ್ ಪರಿಶೀಲನೆ',
        icon: 'CheckCircle2',
        teacherTalkingPoints: [
          'Summarize the primary takeaways: Data Privacy, Zero Recurring Cloud Invoices, Offline Availability.',
          'Reinforce Human-in-the-Loop oversight: AI proposes drafts; the human teacher makes the authoritative approval decision.'
        ],
        teacherTalkingPointsHindi: [
          'मुख्य निष्कर्ष: डेटा सुरक्षा, शून्य एपीआई बिल, ऑफ़लाइन उपलब्धता और शिक्षक का अंतिम अनुमोदन।'
        ],
        teacherTalkingPointsKannada: [
          'ಪ್ರಮುಖ ಅಂಶಗಳು: ಸಂಪೂರ್ಣ ಡೇಟಾ ಸುರಕ್ಷತೆ, ಉಚಿತ ಕಾರ್ಯಾಚರಣೆ, ಶಿಕ್ಷಕರ ಅಧಿಕೃತ ಅನುಮೋದನೆ.'
        ],
        studentActivities: [
          'Draft an architecture diagram comparing Cloud vs Open-Source AI pipelines.'
        ],
        scaffoldingTips: 'Confirm all student risk status badges are green.',
        groundedInCitation: 'NIST AI Risk Management Framework 2026'
      }
    ]
  },

  advancedActivity: {
    title: 'Advanced Edge Inference & Quantization Benchmarking Challenge',
    titleHindi: 'उच्च स्तरीय एज इन्फेरेंस और क्वांटाइज़ेशन बेंचमार्किंग चुनौती',
    inquiryChallenge: 'Benchmark latency, perplexity, and VRAM utilization between Llama 3.2 8B Q4_K_M vs Q8_0 running on Local Ollama, and test Faster-Whisper ASR word-error-rate under 20dB ambient school classroom noise.',
    inquiryChallengeHindi: 'लोकल ओलामा पर Llama 3.2 8B Q4_K_M और Q8_0 के बीच लेटेंसी और VRAM उपयोग की तुलना करें, और 20dB क्लासरूम शोर में फास्टर-व्हिस्पर की सटीकता मापें।',
    deepQuestions: [
      'How does FlashAttention-2 enable long-context transformer decoding on consumer GPUs without memory explosion?',
      'Why does INT8 matrix multiplication preserve 99%+ of full-precision LLM reasoning accuracy?',
      'What are the privacy and data sovereignty trade-offs between local on-device ASR and proprietary cloud speech APIs in educational environments?'
    ],
    extensionMaterials: [
      'Ollama CLI Modelfile custom parameter tuning reference',
      'Faster-Whisper CTranslate2 INT8 quantization benchmark suite',
      'Web Audio API high-pass noise cancellation preprocessor demo'
    ],
    targetStudents: ['Vihaan Reddy', 'Ananya Iyer']
  },

  formativeQuiz: [
    {
      id: 'q-os-1',
      question: 'What is the primary benefit of INT4/INT8 model quantization in local LLM deployments (such as Ollama)?',
      questionHindi: 'लोकल एलएलएम डिप्लॉयमेंट में INT4/INT8 मॉडल क्वांटाइज़ेशन का मुख्य लाभ क्या है?',
      questionKannada: 'ಲೋಕಲ್ ಎಲ್‌ಎಲ್‌ಎಂಗಳಲ್ಲಿ INT4/INT8 ಮಾಡೆಲ್ ಕ್ವಾಂಟೈಸೇಶನ್‌ನ ಮುಖ್ಯ ಪ್ರಯೋಜನವೇನು?',
      options: [
        'Increases parameter count by 4x to improve reasoning accuracy.',
        'Reduces RAM/VRAM footprint by up to 70%, allowing 8B models to run smoothly on standard hardware.',
        'Requires continuous cloud connectivity to download weights dynamically.',
        'Converts LLMs into non-autoregressive decision trees.'
      ],
      optionsHindi: [
        'पैरामीटर संख्या को 4 गुना बढ़ाता है।',
        'रैम/वीआरैम की आवश्यकता को 70% तक घटाता है, जिससे 8B मॉडल सामान्य हार्डवेयर पर चलते हैं।',
        'निरंतर क्लाउड कनेक्टिविटी की आवश्यकता होती है।',
        'मॉडल को डिसीजन ट्री में बदल देता है।'
      ],
      correctAnswerIndex: 1,
      explanation: 'Quantization maps FP16 weights to INT8 or INT4 integers, drastically shrinking model size and memory bandwidth demands with minimal degradation.',
      explanationHindi: 'क्वांटाइज़ेशन FP16 भार को INT8 या INT4 पूर्णांकों में मैप करता है, जिससे सटीकता खोए बिना मॉडल का आकार और मेमोरी लोड भारी मात्रा में घट जाता है।',
      targetedConcept: 'Model Weight Quantization (GGUF)',
      difficulty: 'Medium'
    },
    {
      id: 'q-os-2',
      question: 'How does Faster-Whisper achieve sub-300ms speech-to-text inference compared to standard OpenAI Whisper?',
      questionHindi: 'फास्टर-व्हिस्पर सामान्य व्हिस्पर की तुलना में 300ms से कम समय में ट्रांसक्रिप्शन कैसे करता है?',
      questionKannada: 'ಫಾಸ್ಟರ್-ವಿಸ್ಪರ್ ಸಾಮಾನ್ಯ ವಿಸ್ಪರ್‌ಗಿಂತ 300ms ಗಿಂತ ಕಡಿಮೆ ಸಮಯದಲ್ಲಿ ಭಾಷಣವನ್ನು ಹೇಗೆ ಗ್ರಹಿಸುತ್ತದೆ?',
      options: [
        'By streaming audio chunks to proprietary Google cloud servers.',
        'By skipping the acoustic transformer encoder stage entirely.',
        'By utilizing CTranslate2 custom C++ compute kernels with 8-bit matrix multiplication and layer fusion.',
        'By transcribing only every third word spoken.'
      ],
      optionsHindi: [
        'ऑडियो को गूगल क्लाउड सर्वर पर भेजकर।',
        'एन्कोडर स्टेज को पूरी तरह छोड़ कर।',
        'CTranslate2 के 8-बिट मैट्रिक्स गुणन और फ्यूज्ड कर्नल इंजन का उपयोग करके।',
        'केवल हर तीसरे शब्द को ट्रांसक्राइब करके।'
      ],
      correctAnswerIndex: 2,
      explanation: 'Faster-Whisper leverages CTranslate2, a custom inference engine designed for high throughput on CPU and GPU with optimized INT8 quantized kernels.',
      explanationHindi: 'फास्टर-व्हिस्पर CTranslate2 का उपयोग करता है, जो INT8 क्वांटाइज्ड कर्नल के साथ सीपीयू और जीपीयू पर तेज़ थ्रूपुट प्रदान करता है।',
      targetedConcept: 'Faster-Whisper CTranslate2 Engine',
      difficulty: 'Medium'
    },
    {
      id: 'q-os-3',
      question: 'Why does MINDMESH-NEXUS utilize Open-Source AI and Graph Neural Networks (GNNs) instead of black-box commercial APIs for educational diagnostics?',
      questionHindi: 'माइंडमेश-नेक्सस डायग्नोस्टिक्स के लिए क्लोज्ड क्लाउड एपीआई के बजाय ओपन-सोर्स एआई और जीएनएन का उपयोग क्यों करता है?',
      questionKannada: 'ಶೈಕ್ಷಣಿಕ ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಮೈಂಡ್‌ಮೆಶ್-ನೆಕ್ಸಸ್ ಬ್ಲಾಕ್-ಬಾಕ್ಸ್ ಕ್ಲೌಡ್ ಬದಲಿಗೆ ಓಪನ್ ಸೋರ್ಸ್ ಎಐ ಮತ್ತು ಜಿಎನ್‌ಎನ್ ಅನ್ನು ಏಕೆ ಬಳಸುತ್ತದೆ?',
      options: [
        'Open-Source AI ensures 100% data sovereignty and student privacy, while GNNs explicitly model prerequisite concept graphs with transparent XAI attribution.',
        'Commercial cloud APIs are strictly illegal in all schools.',
        'Graph Neural Networks can only run on quantum supercomputers.',
        'Open-source models cannot generate text or solve code.'
      ],
      optionsHindi: [
        'ओपन-सोर्स एआई 100% डेटा संप्रभुता सुनिश्चित करता है, और जीएनएन पारदर्शी एक्सएआई के साथ आवश्यक अवधारणाओं का मॉडल बनाता है।',
        'क्लाउड एपीआई स्कूलों में अवैध हैं।',
        'जीएनएन केवल क्वांटम कंप्यूटर पर चल सकते हैं।',
        'ओपन-सोर्स मॉडल टेक्स्ट नहीं बना सकते।'
      ],
      correctAnswerIndex: 0,
      explanation: 'Open-Source AI guarantees data sovereignty (no student voice or records leave the school), while GNNs capture prerequisite DAG dependencies with auditable epistemic trust scores.',
      explanationHindi: 'ओपन-सोर्स एआई डेटा संप्रभुता की गारंटी देता है (कोई छात्र डेटा स्कूल से बाहर नहीं जाता), और जीएनएन पारदर्शी एक्सएआई और ऑडिबल स्कोर प्रदान करते हैं।',
      targetedConcept: 'Data Sovereignty & Pedagogical XAI',
      difficulty: 'Hard'
    }
  ],

  visualDiagram: {
    title: 'Open-Source AI Architecture: Local Ollama LLM & Faster-Whisper Pipeline',
    imageUrl: '/assets/opensource_ai_architecture.jpg',
    caption: '100% Offline Edge Pipeline: Direct Microphone Audio -> Faster-Whisper CTranslate2 (INT8) -> Local Ollama Llama 3.2 (GGUF) -> Web Audio Studio Output with Zero Cloud Egress.',
    captionHindi: '100% ऑफ़लाइन एज पाइपलाइन: माइक्रोफ़ोन -> फास्टर-व्हिस्पर CTranslate2 (INT8) -> स्थानीय ओलामा लामा 3.2 (GGUF) -> शून्य क्लाउड डेटा लीकेज।',
    hotspots: [
      {
        label: 'Faster-Whisper Daemon (Port 8000)',
        hindiLabel: 'फास्टर-व्हिस्पर डेमन (पोर्ट 8000)',
        x: 25,
        y: 40,
        description: 'Sub-300ms local ASR using CTranslate2 INT8 quantization on consumer CPU.'
      },
      {
        label: 'Ollama Llama 3.2 Runtime (Port 11434)',
        hindiLabel: 'ओलामा लामा 3.2 रनटाइम',
        x: 60,
        y: 45,
        description: 'Quantized GGUF open-weight foundation model running locally with zero cloud telemetry.'
      },
      {
        label: 'Explainable AI & GNN Living Learning Twin',
        hindiLabel: 'व्याख्यात्मक एआई और जीएनएन लर्निंग ट्विन',
        x: 85,
        y: 65,
        description: 'PyTorch Geometric DAG tracing student prerequisite mastery and transparent feature weights.'
      }
    ]
  }
};

export const DEFAULT_PHOTOSYNTHESIS_LESSON_40MIN: LessonPlan = {
  id: 'lesson-photo-40',
  topic: 'Photosynthesis: The Plant Food Factory',
  topicHindi: 'प्रकाश संश्लेषण: पौधों का भोजन निर्माण',
  topicKannada: 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ: ಸಸ್ಯಗಳಲ್ಲಿ ಆಹಾರ ಉತ್ಪಾದನೆ',
  grade: 7,
  subject: 'Science / Biology',
  totalDurationMinutes: 40,
  targetExamDate: 'Next Tuesday (Oct 14, 2026)',
  languages: ['English', 'Hindi', 'Kannada'],
  predictedGapsCount: 3,
  highRiskStudents: ['Aarav Sharma', 'Priya Patel', 'Rohan Verma', 'Prajwal Gowda'],
  approvalState: 'draft',
  lastUpdated: 'Just now',
  
  sourcesUsed: [
    {
      sourceId: 'doc-ncert-2026',
      citation: 'NCERT Grade 7 Science Ch 1 (Pages 12–16)',
      reason: 'Primary verified curriculum ground truth for balanced photosynthesis equation and stomata.'
    },
    {
      sourceId: 'doc-curriculum-guideline',
      citation: 'Pedagogical Framework 2026 (Page 46)',
      reason: 'Guided bilingual Hindi-English scaffolding and formative checkpoint frequency.'
    }
  ],

  ignoredSources: [
    {
      sourceId: 'doc-notes-2021',
      reason: 'Ignored older 2021 note due to conflicting simplified formula and missing 2026 CBSE stoichiometry standards.'
    }
  ],

  beginnerExplanation: {
    summary: 'Plants don’t eat food with a mouth like us—they cook their own food using sunlight, air, and water inside their leaves!',
    summaryHindi: 'पौधे हमारी तरह मुंह से खाना नहीं खाते—वे अपनी पत्तियों में धूप, हवा और पानी का उपयोग करके अपना खाना खुद बनाते हैं!',
    summaryKannada: 'ಸಸ್ಯಗಳು ನಮ್ಮಂತೆ ಬಾಯಿಯಿಂದ ಆಹಾರ ತಿನ್ನುವುದಿಲ್ಲ—ಅವು ತಮ್ಮ ಎಲೆಗಳಲ್ಲಿ ಸೂರ್ಯನ ಬೆಳಕು, ಗಾಳಿ ಮತ್ತು ನೀರನ್ನು ಬಳಸಿ ಸ್ವತಃ ಆಹಾರವನ್ನು ತಯಾರಿಸುತ್ತವೆ!',
    keyAnalogy: 'The "Kitchen of the Leaf": Leaf = Kitchen, Sunlight = Stove Flame, Water (from roots) + CO2 (from air) = Raw Ingredients, Glucose = Delicious Cooked Meal, Oxygen = Fresh Breeze released!',
    keyAnalogyHindi: 'पत्ती की रसोई: पत्ती = किचन, सूरज की धूप = गैस का चूल्हा, पानी (जड़ों से) + कार्बन डाइऑक्साइड (हवा से) = कच्ची सामग्री, ग्लूकोज = पका हुआ भोजन, ऑक्सीजन = बाहर छोड़ी गई ताज़ी हवा!',
    keyAnalogyKannada: 'ಎಲೆಯ ಅಡುಗೆಮನೆ ರೂಪಕ (Leaf Kitchen): ಎಲೆ = ಅಡುಗೆ ಮನೆ, ಸೂರ್ಯನ ಬೆಳಕು = ಗ್ಯಾಸ್ ಸ್ಟೌವ್ ಶಾಖ, ನೀರು (ಬೇರುಗಳಿಂದ) + CO2 (ಗಾಳಿಯಿಂದ) = ಕಚ್ಚಾ ಸಾಮಗ್ರಿಗಳು, ಗ್ಲೂಕೋಸ್ = ತಯಾರಾದ ರುಚಿಕರ ಆಹಾರ, ಆಮ್ಲಜನಕ = ಹೊರಸೂಸುವ ತಾಜಾ ಗಾಳಿ!',
    visualCues: [
      'Leaf surface with green chloroplast solar panels',
      'Stomata acting like tiny breathing windows that open and close',
      'Roots acting like drinking straws sucking water upward'
    ],
    vocabularyGlossary: [
      { term: 'Photosynthesis', hindiTerm: 'प्रकाश संश्लेषण (Prakash Sanshleshan)', kannadaTerm: 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ (Dyutisamsleshane)', definition: 'Process where plants use light to make food' },
      { term: 'Chlorophyll', hindiTerm: 'पर्णहरित / क्लोरोफिल', kannadaTerm: 'ಪತ್ರಹರಿತ್ತು / ಕ್ಲೋರೋಫಿಲ್', definition: 'Green pigment that traps sunlight energy' },
      { term: 'Stomata', hindiTerm: 'रंध्र (Stomata)', kannadaTerm: 'ಪತ್ರರಂಧ್ರ (Stomata)', definition: 'Tiny pores on underside of leaves for gas exchange' },
      { term: 'Glucose', hindiTerm: 'ग्लूकोज (शर्करा)', kannadaTerm: 'ಗ್ಲೂಕೋಸ್ (ಶರ್ಕರಪಿಷ್ಟ)', definition: 'Simple sugar stored as energy/food by the plant' }
    ],
    targetStudents: ['Aarav Sharma', 'Priya Patel', 'Rohan Verma', 'Prajwal Gowda']
  },

  standardLesson: {
    objectives: [
      'Define photosynthesis and write the balanced chemical equation (6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂).',
      'Explain the role of Chlorophyll in absorbing solar photons.',
      'Demonstrate how Stomata regulate carbon dioxide intake and oxygen release.',
      'Correlate water transport via Xylem with raw material availability in leaves.'
    ],
    objectivesHindi: [
      'प्रकाश संश्लेषण को परिभाषित करें और संतुलित रासायनिक समीकरण लिखें।',
      'सौर ऊर्जा को अवशोषित करने में क्लोरोफिल की भूमिका समझाएं।',
      'रंध्र (स्टोमेटा) गैसों के आदान-प्रदान को कैसे नियंत्रित करते हैं, इसका प्रदर्शन करें।',
      'जाइलम (Xylem) द्वारा जल परिवहन का भोजन निर्माण से संबंध समझाइए।'
    ],
    objectivesKannada: [
      'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯನ್ನು ವ್ಯಾಖ್ಯಾನಿಸಿ ಮತ್ತು ಸಮತೋಲಿತ ರಾಸಾಯನಿಕ ಸಮೀಕರಣವನ್ನು ಬರೆಯಿರಿ (6CO₂ + 6H₂O + ಬೆಳಕು → C₆H₁₂O₆ + 6O₂).',
      'ಸೌರ ಶಕ್ತಿಯನ್ನು ಹೀರಿಕೊಳ್ಳುವಲ್ಲಿ ಕ್ಲೋರೋಫಿಲ್ (ಪತ್ರಹರಿತ್ತು) ಪಾತ್ರವನ್ನು ವಿವರಿಸಿ.',
      'ಪತ್ರರಂಧ್ರಗಳು (Stomata) ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ ಮತ್ತು ಆಮ್ಲಜನಕದ ವಿನಿಮಯವನ್ನು ಹೇಗೆ ನಿಯಂತ್ರಿಸುತ್ತವೆ ಎಂಬುದನ್ನು ಪ್ರದರ್ಶಿಸಿ.',
      'ಕ್ಸೈಲಂ (Xylem) ಮೂಲಕ ನೀರಿನ ಸಾಗಾಣಿಕೆ ಮತ್ತು ಎಲೆಗಳಲ್ಲಿ ಆಹಾರ ತಯಾರಿಕೆಯ ಸಂಬಂಧವನ್ನು ತಿಳಿಸಿ.'
    ],
    sections: [
      {
        id: 'sec-1',
        timeAllocationMinutes: 5,
        title: 'The Hook: Mystery of the Green Solar Factory',
        titleHindi: 'शुरुआत: हरी सौर ऊर्जा फैक्ट्री का रहस्य',
        titleKannada: 'ಆರಂಭ: ಹಸಿರು ಸೌರ ಕಾರ್ಖಾನೆಯ ರಹಸ್ಯ',
        icon: 'Sparkles',
        teacherTalkingPoints: [
          '"Hold up a fresh green leaf. Ask: How does this tiny leaf create food for giant trees without shopping at a grocery store?"',
          '"Introduce the 3 essential raw materials: Sunlight, Water, and Carbon Dioxide."',
          '"Highlight today’s goal: We will unlock the recipe plants use to feed the entire planet."'
        ],
        teacherTalkingPointsHindi: [
          'हाथ में एक हरी पत्ती उठाएं और पूछें: यह नन्ही पत्ती बिना दुकान जाए पूरे पेड़ के लिए भोजन कैसे बनाती है?',
          'तीन मुख्य घटकों का परिचय दें: धूप, पानी और कार्बन डाइऑक्साइड।',
          'आज का लक्ष्य: पौधे पूरे ग्रह के लिए भोजन कैसे तैयार करते हैं, इस प्रक्रिया को समझना।'
        ],
        teacherTalkingPointsKannada: [
          'ಹಸಿರು ಎಲೆಯನ್ನು ತೋರಿಸಿ: ಈ ಪುಟ್ಟ ಎಲೆಯು ಅಂಗಡಿಗೆ ಹೋಗದೆ ಇಡೀ ಮರಕ್ಕೆ ಆಹಾರವನ್ನು ಹೇಗೆ ತಯಾರಿಸುತ್ತದೆ?',
          'ಮೂರು ಮುಖ್ಯ ಕಚ್ಚಾ ವಸ್ತುಗಳನ್ನು ಪರಿಚಯಿಸಿ: ಸೂರ್ಯನ ಬೆಳಕು, ನೀರು ಮತ್ತು ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ (CO2).',
          'ಇಂದಿನ ಗುರಿ: ಸಸ್ಯಗಳು ಆಹಾರ ತಯಾರಿಸುವ ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ರಹಸ್ಯವನ್ನು ಕಲಿಯುವುದು.'
        ],
        studentActivities: [
          'Touch and examine the texture of real leaves provided on classroom desks.',
          'Bilingual quick share: "Where do you think sunlight goes inside the leaf?"'
        ],
        scaffoldingTips: 'Ask Aarav and Rohan directly if they can name the green color pigment.',
        groundedInCitation: 'NCERT 2026, Ch. 1, p. 12'
      },
      {
        id: 'sec-2',
        timeAllocationMinutes: 12,
        title: 'Direct Instruction: The Photosynthesis Equation & Machinery',
        titleHindi: 'प्रत्यक्ष शिक्षण: प्रकाश संश्लेषण समीकरण और क्लोरोप्लास्ट',
        titleKannada: 'ಮುಖ್ಯ ಬೋಧನೆ: ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯ ರಾಸಾಯನಿಕ ಸಮೀಕರಣ ಮತ್ತು ಕ್ಲೋರೋಪ್ಲಾಸ್ಟ್',
        icon: 'BookOpen',
        teacherTalkingPoints: [
          'Display the visual diagram: Trace Sunlight → Chloroplasts (Chlorophyll traps photons).',
          'Explain the chemical equation step-by-step: 6 molecules of Carbon Dioxide + 6 molecules of Water with Light Energy yields 1 Glucose + 6 Oxygen.',
          'Point out Stomata under microscopic magnification on the interactive screen.',
          'Explain guard cells: Turgid = Stomata open (absorb CO₂); Flaccid = Closed (save water).'
        ],
        teacherTalkingPointsHindi: [
          'रासायनिक समीकरण को बोर्ड पर लिखें: 6CO₂ + 6H₂O + प्रकाश ऊर्जा → C₆H₁₂O₆ + 6O₂',
          'क्लोरोफिल का कार्य: सूर्य के प्रकाश की ऊर्जा को पकड़ना।',
          'रंध्र (स्टोमेटा) के रक्षक कोशिकाएं (Guard cells) कैसे खुलती और बंद होती हैं।'
        ],
        teacherTalkingPointsKannada: [
          'ರಾಸಾಯನಿಕ ಸಮೀಕರಣವನ್ನು ಬರೆಯಿರಿ: 6CO₂ + 6H₂O + ಸೂರ್ಯನ ಬೆಳಕು → C₆H₁₂O₆ (ಗ್ಲೂಕೋಸ್) + 6O₂ (ಆಮ್ಲಜನಕ).',
          'ಕ್ಲೋರೋಫಿಲ್ ಸೂರ್ಯನ ಫೋಟಾನ್ ಬೆಳಕಿನ ಶಕ್ತಿಯನ್ನು ಹೀರಿಕೊಳ್ಳುತ್ತದೆ.',
          'ಪತ್ರರಂಧ್ರಗಳು (Stomata) ಮತ್ತು ಕಾವಲು ಜೀವಕೋಶಗಳು (Guard cells) ಅನಿಲ ವಿನಿಮಯವನ್ನು ನಿಯಂತ್ರಿಸುತ್ತವೆ.'
        ],
        studentActivities: [
          'Students copy the color-coded equation into notebooks (CO₂ = Grey, H₂O = Blue, Light = Yellow, Glucose = Green, O₂ = Orange).',
          'Hand gesture demonstration: Mimic open/closed guard cells with palms.'
        ],
        scaffoldingTips: 'Display the Hindi glossary keywords on the sidebar for Priya and Aarav.',
        groundedInCitation: 'NCERT 2026, Ch. 1, pp. 13-14'
      },
      {
        id: 'sec-3',
        timeAllocationMinutes: 10,
        title: 'Guided Practice: The Starch & Sunlight Investigation',
        titleHindi: 'निर्देशित अभ्यास: स्टार्च और सूर्य के प्रकाश का परीक्षण',
        titleKannada: 'ಮಾರ್ಗದರ್ಶಿತ ಪ್ರಯೋಗ: ಪಿಷ್ಟ (Starch) ಮತ್ತು ಸೂರ್ಯನ ಬೆಳಕಿನ ಅಯೋಡಿನ್ ಪರೀಕ್ಷೆ',
        icon: 'FlaskConical',
        teacherTalkingPoints: [
          'Explain the Iodine Starch Test: Boiled leaf + Iodine solution turns blue-black where photosynthesis occurred.',
          'Ask the class: "If a leaf is kept in dark for 72 hours, what color will iodine turn? Why?"',
          'Address common misconception: Plants do NOT photosynthesize at midnight without light!'
        ],
        teacherTalkingPointsHindi: [
          'आयोडीन स्टार्च परीक्षण: उबली हुई पत्ती पर आयोडीन डालने पर स्टार्च होने पर वह नीला-काला (Blue-Black) हो जाता है।',
          'कक्षा से पूछें: अगर पत्ती को 3 दिन अंधेरे में रखा जाए तो क्या होगा?'
        ],
        teacherTalkingPointsKannada: [
          'ಅಯೋಡಿನ್ ಪಿಷ್ಟ ಪರೀಕ್ಷೆ: ಎಲೆಯ ಮೇಲೆ ಅಯೋಡಿನ್ ದ್ರಾವಣ ಹಾಕಿದಾಗ ಪಿಷ್ಟವಿದ್ದರೆ ಅದು ನೀಲಿ-ಕಪ್ಪು ಬಣ್ಣಕ್ಕೆ ತಿರುಗುತ್ತದೆ.',
          'ಕತ್ತಲೆಯಲ್ಲಿ 72 ಗಂಟೆಗಳ ಕಾಲ ಇಟ್ಟ ಎಲೆಯಲ್ಲಿ ಆಹಾರ ತಯಾರಾಗುವುದಿಲ್ಲ, ಆದ್ದರಿಂದ ಬಣ್ಣ ಬದಲಾಗುವುದಿಲ್ಲ.'
        ],
        studentActivities: [
          'Paired diagram analysis: Label the inputs and outputs on the provided worksheet.',
          'Predict the result of covering half a leaf with black paper.'
        ],
        scaffoldingTips: 'Check Rohan and Priya’s worksheets first to ensure they correctly identified Oxygen as the released product.',
        groundedInCitation: 'NCERT 2026, Ch. 1, p. 15'
      },
      {
        id: 'sec-4',
        timeAllocationMinutes: 8,
        title: 'Formative AI Checkpoint: Quick Diagnostic Quiz',
        titleHindi: 'रचनात्मक मूल्यांकन: त्वरित 3-प्रश्न क्विज़',
        titleKannada: 'ರಚನಾತ್ಮಕ ಮೌಲ್ಯಮಾಪನ: 3 ತ್ವರಿತ ರಸಪ್ರಶ್ನೆ ಪ್ರಶ್ನೆಗಳು',
        icon: 'HelpCircle',
        teacherTalkingPoints: [
          'Administer the 3-question quick quiz on student tablet/paper.',
          'Review real-time learner response telemetry to catch residual misconceptions before next week’s exam.'
        ],
        teacherTalkingPointsHindi: [
          '3-प्रश्नों की त्वरित क्विज़ हल कराएं और तुरंत फीडबैक दें।'
        ],
        teacherTalkingPointsKannada: [
          'ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ 3 ಪ್ರಶ್ನೆಗಳ ತ್ವರಿತ ರಸಪ್ರಶ್ನೆಯನ್ನು ನಡೆಸಿ ತಕ್ಷಣದ ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿ.'
        ],
        studentActivities: [
          'Solve the 3 interactive formative questions.',
          'Discuss question 2 (role of stomata) in pairs.'
        ],
        scaffoldingTips: 'Offer Hindi prompt voice read-out for bilingual students.',
        groundedInCitation: 'CBSE Pedagogical Framework 2026, p. 47'
      },
      {
        id: 'sec-5',
        timeAllocationMinutes: 5,
        title: 'Synthesis & Differentiated Wrap-Up',
        titleHindi: 'निष्कर्ष और स्तर-अनुसार गृहकार्य',
        titleKannada: 'ಉಪಸಂಹಾರ ಮತ್ತು ವಿಭಿನ್ನ ಮನೆಕೆಲಸ',
        icon: 'CheckCircle2',
        teacherTalkingPoints: [
          'Summarize: Without photosynthesis, Earth would have no oxygen and no food chain.',
          'Assign Tiered Homework: Standard gets worksheet; Advanced gets Calvin Cycle research; Beginners get "Plant Kitchen" comic strip.'
        ],
        teacherTalkingPointsHindi: [
          'सारांश: प्रकाश संश्लेषण के बिना पृथ्वी पर जीवन संभव नहीं है।',
          'सभी छात्रों को उनके स्तर के अनुसार कार्य सौंपें।'
        ],
        teacherTalkingPointsKannada: [
          'ಸಾರಾಂಶ: ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ಇಲ್ಲದೆ ಭೂಮಿಯ ಮೇಲೆ ಆಮ್ಲಜನಕ ಮತ್ತು ಜೀವಿಗಳು ಉಳಿಯಲು ಸಾಧ್ಯವಿಲ್ಲ.',
          'ಮಟ್ಟಕ್ಕೆ ತಕ್ಕಂತೆ ಮನೆಕೆಲಸವನ್ನು ನೀಡಿ.'
        ],
        studentActivities: [
          '30-second exit ticket: Whisper to your partner the name of the gas released.'
        ],
        groundedInCitation: 'NCERT 2026, Ch. 1, p. 16'
      }
    ]
  },

  advancedActivity: {
    title: 'Advanced Inquiry Challenge: The Photobiology & Calvin Cycle Explorer',
    titleHindi: 'उच्च स्तरीय खोज चुनौती: प्रकाश तीव्रता और प्रकाश संश्लेषण दर',
    inquiryChallenge: 'Investigate how differing wavelengths of light (Red vs Blue vs Green) and varying concentrations of atmospheric CO₂ affect the rate of oxygen bubble emission in underwater Hydrilla plants.',
    inquiryChallengeHindi: 'हाइड्रिला पौधे में प्रकाश के विभिन्न रंगों (लाल, नीला, हरा) और CO₂ की सांद्रता का ऑक्सीजन उत्सर्जन की गति पर प्रभाव मापें।',
    deepQuestions: [
      'Why do green leaves reflect green light and absorb red/blue light photons?',
      'If global temperatures rise above 45°C, why does the rate of photosynthesis drop drastically despite excess sunlight?',
      'How do desert C4/CAM plants keep stomata closed during blistering daylight without starving for CO₂?'
    ],
    extensionMaterials: [
      'Hydrilla sprig water bath apparatus guide',
      'Light spectrum filter color sheets',
      'Dissolved oxygen sensor simulation'
    ],
    targetStudents: ['Vihaan Reddy', 'Ananya Iyer']
  },

  visualDiagram: {
    title: 'Photosynthesis: The Plant’s Food Factory (Interactive High-Res Architecture)',
    imageUrl: '/assets/photosynthesis.jpg',
    caption: 'Cross-section of leaf showing cuticle, mesophyll cells, stomata gas exchange pores, chloroplast thylakoid stacks, and xylem/phloem vascular transport.',
    captionHindi: 'पत्ती की आंतरिक संरचना: क्यूटिकल, मेसोफिल कोशिकाएं, रंध्र, क्लोरोप्लास्ट और संवहनी बंडल (जाइलम/फ्लोएम)।',
    hotspots: [
      {
        label: 'Sunlight & Photons',
        hindiLabel: 'सूर्य का प्रकाश',
        description: 'Radiant solar energy absorbed by chlorophyll pigments in thylakoids.',
        x: 18,
        y: 16
      },
      {
        label: 'Stomata (Pores)',
        hindiLabel: 'रंध्र (स्टोमेटा)',
        description: 'Microscopic pores regulated by guard cells. Takes in CO₂ and releases O₂.',
        x: 12,
        y: 72
      },
      {
        label: 'Chloroplast Organelle',
        hindiLabel: 'क्लोरोप्लास्ट',
        description: 'The solar kitchen organelle containing green chlorophyll and Calvin cycle enzymes.',
        x: 74,
        y: 42
      },
      {
        label: 'Xylem Vessels (Roots)',
        hindiLabel: 'जाइलम (जल संवहन)',
        description: 'Draws water (H₂O) and minerals from roots upward through capillary action.',
        x: 48,
        y: 78
      },
      {
        label: 'Glucose & Oxygen Output',
        hindiLabel: 'ग्लूकोज और ऑक्सीजन उत्पाद',
        description: 'Synthesizes sugar (C₆H₁₂O₆) for energy and releases pure Oxygen (O₂) into the atmosphere.',
        x: 88,
        y: 52
      }
    ]
  },

  formativeQuiz: [
    {
      id: 'q-1',
      question: 'Which gas is taken in by green leaves through stomata during daytime photosynthesis?',
      questionHindi: 'दिन के समय प्रकाश संश्लेषण के दौरान पत्तियों द्वारा रंध्रों से कौन सी गैस अंदर ली जाती है?',
      questionKannada: 'ಹಗಲಿನ ವೇಳೆಯಲ್ಲಿ ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯ ಸಮಯದಲ್ಲಿ ಹಸಿರು ಎಲೆಗಳು ಪತ್ರರಂಧ್ರಗಳ ಮೂಲಕ ಯಾವ ಅನಿಲವನ್ನು ಒಳಗೆ ತೆಗೆದುಕೊಳ್ಳುತ್ತವೆ?',
      options: ['Oxygen (O₂)', 'Carbon Dioxide (CO₂)', 'Nitrogen (N₂)', 'Hydrogen (H₂)'],
      optionsHindi: ['ऑक्सीजन (O₂)', 'कार्बन डाइऑक्साइड (CO₂)', 'नाइट्रोजन (N₂)', 'हाइड्रोजन (H₂)'],
      optionsKannada: ['ಆಮ್ಲಜನಕ (Oxygen - O₂)', 'ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ (Carbon Dioxide - CO₂)', 'ಸಾರಜನಕ (Nitrogen - N₂)', 'ಜಲಜನಕ (Hydrogen - H₂)'],
      correctAnswerIndex: 1,
      explanation: 'Carbon dioxide is absorbed through stomata pores and combined with water to create glucose.',
      explanationHindi: 'कार्बन डाइऑक्साइड पत्तियों के रंध्रों से अवशोषित होती है और पानी के साथ मिलकर ग्लूकोज बनाती है।',
      explanationKannada: 'ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ (CO2) ಅನ್ನು ಪತ್ರರಂಧ್ರಗಳ ಮೂಲಕ ಹೀರಿಕೊಳ್ಳಲಾಗುತ್ತದೆ ಮತ್ತು ನೀರಿನೊಂದಿಗೆ ಸಂಯೋಜಿಸಿ ಗ್ಲೂಕೋಸ್ ತಯಾರಿಸಲಾಗುತ್ತದೆ.',
      targetedConcept: 'Stomata Gas Exchange',
      difficulty: 'Easy'
    },
    {
      id: 'q-2',
      question: 'What gives plants their green color and traps light energy for photosynthesis?',
      questionHindi: 'पौधों को हरा रंग कौन सा वर्णक देता है और प्रकाश ऊर्जा को अवशोषित करता है?',
      questionKannada: 'ಸಸ್ಯಗಳಿಗೆ ಹಸಿರು ಬಣ್ಣವನ್ನು ನೀಡುವ ಮತ್ತು ಬೆಳಕಿನ ಶಕ್ತಿಯನ್ನು ಹೀರಿಕೊಳ್ಳುವ ವರ್ಣದ್ರವ್ಯ ಯಾವುದು?',
      options: ['Hemoglobin', 'Chlorophyll', 'Melanin', 'Carotene'],
      optionsHindi: ['हीमोग्लोबिन', 'क्लोरोफिल (पर्णहरित)', 'मेलेनिन', 'कैरोटीन'],
      optionsKannada: ['ಹಿಮೋಗ್ಲೋಬಿನ್', 'ಕ್ಲೋರೋಫಿಲ್ (ಪತ್ರಹರಿತ್ತು)', 'ಮೆಲನಿನ್', 'ಕ್ಯಾರೋಟಿನ್'],
      correctAnswerIndex: 1,
      explanation: 'Chlorophyll located in chloroplasts absorbs blue and red wavelengths of light and reflects green light.',
      explanationHindi: 'क्लोरोप्लास्ट में मौजूद क्लोरोफिल प्रकाश संश्लेषण के लिए प्रकाश ऊर्जा को पकड़ता है।',
      explanationKannada: 'ಕ್ಲೋರೋಪ್ಲಾಸ್ಟ್‌ಗಳಲ್ಲಿರುವ ಕ್ಲೋರೋಫಿಲ್ ಸೌರ ಶಕ್ತಿಯನ್ನು ಹೀರಿಕೊಂಡು ಹಸಿರು ಬಣ್ಣವನ್ನು ಪ್ರತಿಫಲಿಸುತ್ತದೆ.',
      targetedConcept: 'Chloroplast Function',
      difficulty: 'Easy'
    },
    {
      id: 'q-3',
      question: 'Which plant vascular tissue is responsible for transporting water and minerals from roots upward to the leaves?',
      questionHindi: 'जड़ों से पत्तियों तक पानी और खनिजों का परिवहन करने वाला संवहनी ऊतक कौन सा है?',
      questionKannada: 'ಬೇರುಗಳಿಂದ ಎಲೆಗಳಿಗೆ ನೀರು ಮತ್ತು ಖನಿಜಗಳನ್ನು ಸಾಗಿಸುವ ಸಸ್ಯ ಅಂಗಾಂಶ ಯಾವುದು?',
      options: ['Phloem', 'Xylem', 'Epidermis', 'Cortex'],
      optionsHindi: ['फ्लोएम', 'जाइलम (Xylem)', 'एपिडर्मिस', 'कॉर्टेक्स'],
      optionsKannada: ['ಫ್ಲೋಯಂ (Phloem)', 'ಕ್ಸೈಲಂ (Xylem - ನೀರು ಸಾಗಣೆ)', 'ಎಪಿಡರ್ಮಿಸ್', 'ಕಾರ್ಟೆಕ್ಸ್'],
      correctAnswerIndex: 1,
      explanation: 'Xylem vessels act as continuous water pipes transporting water and dissolved soil minerals to photosynthetic mesophyll cells.',
      explanationHindi: 'जाइलम वाहिकाएं जड़ों से पत्तियों तक जल और खनिजों का एकदिशीय परिवहन करती हैं।',
      explanationKannada: 'ಕ್ಸೈಲಂ ಕೊಳವೆಗಳು ಬೇರುಗಳಿಂದ ದ್ಯುತಿಸಂಶ್ಲೇಷಕ ಜೀವಕೋಶಗಳಿಗೆ ನೀರನ್ನು ನಿರಂತರವಾಗಿ ಸಾಗಿಸುತ್ತವೆ.',
      targetedConcept: 'Water Transport Dynamics',
      difficulty: 'Easy'
    },
    {
      id: 'q-4',
      question: 'In what complex carbohydrate form do green plants primarily store excess synthesized glucose for later use?',
      questionHindi: 'हरे पौधे अतिरिक्त ग्लूकोज को मुख्य रूप से किस जटिल कार्बोहाइड्रेट के रूप में संग्रहित करते हैं?',
      questionKannada: 'ಹಸಿರು ಸಸ್ಯಗಳು ಹೆಚ್ಚುವರಿ ಗ್ಲೂಕೋಸ್ ಅನ್ನು ನಂತರದ ಬಳಕೆಗಾಗಿ ಯಾವ ರೂಪದಲ್ಲಿ ಸಂಗ್ರಹಿಸುತ್ತವೆ?',
      options: ['Starch', 'Glycogen', 'Lactose', 'Fructose'],
      optionsHindi: ['स्टार्च (Starch / मंड)', 'ग्लाइकोजन', 'लैक्टोज', 'फ्रुक्टोज'],
      optionsKannada: ['ಪಿಷ್ಟ (Starch)', 'ಗ್ಲೈಕೋಜನ್', 'ಲ್ಯಾಕ್ಟೋಸ್', 'ಫ್ರಕ್ಟೋಸ್'],
      correctAnswerIndex: 0,
      explanation: 'Plants polymerize soluble glucose into insoluble starch granules stored in amyloplasts.',
      explanationHindi: 'पौधे घुलनशील ग्लूकोज को अघुलनशील स्टार्च में बदलकर पत्तियों, तनों और जड़ों में संग्रहित करते हैं।',
      explanationKannada: 'ಸಸ್ಯಗಳು ಕರಗುವ ಗ್ಲೂಕೋಸ್ ಅನ್ನು ಪಿಷ್ಟದ (ಸ್ಟಾರ್ಚ್) ಕಣಗಳಾಗಿ ಪರಿವರ್ತಿಸಿ ಸಂಗ್ರಹಿಸುತ್ತವೆ.',
      targetedConcept: 'Starch Storage Mechanism',
      difficulty: 'Easy'
    },
    {
      id: 'q-5',
      question: 'What is the primary role of Chlorophyll in the leaf chloroplasts during the light-dependent phase?',
      questionHindi: 'पत्ती के क्लोरोप्लास्ट में क्लोरोफिल (पर्णहरित) का मुख्य कार्य क्या है?',
      questionKannada: 'ಎಲೆಯ ಕ್ಲೋರೋಪ್ಲಾಸ್ಟ್‌ಗಳಲ್ಲಿ ಕ್ಲೋರೋಫಿಲ್ (ಪತ್ರಹರಿತ್ತು) ನ ಪ್ರಮುಖ ಪಾತ್ರವೇನು?',
      options: [
        'To absorb water from the soil',
        'To trap solar photons and excite electrons',
        'To release carbon dioxide into the air',
        'To synthesize nitrogen compounds'
      ],
      optionsHindi: [
        'मिट्टी से पानी सोखना',
        'सौर ऊर्जा को अवशोषित कर इलेक्ट्रॉनों को उत्तेजित करना',
        'हवा में कार्बन डाइऑक्साइड छोड़ना',
        'नाइट्रोजन यौगिक बनाना'
      ],
      optionsKannada: [
        'ಮಣ್ಣಿನಿಂದ ನೀರನ್ನು ಹೀರಿಕೊಳ್ಳುವುದು',
        'ಸೌರ ಶಕ್ತಿಯನ್ನು ಹೀರಿಕೊಂಡು ಎಲೆಕ್ಟ್ರಾನ್‌ಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸುವುದು',
        'ಗಾಳಿಗೆ ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ ಬಿಡುಗಡೆ ಮಾಡುವುದು',
        'ಸಾರಜನಕ ಸಂಯುಕ್ತಗಳನ್ನು ತಯಾರಿಸುವುದು'
      ],
      correctAnswerIndex: 1,
      explanation: 'Chlorophyll acts as a photochemical antenna, absorbing photon energy to drive ATP and NADPH synthesis.',
      explanationHindi: 'क्लोरोफिल एक सौर पैनल की तरह काम करता है, जो रासायनिक ऊर्जा उत्पन्न करने के लिए प्रकाश को पकड़ता है।',
      explanationKannada: 'ಕ್ಲೋರೋಫಿಲ್ ಸೌರ ಫಲಕದಂತೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ, ರಾಸಾಯನಿಕ ಶಕ್ತಿ ಉತ್ಪಾದನೆಗೆ ಬೆಳಕನ್ನು ಸೆರೆಹಿಡಿಯುತ್ತದೆ.',
      targetedConcept: 'Chloroplast Function',
      difficulty: 'Medium'
    },
    {
      id: 'q-6',
      question: 'How do guard cells mechanically open the stomatal aperture when water rushes into them?',
      questionHindi: 'जब द्वार कोशिकाओं (Guard Cells) में जल प्रवेश करता है, तो रंध्र छिद्र कैसे खुलता है?',
      questionKannada: 'ಕಾವಲು ಕೋಶಗಳಿಗೆ (Guard Cells) ನೀರು ಪ್ರವೇಶಿಸಿದಾಗ ಪತ್ರರಂಧ್ರವು ಹೇಗೆ ತೆರೆದುಕೊಳ್ಳುತ್ತದೆ?',
      options: [
        'Guard cells shrink and become flaccid',
        'Guard cells swell and curve outward due to thick inner walls',
        'Guard cells produce wax to seal the opening',
        'Guard cells divide into two new daughter cells'
      ],
      optionsHindi: [
        'द्वार कोशिकाएं सिकुड़ जाती हैं',
        'द्वार कोशिकाएं फूलकर बाहर की ओर मुड़ जाती हैं क्योंकि उनकी आंतरिक भित्ति मोटी होती है',
        'द्वार कोशिकाएं मोम का स्राव करती हैं',
        'द्वार कोशिकाएं विभाजित हो जाती हैं'
      ],
      optionsKannada: [
        'ಕಾವಲು ಕೋಶಗಳು ಕುಗ್ಗುತ್ತವೆ',
        'ದಪ್ಪವಾದ ಒಳಗಿನ ಗೋಡೆಗಳ ಕಾರಣ ಕಾವಲು ಕೋಶಗಳು ಉಬ್ಬಿ ಹೊರಮುಖವಾಗಿ ಬಾಗುತ್ತವೆ',
        'ಕಾವಲು ಕೋಶಗಳು ಮೇಣವನ್ನು ಉತ್ಪಾದಿಸುತ್ತವೆ',
        'ಕಾವಲು ಕೋಶಗಳು ವಿಭಜನೆಯಾಗುತ್ತವೆ'
      ],
      correctAnswerIndex: 1,
      explanation: 'When turgid with water, differential cell wall elasticity causes guard cells to bow outward, widening the central stomatal pore.',
      explanationHindi: 'जब द्वार कोशिकाओं में जल भरता है, तो वे फूलकर बाहर की ओर झुक जाती हैं, जिससे रंध्र खुल जाता है।',
      explanationKannada: 'ನೀರಿನ ಒತ್ತಡ ಹೆಚ್ಚಾದಾಗ ಕಾವಲು ಕೋಶಗಳು ಉಬ್ಬಿ ಹೊರಬಾಗುತ್ತವೆ, ಇದರಿಂದ ರಂಧ್ರ ತೆರೆದುಕೊಳ್ಳುತ್ತದೆ.',
      targetedConcept: 'Stomata Gas Exchange',
      difficulty: 'Medium'
    },
    {
      id: 'q-7',
      question: 'In the balanced photosynthesis equation: 6CO₂ + 6H₂O + Light → ? + 6O₂, what is the stoichiometric yield represented by "?"?',
      questionHindi: 'संतुलित समीकरण (6CO₂ + 6H₂O + प्रकाश → ? + 6O₂) में "?" किस मुख्य उत्पाद को दर्शाता है?',
      questionKannada: 'ಸಮತೋಲಿತ ಸಮೀಕರಣದಲ್ಲಿ (6CO₂ + 6H₂O + ಬೆಳಕು → ? + 6O₂), "?" ಗುರುತಿಸಲಾದ ಮುಖ್ಯ ಉತ್ಪನ್ನ ಯಾವುದು?',
      options: ['Glucose (C₆H₁₂O₆)', 'Methane (CH₄)', 'Calcium Carbonate (CaCO₃)', 'Hydrochloric Acid (HCl)'],
      optionsHindi: ['ग्लूकोज (C₆H₁₂O₆)', 'मीथेन (CH₄)', 'कैल्शियम कार्बोनेट (CaCO₃)', 'हाइड्रोक्लोरिक एसिड (HCl)'],
      optionsKannada: ['ಗ್ಲೂಕೋಸ್ (Glucose - C₆H₁₂O₆)', 'ಮೀಥೇನ್ (Methane - CH₄)', 'ಕ್ಯಾಲ್ಸಿಯಂ ಕಾರ್ಬೋನೇಟ್ (CaCO₃)', 'ಹೈಡ್ರೋಕ್ಲೋರಿಕ್ ಆಮ್ಲ (HCl)'],
      correctAnswerIndex: 0,
      explanation: '6 molecules of carbon dioxide and 6 molecules of water produce exactly 1 molecule of glucose and 6 oxygen molecules.',
      explanationHindi: '6 कार्बन डाइऑक्साइड और 6 जल के अणु मिलकर 1 ग्लूकोज अणु और 6 ऑक्सीजन अणु बनाते हैं।',
      explanationKannada: '6 ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ ಮತ್ತು 6 ನೀರಿನ ಅಣುಗಳು ಸೇರಿ 1 ಗ್ಲೂಕೋಸ್ ಮತ್ತು 6 ಆಮ್ಲಜನಕದ ಅಣುಗಳನ್ನು ಉತ್ಪಾದಿಸುತ್ತವೆ.',
      targetedConcept: 'Balanced Stoichiometry',
      difficulty: 'Medium'
    },
    {
      id: 'q-8',
      question: 'Why does an iodine test turn a boiled, decolorized leaf blue-black after a 6-hour exposure to sunlight?',
      questionHindi: 'धूप में रखी गई पत्ती को उबालने और आयोडीन डालने पर वह नीला-काला रंग क्यों प्रदर्शित करती है?',
      questionKannada: 'ಸೂರ್ಯನ ಬೆಳಕಿನಲ್ಲಿರಿಸಿದ ಎಲೆಗೆ ಅಯೋಡಿನ್ ದ್ರಾವಣ ಹಾಕಿದಾಗ ಅದು ನೀಲಿ-ಕಪ್ಪು ಬಣ್ಣಕ್ಕೆ ತಿರುಗಲು ಕಾರಣವೇನು?',
      options: [
        'Iodine complexes with starch formed during photosynthesis',
        'Iodine reacts with chlorophyll pigment remaining in cell walls',
        'Iodine boils the water content of leaf veins',
        'Iodine oxidizes nitrogen into nitrates'
      ],
      optionsHindi: [
        'आयोडीन प्रकाश संश्लेषण में बने स्टार्च के साथ नीला-काला संकुल बनाता है',
        'आयोडीन क्लोरोफिल के साथ प्रतिक्रिया करता है',
        'आयोडीन पत्तियों के पानी को सुखा देता है',
        'आयोडीन नाइट्रोजन को नाइट्रेट में बदलता है'
      ],
      optionsKannada: [
        'ಅಯೋಡಿನ್ ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯಿಂದ ಉಂಟಾದ ಪಿಷ್ಟದೊಂದಿಗೆ (ಸ್ಟಾರ್ಚ್) ಸಂಯೋಜನೆಗೊಳ್ಳುತ್ತದೆ',
        'ಅಯೋಡಿನ್ ಕ್ಲೋರೋಫಿಲ್ ಜೊತೆ ವರ್ತಿಸುತ್ತದೆ',
        'ಅಯೋಡಿನ್ ಎಲೆಯ ನೀರನ್ನು ಕುದಿಸುತ್ತದೆ',
        'ಅಯೋಡಿನ್ ಸಾರಜನಕವನ್ನು ಆಕ್ಸಿಡೀಕರಿಸುತ್ತದೆ'
      ],
      correctAnswerIndex: 0,
      explanation: 'Triiodide ions slip into the amylose helix structure of starch, creating an intensely visible blue-black chromatic shift.',
      explanationHindi: 'आयोडीन स्टार्च की अमाइलोज श्रृंखला के साथ मिलकर गहरा नीला-काला रंग उत्पन्न करता है, जो प्रकाश संश्लेषण की पुष्टि करता है।',
      explanationKannada: 'ಅಯೋಡಿನ್ ಪಿಷ್ಟದೊಂದಿಗೆ ವರ್ತಿಸಿ ಗಾಢ ನೀಲಿ-ಕಪ್ಪು ಬಣ್ಣವನ್ನು ರೂಪಿಸುತ್ತದೆ, ಇದು ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯ ಸಾಬೀತುಪಡಿಸುವ ಪರೀಕ್ಷೆಯಾಗಿದೆ.',
      targetedConcept: 'Iodine Starch Test',
      difficulty: 'Medium'
    },
    {
      id: 'q-9',
      question: 'If a healthy green potted plant is placed in total darkness for 72 hours (destarched), what happens to its stored starch levels?',
      questionHindi: 'यदि किसी पौधे को 72 घंटे तक अंधेरे में रखा जाए (Destarched), तो उसमें संचित स्टार्च का क्या होगा?',
      questionKannada: 'ಒಂದು ಸಸ್ಯವನ್ನು 72 ಗಂಟೆಗಳ ಕಾಲ ಕತ್ತಲೆಯಲ್ಲಿಟ್ಟರೆ (Destarched), ಅದರೊಳಗಿನ ಸಂಗ್ರಹಿತ ಪಿಷ್ಟದ ಮಟ್ಟ ಏನಾಗುತ್ತದೆ?',
      options: [
        'Stored starch increases by 200%',
        'Stored starch is depleted as the plant consumes it for cellular respiration',
        'Starch is converted into chlorophyll crystals',
        'Starch turns into poisonous nitrates'
      ],
      optionsHindi: [
        'स्टार्च 200% बढ़ जाएगा',
        'संचित स्टार्च समाप्त हो जाएगा क्योंकि पौधा जीवित रहने के लिए श्वसन में उसका उपयोग कर लेता है',
        'स्टार्च क्लोरोफिल में बदल जाता है',
        'स्टार्च जहरीले नाइट्रेट में बदल जाता है'
      ],
      optionsKannada: [
        'ಪಿಷ್ಟವು 200% ಹೆಚ್ಚಾಗುತ್ತದೆ',
        'ಸಸ್ಯವು ಉಸಿರಾಟ ಮತ್ತು ಶಕ್ತಿಗಾಗಿ ಅದನ್ನು ಬಳಸಿಕೊಳ್ಳುವುದರಿಂದ ಪಿಷ್ಟವು ಖಾಲಿಯಾಗುತ್ತದೆ',
        'ಪಿಷ್ಟವು ಕ್ಲೋರೋಫಿಲ್ ಆಗಿ ಬದಲಾಗುತ್ತದೆ',
        'ಪಿಷ್ಟವು ವಿಷಕಾರಿ ನೈಟ್ರೇಟ್ ಆಗಿ ಬದಲಾಗುತ್ತದೆ'
      ],
      correctAnswerIndex: 1,
      explanation: 'Without sunlight, photosynthesis ceases and the plant hydrolyzes its stored starch into glucose for metabolic maintenance.',
      explanationHindi: 'सूर्य के प्रकाश के बिना प्रकाश संश्लेषण रुक जाता है और पौधा जीवित रहने के लिए अपने स्टार्च का उपयोग कर लेता है।',
      explanationKannada: 'ಬೆಳಕಿಲ್ಲದ ಕಾರಣ ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ನಿಲ್ಲುತ್ತದೆ ಮತ್ತು ಸಸ್ಯವು ತನ್ನ ಸಂಗ್ರಹಿತ ಪಿಷ್ಟವನ್ನು ಬಳಸಿಕೊಳ್ಳುತ್ತದೆ.',
      targetedConcept: 'Destarching & Respiration',
      difficulty: 'Medium'
    },
    {
      id: 'q-10',
      question: 'Analytical Inquiry: In an enclosed greenhouse, CO₂ levels are tripled to 1200 ppm, but light intensity is zero (midnight). Will the net rate of glucose synthesis increase?',
      questionHindi: 'विश्लेषणात्मक प्रश्न: एक ग्रीनहाउस में CO₂ को तीन गुना (1200 ppm) कर दिया गया है, लेकिन प्रकाश शून्य (रात) है। क्या ग्लूकोज निर्माण की दर बढ़ेगी?',
      questionKannada: 'ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಪ್ರಶ್ನೆ: ಹಸಿರುಮನೆಯಲ್ಲಿ CO₂ ಪ್ರಮಾಣವನ್ನು 3 ಪಟ್ಟು ಹೆಚ್ಚಿಸಲಾಗಿದೆ, ಆದರೆ ಬೆಳಕು ಶೂನ್ಯವಾಗಿದೆ. ಗ್ಲೂಕೋಸ್ ಉತ್ಪಾದನೆಯ ದರ ಹೆಚ್ಚಾಗುತ್ತದೆಯೇ?',
      options: [
        'Yes, because CO₂ is the sole carbon source',
        'No, because light is the essential limiting reactant needed to photolyze water and generate ATP/NADPH',
        'Yes, starch synthesis can occur spontaneously in the dark without energy',
        'No, but oxygen production will quadruple'
      ],
      optionsHindi: [
        'हाँ, क्योंकि CO₂ कार्बन का मुख्य स्रोत है',
        'नहीं, क्योंकि जल के प्रकाशीय अपघटन और ATP/NADPH ऊर्जा निर्माण के लिए प्रकाश अनिवार्य सीमांत कारक (Limiting Factor) है',
        'हाँ, अंधेरे में बिना ऊर्जा के स्टार्च बन सकता है',
        'नहीं, लेकिन ऑक्सीजन उत्पादन चार गुना बढ़ जाएगा'
      ],
      optionsKannada: [
        'ಹೌದು, ಏಕೆಂದರೆ CO2 ಮುಖ್ಯ ಇಂಗಾಲದ ಮೂಲವಾಗಿದೆ',
        'ಇಲ್ಲ, ಏಕೆಂದರೆ ನೀರಿನ ವಿಭಜನೆ ಮತ್ತು ATP/NADPH ಶಕ್ತಿ ಉತ್ಪಾದನೆಗೆ ಬೆಳಕು ಅತ್ಯಗತ್ಯ ಮಿತಿಯ ಅಂಶವಾಗಿದೆ (Limiting Factor)',
        'ಹೌದು, ಕತ್ತಲೆಯಲ್ಲಿ ಪಿಷ್ಟ ತಾನಾಗಿಯೇ ಉತ್ಪತ್ತಿಯಾಗುತ್ತದೆ',
        'ಇಲ್ಲ, ಆದರೆ ಆಮ್ಲಜನಕ ಉತ್ಪಾದನೆ ನಾಲ್ಕು ಪಟ್ಟು ಹೆಚ್ಚಾಗುತ್ತದೆ'
      ],
      correctAnswerIndex: 1,
      explanation: 'Blackman’s Law of Limiting Factors dictates that even in abundant CO2, the photochemical light reaction cannot proceed without photon flux to produce assimilatory power (ATP and NADPH).',
      explanationHindi: 'ब्लैकमैन के सीमांत कारक नियम के अनुसार, प्रचुर CO₂ होने पर भी प्रकाश के बिना जल का अपघटन और ATP ऊर्जा निर्माण संभव नहीं है।',
      explanationKannada: 'ಬ್ಲ್ಯಾಕ್‌ಮ್ಯಾನ್ ನಿಯಮದಂತೆ, ಸಾಕಷ್ಟು CO2 ಇದ್ದರೂ ಬೆಳಕಿನ ಅನುಪಸ್ಥಿತಿಯಲ್ಲಿ ರಾಸಾಯನಿಕ ಶಕ್ತಿ ಉತ್ಪಾದನೆಯಾಗದೆ ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ನಡೆಯುವುದಿಲ್ಲ.',
      targetedConcept: 'Limiting Reactant Dynamics',
      difficulty: 'Hard'
    },
    {
      id: 'q-11',
      question: 'Advanced Inquiry: At the "Light Compensation Point", what is the exact mathematical relationship between photosynthetic CO₂ uptake and respiratory CO₂ evolution?',
      questionHindi: 'उन्नत प्रश्न: "प्रकाश क्षतिपूर्ति बिंदु" (Light Compensation Point) पर प्रकाश संश्लेषण द्वारा ली गई CO₂ और श्वसन द्वारा छोड़ी गई CO₂ का संबंध क्या होता है?',
      questionKannada: 'ಸುಧಾರಿತ ಪ್ರಶ್ನೆ: "ಬೆಳಕಿನ ಸರಿದೂಗಿಸುವ ಹಂತದಲ್ಲಿ" (Light Compensation Point), ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯ CO₂ ಹೀರಿಕೊಳ್ಳುವಿಕೆ ಮತ್ತು ಉಸಿರಾಟದ CO₂ ಬಿಡುಗಡೆಯ ನಡುವಿನ ನಿಖರ ಸಂಬಂಧವೇನು?',
      options: [
        'Photosynthetic CO₂ uptake exactly equals respiratory CO₂ release (Net gas exchange = 0)',
        'Photosynthetic rate is 10 times higher than respiratory rate',
        'Cellular respiration completely ceases while photosynthesis operates at maximum velocity',
        'CO₂ uptake drops to negative infinity'
      ],
      optionsHindi: [
        'प्रकाश संश्लेषण द्वारा CO₂ अवशोषण = श्वसन द्वारा CO₂ उत्सर्जन (शुद्ध गैस विनिमय शून्य होता है)',
        'प्रकाश संश्लेषण श्वसन से 10 गुना अधिक होता है',
        'श्वसन पूरी तरह बंद हो जाता है और प्रकाश संश्लेषण चरम पर होता है',
        'CO₂ अवशोषण ऋणात्मक हो जाता है'
      ],
      optionsKannada: [
        'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯ CO2 ಹೀರಿಕೊಳ್ಳುವಿಕೆ = ಉಸಿರಾಟದ CO2 ಬಿಡುಗಡೆ (ನಿವ್ವಳ ಅನಿಲ ವಿನಿಮಯ ಶೂನ್ಯ)',
        'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ಉಸಿರಾಟಕ್ಕಿಂತ 10 ಪಟ್ಟು ಹೆಚ್ಚಿರುತ್ತದೆ',
        'ಉಸಿರಾಟ ಸಂಪೂರ್ಣವಾಗಿ ನಿಲ್ಲುತ್ತದೆ',
        'CO2 ಹೀರಿಕೊಳ್ಳುವಿಕೆ ಋಣಾತ್ಮಕವಾಗುತ್ತದೆ'
      ],
      correctAnswerIndex: 0,
      explanation: 'At the light compensation point, the rate of photosynthetic carbon fixation equals the rate of respiratory carbon release, resulting in zero net oxygen and carbon dioxide flux.',
      explanationHindi: 'प्रकाश क्षतिपूर्ति बिंदु पर प्रकाश संश्लेषण की दर और श्वसन की दर बराबर हो जाती है, जिससे शुद्ध गैसीय विनिमय शून्य होता है।',
      explanationKannada: 'ಲೈಟ್ ಕಾಂಪೆನ್ಸೇಶನ್ ಪಾಯಿಂಟ್‌ನಲ್ಲಿ ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯ ದರ ಮತ್ತು ಉಸಿರಾಟದ ದರ ಸಮನಾಗಿರುತ್ತದೆ, ಇದರಿಂದ ಒಟ್ಟು ಅನಿಲ ವಿನಿಮಯ ಶೂನ್ಯವಾಗಿರುತ್ತದೆ.',
      targetedConcept: 'Compensation Point Kinetics',
      difficulty: 'Hard'
    }
  ]
};

// 20-Minute Compressed Replanned Version (Triggered when teacher says "The class is behind; reduce this to 20 minutes")
export const REPLANNED_PHOTOSYNTHESIS_LESSON_20MIN: LessonPlan = {
  ...DEFAULT_PHOTOSYNTHESIS_LESSON_40MIN,
  id: 'lesson-photo-20-replanned',
  totalDurationMinutes: 20,
  isReplanned: true,
  replannedReason: 'Dynamic Voice Command: "The class is behind; reduce this to 20 minutes." Agent compressed timeline by merging Hook with Direct Instruction, replacing extended lab with focused visual diagram walk-through, and preserving all high-risk learner scaffolds.',
  approvalState: 'reviewing',
  lastUpdated: 'Just now (Replanned)',
  standardLesson: {
    ...DEFAULT_PHOTOSYNTHESIS_LESSON_40MIN.standardLesson,
    sections: [
      {
        id: 'sec-replan-1',
        timeAllocationMinutes: 3,
        title: 'Fast Hook & Essential Question',
        titleHindi: 'त्वरित शुरुआत और मुख्य प्रश्न',
        icon: 'Zap',
        teacherTalkingPoints: [
          '"Show visual diagram immediately: How do plants make food from thin air and sunlight?"',
          '"State core objective: Today we master the 3 ingredients and the balanced equation."'
        ],
        teacherTalkingPointsHindi: [
          'सीधे विजुअल डायग्राम दिखाएं और 3 मुख्य घटक बताएं।'
        ],
        studentActivities: [
          'Look at the interactive leaf diagram on screen.'
        ],
        scaffoldingTips: 'Directly address Aarav and Priya with Hindi terms: Sunlight (धूप), Water (पानी), CO2 (हवा).',
        groundedInCitation: 'NCERT 2026, Ch. 1, p. 12'
      },
      {
        id: 'sec-replan-2',
        timeAllocationMinutes: 8,
        title: 'Core Direct Teaching: Equation & Chloroplast Diagram',
        titleHindi: 'मुख्य शिक्षण: समीकरण और क्लोरोप्लास्ट संरचना',
        icon: 'BookOpen',
        teacherTalkingPoints: [
          'Focus directly on the balanced formula: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.',
          'Highlight Stomata guard cells (gas intake) and Chlorophyll (light capture).'
        ],
        teacherTalkingPointsHindi: [
          'संतुलित रासायनिक समीकरण पर ध्यान दें: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
          'रंध्र और क्लोरोफिल की भूमिका स्पष्ट करें।'
        ],
        studentActivities: [
          'Quick 1-minute write: Write the balanced formula once in notebook.'
        ],
        scaffoldingTips: 'Use the simplified "Plant Kitchen" analogy for students needing support.',
        groundedInCitation: 'NCERT 2026, Ch. 1, pp. 13-14'
      },
      {
        id: 'sec-replan-3',
        timeAllocationMinutes: 6,
        title: 'Rapid Formative Assessment (2 Questions)',
        titleHindi: 'त्वरित 2-प्रश्न मूल्यांकन',
        icon: 'HelpCircle',
        teacherTalkingPoints: [
          'Run the 2 highest priority diagnostic questions.',
          'Confirm that Aarav, Priya, and Rohan correctly identify CO2 as input and O2 as output.'
        ],
        teacherTalkingPointsHindi: [
          '2 महत्वपूर्ण प्रश्नों के माध्यम से छात्रों की समझ की तुरंत जांच करें।'
        ],
        studentActivities: [
          'Thumbs up / thumbs down rapid response to concept check.'
        ],
        scaffoldingTips: 'Provide immediate peer assistance.',
        groundedInCitation: 'CBSE Guideline 2026, p. 47'
      },
      {
        id: 'sec-replan-4',
        timeAllocationMinutes: 3,
        title: 'Speed Wrap-up & Remedial Assignment',
        titleHindi: 'त्वरित समापन और गृहकार्य',
        icon: 'CheckCircle2',
        teacherTalkingPoints: [
          '"Deliver key takeaway: Leaves convert light into glucose and give us oxygen to breathe."',
          '"Hand out bilingual flashcard summary for next week’s exam."'
        ],
        teacherTalkingPointsHindi: [
          'महत्वपूर्ण सारांश दोहराएं और परीक्षा के लिए फ्लैशकार्ड प्रदान करें।'
        ],
        studentActivities: [
          'Collect bilingual summary sheet.'
        ],
        groundedInCitation: 'NCERT 2026, Ch. 1, p. 16'
      }
    ]
  }
};

export const DEFAULT_CN_LESSON_30MIN: LessonPlan = {
  id: 'lesson-cn-tcp-30',
  topic: 'Computer Networks: TCP Congestion Control & Flow Control',
  topicHindi: 'कंप्यूटर नेटवर्क: टीसीपी फ्लो कंट्रोल और कंजेशन नियंत्रण',
  topicKannada: 'ಕಂಪ್ಯೂಟರ್ ನೆಟ್‌ವರ್ಕ್‌ಗಳು: ಟಿಸಿಪಿ ಹರಿವು ಮತ್ತು ದಟ್ಟಣೆ ನಿಯಂತ್ರಣ',
  grade: 11,
  subject: 'Computer Networks (CN) / CSE',
  totalDurationMinutes: 30,
  targetExamDate: 'Next Friday (Oct 17, 2026)',
  languages: ['English', 'Hindi', 'Kannada'],
  predictedGapsCount: 2,
  highRiskStudents: ['Rahul Sharma', 'Rohan Verma'],
  approvalState: 'draft',
  lastUpdated: 'Just now (Generated from Teacher Voice Intent)',
  
  sourcesUsed: [
    {
      sourceId: 'doc-cn-tanenbaum',
      citation: 'Computer Networks (Tanenbaum & Wetherall 6th Ed, Ch 6: Transport Layer)',
      reason: 'Primary verified academic ground truth for TCP sliding window, Slow Start exponential growth, and AIMD.'
    },
    {
      sourceId: 'doc-curriculum-guideline',
      citation: 'BTech / CBSE CSE Pedagogical Framework 2026',
      reason: 'Guided visual packet animation, bilingual terminology, and formative 2-minute checkpoint cadence.'
    }
  ],
  ignoredSources: [],

  beginnerExplanation: {
    summary: 'TCP is like a smart postman who tests how fast the road can carry letters without dropping any parcel along the way!',
    summaryHindi: 'टीसीपी एक समझदार डाकिया की तरह है जो पहले एक पैकेट भेजकर देखता है कि रास्ता साफ है या नहीं, फिर धीरे-धीरे पैकेट की संख्या बढ़ाता है!',
    summaryKannada: 'ಟಿಸಿಪಿ ಒಬ್ಬ ಬುದ್ಧಿವಂತ ಅಂಚೆಯಣ್ಣನಂತೆ, ರಸ್ತೆಯಲ್ಲಿ ಯಾವುದೇ ಪಾರ್ಸೆಲ್ ಬೀಳದಂತೆ ಎಷ್ಟು ವೇಗವಾಗಿ ಕಳುಹಿಸಬಹುದು ಎಂದು ಪರೀಕ್ಷಿಸುತ್ತದೆ!',
    keyAnalogy: 'The "Water Pipe & Funnel": Sender = Water Tap, Receiver Buffer = Funnel, Network Bandwidth = Pipe Width. If water enters faster than funnel drains → Overflow (Packet Loss)! Slow Start doubles water flow each round until a drop falls.',
    keyAnalogyHindi: 'पानी का पाइप और कीप (Funnel): भेजने वाला = नल, रिसीवर बफर = कीप, नेटवर्क = पाइप। अगर कीप भरने लगे तो फ्लो कंट्रोल नल को धीमा कर देता है!',
    keyAnalogyKannada: 'ನೀರಿನ ಪೈಪ್ ಮತ್ತು ಆಲಿಕೆ (Funnel): ಕಳುಹಿಸುವವನು = ನಲ್ಲಿ, ರಿಸೀವರ್ = ಆಲಿಕೆ. ನೀರು ಹೆಚ್ಚಾದರೆ ಸೋರಿಕೆ ಉಂಟಾಗುತ್ತದೆ (Packet Loss)!',
    visualCues: [
      'Sliding Window sliding forward across byte stream',
      'Exponential Slow Start curve (1 → 2 → 4 → 8 MSS) doubling per RTT',
      'Receiver Window (rwnd) advertising remaining buffer space'
    ],
    vocabularyGlossary: [
      { term: 'Flow Control', hindiTerm: 'फ्लो कंट्रोल (रिसीवर सुरक्षा)', kannadaTerm: 'ಹರಿವು ನಿಯಂತ್ರಣ', definition: 'Prevents fast sender from overwhelming slow receiver buffer (rwnd).' },
      { term: 'Congestion Control', hindiTerm: 'कंजेशन कंट्रोल (नेटवर्क सुरक्षा)', kannadaTerm: 'ದಟ್ಟಣೆ ನಿಯಂತ್ರಣ', definition: 'Prevents all senders from overwhelming the intermediate router network (cwnd).' },
      { term: 'Slow Start', hindiTerm: 'स्लो स्टार्ट (घातीय वृद्धि)', kannadaTerm: 'ಸ್ಲೋ ಸ್ಟಾರ್ಟ್', definition: 'Algorithm starting at 1 MSS and doubling congestion window every RTT.' },
      { term: 'AIMD', hindiTerm: 'एडिटिव इंक्रीज मल्टीप्लिकेटिव डिक्रीज', kannadaTerm: 'ಎಐಎಂಡಿ', definition: 'Increases linearly by 1 MSS upon ACK, cuts window in half upon loss.' }
    ],
    targetStudents: ['Rahul Sharma', 'Rohan Verma']
  },

  standardLesson: {
    objectives: [
      'Distinguish between Flow Control (Receiver Buffer rwnd) and Congestion Control (Network Pipe cwnd).',
      'Calculate window expansion during TCP Slow Start (Exponential) vs Congestion Avoidance (Linear).',
      'Explain Fast Retransmit and Fast Recovery upon 3 duplicate ACKs.'
    ],
    objectivesHindi: [
      'फ्लो कंट्रोल (rwnd) और कंजेशन कंट्रोल (cwnd) के बीच स्पष्ट अंतर समझें।',
      'स्लो स्टार्ट और कंजेशन अवॉइडेंस में विंडो ग्रोथ की गणना करें।',
      '3 डुप्लिकेट ACK मिलने पर फास्ट रीट्रांसमिट की कार्यप्रणाली समझाइए।'
    ],
    objectivesKannada: [
      'ಹರಿವು ನಿಯಂತ್ರಣ (rwnd) ಮತ್ತು ದಟ್ಟಣೆ ನಿಯಂತ್ರಣ (cwnd) ನಡುವಿನ ವ್ಯತ್ಯಾಸವನ್ನು ತಿಳಿಯಿರಿ.',
      'ಟಿಸಿಪಿ ಸ್ಲೋ ಸ್ಟಾರ್ಟ್ ಮತ್ತು ದಟ್ಟಣೆ ತಪ್ಪಿಸುವ ಹಂತಗಳಲ್ಲಿ ವಿಂಡೋ ಬೆಳವಣಿಗೆಯನ್ನು ಲೆಕ್ಕಹಾಕಿ.',
      '3 ನಕಲಿ ACK ಗಳಲ್ಲಿ ಫಾಸ್ಟ್ ರಿಟ್ರಾನ್ಸ್‌ಮಿಷನ್ ಕಾರ್ಯವಿಧಾನವನ್ನು ವಿವರಿಸಿ.'
    ],
    sections: [
      {
        id: 'sec-cn-1',
        timeAllocationMinutes: 4,
        title: 'The Hook: Why do Videos Buffer and Packets Drop?',
        titleHindi: 'शुरुआत: वीडियो बफर क्यों होता है और पैकेट्स कैसे ड्रॉप होते हैं?',
        titleKannada: 'ಆರಂಭ: ವೀಡಿಯೊಗಳು ಏಕೆ ಬಫರ್ ಆಗುತ್ತವೆ ಮತ್ತು ಪ್ಯಾಕೆಟ್‌ಗಳು ಹೇಗೆ ಕಳೆದುಹೋಗುತ್ತವೆ?',
        icon: 'Sparkles',
        teacherTalkingPoints: [
          '"Ask the class: When 100 students connect to campus Wi-Fi simultaneously to stream video, what stops the internet router from exploding with traffic?"',
          '"Introduce the twin guardians of TCP: Flow Control (protecting receiver) vs Congestion Control (protecting internet backbone)."'
        ],
        teacherTalkingPointsHindi: [
          'कक्षा से पूछें: जब 100 लोग एक साथ वाई-फाई से वीडियो चलाते हैं तो राउटर कैसे संभालता है?',
          'टीसीपी के दो रक्षकों का परिचय दें: फ्लो कंट्रोल और कंजेशन कंट्रोल।'
        ],
        teacherTalkingPointsKannada: [
          'ಒಂದೇ ಸಮಯದಲ್ಲಿ 100 ವಿದ್ಯಾರ್ಥಿಗಳು ವೈಫೈಗೆ ಸಂಪರ್ಕಿಸಿದಾಗ ನೆಟ್‌ವರ್ಕ್ ಟ್ರಾಫಿಕ್ ಅನ್ನು ಹೇಗೆ ನಿರ್ವಹಿಸಲಾಗುತ್ತದೆ?',
          'ಟಿಸಿಪಿಯ ಎರಡು ರಕ್ಷಕರನ್ನು ಪರಿಚಯಿಸಿ: ಹರಿವು ನಿಯಂತ್ರಣ ಮತ್ತು ದಟ್ಟಣೆ ನಿಯಂತ್ರಣ.'
        ],
        studentActivities: [
          'Live poll: "Who has experienced sudden video quality drops during peak hours?"'
        ],
        scaffoldingTips: 'Ask Rahul directly: "What happens if a sender pours data into a full phone storage?"',
        groundedInCitation: 'Tanenbaum Ch 6, p. 542'
      },
      {
        id: 'sec-cn-2',
        timeAllocationMinutes: 10,
        title: 'Core Direct Instruction: TCP Slow Start & Congestion Avoidance',
        titleHindi: 'मुख्य शिक्षण: स्लो स्टार्ट और कंजेशन अवॉइडेंस गणित',
        titleKannada: 'ಮುಖ್ಯ ಬೋಧನೆ: ಟಿಸಿಪಿ ಸ್ಲೋ ಸ್ಟಾರ್ಟ್ ಮತ್ತು ದಟ್ಟಣೆ ತಪ್ಪಿಸುವ ಅಲ್ಗಾರಿದಮ್',
        icon: 'BookOpen',
        teacherTalkingPoints: [
          'Draw the Congestion Window curve: cwnd starts at 1 MSS (Maximum Segment Size).',
          'Every round-trip time (RTT), cwnd doubles: 1 → 2 → 4 → 8 → 16 (Exponential Phase).',
          'When cwnd reaches Slow-Start Threshold (ssthresh), switch to Linear Growth: cwnd = cwnd + 1 per RTT.',
          'Upon Packet Loss: Drop ssthresh to cwnd / 2 and reset cwnd to 1 MSS (Tahoe) or cut in half (Reno).'
        ],
        teacherTalkingPointsHindi: [
          'बोर्ड पर कर्व बनाएं: स्लो स्टार्ट में विंडो हर राउंड में दोगुनी (1→2→4→8) होती है।',
          'थ्रेसहोल्ड (ssthresh) पर पहुंचने के बाद यह लीनियर (+1) हो जाती है।'
        ],
        teacherTalkingPointsKannada: [
          'ವಿಂಡೋ ಬೆಳವಣಿಗೆಯ ಗ್ರಾಫ್ ರಚಿಸಿ: ಪ್ರತಿ RTT ನಲ್ಲಿ ವಿಂಡೋ ದ್ವಿಗುಣಗೊಳ್ಳುತ್ತದೆ (1→2→4→8).',
          'ಮಿತಿ ತಲುಪಿದ ನಂತರ ಅದು ರೇಖೀಯವಾಗಿ (+1) ಬೆಳೆಯುತ್ತದೆ.'
        ],
        studentActivities: [
          'Calculate cwnd size for RTT 1, 2, 3, 4 given ssthresh = 16 MSS.',
          'Trace packet exchange using interactive sliding window diagram.'
        ],
        scaffoldingTips: 'Guide Rahul through the 1→2→4 doubling steps before introducing ssthresh.',
        groundedInCitation: 'Tanenbaum Ch 6, pp. 546-550'
      },
      {
        id: 'sec-cn-3',
        timeAllocationMinutes: 8,
        title: 'Guided Workshop: Flow Control (rwnd) vs Congestion Control (cwnd)',
        titleHindi: 'निर्देशित कार्यशाला: फ्लो कंट्रोल बनाम कंजेशन कंट्रोल तुलना',
        titleKannada: 'ಮಾರ್ಗದರ್ಶಿತ ಕಾರ್ಯಾಗಾರ: rwnd ಮತ್ತು cwnd ನಡುವಿನ ತುಲನಾತ್ಮಕ ಲೆಕ್ಕಾಚಾರ',
        icon: 'FlaskConical',
        teacherTalkingPoints: [
          'Explain effective window formula: Effective Window = min(cwnd, rwnd).',
          'Scenario 1: Fast sender, 10 Gbps network, but smartphone receiver buffer is only 4 KB → rwnd bottlenecks.',
          'Scenario 2: Fast server, fast phone, but congested router with high queue delay → cwnd bottlenecks.'
        ],
        teacherTalkingPointsHindi: [
          'इफेक्टिव विंडो फॉर्मूला समझाएं: Effective Window = min(cwnd, rwnd)',
          'केस 1: फोन धीमा है तो rwnd रोकेगा। केस 2: नेटवर्क जाम है तो cwnd रोकेगा।'
        ],
        teacherTalkingPointsKannada: [
          'ಪರಿಣಾಮಕಾರಿ ವಿಂಡೋ ಸೂತ್ರ: Effective Window = min(cwnd, rwnd).',
          'ರಿಸೀವರ್ ಬಫರ್ ತುಂಬಿದ್ದರೆ rwnd ನಿಯಂತ್ರಿಸುತ್ತದೆ; ನೆಟ್‌ವರ್ಕ್ ದಟ್ಟಣೆಯಾಗಿದ್ದರೆ cwnd ನಿಯಂತ್ರಿಸುತ್ತದೆ.'
        ],
        studentActivities: [
          'Solve scenario worksheet: Identify whether rwnd or cwnd is the bottleneck.'
        ],
        scaffoldingTips: 'Check Rahul’s min(cwnd, rwnd) worksheet answer first.',
        groundedInCitation: 'Tanenbaum Ch 6, p. 553'
      },
      {
        id: 'sec-cn-4',
        timeAllocationMinutes: 5,
        title: 'Formative AI Checkpoint: 3-Question Diagnostic',
        titleHindi: 'रचनात्मक मूल्यांकन: 3-प्रश्न टीसीपी क्विज़',
        titleKannada: 'ರಚನಾತ್ಮಕ ಮೌಲ್ಯಮಾಪನ: 3 ತ್ವರಿತ ರಸಪ್ರಶ್ನೆಗಳು',
        icon: 'HelpCircle',
        teacherTalkingPoints: [
          'Deploy the 3-question formative quiz on student tablets.',
          'Inspect Rahul and Rohan’s live Learning Twin mastery updates in real-time.'
        ],
        teacherTalkingPointsHindi: [
          '3-प्रश्नों की क्विज़ हल कराएं और राहुल का लाइव लर्निंग ट्विन स्कोर देखें।'
        ],
        teacherTalkingPointsKannada: [
          'ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ 3 ಪ್ರಶ್ನೆಗಳ ರಸಪ್ರಶ್ನೆ ನೀಡಿ ರಾಹುಲ್ ಅವರ ಲೈವ್ ಸ್ಕೋರ್ ಪರಿಶೀಲಿಸಿ.'
        ],
        studentActivities: [
          'Submit answers to the 3 TCP questions on tablet.'
        ],
        scaffoldingTips: 'Offer audio read-out of the Slow Start question for Rahul.',
        groundedInCitation: 'CBSE / CSE Framework 2026'
      },
      {
        id: 'sec-cn-5',
        timeAllocationMinutes: 3,
        title: 'Synthesis & Real-Time Twin Update Wrap-Up',
        titleHindi: 'निष्कर्ष और लर्निंग ट्विन अपडेट',
        titleKannada: 'ಉಪಸಂಹಾರ ಮತ್ತು ಕಲಿಕಾ ಟ್ವಿನ್ ನವೀಕರಣ',
        icon: 'CheckCircle2',
        teacherTalkingPoints: [
          'Summarize: TCP balances reliability with speed using feedback loops.',
          'Confirm that Rahul’s Flow Control mastery improved from 72% to 88% after today’s scaffolded analogies.'
        ],
        teacherTalkingPointsHindi: [
          'सारांश: टीसीपी फीडबैक लूप से विश्वसनीयता और गति दोनों बनाए रखता है।'
        ],
        teacherTalkingPointsKannada: [
          'ಸಾರಾಂಶ: ಟಿಸಿಪಿ ಫೀಡ್‌ಬ್ಯಾಕ್ ಲೂಪ್ ಬಳಸಿ ವಿಶ್ವಾಸಾರ್ಹತೆ ಮತ್ತು ವೇಗವನ್ನು ಕಾಪಾಡುತ್ತದೆ.'
        ],
        studentActivities: [
          '15-second exit ticket: Name the formula for effective window.'
        ],
        groundedInCitation: 'Tanenbaum Ch 6, p. 558'
      }
    ]
  },

  advancedActivity: {
    title: 'Advanced Inquiry: BBR (Bottleneck Bandwidth & RTT) vs Cubic',
    titleHindi: 'उच्च स्तरीय खोज: Google BBR बनाम TCP Cubic एल्गोरिदम',
    titleKannada: 'ಮುಂದುವರಿದ ಅನ್ವೇಷಣೆ: ಗೂಗಲ್ BBR ವರ್ಸಸ್ ಕ್ಯೂಬಿಕ್ ಅಲ್ಗಾರಿದಮ್',
    inquiryChallenge: 'Analyze why Google developed BBR to replace loss-based TCP Cubic, and how BBR achieves higher throughput on modern fiber & 5G networks without causing bufferbloat.',
    inquiryChallengeHindi: 'विश्लेषण करें कि Google ने लॉस-आधारित TCP Cubic को बदलने के लिए BBR क्यों विकसित किया, और BBR बिना बफरब्लोट के आधुनिक 5G और फाइबर नेटवर्क पर उच्च थ्रूपुट कैसे प्राप्त करता है।',
    inquiryChallengeKannada: 'ಬಫರ್ ಬ್ಲೋಟ್ ಉಂಟುಮಾಡದೆ ಆಧುನಿಕ ಫೈಬರ್ ಮತ್ತು 5G ನೆಟ್‌ವರ್ಕ್‌ಗಳಲ್ಲಿ ಹೆಚ್ಚಿನ ಥ್ರೂಪುಟ್ ಸಾಧಿಸಲು ಗೂಗಲ್ BBR ಅನ್ನು ಏಕೆ ಅಭಿವೃದ್ಧಿಪಡಿಸಿದೆ ಎಂದು ವಿಶ್ಲೇಷಿಸಿ.',
    deepQuestions: [
      'Why does traditional packet loss not always mean the network is congested (e.g. wireless packet corruption)?',
      'How does TCP BBR calculate delivery rate and min RTT without waiting for a packet drop?'
    ],
    extensionMaterials: [
      'Wireshark TCP packet trace file (.pcapng)',
      'BBR vs Cubic throughput comparison simulator'
    ],
    targetStudents: ['Vihaan Reddy', 'Ananya Iyer']
  },

  visualDiagram: {
    title: 'TCP Congestion Window Dynamics (Slow Start, AIMD & Fast Recovery)',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    caption: 'TCP Congestion Window expansion over time showing exponential Slow Start, ssthresh transition, additive increase, and multiplicative decrease on packet loss.',
    captionHindi: 'टीसीपी कंजेशन विंडो डायनेमिक्स: स्लो स्टार्ट, ssthresh थ्रेसहोल्ड, एडिटिव इंक्रीज और मल्टीप्लिकेटिव डिक्रीज।',
    hotspots: [
      { label: 'Slow Start Phase', hindiLabel: 'स्लो स्टार्ट चरण', description: 'Window doubles each RTT (1 → 2 → 4 → 8 MSS). Exponential growth.', x: 22, y: 70 },
      { label: 'ssthresh Threshold', hindiLabel: 'ssthresh थ्रेसहोल्ड', description: 'Transition point from exponential doubling to linear additive increase (+1 MSS/RTT).', x: 45, y: 40 },
      { label: 'Packet Loss (Timeout)', hindiLabel: 'पैकेट लॉस एवं कट', description: 'Timeout occurs: ssthresh set to cwnd/2, cwnd resets to 1 MSS.', x: 78, y: 25 },
      { label: 'Receiver Buffer (rwnd)', hindiLabel: 'रिसीवर बफर सीमा', description: 'Maximum window size the receiver can buffer without dropping bytes.', x: 85, y: 80 }
    ]
  },

  formativeQuiz: [
    {
      id: 'quiz-cn-1',
      question: 'In TCP Slow Start, if the current Congestion Window (cwnd) is 4 MSS and all 4 ACKs return successfully, what is the new cwnd?',
      questionHindi: 'टीसीपी स्लो स्टार्ट में, यदि वर्तमान cwnd 4 MSS है और सभी 4 ACK प्राप्त हो जाते हैं, तो नया cwnd क्या होगा?',
      questionKannada: 'ಟಿಸಿಪಿ ಸ್ಲೋ ಸ್ಟಾರ್ಟ್‌ನಲ್ಲಿ, ಪ್ರಸ್ತುತ cwnd 4 MSS ಆಗಿದ್ದು ಎಲ್ಲಾ 4 ACK ಗಳು ಬಂದರೆ ಹೊಸ cwnd ಎಷ್ಟು?',
      options: ['5 MSS (Increases by 1)', '8 MSS (Doubles)', '16 MSS (Squares)', '4 MSS (Remains unchanged)'],
      optionsHindi: ['5 MSS (1 की वृद्धि)', '8 MSS (दोगुना हो जाता है)', '16 MSS (वर्ग होता है)', '4 MSS (अपरिवर्तित)'],
      optionsKannada: ['5 MSS', '8 MSS (ದ್ವಿಗುಣ)', '16 MSS', '4 MSS'],
      correctAnswerIndex: 1,
      explanation: 'During Slow Start, cwnd doubles each RTT (increases by 1 MSS for every received ACK, so 4 + 4 = 8 MSS).',
      explanationHindi: 'स्लो स्टार्ट में प्रत्येक सफल RTT पर cwnd दोगुना (4 → 8 MSS) हो जाता है।',
      explanationKannada: 'ಸ್ಲೋ ಸ್ಟಾರ್ಟ್ ಹಂತದಲ್ಲಿ ಪ್ರತಿ RTT ನಲ್ಲಿ ವಿಂಡೋ ದ್ವಿಗುಣಗೊಳ್ಳುತ್ತದೆ (4 ರಿಂದ 8 MSS).',
      targetedConcept: 'Slow Start Exponential Growth',
      difficulty: 'Medium'
    },
    {
      id: 'quiz-cn-2',
      question: 'What is the key difference between Flow Control and Congestion Control in TCP?',
      questionHindi: 'टीसीपी में फ्लो कंट्रोल और कंजेशन कंट्रोल के बीच मुख्य अंतर क्या है?',
      questionKannada: 'ಟಿಸಿಪಿಯಲ್ಲಿ ಹರಿವು ನಿಯಂತ್ರಣ ಮತ್ತು ದಟ್ಟಣೆ ನಿಯಂತ್ರಣ ನಡುವಿನ ಪ್ರಮುಖ ವ್ಯತ್ಯಾಸವೇನು?',
      options: [
        'Flow control protects the receiver buffer (rwnd); congestion control protects the network pipe (cwnd).',
        'Flow control uses UDP; congestion control uses TCP.',
        'Flow control handles encryption; congestion control handles routing.',
        'There is no difference; they are the exact same mechanism.'
      ],
      optionsHindi: [
        'फ्लो कंट्रोल रिसीवर बफर (rwnd) की रक्षा करता है; कंजेशन कंट्रोल नेटवर्क की रक्षा करता है (cwnd)।',
        'फ्लो कंट्रोल UDP का उपयोग करता है; कंजेशन कंट्रोल TCP का।',
        'फ्लो कंट्रोल एन्क्रिप्शन संभालता है।',
        'दोनों में कोई अंतर नहीं है।'
      ],
      optionsKannada: [
        'ಹರಿವು ನಿಯಂತ್ರಣ ರಿಸೀವರ್ ಬಫರ್ (rwnd) ರಕ್ಷಿಸುತ್ತದೆ; ದಟ್ಟಣೆ ನಿಯಂತ್ರಣ ನೆಟ್‌ವರ್ಕ್ (cwnd) ರಕ್ಷಿಸುತ್ತದೆ.',
        'ಫ್ಲೋ ಕಂಟ್ರೋಲ್ ಯುಡಿಪಿ ಬಳಸುತ್ತದೆ.',
        'ಫ್ಲೋ ಕಂಟ್ರೋಲ್ ಎನ್‌ಕ್ರಿಪ್ಶನ್ ಆಗಿದೆ.',
        'ಯಾವುದೇ ವ್ಯತ್ಯಾಸವಿಲ್ಲ.'
      ],
      correctAnswerIndex: 0,
      explanation: 'Flow control is end-to-end (sender vs receiver buffer advertised via rwnd), while Congestion control is network-wide (preventing router queue overload via cwnd).',
      explanationHindi: 'फ्लो कंट्रोल रिसीवर बफर को भरने से रोकता है, जबकि कंजेशन कंट्रोल पूरे नेटवर्क में जाम से बचाता है।',
      explanationKannada: 'ಹರಿವು ನಿಯಂತ್ರಣ ರಿಸೀವರ್ ಬಫರ್ ರಕ್ಷಿಸುತ್ತದೆ ಮತ್ತು ದಟ್ಟಣೆ ನಿಯಂತ್ರಣ ಸಂಪೂರ್ಣ ನೆಟ್‌ವರ್ಕ್ ರಕ್ಷಿಸುತ್ತದೆ.',
      targetedConcept: 'Flow Control vs Congestion Control',
      difficulty: 'Easy'
    },
    {
      id: 'quiz-cn-3',
      question: 'If a sender has a Congestion Window (cwnd) of 20 KB and the receiver advertises a Receive Window (rwnd) of 8 KB, how much unacknowledged data can the sender transmit?',
      questionHindi: 'यदि प्रेषक का cwnd 20 KB है और रिसीवर का rwnd 8 KB है, तो प्रेषक अधिकतम कितना डेटा भेज सकता है?',
      questionKannada: 'ಕಳುಹಿಸುವವನ cwnd 20 KB ಮತ್ತು ಸ್ವೀಕರಿಸುವವನ rwnd 8 KB ಆಗಿದ್ದರೆ, ಎಷ್ಟು ಡೇಟಾವನ್ನು ಕಳುಹಿಸಬಹುದು?',
      options: ['20 KB (Uses cwnd)', '8 KB (Uses min(cwnd, rwnd))', '28 KB (Adds both)', '12 KB (Subtracts rwnd)'],
      optionsHindi: ['20 KB', '8 KB (min(cwnd, rwnd) का उपयोग)', '28 KB', '12 KB'],
      optionsKannada: ['20 KB', '8 KB (ಕನಿಷ್ಠ ಸೂತ್ರ)', '28 KB', '12 KB'],
      correctAnswerIndex: 1,
      explanation: 'Effective transmission window is always bounded by min(cwnd, rwnd) to avoid overwhelming both network and receiver.',
      explanationHindi: 'प्रभावी विंडो हमेशा min(cwnd, rwnd) होती है = min(20 KB, 8 KB) = 8 KB।',
      explanationKannada: 'ಪರಿಣಾಮಕಾರಿ ವಿಂಡೋ ಯಾವಾಗಲೂ min(cwnd, rwnd) = 8 KB ಆಗಿರುತ್ತದೆ.',
      targetedConcept: 'Effective Window Calculation',
      difficulty: 'Hard'
    }
  ]
};

export const MOCK_ADAPTIVE_ROUTES: AdaptiveRoute[] = [
  {
    id: 'route-student-a',
    studentPersona: 'Student A',
    studentName: 'Rahul Sharma / Aarav Sharma',
    preferenceDescription: 'Likes examples & physical analogies',
    routeSteps: [
      { phase: 'Phase 1', description: 'Real-world physical example (Water Pipe / Reservoir Funnel)', modality: 'example' },
      { phase: 'Phase 2', description: 'Step-by-step conceptual explanation with concrete analogies', modality: 'audio' },
      { phase: 'Phase 3', description: 'Targeted application question under guided prompts', modality: 'quiz' }
    ],
    sameLearningObjective: 'Master TCP Slow Start exponential window doubling & rwnd buffer limits'
  },
  {
    id: 'route-student-b',
    studentPersona: 'Student B',
    studentName: 'Priya Patel / Sneha Gupta',
    preferenceDescription: 'Prefers visual learning & diagram inspection',
    routeSteps: [
      { phase: 'Phase 1', description: 'Interactive visual diagram with color-coded window boundaries', modality: 'diagram' },
      { phase: 'Phase 2', description: 'Visual explanation with annotated packet transmission timelines', modality: 'diagram' },
      { phase: 'Phase 3', description: 'Hands-on interactive slider simulation with live feedback', modality: 'interaction' }
    ],
    sameLearningObjective: 'Master TCP Slow Start exponential window doubling & rwnd buffer limits'
  },
  {
    id: 'route-student-c',
    studentPersona: 'Student C',
    studentName: 'Prajwal Gowda / Vihaan Reddy',
    preferenceDescription: 'Struggles with English; needs bilingual regional voice',
    routeSteps: [
      { phase: 'Phase 1', description: 'Bilingual English core explanation with phonetic key terms', modality: 'example' },
      { phase: 'Phase 2', description: 'Kannada / Hindi audio voice explanation with regional metaphors', modality: 'audio' },
      { phase: 'Phase 3', description: 'Bilingual formative exit check in student\'s preferred language', modality: 'quiz' }
    ],
    sameLearningObjective: 'Master TCP Slow Start exponential window doubling & rwnd buffer limits'
  }
];

export const MOCK_TEACHER_RECOMMENDATIONS: TeacherCopilotRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Prerequisite Activity Recommendation',
    strugglingStudentCount: 8,
    strugglingStudentNames: ['Rahul Sharma', 'Aarav Sharma', 'Rohan Verma', 'Priya Patel', 'Sneha Gupta', 'Vihaan Reddy', 'Prajwal Gowda', 'Ananya Iyer'],
    topic: 'Candidate Keys / Flow Control & Slow Start',
    recommendationText: '8 students are struggling with Flow Control & Slow Start. Consider adding a 7-minute prerequisite activity.',
    prerequisiteActivityMinutes: 7,
    status: 'pending'
  }
];

