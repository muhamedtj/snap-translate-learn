import { useState } from "react";
import { Image, Loader2, Check, Lock, Zap, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

const SCAN_COUNT_KEY = "snaplingo-scan-count";
const MAX_FREE_SCANS = 5;

function getScanCount(): number {
  return parseInt(localStorage.getItem(SCAN_COUNT_KEY) || "0", 10);
}

function incrementScanCount() {
  localStorage.setItem(SCAN_COUNT_KEY, String(getScanCount() + 1));
}

type ScanState = "idle" | "processing" | "done" | "limit";

const ScanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [state, setState] = useState<ScanState>("idle");

  const scanCount = getScanCount();
  const remaining = MAX_FREE_SCANS - scanCount;

  const handleCapture = () => {
    if (!user && scanCount >= MAX_FREE_SCANS) {
      setState("limit");
      return;
    }
    incrementScanCount();
    setState("processing");
    setTimeout(() => {
      setState("done");
      setTimeout(() => navigate("/result/1"), 600);
    }, 2200);
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-12 pt-6 md:pt-8 px-5 md:px-8 lg:px-12">
      {/* Free scans counter */}
      {!user && state === "idle" && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted-foreground/80 px-3.5 py-1.5 text-xs font-bold text-card">
            <Zap size={13} className="text-warning" fill="currentColor" />
            {t("scan.remaining", { count: Math.max(remaining, 0) })}
          </span>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center w-full max-w-3xl mx-auto">
        {state === "idle" && (
          <div className="w-full min-h-[60vh] rounded-3xl border-2 border-dashed border-primary/35 bg-card/40 flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <UploadCloud size={56} className="text-primary" strokeWidth={1.75} />
            <h2 className="text-xl font-extrabold text-foreground">{t("scan.pointAtObject")}</h2>
            <p className="text-sm font-medium text-muted-foreground max-w-xs">{t("scan.extracting")}</p>
            <button
              onClick={handleCapture}
              className="btn-volumetric-primary mt-4 w-full max-w-xs flex flex-col items-center gap-1"
            >
              <Image size={18} />
              <span>{t("scan.chooseFile", { defaultValue: "Choose file" })}</span>
            </button>
          </div>
        )}

        {state === "processing" && (
          <div className="flex flex-col items-center gap-5 py-24">
            <Loader2 size={56} className="text-primary animate-spin" />
            <p className="text-foreground font-extrabold text-lg">{t("scan.analyzing")}</p>
            <p className="text-muted-foreground text-sm font-medium">{t("scan.extracting")}</p>
            <div className="w-48 h-2.5 rounded-full overflow-hidden bg-muted">
              <div className="h-full animate-shimmer rounded-full" />
            </div>
          </div>
        )}

        {state === "done" && (
          <div className="flex flex-col items-center gap-4 py-24 animate-bounce-in">
            <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center shadow-soft">
              <Check size={40} className="text-success-foreground" />
            </div>
            <p className="text-foreground font-extrabold text-lg">{t("scan.complete")}</p>
          </div>
        )}

        {state === "limit" && (
          <div className="flex flex-col items-center gap-4 px-4 py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-warning flex items-center justify-center shadow-soft">
              <Lock size={36} className="text-warning-foreground" />
            </div>
            <p className="text-foreground font-extrabold text-lg">{t("scan.limitTitle")}</p>
            <p className="text-muted-foreground text-sm font-medium">{t("scan.limitDesc")}</p>
            <button onClick={() => navigate("/profile")} className="btn-volumetric-primary px-8">
              {t("scan.signUpToUnlock")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export default ScanPage;
