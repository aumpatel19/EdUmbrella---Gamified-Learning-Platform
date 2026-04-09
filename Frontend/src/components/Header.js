import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import EdUmbrellaLogo from "./EdUmbrellaLogo";

const Header = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled
        ? "bg-[#080D1A]/95 backdrop-blur-xl border-b border-[#6366F1]/20 shadow-lg shadow-[#6366F1]/10"
        : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <EdUmbrellaLogo size={34} withText />
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How It Works", "Subjects"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-[#94A3B8] hover:text-white text-sm font-medium transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#06B6D4] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/auth')}
            className="text-sm font-medium text-[#94A3B8] hover:text-white px-3 py-2 transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="relative text-sm font-medium text-white px-4 py-2 rounded-lg overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] group-hover:from-[#4F46E5] group-hover:to-[#7C3AED] transition-all duration-300" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)'}} />
            <span className="relative flex items-center gap-1.5">
              Get Started
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
export default Header;
