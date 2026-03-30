import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, FileText, Trophy, Calendar, User, Gamepad2, Home, LogOut } from "lucide-react";
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

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem("userName") || "Student";
  const studentClass = localStorage.getItem("studentClass") || "";
  const [activeItem, setActiveItem] = useState("");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/student-dashboard" },
    { id: "lectures", label: "Lectures", icon: BookOpen, path: "/lectures" },
    { id: "quizzes", label: "Quizzes", icon: FileText, path: "/quizzes" },
    { id: "games", label: "Games", icon: Gamepad2, path: "/games" },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy, path: "/leaderboard" },
    { id: "calendar", label: "Calendar", icon: Calendar, path: "/calendar" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  useEffect(() => {
    const p = location.pathname;
    const found = navItems.find(item => p === item.path || p.startsWith(item.path + '/'));
    setActiveItem(found ? found.id : "");
  }, [location.pathname]);

  const handleLogout = () => {
    ["userType","userName","userEmail","studentClass"].forEach(k => localStorage.removeItem(k));
    navigate("/");
  };

  return (
    <Sidebar className="bg-white border-r border-[#E2E8F0]">
      <SidebarHeader className="p-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1D4ED8] flex items-center justify-center">
            <span className="text-white text-sm font-bold">E</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1E293B] font-jakarta">EdUmbrella</h2>
            <p className="text-xs text-[#64748B]">Student Portal</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator className="bg-[#E2E8F0]" />
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeItem === item.id}
                    onClick={() => { setActiveItem(item.id); navigate(item.path); }}
                    className={`w-full transition-colors ${activeItem === item.id ? 'bg-[#EFF6FF] text-[#1D4ED8] border-l-2 border-[#1D4ED8]' : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className="bg-[#E2E8F0]" />
      <SidebarFooter className="p-4 bg-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#1D4ED8] flex items-center justify-center">
            <span className="text-white text-sm font-semibold">{userName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1E293B] truncate">{userName}</p>
            <p className="text-xs text-[#64748B]">{studentClass ? `Class ${studentClass}` : 'Student'}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 text-sm text-[#64748B] hover:text-red-500 transition-colors px-2 py-1.5 rounded">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};
export default StudentSidebar;
