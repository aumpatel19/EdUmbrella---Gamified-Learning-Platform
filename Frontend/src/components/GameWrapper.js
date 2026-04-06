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
    <div className="min-h-screen" style={{ background: "#080D1A" }}>
      {/* Dot grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(rgba(124,58,237,0.15) 1px, transparent 1px)",
        backgroundSize: "30px 30px"
      }} />

      {/* Header */}
      <div className="sticky top-0 z-50" style={{ background: "rgba(8,13,26,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(124,58,237,0.15)" }}>
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handleBackToQuizzes} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white border text-sm transition-colors" style={{ borderColor: "rgba(99,102,241,0.3)" }}>
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div>
              <h1 className="text-lg font-bold text-white" style={{ fontFamily: "Sora, sans-serif" }}>{gameTitle}</h1>
              <p className="text-xs text-slate-400">Interactive Learning Game</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-mono text-sm font-bold">{gameScore}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)" }}>
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 font-mono text-sm font-bold">Lv.{gameLevel}</span>
            </div>
            {gameCompleted && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
                <Star className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-bold">Complete!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-8 max-w-5xl mx-auto">
        {/* Game Container */}
        <div className="rounded-2xl overflow-hidden mb-6" style={{ background: "rgba(15,22,41,0.75)", backdropFilter: "blur(14px)", border: "1px solid rgba(124,58,237,0.2)" }}>
          <div className="h-1" style={{ background: "linear-gradient(90deg,#7C3AED,#4F46E5,#06B6D4)", backgroundSize: "200%", animation: "xp-shift 2.5s linear infinite" }} />
          <div className="p-5">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Sora, sans-serif" }}>
              🎮 {gameTitle}
            </h2>
            <div className="w-full">
              {loading ? (
                <div className="flex items-center justify-center h-64 rounded-xl" style={{ background: "rgba(8,13,26,0.6)", border: "1px solid rgba(99,102,241,0.15)" }}>
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-violet-500 border-t-transparent mx-auto mb-4" />
                    <p className="text-slate-400">Loading game...</p>
                  </div>
                </div>
              ) : GameComponent ? (
                <div className="rounded-xl overflow-hidden" style={{ background: "rgba(8,13,26,0.4)", border: "1px solid rgba(99,102,241,0.15)" }}>
                  <GameComponent />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <p className="text-red-400">Failed to load game. Please try again.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-2xl p-6" style={{ background: "rgba(15,22,41,0.75)", backdropFilter: "blur(14px)", border: "1px solid rgba(99,102,241,0.15)" }}>
          <h3 className="text-white font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Sora, sans-serif" }}>
            <Clock className="w-5 h-5 text-cyan-400" /> How to Play
          </h3>
          <div className="text-slate-300 text-sm">
            {getGameInstructions(gameName)}
          </div>
          <div className="flex gap-2 pt-4 mt-4 border-t" style={{ borderColor: "rgba(99,102,241,0.15)" }}>
            {["Educational","Interactive","Self-Paced"].map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full text-violet-300" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>{tag}</span>
            ))}
          </div>
        </div>
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