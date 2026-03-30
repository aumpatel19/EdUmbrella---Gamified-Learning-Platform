import { Star } from "lucide-react";
import studentAvatar from "../assets/student-avatar.jpg";
import teacherAvatar from "../assets/teacher-avatar.jpg";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Grade 10 Student",
    avatar: studentAvatar,
    content: "Learning feels like a game now! I've improved my grades while having fun. The XP system makes me want to study more.",
    rating: 5,
  },
  {
    name: "Mr. Rodriguez",
    role: "Math Teacher",
    avatar: teacherAvatar,
    content: "Finally a platform where I can track student performance and assign quizzes easily. The analytics are incredibly helpful.",
    rating: 5,
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] font-jakarta mb-4">
            Loved by Students & Teachers
          </h2>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            See what our community says about their learning journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>

              <p className="text-[#475569] leading-relaxed mb-6 text-base">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={`${testimonial.name} profile`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-[#1E293B] text-sm">{testimonial.name}</div>
                  <div className="text-xs text-[#64748B]">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
