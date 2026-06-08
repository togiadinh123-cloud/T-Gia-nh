import type { Lesson, LessonStatus, Unit } from "@/types/progress";
import Link from "next/link";
import { Card } from "./Card";

type LearnUnitPathProps = {
  units: Unit[];
};

const unitAccent: Record<Unit["accent"], string> = {
  coral: "bg-[#ff6f61] text-white",
  teal: "bg-[#0e9f91] text-white",
  yellow: "bg-[#ffd166] text-[#7c5700]",
  ink: "bg-[#12333f] text-white",
};

const statusMeta: Record<
  LessonStatus,
  { label: string; marker: string; className: string; cardClassName: string }
> = {
  completed: {
    label: "Đã xong",
    marker: "✓",
    className: "bg-[#0e9f91] text-white shadow-[0_10px_24px_rgba(14,159,145,0.25)]",
    cardClassName: "border-[#cde8e5]",
  },
  active: {
    label: "Đang học",
    marker: "▶",
    className: "bg-[#ff6f61] text-white shadow-[0_10px_24px_rgba(255,111,97,0.28)]",
    cardClassName: "border-[#ffb9b1] ring-4 ring-[#ffe1dc]",
  },
  unlocked: {
    label: "Đã mở",
    marker: "•",
    className: "bg-[#ffd166] text-[#7c5700]",
    cardClassName: "border-[#f2df9f]",
  },
  locked: {
    label: "Đang khóa",
    marker: "…",
    className: "bg-[#edf3f2] text-[#8aa0a5]",
    cardClassName: "border-[#dcebea] opacity-70",
  },
};

function LessonNode({
  isLast,
  lesson,
  index,
}: {
  isLast: boolean;
  lesson: Lesson;
  index: number;
}) {
  const meta = statusMeta[lesson.status];
  const canStart = lesson.status === "active" || lesson.status === "unlocked";

  return (
    <li className="relative pl-14">
      {!isLast ? (
        <div
          aria-hidden="true"
          className="absolute bottom-[-1rem] left-[1.35rem] top-12 w-0.5 bg-[#dcebea]"
        />
      ) : null}
      <div
        aria-hidden="true"
        className={`absolute left-0 top-0 z-10 grid size-11 place-items-center rounded-2xl text-sm font-black ${meta.className}`}
      >
        {lesson.status === "unlocked" ? index + 1 : meta.marker}
      </div>
      <Card className={`p-4 transition ${meta.cardClassName}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black leading-tight text-[#12333f]">
                {lesson.title}
              </h3>
              <span className="rounded-full bg-[#f2fbfa] px-3 py-1 text-xs font-extrabold text-[#5c747b]">
                {meta.label}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#5c747b]">
              {lesson.description}
            </p>
            <p className="mt-3 text-xs font-black uppercase tracking-wide text-[#0e9f91]">
              +{lesson.xp} XP
            </p>
          </div>
          {canStart ? (
            <Link
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#ff6f61] px-5 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(255,111,97,0.28)] transition hover:bg-[#f45f54] active:translate-y-0.5 sm:w-auto"
              href={`/lesson/${lesson.id}`}
            >
              {lesson.status === "active" ? "Bắt đầu" : "Học bài này"}
            </Link>
          ) : (
            <span className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#edf3f2] px-5 text-sm font-extrabold text-[#8aa0a5] sm:w-auto">
              Chưa mở
            </span>
          )}
        </div>
      </Card>
    </li>
  );
}

function EmptyPathState() {
  return (
    <Card className="p-6 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#fff0bd] text-xl font-black text-[#7c5700]">
        Đ
      </div>
      <h3 className="mt-4 text-2xl font-black text-[#12333f]">
        Chưa có bài học
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5c747b]">
        Lộ trình sẽ xuất hiện ở đây sau khi có unit và lesson đầu tiên.
      </p>
    </Card>
  );
}

export function LearnUnitPath({ units }: LearnUnitPathProps) {
  return (
    <section className="space-y-5" id="lesson-path">
      <div>
        <p className="text-sm font-extrabold uppercase tracking-wide text-[#ff6f61]">
          Lộ trình bài học
        </p>
        <h2 className="mt-3 text-3xl font-black leading-tight text-[#12333f] sm:text-4xl">
          Học từng unit, mở khóa từng kỹ năng.
        </h2>
      </div>

      {units.length === 0 ? (
        <EmptyPathState />
      ) : (
        <div className="space-y-5">
          {units.map((unit) => (
            <Card className="p-5 sm:p-6" key={unit.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-2xl font-black text-[#12333f]">
                    {unit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#5c747b]">
                    {unit.description}
                  </p>
                </div>
                <span
                  className={`inline-flex w-fit rounded-2xl px-4 py-2 text-sm font-black ${unitAccent[unit.accent]}`}
                >
                  {unit.lessons.length} bài
                </span>
              </div>
              {unit.lessons.length === 0 ? (
                <div className="mt-5 rounded-2xl bg-[#f7fbfa] p-4 text-sm font-bold text-[#6c8288]">
                  Unit này chưa có bài học.
                </div>
              ) : (
                <ol className="mt-5 space-y-4">
                  {unit.lessons.map((lesson, index) => (
                    <LessonNode
                      index={index}
                      isLast={index === unit.lessons.length - 1}
                      key={lesson.id}
                      lesson={lesson}
                    />
                  ))}
                </ol>
              )}
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
