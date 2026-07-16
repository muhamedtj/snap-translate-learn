import { useState } from "react";
import { Camera, GraduationCap, BookOpen, Zap, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const ONBOARDING_KEY = "snaplingo-onboarding-done";

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const slides = [
    {
      icon: Camera,
      color: "bg-primary",
      iconColor: "text-primary-foreground",
      title: t("onboarding.slide1Title"),
      desc: t("onboarding.slide1Desc"),
      emoji: "📸",
    },
    {
      icon: Zap,
      color: "bg-warning",
      iconColor: "text-warning-foreground",
      title: t("onboarding.slide2Title"),
      desc: t("onboarding.slide2Desc"),
      emoji: "⚡",
    },
    {
      icon: GraduationCap,
      color: "bg-success",
      iconColor: "text-success-foreground",
      title: t("onboarding.slide3Title"),
      desc: t("onboarding.slide3Desc"),
      emoji: "🎓",
    },
    {
      icon: BookOpen,
      color: "bg-primary",
      iconColor: "text-primary-foreground",
      title: t("onboarding.slide4Title"),
      desc: t("onboarding.slide4Desc"),
      emoji: "📚",
    },
  ];

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    onComplete();
  };

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const slide = slides[step];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-between px-6 py-12">
      {/* Progress dots */}
      <div className="flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step ? "w-8 bg-primary" : i < step ? "w-2 bg-primary/50" : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 animate-fade-up max-w-sm" key={step}>
        <div
          className={`w-32 h-32 rounded-[2rem] ${slide.color} flex items-center justify-center`}
          style={{ borderBottomWidth: 8, borderBottomColor: "rgba(0,0,0,0.15)" }}
        >
          <Icon size={56} className={slide.iconColor} strokeWidth={2.5} />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black text-foreground mb-3">{slide.title}</h2>
          <p className="text-base font-semibold text-muted-foreground leading-relaxed">{slide.desc}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <button onClick={handleNext} className="btn-volumetric-primary w-full flex items-center justify-center gap-2">
          {step < slides.length - 1 ? (
            <>
              {t("onboarding.next")}
              <ChevronRight size={20} />
            </>
          ) : (
            t("onboarding.start")
          )}
        </button>
        {step < slides.length - 1 && (
          <button
            onClick={handleComplete}
            className="w-full py-3 text-base font-bold text-muted-foreground"
          >
            {t("onboarding.skip")}
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
export { ONBOARDING_KEY };
