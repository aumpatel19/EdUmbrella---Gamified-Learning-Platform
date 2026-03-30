import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/simplebutton";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import TeacherSidebar from "../components/TeacherSidebar";
import { Users, BookOpen, Clock, Calendar } from "lucide-react";
import ApiService from "../api";

const TeacherClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = () => {
    setLoading(true);
    
    // Use mock data directly for instant loading
    setClasses([
      {
        id: 6,
        grade: "6th Grade",
        subject: "Mathematics",
        studentCount: 28,
        schedule: "Mon, Wed, Fri - 9:00 AM",
        nextClass: new Date(Date.now() + 86400000).toISOString(),
        progress: 65
      },
      {
        id: 7,
        grade: "7th Grade",
        subject: "Science",
        studentCount: 32,
        schedule: "Tue, Thu - 10:30 AM",
        nextClass: new Date(Date.now() + 172800000).toISOString(),
        progress: 72
      },
      {
        id: 8,
        grade: "8th Grade",
        subject: "English",
        studentCount: 25,
        schedule: "Mon, Wed, Fri - 2:00 PM",
        nextClass: new Date(Date.now() + 86400000).toISOString(),
        progress: 58
      },
      {
        id: 9,
        grade: "9th Grade",
        subject: "Mathematics",
        studentCount: 30,
        schedule: "Daily - 11:00 AM",
        nextClass: new Date(Date.now() + 43200000).toISOString(),
        progress: 80
      },
      {
        id: 10,
        grade: "10th Grade",
        subject: "Physics",
        studentCount: 22,
        schedule: "Tue, Thu, Sat - 1:00 PM",
        nextClass: new Date(Date.now() + 172800000).toISOString(),
        progress: 45
      },
      {
        id: 11,
        grade: "11th Grade",
        subject: "Chemistry",
        studentCount: 18,
        schedule: "Mon, Wed, Fri - 3:30 PM",
        nextClass: new Date(Date.now() + 86400000).toISOString(),
        progress: 67
      },
      {
        id: 12,
        grade: "12th Grade",
        subject: "Biology",
        studentCount: 20,
        schedule: "Tue, Thu - 2:30 PM",
        nextClass: new Date(Date.now() + 172800000).toISOString(),
        progress: 90
      }
    ]);
    
    setError(null);
    setLoading(false);
  };

  const getGradeColor = (grade) => {
    const gradeNum = parseInt(grade);
    if (gradeNum <= 8) return "bg-blue-100 text-blue-800";
    if (gradeNum <= 10) return "bg-green-100 text-green-800";
    return "bg-purple-100 text-purple-800";
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <SidebarProvider>
        <TeacherSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-[#F8FAFC]">
            <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
              <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="md:hidden" />
                  <h1 className="text-xl font-bold">My Classes</h1>
                </div>
              </div>
            </header>
            <div className="container mx-auto px-4 py-8">
              <div className="text-center">Loading classes...</div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <TeacherSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-[#F8FAFC]">
          <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div className="w-8 h-8 rounded-full bg-[#1D4ED8] flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold">My Classes</h1>
              </div>
              <Button>
                <BookOpen className="w-4 h-4 mr-2" />
                Add New Class
              </Button>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Classes Overview 📚</h2>
              <p className="text-muted-foreground">
                Manage your 6th-12th grade classes and track student progress
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">Error loading classes: {error}</p>
                <p className="text-sm text-red-500 mt-1">Showing mock data for demonstration</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(classes) && classes.map((classItem) => (
                <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        {classItem.subject}
                      </CardTitle>
                      <Badge className={getGradeColor(classItem.grade)}>
                        {classItem.grade}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {classItem.studentCount} students enrolled
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {classItem.schedule}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Next class: {new Date(classItem.nextClass).toLocaleString()}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Course Progress:</span>
                        <span className={`text-sm font-bold ${getProgressColor(classItem.progress)}`}>
                          {classItem.progress}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${classItem.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1">
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {classes.length === 0 && !loading && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No classes found</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't been assigned to any classes yet.
                </p>
                <Button>Contact Administration</Button>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default TeacherClasses;