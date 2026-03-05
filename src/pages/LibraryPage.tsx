import { ArrowLeft, Languages, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockSnaps, getWordsForSnap } from "@/lib/mock-data";

const LibraryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-5 pt-12 pb-24">
      <div className="flex items-center gap-3 mb-6 animate-fade-up">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Library</h1>
          <p className="text-xs text-muted-foreground">{mockSnaps.length} snaps</p>
        </div>
      </div>

      <div className="space-y-3">
        {mockSnaps.map((snap, i) => {
          const words = getWordsForSnap(snap.id);
          const learnt = words.filter((w) => w.correctCount >= 5).length;
          return (
            <div
              key={snap.id}
              className="bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm animate-fade-up"
              style={{ animationDelay: `${i * 70}ms`, animationFillMode: "both" }}
            >
              <button
                onClick={() => navigate(`/snap/${snap.id}`)}
                className="w-full text-left flex gap-3 p-3"
              >
                <img
                  src={snap.imageUrl}
                  alt="Snap"
                  className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0 py-0.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Languages size={12} className="text-primary" />
                    <span className="text-[11px] font-medium text-primary">{snap.language}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">{snap.originalText}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {words.length} words · {learnt} learnt
                  </p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground self-center flex-shrink-0" />
              </button>
              <div className="px-3 pb-3">
                <button
                  onClick={() => navigate(`/study?snap=${snap.id}`)}
                  className="w-full bg-primary/10 text-primary text-sm font-medium rounded-2xl py-2.5 transition-all active:scale-[0.98]"
                >
                  Learn
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LibraryPage;
