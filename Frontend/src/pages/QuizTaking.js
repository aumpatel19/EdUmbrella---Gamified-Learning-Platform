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

        switch (currentQuestion.question_type) {
            case 'multiple_choice':
                return (
                    <RadioGroup
                        value={currentAnswer}
                        onValueChange={(value) => handleMultipleChoice(questionId, value)}
                        className="space-y-3"
                    >
                        {currentQuestion.options?.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`option-${index}`} />
                                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                );

            case 'true_false':
                return (
                    <RadioGroup
                        value={currentAnswer}
                        onValueChange={(value) => handleTrueFalse(questionId, value)}
                        className="space-y-3"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="true" />
                            <Label htmlFor="true" className="cursor-pointer">True</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="false" />
                            <Label htmlFor="false" className="cursor-pointer">False</Label>
                        </div>
                    </RadioGroup>
                );

            case 'fill_blank':
                return (
                    <div className="space-y-3">
                        <Input
                            value={currentAnswer || ''}
                            onChange={(e) => handleFillBlank(questionId, e.target.value)}
                            placeholder="Enter your answer here..."
                            className="w-full"
                        />
                    </div>
                );

            case 'matching':
                return (
                    <div className="space-y-3">
                        {currentQuestion.options?.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`match-${index}`}
                                    checked={currentAnswer?.includes(option) || false}
                                    onCheckedChange={(checked) => handleCheckboxChange(questionId, option, checked)}
                                />
                                <Label htmlFor={`match-${index}`} className="cursor-pointer">
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </div>
                );

            default:
                return <div>Unsupported question type</div>;
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading quiz...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                        <Button
                            onClick={() => navigate('/quizzes')}
                            className="w-full mt-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Quizzes
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Results screen
    if (showResults && quizResult) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                            <Trophy className="w-8 h-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
                        <p className="text-muted-foreground">{quiz.title}</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-3xl font-bold text-blue-600">{quizResult.score}%</div>
                                <div className="text-sm text-muted-foreground">Final Score</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-3xl font-bold text-green-600">{quizResult.correct_answers}/{totalQuestions}</div>
                                <div className="text-sm text-muted-foreground">Correct Answers</div>
                            </div>
                        </div>

                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-lg font-semibold">Time Spent</div>
                            <div className="text-sm text-muted-foreground">{Math.round(quizResult.time_spent_minutes)} minutes</div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={() => navigate('/quizzes')}
                                className="flex-1"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Quizzes
                            </Button>
                            <Button
                                onClick={() => navigate('/student-dashboard')}
                                variant="outline"
                                className="flex-1"
                            >
                                Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Quiz taking interface
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <div className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={() => navigate('/quizzes')}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Quizzes
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold">{quiz?.title}</h1>
                                <p className="text-sm text-muted-foreground">
                                    Question {currentQuestionIndex + 1} of {totalQuestions}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4" />
                                <span className={timeRemaining < 300 ? 'text-red-600 font-semibold' : ''}>
                                    {formatTime(timeRemaining)}
                                </span>
                            </div>
                            <Badge variant="outline">
                                {quiz?.difficulty}
                            </Badge>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                        <Progress value={progress} className="h-2" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main content */}
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg mb-2">
                                            {currentQuestion?.question_text}
                                        </CardTitle>
                                        {currentQuestion?.explanation && (
                                            <p className="text-sm text-muted-foreground">
                                                {currentQuestion.explanation}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => toggleFlag(currentQuestion?.id)}
                                        className={flaggedQuestions.has(currentQuestion?.id) ? 'bg-yellow-100' : ''}
                                    >
                                        <Flag className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {renderQuestion()}
                            </CardContent>
                        </Card>

                        {/* Navigation */}
                        <div className="flex justify-between mt-6">
                            <Button
                                variant="outline"
                                onClick={goToPrevious}
                                disabled={currentQuestionIndex === 0}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>

                            <div className="flex gap-2">
                                {currentQuestionIndex === totalQuestions - 1 ? (
                                    <Button
                                        onClick={handleSubmitQuiz}
                                        disabled={isSubmitting}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                                    </Button>
                                ) : (
                                    <Button onClick={goToNext}>
                                        Next
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Question Navigator</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-5 gap-2">
                                    {questions.map((question, index) => (
                                        <Button
                                            key={question.id}
                                            variant={index === currentQuestionIndex ? "default" :
                                                answers[question.id] ? "secondary" : "outline"}
                                            size="sm"
                                            onClick={() => goToQuestion(index)}
                                            className={`relative ${flaggedQuestions.has(question.id) ? 'ring-2 ring-yellow-400' : ''
                                                }`}
                                        >
                                            {index + 1}
                                            {flaggedQuestions.has(question.id) && (
                                                <Flag className="w-3 h-3 absolute -top-1 -right-1 text-yellow-600" />
                                            )}
                                        </Button>
                                    ))}
                                </div>

                                <div className="mt-4 space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-primary rounded"></div>
                                        <span>Current</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-secondary rounded"></div>
                                        <span>Answered</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                                        <span>Flagged</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizTaking;
