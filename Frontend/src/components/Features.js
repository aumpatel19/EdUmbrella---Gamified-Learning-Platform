import { BarChart3, BookOpen, GamepadIcon, TrendingUp } from "lucide-react";

const features = [
  { icon: GamepadIcon, title: "Gamified Learning", desc: "Earn XP, collect badges, and compete on leaderboards while mastering CBSE topics.", color: "bg-amber-100 text-amber-600" },
  { icon: BookOpen, title: "Video Lectures", desc: "CBSE-aligned videos available in English and Hindi for every chapter.", color: "bg-blue-100 text-blue-600" },
  { icon: TrendingUp, title: "Smart Quizzes", desc: "Adaptive quizzes that match your level and help you improve your weak areas.", color: "bg-emerald-100 text-emerald-600" },
  { icon: BarChart3, title: "Progress Tracking", desc: "Detailed analytics for both students and teachers to monitor growth.", color: "bg-purple-100 text-purple-600" },
];

const Features = () => (
  <section id="features" className="py-20 bg-[#F8FAFC]">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] font-jakarta mb-4">Why EdUmbrella?</h2>
        <p className="text-[#64748B] max-w-xl mx-auto">Built for both students and teachers with tools that actually make learning stick.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {features.map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-[#1E293B] text-lg mb-2 font-jakarta">{title}</h3>
            <p className="text-[#64748B] text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
export default Features;
