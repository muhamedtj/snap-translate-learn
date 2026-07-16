import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, User } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const profileName = name.trim() || "SS Creative";
    const profile = { name: profileName, id: "SNAP-7X2K9", avatar: null };
    localStorage.setItem("snaplingo-profile", JSON.stringify(profile));
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-background w-full" style={{ zIndex: 100, position: 'relative' }}>
      <div className="w-full max-w-sm bg-card rounded-3xl p-8 animate-fade-up border-2 border-border" style={{ boxShadow: '0 8px 0 rgba(0,0,0,0.05)' }}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-[24px] flex items-center justify-center mb-5 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            <User className="text-primary w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-foreground">SnapLingo</h1>
          <p className="text-sm font-bold text-muted-foreground mt-2 text-center">
            Sign in to your learning account
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-2">Your Name</label>
            <input
              type="text"
              placeholder="e.g. Pro Learner"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl text-base font-bold border-2 border-border bg-background text-foreground outline-none focus:border-primary transition-colors"
              style={{ borderBottomWidth: 4 }}
            />
          </div>
          <button type="submit" className="btn-volumetric-primary w-full flex items-center justify-center gap-3 py-4 mt-2">
            <span className="text-lg">Continue</span>
            <LogIn size={22} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
