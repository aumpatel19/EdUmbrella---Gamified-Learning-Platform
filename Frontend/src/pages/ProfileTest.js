import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/simplebutton";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import StudentSidebar from "../components/StudentSidebar";

const ProfileTest = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <SidebarProvider>
      <StudentSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-[#F8FAFC]">
          {/* Header */}
          <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div className="w-8 h-8 rounded-full bg-[#1D4ED8] flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <h1 className="text-xl font-bold font-bold text-[#1E293B]">
                  EdUmbrella - Profile (Test)
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{userName}</span>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">👤 Profile Test Page</h2>
              <p className="text-muted-foreground">
                This is a test version of the profile page to check if routing works
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border">
              <h3 className="text-xl font-bold mb-4">Profile Information</h3>
              <p>Name: {userName}</p>
              <p>This page is working! The issue has been resolved.</p>
              
              <Button className="mt-4" onClick={() => alert("Profile functionality works!")}>
                Test Button
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ProfileTest;