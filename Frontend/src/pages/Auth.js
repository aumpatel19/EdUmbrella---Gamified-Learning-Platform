import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../api";
import { Zap, Trophy, Flame, Star, GraduationCap, Users } from "lucide-react";

const Auth = () => {
  const [isTeacher, setIsTeacher] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("6");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();

    const demoCredentials = {
      students: [
        { email: 'student6a@school.com', password: 'student123', name: 'Alice Johnson', class: '6' },
        { email: 'student7a@school.com', password: 'student123', name: 'Charlie Brown', class: '7' },
        { email: 'student8a@school.com', password: 'student123', name: 'Diana Ross', class: '8' },
        { email: 'student10a@school.com', password: 'student123', name: 'Eve Wilson', class: '10' },
        { email: 'student12a@school.com', password: 'student123', name: 'Frank Miller', class: '12' },
        { email: 'student@edumbrella.com', password: 'student123', name: 'John Doe', class: '10' },
      ],
      teachers: [
        { email: 'teacher6@school.com', password: 'teacher123', name: 'Ms. Anderson' },
        { email: 'teacher8@school.com', password: 'teacher123', name: 'Mr. Thompson' },
        { email: 'teacher10@school.com', password: 'teacher123', name: 'Dr. Williams' },
        { email: 'teacher@edumbrella.com', password: 'teacher123', name: 'Jane Smith' },
      ]
    };

    try {
      const userList = isTeacher ? demoCredentials.teachers : demoCredentials.students;
      const demoUser = userList.find(u => u.email === email && u.password === password);

      if (demoUser) {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", name || demoUser.name || "User");
        localStorage.setItem("userType", isTeacher ? "teacher" : "student");
        if (!isTeacher) {
          localStorage.setItem("studentClass", demoUser.class || studentClass);
        }
        navigate(isTeacher ? "/teacher-dashboard" : "/student-dashboard");
        return;
      }

      const data = isTeacher
        ? await ApiService.loginTeacher(email, password)
        : await ApiService.loginStudent(email, password);

      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name || data.user?.username || "User");
      localStorage.setItem("userType", isTeacher ? "teacher" : "student");
      if (!isTeacher) {
        localStorage.setItem("studentClass", studentClass);
      }
      navigate(isTeacher ? "/teacher-dashboard" : "/student-dashboard");
    } catch (error) {
      alert("Login failed! Please use demo credentials:\nStudent: student@edumbrella.com / student123\nTeacher: teacher@edumbrella.com / teacher123");
    }
  };

  return (
    <div className="min-h-screen flex" style={{background: '#080D1A'}}>
      {/* Left panel — gaming showcase */}
      <div className="hidden lg:flex lg:w-1/2 flex-col p-12 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #0D1B3E 0%, #12064A 50%, #0A0F1E 100%)'}}>
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)', backgroundSize: '50px 50px'}} />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl opacity-15" style={{background: 'radial-gradient(circle, #6366F1, transparent)'}} />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background: 'linear-gradient(135deg, #6366F1, #8B5CF6)'}}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white font-jakarta text-lg">
              Ed<span className="gradient-text-purple">Umbrella</span>
            </span>
          </div>

          <h2 className="text-4xl font-bold text-white font-jakarta mb-3 leading-tight">
            Enter The
            <br />
            <span className="gradient-text-purple">Learning Arena</span>
          </h2>
          <p className="text-[#94A3B8] mb-8">Join 10,000+ CBSE students levelling up every day.</p>

          {/* Feature list */}
          <div className="space-y-4 mb-8">
            {[
              { icon: <Zap className="w-4 h-4" />, label: "Gamified quizzes for Classes 6–12", color: "text-[#A78BFA]", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.25)" },
              { icon: <Trophy className="w-4 h-4" />, label: "Live leaderboards & XP system", color: "text-[#FBBF24]", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
              { icon: <Flame className="w-4 h-4" />, label: "Daily streaks & achievements", color: "text-[#FB923C]", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.25)" },
              { icon: <Star className="w-4 h-4" />, label: "Video lectures in multiple languages", color: "text-[#34D399]", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)" },
            ].map(({ icon, label, color, bg, border }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background: bg, border: `1px solid ${border}`}}>
                  <span className={color}>{icon}</span>
                </div>
                <span className="text-[#CBD5E1] text-sm">{label}</span>
              </div>
            ))}
          </div>

          {/* Demo credentials card */}
          <div className="rounded-xl p-4 border border-[#6366F1]/20" style={{background: 'rgba(99,102,241,0.08)'}}>
            <p className="text-xs text-[#A78BFA] font-semibold mb-2 flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> Demo Credentials
            </p>
            <div className="space-y-1">
              <p className="text-xs text-[#64748B] font-mono">Student: student6a@school.com / student123</p>
              <p className="text-xs text-[#64748B] font-mono">Teacher: teacher6@school.com / teacher123</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{background: '#080D1A'}}>
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden mb-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background: 'linear-gradient(135deg, #6366F1, #8B5CF6)'}}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white font-jakarta">EdUmbrella</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white font-jakarta">Welcome Back, Player</h1>
            <p className="text-[#64748B] text-sm mt-1">Sign in to continue your adventure</p>
          </div>

          {/* Student/Teacher toggle */}
          <div className="flex rounded-xl p-1 border border-[#1E2D4A]" style={{background: '#0F1629'}}>
            <button
              type="button"
              onClick={() => setIsTeacher(false)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200"
              style={!isTeacher ? {background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: 'white', boxShadow: '0 0 15px rgba(99,102,241,0.4)'} : {color: '#64748B'}}
            >
              <GraduationCap className="w-4 h-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setIsTeacher(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200"
              style={isTeacher ? {background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', boxShadow: '0 0 15px rgba(16,185,129,0.4)'} : {color: '#64748B'}}
            >
              <Users className="w-4 h-4" />
              Teacher
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#CBD5E1]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-[#475569] focus:outline-none focus:ring-2 transition-all"
                style={{
                  background: '#0F1629',
                  border: '1px solid #1E2D4A',
                  focusRingColor: '#6366F1',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.2)'; }}
                onBlur={e => { e.target.style.borderColor = '#1E2D4A'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#CBD5E1]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-[#475569] focus:outline-none transition-all"
                style={{background: '#0F1629', border: '1px solid #1E2D4A'}}
                onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.2)'; }}
                onBlur={e => { e.target.style.borderColor = '#1E2D4A'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {!isTeacher && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#CBD5E1]">Your Class</label>
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none transition-all"
                  style={{background: '#0F1629', border: '1px solid #1E2D4A'}}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; }}
                  onBlur={e => { e.target.style.borderColor = '#1E2D4A'; }}
                >
                  {["6","7","8","9","10","11","12"].map(c => (
                    <option key={c} value={c} style={{background: '#0F1629'}}>Class {c}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 font-bold text-white rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-sm flex items-center justify-center gap-2"
              style={{
                background: isTeacher
                  ? 'linear-gradient(135deg, #10B981, #059669)'
                  : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                boxShadow: isTeacher
                  ? '0 0 20px rgba(16,185,129,0.4)'
                  : '0 0 20px rgba(99,102,241,0.4)',
              }}
            >
              <Zap className="w-4 h-4" />
              {isTeacher ? "Enter Teacher Portal" : "Start Your Adventure"}
            </button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm text-[#475569] hover:text-[#A78BFA] transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
