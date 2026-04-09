import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubjectIcon from "../components/SubjectIcon";
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await ApiService.getQuizzes({ type: 'traditional', class_level: parseInt(studentClass) });
        setQuizzes(response.quizzes || []);

        if (userEmail) {
          try {
            const progress = await ApiService.getStudentProgress(userEmail);
            setStudentProgress(progress);
          } catch (_) {}
        }
      } catch (err) {
        console.error('Failed to load quizzes:', err);
        setError('Failed to load quizzes. Please try again.');
      } finally {
        setLoading(false);
      }
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

  // Subject color palette — each subject gets its own distinct color
  const subjectColors = {
    Mathematics:  { a: "#6366F1", b: "#4F46E5", rgb: "99,102,241",  light: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.35)"  },
    Science:      { a: "#10B981", b: "#059669", rgb: "16,185,129",  light: "rgba(16,185,129,0.15)",  border: "rgba(16,185,129,0.35)"  },
    Physics:      { a: "#06B6D4", b: "#0891B2", rgb: "6,182,212",   light: "rgba(6,182,212,0.15)",   border: "rgba(6,182,212,0.35)"   },
    Chemistry:    { a: "#F59E0B", b: "#D97706", rgb: "245,158,11",  light: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.35)"  },
    Biology:      { a: "#84CC16", b: "#65A30D", rgb: "132,204,22",  light: "rgba(132,204,22,0.12)",  border: "rgba(132,204,22,0.3)"   },
    History:      { a: "#F97316", b: "#EA580C", rgb: "249,115,22",  light: "rgba(249,115,22,0.15)",  border: "rgba(249,115,22,0.35)"  },
    English:      { a: "#EC4899", b: "#DB2777", rgb: "236,72,153",  light: "rgba(236,72,153,0.15)",  border: "rgba(236,72,153,0.35)"  },
    Geography:    { a: "#14B8A6", b: "#0D9488", rgb: "20,184,166",  light: "rgba(20,184,166,0.15)",  border: "rgba(20,184,166,0.35)"  },
  };
  const getSubjectColor = (name) => subjectColors[name] || { a: "#7C3AED", b: "#5B21B6", rgb: "124,58,237", light: "rgba(124,58,237,0.15)", border: "rgba(124,58,237,0.35)" };

  const getDifficultyStyle = (difficulty) => {
    switch ((difficulty || "").toLowerCase()) {
      case 'easy':   return { background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", color: "#34D399" };
      case 'medium': return { background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.35)", color: "#FCD34D" };
      case 'hard':   return { background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.35)", color: "#F9A8D4" };
      default:       return { background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.35)", color: "#A78BFA" };
    }
  };

  const getScoreStyle = (score) => {
    if (score >= 80) return { color: "#10B981", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" };
    if (score >= 60) return { color: "#F59E0B", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" };
    return { color: "#F87171", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" };
  };

  if (loading) {
    return (
      <SidebarProvider>
        <StudentSidebar />
        <SidebarInset>
          <div
            className="min-h-screen flex items-center justify-center dot-grid"
            style={{ background: "#080D1A" }}
          >
            <div className="text-center animate-slide-up">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow"
                style={{
                  background: "rgba(124,58,237,0.15)",
                  border: "1px solid rgba(124,58,237,0.4)",
                }}
              >
                <Loader2 className="h-10 w-10 animate-spin" style={{ color: "#7C3AED" }} />
              </div>
              <p
                className="text-lg font-semibold tracking-widest uppercase"
                style={{ color: "#A78BFA", fontFamily: "Sora, sans-serif" }}
              >
                Loading Quiz Arena...
              </p>
              <p style={{ color: "rgba(148,163,184,0.55)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                Preparing your challenges
              </p>
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
          <div
            className="min-h-screen flex items-center justify-center dot-grid"
            style={{ background: "#080D1A" }}
          >
            <div
              className="glass text-center p-10 animate-slide-up"
              style={{ maxWidth: 400, width: "90%" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.35)" }}
              >
                <AlertCircle className="h-8 w-8" style={{ color: "#EC4899" }} />
              </div>
              <p className="font-semibold mb-2" style={{ color: "#F9A8D4", fontSize: "1.05rem" }}>
                Something went wrong
              </p>
              <p style={{ color: "rgba(249,168,212,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn-violet w-full py-2 rounded-xl font-semibold"
              >
                Try Again
              </button>
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
        <div
          className="min-h-screen dot-grid"
          style={{ background: "#080D1A" }}
        >
          {/* Sticky Header */}
          <header
            className="sticky top-0 z-50"
            style={{
              background: "rgba(8,13,26,0.95)",
              backdropFilter: "blur(16px)",
              borderBottom: "1px solid rgba(124,58,237,0.15)",
            }}
          >
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger
                  className="md:hidden"
                  style={{ color: "#A78BFA" }}
                />
                <span
                  className="text-xl font-bold gradient-text-violet"
                  style={{ fontFamily: "Sora, sans-serif", letterSpacing: "-0.01em" }}
                >
                  ⚡ Quiz Arena
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* XP Pill */}
                <span className="badge-xp hidden sm:inline-flex">
                  🎮 {studentProgress?.overall_stats?.total_xp || 0} XP
                </span>
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm"
                  style={{
                    background: "linear-gradient(135deg,#7C3AED,#5B21B6)",
                    boxShadow: "0 0 0 2px rgba(124,58,237,0.5), 0 0 12px rgba(124,58,237,0.3)",
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span
                  className="text-sm font-medium hidden sm:block"
                  style={{ color: "#E2E8F0" }}
                >
                  {userName}
                </span>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            {/* Page Title */}
            <div className="mb-10 animate-slide-up">
              <h2
                className="text-3xl font-bold gradient-text-violet mb-2"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                Quiz Arena
              </h2>
              <p style={{ color: "rgba(148,163,184,0.7)", fontSize: "1rem" }}>
                Test your knowledge, earn XP &amp; climb the leaderboard — Class {studentClass}
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {/* Total Quizzes */}
              <div
                className="card-game flex items-center gap-4"
                style={{ borderLeft: "3px solid #7C3AED" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.18)" }}
                >
                  <FileText className="w-5 h-5" style={{ color: "#A78BFA" }} />
                </div>
                <div>
                  <p style={{ color: "rgba(148,163,184,0.7)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Total Quizzes
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#A78BFA", fontFamily: "Sora, sans-serif" }}
                  >
                    {quizzes.length}
                  </p>
                </div>
              </div>

              {/* Completed */}
              <div
                className="card-game flex items-center gap-4"
                style={{ borderLeft: "3px solid #10B981" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(16,185,129,0.15)" }}
                >
                  <CheckCircle2 className="w-5 h-5" style={{ color: "#10B981" }} />
                </div>
                <div>
                  <p style={{ color: "rgba(148,163,184,0.7)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Completed
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#10B981", fontFamily: "Sora, sans-serif" }}
                  >
                    {studentProgress?.overall_stats?.completed_quizzes || 0}
                  </p>
                </div>
              </div>

              {/* Avg Score */}
              <div
                className="card-game flex items-center gap-4"
                style={{ borderLeft: "3px solid #06B6D4" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(6,182,212,0.15)" }}
                >
                  <Trophy className="w-5 h-5" style={{ color: "#06B6D4" }} />
                </div>
                <div>
                  <p style={{ color: "rgba(148,163,184,0.7)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Avg Score
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#06B6D4", fontFamily: "Sora, sans-serif" }}
                  >
                    {Math.round(studentProgress?.overall_stats?.average_score || 0)}%
                  </p>
                </div>
              </div>

              {/* Best Score */}
              <div
                className="card-game flex items-center gap-4"
                style={{ borderLeft: "3px solid #F59E0B" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(245,158,11,0.15)" }}
                >
                  <Star className="w-5 h-5" style={{ color: "#F59E0B" }} />
                </div>
                <div>
                  <p style={{ color: "rgba(148,163,184,0.7)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Best Score
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#F59E0B", fontFamily: "Sora, sans-serif" }}
                  >
                    {Math.round(studentProgress?.overall_stats?.best_score || 0)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="sections" className="space-y-6">
              <TabsList
                className="grid w-full grid-cols-4 p-1 rounded-xl"
                style={{
                  background: "rgba(15,22,41,0.8)",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                {["sections", "available", "completed", "analytics"].map((val, i) => {
                  const labels = ["By Subject", "Available", "Completed", "Analytics"];
                  return (
                    <TabsTrigger
                      key={val}
                      value={val}
                      className="text-sm font-medium transition-all rounded-lg"
                      style={{ color: "rgba(167,139,250,0.7)" }}
                    >
                      {labels[i]}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* ── BY SUBJECT TAB ── */}
              <TabsContent value="sections" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {studentProgress?.subject_progress?.map((subject) => {
                    const pct = subject.total_quizzes > 0
                      ? Math.round((subject.completed / subject.total_quizzes) * 100)
                      : 0;
                    const sc = getSubjectColor(subject.name);
                    return (
                      <div
                        key={subject.id}
                        className="group cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden"
                        style={{
                          background: "rgba(12,18,36,0.85)",
                          border: `1px solid ${sc.border}`,
                          backdropFilter: "blur(14px)",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 0 30px rgba(${sc.rgb},0.25)`; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        {/* Colored top bar */}
                        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${sc.a}, ${sc.b})` }} />

                        <div className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="rounded-xl overflow-hidden shrink-0">
                                <SubjectIcon name={subject.name} size={48} />
                              </div>
                              <div>
                                <h3 className="font-bold text-white text-base" style={{ fontFamily: "Sora, sans-serif" }}>
                                  {subject.name}
                                </h3>
                                <p className="text-slate-500 text-xs">{subject.completed} of {subject.total_quizzes} done</p>
                              </div>
                            </div>
                            {/* Avg badge uses subject color */}
                            <span className="text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap"
                              style={{ background: sc.light, color: sc.a, border: `1px solid ${sc.border}` }}>
                              {Math.round(subject.average_score)}% avg
                            </span>
                          </div>

                          {/* Progress bar — subject color */}
                          <div className="mb-4">
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-slate-500">Progress</span>
                              <span className="font-semibold" style={{ color: sc.a }}>{pct}%</span>
                            </div>
                            <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                              <div className="h-2 rounded-full transition-all duration-700"
                                style={{ width: `${pct}%`, background: `linear-gradient(90deg,${sc.a},${sc.b})`, boxShadow: `0 0 8px rgba(${sc.rgb},0.5)` }} />
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                            <div className="rounded-xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                              <p className="text-slate-500 mb-0.5">Total</p>
                              <p className="font-bold text-white text-sm">{subject.total_quizzes}</p>
                            </div>
                            <div className="rounded-xl p-2.5 text-center" style={{ background: sc.light, border: `1px solid ${sc.border}` }}>
                              <p className="text-slate-400 mb-0.5">Best</p>
                              <p className="font-bold text-sm" style={{ color: sc.a }}>{Math.round(subject.best_score)}%</p>
                            </div>
                          </div>

                          {/* Button uses subject color */}
                          <button
                            className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                            style={{ background: `linear-gradient(135deg,${sc.a},${sc.b})`, color: "#fff", boxShadow: `0 0 16px rgba(${sc.rgb},0.3)` }}
                          >
                            <Target className="w-4 h-4" />
                            View {subject.name} Quizzes
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* ── AVAILABLE TAB ── */}
              <TabsContent value="available" className="space-y-3">
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Sora, sans-serif" }}>Available Quizzes</h3>
                {quizzes.map((quiz) => {
                  const sc = getSubjectColor(quiz.subject_name);
                  const diffStyle = getDifficultyStyle(quiz.difficulty);
                  return (
                    <div key={quiz.id} className="rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
                      style={{ background: "rgba(12,18,36,0.85)", border: `1px solid ${sc.border}`, backdropFilter: "blur(14px)" }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 20px rgba(${sc.rgb},0.2)`}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                    >
                      <div className="h-0.5" style={{ background: `linear-gradient(90deg,${sc.a},${sc.b})` }} />
                      <div className="p-5 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ background: sc.light, border: `1px solid ${sc.border}` }}>
                          {quiz.subject_icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <div>
                              <h4 className="font-bold text-white text-base leading-tight" style={{ fontFamily: "Sora, sans-serif" }}>{quiz.title}</h4>
                              <p className="text-xs mt-0.5" style={{ color: sc.a }}>{quiz.subject_name}</p>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize flex-shrink-0" style={diffStyle}>{quiz.difficulty}</span>
                          </div>
                          {quiz.description && (
                            <p className="text-sm mb-3 line-clamp-2 text-slate-500">{quiz.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="flex items-center gap-1.5 text-xs text-slate-500"><Clock className="w-3.5 h-3.5" />{quiz.duration_minutes} min</span>
                            <span className="flex items-center gap-1.5 text-xs text-slate-500"><FileText className="w-3.5 h-3.5" />{quiz.total_questions} questions</span>
                            <span className="badge-xp text-xs">⚡ {quiz.xp_reward || quiz.total_questions * 10} XP</span>
                          </div>
                          <button
                            className="px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 text-white transition-all hover:opacity-90"
                            style={{ background: `linear-gradient(135deg,${sc.a},${sc.b})`, boxShadow: `0 0 14px rgba(${sc.rgb},0.3)` }}
                            onClick={() => handleQuizStart(quiz)}
                          >
                            <Play className="w-4 h-4" /> Start Quiz ⚡
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {quizzes.length === 0 && (
                  <div className="text-center py-16">
                    <FileText
                      className="h-14 w-14 mx-auto mb-4"
                      style={{ color: "rgba(124,58,237,0.4)" }}
                    />
                    <p style={{ color: "rgba(148,163,184,0.55)", fontSize: "1rem" }}>
                      No quizzes available at the moment.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* ── COMPLETED TAB ── */}
              <TabsContent value="completed" className="space-y-3">
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Sora, sans-serif" }}>Completed Quizzes</h3>
                {studentProgress?.recent_attempts?.map((attempt) => {
                  const sc = getSubjectColor(attempt.subject_name);
                  const scoreStyle = getScoreStyle(attempt.score);
                  const diffStyle = getDifficultyStyle(attempt.difficulty);
                  return (
                    <div key={attempt.id} className="rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
                      style={{ background: "rgba(12,18,36,0.85)", border: `1px solid ${sc.border}`, backdropFilter: "blur(14px)" }}>
                      <div className="h-0.5" style={{ background: `linear-gradient(90deg,${sc.a},${sc.b})` }} />
                      <div className="p-5 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ background: sc.light, border: `1px solid ${sc.border}` }}>
                          {attempt.subject_icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <h4 className="font-bold text-white text-base" style={{ fontFamily: "Sora, sans-serif" }}>{attempt.title}</h4>
                              <p className="text-xs mt-0.5" style={{ color: sc.a }}>{attempt.subject_name}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <span className="text-2xl font-bold" style={{ color: scoreStyle.color, fontFamily: "Sora, sans-serif" }}>{Math.round(attempt.score)}%</span>
                              <span className="text-slate-500 text-xs">{attempt.correct_answers}/{attempt.total_questions} correct</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3 text-xs text-slate-500">
                            <span>Completed: <span className="text-white">{new Date(attempt.completed_at).toLocaleDateString()}</span></span>
                            <span>Time: <span className="text-white">{attempt.time_spent_minutes} min</span></span>
                            <span className="px-2 py-0.5 rounded-full capitalize font-semibold" style={diffStyle}>{attempt.difficulty}</span>
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold" style={scoreStyle}><CheckCircle2 className="w-3 h-3" /> Completed</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 text-xs rounded-xl font-medium transition-all" style={{ background: sc.light, border: `1px solid ${sc.border}`, color: sc.a }}>View Results</button>
                            <button className="px-3 py-1.5 text-xs rounded-xl font-medium transition-all" style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)", color: "#67E8F9" }}>Retake Quiz</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {(!studentProgress?.recent_attempts || studentProgress.recent_attempts.length === 0) && (
                  <div className="text-center py-16">
                    <CheckCircle2
                      className="h-14 w-14 mx-auto mb-4"
                      style={{ color: "rgba(16,185,129,0.3)" }}
                    />
                    <p style={{ color: "rgba(148,163,184,0.55)", fontSize: "1rem" }}>
                      No completed quizzes yet. Start taking quizzes to see your progress!
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* ── ANALYTICS TAB ── */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Performance by Subject */}
                  <div className="card-game">
                    <h3
                      className="font-bold text-white mb-1"
                      style={{ fontFamily: "Sora, sans-serif", fontSize: "1rem" }}
                    >
                      Performance by Subject
                    </h3>
                    <p style={{ color: "rgba(148,163,184,0.55)", fontSize: "0.8rem", marginBottom: "1.25rem" }}>
                      Your average scores across subjects
                    </p>

                    <div className="space-y-4">
                      {studentProgress?.subject_progress?.map((subject) => {
                        const sc = getSubjectColor(subject.name);
                        return (
                        <div key={subject.id}>
                          <div className="flex justify-between items-center text-sm mb-1.5">
                            <span className="flex items-center gap-2 text-slate-300"><span className="rounded overflow-hidden inline-flex"><SubjectIcon name={subject.name} size={18} /></span>{subject.name}</span>
                            <span className="font-bold" style={{ color: sc.a }}>{Math.round(subject.average_score)}%</span>
                          </div>
                          <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <div className="h-2 rounded-full" style={{ width: `${Math.round(subject.average_score)}%`, background: `linear-gradient(90deg,${sc.a},${sc.b})`, boxShadow: `0 0 6px rgba(${sc.rgb},0.4)` }} />
                          </div>
                        </div>
                        );
                      })}

                      {(!studentProgress?.subject_progress || studentProgress.subject_progress.length === 0) && (
                        <div className="text-center py-6">
                          <p style={{ color: "rgba(167,139,250,0.45)", fontSize: "0.9rem" }}>
                            No data yet. Take some quizzes to see your performance!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="card-game">
                    <h3
                      className="font-bold text-white mb-1"
                      style={{ fontFamily: "Sora, sans-serif", fontSize: "1rem" }}
                    >
                      Recent Activity
                    </h3>
                    <p style={{ color: "rgba(148,163,184,0.55)", fontSize: "0.8rem", marginBottom: "1.25rem" }}>
                      Your quiz activity over time
                    </p>

                    <div className="space-y-3">
                      <div
                        className="flex items-center gap-4 p-3 rounded-xl"
                        style={{
                          background: "rgba(16,185,129,0.08)",
                          border: "1px solid rgba(16,185,129,0.2)",
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(16,185,129,0.2)" }}
                        >
                          <CheckCircle2 className="w-5 h-5" style={{ color: "#10B981" }} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: "#D1FAE5" }}>
                            Excellent performance!
                          </p>
                          <p style={{ color: "rgba(209,250,229,0.55)", fontSize: "0.78rem" }}>
                            You scored 92% on Cell Biology Quiz
                          </p>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-4 p-3 rounded-xl"
                        style={{
                          background: "rgba(124,58,237,0.08)",
                          border: "1px solid rgba(124,58,237,0.2)",
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(124,58,237,0.2)" }}
                        >
                          <Trophy className="w-5 h-5" style={{ color: "#A78BFA" }} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: "#DDD6FE" }}>
                            Quiz streak!
                          </p>
                          <p style={{ color: "rgba(221,214,254,0.55)", fontSize: "0.78rem" }}>
                            You've completed 5 quizzes this week
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Overall stats summary */}
                    <div
                      className="mt-5 p-4 rounded-xl"
                      style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}
                    >
                      <div className="grid grid-cols-3 gap-3 text-center text-sm">
                        <div>
                          <p className="text-xl font-bold" style={{ color: "#A78BFA", fontFamily: "Sora" }}>
                            {studentProgress?.overall_stats?.completed_quizzes || 0}
                          </p>
                          <p style={{ color: "rgba(148,163,184,0.55)", fontSize: "0.7rem" }}>Played</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold" style={{ color: "#10B981", fontFamily: "Sora" }}>
                            {Math.round(studentProgress?.overall_stats?.average_score || 0)}%
                          </p>
                          <p style={{ color: "rgba(148,163,184,0.55)", fontSize: "0.7rem" }}>Avg Score</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold" style={{ color: "#F59E0B", fontFamily: "Sora" }}>
                            {studentProgress?.overall_stats?.total_xp || 0}
                          </p>
                          <p style={{ color: "rgba(148,163,184,0.55)", fontSize: "0.7rem" }}>XP Earned</p>
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
