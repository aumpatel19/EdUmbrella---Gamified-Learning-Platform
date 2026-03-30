import { GraduationCap } from "lucide-react";

const Footer = () => (
  <footer className="bg-white border-t border-[#E2E8F0]">
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-[#1D4ED8]" />
            <span className="text-lg font-bold text-[#1E293B] font-jakarta">EdUmbrella</span>
          </div>
          <p className="text-[#64748B] text-sm max-w-xs">Empowering CBSE students from Class 6 to 12 with gamified learning, smart quizzes, and progress tracking.</p>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-[#1E293B] text-sm">Quick Links</h3>
          {["About Us","Contact","Login Guide","Help Center"].map(l => (
            <a key={l} href="#" className="block text-[#64748B] text-sm hover:text-[#1D4ED8] transition-colors">{l}</a>
          ))}
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-[#1E293B] text-sm">Legal</h3>
          {["Privacy Policy","Terms of Service","Cookie Policy"].map(l => (
            <a key={l} href="#" className="block text-[#64748B] text-sm hover:text-[#1D4ED8] transition-colors">{l}</a>
          ))}
        </div>
      </div>
      <div className="border-t border-[#E2E8F0] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-[#64748B]">© 2024 EdUmbrella. All rights reserved.</p>
        <p className="text-sm text-[#64748B]">Made with ❤️ for CBSE students</p>
      </div>
    </div>
  </footer>
);
export default Footer;
