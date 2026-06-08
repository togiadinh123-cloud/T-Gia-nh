type ProgressBarProps = {
  value: number;
  label?: string;
};

export function ProgressBar({ value, label }: ProgressBarProps) {
  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="space-y-2">
      {label ? (
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-[#6c8288]">
          <span>{label}</span>
          <span>{safeValue}%</span>
        </div>
      ) : null}
      <div
        aria-label={label}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={safeValue}
        className="h-3.5 overflow-hidden rounded-full bg-[#e5f2f1] shadow-inner"
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#0e9f91] to-[#68d8c8] transition-all duration-500 ease-out"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
