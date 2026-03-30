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
                    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#1D4ED8]" />
                            <p className="text-[#64748B]">Loading games...</p>
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
                    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                        <div className="text-center">
                            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                            <p className="text-red-600">{error}</p>
                            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#1D4ED8] text-white rounded-lg text-sm">
                                Retry
                            </button>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    return (
        <SidebarProvider>
            <StudentSidebar />
            <SidebarInset>
                <div className="min-h-screen bg-[#F8FAFC]">
                    {/* Header */}
                    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
                        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <SidebarTrigger className="md:hidden" />
                                <h1 className="text-lg font-semibold text-[#1E293B] font-jakarta">Games</h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#1D4ED8] flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold">{userName.charAt(0).toUpperCase()}</span>
                                </div>
                                <span className="text-sm font-medium text-[#1E293B] hidden sm:block">{userName}</span>
                            </div>
                        </div>
                    </header>

                    <div className="container mx-auto px-4 py-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[#1E293B] font-jakarta">Educational Games - Class {studentClass}</h2>
                            <p className="text-[#64748B] mt-1">
                                Learn through interactive games designed for your class level
                            </p>
                        </div>

                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white border border-[#E2E8F0] border-l-4 border-l-[#1D4ED8] rounded-xl p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                        <Gamepad2 className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#64748B] font-medium">Total Games</p>
                                        <p className="text-2xl font-bold text-[#1D4ED8] font-jakarta">{gameQuizzes.length}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border border-[#E2E8F0] border-l-4 border-l-[#10B981] rounded-xl p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#64748B] font-medium">Completed</p>
                                        <p className="text-2xl font-bold text-[#10B981] font-jakarta">
                                            {studentProgress?.overall_stats?.completed_quizzes || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border border-[#E2E8F0] border-l-4 border-l-[#F59E0B] rounded-xl p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                        <Star className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#64748B] font-medium">Best Score</p>
                                        <p className="text-2xl font-bold text-[#F59E0B] font-jakarta">
                                            {Math.round(studentProgress?.overall_stats?.best_score || 0)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Games List */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#1E293B] font-jakarta">Available Games</h3>
                            <div className="space-y-4">
                                {gameQuizzes.map((game) => (
                                    <div key={game.id} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-shadow group">
                                        <div className="flex items-start gap-6">
                                            {/* Game Image/Icon - Left Side */}
                                            <div className="flex-shrink-0">
                                                {game.game_component === 'circuit' ? (
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                                                        <img
                                                            src={circuitGameImage}
                                                            alt="Circuit Designer Game"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : game.game_component === 'nutrition' ? (
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                                                        <img
                                                            src={nutritionGameImage}
                                                            alt="Nutrition Quest Game"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : game.game_component === 'pizza' ? (
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                                                        <img
                                                            src={pizzaGameImage}
                                                            alt="Pizza Fraction Fun Game"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : game.game_component === 'photosynthesis' ? (
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                                                        <img
                                                            src={photosynthesisGameImage}
                                                            alt="Photosynthesis Explorer Game"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : (game.game_component === 'equation' || game.game_component === 'equation-unlock') ? (
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                                                        <img
                                                            src={equationGameImage}
                                                            alt="Equation Unlock Challenge Game"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-20 h-20 rounded-lg bg-purple-100 flex items-center justify-center text-4xl shadow-md group-hover:shadow-lg transition-shadow">
                                                        {game.category_icon || "🎮"}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Game Information - Right Side */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-[#1E293B] text-lg flex items-center gap-2 group-hover:text-[#1D4ED8] transition-colors mb-1">
                                                            {game.title}
                                                            <Gamepad2 className="w-5 h-5 text-purple-600" />
                                                        </h4>
                                                        <p className="text-sm text-[#64748B] mb-2">{game.subject_name}</p>
                                                        <p className="text-sm text-[#64748B] leading-relaxed">{game.description}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <Badge variant="outline" className="bg-purple-100 text-purple-800">
                                                            Interactive
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className={getDifficultyColor(game.difficulty)}
                                                        >
                                                            {game.difficulty}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Game Stats */}
                                                <div className="flex items-center gap-6 text-sm text-[#64748B] mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{game.duration_minutes} minutes</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Zap className="w-4 h-4" />
                                                        <span>Interactive Learning</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Target className="w-4 h-4" />
                                                        <span>{game.difficulty} Level</span>
                                                    </div>
                                                </div>

                                                {/* Play Button */}
                                                <div className="flex justify-end">
                                                    <button
                                                        className="bg-[#1D4ED8] hover:bg-blue-700 text-white transition-colors px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                                                        onClick={() => handleGameStart(game)}
                                                    >
                                                        <Gamepad2 className="w-4 h-4" />
                                                        Play Game
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {gameQuizzes.length === 0 && (
                                <div className="text-center py-12">
                                    <Gamepad2 className="h-16 w-16 mx-auto text-[#64748B] mb-4" />
                                    <h3 className="text-lg font-semibold text-[#1E293B] mb-2">No Games Available</h3>
                                    <p className="text-[#64748B]">
                                        No educational games are available for Class {studentClass} at the moment.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Game Categories Info */}
                        <div className="mt-12">
                            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <Trophy className="h-5 w-5 text-[#1D4ED8]" />
                                    <h3 className="font-semibold text-[#1E293B] font-jakarta">Game Categories</h3>
                                </div>
                                <p className="text-xs text-[#64748B] mb-4">Different types of educational games available</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { icon: "🧮", label: "Mathematics", desc: "Fractions, equations, and more" },
                                        { icon: "🔬", label: "Science", desc: "Biology, chemistry, physics" },
                                        { icon: "⚡", label: "Electronics", desc: "Circuit building and design" },
                                        { icon: "🍎", label: "Health & Nutrition", desc: "Healthy eating habits" },
                                        { icon: "🌱", label: "Biology", desc: "Plant life and ecosystems" },
                                        { icon: "🔓", label: "Problem Solving", desc: "Logic and critical thinking" },
                                    ].map(({ icon, label, desc }) => (
                                        <div key={label} className="flex items-center gap-3 p-3 border border-[#E2E8F0] rounded-lg">
                                            <div className="text-2xl">{icon}</div>
                                            <div>
                                                <div className="font-medium text-[#1E293B] text-sm">{label}</div>
                                                <div className="text-xs text-[#64748B]">{desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Games;
