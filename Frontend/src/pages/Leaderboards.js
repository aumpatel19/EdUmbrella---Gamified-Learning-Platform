import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/simplebutton";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  TrendingUp,
  Calendar,
  BookOpen,
  Gamepad2,
  Users,
  Target,
  Zap
} from "lucide-react";
import StudentSidebar from "../components/StudentSidebar";
import ApiService from "../api";

const Leaderboards = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";
  const userEmail = localStorage.getItem("userEmail") || "";
  const studentClass = localStorage.getItem("studentClass") || "6";
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("studentClass");
    navigate("/");
  };

  useEffect(() => {
    const loadLeaderboardData = () => {
      setLoading(true);
      
      // Use mock data directly for instant loading
      setLeaderboardData({
        overall_leaderboard: [
          { 
            id: 1, 
            name: "Alex Chen", 
            email: "alex@email.com",
            avatar: "/placeholder.svg",
            total_score: 3200, 
            total_xp: 4500,
            level: 8,
            class: "10",
            badges: 12,
            streak: 15,
            completed_quizzes: 45,
            completed_games: 18
          },
          { 
            id: 2, 
            name: "Sarah Kim", 
            email: "sarah@email.com",
            avatar: "/placeholder.svg",
            total_score: 2850, 
            total_xp: 4100,
            level: 7,
            class: "9",
            badges: 10,
            streak: 12,
            completed_quizzes: 38,
            completed_games: 15
          },
          { 
            id: 3, 
            name: userName, 
            email: userEmail,
            avatar: "/placeholder.svg",
            total_score: 2450, 
            total_xp: 3600,
            level: 6,
            class: studentClass,
            badges: 8,
            streak: 7,
            completed_quizzes: 32,
            completed_games: 12
          },
          { 
            id: 4, 
            name: "Mike Rodriguez", 
            email: "mike@email.com",
            avatar: "/placeholder.svg",
            total_score: 2200, 
            total_xp: 3200,
            level: 5,
            class: "8",
            badges: 6,
            streak: 5,
            completed_quizzes: 28,
            completed_games: 10
          },
          { 
            id: 5, 
            name: "Emma Wilson", 
            email: "emma@email.com",
            avatar: "/placeholder.svg",
            total_score: 1950, 
            total_xp: 2800,
            level: 5,
            class: "7",
            badges: 7,
            streak: 8,
            completed_quizzes: 25,
            completed_games: 9
          },
          { 
            id: 6, 
            name: "David Park", 
            email: "david@email.com",
            avatar: "/placeholder.svg",
            total_score: 1800, 
            total_xp: 2500,
            level: 4,
            class: "9",
            badges: 5,
            streak: 3,
            completed_quizzes: 22,
            completed_games: 8
          },
          { 
            id: 7, 
            name: "Lisa Johnson", 
            email: "lisa@email.com",
            avatar: "/placeholder.svg",
            total_score: 1650, 
            total_xp: 2200,
            level: 4,
            class: "8",
            badges: 4,
            streak: 6,
            completed_quizzes: 20,
            completed_games: 7
          },
          { 
            id: 8, 
            name: "Tom Brown", 
            email: "tom@email.com",
            avatar: "/placeholder.svg",
            total_score: 1500, 
            total_xp: 2000,
            level: 3,
            class: "7",
            badges: 3,
            streak: 4,
            completed_quizzes: 18,
            completed_games: 6
          }
        ],
        class_leaderboard: [
          { 
            id: 1, 
            name: userName, 
            email: userEmail,
            total_score: 2450, 
            total_xp: 3600,
            level: 6,
            badges: 8,
            streak: 7,
            completed_quizzes: 32,
            completed_games: 12
          },
          { 
            id: 2, 
            name: "Class Mate 1", 
            email: "mate1@email.com",
            total_score: 2100, 
            total_xp: 3000,
            level: 5,
            badges: 6,
            streak: 5,
            completed_quizzes: 28,
            completed_games: 10
          },
          { 
            id: 3, 
            name: "Class Mate 2", 
            email: "mate2@email.com",
            total_score: 1850, 
            total_xp: 2600,
            level: 4,
            badges: 5,
            streak: 4,
            completed_quizzes: 24,
            completed_games: 8
          }
        ],
        game_leaderboard: [
          { 
            id: 1, 
            name: "Gaming Pro", 
            game_name: "Circuit Builder",
            high_score: 95,
            completion_time: "2:45",
            level_reached: 10
          },
          { 
            id: 2, 
            name: userName, 
            game_name: "Nutrition Match",
            high_score: 88,
            completion_time: "3:12",
            level_reached: 8
          },
          { 
            id: 3, 
            name: "Game Master", 
            game_name: "Pizza Fractions",
            high_score: 92,
            completion_time: "4:20",
            level_reached: 9
          }
        ]
      });
      
      setLoading(false);
    };

    loadLeaderboardData();
  }, [userEmail, userName, studentClass]);

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Trophy className="w-5 h-5 text-orange-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return "from-yellow-400 to-yellow-600";
      case 2: return "from-gray-300 to-gray-500";
      case 3: return "from-orange-400 to-orange-600";
      default: return "from-blue-400 to-blue-600";
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <StudentSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading leaderboards...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <StudentSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-[#F8FAFC]">
          {/* Header */}
          <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div className="w-8 h-8 rounded-full bg-[#1D4ED8] flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-[#1E293B]">
                  EdUmbrella - Leaderboards
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{userName}</span>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">🏆 Leaderboards - Class {studentClass}</h2>
              <p className="text-muted-foreground">
                See how you rank among your classmates and the entire school!
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Your Rank</p>
                      <p className="text-2xl font-bold">#3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Star className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total XP</p>
                      <p className="text-2xl font-bold">3,600</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Level</p>
                      <p className="text-2xl font-bold">6</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Streak</p>
                      <p className="text-2xl font-bold">7 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overall" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overall">Overall</TabsTrigger>
                <TabsTrigger value="class">My Class</TabsTrigger>
                <TabsTrigger value="games">Games</TabsTrigger>
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
              </TabsList>

              <TabsContent value="overall" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      School Leaderboard
                    </CardTitle>
                    <CardDescription>Top performers across all classes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leaderboardData?.overall_leaderboard?.slice(0, 10).map((student, index) => (
                        <div 
                          key={student.id} 
                          className={`flex items-center gap-4 p-4 rounded-lg border ${
                            student.name === userName ? 'bg-[#EFF6FF] border-[#BFDBFE]' : 'hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRankColor(index + 1)} flex items-center justify-center`}>
                            {getRankIcon(index + 1)}
                          </div>
                          
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback>{student.name.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{student.name}</span>
                              {student.name === userName && (
                                <Badge variant="secondary" className="text-xs">You</Badge>
                              )}
                              <Badge variant="outline" className="text-xs">Class {student.class}</Badge>
                              <Badge variant="outline" className="text-xs">Level {student.level}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground flex gap-4 mt-1">
                              <span>🏆 {student.completed_quizzes} quizzes</span>
                              <span>🎮 {student.completed_games} games</span>
                              <span>🔥 {student.streak} day streak</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-primary">{student.total_xp.toLocaleString()} XP</div>
                            <div className="text-sm text-muted-foreground">{student.total_score} pts</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="class" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Class {studentClass} Leaderboard
                    </CardTitle>
                    <CardDescription>Your ranking among classmates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leaderboardData?.class_leaderboard?.map((student, index) => (
                        <div 
                          key={student.id}
                          className={`flex items-center gap-4 p-4 rounded-lg border ${
                            student.name === userName ? 'bg-[#EFF6FF] border-[#BFDBFE]' : 'hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRankColor(index + 1)} flex items-center justify-center`}>
                            {getRankIcon(index + 1)}
                          </div>
                          
                          <Avatar className="w-10 h-10">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>{student.name.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{student.name}</span>
                              {student.name === userName && (
                                <Badge variant="secondary" className="text-xs">You</Badge>
                              )}
                              <Badge variant="outline" className="text-xs">Level {student.level}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground flex gap-4 mt-1">
                              <span>🏆 {student.completed_quizzes} quizzes</span>
                              <span>🎮 {student.completed_games} games</span>
                              <span>🔥 {student.streak} day streak</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-primary">{student.total_xp.toLocaleString()} XP</div>
                            <div className="text-sm text-muted-foreground">{student.total_score} pts</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="games" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gamepad2 className="w-5 h-5" />
                      Game Leaderboards
                    </CardTitle>
                    <CardDescription>Top scores in educational games</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      {/* Circuit Game */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          ⚡ Circuit Builder Challenge
                          <Badge variant="outline" className="text-xs">Class 9-12</Badge>
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-2">
                            <div className="flex items-center gap-2">
                              <Crown className="w-4 h-4 text-yellow-500" />
                              <span className="font-medium">Gaming Pro</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">95 pts</div>
                              <div className="text-xs text-muted-foreground">2:45 time</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Nutrition Game */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          🥦 Nutrition Match Challenge
                          <Badge variant="outline" className="text-xs">Class 6-8</Badge>
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-2">
                            <div className="flex items-center gap-2">
                              <Medal className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{userName}</span>
                              <Badge variant="secondary" className="text-xs">You</Badge>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-primary">88 pts</div>
                              <div className="text-xs text-muted-foreground">3:12 time</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pizza Game */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          🍕 Pizza Fraction Fun
                          <Badge variant="outline" className="text-xs">Class 6-8</Badge>
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-2">
                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4 text-orange-600" />
                              <span className="font-medium">Game Master</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">92 pts</div>
                              <div className="text-xs text-muted-foreground">4:20 time</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subjects" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Subject Rankings
                    </CardTitle>
                    <CardDescription>Your performance by subject</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-lg">🧮</span>
                          </div>
                          <div>
                            <div className="font-medium">Mathematics</div>
                            <div className="text-sm text-muted-foreground">Class {studentClass} Rank: #2</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">92%</div>
                          <div className="text-xs text-muted-foreground">avg score</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-lg">🔬</span>
                          </div>
                          <div>
                            <div className="font-medium">Science</div>
                            <div className="text-sm text-muted-foreground">Class {studentClass} Rank: #1</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">95%</div>
                          <div className="text-xs text-muted-foreground">avg score</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-lg">📖</span>
                          </div>
                          <div>
                            <div className="font-medium">English</div>
                            <div className="text-sm text-muted-foreground">Class {studentClass} Rank: #3</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-indigo-600">88%</div>
                          <div className="text-xs text-muted-foreground">avg score</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Leaderboards;