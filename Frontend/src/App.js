import React from 'react';
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
import Profile from "./pages/ProfileFixed";
import NotFound from "./pages/NotFound";
import CircuitBoard from "./pages/games/circuit";
import CircuitGame from "./pages/games/CircuitGame";
import NutritionGame from "./pages/games/NutritionGame";
import PizzaGame from "./pages/games/PizzaGame";
import PhotosynthesisGame from "./pages/games/PhotosynthesisGame";
import EquationGame from "./pages/games/EquationGame";


const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
