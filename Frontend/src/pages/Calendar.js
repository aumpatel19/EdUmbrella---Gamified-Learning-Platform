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

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayTodos = getTodosForDate(date);
      const hasActiveTodos = dayTodos.some(todo => !todo.completed);

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 transition-colors ${
            isToday(date) ? 'bg-blue-50 border-blue-300' : ''
          } ${
            isSameDate(date, selectedDate) ? 'ring-2 ring-blue-500 bg-blue-100' : ''
          }`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium ${isToday(date) ? 'text-blue-600' : ''}`}>
              {day}
            </span>
            {hasActiveTodos && (
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </div>
          <div className="space-y-1 mt-1">
            {dayTodos.slice(0, 2).map(todo => (
              <div
                key={todo.id}
                className={`text-xs p-1 rounded truncate ${getCategoryColor(todo.category)} ${
                  todo.completed ? 'opacity-50 line-through' : ''
                }`}
              >
                {todo.time} - {todo.title}
              </div>
            ))}
            {dayTodos.length > 2 && (
              <div className="text-xs text-gray-500">+{dayTodos.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const selectedDateTodos = getTodosForDate(selectedDate);
  const completedTodos = selectedDateTodos.filter(todo => todo.completed).length;
  const totalTodos = selectedDateTodos.length;

  return (
    <SidebarProvider>
      <StudentSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-[#F8FAFC]">
          {/* Header */}
          <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div className="w-8 h-8 rounded-full bg-[#1D4ED8] flex items-center justify-center">
                  <span className="text-lg">📅</span>
                </div>
                <h1 className="text-xl font-bold text-[#1E293B]">
                  EdUmbrella - Calendar & Tasks
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
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">📅 Calendar & Task Manager</h2>
              <p className="text-muted-foreground">
                Organize your study schedule, set reminders, and track your daily tasks
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar Section */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateMonth('prev')}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <CardTitle>
                          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateMonth('next')}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        onClick={() => setCurrentDate(new Date())}
                        variant="outline"
                        size="sm"
                      >
                        Today
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-0 mb-4">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="h-8 border border-gray-200 bg-gray-50 flex items-center justify-center text-sm font-medium">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-0">
                      {renderCalendar()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Todo List Section */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <CalendarIcon className="w-5 h-5" />
                          {selectedDate.toLocaleDateString('default', { 
                            weekday: 'long',
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </CardTitle>
                        <CardDescription>
                          {totalTodos > 0 ? (
                            `${completedTodos}/${totalTodos} tasks completed`
                          ) : (
                            "No tasks for this day"
                          )}
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setShowAddTodo(true)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {totalTodos > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${(completedTodos / totalTodos) * 100}%` }}
                        />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedDateTodos.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No tasks scheduled for this day</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setShowAddTodo(true)}
                        >
                          Add your first task
                        </Button>
                      </div>
                    ) : (
                      selectedDateTodos
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map(todo => (
                          <div
                            key={todo.id}
                            className={`p-3 border rounded-lg ${getPriorityColor(todo.priority)} border-l-4 ${
                              todo.completed ? 'opacity-60' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={todo.completed}
                                onCheckedChange={() => toggleTodo(todo.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className={`font-medium ${todo.completed ? 'line-through' : ''}`}>
                                    {todo.title}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteTodo(todo.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                {todo.description && (
                                  <p className={`text-sm text-muted-foreground mt-1 ${
                                    todo.completed ? 'line-through' : ''
                                  }`}>
                                    {todo.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className={getCategoryColor(todo.category)}>
                                    {getCategoryIcon(todo.category)}
                                    <span className="ml-1 capitalize">{todo.category}</span>
                                  </Badge>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    {todo.time}
                                  </div>
                                  {todo.reminder && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <Bell className="w-3 h-3" />
                                      {todo.reminder}m
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📊 Today's Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Tasks</span>
                        <span className="font-medium">{totalTodos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Completed</span>
                        <span className="font-medium text-green-600">{completedTodos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Remaining</span>
                        <span className="font-medium text-blue-600">{totalTodos - completedTodos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Progress</span>
                        <span className="font-medium">
                          {totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Add Todo Modal */}
            {showAddTodo && (
              <div className="fixed inset-0 bg-[#1E293B]/50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Add New Task
                    </CardTitle>
                    <CardDescription>
                      Schedule a task for {selectedDate.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Task Title *</Label>
                      <Input
                        id="title"
                        value={newTodo.title}
                        onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Study Mathematics"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newTodo.description}
                        onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Additional details..."
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="time">Time *</Label>
                        <Input
                          id="time"
                          type="time"
                          value={newTodo.time}
                          onChange={(e) => setNewTodo(prev => ({ ...prev, time: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newTodo.category}
                          onValueChange={(value) => setNewTodo(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={newTodo.priority}
                          onValueChange={(value) => setNewTodo(prev => ({ ...prev, priority: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">🟢 Low</SelectItem>
                            <SelectItem value="medium">🟡 Medium</SelectItem>
                            <SelectItem value="high">🔴 High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reminder">Reminder</Label>
                        <Select
                          value={newTodo.reminder?.toString()}
                          onValueChange={(value) => setNewTodo(prev => ({ ...prev, reminder: value ? parseInt(value) : undefined }))}
                        >
                          <SelectTrigger>
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

                    <div className="flex gap-2 pt-4">
                      <Button onClick={addTodo} className="flex-1">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddTodo(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Calendar;