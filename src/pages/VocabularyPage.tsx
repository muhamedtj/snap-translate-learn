import { useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { allVocabWords } from "@/lib/mock-data";

const VocabularyPage = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const filtered = allVocabWords.filter(
    (w) =>
      w.word.toLowerCase().includes(query.toLowerCase()) ||
      w.translation.toLowerCase().includes(query.toLowerCase())
  );

  const renderSrsLevel = (level: number) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className={`w-1.5 h-4 rounded-sm ${
              i < level ? "bg-success" : "bg-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-24 pt-12 px-5">
      <h1 className="text-2xl font-black text-foreground mb-4">{t("vocabulary.title")}</h1>

      {/* Search */}
      <div className="card-volumetric flex items-center gap-3 px-4 py-3 mb-5">
        <Search size={20} className="text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("vocabulary.search")}
          className="flex-1 bg-transparent text-base font-semibold text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>

      {/* Word list */}
      <div className="space-y-2">
        {filtered.map((word, i) => (
          <div
            key={word.id}
            className="card-volumetric flex items-center justify-between p-4 animate-fade-up"
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-base font-extrabold text-foreground">{word.word}</p>
              <p className="text-sm font-semibold text-muted-foreground">{word.translation}</p>
            </div>
            {renderSrsLevel(word.srsLevel)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VocabularyPage;
