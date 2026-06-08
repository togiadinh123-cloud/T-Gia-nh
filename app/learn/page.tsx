import Link from "next/link";
import { LearnUnitPath } from "@/components/LearnUnitPath";
import { LearningFunctionGrid } from "@/components/LearningFunctionGrid";
import { LearnerHero } from "@/components/LearnerHero";
import { LogoutButton } from "@/components/LogoutButton";
import { ProgressMetricCard } from "@/components/ProgressMetricCard";
import { mockVocabulary } from "@/data/mockVocabulary";
import { loadUserProgress } from "@/lib/progress/userProgress";


export default async function LearnPage() {
  const { isMockMode, progress } = await loadUserProgress();
  const totalLessons = progress.units.reduce(
    (total, unit) => total + unit.lessons.length,
    0,
  );

  return (
    <main className="min-h-screen bg-[#f3fbf7]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-3">
          <Link className="flex min-w-0 items-center gap-3" href="/">
            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#12333f] text-lg font-black text-[#ffd166] shadow-[0_12px_28px_rgba(18,51,63,0.16)]"
            >
              Đ
            </span>
            <span className="truncate text-xl font-black text-[#12333f]">
              Định English
            </span>
          </Link>
          <nav
            aria-label="Điều hướng học tập"
            className="flex items-center gap-2 rounded-2xl bg-white/90 p-1 text-sm font-black shadow-sm ring-1 ring-[#dcebea] backdrop-blur"
          >
            <Link
              className="hidden rounded-xl px-4 py-2 text-[#47626c] transition hover:bg-[#edf7f6] sm:inline-flex"
              href="/"
            >
              Trang chủ
            </Link>
            <Link
              className="rounded-xl bg-[#12333f] px-4 py-2 text-white"
              href="/learn"
            >
              Học
            </Link>
            {!isMockMode ? <LogoutButton /> : null}
          </nav>
        </header>

        <LearnerHero progress={progress} />

        <LearningFunctionGrid
          totalLessons={totalLessons}
          totalWords={mockVocabulary.length}
        />

        <section className="grid gap-4 sm:grid-cols-3">
          <ProgressMetricCard
            helper="mục tiêu mỗi ngày"
            icon="XP"
            label="XP hôm nay"
            value={`${progress.dailyXp.current}/${progress.dailyXp.target}`}
          />
          <ProgressMetricCard
            helper="ngày học liên tiếp"
            icon={progress.streakDays}
            label="Chuỗi ngày"
            value={`${progress.streakDays}`}
          />
          <ProgressMetricCard
            helper="sai thì ôn lại, không bị chặn"
            icon="∞"
            label="Luyện tự do"
            value="Không giới hạn"
          />
        </section>

        <details className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-[#dcebea]">
          <summary className="cursor-pointer list-none rounded-2xl bg-[#f3fbf7] px-4 py-3 text-base font-black text-[#12333f] transition hover:bg-[#eaf5f3]">
            Mở {totalLessons} bài tổng hợp B1
          </summary>
          <div className="mt-5">
            <LearnUnitPath units={progress.units} />
          </div>
        </details>
      </div>
    </main>
  );
}
