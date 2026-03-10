import { Camera, BookOpen, Star, Award, ChevronRight, ChevronDown, Settings, Trash2, Languages, Dumbbell } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { userStats, achievements } from "@/lib/mock-data";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);

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
        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-3" style={{ borderBottomWidth: 6, borderBottomColor: "hsl(var(--primary-dark))" }}>
          <span className="text-3xl font-black text-primary-foreground">SC</span>
        </div>
        <h1 className="text-xl font-black text-foreground">SS Creative</h1>
        <p className="text-sm font-bold text-muted-foreground">{t("profile.linguaMaster")}</p>
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
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="w-full flex items-center justify-between p-4"
        >
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
