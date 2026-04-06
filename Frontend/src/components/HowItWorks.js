import { UserPlus, BookOpen, Trophy, ChevronRight } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    num: "01",
    title: "Create Your Account",
    desc: "Sign up as a student or teacher in under 60 seconds. No credit card needed.",
    color: "from-[#6366F1] to-[#8B5CF6]",
    glow: "99,102,241",
    badge: "Start Here",
  },
  {
    icon: BookOpen,
    num: "02",
    title: "Choose Your Quest",
    desc: "Browse CBSE subjects, pick your class, and dive into gamified content made for you.",
    color: "from-[#06B6D4] to-[#0EA5E9]",
    glow: "6,182,212",
    badge: "Explore",
  },
  {
    icon: Trophy,
    num: "03",
    title: "Level Up & Win",
    desc: "Earn XP, unlock achievements, top the leaderboards. Learning has never felt this rewarding.",
    color: "from-[#F59E0B] to-[#F97316]",
    glow: "245,158,11",
    badge: "Compete",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden" style={{background: '#0A0F1E'}}>
      <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage: 'linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />

      {/* Glow blobs */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-5" style={{background: '#6366F1'}} />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-5" style={{background: '#06B6D4'}} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#06B6D4] animate-ping" />
            <span className="text-[#22D3EE] text-sm font-medium">Simple to Start</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-jakarta mb-4">
            Your Journey to the
            <br />
            <span style={{background: 'linear-gradient(135deg, #22D3EE, #60A5FA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>Top of the Board</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">Three steps to transform how you study forever.</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="absolute top-16 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-0.5 hidden lg:block" style={{background: 'linear-gradient(90deg, rgba(99,102,241,0.5), rgba(6,182,212,0.5), rgba(245,158,11,0.5))'}} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center group">
                {/* Step number orb */}
                <div className="relative mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-all duration-300`}
                    style={{boxShadow: `0 0 30px rgba(${step.glow},0.4)`}}
                  >
                    <step.icon className="w-7 h-7" />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-[#0A0F1E]"
                    style={{background: `linear-gradient(135deg, rgba(${step.glow},1), rgba(${step.glow},0.7))`}}
                  >
                    {index + 1}
                  </div>
                  {/* Glow ring */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -z-10"
                    style={{background: `rgba(${step.glow},0.3)`}} />
                </div>

                {/* Badge */}
                <div className="mb-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold bg-gradient-to-r ${step.color} text-white`}>
                    Step {step.num} · {step.badge}
                  </span>
                </div>

                <h3 className="text-white font-bold text-xl font-jakarta mb-2">{step.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed max-w-xs">{step.desc}</p>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="absolute -right-4 top-16 hidden lg:block text-[#1E2D4A]">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
