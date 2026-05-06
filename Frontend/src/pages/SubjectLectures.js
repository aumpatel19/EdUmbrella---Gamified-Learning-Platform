import { useParams, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import { Play, Clock, Eye, ArrowLeft, CheckCircle, X, Gamepad2, Brain, Loader2, Globe } from "lucide-react";
import VideoPlayer from "../components/VideoPlayer";
import StudentSidebar from "../components/StudentSidebar";
import { useState, useEffect } from "react";
import ApiService from "../api";
import SubjectIcon from "../components/SubjectIcon";

// ─── Topic thumbnails — Unsplash CDN (reliable, no CORS, no hotlink blocks) ───
const p = (id) => `https://images.unsplash.com/photo-${id}?w=480&h=270&fit=crop&auto=format&q=75`;

const TOPIC_IMAGES = {
  // Science 6–8
  'food: where':            p('1490818153393-6f5be8a78c1c'), // fruit & vegetable display
  'nutrition in plants':    p('1441974231432-02f0c21299ed'), // green sunlit leaf
  'respiration':            p('1559757148-7b2f5a34b16e'),    // lungs / breathing
  'crop production':        p('1500382017468-9049fed747ef'), // golden wheat field
  'cell structure':         p('1576086213369-97a306d36557'), // microscope
  'cell the unit':          p('1576086213369-97a306d36557'), // microscope
  // Science 9–10
  'motion and measurement': p('1568702846914-96b305d2aaeb'), // speedometer dashboard
  'motion - uniform':       p('1568702846914-96b305d2aaeb'), // speedometer
  'force and laws':         p('1581093804218-3aef5d50fcea'), // physics equipment
  'matter in our':          p('1493925410384-1a571dd7a2b8'), // ice & water states
  'atoms and molecules':    p('1518770660439-4636190af475'), // atom / physics visualization
  'life processes':         p('1559757148-7b2f5a34b16e'),    // biology / body
  "ohm's law":              p('1589939705384-5185137a7f0f'), // electric circuit board
  'electricity':            p('1589939705384-5185137a7f0f'), // circuit board
  'chemical reactions':     p('1532094349884-543bc11b234d'), // chemistry lab beakers
  'acids bases':            p('1583337130417-3346a1be7dee'), // colorful chemistry flasks
  // Mathematics
  'knowing our numbers':    p('1635070041078-e363dbe005cb'), // math notebook & numbers
  'fractions':              p('1506905925346-21bda4d32df4'), // sliced pizza / pie
  'integers':               p('1509228468518-180009e0f4bc'), // ruler / number line
  'triangles':              p('1509228468518-180009e0f4bc'), // geometry shapes
  'rational numbers':       p('1635070041078-e363dbe005cb'), // math
  'linear equations':       p('1453733190371-a0e61c9fad97'), // graph paper / equations
  'polynomials':            p('1453733190371-a0e61c9fad97'), // graph / curve
  'real numbers':           p('1635070041078-e363dbe005cb'), // numbers
  'quadratic equations':    p('1453733190371-a0e61c9fad97'), // parabola / graph
  'sets':                   p('1509228468518-180009e0f4bc'), // venn / circles
  'trigonometric':          p('1509228468518-180009e0f4bc'), // circle / angle
  'relations':              p('1453733190371-a0e61c9fad97'), // functions / mapping
  'integrals':              p('1453733190371-a0e61c9fad97'), // calculus / area
  // Social Science
  'understanding diversity': p('1529156069898-49953e39b3ac'), // diverse group of people
  'tracing changes':        p('1524492412937-b28074a5d7da'), // ancient India / history
  'how when and where':     p('1461360228754-6e81c478b882'), // old map / history
  'rise of nationalism':    p('1550648051-a9640e851cc0'),    // flag / revolution crowd
  // Physics 11–12
  'units and measurement':  p('1551703599-6c16f31a1a33'),    // measuring instruments
  'laws of motion newton':  p('1581093804218-3aef5d50fcea'), // physics
  'electric charges':       p('1466611653911-0628a2b47fd3'), // lightning / electricity
  'electromagnetic':        p('1519125323398-675f0ddb6308'), // coil / magnet
  // Chemistry 11–12
  'structure of atom':      p('1518770660439-4636190af475'), // atomic visualization
  'chemical bonding':       p('1532094349884-543bc11b234d'), // chemistry lab
  'solutions':              p('1583337130417-3346a1be7dee'), // colored solutions
  'electrochemistry':       p('1516146544193-b172d84fb6b0'), // battery / electrodes
  // Biology 11–12
  'biomolecules':           p('1526663843849-f9dd5a2a7e6e'), // DNA helix visualization
  'reproduction flower':    p('1490750967868-88eadb14f12a'), // flower cross-section
  'genetics':               p('1559233351-c8b1f17d2b90'),    // DNA lab research
  // English
  'an alien hand':          p('1512820708607-22a5fe5b5efb'), // open book
};

const SUBJECT_FALLBACKS = {
  'Mathematics':    p('1635070041078-e363dbe005cb'),
  'Science':        p('1532094349884-543bc11b234d'),
  'Physics':        p('1518770660439-4636190af475'),
  'Chemistry':      p('1583337130417-3346a1be7dee'),
  'Biology':        p('1576086213369-97a306d36557'),
  'English':        p('1512820708607-22a5fe5b5efb'),
  'Hindi':          p('1524492412937-b28074a5d7da'),
  'Social Science': p('1461360228754-6e81c478b882'),
};

function getTopicThumbnail(title, subject) {
  const t = (title || '').toLowerCase();
  for (const [key, url] of Object.entries(TOPIC_IMAGES)) {
    if (t.includes(key)) return url;
  }
  return SUBJECT_FALLBACKS[subject] || SUBJECT_FALLBACKS['Science'];
}





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


// Map subject+class to game route
const GAME_MAP = {
  'Mathematics': { 6: '/games/pizza-fractions', 7: '/games/integer-battle', 8: '/games/equation-unlock', 9: '/games/triangle-theorem', 10: '/games/trig-tower', 11: '/games/integer-battle', 12: '/games/calculus-climber' },
  'Science':     { 6: '/games/nutrition-match', 7: '/games/photosynthesis', 8: '/games/cell-explorer', 9: '/games/atom-builder', 10: '/games/circuit-designer' },
  'Physics':     { 10: '/games/circuit-designer', 11: '/games/vector-voyage', 12: '/games/vector-voyage' },
  'Chemistry':   { 9: '/games/atom-builder', 10: '/games/atom-builder', 11: '/games/periodic-quest', 12: '/games/periodic-quest' },
  'Biology':     { 11: '/games/genetics-lab', 12: '/games/genetics-lab' },
  'English':     {},
  'Hindi':       {},
  'Social Science': {},
};

const GAME_META = {
  '/games/pizza-fractions':    { name: 'Pizza Fractions', icon: '🍕', desc: 'Learn fractions by making pizza slices', time: '10-15 min' },
  '/games/integer-battle':     { name: 'Integer Battle', icon: '⚔️', desc: 'Battle with integers — add, subtract, multiply under pressure', time: '15-20 min' },
  '/games/equation-unlock':    { name: 'Equation Unlock', icon: '🔓', desc: 'Solve linear equations to unlock vaults', time: '15-20 min' },
  '/games/triangle-theorem':   { name: 'Triangle Theorem', icon: '📐', desc: 'Prove congruence with SAS, ASA, SSS, RHS theorems', time: '20 min' },
  '/games/trig-tower':         { name: 'Trig Tower', icon: '🗼', desc: 'Use sin, cos, tan to climb tower floors', time: '20 min' },
  '/games/calculus-climber':   { name: 'Calculus Climber', icon: '📈', desc: 'Solve derivatives to reach the summit', time: '25 min' },
  '/games/nutrition-match':    { name: 'Nutrition Match', icon: '🥗', desc: 'Match nutrients to foods for a balanced diet', time: '10-15 min' },
  '/games/photosynthesis':     { name: 'Photosynthesis Sim', icon: '🌱', desc: 'Simulate photosynthesis step by step', time: '15 min' },
  '/games/cell-explorer':      { name: 'Cell Explorer', icon: '🔬', desc: 'Identify organelles and their functions', time: '15-20 min' },
  '/games/atom-builder':       { name: 'Atom Builder', icon: '⚛️', desc: 'Build atoms by placing protons, neutrons, electrons', time: '20 min' },
  '/games/circuit-designer':   { name: 'Circuit Designer', icon: '⚡', desc: 'Design and test electrical circuits', time: '15-20 min' },
  '/games/vector-voyage':      { name: 'Vector Voyage', icon: '🧭', desc: 'Navigate with vectors and find resultants', time: '20 min' },
  '/games/periodic-quest':     { name: 'Periodic Quest', icon: '🧪', desc: 'Race to identify elements by periodic table clues', time: '15-20 min' },
  '/games/genetics-lab':       { name: 'Genetics Lab', icon: '🧬', desc: 'Predict offspring traits using Punnett squares', time: '20 min' },
};

const SubjectLectures = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";
  const userEmail = localStorage.getItem("userEmail") || "";
  const studentClass = parseInt(localStorage.getItem("studentClass") || "6");

  const [lectures, setLectures] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedIds, setCompletedIds] = useState(new Set());

  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [markingWatched, setMarkingWatched] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [lecturesRes, progressRes] = await Promise.all([
          ApiService.getLecturesBySubject(parseInt(subjectId), studentClass),
          userEmail ? ApiService.getLectureProgress(userEmail) : Promise.resolve({ completedIds: [] }),
        ]);

        const lecs = lecturesRes.lectures || [];
        if (lecs.length > 0) setSubjectInfo(lecs[0].subjects);
        setCompletedIds(new Set(progressRes.completedIds || []));


        // Build lecture objects — thumbnails resolved instantly from static map
        const built = lecs.map((l, i) => {
          const videoRows = l.lecture_videos || [];
          const videosByLanguage = {};
          for (const row of videoRows) {
            if (row.video_url) videosByLanguage[row.language] = row.video_url;
          }
          const subtitleUrls = {};
          for (const row of videoRows) {
            if (row.subtitle_urls) Object.assign(subtitleUrls, row.subtitle_urls);
          }
          const savedLang = localStorage.getItem('preferredSubtitleLang') || 'english';
          const defaultLang = videosByLanguage[savedLang] ? savedLang : Object.keys(videosByLanguage)[0];
          const subjectName = l.subjects?.name || '';
          return {
            id: l.id,
            title: l.title,
            subjectName,
            description: l.description || `Chapter ${l.chapter_number}: ${l.title}`,
            duration: `${l.duration_minutes || 30} min`,
            views: (i + 1) * 17 + 80,
            uploadDate: l.created_at || new Date().toISOString(),
            thumbnail: getTopicThumbnail(l.title, subjectName),
            lecture_videos: videoRows,
            videosByLanguage,
            videoUrl: videosByLanguage[defaultLang] || null,
            subtitleUrls,
          };
        });

        setLectures(built);

      } catch (err) {
        console.error('Failed to load lectures:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [subjectId, studentClass, userEmail]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) closeModal();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    navigate("/");
  };


  const handleVideoClick = (lecture) => {
    setSelectedLecture(lecture);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLecture(null);
  };

  const handleMarkWatched = async () => {
    if (!selectedLecture || !userEmail || markingWatched) return;
    setMarkingWatched(true);
    try {
      await ApiService.markLectureWatched(selectedLecture.id, userEmail);
      setCompletedIds(prev => new Set([...prev, selectedLecture.id]));
      setLectures(prev =>
        prev.map(l => l.id === selectedLecture.id ? { ...l } : l)
      );
    } catch (err) {
      console.error('Failed to mark watched:', err);
    } finally {
      setMarkingWatched(false);
    }
  };

  const getRelatedVideo = (current) => {
    const idx = lectures.findIndex(l => l.id === current.id);
    return lectures[(idx + 1) % lectures.length];
  };

  const meta = subjectMeta[subjectInfo?.name] || { icon: '📚', color: 'from-indigo-500 to-indigo-700' };
  const completedLectures = lectures.filter(l => completedIds.has(l.id)).length;
  const progressPercentage = lectures.length > 0 ? Math.round((completedLectures / lectures.length) * 100) : 0;

  const subjectName = subjectInfo?.name || '';
  const gameRoute = GAME_MAP[subjectName]?.[studentClass];
  const gameMeta = gameRoute ? GAME_META[gameRoute] : null;

  return (
    <SidebarProvider>
      <StudentSidebar />
      <SidebarInset>
        <div className="min-h-screen dot-grid" style={{ background: "#080D1A" }}>
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
                <div className="rounded-xl overflow-hidden shrink-0">
                  <SubjectIcon name={subjectInfo?.name} size={36} />
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
                  style={{ border: "1px solid rgba(99,102,241,0.25)", background: "rgba(15,22,41,0.6)" }}
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
              </div>
            ) : (
              <>
                {/* Subject Info + Progress */}
                <div className="mb-8 animate-slide-up">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="rounded-2xl overflow-hidden shrink-0">
                      <SubjectIcon name={subjectInfo?.name} size={64} />
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
                {isModalOpen && selectedLecture && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4"
                    style={{ background: "rgba(0,0,0,0.92)" }}
                  >
                    <div
                      className="w-full max-w-7xl rounded-xl overflow-hidden flex flex-col"
                      style={{
                        background: "#0F1629",
                        border: "1px solid rgba(124,58,237,0.25)",
                        maxHeight: "95vh",
                      }}
                    >
                      {/* Modal Header */}
                      <div
                        className="flex items-center justify-between px-5 py-3 shrink-0"
                        style={{ borderBottom: "1px solid rgba(99,102,241,0.18)" }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="rounded-lg overflow-hidden shrink-0">
                            <SubjectIcon name={subjectInfo?.name} size={28} />
                          </div>
                          <h2
                            className="text-base md:text-lg font-semibold text-white truncate"
                            style={{ fontFamily: "'Sora', sans-serif" }}
                          >
                            {selectedLecture.title}
                          </h2>
                          {completedIds.has(selectedLecture.id) && (
                            <span className="badge-xp text-xs shrink-0">✓ Completed</span>
                          )}
                        </div>
                        <button
                          onClick={closeModal}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0 ml-2"
                          style={{ background: "rgba(26,33,64,0.8)" }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* 50-50 Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                        {/* Left: Video */}
                        <div
                          className="flex flex-col"
                          style={{ borderRight: "1px solid rgba(99,102,241,0.12)" }}
                        >
                          {/* HTML5 Video Player with built-in language switcher */}
                          <div className="flex-1" style={{ minHeight: "240px" }}>
                            {selectedLecture.videoUrl ? (
                              <VideoPlayer
                                key={selectedLecture.id}
                                videoUrl={selectedLecture.videoUrl}
                                videosByLanguage={selectedLecture.videosByLanguage || {}}
                                subtitleUrls={selectedLecture.subtitleUrls || {}}
                                title={selectedLecture.title}
                                posterUrl={selectedLecture.thumbnail}
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center"
                                style={{ background: "#0d1117", minHeight: "240px" }}
                              >
                                <div className="text-center px-6">
                                  <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                                    style={{ background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.3)" }}
                                  >
                                    <Play className="w-8 h-8 text-violet-400" />
                                  </div>
                                  <p className="text-sm text-slate-400">Video coming soon</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Video info + actions */}
                          <div
                            className="p-4 shrink-0"
                            style={{ background: "#0F1629", borderTop: "1px solid rgba(99,102,241,0.12)" }}
                          >
                            <h4 className="font-semibold text-white text-sm mb-1">{selectedLecture.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-2 mb-3">{selectedLecture.description}</p>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                              <span>{selectedLecture.duration}</span>
                              <span>·</span>
                              <span>{selectedLecture.views} views</span>
                            </div>
                            <div className="flex gap-2">
                              {completedIds.has(selectedLecture.id) ? (
                                <div
                                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-semibold"
                                  style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", color: "#10B981" }}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Watched
                                </div>
                              ) : (
                                <button
                                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-60"
                                  style={{ background: "linear-gradient(135deg,#10B981,#06B6D4)" }}
                                  onClick={handleMarkWatched}
                                  disabled={markingWatched || !selectedLecture?.videoUrl}
                                >
                                  {markingWatched ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4" />
                                  )}
                                  Mark as Watched (+10 XP)
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Game + Quiz + Next Video */}
                        <div
                          className="flex flex-col p-4 gap-4 overflow-y-auto"
                          style={{ background: "#1A2140" }}
                        >
                          {/* Game card — shown for any subject that has a game */}
                          {gameMeta && (
                            <div
                              className="rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                              style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.28)" }}
                              onClick={() => navigate(gameRoute)}
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div
                                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                                  style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)" }}
                                >
                                  {gameMeta.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-white mb-0.5">{gameMeta.name}</h4>
                                  <p className="text-xs text-slate-400 line-clamp-2">{gameMeta.desc}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{gameMeta.time}</span>
                                <span className="flex items-center gap-1"><Gamepad2 className="w-3 h-3" />+30 XP</span>
                              </div>
                              <button
                                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-white"
                                style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)" }}
                              >
                                <Gamepad2 className="w-4 h-4" />Play Game
                              </button>
                            </div>
                          )}

                          {/* Quiz card — always shown */}
                          <div
                            className="rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                            style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.25)" }}
                            onClick={() => navigate('/quizzes')}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: "linear-gradient(135deg,#10B981,#06B6D4)" }}
                              >
                                <Brain className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-white mb-0.5">{subjectName} Quiz</h4>
                                <p className="text-xs text-slate-400">Test your understanding with CBSE questions</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                              <span>10 questions</span><span>·</span><span>5-10 min</span>
                              <span className="flex items-center gap-1 ml-auto text-emerald-400">+50 XP</span>
                            </div>
                            <button
                              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-white"
                              style={{ background: "linear-gradient(135deg,#10B981,#06B6D4)" }}
                            >
                              <Brain className="w-4 h-4" />Take Quiz
                            </button>
                          </div>

                          {/* Next video */}
                          {lectures.length > 1 && selectedLecture && (() => {
                            const relatedVideo = getRelatedVideo(selectedLecture);
                            return (
                              <div
                                className="rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                                style={{ background: "rgba(15,22,41,0.75)", border: "1px solid rgba(99,102,241,0.15)" }}
                                onClick={() => setSelectedLecture(relatedVideo)}
                              >
                                <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide font-medium">Up Next</p>
                                <h5 className="font-semibold text-sm text-white mb-1">{relatedVideo.title}</h5>
                                <p className="text-xs text-slate-400 mb-3 line-clamp-2">{relatedVideo.description}</p>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{relatedVideo.duration}</span>
                                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{relatedVideo.views} views</span>
                                </div>
                                <button
                                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-semibold text-white"
                                  style={{ background: "linear-gradient(135deg,#06B6D4,#7C3AED)" }}
                                >
                                  <Play className="w-3 h-3" />Watch Next
                                </button>
                              </div>
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
                      {lectures.map((lecture) => {
                        const isCompleted = completedIds.has(lecture.id);
                        const langCount = lecture.lecture_videos?.length || 0;
                        return (
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
                            <div className="relative w-full aspect-video overflow-hidden">
                              <img
                                src={lecture.thumbnail}
                                alt={lecture.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = SUBJECT_FALLBACKS[lecture.subjectName] || SUBJECT_FALLBACKS['Science'];
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div
                                  className="w-14 h-14 rounded-full flex items-center justify-center"
                                  style={{ background: "rgba(124,58,237,0.75)", backdropFilter: "blur(8px)" }}
                                >
                                  <Play className="w-7 h-7 text-white ml-0.5" />
                                </div>
                              </div>
                              <div
                                className="absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded font-medium text-white"
                                style={{ background: "rgba(0,0,0,0.78)" }}
                              >
                                {lecture.duration}
                              </div>
                              {langCount > 1 && (
                                <div className="absolute top-2 left-2">
                                  <span
                                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                                    style={{ background: "rgba(6,182,212,0.85)", color: "#fff" }}
                                  >
                                    <Globe className="w-3 h-3" />
                                    {langCount} Languages
                                  </span>
                                </div>
                              )}
                              {isCompleted && (
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
                        );
                      })}
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
