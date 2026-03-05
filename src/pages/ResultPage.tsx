import { ArrowLeft, BookmarkPlus, Share2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { mockSnaps } from "@/lib/mock-data";
import FlashCard from "@/components/FlashCard";

const ResultPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const snap = mockSnaps.find((s) => s.id === id) ?? mockSnaps[0];

  return (
    <div className="min-h-screen px-5 pt-14 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center">
            <BookmarkPlus size={16} />
          </button>
          <button className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Image */}
      <img
        src={snap.imageUrl}
        alt="Scanned"
        className="w-full h-48 rounded-2xl object-cover mb-5 animate-fade-up"
      />

      {/* Original Text */}
      <div className="bg-card rounded-2xl p-4 border border-border/50 mb-3 animate-fade-up" style={{ animationDelay: "80ms", animationFillMode: "both" }}>
        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Original — {snap.language}</span>
        <p className="text-base font-medium text-foreground mt-1.5">{snap.originalText}</p>
      </div>

      {/* Translation */}
      <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 mb-3 animate-fade-up" style={{ animationDelay: "160ms", animationFillMode: "both" }}>
        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Translation</span>
        <p className="text-base text-foreground mt-1.5">{snap.translation}</p>
      </div>

      {/* Grammar */}
      <div className="bg-card rounded-2xl p-4 border border-border/50 mb-5 animate-fade-up" style={{ animationDelay: "240ms", animationFillMode: "both" }}>
        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Grammar Notes</span>
        <div className="mt-2 space-y-1.5">
          {snap.grammarNotes.split("\n").map((note, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">{note}</p>
          ))}
        </div>
      </div>

      {/* Vocabulary */}
      <div className="animate-fade-up" style={{ animationDelay: "320ms", animationFillMode: "both" }}>
        <h3 className="text-sm font-semibold text-foreground mb-3">Vocabulary</h3>
        <div className="space-y-3">
          {snap.words.map((word) => (
            <FlashCard key={word.id} word={word} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
