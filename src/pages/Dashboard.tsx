import { Flame, Camera, Settings, Trash2, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { userStats, topics, friends as defaultFriends } from "@/lib/mock-data";
import { SidebarTrigger } from "@/components/ui/sidebar";

const WEEKLY_GOAL = 15;

const CircularProgress = ({ value }: { value: number }) => {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="4" className="stroke-muted" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          className="stroke-primary"
          strokeDasharray={c}
          strokeDashoffset={c - (c * Math.min(value, 100)) / 100}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-foreground">
        {value}%
      </span>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendIdInput, setFriendIdInput] = useState("");
  const [friendsList] = useState(defaultFriends);

  const learnedWords = Math.min(userStats.xp % WEEKLY_GOAL, WEEKLY_GOAL);
  const goalPercent = Math.round((learnedWords / WEEKLY_GOAL) * 100);

  const handleAddFriend = () => {
    if (friendIdInput.trim()) {
      setFriendIdInput("");
      setShowAddFriend(false);
    }
  };

  return (
    <div className="min-h-screen pb-28 md:pb-12 px-5 md:px-8 lg:px-12 pt-6 md:pt-8">
      {/* Top bar */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden -ml-2 text-muted-foreground" />
          <div>
            <span className="inline-block rounded-xl bg-accent px-3 py-1 text-lg font-extrabold text-foreground">
              LingoSnap
            </span>
            <p className="mt-2 text-xs font-bold text-muted-foreground">
              {t("dashboard.myTopics")}: {topics.length} · {userStats.totalSnaps} {t("dashboard.words")}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/settings")}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Greeting + streak */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            {t("dashboard.welcomeBack", { defaultValue: "Welcome back!" })}
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            {t("dashboard.readyToLearn", { defaultValue: "Ready to learn today?" })}
          </p>
        </div>
        <div className="btn-volumetric-warning flex items-center gap-2 px-4 py-2.5 text-sm">
          <Flame size={16} />
          <span>{userStats.streak} {t("dashboard.days", { defaultValue: "days" })}</span>
        </div>
      </div>

      {/* Topics */}
      <div className="mb-6">
        <h2 className="text-lg font-extrabold text-foreground mb-3">{t("dashboard.myTopics")}</h2>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => navigate(`/study?topic=${topic.id}`)}
              className="card-volumetric p-4 relative cursor-pointer hover:-translate-y-0.5 transition-transform"
            >
              <button className="absolute top-2 right-2 w-7 h-7 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Trash2 size={14} className="text-destructive" />
              </button>
              <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center text-xl mb-3">
                {topic.emoji}
              </div>
              <p className="text-sm font-bold text-foreground">{topic.name}</p>
              <p className="text-xs font-medium text-muted-foreground">
                {topic.wordCount} {t("dashboard.words")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly goal */}
      <div className="card-volumetric p-5 flex items-center gap-4 mb-6">
        <CircularProgress value={goalPercent} />
        <div className="flex-1 min-w-0">
          <p className="text-base font-extrabold text-foreground">
            {t("dashboard.weeklyGoal", { defaultValue: "Weekly Goal" })}
          </p>
          <p className="text-sm font-medium text-muted-foreground">
            {t("dashboard.masterWords", { defaultValue: `Master ${WEEKLY_GOAL} words` })}
          </p>
        </div>
        <span className="text-lg font-extrabold text-foreground">
          {learnedWords}/{WEEKLY_GOAL}
        </span>
      </div>

      {/* Leaderboard */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-extrabold text-foreground">{t("dashboard.friendsLeaderboard")}</h2>
          <button
            onClick={() => setShowAddFriend(true)}
            className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center"
          >
            <UserPlus size={18} className="text-primary" />
          </button>
        </div>
        <div className="card-volumetric divide-y divide-border/70">
          {friendsList.map((friend, i) => (
            <div key={friend.id} className="flex items-center gap-3 px-5 py-4">
              <span className="w-4 text-sm font-bold text-muted-foreground">{i + 1}</span>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold ${
                  i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {friend.avatar}
              </div>
              <span className="flex-1 text-sm font-bold text-foreground truncate">{friend.name}</span>
              <span className="text-sm font-extrabold text-primary">{friend.xp} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main CTA */}
      <button
        onClick={() => navigate("/scan")}
        className="btn-volumetric-gradient w-full flex items-center justify-center gap-3 py-4 text-lg"
      >
        <Camera size={22} />
        <span>{t("dashboard.scanAndLearn")}</span>
      </button>

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div
          className="fixed inset-0 z-50 bg-foreground/40 flex items-center justify-center px-5"
          onClick={() => setShowAddFriend(false)}
        >
          <div
            className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-soft animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-foreground">{t("dashboard.addFriend")}</h2>
              <button
                onClick={() => setShowAddFriend(false)}
                className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-3">{t("dashboard.enterFriendId")}</p>
            <input
              type="text"
              value={friendIdInput}
              onChange={(e) => setFriendIdInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddFriend()}
              placeholder="SNAP-XXXX"
              className="w-full px-4 py-3.5 rounded-2xl text-base font-semibold border border-border bg-card text-foreground outline-none focus:border-primary transition-colors"
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
