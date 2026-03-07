import { Camera, BookOpen, TrendingUp, Award, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { userStats } from "@/lib/mock-data";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const stats = [
    { icon: Camera, label: t("profile.totalSnaps"), value: userStats.totalSnaps },
    { icon: BookOpen, label: t("profile.wordsLearned"), value: userStats.wordsLearned },
    { icon: Award, label: t("profile.mastered"), value: userStats.masteredWords },
    { icon: TrendingUp, label: t("profile.dayStreak"), value: userStats.streak },
  ];

  const menuItems = [
    { label: t("profile.flashcards"), action: () => navigate("/flashcards") },
    { label: t("profile.settings"), action: () => navigate("/settings") },
    { label: t("profile.helpSupport"), action: () => {} },
  ];

  return (
    <div className="min-h-screen px-5 pt-14 pb-24">
      <div className="flex flex-col items-center mb-8 animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <span className="text-2xl font-bold text-primary">SC</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">SS Creative</h1>
        <p className="text-sm text-muted-foreground">{t("profile.role")}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map(({ icon: Icon, label, value }, i) => (
          <div
            key={label}
            className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm animate-fade-up"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
          >
            <Icon size={18} className="text-primary mb-2" />
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 animate-fade-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
        {menuItems.map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            className="w-full bg-card rounded-2xl p-4 border border-border/50 flex items-center justify-between transition-all hover:shadow-sm active:scale-[0.98]"
          >
            <span className="text-sm font-medium text-foreground">{label}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
