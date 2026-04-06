import { Gamepad2, Trophy, BookOpen, BarChart3, Zap, Star } from "lucide-react";

const features = [
  {
    icon: <Gamepad2 className="w-6 h-6" />,
    title: "Gamified Quizzes",
    description: "Earn XP, level up, and unlock achievements as you master each subject. Every quiz is a new boss battle.",
    color: "from-[#6366F1] to-[#8B5CF6]",
    glow: "99,102,241",
    border: "border-[#6366F1]/20",
    badge: "Most Popular",
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "Live Leaderboards",
    description: "Compete with classmates in real-time. Rise through the ranks and claim your spot at the top.",
    color: "from-[#F59E0B] to-[#F97316]",
    glow: "245,158,11",
    border: "border-[#F59E0B]/20",
    badge: "Competitive",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Video Lectures",
    description: "Multi-language video content crafted for CBSE. Watch, learn, and level up your knowledge.",
    color: "from-[#06B6D4] to-[#0EA5E9]",
    glow: "6,182,212",
    border: "border-[#06B6D4]/20",
    badge: "Multi-Language",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Progress Analytics",
    description: "Real-time stats, streaks, and deep insights into your learning journey. Know exactly where you stand.",
    color: "from-[#10B981] to-[#059669]",
    glow: "16,185,129",
    border: "border-[#10B981]/20",
    badge: "Data Driven",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden" style={{background: 'linear-gradient(180deg, #080D1A 0%, #0A0F1E 100%)'}}>
      <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 mb-6">
            <Star className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span className="text-[#A78BFA] text-sm font-medium">Why Students Love EdUmbrella</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-jakarta mb-4">
            Learning That Feels Like
            <br />
            <span className="gradient-text-purple">Playing a Game</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Every feature is designed to keep you engaged, motivated, and progressing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative group rounded-2xl p-6 border ${feature.border} overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1`}
              style={{background: 'linear-gradient(135deg, rgba(15,22,41,0.9) 0%, rgba(10,15,30,0.95) 100%)'}}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 30px rgba(${feature.glow},0.3), 0 0 60px rgba(${feature.glow},0.1)`; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer-bg" />

              <div className="absolute top-4 right-4">
                <span className={`text-xs px-2 py-1 rounded-md font-medium bg-gradient-to-r ${feature.color} text-white`}>
                  {feature.badge}
                </span>
              </div>

              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                style={{boxShadow: `0 4px 20px rgba(${feature.glow},0.4)`}}
              >
                {feature.icon}
              </div>

              <h3 className="text-white font-bold text-lg font-jakarta mb-2">{feature.title}</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">{feature.description}</p>

              <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                style={{background: `radial-gradient(circle, rgba(${feature.glow},1), transparent)`}} />

              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#A78BFA]">
                <Zap className="w-3 h-3" />
                <span>Learn More →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
