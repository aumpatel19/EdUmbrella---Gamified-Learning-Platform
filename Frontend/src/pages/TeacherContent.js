import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/simplebutton";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Upload, 
  Play, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Video, 
  FileVideo,
  Clock,
  Users,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import TeacherSidebar from "../components/TeacherSidebar";

const TeacherContent = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Teacher";
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const subjects = [
    {
      id: "math",
      name: "Mathematics",
      icon: "🧮",
      color: "from-blue-500 to-blue-700",
      videoCount: 12,
      totalDuration: "8h 30m",
      status: "active"
    },
    {
      id: "science",
      name: "Science",
      icon: "🔬",
      color: "from-green-500 to-green-700",
      videoCount: 15,
      totalDuration: "10h 45m",
      status: "active"
    },
    {
      id: "physics",
      name: "Physics",
      icon: "⚛️",
      color: "from-purple-500 to-purple-700",
      videoCount: 18,
      totalDuration: "12h 15m",
      status: "active"
    },
    {
      id: "history",
      name: "History",
      icon: "🌍",
      color: "from-orange-500 to-orange-700",
      videoCount: 10,
      totalDuration: "6h 20m",
      status: "active"
    }
  ];

  const recentVideos = [
    {
      id: 1,
      title: "Introduction to Calculus",
      subject: "Mathematics",
      duration: "45 min",
      uploadDate: "2024-01-15",
      views: 234,
      status: "published",
      thumbnail: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Chemical Reactions Basics",
      subject: "Science",
      duration: "38 min",
      uploadDate: "2024-01-14",
      views: 189,
      status: "published",
      thumbnail: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Newton's Laws of Motion",
      subject: "Physics",
      duration: "52 min",
      uploadDate: "2024-01-13",
      views: 156,
      status: "draft",
      thumbnail: "/placeholder.svg"
    },
    {
      id: 4,
      title: "World War II Timeline",
      subject: "History",
      duration: "41 min",
      uploadDate: "2024-01-12",
      views: 98,
      status: "published",
      thumbnail: "/placeholder.svg"
    }
  ];

  const handleVideoUpload = async (formData: FormData) => {
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setShowUploadForm(false);
      // Here you would typically handle the actual upload and update state
      alert("Video uploaded successfully! It will be available to students soon.");
    }, 3000);
  };

  const UploadForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload New Video Lecture
        </CardTitle>
        <CardDescription>
          Upload educational content that will be automatically organized and sent to student dashboards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleVideoUpload(formData);
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Video Title *</Label>
              <Input 
                id="title" 
                name="title"
                placeholder="e.g., Introduction to Algebra"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select name="subject" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.icon} {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              name="description"
              placeholder="Brief description of the video content"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">Video File *</Label>
            <Input 
              id="video" 
              name="video"
              type="file" 
              accept="video/*"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input 
                id="duration" 
                name="duration"
                type="number"
                placeholder="45"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select name="difficulty">
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Publishing Status</Label>
              <Select name="status" defaultValue="draft">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Save as Draft</SelectItem>
                  <SelectItem value="published">Publish Immediately</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isUploading}>
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Video
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowUploadForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <SidebarProvider>
      <TeacherSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-[#F8FAFC]">
          {/* Header */}
          <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div className="w-8 h-8 rounded-full bg-[#1D4ED8] flex items-center justify-center">
                  <span className="text-lg">📚</span>
                </div>
                <h1 className="text-xl font-bold font-bold text-[#1E293B]">
                  Content Management
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{userName}</span>
                  <Badge variant="secondary">Teacher</Badge>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">📚 Content Management</h2>
                  <p className="text-muted-foreground">
                    Upload and manage video lectures that will be automatically sent to student dashboards
                  </p>
                </div>
                {!showUploadForm && (
                  <Button onClick={() => setShowUploadForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Upload New Video
                  </Button>
                )}
              </div>
            </div>

            {showUploadForm && <UploadForm />}

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="videos">All Videos</TabsTrigger>
                <TabsTrigger value="subjects">By Subject</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Video className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Videos</p>
                          <p className="text-2xl font-bold">55</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Eye className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Views</p>
                          <p className="text-2xl font-bold">2,350</p>
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
                          <p className="text-sm text-muted-foreground">Active Students</p>
                          <p className="text-2xl font-bold">124</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Videos */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recently Uploaded Videos</CardTitle>
                    <CardDescription>Your latest video content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentVideos.map((video) => (
                        <div key={video.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
                            <FileVideo className="w-6 h-6 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{video.title}</h4>
                              <Badge 
                                variant={video.status === "published" ? "default" : "secondary"}
                                className="flex items-center gap-1"
                              >
                                {video.status === "published" ? (
                                  <CheckCircle className="w-3 h-3" />
                                ) : (
                                  <AlertCircle className="w-3 h-3" />
                                )}
                                {video.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>{video.subject}</span>
                              <span>{video.duration}</span>
                              <span>{video.views} views</span>
                              <span>Uploaded {new Date(video.uploadDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subjects" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subjects.map((subject) => (
                    <Card key={subject.id} className="overflow-hidden">
                      <div className={`h-2 bg-gradient-to-r ${subject.color}`} />
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{subject.icon}</div>
                            <div>
                              <CardTitle>{subject.name}</CardTitle>
                              <CardDescription>
                                {subject.videoCount} videos • {subject.totalDuration}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {subject.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            View All
                          </Button>
                          <Button size="sm" className="flex-1">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Video
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="videos" className="space-y-6">
                <div className="space-y-4">
                  {recentVideos.map((video) => (
                    <Card key={video.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Play className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">{video.title}</h4>
                                <p className="text-sm text-muted-foreground">{video.subject}</p>
                              </div>
                              <Badge 
                                variant={video.status === "published" ? "default" : "secondary"}
                              >
                                {video.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{video.duration}</span>
                              <span>{video.views} views</span>
                              <span>Uploaded {new Date(video.uploadDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Preview
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Videos</CardTitle>
                      <CardDescription>Most viewed content this month</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentVideos.slice(0, 3).map((video, index) => (
                        <div key={video.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{video.title}</p>
                            <p className="text-sm text-muted-foreground">{video.views} views</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Subject Performance</CardTitle>
                      <CardDescription>Views by subject category</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {subjects.map((subject) => (
                        <div key={subject.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <span>{subject.icon}</span>
                              {subject.name}
                            </span>
                            <span className="font-medium">
                              {Math.floor(Math.random() * 500) + 200} views
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${subject.color} h-2 rounded-full`}
                              style={{ width: `${Math.floor(Math.random() * 60) + 40}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default TeacherContent;