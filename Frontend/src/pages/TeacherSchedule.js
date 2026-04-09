import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/simplebutton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import { Plus, Clock, Users, BookOpen, Edit2, Trash2, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import TeacherSidebar from "../components/TeacherSidebar";

const TeacherSchedule = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Teacher";
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduleItems, setScheduleItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    type: 'class',
    title: '',
    subject: '',
    class: '',
    startTime: '',
    endTime: '',
    description: '',
    location: '',
    materials: [],
    studentCount: 0
  });

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  // Sample schedule data with school assignments
  const sampleScheduleData = {
    '2024-09-13': [
      {
        id: 1,
        type: 'class',
        title: 'Mathematics - Class 8A',
        subject: 'Mathematics',
        class: '8A',
        startTime: '09:00',
        endTime: '09:45',
        description: 'Algebra: Linear equations and problem solving',
        status: 'scheduled',
        studentCount: 25,
        location: 'Room 101',
        materials: ['Textbook Ch. 5', 'Worksheets', 'Calculator']
      },
      {
        id: 2,
        type: 'assignment',
        title: 'Grade Physics Assignments',
        subject: 'Physics',
        class: 'Multiple',
        startTime: '10:00',
        endTime: '11:00',
        description: 'Grade Chapter 3 assignments from Classes 9A and 9B',
        status: 'in-progress',
        studentCount: 45,
        location: 'Staff Room',
        materials: ['Answer Key', 'Grade Sheet']
      },
      {
        id: 3,
        type: 'class',
        title: 'Science - Class 7B',
        subject: 'Science',
        class: '7B',
        startTime: '11:15',
        endTime: '12:00',
        description: 'Biology: Plant and Animal Cells - Microscope Lab',
        status: 'scheduled',
        studentCount: 22,
        location: 'Lab 2',
        materials: ['Microscopes', 'Slides', 'Lab Manual']
      },
      {
        id: 4,
        type: 'meeting',
        title: 'Parent-Teacher Conference Prep',
        subject: 'Administration',
        class: 'All Classes',
        startTime: '14:00',
        endTime: '15:00',
        description: 'Prepare reports and discussion points for upcoming conferences',
        status: 'scheduled',
        studentCount: 0,
        location: 'Conference Room',
        materials: ['Student Reports', 'Progress Charts']
      },
      {
        id: 5,
        type: 'class',
        title: 'Chemistry - Class 10A',
        subject: 'Chemistry',
        class: '10A',
        startTime: '15:15',
        endTime: '16:00',
        description: 'Periodic Table and Chemical Bonding',
        status: 'scheduled',
        studentCount: 28,
        location: 'Room 203',
        materials: ['Periodic Table Chart', 'Textbook Ch. 8']
      }
    ],
    '2024-09-14': [
      {
        id: 6,
        type: 'class',
        title: 'Mathematics - Class 7A',
        subject: 'Mathematics',
        class: '7A',
        startTime: '09:00',
        endTime: '09:45',
        description: 'Geometry: Angles and Triangles',
        status: 'scheduled',
        studentCount: 24,
        location: 'Room 105',
        materials: ['Geometry Set', 'Protractor', 'Textbook Ch. 6']
      },
      {
        id: 7,
        type: 'assignment',
        title: 'Create Quiz Questions',
        subject: 'Science',
        class: 'Class 8',
        startTime: '10:30',
        endTime: '11:30',
        description: 'Prepare quiz questions for upcoming test on Electricity',
        status: 'scheduled',
        studentCount: 0,
        location: 'Staff Room',
        materials: ['Question Bank', 'Curriculum Guide']
      },
      {
        id: 8,
        type: 'class',
        title: 'Physics - Class 9B',
        subject: 'Physics',
        class: '9B',
        startTime: '13:00',
        endTime: '13:45',
        description: 'Motion and Force - Practical Demonstrations',
        status: 'scheduled',
        studentCount: 26,
        location: 'Physics Lab',
        materials: ['Spring Balance', 'Weights', 'Measuring Tape']
      }
    ]
  };

  // Load schedule for selected date
  useEffect(() => {
    const dateSchedule = sampleScheduleData[selectedDate] || [];
    setScheduleItems(dateSchedule);
  }, [selectedDate]);

  const getTypeColor = (type) => {
    switch (type) {
      case 'class': return 'bg-blue-500';
      case 'assignment': return 'bg-emerald-500';
      case 'meeting': return 'bg-violet-500';
      default: return 'bg-slate-500';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'class': return <BookOpen className="w-4 h-4" />;
      case 'assignment': return <Edit2 className="w-4 h-4" />;
      case 'meeting': return <Users className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-yellow-600';
      case 'scheduled': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Get today's date for comparison
  const today = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === today;

  // Form handling functions
  const resetForm = () => {
    setFormData({
      type: 'class',
      title: '',
      subject: '',
      class: '',
      startTime: '',
      endTime: '',
      description: '',
      location: '',
      materials: [],
      studentCount: 0
    });
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now(),
      status: 'scheduled',
      materials: typeof formData.materials === 'string' 
        ? formData.materials.split(',').map(m => m.trim()).filter(m => m)
        : formData.materials
    };

    if (editingItem) {
      setScheduleItems(prev => prev.map(item => 
        item.id === editingItem.id ? newItem : item
      ));
    } else {
      setScheduleItems(prev => [...prev, newItem]);
    }
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      ...item,
      materials: Array.isArray(item.materials) ? item.materials.join(', ') : item.materials || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Are you sure you want to delete this schedule item?')) {
      setScheduleItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const handleStatusChange = (itemId, newStatus) => {
    setScheduleItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, status: newStatus } : item
    ));
  };

  const typeGlow = { class: "59,130,246", assignment: "16,185,129", meeting: "124,58,237" };
  const statusStyle = {
    completed: { color: "#10B981", bg: "rgba(16,185,129,0.15)" },
    'in-progress': { color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
    scheduled: { color: "#06B6D4", bg: "rgba(6,182,212,0.15)" }
  };

  return (
    <SidebarProvider>
      <TeacherSidebar />
      <SidebarInset className="overflow-x-hidden">
        <div className="min-h-screen" style={{ background: "#080D1A" }}>
          {/* Dot grid */}
          <div className="fixed inset-0 pointer-events-none" style={{
            backgroundImage: "radial-gradient(rgba(16,185,129,0.1) 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }} />

          {/* Header */}
          <header className="sticky top-0 z-50" style={{ background: "rgba(8,13,26,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(16,185,129,0.15)" }}>
            <div className="px-4 py-4 flex items-center justify-between min-w-0">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <SidebarTrigger className="text-slate-400 hover:text-white" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <h1 className="text-lg font-bold text-white" style={{ fontFamily: "Sora, sans-serif" }}>
                    Schedule <span style={{ background: "linear-gradient(90deg,#10B981,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Management</span>
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-slate-300 text-sm">{userName}</span>
                <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-slate-400 border text-sm hover:text-white transition-colors" style={{ borderColor: "rgba(16,185,129,0.3)" }}>
                  Logout
                </button>
              </div>
            </div>
          </header>

          <div className="relative z-10 px-4 py-6 sm:py-8 w-full">
            {/* Page header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Teacher Portal</span>
                <h2 className="text-3xl font-bold text-white mt-1" style={{ fontFamily: "Sora, sans-serif" }}>
                  📅 Daily <span style={{ background: "linear-gradient(90deg,#10B981,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Schedule</span>
                </h2>
                <p className="text-slate-400 mt-1">Manage your classes, assignments, and meetings</p>
              </div>
              <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold transition-all hover:scale-105" style={{ background: "linear-gradient(135deg,#10B981,#059669)", boxShadow: "0 0 20px rgba(16,185,129,0.4)" }}>
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            {/* Date Selector */}
            <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl" style={{ background: "rgba(15,22,41,0.75)", border: "1px solid rgba(99,102,241,0.15)" }}>
              <label className="text-slate-300 font-medium text-sm">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 rounded-lg text-white text-sm focus:outline-none"
                style={{ background: "rgba(8,13,26,0.8)", border: "1px solid rgba(16,185,129,0.3)", colorScheme: "dark" }}
              />
              {isToday && (
                <span className="text-xs px-2 py-1 rounded-full text-emerald-400" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
                  Today
                </span>
              )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Classes", icon: <BookOpen className="w-5 h-5" />, color: "59,130,246", value: scheduleItems.filter(i => i.type === 'class').length },
                { label: "Assignments", icon: <Edit2 className="w-5 h-5" />, color: "16,185,129", value: scheduleItems.filter(i => i.type === 'assignment').length },
                { label: "Meetings", icon: <Users className="w-5 h-5" />, color: "124,58,237", value: scheduleItems.filter(i => i.type === 'meeting').length },
                { label: "Total Hours", icon: <Clock className="w-5 h-5" />, color: "245,158,11", value: scheduleItems.reduce((t, i) => {
                  const s = new Date(`2000-01-01T${i.startTime}`), e = new Date(`2000-01-01T${i.endTime}`);
                  return t + (e - s) / (1000 * 60 * 60);
                }, 0).toFixed(1) + "h" }
              ].map((s, i) => (
                <div key={i} className="rounded-2xl p-4 transition-all hover:scale-105" style={{ background: "rgba(15,22,41,0.75)", border: "1px solid rgba(99,102,241,0.15)" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 20px rgba(${s.color},0.25)`}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `rgba(${s.color},0.15)`, color: `rgb(${s.color})` }}>
                    {s.icon}
                  </div>
                  <p className="text-slate-400 text-xs">{s.label}</p>
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: "Sora, sans-serif" }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <h3 className="text-white font-bold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
              📋 Schedule for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>

            {scheduleItems.length === 0 ? (
              <div className="rounded-2xl p-12 text-center" style={{ background: "rgba(15,22,41,0.75)", border: "1px solid rgba(99,102,241,0.15)" }}>
                <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <h3 className="text-white font-semibold mb-2">No schedule items</h3>
                <p className="text-slate-400 mb-6 text-sm">Nothing scheduled for this date yet.</p>
                <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-white font-semibold" style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
                  <Plus className="w-4 h-4" /> Add First Item
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduleItems.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((item) => {
                  const glow = typeGlow[item.type] || "99,102,241";
                  const ss = statusStyle[item.status] || { color: "#94a3b8", bg: "rgba(148,163,184,0.1)" };
                  return (
                    <div key={item.id} className="rounded-2xl overflow-hidden transition-all hover:scale-[1.005]" style={{ background: "rgba(15,22,41,0.75)", border: "1px solid rgba(99,102,241,0.15)" }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 25px rgba(${glow},0.2)`}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                    >
                      <div className="h-1" style={{ background: `linear-gradient(90deg, rgb(${glow}), transparent)` }} />
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: `rgba(${glow},0.2)`, border: `1px solid rgba(${glow},0.3)`, color: `rgb(${glow})` }}>
                              {getTypeIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="text-white font-semibold">{item.title}</h3>
                                <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: `rgba(${glow},0.15)`, color: `rgb(${glow})`, border: `1px solid rgba(${glow},0.3)` }}>{item.type}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1 capitalize" style={{ background: ss.bg, color: ss.color }}>
                                  {getStatusIcon(item.status)}{item.status}
                                </span>
                              </div>
                              <p className="text-slate-400 text-sm mb-3">{item.description}</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                {[["⏰ Time", `${item.startTime} – ${item.endTime}`], ["📚 Subject", item.subject], ["🏫 Class", item.class], ["📍 Location", item.location]].map(([k,v]) => (
                                  <div key={k}>
                                    <span className="text-slate-500">{k}</span>
                                    <p className="text-slate-200 font-medium mt-0.5">{v}</p>
                                  </div>
                                ))}
                              </div>
                              {item.studentCount > 0 && (
                                <div className="flex items-center gap-1 mt-3 text-slate-400 text-sm">
                                  <Users className="w-4 h-4" />{item.studentCount} students
                                </div>
                              )}
                              {item.materials?.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1">
                                  {item.materials.map((m, idx) => (
                                    <span key={idx} className="text-xs px-2 py-0.5 rounded-full text-slate-300" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>{m}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <select
                              value={item.status}
                              onChange={(e) => handleStatusChange(item.id, e.target.value)}
                              className="px-2 py-1 text-xs rounded-lg text-slate-200 focus:outline-none"
                              style={{ background: "rgba(8,13,26,0.8)", border: "1px solid rgba(99,102,241,0.3)", colorScheme: "dark" }}
                            >
                              <option value="scheduled">Scheduled</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                            <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add/Edit Schedule Item Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-[#1E293B]/60 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">
                    {editingItem ? 'Edit Schedule Item' : 'Add Schedule Item'}
                  </h3>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Type Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    >
                      <option value="class">Class</option>
                      <option value="assignment">Assignment/Work</option>
                      <option value="meeting">Meeting</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-400"
                      placeholder="Enter title..."
                      required
                    />
                  </div>

                  {/* Subject and Class (Grid) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Subject</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      >
                        <option value="">Select Subject</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="English">English</option>
                        <option value="History">History</option>
                        <option value="Geography">Geography</option>
                        <option value="Administration">Administration</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Class</label>
                      <input
                        type="text"
                        value={formData.class}
                        onChange={(e) => handleInputChange('class', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-400"
                        placeholder="e.g., 8A, 9B, All Classes"
                        required
                      />
                    </div>
                  </div>

                  {/* Time (Grid) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Start Time</label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">End Time</label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-400"
                      rows="3"
                      placeholder="Enter description..."
                      required
                    />
                  </div>

                  {/* Location and Student Count (Grid) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-400"
                        placeholder="Room 101, Lab 2, etc."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Student Count</label>
                      <input
                        type="number"
                        value={formData.studentCount}
                        onChange={(e) => handleInputChange('studentCount', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-400"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Materials */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Materials (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.materials}
                      onChange={(e) => handleInputChange('materials', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-400"
                      placeholder="Textbook, Worksheets, Calculator"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetForm}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                    >
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default TeacherSchedule;