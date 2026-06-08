import Image from "next/image";
import Link from "next/link";
import { AppFooter } from "@/components/AppFooter";
import { buttonClassName } from "@/components/Button";
import { LearningFunctionGrid } from "@/components/LearningFunctionGrid";
import { mockProgress } from "@/data/mockProgress";
import { mockVocabulary } from "@/data/mockVocabulary";

const totalLessons = mockProgress.units.reduce(
  (total, unit) => total + unit.lessons.length,
  0,
);

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f3fbf7]">
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
          <Link
            className="rounded-2xl bg-[#12333f] px-5 py-3 text-sm font-black text-white shadow-[0_12px_28px_rgba(18,51,63,0.16)] transition hover:bg-[#1b4656]"
            href="/learn"
          >
            Học
          </Link>
        </header>

        <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#102f3b] px-5 py-6 text-white shadow-[0_24px_70px_rgba(16,47,59,0.18)] sm:px-7 lg:grid lg:grid-cols-[1fr_23rem] lg:items-center lg:gap-8 lg:px-9 lg:py-9">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 size-56 rounded-full bg-[#6ee7d8]/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-28 left-8 size-64 rounded-full bg-[#ffd166]/20 blur-3xl"
          />

          <div className="relative">
            <p className="text-sm font-black uppercase tracking-wide text-[#7ce9da]">
              App học tiếng Anh B1 cho Định
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[1.03] sm:text-5xl lg:text-6xl">
              Học tiếng Anh bằng trò nhỏ, không kéo lê bài dài.
            </h1>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-[#d8f2ef] sm:text-lg">
              Chọn thẳng chức năng bạn muốn: từ vựng, đoán hình, nối từ, nghe
              ngữ pháp hoặc mẫu câu B1. Nội dung dùng tiếng Việt để dễ học.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                className={buttonClassName("primary", "sm:w-auto")}
                href="/learn"
              >
                Vào bảng học
              </Link>
              <Link
                className={buttonClassName(
                  "secondary",
                  "border-white/20 bg-white/10 text-white hover:bg-white/15 sm:w-auto",
                )}
                href="/practice?mode=vocab"
              >
                Luyện nhanh
              </Link>
            </div>
          </div>

          <div className="relative mt-7 rounded-[1.8rem] bg-white p-4 text-[#12333f] shadow-[0_18px_48px_rgba(0,0,0,0.14)] lg:mt-0">
            <div className="grid aspect-[1.15] place-items-center rounded-[1.4rem] bg-[#d8f2ef]">
              <Image
                alt="Minh họa học tiếng Anh B1"
                className="h-auto w-44 sm:w-56"
                height={280}
                priority
                src="/vocab/presentation.svg"
                width={280}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-[#f3fbf7] p-3">
                <p className="text-xs font-black text-[#5c747b]">Từ</p>
                <p className="mt-1 text-2xl font-black">
                  {mockVocabulary.length}
                </p>
              </div>
              <div className="rounded-2xl bg-[#fff1ba] p-3">
                <p className="text-xs font-black text-[#7c5700]">Bài</p>
                <p className="mt-1 text-2xl font-black">{totalLessons}</p>
              </div>
              <div className="rounded-2xl bg-[#ffe0db] p-3">
                <p className="text-xs font-black text-[#b74438]">Level</p>
                <p className="mt-1 text-2xl font-black">B1</p>
              </div>
            </div>
          </div>
        </section>

        <LearningFunctionGrid
          totalLessons={totalLessons}
          totalWords={mockVocabulary.length}
        />

        <section className="grid gap-4 rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-[#dcebea] sm:grid-cols-3 sm:p-5">
          <div className="rounded-[1.5rem] bg-[#d8f2ef] p-4">
            <p className="text-sm font-black text-[#0c756d]">Học bằng hình</p>
            <p className="mt-2 text-sm font-bold leading-6 text-[#31565f]">
              Mỗi nhóm từ có ảnh minh họa để đoán và nhớ nhanh hơn.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-[#fff1ba] p-4">
            <p className="text-sm font-black text-[#876100]">Có âm thanh</p>
            <p className="mt-2 text-sm font-bold leading-6 text-[#665126]">
              Bấm nghe câu tiếng Anh bằng speech synthesis của trình duyệt.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-[#e6ebff] p-4">
            <p className="text-sm font-black text-[#4152a5]">Có nghĩa Việt</p>
            <p className="mt-2 text-sm font-bold leading-6 text-[#3e4a75]">
              App dùng tiếng Việt để bạn hiểu bài trước khi luyện phản xạ.
            </p>
          </div>
        </section>

        <AppFooter />
      </div>
    </main>
  );
}
