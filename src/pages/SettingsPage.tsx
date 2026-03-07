import { ArrowLeft, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", flag: "🇬🇧" },
  { code: "ru", flag: "🇷🇺" },
  { code: "de", flag: "🇩🇪" },
  { code: "es", flag: "🇪🇸" },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen px-5 pt-14 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{t("settings.title")}</h1>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 p-4 animate-fade-up">
        <div className="flex items-center gap-2 mb-1">
          <Globe size={16} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">{t("settings.language")}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">{t("settings.languageDesc")}</p>

        <div className="space-y-2">
          {languages.map(({ code, flag }) => (
            <button
              key={code}
              onClick={() => i18n.changeLanguage(code)}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all active:scale-[0.98] ${
                i18n.language === code
                  ? "bg-primary/10 border-2 border-primary"
                  : "bg-accent/50 border-2 border-transparent hover:border-border"
              }`}
            >
              <span className="text-xl">{flag}</span>
              <span className="text-sm font-medium text-foreground">
                {t(`settings.languages.${code}`)}
              </span>
              {i18n.language === code && (
                <span className="ml-auto text-xs font-semibold text-primary">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
