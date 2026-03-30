import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/simplebutton";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { 
  User,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  Edit,
  Save,
  X,
  Trash2,
  Shield,
  Bell,
  Palette,
  Camera,
  Settings,
  Award,
  BookOpen,
  Trophy,
  Clock,
  AlertTriangle
} from "lucide-react";
import StudentSidebar from "../components/StudentSidebar";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    displayName: localStorage.getItem("userName") || "Student",
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@email.com",
    age: "16",
    grade: "10th",
    location: "New York, USA",
    bio: "Passionate student eager to learn and excel in mathematics and science. Love solving challenging problems and participating in academic competitions.",
    joinDate: "2024-01-15",
    avatar: "/placeholder.svg"
  });

  const [editedData, setEditedData] = useState(profileData);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const handleSave = () => {
    setProfileData(editedData);
    localStorage.setItem("userName", editedData.displayName);
    setIsEditing(false);
    // Here you would typically save to database
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    // Here you would typically make API call to delete account
    alert("Account deleted successfully!");
    navigate("/");
  };

  const grades = [
    "6th Grade", "7th Grade", "8th Grade", "9th Grade", 
    "10th Grade", "11th Grade", "12th Grade"
  ];

  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany", 
    "France", "Japan", "South Korea", "Singapore", "India", "Brazil", 
    "Mexico", "Other"
  ];

  const achievements = [
    { id: 1, title: "Quiz Master", description: "Completed 50 quizzes", icon: "🏆", date: "2024-01-10" },
    { id: 2, title: "Study Streak", description: "7 days in a row", icon: "🔥", date: "2024-01-08" },
    { id: 3, title: "Math Expert", description: "95% average in Math", icon: "🧮", date: "2024-01-05" },
    { id: 4, title: "Early Bird", description: "Joined EdUmbrella", icon: "🎓", date: "2024-01-01" }
  ];

  const stats = [
    { label: "Total XP", value: "2,450", icon: Trophy, color: "text-yellow-600" },
    { label: "Quizzes Completed", value: "34", icon: BookOpen, color: "text-blue-600" },
    { label: "Study Hours", value: "127", icon: Clock, color: "text-green-600" },
    { label: "Current Streak", value: "7 days", icon: Award, color: "text-purple-600" }
  ];

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
                  <span className="text-lg">👤</span>
                </div>
                <h1 className="text-xl font-bold font-bold text-[#1E293B]">
                  EdUmbrella - Profile
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback>{profileData.displayName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{profileData.displayName}</span>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">👤 My Profile</h2>
                  <p className="text-muted-foreground">
                    Manage your account settings and personal information
                  </p>
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Overview */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="relative inline-block">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={profileData.avatar} />
                          <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            {profileData.displayName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                          >
                            <Camera className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{profileData.displayName}</h3>
                        <p className="text-muted-foreground">{profileData.firstName} {profileData.lastName}</p>
                        <Badge variant="secondary" className="mt-2">
                          <GraduationCap className="w-3 h-3 mr-1" />
                          {profileData.grade}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-blue-600">Level 5</div>
                          <div className="text-muted-foreground">Current Level</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-green-600">83%</div>
                          <div className="text-muted-foreground">Avg Score</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📊 Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <stat.icon className={`w-4 h-4 ${stat.color}`} />
                          <span className="text-sm">{stat.label}</span>
                        </div>
                        <span className="font-medium">{stat.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🏆 Recent Achievements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {achievements.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <div className="text-xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{achievement.title}</div>
                          <div className="text-xs text-muted-foreground">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" size="sm">
                      View All Achievements
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="personal" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="academic">Academic</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Your basic profile information</CardDescription>
                          </div>
                          {isEditing && (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={handleCancel}>
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                              <Button size="sm" onClick={handleSave}>
                                <Save className="w-4 h-4 mr-1" />
                                Save
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                              id="displayName"
                              value={isEditing ? editedData.displayName : profileData.displayName}
                              onChange={(e) => setEditedData(prev => ({ ...prev, displayName: e.target.value }))}
                              disabled={!isEditing}
                            />
                            <p className="text-xs text-muted-foreground">
                              This name will be shown throughout the website
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={isEditing ? editedData.email : profileData.email}
                              onChange={(e) => setEditedData(prev => ({ ...prev, email: e.target.value }))}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={isEditing ? editedData.firstName : profileData.firstName}
                              onChange={(e) => setEditedData(prev => ({ ...prev, firstName: e.target.value }))}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={isEditing ? editedData.lastName : profileData.lastName}
                              onChange={(e) => setEditedData(prev => ({ ...prev, lastName: e.target.value }))}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input
                              id="age"
                              type="number"
                              min="10"
                              max="25"
                              value={isEditing ? editedData.age : profileData.age}
                              onChange={(e) => setEditedData(prev => ({ ...prev, age: e.target.value }))}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="grade">Grade Level</Label>
                            <Select
                              value={isEditing ? editedData.grade : profileData.grade}
                              onValueChange={(value) => setEditedData(prev => ({ ...prev, grade: value }))}
                              disabled={!isEditing}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {grades.map((grade) => (
                                  <SelectItem key={grade} value={grade}>
                                    {grade}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Select
                              value={isEditing ? editedData.location.split(',')[0] : profileData.location.split(',')[0]}
                              onValueChange={(value) => setEditedData(prev => ({ ...prev, location: `${value}, Country` }))}
                              disabled={!isEditing}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <textarea
                            id="bio"
                            className="w-full p-3 border rounded-md resize-none"
                            rows={3}
                            value={isEditing ? editedData.bio : profileData.bio}
                            onChange={(e) => setEditedData(prev => ({ ...prev, bio: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Tell us about yourself..."
                          />
                          <p className="text-xs text-muted-foreground">
                            Brief description about yourself and your interests
                          </p>
                        </div>

                        <div className="pt-4 border-t">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            Joined EdUmbrella on {new Date(profileData.joinDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="academic" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Academic Performance</CardTitle>
                        <CardDescription>Your learning progress and achievements</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Subject Performance */}
                        <div className="space-y-4">
                          <h4 className="font-medium">Subject Performance</h4>
                          {[
                            { subject: "Mathematics", score: 85, grade: "A", icon: "🧮" },
                            { subject: "Science", score: 78, grade: "B+", icon: "🔬" },
                            { subject: "Physics", score: 82, grade: "A-", icon: "⚛️" },
                            { subject: "History", score: 91, grade: "A+", icon: "🌍" }
                          ].map((item) => (
                            <div key={item.subject} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.subject}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-lg">{item.grade}</div>
                                <div className="text-sm text-muted-foreground">{item.score}%</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Learning Goals */}
                        <div className="space-y-4">
                          <h4 className="font-medium">Learning Goals</h4>
                          <div className="space-y-2">
                            {[
                              "Complete all Math assignments with 90%+ score",
                              "Maintain study streak for 30 days",
                              "Achieve Level 10 by end of semester"
                            ].map((goal, index) => (
                              <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                              
                                <span className="text-sm">{goal}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="preferences" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                        <CardDescription>Customize your learning experience</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Notifications */}
                        <div className="space-y-4">
                          <h4 className="font-medium flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            Notifications
                          </h4>
                          <div className="space-y-3">
                            {[
                              { label: "Quiz reminders", description: "Get notified before quiz deadlines" },
                              { label: "Assignment updates", description: "Receive updates on new assignments" },
                              { label: "Achievement notifications", description: "Celebrate your accomplishments" },
                              { label: "Daily study reminders", description: "Stay on track with daily goals" }
                            ].map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <div className="font-medium">{item.label}</div>
                                  <div className="text-sm text-muted-foreground">{item.description}</div>
                                </div>
                                <input type="checkbox" defaultChecked className="w-4 h-4" />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Theme */}
                        <div className="space-y-4">
                          <h4 className="font-medium flex items-center gap-2">
                            <Palette className="w-4 h-4" />
                            Appearance
                          </h4>
                          <Select defaultValue="system">
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Light Mode</SelectItem>
                              <SelectItem value="dark">Dark Mode</SelectItem>
                              <SelectItem value="system">System Default</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          Account Security
                        </CardTitle>
                        <CardDescription>Manage your account security settings</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Password Change */}
                        <div className="space-y-4">
                          <h4 className="font-medium">Change Password</h4>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input id="currentPassword" type="password" placeholder="Enter current password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newPassword">New Password</Label>
                              <Input id="newPassword" type="password" placeholder="Enter new password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                            </div>
                            <Button>Update Password</Button>
                          </div>
                        </div>

                        <Separator />

                        {/* Delete Account */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-red-600 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Danger Zone
                          </h4>
                          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                            <div className="space-y-3">
                              <div>
                                <div className="font-medium text-red-800">Delete Account</div>
                                <div className="text-sm text-red-600">
                                  Permanently delete your account and all associated data. This action cannot be undone.
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                onClick={() => setShowDeleteConfirm(true)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Account
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-[#1E293B]/50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="w-5 h-5" />
                      Confirm Account Deletion
                    </CardTitle>
                    <CardDescription>
                      This action is irreversible. All your data will be permanently deleted.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        Type "<strong>DELETE</strong>" to confirm account deletion:
                      </p>
                      <Input className="mt-2" placeholder="Type DELETE to confirm" />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        className="flex-1"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Profile;