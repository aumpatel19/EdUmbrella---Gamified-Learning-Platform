import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/simplebutton';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Trophy, Target } from 'lucide-react';
import CircuitGameApp from './circuit';
import './CSS/Circuit.css';

const CircuitGame = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/quizzes');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quizzes
            </Button>
            <h1 className="text-xl font-bold">Circuit Builder Challenge</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Trophy className="w-3 h-3" />
              Physics Game
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Target className="w-3 h-3" />
              Class 9-12
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚡ Circuit Builder Game
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg border">
              <CircuitGameApp />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CircuitGame;