import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { VocabWord } from "@/lib/mock-data";

interface FlashCardProps {
  word: VocabWord;
}

const FlashCard = ({ word }: FlashCardProps) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-36 transition-transform duration-500 preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-card rounded-2xl border border-border/50 shadow-sm p-4 flex flex-col items-center justify-center gap-2">
          <span className="text-[11px] font-medium text-primary">{word.language}</span>
          <span className="text-xl font-semibold text-foreground">{word.word}</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <RotateCcw size={12} />
            <span className="text-[10px]">Tap to flip</span>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-primary rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
          <span className="text-lg font-semibold text-primary-foreground">{word.translation}</span>
          <p className="text-xs text-primary-foreground/70 text-center italic">"{word.example}"</p>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
