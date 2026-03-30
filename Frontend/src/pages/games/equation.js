import React, { useState, useEffect } from 'react';
import ApiService from '../../api';
import './equation.css';

const EquationGame = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [currentEquation, setCurrentEquation] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [chestState, setChestState] = useState('locked');
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
    } else {
      // Two-step equations: ax + b = c
      const a = Math.floor(Math.random() * 4) + 2;
      const b = Math.floor(Math.random() * 8) + 1;
      const answer_val = Math.floor(Math.random() * 10) + 1;
      const c = a * answer_val + b;
      equation = `${a}x + ${b} = ${c}`;
      answer = answer_val;
      steps = [`Subtract ${b} from both sides: ${a}x = ${c - b}`, `Divide both sides by ${a}`, `x = ${answer}`];
      hint = `To solve ${a}x + ${b} = ${c}, first subtract ${b}, then divide by ${a}`;
    }

    return { equation, answer, steps, hint };
  };

  const startNewQuestion = () => {
    const question = generateEquation(level);
    setCurrentEquation(question);
    setUserAnswer('');
    setFeedback('');
    setShowResult(false);
    setChestState('locked');
  };

  const startGame = () => {
    setGameStarted(true);
    startNewQuestion();
  };

  const checkAnswer = () => {
    const correct = parseInt(userAnswer) === currentEquation.answer;
    setTotalQuestions(prev => prev + 1);
    setShowResult(true);
    
    if (correct) {
      setScore(prev => prev + level * 5);
      setQuestionsCorrect(prev => prev + 1);
      setFeedback('🎉 Correct! Well done!');
      setChestState('unlocking');
      
      // Add treasure
      const treasures = ['💎', '🏆', '⭐', '🥇', '💰', '👑'];
      const newTreasure = treasures[Math.floor(Math.random() * treasures.length)];
      setTreasureRevealed(prev => [...prev, newTreasure]);
      
      setTimeout(() => {
        setChestState('unlocked');
        if (questionsCorrect + 1 >= 3 && level < 10) {
          setLevel(prev => prev + 1);
        }
      }, 1000);
    } else {
      setFeedback(`❌ Not quite right. The answer is ${currentEquation.answer}. Try again!`);
      setChestState('locked');
    }
  };

  const finishGame = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        await ApiService.saveGameScore(userEmail, 'equation', {
          score: score,
          level_reached: level,
          time_played_minutes: Math.floor(totalQuestions * 2),
          completed: totalQuestions >= 10,
          game_data: {
            total_questions: totalQuestions,
            correct_answers: questionsCorrect,
            final_level: level,
            treasures_found: treasureRevealed.length
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

  if (!gameStarted) {
    return (
      <div className="app">
        <div className="loading">
          <div>
            <h1>🔓 Equation Unlock Game</h1>
            <p>Solve equations to unlock treasure chests!</p>
            <div className="text-center">
              <div className="text-4xl mb-4">📐🔢🎯</div>
              <p className="mb-4">
                Solve mathematical equations step by step to unlock amazing treasures!
              </p>
            </div>
            <div style={{background: 'rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: '16px', margin: '20px 0'}}>
              <h3 style={{color: '#ffd700', marginBottom: '16px'}}>How to Play:</h3>
              <ul style={{color: '#ffffff', listStyle: 'none', padding: 0}}>
                <li style={{marginBottom: '8px'}}>🎯 Solve equations to find the value of x</li>
                <li style={{marginBottom: '8px'}}>🔓 Each correct answer unlocks a treasure chest</li>
                <li style={{marginBottom: '8px'}}>📈 Equations get harder as you level up</li>
                <li style={{marginBottom: '8px'}}>💎 Collect treasures and achieve high scores!</li>
              </ul>
            </div>
            <button onClick={startGame} className="unlock-btn">
              🚀 Start Solving!
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="app">
        <div className="header">
          <h1>🎉 Game Complete!</h1>
          <p>You've finished the Equation Unlock game!</p>
        </div>
        
        <div className="result-container">
          <h3 style={{color: '#87ceeb', textAlign: 'center', marginBottom: '20px'}}>Final Results</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#ffd700'}}>{score}</div>
              <div style={{fontSize: '0.9rem', color: '#87ceeb'}}>Total Score</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#ffd700'}}>{level}</div>
              <div style={{fontSize: '0.9rem', color: '#87ceeb'}}>Level Reached</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#ffd700'}}>{questionsCorrect}</div>
              <div style={{fontSize: '0.9rem', color: '#87ceeb'}}>Equations Solved</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#ffd700'}}>{treasureRevealed.length}</div>
              <div style={{fontSize: '0.9rem', color: '#87ceeb'}}>Treasures Found</div>
            </div>
          </div>

          <div style={{background: 'rgba(255, 215, 0, 0.1)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 215, 0, 0.3)', textAlign: 'center'}}>
            <h4 style={{color: '#ffd700', marginBottom: '12px'}}>Your Treasure Collection:</h4>
            <div className="treasures">
              {treasureRevealed.map((treasure, index) => (
                <span key={index} className="treasure-item">{treasure}</span>
              ))}
            </div>
          </div>

          <button onClick={() => window.location.reload()} className="next-btn">
            Play Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentEquation) {
    return <div className="app"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="app">
      {/* Header with stats */}
      <div className="header">
        <h1>🔓 Equation Unlock Game</h1>
        <div className="game-stats">
          <span>Level: {level}</span>
          <span>Score: {score}</span>
          <span>Correct: {questionsCorrect}/{totalQuestions}</span>
        </div>
      </div>

      {/* Equation Display */}
      <div className="equation-container">
        <div className="equation-title">Solve for x</div>
        <div className="difficulty-badge">Level {level}</div>
        <div className="equation-display">
          <div className="equation">{currentEquation.equation}</div>
          <div className="find-x">Find the value of x</div>
        </div>
        <div className="hint-section">
          <div className="hint">{currentEquation.hint}</div>
        </div>
      </div>

      {/* Treasure Chest */}
      <div className="treasure-section">
        <div className={`treasure-chest ${chestState}`}>
          <div className="chest-emoji">
            {chestState === 'locked' && '🔒'}
            {chestState === 'unlocking' && '🔓'}
            {chestState === 'unlocked' && '📦'}
          </div>
          <p>
            {chestState === 'locked' && 'Solve the equation to unlock the treasure!'}
            {chestState === 'unlocking' && 'Opening treasure chest...'}
            {chestState === 'unlocked' && 'Treasure unlocked! Well done!'}
          </p>
        </div>

        {treasureRevealed.length > 0 && (
          <div className="treasures">
            {treasureRevealed.map((treasure, index) => (
              <span key={index} className="treasure-item" style={{animationDelay: `${index * 0.2}s`}}>
                {treasure}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Answer Input */}
      <div className="input-section">
        <div className="answer-input">
          <label>Your Answer:</label>
          <div className="input-group">
            <span className="x-label">x =</span>
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="?"
              className="answer-field"
              disabled={showResult}
            />
          </div>
          <div className="input-feedback">
            {userAnswer && !showResult ? "Ready to check your answer!" : ""}
          </div>
        </div>

        {!showResult && (
          <button 
            onClick={checkAnswer} 
            disabled={!userAnswer.trim()}
            className="unlock-btn"
          >
            Unlock Treasure
          </button>
        )}
      </div>

      {/* Results */}
      {showResult && (
        <div className="result-container">
          <div className={`feedback ${feedback.includes('Correct') ? 'correct' : 'incorrect'}`}>
            {feedback}
          </div>
          
          {questionsCorrect > totalQuestions - 1 && (
            <div className="solution-steps">
              <h4>Solution Steps:</h4>
              <ol className="steps-list">
                {currentEquation.steps.map((step, index) => (
                  <li key={index} className="step">{step}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="algebra-tips">
            <h4>Algebra Tips:</h4>
            <ul>
              <li>Whatever you do to one side, do to the other</li>
              <li>Work backwards from the answer to check your work</li>
              <li>Use inverse operations to isolate x</li>
            </ul>
          </div>

          <button onClick={startNewQuestion} className="next-btn">
            Next Equation 🔢
          </button>
        </div>
      )}
    </div>
  );
};

export default EquationGame;