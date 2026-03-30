import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-[#E2E8F0]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="EdUmbrella" className="h-10 w-auto" />
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[#64748B] hover:text-[#1D4ED8] text-sm font-medium transition-colors">Features</a>
          <a href="#how-it-works" className="text-[#64748B] hover:text-[#1D4ED8] text-sm font-medium transition-colors">How It Works</a>
          <a href="#subjects" className="text-[#64748B] hover:text-[#1D4ED8] text-sm font-medium transition-colors">Subjects</a>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/auth')} className="text-sm font-medium text-[#1D4ED8] hover:underline px-3 py-2">Log In</button>
          <button onClick={() => navigate('/auth')} className="text-sm font-medium bg-[#1D4ED8] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Get Started</button>
        </div>
      </div>
    </header>
  );
};
export default Header;
