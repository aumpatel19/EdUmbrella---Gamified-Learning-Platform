import EdUmbrellaLogo from "./EdUmbrellaLogo";

const Footer = () => (
  <footer className="relative border-t py-12" style={{background: '#060A15', borderColor: '#1E2D4A'}}>
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <EdUmbrellaLogo size={32} withText />
        <div className="flex items-center gap-6">
          {["Features", "How It Works", "Subjects", "Privacy", "Terms"].map(link => (
            <a key={link} href="#" className="text-[#64748B] hover:text-[#A78BFA] text-sm transition-colors">{link}</a>
          ))}
        </div>
        <p className="text-[#475569] text-sm">
          © {new Date().getFullYear()} EdUmbrella · Made for CBSE learners 🎮
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
