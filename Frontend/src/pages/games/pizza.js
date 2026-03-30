import React, { useState, useEffect } from 'react';
import './CSS/Pizza.css';

const App = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userInputs, setUserInputs] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const generateQuestion = (level) => {
    const numInputs = Math.floor(Math.random() * 3) + 2; // 2-4 inputs
    const denominators = level <= 2 ? [2, 3, 4] : level <= 4 ? [2, 3, 4, 5, 6] : [2, 3, 4, 5, 6, 8, 10, 12];
    
    // Generate target fraction based on level
    let targetNumerator, targetDenominator;
    
    if (level <= 2) {
      // Easy: simple fractions like 1/2, 3/4, 1
      const commonTargets = [[1, 2], [3, 4], [1, 1], [2, 3], [5, 6]];
      [targetNumerator, targetDenominator] = commonTargets[Math.floor(Math.random() * commonTargets.length)];
    } else if (level <= 4) {
      // Medium: more complex fractions
      targetDenominator = denominators[Math.floor(Math.random() * denominators.length)];
      targetNumerator = Math.floor(Math.random() * (targetDenominator * 2)) + 1;
    } else {
      // Hard: complex fractions including improper fractions
      targetDenominator = denominators[Math.floor(Math.random() * denominators.length)];
      targetNumerator = Math.floor(Math.random() * (targetDenominator * 3)) + 1;
    }
    
    return {
      targetNumerator,
      targetDenominator,
      numInputs,
      targetValue: targetNumerator / targetDenominator
    };
  };

  const startNewQuestion = () => {
    const question = generateQuestion(level);
    setCurrentQuestion(question);
    setUserInputs(Array(question.numInputs).fill({ numerator: '', denominator: '' }));
    setFeedback('');
    setShowResult(false);
  };


  const updateInput = (index, field, value) => {
    const newInputs = [...userInputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    setUserInputs(newInputs);
  };

  const calculateUserTotal = () => {
    return userInputs.reduce((sum, input) => {
      const num = parseInt(input.numerator) || 0;
      const den = parseInt(input.denominator) || 1;
      return sum + (num / den);
    }, 0);
  };

  const submitAnswer = () => {
    const userTotal = calculateUserTotal();
    const isCorrect = Math.abs(userTotal - currentQuestion.targetValue) < 0.001;
    
    setTotalQuestions(prev => prev + 1);
    setShowResult(true);
    
    if (isCorrect) {
      setScore(prev => prev + level * 10);
      setQuestionsCorrect(prev => prev + 1);
      setFeedback('🎉 Correct! Great job!');
      
      // Level up every 3 correct answers
      if ((questionsCorrect + 1) % 3 === 0 && level < 10) {
        setLevel(prev => prev + 1);
        setFeedback(`🎉 Correct! Level up to ${level + 1}!`);
      }
    } else {
      setFeedback(`❌ Not quite! The correct answer is ${currentQuestion.targetNumerator}/${currentQuestion.targetDenominator}`);
    }
  };

  const PizzaSlice = ({ startAngle, endAngle, color, opacity = 1 }) => {
    const centerX = 150;
    const centerY = 150;
    const radius = 120;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    return (
      <path
        d={pathData}
        fill={color}
        stroke="#8B4513"
        strokeWidth="2"
        opacity={opacity}
      />
    );
  };

  const renderTargetPizza = () => {
    if (!currentQuestion) return null;
    
    const targetAngle = 360 * currentQuestion.targetValue;
    const colors = ['#FF6B6B', '#4ECDC4'];
    
    return (
      <>
        <PizzaSlice
          startAngle={0}
          endAngle={Math.min(targetAngle, 360)}
          color={colors[0]}
        />
        {targetAngle < 360 && (
          <PizzaSlice
            startAngle={targetAngle}
            endAngle={360}
            color="#DDD"
            opacity={0.3}
          />
        )}
        {targetAngle > 360 && (
          <PizzaSlice
            startAngle={0}
            endAngle={targetAngle - 360}
            color={colors[1]}
          />
        )}
      </>
    );
  };

  useEffect(() => {
    startNewQuestion();
  }, [level]);

  if (!currentQuestion) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <div className="header">
        <h1>🍕 Pizza Fraction Quiz</h1>
        <div className="game-stats">
          <span className="level">Level {level}</span>
          <span className="score">Score: {score}</span>
          <span className="progress">{questionsCorrect}/{totalQuestions} Correct</span>
        </div>
      </div>

      <div className="question-container">
        <h2 className="question">
          Make fractions that add up to: <span className="target-fraction">
            {currentQuestion.targetNumerator}/{currentQuestion.targetDenominator}
          </span>
        </h2>
      </div>

      <div className="pizza-container">
        <div className="pizza-label">Target Pizza:</div>
        <svg width="280" height="280" viewBox="0 0 300 300">
          <circle
            cx="150"
            cy="150"
            r="120"
            fill="#F4A460"
            stroke="#8B4513"
            strokeWidth="3"
          />
          {renderTargetPizza()}
        </svg>
      </div>

      <div className="input-container">
        <div className="input-rows">
          {Array.from({ length: Math.ceil(userInputs.length / 2) }, (_, rowIndex) => {
            const startIndex = rowIndex * 2;
            const endIndex = Math.min(startIndex + 2, userInputs.length);
            const rowInputs = userInputs.slice(startIndex, endIndex);
            
            return (
              <div key={rowIndex}>
                <div className="input-row">
                  {rowInputs.map((input, colIndex) => {
                    const globalIndex = startIndex + colIndex;
                    return (
                      <div key={globalIndex} className="fraction-input">
                        <input
                          type="number"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="0"
                          value={input.numerator}
                          onChange={(e) => updateInput(globalIndex, 'numerator', e.target.value)}
                          className="numerator"
                          min="0"
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
                        />
                        <div className="fraction-line">─</div>
                        <input
                          type="number"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="1"
                          value={input.denominator}
                          onChange={(e) => updateInput(globalIndex, 'denominator', e.target.value)}
                          className="denominator"
                          min="1"
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
                        />
                        {colIndex === 0 && rowInputs.length === 2 && <span className="plus">+</span>}
                      </div>
                    );
                  })}
                </div>
                {rowIndex < Math.ceil(userInputs.length / 2) - 1 && (
                  <div className="row-plus">+</div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="user-total">
          Your total: {calculateUserTotal().toFixed(3)}
        </div>
      </div>

      <div className="controls">
        <button 
          className="submit-btn" 
          onClick={submitAnswer}
          disabled={showResult}
        >
          Submit Answer
        </button>
      </div>

      {showResult && (
        <div className="result-container">
          <div className={`feedback ${feedback.includes('Correct') ? 'correct' : 'incorrect'}`}>
            {feedback}
          </div>
          <button className="next-btn" onClick={startNewQuestion}>
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

export default App;