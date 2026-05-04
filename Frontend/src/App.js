import React from 'react';
import { GamificationProvider } from "./contexts/GamificationContext";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherContent from "./pages/TeacherContent";
import TeacherClasses from "./pages/TeacherClasses";
import TeacherQuizzes from "./pages/TeacherQuizzes";
import TeacherSchedule from "./pages/TeacherSchedule";
import Lectures from "./pages/Lectures";
import SubjectLectures from "./pages/SubjectLectures";
import Quizzes from "./pages/Quizzes";
import QuizTaking from "./pages/QuizTaking";
import Games from "./pages/Games";
import Calendar from "./pages/Calendar";
import Leaderboards from "./pages/Leaderboards";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CircuitBoard from "./pages/games/circuit";
import CircuitGame from "./pages/games/CircuitGame";
import NutritionGame from "./pages/games/NutritionGame";
import PizzaGame from "./pages/games/PizzaGame";
import PhotosynthesisGame from "./pages/games/PhotosynthesisGame";
import EquationGame from "./pages/games/EquationGame";
import IntegerBattleGame from "./pages/games/IntegerBattleGame";
import CellExplorerGame from "./pages/games/CellExplorerGame";
import TriangleTheoremGame from "./pages/games/TriangleTheoremGame";
import AtomBuilderGame from "./pages/games/AtomBuilderGame";
import TrigTowerGame from "./pages/games/TrigTowerGame";
import VectorVoyageGame from "./pages/games/VectorVoyageGame";
import PeriodicQuestGame from "./pages/games/PeriodicQuestGame";
import CalculusClimberGame from "./pages/games/CalculusClimberGame";
import GeneticsLabGame from "./pages/games/GeneticsLabGame";


const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GamificationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/classes" element={<TeacherClasses />} />
            <Route path="/teacher/quizzes" element={<TeacherQuizzes />} />
            <Route path="/teacher/content" element={<TeacherContent />} />
            <Route path="/teacher/schedule" element={<TeacherSchedule />} />
            <Route path="/lectures" element={<Lectures />} />
            <Route path="/lectures/:subjectId" element={<SubjectLectures />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/quiz/:quizId/attempt/:attemptId" element={<QuizTaking />} />
            <Route path="/games" element={<Games />} />
            <Route path="/leaderboard" element={<Leaderboards />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/games/circuit-board" element={<CircuitBoard />} />
            <Route path="/games/circuit" element={<CircuitGame />} />
            <Route path="/games/nutrition" element={<NutritionGame />} />
            <Route path="/games/pizza" element={<PizzaGame />} />
            <Route path="/games/photosynthesis" element={<PhotosynthesisGame />} />
            <Route path="/games/equation-unlock" element={<EquationGame />} />
            <Route path="/games/integer-battle" element={<IntegerBattleGame />} />
            <Route path="/games/cell-explorer" element={<CellExplorerGame />} />
            <Route path="/games/triangle-theorem" element={<TriangleTheoremGame />} />
            <Route path="/games/atom-builder" element={<AtomBuilderGame />} />
            <Route path="/games/trig-tower" element={<TrigTowerGame />} />
            <Route path="/games/vector-voyage" element={<VectorVoyageGame />} />
            <Route path="/games/periodic-quest" element={<PeriodicQuestGame />} />
            <Route path="/games/calculus-climber" element={<CalculusClimberGame />} />
            <Route path="/games/genetics-lab" element={<GeneticsLabGame />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </GamificationProvider>
    </QueryClientProvider>
  );
};

export default App;
