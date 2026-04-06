import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import {
    Clock,
    Trophy,
    CheckCircle2,
    AlertCircle,
    Star,
    Target,
    Gamepad2,
    Zap,
    Loader2
} from "lucide-react";
import StudentSidebar from "../components/StudentSidebar";
import ApiService from "../api";
import { mockGameQuizzes, mockStudentProgress, filterByClass, deduplicateByID } from "../data/mockData";
// Game images
import circuitGameImage from "../assets/circuit-game-image.png";
import nutritionGameImage from "../assets/nutrition-game-image.png";
import pizzaGameImage from "../assets/pizza-game-image.png";
import photosynthesisGameImage from "../assets/photosynthesis-game-image.png";
import equationGameImage from "../assets/equation-game-image.png";

const Games = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName") || "Student";
    const userEmail = localStorage.getItem("userEmail") || "";
    const studentClass = localStorage.getItem("studentClass") || "6";
    const [loading, setLoading] = useState(true);
    const [gameQuizzes, setGameQuizzes] = useState([]);
    const [studentProgress, setStudentProgress] = useState(null);
    const [error, setError] = useState(null);

    console.log('Games component rendered, gameQuizzes length:', gameQuizzes.length);

    const handleLogout = () => {
        localStorage.removeItem("userType");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("studentClass");
        navigate("/");
    };

    // Load data from API
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Use mock data directly without filtering or deduplication
                console.log('Using mock data directly for games');
                console.log('Mock Games count:', mockGameQuizzes.length);
                console.log('Mock Games data:', mockGameQuizzes);

                // Ensure we have unique games by ID
                const uniqueGames = mockGameQuizzes.filter((game, index, self) =>
                    index === self.findIndex(g => g.id === game.id)
                );
                console.log('Unique Games count:', uniqueGames.length);
                console.log('Unique Games data:', uniqueGames);

                setGameQuizzes(uniqueGames);
                setStudentProgress(mockStudentProgress);

            } catch (error) {
                console.error('Failed to load game data:', error);
                // Don't show error, fallback handled above
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userEmail, studentClass]);

    const handleGameStart = async (game) => {
        try {
            // Navigate to game pages
            if (game.game_component === 'circuit') {
                navigate('/games/circuit');
            } else if (game.game_component === 'nutrition') {
                navigate('/games/nutrition');
            } else if (game.game_component === 'pizza') {
                navigate('/games/pizza');
            } else if (game.game_component === 'photosynthesis') {
                navigate('/games/photosynthesis');
            } else if (game.game_component === 'equation') {
                navigate('/games/equation-unlock');
            } else {
                // Handle other games
                navigate(`/games/${game.game_component}`);
            }
        } catch (error) {
            console.error('Failed to start game:', error);
            alert('Unable to start game. Please try again.');
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'text-green-600 bg-green-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'hard': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    if (loading) {
        return (
            <SidebarProvider>
                <StudentSidebar />
                <SidebarInset>
                    <div className="min-h-screen flex items-center justify-center" style={{ background: '#080D1A' }}>
                        <div className="text-center">
                            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-cyan-400" />
                            <p className="text-slate-400 font-grotesk text-sm tracking-wide">Loading the arcade...</p>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    if (error) {
        return (
            <SidebarProvider>
                <StudentSidebar />
                <SidebarInset>
                    <div className="min-h-screen flex items-center justify-center" style={{ background: '#080D1A' }}>
                        <div className="text-center glass rounded-2xl p-8 max-w-sm mx-4">
                            <AlertCircle className="h-10 w-10 text-pink-400 mx-auto mb-4" />
                            <p className="text-slate-300 mb-4 font-grotesk">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-cyan px-5 py-2 text-sm font-semibold"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    // Subject → accent color map
    const getSubjectColor = (subject = '') => {
        const s = subject.toLowerCase();
        if (s.includes('math')) return { text: 'text-violet-400', border: 'border-violet-500/50', dot: '#7C3AED' };
        if (s.includes('science') || s.includes('biology') || s.includes('photo')) return { text: 'text-cyan-400', border: 'border-cyan-500/50', dot: '#06B6D4' };
        if (s.includes('physics') || s.includes('circuit')) return { text: 'text-green-400', border: 'border-green-500/50', dot: '#10B981' };
        return { text: 'text-pink-400', border: 'border-pink-500/50', dot: '#EC4899' };
    };

    const getDifficultyBadge = (difficulty) => {
        switch ((difficulty || '').toLowerCase()) {
            case 'easy':   return 'bg-green-500/15 text-green-400 border border-green-500/30';
            case 'medium': return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
            case 'hard':   return 'bg-pink-500/15 text-pink-400 border border-pink-500/30';
            default:       return 'bg-slate-500/15 text-slate-400 border border-slate-500/30';
        }
    };

    const getGameImage = (game) => {
        const cls = "w-full h-full object-cover";
        if (game.game_component === 'circuit')
            return <img src={circuitGameImage} alt="Circuit Designer Game" className={cls} />;
        if (game.game_component === 'nutrition')
            return <img src={nutritionGameImage} alt="Nutrition Quest Game" className={cls} />;
        if (game.game_component === 'pizza')
            return <img src={pizzaGameImage} alt="Pizza Fraction Fun Game" className={cls} />;
        if (game.game_component === 'photosynthesis')
            return <img src={photosynthesisGameImage} alt="Photosynthesis Explorer Game" className={cls} />;
        if (game.game_component === 'equation' || game.game_component === 'equation-unlock')
            return <img src={equationGameImage} alt="Equation Unlock Challenge Game" className={cls} />;
        return (
            <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: 'rgba(6,182,212,0.15)' }}>
                {game.category_icon || "🎮"}
            </div>
        );
    };

    return (
        <SidebarProvider>
            <StudentSidebar />
            <SidebarInset>
                <div className="min-h-screen dot-grid" style={{ background: '#080D1A' }}>

                    {/* ── Sticky Header ── */}
                    <header
                        className="sticky top-0 z-50 border-b"
                        style={{
                            background: 'rgba(8,13,26,0.95)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            borderColor: 'rgba(6,182,212,0.2)',
                        }}
                    >
                        <div className="mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
                            <div className="flex items-center gap-3">
                                <SidebarTrigger className="md:hidden text-slate-400 hover:text-white" />
                                <h1 className="text-lg font-bold font-sora gradient-text-cyan">
                                    🎮 Game Arcade
                                </h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="badge-xp hidden sm:inline-flex">⚡ XP: {studentProgress?.overall_stats?.total_xp || 0}</span>
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
                                    style={{
                                        background: 'linear-gradient(135deg,#7C3AED,#06B6D4)',
                                        boxShadow: '0 0 0 2px rgba(124,58,237,0.5)',
                                    }}
                                >
                                    {userName.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-slate-300 hidden sm:block">{userName}</span>
                            </div>
                        </div>
                    </header>

                    <div className="mx-auto px-4 py-8 max-w-7xl">

                        {/* ── Page Title Section ── */}
                        <div className="mb-8 animate-slide-up">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold font-sora text-white">Game Arcade</h2>
                                <span
                                    className="text-xs font-semibold px-3 py-1 rounded-full"
                                    style={{
                                        background: 'rgba(6,182,212,0.12)',
                                        border: '1px solid rgba(6,182,212,0.3)',
                                        color: '#67E8F9',
                                    }}
                                >
                                    Class {studentClass}
                                </span>
                            </div>
                            <p className="text-slate-400 font-grotesk">
                                Earn XP by playing educational games designed for your class level
                            </p>
                        </div>

                        {/* ── Stats Row ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                            {/* Total Games */}
                            <div className="card-game p-5 flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}
                                >
                                    <Gamepad2 className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-grotesk uppercase tracking-wider mb-0.5">Total Games</p>
                                    <p className="text-3xl font-bold font-sora gradient-text-cyan">{gameQuizzes.length}</p>
                                </div>
                            </div>

                            {/* Completed */}
                            <div className="card-game p-5 flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}
                                >
                                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-grotesk uppercase tracking-wider mb-0.5">Completed</p>
                                    <p className="text-3xl font-bold font-sora text-green-400">
                                        {studentProgress?.overall_stats?.completed_quizzes || 0}
                                    </p>
                                </div>
                            </div>

                            {/* Best Score */}
                            <div className="card-game p-5 flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}
                                >
                                    <Star className="w-6 h-6 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-grotesk uppercase tracking-wider mb-0.5">Best Score</p>
                                    <p className="text-3xl font-bold font-sora gradient-text-gold">
                                        {Math.round(studentProgress?.overall_stats?.best_score || 0)}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Available Games Heading ── */}
                        <div className="flex items-center gap-3 mb-6">
                            <span
                                className="w-2.5 h-2.5 rounded-full animate-pulse-glow flex-shrink-0"
                                style={{ background: '#06B6D4' }}
                            />
                            <h3 className="text-lg font-bold font-sora text-white">Available Games</h3>
                        </div>

                        {/* ── Games Grid ── */}
                        {gameQuizzes.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-12">
                                {gameQuizzes.map((game) => {
                                    const accent = getSubjectColor(game.subject_name || game.game_component || '');
                                    return (
                                        <div
                                            key={game.id}
                                            className="card-game group relative overflow-hidden"
                                            style={{ borderTop: `2px solid ${accent.dot}40` }}
                                        >
                                            {/* subtle top color stripe */}
                                            <div
                                                className="absolute top-0 left-0 right-0 h-0.5"
                                                style={{ background: `linear-gradient(90deg, ${accent.dot}, transparent)` }}
                                            />

                                            <div className="p-5 flex items-start gap-5">
                                                {/* ── Game Image ── */}
                                                <div className="flex-shrink-0 relative">
                                                    <div className="w-20 h-20 rounded-xl overflow-hidden relative group-hover:scale-105 transition-transform"
                                                        style={{ border: `1px solid ${accent.dot}30` }}>
                                                        {getGameImage(game)}
                                                    </div>
                                                    {/* Difficulty badge on top-right of image */}
                                                    <span
                                                        className={`absolute -top-2 -right-2 text-xs px-2 py-0.5 rounded-full font-semibold font-grotesk ${getDifficultyBadge(game.difficulty)}`}
                                                    >
                                                        {game.difficulty}
                                                    </span>
                                                </div>

                                                {/* ── Game Info ── */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <h4 className="font-bold text-white font-sora text-base leading-snug group-hover:text-cyan-300 transition-colors">
                                                            {game.title}
                                                        </h4>
                                                        <span className="badge-xp flex-shrink-0">⚡ +{game.xp_reward || 150} XP</span>
                                                    </div>

                                                    <p className={`text-xs font-semibold mb-2 font-grotesk uppercase tracking-wider ${accent.text}`}>
                                                        {game.subject_name}
                                                    </p>

                                                    <p className="text-sm text-slate-400 leading-relaxed mb-3 font-grotesk line-clamp-2">
                                                        {game.description}
                                                    </p>

                                                    {/* Stats row */}
                                                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-4 font-grotesk">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                                                            {game.duration_minutes} min
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                                                            XP: +{game.xp_reward || 200}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Target className="w-3.5 h-3.5 text-slate-500" />
                                                            {game.difficulty} Level
                                                        </span>
                                                    </div>

                                                    {/* Play button */}
                                                    <button
                                                        className="btn-cyan px-5 py-2 text-sm flex items-center gap-2"
                                                        onClick={() => handleGameStart(game)}
                                                    >
                                                        <Gamepad2 className="w-4 h-4" />
                                                        Play Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <Gamepad2
                                    className="h-16 w-16 mx-auto mb-4"
                                    style={{ color: 'rgba(6,182,212,0.4)' }}
                                />
                                <h3 className="text-lg font-bold text-white font-sora mb-2">No Games Available</h3>
                                <p className="text-slate-500 font-grotesk">
                                    No educational games are available for Class {studentClass} at the moment.
                                </p>
                            </div>
                        )}

                        {/* ── Game Categories Info ── */}
                        <div className="card-game p-6">
                            <div className="flex items-center gap-2 mb-1">
                                <Trophy className="h-5 w-5 text-amber-400" />
                                <h3 className="font-bold font-sora text-white">Game Categories</h3>
                            </div>
                            <p className="text-xs text-slate-500 mb-5 font-grotesk">Different types of educational games available</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {[
                                    { icon: "🧮", label: "Mathematics", desc: "Fractions, equations, and more", color: '#7C3AED' },
                                    { icon: "🔬", label: "Science", desc: "Biology, chemistry, physics", color: '#06B6D4' },
                                    { icon: "⚡", label: "Electronics", desc: "Circuit building and design", color: '#10B981' },
                                    { icon: "🍎", label: "Health & Nutrition", desc: "Healthy eating habits", color: '#F97316' },
                                    { icon: "🌱", label: "Biology", desc: "Plant life and ecosystems", color: '#06B6D4' },
                                    { icon: "🔓", label: "Problem Solving", desc: "Logic and critical thinking", color: '#EC4899' },
                                ].map(({ icon, label, desc, color }) => (
                                    <div
                                        key={label}
                                        className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/5"
                                        style={{ border: `1px solid rgba(99,102,241,0.12)` }}
                                    >
                                        <div
                                            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                                            style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                                        >
                                            {icon}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-200 text-sm font-sora">{label}</div>
                                            <div className="text-xs text-slate-500 font-grotesk">{desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Games;
