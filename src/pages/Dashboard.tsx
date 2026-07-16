import { Flame, Camera, Star, Zap, Dumbbell, Trash2, UserPlus, X, Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { userStats, topics, friends as defaultFriends } from "@/lib/mock-data";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendIdInput, setFriendIdInput] = useState("");
  const [friendsList] = useState(defaultFriends);

  const handleAddFriend = () => {
    if (friendIdInput.trim()) {
      // Mock: just close for now
      setFriendIdInput("");
      setShowAddFriend(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 px-5 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden -ml-2 text-foreground/70" />
          <h1 className="text-2xl font-black text-foreground">SnapLingo</h1>
        </div>
        <div className="flex items-center gap-2">

          {[
            { icon: Flame, value: `${userStats.streak}d`, color: "text-warning" },
            { icon: Camera, value: userStats.totalSnaps, color: "text-primary" },
            { icon: Star, value: `${userStats.xp}`, color: "text-warning" },
          ].map(({ icon: Icon, value, color }, i) => (
            <div key={i} className="card-volumetric flex items-center gap-1.5 px-3 py-1.5">
              <Icon size={16} className={color} strokeWidth={2.5} />
              <span className="text-sm font-extrabold text-foreground">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main CTAs */}
      <button onClick={() => navigate("/scan")} className="btn-volumetric-primary w-full flex items-center justify-center gap-3 mb-3">
        <Zap size={24} />
        <span>{t("dashboard.scanAndLearn")}</span>
      </button>
      <button onClick={() => navigate("/study")} className="btn-volumetric-warning w-full flex items-center justify-center gap-3 mb-6">
        <Dumbbell size={24} />
        <span>{t("dashboard.startTraining")}</span>
      </button>

      {/* My Topics */}
      <div className="mb-6">
        <h2 className="text-lg font-extrabold text-foreground mb-3">{t("dashboard.myTopics")}</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => navigate(`/study?topic=${topic.id}`)}
              className="card-volumetric min-w-[160px] p-4 flex-shrink-0 relative cursor-pointer active:scale-[0.97] transition-transform"
            >
              <button className="absolute top-2 right-2 w-7 h-7 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Trash2 size={14} className="text-destructive" />
              </button>
              <span className="text-3xl mb-2 block">{topic.emoji}</span>
              <p className="text-sm font-bold text-foreground">{topic.name}</p>
              <p className="text-xs font-semibold text-muted-foreground">{topic.wordCount} {t("dashboard.words")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Friends Leaderboard */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-extrabold text-foreground">{t("dashboard.friendsLeaderboard")}</h2>
          <button
            onClick={() => setShowAddFriend(true)}
            className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center"
          >
            <UserPlus size={18} className="text-primary" />
          </button>
        </div>
        <div className="card-volumetric p-4">
          <div className="flex items-center justify-around">
            {friendsList.map((friend, i) => (
              <div key={friend.id} className="flex flex-col items-center gap-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-sm ${
                  i === 0 ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {friend.avatar}
                </div>
                <span className="text-xs font-bold text-foreground">{friend.name}</span>
                <span className="text-xs font-extrabold text-warning">{friend.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center px-5" onClick={() => setShowAddFriend(false)}>
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-foreground">{t("dashboard.addFriend")}</h2>
              <button onClick={() => setShowAddFriend(false)} className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm font-semibold text-muted-foreground mb-3">{t("dashboard.enterFriendId")}</p>
            <input
              type="text"
              value={friendIdInput}
              onChange={(e) => setFriendIdInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddFriend()}
              placeholder="SNAP-XXXX"
              className="w-full px-4 py-3.5 rounded-2xl text-base font-bold border-2 border-border bg-card text-foreground outline-none focus:border-primary transition-colors"
              style={{ borderBottomWidth: 4 }}
              autoFocus
            />
            <button onClick={handleAddFriend} className="btn-volumetric-primary w-full mt-4 text-base">
              {t("dashboard.addFriendBtn")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
