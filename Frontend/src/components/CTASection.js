import { ArrowRight, Zap, Trophy, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden" style={{background: '#080D1A'}}>
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-[0.05]" style={{backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />

      {/* Glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-10" style={{background: 'radial-gradient(ellipse, #6366F1, transparent)'}} />
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-8" style={{background: 'radial-gradient(circle, #8B5CF6, transparent)'}} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-8" style={{background: 'radial-gradient(circle, #06B6D4, transparent)'}} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Achievement unlocked bar */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-[#F59E0B]/30 animate-bounce-in" style={{background: 'rgba(245,158,11,0.1)'}}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Achievement Unlocked</p>
              <p className="text-sm font-bold text-[#FBBF24]">Ready to Level Up! 🎉</p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white font-jakarta leading-tight">
              Your Learning
              <br />
              <span className="gradient-text-purple">Adventure Awaits</span>
            </h2>
            <p className="text-lg text-[#94A3B8] max-w-xl mx-auto">
              Join 10,000+ students already earning XP, climbing leaderboards, and crushing their CBSE exams.
            </p>
          </div>

          {/* Stats pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: <Zap className="w-3.5 h-3.5" />, label: "Free to Start", color: "border-[#6366F1]/30 bg-[#6366F1]/10 text-[#A78BFA]" },
              { icon: <Flame className="w-3.5 h-3.5" />, label: "Daily Streaks", color: "border-[#F97316]/30 bg-[#F97316]/10 text-[#FB923C]" },
              { icon: <Trophy className="w-3.5 h-3.5" />, label: "Real Rewards", color: "border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#FBBF24]" },
            ].map(({ icon, label, color }) => (
              <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium ${color}`}>
                {icon} {label}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <button
              onClick={() => navigate("/auth")}
              className="relative group inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-white text-base overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] group-hover:from-[#4F46E5] group-hover:to-[#7C3AED] transition-all duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse-glow" />
              <span className="relative flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Start Playing Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-[#A78BFA] border border-[#6366F1]/40 hover:border-[#6366F1]/70 hover:bg-[#6366F1]/10 transition-all duration-300 text-base backdrop-blur-sm"
            >
              I'm a Teacher →
            </button>
          </div>

          <p className="text-xs text-[#475569]">No credit card required · Free forever for students</p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
