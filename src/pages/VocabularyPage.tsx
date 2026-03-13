import { Search, MoreVertical, Filter, Check, Pencil, Play, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { topics, allVocabWords } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function getTopicProgress(topicId: string) {
  const words = allVocabWords.filter((w) => w.topicId === topicId);
  if (words.length === 0) return 0;
  const mastered = words.filter((w) => w.mastered).length;
  return Math.round((mastered / words.length) * 100);
}

const VocabularyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [langFilter, setLangFilter] = useState<string | null>(null);
  const [langFilterOpen, setLangFilterOpen] = useState(false);

  // Action menu state
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Rename dialog
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameTopicId, setRenameTopicId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Confirm dialogs
  const [resetConfirmId, setResetConfirmId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const languages = [...new Set(topics.map((t) => t.language))];

  const filtered = topics.filter((topic) => {
    const matchesQuery =
      topic.name.toLowerCase().includes(query.toLowerCase()) ||
      topic.language.toLowerCase().includes(query.toLowerCase());
    const matchesLang = !langFilter || topic.language === langFilter;
    return matchesQuery && matchesLang;
  });

  const handleRename = () => {
    // In real app: update topic name in DB
    setRenameOpen(false);
    setRenameTopicId(null);
  };

  const handleResetProgress = () => {
    // In real app: reset is_learned for all words in topic
    setResetConfirmId(null);
  };

  const handleDelete = () => {
    // In real app: delete topic from DB
    setDeleteConfirmId(null);
  };

  return (
    <div className="min-h-screen pb-24 pt-12 px-5">
      <h1 className="text-2xl font-black text-foreground mb-4">{t("vocabulary.title")}</h1>

      {/* Search + Filter */}
      <div className="flex gap-2 mb-5">
        <div className="card-volumetric flex-1 flex items-center gap-3 px-4 py-3">
          <Search size={20} className="text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("vocabulary.searchTopics")}
            className="flex-1 bg-transparent text-base font-semibold text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
        <Popover open={langFilterOpen} onOpenChange={setLangFilterOpen}>
          <PopoverTrigger asChild>
            <button
              className={`card-volumetric w-12 h-12 flex items-center justify-center flex-shrink-0 ${langFilter ? "text-primary" : "text-muted-foreground"}`}
            >
              <Filter size={20} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            <button
              onClick={() => { setLangFilter(null); setLangFilterOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors ${!langFilter ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
            >
              {t("vocabulary.allLanguages")}
            </button>
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => { setLangFilter(lang); setLangFilterOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors ${langFilter === lang ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
              >
                {lang}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      {/* Topics list */}
      <div className="space-y-3">
        {filtered.map((topic, i) => {
          const progress = getTopicProgress(topic.id);
          const isComplete = progress === 100;

          return (
            <div
              key={topic.id}
              className={`card-volumetric w-full p-4 animate-fade-up transition-colors ${isComplete ? "bg-success/10 border-success/30" : ""}`}
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(`/study?topic=${topic.id}`)}
                  className="flex items-center gap-4 flex-1 min-w-0 text-left active:scale-[0.98] transition-transform"
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-2xl flex-shrink-0">
                    {topic.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-base font-extrabold text-foreground">{topic.name}</p>
                      {isComplete && <Check size={16} className="text-success flex-shrink-0" strokeWidth={3} />}
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      {topic.language} · {topic.wordCount} {t("dashboard.words")}
                    </p>
                  </div>
                </button>

                {/* 3-dot menu */}
                <Popover
                  open={menuOpenId === topic.id}
                  onOpenChange={(open) => setMenuOpenId(open ? topic.id : null)}
                >
                  <PopoverTrigger asChild>
                    <button className="w-8 h-8 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-52 p-1.5" align="end">
                    <button
                      onClick={() => {
                        setMenuOpenId(null);
                        setRenameTopicId(topic.id);
                        setRenameValue(topic.name);
                        setRenameOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors"
                    >
                      <Pencil size={16} /> {t("vocabulary.rename")}
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpenId(null);
                        navigate(`/study?topic=${topic.id}`);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors"
                    >
                      <Play size={16} /> {t("vocabulary.startStudy")}
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpenId(null);
                        setResetConfirmId(topic.id);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-warning hover:bg-muted transition-colors"
                    >
                      <RotateCcw size={16} /> {t("vocabulary.resetProgress")}
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpenId(null);
                        setDeleteConfirmId(topic.id);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-destructive hover:bg-muted transition-colors"
                    >
                      <Trash2 size={16} /> {t("vocabulary.delete")}
                    </button>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Progress bar */}
              <div className="mt-3 flex items-center gap-2">
                <Progress
                  value={progress}
                  className={`h-2 flex-1 ${isComplete ? "[&>div]:bg-success" : ""}`}
                />
                <span className={`text-xs font-bold ${isComplete ? "text-success" : "text-muted-foreground"}`}>
                  {progress}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("vocabulary.rename")}</DialogTitle>
          </DialogHeader>
          <input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl text-base font-bold border-2 border-border bg-card text-foreground outline-none focus:border-primary transition-colors"
            style={{ borderBottomWidth: 4 }}
            autoFocus
          />
          <DialogFooter>
            <button onClick={() => setRenameOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-muted-foreground">
              {t("vocabulary.cancel")}
            </button>
            <button onClick={handleRename} className="btn-volumetric-primary px-6 py-2 text-sm">
              {t("vocabulary.save")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Progress Confirm */}
      <AlertDialog open={!!resetConfirmId} onOpenChange={(open) => !open && setResetConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("vocabulary.resetConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("vocabulary.resetConfirmDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("vocabulary.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetProgress}>{t("vocabulary.resetProgress")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("vocabulary.deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("vocabulary.deleteConfirmDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("vocabulary.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t("vocabulary.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VocabularyPage;
