import Link from "next/link";
import type { UserProgress } from "@/types/progress";
import { buttonClassName } from "./Button";
import { ProgressBar } from "./ProgressBar";

type LearnerHeroProps = {
  progress: UserProgress;
};

export function LearnerHero({ progress }: LearnerHeroProps) {
  const xpPercent = Math.min(
    Math.round((progress.dailyXp.current / progress.dailyXp.target) * 100),
    100,
  );
  const remainingXp = Math.max(
    progress.dailyXp.target - progress.dailyXp.current,
    0,
  );

  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#102f3b] px-5 py-6 text-white shadow-[0_24px_70px_rgba(16,47,59,0.18)] sm:px-7 lg:px-9">
      <div
        aria-hidden="true"
        className="absolute -right-20 -top-24 size-56 rounded-full bg-[#6ee7d8]/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-28 left-8 size-64 rounded-full bg-[#ffd166]/20 blur-3xl"
      />

      <div className="relative grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-[#7ce9da]">
            Bảng học hôm nay
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[1.03] sm:text-5xl">
            Chào {progress.user.name}, chọn một trò học ngắn nha.
          </h1>
          <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-[#d8f2ef]">
            Tập trung vào B1: từ vựng, đoán hình, nối nghĩa, nghe câu và mẫu
            câu. Mỗi lượt học ngắn để bạn không bị ngán.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              className={buttonClassName("primary", "sm:w-auto")}
              href="#learning-functions"
            >
              Chọn chức năng
            </Link>
            <Link
              className={buttonClassName(
                "secondary",
                "border-white/20 bg-white/10 text-white hover:bg-white/15 sm:w-auto",
              )}
              href="/practice?mode=vocab"
            >
              Vào luyện nhanh
            </Link>
          </div>
        </div>

        <div className="rounded-[1.7rem] bg-white p-4 text-[#12333f] shadow-[0_18px_48px_rgba(0,0,0,0.14)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black text-[#5c747b]">XP hôm nay</p>
              <p className="mt-1 text-5xl font-black leading-none">
                {progress.dailyXp.current}
              </p>
            </div>
            <div className="grid size-16 place-items-center rounded-3xl bg-[#ffd166] text-xl font-black text-[#7c5700]">
              {xpPercent}%
            </div>
          </div>
          <div className="mt-5">
            <ProgressBar value={xpPercent} label="Tiến độ XP" />
          </div>
          <p className="mt-4 rounded-2xl bg-[#f3fbf7] p-3 text-sm font-bold leading-6 text-[#5c747b]">
            Còn {remainingXp} XP để hoàn thành mục tiêu ngày. Chuỗi hiện tại:{" "}
            {progress.streakDays} ngày.
          </p>
        </div>
      </div>
    </section>
  );
}
