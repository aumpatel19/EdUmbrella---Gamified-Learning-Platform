import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/simplebutton";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import { Play, Clock, Users, BookOpen } from "lucide-react";
import StudentSidebar from "../components/StudentSidebar";

const Lectures = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";
  const studentClass = localStorage.getItem("studentClass") || "6"; // Default to class 6

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("studentClass");
    navigate("/");
  };

  const allSubjects = [
    {
      id: "math",
      title: "Mathematics",
      description: "Basic arithmetic and number operations",
      icon: "🧮",
      color: "from-blue-500 to-blue-700",
      lectureCount: 8,
      duration: "6h 30m",
      students: 145,
      teacher: "Mrs. Sarah Wilson",
      teacherAvatar: "/placeholder.svg",
      progress: 75,
      lastUpdated: "2 days ago",
      classes: ["6", "7", "8"]
    },
    {
      id: "science",
      title: "Science",
      description: "Biology, chemistry fundamentals and laboratory experiments",
      icon: "🔬",
      color: "from-green-500 to-green-700",
      lectureCount: 10,
      duration: "8h 45m",
      students: 132,
      teacher: "Prof. Michael Chen",
      teacherAvatar: "/placeholder.svg",
      progress: 60,
      lastUpdated: "1 day ago",
      classes: ["6", "7", "8", "9", "10"]
    },
    {
      id: "physics",
      title: "Physics",
      description: "Basic mechanics and properties of matter",
      icon: "⚛️",
      color: "from-purple-500 to-purple-700",
      lectureCount: 12,
      duration: "9h 15m",
      students: 98,
      teacher: "Dr. Emily Rodriguez",
      teacherAvatar: "/placeholder.svg",
      progress: 45,
      lastUpdated: "3 days ago",
      classes: ["9", "10", "11", "12"]
    },
    {
      id: "history",
      title: "History",
      description: "Ancient civilizations and historical timeline studies",
      icon: "🌍",
      color: "from-orange-500 to-orange-700",
      lectureCount: 8,
      duration: "5h 20m",
      students: 167,
      teacher: "Dr. James Thompson",
      teacherAvatar: "/placeholder.svg",
      progress: 85,
      lastUpdated: "4 hours ago",
      classes: ["6", "7", "8", "9"]
    },
    {
      id: "english",
      title: "English",
      description: "Grammar, vocabulary, and basic literature",
      icon: "📖",
      color: "from-indigo-500 to-indigo-700",
      lectureCount: 12,
      duration: "8h 00m",
      students: 180,
      teacher: "Ms. Lisa Brown",
      teacherAvatar: "/placeholder.svg",
      progress: 70,
      lastUpdated: "1 day ago",
      classes: ["6", "7", "8", "9", "10"]
    },
    {
      id: "geography",
      title: "Geography",
      description: "Physical and political geography basics",
      icon: "🗺️",
      color: "from-teal-500 to-teal-700",
      lectureCount: 10,
      duration: "7h 30m",
      students: 120,
      teacher: "Mr. David Kumar",
      teacherAvatar: "/placeholder.svg",
      progress: 55,
      lastUpdated: "2 days ago",
      classes: ["6", "7", "8"]
    },
    {
      id: "chemistry",
      title: "Chemistry",
      description: "Chemical reactions and periodic table",
      icon: "⚗️",
      color: "from-red-500 to-red-700",
      lectureCount: 15,
      duration: "11h 45m",
      students: 85,
      teacher: "Dr. Priya Sharma",
      teacherAvatar: "/placeholder.svg",
      progress: 40,
      lastUpdated: "1 day ago",
      classes: ["9", "10", "11", "12"]
    },
    {
      id: "biology",
      title: "Biology",
      description: "Life processes and human body systems",
      icon: "🧬",
      color: "from-emerald-500 to-emerald-700",
      lectureCount: 14,
      duration: "10h 20m",
      students: 92,
      teacher: "Prof. Rajesh Gupta",
      teacherAvatar: "/placeholder.svg",
      progress: 65,
      lastUpdated: "3 days ago",
      classes: ["9", "10", "11", "12"]
    }
  ];

  // Filter subjects based on student's class
  const subjects = allSubjects.filter(subject => 
    subject.classes.includes(studentClass)
  );

  const handleSubjectClick = (subjectId) => {
    navigate(`/lectures/${subjectId}`);
  };

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
                  <span className="text-lg">🎓</span>
                </div>
                <h1 className="text-xl font-bold text-[#1E293B] font-jakarta">
                  EdUmbrella - Lectures
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
              <h2 className="text-3xl font-bold mb-2">📚 Video Lectures - Class {studentClass}</h2>
              <p className="text-muted-foreground">
                Access comprehensive video lectures from expert teachers for your class level
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Subjects</p>
                      <p className="text-2xl font-bold">{subjects.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Play className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Lectures</p>
                      <p className="text-2xl font-bold">{subjects.reduce((sum, subject) => sum + subject.lectureCount, 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Duration</p>
                      <p className="text-2xl font-bold">37h+</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Enrolled Students</p>
                      <p className="text-2xl font-bold">540+</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subject Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjects.map((subject) => (
                <Card 
                  key={subject.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => handleSubjectClick(subject.id)}
                >
                  <div className={`h-2 bg-gradient-to-r ${subject.color}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{subject.icon}</div>
                        <div>
                          <CardTitle className="group-hover:text-primary transition-colors">
                            {subject.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {subject.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {subject.progress}% Complete
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Teacher Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={subject.teacherAvatar} />
                        <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          {subject.teacher.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{subject.teacher}</p>
                        <p className="text-xs text-muted-foreground">Instructor</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Lectures</p>
                        <p className="font-medium">{subject.lectureCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-medium">{subject.duration}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Students</p>
                        <p className="font-medium">{subject.students}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="text-muted-foreground">Updated {subject.lastUpdated}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${subject.color} h-2 rounded-full transition-all`}
                          style={{ width: `${subject.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button className="w-full group-hover:bg-primary/90 transition-colors">
                      <Play className="w-4 h-4 mr-2" />
                      Continue Learning
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Lectures;