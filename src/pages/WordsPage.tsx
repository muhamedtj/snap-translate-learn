import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { allWords, getWordStatus } from "@/lib/mock-data";
import ProgressBars from "@/components/ProgressBars";

type SortMode = "date" | "alpha" | "status";

const WordsPage = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortMode>("date");

  const sorted = [...allWords].sort((a, b) => {
    if (sort === "alpha") return a.word.localeCompare(b.word);
    if (sort === "status") return b.correctCount - a.correctCount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen px-5 pt-12 pb-24">
      <div className="flex items-center gap-3 mb-5 animate-fade-up">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">All Words</h1>
          <p className="text-xs text-muted-foreground">{allWords.length} words total</p>
        </div>
      </div>

      {/* Sort Pills */}
      <div className="flex gap-2 mb-5 animate-fade-up" style={{ animationDelay: "60ms", animationFillMode: "both" }}>
        {(["date", "alpha", "status"] as SortMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setSort(mode)}
            className={`px-4 py-2 rounded-3xl text-xs font-medium transition-all ${
              sort === mode
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground border border-border/50"
            }`}
          >
            {mode === "date" ? "Date" : mode === "alpha" ? "A–Z" : "Status"}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {sorted.map((word, i) => (
          <div
            key={word.id}
            className="bg-card rounded-3xl p-4 border border-border/50 shadow-sm animate-fade-up"
            style={{ animationDelay: `${(i + 2) * 40}ms`, animationFillMode: "both" }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{word.word}</p>
                <span className="text-xs text-muted-foreground">→ {word.translation}</span>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                word.correctCount >= 5
                  ? "bg-success/10 text-success"
                  : word.correctCount >= 3
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}>
                {getWordStatus(word)}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mb-2">{word.language}</p>
            <ProgressBars count={word.correctCount} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordsPage;
