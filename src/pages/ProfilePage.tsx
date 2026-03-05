import { Camera, BookOpen, TrendingUp, Award, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userStats, allWords } from "@/lib/mock-data";

const ProfilePage = () => {
  const navigate = useNavigate();
  const learntCount = allWords.filter((w) => w.correctCount >= 5).length;

  const stats = [
    { icon: Camera, label: "Total Snaps", value: userStats.totalSnaps },
    { icon: BookOpen, label: "Total Words", value: userStats.totalWords },
    { icon: Award, label: "Learnt", value: learntCount },
    { icon: TrendingUp, label: "Day Streak", value: userStats.streak },
  ];

  return (
    <div className="min-h-screen px-5 pt-12 pb-24">
      <div className="flex flex-col items-center mb-8 animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <span className="text-2xl font-bold text-primary">LS</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">LinguaSnap</h1>
        <p className="text-sm text-muted-foreground">Language Explorer</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map(({ icon: Icon, label, value }, i) => (
          <div
            key={label}
            className="bg-card rounded-3xl p-4 border border-border/50 shadow-sm animate-fade-up"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
          >
            <Icon size={18} className="text-primary mb-2" />
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 animate-fade-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
        {[
          { label: "Study Session", action: () => navigate("/study") },
          { label: "Settings", action: undefined },
          { label: "Help & Support", action: undefined },
        ].map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="w-full bg-card rounded-3xl p-4 border border-border/50 flex items-center justify-between transition-all hover:shadow-sm active:scale-[0.98]"
          >
            <span className="text-sm font-medium text-foreground">{item.label}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
