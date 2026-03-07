import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SnapCard from "@/components/SnapCard";
import { mockSnaps } from "@/lib/mock-data";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen px-5 pt-14 pb-24">
      <h1 className="text-2xl font-bold text-foreground mb-1">{t("history.title")}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t("history.subtitle")}</p>

      <div className="space-y-3">
        {mockSnaps.map((snap, i) => (
          <SnapCard
            key={snap.id}
            snap={snap}
            index={i}
            onClick={() => navigate(`/result/${snap.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
