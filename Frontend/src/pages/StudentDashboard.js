import { useNavigate } from "react-router-dom";
import ApiService from "../api";
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import StudentSidebar from "../components/StudentSidebar";
import SubjectIcon from "../components/SubjectIcon";
import { Trophy, Flame, Clock, Target, Gamepad2, BookOpen, ChevronRight, Star } from "lucide-react";

const StatCard = ({ label, value, icon, color, glow, sub }) => (
  <div
    className="relative rounded-2xl p-4 sm:p-5 border overflow-hidden group hover:scale-[1.02] transition-all duration-300"
    style={{
      background: 'linear-gradient(135deg, rgba(15,22,41,0.9) 0%, rgba(10,15,30,0.95) 100%)',
      borderColor: `rgba(${glow},0.2)`,
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 25px rgba(${glow},0.25), 0 0 50px rgba(${glow},0.1)`; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
  >
    <div className="flex items-start justify-between mb-2 sm:mb-3">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{background: `rgba(${glow},0.15)`, border: `1px solid rgba(${glow},0.3)`}}>
        <span style={{color}}>{icon}</span>
      </div>
      <div className="w-2 h-2 rounded-full animate-pulse" style={{background: color}} />
    </div>
    <p className="text-xl sm:text-2xl font-bold text-white font-jakarta mb-0.5">{value}</p>
    <p className="text-xs text-[#64748B] leading-tight">{label}</p>
    {sub && <p className="text-xs mt-1" style={{color}}>{sub}</p>}
    <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full blur-2xl opacity-30" style={{background: `radial-gradient(circle, rgba(${glow},1), transparent)`}} />
  </div>
);

const SubjectCard = ({ subject }) => {
  const progress = subject.total_content ? (subject.completed_content / subject.total_content) * 100 : 0;
  const glow = '99,102,241';

  return (
    <div
      className="relative rounded-2xl p-5 border border-[#1E2D4A] overflow-hidden group hover:scale-[1.01] transition-all duration-300 cursor-pointer"
      style={{background: 'linear-gradient(135deg, rgba(15,22,41,0.9) 0%, rgba(10,15,30,0.95) 100%)'}}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${glow},0.4)`; e.currentTarget.style.boxShadow = `0 0 20px rgba(${glow},0.15)`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E2D4A'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl overflow-hidden shrink-0">
            <SubjectIcon name={subject.name} size={44} />
          </div>
          <div>
            <p className="font-semibold text-white">{subject.name}</p>
            <p className="text-xs text-[#64748B]">{subject.completed_content}/{subject.total_content} completed</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-white font-jakarta">{Math.round(subject.average_score || 0)}%</p>
          <div className="flex items-center gap-0.5 justify-end">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5" style={{color: i < Math.round(subject.average_score / 20) ? '#FBBF24' : '#1E293B', fill: i < Math.round(subject.average_score / 20) ? '#FBBF24' : '#1E293B'}} />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-[#64748B]">XP Progress</span>
          <span style={{color: `rgba(${glow},1)`}}>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{background: '#1E293B'}}>
          <div
            className="h-full rounded-full animate-xp"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, rgba(${glow},0.8), rgba(${glow},1))`,
              boxShadow: `0 0 10px rgba(${glow},0.5)`,
            }}
          />
        </div>
      </div>
      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors" />
    </div>
  );
};

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
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const data = await ApiService.getStudentDashboard(userEmail, studentClass);
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchDashboardData();
    } else {
      setLoading(false);
      setError('No user email found. Please log in again.');
    }
  }, [userEmail]);

  if (loading) {
    return (
      <SidebarProvider>
        <StudentSidebar />
        <SidebarInset>
          <div className="min-h-screen flex items-center justify-center" style={{background: '#080D1A'}}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow" style={{background: 'linear-gradient(135deg, #6366F1, #8B5CF6)'}}>
                <Star className="w-8 h-8 text-white" />
              </div>
              <p className="text-[#94A3B8] font-medium">Loading your adventure...</p>
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
          <div className="min-h-screen flex items-center justify-center" style={{background: '#080D1A'}}>
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg text-white text-sm" style={{background: 'linear-gradient(135deg, #6366F1, #8B5CF6)'}}>Try Again</button>
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

  const getTimeOfDay = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <SidebarProvider>
      <StudentSidebar />
      <SidebarInset style={{background: '#080D1A'}} className="overflow-x-hidden">
        <div className="min-h-screen w-full overflow-x-hidden" style={{background: '#080D1A'}}>
          {/* Header */}
          <header className="sticky top-0 z-50 border-b" style={{background: 'rgba(8,13,26,0.95)', backdropFilter: 'blur(10px)', borderColor: '#1E2D4A'}}>
            <div className="w-full px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <SidebarTrigger className="md:hidden text-[#64748B] shrink-0" />
                <h1 className="text-base font-semibold text-white font-jakarta truncate">Dashboard</h1>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {/* XP badge — hidden on mobile */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#6366F1]/30" style={{background: 'rgba(99,102,241,0.1)'}}>
                  <Star className="w-3.5 h-3.5 text-[#A78BFA]" />
                  <span className="text-xs font-semibold text-[#A78BFA]">2,340 XP</span>
                </div>
                {/* Streak — hidden on mobile */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#F97316]/30" style={{background: 'rgba(249,115,22,0.1)'}}>
                  <Flame className="w-3.5 h-3.5 text-[#FB923C]" />
                  <span className="text-xs font-semibold text-[#FB923C]">7 Streak</span>
                </div>
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{background: 'linear-gradient(135deg, #6366F1, #8B5CF6)'}}>
                  {(studentInfo.name || userName).charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </header>

          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 md:pb-8">
            {/* Welcome banner */}
            <div className="relative rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 overflow-hidden border border-[#6366F1]/20">
              <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(6,182,212,0.08) 100%)'}} />
              <div className="absolute inset-0 shimmer-bg opacity-50" />
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <p className="text-[#94A3B8] text-xs sm:text-sm">{getTimeOfDay()},</p>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-jakarta leading-tight">{studentInfo.name || userName}! <span className="text-[#A78BFA]">Ready to level up?</span></h2>
                  <p className="text-[#64748B] text-xs sm:text-sm mt-1">Class {studentInfo.class || studentClass} · 7 day streak 🔥 · Level 8</p>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => navigate('/quizzes')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:scale-105"
                    style={{background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 0 20px rgba(99,102,241,0.4)'}}
                  >
                    <Target className="w-4 h-4" />
                    <span>Take Quiz</span>
                  </button>
                  <button
                    onClick={() => navigate('/games')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[#94A3B8] font-semibold text-sm border border-[#6366F1]/30 hover:bg-[#6366F1]/10 hover:text-white transition-all"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    <span>Play Game</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <StatCard label="Quizzes Completed" value={stats.completed_quizzes || 0} icon={<Target className="w-5 h-5" />} color="#A78BFA" glow="167,139,250" sub="+2 this week" />
              <StatCard label="Average Score" value={`${Math.round(stats.average_score || 0)}%`} icon={<Trophy className="w-5 h-5" />} color="#34D399" glow="52,211,153" sub="Top 15% of class" />
              <StatCard label="Best Score" value={`${Math.round(stats.best_score || 0)}%`} icon={<Star className="w-5 h-5" />} color="#FBBF24" glow="251,191,36" sub="Mathematics" />
              <StatCard label="Time Played" value={`${Math.round(stats.total_time_spent || 0)}m`} icon={<Clock className="w-5 h-5" />} color="#FB923C" glow="251,146,60" sub="This month" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Subject Progress */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white font-jakarta">Continue Learning</h3>
                  <button onClick={() => navigate('/lectures')} className="text-xs text-[#94A3B8] hover:text-white transition-colors flex items-center gap-1">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                {subjectProgress.length > 0
                  ? subjectProgress.map((subject, i) => <SubjectCard key={i} subject={subject} />)
                  : <p className="text-[#64748B] text-sm">No subjects available.</p>}
              </div>

              {/* Right column */}
              <div className="space-y-4">
                {/* Quick Actions */}
                <div className="rounded-2xl p-5 border border-[#1E2D4A]" style={{background: 'rgba(15,22,41,0.9)'}}>
                  <h3 className="font-semibold text-white font-jakarta mb-4">Quick Actions</h3>
                  <div className="space-y-2.5">
                    {[
                      { label: "Take a Quiz", icon: <Target className="w-4 h-4" />, path: '/quizzes', style: {background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 0 15px rgba(99,102,241,0.3)'}, textClass: "text-white" },
                      { label: "Play a Game", icon: <Gamepad2 className="w-4 h-4" />, path: '/games', style: {background: 'rgba(244,114,182,0.1)', border: '1px solid rgba(244,114,182,0.3)'}, textClass: "text-[#F472B6]" },
                      { label: "Watch Lectures", icon: <BookOpen className="w-4 h-4" />, path: '/lectures', style: {background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)'}, textClass: "text-[#60A5FA]" },
                      { label: "Leaderboard", icon: <Trophy className="w-4 h-4" />, path: '/leaderboard', style: {background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)'}, textClass: "text-[#FBBF24]" },
                    ].map(({ label, icon, path, style, textClass }) => (
                      <button
                        key={label}
                        onClick={() => navigate(path)}
                        className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-xl font-medium text-sm transition-all hover:scale-[1.02] ${textClass}`}
                        style={style}
                      >
                        {icon}
                        {label}
                        <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Activity / Quest Log */}
                <div className="rounded-2xl p-5 border border-[#1E2D4A]" style={{background: 'rgba(15,22,41,0.9)'}}>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-semibold text-white font-jakarta">Quest Log</h3>
                    <div className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#6366F1]/20 text-[#94A3B8]">Recent</div>
                  </div>
                  <div className="space-y-3">
                    {recentActivity.length > 0
                      ? recentActivity.slice(0, 4).map((activity, i) => {
                          const scoreColor = activity.score >= 90 ? '#34D399' : activity.score >= 70 ? '#FBBF24' : '#FB923C';
                          return (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[#1E2D4A] hover:border-[#6366F1]/30 transition-colors">
                              <div className="flex items-center gap-2.5">
                                <span className="text-lg">{activity.subject_icon === 'game' ? '🎮' : activity.subject_icon || '📚'}</span>
                                <div>
                                  <p className="text-xs font-semibold text-white">{activity.activity_name}</p>
                                  <p className="text-xs text-[#64748B]">{activity.subject_name}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-0.5">
                                <span className="text-xs font-bold" style={{color: scoreColor}}>{Math.round(activity.score || 0)}%</span>
                                <span className="text-xs text-[#94A3B8]">+{Math.round(activity.score * 1.5)} XP</span>
                              </div>
                            </div>
                          );
                        })
                      : <p className="text-[#64748B] text-xs">No recent activity.</p>}
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
