import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import TeacherSidebar from "../components/TeacherSidebar";
import ApiService from "../api";

const TeacherDashboard = () => {
  const userName = localStorage.getItem("userName") || "Teacher";
  const userEmail = localStorage.getItem("userEmail") || "";

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const data = await ApiService.getTeacherDashboard(userEmail);
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
      setError('No user email found');
    }
  }, [userEmail, userName]);

  if (loading) {
    return (
      <SidebarProvider>
        <TeacherSidebar />
        <SidebarInset>
          <div
            className="min-h-screen flex items-center justify-center dot-grid"
            style={{ background: "#080D1A" }}
          >
            <div className="text-center animate-slide-up">
              <div
                className="mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{
                  width: 64,
                  height: 64,
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  boxShadow: "0 0 32px rgba(16,185,129,0.45)",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p style={{ color: "#10B981", fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: 16 }}>
                Loading teacher dashboard...
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
        <TeacherSidebar />
        <SidebarInset>
          <div
            className="min-h-screen flex items-center justify-center dot-grid"
            style={{ background: "#080D1A" }}
          >
            <div
              className="glass text-center p-8 rounded-2xl animate-slide-up"
              style={{ maxWidth: 360 }}
            >
              <p style={{ color: "#EC4899", marginBottom: 16, fontWeight: 600 }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "8px 20px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                Try Again
              </button>
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

  const getGradeColor = (score) => {
    if (score >= 90) return "#10B981";
    if (score >= 80) return "#06B6D4";
    if (score >= 70) return "#F59E0B";
    if (score >= 60) return "#F97316";
    return "#EC4899";
  };

  const statCards = [
    {
      label: "Total Students",
      value: students.length,
      sub: `Across ${teacherClasses.length} class${teacherClasses.length !== 1 ? 'es' : ''}`,
      glow: "rgba(6,182,212,0.35)",
      accent: "#06B6D4",
      icon: "👥",
    },
    {
      label: "Active Quizzes",
      value: quizStats.length,
      sub: "Available for students",
      glow: "rgba(16,185,129,0.35)",
      accent: "#10B981",
      icon: "⚡",
    },
    {
      label: "Avg. Score",
      value: `${quizStats.length > 0 ? Math.round(quizStats.reduce((acc, q) => acc + (q.average_score || 0), 0) / quizStats.length) : 0}%`,
      sub: "Across all quizzes",
      glow: "rgba(245,158,11,0.35)",
      accent: "#F59E0B",
      icon: "🏆",
    },
    {
      label: "Game Activities",
      value: gamePerformance.length,
      sub: "Different games played",
      glow: "rgba(236,72,153,0.35)",
      accent: "#EC4899",
      icon: "🎮",
    },
  ];


  const barColors = ["#10B981", "#06B6D4", "#7C3AED", "#F59E0B", "#EC4899"];

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
            <div
              className="w-full px-4 py-3 flex items-center justify-between min-w-0"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <SidebarTrigger className="md:hidden" style={{ color: "#10B981" }} />
                <h1
                  className="truncate"
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#fff",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Teacher Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    background: "linear-gradient(135deg, #10B981, #059669)",
                    boxShadow: "0 0 16px rgba(16,185,129,0.5)",
                    fontWeight: 700,
                    color: "#fff",
                    fontFamily: "Sora, sans-serif",
                    fontSize: 15,
                  }}
                >
                  {(teacherInfo.name || userName).charAt(0).toUpperCase()}
                </div>
                <span
                  className="hidden sm:block"
                  style={{ color: "#fff", fontWeight: 600, fontSize: 14, fontFamily: "Sora, sans-serif" }}
                >
                  {teacherInfo.name || userName}
                </span>
                <span
                  style={{
                    background: "rgba(16,185,129,0.15)",
                    color: "#10B981",
                    border: "1px solid rgba(16,185,129,0.35)",
                    borderRadius: "9999px",
                    padding: "2px 10px",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "Sora, sans-serif",
                    letterSpacing: "0.04em",
                  }}
                >
                  Educator
                </span>
              </div>
            </div>
          </header>

          <div className="w-full px-4 py-6 sm:py-8">
            {/* Welcome Banner */}
            <div
              className="card-game mb-8 relative overflow-hidden animate-slide-up"
              style={{ padding: "28px 32px" }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(5,150,105,0.08) 100%)",
                  borderRadius: "inherit",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <h2
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontWeight: 800,
                    fontSize: 24,
                    color: "#fff",
                    marginBottom: 6,
                  }}
                >
                  Welcome back,{" "}
                  <span style={{ color: "#10B981" }}>{teacherInfo.name || userName}</span>!
                </h2>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 20 }}>
                  Your students are leveling up. Classes taught:{" "}
                  <span style={{ color: "#10B981", fontWeight: 600 }}>
                    {teacherClasses.length > 0 ? teacherClasses.join(', ') : 'No classes assigned'}
                  </span>
                </p>
                <div className="flex gap-3 flex-wrap">
                  <button
                    style={{
                      background: "linear-gradient(135deg, #10B981, #059669)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "0.6rem",
                      padding: "10px 22px",
                      fontWeight: 700,
                      fontFamily: "Sora, sans-serif",
                      fontSize: 14,
                      cursor: "pointer",
                      boxShadow: "0 0 20px rgba(16,185,129,0.4)",
                      transition: "all 0.2s",
                    }}
                  >
                    Create Quiz
                  </button>
                  <button
                    style={{
                      background: "rgba(15,22,41,0.75)",
                      backdropFilter: "blur(14px)",
                      color: "#10B981",
                      border: "1px solid rgba(16,185,129,0.35)",
                      borderRadius: "0.6rem",
                      padding: "10px 22px",
                      fontWeight: 700,
                      fontFamily: "Sora, sans-serif",
                      fontSize: 14,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    View Analytics
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
              {statCards.map(({ label, value, sub, glow, accent, icon }) => (
                <div
                  key={label}
                  className="card-game animate-slide-up"
                  style={{
                    padding: "14px 14px",
                    boxShadow: `0 0 24px ${glow}`,
                    borderColor: `${accent}33`,
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                    {label}
                  </p>
                  <p
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontWeight: 800,
                      fontSize: 28,
                      color: accent,
                      lineHeight: 1.1,
                      marginBottom: 4,
                      textShadow: `0 0 16px ${glow}`,
                    }}
                  >
                    {value}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{sub}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList
                className="grid w-full grid-cols-4"
                style={{
                  background: "rgba(15,22,41,0.75)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "0.75rem",
                  padding: "4px",
                }}
              >
                {["overview", "students", "quizzes", "content"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="rounded-md text-sm capitalize"
                    style={{
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Class Performance */}
                  <div className="card-game" style={{ padding: "24px" }}>
                    <h3
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontWeight: 700,
                        fontSize: 16,
                        color: "#fff",
                        marginBottom: 20,
                      }}
                    >
                      Class Performance
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                      {quizStats.slice(0, 5).length > 0 ? (
                        quizStats.slice(0, 5).map((quiz, index) => (
                          <div key={index}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500 }}>
                                {quiz.subject_name} — {quiz.title}
                              </span>
                              <span style={{ color: barColors[index % barColors.length], fontWeight: 800, fontSize: 13 }}>
                                {Math.round(quiz.average_score || 0)}%
                              </span>
                            </div>
                            <div
                              style={{
                                width: "100%",
                                height: 7,
                                background: "rgba(255,255,255,0.08)",
                                borderRadius: 999,
                                overflow: "hidden",
                                marginBottom: 4,
                              }}
                            >
                              <div
                                style={{
                                  width: `${quiz.average_score || 0}%`,
                                  height: "100%",
                                  background: barColors[index % barColors.length],
                                  borderRadius: 999,
                                  boxShadow: `0 0 8px ${barColors[index % barColors.length]}88`,
                                  transition: "width 0.6s ease",
                                }}
                              />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>Class {quiz.class_level}</span>
                              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{quiz.completed_attempts || 0} attempts</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>No quiz data available yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="card-game" style={{ padding: "24px" }}>
                    <h3
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontWeight: 700,
                        fontSize: 16,
                        color: "#fff",
                        marginBottom: 20,
                      }}
                    >
                      Quick Actions
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <button
                        style={{
                          height: 64,
                          background: "linear-gradient(135deg, #10B981, #059669)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "0.75rem",
                          fontWeight: 700,
                          fontFamily: "Sora, sans-serif",
                          fontSize: 14,
                          cursor: "pointer",
                          boxShadow: "0 0 20px rgba(16,185,129,0.35)",
                          transition: "all 0.2s",
                        }}
                      >
                        Create Quiz
                      </button>
                      {["Upload Module", "View Analytics", "Manage Classes"].map((action) => (
                        <button
                          key={action}
                          style={{
                            height: 64,
                            background: "rgba(15,22,41,0.75)",
                            backdropFilter: "blur(14px)",
                            color: "rgba(255,255,255,0.75)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: "0.75rem",
                            fontWeight: 600,
                            fontFamily: "Sora, sans-serif",
                            fontSize: 14,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Students Tab */}
              <TabsContent value="students" className="space-y-6">
                <div className="card-game" style={{ padding: "24px" }}>
                  <h3
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontWeight: 700,
                      fontSize: 16,
                      color: "#fff",
                      marginBottom: 4,
                    }}
                  >
                    Student Management
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 20 }}>
                    Monitor student progress and performance across your classes
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {studentPerformance.length > 0 ? (
                      studentPerformance.map((student, index) => {
                        const gradeInfo = getGrade(student.average_score || 0);
                        const gradeColor = getGradeColor(student.average_score || 0);
                        const initials = student.student_name
                          ? student.student_name.split(' ').map((n) => n[0]).join('')
                          : 'S';
                        return (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "14px 18px",
                              background: "rgba(26,33,64,0.6)",
                              border: "1px solid rgba(255,255,255,0.07)",
                              borderRadius: "0.875rem",
                              gap: 12,
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                              <div
                                style={{
                                  width: 42,
                                  height: 42,
                                  borderRadius: "50%",
                                  background: "rgba(16,185,129,0.12)",
                                  border: "2px solid rgba(16,185,129,0.5)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 800,
                                  color: "#10B981",
                                  fontSize: 14,
                                  fontFamily: "Sora, sans-serif",
                                  flexShrink: 0,
                                }}
                              >
                                {initials}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: "#fff", fontSize: 14, fontFamily: "Sora, sans-serif" }}>
                                  {student.student_name || 'Unknown Student'}
                                </div>
                                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>
                                  Class {student.class} &bull; {student.completed_quizzes || 0} quizzes completed
                                </div>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                              <div style={{ textAlign: "right" }}>
                                <div
                                  style={{
                                    background: `${gradeColor}22`,
                                    color: gradeColor,
                                    border: `1px solid ${gradeColor}55`,
                                    borderRadius: "9999px",
                                    padding: "2px 10px",
                                    fontWeight: 800,
                                    fontSize: 12,
                                    fontFamily: "Sora, sans-serif",
                                    display: "inline-block",
                                    marginBottom: 4,
                                  }}
                                >
                                  Grade {gradeInfo.grade}
                                </div>
                                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                                  {Math.round(student.average_score || 0)}% avg
                                </div>
                              </div>
                              <div
                                style={{
                                  width: 72,
                                  height: 6,
                                  background: "rgba(255,255,255,0.08)",
                                  borderRadius: 999,
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${student.average_score || 0}%`,
                                    height: "100%",
                                    background: gradeColor,
                                    borderRadius: 999,
                                    boxShadow: `0 0 6px ${gradeColor}`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "32px 0" }}>
                        No students found for your assigned classes.
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Quizzes Tab */}
              <TabsContent value="quizzes" className="space-y-6">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontWeight: 700,
                      fontSize: 18,
                      color: "#fff",
                    }}
                  >
                    Quiz Management
                  </h3>
                  <button
                    style={{
                      background: "linear-gradient(135deg, #10B981, #059669)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "0.6rem",
                      padding: "9px 20px",
                      fontWeight: 700,
                      fontFamily: "Sora, sans-serif",
                      fontSize: 13,
                      cursor: "pointer",
                      boxShadow: "0 0 18px rgba(16,185,129,0.4)",
                    }}
                  >
                    Create New Quiz
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {quizStats.length > 0 ? (
                    quizStats.map((quiz, index) => {
                      const isGame = quiz.quiz_type === 'game';
                      const typeBadgeBg = isGame ? "rgba(236,72,153,0.15)" : "rgba(16,185,129,0.15)";
                      const typeBadgeColor = isGame ? "#EC4899" : "#10B981";
                      const typeBadgeBorder = isGame ? "rgba(236,72,153,0.4)" : "rgba(16,185,129,0.4)";
                      return (
                        <div
                          key={index}
                          className="card-game animate-slide-up"
                          style={{ padding: "20px" }}
                        >
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                            <h4
                              style={{
                                fontWeight: 700,
                                color: "#fff",
                                fontSize: 14,
                                fontFamily: "Sora, sans-serif",
                                lineHeight: 1.4,
                                flex: 1,
                                marginRight: 8,
                              }}
                            >
                              {quiz.title}
                            </h4>
                            <span
                              style={{
                                background: typeBadgeBg,
                                color: typeBadgeColor,
                                border: `1px solid ${typeBadgeBorder}`,
                                borderRadius: "9999px",
                                padding: "2px 10px",
                                fontSize: 11,
                                fontWeight: 700,
                                flexShrink: 0,
                                fontFamily: "Sora, sans-serif",
                              }}
                            >
                              {isGame ? "Game" : "Quiz"}
                            </span>
                          </div>
                          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 14 }}>
                            {quiz.subject_name} &bull; Class {quiz.class_level}
                          </p>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                            {[
                              ["Total Attempts", quiz.total_attempts || 0],
                              ["Completed", quiz.completed_attempts || 0],
                              ["Avg Score", `${Math.round(quiz.average_score || 0)}%`],
                            ].map(([label, val]) => (
                              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                                <span style={{ color: "rgba(255,255,255,0.45)" }}>{label}</span>
                                <span style={{ fontWeight: 700, color: "#fff" }}>{val}</span>
                              </div>
                            ))}
                          </div>
                          <div
                            style={{
                              width: "100%",
                              height: 5,
                              background: "rgba(255,255,255,0.08)",
                              borderRadius: 999,
                              overflow: "hidden",
                              marginBottom: 14,
                            }}
                          >
                            <div
                              style={{
                                width: `${quiz.average_score || 0}%`,
                                height: "100%",
                                background: barColors[index % barColors.length],
                                borderRadius: 999,
                                boxShadow: `0 0 8px ${barColors[index % barColors.length]}88`,
                              }}
                            />
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            {["View Details", "Analytics"].map((btn) => (
                              <button
                                key={btn}
                                style={{
                                  flex: 1,
                                  padding: "7px 0",
                                  background: "rgba(15,22,41,0.75)",
                                  border: "1px solid rgba(255,255,255,0.07)",
                                  borderRadius: "0.5rem",
                                  color: "rgba(255,255,255,0.65)",
                                  fontSize: 12,
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  fontFamily: "Sora, sans-serif",
                                  transition: "all 0.2s",
                                }}
                              >
                                {btn}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div
                      className="col-span-full"
                      style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "32px 0" }}
                    >
                      No quizzes available for your assigned classes.
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontWeight: 700,
                      fontSize: 18,
                      color: "#fff",
                    }}
                  >
                    Game & Content Performance
                  </h3>
                  <button
                    style={{
                      background: "rgba(15,22,41,0.75)",
                      backdropFilter: "blur(14px)",
                      color: "rgba(255,255,255,0.7)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "0.6rem",
                      padding: "9px 20px",
                      fontWeight: 600,
                      fontFamily: "Sora, sans-serif",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    View All Content
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Game Performance */}
                  <div className="card-game" style={{ padding: "24px" }}>
                    <h3
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontWeight: 700,
                        fontSize: 16,
                        color: "#fff",
                        marginBottom: 4,
                      }}
                    >
                      Game Performance
                    </h3>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 18 }}>
                      Educational games played by your students
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {gamePerformance.length > 0 ? (
                        gamePerformance.slice(0, 5).map((game, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "12px 14px",
                              background: "rgba(26,33,64,0.6)",
                              border: "1px solid rgba(255,255,255,0.07)",
                              borderRadius: "0.75rem",
                            }}
                          >
                            <div>
                              <span style={{ fontWeight: 600, color: "#fff", fontSize: 13, fontFamily: "Sora, sans-serif" }}>
                                {game.game_name}
                              </span>
                              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>
                                {game.subject_name} &bull; Class {game.class_level}
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span
                                style={{
                                  background: "rgba(16,185,129,0.15)",
                                  color: "#10B981",
                                  border: "1px solid rgba(16,185,129,0.35)",
                                  borderRadius: "9999px",
                                  padding: "2px 10px",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  fontFamily: "Sora, sans-serif",
                                }}
                              >
                                {Math.round(game.average_score || 0)}% avg
                              </span>
                              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 4 }}>
                                {game.total_plays || 0} plays
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>No game data available yet.</p>
                      )}
                      <button
                        style={{
                          width: "100%",
                          padding: "9px 0",
                          background: "rgba(15,22,41,0.75)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: "0.6rem",
                          color: "rgba(255,255,255,0.65)",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "Sora, sans-serif",
                          marginTop: 4,
                        }}
                      >
                        View Game Analytics
                      </button>
                    </div>
                  </div>

                  {/* Subject Overview */}
                  <div className="card-game" style={{ padding: "24px" }}>
                    <h3
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontWeight: 700,
                        fontSize: 16,
                        color: "#fff",
                        marginBottom: 4,
                      }}
                    >
                      Subject Overview
                    </h3>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 18 }}>
                      Performance across different subjects
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "12px 14px",
                                background: "rgba(26,33,64,0.6)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: "0.75rem",
                              }}
                            >
                              <div>
                                <span style={{ fontWeight: 600, color: "#fff", fontSize: 13, fontFamily: "Sora, sans-serif" }}>
                                  {subject.name}
                                </span>
                                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>
                                  {subject.totalQuizzes} quiz{subject.totalQuizzes !== 1 ? 'es' : ''}
                                </div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <span
                                  style={{
                                    background: `${barColors[index % barColors.length]}22`,
                                    color: barColors[index % barColors.length],
                                    border: `1px solid ${barColors[index % barColors.length]}55`,
                                    borderRadius: "9999px",
                                    padding: "2px 10px",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    fontFamily: "Sora, sans-serif",
                                  }}
                                >
                                  {Math.round(subject.avgScore)}%
                                </span>
                                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 4 }}>
                                  {subject.totalAttempts} attempts
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>No subject data available yet.</p>
                        );
                      })()}
                      <button
                        style={{
                          width: "100%",
                          padding: "9px 0",
                          background: "rgba(15,22,41,0.75)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: "0.6rem",
                          color: "rgba(255,255,255,0.65)",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "Sora, sans-serif",
                          marginTop: 4,
                        }}
                      >
                        View Subject Details
                      </button>
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
