import { useState } from "react";
import { ArrowLeft, Upload, Camera, Loader2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ScanState = "idle" | "processing" | "done";

const ScanPage = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<ScanState>("idle");

  const handleUpload = () => {
    setState("processing");
    setTimeout(() => {
      setState("done");
      setTimeout(() => navigate("/result/1"), 600);
    }, 2200);
  };

  return (
    <div className="min-h-screen px-5 pt-14 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Scan Image</h1>
      </div>

      {/* Upload Zone */}
      <div className="animate-fade-up">
        {state === "idle" && (
          <button
            onClick={handleUpload}
            className="w-full aspect-[4/3] rounded-3xl border-2 border-dashed border-primary/30 bg-accent/50 flex flex-col items-center justify-center gap-4 transition-all hover:border-primary/50 hover:bg-accent active:scale-[0.98]"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Upload size={28} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Tap to upload an image</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 10MB</p>
            </div>
          </button>
        )}

        {state === "processing" && (
          <div className="w-full aspect-[4/3] rounded-3xl bg-card border border-border/50 flex flex-col items-center justify-center gap-5">
            <Loader2 size={40} className="text-primary animate-spin" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Analyzing image…</p>
              <p className="text-xs text-muted-foreground mt-1">Extracting text & translating</p>
            </div>
            <div className="w-48 h-2 rounded-full overflow-hidden">
              <div className="h-full animate-shimmer rounded-full" />
            </div>
          </div>
        )}

        {state === "done" && (
          <div className="w-full aspect-[4/3] rounded-3xl bg-card border border-border/50 flex flex-col items-center justify-center gap-4 animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center">
              <Check size={32} className="text-success-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Analysis Complete!</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {state === "idle" && (
        <div className="mt-6 flex gap-3 animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
          <button
            onClick={handleUpload}
            className="flex-1 bg-card rounded-2xl p-4 border border-border/50 flex flex-col items-center gap-2 transition-all hover:shadow-sm active:scale-[0.98]"
          >
            <Camera size={20} className="text-primary" />
            <span className="text-xs font-medium text-foreground">Camera</span>
          </button>
          <button
            onClick={handleUpload}
            className="flex-1 bg-card rounded-2xl p-4 border border-border/50 flex flex-col items-center gap-2 transition-all hover:shadow-sm active:scale-[0.98]"
          >
            <Upload size={20} className="text-primary" />
            <span className="text-xs font-medium text-foreground">Gallery</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ScanPage;
