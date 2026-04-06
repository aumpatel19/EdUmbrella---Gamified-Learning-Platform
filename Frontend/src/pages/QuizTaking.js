import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/simplebutton';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
    Clock,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    ArrowRight,
    Flag,
    AlertCircle,
    Trophy,
    Target
} from 'lucide-react';
import ApiService from '../api';
import { circuitQuizQuestions, mockTraditionalQuizzes } from '../data/mockData';

// Function to create demo quiz data for any quiz ID
const createDemoQuiz = (quizId) => {
    // Try to find the quiz in mock data first
    const mockQuiz = mockTraditionalQuizzes.find(quiz => quiz.id.toString() === quizId);

    if (mockQuiz) {
        // Create demo questions based on the quiz title
        const demoQuestions = [
            {
                id: 1,
                question_text: `What is the main topic of ${mockQuiz.title}?`,
                question_type: "multiple_choice",
                options: ["Option A", "Option B", "Option C", "Option D"],
                correct_answer: "Option A",
                explanation: "This is the correct answer based on the quiz topic.",
                points: 1
            },
            {
                id: 2,
                question_text: `Which of the following is true about ${mockQuiz.subject_name}?`,
                question_type: "multiple_choice",
                options: ["Statement 1", "Statement 2", "Statement 3", "Statement 4"],
                correct_answer: "Statement 1",
                explanation: "This statement is correct for this subject.",
                points: 1
            },
            {
                id: 3,
                question_text: `In ${mockQuiz.subject_name}, what is the most important concept?`,
                question_type: "multiple_choice",
                options: ["Concept A", "Concept B", "Concept C", "Concept D"],
                correct_answer: "Concept A",
                explanation: "This is the most fundamental concept in this subject.",
                points: 1
            }
        ];

        return {
            quiz: {
                id: mockQuiz.id,
                title: mockQuiz.title,
                description: mockQuiz.description || `Practice quiz for ${mockQuiz.subject_name}`,
                subject_name: mockQuiz.subject_name,
                difficulty: mockQuiz.difficulty,
                duration_minutes: mockQuiz.duration_minutes,
                total_questions: demoQuestions.length
            },
            questions: demoQuestions
        };
    }

    // Fallback generic demo quiz
    return {
        quiz: {
            id: quizId,
            title: "Demo Quiz",
            description: "This is a demo quiz for practice",
            subject_name: "General",
            difficulty: "medium",
            duration_minutes: 15,
            total_questions: 3
        },
        questions: [
            {
                id: 1,
                question_text: "What is the capital of India?",
                question_type: "multiple_choice",
                options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
                correct_answer: "Delhi",
                explanation: "Delhi is the capital of India.",
                points: 1
            },
            {
                id: 2,
                question_text: "Which planet is closest to the Sun?",
                question_type: "multiple_choice",
                options: ["Venus", "Mercury", "Earth", "Mars"],
                correct_answer: "Mercury",
                explanation: "Mercury is the closest planet to the Sun.",
                points: 1
            },
            {
                id: 3,
                question_text: "What is 2 + 2?",
                question_type: "multiple_choice",
                options: ["3", "4", "5", "6"],
                correct_answer: "4",
                explanation: "2 + 2 = 4",
                points: 1
            }
        ]
    };
};

const QuizTaking = () => {
    const { quizId, attemptId } = useParams();
    const navigate = useNavigate();

    // State management
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [quizResult, setQuizResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    // Load quiz data
    useEffect(() => {
        const loadQuizData = async () => {
            try {
                setLoading(true);
                setError(null);

                let quizData;

                console.log('Quiz ID received:', quizId);

                // Check if this is a teacher-created quiz
                if (quizId.startsWith('teacher_')) {
                    console.log('Loading teacher-created quiz from Flask server...');
                    const response = await ApiService.getTeacherQuizById(quizId);

                    if (response.success) {
                        const teacherQuiz = response.quiz;
                        quizData = {
                            quiz: {
                                id: teacherQuiz.id,
                                title: teacherQuiz.title,
                                description: teacherQuiz.description,
                                subject_name: teacherQuiz.subject_name,
                                difficulty: teacherQuiz.difficulty,
                                duration_minutes: teacherQuiz.duration_minutes,
                                total_questions: teacherQuiz.total_questions
                            },
                            questions: teacherQuiz.questions || []
                        };
                    } else {
                        throw new Error('Teacher quiz not found');
                    }
                }
                // Check if this is the circuit quiz (ID 14)
                else if (quizId === '14') {
                    console.log('Loading circuit quiz from mock data...');
                    quizData = circuitQuizQuestions;
                }
                // Try to load from mock data first (for other prebuilt quizzes)
                else {
                    console.log('Loading quiz from mock data or API...');
                    try {
                        // Try API first
                        quizData = await ApiService.getQuizDetails(quizId);
                    } catch (apiError) {
                        console.warn('API failed, trying mock data:', apiError);
                        // Fallback to mock data - create a demo quiz
                        quizData = createDemoQuiz(quizId);
                    }
                }

                if (!quizData || !quizData.quiz) {
                    throw new Error('Quiz data not found');
                }

                setQuiz(quizData.quiz);
                setQuestions(quizData.questions || []);
                setTimeRemaining(quizData.quiz.duration_minutes * 60);

                // Initialize answers object
                const initialAnswers = {};
                (quizData.questions || []).forEach(q => {
                    initialAnswers[q.id] = q.question_type === 'multiple_choice' ? '' :
                        q.question_type === 'true_false' ? '' :
                            q.question_type === 'fill_blank' ? '' : [];
                });
                setAnswers(initialAnswers);

            } catch (error) {
                console.error('Failed to load quiz:', error);
                setError('Failed to load quiz. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (quizId) {
            loadQuizData();
        }
    }, [quizId]);

    // Timer countdown
    useEffect(() => {
        if (timeRemaining > 0 && !showResults && quiz) {
            const timer = setTimeout(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeRemaining === 0 && !showResults && quiz) {
            handleSubmitQuiz();
        }
    }, [timeRemaining, showResults, quiz]);

    // Format time display
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Handle answer changes
    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    // Handle multiple choice answer
    const handleMultipleChoice = (questionId, option) => {
        handleAnswerChange(questionId, option);
    };

    // Handle true/false answer
    const handleTrueFalse = (questionId, value) => {
        handleAnswerChange(questionId, value);
    };

    // Handle fill in the blank
    const handleFillBlank = (questionId, value) => {
        handleAnswerChange(questionId, value);
    };

    // Handle checkbox (multiple selection)
    const handleCheckboxChange = (questionId, option, checked) => {
        setAnswers(prev => {
            const currentAnswers = prev[questionId] || [];
            if (checked) {
                return {
                    ...prev,
                    [questionId]: [...currentAnswers, option]
                };
            } else {
                return {
                    ...prev,
                    [questionId]: currentAnswers.filter(ans => ans !== option)
                };
            }
        });
    };

    // Toggle question flag
    const toggleFlag = (questionId) => {
        setFlaggedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            } else {
                newSet.add(questionId);
            }
            return newSet;
        });
    };

    // Navigation functions
    const goToQuestion = (index) => {
        if (index >= 0 && index < totalQuestions) {
            setCurrentQuestionIndex(index);
        }
    };

    const goToNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const goToPrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    // Submit quiz
    const handleSubmitQuiz = async () => {
        try {
            setIsSubmitting(true);

            if (!quiz) {
                console.error('Quiz data not loaded');
                setError('Quiz data not loaded. Please refresh and try again.');
                return;
            }

            const timeSpentMinutes = Math.max(0, (quiz.duration_minutes * 60 - timeRemaining) / 60);

            // Handle different quiz types
            if (quizId === '14' || quizId.startsWith('teacher_') || quizId.startsWith('demo_')) {
                // Calculate score locally for mock/teacher/demo quizzes
                let correctAnswers = 0;
                questions.forEach(question => {
                    const userAnswer = answers[question.id];
                    if (userAnswer === question.correct_answer) {
                        correctAnswers++;
                    }
                });

                const score = Math.round((correctAnswers / questions.length) * 100);

                const localResult = {
                    score: score,
                    total_questions: questions.length,
                    correct_answers: correctAnswers,
                    time_spent_minutes: timeSpentMinutes,
                    message: 'Quiz completed successfully!'
                };

                setQuizResult(localResult);
                setShowResults(true);
            } else {
                // Use API for real quizzes
                try {
                    const result = await ApiService.submitQuiz(attemptId, answers, timeSpentMinutes);
                    setQuizResult(result);
                    setShowResults(true);
                } catch (apiError) {
                    console.warn('API submission failed, using local scoring:', apiError);
                    // Fallback to local scoring if API fails
                    let correctAnswers = 0;
                    questions.forEach(question => {
                        const userAnswer = answers[question.id];
                        if (userAnswer === question.correct_answer) {
                            correctAnswers++;
                        }
                    });

                    const score = Math.round((correctAnswers / questions.length) * 100);

                    const fallbackResult = {
                        score: score,
                        total_questions: questions.length,
                        correct_answers: correctAnswers,
                        time_spent_minutes: timeSpentMinutes,
                        message: 'Quiz completed successfully! (Local scoring)'
                    };

                    setQuizResult(fallbackResult);
                    setShowResults(true);
                }
            }

        } catch (error) {
            console.error('Failed to submit quiz:', error);
            setError('Failed to submit quiz. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render question based on type
    const renderQuestion = () => {
        if (!currentQuestion) return null;

        const questionId = currentQuestion.id;
        const currentAnswer = answers[questionId];
        const optionLabels = ['A', 'B', 'C', 'D', 'E'];

        switch (currentQuestion.question_type) {
            case 'multiple_choice':
                return (
                    <div className="space-y-3">
                        {currentQuestion.options?.map((option, index) => {
                            const isSelected = currentAnswer === option;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleMultipleChoice(questionId, option)}
                                    className="w-full text-left flex items-center gap-4 p-4 rounded-xl transition-all duration-150"
                                    style={
                                        isSelected
                                            ? {
                                                background: "rgba(124,58,237,0.2)",
                                                border: "1px solid rgba(124,58,237,0.6)",
                                                boxShadow: "0 0 15px rgba(124,58,237,0.25)",
                                            }
                                            : {
                                                background: "rgba(15,22,41,0.6)",
                                                border: "1px solid rgba(255,255,255,0.07)",
                                            }
                                    }
                                >
                                    <span
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                                        style={
                                            isSelected
                                                ? {
                                                    background: "rgba(124,58,237,0.5)",
                                                    border: "1px solid rgba(124,58,237,0.7)",
                                                    color: "#DDD6FE",
                                                }
                                                : {
                                                    background: "rgba(255,255,255,0.06)",
                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                    color: "#94A3B8",
                                                }
                                        }
                                    >
                                        {optionLabels[index]}
                                    </span>
                                    <span
                                        className="text-sm font-medium"
                                        style={{ color: isSelected ? "#EDE9FE" : "rgba(255,255,255,0.8)" }}
                                    >
                                        {option}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                );

            case 'true_false':
                return (
                    <div className="space-y-3">
                        {[
                            { value: "true", label: "True", icon: "✓" },
                            { value: "false", label: "False", icon: "✗" },
                        ].map(({ value, label, icon }) => {
                            const isSelected = currentAnswer === value;
                            return (
                                <button
                                    key={value}
                                    onClick={() => handleTrueFalse(questionId, value)}
                                    className="w-full text-left flex items-center gap-4 p-4 rounded-xl transition-all duration-150"
                                    style={
                                        isSelected
                                            ? {
                                                background: value === "true" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                                                border: `1px solid ${value === "true" ? "rgba(16,185,129,0.6)" : "rgba(239,68,68,0.6)"}`,
                                                boxShadow: value === "true" ? "0 0 12px rgba(16,185,129,0.2)" : "0 0 12px rgba(239,68,68,0.2)",
                                            }
                                            : {
                                                background: "rgba(15,22,41,0.6)",
                                                border: "1px solid rgba(255,255,255,0.07)",
                                            }
                                    }
                                >
                                    <span
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                                        style={
                                            isSelected
                                                ? {
                                                    background: value === "true" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)",
                                                    color: value === "true" ? "#34D399" : "#F87171",
                                                }
                                                : {
                                                    background: "rgba(255,255,255,0.06)",
                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                    color: "#94A3B8",
                                                }
                                        }
                                    >
                                        {icon}
                                    </span>
                                    <span
                                        className="text-sm font-medium"
                                        style={{ color: isSelected ? "#EDE9FE" : "rgba(255,255,255,0.8)" }}
                                    >
                                        {label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                );

            case 'fill_blank':
                return (
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={currentAnswer || ''}
                            onChange={(e) => handleFillBlank(questionId, e.target.value)}
                            placeholder="Type your answer here..."
                            className="w-full px-4 py-3 rounded-xl text-white placeholder-opacity-40 outline-none transition-all"
                            style={{
                                background: "rgba(15,22,41,0.8)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                color: "white",
                                borderRadius: "0.75rem",
                            }}
                            onFocus={e => {
                                e.target.style.border = "1px solid rgba(124,58,237,0.7)";
                                e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)";
                            }}
                            onBlur={e => {
                                e.target.style.border = "1px solid rgba(255,255,255,0.07)";
                                e.target.style.boxShadow = "none";
                            }}
                        />
                    </div>
                );

            case 'matching':
                return (
                    <div className="space-y-3">
                        {currentQuestion.options?.map((option, index) => {
                            const isChecked = currentAnswer?.includes(option) || false;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleCheckboxChange(questionId, option, !isChecked)}
                                    className="w-full text-left flex items-center gap-4 p-4 rounded-xl transition-all duration-150"
                                    style={
                                        isChecked
                                            ? {
                                                background: "rgba(124,58,237,0.2)",
                                                border: "1px solid rgba(124,58,237,0.6)",
                                                boxShadow: "0 0 15px rgba(124,58,237,0.2)",
                                            }
                                            : {
                                                background: "rgba(15,22,41,0.6)",
                                                border: "1px solid rgba(255,255,255,0.07)",
                                            }
                                    }
                                >
                                    <span
                                        className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                                        style={
                                            isChecked
                                                ? { background: "#7C3AED", border: "1px solid #7C3AED" }
                                                : { background: "transparent", border: "1px solid rgba(148,163,184,0.25)" }
                                        }
                                    >
                                        {isChecked && <span style={{ color: "white", fontSize: "0.65rem" }}>✓</span>}
                                    </span>
                                    <span
                                        className="text-sm font-medium"
                                        style={{ color: isChecked ? "#EDE9FE" : "rgba(255,255,255,0.8)" }}
                                    >
                                        {option}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                );

            default:
                return (
                    <div style={{ color: "rgba(148,163,184,0.55)", textAlign: "center", padding: "1rem" }}>
                        Unsupported question type
                    </div>
                );
        }
    };

    // ── LOADING STATE ──
    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center dot-grid"
                style={{ background: "#080D1A" }}
            >
                <div className="text-center animate-slide-up">
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow"
                        style={{
                            background: "rgba(6,182,212,0.1)",
                            border: "1px solid rgba(6,182,212,0.3)",
                        }}
                    >
                        <div
                            className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
                            style={{ borderTopColor: "#06B6D4", borderRightColor: "#7C3AED" }}
                        />
                    </div>
                    <p
                        className="text-lg font-semibold tracking-widest uppercase"
                        style={{ color: "#94A3B8", fontFamily: "Sora, sans-serif" }}
                    >
                        Loading Quiz Arena...
                    </p>
                    <p style={{ color: "rgba(148,163,184,0.45)", fontSize: "0.85rem", marginTop: "0.4rem" }}>
                        Fetching your questions
                    </p>
                </div>
            </div>
        );
    }

    // ── ERROR STATE ──
    if (error) {
        return (
            <div
                className="min-h-screen flex items-center justify-center dot-grid p-4"
                style={{ background: "#080D1A" }}
            >
                <div
                    className="glass text-center p-10 animate-slide-up"
                    style={{ maxWidth: 420, width: "100%" }}
                >
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                        style={{ background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.35)" }}
                    >
                        <AlertCircle className="h-8 w-8" style={{ color: "#EC4899" }} />
                    </div>
                    <p className="font-bold mb-2" style={{ color: "#F9A8D4", fontSize: "1.1rem", fontFamily: "Sora" }}>
                        Failed to Load Quiz
                    </p>
                    <p style={{ color: "rgba(249,168,212,0.55)", fontSize: "0.9rem", marginBottom: "1.75rem" }}>
                        {error}
                    </p>
                    <button
                        onClick={() => navigate('/quizzes')}
                        className="btn-violet w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Quizzes
                    </button>
                </div>
            </div>
        );
    }

    // ── RESULTS SCREEN ──
    if (showResults && quizResult) {
        const xpEarned = Math.round((quizResult.score / 100) * (totalQuestions * 15));
        const wrongAnswers = totalQuestions - quizResult.correct_answers;
        const scoreColor =
            quizResult.score >= 80 ? "#10B981"
            : quizResult.score >= 60 ? "#F59E0B"
            : "#F87171";
        const scoreGlow =
            quizResult.score >= 80 ? "rgba(16,185,129,0.25)"
            : quizResult.score >= 60 ? "rgba(245,158,11,0.25)"
            : "rgba(239,68,68,0.25)";
        const scoreLabel =
            quizResult.score >= 90 ? "LEGENDARY!" :
            quizResult.score >= 80 ? "EXCELLENT!" :
            quizResult.score >= 60 ? "WELL DONE!" : "KEEP TRYING!";

        return (
            <div
                className="min-h-screen flex items-center justify-center dot-grid p-4"
                style={{ background: "#080D1A" }}
            >
                <div
                    className="glass animate-slide-up w-full"
                    style={{ maxWidth: 600, borderRadius: "1.25rem" }}
                >
                    {/* Score hero */}
                    <div
                        className="text-center py-10 px-6"
                        style={{
                            background: `radial-gradient(circle at 50% 0%, ${scoreGlow}, transparent 60%)`,
                            borderBottom: "1px solid rgba(255,255,255,0.07)",
                        }}
                    >
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
                            style={{
                                background: `rgba(${quizResult.score >= 80 ? "16,185,129" : quizResult.score >= 60 ? "245,158,11" : "239,68,68"},0.15)`,
                                border: `2px solid ${scoreColor}`,
                                boxShadow: `0 0 30px ${scoreGlow}`,
                            }}
                        >
                            <Trophy className="w-12 h-12" style={{ color: scoreColor }} />
                        </div>

                        <p
                            className="text-sm font-bold tracking-widest uppercase mb-1"
                            style={{ color: "rgba(148,163,184,0.7)" }}
                        >
                            {scoreLabel}
                        </p>
                        <h2
                            className="text-6xl font-black mb-1"
                            style={{
                                color: scoreColor,
                                fontFamily: "Sora, sans-serif",
                                textShadow: `0 0 20px ${scoreGlow}`,
                            }}
                        >
                            {quizResult.score}%
                        </h2>
                        <p style={{ color: "rgba(148,163,184,0.6)", fontSize: "0.9rem" }}>
                            {quiz?.title}
                        </p>

                        {/* XP badge */}
                        <div className="mt-4 inline-flex items-center gap-2 badge-xp text-base px-4 py-1.5">
                            ⚡ +{xpEarned} XP earned
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="p-6">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div
                                className="text-center p-4 rounded-xl"
                                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
                            >
                                <CheckCircle2 className="w-6 h-6 mx-auto mb-2" style={{ color: "#10B981" }} />
                                <p className="text-2xl font-bold" style={{ color: "#10B981", fontFamily: "Sora" }}>
                                    {quizResult.correct_answers}
                                </p>
                                <p style={{ color: "rgba(52,211,153,0.6)", fontSize: "0.75rem" }}>Correct</p>
                            </div>
                            <div
                                className="text-center p-4 rounded-xl"
                                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                            >
                                <XCircle className="w-6 h-6 mx-auto mb-2" style={{ color: "#F87171" }} />
                                <p className="text-2xl font-bold" style={{ color: "#F87171", fontFamily: "Sora" }}>
                                    {wrongAnswers}
                                </p>
                                <p style={{ color: "rgba(248,113,113,0.6)", fontSize: "0.75rem" }}>Wrong</p>
                            </div>
                            <div
                                className="text-center p-4 rounded-xl"
                                style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}
                            >
                                <Flag className="w-6 h-6 mx-auto mb-2" style={{ color: "#F59E0B" }} />
                                <p className="text-2xl font-bold" style={{ color: "#F59E0B", fontFamily: "Sora" }}>
                                    {flaggedQuestions.size}
                                </p>
                                <p style={{ color: "rgba(245,158,11,0.6)", fontSize: "0.75rem" }}>Flagged</p>
                            </div>
                        </div>

                        <div
                            className="flex items-center justify-between p-3 rounded-xl mb-6"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            <span style={{ color: "rgba(148,163,184,0.7)", fontSize: "0.9rem" }}>
                                <Clock className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                                Time spent
                            </span>
                            <span className="font-bold text-white">
                                {Math.round(quizResult.time_spent_minutes)} min
                            </span>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/quizzes')}
                                className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: "#94A3B8",
                                }}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Quizzes
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-violet flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                            >
                                🎮 Play Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── MAIN QUIZ INTERFACE ──
    const isLowTime = timeRemaining < 60;
    const answeredCount = Object.values(answers).filter(a => Array.isArray(a) ? a.length > 0 : a !== '').length;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

    return (
        <div
            className="min-h-screen dot-grid"
            style={{ background: "#080D1A" }}
        >
            {/* Sticky Top Bar */}
            <header
                className="sticky top-0 z-50"
                style={{
                    background: "rgba(8,13,26,0.95)",
                    backdropFilter: "blur(16px)",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}
            >
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left: back + title */}
                        <div className="flex items-center gap-3 min-w-0">
                            <button
                                onClick={() => navigate('/quizzes')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex-shrink-0"
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: "#94A3B8",
                                }}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Back</span>
                            </button>
                            <h1
                                className="gradient-text-violet font-bold text-base truncate"
                                style={{ fontFamily: "Sora, sans-serif" }}
                            >
                                {quiz?.title}
                            </h1>
                        </div>

                        {/* Right: timer + question count */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <span
                                className="text-xs font-semibold"
                                style={{ color: "rgba(148,163,184,0.7)" }}
                            >
                                Q {currentQuestionIndex + 1}/{totalQuestions}
                            </span>

                            {/* Timer pill */}
                            <span
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold tabular-nums"
                                style={
                                    isLowTime
                                        ? {
                                            background: "rgba(239,68,68,0.2)",
                                            border: "1px solid rgba(239,68,68,0.4)",
                                            color: "#FCA5A5",
                                            boxShadow: "0 0 10px rgba(239,68,68,0.3)",
                                            animation: "pulse 1s ease-in-out infinite",
                                        }
                                        : {
                                            background: "rgba(6,182,212,0.12)",
                                            border: "1px solid rgba(6,182,212,0.3)",
                                            color: "#67E8F9",
                                        }
                                }
                            >
                                <Clock className="w-3.5 h-3.5" />
                                {formatTime(timeRemaining)}
                            </span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                        <div
                            className="xp-bar"
                            style={{ height: 4, borderRadius: 9999 }}
                        >
                            <div
                                className="xp-bar-fill"
                                style={{
                                    width: `${progress}%`,
                                    transition: "width 0.3s ease",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">

                    {/* ── MAIN QUESTION CARD ── */}
                    <div className="lg:col-span-3 space-y-5">
                        <div className="card-game animate-slide-up">
                            {/* Question header */}
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="badge-xp text-xs">
                                            Q {currentQuestionIndex + 1}
                                        </span>
                                        {currentQuestion?.points && (
                                            <span
                                                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                                style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#FCD34D" }}
                                            >
                                                {currentQuestion.points} pt{currentQuestion.points > 1 ? "s" : ""}
                                            </span>
                                        )}
                                    </div>
                                    <h2
                                        className="text-xl font-bold text-white leading-snug"
                                        style={{ fontFamily: "Sora, sans-serif" }}
                                    >
                                        {currentQuestion?.question_text}
                                    </h2>
                                </div>

                                {/* Flag button */}
                                <button
                                    onClick={() => toggleFlag(currentQuestion?.id)}
                                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                                    style={
                                        flaggedQuestions.has(currentQuestion?.id)
                                            ? {
                                                background: "rgba(245,158,11,0.2)",
                                                border: "1px solid rgba(245,158,11,0.5)",
                                                color: "#F59E0B",
                                            }
                                            : {
                                                background: "rgba(255,255,255,0.04)",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                                color: "rgba(148,163,184,0.55)",
                                            }
                                    }
                                    title="Flag this question"
                                >
                                    <Flag className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Answer options */}
                            {renderQuestion()}
                        </div>

                        {/* Navigation buttons */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={goToPrevious}
                                disabled={currentQuestionIndex === 0}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                                style={
                                    currentQuestionIndex === 0
                                        ? { opacity: 0.35, cursor: "not-allowed", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#94A3B8" }
                                        : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#94A3B8" }
                                }
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Previous
                            </button>

                            {isLastQuestion ? (
                                <button
                                    onClick={handleSubmitQuiz}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all"
                                    style={{
                                        background: "linear-gradient(135deg,#F59E0B,#D97706)",
                                        color: "#1C1009",
                                        boxShadow: "0 0 20px rgba(245,158,11,0.4)",
                                        opacity: isSubmitting ? 0.7 : 1,
                                    }}
                                >
                                    <Trophy className="w-4 h-4" />
                                    {isSubmitting ? "Submitting..." : "Submit Quiz ⚡"}
                                </button>
                            ) : (
                                <button
                                    onClick={goToNext}
                                    className="btn-violet flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm"
                                >
                                    Next
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── QUESTION NAVIGATOR SIDEBAR ── */}
                    <div className="lg:col-span-1">
                        <div
                            className="glass p-4"
                            style={{ position: "sticky", top: 90 }}
                        >
                            <p
                                className="text-xs font-bold uppercase tracking-widest mb-4"
                                style={{ color: "rgba(148,163,184,0.7)" }}
                            >
                                Question Map
                            </p>

                            {/* Mini dot grid */}
                            <div className="grid grid-cols-5 gap-2 mb-5">
                                {questions.map((question, index) => {
                                    const isCurrent = index === currentQuestionIndex;
                                    const isAnswered = Array.isArray(answers[question.id])
                                        ? answers[question.id]?.length > 0
                                        : answers[question.id] !== '';
                                    const isFlagged = flaggedQuestions.has(question.id);

                                    return (
                                        <button
                                            key={question.id}
                                            onClick={() => goToQuestion(index)}
                                            className="relative w-9 h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all"
                                            style={
                                                isCurrent
                                                    ? {
                                                        background: "linear-gradient(135deg,#06B6D4,#0891B2)",
                                                        color: "white",
                                                        boxShadow: "0 0 10px rgba(6,182,212,0.5)",
                                                    }
                                                    : isFlagged
                                                    ? {
                                                        background: "rgba(245,158,11,0.2)",
                                                        border: "1px solid rgba(245,158,11,0.5)",
                                                        color: "#F59E0B",
                                                    }
                                                    : isAnswered
                                                    ? {
                                                        background: "rgba(16,185,129,0.2)",
                                                        border: "1px solid rgba(16,185,129,0.4)",
                                                        color: "#10B981",
                                                    }
                                                    : {
                                                        background: "rgba(15,22,41,0.6)",
                                                        border: "1px solid rgba(255,255,255,0.07)",
                                                        color: "rgba(148,163,184,0.55)",
                                                    }
                                            }
                                            title={`Question ${index + 1}`}
                                        >
                                            {index + 1}
                                            {isFlagged && (
                                                <Flag
                                                    className="w-2.5 h-2.5 absolute -top-1 -right-1"
                                                    style={{ color: "#F59E0B" }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="space-y-2 text-xs">
                                {[
                                    { color: "linear-gradient(135deg,#06B6D4,#0891B2)", label: "Current", textColor: "#67E8F9" },
                                    { color: "rgba(16,185,129,0.3)", label: "Answered", textColor: "#6EE7B7" },
                                    { color: "rgba(245,158,11,0.3)", label: "Flagged", textColor: "#FCD34D" },
                                    { color: "rgba(255,255,255,0.05)", label: "Unanswered", textColor: "rgba(148,163,184,0.55)" },
                                ].map(({ color, label, textColor }) => (
                                    <div key={label} className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded"
                                            style={{ background: color }}
                                        />
                                        <span style={{ color: textColor }}>{label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Progress summary */}
                            <div
                                className="mt-5 p-3 rounded-xl text-xs text-center"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                            >
                                <span style={{ color: "#10B981", fontWeight: 700 }}>{answeredCount}</span>
                                <span style={{ color: "rgba(148,163,184,0.55)" }}> / {totalQuestions} answered</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizTaking;
