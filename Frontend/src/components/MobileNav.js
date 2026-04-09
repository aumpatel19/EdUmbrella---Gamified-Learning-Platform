import { useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, FileText, Gamepad2, Trophy } from "lucide-react";

const navItems = [
  { id: "dashboard", icon: Home,      path: "/student-dashboard", label: "Home",     color: "#A78BFA" },
  { id: "lectures",  icon: BookOpen,  path: "/lectures",           label: "Lectures", color: "#60A5FA" },
  { id: "quizzes",   icon: FileText,  path: "/quizzes",            label: "Quizzes",  color: "#34D399" },
  { id: "games",     icon: Gamepad2,  path: "/games",              label: "Games",    color: "#F472B6" },
  { id: "leaderboard", icon: Trophy,  path: "/leaderboard",        label: "Ranks",    color: "#FBBF24" },
];

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const active = navItems.find(
    item => location.pathname === item.path || location.pathname.startsWith(item.path + "/")
  );

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
      style={{
        background: "rgba(7,11,23,0.97)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(99,102,241,0.2)",
      }}
    >
      {navItems.map((item) => {
        const isActive = active?.id === item.id;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
            style={{
              minWidth: 52,
              background: isActive ? `${item.color}18` : "transparent",
            }}
          >
            <item.icon
              className="w-5 h-5"
              style={{ color: isActive ? item.color : "#475569" }}
            />
            <span
              className="text-[10px] font-semibold"
              style={{ color: isActive ? item.color : "#475569" }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
