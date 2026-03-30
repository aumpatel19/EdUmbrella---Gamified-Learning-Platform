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
import { mockPrebuiltQuizzes } from "../data/mockData";

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
      // Use shared mock data
      setPrebuiltQuizzes(mockPrebuiltQuizzes);
    } catch (error) {
      console.error("Error fetching prebuilt quizzes:", error);
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

  return (
    <SidebarProvider>
      <TeacherSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-[#F8FAFC]">
          <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div className="w-8 h-8 rounded-full bg-[#1D4ED8] flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold">Quiz Management</h1>
              </div>
              <Dialog open={createQuizOpen} onOpenChange={setCreateQuizOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Quiz
                  </Button>
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

          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Quiz Management 📝</h2>
              <p className="text-muted-foreground">
                Manage prebuilt quizzes and create custom quizzes for your students
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prebuilt">Prebuilt Quizzes</TabsTrigger>
                <TabsTrigger value="custom">My Custom Quizzes</TabsTrigger>
              </TabsList>

              <TabsContent value="prebuilt" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {prebuiltQuizzes.map((quiz) => (
                    <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{quiz.title}</CardTitle>
                          <Badge className={getDifficultyColor(quiz.difficulty)}>
                            {quiz.difficulty}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">
                          {quiz.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span>{quiz.questions} questions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{quiz.duration} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>{quiz.completions} completed</span>
                          </div>
                          <div>
                            <Badge variant="outline">{quiz.grade} Grade</Badge>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => sendQuizToStudents(quiz.id, true)}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send to Students
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="custom" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customQuizzes.map((quiz) => (
                    <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{quiz.title}</CardTitle>
                          <Badge className={getStatusColor(quiz.status)}>
                            {quiz.status}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">
                          {quiz.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span>{quiz.questions} questions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{quiz.duration} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>{quiz.responses} responses</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Created {quiz.created.toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {quiz.status === 'Active' || quiz.status === 'Draft' ? (
                            <>
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => sendQuizToStudents(quiz.id, false)}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Send
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="w-4 h-4 mr-2" />
                              View Results
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {customQuizzes.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No custom quizzes yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first custom quiz to get started
                      </p>
                      <Button onClick={() => setCreateQuizOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Quiz
                      </Button>
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