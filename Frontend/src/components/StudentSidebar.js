import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, FileText, Trophy, Calendar, User, Gamepad2, Home, LogOut } from "lucide-react";
import EdUmbrellaLogo from "./EdUmbrellaLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/student-dashboard", color: "#A78BFA" },
  { id: "lectures", label: "Lectures", icon: BookOpen, path: "/lectures", color: "#60A5FA" },
  { id: "quizzes", label: "Quizzes", icon: FileText, path: "/quizzes", color: "#34D399" },
  { id: "games", label: "Games", icon: Gamepad2, path: "/games", color: "#F472B6" },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy, path: "/leaderboard", color: "#FBBF24" },
  { id: "calendar", label: "Calendar", icon: Calendar, path: "/calendar", color: "#FB923C" },
  { id: "profile", label: "Profile", icon: User, path: "/profile", color: "#94A3B8" },
];

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem("userName") || "Student";
  const studentClass = localStorage.getItem("studentClass") || "";
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    const found = navItems.find(item => location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
    setActiveItem(found ? found.id : "");
  }, [location.pathname]);

  const handleLogout = () => {
    ["userType","userName","userEmail","studentClass"].forEach(k => localStorage.removeItem(k));
    navigate("/");
  };

  // Mock XP data
  const xp = 2340;
  const xpMax = 3000;
  const level = 8;
  const xpPercent = Math.round((xp / xpMax) * 100);

  return (
    <Sidebar style={{background: '#070B17'}} className="border-r border-[#1E2D4A]">
      <SidebarHeader className="p-4" style={{background: '#070B17'}}>
        <div className="flex items-center gap-3">
          <EdUmbrellaLogo size={36} withText portal="Student Portal" />
        </div>
      </SidebarHeader>

      <SidebarSeparator style={{background: '#1E2D4A'}} />

      <SidebarContent style={{background: '#070B17'}}>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = activeItem === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => { setActiveItem(item.id); navigate(item.path); }}
                      className="w-full transition-all duration-200 rounded-lg mx-1 relative overflow-hidden"
                      style={{
                        background: 'transparent',
                        border: '1px solid transparent',
                        borderLeft: isActive ? `3px solid ${item.color}` : '3px solid transparent',
                      }}
                    >
                      <item.icon
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: isActive ? item.color : '#64748B' }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: isActive ? '#ffffff' : '#94A3B8' }}
                      >
                        {item.label}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator style={{background: '#1E2D4A'}} />

      <SidebarFooter className="p-4" style={{background: '#070B17'}}>
        {/* XP Bar */}
        <div className="mb-4 p-3 rounded-xl border border-[#6366F1]/20" style={{background: 'rgba(99,102,241,0.08)'}}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center">
                <span className="text-white text-xs font-bold">{level}</span>
              </div>
              <span className="text-xs font-medium text-[#A78BFA]">Level {level}</span>
            </div>
            <span className="text-xs text-[#64748B]">{xp.toLocaleString()} XP</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{background: '#1E293B'}}>
            <div className="h-full xp-bar rounded-full" style={{width: `${xpPercent}%`}} />
          </div>
          <p className="text-xs text-[#64748B] mt-1 text-right">{xpMax - xp} XP to Level {level + 1}</p>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{background: 'linear-gradient(135deg, #6366F1, #8B5CF6)'}}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{userName}</p>
            <p className="text-xs text-[#64748B]">{studentClass ? `Class ${studentClass}` : 'Student'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-sm text-[#64748B] hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};
export default StudentSidebar;
