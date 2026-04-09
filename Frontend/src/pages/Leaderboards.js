import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Trophy, Medal, Crown, Star, Target, Zap } from "lucide-react";
import StudentSidebar from "../components/StudentSidebar";
import ApiService from "../api";

const Leaderboards = () => {
  const userName = localStorage.getItem("userName") || "Student";
  const userEmail = localStorage.getItem("userEmail") || "";
  const studentClass = localStorage.getItem("studentClass") || "6";
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  useEffect(() => {
    const loadLeaderboardData = async () => {
      setLoading(true);
      try {
        const currentUser = userEmail ? { name: userName, email: userEmail, class: studentClass } : null;
        const { leaderboard } = await ApiService.getLeaderboard(currentUser);
        const classFiltered = leaderboard.filter(p => p.class === studentClass);
        setLeaderboardData({
          overall_leaderboard: leaderboard,
          class_leaderboard: classFiltered,
          game_leaderboard: [],
        });
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
        setLeaderboardData({ overall_leaderboard: [], class_leaderboard: [], game_leaderboard: [] });
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboardData();
  }, [studentClass]);

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Trophy className="w-5 h-5 text-orange-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return "from-yellow-400 to-yellow-600";
      case 2: return "from-gray-300 to-gray-500";
      case 3: return "from-orange-400 to-orange-600";
      default: return "from-blue-400 to-blue-600";
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <StudentSidebar />
        <SidebarInset>
          <div className="min-h-screen flex items-center justify-center" style={{ background: '#080D1A' }}>
            <div className="text-center">
              <Trophy className="h-10 w-10 mx-auto mb-4 text-amber-400 animate-pulse" />
              <p className="text-slate-400 font-grotesk text-sm tracking-wide">Loading battle rankings...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const top3 = leaderboardData?.overall_leaderboard?.slice(0, 3) || [];
  const allPlayers = leaderboardData?.overall_leaderboard || [];

  // Podium order: 2nd left, 1st center, 3rd right
  const podiumOrder = [top3[1], top3[0], top3[2]];

  const podiumConfig = {
    0: { // #2 - Sarah Kim (left)
      rankNum: 2,
      emoji: '🥈',
      borderColor: 'rgba(148,163,184,0.4)',
      glowColor: 'rgba(148,163,184,0.15)',
      ringColor: 'from-slate-300 to-slate-500',
      badgeText: 'RUNNER UP',
      badgeBg: 'rgba(148,163,184,0.15)',
      badgeBorder: 'rgba(148,163,184,0.4)',
      badgeTextColor: '#CBD5E1',
      height: 'pt-6',
    },
    1: { // #1 - Alex Chen (center — tallest)
      rankNum: 1,
      emoji: '👑',
      borderColor: 'rgba(251,191,36,0.5)',
      glowColor: 'rgba(245,158,11,0.22)',
      ringColor: 'from-yellow-300 to-amber-500',
      badgeText: 'CHAMPION',
      badgeBg: 'rgba(245,158,11,0.18)',
      badgeBorder: 'rgba(245,158,11,0.45)',
      badgeTextColor: '#FCD34D',
      height: 'pt-0',
      glow: 'glow-gold',
    },
    2: { // #3 - current user (right)
      rankNum: 3,
      emoji: '🥉',
      borderColor: 'rgba(205,124,47,0.5)',
      glowColor: 'rgba(205,124,47,0.18)',
      ringColor: 'from-orange-400 to-amber-700',
      badgeText: 'YOU',
      badgeBg: 'rgba(205,124,47,0.18)',
      badgeBorder: 'rgba(205,124,47,0.45)',
      badgeTextColor: '#D4975A',
      height: 'pt-4',
      glow: '',
    },
  };

  const weeklyChallenge = [
    { label: 'Play 5 Games', current: 3, total: 5, color: '#06B6D4' },
    { label: 'Score 80%+ in a Quiz', current: 1, total: 1, color: '#10B981' },
    { label: 'Login 7 Days in a Row', current: 7, total: 7, color: '#F59E0B' },
  ];

  const achievements = [
    { emoji: '🏆', label: 'Top Scorer' },
    { emoji: '⚡', label: 'XP Grinder' },
    { emoji: '🔥', label: 'Streak King' },
    { emoji: '🎮', label: 'Game Master' },
    { emoji: '📚', label: 'Quiz Ace' },
    { emoji: '🌟', label: 'Star Student' },
  ];

  const periodLabels = { week: 'This Week', month: 'This Month', all: 'All Time' };

  return (
    <SidebarProvider>
      <StudentSidebar />
      <SidebarInset className="overflow-x-hidden">
        <div className="min-h-screen w-full overflow-x-hidden dot-grid" style={{ background: '#080D1A' }}>

          {/* ── Sticky Header ── */}
          <header
            className="sticky top-0 z-50 border-b"
            style={{
              background: 'rgba(8,13,26,0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderColor: 'rgba(245,158,11,0.2)',
            }}
          >
            <div className="w-full px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <SidebarTrigger className="md:hidden text-slate-400 hover:text-white shrink-0" />
                <h1 className="text-base sm:text-lg font-bold font-sora gradient-text-gold truncate">
                  🏆 Battle Rankings
                </h1>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
                  style={{
                    background: 'linear-gradient(135deg,#F59E0B,#FBBF24)',
                    boxShadow: '0 0 0 2px rgba(245,158,11,0.5)',
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-300 hidden sm:block">{userName}</span>
              </div>
            </div>
          </header>

          <div className="mx-auto px-4 py-8 pb-24 md:pb-8 max-w-7xl">

            {/* ── Page Title ── */}
            <div className="mb-8 animate-slide-up">
              <h2 className="text-3xl font-bold font-sora text-white mb-1">
                👑 Battle Rankings
              </h2>
              <p className="text-slate-400 font-grotesk">Compete. Conquer. Dominate.</p>
            </div>

            {/* ── Period Tabs ── */}
            <div className="flex gap-2 mb-8">
              {Object.entries(periodLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPeriod(key)}
                  className="px-4 py-2 rounded-full text-sm font-semibold font-grotesk transition-all"
                  style={
                    selectedPeriod === key
                      ? {
                          background: 'linear-gradient(135deg,#F59E0B,#D97706)',
                          color: '#080D1A',
                          boxShadow: '0 0 18px rgba(245,158,11,0.4)',
                        }
                      : {
                          background: 'rgba(15,22,41,0.7)',
                          border: '1px solid rgba(245,158,11,0.15)',
                          color: '#94A3B8',
                        }
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-col xl:flex-row gap-8">
              {/* ── Main Content ── */}
              <div className="flex-1 min-w-0">

                {/* ── TOP 3 PODIUM ── */}
                <div className="mb-10">
                  <div className="flex items-end justify-center gap-3 sm:gap-5">
                    {podiumOrder.map((player, podiumIdx) => {
                      if (!player) return null;
                      const cfg = podiumConfig[podiumIdx];
                      const isCenter = podiumIdx === 1;
                      return (
                        <div
                          key={player.id}
                          className={`flex-1 max-w-[200px] card-game flex flex-col items-center text-center p-4 sm:p-5 transition-all ${cfg.height} ${cfg.glow || ''}`}
                          style={{
                            border: `1px solid ${cfg.borderColor}`,
                            background: `rgba(15,22,41,0.85)`,
                            boxShadow: `0 0 30px ${cfg.glowColor}`,
                            transform: isCenter ? 'scale(1.06)' : 'scale(1)',
                          }}
                        >
                          <div className="text-2xl mb-2">{cfg.emoji}</div>

                          {/* Avatar with gradient ring */}
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl text-white mb-2"
                            style={{
                              background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                              backgroundImage: `linear-gradient(135deg, ${cfg.rankNum === 1 ? '#FDE68A,#F59E0B' : cfg.rankNum === 3 ? '#E8A96A,#CD7C2F' : '#E2E8F0,#94A3B8'})`,
                              padding: '2px',
                            }}
                          >
                            <div
                              className="w-full h-full rounded-full flex items-center justify-center font-bold text-lg"
                              style={{ background: '#0F1629' }}
                            >
                              <span
                                style={{
                                  background: `linear-gradient(135deg, ${cfg.rankNum === 1 ? '#FDE68A,#F59E0B' : cfg.rankNum === 3 ? '#E8A96A,#CD7C2F' : '#E2E8F0,#94A3B8'})`,
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  backgroundClip: 'text',
                                }}
                              >
                                {player.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <p className="font-bold text-white font-sora text-sm mb-1 truncate w-full">{player.name}</p>

                          {/* Badge */}
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full mb-2 font-grotesk tracking-wider"
                            style={{
                              background: cfg.badgeBg,
                              border: `1px solid ${cfg.badgeBorder}`,
                              color: cfg.badgeTextColor,
                            }}
                          >
                            {cfg.badgeText}
                          </span>

                          <div className="flex items-center gap-1 text-xs text-slate-400 mb-1 font-grotesk">
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span className="font-semibold text-amber-300">{player.total_xp.toLocaleString()} XP</span>
                          </div>
                          <div className="text-xs text-slate-500 font-grotesk">
                            🔥 {player.streak}d streak
                          </div>
                          <div className="text-xs text-slate-500 font-grotesk mt-0.5">
                            Lv. {player.level}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Full Rankings Table ── */}
                <div className="card-game overflow-hidden mb-6">
                  <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(245,158,11,0.15)' }}>
                    <h3 className="font-bold font-sora text-white flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-400" />
                      Full Rankings
                    </h3>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'rgba(245,158,11,0.08)' }}>
                    {allPlayers.map((player, idx) => {
                      const rank = idx + 1;
                      const isMe = player.name === userName;
                      const rankColors = { 1: '#F59E0B', 2: '#94A3B8', 3: '#C2855A' };
                      const rankBg = { 1: 'rgba(245,158,11,0.12)', 2: 'rgba(148,163,184,0.08)', 3: 'rgba(194,133,90,0.1)' };
                      return (
                        <div
                          key={player.id}
                          className="flex items-center gap-3 sm:gap-4 px-5 py-3 transition-colors"
                          style={{
                            background: isMe
                              ? 'rgba(245,158,11,0.07)'
                              : idx % 2 === 0
                              ? 'transparent'
                              : 'rgba(255,255,255,0.01)',
                            border: isMe ? '1px solid rgba(245,158,11,0.35)' : 'none',
                          }}
                        >
                          {/* Rank number */}
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 font-grotesk"
                            style={{
                              background: rankBg[rank] || 'rgba(255,255,255,0.04)',
                              color: rankColors[rank] || '#64748B',
                            }}
                          >
                            {rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : `#${rank}`}
                          </div>

                          {/* Avatar */}
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                            style={{
                              background: isMe
                                ? 'linear-gradient(135deg,#F59E0B,#FBBF24)'
                                : 'rgba(245,158,11,0.1)',
                              color: isMe ? '#080D1A' : '#94A3B8',
                            }}
                          >
                            {player.name.charAt(0).toUpperCase()}
                          </div>

                          {/* Name + class */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`font-semibold text-sm font-sora ${isMe ? 'text-amber-300' : 'text-white'}`}>
                                {player.name}
                              </span>
                              {isMe && (
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full font-grotesk font-semibold"
                                  style={{
                                    background: 'rgba(245,158,11,0.15)',
                                    border: '1px solid rgba(245,158,11,0.4)',
                                    color: '#FCD34D',
                                  }}
                                >
                                  You
                                </span>
                              )}
                              <span
                                className="text-xs px-2 py-0.5 rounded-full font-grotesk"
                                style={{
                                  background: 'rgba(255,255,255,0.05)',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  color: '#94A3B8',
                                }}
                              >
                                Class {player.class}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 font-grotesk mt-0.5 hidden sm:block">
                              🏆 {player.completed_quizzes} quizzes · 🎮 {player.completed_games} games
                            </div>
                          </div>

                          {/* Level */}
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-grotesk font-semibold flex-shrink-0 hidden sm:inline-flex"
                            style={{
                              background: 'rgba(6,182,212,0.12)',
                              border: '1px solid rgba(6,182,212,0.25)',
                              color: '#67E8F9',
                            }}
                          >
                            Lv.{player.level}
                          </span>

                          {/* XP */}
                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center gap-1 justify-end">
                              <Zap className="w-3.5 h-3.5 text-amber-400" />
                              <span className="font-bold text-amber-300 text-sm font-grotesk">
                                {player.total_xp.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 font-grotesk">🔥 {player.streak}d</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* ── Right Panel ── */}
              <div className="xl:w-72 space-y-5 flex-shrink-0">

                {/* Your Stats */}
                <div className="card-game overflow-hidden">
                  <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(245,158,11,0.15)' }}>
                    <h3 className="font-bold font-sora text-white flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400" />
                      Your Stats
                    </h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {[
                      { label: 'Global Rank', value: '#3', icon: '🏆', color: '#F59E0B' },
                      { label: 'Total XP', value: '3,600', icon: '⚡', color: '#FBBF24' },
                      { label: 'Level', value: '6', icon: '⭐', color: '#06B6D4' },
                      { label: 'Streak', value: '7 days', icon: '🔥', color: '#F97316' },
                    ].map(({ label, value, icon, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{icon}</span>
                          <span className="text-sm text-slate-400 font-grotesk">{label}</span>
                        </div>
                        <span className="font-bold font-sora text-sm" style={{ color }}>{value}</span>
                      </div>
                    ))}
                    {/* XP bar */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1 font-grotesk">
                        <span>Progress to Lv.7</span>
                        <span>3600 / 5000 XP</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="xp-bar h-full rounded-full" style={{ width: '72%' }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {[
                        { label: 'Quizzes', value: 32 },
                        { label: 'Games', value: 12 },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="rounded-xl p-3 text-center"
                          style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)' }}
                        >
                          <div className="font-bold font-sora text-amber-300 text-lg">{value}</div>
                          <div className="text-xs text-slate-500 font-grotesk">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Weekly Challenges */}
                <div className="card-game overflow-hidden">
                  <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(245,158,11,0.15)' }}>
                    <h3 className="font-bold font-sora text-white flex items-center gap-2">
                      <Target className="w-4 h-4 text-cyan-400" />
                      Weekly Challenges
                    </h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {weeklyChallenge.map((c) => {
                      const pct = Math.round((c.current / c.total) * 100);
                      const done = c.current >= c.total;
                      return (
                        <div key={c.label}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-slate-300 font-grotesk">{c.label}</span>
                            <span
                              className="text-xs font-semibold font-grotesk"
                              style={{ color: done ? '#10B981' : '#94A3B8' }}
                            >
                              {done ? '✓ Done' : `${c.current}/${c.total}`}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${pct}%`,
                                background: done
                                  ? 'linear-gradient(90deg,#10B981,#06B6D4)'
                                  : `linear-gradient(90deg,${c.color},${c.color}99)`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Achievements */}
                <div className="card-game overflow-hidden">
                  <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(245,158,11,0.15)' }}>
                    <h3 className="font-bold font-sora text-white flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      Achievements
                    </h3>
                  </div>
                  <div className="p-5 grid grid-cols-3 gap-2">
                    {achievements.map((a) => (
                      <div
                        key={a.label}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl text-center transition-all hover:scale-105"
                        style={{
                          background: 'rgba(245,158,11,0.07)',
                          border: '1px solid rgba(245,158,11,0.18)',
                        }}
                        title={a.label}
                      >
                        <span className="text-xl">{a.emoji}</span>
                        <span className="text-xs text-slate-500 font-grotesk leading-tight">{a.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Leaderboards;
