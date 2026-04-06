import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, BookOpen, FileText, Upload, Calendar, LogOut, Zap } from "lucide-react";
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
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/teacher-dashboard", color: "#34D399" },
  { id: "classes", label: "My Classes", icon: Users, path: "/teacher/classes", color: "#60A5FA" },
  { id: "quizzes", label: "Quizzes", icon: FileText, path: "/teacher/quizzes", color: "#A78BFA" },
  { id: "content", label: "Content", icon: Upload, path: "/teacher/content", color: "#FB923C" },
  { id: "schedule", label: "Schedule", icon: Calendar, path: "/teacher/schedule", color: "#F472B6" },
];

const TeacherSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem("userName") || "Teacher";
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    const p = location.pathname;
    if (p === "/teacher-dashboard") setActiveItem("dashboard");
    else if (p.startsWith("/teacher/classes")) setActiveItem("classes");
    else if (p.startsWith("/teacher/quizzes")) setActiveItem("quizzes");
    else if (p.startsWith("/teacher/content")) setActiveItem("content");
    else if (p.startsWith("/teacher/schedule")) setActiveItem("schedule");
    else setActiveItem("");
  }, [location.pathname]);

  const handleLogout = () => {
    ["userType","userName","userEmail"].forEach(k => localStorage.removeItem(k));
    navigate("/");
  };

  return (
    <Sidebar style={{background: '#070B17'}} className="border-r border-[#1E2D4A]">
      <SidebarHeader className="p-4" style={{background: '#070B17'}}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background: 'linear-gradient(135deg, #10B981, #059669)'}}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#34D399] border border-[#070B17] animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-jakarta">EdUmbrella</h2>
            <p className="text-xs text-[#64748B]">Teacher Portal</p>
          </div>
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
                      className="w-full transition-all duration-200 rounded-lg mx-1"
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
        <div className="flex items-center gap-3 mb-3 p-3 rounded-xl border border-[#10B981]/20" style={{background: 'rgba(16,185,129,0.08)'}}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{background: 'linear-gradient(135deg, #10B981, #059669)'}}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{userName}</p>
            <p className="text-xs text-[#34D399]">Educator</p>
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
export default TeacherSidebar;
