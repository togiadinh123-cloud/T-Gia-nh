import { homeCopy } from "@/lib/copy";
import type { LessonStep } from "@/types/learning";
import { Card } from "./Card";

type LessonPathPreviewProps = {
  steps: LessonStep[];
};

const statusStyles: Record<LessonStep["status"], string> = {
  done: "bg-[#0e9f91] text-white",
  active: "bg-[#ffd166] text-[#7c5700]",
  locked: "bg-[#edf3f2] text-[#8aa0a5]",
};

export function LessonPathPreview({ steps }: LessonPathPreviewProps) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-[#e5eeee] p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-[#0e9f91]">
          {homeCopy.pathTitle}
        </p>
        <h2 className="mt-3 text-3xl font-black leading-tight text-[#12333f]">
          {homeCopy.pathDescription}
        </h2>
      </div>
      <ol className="divide-y divide-[#e5eeee]">
        {steps.map((step, index) => (
          <li className="flex gap-4 p-5 sm:p-6" key={step.id}>
            <span
              className={`grid size-11 shrink-0 place-items-center rounded-2xl text-sm font-black ${statusStyles[step.status]}`}
            >
              {index + 1}
            </span>
            <span>
              <span className="block text-lg font-black text-[#12333f]">
                {step.title}
              </span>
              <span className="mt-1 block text-sm leading-6 text-[#5c747b]">
                {step.description}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}

