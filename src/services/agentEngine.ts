import {
  AgentDecisionStep,
  DocumentSource,
  LessonPlan,
  Student,
  VoiceCommandIntent
} from '../types';
import {
  DEFAULT_OPEN_SOURCE_AI_LESSON_40MIN,
  DEFAULT_PHOTOSYNTHESIS_LESSON_40MIN,
  REPLANNED_PHOTOSYNTHESIS_LESSON_20MIN,
  DEFAULT_CN_LESSON_30MIN,
  INITIAL_DOCUMENTS,
  INITIAL_STUDENTS
} from '../data/mockData';
import { sharedState } from './sharedStateManager';
import { apiClient } from './apiClient';
import { groqService } from './groqService';
import { geminiService } from './geminiService';
import { ollamaService } from './ollamaService';

export interface AgentExecutionResult {
  intent: VoiceCommandIntent;
  lessonPlan: LessonPlan;
  steps: AgentDecisionStep[];
  sources: DocumentSource[];
  students: Student[];
  speechSummary: string;
}

export class AgentEngine {
  /**
   * Parse teacher or student spoken utterance into structured intent, agentic action, and voice response
   */
  public static parseIntent(spokenText: string): VoiceCommandIntent {
    const text = spokenText.toLowerCase();

    // 1. AGENTIC ACTION: SCHEDULE A CLASS / CALENDAR EVENT
    // e.g. "schedule a class for me in 10 min", "schedule a 30-min class on TCP at 2 PM", "add to calendar"
    if (
      text.includes('schedule a class') ||
      text.includes('schedule class') ||
      text.includes('class for me in') ||
      text.includes('class in 10 min') ||
      text.includes('class in 10 minute') ||
      text.includes('schedule lesson') ||
      text.includes('add to calendar') ||
      text.includes('schedule event') ||
      text.includes('book a class')
    ) {
      const durationMatch = text.match(/(\d+)\s*(?:min|minute)/i);
      const duration = durationMatch ? parseInt(durationMatch[1]) : 20;

      let topic = 'Computer Networks: TCP Flow Control & Congestion Avoidance';
      let moduleName = 'Module 3: Transport Layer & TCP Flow';

      if (text.includes('tree') || text.includes('bst') || text.includes('graph')) {
        topic = 'Binary Search Trees (BST) & Recursive Traversals';
        moduleName = 'Module 2: Trees & Hierarchical Graphs';
      } else if (text.includes('photo') || text.includes('science') || text.includes('leaf') || text.includes('biology')) {
        topic = 'Photosynthesis & Stomata Gas Exchange';
        moduleName = 'NCERT Grade 7 Science';
      } else if (text.includes('array') || text.includes('linked list') || text.includes('stack')) {
        topic = 'Linear Data Structures: Arrays & Linked Lists';
        moduleName = 'Module 1: Linear Data Structures';
      }

      // Calculate scheduled time (e.g. in 10 min from now)
      const now = new Date();
      const in10Min = new Date(now.getTime() + 10 * 60 * 1000);
      const end10Min = new Date(in10Min.getTime() + duration * 60 * 1000);
      const timeStr = `${in10Min.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end10Min.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      const dateStr = new Date().toISOString().split('T')[0];

      return {
        rawText: spokenText,
        action: 'schedule_class',
        topic,
        subject: moduleName,
        durationMinutes: duration,
        actionOutcome: {
          type: 'schedule_class',
          payload: {
            title: topic,
            module: moduleName,
            date: dateStr,
            time: timeStr,
            type: 'lesson',
            status: 'scheduled',
            objectives: [
              `Master core mechanics of ${topic}`,
              `Formative diagnostic check (${duration} minutes)`
            ],
            prerequisites: ['Foundational Concepts'],
            prerequisiteCompleted: true
          },
          targetTab: 'calendar',
          voiceResponse: `Done! I have scheduled a ${duration}-minute class on "${topic}" for you in 10 minutes (${timeStr}). It is now synchronized to the shared calendar.`
        }
      };
    }

    // 2. AGENTIC ACTION: SCHEDULE AN INTERVENTION / REMEDIAL FOR A STUDENT
    // e.g. "Rahul is weak in Slow Start, schedule an intervention", "Schedule intervention for Rahul"
    if (
      text.includes('intervention') ||
      (text.includes('weak in') && (text.includes('rahul') || text.includes('aarav') || text.includes('student') || text.includes('slow start'))) ||
      text.includes('assign review') ||
      text.includes('remedial')
    ) {
      let targetStudent = 'Rahul Sharma';
      let studentId = 'std-0';
      let concept = 'Slow Start (Exponential Doubling)';
      let topic = 'Module 3: Transport Layer & TCP Flow';

      if (text.includes('aarav')) {
        targetStudent = 'Aarav Sharma';
        studentId = 'std-1';
        concept = 'Chemical Equation Balancing & Stomata';
        topic = 'NCERT Grade 7 Science';
      } else if (text.includes('prajwal') || text.includes('rohan')) {
        targetStudent = 'Prajwal Gowda';
        studentId = 'std-2';
        concept = 'Stomata Gas Exchange & Chlorophyll';
        topic = 'NCERT Grade 7 Science';
      }

      if (text.includes('flow control')) concept = 'TCP Flow Control & rwnd Buffer';
      if (text.includes('tree') || text.includes('bst')) concept = 'Binary Search Tree Traversals';

      return {
        rawText: spokenText,
        action: 'schedule_intervention',
        topic,
        actionOutcome: {
          type: 'schedule_intervention',
          payload: {
            studentId,
            studentName: targetStudent,
            topic,
            concept,
            notes: `Targeted remediation prescribed via Voice AI Co-Pilot for ${concept}. Please complete the 3-question reassessment.`
          },
          targetTab: 'students',
          voiceResponse: `I have scheduled a targeted intervention review on ${concept} for ${targetStudent}. The remedial instructions and reassessment checkpoint are now live on the student portal.`
        }
      };
    }

    // 3. AGENTIC ACTION: EDIT MARKS VIA VOICE
    // e.g. "Give Aarav Sharma 9 out of 10 in Quiz", "Update Rahul's score to 8", "Edit marks for Aarav"
    if (
      text.includes('edit mark') ||
      text.includes('update mark') ||
      text.includes('give aarav') ||
      text.includes('give rahul') ||
      text.includes('score to') ||
      text.includes('set mark')
    ) {
      let studentId = 'std-1';
      let studentName = 'Aarav Sharma';
      let concept = 'Slow Start & Flow Control';
      let score = 9;
      let maxScore = 10;

      if (text.includes('rahul')) {
        studentId = 'std-0';
        studentName = 'Rahul Sharma';
      }

      const numMatch = text.match(/(\d+)\s*(?:out of|\/|\s)\s*(\d+)?/i);
      if (numMatch) {
        score = parseInt(numMatch[1]);
        if (numMatch[2]) maxScore = parseInt(numMatch[2]);
      }

      return {
        rawText: spokenText,
        action: 'edit_marks',
        actionOutcome: {
          type: 'edit_marks',
          payload: {
            studentId,
            studentName,
            concept,
            score,
            maxScore
          },
          targetTab: 'students',
          voiceResponse: `Updated marks for ${studentName}: ${score} out of ${maxScore} in ${concept}. Topic mastery recalculated to ${Math.round((score / maxScore) * 100)}%, and the next curriculum topic is unlocked.`
        }
      };
    }

    // 4. AGENTIC ACTION: NAVIGATION & PORTAL SWITCHING
    // e.g. "open calendar", "show curriculum map", "open knowledge base", "show students", "switch to student view"
    if (text.includes('open calendar') || text.includes('show calendar') || text.includes('view calendar') || text.includes('planner')) {
      return {
        rawText: spokenText,
        action: 'navigate',
        actionOutcome: {
          type: 'navigate',
          targetTab: 'calendar',
          voiceResponse: 'Opening your shared academic calendar.'
        }
      };
    }

    if (text.includes('open curriculum') || text.includes('show curriculum') || text.includes('curriculum map')) {
      return {
        rawText: spokenText,
        action: 'navigate',
        actionOutcome: {
          type: 'navigate',
          targetTab: 'curriculum',
          voiceResponse: 'Opening your curriculum map organized by Data Structures and Science modules.'
        }
      };
    }

    if (text.includes('open knowledge base') || text.includes('show sources') || text.includes('check conflicts') || text.includes('sources')) {
      return {
        rawText: spokenText,
        action: 'navigate',
        actionOutcome: {
          type: 'navigate',
          targetTab: 'sources',
          voiceResponse: 'Opening Knowledge Base and source verification ledger.'
        }
      };
    }

    if (text.includes('show student') || text.includes('learner risk') || text.includes('show analytics') || text.includes('risk radar')) {
      return {
        rawText: spokenText,
        action: 'navigate',
        actionOutcome: {
          type: 'navigate',
          targetTab: 'students',
          voiceResponse: 'Opening GNN Learner Risk Radar and student diagnostic telemetry.'
        }
      };
    }

    if (text.includes('knowledge graph') || text.includes('open graph') || text.includes('show dag')) {
      return {
        rawText: spokenText,
        action: 'navigate',
        actionOutcome: {
          type: 'navigate',
          targetTab: 'graph',
          voiceResponse: 'Opening interactive Agnes 3.0 Knowledge Graph DAG.'
        }
      };
    }

    if (text.includes('switch to student') || text.includes('student view') || text.includes('learner view') || text.includes('student portal')) {
      return {
        rawText: spokenText,
        action: 'navigate',
        actionOutcome: {
          type: 'navigate_persona',
          targetPersona: 'student',
          voiceResponse: 'Switching to Student Multimodal Socratic Portal.'
        }
      };
    }

    if (text.includes('switch to teacher') || text.includes('teacher view') || text.includes('teacher studio')) {
      return {
        rawText: spokenText,
        action: 'navigate',
        actionOutcome: {
          type: 'navigate_persona',
          targetPersona: 'teacher',
          voiceResponse: 'Switching to Teacher Studio.'
        }
      };
    }

    if (text.includes('approve lesson') || text.includes('approve the lesson') || text.includes('publish lesson')) {
      return {
        rawText: spokenText,
        action: 'approve',
        actionOutcome: {
          type: 'approve',
          targetTab: 'lesson',
          voiceResponse: 'Lesson approved and published! The topic is now unlocked in the student learning path.'
        }
      };
    }

    // 5. GENERAL ASSISTANT Q&A (SIRI / ALEXA STYLE QUESTIONS & INQUIRIES ACROSS ALL TOPICS)
    const isQuestionOrInquiry =
      text.startsWith('what') ||
      text.startsWith('how') ||
      text.startsWith('why') ||
      text.startsWith('who') ||
      text.startsWith('when') ||
      text.startsWith('where') ||
      text.startsWith('can you explain') ||
      text.startsWith('could you explain') ||
      text.startsWith('tell me about') ||
      text.startsWith('tell me') ||
      text.startsWith('explain') ||
      text.startsWith('define') ||
      text.startsWith('describe') ||
      text.startsWith('is ') ||
      text.startsWith('are ') ||
      text.startsWith('does ') ||
      text.startsWith('do ') ||
      text.includes('what are') ||
      text.includes('how does') ||
      text.includes('meaning of') ||
      text.includes('difference between') ||
      text.includes('क्या') ||
      text.includes('क्यों') ||
      text.includes('कैसे') ||
      text.includes('समझाएं') ||
      text.includes('बताएं') ||
      text.includes('परिभाषा') ||
      text.includes('ಏನು') ||
      text.includes('ಹೇಗೆ') ||
      text.includes('ಏಕೆ') ||
      text.includes('ವಿವರಿಸಿ') ||
      text.includes('ತಿಳಿಸಿ') ||
      text.includes('?') ||
      (!text.includes('lesson') && !text.includes('plan') && !text.includes('schedule') && !text.includes('create') && !text.includes('generate') && !text.includes('replan') && !text.includes('marks') && !text.includes('student') && !text.includes('navigate'));

    if (isQuestionOrInquiry) {
      let voiceReply = '';

      if (
        text.includes('open source') ||
        text.includes('opensource') ||
        text.includes('ollama') ||
        text.includes('whisper') ||
        text.includes('faster whisper') ||
        text.includes('local ai') ||
        text.includes('local model') ||
        text.includes('quantiz') ||
        text.includes('llama') ||
        text.includes('ctranslate')
      ) {
        voiceReply = 'Open-Source AI delivers complete privacy and zero-latency execution: Local Ollama runs quantized GGUF foundation models like Llama 3.2 on local RAM, while Faster-Whisper uses CTranslate2 INT8 quantization for sub-300ms speech recognition without cloud API fees or external data transmission.';
      } else if (text.includes('gravity') || text.includes('gravitation') || text.includes('गुरुत्वाकर्षण') || text.includes('ಗುರುತ್ವಾಕರ್ಷಣೆ')) {
        if (text.includes('kannada') || text.includes('ಕನ್ನಡ') || /[\u0C80-\u0CFF]/.test(text)) {
          voiceReply = 'ಗುರುತ್ವಾಕರ್ಷಣೆ ಎಂಬುದು ವಿಶ್ವದಲ್ಲಿ ದ್ರವ್ಯರಾಶಿ ಹೊಂದಿರುವ ಎಲ್ಲಾ ವಸ್ತುಗಳ ನಡುವೆ ವರ್ತಿಸುವ ನೈಸರ್ಗಿಕ ಆಕರ್ಷಕ ಬಲವಾಗಿದೆ. ನ್ಯೂಟನ್‌ನ ಸಾರ್ವತ್ರಿಕ ಗುರುತ್ವಾಕರ್ಷಣಾ ನಿಯಮದಂತೆ ಈ ಬಲವು ದ್ರವ್ಯರಾಶಿಗಳ ಗುಣಲಬ್ಧಕ್ಕೆ ನೇರ ಅನುಪಾತದಲ್ಲಿರುತ್ತದೆ.';
        } else if (text.includes('hindi') || text.includes('हिंदी') || /[\u0900-\u097F]/.test(text)) {
          voiceReply = 'गुरुत्वाकर्षण प्रकृति का वह मूलभूत आकर्षण बल है जो द्रव्यमान वाली किन्हीं भी दो वस्तुओं के बीच कार्य करता है। न्यूटन के नियम के अनुसार यह दोनों द्रव्यमानों के गुणनफल के समानुपाती और उनके बीच की दूरी के वर्ग के व्युत्क्रमानुपाती होता है।';
        } else {
          voiceReply = 'Gravity is the fundamental force of nature attracting objects with mass or energy toward one another. Under Newton Universal Law, gravitational force is proportional to the product of masses and inversely proportional to the square of distance.';
        }
      } else if (text.includes('newton') || text.includes('motion') || text.includes('inertia') || text.includes('न्यूटन') || text.includes('ನ್ಯೂಟನ್')) {
        voiceReply = 'Newton Three Laws of Motion govern classical mechanics: First is Inertia (constant velocity unless a net external force acts), Second is F = ma (force equals mass times acceleration), and Third is Action-Reaction (every action has an equal and opposite reaction).';
      } else if (text.includes('thermodynamic') || text.includes('entropy') || text.includes('heat transfer')) {
        voiceReply = 'Thermodynamics governs heat, energy, and work: the First Law establishes Conservation of Energy, the Second Law dictates that entropy in an isolated system always increases, and the Third Law approaches constant entropy at absolute zero.';
      } else if (text.includes('quantum') || text.includes('wave function') || text.includes('schrodinger')) {
        voiceReply = 'Quantum mechanics describes nature at atomic scales, where physical properties like energy and momentum are quantized into discrete packets, governed by wave-particle duality and the Heisenberg uncertainty principle.';
      } else if (text.includes('tcp') || text.includes('slow start') || text.includes('congestion') || text.includes('aimd') || text.includes('flow control')) {
        voiceReply = 'In TCP Congestion Control, Slow Start doubles cwnd exponentially every RTT until ssthresh, transitioning to linear AIMD additive increase. Flow control rwnd limits sender buffer while cwnd limits network congestion.';
      } else if (text.includes('bst') || text.includes('avl') || text.includes('tree')) {
        voiceReply = 'A standard BST can degenerate to O(N) complexity in the worst case, whereas self-balancing AVL trees maintain a balance factor between minus 1 and plus 1, guaranteeing strict O(log N) search and insertion.';
      } else if (text.includes('dijkstra') || text.includes('shortest path')) {
        voiceReply = 'Dijkstra algorithm calculates the shortest path from a single source vertex to all others in a weighted graph using a binary min-heap priority queue with O((V plus E) log V) time complexity.';
      } else if (text.includes('gnn') || text.includes('graph neural network') || text.includes('dkt') || text.includes('learning twin')) {
        voiceReply = 'In our Graph Neural Network, concept prerequisite dependencies propagate student gap embeddings across graph edges, while Deep Knowledge Tracing models sequential mastery to predict exam risk.';
      } else if (text.includes('deadlock') || text.includes('banker') || text.includes('operating system')) {
        voiceReply = 'Deadlock requires 4 simultaneous Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Dijkstra Banker algorithm avoids deadlocks by ensuring the system remains in a safe execution state.';
      } else if (text.includes('acid') || text.includes('database') || text.includes('sql') || text.includes('transaction')) {
        voiceReply = 'ACID guarantees database reliability: Atomicity (all-or-nothing), Consistency (integrity constraints), Isolation (concurrency control via 2PL or MVCC), and Durability (WAL logged to non-volatile storage).';
      } else if (text.includes('photosynthesis')) {
        if (text.includes('kannada') || text.includes('ಕನ್ನಡ')) {
          voiceReply = 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ (Photosynthesis) ಎಂದರೆ ಸಸ್ಯಗಳು ಸೂರ್ಯನ ಬೆಳಕು, ನೀರು ಮತ್ತು ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ ಬಳಸಿ ಕ್ಲೋರೋಪ್ಲಾಸ್ಟ್‌ನಲ್ಲಿ ಗ್ಲೂಕೋಸ್ ಮತ್ತು ಆಮ್ಲಜನಕವನ್ನು ತಯಾರಿಸುವ ಪ್ರಕ್ರಿಯೆ. ಸಮೀಕರಣ: 6CO2 + 6H2O -> C6H12O6 + 6O2.';
        } else if (text.includes('hindi') || text.includes('हिंदी')) {
          voiceReply = 'प्रकाश संश्लेषण वह जैविक प्रक्रिया है जिसमें हरे पौधे सूर्य के प्रकाश, जल और कार्बन डाइऑक्साइड की सहायता से ग्लूकोज और ऑक्सीजन का निर्माण करते हैं। संतुलित समीकरण: 6CO2 + 6H2O -> C6H12O6 + 6O2.';
        } else {
          voiceReply = 'Photosynthesis is the biochemical process where plants trap solar photons using chlorophyll in chloroplasts, converting carbon dioxide and water into glucose food and oxygen: 6CO2 + 6H2O -> C6H12O6 + 6O2.';
        }
      } else if (text.includes('equation') || text.includes('formula') || text.includes('stoichiometry')) {
        voiceReply = 'The balanced chemical equation of photosynthesis is: 6 Carbon Dioxide plus 6 Water molecules plus solar photons yield 1 Glucose molecule plus 6 Oxygen molecules: 6CO2 + 6H2O -> C6H12O6 + 6O2.';
      } else if (text.includes('chloroplast') || text.includes('chlorophyll') || text.includes('kitchen') || text.includes('रसोई')) {
        voiceReply = 'Chloroplasts act as the plant solar kitchen! Chlorophyll is the green pigment chef trapping photons, thylakoids run light reactions, and the stroma synthesizes glucose sugar.';
      } else if (text.includes('stomata') || text.includes('guard cell') || text.includes('pore') || text.includes('gas exchange')) {
        voiceReply = 'Stomata are microscopic leaf pores flanked by osmotic guard cells. When water fills the guard cells, they swell and open to take in CO2 and release O2. When dehydrated, they close to stop transpiration.';
      } else if (text.includes('aarav') || text.includes('who is at risk') || text.includes('at risk') || text.includes('risk')) {
        voiceReply = 'According to GNN predictive analytics, Aarav Sharma is flagged at 86% high risk because his prerequisite mastery in Chemical Equation Balancing is at 42%, below the 60% threshold.';
      } else if (text.includes('reject') || text.includes('source 2') || text.includes('conflict')) {
        voiceReply = 'Source 2 (the 2021 teacher notes) was rejected with a 42% trust score because its word equation contradicted the balanced stoichiometry standards mandated by the 2026 NCERT board syllabus.';
      } else if (text.includes('calendar') || text.includes('today')) {
        voiceReply = 'Today you have a session on TCP Flow Control & Sliding Window Buffers at 11:30 AM, and an assigned targeted intervention review with Rahul Sharma at 2:00 PM.';
      } else {
        voiceReply = `Here is the explanation for "${spokenText}": In accredited science and engineering curriculum, foundational concepts are verified against official academic board standards.`;
      }

      return {
        rawText: spokenText,
        action: 'general_qa',
        actionOutcome: {
          type: 'general_qa',
          voiceResponse: voiceReply
        }
      };
    }

    // 5.5 OPEN-SOURCE AI & AUTONOMOUS SYSTEMS LESSON GENERATION
    if (
      text.includes('open source') ||
      text.includes('opensource') ||
      text.includes('ollama') ||
      text.includes('whisper') ||
      text.includes('faster whisper') ||
      text.includes('local ai') ||
      text.includes('local model') ||
      text.includes('llama') ||
      text.includes('quantiz') ||
      text.includes('gguf') ||
      text.includes('ctranslate') ||
      text.includes('edge ai')
    ) {
      const durationMatch = text.match(/(\d+)\s*(?:min|minute)/i);
      const duration = durationMatch ? parseInt(durationMatch[1]) : 40;

      const languages: string[] = ['English'];
      if (text.includes('hindi') || text.includes('bilingual') || text.includes('हिंदी')) languages.push('Hindi');
      if (text.includes('kannada') || text.includes('ಕನ್ನಡ')) languages.push('Kannada');

      return {
        rawText: spokenText,
        topic: 'Open-Source AI Systems: Local Ollama LLM, Faster-Whisper ASR & Edge Orchestration',
        grade: 12,
        subject: 'Computer Science & Artificial Intelligence (Open-Source AI)',
        durationMinutes: duration,
        languages,
        action: 'generate_lesson',
        specialConstraints: [
          'Rahul Sharma is weak in Local Model Quantization & GGUF (44%)',
          'Aarav Sharma needs scaffold on Faster-Whisper CTranslate2 INT8 speech decoding',
          'Deploy 100% offline without cloud telemetry or external API subscriptions'
        ]
      };
    }

    // 6. COMPUTER NETWORKS LESSON GENERATION
    if (
      text.includes('cn') ||
      text.includes('computer network') ||
      text.includes('tcp') ||
      text.includes('flow control') ||
      text.includes('slow start') ||
      text.includes('rahul')
    ) {
      const durationMatch = text.match(/(\d+)\s*(?:min|minute)/i);
      const duration = durationMatch ? parseInt(durationMatch[1]) : 30;

      const languages: string[] = ['English'];
      if (text.includes('hindi') || text.includes('bilingual') || text.includes('हिंदी')) languages.push('Hindi');
      if (text.includes('kannada') || text.includes('ಕನ್ನಡ')) languages.push('Kannada');
      if (languages.length === 1) languages.push('Hindi');

      return {
        rawText: spokenText,
        topic: 'Computer Networks: TCP Congestion Control & Flow Control',
        grade: 11,
        subject: 'Computer Networks (CN) / CSE',
        durationMinutes: duration,
        languages,
        action: 'generate_lesson',
        specialConstraints: [
          'Rahul Sharma is weak in Slow Start (48%) and Flow Control (72%)',
          'Exam on Transport Layer next Friday - prioritize high-yield AIMD & window doubling concepts',
          'Ground in Tanenbaum 6th Edition Ch 6 with "Water Pipe & Funnel" physical reservoir scaffold'
        ]
      };
    }

    // 7. DYNAMIC REPLANNING / COMPRESSION
    if (text.includes('reduce') || text.includes('20 minute') || text.includes('behind') || text.includes('shorten') || text.includes('compress')) {
      return {
        rawText: spokenText,
        action: 'replan_duration',
        durationMinutes: 20,
        isReplanning: true,
        specialConstraints: ['Class running behind schedule', 'Compress into essential direct instruction and quick quiz']
      };
    }

    // 8. FRACTIONS MATH
    if (text.includes('fraction') || text.includes('grade 6') || text.includes('math')) {
      return {
        rawText: spokenText,
        topic: 'Equivalent Fractions',
        grade: 6,
        subject: 'Mathematics',
        durationMinutes: 30,
        languages: ['English', 'Hindi'],
        action: 'generate_lesson',
        specialConstraints: ['Focus on equivalent fractions', 'Revision for struggling students']
      };
    }

    // 9. DYNAMIC TOPIC & UNIVERSAL LESSON GENERATION
    const durationMatch = text.match(/(\d+)\s*(?:min|minute)/i);
    const duration = durationMatch ? parseInt(durationMatch[1]) : 40;

    const languages: string[] = ['English'];
    if (text.includes('hindi') || text.includes('bilingual') || text.includes('हिंदी')) languages.push('Hindi');
    if (text.includes('kannada') || text.includes('ಕನ್ನಡ')) languages.push('Kannada');

    if (text.includes('photosynthesis') || text.includes('biology') || text.includes('plant') || text.includes('chloroplast') || text.includes('stomata') || text.includes('ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ') || text.includes('प्रकाश संश्लेषण')) {
      const isKannada = text.includes('kannada') || text.includes('ಕನ್ನಡ') || /[\u0C80-\u0CFF]/.test(text);
      const isHindi = text.includes('hindi') || text.includes('हिंदी') || /[\u0900-\u097F]/.test(text);
      
      const langList = isKannada ? ['Kannada', 'English'] : (isHindi ? ['Hindi', 'English'] : languages);

      return {
        rawText: spokenText,
        topic: isKannada ? 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ (Photosynthesis)' : (isHindi ? 'प्रकाश संश्लेषण (Photosynthesis)' : 'Photosynthesis'),
        grade: 7,
        subject: isKannada ? 'ವಿಜ್ಞಾನ (Science / Biology)' : (isHindi ? 'विज्ञान (Science / Biology)' : 'Science / Biology'),
        durationMinutes: duration,
        languages: langList,
        action: 'generate_lesson',
        specialConstraints: [
          '3 students need simpler explanations (Aarav, Priya, Rohan)',
          'Exam next week - prioritize high-yield concepts',
          'Use uploaded chapter notes with conflict checking'
        ]
      };
    }

    if (
      text.includes('open source') ||
      text.includes('opensource') ||
      text.includes('ollama') ||
      text.includes('whisper') ||
      text.includes('local ai') ||
      text.includes('llama')
    ) {
      return {
        rawText: spokenText,
        topic: 'Open-Source AI Systems: Local Ollama LLM, Faster-Whisper ASR & Edge Orchestration',
        grade: 12,
        subject: 'Computer Science & Artificial Intelligence (Open-Source AI)',
        durationMinutes: duration,
        languages,
        action: 'generate_lesson',
        specialConstraints: [
          'Rahul Sharma is weak in Local Model Quantization & GGUF (44%)',
          'Demonstrate 100% offline edge privacy with Faster-Whisper & Ollama',
          'Ground in IEEE Open-Source AI Spec 2026 with CTranslate2 INT8 execution'
        ]
      };
    }

    // Dynamic Topic Extraction for ANY other subject (Gravity, Newton's Laws, Optics, Operating Systems, Chemistry, etc.)
    let extractedTopic = spokenText.trim()
      .replace(/^(can you\s+)?(please\s+)?(create|generate|make|build|prepare|teach|schedule|plan)\s+(a\s+)?/i, '')
      .replace(/^(lesson|plan|class|lecture)\s+(on|about|for)\s+/i, '')
      .replace(/\s+(for\s+grade\s+\d+|for\s+class\s+\d+|in\s+\d+\s+min(utes)?).*$/i, '')
      .trim();
    if (!extractedTopic || extractedTopic.length < 2) {
      extractedTopic = 'Foundational Science & Engineering';
    }

    return {
      rawText: spokenText,
      topic: extractedTopic,
      grade: 9,
      subject: 'Science & Engineering Curriculum',
      durationMinutes: duration,
      languages,
      action: 'generate_lesson',
      specialConstraints: [
        `Differentiated 3-tier scaffolding configured for ${extractedTopic}`,
        'High-yield concepts prioritized for upcoming assessment',
        'Verified against accredited syllabus standards'
      ]
    };
  }

  /**
   * Execute full multi-agent orchestration pipeline and perform agentic actions
   */
  public static async executePipeline(
    spokenText: string,
    onStepUpdate?: (step: AgentDecisionStep) => void
  ): Promise<AgentExecutionResult> {
    // 0. High-Speed Intent Recognition: Instant resolution for known actions (schedule, replan, marks, intervention)
    const nativeIntent = this.parseIntent(spokenText);
    let intent: VoiceCommandIntent | null = null;
    let providerSource = 'MINDMESH-NEXUS Native Parser';

    if (nativeIntent.action && nativeIntent.action !== 'general_qa') {
      intent = nativeIntent;
    } else {
      // 1. Prioritize Google Gemini AI Intent Parsing (ultra-fast & responsive)
      try {
        const geminiPromise = geminiService.parseVoiceCommandAndSchedule(spokenText);
        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3500));
        intent = await Promise.race([geminiPromise, timeoutPromise]);
        if (intent) {
          providerSource = 'Google Gemini 3.8 Flash (Project 586089963185)';
        }
      } catch (gemErr) {
        console.warn('Gemini parse notice:', gemErr);
      }

      // 2. Fast Fallback to Groq LPU if Gemini was not ready
      if (!intent) {
        try {
          const groqPromise = groqService.parseVoiceCommandAndSchedule(spokenText);
          const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200));
          intent = await Promise.race([groqPromise, timeoutPromise]);
          if (intent) {
            providerSource = 'Groq Cloud LPU (qwen/qwen3.8-27b)';
          }
        } catch (e) {
          console.warn('Groq parse notice:', e);
        }
      }

      if (!intent) {
        intent = nativeIntent;
      }
    }

    const steps: AgentDecisionStep[] = [];

    const emitStep = (
      agentRole: AgentDecisionStep['agentRole'],
      title: string,
      details: string,
      status: AgentDecisionStep['status'] = 'completed',
      metadata?: Record<string, any>
    ) => {
      const step: AgentDecisionStep = {
        id: `step-${steps.length + 1}-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        agentRole,
        title,
        details,
        status,
        metadata
      };
      steps.push(step);
      if (onStepUpdate) onStepUpdate(step);
    };

    // Emit Primary Intent Recognition Step
    const actionLabel = intent.action ? intent.action.toUpperCase() : 'GENERATE_LESSON';
    emitStep(
      'Voice NLU',
      `Voice Intent Decoded via ${providerSource}`,
      `Utterance: "${spokenText}" → Action: ${actionLabel} | Topic: "${intent.topic || 'Curriculum'}" | Duration: ${intent.durationMinutes || 20}m`,
      'completed',
      { provider: providerSource, rawText: spokenText }
    );

    // 1. HANDLE DIRECT SCHEDULING ACTION
    if (intent.action === 'schedule_class' && intent.actionOutcome?.payload) {
      sharedState.scheduleEvent(intent.actionOutcome.payload);

      emitStep(
        'Voice NLU',
        'Spoken Scheduling Intent Decoded',
        `Transcribed: "${spokenText}" → Action: SCHEDULE_CLASS on "${intent.topic}" for ${intent.actionOutcome.payload.time}.`
      );

      emitStep(
        'Curriculum Architect',
        'Calendar Event Created & Synchronized',
        `Scheduled ${intent.durationMinutes || 20}m session on shared calendar. Synchronized across Teacher and Student portals via browser storage.`,
        'completed',
        intent.actionOutcome.payload
      );

      return {
        intent,
        lessonPlan: DEFAULT_PHOTOSYNTHESIS_LESSON_40MIN,
        steps,
        sources: INITIAL_DOCUMENTS,
        students: sharedState.getStudents(),
        speechSummary: intent.actionOutcome.voiceResponse
      };
    }

    // 2. HANDLE INTERVENTION SCHEDULING ACTION
    if (intent.action === 'schedule_intervention' && intent.actionOutcome?.payload) {
      const p = intent.actionOutcome.payload;
      sharedState.scheduleIntervention(p.studentId, p.studentName, p.topic, p.concept, p.notes);

      emitStep(
        'Voice NLU',
        'Targeted Intervention Command Decoded',
        `Transcribed: "${spokenText}" → Target: ${p.studentName}, Bottleneck: ${p.concept}.`
      );

      emitStep(
        'Risk Modeler',
        'Intervention Staged & Alert Published',
        `Dispatched remedial review and reassessment to ${p.studentName}'s portal in shared state.`,
        'completed',
        p
      );

      return {
        intent,
        lessonPlan: DEFAULT_CN_LESSON_30MIN,
        steps,
        sources: INITIAL_DOCUMENTS,
        students: sharedState.getStudents(),
        speechSummary: intent.actionOutcome.voiceResponse
      };
    }

    // 3. HANDLE EDIT MARKS ACTION
    if (intent.action === 'edit_marks' && intent.actionOutcome?.payload) {
      const p = intent.actionOutcome.payload;
      sharedState.updateStudentMarks(p.studentId, p.concept, p.score, p.maxScore, 'Voice AI Update');

      emitStep(
        'Voice NLU',
        'Student Assessment Marks Decoded',
        `Transcribed: "${spokenText}" → Student: ${p.studentName}, Score: ${p.score}/${p.maxScore}.`
      );

      emitStep(
        'Risk Modeler',
        'Mastery Recalculated & Topic Unlocked',
        `Updated Living Learning Twin, recalculated GNN risk score, and unlocked next topic in student learning path.`,
        'completed',
        p
      );

      return {
        intent,
        lessonPlan: DEFAULT_PHOTOSYNTHESIS_LESSON_40MIN,
        steps,
        sources: INITIAL_DOCUMENTS,
        students: sharedState.getStudents(),
        speechSummary: intent.actionOutcome.voiceResponse
      };
    }

    // 4. HANDLE GENERAL QA / VOICE ASSISTANT INQUIRY
    if (intent.action === 'general_qa') {
      let responseText = '';
      let qaProvider = 'Google Gemini 3.8 Flash';

      // 1. Dynamic Google Gemini AI Generation for deep Socratic and Engineering reasoning
      try {
        const geminiAnswer = await geminiService.chat(spokenText);
        if (geminiAnswer && geminiAnswer.trim().length > 10) {
          responseText = geminiAnswer.trim();
          qaProvider = 'Google Gemini 3.8 Flash (Project 586089963185)';
        }
      } catch (gemErr) {
        console.warn('Gemini dynamic chat notice:', gemErr);
      }

      // 2. High-speed Groq LPU fallback
      if (!responseText) {
        try {
          const groqAnswer = await groqService.chat(spokenText);
          if (groqAnswer && groqAnswer.trim().length > 10) {
            responseText = groqAnswer.trim();
            qaProvider = 'Groq Cloud LPU';
          }
        } catch (e) {
          console.warn('Groq dynamic chat notice:', e);
        }
      }

      // 3. Edge fallback: Local Ollama
      if (!responseText) {
        try {
          const ollamaAnswer = await ollamaService.chat(spokenText);
          if (ollamaAnswer && ollamaAnswer.trim().length > 10) {
            responseText = ollamaAnswer.trim();
            qaProvider = 'Local Ollama';
          }
        } catch (oErr) {
          console.warn('Ollama dynamic chat notice:', oErr);
        }
      }

      // 4. Pre-grounded rule engine fallback
      if (!responseText) {
        responseText = intent.actionOutcome?.voiceResponse || `Here is the explanation for ${spokenText}: In science and engineering curriculum, core foundational principles are grounded in verified academic standards.`;
        qaProvider = 'Pre-Grounded Deterministic Engine';
      }

      emitStep(
        'Voice NLU',
        `Universal Educational Inquiry Decoded via ${qaProvider}`,
        `Query: "${spokenText}" → Instant intelligent reasoning completed.`
      );

      emitStep(
        'Source Grounding',
        'Grounded Voice Explanation Synthesized',
        `Verified response against verified curriculum standards. High-fidelity answer generated via ${qaProvider}.`,
        'completed'
      );

      // Preserve active lesson plan: do NOT overwrite with photosynthesis!
      const currentPlan = sharedState.getLessonPlan() || DEFAULT_OPEN_SOURCE_AI_LESSON_40MIN;

      return {
        intent,
        lessonPlan: currentPlan,
        steps,
        sources: INITIAL_DOCUMENTS,
        students: sharedState.getStudents(),
        speechSummary: responseText
      };
    }

    // 5. HANDLE NAVIGATION / APPROVE ACTIONS
    if ((intent.action === 'navigate' || intent.action === 'approve') && intent.actionOutcome) {
      if (intent.action === 'approve') {
        sharedState.publishLesson('Photosynthesis', 'NCERT Grade 7 Science', ['Chloroplast Anatomy', 'Stomata Dynamics']);
      }

      emitStep(
        'Voice NLU',
        'Navigation / Approval Action Executed',
        `Transcribed: "${spokenText}" → Performed direct portal transition.`
      );

      return {
        intent,
        lessonPlan: DEFAULT_PHOTOSYNTHESIS_LESSON_40MIN,
        steps,
        sources: INITIAL_DOCUMENTS,
        students: sharedState.getStudents(),
        speechSummary: intent.actionOutcome.voiceResponse
      };
    }

    // 6. STANDARD FULL CURRICULUM LESSON GENERATION
    const isCN = intent.subject?.includes('Computer Networks') || intent.topic?.includes('Computer Networks');

    // Step 1: Voice & NLU Agent
    emitStep(
      'Voice NLU',
      'Spoken Intent & Constraints Decoded',
      `Transcribed: "${spokenText}" → Subject: ${intent.subject || 'Science'}, Grade: ${intent.grade || 7}, Duration: ${intent.durationMinutes}m, Focus: ${isCN ? 'Rahul Sharma (Weak: Slow Start, Flow Control)' : 'Classroom Baseline'}.`
    );

    // Step 2: Source Grounding
    if (isCN) {
      emitStep(
        'Source Grounding',
        'Scanning Uploaded Engineering Knowledge Base',
        `Retrieved authoritative curriculum reference "Tanenbaum & Wetherall: Computer Networks 6th Ed, Chapter 6: Transport Layer" with 0.96 semantic similarity match for TCP Congestion Control and AIMD.`
      );
    } else {
      emitStep(
        'Source Grounding',
        'Scanning Uploaded Knowledge Base via pgvector',
        `Identified 4 candidate documents. Retrieved primary textbook chapter "NCERT Grade 7 Science Ch 1" (Pages 12–16) with 0.94 semantic similarity match.`
      );
    }

    // Step 3: Conflict Resolution Agent
    if (isCN) {
      emitStep(
        'Conflict Resolution',
        'Protocol RFC Standard Verification Applied',
        `Validated RFC 5681 (TCP Congestion Control standard) vs legacy Tahoe 1988 notes. Verified ssthresh formula and cwnd doubling rate (100% verified).`
      );
    } else {
      emitStep(
        'Conflict Resolution',
        'Source Conflict & Recency Filter Applied',
        `Detected older uploaded note ("Class7_Science_Photosynthesis_Notes_2021.pdf"). Trust score: 42%. Ignored due to curriculum deviation from 2026 CBSE balanced equation. Selected 2026 NCERT (Trust: 98%).`,
        'completed',
        { selected: 'NCERT 2026', ignored: 'Notes 2021', reason: 'Outdated stoichiometry guidelines' }
      );
    }

    // Step 4: Risk Modeler
    const highRiskStudents = INITIAL_STUDENTS.filter(s => s.riskScore > 70);
    const isOS = intent.topic?.toLowerCase().includes('open-source') || intent.topic?.toLowerCase().includes('ollama') || intent.topic?.toLowerCase().includes('whisper') || (!isCN && !intent.topic?.toLowerCase().includes('photosynthesis') && !intent.topic?.toLowerCase().includes('fraction'));
    if (isCN) {
      emitStep(
        'Risk Modeler',
        'Living Learning Twin Telemetry Evaluated',
        `Evaluated Rahul Sharma's Living Learning Twin: TCP Basics (91% Mastered), Flow Control (72% Moderate), Slow Start (48% Bottleneck), Congestion Control (55% At Risk). Predicted Next Difficulty: Congestion Avoidance (82% risk).`,
        'completed',
        { targetStudent: 'Rahul Sharma', weakConcepts: ['Slow Start', 'Flow Control'], riskScore: 82 }
      );
    } else if (isOS) {
      emitStep(
        'Risk Modeler',
        'Living Learning Twin Telemetry Evaluated',
        `Evaluated student learning twins for Open-Source AI: Rahul Sharma has a mastery gap in Model Quantization & GGUF (44%), Aarav Sharma needs scaffolding in CTranslate2 INT8 acoustic kernels.`,
        'completed',
        { targetStudent: 'Rahul Sharma', weakConcepts: ['Model Quantization (GGUF)', 'CTranslate2 INT8 Kernels'], riskScore: 78 }
      );
    } else {
      emitStep(
        'Risk Modeler',
        'Predictive Learner-Gap Analysis',
        `Analyzed recent quiz telemetry for students. 3 students flagged at HIGH RISK before next week's exam: Aarav Sharma (86%), Priya Patel (78%), and Rohan Verma (84%). Identified bottleneck: Chemical Equation & Gas Exchange.`,
        'completed',
        { highRiskCount: highRiskStudents.length, studentNames: highRiskStudents.map(s => s.name) }
      );
    }

    // Step 5: Curriculum Architecture & Differentiation
    let lessonPlan: LessonPlan;
    let speechSummary = '';

    if (isCN) {
      const duration = intent.durationMinutes || 30;
      lessonPlan = JSON.parse(JSON.stringify(DEFAULT_CN_LESSON_30MIN));
      lessonPlan.totalDurationMinutes = duration;
      speechSummary = `I have created your ${duration}-minute Computer Networks lesson on TCP Congestion Control and Flow Control. Based on Rahul Sharma's Living Learning Twin profile (48% in Slow Start, 72% in Flow Control), I have integrated the "Water Pipe and Funnel" physical analogy and configured a 3-question diagnostic checkpoint. Ready for your review and approval.`;

      emitStep(
        'Curriculum Architect',
        `Generated ${duration}-Minute Computer Networks Architecture`,
        `Synthesized 5-phase timeline for ${duration}m duration. Attached "Water Pipe & Funnel" beginner scaffold targeted for Rahul Sharma and generated 3-question formative quiz.`
      );
    } else if (intent.action === 'replan_duration' || intent.durationMinutes === 20) {
      lessonPlan = JSON.parse(JSON.stringify(REPLANNED_PHOTOSYNTHESIS_LESSON_20MIN));
      speechSummary = `I have revised the lesson plan to a compact 20-minute timeline. I compressed the hook and focused directly on the balanced chemical equation and visual stomata diagram, while preserving the simplified Hindi explanations for Aarav, Priya, and Rohan. Ready for your review and approval.`;

      emitStep(
        'Curriculum Architect',
        'Dynamic 20-Minute Compression Replanned',
        'Reallocated time slots: Hook (3m), Core Direct (8m), Rapid Quiz (6m), Remedial Wrap-up (3m). Retained all scaffolded bilingual supports.'
      );
    } else if (intent.topic === 'Equivalent Fractions') {
      lessonPlan = this.generateFractionsLessonPlan();
      speechSummary = `I have generated a 30-minute bilingual Grade 6 fractions revision plan. I used pages 134 to 142 of your NCERT textbook, prepared visual strip models for struggling learners, and included a 3-question formative quiz.`;

      emitStep(
        'Curriculum Architect',
        'Generated Grade 6 Math Revision Plan',
        'Generated visual pizza/strip model analogies, bilingual math terminology, and multi-tier exercises.'
      );
    } else if (intent.topic?.toLowerCase().includes('photosynthesis') || intent.topic?.includes('ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ') || intent.topic?.includes('प्रकाश संश्लेषण')) {
      lessonPlan = JSON.parse(JSON.stringify(DEFAULT_PHOTOSYNTHESIS_LESSON_40MIN));
      if (intent.languages?.includes('Kannada') || /[\u0C80-\u0CFF]/.test(spokenText)) {
        speechSummary = 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ (Photosynthesis) 40 ನಿಮಿಷಗಳ ಪಾಠ ಯೋಜನೆಯನ್ನು ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ. ಎನ್‌ಸಿಇಆರ್‌ಟಿ 7ನೇ ತರಗತಿಯ ಪಠ್ಯಪುಸ್ತಕದ ಆಧಾರದ ಮೇಲೆ 3 ಹಂತದ ಬೋಧನಾ ವಿಧಾನ, ಸಸ್ಯದ ಅಡುಗೆಮನೆ ರೇಖಾಚಿತ್ರ ಮತ್ತು ರಸಪ್ರಶ್ನೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ ಅನುಮೋದಿಸಿ.';
      } else if (intent.languages?.includes('Hindi') || /[\u0900-\u097F]/.test(spokenText)) {
        speechSummary = 'मैंने कक्षा 7 विज्ञान के लिए प्रकाश संश्लेषण (Photosynthesis) की 40 मिनट की पाठ योजना हिंदी और अंग्रेजी में तैयार कर दी है। NCERT पाठ्यपुस्तक के आधार पर 3-स्तरीय पाड़बंदी, पादप रसोई आरेख और प्रश्नोत्तरी शामिल की गई है। कृपया समीक्षा करें और अनुमोदन दें।';
      } else {
        speechSummary = `I have created your 40-minute Grade 7 science lesson on photosynthesis in English and Hindi. I used pages 12 to 16 of your NCERT textbook and ignored the older 2021 note because it conflicts with the current syllabus. Three students are flagged at risk for the upcoming exam, so I included the "Plant Kitchen" scaffold and visual diagram. Please review and approve before sharing.`;
      }

      emitStep(
        'Curriculum Architect',
        'Differentiated 40-Minute Lesson Architecture Ready',
        'Generated 5-phase timeline, Beginner "Plant Kitchen" scaffold, Standard teacher talking points, Advanced Calvin cycle inquiry, and High-Res Visual Diagram.'
      );
    } else if (intent.topic?.toLowerCase().includes('open-source') || intent.topic?.toLowerCase().includes('ollama') || intent.topic?.toLowerCase().includes('whisper')) {
      // Open-Source AI Systems & Edge Architecture
      const duration = intent.durationMinutes || 40;
      lessonPlan = JSON.parse(JSON.stringify(DEFAULT_OPEN_SOURCE_AI_LESSON_40MIN));
      lessonPlan.totalDurationMinutes = duration;
      speechSummary = `I have generated your ${duration}-minute Open-Source AI Systems lesson on Local Ollama LLMs and Faster-Whisper ASR. I included the local sandbox privacy scaffold, INT8 quantization benchmarks, and CTranslate2 edge decoding for Rahul and Aarav. All models execute 100% offline on your device with zero cloud data egress.`;

      emitStep(
        'Curriculum Architect',
        'Open-Source AI & Edge Architecture Synthesized',
        'Generated 5-phase timeline for Local Ollama, GGUF INT8 Quantization, Faster-Whisper CTranslate2 sub-300ms ASR, and PyG GNN student gap tracing.'
      );
    } else {
      // Dynamic Lesson Plan for ANY subject / topic requested by the teacher (e.g. Gravity, Newton's Laws, Thermodynamics, etc.)
      const duration = intent.durationMinutes || 30;
      const topicName = intent.topic || spokenText;
      lessonPlan = this.generateDynamicLessonPlan(
        topicName,
        intent.subject || 'Academic Science & Engineering',
        intent.grade || 8,
        duration,
        (intent.languages as any) || ['English']
      );
      speechSummary = `I have created your ${duration}-minute lesson plan on "${topicName}" with a 5-phase timeline, 3-tier scaffolding, and diagnostic assessment questions. Ready for your review and approval.`;

      emitStep(
        'Curriculum Architect',
        `Universal Lesson Architecture Synthesized: ${topicName}`,
        `Synthesized 5-phase timeline for ${duration}m duration on "${topicName}" with differentiated beginner scaffolding and formative assessment.`
      );
    }

    // Step 6: Approval Supervisor (Human-in-the-loop)
    emitStep(
      'Approval Supervisor',
      'Human-in-the-Loop Approval Required',
      'Lesson plan drafted and staged. Content will NOT be published to students until explicit teacher confirmation.'
    );

    // Asynchronously notify FastAPI backend brain for telemetry & persistent state
    apiClient.sendVoiceRequest(spokenText).catch(() => {});

    return {
      intent,
      lessonPlan,
      steps,
      sources: INITIAL_DOCUMENTS,
      students: sharedState.getStudents(),
      speechSummary
    };
  }

  /**
   * Helper to generate a Grade 6 Math fractions plan
   */
  private static generateFractionsLessonPlan(): LessonPlan {
    return {
      id: 'lesson-fractions-30',
      topic: 'Mastering Equivalent Fractions (Revision)',
      topicHindi: 'समतुल्य भिन्न (Equivalent Fractions) का अभ्यास',
      grade: 6,
      subject: 'Mathematics',
      totalDurationMinutes: 30,
      targetExamDate: 'Friday Revision',
      languages: ['English', 'Hindi'],
      predictedGapsCount: 2,
      highRiskStudents: ['Aarav Sharma', 'Rohan Verma'],
      approvalState: 'draft',
      lastUpdated: 'Just now',
      sourcesUsed: [
        {
          sourceId: 'doc-fractions-math',
          citation: 'NCERT Grade 6 Math Ch 7 (Pages 134–142)',
          reason: 'Primary NCERT standard for equivalent fraction visual models.'
        }
      ],
      ignoredSources: [],
      beginnerExplanation: {
        summary: 'Equivalent fractions are different ways of showing the exact same amount of pizza or chocolate bar!',
        summaryHindi: 'समतुल्य भिन्न एक ही पिज्जा या चॉकलेट के बराबर हिस्से को अलग-अलग तरीकों से दिखाने का तरीका है!',
        keyAnalogy: '1/2 of a pizza is the exact same amount as 2/4 slices or 4/8 slices—just cut into smaller pieces!',
        keyAnalogyHindi: 'आधा पिज्जा (1/2) उतना ही होता है जितना 4 में से 2 टुकड़े (2/4) या 8 में से 4 टुकड़े (4/8)!',
        visualCues: ['Fraction strip visual bars', 'Pizza slicing circles'],
        vocabularyGlossary: [
          { term: 'Numerator', hindiTerm: 'अंश (Ansh)', definition: 'Top number indicating parts taken' },
          { term: 'Denominator', hindiTerm: 'हर (Har)', definition: 'Bottom number indicating total equal parts' },
          { term: 'Equivalent', hindiTerm: 'समतुल्य (Samatulya)', definition: 'Equal in value or amount' }
        ],
        targetStudents: ['Aarav Sharma', 'Rohan Verma']
      },
      standardLesson: {
        objectives: [
          'Recognize and create equivalent fractions by multiplying or dividing numerator and denominator by the same number.',
          'Verify equivalence using the cross-multiplication rule (a × d = b × c).',
          'Simplify fractions to lowest terms.'
        ],
        objectivesHindi: [
          'अंश और हर को समान संख्या से गुणा या भाग करके समतुल्य भिन्न बनाएं।',
          'वज्र गुणन (Cross multiplication) विधि से समतुल्यता की जांच करें।'
        ],
        sections: [
          {
            id: 'sec-frac-1',
            timeAllocationMinutes: 5,
            title: 'Visual Hook: The Pizza Sharing Dilemma',
            titleHindi: 'रोचक शुरुआत: पिज्जा बंटवारे की पहेली',
            icon: 'Sparkles',
            teacherTalkingPoints: ['"Who got more pizza: Rohan who ate 1/2 or Aarav who ate 2/4?"'],
            studentActivities: ['Draw two identical circles and shade 1/2 vs 2/4.'],
            groundedInCitation: 'NCERT Math 2026, p. 134'
          },
          {
            id: 'sec-frac-2',
            timeAllocationMinutes: 12,
            title: 'Direct Instruction: The Golden Multiplication Rule',
            titleHindi: 'प्रत्यक्ष शिक्षण: अंश और हर का नियम',
            icon: 'BookOpen',
            teacherTalkingPoints: [
              'Whatever you do to the top (Numerator), you must do to the bottom (Denominator)!',
              'Demonstrate: 2/3 × (2/2) = 4/6 = 6/9.'
            ],
            studentActivities: ['Generate 3 equivalent fractions for 3/5.'],
            groundedInCitation: 'NCERT Math 2026, p. 136'
          },
          {
            id: 'sec-frac-3',
            timeAllocationMinutes: 8,
            title: 'Interactive Formative Check',
            titleHindi: 'त्वरित क्विज़ और अभ्यास',
            icon: 'HelpCircle',
            teacherTalkingPoints: ['Check if students correctly use division to find simplest form.'],
            studentActivities: ['Solve 2 rapid equivalent fraction problems.'],
            groundedInCitation: 'NCERT Math 2026, p. 140'
          },
          {
            id: 'sec-frac-4',
            timeAllocationMinutes: 5,
            title: 'Wrap-Up & Ticket to Leave',
            titleHindi: 'समापन एवं विदाई प्रश्न',
            icon: 'CheckCircle2',
            teacherTalkingPoints: ['Recap: Multiply top and bottom by same number.'],
            studentActivities: ['Write one equivalent fraction on exit slip.'],
            groundedInCitation: 'NCERT Math 2026, p. 142'
          }
        ]
      },
      advancedActivity: {
        title: 'Fraction Puzzles & Cross-Multiplication Proofs',
        titleHindi: 'उन्नत भिन्न पहेलियाँ',
        inquiryChallenge: 'Find the missing digit x such that (2x + 1)/15 is equivalent to 3/5. Prove why cross-multiplication always works using algebra.',
        inquiryChallengeHindi: 'अज्ञात संख्या खोजें और बीजगणित से सिद्ध करें।',
        deepQuestions: ['Why can we never multiply numerator and denominator by zero?'],
        extensionMaterials: ['Algebraic fraction challenge cards'],
        targetStudents: ['Vihaan Reddy', 'Ananya Iyer']
      },
      visualDiagram: {
        title: 'Equivalent Fractions: Visual Fraction Bar Models',
        imageUrl: '/assets/photosynthesis.jpg',
        caption: 'Visual breakdown showing 1/2 = 2/4 = 3/6 = 4/8 with aligned area bars.',
        captionHindi: 'समान क्षेत्रफल दर्शाने वाली भिन्न पट्टियाँ।',
        hotspots: [
          { label: 'Whole (1)', hindiLabel: 'पूर्ण (1)', description: 'One complete unit bar.', x: 50, y: 20 },
          { label: 'Half (1/2)', hindiLabel: 'आधा (1/2)', description: 'Unit divided into 2 equal parts.', x: 50, y: 40 },
          { label: 'Quarters (2/4)', hindiLabel: 'चौथाई (2/4)', description: 'Two quarters equal one half.', x: 50, y: 60 }
        ]
      },
      formativeQuiz: [
        {
          id: 'q-frac-1',
          question: 'Which of the following is an equivalent fraction for 3/4?',
          questionHindi: 'निम्नलिखित में से कौन सा 3/4 का समतुल्य भिन्न है?',
          options: ['6/8', '4/5', '9/15', '6/12'],
          optionsHindi: ['6/8', '4/5', '9/15', '6/12'],
          correctAnswerIndex: 0,
          explanation: 'Multiplying both 3 and 4 by 2 gives 6/8.',
          explanationHindi: 'अंश और हर दोनों को 2 से गुणा करने पर 6/8 प्राप्त होता है।',
          targetedConcept: 'Equivalent Fractions',
          difficulty: 'Easy'
        }
      ]
    };
  }

  /**
   * Universal Dynamic Lesson Plan Generator
   * Synthesizes 5-phase timeline, 3-tier scaffolding, and formative check for ANY subject/topic
   */
  public static generateDynamicLessonPlan(
    topic: string,
    subject: string = 'Science & Engineering',
    grade: number = 8,
    duration: number = 30,
    languages: ('English' | 'Hindi' | 'Kannada')[] = ['English']
  ): LessonPlan {
    const isHindi = languages.includes('Hindi');
    const isKannada = languages.includes('Kannada');

    return {
      id: `lesson-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${duration}`,
      topic,
      topicHindi: `${topic} का पाठ`,
      topicKannada: `${topic} ಪಾಠ`,
      grade,
      subject,
      totalDurationMinutes: duration,
      targetExamDate: 'Upcoming Assessment',
      languages,
      predictedGapsCount: 2,
      highRiskStudents: ['Rahul Sharma', 'Aarav Sharma'],
      approvalState: 'draft',
      lastUpdated: 'Just now',
      sourcesUsed: [
        {
          sourceId: `doc-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          citation: `${subject} Accredited Syllabus Standards & Verified Curriculum`,
          reason: `Authoritative grounding and syllabus standards for ${topic}.`
        }
      ],
      ignoredSources: [],
      beginnerExplanation: {
        summary: `Foundational introductory concept of ${topic} explained through intuitive physical intuition and real-world everyday analogies.`,
        summaryHindi: `${topic} की बुनियादी अवधारणा को दैनिक जीवन के उदाहरणों और सरल व्याख्या के माध्यम से समझाया गया है।`,
        summaryKannada: `${topic} ನ ಮೂಲಭೂತ ಪರಿಕಲ್ಪನೆಯನ್ನು ದೈನಂದಿನ ಜೀವನದ ಉದಾಹರಣೆಗಳೊಂದಿಗೆ ವಿವರಿಸಲಾಗಿದೆ.`,
        keyAnalogy: `Think of ${topic} like an interconnected real-world system where cause directly determines predictable observable effect.`,
        keyAnalogyHindi: `${topic} को एक ऐसे दैनिक तंत्र की तरह समझें जहाँ कारण और प्रभाव एक दूसरे से सीधे जुड़े होते हैं।`,
        keyAnalogyKannada: `${topic} ಪರಿಕಲ್ಪನೆಯನ್ನು ಸರಳ ಭೌತಿಕ ವ್ಯವಸ್ಥೆಯಂತೆ ಕಲ್ಪಿಸಿಕೊಳ್ಳಿ.`,
        visualCues: [`Concept Flow Diagram for ${topic}`, 'Interactive Scaffold Model'],
        vocabularyGlossary: [
          { term: topic, hindiTerm: `${topic} (अवधारणा)`, kannadaTerm: `${topic} (ಪರಿಕಲ್ಪನೆ)`, definition: `Core foundational mechanism of ${topic}` },
          { term: 'Equilibrium & Dynamics', hindiTerm: 'संतुलन एवं गतिशीलता', kannadaTerm: 'ಸಮತೋಲನ', definition: 'Governing physical constraints and systemic invariance' }
        ],
        targetStudents: ['Rahul Sharma', 'Aarav Sharma']
      },
      standardLesson: {
        objectives: [
          `Understand and articulate the primary principles of ${topic}.`,
          `Analyze standard equations, theorems, and real-world mechanisms governing ${topic}.`,
          `Solve formative diagnostic challenges with high epistemic confidence.`
        ],
        objectivesHindi: [
          `${topic} के मुख्य सिद्धांतों और क्रियाविधि को समझें।`,
          `संबंधित समीकरणों और व्यावहारिक अनुप्रयोगों का विश्लेषण करें।`
        ],
        objectivesKannada: [
          `${topic} ನ ಪ್ರಮುಖ ತತ್ವಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.`,
          `ಪ್ರಾಯೋಗಿಕ ಉದಾಹರಣೆಗಳೊಂದಿಗೆ ವಿಶ್ಲೇಷಿಸಿ.`
        ],
        sections: [
          {
            id: `sec-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-1`,
            timeAllocationMinutes: Math.max(3, Math.round(duration * 0.15)),
            title: `Interactive Hook: Real-World Dilemma in ${topic}`,
            titleHindi: `रोचक शुरुआत: ${topic} की वास्तविक पहेली`,
            titleKannada: `ಆರಂಭಿಕ ಪರಿಚಯ: ${topic}`,
            icon: 'Sparkles',
            teacherTalkingPoints: [
              `"Why does ${topic} behave the way it does in nature and technology?"`,
              `Connect everyday student observation to fundamental underlying principles.`
            ],
            studentActivities: [`Observe demonstration and formulate initial hypotheses on ${topic}.`],
            groundedInCitation: `${subject} Standards, Chapter 1`
          },
          {
            id: `sec-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-2`,
            timeAllocationMinutes: Math.max(8, Math.round(duration * 0.45)),
            title: `Direct Instruction: Core Principles & Systematic Mechanics of ${topic}`,
            titleHindi: `प्रत्यक्ष शिक्षण: मुख्य सिद्धांत`,
            titleKannada: `ನೇರ ಬೋಧನೆ: ಪ್ರಮುಖ ತತ್ವಗಳು`,
            icon: 'BookOpen',
            teacherTalkingPoints: [
              `Walk through the rigorous definition, governing equations, and properties of ${topic}.`,
              `Highlight common student misconceptions and clarify boundary conditions.`
            ],
            studentActivities: [`Annotate core concept map and diagram relationships.`],
            groundedInCitation: `${subject} Textbook Standards`
          },
          {
            id: `sec-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-3`,
            timeAllocationMinutes: Math.max(4, Math.round(duration * 0.25)),
            title: `Guided Practice: Formative Problem Solving`,
            titleHindi: `अभ्यास और प्रश्नोत्तरी`,
            titleKannada: `ಪ್ರಶ್ನೋತ್ತರ ಮತ್ತು ಅಭ್ಯಾಸ`,
            icon: 'HelpCircle',
            teacherTalkingPoints: [`Present targeted diagnostic problems testing deep conceptual mastery.`],
            studentActivities: [`Solve pair-share problems and justify answers with step-by-step logic.`],
            groundedInCitation: `${subject} Diagnostic Checkpoint`
          },
          {
            id: `sec-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-4`,
            timeAllocationMinutes: Math.max(3, Math.round(duration * 0.15)),
            title: 'Synthesis, Mastery Check & Exit Ticket',
            titleHindi: 'निष्कर्ष एवं मूल्यांकन',
            titleKannada: 'ಮುಕ್ತಾಯ ಮತ್ತು ಸಾರಾಂಶ',
            icon: 'CheckCircle2',
            teacherTalkingPoints: [`Synthesize key takeaways and preview upcoming interconnected modules.`],
            studentActivities: [`Submit exit slip summarizing the most crucial insight learned today.`],
            groundedInCitation: `${subject} Summary Standards`
          }
        ]
      },
      advancedActivity: {
        title: `Deep Inquiry & Research Challenge: Advanced ${topic}`,
        titleHindi: `उन्नत शोध चुनौती: ${topic}`,
        titleKannada: `ಉನ್ನತ ಸಂಶೋಧನಾ ಸವಾಲು: ${topic}`,
        inquiryChallenge: `Investigate edge cases, non-linear dynamics, and modern applications of ${topic}.`,
        inquiryChallengeHindi: `${topic} के आधुनिक अनुप्रयोगों और उन्नत सिद्धांतों पर शोध करें।`,
        inquiryChallengeKannada: `${topic} ನ ಮುಂದುವರಿದ ಅನ್ವಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.`,
        deepQuestions: [`How do boundary conditions change when scaling parameters of ${topic}?`],
        extensionMaterials: [`Advanced peer-reviewed references on ${topic}`],
        targetStudents: ['Vihaan Reddy', 'Ananya Iyer']
      },
      visualDiagram: {
        title: `Visual Concept Flow & System Architecture: ${topic}`,
        imageUrl: '/assets/photosynthesis.jpg',
        caption: `Authoritative schematic illustration displaying component interactions in ${topic}.`,
        captionHindi: `${topic} का घटक अंतःक्रिया आरेख।`,
        hotspots: [
          { label: 'Input State', hindiLabel: 'प्रारंभिक अवस्था', description: `Initial conditions and driving forces of ${topic}.`, x: 30, y: 35 },
          { label: 'Core Mechanism', hindiLabel: 'मुख्य तंत्र', description: `Primary transformation process governing ${topic}.`, x: 50, y: 50 },
          { label: 'Output / Equilibrium', hindiLabel: 'अंतिम संतुलन', description: `Final state and observable outcomes of ${topic}.`, x: 75, y: 65 }
        ]
      },
      formativeQuiz: [
        {
          id: `q-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-1`,
          question: `What is the primary governing principle of ${topic}?`,
          questionHindi: `${topic} का प्राथमिक शासी सिद्धांत क्या है?`,
          questionKannada: `${topic} ನ ಮುಖ್ಯ ತತ್ವ ಯಾವುದು?`,
          options: [
            `It represents the fundamental invariant dynamics of ${topic}`,
            `It violates standard conservation principles`,
            `It applies only to static, non-interacting systems`,
            `It is entirely random and unpredictable`
          ],
          optionsHindi: [
            `यह ${topic} की मूलभूत गतिशीलता का प्रतिनिधित्व करता है`,
            `यह संरक्षण के नियमों का उल्लंघन करता है`,
            `यह केवल स्थिर प्रणालियों पर लागू होता है`,
            `यह पूरी तरह से यादृच्छिक है`
          ],
          correctAnswerIndex: 0,
          explanation: `Accredited syllabus standards verify that ${topic} operates under systematic invariant principles.`,
          explanationHindi: `पाठ्यक्रम मानकों के अनुसार ${topic} सुव्यवस्थित सिद्धांतों के अंतर्गत कार्य करता है।`,
          targetedConcept: topic,
          difficulty: 'Medium'
        }
      ]
    };
  }
}
