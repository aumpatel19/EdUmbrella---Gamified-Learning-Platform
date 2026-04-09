import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../api";
import { Trophy, Flame, Star, GraduationCap, Users, UserPlus, LogIn, Gamepad2 } from "lucide-react";
import EdUmbrellaLogo from "../components/EdUmbrellaLogo";

const inputStyle = {
  background: '#0F1629',
  border: '1px solid #1E2D4A',
};
const inputFocus = (e) => {
  e.target.style.borderColor = 'rgba(99,102,241,0.5)';
  e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.2)';
};
const inputBlur = (e) => {
  e.target.style.borderColor = '#1E2D4A';
  e.target.style.boxShadow = 'none';
};
const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-[#475569] focus:outline-none transition-all";

const Auth = () => {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [isTeacher, setIsTeacher] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("6");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const accentGrad = isTeacher
    ? 'linear-gradient(135deg, #10B981, #059669)'
    : 'linear-gradient(135deg, #6366F1, #8B5CF6)';
  const accentGlow = isTeacher
    ? '0 0 20px rgba(16,185,129,0.4)'
    : '0 0 20px rgba(99,102,241,0.4)';

  const switchMode = (m) => {
    setMode(m);
    setErrorMsg("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          setErrorMsg("Passwords don't match.");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg("Password must be at least 6 characters.");
          setLoading(false);
          return;
        }
        const data = await ApiService.signUp(email, password, name, isTeacher ? "teacher" : "student", isTeacher ? "" : studentClass);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", data.user?.name || email);
        localStorage.setItem("userType", isTeacher ? "teacher" : "student");
        localStorage.setItem("studentClass", data.user?.class || studentClass);
        navigate(isTeacher ? "/teacher-dashboard" : "/student-dashboard");
      } else {
        const data = isTeacher
          ? await ApiService.loginTeacher(email, password)
          : await ApiService.loginStudent(email, password);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", data.user?.name || data.user?.username || email);
        localStorage.setItem("userType", isTeacher ? "teacher" : "student");
        localStorage.setItem("studentClass", data.user?.class || studentClass);
        navigate(isTeacher ? "/teacher-dashboard" : "/student-dashboard");
      }
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{background: '#080D1A'}}>

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col p-12 relative overflow-hidden"
        style={{background: 'linear-gradient(135deg, #0D1B3E 0%, #12064A 50%, #0A0F1E 100%)'}}>
        <div className="absolute inset-0 opacity-[0.06]"
          style={{backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)', backgroundSize: '50px 50px'}} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{background: 'radial-gradient(circle, #6366F1, transparent)'}} />

        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-12">
            <EdUmbrellaLogo size={40} withText />
          </div>

          <h2 className="text-4xl font-bold text-white font-jakarta mb-3 leading-tight">
            Enter The<br />
            <span className="gradient-text-purple">Learning Arena</span>
          </h2>
          <p className="text-[#94A3B8] mb-8">Join 10,000+ CBSE students levelling up every day.</p>

          <div className="space-y-4 mb-8">
            {[
              { icon: <Gamepad2 className="w-4 h-4" />, label: "Gamified quizzes for Classes 6–12", color: "text-[#A78BFA]", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.25)" },
              { icon: <Trophy className="w-4 h-4" />, label: "Live leaderboards & XP system", color: "text-[#FBBF24]", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
              { icon: <Flame className="w-4 h-4" />, label: "Daily streaks & achievements", color: "text-[#FB923C]", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.25)" },
              { icon: <Star className="w-4 h-4" />, label: "Video lectures in multiple languages", color: "text-[#34D399]", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)" },
            ].map(({ icon, label, color, bg, border }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{background: bg, border: `1px solid ${border}`}}>
                  <span className={color}>{icon}</span>
                </div>
                <span className="text-[#CBD5E1] text-sm">{label}</span>
              </div>
            ))}
          </div>

          {/* Demo card */}
          <div className="rounded-xl p-4 border border-[#6366F1]/20" style={{background: 'rgba(99,102,241,0.08)'}}>
            <p className="text-xs text-[#A78BFA] font-semibold mb-2 flex items-center gap-1.5">
              <Star className="w-3 h-3" /> Demo Credentials
            </p>
            <div className="space-y-1">
              <p className="text-xs text-[#64748B] font-mono">Student: student@edumbrella.com / student123</p>
              <p className="text-xs text-[#64748B] font-mono">Teacher: teacher@edumbrella.com / teacher123</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto" style={{background: '#080D1A'}}>
        <div className="w-full max-w-md space-y-5">

          {/* Mobile logo */}
          <div className="lg:hidden">
            <EdUmbrellaLogo size={32} withText />
          </div>

          {/* Login / Sign Up tab switcher */}
          <div className="flex rounded-xl p-1 border border-[#1E2D4A]" style={{background: '#0D1425'}}>
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200"
              style={mode === "login"
                ? {background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: 'white', boxShadow: '0 0 15px rgba(99,102,241,0.35)'}
                : {color: '#64748B'}}
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200"
              style={mode === "signup"
                ? {background: 'linear-gradient(135deg, #06B6D4, #0891B2)', color: 'white', boxShadow: '0 0 15px rgba(6,182,212,0.35)'}
                : {color: '#64748B'}}
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </button>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl font-bold text-white font-jakarta">
              {mode === "login" ? "Welcome Back, Player" : "Create Your Account"}
            </h1>
            <p className="text-[#64748B] text-sm mt-1">
              {mode === "login" ? "Sign in to continue your adventure" : "Join the learning arena today"}
            </p>
          </div>

          {/* Student / Teacher toggle */}
          <div className="flex rounded-xl p-1 border border-[#1E2D4A]" style={{background: '#0F1629'}}>
            <button type="button" onClick={() => setIsTeacher(false)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200"
              style={!isTeacher ? {background: accentGrad, color: 'white', boxShadow: accentGlow} : {color: '#64748B'}}>
              <GraduationCap className="w-4 h-4" /> Student
            </button>
            <button type="button" onClick={() => setIsTeacher(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200"
              style={isTeacher ? {background: accentGrad, color: 'white', boxShadow: accentGlow} : {color: '#64748B'}}>
              <Users className="w-4 h-4" /> Teacher
            </button>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="px-4 py-3 rounded-xl text-sm text-red-300 border border-red-500/30"
              style={{background: 'rgba(239,68,68,0.08)'}}>
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name — sign up only */}
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#CBD5E1]">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className={inputClass}
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#CBD5E1]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className={inputClass}
                style={inputStyle}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#CBD5E1]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "Min. 6 characters" : "Enter your password"}
                required
                className={inputClass}
                style={inputStyle}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </div>

            {/* Confirm password — sign up only */}
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#CBD5E1]">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  className={inputClass}
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>
            )}

            {/* Class — students only */}
            {!isTeacher && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#CBD5E1]">Your Class</label>
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#1E2D4A'; }}
                >
                  {["6","7","8","9","10","11","12"].map(c => (
                    <option key={c} value={c} style={{background: '#0F1629'}}>Class {c}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 font-bold text-white rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{background: accentGrad, boxShadow: accentGlow}}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "signup" ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                  {mode === "signup"
                    ? (isTeacher ? "Create Teacher Account" : "Join the Arena")
                    : (isTeacher ? "Enter Teacher Portal" : "Start Your Adventure")}
                </>
              )}
            </button>
          </form>

          {/* Switch mode hint */}
          <p className="text-center text-sm text-[#475569]">
            {mode === "login" ? "New here? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              className="font-semibold transition-colors"
              style={{color: '#A78BFA'}}
              onMouseEnter={e => e.target.style.color = '#C4B5FD'}
              onMouseLeave={e => e.target.style.color = '#A78BFA'}
            >
              {mode === "login" ? "Create an account" : "Sign in instead"}
            </button>
          </p>

          <div className="text-center">
            <button type="button" onClick={() => navigate("/")}
              className="text-sm text-[#475569] hover:text-[#A78BFA] transition-colors">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
