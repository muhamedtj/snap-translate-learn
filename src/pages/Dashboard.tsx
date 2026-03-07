import { Camera, Zap, BookOpen, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SnapCard from "@/components/SnapCard";
import { mockSnaps, userStats } from "@/lib/mock-data";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pb-24 px-5 pt-14">
      <div className="mb-6 animate-fade-up">
        <h1 className="text-2xl font-bold text-foreground">{t("app.name")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t("app.tagline")}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: Camera, label: t("dashboard.snaps"), value: userStats.totalSnaps },
          { icon: BookOpen, label: t("dashboard.words"), value: userStats.wordsLearned },
          { icon: TrendingUp, label: t("dashboard.streak"), value: `${userStats.streak}d` },
        ].map(({ icon: Icon, label, value }, i) => (
          <div
            key={label}
            className="bg-card rounded-2xl p-3 text-center border border-border/50 shadow-sm animate-fade-up"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
          >
            <Icon size={18} className="text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{value}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/scan")}
        className="w-full bg-primary text-primary-foreground rounded-2xl py-4 flex items-center justify-center gap-2.5 shadow-lg shadow-primary/20 mb-6 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] animate-scale-in"
      >
        <Zap size={20} />
        <span className="font-semibold text-base">{t("dashboard.scanAndLearn")}</span>
      </button>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">{t("dashboard.recentSnaps")}</h2>
          <button
            onClick={() => navigate("/history")}
            className="text-xs font-medium text-primary"
          >
            {t("dashboard.seeAll")}
          </button>
        </div>
        <div className="space-y-3">
          {mockSnaps.slice(0, 3).map((snap, i) => (
            <SnapCard
              key={snap.id}
              snap={snap}
              index={i}
              onClick={() => navigate(`/result/${snap.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
