import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import { BookOpen, Loader2, Play, Clock, Users } from "lucide-react";
import StudentSidebar from "../components/StudentSidebar";
import ApiService from "../api";

const subjectMeta = {
  'Mathematics':    { icon: '🧮', color: 'from-blue-500 to-blue-700',    glow: 'rgba(59,130,246,0.35)' },
  'Science':        { icon: '🔬', color: 'from-green-500 to-green-700',   glow: 'rgba(16,185,129,0.35)' },
  'Physics':        { icon: '⚡', color: 'from-purple-500 to-purple-700', glow: 'rgba(124,58,237,0.35)' },
  'Chemistry':      { icon: '🧪', color: 'from-yellow-500 to-yellow-700', glow: 'rgba(234,179,8,0.35)'  },
  'Biology':        { icon: '🌿', color: 'from-emerald-500 to-emerald-700', glow: 'rgba(16,185,129,0.35)' },
  'English':        { icon: '📖', color: 'from-red-500 to-red-700',       glow: 'rgba(239,68,68,0.35)'  },
  'Hindi':          { icon: '🇮🇳', color: 'from-pink-500 to-pink-700',    glow: 'rgba(236,72,153,0.35)' },
  'Social Science': { icon: '🌍', color: 'from-amber-500 to-amber-700',   glow: 'rgba(245,158,11,0.35)' },
  'History':        { icon: '🏛️', color: 'from-orange-500 to-orange-700', glow: 'rgba(249,115,22,0.35)' },
  'Geography':      { icon: '🗺️', color: 'from-teal-500 to-teal-700',    glow: 'rgba(6,182,212,0.35)'  },
};

const Lectures = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";
  const studentClass = localStorage.getItem("studentClass") || "6";
  const [subjects, setSubjects] = useState([]);
  const [lectureCounts, setLectureCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { subjects: subs } = await ApiService.getSubjectsByClass(parseInt(studentClass));
        const { lectures } = await ApiService.getLectures(parseInt(studentClass));
        const counts = {};
        for (const l of lectures) {
          counts[l.subject_id] = (counts[l.subject_id] || 0) + 1;
        }
        setSubjects(subs || []);
        setLectureCounts(counts);
      } catch (err) {
        console.error('Failed to load lectures:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [studentClass]);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    navigate("/");
  };

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
    "from-yellow-500 to-yellow-700": "rgba(234,179,8,0.35)",
    "from-pink-500 to-pink-700": "rgba(236,72,153,0.35)",
    "from-amber-500 to-amber-700": "rgba(245,158,11,0.35)",
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
                  value: Object.values(lectureCounts).reduce((a, b) => a + b, 0),
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
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => {
                const meta = subjectMeta[subject.name] || { icon: '📚', color: 'from-indigo-500 to-indigo-700', glow: 'rgba(99,102,241,0.35)' };
                const glowColor = meta.glow;
                const lectureCount = lectureCounts[subject.id] || 0;
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
                    <div className={`h-1 bg-gradient-to-r ${meta.color} w-full`} />

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
                          {meta.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-bold text-base truncate"
                            style={{
                              color: "#fff",
                              fontFamily: "'Sora', sans-serif",
                            }}
                          >
                            {subject.name}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                            {subject.description || `CBSE Class ${studentClass} ${subject.name}`}
                          </p>
                        </div>
                        <span
                          className="badge-xp shrink-0 text-xs"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Class {studentClass}
                        </span>
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                          { label: "Lectures", val: lectureCount },
                          { label: "Duration", val: `${lectureCount * 30}m` },
                          { label: "CBSE", val: "✓" },
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

                      {/* CTA button */}
                      <button
                        className="btn-violet w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold"
                      >
                        <BookOpen className="w-4 h-4" />
                        View Chapters →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Lectures;