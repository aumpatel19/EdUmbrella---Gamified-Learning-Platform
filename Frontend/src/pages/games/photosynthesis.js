import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/simplebutton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import ApiService from '../../api';

const PhotosynthesisGame = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [plantRequirements, setPlantRequirements] = useState({ water: 0, sunlight: 0, co2: 0 });
  const [feedback, setFeedback] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [plantGrowthStage, setPlantGrowthStage] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Plant growth scenarios and requirements
  const plantScenarios = {
    basic: [
      {
        name: 'Small Herb Plant',
        emoji: '🌿',
        description: 'A young herb seedling needs basic requirements',
        hint: 'Herbs like moderate sunlight and regular watering',
        requirements: { water: 2, sunlight: 3, co2: 1 },
        maxValues: { water: 5, sunlight: 5, co2: 3 },
        growthStages: ['🌱', '🌿', '🍃']
      },
      {
        name: 'Flower Seedling',
        emoji: '🌼',
        description: 'A delicate flower starting to grow',
        hint: 'Flowers love bright sunlight but need less water',
        requirements: { water: 1, sunlight: 4, co2: 1 },
        maxValues: { water: 3, sunlight: 6, co2: 3 },
        growthStages: ['🌱', '🌼', '🌻']
      },
      {
        name: 'Grass Patch',
        emoji: '🌾',
        description: 'Simple grass that grows easily',
        hint: 'Grass needs steady water and some CO₂ for growth',
        requirements: { water: 3, sunlight: 2, co2: 2 },
        maxValues: { water: 5, sunlight: 4, co2: 4 },
        growthStages: ['🌱', '🌾', '🌿']
      }
    ],
    intermediate: [
      {
        name: 'Tomato Plant',
        emoji: '🍅',
        description: 'A vegetable plant that needs balanced care',
        hint: 'Tomatoes need lots of water and good sunlight to fruit',
        requirements: { water: 4, sunlight: 5, co2: 3 },
        maxValues: { water: 6, sunlight: 7, co2: 5 },
        growthStages: ['🌱', '🍃', '🍅']
      },
      {
        name: 'Rose Bush',
        emoji: '🌹',
        description: 'Beautiful roses need lots of sunlight',
        hint: 'Roses are sun-lovers but dont need too much water',
        requirements: { water: 3, sunlight: 6, co2: 2 },
        maxValues: { water: 5, sunlight: 8, co2: 4 },
        growthStages: ['🌱', '🌿', '🌹']
      },
      {
        name: 'Small Tree',
        emoji: '🌳',
        description: 'A young tree needs more CO₂',
        hint: 'Trees absorb lots of CO₂ and need steady water supply',
        requirements: { water: 5, sunlight: 4, co2: 4 },
        maxValues: { water: 7, sunlight: 6, co2: 6 },
        growthStages: ['🌱', '🌿', '🌳']
      }
    ],
    advanced: [
      {
        name: 'Sunflower',
        emoji: '🌻',
        description: 'Giant sunflower needs intense sunlight',
        hint: 'Sunflowers follow the sun - they need maximum bright light',
        requirements: { water: 4, sunlight: 8, co2: 3 },
        maxValues: { water: 6, sunlight: 10, co2: 5 },
        growthStages: ['🌱', '🌿', '🌻']
      },
      {
        name: 'Oak Tree',
        emoji: '🌲',
        description: 'Large tree needs all resources in abundance',
        hint: 'Oak trees are giants - they need high amounts of everything',
        requirements: { water: 6, sunlight: 6, co2: 6 },
        maxValues: { water: 8, sunlight: 8, co2: 8 },
        growthStages: ['🌱', '🌿', '🌲']
      },
      {
        name: 'Tropical Plant',
        emoji: '🌺',
        description: 'Exotic plant with specific high needs',
        hint: 'Tropical plants love lots of water and humid conditions',
        requirements: { water: 7, sunlight: 5, co2: 4 },
        maxValues: { water: 9, sunlight: 7, co2: 6 },
        growthStages: ['🌱', '🍃', '🌺']
      }
    ]
  };

  const generateQuestion = (level) => {
    let plantPool = [];
    
    if (level <= 2) {
      plantPool = plantScenarios.basic;
    } else if (level <= 5) {
      plantPool = [...plantScenarios.basic, ...plantScenarios.intermediate];
    } else {
      plantPool = [...plantScenarios.basic, ...plantScenarios.intermediate, ...plantScenarios.advanced];
    }

    const selectedPlant = plantPool[Math.floor(Math.random() * plantPool.length)];
    
    return {
      plant: selectedPlant,
      targetRequirements: selectedPlant.requirements,
      maxValues: selectedPlant.maxValues
    };
  };

  const startNewQuestion = () => {
    const question = generateQuestion(level);
    setCurrentQuestion(question);
    setPlantRequirements({ water: 0, sunlight: 0, co2: 0 });
    setFeedback('');
    setShowResult(false);
    setPlantGrowthStage(0);
  };

  const updateRequirement = (type, value) => {
    setPlantRequirements(prev => ({
      ...prev,
      [type]: Math.max(0, Math.min(value, currentQuestion.maxValues[type]))
    }));
    
    // Update plant growth based on current requirements
    if (currentQuestion) {
      const current = { ...plantRequirements, [type]: Math.max(0, Math.min(value, currentQuestion.maxValues[type])) };
      const target = currentQuestion.targetRequirements;
      
      const waterProgress = Math.min(current.water / target.water, 1);
      const sunlightProgress = Math.min(current.sunlight / target.sunlight, 1);
      const co2Progress = Math.min(current.co2 / target.co2, 1);
      
      const avgProgress = (waterProgress + sunlightProgress + co2Progress) / 3;
      const newStage = Math.floor(avgProgress * currentQuestion.plant.growthStages.length);
      setPlantGrowthStage(Math.min(newStage, currentQuestion.plant.growthStages.length - 1));
    }
  };

  const checkPlantHealth = () => {
    const target = currentQuestion.targetRequirements;
    const current = plantRequirements;
    
    const waterMatch = Math.abs(current.water - target.water) <= 1;
    const sunlightMatch = Math.abs(current.sunlight - target.sunlight) <= 1;
    const co2Match = Math.abs(current.co2 - target.co2) <= 1;
    
    return waterMatch && sunlightMatch && co2Match;
  };

  const submitAnswer = () => {
    const isHealthy = checkPlantHealth();
    
    setTotalQuestions(prev => prev + 1);
    setShowResult(true);
    
    if (isHealthy) {
      setScore(prev => prev + level * 10);
      setQuestionsCorrect(prev => prev + 1);
      setFeedback('🎉 Perfect! Your plant is healthy and growing well!');
      setPlantGrowthStage(currentQuestion.plant.growthStages.length - 1);
      
      // Level up every 3 correct answers
      if ((questionsCorrect + 1) % 3 === 0 && level < 10) {
        setLevel(prev => prev + 1);
        setFeedback(`🎉 Excellent! Your plants are thriving! Level up to ${level + 1}!`);
      }
    } else {
      setFeedback('🌱 Not quite right. Check the plant\'s needs and try again!');
    }
  };

  const getRequirementStatus = (type) => {
    if (!currentQuestion) return 'normal';
    const current = plantRequirements[type];
    const target = currentQuestion.targetRequirements[type];
    const max = currentQuestion.maxValues[type];
    
    if (Math.abs(current - target) <= 1) return 'perfect';
    if (current < target) return 'low';
    if (current > max * 0.8) return 'high';
    return 'normal';
  };


  const startGame = () => {
    setGameStarted(true);
    startNewQuestion();
  };

  const finishGame = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        await ApiService.saveGameScore(userEmail, 'photosynthesis', {
          score: score,
          level_reached: level,
          time_played_minutes: Math.floor(totalQuestions * 2), // Estimate
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

  if (!gameStarted) {
    return (
      <div className="w-full">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              🌱 Photosynthesis Explorer
            </CardTitle>
            <CardDescription>
              Learn how plants make their own food through photosynthesis!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🌿☀️💧</div>
              <p className="mb-4">
                Help different plants grow by providing them with the right amounts of water, sunlight, and CO₂!
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-800 mb-3">How to Play:</h3>
              <ul className="space-y-2 text-green-700 text-sm">
                <li className="flex items-start gap-2">
                  <span>🎯</span>
                  <span>Each plant has different needs for water, sunlight, and CO₂</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🌱</span>
                  <span>Watch your plant grow as you provide the right resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>📚</span>
                  <span>Learn: 6H₂O + 6CO₂ + Light → C₆H₁₂O₆ + 6O₂</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>⭐</span>
                  <span>Level up by helping plants grow successfully!</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
                🚀 Start Growing Plants!
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="w-full">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">🎉 Congratulations!</CardTitle>
            <CardDescription>
              You've completed the Photosynthesis Explorer game!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-bold text-xl mb-3">Final Results</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-green-700">Total Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{level}</div>
                  <div className="text-sm text-green-700">Level Reached</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{questionsCorrect}</div>
                  <div className="text-sm text-green-700">Plants Grown</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{Math.round((questionsCorrect / totalQuestions) * 100)}%</div>
                  <div className="text-sm text-green-700">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700">
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="w-full flex items-center justify-center p-8">Loading...</div>;
  }

  const currentPlantEmoji = currentQuestion.plant.growthStages[plantGrowthStage];
  const target = currentQuestion.targetRequirements;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
        {/* Question */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              Help your {currentQuestion.plant.name} grow healthy!
            </CardTitle>
            <CardDescription className="text-center text-lg">
              {currentQuestion.plant.description}
            </CardDescription>
            <div className="text-center text-blue-600 font-medium">
              💡 {currentQuestion.plant.hint}
            </div>
          </CardHeader>
        </Card>

        {/* Plant Display */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-8xl">{currentPlantEmoji}</div>
              <div className="text-xl font-semibold">{currentQuestion.plant.name}</div>
              
              {/* Photosynthesis Equation */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-lg font-mono">6H₂O + 6CO₂ + Light Energy → C₆H₁₂O₆ + 6O₂</div>
                <div className="text-sm text-blue-600 mt-1">Photosynthesis Equation</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Provide What Your Plant Needs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Water Control */}
            <div className={`p-4 rounded-lg border-2 ${getRequirementStatus('water') === 'perfect' ? 'border-green-400 bg-green-50' : 
                                                     getRequirementStatus('water') === 'low' ? 'border-red-400 bg-red-50' : 
                                                     getRequirementStatus('water') === 'high' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💧</span>
                  <span className="font-semibold">Water</span>
                </div>
                <span className="text-2xl font-bold">{plantRequirements.water}</span>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => updateRequirement('water', plantRequirements.water - 1)}
                  disabled={plantRequirements.water <= 0}
                >
                  -
                </Button>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${(plantRequirements.water / currentQuestion.maxValues.water) * 100}%` }}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => updateRequirement('water', plantRequirements.water + 1)}
                  disabled={plantRequirements.water >= currentQuestion.maxValues.water}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Sunlight Control */}
            <div className={`p-4 rounded-lg border-2 ${getRequirementStatus('sunlight') === 'perfect' ? 'border-green-400 bg-green-50' : 
                                                       getRequirementStatus('sunlight') === 'low' ? 'border-red-400 bg-red-50' : 
                                                       getRequirementStatus('sunlight') === 'high' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">☀️</span>
                  <span className="font-semibold">Sunlight</span>
                </div>
                <span className="text-2xl font-bold">{plantRequirements.sunlight}</span>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => updateRequirement('sunlight', plantRequirements.sunlight - 1)}
                  disabled={plantRequirements.sunlight <= 0}
                >
                  -
                </Button>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 transition-all duration-300"
                    style={{ width: `${(plantRequirements.sunlight / currentQuestion.maxValues.sunlight) * 100}%` }}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => updateRequirement('sunlight', plantRequirements.sunlight + 1)}
                  disabled={plantRequirements.sunlight >= currentQuestion.maxValues.sunlight}
                >
                  +
                </Button>
              </div>
            </div>

            {/* CO2 Control */}
            <div className={`p-4 rounded-lg border-2 ${getRequirementStatus('co2') === 'perfect' ? 'border-green-400 bg-green-50' : 
                                                      getRequirementStatus('co2') === 'low' ? 'border-red-400 bg-red-50' : 
                                                      getRequirementStatus('co2') === 'high' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌬️</span>
                  <span className="font-semibold">CO₂</span>
                </div>
                <span className="text-2xl font-bold">{plantRequirements.co2}</span>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => updateRequirement('co2', plantRequirements.co2 - 1)}
                  disabled={plantRequirements.co2 <= 0}
                >
                  -
                </Button>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-500 transition-all duration-300"
                    style={{ width: `${(plantRequirements.co2 / currentQuestion.maxValues.co2) * 100}%` }}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => updateRequirement('co2', plantRequirements.co2 + 1)}
                  disabled={plantRequirements.co2 >= currentQuestion.maxValues.co2}
                >
                  +
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="text-center mb-6">
          <Button 
            onClick={submitAnswer}
            disabled={showResult}
            className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
          >
            Check Plant Health
          </Button>
        </div>

        {/* Results */}
        {showResult && (
          <Card>
            <CardContent className="pt-6">
              <div className={`text-center text-xl font-semibold mb-4 ${
                feedback.includes('Perfect') || feedback.includes('Excellent') ? 'text-green-600' : 'text-red-600'
              }`}>
                {feedback}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-3 text-center">This plant needed:</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl">💧</div>
                    <div className="font-medium">Water: {target.water}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl">☀️</div>
                    <div className="font-medium">Sunlight: {target.sunlight}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl">🌬️</div>
                    <div className="font-medium">CO₂: {target.co2}</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <p className="font-semibold mb-2">Photosynthesis Facts:</p>
                <ul className="text-sm space-y-1">
                  <li>• Plants need water, sunlight, and CO₂ to make food</li>
                  <li>• They produce oxygen as a bonus for us!</li>
                  <li>• Different plants have different needs</li>
                  <li>• Too much or too little can harm the plant</li>
                </ul>
              </div>

              <div className="text-center">
                <Button onClick={startNewQuestion} className="bg-green-600 hover:bg-green-700">
                  Grow Next Plant 🌱
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PhotosynthesisGame;