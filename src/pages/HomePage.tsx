import { useState } from "react";
import { Flame, Camera, BookOpen, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { allWords, userStats } from "@/lib/mock-data";

const HomePage = () => {
  const navigate = useNavigate();
  const [flippedChips, setFlippedChips] = useState<Set<string>>(new Set());

  const toggleChip = (id: string) => {
    setFlippedChips((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Words for quick review (not yet learnt)
  const reviewWords = allWords.filter((w) => w.correctCount < 5).slice(0, 8);

  return (
    <div className="min-h-screen pb-24 px-5 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">LinguaSnap</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Learn from the world</p>
        </div>
        <button
          onClick={() => navigate("/words")}
          className="flex items-center gap-1.5 bg-accent rounded-3xl px-4 py-2 transition-all active:scale-95"
        >
          <Flame size={16} className="text-primary" />
          <span className="text-sm font-semibold text-primary">{userStats.streak}d Streak</span>
        </button>
      </div>

      {/* Total Snaps Card */}
      <button
        onClick={() => navigate("/library")}
        className="w-full bg-card rounded-3xl p-5 border border-border/50 shadow-sm mb-6 flex items-center justify-between transition-all hover:shadow-md active:scale-[0.98] animate-fade-up"
        style={{ animationDelay: "60ms", animationFillMode: "both" }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Camera size={22} className="text-primary" />
          </div>
          <div className="text-left">
            <p className="text-2xl font-bold text-foreground">{userStats.totalSnaps}</p>
            <p className="text-xs text-muted-foreground">Total Snaps</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-muted-foreground" />
      </button>

      {/* Words Summary */}
      <div
        className="bg-card rounded-3xl p-5 border border-border/50 shadow-sm mb-6 animate-fade-up"
        style={{ animationDelay: "120ms", animationFillMode: "both" }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">Vocabulary</span>
          </div>
          <button onClick={() => navigate("/words")} className="text-xs font-medium text-primary">
            See all
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-0.5">
          {userStats.wordsLearned} learnt · {userStats.totalWords} total
        </p>
        <div className="w-full h-1.5 bg-secondary rounded-full mt-2">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(userStats.wordsLearned / userStats.totalWords) * 100}%` }}
          />
        </div>
      </div>

      {/* Quick Review */}
      <div
        className="animate-fade-up"
        style={{ animationDelay: "180ms", animationFillMode: "both" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">Quick Review</h2>
          <button onClick={() => navigate("/study")} className="text-xs font-medium text-primary">
            Study →
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {reviewWords.map((word) => {
            const isFlipped = flippedChips.has(word.id);
            return (
              <button
                key={word.id}
                onClick={() => toggleChip(word.id)}
                className={`px-4 py-2.5 rounded-3xl text-sm font-medium transition-all duration-300 active:scale-95 ${
                  isFlipped
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-card text-foreground border border-border/50"
                }`}
              >
                {isFlipped ? word.translation : word.word}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
