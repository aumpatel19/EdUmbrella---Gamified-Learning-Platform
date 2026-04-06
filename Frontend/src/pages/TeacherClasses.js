import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/simplebutton";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import TeacherSidebar from "../components/TeacherSidebar";
import { Users, BookOpen, Clock, Calendar } from "lucide-react";
import ApiService from "../api";

const TeacherClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = () => {
    setLoading(true);

    // Use mock data directly for instant loading
    setClasses([
      {
        id: 6,
        grade: "6th Grade",
        subject: "Mathematics",
        studentCount: 28,
        schedule: "Mon, Wed, Fri - 9:00 AM",
        nextClass: new Date(Date.now() + 86400000).toISOString(),
        progress: 65
      },
      {
        id: 7,
        grade: "7th Grade",
        subject: "Science",
        studentCount: 32,
        schedule: "Tue, Thu - 10:30 AM",
        nextClass: new Date(Date.now() + 172800000).toISOString(),
        progress: 72
      },
      {
        id: 8,
        grade: "8th Grade",
        subject: "English",
        studentCount: 25,
        schedule: "Mon, Wed, Fri - 2:00 PM",
        nextClass: new Date(Date.now() + 86400000).toISOString(),
        progress: 58
      },
      {
        id: 9,
        grade: "9th Grade",
        subject: "Mathematics",
        studentCount: 30,
        schedule: "Daily - 11:00 AM",
        nextClass: new Date(Date.now() + 43200000).toISOString(),
        progress: 80
      },
      {
        id: 10,
        grade: "10th Grade",
        subject: "Physics",
        studentCount: 22,
        schedule: "Tue, Thu, Sat - 1:00 PM",
        nextClass: new Date(Date.now() + 172800000).toISOString(),
        progress: 45
      },
      {
        id: 11,
        grade: "11th Grade",
        subject: "Chemistry",
        studentCount: 18,
        schedule: "Mon, Wed, Fri - 3:30 PM",
        nextClass: new Date(Date.now() + 86400000).toISOString(),
        progress: 67
      },
      {
        id: 12,
        grade: "12th Grade",
        subject: "Biology",
        studentCount: 20,
        schedule: "Tue, Thu - 2:30 PM",
        nextClass: new Date(Date.now() + 172800000).toISOString(),
        progress: 90
      }
    ]);

    setError(null);
    setLoading(false);
  };

  const getGradeColor = (grade) => {
    const gradeNum = parseInt(grade);
    if (gradeNum <= 8) return "bg-blue-100 text-blue-800";
    if (gradeNum <= 10) return "bg-green-100 text-green-800";
    return "bg-purple-100 text-purple-800";
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressAccent = (progress) => {
    if (progress >= 80) return "#10B981";
    if (progress >= 60) return "#F59E0B";
    return "#EC4899";
  };

  const subjectColors = {
    Mathematics: "#06B6D4",
    Science: "#10B981",
    English: "#7C3AED",
    Physics: "#F59E0B",
    Chemistry: "#EC4899",
    Biology: "#10B981",
  };

  const getSubjectColor = (subject) => subjectColors[subject] || "#7C3AED";

  if (loading) {
    return (
      <SidebarProvider>
        <TeacherSidebar />
        <SidebarInset>
          <div
            className="min-h-screen dot-grid"
            style={{ background: "#080D1A" }}
          >
            <header
              className="sticky top-0 z-50"
              style={{
                background: "rgba(8,13,26,0.95)",
                backdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(16,185,129,0.15)",
              }}
            >
              <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="md:hidden" />
                  <h1
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontWeight: 800,
                      fontSize: 20,
                      color: "#10B981",
                    }}
                  >
                    My Classes
                  </h1>
                </div>
              </div>
            </header>
            <div className="container mx-auto px-4 py-8 flex items-center justify-center">
              <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Sora, sans-serif" }}>
                Loading classes...
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <TeacherSidebar />
      <SidebarInset>
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
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
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
                  <BookOpen style={{ width: 16, height: 16, color: "#fff" }} />
                </div>
                <h1
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontWeight: 800,
                    fontSize: 20,
                    color: "#fff",
                  }}
                >
                  My{" "}
                  <span
                    style={{
                      background: "linear-gradient(90deg, #10B981, #06B6D4)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Classes
                  </span>
                </h1>
              </div>
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
                <BookOpen style={{ width: 14, height: 14 }} />
                Add New Class
              </button>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
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
                Classes Overview
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
                Manage your 6th–12th grade classes and track student progress
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div
                style={{
                  marginBottom: 24,
                  padding: "14px 18px",
                  background: "rgba(236,72,153,0.08)",
                  border: "1px solid rgba(236,72,153,0.3)",
                  borderRadius: "0.75rem",
                }}
              >
                <p style={{ color: "#EC4899", fontWeight: 600, fontSize: 14 }}>
                  Error loading classes: {error}
                </p>
                <p style={{ color: "rgba(236,72,153,0.6)", fontSize: 12, marginTop: 4 }}>
                  Showing mock data for demonstration
                </p>
              </div>
            )}

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(classes) && classes.map((classItem) => {
                const accent = getSubjectColor(classItem.subject);
                const progressAccent = getProgressAccent(classItem.progress);
                return (
                  <div
                    key={classItem.id}
                    className="card-game animate-slide-up"
                    style={{
                      padding: "24px",
                      borderColor: `${accent}33`,
                      boxShadow: `0 0 24px ${accent}18`,
                      transition: "all 0.25s ease",
                    }}
                  >
                    {/* Class Number Badge + Subject */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "0.75rem",
                          background: `${accent}18`,
                          border: `1px solid ${accent}44`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(8px)",
                          boxShadow: `0 0 16px ${accent}33`,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "Sora, sans-serif",
                            fontWeight: 900,
                            fontSize: 20,
                            color: accent,
                          }}
                        >
                          {classItem.id}
                        </span>
                      </div>
                      <span
                        style={{
                          background: `${accent}18`,
                          color: accent,
                          border: `1px solid ${accent}44`,
                          borderRadius: "9999px",
                          padding: "3px 11px",
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: "Sora, sans-serif",
                        }}
                      >
                        {classItem.grade}
                      </span>
                    </div>

                    {/* Subject Title */}
                    <h3
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontWeight: 800,
                        fontSize: 17,
                        color: "#fff",
                        marginBottom: 6,
                      }}
                    >
                      {classItem.subject}
                    </h3>

                    {/* Student Count */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "rgba(255,255,255,0.45)",
                        fontSize: 13,
                        marginBottom: 16,
                      }}
                    >
                      <Users style={{ width: 14, height: 14 }} />
                      {classItem.studentCount} students enrolled
                    </div>

                    {/* Schedule & Next Class */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          color: "rgba(255,255,255,0.45)",
                          fontSize: 12,
                        }}
                      >
                        <Calendar style={{ width: 13, height: 13, flexShrink: 0 }} />
                        {classItem.schedule}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          color: "rgba(255,255,255,0.45)",
                          fontSize: 12,
                        }}
                      >
                        <Clock style={{ width: 13, height: 13, flexShrink: 0 }} />
                        Next class: {new Date(classItem.nextClass).toLocaleString()}
                      </div>
                    </div>

                    {/* Progress */}
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 600 }}>
                          Course Progress
                        </span>
                        <span
                          style={{
                            color: progressAccent,
                            fontWeight: 800,
                            fontSize: 13,
                            fontFamily: "Sora, sans-serif",
                          }}
                        >
                          {classItem.progress}%
                        </span>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: 6,
                          background: "rgba(255,255,255,0.08)",
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${classItem.progress}%`,
                            height: "100%",
                            background: progressAccent,
                            borderRadius: 999,
                            boxShadow: `0 0 8px ${progressAccent}88`,
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        style={{
                          flex: 1,
                          padding: "9px 0",
                          background: "rgba(15,22,41,0.75)",
                          backdropFilter: "blur(14px)",
                          border: "1px solid rgba(99,102,241,0.25)",
                          borderRadius: "0.6rem",
                          color: "rgba(255,255,255,0.65)",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "Sora, sans-serif",
                          transition: "all 0.2s",
                        }}
                      >
                        View Details
                      </button>
                      <button
                        style={{
                          flex: 1,
                          padding: "9px 0",
                          background: "linear-gradient(135deg, #10B981, #059669)",
                          border: "none",
                          borderRadius: "0.6rem",
                          color: "#fff",
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "Sora, sans-serif",
                          boxShadow: "0 0 14px rgba(16,185,129,0.35)",
                          transition: "all 0.2s",
                        }}
                      >
                        View Class
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {classes.length === 0 && !loading && (
              <div
                className="card-game animate-slide-up"
                style={{
                  textAlign: "center",
                  padding: "64px 32px",
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "rgba(16,185,129,0.12)",
                    border: "1px solid rgba(16,185,129,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <BookOpen style={{ width: 32, height: 32, color: "#10B981" }} />
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
                  No classes found
                </h3>
                <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 20, fontSize: 14 }}>
                  You haven't been assigned to any classes yet.
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
                    boxShadow: "0 0 18px rgba(16,185,129,0.4)",
                  }}
                >
                  Contact Administration
                </button>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default TeacherClasses;
