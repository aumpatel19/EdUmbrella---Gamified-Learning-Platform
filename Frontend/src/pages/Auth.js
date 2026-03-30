import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../api";

const Auth = () => {
  const [isTeacher, setIsTeacher] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("6");
  const navigate = useNavigate();

const handleAuth = async (e) => {
  e.preventDefault(); // stop page reload

  // Demo credentials for offline login
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
    // Check demo credentials first
    const userList = isTeacher ? demoCredentials.teachers : demoCredentials.students;
    const demoUser = userList.find(u => u.email === email && u.password === password);

    if (demoUser) {
      // Demo login successful
      console.log("Demo login successful:", demoUser);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name || demoUser.name || "User");
      localStorage.setItem("userType", isTeacher ? "teacher" : "student");
      if (!isTeacher) {
        localStorage.setItem("studentClass", demoUser.class || studentClass);
      }
      navigate(isTeacher ? "/teacher-dashboard" : "/student-dashboard");
      return;
    }

    // If demo credentials don't match, try API
    const data = isTeacher
      ? await ApiService.loginTeacher(email, password)
      : await ApiService.loginStudent(email, password);

    console.log("Login successful:", data);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", name || data.user?.username || "User");
    localStorage.setItem("userType", isTeacher ? "teacher" : "student");
    if (!isTeacher) {
      localStorage.setItem("studentClass", studentClass);
    }
    navigate(isTeacher ? "/teacher-dashboard" : "/student-dashboard");
  } catch (error) {
    console.error("Login failed:", error.message || error);
    alert("Login failed! Please use demo credentials:\nStudent: student@edumbrella.com / student123\nTeacher: teacher@edumbrella.com / teacher123");
  }
};


  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#EFF6FF] flex-col p-12">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-[#1D4ED8] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="font-bold text-[#1E293B] font-jakarta">EdUmbrella</span>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-[#1E293B] font-jakarta mb-4">Join 10,000+ CBSE students learning smarter.</h2>
          <div className="space-y-4 mt-6">
            {["Gamified quizzes for Classes 6-12","Video lectures in multiple languages","Real-time progress & leaderboards"].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-[#475569] text-sm">{f}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-white rounded-xl border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B] font-medium mb-2">Demo Credentials</p>
            <p className="text-xs text-[#64748B]">Student: student6a@school.com / student123</p>
            <p className="text-xs text-[#64748B]">Teacher: teacher6@school.com / teacher123</p>
          </div>
        </div>
      </div>
      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B] font-jakarta">Welcome Back</h1>
            <p className="text-[#64748B] text-sm mt-1">Sign in to your account</p>
          </div>
          {/* Student/Teacher toggle */}
          <div className="flex bg-[#F1F5F9] rounded-lg p-1">
            <button
              type="button"
              onClick={() => setIsTeacher(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isTeacher ? 'bg-[#1D4ED8] text-white shadow-sm' : 'text-[#64748B]'}`}
            >Student</button>
            <button
              type="button"
              onClick={() => setIsTeacher(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isTeacher ? 'bg-[#1D4ED8] text-white shadow-sm' : 'text-[#64748B]'}`}
            >Teacher</button>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E293B]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E293B]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent"
              />
            </div>
            {!isTeacher && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#1E293B]">Class</label>
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                >
                  {["6","7","8","9","10","11","12"].map(c => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
            )}
            <button type="submit" className="w-full py-3 bg-[#1D4ED8] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Sign In as {isTeacher ? "Teacher" : "Student"}
            </button>
          </form>
          <div className="text-center">
            <button type="button" onClick={() => navigate("/")} className="text-sm text-[#64748B] hover:text-[#1D4ED8] transition-colors">Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
