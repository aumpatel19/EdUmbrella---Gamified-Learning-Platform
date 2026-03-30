import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-[#1D4ED8]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white font-jakarta leading-tight">
            Ready to Unlock Your Learning Journey?
          </h2>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Join thousands of students and teachers already using EdUmbrella to revolutionize education.
          </p>
          <div className="flex justify-center pt-2">
            <button
              onClick={() => navigate("/auth")}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#1D4ED8] font-semibold rounded-xl hover:bg-blue-50 transition-colors text-base group"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
