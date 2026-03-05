import { ArrowLeft, BookOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { mockSnaps, getWordsForSnap, getWordStatus } from "@/lib/mock-data";
import ProgressBars from "@/components/ProgressBars";

const SnapWordsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const snap = mockSnaps.find((s) => s.id === id);
  const words = snap ? getWordsForSnap(snap.id) : [];

  if (!snap) return <div className="p-5 text-center text-muted-foreground">Snap not found</div>;

  return (
    <div className="min-h-screen px-5 pt-12 pb-24">
      <div className="flex items-center gap-3 mb-5 animate-fade-up">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-foreground truncate">{snap.originalText}</h1>
          <p className="text-xs text-muted-foreground">{snap.language} · {words.length} words</p>
        </div>
      </div>

      <img
        src={snap.imageUrl}
        alt="Snap"
        className="w-full h-40 rounded-3xl object-cover mb-5 animate-fade-up"
        style={{ animationDelay: "60ms", animationFillMode: "both" }}
      />

      <div className="space-y-3">
        {words.map((word, i) => (
          <div
            key={word.id}
            className="bg-card rounded-3xl p-4 border border-border/50 shadow-sm animate-fade-up"
            style={{ animationDelay: `${(i + 2) * 60}ms`, animationFillMode: "both" }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-base font-semibold text-foreground">{word.word}</p>
                <p className="text-sm text-muted-foreground">{word.translation}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                word.correctCount >= 5
                  ? "bg-success/10 text-success"
                  : word.correctCount >= 3
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}>
                {getWordStatus(word)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground italic mb-3">"{word.example}"</p>
            <ProgressBars count={word.correctCount} />
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate(`/study?snap=${snap.id}`)}
        className="w-full bg-primary text-primary-foreground rounded-3xl py-4 mt-5 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
      >
        <BookOpen size={18} />
        Study These Words
      </button>
    </div>
  );
};

export default SnapWordsPage;
