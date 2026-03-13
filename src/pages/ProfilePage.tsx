import { Camera, BookOpen, Star, Award, ChevronRight, ChevronDown, Settings, Trash2, Languages, Dumbbell, Copy, Pencil, LogOut, Mail, Lock } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { userStats, achievements } from "@/lib/mock-data";

const PROFILE_KEY = "snaplingo-profile";

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { name: "Guest", id: "SNAP-0000", avatar: null };
}

function saveProfile(profile: { name: string; id: string; avatar: string | null }) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, signOut } = useAuth();

  // Auth form state
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Profile state (for logged-in users)
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profile, setProfile] = useState(loadProfile);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleEmailAuth = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      if (authMode === "register") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setAuthError(err.message || t("auth.error"));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const result = await lovable.auth.signInWithOAuth(provider);
      if (result.error) throw result.error;
    } catch (err: any) {
      setAuthError(err.message || t("auth.error"));
    } finally {
      setAuthLoading(false);
    }
  };

  // Not authenticated view
  if (!user) {
    return (
      <div className="min-h-screen px-5 pt-12 pb-24">
        <h1 className="text-2xl font-black text-foreground mb-6 text-center">{t("auth.welcome")}</h1>

        {/* OAuth buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleOAuth("google")}
            disabled={authLoading}
            className="card-volumetric w-full flex items-center gap-3 px-5 py-4 active:scale-[0.98] transition-transform"
          >
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"/></svg>
            <span className="text-sm font-bold text-foreground">{t("auth.continueGoogle")}</span>
          </button>

          <button
            onClick={() => handleOAuth("apple")}
            disabled={authLoading}
            className="card-volumetric w-full flex items-center gap-3 px-5 py-4 active:scale-[0.98] transition-transform"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z"/></svg>
            <span className="text-sm font-bold text-foreground">{t("auth.continueApple")}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-0.5 bg-border" />
          <span className="text-xs font-bold text-muted-foreground">{t("auth.or")}</span>
          <div className="flex-1 h-0.5 bg-border" />
        </div>

        {/* Email form */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.email")}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-base font-bold border-2 border-border bg-card text-foreground outline-none focus:border-primary transition-colors"
              style={{ borderBottomWidth: 4 }}
            />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
              placeholder={t("auth.password")}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-base font-bold border-2 border-border bg-card text-foreground outline-none focus:border-primary transition-colors"
              style={{ borderBottomWidth: 4 }}
            />
          </div>
        </div>

        {authError && (
          <p className="text-sm font-bold text-destructive mb-3 text-center">{authError}</p>
        )}

        <button
          onClick={handleEmailAuth}
          disabled={authLoading || !email || !password}
          className="btn-volumetric-primary w-full mb-3"
        >
          {authLoading ? "..." : authMode === "login" ? t("auth.signIn") : t("auth.signUp")}
        </button>

        <button
          onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
          className="w-full text-center text-sm font-bold text-primary py-2"
        >
          {authMode === "login" ? t("auth.noAccount") : t("auth.hasAccount")}
        </button>

        {/* Settings shortcut */}
        <div className="mt-8 card-volumetric overflow-hidden">
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <Languages size={20} className="text-primary" />
              <span className="text-base font-bold text-foreground">{t("profile.changeLanguage")}</span>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  }

  // Authenticated profile view
  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      const updated = { ...profile, name: trimmed };
      setProfile(updated);
      saveProfile(updated);
    }
    setEditingName(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const updated = { ...profile, avatar: reader.result as string };
      setProfile(updated);
      saveProfile(updated);
    };
    reader.readAsDataURL(file);
  };

  const copyId = () => {
    navigator.clipboard.writeText(profile.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const stats = [
    { icon: Star, label: "XP", value: userStats.xp, color: "text-warning" },
    { icon: BookOpen, label: t("profile.wordsLearned"), value: userStats.wordsLearned, color: "text-primary" },
    { icon: Camera, label: t("profile.totalSnaps"), value: userStats.totalSnaps, color: "text-primary" },
    { icon: Award, label: t("profile.mastered"), value: userStats.masteredWords, color: "text-success" },
  ];

  return (
    <div className="min-h-screen px-5 pt-12 pb-24">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-6 animate-fade-up">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        <button
          onClick={() => fileRef.current?.click()}
          className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-3 overflow-hidden relative group"
          style={{ borderBottomWidth: 6, borderBottomColor: "hsl(var(--primary-dark))" }}
        >
          {profile.avatar ? (
            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-black text-primary-foreground">
              {(user.email || "U").slice(0, 2).toUpperCase()}
            </span>
          )}
          <div className="absolute inset-0 bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={20} className="text-background" />
          </div>
        </button>

        {editingName ? (
          <div className="flex items-center gap-2">
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              onBlur={handleSaveName}
              autoFocus
              className="text-xl font-black text-foreground bg-transparent border-b-2 border-primary outline-none text-center w-40"
            />
          </div>
        ) : (
          <button onClick={() => { setNameInput(profile.name); setEditingName(true); }} className="flex items-center gap-1.5">
            <h1 className="text-xl font-black text-foreground">{user.user_metadata?.full_name || profile.name || user.email}</h1>
            <Pencil size={14} className="text-muted-foreground" />
          </button>
        )}
        <p className="text-sm font-bold text-muted-foreground">{t("profile.linguaMaster")}</p>

        <button onClick={copyId} className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/50">
          <span className="text-xs font-bold text-muted-foreground">ID: {profile.id}</span>
          <Copy size={12} className={copied ? "text-success" : "text-muted-foreground"} />
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map(({ icon: Icon, label, value, color }, i) => (
          <div key={label} className="card-volumetric p-4 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}>
            <Icon size={20} className={`${color} mb-2`} strokeWidth={2.5} />
            <p className="text-2xl font-black text-foreground">{value}</p>
            <p className="text-xs font-bold text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="mb-6">
        <h2 className="text-lg font-extrabold text-foreground mb-3">{t("profile.achievements")}</h2>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5">
          {achievements.map((ach) => (
            <div key={ach.id} className={`card-volumetric min-w-[120px] p-4 flex flex-col items-center gap-2 flex-shrink-0 ${!ach.unlocked ? "opacity-40" : ""}`}>
              <span className="text-2xl">{ach.emoji}</span>
              <span className="text-xs font-bold text-foreground text-center">{ach.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings dropdown */}
      <div className="card-volumetric overflow-hidden mb-4">
        <button onClick={() => setSettingsOpen(!settingsOpen)} className="w-full flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Settings size={20} className="text-primary" />
            <span className="text-base font-bold text-foreground">{t("profile.settings")}</span>
          </div>
          <ChevronDown size={20} className={`text-muted-foreground transition-transform ${settingsOpen ? "rotate-180" : ""}`} />
        </button>
        {settingsOpen && (
          <div className="border-t-2 border-border">
            {[
              { icon: Dumbbell, label: t("profile.studyPreferences"), action: () => {} },
              { icon: Trash2, label: t("profile.recentlyDeleted"), action: () => {} },
              { icon: Languages, label: t("profile.changeLanguage"), action: () => navigate("/settings") },
            ].map(({ icon: Icon, label, action }) => (
              <button key={label} onClick={action} className="w-full flex items-center justify-between px-4 py-3.5 border-b border-border/50 last:border-b-0 active:bg-muted/50">
                <div className="flex items-center gap-3">
                  <Icon size={18} className="text-muted-foreground" />
                  <span className="text-sm font-bold text-foreground">{label}</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Logout confirmation */}
      <AlertDialog open={logoutConfirm} onOpenChange={setLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("auth.logoutConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("auth.logoutConfirmDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("vocabulary.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={signOut} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t("auth.signOut")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout button */}
      <button
        onClick={() => setLogoutConfirm(true)}
        className="w-full rounded-2xl bg-destructive text-destructive-foreground font-black text-base py-4 active:scale-[0.98] transition-transform"
        style={{ borderBottomWidth: 6, borderBottomColor: "hsl(0 60% 35%)" }}
      >
        <div className="flex items-center justify-center gap-3">
          <LogOut size={20} />
          <span>{t("auth.signOut")}</span>
        </div>
      </button>
    </div>
  );
};

export default ProfilePage;
