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
      case 'assignment': return 'bg-green-500';
      case 'meeting': return 'bg-purple-500';
      default: return 'bg-gray-500';
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

  return (
    <SidebarProvider>
      <TeacherSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-[#F8FAFC]">
          {/* Header */}
          <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div className="w-8 h-8 rounded-full bg-[#1D4ED8] flex items-center justify-center">
                  <Calendar className="text-lg text-white" />
                </div>
                <h1 className="text-xl font-bold font-bold text-[#1E293B]">
                  Schedule Management
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{userName}</span>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            {/* Schedule Controls */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">📅 Daily Schedule</h2>
                  <p className="text-muted-foreground">
                    Manage your classes, assignments, and meetings
                  </p>
                </div>
                <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Schedule Item
                </Button>
              </div>

              {/* Date Selector */}
              <div className="flex items-center gap-4 mb-6">
                <label className="font-medium">Select Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {isToday && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Today
                  </Badge>
                )}
              </div>
            </div>

            {/* Schedule Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Classes</p>
                      <p className="text-2xl font-bold">
                        {scheduleItems.filter(item => item.type === 'class').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Edit2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Assignments</p>
                      <p className="text-2xl font-bold">
                        {scheduleItems.filter(item => item.type === 'assignment').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Meetings</p>
                      <p className="text-2xl font-bold">
                        {scheduleItems.filter(item => item.type === 'meeting').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Hours</p>
                      <p className="text-2xl font-bold">
                        {scheduleItems.reduce((total, item) => {
                          const start = new Date(`2000-01-01T${item.startTime}`);
                          const end = new Date(`2000-01-01T${item.endTime}`);
                          return total + (end - start) / (1000 * 60 * 60);
                        }, 0).toFixed(1)}h
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Schedule Timeline */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">📋 Schedule for {new Date(selectedDate).toLocaleDateString()}</h3>
              
              {scheduleItems.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No schedule items</h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have any classes or activities scheduled for this date.
                    </p>
                    <Button onClick={() => setShowAddForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Item
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {scheduleItems
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((item) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className={`h-1 ${getTypeColor(item.type)}`} />
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className={`w-12 h-12 rounded-lg ${getTypeColor(item.type)} flex items-center justify-center text-white`}>
                                {getTypeIcon(item.type)}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg">{item.title}</h3>
                                  <Badge variant="outline" className="capitalize">
                                    {item.type}
                                  </Badge>
                                  <div className={`flex items-center gap-1 ${getStatusColor(item.status)}`}>
                                    {getStatusIcon(item.status)}
                                    <span className="text-sm capitalize">{item.status}</span>
                                  </div>
                                </div>
                                
                                <p className="text-muted-foreground mb-3">{item.description}</p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Time:</span>
                                    <p className="font-medium">{item.startTime} - {item.endTime}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Subject:</span>
                                    <p className="font-medium">{item.subject}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Class:</span>
                                    <p className="font-medium">{item.class}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Location:</span>
                                    <p className="font-medium">{item.location}</p>
                                  </div>
                                </div>

                                {item.studentCount > 0 && (
                                  <div className="flex items-center gap-2 mt-3">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">{item.studentCount} students</span>
                                  </div>
                                )}

                                {item.materials && item.materials.length > 0 && (
                                  <div className="mt-3">
                                    <span className="text-sm text-muted-foreground">Materials needed:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {item.materials.map((material, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {material}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              {/* Status Change Dropdown */}
                              <select
                                value={item.status}
                                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                className="px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="scheduled">Scheduled</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </select>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(item)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>
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