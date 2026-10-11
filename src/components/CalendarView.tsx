import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Video, 
  FileText, 
  Image as ImageIcon, 
  ExternalLink, 
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
  Users,
  Info,
  List,
  Grid,
  Columns,
  Search,
  Upload,
  GraduationCap,
  Download,
  Code2,
  X,
  Play
} from 'lucide-react';
import { CalendarEvent } from '../types';
import { sharedState } from '../services/sharedStateManager';
import { AutoScheduleModal } from './AutoScheduleModal';

interface CalendarViewProps {
  currentPersona: 'teacher' | 'student';
  events?: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
  onOpenLesson?: (topicId: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentPersona,
  events: initialEvents,
  onSelectEvent,
  onOpenLesson,
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    if (initialEvents !== undefined) return initialEvents;
    if (currentPersona === 'student' && !sharedState.isStudentConnected()) return [];
    return sharedState.getCalendarEvents();
  });
  const [classroomCode, setClassroomCode] = useState<string>(() => sharedState.getClassroomCode());
  const [isStudentConnected, setIsStudentConnected] = useState<boolean>(() => sharedState.isStudentConnected());

  useEffect(() => {
    if (initialEvents !== undefined) {
      setEvents(initialEvents);
    }
  }, [initialEvents]);

  // Calendar View Mode: 'month' (default) | 'week' | 'list' | 'day'
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list' | 'day'>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<{ day: number; events: CalendarEvent[] } | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 9, 9)); // Oct 9, 2026
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Auto-Schedule Modal State
  const [isAutoScheduleModalOpen, setIsAutoScheduleModalOpen] = useState<boolean>(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);

  // Manual Event Creation State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newModule, setNewModule] = useState<string>('Module 1: Linear Data Structures');
  const [newDate, setNewDate] = useState<string>('2026-10-16');
  const [newTime, setNewTime] = useState<string>('09:00 AM - 10:00 AM');
  const [newType, setNewType] = useState<CalendarEvent['type']>('lesson');
  const [newClassroom, setNewClassroom] = useState<string>('LH-302');

  // Subscribe to real-time shared state updates
  useEffect(() => {
    const unsub = sharedState.subscribe(() => {
      setClassroomCode(sharedState.getClassroomCode());
      const connected = sharedState.isStudentConnected();
      setIsStudentConnected(connected);
      if (initialEvents !== undefined) {
        setEvents(initialEvents);
      } else if (currentPersona === 'student' && !connected) {
        setEvents([]);
      } else {
        setEvents(sharedState.getCalendarEvents());
      }
    });
    return unsub;
  }, [initialEvents, currentPersona]);

  // Filter events
  const filteredEvents = events.filter((e) => {
    const matchesSearch = 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.subjectCode && e.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'all' ? true :
      selectedCategory === 'lecture' ? (e.category === 'lecture' || e.type === 'lesson') :
      selectedCategory === 'lab' ? (e.category === 'lab' || e.type === 'lab') :
      selectedCategory === 'holiday' ? (e.category === 'holiday' || e.type === 'holiday') :
      selectedCategory === 'exam' ? (e.category === 'exam' || e.type === 'assessment') :
      selectedCategory === 'sst' ? (e.category === 'sst' || e.type === 'sst') : true;

    return matchesSearch && matchesCategory;
  });

  // Generate Month Matrix for October 2026 (Starts Thursday = index 4, 31 days)
  // Calendar days grid: 35 cells (October 1 is Thursday, row 1 day 4)
  const monthDays = Array.from({ length: 35 }, (_, i) => {
    const dayNumber = i - 3; // 4th cell is Oct 1st
    return dayNumber > 0 && dayNumber <= 31 ? dayNumber : null;
  });

  const getEventsForDay = (day: number) => {
    const formatted = `2026-10-${day < 10 ? '0' + day : day}`;
    return filteredEvents.filter((e) => e.date === formatted);
  };

  const handleManualCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = sharedState.scheduleEvent({
      title: newTitle,
      topicId: `custom-top-${Date.now()}`,
      module: newModule,
      date: newDate,
      time: newTime,
      type: newType,
      status: 'scheduled',
      category: newType === 'lab' ? 'lab' : (newType === 'holiday' ? 'holiday' : (newType === 'assessment' ? 'exam' : 'lecture')),
      classroom: newClassroom,
      objectives: ['Master curriculum concepts and apply practical analysis.'],
      prerequisites: ['Prior foundational prerequisites.'],
      prerequisiteCompleted: true,
      resources: []
    });

    setIsManualModalOpen(false);
    setNewTitle('');
  };

  const handleScheduleGenerated = (newlyGenerated: CalendarEvent[]) => {
    setEvents(newlyGenerated);
    setIsAutoScheduleModalOpen(false);
  };

  const getEventBadgeStyle = (evt: CalendarEvent) => {
    if (evt.category === 'holiday' || evt.type === 'holiday') {
      return 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300';
    }
    if (evt.category === 'lab' || evt.type === 'lab') {
      return 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200';
    }
    if (evt.category === 'sst' || evt.type === 'sst') {
      return 'bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200';
    }
    if (evt.category === 'exam' || evt.type === 'assessment') {
      return 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300 font-bold';
    }
    // Default lecture
    return 'bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-200';
  };

  const getEventIcon = (evt: CalendarEvent) => {
    if (evt.category === 'holiday' || evt.type === 'holiday') return '🌴';
    if (evt.category === 'lab' || evt.type === 'lab') return '🧪';
    if (evt.category === 'sst' || evt.type === 'sst') return '🔮';
    if (evt.category === 'exam' || evt.type === 'assessment') return '🎯';
    return '📘';
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
      
      {/* 1. Header Toolbar (Matches screenshot with rich controls) */}
      <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        
        {/* Title and Top Level Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5 flex-wrap">
              <span>Calendar Overview</span>
              {currentPersona === 'teacher' ? (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Broadcasting to Class: {classroomCode}
                </span>
              ) : isStudentConnected ? (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Synced with Class: {classroomCode}
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                  Classroom Not Synced (Offline)
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              View your calendar with student classes, exams, and holidays.
            </p>
          </div>

          {/* Action Buttons: Auto-Schedule from PPT/PDF & Manual Add */}
          <div className="flex items-center gap-2 flex-wrap">
            {currentPersona === 'teacher' && (
              <>
                <button
                  type="button"
                  onClick={() => setIsAutoScheduleModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-cyan-600/20 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Upload PPT / PDF to Schedule</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Class</span>
                </button>
              </>
            )}

            {currentPersona === 'student' && (
              <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs text-indigo-900 font-semibold">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Synchronized with Faculty Timetable</span>
              </div>
            )}
          </div>
        </div>

        {/* Date Selector Row & View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Left: Date Badge & Navigation (< Oct 1, 2026 - Oct 31, 2026 >) */}
          <div className="flex items-center space-x-3 flex-wrap">
            {/* OCT 9 Box */}
            <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-xs">
              <span className="text-[10px] font-bold uppercase text-cyan-400">OCT</span>
              <span className="text-sm font-black text-white">9</span>
            </div>

            <div className="flex items-center space-x-2">
              <h2 className="text-base font-extrabold text-slate-900">
                October 2026
              </h2>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {filteredEvents.length} events
              </span>
              <span title="VTU Semester 3 Active Term" className="cursor-pointer text-slate-400 hover:text-slate-600">
                <Info className="w-4 h-4" />
              </span>
            </div>

            {/* Date Range Navigator */}
            <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-700 font-medium">
              <button 
                type="button" 
                onClick={() => {}} 
                className="p-1 hover:bg-slate-200 rounded cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span>Oct 1, 2026 - Oct 31, 2026</span>
              <button 
                type="button" 
                onClick={() => {}} 
                className="p-1 hover:bg-slate-200 rounded cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: View Mode Buttons (List, Columns, Month, Day) */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'week' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Week / Split Columns View"
            >
              <Columns className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'month' 
                  ? 'bg-slate-950 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Month Grid View (Default)"
            >
              <Grid className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setViewMode('day')}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'day' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Day Timeline View"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search lectures, topics, labs, or holidays..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: 'All Events' },
              { id: 'lecture', label: '📘 Lectures' },
              { id: 'lab', label: '🧪 Labs' },
              { id: 'sst', label: '🔮 SST Training' },
              { id: 'holiday', label: '🌴 Holidays' },
              { id: 'exam', label: '🎯 Exams / IAT' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* 2. Main Calendar Content Grid (Month View Matching Screenshot) */}
      {viewMode === 'month' && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Days of Week Header: Mon, Tue, Wed, Thu, Fri, Sat, Sun */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-slate-700 text-center text-xs font-extrabold py-3 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Month 5x7 Day Matrix */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
            {monthDays.map((day, idx) => {
              if (day === null) {
                return (
                  <div key={idx} className="min-h-[110px] sm:min-h-[125px] bg-slate-50/50 p-2 text-slate-300" />
                );
              }

              const dayEvents = getEventsForDay(day);
              const isToday = day === 9; // Oct 9, 2026

              return (
                <div 
                  key={idx} 
                  onClick={() => setSelectedDayEvents({ day, events: dayEvents })}
                  className={`min-h-[110px] sm:min-h-[125px] p-2 sm:p-2.5 transition-all flex flex-col justify-between group cursor-pointer ${
                    isToday 
                      ? 'bg-cyan-50/40 hover:bg-cyan-50/80 ring-2 ring-cyan-500/40 inset-ring' 
                      : 'hover:bg-slate-50/90 bg-white'
                  }`}
                >
                  {/* Top Day Number */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs sm:text-sm font-extrabold rounded-lg w-6 h-6 flex items-center justify-center ${
                      isToday 
                        ? 'bg-cyan-600 text-white shadow-xs' 
                        : 'text-slate-700 group-hover:text-slate-900'
                    }`}>
                      {day}
                    </span>

                    {dayEvents.length > 3 && (
                      <span className="text-[10px] font-bold text-slate-400">
                        {dayEvents.length} items
                      </span>
                    )}
                  </div>

                  {/* Event Badges List (Show top 3, then "X more...") */}
                  <div className="space-y-1 mt-1 flex-1">
                    {dayEvents.slice(0, 3).map((evt) => (
                      <div
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(evt);
                        }}
                        className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-lg border truncate transition-all ${getEventBadgeStyle(evt)}`}
                        title={`${evt.title} (${evt.time})`}
                      >
                        <span className="mr-1">{getEventIcon(evt)}</span>
                        <span>{evt.title}</span>
                      </div>
                    ))}

                    {/* "+X more..." badge */}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-slate-500 font-bold px-1.5 py-0.5 hover:text-cyan-700">
                        {dayEvents.length - 3} more...
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 3. Week / Split Columns View */}
      {viewMode === 'week' && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Columns className="w-4 h-4 text-cyan-600" />
            <span>Weekly Detailed Timetable (Oct 5 - Oct 11, 2026)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {[5, 6, 7, 8, 9, 10].map((d) => {
              const dayEvts = getEventsForDay(d);
              const dayName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d - 5];
              const isToday = d === 9;

              return (
                <div key={d} className={`p-3 rounded-2xl border space-y-2 ${isToday ? 'bg-cyan-50/50 border-cyan-400' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-xs font-bold text-slate-700">{dayName}, Oct {d}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{dayEvts.length} classes</span>
                  </div>

                  <div className="space-y-1.5">
                    {dayEvts.map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`p-2 rounded-xl text-xs border cursor-pointer ${getEventBadgeStyle(evt)}`}
                      >
                        <p className="font-bold truncate">{evt.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{evt.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Chronological Agenda / List View */}
      {viewMode === 'list' && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-4 sm:p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <List className="w-4 h-4 text-cyan-600" />
            <span>Complete Chronological Agenda ({filteredEvents.length} Events)</span>
          </h3>

          <div className="space-y-2">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all cursor-pointer ${getEventBadgeStyle(evt)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{getEventIcon(evt)}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900">{evt.title}</span>
                      {evt.subjectCode && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white font-mono font-bold text-slate-700 border border-slate-200">
                          {evt.subjectCode}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{evt.module} • {evt.classroom || 'Lecture Hall'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 text-xs">
                  <span className="font-semibold text-slate-700">{evt.date}</span>
                  <span className="font-bold text-slate-900">{evt.time}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Day Timeline View */}
      {viewMode === 'day' && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-600" />
              <span>Today's Schedule: Friday, October 9, 2026</span>
            </h3>
            <span className="text-xs text-emerald-600 font-bold">4 Sessions Scheduled</span>
          </div>

          <div className="space-y-3">
            {getEventsForDay(9).map((evt) => (
              <div 
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className={`p-4 rounded-2xl border flex items-start justify-between gap-4 cursor-pointer ${getEventBadgeStyle(evt)}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getEventIcon(evt)}</span>
                    <h4 className="text-sm font-extrabold text-slate-900">{evt.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600">{evt.module} • Classroom: {evt.classroom}</p>
                  <p className="text-xs text-slate-500 font-medium">Faculty: {evt.facultyName || 'Course Instructor'}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-slate-900 block">{evt.time}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold mt-1 inline-block">
                    {evt.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{getEventIcon(selectedEvent)}</span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600">
                    {selectedEvent.category?.toUpperCase() || selectedEvent.type.toUpperCase()}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {selectedEvent.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Date & Time</p>
                  <p className="font-bold text-slate-900">{selectedEvent.date} • {selectedEvent.time}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Classroom / Location</p>
                  <p className="font-bold text-slate-900">{selectedEvent.classroom || 'LH-302'}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Module</p>
                <p className="font-semibold text-slate-800">{selectedEvent.module}</p>
              </div>

              {selectedEvent.objectives && selectedEvent.objectives.length > 0 && (
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Learning Objectives</p>
                  <ul className="space-y-1">
                    {selectedEvent.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedEvent(null);
                  if (onOpenLesson) onOpenLesson(selectedEvent.topicId);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Lesson & Notes</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Day Drilldown Drawer Modal (when clicking "+X more...") */}
      {selectedDayEvents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-extrabold text-slate-900">
                All Classes for October {selectedDayEvents.day}, 2026 ({selectedDayEvents.events.length})
              </h3>
              <button
                type="button"
                onClick={() => setSelectedDayEvents(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              {selectedDayEvents.events.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => {
                    setSelectedDayEvents(null);
                    setSelectedEvent(evt);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${getEventBadgeStyle(evt)}`}
                >
                  <p className="font-bold text-xs text-slate-900">{getEventIcon(evt)} {evt.title}</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">{evt.time} • {evt.classroom}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Auto-Schedule Modal for PPT/PDF/Text Upload */}
      <AutoScheduleModal
        isOpen={isAutoScheduleModalOpen}
        onClose={() => setIsAutoScheduleModalOpen(false)}
        onScheduleGenerated={handleScheduleGenerated}
      />

    </div>
  );
};
