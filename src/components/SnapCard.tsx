import { Languages } from "lucide-react";
import type { Snap } from "@/lib/mock-data";

interface SnapCardProps {
  snap: Snap;
  onClick: () => void;
  index: number;
}

const SnapCard = ({ snap, onClick, index }: SnapCardProps) => (
  <button
    onClick={onClick}
    className="w-full text-left bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] animate-fade-up"
    style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
  >
    <div className="flex gap-3 p-3">
      <img
        src={snap.imageUrl}
        alt="Snap"
        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <Languages size={12} className="text-primary" />
          <span className="text-[11px] font-medium text-primary">{snap.language}</span>
        </div>
        <p className="text-sm font-medium text-foreground truncate">{snap.originalText}</p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{snap.translation}</p>
      </div>
    </div>
  </button>
);

export default SnapCard;
