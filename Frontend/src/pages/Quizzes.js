import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/simplebutton";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  FileText,
  Clock,
  Trophy,
  Play,
  CheckCircle2,
  AlertCircle,
  Star,
  Target,
  Loader2
} from "lucide-react";
import StudentSidebar from "../components/StudentSidebar";
import ApiService from "../api";
import { mockTraditionalQuizzes, mockStudentProgress, filterByClass, getSubjectProgressByClass, deduplicateBySubject, deduplicateByID } from "../data/mockData";

const Quizzes = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";
  const userEmail = localStorage.getItem("userEmail") || "";
  const studentClass = localStorage.getItem("studentClass") || "6";
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [studentProgress, setStudentProgress] = useState(null);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("studentClass");
    navigate("/");
  };

  // Load data directly from mock for instant loading
  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      setError(null);

      // Use mock data directly for instant loading
      const mockQuizzes = filterByClass(mockTraditionalQuizzes, studentClass);
      const deduplicatedMockQuizzes = deduplicateByID(mockQuizzes);
      const subjectProgress = getSubjectProgressByClass(studentClass);

      setQuizzes(deduplicatedMockQuizzes);
      setStudentProgress({
        ...mockStudentProgress,
        subject_progress: subjectProgress
      });

      setLoading(false);
    };

    loadData();
  }, [userEmail, studentClass]);

  const handleQuizStart = async (quiz) => {
    try {
      // Start traditional quiz only
      try {
        const response = await ApiService.startQuiz(quiz.id, userEmail);
        navigate(`/quiz/${quiz.id}/attempt/${response.attempt_id}`);
      } catch (apiError) {
        // If API is not available, show demo message
        alert(`Starting quiz: ${quiz.title}\n\nThis would normally start the quiz interface with questions.`);
      }
    } catch (error) {
      console.error('Failed to start quiz:', error);
      alert('Unable to start quiz. Please try again.');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <SidebarProvider>
        <StudentSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#1D4ED8]" />
              <p className="text-[#64748B]">Loading quiz data...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <StudentSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <StudentSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-[#F8FAFC]">
          {/* Header */}
          <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-lg font-semibold text-[#1E293B] font-jakarta">Quizzes</h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1D4ED8] flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{userName.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium text-[#1E293B] hidden sm:block">{userName}</span>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#1E293B] font-jakarta">Quiz Center - Class {studentClass}</h2>
              <p className="text-[#64748B] mt-1">
                Test your knowledge and track your progress with content designed for your class level
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border border-[#E2E8F0] border-l-4 border-l-[#1D4ED8] rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B] font-medium">Total Quizzes</p>
                    <p className="text-2xl font-bold text-[#1D4ED8] font-jakarta">{quizzes.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#E2E8F0] border-l-4 border-l-[#10B981] rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B] font-medium">Completed</p>
                    <p className="text-2xl font-bold text-[#10B981] font-jakarta">
                      {studentProgress?.overall_stats?.completed_quizzes || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#E2E8F0] border-l-4 border-l-purple-500 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B] font-medium">Average Score</p>
                    <p className="text-2xl font-bold text-purple-600 font-jakarta">
                      {Math.round(studentProgress?.overall_stats?.average_score || 0)}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#E2E8F0] border-l-4 border-l-[#F59E0B] rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Star className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B] font-medium">Best Score</p>
                    <p className="text-2xl font-bold text-[#F59E0B] font-jakarta">
                      {Math.round(studentProgress?.overall_stats?.best_score || 0)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="sections" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-[#F1F5F9] rounded-lg p-1">
                <TabsTrigger value="sections" className="data-[state=active]:bg-white data-[state=active]:text-[#1D4ED8] data-[state=active]:shadow-sm rounded-md text-sm">By Subject</TabsTrigger>
                <TabsTrigger value="available" className="data-[state=active]:bg-white data-[state=active]:text-[#1D4ED8] data-[state=active]:shadow-sm rounded-md text-sm">Available</TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:text-[#1D4ED8] data-[state=active]:shadow-sm rounded-md text-sm">Completed</TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-[#1D4ED8] data-[state=active]:shadow-sm rounded-md text-sm">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="sections" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {studentProgress?.subject_progress?.map((subject) => (
                    <div
                      key={subject.id}
                      className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-shadow cursor-pointer group shadow-sm"
                    >
                      <div className={`h-2 bg-gradient-to-r ${subject.color}`} />
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{subject.icon}</div>
                            <div>
                              <h3 className="font-semibold text-[#1E293B] group-hover:text-[#1D4ED8] transition-colors">
                                {subject.name}
                              </h3>
                              <p className="text-xs text-[#64748B] mt-0.5">
                                {subject.completed} of {subject.total_quizzes} completed
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold bg-[#F1F5F9] text-[#64748B] px-2 py-0.5 rounded-full">
                            {Math.round(subject.average_score)}% avg
                          </span>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-xs text-[#64748B]">
                            <span>Progress</span>
                            <span className="font-medium">{subject.completed}/{subject.total_quizzes} completed</span>
                          </div>
                          <div className="w-full bg-[#E2E8F0] rounded-full h-2">
                            <div
                              className="bg-[#10B981] h-2 rounded-full transition-all"
                              style={{ width: `${subject.total_quizzes > 0 ? (subject.completed / subject.total_quizzes) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                          <div>
                            <p className="text-[#64748B]">Total Quizzes</p>
                            <p className="font-medium text-[#1E293B]">{subject.total_quizzes}</p>
                          </div>
                          <div>
                            <p className="text-[#64748B]">Best Score</p>
                            <p className={`font-medium ${getScoreColor(subject.best_score)}`}>
                              {Math.round(subject.best_score)}%
                            </p>
                          </div>
                        </div>
                        <button className="w-full py-2 bg-[#1D4ED8] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                          <Target className="w-4 h-4" />
                          View {subject.name} Quizzes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="available" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#1E293B] font-jakarta">Available Quizzes</h3>
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{quiz.subject_icon}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-[#1E293B] text-base">{quiz.title}</h4>
                              <p className="text-sm text-[#64748B]">{quiz.subject_name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={getDifficultyColor(quiz.difficulty)}
                              >
                                {quiz.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                            <div className="flex items-center gap-2 text-[#64748B]">
                              <Clock className="w-4 h-4" />
                              <span>{quiz.duration_minutes} minutes</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#64748B]">
                              <FileText className="w-4 h-4" />
                              <span>{quiz.total_questions} questions</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#64748B]">
                              <Target className="w-4 h-4" />
                              <span>{quiz.difficulty}</span>
                            </div>
                          </div>
                          <button
                            className="px-4 py-2 bg-[#1D4ED8] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            onClick={() => handleQuizStart(quiz)}
                          >
                            <Play className="w-4 h-4" />
                            Start Quiz
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {quizzes.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-[#64748B] mb-4" />
                      <p className="text-[#64748B]">No quizzes available at the moment.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#1E293B] font-jakarta">Completed Quizzes</h3>
                  {studentProgress?.recent_attempts?.map((attempt) => (
                    <div key={attempt.id} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{attempt.subject_icon}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-[#1E293B] text-base">{attempt.title}</h4>
                              <p className="text-sm text-[#64748B]">{attempt.subject_name}</p>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${getScoreColor(attempt.score)}`}>
                                {Math.round(attempt.score)}%
                              </div>
                              <p className="text-xs text-[#64748B]">
                                {attempt.correct_answers}/{attempt.total_questions} correct
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs mb-4 text-[#64748B]">
                            <div>
                              <p>Completed</p>
                              <p className="font-medium text-[#1E293B]">{new Date(attempt.completed_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p>Time Spent</p>
                              <p className="font-medium text-[#1E293B]">{attempt.time_spent_minutes} minutes</p>
                            </div>
                            <div>
                              <p>Difficulty</p>
                              <Badge variant="outline" className={getDifficultyColor(attempt.difficulty)}>
                                {attempt.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 border border-[#E2E8F0] text-[#1E293B] text-xs rounded-lg hover:bg-[#F8FAFC] transition-colors">
                              View Results
                            </button>
                            <button className="px-3 py-1.5 border border-[#E2E8F0] text-[#1E293B] text-xs rounded-lg hover:bg-[#F8FAFC] transition-colors">
                              Retake Quiz
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!studentProgress?.recent_attempts || studentProgress.recent_attempts.length === 0) && (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-12 w-12 mx-auto text-[#64748B] mb-4" />
                      <p className="text-[#64748B]">No completed quizzes yet. Start taking quizzes to see your progress!</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                    <h3 className="font-semibold text-[#1E293B] font-jakarta mb-1">Performance by Subject</h3>
                    <p className="text-xs text-[#64748B] mb-4">Your average scores across subjects</p>
                    <div className="space-y-4">
                      {studentProgress?.subject_progress?.map((subject) => (
                        <div key={subject.id} className="space-y-1.5">
                          <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2 text-[#1E293B]">
                              <span>{subject.icon}</span>
                              {subject.name}
                            </span>
                            <span className={`font-medium ${getScoreColor(subject.average_score)}`}>
                              {Math.round(subject.average_score)}%
                            </span>
                          </div>
                          <div className="w-full bg-[#E2E8F0] rounded-full h-2">
                            <div
                              className="bg-[#10B981] h-2 rounded-full"
                              style={{ width: `${Math.round(subject.average_score)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                      {(!studentProgress?.subject_progress || studentProgress.subject_progress.length === 0) && (
                        <div className="text-center py-4">
                          <p className="text-[#64748B] text-sm">No data available yet. Take some quizzes to see your performance!</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                    <h3 className="font-semibold text-[#1E293B] font-jakarta mb-1">Recent Activity</h3>
                    <p className="text-xs text-[#64748B] mb-4">Your quiz activity over time</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-3 border border-[#E2E8F0] rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#1E293B] text-sm">Excellent performance!</p>
                          <p className="text-xs text-[#64748B]">
                            You scored 92% on Cell Biology Quiz
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-3 border border-[#E2E8F0] rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#1E293B] text-sm">Quiz streak!</p>
                          <p className="text-xs text-[#64748B]">
                            You've completed 5 quizzes this week
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Quizzes;
