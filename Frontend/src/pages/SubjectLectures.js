import { useParams, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import { Play, Clock, Eye, Download, ArrowLeft, CheckCircle, X, Maximize2, Globe, Gamepad2, Brain, Loader2 } from "lucide-react";
import StudentSidebar from "../components/StudentSidebar";
import { useState, useEffect } from "react";
import ApiService from "../api";

// Import thumbnail images
import sci1 from "../assets/sci1.png";
import sci2 from "../assets/sci2.png";
import sci3 from "../assets/sci3.png";
import sci4 from "../assets/sci4.png";
import sci5 from "../assets/sci5.png";
import sci6 from "../assets/sci6.png";
import circuitGameImage from "../assets/circuit-game-image.png";

const thumbnails = [sci1, sci2, sci3, sci4, sci5, sci6];

const subjectMeta = {
  'Mathematics':    { icon: '🧮', color: 'from-blue-500 to-blue-700' },
  'Science':        { icon: '🔬', color: 'from-green-500 to-green-700' },
  'Physics':        { icon: '⚡', color: 'from-purple-500 to-purple-700' },
  'Chemistry':      { icon: '🧪', color: 'from-yellow-500 to-yellow-700' },
  'Biology':        { icon: '🌿', color: 'from-emerald-500 to-emerald-700' },
  'English':        { icon: '📖', color: 'from-red-500 to-red-700' },
  'Hindi':          { icon: '🇮🇳', color: 'from-pink-500 to-pink-700' },
  'Social Science': { icon: '🌍', color: 'from-amber-500 to-amber-700' },
  'History':        { icon: '🏛️', color: 'from-orange-500 to-orange-700' },
  'Geography':      { icon: '🗺️', color: 'from-teal-500 to-teal-700' },
};

const SubjectLectures = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";
  const studentClass = localStorage.getItem("studentClass") || "6";

  const [lectures, setLectures] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isGridView, setIsGridView] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('video');
  const [videoRef, setVideoRef] = useState(null);
  const [showAudioMenu, setShowAudioMenu] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { lectures: lecs } = await ApiService.getLecturesBySubject(
          parseInt(subjectId),
          parseInt(studentClass)
        );
        if (lecs && lecs.length > 0) {
          setSubjectInfo(lecs[0].subjects);
        }
        setLectures(
          lecs.map((l, i) => ({
            id: l.id,
            title: l.title,
            description: l.description || `Chapter ${l.chapter_number}: ${l.title}`,
            duration: `${l.duration_minutes || 30} min`,
            views: (l.chapter_number || i + 1) * 17 + 80,
            uploadDate: l.created_at || new Date().toISOString(),
            isCompleted: false,
            videoUrl: `/videos/placeholder_${i + 1}.mp4`,
            thumbnail: thumbnails[i % 6],
            hasMultiLanguageAudio: i === 0,
            audioTracks: i === 0 ? {
              english: "/videos/science/audio/lecture1/english/english.mp3",
              hindi: "/videos/science/audio/lecture1/hindi/hindi.mp3",
              telugu: "/videos/science/audio/lecture1/telugu/telgu.mp3",
              gujarati: "/videos/science/audio/lecture1/gujarati/gujrati.mp3",
              kannada: "/videos/science/audio/lecture1/kannada/kannada.mp3"
            } : null,
          }))
        );
      } catch (err) {
        console.error('Failed to load lectures:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [subjectId, studentClass]);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    navigate("/");
  };

  // Close grid view on escape key and handle outside clicks
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (showAudioMenu) {
          setShowAudioMenu(false);
        } else if (isGridView) {
          closeGridView();
        }
      }
    };

    const handleClickOutside = (event) => {
      if (showAudioMenu && !event.target.closest('.audio-menu')) {
        setShowAudioMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isGridView, showAudioMenu]);

  // Audio track options (YouTube-like)
  const audioTracks = [
    { code: 'video', name: 'Original', flag: '🎬', description: 'Original video audio' },
    { code: 'english', name: 'English', flag: '🇺🇸', description: 'English audio track' },
    { code: 'hindi', name: 'Hindi', flag: '🇮🇳', description: 'Hindi audio track' },
    { code: 'telugu', name: 'Telugu', flag: '🇮🇳', description: 'Telugu audio track' },
    { code: 'gujarati', name: 'Gujarati', flag: '🇮🇳', description: 'Gujarati audio track' },
    { code: 'kannada', name: 'Kannada', flag: '🇮🇳', description: 'Kannada audio track' }
  ];

  const handleVideoClick = (lecture) => {
    setSelectedLecture(lecture);
    setIsGridView(true);
  };

  const closeGridView = () => {
    if (videoRef?.syncedAudio) {
      videoRef.syncedAudio.pause();
      videoRef.syncedAudio.remove();
      videoRef.syncedAudio = null;
    }
    if (videoRef?.audioSyncListeners) {
      videoRef.audioSyncListeners.forEach(({ event, handler }) => {
        videoRef.removeEventListener(event, handler);
      });
      videoRef.audioSyncListeners = [];
    }
    setIsGridView(false);
    setSelectedLecture(null);
    setShowAudioMenu(false);
    setSelectedLanguage('video');
  };

  const switchAudioTrack = (trackType) => {
    if (!videoRef || !selectedLecture?.hasMultiLanguageAudio) return;
    const currentTime = videoRef.currentTime;
    const wasPlaying = !videoRef.paused;

    if (videoRef.syncedAudio) {
      videoRef.syncedAudio.pause();
      videoRef.syncedAudio.remove();
      videoRef.syncedAudio = null;
    }
    if (videoRef.audioSyncListeners) {
      videoRef.audioSyncListeners.forEach(({ event, handler }) => {
        videoRef.removeEventListener(event, handler);
      });
      videoRef.audioSyncListeners = [];
    }

    if (trackType === 'video') {
      videoRef.muted = false;
      setSelectedLanguage(trackType);
      setShowAudioMenu(false);
      return;
    }

    videoRef.muted = true;
    const audio = document.createElement('audio');
    audio.src = selectedLecture.audioTracks[trackType];
    audio.preload = 'auto';
    audio.currentTime = currentTime;
    videoRef.syncedAudio = audio;

    const syncAudio = () => {
      if (Math.abs(videoRef.currentTime - audio.currentTime) > 0.2) {
        audio.currentTime = videoRef.currentTime;
      }
    };
    const playAudio = () => audio.play().catch(console.error);
    const pauseAudio = () => audio.pause();
    const seekAudio = () => { audio.currentTime = videoRef.currentTime; };

    const listeners = [
      { event: 'play', handler: playAudio },
      { event: 'pause', handler: pauseAudio },
      { event: 'seeked', handler: seekAudio },
      { event: 'timeupdate', handler: syncAudio }
    ];
    listeners.forEach(({ event, handler }) => {
      videoRef.addEventListener(event, handler);
    });
    videoRef.audioSyncListeners = listeners;

    if (wasPlaying) {
      audio.addEventListener('canplay', () => {
        videoRef.play();
        audio.play();
      }, { once: true });
    }

    setSelectedLanguage(trackType);
    setShowAudioMenu(false);
  };

  const getRelatedVideo = (currentLecture) => {
    const currentIndex = lectures.findIndex(l => l.id === currentLecture.id);
    const nextIndex = (currentIndex + 1) % lectures.length;
    return lectures[nextIndex];
  };

  const meta = subjectMeta[subjectInfo?.name] || { icon: '📚', color: 'from-indigo-500 to-indigo-700' };
  const completedLectures = lectures.filter(l => l.isCompleted).length;
  const progressPercentage = lectures.length > 0 ? Math.round((completedLectures / lectures.length) * 100) : 0;
  const isMath = subjectInfo?.name === 'Mathematics';

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
                <button
                  onClick={() => navigate('/lectures')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  style={{
                    background: "rgba(15,22,41,0.75)",
                    backdropFilter: "blur(14px)",
                    border: "1px solid rgba(99,102,241,0.18)",
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
                  style={{
                    background: "rgba(124,58,237,0.18)",
                    border: "1px solid rgba(124,58,237,0.3)",
                  }}
                >
                  {meta.icon}
                </div>
                <h1
                  className="text-xl font-bold gradient-text-violet"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {subjectInfo?.name || 'Loading...'} Lectures
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: "linear-gradient(135deg,#7C3AED,#06B6D4)", color: "#fff" }}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-300 hidden sm:block">{userName}</span>
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
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
              </div>
            ) : (
              <>
                {/* Subject Info + Progress */}
                <div className="mb-8 animate-slide-up">
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0"
                      style={{
                        background: "rgba(15,22,41,0.85)",
                        border: "1px solid rgba(99,102,241,0.25)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {meta.icon}
                    </div>
                    <div className="flex-1">
                      <h2
                        className="text-3xl font-bold mb-1"
                        style={{ color: "#fff", fontFamily: "'Sora', sans-serif" }}
                      >
                        {subjectInfo?.name || 'Subject'}
                      </h2>
                      <p className="text-slate-400 mb-3">
                        {subjectInfo?.description || `CBSE Class ${studentClass} ${subjectInfo?.name || ''}`}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: "linear-gradient(135deg,#7C3AED,#06B6D4)", color: "#fff" }}
                          >
                            T
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-200">CBSE Expert Teacher</p>
                            <p className="text-xs text-slate-500">Instructor</p>
                          </div>
                        </div>
                        <span className="badge-xp">{completedLectures}/{lectures.length} Completed</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div
                    className="p-4 rounded-xl"
                    style={{
                      background: "rgba(15,22,41,0.75)",
                      backdropFilter: "blur(14px)",
                      border: "1px solid rgba(99,102,241,0.18)",
                    }}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Course Progress</span>
                      <span className="font-semibold" style={{ color: "#7C3AED" }}>
                        {progressPercentage}% Complete
                      </span>
                    </div>
                    <div className="xp-bar">
                      <div
                        className={`xp-bar-fill bg-gradient-to-r ${meta.color}`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Video Modal */}
                {isGridView && selectedLecture && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.9)" }}
                  >
                    <div
                      className="w-full max-w-7xl h-full max-h-[90vh] rounded-xl overflow-hidden flex flex-col"
                      style={{
                        background: "#0F1629",
                        border: "1px solid rgba(124,58,237,0.25)",
                      }}
                    >
                      {/* Modal Header */}
                      <div
                        className="flex items-center justify-between px-5 py-3 shrink-0"
                        style={{ borderBottom: "1px solid rgba(99,102,241,0.18)" }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{meta.icon}</span>
                          <h2
                            className="text-lg font-semibold text-white"
                            style={{ fontFamily: "'Sora', sans-serif" }}
                          >
                            {selectedLecture.title}
                          </h2>
                          <span className="badge-xp text-xs">
                            {selectedLecture.isCompleted ? "✓ Completed" : "New"}
                          </span>
                        </div>
                        <button
                          onClick={closeGridView}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                          style={{ background: "rgba(26,33,64,0.8)" }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* 50-50 Grid */}
                      <div className="grid grid-cols-2 gap-0 flex-1 overflow-hidden">
                        {/* Left: Video */}
                        <div
                          className="flex flex-col"
                          style={{ borderRight: "1px solid rgba(99,102,241,0.12)" }}
                        >
                          <div className="relative flex-1" style={{ background: "#000" }}>
                            {selectedLecture.videoUrl.includes('.mp4') ? (
                              <div className="relative w-full h-full">
                                {selectedLecture.hasMultiLanguageAudio && (
                                  <div className="absolute top-3 right-3 z-20 audio-menu">
                                    <div className="relative">
                                      <button
                                        onClick={() => setShowAudioMenu(!showAudioMenu)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors"
                                        style={{ background: "rgba(0,0,0,0.75)", border: "1px solid rgba(6,182,212,0.3)" }}
                                      >
                                        <Globe className="w-4 h-4 text-cyan-400" />
                                        <span>
                                          {audioTracks.find(t => t.code === selectedLanguage)?.flag}{' '}
                                          {audioTracks.find(t => t.code === selectedLanguage)?.name}
                                        </span>
                                        <span className="text-slate-400">{showAudioMenu ? '▲' : '▼'}</span>
                                      </button>
                                      {showAudioMenu && (
                                        <div
                                          className="absolute top-full right-0 mt-2 rounded-xl shadow-2xl overflow-hidden min-w-[240px] max-h-80 overflow-y-auto"
                                          style={{
                                            background: "rgba(8,13,26,0.97)",
                                            border: "1px solid rgba(99,102,241,0.25)",
                                            backdropFilter: "blur(16px)",
                                          }}
                                        >
                                          <div
                                            className="px-4 py-3"
                                            style={{ borderBottom: "1px solid rgba(99,102,241,0.18)" }}
                                          >
                                            <span className="text-sm font-semibold text-white">🎵 Audio Track</span>
                                          </div>
                                          {audioTracks.map((track) => (
                                            <button
                                              key={track.code}
                                              onClick={() => switchAudioTrack(track.code)}
                                              className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors hover:bg-white/5"
                                              style={
                                                selectedLanguage === track.code
                                                  ? { background: "rgba(6,182,212,0.18)" }
                                                  : {}
                                              }
                                            >
                                              <span className="text-xl">{track.flag}</span>
                                              <div className="flex-1">
                                                <div className="text-sm font-medium text-white">{track.name}</div>
                                                <div className="text-xs text-slate-500">{track.description}</div>
                                              </div>
                                              {selectedLanguage === track.code && (
                                                <span className="text-cyan-400 font-bold">✓</span>
                                              )}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                <video
                                  ref={(ref) => {
                                    setVideoRef(ref);
                                    if (ref) {
                                      ref.addEventListener('beforeunload', () => {
                                        if (ref.cleanupAudio) ref.cleanupAudio();
                                      });
                                    }
                                  }}
                                  className="w-full h-full object-contain"
                                  controls
                                  poster={selectedLecture.thumbnail}
                                  onClick={() => setShowAudioMenu(false)}
                                >
                                  <source src={selectedLecture.videoUrl} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="text-center">
                                  <div
                                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                                    style={{ background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.3)" }}
                                  >
                                    <Play className="w-10 h-10 text-violet-400" />
                                  </div>
                                  <h3 className="text-lg font-semibold text-white mb-2">{selectedLecture.title}</h3>
                                  <p className="text-sm text-slate-400 mb-4">{selectedLecture.description}</p>
                                  <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{selectedLecture.duration}</span>
                                    <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{selectedLecture.views} views</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            {!selectedLecture.videoUrl.includes('.mp4') && (
                              <button
                                className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                                style={{ background: "rgba(124,58,237,0.7)", border: "1px solid rgba(124,58,237,0.4)" }}
                                onClick={() => window.open(selectedLecture.videoUrl, '_blank')}
                              >
                                <Maximize2 className="w-3 h-3" />
                                Open
                              </button>
                            )}
                          </div>

                          {/* Video info panel */}
                          <div
                            className="p-4 shrink-0"
                            style={{ background: "#0F1629", borderTop: "1px solid rgba(99,102,241,0.12)" }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 mr-3">
                                <h4 className="font-semibold text-white text-sm mb-1">{selectedLecture.title}</h4>
                                <p className="text-xs text-slate-400 line-clamp-2">{selectedLecture.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                              <span>{selectedLecture.duration}</span>
                              <span>·</span>
                              <span>{selectedLecture.views} views</span>
                              <span>·</span>
                              <span>{new Date(selectedLecture.uploadDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-semibold text-white transition-all"
                                style={{ background: "linear-gradient(135deg,#06B6D4,#7C3AED)" }}
                                onClick={() => {
                                  if (selectedLecture.videoUrl.includes('.mp4') && videoRef) {
                                    videoRef.play();
                                  } else {
                                    window.open(selectedLecture.videoUrl, '_blank');
                                  }
                                }}
                              >
                                <Play className="w-4 h-4" />
                                Watch Now
                              </button>
                              <button
                                className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white transition-colors"
                                style={{ border: "1px solid rgba(99,102,241,0.25)", background: "rgba(26,33,64,0.6)" }}
                                onClick={() => {
                                  if (selectedLecture.videoUrl.includes('.mp4')) {
                                    const link = document.createElement('a');
                                    link.href = selectedLecture.videoUrl;
                                    link.download = `${selectedLecture.title}.mp4`;
                                    link.click();
                                  }
                                }}
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Right: Game / Related */}
                        <div
                          className="flex flex-col p-4 gap-4 overflow-y-auto"
                          style={{ background: "#1A2140" }}
                        >
                          {isMath ? (
                            <>
                              <div
                                className="flex-1 rounded-xl p-4 transition-all duration-300 cursor-pointer hover:scale-[1.01]"
                                style={{
                                  background: "rgba(124,58,237,0.12)",
                                  border: "1px solid rgba(124,58,237,0.25)",
                                }}
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <img src={circuitGameImage} alt="Circuit Builder Game" className="w-12 h-12 rounded-xl object-cover" />
                                  <div className="flex-1">
                                    <h4 className="text-base font-semibold text-white mb-0.5">Circuit Builder Game</h4>
                                    <p className="text-xs text-slate-400">Build and test electrical circuits interactively</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />15-20 min</span>
                                  <span className="flex items-center gap-1"><Brain className="w-3 h-3" />Interactive</span>
                                </div>
                                <button
                                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                                  style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)" }}
                                  onClick={() => navigate('/games')}
                                >
                                  <Gamepad2 className="w-4 h-4" />
                                  Play Game
                                </button>
                              </div>

                              <div
                                className="flex-1 rounded-xl p-4 transition-all duration-300 cursor-pointer hover:scale-[1.01]"
                                style={{
                                  background: "rgba(16,185,129,0.10)",
                                  border: "1px solid rgba(16,185,129,0.25)",
                                }}
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ background: "linear-gradient(135deg,#10B981,#06B6D4)" }}
                                  >
                                    <Brain className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-base font-semibold text-white mb-0.5">Mathematics Quiz</h4>
                                    <p className="text-xs text-slate-400">Test your understanding with CBSE questions</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                                  <span>10 questions</span><span>·</span><span>5-10 min</span>
                                </div>
                                <button
                                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                                  style={{ background: "linear-gradient(135deg,#10B981,#06B6D4)" }}
                                  onClick={() => navigate('/quizzes')}
                                >
                                  <Brain className="w-4 h-4" />
                                  Take Quiz
                                </button>
                              </div>
                            </>
                          ) : lectures.length > 1 && selectedLecture && (() => {
                            const relatedVideo = getRelatedVideo(selectedLecture);
                            return (
                              <>
                                <div
                                  className="flex-1 rounded-xl p-4 flex flex-col items-center justify-center relative"
                                  style={{
                                    background: "rgba(124,58,237,0.08)",
                                    border: "1px solid rgba(99,102,241,0.18)",
                                  }}
                                >
                                  <div className="text-center">
                                    <div
                                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                      style={{ background: "rgba(124,58,237,0.18)" }}
                                    >
                                      <Play className="w-8 h-8 text-violet-400" />
                                    </div>
                                    <h4 className="text-base font-semibold text-white mb-2">{relatedVideo.title}</h4>
                                    <p className="text-xs text-slate-400 mb-3">{relatedVideo.description}</p>
                                    <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
                                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{relatedVideo.duration}</span>
                                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{relatedVideo.views} views</span>
                                    </div>
                                  </div>
                                  <button
                                    className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-white"
                                    style={{ background: "rgba(124,58,237,0.5)", border: "1px solid rgba(124,58,237,0.3)" }}
                                    onClick={() => setSelectedLecture(relatedVideo)}
                                  >
                                    <Play className="w-3 h-3" />Switch
                                  </button>
                                </div>

                                <div
                                  className="rounded-xl p-4 shrink-0"
                                  style={{
                                    background: "rgba(15,22,41,0.75)",
                                    border: "1px solid rgba(99,102,241,0.15)",
                                  }}
                                >
                                  <h5 className="font-semibold text-sm text-white mb-1">Next: {relatedVideo.title}</h5>
                                  <p className="text-xs text-slate-400 mb-2 line-clamp-2">{relatedVideo.description}</p>
                                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                                    <span>{relatedVideo.duration}</span><span>·</span><span>{relatedVideo.views} views</span>
                                  </div>
                                  <button
                                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-semibold text-white"
                                    style={{ background: "linear-gradient(135deg,#06B6D4,#7C3AED)" }}
                                    onClick={() => setSelectedLecture(relatedVideo)}
                                  >
                                    <Play className="w-3 h-3" />Watch Next
                                  </button>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lecture Grid */}
                <div>
                  <h3
                    className="text-xl font-bold mb-5"
                    style={{ color: "#fff", fontFamily: "'Sora', sans-serif" }}
                  >
                    📹 Video Lectures
                  </h3>
                  {lectures.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                      No lectures available for this subject yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {lectures.map((lecture) => (
                        <div
                          key={lecture.id}
                          className="group cursor-pointer overflow-hidden rounded-2xl transition-all duration-300"
                          style={{
                            background: "rgba(15,22,41,0.75)",
                            backdropFilter: "blur(14px)",
                            border: "1px solid rgba(99,102,241,0.18)",
                          }}
                          onClick={() => handleVideoClick(lecture)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.02)";
                            e.currentTarget.style.boxShadow = "0 0 20px rgba(124,58,237,0.3)";
                            e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "";
                            e.currentTarget.style.borderColor = "rgba(99,102,241,0.18)";
                          }}
                        >
                          {/* Thumbnail */}
                          <div className="relative w-full aspect-video overflow-hidden">
                            <img
                              src={lecture.thumbnail}
                              alt={lecture.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                            {/* Play overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div
                                className="w-14 h-14 rounded-full flex items-center justify-center"
                                style={{ background: "rgba(124,58,237,0.75)", backdropFilter: "blur(8px)" }}
                              >
                                <Play className="w-7 h-7 text-white ml-0.5" />
                              </div>
                            </div>
                            {/* Duration chip */}
                            <div
                              className="absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded font-medium text-white"
                              style={{ background: "rgba(0,0,0,0.78)" }}
                            >
                              {lecture.duration}
                            </div>
                            {/* Multi-lang badge */}
                            {lecture.hasMultiLanguageAudio && (
                              <div className="absolute top-2 left-2">
                                <span
                                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                                  style={{ background: "rgba(6,182,212,0.85)", color: "#fff" }}
                                >
                                  <Globe className="w-3 h-3" />
                                  Multi-Lang
                                </span>
                              </div>
                            )}
                            {/* Completed badge */}
                            {lecture.isCompleted && (
                              <div className="absolute top-2 right-2">
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center"
                                  style={{ background: "#10B981" }}
                                >
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Card body */}
                          <div className="p-4">
                            <h4
                              className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-violet-400 transition-colors"
                              style={{ color: "#e2e8f0", fontFamily: "'Sora', sans-serif" }}
                            >
                              {lecture.title}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 mb-2">{lecture.description}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <span>{lecture.views} views</span>
                              <span>·</span>
                              <span>{new Date(lecture.uploadDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SubjectLectures;
