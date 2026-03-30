import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import StudentSidebar from "../components/StudentSidebar";
import ApiService from "../api";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";
  const userEmail = localStorage.getItem("userEmail") || "";
  const studentClass = localStorage.getItem("studentClass") || "6";

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("studentClass");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  useEffect(() => {
    const fetchDashboardData = () => {
      setLoading(true);

      // Use mock data directly for instant loading
      const mockData = {
        student: {
          id: 1,
          name: userName,
          email: userEmail,
          class: studentClass
        },
        overall_stats: {
          total_quiz_attempts: 12,
          completed_quizzes: 8,
          average_score: 85.5,
          best_score: 95.0,
          total_time_spent: 240
        },
        subject_progress: [
          { name: 'Mathematics', icon: '🧮', completed_content: 5, total_content: 10, average_score: 88 },
          { name: 'Science', icon: '🔬', completed_content: 3, total_content: 8, average_score: 82 },
          { name: 'Physics', icon: '⚛️', completed_content: 2, total_content: 6, average_score: 90 },
          { name: 'English', icon: '📖', completed_content: 4, total_content: 7, average_score: 78 },
        ],
        recent_activity: [
          { activity_name: 'Basic Math Quiz', subject_name: 'Mathematics', subject_icon: '🧮', class_level: studentClass, score: 95, activity_date: new Date().toISOString() },
          { activity_name: 'Science Basics', subject_name: 'Science', subject_icon: '🔬', class_level: studentClass, score: 82, activity_date: new Date(Date.now() - 86400000).toISOString() },
          { activity_name: 'Pizza Game', subject_name: 'Mathematics', subject_icon: 'game', class_level: studentClass, score: 88, activity_date: new Date(Date.now() - 172800000).toISOString() },
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
  }, [userEmail, userName, studentClass]);

  if (loading) {
    return (
      <SidebarProvider>
        <StudentSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D4ED8] mx-auto mb-4"></div>
              <p className="text-[#64748B]">Loading dashboard...</p>
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
              <p className="text-red-500 mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#1D4ED8] text-white rounded-lg text-sm">Try Again</button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const stats = dashboardData?.overall_stats || {};
  const studentInfo = dashboardData?.student || {};
  const subjectProgress = dashboardData?.subject_progress || [];
  const recentActivity = dashboardData?.recent_activity || [];

  return (
    <SidebarProvider>
      <StudentSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-[#F8FAFC]">
          <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-lg font-semibold text-[#1E293B] font-jakarta">Dashboard</h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1D4ED8] flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{(studentInfo.name || userName).charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium text-[#1E293B] hidden sm:block">{studentInfo.name || userName}</span>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#1E293B] font-jakarta">Good morning, {studentInfo.name || userName}!</h2>
              <p className="text-[#64748B] mt-1">Class {studentInfo.class || studentClass} • Keep up the great work</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Quizzes Completed", value: stats.completed_quizzes || 0, borderColor: "border-[#1D4ED8]", textColor: "text-[#1D4ED8]" },
                { label: "Average Score", value: `${Math.round(stats.average_score || 0)}%`, borderColor: "border-[#10B981]", textColor: "text-[#10B981]" },
                { label: "Best Score", value: `${Math.round(stats.best_score || 0)}%`, borderColor: "border-[#F59E0B]", textColor: "text-[#F59E0B]" },
                { label: "Time Spent", value: `${Math.round(stats.total_time_spent || 0)}m`, borderColor: "border-purple-500", textColor: "text-purple-600" },
              ].map(({ label, value, borderColor, textColor }) => (
                <div key={label} className={`bg-white rounded-xl border border-[#E2E8F0] border-l-4 ${borderColor} p-4 shadow-sm`}>
                  <p className="text-xs text-[#64748B] font-medium">{label}</p>
                  <p className={`text-2xl font-bold mt-1 font-jakarta ${textColor}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Subject Progress */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-semibold text-[#1E293B] font-jakarta">Continue Learning</h3>
                {subjectProgress.length > 0 ? subjectProgress.map((subject, i) => (
                  <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{subject.icon || '📚'}</span>
                        <div>
                          <p className="font-medium text-[#1E293B]">{subject.name}</p>
                          <p className="text-xs text-[#64748B]">{subject.completed_content || 0}/{subject.total_content || 0} completed</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[#1D4ED8]">{Math.round(subject.average_score || 0)}%</span>
                    </div>
                    <div className="w-full bg-[#E2E8F0] rounded-full h-2">
                      <div className="bg-[#10B981] h-2 rounded-full" style={{ width: `${subject.total_content ? (subject.completed_content / subject.total_content) * 100 : 0}%` }} />
                    </div>
                  </div>
                )) : <p className="text-[#64748B] text-sm">No subjects available.</p>}
              </div>

              {/* Right column */}
              <div className="space-y-4">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
                  <h3 className="font-semibold text-[#1E293B] font-jakarta mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button onClick={() => navigate('/quizzes')} className="w-full py-2.5 bg-[#1D4ED8] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Take a Quiz</button>
                    <button onClick={() => navigate('/games')} className="w-full py-2.5 border border-[#E2E8F0] text-[#1E293B] text-sm font-medium rounded-lg hover:bg-[#F8FAFC] transition-colors">Play a Game</button>
                    <button onClick={() => navigate('/lectures')} className="w-full py-2.5 border border-[#E2E8F0] text-[#1E293B] text-sm font-medium rounded-lg hover:bg-[#F8FAFC] transition-colors">Watch Lectures</button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
                  <h3 className="font-semibold text-[#1E293B] font-jakarta mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentActivity.length > 0 ? recentActivity.slice(0, 4).map((activity, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{activity.subject_icon === 'game' ? '🎮' : activity.subject_icon || '📚'}</span>
                          <div>
                            <p className="text-xs font-medium text-[#1E293B]">{activity.activity_name}</p>
                            <p className="text-xs text-[#64748B]">{activity.subject_name}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#10B981]">{Math.round(activity.score || 0)}%</span>
                      </div>
                    )) : <p className="text-[#64748B] text-xs">No recent activity.</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default StudentDashboard;
