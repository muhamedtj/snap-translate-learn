import { Camera, BookOpen, Star, Award, ChevronRight, ChevronDown, Settings, Trash2, Languages, Dumbbell, Copy, Pencil, LogOut } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { userStats, achievements } from "@/lib/mock-data";

const PROFILE_KEY = "snaplingo-profile";

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { name: "SS Creative", id: "SNAP-7X2K9", avatar: null };
}

function saveProfile(profile: { name: string; id: string; avatar: string | null }) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profile, setProfile] = useState(loadProfile);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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
              {profile.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
            </span>
          )}
          <div className="absolute inset-0 bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={20} className="text-background" />
          </div>
        </button>

        {/* Editable name */}
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
            <h1 className="text-xl font-black text-foreground">{profile.name}</h1>
            <Pencil size={14} className="text-muted-foreground" />
          </button>
        )}
        <p className="text-sm font-bold text-muted-foreground">{t("profile.linguaMaster")}</p>

        {/* User ID */}
        <button onClick={copyId} className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/50">
          <span className="text-xs font-bold text-muted-foreground">ID: {profile.id}</span>
          <Copy size={12} className={copied ? "text-success" : "text-muted-foreground"} />
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map(({ icon: Icon, label, value, color }, i) => (
          <div
            key={label}
            className="card-volumetric p-4 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
          >
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
            <div
              key={ach.id}
              className={`card-volumetric min-w-[120px] p-4 flex flex-col items-center gap-2 flex-shrink-0 ${
                !ach.unlocked ? "opacity-40" : ""
              }`}
            >
              <span className="text-2xl">{ach.emoji}</span>
              <span className="text-xs font-bold text-foreground text-center">{ach.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings dropdown */}
      <div className="card-volumetric overflow-hidden">
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
              { icon: LogOut, label: t("profile.logout") || "Log Out", action: () => {
                localStorage.removeItem(PROFILE_KEY);
                navigate("/");
                window.location.reload();
              }},
            ].map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                className="w-full flex items-center justify-between px-4 py-3.5 border-b border-border/50 last:border-b-0 active:bg-muted/50"
              >
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
    </div>
  );
};

export default ProfilePage;
