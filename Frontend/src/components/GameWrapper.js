import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './ui/simplebutton';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Trophy, Clock, Target, Star } from 'lucide-react';
import ApiService from '../api';

// Import the game components from pages/games folder
const loadGameComponent = async (gameComponent, studentClass = '6') => {
  try {
    // Define game paths in pages/games folder
    const gamePaths = {
      'circuit': '../pages/games/circuit',
      'nutrition': '../pages/games/nutrition', 
      'pizza': '../pages/games/pizza',
      'photosynthesis': '../pages/games/photosynthesis',
      'equation': '../pages/games/equation'
    };

    const gamePath = gamePaths[gameComponent];
    if (!gamePath) {
      console.warn(`Game component '${gameComponent}' not implemented yet`);
      // Return a placeholder component for unimplemented games
      return () => (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h3 className="text-lg font-semibold mb-2">Game Coming Soon!</h3>
            <p className="text-muted-foreground">
              The {gameComponent} game is currently under development.
            </p>
          </div>
        </div>
      );
    }

    const gameModule = await import(gamePath);
    return gameModule.default;
  } catch (error) {
    console.error(`Failed to load game component '${gameComponent}':`, error);
    return null;
  }
};

const GameWrapper = ({ gameComponent, gameName, gameTitle, onGameComplete }) => {
  const navigate = useNavigate();
  const studentClass = localStorage.getItem("studentClass") || "6";
  const [gameScore, setGameScore] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [GameComponent, setGameComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const userEmail = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    // Load the game component dynamically
    const loadGame = async () => {
      try {
        setLoading(true);
        const LoadedGameComponent = await loadGameComponent(gameComponent, studentClass);
        if (LoadedGameComponent) {
          setGameComponent(() => LoadedGameComponent);
        }
      } catch (error) {
        console.error('Failed to load game:', error);
      } finally {
        setLoading(false);
      }
    };

    if (gameComponent) {
      loadGame();
    }
  }, [gameComponent]);

  const handleGameMessage = async (event) => {
    // Handle messages from the game iframe
    if (event.data.type === 'GAME_SCORE_UPDATE') {
      setGameScore(event.data.score);
      setGameLevel(event.data.level || 1);
    } else if (event.data.type === 'GAME_COMPLETED') {
      setGameCompleted(true);
      await saveGameScore(event.data);
    }
  };

  const saveGameScore = async (gameData) => {
    try {
      const timePlayedMinutes = Math.round((Date.now() - startTime) / 1000 / 60);
      
      await ApiService.saveGameScore(userEmail, gameName, {
        score: gameData.score || gameScore,
        level_reached: gameData.level || gameLevel,
        time_played_minutes: timePlayedMinutes,
        completed: gameData.completed || gameCompleted,
        game_data: gameData
      });

      if (onGameComplete) {
        onGameComplete(gameData);
      }
    } catch (error) {
      console.error('Failed to save game score:', error);
    }
  };

  const handleBackToQuizzes = () => {
    navigate('/quizzes');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBackToQuizzes}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quizzes
            </Button>
            <div>
              <h1 className="text-xl font-bold">{gameTitle}</h1>
              <p className="text-sm text-muted-foreground">Interactive Learning Game</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Trophy className="w-3 h-3" />
              Score: {gameScore}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Target className="w-3 h-3" />
              Level: {gameLevel}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Game Container */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎮 {gameTitle}
              {gameCompleted && <Badge className="bg-green-100 text-green-800">Completed!</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              {loading ? (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading game...</p>
                  </div>
                </div>
              ) : GameComponent ? (
                <div className="bg-white rounded-lg p-4 border">
                  <GameComponent />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-red-100 rounded-lg">
                  <div className="text-center">
                    <p className="text-red-600">Failed to load game. Please try again later.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Game Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              How to Play
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getGameInstructions(gameName)}
              <div className="flex gap-2 pt-4 border-t">
                <Badge variant="outline">Educational</Badge>
                <Badge variant="outline">Interactive</Badge>
                <Badge variant="outline">Self-Paced</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const getGameInstructions = (gameName) => {
  const instructions = {
    'circuit': (
      <div>
        <h4 className="font-semibold mb-2">🔌 Circuit Builder Game</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Select components from the toolbar</li>
          <li>Click on the board to place components</li>
          <li>Use "Wire Mode" to connect components</li>
          <li>Test your circuit to see if it works</li>
          <li>Complete challenges to advance levels</li>
        </ul>
      </div>
    ),
    'nutrition': (
      <div>
        <h4 className="font-semibold mb-2">🥦 Nutrition Match Game</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Match foods with their nutritional values</li>
          <li>Click on nutrient buttons to select them for each food</li>
          <li>Learn about healthy eating and nutrition</li>
          <li>Complete levels by getting 70% or higher accuracy</li>
        </ul>
      </div>
    ),
    'pizza': (
      <div>
        <h4 className="font-semibold mb-2">🍕 Pizza Fraction Game</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Create fractions that add up to the target</li>
          <li>Use the pizza visual to understand fractions</li>
          <li>Enter numerators and denominators in the input fields</li>
          <li>Submit your answer when you're ready</li>
        </ul>
      </div>
    ),
    'photosynthesis': (
      <div>
        <h4 className="font-semibold mb-2">🌱 Photosynthesis Explorer</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Learn how plants make food from sunlight</li>
          <li>Follow interactive lessons and experiments</li>
          <li>Answer questions about plant biology</li>
          <li>Discover the process of photosynthesis</li>
        </ul>
      </div>
    ),
    'equation-unlock': (
      <div>
        <h4 className="font-semibold mb-2">🔓 Equation Unlock Game</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Solve mathematical equations step by step</li>
          <li>Unlock new levels by getting correct answers</li>
          <li>Use various mathematical operations</li>
          <li>Progress through increasingly difficult equations</li>
        </ul>
      </div>
    )
  };

  return instructions[gameName] || (
    <div>
      <h4 className="font-semibold mb-2">🎮 Educational Game</h4>
      <p className="text-sm">Follow the game instructions and complete the challenges to learn and have fun!</p>
    </div>
  );
};

export default GameWrapper;