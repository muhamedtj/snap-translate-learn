import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FlashCard from "@/components/FlashCard";
import { allVocabWords } from "@/lib/mock-data";

const FlashcardsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-5 pt-14 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Flashcards</h1>
          <p className="text-xs text-muted-foreground">{allVocabWords.length} words saved</p>
        </div>
      </div>

      <div className="space-y-3">
        {allVocabWords.map((word, i) => (
          <div
            key={word.id}
            className="animate-fade-up"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
          >
            <FlashCard word={word} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardsPage;
