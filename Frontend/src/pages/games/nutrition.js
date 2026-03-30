import React, { useState, useEffect } from 'react';
import './CSS/Nutrition.css';

const App = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userMatches, setUserMatches] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Comprehensive food and nutrient data
  const foodData = {
    // Level 1: Basic foods
    basic: [
      { name: 'Milk', emoji: '🥛', nutrients: ['Protein', 'Calcium'], category: 'Dairy' },
      { name: 'Rice', emoji: '🍚', nutrients: ['Carbohydrates'], category: 'Grains' },
      { name: 'Dal', emoji: '🫘', nutrients: ['Protein', 'Fiber'], category: 'Legumes' },
      { name: 'Banana', emoji: '🍌', nutrients: ['Carbohydrates', 'Potassium'], category: 'Fruits' },
      { name: 'Spinach', emoji: '🥬', nutrients: ['Iron', 'Vitamins'], category: 'Vegetables' },
      { name: 'Egg', emoji: '🥚', nutrients: ['Protein', 'Vitamins'], category: 'Protein' }
    ],
    // Level 2-3: More foods
    intermediate: [
      { name: 'Chicken', emoji: '🍗', nutrients: ['Protein', 'Iron'], category: 'Protein' },
      { name: 'Bread', emoji: '🍞', nutrients: ['Carbohydrates', 'Fiber'], category: 'Grains' },
      { name: 'Apple', emoji: '🍎', nutrients: ['Fiber', 'Vitamins'], category: 'Fruits' },
      { name: 'Cheese', emoji: '🧀', nutrients: ['Protein', 'Calcium'], category: 'Dairy' },
      { name: 'Carrot', emoji: '🥕', nutrients: ['Vitamins', 'Fiber'], category: 'Vegetables' },
      { name: 'Fish', emoji: '🐟', nutrients: ['Protein', 'Omega-3'], category: 'Protein' },
      { name: 'Yogurt', emoji: '🍨', nutrients: ['Protein', 'Calcium'], category: 'Dairy' },
      { name: 'Potato', emoji: '🥔', nutrients: ['Carbohydrates', 'Potassium'], category: 'Vegetables' }
    ],
    // Level 4+: Advanced foods
    advanced: [
      { name: 'Nuts', emoji: '🥜', nutrients: ['Healthy Fats', 'Protein'], category: 'Nuts & Seeds' },
      { name: 'Broccoli', emoji: '🥦', nutrients: ['Vitamins', 'Fiber'], category: 'Vegetables' },
      { name: 'Salmon', emoji: '🍣', nutrients: ['Protein', 'Omega-3'], category: 'Protein' },
      { name: 'Quinoa', emoji: '🌾', nutrients: ['Protein', 'Fiber'], category: 'Grains' },
      { name: 'Avocado', emoji: '🥑', nutrients: ['Healthy Fats', 'Fiber'], category: 'Fruits' },
      { name: 'Sweet Potato', emoji: '🍠', nutrients: ['Carbohydrates', 'Vitamins'], category: 'Vegetables' },
      { name: 'Almonds', emoji: '🌰', nutrients: ['Healthy Fats', 'Calcium'], category: 'Nuts & Seeds' },
      { name: 'Blueberries', emoji: '🫐', nutrients: ['Antioxidants', 'Vitamins'], category: 'Fruits' }
    ]
  };

  const allNutrients = [
    'Protein', 'Carbohydrates', 'Vitamins', 'Calcium', 'Iron', 
    'Fiber', 'Potassium', 'Healthy Fats', 'Omega-3', 'Antioxidants'
  ];

  const generateQuestion = (level) => {
    let foodPool = [];
    
    if (level <= 2) {
      foodPool = foodData.basic;
    } else if (level <= 4) {
      foodPool = [...foodData.basic, ...foodData.intermediate];
    } else {
      foodPool = [...foodData.basic, ...foodData.intermediate, ...foodData.advanced];
    }

    // Select 3-5 foods randomly based on level
    const numFoods = Math.min(level + 2, 5);
    const selectedFoods = foodPool
      .sort(() => Math.random() - 0.5)
      .slice(0, numFoods);

    // Get unique nutrients from selected foods
    const availableNutrients = [...new Set(selectedFoods.flatMap(food => food.nutrients))];
    
    return {
      foods: selectedFoods,
      nutrients: availableNutrients,
      correctMatches: selectedFoods.map(food => ({
        food: food.name,
        nutrients: food.nutrients
      }))
    };
  };

  const startNewQuestion = () => {
    const question = generateQuestion(level);
    setCurrentQuestion(question);
    setUserMatches([]);
    setFeedback('');
    setShowResult(false);
  };

  const handleFoodSelect = (food, nutrient) => {
    const existingMatch = userMatches.find(match => match.food === food.name);
    
    if (existingMatch) {
      // Toggle nutrient for this food
      const updatedMatches = userMatches.map(match => {
        if (match.food === food.name) {
          const nutrients = match.nutrients.includes(nutrient)
            ? match.nutrients.filter(n => n !== nutrient)
            : [...match.nutrients, nutrient];
          return { ...match, nutrients };
        }
        return match;
      });
      setUserMatches(updatedMatches);
    } else {
      // Add new match
      setUserMatches([...userMatches, { food: food.name, nutrients: [nutrient] }]);
    }
  };

  const checkAnswers = () => {
    const correctMatches = currentQuestion.correctMatches;
    let correctCount = 0;
    let totalExpected = 0;

    correctMatches.forEach(correct => {
      const userMatch = userMatches.find(match => match.food === correct.food);
      totalExpected += correct.nutrients.length;
      
      if (userMatch) {
        correct.nutrients.forEach(nutrient => {
          if (userMatch.nutrients.includes(nutrient)) {
            correctCount++;
          }
        });
      }
    });

    const accuracy = correctCount / totalExpected;
    return accuracy >= 0.7; // 70% accuracy required
  };

  const submitAnswer = () => {
    const isCorrect = checkAnswers();
    
    setTotalQuestions(prev => prev + 1);
    setShowResult(true);
    
    if (isCorrect) {
      setScore(prev => prev + level * 10);
      setQuestionsCorrect(prev => prev + 1);
      setFeedback('🎉 Great job! You matched the foods correctly!');
      
      // Level up every 3 correct answers
      if ((questionsCorrect + 1) % 3 === 0 && level < 10) {
        setLevel(prev => prev + 1);
        setFeedback(`🎉 Excellent! Level up to ${level + 1}!`);
      }
    } else {
      setFeedback('❌ Not quite right. Study the correct matches and try again!');
    }
  };

  const isNutrientSelected = (food, nutrient) => {
    const match = userMatches.find(match => match.food === food.name);
    return match && match.nutrients.includes(nutrient);
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
        <h1>🥦 Nutrition Match Game</h1>
        <div className="game-stats">
          <span className="level">Level {level}</span>
          <span className="score">Score: {score}</span>
          <span className="progress">{questionsCorrect}/{totalQuestions} Correct</span>
        </div>
      </div>

      <div className="question-container">
        <h2 className="question">
          Match each food with its nutrients:
        </h2>
      </div>

      

      <div className="matching-section">
        <h3>Your Matches</h3>
        <div className="matching-grid">
          {currentQuestion.foods.map((food, foodIndex) => (
            <div key={foodIndex} className="match-row">
              <div className="match-food">
                <span className="food-emoji">{food.emoji}</span>
                <span className="food-name">{food.name}</span>
              </div>
              <div className="match-nutrients">
                {currentQuestion.nutrients.map((nutrient, nutrientIndex) => (
                  <button
                    key={nutrientIndex}
                    className={`nutrient-btn ${isNutrientSelected(food, nutrient) ? 'selected' : ''}`}
                    onClick={() => handleFoodSelect(food, nutrient)}
                  >
                    {nutrient}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="controls">
        <button 
          className="submit-btn" 
          onClick={submitAnswer}
          disabled={showResult || userMatches.length === 0}
        >
          Submit Answer
        </button>
      </div>

      {showResult && (
        <div className="result-container">
          <div className={`feedback ${feedback.includes('Great') || feedback.includes('Excellent') ? 'correct' : 'incorrect'}`}>
            {feedback}
          </div>
          
          <div className="correct-answers">
            <h4>Correct Matches:</h4>
            {currentQuestion.correctMatches.map((match, index) => (
              <div key={index} className="correct-match">
                <span className="food-name">{match.food}</span>
                <span className="arrow">→</span>
                <span className="nutrients">{match.nutrients.join(', ')}</span>
              </div>
            ))}
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