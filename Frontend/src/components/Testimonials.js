import { Star, Quote } from "lucide-react";
import studentAvatar from "../assets/student-avatar.jpg";
import teacherAvatar from "../assets/teacher-avatar.jpg";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Grade 10 Student",
    avatar: studentAvatar,
    content: "Learning feels like a game now! I've improved my grades while having fun. The XP system makes me want to study more every day.",
    rating: 5,
    badge: "Top 5% Student",
    glow: "99,102,241",
    badgeColor: "from-[#6366F1] to-[#8B5CF6]",
    xp: "+3,450 XP",
  },
  {
    name: "Mr. Rodriguez",
    role: "Math Teacher",
    avatar: teacherAvatar,
    content: "Finally a platform where I can track student performance and assign quizzes easily. The analytics are incredibly helpful.",
    rating: 5,
    badge: "Verified Educator",
    glow: "16,185,129",
    badgeColor: "from-[#10B981] to-[#059669]",
    xp: "32 Students",
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 relative overflow-hidden" style={{background: 'linear-gradient(180deg, #0A0F1E 0%, #080D1A 100%)'}}>
      <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 mb-6">
            <Star className="w-3.5 h-3.5 text-[#FBBF24] fill-[#FBBF24]" />
            <span className="text-[#FBBF24] text-sm font-medium">Player Reviews</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-jakarta mb-4">
            Loved by Students
            <br />
            <span className="gradient-text-gold">& Teachers Alike</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
            Don't take our word for it — hear from the players themselves.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="relative rounded-2xl p-6 border overflow-hidden group hover:scale-[1.02] transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(15,22,41,0.95) 0%, rgba(10,15,30,0.98) 100%)',
                borderColor: `rgba(${t.glow},0.2)`,
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 30px rgba(${t.glow},0.2), 0 0 60px rgba(${t.glow},0.08)`; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer-bg" />

              {/* Quote icon */}
              <Quote className="w-8 h-8 mb-4 opacity-20" style={{color: `rgba(${t.glow},1)`}} />

              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#FBBF24] text-[#FBBF24]" />
                ))}
              </div>

              <p className="text-[#CBD5E1] leading-relaxed mb-6 text-base">
                "{t.content}"
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={`${t.name} profile`}
                    className="w-10 h-10 rounded-full object-cover border-2"
                    style={{borderColor: `rgba(${t.glow},0.5)`}}
                  />
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-[#64748B]">{t.role}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold bg-gradient-to-r ${t.badgeColor} text-white`}>
                    {t.badge}
                  </span>
                  <span className="text-xs font-medium" style={{color: `rgba(${t.glow},1)`}}>{t.xp}</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-15 group-hover:opacity-30 transition-opacity"
                style={{background: `radial-gradient(circle, rgba(${t.glow},1), transparent)`}} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
