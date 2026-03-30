import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/simplebutton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { ArrowLeft, Trophy, Target, Lock, Unlock } from 'lucide-react';
import ApiService from '../../api';

const EquationGame = () => {
  const navigate = useNavigate();
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [currentEquation, setCurrentEquation] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [chestState, setChestState] = useState('locked'); // 'locked', 'unlocking', 'unlocked'
  const [treasureRevealed, setTreasureRevealed] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Equation generation based on difficulty level
  const generateEquation = (level) => {
    let equation, answer, steps, hint;

    if (level <= 2) {
      // Basic linear equations: x + a = b
      const a = Math.floor(Math.random() * 10) + 1;
      const answer_val = Math.floor(Math.random() * 20) + 1;
      const b = answer_val + a;
      equation = `x + ${a} = ${b}`;
      answer = answer_val;
      steps = [`Subtract ${a} from both sides`, `x = ${b} - ${a}`, `x = ${answer}`];
      hint = `To solve x + ${a} = ${b}, subtract ${a} from both sides`;
    } else if (level <= 4) {
      // Simple multiplication: ax = b
      const a = Math.floor(Math.random() * 5) + 2;
      const answer_val = Math.floor(Math.random() * 10) + 1;
      const b = a * answer_val;
      equation = `${a}x = ${b}`;
      answer = answer_val;
      steps = [`Divide both sides by ${a}`, `x = ${b} ÷ ${a}`, `x = ${answer}`];
      hint = `To solve ${a}x = ${b}, divide both sides by ${a}`;
    } else if (level <= 6) {
      // Two-step equations: ax + b = c
      const a = Math.floor(Math.random() * 4) + 2;
      const b = Math.floor(Math.random() * 8) + 1;
      const answer_val = Math.floor(Math.random() * 8) + 1;
      const c = (a * answer_val) + b;
      equation = `${a}x + ${b} = ${c}`;
      answer = answer_val;
      steps = [
        `Subtract ${b} from both sides`,
        `${a}x = ${c - b}`,
        `Divide both sides by ${a}`,
        `x = ${answer}`
      ];
      hint = `First subtract ${b}, then divide by ${a}`;
    } else if (level <= 8) {
      // Simple quadratic: x² = a
      const answer_val = Math.floor(Math.random() * 6) + 2;
      const a = answer_val * answer_val;
      equation = `x² = ${a}`;
      answer = answer_val;
      steps = [
        `Take square root of both sides`,
        `x = ±√${a}`,
        `x = ±${answer_val}`,
        `We take the positive solution: x = ${answer}`
      ];
      hint = `Take the square root of both sides (we'll use the positive root)`;
    } else {
      // Complex two-step with fractions
      const answer_val = Math.floor(Math.random() * 6) + 1;
      const a = Math.floor(Math.random() * 3) + 2;
      const b = Math.floor(Math.random() * 5) + 1;
      const c = Math.floor((a * answer_val + b) / 2);
      equation = `(${a}x + ${b})/2 = ${c}`;
      answer = answer_val;
      steps = [
        `Multiply both sides by 2: ${a}x + ${b} = ${c * 2}`,
        `Subtract ${b}: ${a}x = ${c * 2 - b}`,
        `Divide by ${a}: x = ${answer}`
      ];
      hint = `First multiply by 2 to eliminate the fraction`;
    }

    const difficultyLevels = {
      1: 'Beginner', 2: 'Beginner',
      3: 'Easy', 4: 'Easy',
      5: 'Medium', 6: 'Medium',
      7: 'Hard', 8: 'Hard',
      9: 'Expert', 10: 'Expert'
    };

    return {
      equation,
      answer,
      steps,
      hint,
      difficulty: difficultyLevels[level] || 'Expert'
    };
  };

  const treasureItems = [
    '💎', '👑', '🏆', '⭐', '🎖️', '🔮', '💰', '🎁', '🏅', '💍'
  ];

  const startNewEquation = () => {
    const equation = generateEquation(level);
    setCurrentEquation(equation);
    setUserAnswer('');
    setFeedback('');
    setShowResult(false);
    setChestState('locked');
    setTreasureRevealed([]);
  };

  const checkAnswer = () => {
    const userNum = parseFloat(userAnswer);
    const isCorrect = Math.abs(userNum - currentEquation.answer) < 0.001;
    
    setTotalQuestions(prev => prev + 1);
    setShowResult(true);
    
    if (isCorrect) {
      setScore(prev => prev + level * 20);
      setQuestionsCorrect(prev => prev + 1);
      setFeedback('🎉 Correct! The treasure chest is unlocking...');
      setChestState('unlocking');
      
      // Animate chest opening and reveal treasures
      setTimeout(() => {
        setChestState('unlocked');
        const numTreasures = Math.min(level + 1, 5);
        const selectedTreasures = treasureItems
          .sort(() => Math.random() - 0.5)
          .slice(0, numTreasures);
        setTreasureRevealed(selectedTreasures);
      }, 1000);
      
      // Level up every 3 correct answers
      if ((questionsCorrect + 1) % 3 === 0 && level < 10) {
        setLevel(prev => prev + 1);
        setTimeout(() => {
          setFeedback(`🎉 Amazing! You've unlocked Level ${level + 1}! More complex equations await!`);
        }, 1500);
      }
    } else {
      setFeedback(`❌ Not quite right. The answer is x = ${currentEquation.answer}. Try the next chest!`);
      setChestState('locked');
    }
  };

  const getInputFeedback = () => {
    if (!userAnswer) return '';
    const userNum = parseFloat(userAnswer);
    if (isNaN(userNum)) return '';
    
    const correct = currentEquation.answer;
    const diff = Math.abs(userNum - correct);
    
    if (diff < 0.001) return '✅ Perfect!';
    if (diff <= 2) return '🔥 Very close!';
    if (diff <= 5) return '👍 Getting warmer!';
    return '🤔 Keep trying!';
  };

  const handleBack = () => {
    navigate('/quizzes');
  };

  const startGame = () => {
    setGameStarted(true);
    startNewEquation();
  };

  const finishGame = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        await ApiService.saveGameScore(userEmail, 'equation-unlock', {
          score: score,
          level_reached: level,
          time_played_minutes: Math.floor(totalQuestions * 2),
          completed: totalQuestions >= 10,
          game_data: {
            total_questions: totalQuestions,
            correct_answers: questionsCorrect,
            final_level: level
          }
        });
      }
    } catch (error) {
      console.error('Failed to save game score:', error);
    }
    
    setGameCompleted(true);
  };

  useEffect(() => {
    if (totalQuestions >= 10 && !gameCompleted) {
      finishGame();
    }
  }, [totalQuestions, gameCompleted]);

  useEffect(() => {
    if (gameStarted && level > 1) {
      startNewEquation();
    }
  }, [level]);

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-50 to-blue-50">
        <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Quizzes
              </Button>
              <h1 className="text-xl font-bold">Equation Master Challenge</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Trophy className="w-3 h-3" />
                Math Game
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-2">
                <Target className="w-3 h-3" />
                Class 8
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-3xl">
                🔑 Equation Unlock
              </CardTitle>
              <CardDescription className="text-lg">
                Solve algebraic equations to unlock treasure chests!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">🔒📦💎</div>
                <p className="text-lg mb-6">
                  Each equation you solve correctly will unlock a treasure chest filled with rewards!
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 className="font-bold text-purple-800 mb-3">How to Play:</h3>
                <ul className="space-y-2 text-purple-700">
                  <li className="flex items-start gap-2">
                    <span>🎯</span>
                    <span>Solve algebraic equations by finding the value of x</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>🔑</span>
                    <span>Correct answers unlock treasure chests with rewards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>📈</span>
                    <span>Equations get more complex as you level up</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>💡</span>
                    <span>Use hints and step-by-step solutions to learn</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
                  🚀 Start Solving Equations!
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-50 to-blue-50">
        <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Quizzes
              </Button>
              <h1 className="text-xl font-bold">Game Complete!</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">🏆 Master Equation Solver!</CardTitle>
              <CardDescription className="text-lg">
                You've completed the Equation Master Challenge!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="bg-purple-100 p-6 rounded-lg">
                <h3 className="font-bold text-2xl mb-4">Final Results</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl font-bold text-purple-600">{score}</div>
                    <div className="text-sm text-purple-700">Total Score</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">{level}</div>
                    <div className="text-sm text-purple-700">Level Reached</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">{questionsCorrect}</div>
                    <div className="text-sm text-purple-700">Equations Solved</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">{Math.round((questionsCorrect / totalQuestions) * 100)}%</div>
                    <div className="text-sm text-purple-700">Success Rate</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button onClick={handleBack} className="bg-purple-600 hover:bg-purple-700">
                  Back to Quiz Menu
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentEquation) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold">🔑 Equation Unlock</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">Level {level}</Badge>
            <Badge variant="secondary">Score: {score}</Badge>
            <Badge variant="secondary">{questionsCorrect}/{totalQuestions} Unlocked</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Equation Challenge */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              Solve the equation to unlock the treasure chest!
            </CardTitle>
            <div className="text-center">
              <Badge variant="outline" className="mb-2">
                {currentEquation.difficulty} Level
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="bg-white p-6 rounded-lg border-2 border-purple-200">
                <div className="text-3xl font-mono font-bold text-purple-800 mb-2">
                  {currentEquation.equation}
                </div>
                <div className="text-lg text-purple-600">Find: x = ?</div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-800">
                  <strong>💡 Hint:</strong> {currentEquation.hint}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treasure Chest */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className={`text-8xl transition-all duration-1000 ${
                chestState === 'unlocking' ? 'animate-bounce' : ''
              }`}>
                {chestState === 'locked' ? '🔒📦' : 
                 chestState === 'unlocking' ? '🔓📦' : '📖✨'}
              </div>
              
              {chestState === 'unlocked' && treasureRevealed.length > 0 && (
                <div className="flex justify-center gap-2 flex-wrap">
                  {treasureRevealed.map((treasure, index) => (
                    <span 
                      key={index} 
                      className="text-4xl animate-bounce"
                      style={{animationDelay: `${index * 0.2}s`}}
                    >
                      {treasure}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Answer Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Answer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 justify-center">
              <span className="text-2xl font-bold">x = </span>
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer"
                className="text-center text-xl font-semibold max-w-xs"
                step="any"
                disabled={showResult}
              />
            </div>
            
            {userAnswer && (
              <div className="text-center">
                <span className="text-lg">{getInputFeedback()}</span>
              </div>
            )}

            <div className="text-center">
              <Button 
                onClick={checkAnswer}
                disabled={showResult || !userAnswer}
                className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
              >
                {chestState === 'locked' ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                Unlock Chest
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {showResult && (
          <Card>
            <CardContent className="pt-6">
              <div className={`text-center text-xl font-semibold mb-4 ${
                feedback.includes('Correct') || feedback.includes('Amazing') ? 'text-green-600' : 'text-red-600'
              }`}>
                {feedback}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-3">Solution Steps:</h4>
                <ol className="list-decimal list-inside space-y-1">
                  {currentEquation.steps.map((step, index) => (
                    <li key={index} className="text-sm">{step}</li>
                  ))}
                </ol>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <p className="font-semibold mb-2">🎓 Algebra Tips:</p>
                <ul className="text-sm space-y-1">
                  <li>• Always perform the same operation on both sides</li>
                  <li>• Work backwards from the order of operations</li>
                  <li>• Check your answer by substituting back into the original equation</li>
                </ul>
              </div>

              <div className="text-center">
                <Button onClick={startNewEquation} className="bg-purple-600 hover:bg-purple-700">
                  🗝️ Next Treasure Chest
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EquationGame;