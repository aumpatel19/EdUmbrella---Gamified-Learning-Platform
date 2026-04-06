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
    { id: 1, title: "Quiz Master", description: "Completed 50 quizzes", icon: "🏆", date: "2024-01-10", xp: 500 },
    { id: 2, title: "Study Streak", description: "7 days in a row", icon: "🔥", date: "2024-01-08", xp: 200 },
    { id: 3, title: "Math Expert", description: "95% average in Math", icon: "🧮", date: "2024-01-05", xp: 350 },
    { id: 4, title: "Early Bird", description: "Joined EdUmbrella", icon: "🎓", date: "2024-01-01", xp: 100 }
  ];

  const stats = [
    { label: "Total XP", value: "2,450", icon: Trophy, color: "text-yellow-600" },
    { label: "Quizzes Completed", value: "34", icon: BookOpen, color: "text-blue-600" },
    { label: "Study Hours", value: "127", icon: Clock, color: "text-green-600" },
    { label: "Current Streak", value: "7 days", icon: Award, color: "text-purple-600" }
  ];

  // Shared dark input style
  const inputStyle = {
    background: 'rgba(15,22,41,0.8)',
    border: '1px solid rgba(99,102,241,0.25)',
    color: 'white',
    borderRadius: '0.75rem'
  };

  const DarkInput = ({ id, type = "text", value, onChange, disabled, placeholder, min, max }) => (
    <input
      id={id}
      type={type}
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 text-sm outline-none transition-all"
      style={{
        ...inputStyle,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'text'
      }}
      onFocus={e => { if (!disabled) e.target.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.3)'; }}
      onBlur={e => (e.target.style.boxShadow = 'none')}
    />
  );

  const FieldLabel = ({ children }) => (
    <label className="text-xs text-slate-400 font-medium block mb-1.5">{children}</label>
  );

  return (
    <SidebarProvider>
      <StudentSidebar />
      <SidebarInset>
        {/* Root wrapper */}
        <div className="min-h-screen dot-grid" style={{ background: '#080D1A' }}>

          {/* ── Sticky Header ── */}
          <header
            className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
            style={{
              background: 'rgba(8,13,26,0.95)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(124,58,237,0.15)'
            }}
          >
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-slate-400 hover:text-white" />
              <h1 className="text-xl font-sora font-bold gradient-text-violet flex items-center gap-2">
                <span>👤</span> Player Profile
              </h1>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="glass flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-violet-400 hover:text-violet-300 transition-all"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </header>

          <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">

            {/* ── Hero Card ── */}
            <div
              className="card-game p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(15,22,41,0.85) 60%, rgba(6,182,212,0.06) 100%)',
              }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-sora font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg,#7C3AED,#06B6D4)',
                      border: '3px solid rgba(124,58,237,0.6)',
                      boxShadow: '0 0 24px rgba(124,58,237,0.4)'
                    }}
                  >
                    {profileData.displayName.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Name + badges */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-sora font-bold text-white text-2xl leading-tight">
                    {profileData.displayName}
                  </h2>
                  <p className="text-slate-400 text-sm mt-0.5">
                    {profileData.firstName} {profileData.lastName}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#A78BFA' }}
                    >
                      <GraduationCap className="w-3 h-3" />
                      {profileData.grade}
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)', color: '#67E8F9' }}
                    >
                      <MapPin className="w-3 h-3" />
                      {profileData.location}
                    </span>
                    <span className="badge-gold">⭐ Level 8 Scholar</span>
                  </div>
                </div>

                {/* Quick stats row */}
                <div className="flex flex-wrap sm:flex-nowrap gap-3">
                  {[
                    { label: 'Quizzes', value: '32', color: '#7C3AED' },
                    { label: 'Avg Score', value: '88%', color: '#10B981' },
                    { label: 'Streak', value: '7🔥', color: '#F59E0B' },
                    { label: 'Badges', value: '8', color: '#06B6D4' },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center justify-center px-4 py-3 rounded-xl min-w-[64px]"
                      style={{ background: 'rgba(15,22,41,0.7)', border: '1px solid rgba(99,102,241,0.18)' }}
                    >
                      <span className="font-sora font-bold text-lg" style={{ color }}>{value}</span>
                      <span className="text-xs text-slate-500 mt-0.5">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Tabs ── */}
            <Tabs defaultValue="overview" className="space-y-5">
              {/* Tab strip */}
              <TabsList
                className="grid w-full grid-cols-4 p-1 gap-1"
                style={{
                  background: 'rgba(15,22,41,0.8)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: '0.75rem'
                }}
              >
                {['overview', 'edit', 'settings', 'achievements'].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="rounded-lg text-sm font-medium capitalize text-slate-400 data-[state=active]:text-white transition-all"
                    style={{ '--tw-ring-color': 'transparent' }}
                  >
                    {tab === 'overview' ? 'Overview' :
                     tab === 'edit' ? 'Edit Profile' :
                     tab === 'settings' ? 'Settings' : 'Achievements'}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* ─── OVERVIEW TAB ─── */}
              <TabsContent value="overview" className="space-y-5 animate-fade-in">
                {/* Bio */}
                <div className="card-game p-5">
                  <h4 className="font-sora font-bold text-white mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-violet-400" /> About Me
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{profileData.bio}</p>
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(99,102,241,0.12)' }}>
                    <span className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      Joined EdUmbrella on {new Date(profileData.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Quizzes', value: '34', icon: '📝', color: '#7C3AED' },
                    { label: 'Avg Score',     value: '83%', icon: '🎯', color: '#10B981' },
                    { label: 'Best Score',    value: '98%', icon: '🏆', color: '#F59E0B' },
                    { label: 'Time Spent',    value: '127h', icon: '⏱️', color: '#06B6D4' },
                  ].map(({ label, value, icon, color }) => (
                    <div key={label} className="card-game p-4 text-center">
                      <div className="text-2xl mb-2">{icon}</div>
                      <div className="font-sora font-bold text-2xl" style={{ color }}>{value}</div>
                      <div className="text-xs text-slate-500 mt-1">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent achievements */}
                <div className="card-game p-5">
                  <h4 className="font-sora font-bold text-white mb-4 flex items-center gap-2">
                    <span>🏆</span> Recent Achievements
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {achievements.map(a => (
                      <div
                        key={a.id}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ background: 'rgba(15,22,41,0.6)', border: '1px solid rgba(99,102,241,0.15)' }}
                      >
                        <span className="text-2xl">{a.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-white">{a.title}</div>
                          <div className="text-xs text-slate-500">{a.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* ─── EDIT PROFILE TAB ─── */}
              <TabsContent value="edit" className="animate-fade-in">
                <div className="card-game p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-sora font-bold text-white">Personal Information</h4>
                    {isEditing && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleCancel}
                          className="glass flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-all"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="btn-violet flex items-center gap-1.5 px-3 py-2 text-sm"
                        >
                          <Save className="w-3.5 h-3.5" /> Save
                        </button>
                      </div>
                    )}
                  </div>

                  {!isEditing ? (
                    // Read-only view
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { label: 'Display Name', value: profileData.displayName },
                          { label: 'Email', value: profileData.email },
                          { label: 'First Name', value: profileData.firstName },
                          { label: 'Last Name', value: profileData.lastName },
                          { label: 'Age', value: profileData.age },
                          { label: 'Grade', value: profileData.grade },
                          { label: 'Location', value: profileData.location },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <FieldLabel>{label}</FieldLabel>
                            <div
                              className="px-3 py-2.5 text-sm text-slate-300 rounded-xl"
                              style={{ background: 'rgba(15,22,41,0.5)', border: '1px solid rgba(99,102,241,0.15)' }}
                            >
                              {value}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <FieldLabel>Bio</FieldLabel>
                        <div
                          className="px-3 py-2.5 text-sm text-slate-300 rounded-xl leading-relaxed"
                          style={{ background: 'rgba(15,22,41,0.5)', border: '1px solid rgba(99,102,241,0.15)' }}
                        >
                          {profileData.bio}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 text-center pt-2">
                        Click "Edit Profile" in the header to make changes
                      </p>
                    </div>
                  ) : (
                    // Editable form
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FieldLabel>Display Name</FieldLabel>
                          <DarkInput
                            id="displayName"
                            value={editedData.displayName}
                            onChange={(e) => setEditedData(prev => ({ ...prev, displayName: e.target.value }))}
                          />
                        </div>
                        <div>
                          <FieldLabel>Email Address</FieldLabel>
                          <DarkInput
                            id="email"
                            type="email"
                            value={editedData.email}
                            onChange={(e) => setEditedData(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div>
                          <FieldLabel>First Name</FieldLabel>
                          <DarkInput
                            id="firstName"
                            value={editedData.firstName}
                            onChange={(e) => setEditedData(prev => ({ ...prev, firstName: e.target.value }))}
                          />
                        </div>
                        <div>
                          <FieldLabel>Last Name</FieldLabel>
                          <DarkInput
                            id="lastName"
                            value={editedData.lastName}
                            onChange={(e) => setEditedData(prev => ({ ...prev, lastName: e.target.value }))}
                          />
                        </div>
                        <div>
                          <FieldLabel>Age</FieldLabel>
                          <DarkInput
                            id="age"
                            type="number"
                            min="10"
                            max="25"
                            value={editedData.age}
                            onChange={(e) => setEditedData(prev => ({ ...prev, age: e.target.value }))}
                          />
                        </div>
                        <div>
                          <FieldLabel>Grade Level</FieldLabel>
                          <Select
                            value={editedData.grade}
                            onValueChange={(value) => setEditedData(prev => ({ ...prev, grade: value }))}
                          >
                            <SelectTrigger
                              className="rounded-xl text-sm"
                              style={inputStyle}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {grades.map((grade) => (
                                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-2">
                          <FieldLabel>Location</FieldLabel>
                          <Select
                            value={editedData.location.split(',')[0]}
                            onValueChange={(value) => setEditedData(prev => ({ ...prev, location: `${value}, Country` }))}
                          >
                            <SelectTrigger
                              className="rounded-xl text-sm"
                              style={inputStyle}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>{country}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <FieldLabel>Bio</FieldLabel>
                        <textarea
                          id="bio"
                          className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all resize-none"
                          style={inputStyle}
                          rows={3}
                          value={editedData.bio}
                          onChange={(e) => setEditedData(prev => ({ ...prev, bio: e.target.value }))}
                          onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.3)')}
                          onBlur={e => (e.target.style.boxShadow = 'none')}
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      {/* Save / Cancel bottom */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleCancel}
                          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 transition-all"
                          style={{ background: 'rgba(15,22,41,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="btn-violet flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                        >
                          <Save className="w-4 h-4" /> Save Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ─── SETTINGS TAB ─── */}
              <TabsContent value="settings" className="space-y-5 animate-fade-in">
                <div className="card-game p-6 space-y-6">

                  {/* Notifications */}
                  <div>
                    <h4 className="font-sora font-bold text-white mb-4 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-cyan-400" /> Notifications
                    </h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Quiz reminders', desc: 'Get notified before quiz deadlines' },
                        { label: 'Assignment updates', desc: 'Receive updates on new assignments' },
                        { label: 'Achievement notifications', desc: 'Celebrate your accomplishments' },
                        { label: 'Daily study reminders', desc: 'Stay on track with daily goals' },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between px-4 py-3 rounded-xl"
                          style={{ background: 'rgba(15,22,41,0.6)', border: '1px solid rgba(99,102,241,0.12)' }}
                        >
                          <div>
                            <div className="text-sm font-medium text-white">{item.label}</div>
                            <div className="text-xs text-slate-500">{item.desc}</div>
                          </div>
                          {/* Dark toggle */}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div
                              className="w-10 h-5 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:rounded-full after:transition-all after:bg-white"
                              style={{
                                background: 'rgba(99,102,241,0.3)',
                              }}
                            >
                              <style>{`.peer:checked ~ div { background: #7C3AED; }`}</style>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(99,102,241,0.12)' }} className="pt-6">
                    {/* Privacy */}
                    <h4 className="font-sora font-bold text-white mb-4 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-violet-400" /> Privacy
                    </h4>
                    <div
                      className="flex items-center justify-between px-4 py-3 rounded-xl mb-4"
                      style={{ background: 'rgba(15,22,41,0.6)', border: '1px solid rgba(99,102,241,0.12)' }}
                    >
                      <div>
                        <div className="text-sm font-medium text-white">Public Profile</div>
                        <div className="text-xs text-slate-500">Allow others to view your profile and achievements</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-10 h-5 rounded-full peer peer-checked:bg-violet-600 bg-slate-700 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5" />
                      </label>
                    </div>
                  </div>

                  {/* Appearance */}
                  <div style={{ borderTop: '1px solid rgba(99,102,241,0.12)' }} className="pt-6">
                    <h4 className="font-sora font-bold text-white mb-4 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-pink-400" /> Appearance
                    </h4>
                    <Select defaultValue="dark">
                      <SelectTrigger className="rounded-xl text-sm" style={inputStyle}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light Mode</SelectItem>
                        <SelectItem value="dark">Dark Mode</SelectItem>
                        <SelectItem value="system">System Default</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Danger Zone */}
                  <div style={{ borderTop: '1px solid rgba(239,68,68,0.2)' }} className="pt-6">
                    <h4 className="font-sora font-bold mb-4 flex items-center gap-2" style={{ color: '#FCA5A5' }}>
                      <AlertTriangle className="w-4 h-4" /> Danger Zone
                    </h4>
                    <div
                      className="p-4 rounded-xl"
                      style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)' }}
                    >
                      <div className="mb-3">
                        <div className="text-sm font-medium" style={{ color: '#FCA5A5' }}>Delete Account</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </div>
                      </div>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          background: 'rgba(239,68,68,0.15)',
                          border: '1px solid rgba(239,68,68,0.35)',
                          color: '#FCA5A5'
                        }}
                        onMouseEnter={e => (e.target.style.background = 'rgba(239,68,68,0.25)')}
                        onMouseLeave={e => (e.target.style.background = 'rgba(239,68,68,0.15)')}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ─── ACHIEVEMENTS TAB ─── */}
              <TabsContent value="achievements" className="animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {achievements.map(a => (
                    <div key={a.id} className="card-game p-4 flex flex-col items-center text-center gap-2">
                      <div className="text-4xl mb-1">{a.icon}</div>
                      <div className="font-sora font-bold text-white text-sm">{a.title}</div>
                      <div className="text-xs text-slate-500">{a.description}</div>
                      <div className="text-xs text-slate-600">{new Date(a.date).toLocaleDateString()}</div>
                      <span className="badge-xp mt-1">+{a.xp} XP</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* ── Delete Confirm Modal ── */}
          {showDeleteConfirm && (
            <div
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
              style={{ background: 'rgba(0,0,0,0.75)' }}
            >
              <div className="card-game w-full max-w-md p-6 animate-bounce-in">
                <div className="flex flex-col items-center text-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)' }}
                  >
                    <AlertTriangle className="w-7 h-7" style={{ color: '#FCA5A5' }} />
                  </div>

                  <div>
                    <h3 className="font-sora font-bold text-white text-lg">Delete Account?</h3>
                    <p className="text-slate-400 text-sm mt-1">
                      This action is irreversible. All your quests, achievements, and progress will be permanently lost.
                    </p>
                  </div>

                  <div
                    className="w-full p-3 rounded-xl"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                  >
                    <p className="text-xs mb-2" style={{ color: '#FCA5A5' }}>
                      Type <strong>DELETE</strong> to confirm:
                    </p>
                    <input
                      className="w-full px-3 py-2 text-sm rounded-lg outline-none"
                      style={{
                        background: 'rgba(15,22,41,0.8)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        color: 'white'
                      }}
                      placeholder="Type DELETE to confirm"
                      onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(239,68,68,0.25)')}
                      onBlur={e => (e.target.style.boxShadow = 'none')}
                    />
                  </div>

                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 transition-all"
                      style={{ background: 'rgba(15,22,41,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                      style={{
                        background: 'rgba(239,68,68,0.2)',
                        border: '1px solid rgba(239,68,68,0.4)',
                        color: '#FCA5A5'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.35)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.2)')}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Profile;
