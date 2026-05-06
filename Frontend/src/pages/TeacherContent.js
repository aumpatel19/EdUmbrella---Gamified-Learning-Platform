import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import {
  Upload, Play, Eye, EyeOff, Edit, Trash2, Plus, Video, FileVideo,
  Clock, Users, CheckCircle, AlertCircle, X, BookOpen, Search, Filter, Youtube
} from "lucide-react";
import TeacherSidebar from "../components/TeacherSidebar";
import api from "../api";

const LANGUAGES = ["english","hindi","telugu","gujarati","kannada","tamil","marathi","bengali"];
const CLASS_LEVELS = [6,7,8,9,10,11,12];
const SUBJECT_MAP = {
  6:  ["Mathematics","Science","Social Science","English","Hindi"],
  7:  ["Mathematics","Science","Social Science","English","Hindi"],
  8:  ["Mathematics","Science","Social Science","English","Hindi"],
  9:  ["Mathematics","Science","Social Science","English","Hindi"],
  10: ["Mathematics","Science","Social Science","English","Hindi"],
  11: ["Mathematics","Physics","Chemistry","Biology","English"],
  12: ["Mathematics","Physics","Chemistry","Biology","English"],
};

const EMPTY_FORM = {
  title: "", description: "", class_level: "6", subject_name: "Mathematics",
  chapter_number: 1, duration_minutes: 30, youtubeVideoId: "", language: "english",
  is_active: false,
};

const inputStyle = {
  background: "rgba(15,22,41,0.7)", border: "1px solid rgba(99,102,241,0.25)",
  color: "#fff", borderRadius: 10, padding: "9px 13px", width: "100%", fontSize: 13, outline: "none",
};
const labelStyle = { color: "#94a3b8", fontSize: 12, marginBottom: 4, display: "block" };

function extractYtId(raw) {
  const m = raw.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
  return m ? m[1] : raw.trim();
}

export default function TeacherContent() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "";
  const userName  = localStorage.getItem("userName")  || "Teacher";

  const [lectures, setLectures]         = useState([]);
  const [subjects, setSubjects]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [showForm, setShowForm]         = useState(false);
  const [editId, setEditId]             = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [search, setSearch]             = useState("");
  const [filterClass, setFilterClass]   = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [toast, setToast]               = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const loadLectures = useCallback(async () => {
    setLoading(true);
    try {
      const { lectures: data } = await api.getTeacherLectures(userEmail);
      setLectures(data);
    } catch (e) { showToast(e.message, false); }
    finally { setLoading(false); }
  }, [userEmail]);

  const loadSubjects = useCallback(async () => {
    try {
      const { subjects: data } = await api.getSubjects();
      setSubjects(data);
    } catch {}
  }, []);

  useEffect(() => { loadLectures(); loadSubjects(); }, [loadLectures, loadSubjects]);

  const getSubjectId = (name) => subjects.find(s => s.name === name)?.id;

  const openAdd  = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (lec) => {
    const vid = lec.lecture_videos?.[0];
    setForm({
      title: lec.title, description: lec.description || "",
      class_level: String(lec.class_level), subject_name: lec.subjects?.name || "Mathematics",
      chapter_number: lec.chapter_number || 1, duration_minutes: lec.duration_minutes || 30,
      youtubeVideoId: vid?.youtube_video_id || "", language: vid?.language || "english",
      is_active: lec.is_active,
    });
    setEditId(lec.id);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditId(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const subjectId = getSubjectId(form.subject_name);
      const payload = {
        title: form.title.trim(), description: form.description.trim(),
        class_level: parseInt(form.class_level), subject_id: subjectId,
        chapter_number: parseInt(form.chapter_number) || 1,
        duration_minutes: parseInt(form.duration_minutes) || 30,
        is_active: form.is_active,
        youtubeVideoId: extractYtId(form.youtubeVideoId),
        language: form.language,
      };
      if (editId) {
        await api.updateTeacherLecture(userEmail, editId, payload);
        showToast("Lecture updated!");
      } else {
        await api.createTeacherLecture(userEmail, payload);
        showToast("Lecture created!");
      }
      closeForm();
      loadLectures();
    } catch (err) { showToast(err.message, false); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteTeacherLecture(userEmail, id);
      showToast("Lecture deleted.");
      setConfirmDelete(null);
      loadLectures();
    } catch (err) { showToast(err.message, false); }
  };

  const handleToggle = async (lec) => {
    try {
      await api.toggleTeacherLectureStatus(userEmail, lec.id, !lec.is_active);
      showToast(lec.is_active ? "Lecture unpublished." : "Lecture published!");
      loadLectures();
    } catch (err) { showToast(err.message, false); }
  };

  const handleLogout = () => {
    localStorage.removeItem("userType"); localStorage.removeItem("userName");
    navigate("/");
  };

  const availableSubjects = SUBJECT_MAP[parseInt(form.class_level)] || SUBJECT_MAP[6];
  const allSubjectNames   = [...new Set(lectures.map(l => l.subjects?.name).filter(Boolean))];

  const filtered = lectures.filter(l => {
    const matchSearch  = l.title.toLowerCase().includes(search.toLowerCase());
    const matchClass   = filterClass   === "all" || String(l.class_level) === filterClass;
    const matchSubject = filterSubject === "all" || l.subjects?.name === filterSubject;
    return matchSearch && matchClass && matchSubject;
  });

  const stats = {
    total:     lectures.length,
    published: lectures.filter(l => l.is_active).length,
    drafts:    lectures.filter(l => !l.is_active).length,
    views:     filtered.length,
  };

  return (
    <SidebarProvider>
      <TeacherSidebar />
      <SidebarInset className="overflow-x-hidden">
        <div className="min-h-screen" style={{ background: "#080D1A" }}>
          <div className="fixed inset-0 pointer-events-none" style={{
            backgroundImage: "radial-gradient(rgba(16,185,129,0.1) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }} />

          {/* Header */}
          <header className="sticky top-0 z-50" style={{
            background: "rgba(8,13,26,0.96)", backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(16,185,129,0.15)",
          }}>
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="text-slate-400 hover:text-white" />
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
                  <span className="text-sm">📚</span>
                </div>
                <h1 className="text-lg font-bold text-white" style={{ fontFamily: "Sora,sans-serif" }}>
                  Content <span style={{ background: "linear-gradient(90deg,#10B981,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Hub</span>
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-slate-300 text-sm hidden sm:block">{userName}</span>
                <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-slate-400 border text-sm hover:text-white transition-colors" style={{ borderColor: "rgba(16,185,129,0.3)" }}>
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Toast */}
          {toast && (
            <div className="fixed top-20 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl transition-all" style={{
              background: toast.ok ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
              border: `1px solid ${toast.ok ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
              color: toast.ok ? "#10B981" : "#F87171", backdropFilter: "blur(12px)",
            }}>
              {toast.ok ? "✅" : "❌"} {toast.msg}
            </div>
          )}

          {/* Confirm Delete Modal */}
          {confirmDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
              <div className="rounded-2xl p-6 w-80" style={{ background: "#0f1629", border: "1px solid rgba(239,68,68,0.3)" }}>
                <h3 className="text-white font-bold mb-2">Delete Lecture?</h3>
                <p className="text-slate-400 text-sm mb-5">This will permanently delete the lecture and its video link.</p>
                <div className="flex gap-3">
                  <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2 rounded-lg text-white text-sm font-semibold" style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)" }}>Delete</button>
                  <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2 rounded-lg text-slate-300 text-sm border" style={{ borderColor: "rgba(99,102,241,0.3)" }}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div className="relative z-10 px-4 py-6 w-full">
            {/* Page title row */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Teacher Portal</span>
                <h2 className="text-2xl font-bold text-white mt-1" style={{ fontFamily: "Sora,sans-serif" }}>
                  📚 My <span style={{ background: "linear-gradient(90deg,#10B981,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Lectures</span>
                </h2>
                <p className="text-slate-400 text-sm mt-0.5">Upload and manage video lectures for your students</p>
              </div>
              {!showForm && (
                <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-sm transition-all hover:scale-105" style={{ background: "linear-gradient(135deg,#10B981,#059669)", boxShadow: "0 0 20px rgba(16,185,129,0.35)" }}>
                  <Plus className="w-4 h-4" /> Upload Lecture
                </button>
              )}
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Total Lectures",   value: stats.total,     icon: <Video className="w-5 h-5"/>,       color:"59,130,246" },
                { label: "Published",        value: stats.published, icon: <CheckCircle className="w-5 h-5"/>, color:"16,185,129" },
                { label: "Drafts",           value: stats.drafts,    icon: <AlertCircle className="w-5 h-5"/>, color:"245,158,11" },
                { label: "Visible to Students", value: stats.published, icon: <Users className="w-5 h-5"/>,    color:"139,92,246" },
              ].map((s,i) => (
                <div key={i} className="rounded-2xl p-4 transition-all hover:scale-105 cursor-default" style={{ background:"rgba(15,22,41,0.75)", backdropFilter:"blur(14px)", border:"1px solid rgba(99,102,241,0.15)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background:`rgba(${s.color},0.15)`, color:`rgb(${s.color})` }}>
                    {s.icon}
                  </div>
                  <p className="text-slate-400 text-xs">{s.label}</p>
                  <p className="text-2xl font-bold text-white" style={{ fontFamily:"Sora,sans-serif" }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Upload / Edit Form */}
            {showForm && (
              <div className="mb-8 rounded-2xl p-6" style={{ background:"rgba(15,22,41,0.85)", backdropFilter:"blur(14px)", border:"1px solid rgba(16,185,129,0.25)" }}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <Upload className="w-5 h-5 text-emerald-400" />
                    {editId ? "Edit Lecture" : "Upload New Lecture"}
                  </h3>
                  <button onClick={closeForm} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
                </div>
                <form onSubmit={handleSave} className="space-y-4">
                  {/* Row 1: class + subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>Class Level *</label>
                      <select value={form.class_level} onChange={e => setForm(f => ({ ...f, class_level: e.target.value, subject_name: SUBJECT_MAP[parseInt(e.target.value)][0] }))} style={inputStyle} required>
                        {CLASS_LEVELS.map(c => <option key={c} value={c}>Class {c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Subject *</label>
                      <select value={form.subject_name} onChange={e => setForm(f => ({ ...f, subject_name: e.target.value }))} style={inputStyle} required>
                        {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Row 2: title */}
                  <div>
                    <label style={labelStyle}>Lecture Title *</label>
                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g., Introduction to Algebra" style={inputStyle} required />
                  </div>

                  {/* Row 3: description */}
                  <div>
                    <label style={labelStyle}>Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="What will students learn?" style={{ ...inputStyle, resize: "none" }} />
                  </div>

                  {/* Row 4: chapter + duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>Chapter Number</label>
                      <input type="number" min={1} value={form.chapter_number} onChange={e => setForm(f => ({ ...f, chapter_number: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Duration (minutes)</label>
                      <input type="number" min={1} value={form.duration_minutes} onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))} style={inputStyle} />
                    </div>
                  </div>

                  {/* Row 5: YouTube URL + language */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle} className="flex items-center gap-1"><Youtube className="w-3 h-3 text-red-400"/>YouTube Video URL / ID</label>
                      <input value={form.youtubeVideoId} onChange={e => setForm(f => ({ ...f, youtubeVideoId: e.target.value }))} placeholder="https://youtube.com/watch?v=... or video ID" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Language</label>
                      <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} style={inputStyle}>
                        {LANGUAGES.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Row 6: status */}
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                      className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                      style={{ background: form.is_active ? "rgba(16,185,129,0.8)" : "rgba(99,102,241,0.2)" }}>
                      <span className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all" style={{ left: form.is_active ? "calc(100% - 20px)" : 4 }} />
                    </button>
                    <span className="text-sm" style={{ color: form.is_active ? "#10B981" : "#94a3b8" }}>
                      {form.is_active ? "Publish immediately (visible to students)" : "Save as draft (hidden from students)"}
                    </span>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-xl text-white font-semibold text-sm transition-all hover:scale-105" style={{ background: "linear-gradient(135deg,#10B981,#059669)", opacity: saving ? 0.7 : 1 }}>
                      {saving ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"/> Saving…</> : <><Upload className="w-4 h-4"/> {editId ? "Save Changes" : "Upload Lecture"}</>}
                    </button>
                    <button type="button" onClick={closeForm} className="px-4 py-2 rounded-xl text-slate-300 text-sm border transition-colors hover:border-slate-400" style={{ borderColor:"rgba(99,102,241,0.3)" }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
              <div className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1 min-w-48" style={{ background:"rgba(15,22,41,0.75)", border:"1px solid rgba(99,102,241,0.15)" }}>
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0"/>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search lectures…" className="bg-transparent text-white text-sm outline-none w-full placeholder-slate-500"/>
              </div>
              <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="rounded-xl px-3 py-2 text-sm text-white" style={{ background:"rgba(15,22,41,0.75)", border:"1px solid rgba(99,102,241,0.15)" }}>
                <option value="all">All Classes</option>
                {CLASS_LEVELS.map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
              <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="rounded-xl px-3 py-2 text-sm text-white" style={{ background:"rgba(15,22,41,0.75)", border:"1px solid rgba(99,102,241,0.15)" }}>
                <option value="all">All Subjects</option>
                {allSubjectNames.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Lecture list */}
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400 mx-auto mb-3"/>
                <p className="text-slate-400 text-sm">Loading your lectures…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 rounded-2xl" style={{ background:"rgba(15,22,41,0.5)", border:"1px solid rgba(99,102,241,0.1)" }}>
                <div className="text-5xl mb-4">📭</div>
                <p className="text-white font-semibold mb-1">No lectures found</p>
                <p className="text-slate-400 text-sm mb-5">Upload your first lecture to get started.</p>
                <button onClick={openAdd} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-white font-semibold text-sm" style={{ background:"linear-gradient(135deg,#10B981,#059669)" }}>
                  <Plus className="w-4 h-4"/> Upload Lecture
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(lec => {
                  const vid = lec.lecture_videos?.[0];
                  const ytId = vid?.youtube_video_id;
                  return (
                    <div key={lec.id} className="rounded-2xl p-4 transition-all" style={{ background:"rgba(15,22,41,0.75)", backdropFilter:"blur(14px)", border:`1px solid ${lec.is_active ? "rgba(16,185,129,0.2)" : "rgba(99,102,241,0.12)"}` }}>
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <div className="w-20 h-14 rounded-xl flex-shrink-0 overflow-hidden" style={{ background:"rgba(99,102,241,0.15)" }}>
                          {ytId ? (
                            <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt="" className="w-full h-full object-cover"/>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><FileVideo className="w-6 h-6 text-violet-400"/></div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-white font-semibold text-sm truncate">{lec.title}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{
                              background: lec.is_active ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                              color: lec.is_active ? "#10B981" : "#F59E0B",
                              border: `1px solid ${lec.is_active ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`,
                            }}>
                              {lec.is_active ? <CheckCircle className="inline w-3 h-3 mr-1"/> : <AlertCircle className="inline w-3 h-3 mr-1"/>}
                              {lec.is_active ? "Published" : "Draft"}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-slate-500 text-xs">
                            <span className="text-violet-400 font-medium">Class {lec.class_level}</span>
                            <span>•</span>
                            <span>{lec.subjects?.name}</span>
                            {lec.chapter_number && <><span>•</span><span>Ch. {lec.chapter_number}</span></>}
                            {lec.duration_minutes && <><span>•</span><Clock className="w-3 h-3"/><span>{lec.duration_minutes} min</span></>}
                            {vid && <><span>•</span><span className="capitalize text-slate-400">{vid.language}</span></>}
                          </div>
                          {lec.description && <p className="text-slate-500 text-xs mt-1 line-clamp-1">{lec.description}</p>}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {ytId && (
                            <a href={`https://youtube.com/watch?v=${ytId}`} target="_blank" rel="noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-colors" title="Watch on YouTube">
                              <Play className="w-4 h-4"/>
                            </a>
                          )}
                          <button onClick={() => handleToggle(lec)} className="p-1.5 rounded-lg transition-colors" style={{ color: lec.is_active ? "#10B981" : "#94a3b8" }}
                            title={lec.is_active ? "Unpublish" : "Publish"}>
                            {lec.is_active ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}
                          </button>
                          <button onClick={() => openEdit(lec)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors" title="Edit">
                            <Edit className="w-4 h-4"/>
                          </button>
                          <button onClick={() => setConfirmDelete(lec.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
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
}