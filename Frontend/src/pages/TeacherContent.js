import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Upload, Play, Eye, Edit, Trash2, Plus, Video, FileVideo,
  Clock, Users, CheckCircle, AlertCircle, Zap
} from "lucide-react";
import TeacherSidebar from "../components/TeacherSidebar";

const TeacherContent = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Teacher";
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const subjects = [
    { id: "math", name: "Mathematics", icon: "🧮", color: "from-blue-500 to-blue-700", glow: "59,130,246", videoCount: 12, totalDuration: "8h 30m", status: "active" },
    { id: "science", name: "Science", icon: "🔬", color: "from-green-500 to-green-700", glow: "16,185,129", videoCount: 15, totalDuration: "10h 45m", status: "active" },
    { id: "physics", name: "Physics", icon: "⚛️", color: "from-purple-500 to-purple-700", glow: "124,58,237", videoCount: 18, totalDuration: "12h 15m", status: "active" },
    { id: "history", name: "History", icon: "🌍", color: "from-orange-500 to-orange-700", glow: "245,158,11", videoCount: 10, totalDuration: "6h 20m", status: "active" }
  ];

  const recentVideos = [
    { id: 1, title: "Introduction to Calculus", subject: "Mathematics", duration: "45 min", uploadDate: "2024-01-15", views: 234, status: "published" },
    { id: 2, title: "Chemical Reactions Basics", subject: "Science", duration: "38 min", uploadDate: "2024-01-14", views: 189, status: "published" },
    { id: 3, title: "Newton's Laws of Motion", subject: "Physics", duration: "52 min", uploadDate: "2024-01-13", views: 156, status: "draft" },
    { id: 4, title: "World War II Timeline", subject: "History", duration: "41 min", uploadDate: "2024-01-12", views: 98, status: "published" }
  ];

  const handleVideoUpload = async (formData) => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowUploadForm(false);
      alert("Video uploaded successfully! It will be available to students soon.");
    }, 3000);
  };

  const statCards = [
    { label: "Total Videos", value: "55", icon: <Video className="w-5 h-5" />, color: "59,130,246" },
    { label: "Total Views", value: "2,350", icon: <Eye className="w-5 h-5" />, color: "16,185,129" },
    { label: "Total Duration", value: "37h+", icon: <Clock className="w-5 h-5" />, color: "124,58,237" },
    { label: "Active Students", value: "124", icon: <Users className="w-5 h-5" />, color: "245,158,11" },
  ];

  return (
    <SidebarProvider>
      <TeacherSidebar />
      <SidebarInset>
        <div className="min-h-screen" style={{ background: "#080D1A" }}>
          {/* Dot grid */}
          <div className="fixed inset-0 pointer-events-none" style={{
            backgroundImage: "radial-gradient(rgba(16,185,129,0.12) 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }} />

          {/* Header */}
          <header className="sticky top-0 z-50" style={{
            background: "rgba(8,13,26,0.95)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(16,185,129,0.15)"
          }}>
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-slate-400 hover:text-white" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}>
                    <span className="text-sm">📚</span>
                  </div>
                  <h1 className="text-lg font-bold text-white" style={{ fontFamily: "Sora, sans-serif" }}>
                    Content <span style={{ background: "linear-gradient(90deg,#10B981,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Management</span>
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-slate-300 text-sm">{userName}</span>
                <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-slate-400 border text-sm hover:text-white transition-colors" style={{ borderColor: "rgba(16,185,129,0.3)" }}>
                  Logout
                </button>
              </div>
            </div>
          </header>

          <div className="relative z-10 px-6 py-8 max-w-7xl mx-auto">
            {/* Page header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Teacher Portal</span>
                </div>
                <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "Sora, sans-serif" }}>
                  📚 Content <span style={{ background: "linear-gradient(90deg,#10B981,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Hub</span>
                </h2>
                <p className="text-slate-400 mt-1">Upload and manage video lectures for your students</p>
              </div>
              {!showUploadForm && (
                <button onClick={() => setShowUploadForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold transition-all hover:scale-105" style={{ background: "linear-gradient(135deg,#10B981,#059669)", boxShadow: "0 0 20px rgba(16,185,129,0.4)" }}>
                  <Plus className="w-4 h-4" />
                  Upload Video
                </button>
              )}
            </div>

            {/* Upload Form */}
            {showUploadForm && (
              <div className="mb-8 rounded-2xl p-6" style={{ background: "rgba(15,22,41,0.75)", backdropFilter: "blur(14px)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-400" /> Upload New Video Lecture
                </h3>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleVideoUpload(new FormData(e.currentTarget)); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Video Title *</label>
                      <input name="title" required placeholder="e.g., Introduction to Algebra" className="w-full px-3 py-2 rounded-lg text-white bg-slate-800/60 border border-slate-600 focus:outline-none placeholder-slate-500 text-sm" style={{ transition: "border-color 0.2s" }} onFocus={e => e.target.style.borderColor = "#10B981"} onBlur={e => e.target.style.borderColor = ""} />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Subject *</label>
                      <select name="subject" required className="w-full px-3 py-2 rounded-lg text-white bg-slate-800/60 border border-slate-600 focus:outline-none text-sm">
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Description</label>
                    <textarea name="description" rows={3} placeholder="Brief description of the video content" className="w-full px-3 py-2 rounded-lg text-white bg-slate-800/60 border border-slate-600 focus:outline-none placeholder-slate-500 text-sm resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Video File *</label>
                    <input name="video" type="file" accept="video/*" required className="w-full px-3 py-2 rounded-lg text-slate-300 bg-slate-800/60 border border-slate-600 text-sm" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Duration (min)</label>
                      <input name="duration" type="number" placeholder="45" className="w-full px-3 py-2 rounded-lg text-white bg-slate-800/60 border border-slate-600 focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Difficulty</label>
                      <select name="difficulty" className="w-full px-3 py-2 rounded-lg text-white bg-slate-800/60 border border-slate-600 focus:outline-none text-sm">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Status</label>
                      <select name="status" defaultValue="draft" className="w-full px-3 py-2 rounded-lg text-white bg-slate-800/60 border border-slate-600 focus:outline-none text-sm">
                        <option value="draft">Save as Draft</option>
                        <option value="published">Publish Immediately</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={isUploading} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold text-sm transition-all" style={{ background: "linear-gradient(135deg,#10B981,#059669)", opacity: isUploading ? 0.7 : 1 }}>
                      {isUploading ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload Video</>}
                    </button>
                    <button type="button" onClick={() => setShowUploadForm(false)} className="px-4 py-2 rounded-lg text-slate-300 border border-slate-600 text-sm hover:border-slate-400 transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid grid-cols-4 rounded-xl p-1" style={{ background: "rgba(15,22,41,0.8)", border: "1px solid rgba(99,102,241,0.15)" }}>
                {["overview","videos","subjects","analytics"].map(tab => (
                  <TabsTrigger key={tab} value={tab} className="rounded-lg text-slate-400 capitalize data-[state=active]:text-white data-[state=active]:bg-emerald-600/20 data-[state=active]:shadow-none">
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {statCards.map((s, i) => (
                    <div key={i} className="rounded-2xl p-4 transition-all hover:scale-105 cursor-default" style={{ background: "rgba(15,22,41,0.75)", backdropFilter: "blur(14px)", border: "1px solid rgba(99,102,241,0.15)" }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 24px rgba(${s.color},0.25)`}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `rgba(${s.color},0.15)`, color: `rgb(${s.color})` }}>
                        {s.icon}
                      </div>
                      <p className="text-slate-400 text-xs">{s.label}</p>
                      <p className="text-2xl font-bold text-white" style={{ fontFamily: "Sora, sans-serif" }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Videos */}
                <div className="rounded-2xl p-6" style={{ background: "rgba(15,22,41,0.75)", backdropFilter: "blur(14px)", border: "1px solid rgba(99,102,241,0.15)" }}>
                  <h3 className="text-white font-bold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>Recently Uploaded</h3>
                  <div className="space-y-3">
                    {recentVideos.map((v) => (
                      <div key={v.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: "rgba(8,13,26,0.5)", border: "1px solid rgba(99,102,241,0.1)" }}>
                        <div className="w-14 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(99,102,241,0.15)" }}>
                          <FileVideo className="w-5 h-5 text-violet-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium text-sm truncate">{v.title}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{
                              background: v.status === "published" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                              color: v.status === "published" ? "#10B981" : "#F59E0B",
                              border: `1px solid rgba(${v.status === "published" ? "16,185,129" : "245,158,11"},0.3)`
                            }}>
                              {v.status === "published" ? <CheckCircle className="inline w-3 h-3 mr-1" /> : <AlertCircle className="inline w-3 h-3 mr-1" />}
                              {v.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-500 text-xs mt-1">
                            <span>{v.subject}</span><span>•</span><span>{v.duration}</span><span>•</span><span>{v.views} views</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"><Edit className="w-4 h-4" /></button>
                          <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"><Eye className="w-4 h-4" /></button>
                          <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* All Videos */}
              <TabsContent value="videos" className="space-y-4">
                {recentVideos.map((v) => (
                  <div key={v.id} className="rounded-2xl p-5" style={{ background: "rgba(15,22,41,0.75)", backdropFilter: "blur(14px)", border: "1px solid rgba(99,102,241,0.15)" }}>
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(99,102,241,0.15)" }}>
                        <Play className="w-7 h-7 text-violet-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h4 className="text-white font-semibold">{v.title}</h4>
                            <p className="text-slate-400 text-sm">{v.subject}</p>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{
                            background: v.status === "published" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                            color: v.status === "published" ? "#10B981" : "#F59E0B"
                          }}>{v.status}</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500 text-sm">
                          <span>{v.duration}</span><span>{v.views} views</span><span>{new Date(v.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-300 text-sm border border-slate-600 hover:border-slate-400 transition-colors"><Edit className="w-4 h-4" /> Edit</button>
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-300 text-sm border border-slate-600 hover:border-slate-400 transition-colors"><Eye className="w-4 h-4" /> Preview</button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* By Subject */}
              <TabsContent value="subjects">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subjects.map((s) => (
                    <div key={s.id} className="rounded-2xl overflow-hidden transition-all hover:scale-[1.01]" style={{ background: "rgba(15,22,41,0.75)", backdropFilter: "blur(14px)", border: "1px solid rgba(99,102,241,0.15)" }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 30px rgba(${s.glow},0.2)`}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                    >
                      <div className="h-1.5" style={{ background: `linear-gradient(90deg, rgb(${s.glow}), transparent)` }} />
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{s.icon}</div>
                            <div>
                              <h4 className="text-white font-bold">{s.name}</h4>
                              <p className="text-slate-400 text-sm">{s.videoCount} videos · {s.totalDuration}</p>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full text-emerald-400" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>{s.status}</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-slate-300 text-sm border border-slate-600 hover:border-slate-400 transition-colors"><Eye className="w-4 h-4" /> View All</button>
                          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-white text-sm transition-all hover:opacity-90" style={{ background: `linear-gradient(135deg,rgba(${s.glow},0.8),rgba(${s.glow},0.5))` }}><Plus className="w-4 h-4" /> Add Video</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Analytics */}
              <TabsContent value="analytics">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-2xl p-6" style={{ background: "rgba(15,22,41,0.75)", backdropFilter: "blur(14px)", border: "1px solid rgba(99,102,241,0.15)" }}>
                    <h3 className="text-white font-bold mb-4">🏆 Top Performing Videos</h3>
                    <div className="space-y-3">
                      {recentVideos.slice(0, 3).map((v, i) => (
                        <div key={v.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: "linear-gradient(135deg,#7C3AED,#06B6D4)" }}>{i+1}</div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{v.title}</p>
                            <p className="text-slate-400 text-xs">{v.views} views</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl p-6" style={{ background: "rgba(15,22,41,0.75)", backdropFilter: "blur(14px)", border: "1px solid rgba(99,102,241,0.15)" }}>
                    <h3 className="text-white font-bold mb-4">📊 Subject Performance</h3>
                    <div className="space-y-4">
                      {subjects.map((s, i) => {
                        const pct = [72, 85, 61, 48][i];
                        return (
                          <div key={s.id}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-300 flex items-center gap-1"><span>{s.icon}</span>{s.name}</span>
                              <span className="text-white font-medium">{[520, 680, 410, 290][i]} views</span>
                            </div>
                            <div className="h-2 rounded-full" style={{ background: "rgba(99,102,241,0.1)" }}>
                              <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: `linear-gradient(90deg, rgb(${s.glow}), rgba(${s.glow},0.5))` }} />
                            </div>
                          </div>
                        );
                      })}
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

export default TeacherContent;