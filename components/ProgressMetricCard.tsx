import type { ReactNode } from "react";
import { Card } from "./Card";

type ProgressMetricCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
};

export function ProgressMetricCard({
  label,
  value,
  helper,
  icon,
}: ProgressMetricCardProps) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-[#5c747b]">{label}</p>
          <p className="mt-2 text-3xl font-black leading-none text-[#12333f]">
            {value}
          </p>
          <p className="mt-2 text-xs font-bold leading-5 text-[#6c8288]">
            {helper}
          </p>
        </div>
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#fff0bd] text-lg font-black text-[#8a6200]">
          {icon}
        </div>
      </div>
    </Card>
  );
}
