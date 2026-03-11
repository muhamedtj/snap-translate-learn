import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { topics } from "@/lib/mock-data";

const VocabularyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = topics.filter((topic) =>
    topic.name.toLowerCase().includes(query.toLowerCase()) ||
    topic.language.toLowerCase().includes(query.toLowerCase())
  );

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
          placeholder={t("vocabulary.searchTopics")}
          className="flex-1 bg-transparent text-base font-semibold text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>

      {/* Topics list */}
      <div className="space-y-3">
        {filtered.map((topic, i) => (
          <button
            key={topic.id}
            onClick={() => navigate(`/study?topic=${topic.id}`)}
            className="card-volumetric w-full flex items-center gap-4 p-4 text-left animate-fade-up active:scale-[0.98] transition-transform"
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
          >
            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-2xl flex-shrink-0">
              {topic.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-extrabold text-foreground">{topic.name}</p>
              <p className="text-sm font-semibold text-muted-foreground">{topic.language} · {topic.wordCount} {t("dashboard.words")}</p>
            </div>
            <div className="text-primary font-black text-lg">→</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VocabularyPage;
