import { useState, useMemo } from "react";
import { ArrowLeft, Volume2, Check, X, RotateCcw, Sparkles } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { allWords, getWordsForSnap, getNextReviewDate, type VocabWord } from "@/lib/mock-data";

type SessionMode = "flashcard" | "sentence";

const StudySessionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const snapId = searchParams.get("snap");

  const studyWords = useMemo(() => {
    const source = snapId ? getWordsForSnap(snapId) : allWords.filter((w) => w.correctCount < 5);
    return source.length > 0 ? source : allWords.slice(0, 4);
  }, [snapId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState<SessionMode>("flashcard");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);

  // Sentence builder state
  const [sentenceInput, setSentenceInput] = useState("");
  const [sentenceResult, setSentenceResult] = useState<"correct" | "wrong" | null>(null);

  const word = studyWords[currentIndex];

  const handleAnswer = (correct: boolean) => {
    const newCount = correct ? Math.min((word.correctCount + (scores[word.id] || 0)) + 1, 5) : word.correctCount;
    setScores((prev) => ({ ...prev, [word.id]: (prev[word.id] || 0) + (correct ? 1 : 0) }));

    if (currentIndex < studyWords.length - 1) {
      setCurrentIndex((i) => i + 1);
      setFlipped(false);
      setSentenceInput("");
      setSentenceResult(null);
    } else {
      setCompleted(true);
    }
  };

  const handleSentenceCheck = () => {
    const correct = sentenceInput.toLowerCase().includes(word.word.toLowerCase());
    setSentenceResult(correct ? "correct" : "wrong");
    setTimeout(() => handleAnswer(correct), 800);
  };

  const handleAudio = () => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(word.word);
      u.lang = word.language === "French" ? "fr-FR" : word.language === "German" ? "de-DE" : "ja-JP";
      speechSynthesis.speak(u);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setCompleted(false);
    setScores({});
    setSentenceInput("");
    setSentenceResult(null);
  };

  if (completed) {
    const totalCorrect = Object.values(scores).reduce((a, b) => a + b, 0);
    return (
      <div className="min-h-screen px-5 pt-12 pb-24 flex flex-col items-center justify-center">
        <div className="animate-scale-in text-center">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={36} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Session Complete!</h2>
          <p className="text-muted-foreground text-sm mb-6">
            {totalCorrect}/{studyWords.length} correct answers
          </p>
          <div className="flex gap-3">
            <button
              onClick={restart}
              className="flex-1 bg-card border border-border/50 rounded-3xl py-3 text-sm font-medium text-foreground transition-all active:scale-95"
            >
              <RotateCcw size={14} className="inline mr-1.5" />
              Again
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-primary text-primary-foreground rounded-3xl py-3 text-sm font-medium transition-all active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 pt-12 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-up">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-sm font-medium text-muted-foreground">
          {currentIndex + 1} / {studyWords.length}
        </span>
        <div className="w-9" />
      </div>

      {/* Progress */}
      <div className="w-full h-1.5 bg-secondary rounded-full mb-8">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / studyWords.length) * 100}%` }}
        />
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6 justify-center">
        {(["flashcard", "sentence"] as SessionMode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setFlipped(false); setSentenceInput(""); setSentenceResult(null); }}
            className={`px-4 py-2 rounded-3xl text-xs font-medium transition-all ${
              mode === m
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground border border-border/50"
            }`}
          >
            {m === "flashcard" ? "Flashcard" : "Sentence Builder"}
          </button>
        ))}
      </div>

      {mode === "flashcard" ? (
        /* Flashcard Mode */
        <div className="animate-fade-up">
          <div
            className="perspective-1000 cursor-pointer mb-6"
            onClick={() => setFlipped(!flipped)}
          >
            <div className={`relative w-full h-56 transition-transform duration-500 preserve-3d ${flipped ? "rotate-y-180" : ""}`}>
              <div className="absolute inset-0 backface-hidden bg-card rounded-3xl border border-border/50 shadow-sm p-6 flex flex-col items-center justify-center gap-3">
                <span className="text-[11px] font-medium text-primary">{word.language}</span>
                <span className="text-3xl font-bold text-foreground">{word.word}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleAudio(); }}
                  className="w-10 h-10 rounded-full bg-accent flex items-center justify-center transition-all active:scale-90"
                >
                  <Volume2 size={18} className="text-accent-foreground" />
                </button>
                <span className="text-[10px] text-muted-foreground">Tap to reveal</span>
              </div>
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-primary rounded-3xl p-6 flex flex-col items-center justify-center gap-3">
                <span className="text-2xl font-bold text-primary-foreground">{word.translation}</span>
                <p className="text-sm text-primary-foreground/70 italic text-center">"{word.example}"</p>
              </div>
            </div>
          </div>

          {flipped && (
            <div className="flex gap-3 animate-fade-up">
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 bg-destructive/10 text-destructive rounded-3xl py-3.5 text-sm font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <X size={16} /> Still learning
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 bg-success/10 text-success rounded-3xl py-3.5 text-sm font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Check size={16} /> Got it!
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Sentence Builder Mode */
        <div className="animate-fade-up">
          <div className="bg-card rounded-3xl border border-border/50 shadow-sm p-6 mb-5">
            <p className="text-xs text-muted-foreground mb-2">Use this word in a sentence:</p>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-foreground">{word.word}</span>
              <button
                onClick={handleAudio}
                className="w-8 h-8 rounded-full bg-accent flex items-center justify-center transition-all active:scale-90"
              >
                <Volume2 size={14} className="text-accent-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">({word.translation})</p>
          </div>

          <textarea
            value={sentenceInput}
            onChange={(e) => setSentenceInput(e.target.value)}
            placeholder={`Write a sentence using "${word.word}"...`}
            className="w-full bg-card border border-border/50 rounded-3xl p-4 text-sm text-foreground placeholder:text-muted-foreground resize-none h-28 focus:outline-none focus:ring-2 focus:ring-primary/30 mb-4"
          />

          {sentenceResult && (
            <div className={`rounded-3xl p-3 mb-4 text-center text-sm font-medium ${
              sentenceResult === "correct"
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            }`}>
              {sentenceResult === "correct" ? "Great job! ✓" : "Try again next time"}
            </div>
          )}

          {!sentenceResult && (
            <button
              onClick={handleSentenceCheck}
              disabled={!sentenceInput.trim()}
              className="w-full bg-primary text-primary-foreground rounded-3xl py-3.5 text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
            >
              Check
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StudySessionPage;
