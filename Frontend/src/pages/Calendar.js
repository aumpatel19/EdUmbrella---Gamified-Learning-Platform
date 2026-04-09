import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/simplebutton";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Bell,
  CheckCircle2,
  Circle,
  Trash2,
  Edit,
  AlarmClock,
  BookOpen,
  FileText,
  Users,
  Target
} from "lucide-react";
import StudentSidebar from "../components/StudentSidebar";


const Calendar = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [todos, setTodos] = useState({
    "2024-01-15": [
      {
        id: "1",
        title: "Study Mathematics - Algebra",
        description: "Review chapters 5-7 for upcoming quiz",
        time: "09:00",
        completed: false,
        category: "study",
        priority: "high",
        reminder: 15
      },
      {
        id: "2",
        title: "Chemistry Quiz",
        description: "Lab safety and chemical reactions",
        time: "14:00",
        completed: false,
        category: "quiz",
        priority: "high",
        reminder: 30
      },
      {
        id: "3",
        title: "History Assignment",
        description: "World War II essay submission",
        time: "16:30",
        completed: true,
        category: "assignment",
        priority: "medium"
      }
    ],
    "2024-01-16": [
      {
        id: "4",
        title: "Physics Lecture",
        description: "Thermodynamics chapter 3",
        time: "10:00",
        completed: false,
        category: "study",
        priority: "medium",
        reminder: 10
      }
    ]
  });

  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    time: "",
    category: "study",
    priority: "medium",
    reminder: 15
  });

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDate = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const getTodosForDate = (date) => {
    const dateKey = formatDateKey(date);
    return todos[dateKey] || [];
  };

  const addTodo = () => {
    if (!newTodo.title || !newTodo.time) return;

    const todoItem = {
      id: Date.now().toString(),
      title: newTodo.title,
      description: newTodo.description || "",
      time: newTodo.time,
      completed: false,
      category: newTodo.category,
      priority: newTodo.priority,
      reminder: newTodo.reminder
    };

    const dateKey = formatDateKey(selectedDate);
    setTodos(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), todoItem]
    }));

    // Schedule reminder if enabled
    if (todoItem.reminder) {
      scheduleReminder(todoItem, selectedDate);
    }

    setNewTodo({
      title: "",
      description: "",
      time: "",
      category: "study",
      priority: "medium",
      reminder: 15
    });
    setShowAddTodo(false);
  };

  const toggleTodo = (todoId) => {
    const dateKey = formatDateKey(selectedDate);
    setTodos(prev => ({
      ...prev,
      [dateKey]: prev[dateKey]?.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      ) || []
    }));
  };

  const deleteTodo = (todoId) => {
    const dateKey = formatDateKey(selectedDate);
    setTodos(prev => ({
      ...prev,
      [dateKey]: prev[dateKey]?.filter(todo => todo.id !== todoId) || []
    }));
  };

  const scheduleReminder = (todo, date) => {
    // In a real app, this would integrate with system notifications
    console.log(`Reminder scheduled for ${todo.title} on ${date.toDateString()} at ${todo.time}`);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'study': return <BookOpen className="w-4 h-4" />;
      case 'quiz': return <FileText className="w-4 h-4" />;
      case 'assignment': return <Target className="w-4 h-4" />;
      case 'meeting': return <Users className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'study': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'quiz': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'assignment': return 'bg-green-100 text-green-700 border-green-200';
      case 'meeting': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getCategoryDotColor = (category) => {
    switch (category) {
      case 'study': return '#7C3AED';
      case 'quiz': return '#06B6D4';
      case 'game': return '#EC4899';
      default: return '#64748B';
    }
  };

  const getPriorityPillStyle = (priority) => {
    switch (priority) {
      case 'high':   return { background: 'rgba(239,68,68,0.15)',  border: '1px solid rgba(239,68,68,0.35)',  color: '#FCA5A5' };
      case 'medium': return { background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', color: '#FCD34D' };
      case 'low':    return { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', color: '#6EE7B7' };
      default:       return { background: 'rgba(100,116,139,0.15)',border: '1px solid rgba(100,116,139,0.35)',color: '#94A3B8' };
    }
  };

  const selectedDateTodos = getTodosForDate(selectedDate);
  const completedTodos = selectedDateTodos.filter(todo => todo.completed).length;
  const totalTodos = selectedDateTodos.length;

  // ── Dark gaming calendar grid ────────────────────────────────────
  const renderCalendarDark = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const cells = [];

    // Leading empty cells (previous-month days shown as dimmed)
    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <div key={`empty-${i}`} className="aspect-square flex flex-col items-center justify-center">
          <span className="text-slate-700 text-sm"></span>
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayTodos = getTodosForDate(date);
      const hasTodos = dayTodos.length > 0;
      const todayCell = isToday(date);
      const selectedCell = isSameDate(date, selectedDate);

      let cellClass = "aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all text-slate-300 hover:bg-cyan-500/10 relative";
      let numClass = "text-sm font-medium leading-none";
      let cellStyle = {};

      if (selectedCell) {
        cellClass = "aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all relative";
        cellStyle = { background: '#06B6D4', boxShadow: '0 0 12px rgba(6,182,212,0.5)' };
        numClass = "text-sm font-bold text-white leading-none";
      } else if (todayCell) {
        cellClass = "aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all relative border border-cyan-500/40 text-cyan-300";
        cellStyle = { background: 'rgba(6,182,212,0.2)' };
        numClass = "text-sm font-bold leading-none";
      }

      cells.push(
        <div
          key={day}
          className={cellClass}
          style={cellStyle}
          onClick={() => setSelectedDate(date)}
        >
          <span className={numClass}>{day}</span>
          {hasTodos && (
            <span
              className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
              style={{ background: '#06B6D4' }}
            />
          )}
        </div>
      );
    }

    return cells;
  };

  return (
    <SidebarProvider>
      <StudentSidebar />
      <SidebarInset>
        {/* Root wrapper: dark bg + dot-grid */}
        <div className="h-screen flex flex-col dot-grid overflow-hidden" style={{ background: '#080D1A' }}>

          {/* ── Sticky Header ── */}
          <header
            className="flex items-center gap-4 px-6 py-3 shrink-0"
            style={{
              background: 'rgba(8,13,26,0.95)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(6,182,212,0.15)'
            }}
          >
            <SidebarTrigger className="text-slate-400 hover:text-white" />
            <h1 className="text-xl font-sora font-bold gradient-text-cyan flex items-center gap-2">
              <span>📅</span> Quest Calendar
            </h1>
          </header>

          {/* ── Main Content ── */}
          <div className="flex-1 overflow-hidden px-4 py-3 max-w-7xl w-full mx-auto">

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">

              {/* ─── LEFT: Calendar ─── */}
              <div className="lg:col-span-2 flex flex-col min-h-0">
                <div className="card-game p-4 flex flex-col flex-1 min-h-0">

                  {/* Month navigation */}
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="glass w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500/40 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <h2 className="font-sora font-bold text-white text-base">
                      {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>

                    <button
                      onClick={() => navigateMonth('next')}
                      className="glass w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500/40 transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Day-of-week headers */}
                  <div className="grid grid-cols-7 mb-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                      <div key={d} className="text-center text-xs text-slate-400 py-1 font-medium">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Day cells */}
                  <div className="grid grid-cols-7 gap-0.5 flex-1">
                    {renderCalendarDark()}
                  </div>

                  {/* Today button */}
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="glass text-xs text-slate-400 hover:text-cyan-300 px-3 py-1 rounded-lg transition-all"
                    >
                      Today
                    </button>
                  </div>
                </div>
              </div>

              {/* ─── RIGHT: Task Panel ─── */}
              <div className="flex flex-col gap-3 min-h-0 overflow-y-auto">

                {/* Task list card */}
                <div className="card-game p-4">
                  {/* Panel header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-sora font-bold text-white text-sm">
                        {selectedDate.toLocaleDateString('default', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </h3>
                      {totalTodos > 0 && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {completedTodos}/{totalTodos} quests done
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setShowAddTodo(true)}
                      className="btn-cyan flex items-center gap-1.5 px-2.5 py-1.5 text-xs"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  </div>

                  {/* Progress bar */}
                  {totalTodos > 0 && (
                    <div className="w-full h-1 rounded-full mb-3" style={{ background: 'rgba(15,22,41,0.8)' }}>
                      <div
                        className="xp-bar h-1 rounded-full transition-all"
                        style={{ width: `${(completedTodos / totalTodos) * 100}%` }}
                      />
                    </div>
                  )}

                  {/* Tasks */}
                  <div className="space-y-2">
                    {selectedDateTodos.length === 0 ? (
                      <div className="text-center py-4">
                        <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                        <p className="text-slate-500 text-xs mb-2">No quests for this day</p>
                        <button
                          onClick={() => setShowAddTodo(true)}
                          className="glass text-xs text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg transition-all"
                        >
                          Add your first quest
                        </button>
                      </div>
                    ) : (
                      selectedDateTodos
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map(todo => {
                          const priorityStyle = getPriorityPillStyle(todo.priority);
                          const dotColor = getCategoryDotColor(todo.category);
                          return (
                            <div
                              key={todo.id}
                              className="rounded-xl p-3 transition-all"
                              style={{
                                background: 'rgba(15,22,41,0.6)',
                                border: '1px solid rgba(99,102,241,0.15)',
                                opacity: todo.completed ? 0.6 : 1
                              }}
                            >
                              <div className="flex items-start gap-3">
                                {/* Custom checkbox */}
                                <button
                                  onClick={() => toggleTodo(todo.id)}
                                  className="mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                                  style={{
                                    borderColor: todo.completed ? '#06B6D4' : 'rgba(6,182,212,0.4)',
                                    background: todo.completed ? '#06B6D4' : 'transparent'
                                  }}
                                >
                                  {todo.completed && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </button>

                                {/* Category dot */}
                                <span
                                  className="mt-2 w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ background: dotColor }}
                                />

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <span
                                      className="text-sm font-medium text-white leading-snug"
                                      style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#64748B' : 'white' }}
                                    >
                                      {todo.title}
                                    </span>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      <button
                                        onClick={() => deleteTodo(todo.id)}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Time + badges row */}
                                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                    <span className="flex items-center gap-1 text-xs text-slate-500">
                                      <Clock className="w-3 h-3" />
                                      {todo.time}
                                    </span>

                                    <span
                                      className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                                      style={{
                                        background: dotColor + '22',
                                        border: `1px solid ${dotColor}55`,
                                        color: dotColor
                                      }}
                                    >
                                      {todo.category}
                                    </span>

                                    <span
                                      className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                                      style={priorityStyle}
                                    >
                                      {todo.priority}
                                    </span>

                                    {todo.reminder && (
                                      <span className="flex items-center gap-1 text-xs text-slate-600">
                                        <Bell className="w-3 h-3" />
                                        {todo.reminder}m
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>

                {/* Quick stats card */}
                <div className="card-game p-3">
                  <h4 className="font-sora font-bold text-white text-xs mb-2 flex items-center gap-2">
                    <span>📊</span> Day Overview
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {[
                      { label: 'Total', value: totalTodos, color: '#06B6D4' },
                      { label: 'Done',  value: completedTodos, color: '#10B981' },
                      { label: 'Left',  value: totalTodos - completedTodos, color: '#06B6D4' },
                      { label: 'Progress', value: `${totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0}%`, color: '#F59E0B' }
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{label}</span>
                        <span className="text-xs font-bold" style={{ color }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Add Quest Modal ── */}
          {showAddTodo && (
            <div
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
              style={{ background: 'rgba(0,0,0,0.7)' }}
            >
              <div className="card-game w-full max-w-md p-6 animate-slide-up">
                {/* Modal header */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.35)' }}
                  >
                    <Plus className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-sora font-bold text-white">Add New Quest</h3>
                    <p className="text-xs text-slate-500">
                      {selectedDate.toLocaleDateString('default', { month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-medium">Quest Title *</label>
                    <input
                      className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
                      style={{
                        background: 'rgba(15,22,41,0.8)',
                        border: '1px solid rgba(99,102,241,0.25)',
                        color: 'white'
                      }}
                      onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(6,182,212,0.3)')}
                      onBlur={e => (e.target.style.boxShadow = 'none')}
                      value={newTodo.title}
                      onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Study Mathematics"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-medium">Description</label>
                    <textarea
                      className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all resize-none"
                      style={{
                        background: 'rgba(15,22,41,0.8)',
                        border: '1px solid rgba(99,102,241,0.25)',
                        color: 'white'
                      }}
                      onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(6,182,212,0.3)')}
                      onBlur={e => (e.target.style.boxShadow = 'none')}
                      rows={2}
                      value={newTodo.description}
                      onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Additional details..."
                    />
                  </div>

                  {/* Time + Category */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-medium">Time *</label>
                      <input
                        type="time"
                        className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
                        style={{
                          background: 'rgba(15,22,41,0.8)',
                          border: '1px solid rgba(99,102,241,0.25)',
                          color: 'white',
                          colorScheme: 'dark'
                        }}
                        onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(6,182,212,0.3)')}
                        onBlur={e => (e.target.style.boxShadow = 'none')}
                        value={newTodo.time}
                        onChange={(e) => setNewTodo(prev => ({ ...prev, time: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-medium">Category</label>
                      <Select
                        value={newTodo.category}
                        onValueChange={(value) => setNewTodo(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger
                          className="rounded-xl text-sm"
                          style={{
                            background: 'rgba(15,22,41,0.8)',
                            border: '1px solid rgba(99,102,241,0.25)',
                            color: 'white'
                          }}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="study">📚 Study</SelectItem>
                          <SelectItem value="quiz">📝 Quiz</SelectItem>
                          <SelectItem value="assignment">🎯 Assignment</SelectItem>
                          <SelectItem value="meeting">👥 Meeting</SelectItem>
                          <SelectItem value="personal">⭐ Personal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Priority + Reminder */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-medium">Priority</label>
                      <Select
                        value={newTodo.priority}
                        onValueChange={(value) => setNewTodo(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger
                          className="rounded-xl text-sm"
                          style={{
                            background: 'rgba(15,22,41,0.8)',
                            border: '1px solid rgba(99,102,241,0.25)',
                            color: 'white'
                          }}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">🟢 Low</SelectItem>
                          <SelectItem value="medium">🟡 Medium</SelectItem>
                          <SelectItem value="high">🔴 High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-medium">Reminder</label>
                      <Select
                        value={newTodo.reminder?.toString()}
                        onValueChange={(value) => setNewTodo(prev => ({ ...prev, reminder: value ? parseInt(value) : undefined }))}
                      >
                        <SelectTrigger
                          className="rounded-xl text-sm"
                          style={{
                            background: 'rgba(15,22,41,0.8)',
                            border: '1px solid rgba(99,102,241,0.25)',
                            color: 'white'
                          }}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 min before</SelectItem>
                          <SelectItem value="10">10 min before</SelectItem>
                          <SelectItem value="15">15 min before</SelectItem>
                          <SelectItem value="30">30 min before</SelectItem>
                          <SelectItem value="60">1 hour before</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowAddTodo(false)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 transition-all"
                      style={{
                        background: 'rgba(15,22,41,0.8)',
                        border: '1px solid rgba(99,102,241,0.2)'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addTodo}
                      className="btn-cyan flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Quest
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Calendar;
