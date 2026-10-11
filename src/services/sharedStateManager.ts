/**
 * MINDMESH-NEXUS Shared Browser State & Multi-Tab Synchronization Service
 * Coordinates shared data across Teacher Studio and Student Portal:
 * - Knowledge Base Documents & Source Verification
 * - Curriculum Map (Modules, Topics, Attached Diagram Notes & Video Links)
 * - Shared Calendar (Month, Week, Timeline views, Scheduling, Objectives, Prerequisites)
 * - Student Analytics & Editable Assessment Marks (Mastery calculation & Unlocking next topics)
 * - Interventions Scheduling & Reassessments
 * - Assessments History & Mastery Telemetry
 */

import { 
  CurriculumTopic, 
  CalendarEvent, 
  Student, 
  DocumentSource, 
  LessonPlan, 
  StudentIntervention, 
  StudentAssessmentRecord 
} from '../types';
import { 
  INITIAL_DOCUMENTS, 
  INITIAL_STUDENTS, 
  DEFAULT_OPEN_SOURCE_AI_LESSON_40MIN,
  DEFAULT_PHOTOSYNTHESIS_LESSON_40MIN 
} from '../data/mockData';

const STORAGE_CURRICULUM_KEY = 'mindmesh_curriculum_v2';
const STORAGE_CALENDAR_KEY = 'mindmesh_calendar_v2';
const STORAGE_STUDENTS_KEY = 'mindmesh_students_v2';
const STORAGE_INTERVENTIONS_KEY = 'mindmesh_interventions_v2';
const STORAGE_ASSESSMENTS_KEY = 'mindmesh_assessments_v2';
const STORAGE_DOCUMENTS_KEY = 'mindmesh_documents_v2';
const STORAGE_LESSON_KEY = 'mindmesh_lesson_v3';
const STORAGE_CLASSROOM_CODE_KEY = 'mindmesh_classroom_code_v1';
const STORAGE_STUDENT_CODE_KEY = 'mindmesh_student_joined_code_v1';
const STORAGE_CONNECTED_STUDENTS_KEY = 'mindmesh_connected_students_v1';

export const INITIAL_CURRICULUM_MODULES: CurriculumTopic[] = [
  // Module 1: Foundational Linear Data Structures
  {
    id: 'ds-mod1-top1',
    module: 'Module 1: Linear Data Structures',
    title: 'Arrays & Dynamic Contiguous Memory',
    titleHindi: 'ऐरे और डायनामिक मेमोरी आवंटन',
    titleKannada: 'ಅರೇಗಳು ಮತ್ತು ಡೈನಾಮಿಕ್ ಮೆಮೊರಿ',
    description: 'Cache locality, 1D/2D index computation, and O(1) random access vs O(N) insertion.',
    prerequisites: ['Basic Memory Pointers & Variables'],
    isUnlocked: true,
    masteryScore: 88,
    diagramNotes: [
      {
        title: 'Contiguous RAM Layout',
        note: 'Elements stored in adjacent memory addresses (Base Address + i * sizeof(Type)).',
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'
      }
    ],
    videoLinks: [
      {
        title: 'MIT 6.006: Dynamic Arrays & Amortization',
        url: 'https://www.youtube.com/watch?v=2SgT6tQZt_Q',
        duration: '14 min'
      }
    ]
  },
  {
    id: 'ds-mod1-top2',
    module: 'Module 1: Linear Data Structures',
    title: 'Singly & Doubly Linked Lists',
    titleHindi: 'सिंगली और डबली लिंक्ड लिस्ट',
    titleKannada: 'ಲಿಂಕ್ಡ್ ಲಿಸ್ಟ್‌ಗಳು',
    description: 'Dynamic pointer chaining, head/tail insertion, fast splice operations, and traversal.',
    prerequisites: ['Arrays & Dynamic Contiguous Memory'],
    isUnlocked: true,
    masteryScore: 78,
    diagramNotes: [
      {
        title: 'Pointer Node Architecture',
        note: 'Node = [ Data | *Next Pointer ]. Doubly linked list includes [ *Prev | Data | *Next ].',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
      }
    ],
    videoLinks: [
      {
        title: 'Visualizing Linked List Pointer Manipulation',
        url: 'https://www.youtube.com/watch?v=njTh_OwMljA',
        duration: '18 min'
      }
    ]
  },
  {
    id: 'ds-mod1-top3',
    module: 'Module 1: Linear Data Structures',
    title: 'Stacks (LIFO) & Queues (FIFO)',
    titleHindi: 'स्टैक और कतार (Stacks & Queues)',
    titleKannada: 'ಸ್ಟ್ಯಾಕ್‌ಗಳು ಮತ್ತು ಕ್ಯೂಗಳು',
    description: 'Call stack execution, expression evaluation, BFS queue buffers, and circular buffers.',
    prerequisites: ['Singly & Doubly Linked Lists'],
    isUnlocked: true,
    masteryScore: 68,
    diagramNotes: [
      {
        title: 'LIFO Plate Stack vs FIFO Queue Pipeline',
        note: 'Stack Push/Pop occurs at top pointer. Queue Enqueue at Rear, Dequeue at Front.',
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80'
      }
    ],
    videoLinks: [
      {
        title: 'Stacks & Queues in System Kernel Design',
        url: 'https://www.youtube.com/watch?v=wjI1WNcIntg',
        duration: '12 min'
      }
    ]
  },

  // Module 2: Non-Linear & Graph Structures
  {
    id: 'ds-mod2-top1',
    module: 'Module 2: Trees & Hierarchical Graphs',
    title: 'Binary Search Trees (BST) & AVL Balancing',
    titleHindi: 'बाइनरी सर्च ट्री और एवीएल रोटेशन',
    titleKannada: 'ಬೈನರಿ ಸರ್ಚ್ ಟ್ರೀ (BST)',
    description: 'Left < Root < Right invariant, in-order sorted traversal, and height-balancing rotations.',
    prerequisites: ['Stacks (LIFO) & Queues (FIFO)'],
    isUnlocked: true,
    masteryScore: 62,
    diagramNotes: [
      {
        title: 'AVL Tree LL/RR/LR Rotations',
        note: 'Balance Factor = Height(Left) - Height(Right) in range {-1, 0, 1}.',
        imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80'
      }
    ],
    videoLinks: [
      {
        title: 'Binary Search Tree Rotations Visualized',
        url: 'https://www.youtube.com/watch?v=vRwi_UCVr20',
        duration: '22 min'
      }
    ]
  },
  {
    id: 'ds-mod2-top2',
    module: 'Module 2: Trees & Hierarchical Graphs',
    title: 'Graph Traversal (BFS & DFS) & DAG Topo Sort',
    titleHindi: 'ग्राफ ट्रैवर्सल और टोपोलॉजिकल सॉर्ट',
    titleKannada: 'ಗ್ರಾಫ್ ಟ್ರಾವರ್ಸಲ್ ಮತ್ತು DAG',
    description: 'Adjacency matrices, shortest path algorithms, cycle detection, and dependency ordering.',
    prerequisites: ['Binary Search Trees (BST) & AVL Balancing'],
    isUnlocked: false,
    masteryScore: 45,
    diagramNotes: [
      {
        title: 'Directed Acyclic Graph Dependency Topological Ordering',
        note: 'Kahn algorithm using in-degree vertex array and zero-in-degree queue.',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80'
      }
    ],
    videoLinks: [
      {
        title: 'Graph BFS/DFS & Topological Sort Explained',
        url: 'https://www.youtube.com/watch?v=eL-KzMXSXXI',
        duration: '25 min'
      }
    ]
  },

  // Module 3: Computer Networks & Transport Protocol
  {
    id: 'cn-mod3-top1',
    module: 'Module 3: Transport Layer & TCP Flow',
    title: 'TCP 3-Way Handshake & Sliding Window Flow Control',
    titleHindi: 'टीसीपी हैंडशेक और फ्लो कंट्रोल',
    titleKannada: 'TCP ಹ್ಯಾಂಡ್‌ಶೇಕ್ ಮತ್ತು ಫ್ಲೋ ಕಂಟ್ರೋಲ್',
    description: 'SYN-ACK sequence handshake, receiver buffer advertise window (rwnd), and zero-window probing.',
    prerequisites: ['Arrays & Dynamic Contiguous Memory'],
    isUnlocked: true,
    masteryScore: 74,
    diagramNotes: [
      {
        title: 'TCP Sliding Window Buffer Diagram',
        note: 'Sender window = min(cwnd, rwnd). Advertised rwnd prevents receiver buffer overflow.',
        imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80'
      }
    ],
    videoLinks: [
      {
        title: 'TCP Sliding Window and Flow Control Animation',
        url: 'https://www.youtube.com/watch?v=1F_Uu_rZ7-s',
        duration: '15 min'
      }
    ]
  },
  {
    id: 'cn-mod3-top2',
    module: 'Module 3: Transport Layer & TCP Flow',
    title: 'TCP Slow Start & Congestion Avoidance (AIMD)',
    titleHindi: 'स्लो स्टार्ट और कंजेक्शन कंट्रोल (AIMD)',
    titleKannada: 'ಸ್ಲೋ ಸ್ಟಾರ್ಟ್ ಮತ್ತು ದಟ್ಟಣೆ ನಿಯಂತ್ರಣ',
    description: 'Exponential window doubling during Slow Start, ssthresh threshold transition, and AIMD linear increase.',
    prerequisites: ['TCP 3-Way Handshake & Sliding Window Flow Control'],
    isUnlocked: true,
    masteryScore: 52,
    diagramNotes: [
      {
        title: 'AIMD Sawtooth Congestion Curve',
        note: 'Slow Start: cwnd doubles every RTT. Congestion Avoidance: cwnd += 1 MSS per RTT. Loss: cwnd halved (MD).',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
      }
    ],
    videoLinks: [
      {
        title: 'Stanford CS144: TCP Congestion Control & Slow Start',
        url: 'https://www.youtube.com/watch?v=AQ4b0x7P69s',
        duration: '20 min'
      }
    ]
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Photosynthesis: The Plant Food Factory (40m Core)',
    topicId: 'ds-mod1-top1',
    module: 'NCERT Grade 7 Science',
    date: '2026-10-12',
    time: '10:00 AM - 10:45 AM',
    type: 'lesson',
    status: 'scheduled',
    objectives: [
      'Understand balanced photosynthesis equation 6CO2 + 6H2O -> C6H12O6 + 6O2',
      'Learn stomata guard cell gas regulation',
      'Perform Iodine starch test analysis'
    ],
    prerequisites: ['Plant Cell Structure Basics', 'Root Water Absorption'],
    prerequisiteCompleted: true,
    resources: [
      {
        title: 'Chloroplast & Stomata Diagram Notes',
        type: 'diagram',
        url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600',
        notes: 'Review leaf epidermal cross section and guard cell turgidity.'
      },
      {
        title: 'BBC Bitesize: Photosynthesis Molecular Mechanics',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=LE2Xl5P4w3E',
        notes: 'Watch 8-minute animation on photon excitation.'
      }
    ]
  },
  {
    id: 'evt-2',
    title: 'TCP Flow Control & Sliding Window Buffers',
    topicId: 'cn-mod3-top1',
    module: 'Module 3: Transport Layer & TCP Flow',
    date: '2026-10-14',
    time: '11:30 AM - 12:15 PM',
    type: 'lesson',
    status: 'scheduled',
    objectives: [
      'Receiver window rwnd management and advertised window updates',
      'Prevent receiver buffer overflow with zero-window probes'
    ],
    prerequisites: ['TCP Handshake & Sockets'],
    prerequisiteCompleted: true,
    resources: [
      {
        title: 'Water Pipe Reservoir Analogy Diagram',
        type: 'diagram',
        url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600',
        notes: 'Buffer capacity modeled as physical tank reservoir with outflow valve.'
      }
    ]
  },
  {
    id: 'evt-3',
    title: '🎯 Targeted Intervention: Rahul Sharma & Slow Start Reassessment',
    topicId: 'cn-mod3-top2',
    module: 'Module 3: Transport Layer & TCP Flow',
    date: '2026-10-15',
    time: '02:00 PM - 02:30 PM',
    type: 'intervention',
    status: 'scheduled',
    assignedStudents: ['Rahul Sharma', 'Aarav Sharma', 'Prajwal Gowda'],
    objectives: [
      'Resolve confusion between linear increase (+1) and exponential doubling (*2)',
      'Step-by-step cwnd calculation practice with 3 diagnostic questions'
    ],
    prerequisites: ['TCP 3-Way Handshake & Sliding Window Flow Control'],
    prerequisiteCompleted: true,
    resources: [
      {
        title: 'RTT Doubling Step-by-Step Worksheet',
        type: 'notes',
        url: '#',
        notes: 'Teacher prescribed 15-minute diagnostic calculation drill.'
      }
    ],
    replanNotes: 'Intervention scheduled by teacher from GNN Risk Analytics.'
  },
  {
    id: 'evt-4',
    title: 'Binary Search Trees (BST) & Tree Traversal Lab',
    topicId: 'ds-mod2-top1',
    module: 'Module 2: Trees & Hierarchical Graphs',
    date: '2026-10-19',
    time: '09:00 AM - 10:00 AM',
    type: 'lesson',
    status: 'scheduled',
    objectives: [
      'In-order, Pre-order, and Post-order recursive traversals',
      'BST search, insertion, and deletion complexity O(log N)'
    ],
    prerequisites: ['Stacks (LIFO) & Queues (FIFO)'],
    prerequisiteCompleted: true,
    resources: [
      {
        title: 'BST Traversal Visual Tree Guide',
        type: 'diagram',
        url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600'
      }
    ]
  }
];

export const INITIAL_INTERVENTIONS: StudentIntervention[] = [
  {
    id: 'int-1',
    studentId: 'std-0',
    studentName: 'Rahul Sharma',
    topic: 'TCP Slow Start & Congestion Control',
    concept: 'Exponential cwnd doubling vs Linear AIMD',
    assignedDate: '2026-10-08',
    status: 'assigned',
    reviewNotes: 'Assigned 3-minute physical reservoir analogy review. Please proceed to reassessment to verify exponential window calculation mastery.'
  },
  {
    id: 'int-2',
    studentId: 'std-1',
    studentName: 'Aarav Sharma',
    topic: 'Photosynthesis Chemical Equation Balancing',
    concept: 'Stomata Gas Exchange & Stoichiometry',
    assignedDate: '2026-10-08',
    status: 'assigned',
    reviewNotes: 'Assigned "Plant Kitchen" bilingual Hindi recipe review before next formative test.'
  }
];

export const INITIAL_ASSESSMENTS: StudentAssessmentRecord[] = [
  {
    id: 'asmt-1',
    studentId: 'std-0',
    studentName: 'Rahul Sharma',
    topic: 'TCP 3-Way Handshake & Port Sockets',
    date: '2026-10-01',
    score: 9,
    maxScore: 10,
    masteryPercentage: 91,
    feedback: 'Excellent foundational grasp of SYN, SYN-ACK, and ACK sequence numbers.',
    mode: 'quiz'
  },
  {
    id: 'asmt-2',
    studentId: 'std-0',
    studentName: 'Rahul Sharma',
    topic: 'TCP Flow Control & Sliding Windows',
    date: '2026-10-04',
    score: 7,
    maxScore: 10,
    masteryPercentage: 72,
    feedback: 'Good understanding of rwnd; minor slip on zero-window probe timeout.',
    mode: 'visual'
  },
  {
    id: 'asmt-3',
    studentId: 'std-0',
    studentName: 'Rahul Sharma',
    topic: 'TCP Slow Start & Congestion Control',
    date: '2026-10-07',
    score: 4,
    maxScore: 10,
    masteryPercentage: 48,
    feedback: 'Struggled with cwnd exponential doubling when ACKs return. Intervention assigned.',
    mode: 'quiz'
  }
];

type ChangeListener = () => void;

class SharedStateManager {
  private listeners: Set<ChangeListener> = new Set();

  constructor() {
    this.initDatabase();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('mindmesh_')) {
          this.notifyListeners();
        }
      });
    }
  }

  private initDatabase() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_CURRICULUM_KEY)) {
      localStorage.setItem(STORAGE_CURRICULUM_KEY, JSON.stringify(INITIAL_CURRICULUM_MODULES));
    }
    if (!localStorage.getItem(STORAGE_CALENDAR_KEY)) {
      localStorage.setItem(STORAGE_CALENDAR_KEY, JSON.stringify(INITIAL_CALENDAR_EVENTS));
    }
    if (!localStorage.getItem(STORAGE_STUDENTS_KEY)) {
      localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
    }
    if (!localStorage.getItem(STORAGE_INTERVENTIONS_KEY)) {
      localStorage.setItem(STORAGE_INTERVENTIONS_KEY, JSON.stringify(INITIAL_INTERVENTIONS));
    }
    if (!localStorage.getItem(STORAGE_ASSESSMENTS_KEY)) {
      localStorage.setItem(STORAGE_ASSESSMENTS_KEY, JSON.stringify(INITIAL_ASSESSMENTS));
    }
    if (!localStorage.getItem(STORAGE_DOCUMENTS_KEY)) {
      localStorage.setItem(STORAGE_DOCUMENTS_KEY, JSON.stringify(INITIAL_DOCUMENTS));
    }
    if (!localStorage.getItem(STORAGE_LESSON_KEY)) {
      localStorage.setItem(STORAGE_LESSON_KEY, JSON.stringify(DEFAULT_OPEN_SOURCE_AI_LESSON_40MIN));
    }
  }

  public subscribe(listener: ChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error('Shared state subscriber error:', err);
      }
    });
  }

  // --- 1. CURRICULUM TOPICS ---
  public getCurriculum(): CurriculumTopic[] {
    if (typeof window === 'undefined') return INITIAL_CURRICULUM_MODULES;
    const data = localStorage.getItem(STORAGE_CURRICULUM_KEY);
    return data ? JSON.parse(data) : INITIAL_CURRICULUM_MODULES;
  }

  public saveCurriculum(topics: CurriculumTopic[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_CURRICULUM_KEY, JSON.stringify(topics));
    this.notifyListeners();
  }

  public attachDiagramNote(topicId: string, note: { title: string; note: string; imageUrl?: string }) {
    const topics = this.getCurriculum();
    const updated = topics.map((t) => {
      if (t.id === topicId) {
        return {
          ...t,
          diagramNotes: [...(t.diagramNotes || []), note]
        };
      }
      return t;
    });
    this.saveCurriculum(updated);
  }

  public attachVideoLink(topicId: string, video: { title: string; url: string; duration?: string }) {
    const topics = this.getCurriculum();
    const updated = topics.map((t) => {
      if (t.id === topicId) {
        return {
          ...t,
          videoLinks: [...(t.videoLinks || []), video]
        };
      }
      return t;
    });
    this.saveCurriculum(updated);
  }

  public getCurriculumTopics(): CurriculumTopic[] {
    return this.getCurriculum();
  }

  public unlockTopic(topicId: string) {
    const topics = this.getCurriculum();
    const updated = topics.map((t) => (t.id === topicId ? { ...t, isUnlocked: true } : t));
    this.saveCurriculum(updated);
  }

  /**
   * Workflow Item 4: Approval publishes the lesson and adds its topic to the student path.
   */
  public publishLesson(title: string, moduleName: string = 'Curriculum Standards', prerequisites: string[] = []) {
    const topics = this.getCurriculum();
    const existing = topics.find((t) => t.title.toLowerCase() === title.toLowerCase());

    if (existing) {
      this.unlockTopic(existing.id);
    } else {
      const newTopic: CurriculumTopic = {
        id: `topic-${Date.now()}`,
        module: moduleName,
        title,
        description: `Approved lesson on ${title} with validated curriculum grounding and Socratic scaffolds.`,
        prerequisites: prerequisites.length > 0 ? prerequisites : ['Foundational Concepts'],
        isUnlocked: true,
        masteryScore: 85,
        diagramNotes: [
          {
            title: 'Lesson Architecture & Concept Schematics',
            note: 'Approved by teacher for student learning path.',
            imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600'
          }
        ]
      };
      this.saveCurriculum([newTopic, ...topics]);
    }
  }

  // --- 2. CALENDAR EVENTS ---
  public getCalendarEvents(): CalendarEvent[] {
    if (typeof window === 'undefined') return INITIAL_CALENDAR_EVENTS;
    try {
      const data = localStorage.getItem(STORAGE_CALENDAR_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return INITIAL_CALENDAR_EVENTS;
  }

  public saveCalendarEvents(events: CalendarEvent[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_CALENDAR_KEY, JSON.stringify(events));
    this.notifyListeners();
  }

  public setCalendarEvents(events: CalendarEvent[]) {
    this.saveCalendarEvents(events);
  }

  public scheduleEvent(eventData: Omit<CalendarEvent, 'id'>): CalendarEvent {
    const events = this.getCalendarEvents();
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `evt-${Date.now()}`
    };
    events.push(newEvent);
    this.saveCalendarEvents(events);
    return newEvent;
  }

  public updateEventStatus(eventId: string, status: 'scheduled' | 'in_progress' | 'completed') {
    const events = this.getCalendarEvents();
    const updated = events.map((e) => (e.id === eventId ? { ...e, status } : e));
    this.saveCalendarEvents(updated);
  }

  // --- 3. STUDENTS & ASSESSMENT MARKS ---
  public getStudents(): Student[] {
    if (typeof window === 'undefined') return INITIAL_STUDENTS;
    const data = localStorage.getItem(STORAGE_STUDENTS_KEY);
    return data ? JSON.parse(data) : INITIAL_STUDENTS;
  }

  public saveStudents(students: Student[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(students));
    this.notifyListeners();
  }

  /**
   * Teachers edit or add assessment marks for a student.
   * Updates:
   * - Recent scores list
   * - Concept mastery breakdown
   * - Learning twin trajectory
   * - Recalculates risk score & GNN prediction
   * - Unlocks the next eligible topic when mastery reaches >= 70%
   */
  public updateStudentMarks(
    studentId: string,
    conceptName: string,
    score: number,
    maxScore: number = 10,
    quizTitle?: string
  ) {
    const students = this.getStudents();
    const percentage = Math.round((score / maxScore) * 100);

    const updatedStudents = students.map((s) => {
      if (s.id === studentId) {
        const newScores = [
          ...(s.recentScores || []),
          {
            quizName: quizTitle || `${conceptName} Check`,
            score,
            maxScore,
            date: new Date().toISOString().split('T')[0]
          }
        ];

        // Recalculate average performance & risk
        const avgScore = newScores.reduce((acc, cur) => acc + (cur.score / cur.maxScore) * 100, 0) / newScores.length;
        const newRisk = Math.max(8, Math.min(95, Math.round(100 - avgScore)));

        // Update Learning Twin concept breakdown
        const updatedTwin = s.learningTwin
          ? {
              ...s.learningTwin,
              conceptBreakdown: s.learningTwin.conceptBreakdown.map((c) => {
                if (c.conceptName.toLowerCase().includes(conceptName.toLowerCase()) || conceptName.toLowerCase().includes(c.conceptName.toLowerCase())) {
                  const updatedPct = Math.min(100, Math.max(0, percentage));
                  return {
                    ...c,
                    masteryPercentage: updatedPct,
                    status: updatedPct >= 75 ? ('mastered' as const) : updatedPct >= 60 ? ('moderate' as const) : ('struggling' as const),
                    trend: updatedPct >= c.masteryPercentage ? ('improving' as const) : ('declining' as const)
                  };
                }
                return c;
              }),
              learningTrajectory: [
                ...s.learningTwin.learningTrajectory,
                {
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  concept: conceptName,
                  deltaScore: percentage,
                  action: `Marks Edited by Teacher (${score}/${maxScore})`
                }
              ]
            }
          : undefined;

        const updatedWeak = percentage >= 70 
          ? s.weakConcepts.filter(w => !w.toLowerCase().includes(conceptName.toLowerCase()))
          : (s.weakConcepts.includes(conceptName) ? s.weakConcepts : [...s.weakConcepts, conceptName]);

        const updatedMastered = percentage >= 70 && !s.masteredConcepts.includes(conceptName)
          ? [...s.masteredConcepts, conceptName]
          : s.masteredConcepts;

        return {
          ...s,
          riskScore: newRisk,
          riskReason: percentage >= 70 ? 'Performance updated: Mastery reached above proficiency threshold.' : s.riskReason,
          weakConcepts: updatedWeak,
          masteredConcepts: updatedMastered,
          recentScores: newScores,
          learningTwin: updatedTwin
        };
      }
      return s;
    });

    this.saveStudents(updatedStudents);

    // Record in global Assessment ledger
    const targetStudent = students.find((s) => s.id === studentId);
    this.recordAssessment({
      id: `asmt-${Date.now()}`,
      studentId,
      studentName: targetStudent ? targetStudent.name : 'Student',
      topic: conceptName,
      date: new Date().toISOString().split('T')[0],
      score,
      maxScore,
      masteryPercentage: percentage,
      feedback: percentage >= 75 ? 'Proficient mastery achieved! Next topic unlocked in curriculum path.' : 'Needs targeted revision.',
      mode: 'quiz'
    });

    // Check if mastery unlocks next curriculum topic
    if (percentage >= 70) {
      const curriculum = this.getCurriculum();
      const nextLocked = curriculum.find((t) => !t.isUnlocked);
      if (nextLocked) {
        this.unlockTopic(nextLocked.id);
      }
    }
  }

  // --- 4. INTERVENTIONS ---
  public getInterventions(): StudentIntervention[] {
    if (typeof window === 'undefined') return INITIAL_INTERVENTIONS;
    const data = localStorage.getItem(STORAGE_INTERVENTIONS_KEY);
    return data ? JSON.parse(data) : INITIAL_INTERVENTIONS;
  }

  public saveInterventions(interventions: StudentIntervention[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_INTERVENTIONS_KEY, JSON.stringify(interventions));
    this.notifyListeners();
  }

  public scheduleIntervention(
    studentId: string,
    studentName: string,
    topic: string,
    concept: string,
    reviewNotes: string
  ): StudentIntervention {
    const interventions = this.getInterventions();
    const newInt: StudentIntervention = {
      id: `int-${Date.now()}`,
      studentId,
      studentName,
      topic,
      concept,
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'assigned',
      reviewNotes
    };
    interventions.unshift(newInt);
    this.saveInterventions(interventions);

    // Also add to Shared Calendar
    this.scheduleEvent({
      title: `🎯 Intervention: ${studentName} (${concept})`,
      topicId: 'cn-mod3-top2',
      module: topic,
      date: new Date().toISOString().split('T')[0],
      time: '03:00 PM - 03:30 PM',
      type: 'intervention',
      status: 'scheduled',
      assignedStudents: [studentName],
      objectives: [`Remedial review on ${concept}`, 'Pass 3-question diagnostic reassessment'],
      prerequisites: [topic],
      prerequisiteCompleted: true,
      resources: [
        {
          title: 'Teacher Remedial Review Notes',
          type: 'notes',
          url: '#',
          notes: reviewNotes
        }
      ],
      replanNotes: reviewNotes
    });

    return newInt;
  }

  public completeIntervention(interventionId: string, reassessmentScore: number) {
    const interventions = this.getInterventions();
    const updated = interventions.map((item) => {
      if (item.id === interventionId) {
        return {
          ...item,
          status: 'reassessed' as const,
          reassessmentScore
        };
      }
      return item;
    });
    this.saveInterventions(updated);
  }

  // --- 5. ASSESSMENTS HISTORY ---
  public getAssessments(): StudentAssessmentRecord[] {
    if (typeof window === 'undefined') return INITIAL_ASSESSMENTS;
    const data = localStorage.getItem(STORAGE_ASSESSMENTS_KEY);
    return data ? JSON.parse(data) : INITIAL_ASSESSMENTS;
  }

  public recordAssessment(record: StudentAssessmentRecord) {
    if (typeof window === 'undefined') return;
    const assessments = this.getAssessments();
    assessments.unshift(record);
    localStorage.setItem(STORAGE_ASSESSMENTS_KEY, JSON.stringify(assessments));
    this.notifyListeners();
  }

  // --- 6. DOCUMENTS & KNOWLEDGE BASE ---
  public getDocuments(): DocumentSource[] {
    if (typeof window === 'undefined') return INITIAL_DOCUMENTS;
    try {
      const data = localStorage.getItem(STORAGE_DOCUMENTS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_DOCUMENTS;
  }

  public saveDocuments(docs: DocumentSource[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_DOCUMENTS_KEY, JSON.stringify(docs));
    this.notifyListeners();
  }

  public addDocument(doc: DocumentSource): DocumentSource[] {
    const current = this.getDocuments();
    const updated = [doc, ...current.filter(d => d.id !== doc.id)];
    this.saveDocuments(updated);
    return updated;
  }

  // --- 7. LESSON PLAN ---
  public getLessonPlan(): LessonPlan {
    if (typeof window === 'undefined') return DEFAULT_OPEN_SOURCE_AI_LESSON_40MIN;
    try {
      const data = localStorage.getItem(STORAGE_LESSON_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && parsed.topic && parsed.standardLesson && parsed.beginnerExplanation && parsed.formativeQuiz) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_OPEN_SOURCE_AI_LESSON_40MIN;
  }

  public saveLessonPlan(plan: LessonPlan) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_LESSON_KEY, JSON.stringify(plan));
    this.notifyListeners();
  }

  // --- 8. CLASSROOM CODE & PORTAL INTEGRATION ---
  public generateRandomCode(): string {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const prefix = 'MM';
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const randLetter = letters.charAt(Math.floor(Math.random() * letters.length));
    return `${prefix}-${randNum}${randLetter}`;
  }

  public getClassroomCode(): string {
    if (typeof window === 'undefined') return 'MM-7842A';
    let code = localStorage.getItem(STORAGE_CLASSROOM_CODE_KEY);
    if (!code) {
      code = this.generateRandomCode();
      localStorage.setItem(STORAGE_CLASSROOM_CODE_KEY, code);
    }
    return code;
  }

  public generateNewClassroomCode(): string {
    const newCode = this.generateRandomCode();
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_CLASSROOM_CODE_KEY, newCode);
      // Reset connected students when teacher regenerates code
      localStorage.setItem(STORAGE_CONNECTED_STUDENTS_KEY, JSON.stringify([]));
      this.notifyListeners();
    }
    return newCode;
  }

  public getStudentJoinedCode(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(STORAGE_STUDENT_CODE_KEY) || '';
  }

  public isStudentConnected(): boolean {
    const teacherCode = this.getClassroomCode().trim().toUpperCase();
    const studentCode = this.getStudentJoinedCode().trim().toUpperCase();
    return Boolean(studentCode && studentCode === teacherCode);
  }

  public connectStudentToClassroom(inputCode: string, studentName: string = 'Active Student'): { success: boolean; message: string } {
    if (typeof window === 'undefined') return { success: false, message: 'Browser storage unavailable' };
    const teacherCode = this.getClassroomCode().trim().toUpperCase();
    const normalizedInput = inputCode.trim().toUpperCase();

    if (!normalizedInput) {
      return { success: false, message: 'Please enter a valid classroom code.' };
    }

    if (normalizedInput !== teacherCode) {
      return { 
        success: false, 
        message: `Incorrect code "${normalizedInput}". Please enter the active code shown on your teacher's dashboard (${teacherCode}).` 
      };
    }

    localStorage.setItem(STORAGE_STUDENT_CODE_KEY, normalizedInput);

    // Track connected students list
    const currentList = this.getConnectedStudents();
    if (!currentList.includes(studentName)) {
      currentList.push(studentName);
      localStorage.setItem(STORAGE_CONNECTED_STUDENTS_KEY, JSON.stringify(currentList));
    }

    this.notifyListeners();
    return { 
      success: true, 
      message: `Connected successfully to Classroom ${teacherCode}! All teacher calendar schedules and lesson updates are now synchronized in real-time.` 
    };
  }

  public disconnectStudent(studentName: string = 'Active Student') {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_STUDENT_CODE_KEY);

    const currentList = this.getConnectedStudents().filter(s => s !== studentName);
    localStorage.setItem(STORAGE_CONNECTED_STUDENTS_KEY, JSON.stringify(currentList));

    this.notifyListeners();
  }

  public getConnectedStudents(): string[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_CONNECTED_STUDENTS_KEY);
    return data ? JSON.parse(data) : [];
  }
}

export const sharedState = new SharedStateManager();
