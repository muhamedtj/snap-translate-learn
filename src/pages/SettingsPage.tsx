import { ArrowLeft, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", flag: "🇬🇧" },
  { code: "ru", flag: "🇷🇺" },
  { code: "de", flag: "🇩🇪" },
  { code: "es", flag: "🇪🇸" },
  { code: "pt", flag: "🇧🇷" },
  { code: "kk", flag: "🇰🇿" },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen px-5 md:px-8 lg:px-12 pt-12 md:pt-10 pb-24 md:pb-12 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-2xl bg-card border-2 border-border flex items-center justify-center"
          style={{ borderBottomWidth: 4 }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black text-foreground">{t("settings.title")}</h1>
      </div>

      <div className="card-volumetric p-5 animate-fade-up">
        <div className="flex items-center gap-2 mb-1">
          <Globe size={18} className="text-primary" />
          <span className="text-base font-bold text-foreground">{t("settings.language")}</span>
        </div>
        <p className="text-sm font-semibold text-muted-foreground mb-4">{t("settings.languageDesc")}</p>

        <div className="space-y-2">
          {languages.map(({ code, flag }) => (
            <button
              key={code}
              onClick={() => i18n.changeLanguage(code)}
              className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all active:scale-[0.98] border-2 ${
                i18n.language === code
                  ? "bg-primary/10 border-primary"
                  : "bg-muted/50 border-transparent"
              }`}
              style={{ borderBottomWidth: 4, borderBottomColor: i18n.language === code ? "hsl(var(--primary-dark))" : "hsl(var(--border))" }}
            >
              <span className="text-xl">{flag}</span>
              <span className="text-sm font-bold text-foreground">
                {t(`settings.languages.${code}`)}
              </span>
              {i18n.language === code && (
                <span className="ml-auto text-sm font-black text-primary">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={() => navigate('/admin')} 
          className="text-xs font-bold text-muted-foreground/30 hover:text-primary transition-colors"
        >
          LingoSnap Admin
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
