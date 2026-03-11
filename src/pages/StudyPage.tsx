import { useState, useEffect, useCallback, useMemo } from "react";
import { Volume2, Settings2, X, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { allVocabWords, availableLanguages, studyModes, type StudyMode } from "@/lib/mock-data";

const STORAGE_KEY = "snaplingo-study-settings";

function loadSettings(): { languages: string[]; modes: StudyMode[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { languages: availableLanguages, modes: ["flashcards"] };
}

function saveSettings(languages: string[], modes: StudyMode[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ languages, modes }));
}

const StudyPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get("topic");

  const saved = useMemo(() => loadSettings(), []);

  const [showSettings, setShowSettings] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(saved.languages);
  const [selectedModes, setSelectedModes] = useState<StudyMode[]>(saved.modes);

  // Study state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mcAnswer, setMcAnswer] = useState<string | null>(null);
  const [writeInput, setWriteInput] = useState("");
  const [writeResult, setWriteResult] = useState<"correct" | "wrong" | null>(null);
  const [mcOptions, setMcOptions] = useState<string[]>([]);

  // Persist settings
  useEffect(() => {
    saveSettings(selectedLanguages, selectedModes);
  }, [selectedLanguages, selectedModes]);

  // Pick random mode from selected modes each round
  const [activeMode, setActiveMode] = useState<StudyMode>(() =>
    saved.modes[Math.floor(Math.random() * saved.modes.length)]
  );

  const words = allVocabWords.filter((w) => {
    if (topicId && w.topicId !== topicId) return false;
    if (!selectedLanguages.includes(w.language)) return false;
    return true;
  });

  const total = words.length;
  const word = words[currentIndex % Math.max(total, 1)];
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;

  // Generate MC options when word changes
  useEffect(() => {
    if (!word) return;
    const correct = word.translation;
    const others = allVocabWords
      .filter((w) => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.translation);
    setMcOptions([correct, ...others].sort(() => Math.random() - 0.5));
  }, [word?.id]);

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
    setCurrentIndex(0);
    setAnswered(0);
  };

  const toggleMode = (mode: StudyMode) => {
    setSelectedModes((prev) => {
      const next = prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode];
      return next.length > 0 ? next : prev;
    });
  };

  const advance = useCallback(() => {
    setAnswered((a) => a + 1);
    setCurrentIndex((i) => (i + 1) % Math.max(total, 1));
    setFlipped(false);
    setMcAnswer(null);
    setWriteInput("");
    setWriteResult(null);
    // Pick random mode from selected
    setActiveMode(selectedModes[Math.floor(Math.random() * selectedModes.length)]);
  }, [total, selectedModes]);

  const srsDots = word ? Array.from({ length: 3 }, (_, i) => i < word.srsLevel % 4) : [];

  if (total === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pb-24 pt-12 px-5">
        <p className="text-xl font-bold text-muted-foreground">{t("study.noWords")}</p>
        <button onClick={() => setShowSettings(true)} className="btn-volumetric-primary mt-4 px-6 py-3 text-base">
          <Settings2 size={18} className="inline mr-2" />
          {t("study.settings")}
        </button>
        {showSettings && renderSettings()}
      </div>
    );
  }

  function renderSettings() {
    return (
      <div className="fixed inset-0 z-50 bg-foreground/50 flex items-end justify-center" onClick={() => setShowSettings(false)}>
        <div className="bg-card w-full max-w-lg rounded-t-3xl p-6 pb-10 animate-fade-up" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black text-foreground">{t("study.settings")}</h2>
            <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>

          <p className="text-sm font-bold text-muted-foreground mb-2">{t("study.filterByLanguage")}</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => toggleLanguage(lang)}
                className={`px-4 py-2 rounded-2xl text-sm font-bold border-2 transition-all ${
                  selectedLanguages.includes(lang)
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-muted/50 border-transparent text-muted-foreground"
                }`}
                style={{
                  borderBottomWidth: 4,
                  borderBottomColor: selectedLanguages.includes(lang) ? "hsl(var(--primary-dark))" : "hsl(var(--border))",
                }}
              >
                {lang}
              </button>
            ))}
          </div>

          <p className="text-sm font-bold text-muted-foreground mb-2">{t("study.studyModes")}</p>
          <div className="space-y-2">
            {studyModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => toggleMode(mode.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${
                  selectedModes.includes(mode.id)
                    ? "bg-primary/10 border-primary text-foreground"
                    : "bg-muted/50 border-transparent text-muted-foreground"
                }`}
                style={{
                  borderBottomWidth: 4,
                  borderBottomColor: selectedModes.includes(mode.id) ? "hsl(var(--primary-dark))" : "hsl(var(--border))",
                }}
              >
                <span className="text-xl">{mode.emoji}</span>
                <span>{t(mode.labelKey)}</span>
                {selectedModes.includes(mode.id) && <Check size={16} className="ml-auto text-primary" />}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowSettings(false)}
            className="btn-volumetric-primary w-full mt-5 text-base"
          >
            {t("study.apply")}
          </button>
        </div>
      </div>
    );
  }

  function renderFlashcard() {
    return (
      <>
        <div className="flex-1 flex items-center justify-center" onClick={() => setFlipped(!flipped)}>
          <div className="card-volumetric w-full aspect-square max-w-[320px] flex flex-col items-center justify-center p-8 relative cursor-pointer">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
              {srsDots.map((filled, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${filled ? "bg-success" : "bg-muted"}`} />
              ))}
            </div>
            {!flipped ? (
              <>
                <span className="text-4xl font-black text-foreground mb-3">{word.word}</span>
                <span className="text-sm font-semibold text-muted-foreground mb-4">{word.language}</span>
              </>
            ) : (
              <>
                <span className="text-3xl font-black text-primary mb-3">{word.translation}</span>
                <span className="text-sm font-semibold text-muted-foreground mb-4">{word.example}</span>
              </>
            )}
            <button className="w-12 h-12 rounded-full bg-accent flex items-center justify-center" style={{ borderBottomWidth: 3, borderBottomColor: "hsl(var(--border))" }}>
              <Volume2 size={22} className="text-primary" />
            </button>
            <span className="text-xs text-muted-foreground mt-3 font-semibold">{t("study.tapToFlip")}</span>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={advance} className="btn-volumetric-destructive flex-1 text-base">{t("study.dontKnow")}</button>
          <button onClick={advance} className="btn-volumetric-success flex-1 text-base">{t("study.know")}</button>
        </div>
      </>
    );
  }

  function renderAudio() {
    return (
      <>
        <div className="flex-1 flex items-center justify-center">
          <div className="card-volumetric w-full max-w-[320px] flex flex-col items-center justify-center p-10 gap-4">
            <p className="text-sm font-bold text-muted-foreground">{t("study.listenAndTranslate")}</p>
            <button className="w-20 h-20 rounded-full bg-primary flex items-center justify-center" style={{ borderBottomWidth: 6, borderBottomColor: "hsl(var(--primary-dark))" }}>
              <Volume2 size={36} className="text-primary-foreground" />
            </button>
            <span className="text-sm font-semibold text-muted-foreground">{word.language}</span>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={advance} className="btn-volumetric-destructive flex-1 text-base">{t("study.dontKnow")}</button>
          <button onClick={advance} className="btn-volumetric-success flex-1 text-base">{t("study.know")}</button>
        </div>
      </>
    );
  }

  function renderMultipleChoice() {
    return (
      <>
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="card-volumetric w-full max-w-[320px] flex flex-col items-center justify-center p-8">
            <span className="text-3xl font-black text-foreground mb-2">{word.word}</span>
            <span className="text-sm font-semibold text-muted-foreground">{t("study.chooseTranslation")}</span>
          </div>
          <div className="w-full max-w-[320px] space-y-2">
            {mcOptions.map((option, i) => {
              const isCorrect = option === word.translation;
              const isSelected = mcAnswer === option;
              let style = "bg-muted/50 border-transparent text-foreground";
              if (mcAnswer) {
                if (isSelected && isCorrect) style = "bg-success/20 border-success text-success";
                else if (isSelected && !isCorrect) style = "bg-destructive/20 border-destructive text-destructive";
                else if (isCorrect) style = "bg-success/10 border-success/50 text-success";
              }
              return (
                <button
                  key={i}
                  onClick={() => { if (!mcAnswer) setMcAnswer(option); }}
                  className={`w-full px-4 py-3.5 rounded-2xl text-sm font-bold border-2 transition-all ${style}`}
                  style={{ borderBottomWidth: 4, borderBottomColor: mcAnswer && isCorrect ? "hsl(var(--success-dark))" : "hsl(var(--border))" }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
        {mcAnswer && (
          <button onClick={advance} className="btn-volumetric-primary w-full mt-4 text-base">
            {t("study.next")}
          </button>
        )}
      </>
    );
  }

  function renderWriteTranslation() {
    const handleCheck = () => {
      if (writeInput.trim().toLowerCase() === word.translation.toLowerCase()) {
        setWriteResult("correct");
      } else {
        setWriteResult("wrong");
      }
    };

    return (
      <>
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="card-volumetric w-full max-w-[320px] flex flex-col items-center justify-center p-8">
            <span className="text-3xl font-black text-foreground mb-2">{word.word}</span>
            <span className="text-sm font-semibold text-muted-foreground">{t("study.writeTranslation")}</span>
          </div>
          <div className="w-full max-w-[320px]">
            <input
              type="text"
              value={writeInput}
              onChange={(e) => setWriteInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !writeResult && handleCheck()}
              placeholder={t("study.typePlaceholder")}
              className={`w-full px-4 py-4 rounded-2xl text-base font-bold border-2 outline-none transition-all ${
                writeResult === "correct"
                  ? "border-success bg-success/10 text-success"
                  : writeResult === "wrong"
                  ? "border-destructive bg-destructive/10 text-destructive"
                  : "border-border bg-card text-foreground"
              }`}
              style={{ borderBottomWidth: 4 }}
              disabled={!!writeResult}
            />
            {writeResult === "wrong" && (
              <p className="text-sm font-bold text-destructive mt-2">
                {t("study.correctAnswer")}: <span className="text-foreground">{word.translation}</span>
              </p>
            )}
          </div>
        </div>
        {!writeResult ? (
          <button onClick={handleCheck} className="btn-volumetric-primary w-full mt-4 text-base">
            {t("study.check")}
          </button>
        ) : (
          <button onClick={advance} className="btn-volumetric-primary w-full mt-4 text-base">
            {t("study.next")}
          </button>
        )}
      </>
    );
  }

  const modeRenderer: Record<StudyMode, () => JSX.Element> = {
    flashcards: renderFlashcard,
    audio: renderAudio,
    multipleChoice: renderMultipleChoice,
    writeTranslation: renderWriteTranslation,
  };

  const currentModeData = studyModes.find((m) => m.id === activeMode)!;

  return (
    <div className="min-h-screen flex flex-col pb-24 pt-12 px-5">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-black text-foreground">{t("study.title")}</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-muted-foreground">
            {currentModeData.emoji} {t(currentModeData.labelKey)}
          </span>
          <button
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 rounded-2xl bg-card border-2 border-border flex items-center justify-center"
            style={{ borderBottomWidth: 4 }}
          >
            <Settings2 size={20} className="text-primary" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-muted-foreground">{t("study.progress")}</span>
          <span className="text-sm font-extrabold text-primary">{progress}%</span>
        </div>
        <div className="w-full h-4 rounded-full bg-muted overflow-hidden" style={{ borderBottomWidth: 3, borderBottomColor: "hsl(var(--border))" }}>
          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {modeRenderer[activeMode]()}
      {showSettings && renderSettings()}
    </div>
  );
};

export default StudyPage;
