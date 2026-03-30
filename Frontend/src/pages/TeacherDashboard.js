import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import TeacherSidebar from "../components/TeacherSidebar";
import ApiService from "../api";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Teacher";
  const userEmail = localStorage.getItem("userEmail") || "";

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  useEffect(() => {
    const fetchDashboardData = () => {
      setLoading(true);

      // Use mock data directly for instant loading
      const mockData = {
        teacher: {
          id: 1,
          name: userName,
          email: userEmail,
          classes: ['6', '7', '8']
        },
        classes: ['6', '7', '8'],
        students: [
          { id: 1, student_name: 'Alice Johnson', class: '6', completed_quizzes: 5, average_score: 88 },
          { id: 2, student_name: 'Bob Smith', class: '6', completed_quizzes: 3, average_score: 75 },
          { id: 3, student_name: 'Charlie Brown', class: '7', completed_quizzes: 7, average_score: 92 },
          { id: 4, student_name: 'Diana Ross', class: '8', completed_quizzes: 4, average_score: 85 },
        ],
        student_performance: [
          { student_name: 'Alice Johnson', class: '6', completed_quizzes: 5, average_score: 88 },
          { student_name: 'Bob Smith', class: '6', completed_quizzes: 3, average_score: 75 },
          { student_name: 'Charlie Brown', class: '7', completed_quizzes: 7, average_score: 92 },
          { student_name: 'Diana Ross', class: '8', completed_quizzes: 4, average_score: 85 },
        ],
        quiz_statistics: [
          { title: 'Basic Math Quiz', subject_name: 'Mathematics', class_level: '6', quiz_type: 'traditional', total_attempts: 15, completed_attempts: 12, average_score: 85 },
          { title: 'Science Basics', subject_name: 'Science', class_level: '7', quiz_type: 'traditional', total_attempts: 10, completed_attempts: 8, average_score: 78 },
          { title: 'Physics Fundamentals', subject_name: 'Physics', class_level: '8', quiz_type: 'traditional', total_attempts: 12, completed_attempts: 10, average_score: 82 },
          { title: 'Circuit Game', subject_name: 'Physics', class_level: '8', quiz_type: 'game', total_attempts: 20, completed_attempts: 18, average_score: 88 },
        ],
        game_performance: [
          { game_name: 'Circuit Designer', subject_name: 'Physics', class_level: '8', average_score: 88, total_plays: 20 },
          { game_name: 'Pizza Fractions', subject_name: 'Mathematics', class_level: '6', average_score: 85, total_plays: 15 },
          { game_name: 'Nutrition Game', subject_name: 'Science', class_level: '7', average_score: 80, total_plays: 12 },
        ]
      };

      setDashboardData(mockData);
      setError(null);
      setLoading(false);
    };

    if (userEmail) {
      fetchDashboardData();
    } else {
      setLoading(false);
      setError('No user email found');
    }
  }, [userEmail, userName]);

  if (loading) {
    return (
      <SidebarProvider>
        <TeacherSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D4ED8] mx-auto mb-4"></div>
              <p className="text-[#64748B]">Loading teacher dashboard...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <TeacherSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#1D4ED8] text-white rounded-lg text-sm">Try Again</button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const teacherInfo = dashboardData?.teacher || {};
  const students = dashboardData?.students || [];
  const quizStats = dashboardData?.quiz_statistics || [];
  const studentPerformance = dashboardData?.student_performance || [];
  const gamePerformance = dashboardData?.game_performance || [];
  const teacherClasses = dashboardData?.classes || [];

  const getGrade = (score) => {
    if (score >= 90) return { grade: 'A', color: 'text-green-600' };
    if (score >= 80) return { grade: 'B', color: 'text-blue-600' };
    if (score >= 70) return { grade: 'C', color: 'text-yellow-600' };
    if (score >= 60) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  return (
    <SidebarProvider>
      <TeacherSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-[#F8FAFC]">
          <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-lg font-semibold text-[#1E293B] font-jakarta">Teacher Dashboard</h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{(teacherInfo.name || userName).charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium text-[#1E293B] hidden sm:block">{teacherInfo.name || userName}</span>
                <span className="text-xs bg-[#F0FDF4] text-[#10B981] border border-[#BBF7D0] px-2 py-0.5 rounded-full font-medium">Teacher</span>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#1E293B] font-jakarta">Teacher Dashboard</h2>
              <p className="text-[#64748B] mt-1">
                Managing Classes: {teacherClasses.length > 0 ? teacherClasses.join(', ') : 'No classes assigned'}
              </p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-[#F1F5F9] rounded-lg p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-[#1D4ED8] data-[state=active]:shadow-sm rounded-md text-sm">Overview</TabsTrigger>
                <TabsTrigger value="students" className="data-[state=active]:bg-white data-[state=active]:text-[#1D4ED8] data-[state=active]:shadow-sm rounded-md text-sm">Students</TabsTrigger>
                <TabsTrigger value="quizzes" className="data-[state=active]:bg-white data-[state=active]:text-[#1D4ED8] data-[state=active]:shadow-sm rounded-md text-sm">Quizzes</TabsTrigger>
                <TabsTrigger value="content" className="data-[state=active]:bg-white data-[state=active]:text-[#1D4ED8] data-[state=active]:shadow-sm rounded-md text-sm">Content</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Students", value: students.length, sub: `Across ${teacherClasses.length} class${teacherClasses.length !== 1 ? 'es' : ''}`, borderColor: "border-[#1D4ED8]", textColor: "text-[#1D4ED8]" },
                    { label: "Active Quizzes", value: quizStats.length, sub: "Available for students", borderColor: "border-[#10B981]", textColor: "text-[#10B981]" },
                    { label: "Avg. Score", value: `${quizStats.length > 0 ? Math.round(quizStats.reduce((acc, q) => acc + (q.average_score || 0), 0) / quizStats.length) : 0}%`, sub: "Across all quizzes", borderColor: "border-[#F59E0B]", textColor: "text-[#F59E0B]" },
                    { label: "Game Activities", value: gamePerformance.length, sub: "Different games played", borderColor: "border-purple-500", textColor: "text-purple-600" },
                  ].map(({ label, value, sub, borderColor, textColor }) => (
                    <div key={label} className={`bg-white rounded-xl border border-[#E2E8F0] border-l-4 ${borderColor} p-4 shadow-sm`}>
                      <p className="text-xs text-[#64748B] font-medium">{label}</p>
                      <p className={`text-2xl font-bold mt-1 font-jakarta ${textColor}`}>{value}</p>
                      <p className="text-xs text-[#64748B] mt-1">{sub}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
                    <h3 className="font-semibold text-[#1E293B] font-jakarta mb-4">Class Performance</h3>
                    <div className="space-y-4">
                      {quizStats.slice(0, 5).length > 0 ? (
                        quizStats.slice(0, 5).map((quiz, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="truncate text-[#1E293B]">{quiz.subject_name} - {quiz.title}</span>
                              <span className="font-bold text-[#1D4ED8] ml-2">{Math.round(quiz.average_score || 0)}%</span>
                            </div>
                            <div className="w-full bg-[#E2E8F0] rounded-full h-2">
                              <div className="bg-[#10B981] h-2 rounded-full" style={{ width: `${quiz.average_score || 0}%` }} />
                            </div>
                            <div className="flex justify-between text-xs text-[#64748B]">
                              <span>Class {quiz.class_level}</span>
                              <span>{quiz.completed_attempts || 0} attempts</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[#64748B] text-sm">No quiz data available yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
                    <h3 className="font-semibold text-[#1E293B] font-jakarta mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="h-16 flex-col flex items-center justify-center gap-1 bg-[#1D4ED8] text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        <span>Create Quiz</span>
                      </button>
                      <button className="h-16 flex-col flex items-center justify-center gap-1 border border-[#E2E8F0] text-[#1E293B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm font-medium">
                        <span>Upload Module</span>
                      </button>
                      <button className="h-16 flex-col flex items-center justify-center gap-1 border border-[#E2E8F0] text-[#1E293B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm font-medium">
                        <span>View Analytics</span>
                      </button>
                      <button className="h-16 flex-col flex items-center justify-center gap-1 border border-[#E2E8F0] text-[#1E293B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm font-medium">
                        <span>Manage Classes</span>
                      </button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="students" className="space-y-6">
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
                  <h3 className="font-semibold text-[#1E293B] font-jakarta mb-1">Student Management</h3>
                  <p className="text-[#64748B] text-sm mb-4">Monitor student progress and performance across your classes</p>
                  <div className="space-y-4">
                    {studentPerformance.length > 0 ? (
                      studentPerformance.map((student, index) => {
                        const gradeInfo = getGrade(student.average_score || 0);
                        return (
                          <div key={index} className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                                <span className="text-[#1D4ED8] font-semibold text-sm">
                                  {student.student_name ? student.student_name.split(' ').map(n => n[0]).join('') : 'S'}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-[#1E293B]">{student.student_name || 'Unknown Student'}</div>
                                <div className="text-sm text-[#64748B]">
                                  Class {student.class} • {student.completed_quizzes || 0} quizzes completed
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className={`font-medium ${gradeInfo.color}`}>Grade: {gradeInfo.grade}</div>
                                <div className="text-sm text-[#64748B]">{Math.round(student.average_score || 0)}% average</div>
                              </div>
                              <div className="w-20 bg-[#E2E8F0] rounded-full h-2">
                                <div className="bg-[#10B981] h-2 rounded-full" style={{ width: `${student.average_score || 0}%` }} />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-[#64748B] py-8">
                        <p>No students found for your assigned classes.</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="quizzes" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-[#1E293B] font-jakarta">Quiz Management</h3>
                  <button className="px-4 py-2 bg-[#1D4ED8] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Create New Quiz</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {quizStats.length > 0 ? (
                    quizStats.map((quiz, index) => (
                      <div key={index} className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-[#1E293B] text-sm line-clamp-2">{quiz.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 flex-shrink-0 ${quiz.quiz_type === 'game' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {quiz.quiz_type === 'game' ? 'Game' : 'Quiz'}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] mb-3">{quiz.subject_name} • Class {quiz.class_level}</p>
                        <div className="space-y-1.5 text-sm mb-3">
                          <div className="flex justify-between">
                            <span className="text-[#64748B]">Total Attempts:</span>
                            <span className="font-medium text-[#1E293B]">{quiz.total_attempts || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#64748B]">Completed:</span>
                            <span className="font-medium text-[#1E293B]">{quiz.completed_attempts || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#64748B]">Avg Score:</span>
                            <span className="font-medium text-[#1E293B]">{Math.round(quiz.average_score || 0)}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 mb-3">
                          <div className="bg-[#10B981] h-1.5 rounded-full" style={{ width: `${quiz.average_score || 0}%` }} />
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 py-1.5 border border-[#E2E8F0] text-[#1E293B] text-xs rounded-lg hover:bg-[#F8FAFC] transition-colors">View Details</button>
                          <button className="flex-1 py-1.5 border border-[#E2E8F0] text-[#1E293B] text-xs rounded-lg hover:bg-[#F8FAFC] transition-colors">Analytics</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-[#64748B] py-8">
                      <p>No quizzes available for your assigned classes.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-[#1E293B] font-jakarta">Game & Content Performance</h3>
                  <button className="px-4 py-2 border border-[#E2E8F0] text-[#1E293B] rounded-lg text-sm font-medium hover:bg-[#F8FAFC] transition-colors">View All Content</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
                    <h3 className="font-semibold text-[#1E293B] font-jakarta mb-1">Game Performance</h3>
                    <p className="text-[#64748B] text-xs mb-4">Educational games played by your students</p>
                    <div className="space-y-3">
                      {gamePerformance.length > 0 ? (
                        gamePerformance.slice(0, 5).map((game, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg">
                            <div>
                              <span className="font-medium text-[#1E293B] text-sm">{game.game_name}</span>
                              <div className="text-xs text-[#64748B]">{game.subject_name} • Class {game.class_level}</div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold bg-[#F0FDF4] text-[#10B981] border border-[#BBF7D0] px-2 py-0.5 rounded-full">{Math.round(game.average_score || 0)}% avg</span>
                              <div className="text-xs text-[#64748B] mt-1">{game.total_plays || 0} plays</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[#64748B] text-sm">No game data available yet.</p>
                      )}
                      <button className="w-full py-2 border border-[#E2E8F0] text-[#1E293B] text-sm rounded-lg hover:bg-[#F8FAFC] transition-colors">View Game Analytics</button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
                    <h3 className="font-semibold text-[#1E293B] font-jakarta mb-1">Subject Overview</h3>
                    <p className="text-[#64748B] text-xs mb-4">Performance across different subjects</p>
                    <div className="space-y-3">
                      {(() => {
                        const subjectStats = quizStats.reduce((acc, quiz) => {
                          if (!acc[quiz.subject_name]) {
                            acc[quiz.subject_name] = { name: quiz.subject_name, totalQuizzes: 0, totalAttempts: 0, avgScore: 0 };
                          }
                          acc[quiz.subject_name].totalQuizzes += 1;
                          acc[quiz.subject_name].totalAttempts += quiz.total_attempts || 0;
                          acc[quiz.subject_name].avgScore += quiz.average_score || 0;
                          return acc;
                        }, {});

                        Object.values(subjectStats).forEach(subject => {
                          subject.avgScore = subject.totalQuizzes > 0 ? subject.avgScore / subject.totalQuizzes : 0;
                        });

                        const subjects = Object.values(subjectStats).slice(0, 5);

                        return subjects.length > 0 ? (
                          subjects.map((subject, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg">
                              <div>
                                <span className="font-medium text-[#1E293B] text-sm">{subject.name}</span>
                                <div className="text-xs text-[#64748B]">{subject.totalQuizzes} quiz{subject.totalQuizzes !== 1 ? 'es' : ''}</div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold border border-[#E2E8F0] px-2 py-0.5 rounded-full text-[#1E293B]">{Math.round(subject.avgScore)}%</span>
                                <div className="text-xs text-[#64748B] mt-1">{subject.totalAttempts} attempts</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-[#64748B] text-sm">No subject data available yet.</p>
                        );
                      })()}
                      <button className="w-full py-2 border border-[#E2E8F0] text-[#1E293B] text-sm rounded-lg hover:bg-[#F8FAFC] transition-colors">View Subject Details</button>
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

export default TeacherDashboard;
