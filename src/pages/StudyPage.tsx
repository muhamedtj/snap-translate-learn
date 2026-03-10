import { useState } from "react";
import { Volume2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { allVocabWords } from "@/lib/mock-data";

const StudyPage = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState<number>(0);
  const total = allVocabWords.length;
  const word = allVocabWords[currentIndex];
  const progress = Math.round((answered / total) * 100);

  const handleAnswer = (know: boolean) => {
    setAnswered((a) => a + 1);
    setCurrentIndex((i) => (i + 1) % total);
  };

  // SRS dots (simulate session progress)
  const srsDots = Array.from({ length: 3 }, (_, i) => i < word.srsLevel % 4);

  return (
    <div className="min-h-screen flex flex-col pb-24 pt-12 px-5">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-muted-foreground">{t("study.progress")}</span>
          <span className="text-sm font-extrabold text-primary">{progress}%</span>
        </div>
        <div className="w-full h-4 rounded-full bg-muted overflow-hidden" style={{ borderBottomWidth: 3, borderBottomColor: "hsl(var(--border))" }}>
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex items-center justify-center">
        <div className="card-volumetric w-full aspect-square max-w-[320px] flex flex-col items-center justify-center p-8 relative">
          {/* SRS dots */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
            {srsDots.map((filled, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${filled ? "bg-success" : "bg-muted"}`}
              />
            ))}
          </div>

          <span className="text-4xl font-black text-foreground mb-3">{word.word}</span>
          <span className="text-sm font-semibold text-muted-foreground mb-4">{word.language}</span>

          <button className="w-12 h-12 rounded-full bg-accent flex items-center justify-center" style={{ borderBottomWidth: 3, borderBottomColor: "hsl(var(--border))" }}>
            <Volume2 size={22} className="text-primary" />
          </button>
        </div>
      </div>

      {/* Answer buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => handleAnswer(false)}
          className="btn-volumetric-destructive flex-1 text-base"
        >
          {t("study.dontKnow")}
        </button>
        <button
          onClick={() => handleAnswer(true)}
          className="btn-volumetric-success flex-1 text-base"
        >
          {t("study.know")}
        </button>
      </div>
    </div>
  );
};

export default StudyPage;
