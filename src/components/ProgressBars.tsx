interface ProgressBarsProps {
  count: number; // 0-5
}

const ProgressBars = ({ count }: ProgressBarsProps) => (
  <div className="flex gap-1.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
          i < count ? "bg-primary" : "bg-secondary"
        }`}
      />
    ))}
  </div>
);

export default ProgressBars;
