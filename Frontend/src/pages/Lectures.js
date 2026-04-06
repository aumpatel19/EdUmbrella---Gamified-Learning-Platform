import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/simplebutton";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import { Play, Clock, Users, BookOpen } from "lucide-react";
import StudentSidebar from "../components/StudentSidebar";

const Lectures = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";
  const studentClass = localStorage.getItem("studentClass") || "6"; // Default to class 6

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("studentClass");
    navigate("/");
  };

  const allSubjects = [
    {
      id: "math",
      title: "Mathematics",
      description: "Basic arithmetic and number operations",
      icon: "🧮",
      color: "from-blue-500 to-blue-700",
      lectureCount: 8,
      duration: "6h 30m",
      students: 145,
      teacher: "Mrs. Sarah Wilson",
      teacherAvatar: "/placeholder.svg",
      progress: 75,
      lastUpdated: "2 days ago",
      classes: ["6", "7", "8"]
    },
    {
      id: "science",
      title: "Science",
      description: "Biology, chemistry fundamentals and laboratory experiments",
      icon: "🔬",
      color: "from-green-500 to-green-700",
      lectureCount: 10,
      duration: "8h 45m",
      students: 132,
      teacher: "Prof. Michael Chen",
      teacherAvatar: "/placeholder.svg",
      progress: 60,
      lastUpdated: "1 day ago",
      classes: ["6", "7", "8", "9", "10"]
    },
    {
      id: "physics",
      title: "Physics",
      description: "Basic mechanics and properties of matter",
      icon: "⚛️",
      color: "from-purple-500 to-purple-700",
      lectureCount: 12,
      duration: "9h 15m",
      students: 98,
      teacher: "Dr. Emily Rodriguez",
      teacherAvatar: "/placeholder.svg",
      progress: 45,
      lastUpdated: "3 days ago",
      classes: ["9", "10", "11", "12"]
    },
    {
      id: "history",
      title: "History",
      description: "Ancient civilizations and historical timeline studies",
      icon: "🌍",
      color: "from-orange-500 to-orange-700",
      lectureCount: 8,
      duration: "5h 20m",
      students: 167,
      teacher: "Dr. James Thompson",
      teacherAvatar: "/placeholder.svg",
      progress: 85,
      lastUpdated: "4 hours ago",
      classes: ["6", "7", "8", "9"]
    },
    {
      id: "english",
      title: "English",
      description: "Grammar, vocabulary, and basic literature",
      icon: "📖",
      color: "from-indigo-500 to-indigo-700",
      lectureCount: 12,
      duration: "8h 00m",
      students: 180,
      teacher: "Ms. Lisa Brown",
      teacherAvatar: "/placeholder.svg",
      progress: 70,
      lastUpdated: "1 day ago",
      classes: ["6", "7", "8", "9", "10"]
    },
    {
      id: "geography",
      title: "Geography",
      description: "Physical and political geography basics",
      icon: "🗺️",
      color: "from-teal-500 to-teal-700",
      lectureCount: 10,
      duration: "7h 30m",
      students: 120,
      teacher: "Mr. David Kumar",
      teacherAvatar: "/placeholder.svg",
      progress: 55,
      lastUpdated: "2 days ago",
      classes: ["6", "7", "8"]
    },
    {
      id: "chemistry",
      title: "Chemistry",
      description: "Chemical reactions and periodic table",
      icon: "⚗️",
      color: "from-red-500 to-red-700",
      lectureCount: 15,
      duration: "11h 45m",
      students: 85,
      teacher: "Dr. Priya Sharma",
      teacherAvatar: "/placeholder.svg",
      progress: 40,
      lastUpdated: "1 day ago",
      classes: ["9", "10", "11", "12"]
    },
    {
      id: "biology",
      title: "Biology",
      description: "Life processes and human body systems",
      icon: "🧬",
      color: "from-emerald-500 to-emerald-700",
      lectureCount: 14,
      duration: "10h 20m",
      students: 92,
      teacher: "Prof. Rajesh Gupta",
      teacherAvatar: "/placeholder.svg",
      progress: 65,
      lastUpdated: "3 days ago",
      classes: ["9", "10", "11", "12"]
    }
  ];

  // Filter subjects based on student's class
  const subjects = allSubjects.filter(subject => 
    subject.classes.includes(studentClass)
  );

  const handleSubjectClick = (subjectId) => {
    navigate(`/lectures/${subjectId}`);
  };

  const subjectGlowColors = {
    "from-blue-500 to-blue-700": "rgba(59,130,246,0.35)",
    "from-green-500 to-green-700": "rgba(16,185,129,0.35)",
    "from-purple-500 to-purple-700": "rgba(124,58,237,0.35)",
    "from-orange-500 to-orange-700": "rgba(245,158,11,0.35)",
    "from-indigo-500 to-indigo-700": "rgba(99,102,241,0.35)",
    "from-teal-500 to-teal-700": "rgba(6,182,212,0.35)",
    "from-red-500 to-red-700": "rgba(236,72,153,0.35)",
    "from-emerald-500 to-emerald-700": "rgba(16,185,129,0.35)",
  };

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
                <SidebarTrigger className="md:hidden text-slate-400 hover:text-white" />
                <span className="text-xl">📚</span>
                <h1
                  className="text-xl font-bold gradient-text-violet font-sora"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Lecture Hall
                </h1>
                <span
                  className="px-2 py-0.5 rounded text-xs font-semibold"
                  style={{
                    background: "rgba(124,58,237,0.18)",
                    color: "#a78bfa",
                    border: "1px solid rgba(124,58,237,0.3)",
                  }}
                >
                  Class {studentClass}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "linear-gradient(135deg,#7C3AED,#06B6D4)",
                      color: "#fff",
                    }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-300 hidden sm:block">{userName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-colors"
                  style={{
                    border: "1px solid rgba(99,102,241,0.25)",
                    background: "rgba(15,22,41,0.6)",
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            {/* Page Title */}
            <div className="mb-8 animate-slide-up">
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: "#fff", fontFamily: "'Sora', sans-serif" }}
              >
                Video Lectures
              </h2>
              <p className="text-slate-400">
                Access comprehensive video lectures from expert teachers for your class level
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  icon: <BookOpen className="w-5 h-5" />,
                  label: "Total Subjects",
                  value: subjects.length,
                  iconBg: "rgba(124,58,237,0.18)",
                  iconColor: "#a78bfa",
                },
                {
                  icon: <Play className="w-5 h-5" />,
                  label: "Total Lectures",
                  value: subjects.reduce((sum, subject) => sum + subject.lectureCount, 0),
                  iconBg: "rgba(16,185,129,0.18)",
                  iconColor: "#34d399",
                },
                {
                  icon: <Clock className="w-5 h-5" />,
                  label: "Total Duration",
                  value: "37h+",
                  iconBg: "rgba(6,182,212,0.18)",
                  iconColor: "#22d3ee",
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  label: "Enrolled",
                  value: "540+",
                  iconBg: "rgba(245,158,11,0.18)",
                  iconColor: "#fbbf24",
                },
              ].map((stat, i) => (
                <div key={i} className="card-game p-4 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: stat.iconBg, color: stat.iconColor }}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "#fff", fontFamily: "'Sora', sans-serif" }}
                    >
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Subject Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => {
                const glowColor = subjectGlowColors[subject.color] || "rgba(124,58,237,0.25)";
                return (
                  <div
                    key={subject.id}
                    className="card-game group cursor-pointer overflow-hidden transition-all duration-300"
                    onClick={() => handleSubjectClick(subject.id)}
                    style={{ "--glow": glowColor }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = `0 0 28px ${glowColor}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    {/* Color accent bar */}
                    <div className={`h-1 bg-gradient-to-r ${subject.color} w-full`} />

                    <div className="p-5">
                      {/* Subject header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                          style={{
                            background: "rgba(15,22,41,0.85)",
                            border: "1px solid rgba(99,102,241,0.25)",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          {subject.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-bold text-base truncate"
                            style={{
                              color: "#fff",
                              fontFamily: "'Sora', sans-serif",
                            }}
                          >
                            {subject.title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                            {subject.description}
                          </p>
                        </div>
                        <span
                          className="badge-xp shrink-0 text-xs"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {subject.progress}%
                        </span>
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                          { label: "Lectures", val: subject.lectureCount },
                          { label: "Duration", val: subject.duration },
                          { label: "Students", val: subject.students },
                        ].map((s) => (
                          <div
                            key={s.label}
                            className="rounded-lg p-2 text-center"
                            style={{
                              background: "rgba(26,33,64,0.6)",
                              border: "1px solid rgba(99,102,241,0.12)",
                            }}
                          >
                            <p className="text-xs text-slate-500">{s.label}</p>
                            <p className="text-sm font-semibold text-slate-200">{s.val}</p>
                          </div>
                        ))}
                      </div>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-slate-500">Updated {subject.lastUpdated}</span>
                        </div>
                        <div className="xp-bar">
                          <div
                            className={`xp-bar-fill bg-gradient-to-r ${subject.color}`}
                            style={{ width: `${subject.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* CTA button */}
                      <button
                        className="btn-violet w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold"
                      >
                        <Play className="w-4 h-4" />
                        Enter Subject →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Lectures;