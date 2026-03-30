import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import heroImage from "../assets/hero-illustration.jpg";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="min-h-screen bg-white flex items-center pt-16">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#EFF6FF] text-[#1D4ED8] text-sm font-medium px-3 py-1 rounded-full">
                CBSE Classes 6–12
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1E293B] leading-tight font-jakarta">
                Learn Smarter,<br />
                <span className="text-[#1D4ED8]">Score Higher</span>
              </h1>
              <p className="text-lg text-[#64748B] max-w-lg">
                India's most engaging CBSE learning platform with gamified quizzes, video lectures, and real-time progress tracking.
              </p>
            </div>
            <div className="space-y-3">
              {["Gamified quizzes for Classes 6-12","Video lectures in multiple languages","Real-time progress & leaderboards"].map(f => (
                <div key={f} className="flex items-center gap-2 text-[#64748B]">
                  <CheckCircle className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate('/auth')} className="bg-[#1D4ED8] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Start Learning Free</button>
              <button onClick={() => navigate('/auth')} className="border border-[#F59E0B] text-[#F59E0B] px-6 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors">For Teachers</button>
            </div>
          </div>
          <div className="relative animate-float">
            <img src={heroImage} alt="EdUmbrella learning platform" className="w-full h-auto rounded-2xl shadow-xl" />
          </div>
        </div>
        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-3 gap-8 bg-[#F8FAFC] rounded-2xl p-8 border border-[#E2E8F0]">
          {[["10,000+","Students"],["500+","Quizzes"],["Classes 6–12","CBSE Curriculum"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-[#1D4ED8] font-jakarta">{num}</div>
              <div className="text-sm text-[#64748B]">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Hero;
