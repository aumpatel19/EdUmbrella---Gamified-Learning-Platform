import { UserPlus, BookOpen, Trophy } from "lucide-react";

const steps = [
  { icon: UserPlus, num: "1", title: "Sign Up", desc: "Create your account as a student or teacher in under a minute.", color: "bg-blue-100 text-[#1D4ED8]" },
  { icon: BookOpen, num: "2", title: "Choose Your Subject", desc: "Browse CBSE subjects and class-specific content curated for you.", color: "bg-amber-100 text-[#F59E0B]" },
  { icon: Trophy, num: "3", title: "Learn & Play", desc: "Attempt quizzes, play games, watch lectures and track your rank.", color: "bg-emerald-100 text-[#10B981]" },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] font-jakarta mb-4">How It Works</h2>
        <p className="text-[#64748B] max-w-xl mx-auto">Three simple steps to transform your learning experience</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map(({ icon: Icon, num, title, desc, color }, i) => (
          <div key={title} className="text-center space-y-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${color}`}>
              <Icon className="w-8 h-8" />
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto font-bold text-white text-sm ${i===0?'bg-[#1D4ED8]':i===1?'bg-[#F59E0B]':'bg-[#10B981]'}`}>{num}</div>
            <h3 className="font-semibold text-[#1E293B] text-lg font-jakarta">{title}</h3>
            <p className="text-[#64748B] text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
export default HowItWorks;
