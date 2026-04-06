import { useNavigate } from "react-router-dom";
import { Zap, Trophy, Flame, ChevronRight, Star } from "lucide-react";

/* Floating notification pill */
const FloatingPill = ({ children, className, style }) => (
  <div
    className={`absolute flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white animate-float ${className}`}
    style={{
      background: "rgba(15,22,41,0.85)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.12)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      ...style,
    }}
  >
    {children}
  </div>
);

/* Floating particle dot */
const Dot = ({ style }) => (
  <div className="absolute w-1 h-1 rounded-full bg-violet-400/50 animate-particle" style={style} />
);

const Hero = () => {
  const navigate = useNavigate();

  const dots = Array.from({ length: 22 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    '--dur': `${7 + Math.random() * 7}s`,
    '--delay': `${Math.random() * 6}s`,
    '--drift': `${(Math.random() - 0.5) * 70}px`,
    opacity: Math.random() * 0.5 + 0.2,
  }));

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
      style={{ background: 'linear-gradient(160deg,#09101F 0%,#0F1232 45%,#13084E 100%)' }}
    >
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-70 pointer-events-none" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/6 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(124,58,237,0.18),transparent 70%)' }} />
      <div className="absolute bottom-1/4 right-1/6 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(6,182,212,0.14),transparent 70%)' }} />

      {/* Particles */}
      {dots.map((d, i) => <Dot key={i} style={d} />)}

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left copy ── */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-violet-300 text-sm font-semibold tracking-wide">
                CBSE Classes 6–12 · Gamified Learning
              </span>
            </div>

            <div>
              <h1 className="text-5xl md:text-[4.5rem] font-bold leading-[1.08] text-white" style={{ fontFamily: "Sora, sans-serif" }}>
                MASTER YOUR
                <br />
                <span className="gradient-text-violet">SUBJECTS</span>
              </h1>
              <p className="mt-4 text-lg text-slate-400 max-w-md leading-relaxed">
                Earn XP. Climb leaderboards. Dominate your exams.
                The only CBSE platform that makes studying feel like a game.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { icon: <Zap className="w-3.5 h-3.5" />,    label: 'XP System',          color: 'border-violet-500/30 bg-violet-500/10 text-violet-300' },
                { icon: <Trophy className="w-3.5 h-3.5" />, label: 'Live Leaderboards',  color: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300' },
                { icon: <Flame className="w-3.5 h-3.5" />,  label: 'Daily Streaks',      color: 'border-orange-500/30 bg-orange-500/10 text-orange-300' },
                { icon: <Star className="w-3.5 h-3.5" />,   label: 'Achievements',       color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300' },
              ].map(({ icon, label, color }) => (
                <span key={label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${color}`}>
                  {icon}{label}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate('/auth')} className="btn-violet group flex items-center gap-2 px-8 py-3.5 text-base">
                <Zap className="w-4 h-4" />
                Start Playing Free
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/auth')} className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-violet-500/30 text-violet-300 hover:bg-violet-500/10 transition-all font-semibold text-base">
                For Teachers →
              </button>
            </div>
          </div>

          {/* ── Right — Player Card (screenshot-style) ── */}
          <div className="relative h-[560px] hidden lg:flex items-center justify-center pr-8">

            {/* Orbiting rings */}
            <div className="absolute w-[400px] h-[400px] rounded-full border border-violet-500/10 animate-spin-slow" />
            <div className="absolute w-[350px] h-[350px] rounded-full border border-cyan-500/08 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '14s' }} />

            {/* Floating notification pills — positioned clearly outside the card */}
            <FloatingPill className="top-4 right-0" style={{ animationDelay: '0s' }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#06B6D4,#7C3AED)" }}>⚡</span>
              <span className="text-slate-200 whitespace-nowrap">+150 XP Earned</span>
            </FloatingPill>

            <FloatingPill className="top-1/2 -translate-y-1/2 -right-4" style={{ animationDelay: '1.2s' }}>
              <span>🏆</span>
              <span className="text-slate-200 whitespace-nowrap">Achievement Unlocked</span>
              <span className="text-yellow-400 text-xs">↗</span>
            </FloatingPill>

            <FloatingPill className="-bottom-2 left-1/2 -translate-x-1/2" style={{ animationDelay: '0.8s' }}>
              <span>🔥</span>
              <span className="text-orange-300 font-bold whitespace-nowrap">7 Day Streak</span>
              <span>🔥</span>
            </FloatingPill>

            {/* Rank badge — left side */}
            <div className="absolute left-0 top-16 flex items-center gap-2 px-3 py-2 rounded-xl animate-float"
              style={{
                animationDelay: '0.4s',
                background: "rgba(124,58,237,0.25)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(124,58,237,0.4)",
                boxShadow: "0 0 20px rgba(124,58,237,0.3)"
              }}>
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-xs font-bold">Rank #3</span>
            </div>

            {/* Main player card */}
            <div className="w-80 animate-float-2" style={{ animationDelay: '0.2s' }}>
              <div className="relative rounded-2xl overflow-hidden p-6"
                style={{
                  background: "rgba(12,18,38,0.9)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(124,58,237,0.25)",
                  boxShadow: "0 0 60px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.05)"
                }}>

                {/* Top gradient bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: "linear-gradient(90deg,#7C3AED,#4F46E5,#06B6D4)", backgroundSize: "200%", animation: "xp-shift 2.5s linear infinite" }} />

                {/* Avatar + name row */}
                <div className="flex items-center gap-4 mb-5">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg,#1a1040,#2d1b69)",
                        border: "2px solid rgba(124,58,237,0.5)",
                        boxShadow: "0 0 20px rgba(124,58,237,0.4)"
                      }}>
                      {/* Gaming avatar illustration */}
                      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#1e1050 0%,#2d1b69 50%,#1a1040 100%)" }} />
                        {/* Silhouette-style avatar */}
                        <div className="relative z-10 text-3xl select-none">🧑‍💻</div>
                        <div className="absolute bottom-0 left-0 right-0 h-1/3"
                          style={{ background: "linear-gradient(0deg,rgba(124,58,237,0.4),transparent)" }} />
                      </div>
                    </div>
                    {/* Online dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900"
                      style={{ background: "#10B981", boxShadow: "0 0 8px #10B981" }} />
                  </div>

                  {/* Name + level */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold text-base" style={{ fontFamily: "Sora, sans-serif" }}>
                        Alex_Scholar_24
                      </h3>
                    </div>
                    {/* Level badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                      style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.35)" }}>
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span className="text-cyan-300 text-xs font-bold tracking-wider">LEVEL 12</span>
                    </div>
                  </div>
                </div>

                {/* XP Progress bar */}
                <div className="mb-5">
                  <div className="h-2.5 rounded-full overflow-hidden mb-1.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full w-[78%] xp-bar rounded-full" style={{ boxShadow: "0 0 12px rgba(124,58,237,0.7)" }} />
                  </div>
                  <p className="text-center text-xs tracking-widest text-slate-500 font-mono">78% TO LEVEL 13</p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'QUIZZES',   value: '24',  color: '#A78BFA' },
                    { label: 'AVG SCORE', value: '88%', color: '#06B6D4' },
                    { label: 'STREAK',    value: '7🔥', color: '#F97316' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="rounded-xl p-3 text-center"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <p className="text-[11px] text-slate-500 tracking-widest mb-1">{label}</p>
                      <p className="text-lg font-bold" style={{ color, fontFamily: "Sora, sans-serif" }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Subject progress bars */}
                {[
                  { name: 'Mathematics', pct: 88, color: '#7C3AED' },
                  { name: 'Science',     pct: 75, color: '#06B6D4' },
                  { name: 'History',     pct: 62, color: '#F59E0B' },
                ].map(({ name, pct, color }) => (
                  <div key={name} className="mb-2.5">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{name}</span>
                      <span className="font-semibold" style={{ color }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Card outer glow */}
              <div className="absolute -inset-4 -z-10 rounded-3xl blur-2xl opacity-20"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#06B6D4)' }} />
            </div>
          </div>

        </div>

        {/* ── Stats bar ── */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { num: '10,000+',      label: 'Students Playing',  icon: '👥', glow: '124,58,237' },
            { num: '500+',         label: 'Quizzes & Games',   icon: '🎮', glow: '6,182,212'  },
            { num: 'Classes 6–12', label: 'CBSE Curriculum',   icon: '📚', glow: '16,185,129' },
          ].map(({ num, label, icon, glow }) => (
            <div
              key={label}
              className="card-game p-5 text-center group hover:scale-[1.03] cursor-default"
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 25px rgba(${glow},0.28)`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "Sora, sans-serif" }}>{num}</div>
              <div className="text-sm text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
