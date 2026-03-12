import { useState } from "react";
import { Image, Loader2, Check, Lock } from "lucide-react";
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
    <div className="min-h-screen bg-foreground flex flex-col items-center justify-between pb-24 pt-16 relative">
      {/* Free scans counter */}
      {!user && state === "idle" && (
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-primary-foreground/10">
          <span className="text-xs font-bold text-primary-foreground">
            {t("scan.remaining", { count: Math.max(remaining, 0) })}
          </span>
        </div>
      )}

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

        {state === "limit" && (
          <div className="flex flex-col items-center gap-5 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-warning flex items-center justify-center" style={{ borderBottomWidth: 6, borderBottomColor: "hsl(var(--warning-dark))" }}>
              <Lock size={36} className="text-warning-foreground" />
            </div>
            <p className="text-primary-foreground font-bold text-lg">{t("scan.limitTitle")}</p>
            <p className="text-primary-foreground/60 text-sm font-semibold">{t("scan.limitDesc")}</p>
            <button
              onClick={() => navigate("/profile")}
              className="btn-volumetric-primary px-8 py-3 text-base"
            >
              {t("scan.signUpToUnlock")}
            </button>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      {state === "idle" && (
        <div className="flex items-center justify-center gap-8 pb-4">
          <button onClick={handleCapture} className="w-10 h-10 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
            <Image size={22} className="text-primary-foreground" />
          </button>
          <button onClick={handleCapture} className="w-20 h-20 rounded-full bg-primary-foreground flex items-center justify-center border-4 border-primary-foreground/50 active:scale-95 transition-transform">
            <div className="w-16 h-16 rounded-full border-4 border-foreground/20" />
          </button>
          <div className="w-10 h-10" />
        </div>
      )}
    </div>
  );
};

export default ScanPage;
