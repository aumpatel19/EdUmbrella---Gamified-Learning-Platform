import { useRef, useState, useEffect } from "react";
import { Globe, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from "lucide-react";

const LANG_META = {
  english:  { name: 'English',   flag: '🇺🇸', short: 'EN' },
  hindi:    { name: 'हिन्दी',    flag: '🇮🇳', short: 'HI' },
  telugu:   { name: 'తెలుగు',   flag: '🔵',  short: 'TE' },
  gujarati: { name: 'ગુજરાતી',  flag: '🟠',  short: 'GU' },
  kannada:  { name: 'ಕನ್ನಡ',    flag: '🟡',  short: 'KA' },
  tamil:    { name: 'தமிழ்',    flag: '🔴',  short: 'TA' },
  marathi:  { name: 'मराठी',    flag: '🟣',  short: 'MA' },
  bengali:  { name: 'বাংলা',    flag: '🟢',  short: 'BN' },
};

// Preferred order for display
const LANG_ORDER = ['english', 'hindi', 'telugu', 'gujarati', 'kannada', 'tamil', 'marathi', 'bengali'];

const VideoPlayer = ({ videoUrl, subtitleUrls = {}, title, onEnded, posterUrl }) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedLang, setSelectedLang] = useState(() => {
    const saved = localStorage.getItem('preferredSubtitleLang') || 'english';
    return saved;
  });
  const [showControls, setShowControls] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const controlsTimerRef = useRef(null);

  const availableLangs = LANG_ORDER.filter(l => subtitleUrls[l]);

  // Auto-hide controls after 3s of inactivity
  const resetControlsTimer = () => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    if (playing) {
      controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  useEffect(() => {
    return () => clearTimeout(controlsTimerRef.current);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
    resetControlsTimer();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (v) setCurrentTime(v.currentTime);
  };

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (v) { setDuration(v.duration); setLoaded(true); }
  };

  const handleProgressClick = (e) => {
    const bar = progressRef.current;
    const v = videoRef.current;
    if (!bar || !v) return;
    const rect = bar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    v.currentTime = ratio * v.duration;
  };

  const handleFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen();
    else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
  };

  const handleRestart = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play();
    setPlaying(true);
  };

  const switchLang = (lang) => {
    setSelectedLang(lang);
    localStorage.setItem('preferredSubtitleLang', lang);
    // Switch active subtitle track
    const v = videoRef.current;
    if (!v) return;
    for (let i = 0; i < v.textTracks.length; i++) {
      v.textTracks[i].mode = v.textTracks[i].label === lang ? 'showing' : 'hidden';
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="relative w-full bg-black rounded-xl overflow-hidden select-none"
      style={{ aspectRatio: '16/9', minHeight: '200px' }}
      onMouseMove={resetControlsTimer}
      onMouseEnter={() => setShowControls(true)}
    >
      {/* Language switcher pills — always visible at top */}
      {availableLangs.length > 1 && (
        <div
          className="absolute top-0 left-0 right-0 z-20 flex items-center gap-1.5 px-3 py-2 flex-wrap"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)',
          }}
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          {availableLangs.map(lang => {
            const lm = LANG_META[lang];
            const active = selectedLang === lang;
            return (
              <button
                key={lang}
                onClick={(e) => { e.stopPropagation(); switchLang(lang); }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-all"
                style={active
                  ? { background: 'rgba(6,182,212,0.9)', color: '#fff', border: '1px solid #06B6D4' }
                  : { background: 'rgba(0,0,0,0.55)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.18)' }
                }
              >
                <span>{lm?.flag}</span>
                <span>{lm?.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* HTML5 Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain cursor-pointer"
        poster={posterUrl}
        preload="metadata"
        playsInline
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => { setPlaying(false); if (onEnded) onEnded(); }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={videoUrl} type="video/mp4" />
        {/* Subtitle tracks — one per language */}
        {availableLangs.map((lang, i) => (
          <track
            key={lang}
            kind="subtitles"
            src={subtitleUrls[lang]}
            srcLang={lang}
            label={lang}
            default={lang === selectedLang}
          />
        ))}
        Your browser does not support the video tag.
      </video>

      {/* Centre play button when paused */}
      {!playing && loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.3)' }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center pointer-events-auto cursor-pointer transition-transform hover:scale-110"
            style={{ background: 'rgba(124,58,237,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={togglePlay}
          >
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
      )}

      {/* Loading state */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#0d1117' }}>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">{title}</p>
          </div>
        </div>
      )}

      {/* Bottom controls */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
          opacity: showControls || !playing ? 1 : 0,
          pointerEvents: showControls || !playing ? 'all' : 'none',
        }}
      >
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="w-full h-1.5 cursor-pointer mx-0 px-3 pt-2 pb-0"
          onClick={handleProgressClick}
        >
          <div className="w-full h-full rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' }}
            />
          </div>
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-2 px-3 py-2">
          <button onClick={togglePlay} className="text-white hover:text-violet-400 transition-colors">
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button onClick={handleRestart} className="text-white hover:text-violet-400 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={toggleMute} className="text-white hover:text-violet-400 transition-colors">
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <span className="text-xs text-slate-300 ml-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <div className="flex-1" />
          <button onClick={handleFullscreen} className="text-white hover:text-violet-400 transition-colors">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
