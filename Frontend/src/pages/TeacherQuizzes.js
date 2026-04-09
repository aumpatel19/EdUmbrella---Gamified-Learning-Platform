import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/simplebutton";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import TeacherSidebar from "../components/TeacherSidebar";
import {
  FileText,
  Plus,
  Send,
  Edit,
  Trash2,
  Clock,
  Users,
  CheckCircle,
  PlayCircle,
  Copy,
  Eye
} from "lucide-react";
import ApiService from "../api";

const TeacherQuizzes = () => {
  const [activeTab, setActiveTab] = useState("prebuilt");
  const [prebuiltQuizzes, setPrebuiltQuizzes] = useState([]);
  const [customQuizzes, setCustomQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createQuizOpen, setCreateQuizOpen] = useState(false);

  // Quiz creation state
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quizSubject, setQuizSubject] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchPrebuiltQuizzes();
    fetchCustomQuizzes();
  }, []);

  const fetchPrebuiltQuizzes = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getTeacherQuizzes();
      setPrebuiltQuizzes(response.quizzes || []);
    } catch (error) {
      console.error("Error fetching prebuilt quizzes:", error);
      setPrebuiltQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomQuizzes = async () => {
    try {
      // Load teacher-created quizzes from localStorage
      const savedQuizzes = JSON.parse(localStorage.getItem('teacherCreatedQuizzes') || '[]');

      // Transform the data to match the expected format
      const formattedQuizzes = savedQuizzes.map(quiz => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        subject: quiz.subject_name,
        questions: quiz.total_questions || (quiz.questions ? quiz.questions.length : 0), // Use total_questions or count questions array
        duration: quiz.duration_minutes,
        status: quiz.status,
        responses: quiz.responses || 0,
        created: quiz.created_at ? new Date(quiz.created_at) : new Date(),
        teacher_created: true
      }));

      setCustomQuizzes(formattedQuizzes);
    } catch (error) {
      console.error("Error fetching custom quizzes:", error);
      setCustomQuizzes([]);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (questionId, field, value) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const updateQuestionOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
        : q
    ));
  };

  const removeQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const saveCustomQuiz = async () => {
    try {
      const newQuiz = {
        title: quizTitle,
        description: quizDescription,
        subject: quizSubject,
        questions: questions,
        duration: questions.length * 2, // 2 minutes per question
        status: "Draft",
        responses: 0,
        created: new Date()
      };

      // Here you would send to API
      console.log("Saving quiz:", newQuiz);

      // Update local state
      setCustomQuizzes([...customQuizzes, { ...newQuiz, id: Date.now() }]);

      // Reset form
      setQuizTitle("");
      setQuizDescription("");
      setQuizSubject("");
      setQuestions([]);
      setCreateQuizOpen(false);

      alert("Quiz created successfully!");
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Error creating quiz. Please try again.");
    }
  };

  const sendQuizToStudents = async (quizId, isPrebuilt = false) => {
    try {
      if (isPrebuilt) {
        // For prebuilt quizzes, we can't modify them, so just show a message
        alert("Prebuilt quizzes are already available to all students!");
        return;
      }

      // For custom quizzes, ensure they are properly stored and available
      const savedQuizzes = JSON.parse(localStorage.getItem('teacherCreatedQuizzes') || '[]');
      const quizIndex = savedQuizzes.findIndex(quiz => quiz.id === quizId);

      if (quizIndex !== -1) {
        // Update the quiz status to ensure it's available to students
        savedQuizzes[quizIndex].status = "Published";
        savedQuizzes[quizIndex].available_to_students = true;

        // Save back to localStorage
        localStorage.setItem('teacherCreatedQuizzes', JSON.stringify(savedQuizzes));

        // Refresh the custom quizzes list
        fetchCustomQuizzes();

        alert("Quiz sent to students successfully! Students can now access this quiz in their portal.");
      } else {
        alert("Quiz not found. Please try again.");
      }
    } catch (error) {
      console.error("Error sending quiz:", error);
      alert("Error sending quiz. Please try again.");
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyAccent = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return { bg: "rgba(16,185,129,0.15)", color: "#10B981", border: "rgba(16,185,129,0.4)" };
      case 'medium': return { bg: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "rgba(245,158,11,0.4)" };
      case 'hard': return { bg: "rgba(236,72,153,0.15)", color: "#EC4899", border: "rgba(236,72,153,0.4)" };
      default: return { bg: "rgba(148,163,184,0.1)", color: "#94A3B8", border: "rgba(148,163,184,0.3)" };
    }
  };

  const getStatusAccent = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return { bg: "rgba(16,185,129,0.15)", color: "#10B981", border: "rgba(16,185,129,0.4)" };
      case 'published': return { bg: "rgba(6,182,212,0.15)", color: "#06B6D4", border: "rgba(6,182,212,0.4)" };
      case 'draft': return { bg: "rgba(148,163,184,0.1)", color: "#94A3B8", border: "rgba(148,163,184,0.3)" };
      case 'completed': return { bg: "rgba(148,163,184,0.1)", color: "#94A3B8", border: "rgba(148,163,184,0.3)" };
      default: return { bg: "rgba(148,163,184,0.1)", color: "#94A3B8", border: "rgba(148,163,184,0.3)" };
    }
  };

  const subjectBorderColors = {
    mathematics: "#06B6D4",
    science: "#10B981",
    english: "#7C3AED",
    physics: "#F59E0B",
    chemistry: "#EC4899",
    biology: "#10B981",
    history: "#F59E0B",
  };

  const getSubjectBorder = (subject) =>
    subjectBorderColors[(subject || "").toLowerCase()] || "#475569";

  return (
    <SidebarProvider>
      <TeacherSidebar />
      <SidebarInset className="overflow-x-hidden">
        <div
          className="min-h-screen dot-grid"
          style={{ background: "#080D1A" }}
        >
          {/* Header */}
          <header
            className="sticky top-0 z-50"
            style={{
              background: "rgba(8,13,26,0.95)",
              backdropFilter: "blur(16px)",
              borderBottom: "1px solid rgba(16,185,129,0.15)",
            }}
          >
            <div className="w-full px-4 py-4 flex items-center justify-between min-w-0">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <SidebarTrigger className="md:hidden" style={{ color: "#10B981" }} />
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #10B981, #059669)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 16px rgba(16,185,129,0.5)",
                  }}
                >
                  <FileText style={{ width: 16, height: 16, color: "#fff" }} />
                </div>
                <h1
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontWeight: 800,
                    fontSize: 20,
                    background: "linear-gradient(90deg, #10B981, #06B6D4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ⚡ Quiz Manager
                </h1>
              </div>
              <Dialog open={createQuizOpen} onOpenChange={setCreateQuizOpen}>
                <DialogTrigger asChild>
                  <button
                    style={{
                      background: "linear-gradient(135deg, #10B981, #059669)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "0.6rem",
                      padding: "9px 18px",
                      fontWeight: 700,
                      fontFamily: "Sora, sans-serif",
                      fontSize: 13,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      boxShadow: "0 0 18px rgba(16,185,129,0.4)",
                    }}
                  >
                    <Plus style={{ width: 14, height: 14 }} />
                    Create New Quiz
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Quiz</DialogTitle>
                    <DialogDescription>
                      Design your custom quiz with questions and options
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quiz-title">Quiz Title</Label>
                        <Input
                          id="quiz-title"
                          value={quizTitle}
                          onChange={(e) => setQuizTitle(e.target.value)}
                          placeholder="Enter quiz title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quiz-subject">Subject</Label>
                        <Select value={quizSubject} onValueChange={setQuizSubject}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mathematics">Mathematics</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="physics">Physics</SelectItem>
                            <SelectItem value="chemistry">Chemistry</SelectItem>
                            <SelectItem value="biology">Biology</SelectItem>
                            <SelectItem value="history">History</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="quiz-description">Description</Label>
                      <Textarea
                        id="quiz-description"
                        value={quizDescription}
                        onChange={(e) => setQuizDescription(e.target.value)}
                        placeholder="Enter quiz description"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Questions</h3>
                        <Button onClick={addQuestion} variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Question
                        </Button>
                      </div>

                      {questions.map((question, index) => (
                        <Card key={question.id}>
                          <CardHeader>
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base">Question {index + 1}</CardTitle>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeQuestion(question.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label>Question Text</Label>
                              <Textarea
                                value={question.question}
                                onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                                placeholder="Enter your question"
                                rows={2}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Answer Options</Label>
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`correct-${question.id}`}
                                    checked={question.correctAnswer === optIndex}
                                    onChange={() => updateQuestion(question.id, 'correctAnswer', optIndex)}
                                  />
                                  <Input
                                    value={option}
                                    onChange={(e) => updateQuestionOption(question.id, optIndex, e.target.value)}
                                    placeholder={`Option ${optIndex + 1}`}
                                  />
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              <Label htmlFor={`points-${question.id}`}>Points:</Label>
                              <Input
                                id={`points-${question.id}`}
                                type="number"
                                min="1"
                                max="10"
                                value={question.points}
                                onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value) || 1)}
                                className="w-20"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setCreateQuizOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={saveCustomQuiz}
                        disabled={!quizTitle || !quizSubject || questions.length === 0}
                      >
                        Save Quiz
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <div className="w-full px-4 py-6 sm:py-8">
            {/* Page Title */}
            <div className="mb-8 animate-slide-up">
              <h2
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 800,
                  fontSize: 28,
                  marginBottom: 8,
                  background: "linear-gradient(90deg, #10B981, #06B6D4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ⚡ Quiz Management
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
                Manage prebuilt quizzes and create custom quizzes for your students
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList
                className="grid w-full grid-cols-2"
                style={{
                  background: "rgba(15,22,41,0.75)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "0.75rem",
                  padding: "4px",
                }}
              >
                <TabsTrigger
                  value="prebuilt"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  Prebuilt Quizzes
                </TabsTrigger>
                <TabsTrigger
                  value="custom"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  My Custom Quizzes
                </TabsTrigger>
              </TabsList>

              {/* Prebuilt Quizzes */}
              <TabsContent value="prebuilt" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {prebuiltQuizzes.map((quiz) => {
                    const diff = getDifficultyAccent(quiz.difficulty);
                    const subjectBorder = getSubjectBorder(quiz.subject);
                    return (
                      <div
                        key={quiz.id}
                        className="card-game animate-slide-up"
                        style={{
                          padding: "22px",
                          borderColor: `${subjectBorder}33`,
                          boxShadow: `0 0 20px ${subjectBorder}14`,
                        }}
                      >
                        {/* Title + Difficulty */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                          <h4
                            style={{
                              fontFamily: "Sora, sans-serif",
                              fontWeight: 700,
                              color: "#fff",
                              fontSize: 14,
                              lineHeight: 1.4,
                              flex: 1,
                              marginRight: 8,
                            }}
                          >
                            {quiz.title}
                          </h4>
                          <span
                            style={{
                              background: diff.bg,
                              color: diff.color,
                              border: `1px solid ${diff.border}`,
                              borderRadius: "9999px",
                              padding: "2px 10px",
                              fontSize: 11,
                              fontWeight: 700,
                              flexShrink: 0,
                              fontFamily: "Sora, sans-serif",
                              textTransform: "capitalize",
                            }}
                          >
                            {quiz.difficulty}
                          </span>
                        </div>

                        {/* Description */}
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 16, lineHeight: 1.5 }}>
                          {quiz.description}
                        </p>

                        {/* Stats Grid */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "8px 12px",
                            marginBottom: 16,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                            <FileText style={{ width: 13, height: 13, color: "#94A3B8" }} />
                            {quiz.questions} questions
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                            <Clock style={{ width: 13, height: 13, color: "#06B6D4" }} />
                            {quiz.duration} min
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                            <Users style={{ width: 13, height: 13, color: "#10B981" }} />
                            {quiz.completions} completed
                          </div>
                          <span
                            style={{
                              background: "rgba(245,158,11,0.15)",
                              color: "#F59E0B",
                              border: "1px solid rgba(245,158,11,0.4)",
                              borderRadius: "9999px",
                              padding: "2px 10px",
                              fontSize: 11,
                              fontWeight: 700,
                              fontFamily: "Sora, sans-serif",
                              display: "inline-block",
                            }}
                          >
                            Grade {quiz.grade}
                          </span>
                        </div>

                        {/* Buttons */}
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            style={{
                              flex: 1,
                              padding: "9px 0",
                              background: "linear-gradient(135deg, #10B981, #059669)",
                              border: "none",
                              borderRadius: "0.6rem",
                              color: "#fff",
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                              fontFamily: "Sora, sans-serif",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 5,
                              boxShadow: "0 0 14px rgba(16,185,129,0.35)",
                            }}
                            onClick={() => sendQuizToStudents(quiz.id, true)}
                          >
                            <Send style={{ width: 12, height: 12 }} />
                            Send to Students
                          </button>
                          <button
                            style={{
                              padding: "9px 12px",
                              background: "rgba(15,22,41,0.75)",
                              backdropFilter: "blur(14px)",
                              border: "1px solid rgba(255,255,255,0.07)",
                              borderRadius: "0.6rem",
                              color: "rgba(255,255,255,0.6)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Eye style={{ width: 14, height: 14 }} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Custom Quizzes */}
              <TabsContent value="custom" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customQuizzes.map((quiz) => {
                    const statusStyle = getStatusAccent(quiz.status);
                    const subjectBorder = getSubjectBorder(quiz.subject);
                    return (
                      <div
                        key={quiz.id}
                        className="card-game animate-slide-up"
                        style={{
                          padding: "22px",
                          borderColor: `${subjectBorder}33`,
                          boxShadow: `0 0 20px ${subjectBorder}14`,
                        }}
                      >
                        {/* Title + Status */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                          <h4
                            style={{
                              fontFamily: "Sora, sans-serif",
                              fontWeight: 700,
                              color: "#fff",
                              fontSize: 14,
                              lineHeight: 1.4,
                              flex: 1,
                              marginRight: 8,
                            }}
                          >
                            {quiz.title}
                          </h4>
                          <span
                            style={{
                              background: statusStyle.bg,
                              color: statusStyle.color,
                              border: `1px solid ${statusStyle.border}`,
                              borderRadius: "9999px",
                              padding: "2px 10px",
                              fontSize: 11,
                              fontWeight: 700,
                              flexShrink: 0,
                              fontFamily: "Sora, sans-serif",
                            }}
                          >
                            {quiz.status}
                          </span>
                        </div>

                        {/* Description */}
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 16, lineHeight: 1.5 }}>
                          {quiz.description}
                        </p>

                        {/* Stats Grid */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "8px 12px",
                            marginBottom: 16,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                            <FileText style={{ width: 13, height: 13, color: "#94A3B8" }} />
                            {quiz.questions} questions
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                            <Clock style={{ width: 13, height: 13, color: "#06B6D4" }} />
                            {quiz.duration} min
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                            <Users style={{ width: 13, height: 13, color: "#10B981" }} />
                            {quiz.responses} responses
                          </div>
                          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
                            Created {quiz.created.toLocaleDateString()}
                          </div>
                        </div>

                        {/* Avg Score Bar */}
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600 }}>Avg Score</span>
                            <span style={{ color: "#10B981", fontWeight: 700, fontSize: 11 }}>
                              {quiz.responses > 0 ? "—" : "No data"}
                            </span>
                          </div>
                          <div
                            style={{
                              width: "100%",
                              height: 5,
                              background: "rgba(255,255,255,0.08)",
                              borderRadius: 999,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: quiz.responses > 0 ? "60%" : "0%",
                                height: "100%",
                                background: "#10B981",
                                borderRadius: 999,
                                boxShadow: "0 0 8px rgba(16,185,129,0.6)",
                              }}
                            />
                          </div>
                        </div>

                        {/* Buttons */}
                        <div style={{ display: "flex", gap: 8 }}>
                          {quiz.status === 'Active' || quiz.status === 'Draft' ? (
                            <>
                              <button
                                style={{
                                  flex: 1,
                                  padding: "9px 0",
                                  background: "linear-gradient(135deg, #10B981, #059669)",
                                  border: "none",
                                  borderRadius: "0.6rem",
                                  color: "#fff",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  fontFamily: "Sora, sans-serif",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 5,
                                  boxShadow: "0 0 14px rgba(16,185,129,0.35)",
                                }}
                                onClick={() => sendQuizToStudents(quiz.id, false)}
                              >
                                <Send style={{ width: 12, height: 12 }} />
                                Send
                              </button>
                              <button
                                style={{
                                  padding: "9px 12px",
                                  background: "rgba(15,22,41,0.75)",
                                  backdropFilter: "blur(14px)",
                                  border: "1px solid rgba(255,255,255,0.07)",
                                  borderRadius: "0.6rem",
                                  color: "rgba(255,255,255,0.6)",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Edit style={{ width: 14, height: 14 }} />
                              </button>
                            </>
                          ) : (
                            <button
                              style={{
                                flex: 1,
                                padding: "9px 0",
                                background: "rgba(15,22,41,0.75)",
                                backdropFilter: "blur(14px)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: "0.6rem",
                                color: "rgba(255,255,255,0.65)",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "Sora, sans-serif",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 5,
                              }}
                            >
                              <Eye style={{ width: 12, height: 12 }} />
                              View Results
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty State */}
                  {customQuizzes.length === 0 && (
                    <div
                      className="col-span-full card-game animate-slide-up"
                      style={{ textAlign: "center", padding: "64px 32px" }}
                    >
                      <div
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: "50%",
                          background: "rgba(16,185,129,0.1)",
                          border: "1px solid rgba(16,185,129,0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 20px",
                        }}
                      >
                        <FileText style={{ width: 32, height: 32, color: "#10B981" }} />
                      </div>
                      <h3
                        style={{
                          fontFamily: "Sora, sans-serif",
                          fontWeight: 700,
                          fontSize: 18,
                          color: "#fff",
                          marginBottom: 8,
                        }}
                      >
                        No custom quizzes yet
                      </h3>
                      <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 20, fontSize: 14 }}>
                        Create your first custom quiz to get started
                      </p>
                      <button
                        style={{
                          background: "linear-gradient(135deg, #10B981, #059669)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "0.6rem",
                          padding: "10px 24px",
                          fontWeight: 700,
                          fontFamily: "Sora, sans-serif",
                          fontSize: 14,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          boxShadow: "0 0 18px rgba(16,185,129,0.4)",
                        }}
                        onClick={() => setCreateQuizOpen(true)}
                      >
                        <Plus style={{ width: 14, height: 14 }} />
                        Create Your First Quiz
                      </button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default TeacherQuizzes;
