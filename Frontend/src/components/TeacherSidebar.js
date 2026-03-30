import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, BookOpen, FileText, Upload, Calendar, LogOut } from "lucide-react";
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

const TeacherSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem("userName") || "Teacher";
  const [activeItem, setActiveItem] = useState("");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/teacher-dashboard" },
    { id: "classes", label: "My Classes", icon: Users, path: "/teacher/classes" },
    { id: "quizzes", label: "Quizzes", icon: FileText, path: "/teacher/quizzes" },
    { id: "content", label: "Content", icon: Upload, path: "/teacher/content" },
    { id: "schedule", label: "Schedule", icon: Calendar, path: "/teacher/schedule" },
  ];

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
    <Sidebar className="bg-white border-r border-[#E2E8F0]">
      <SidebarHeader className="p-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1D4ED8] flex items-center justify-center">
            <span className="text-white text-sm font-bold">E</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1E293B] font-jakarta">EdUmbrella</h2>
            <p className="text-xs text-[#64748B]">Teacher Portal</p>
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
          <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center">
            <span className="text-white text-sm font-semibold">{userName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1E293B] truncate">{userName}</p>
            <p className="text-xs text-[#64748B]">Teacher</p>
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
export default TeacherSidebar;
