import { useState } from "react";
import { Image, Loader2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type ScanState = "idle" | "processing" | "done";

const ScanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [state, setState] = useState<ScanState>("idle");

  const handleCapture = () => {
    setState("processing");
    setTimeout(() => {
      setState("done");
      setTimeout(() => navigate("/result/1"), 600);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-foreground flex flex-col items-center justify-between pb-24 pt-16 relative">
      {/* Viewfinder */}
      <div className="flex-1 flex items-center justify-center w-full px-8">
        {state === "idle" && (
          <div className="w-full aspect-square rounded-3xl border-4 border-dashed border-primary-foreground/40 flex items-center justify-center">
            <p className="text-primary-foreground/60 text-lg font-bold text-center px-4">
              {t("scan.pointAtObject")}
            </p>
          </div>
        )}

        {state === "processing" && (
          <div className="flex flex-col items-center gap-5">
            <Loader2 size={56} className="text-primary-foreground animate-spin" />
            <p className="text-primary-foreground font-bold text-lg">{t("scan.analyzing")}</p>
            <p className="text-primary-foreground/60 text-sm font-semibold">{t("scan.extracting")}</p>
            <div className="w-48 h-3 rounded-full overflow-hidden bg-primary-foreground/20">
              <div className="h-full animate-shimmer rounded-full" />
            </div>
          </div>
        )}

        {state === "done" && (
          <div className="flex flex-col items-center gap-4 animate-bounce-in">
            <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center" style={{ borderBottomWidth: 6, borderBottomColor: "hsl(var(--success-dark))" }}>
              <Check size={40} className="text-success-foreground" />
            </div>
            <p className="text-primary-foreground font-bold text-lg">{t("scan.complete")}</p>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      {state === "idle" && (
        <div className="flex items-center justify-center gap-8 pb-4">
          <button
            onClick={handleCapture}
            className="w-10 h-10 rounded-2xl bg-primary-foreground/20 flex items-center justify-center"
          >
            <Image size={22} className="text-primary-foreground" />
          </button>

          <button
            onClick={handleCapture}
            className="w-20 h-20 rounded-full bg-primary-foreground flex items-center justify-center border-4 border-primary-foreground/50 active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 rounded-full border-4 border-foreground/20" />
          </button>

          <div className="w-10 h-10" /> {/* spacer */}
        </div>
      )}
    </div>
  );
};

export default ScanPage;
