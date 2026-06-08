import { homeCopy } from "@/lib/copy";
import type { Lesson } from "@/types/learning";
import { Card } from "./Card";
import { ProgressBar } from "./ProgressBar";

const skillStyles: Record<Lesson["skill"], string> = {
  listening: "bg-[#ffe7a8] text-[#7c5700]",
  vocabulary: "bg-[#d8f2ef] text-[#0b6f66]",
  speaking: "bg-[#ffe1dc] text-[#9a3b32]",
  grammar: "bg-[#e6ecff] text-[#31448a]",
};

type LessonCardProps = {
  lesson: Lesson;
};

export function LessonCard({ lesson }: LessonCardProps) {
  const isLocked = lesson.status === "locked";

  return (
    <Card className={`p-4 ${isLocked ? "opacity-75" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${skillStyles[lesson.skill]}`}
          >
            {lesson.minutes} {homeCopy.minutes}
          </span>
          <h3 className="mt-3 text-lg font-black text-[#12333f]">
            {lesson.title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-[#5c747b]">
            {lesson.description}
          </p>
        </div>
        <div
          className={`grid size-11 shrink-0 place-items-center rounded-2xl text-lg font-black ${
            isLocked ? "bg-[#edf3f2] text-[#8aa0a5]" : "bg-[#12333f] text-white"
          }`}
          aria-hidden="true"
        >
          {isLocked ? "..." : lesson.title.charAt(0)}
        </div>
      </div>
      <div className="mt-4">
        <ProgressBar value={lesson.progress} label={homeCopy.progressLabel} />
      </div>
    </Card>
  );
}
