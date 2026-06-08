"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/Button";
import type { SentencePattern, VocabularyItem } from "@/types/vocabulary";
import { ImageGuessGame } from "./ImageGuessGame";
import { ListeningGrammarTrainer } from "./ListeningGrammarTrainer";
import { MeaningMatchGame } from "./MeaningMatchGame";
import { SentencePatternTrainer } from "./SentencePatternTrainer";
import { VocabTrainer } from "./VocabTrainer";

import { useSearchParams } from "next/navigation";

export type PracticeMode = "vocab" | "image" | "match" | "listening" | "patterns";

type PracticeHubProps = {
  items: VocabularyItem[];
  patterns: SentencePattern[];
};

const modes: {
  id: PracticeMode;
  label: string;
  shortLabel: string;
  description: string;
  imageSrc: string;
  accent: string;
}[] = [
  {
    id: "vocab",
    label: "Từ vựng B1",
    shortLabel: "Từ vựng",
    description: "Ảnh, nghĩa Việt, ví dụ và phát âm.",
    imageSrc: "/vocab/opportunity.svg",
    accent: "bg-[#d8f2ef] text-[#0c756d]",
  },
  {
    id: "image",
    label: "Đoán hình",
    shortLabel: "Đoán hình",
    description: "Nhìn minh họa và chọn từ đúng.",
    imageSrc: "/vocab/environment.svg",
    accent: "bg-[#fff1ba] text-[#876100]",
  },
  {
    id: "match",
    label: "Nối từ",
    shortLabel: "Nối từ",
    description: "Ghép Anh - Việt để nhớ nghĩa.",
    imageSrc: "/vocab/agreement.svg",
    accent: "bg-[#ffe0db] text-[#b74438]",
  },
  {
    id: "listening",
    label: "Nghe & ngữ pháp",
    shortLabel: "Nghe",
    description: "Nghe câu B1 và chọn nghĩa đúng.",
    imageSrc: "/vocab/presentation.svg",
    accent: "bg-[#e6ebff] text-[#4152a5]",
  },
  {
    id: "patterns",
    label: "Mẫu câu B1",
    shortLabel: "Mẫu câu",
    description: "Luyện khung câu dùng trong speaking.",
    imageSrc: "/vocab/research.svg",
    accent: "bg-[#eaf7e9] text-[#2f7a3c]",
  },
];

function getNextMode(mode: PracticeMode): PracticeMode {
  const currentIndex = modes.findIndex((item) => item.id === mode);
  return modes[(currentIndex + 1) % modes.length].id;
}

export function PracticeHub({
  items,
  patterns,
}: PracticeHubProps) {
  const searchParams = useSearchParams();
  const searchMode = searchParams?.get("mode") as PracticeMode | null;
  const initialMode = modes.some(m => m.id === searchMode) ? searchMode : "vocab";

  const [mode, setMode] = useState<PracticeMode>(initialMode as PracticeMode);
  const [sessionXp, setSessionXp] = useState(0);
  const activeMode = modes.find((item) => item.id === mode) ?? modes[0];

  function earnXp(xp: number) {
    setSessionXp((current) => current + xp);
  }

  return (
    <main className="min-h-screen bg-[#f3fbf7]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-[2rem] bg-[#102f3b] p-4 text-white shadow-[0_20px_60px_rgba(16,47,59,0.16)] sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex items-center gap-4">
              <div
                className={`grid size-20 shrink-0 place-items-center rounded-[1.5rem] ${activeMode.accent}`}
              >
                <Image
                  alt={`Minh họa ${activeMode.label}`}
                  className="h-auto w-12"
                  height={72}
                  src={activeMode.imageSrc}
                  width={72}
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black uppercase tracking-wide text-[#7ce9da]">
                  Định English
                </p>
                <h1 className="mt-1 text-3xl font-black leading-tight sm:text-5xl">
                  {activeMode.label}
                </h1>
                <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#d8f2ef] sm:text-base">
                  {activeMode.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-80">
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-sm font-black text-[#d8f2ef]">XP phiên này</p>
                <p className="mt-1 text-4xl font-black text-[#ffd166]">
                  {sessionXp}
                </p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-sm font-black text-[#d8f2ef]">Kho B1</p>
                <p className="mt-1 text-4xl font-black text-[#ffd166]">
                  {items.length}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section
          aria-label="Chọn chức năng luyện tập"
          className="flex gap-3 overflow-x-auto rounded-[1.6rem] bg-white p-2 shadow-sm ring-1 ring-[#dcebea] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {modes.map((practiceMode) => {
            const isActive = mode === practiceMode.id;

            return (
              <button
                className={`flex min-w-[9.5rem] items-center gap-3 rounded-[1.2rem] p-2.5 text-left transition active:scale-[0.98] ${
                  isActive
                    ? `${practiceMode.accent} shadow-sm`
                    : "text-[#5c747b] hover:bg-[#f3fbf7]"
                }`}
                key={practiceMode.id}
                onClick={() => setMode(practiceMode.id)}
                type="button"
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
                    isActive ? "bg-white/70" : "bg-[#f3fbf7]"
                  }`}
                >
                  <Image
                    alt=""
                    className="h-auto w-7"
                    height={40}
                    src={practiceMode.imageSrc}
                    width={40}
                  />
                </span>
                <span className="text-sm font-black leading-tight">
                  {practiceMode.shortLabel}
                </span>
              </button>
            );
          })}
        </section>

        <section className="rounded-[2rem] border border-[#dcebea] bg-white p-4 shadow-[0_18px_52px_rgba(18,51,63,0.08)] sm:p-7">
          {mode === "vocab" ? (
            <VocabTrainer items={items} onEarnXp={earnXp} />
          ) : mode === "image" ? (
            <ImageGuessGame items={items} onEarnXp={earnXp} />
          ) : mode === "match" ? (
            <MeaningMatchGame items={items} onEarnXp={earnXp} />
          ) : mode === "listening" ? (
            <ListeningGrammarTrainer patterns={patterns} onEarnXp={earnXp} />
          ) : (
            <SentencePatternTrainer patterns={patterns} onEarnXp={earnXp} />
          )}
        </section>

        <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:justify-between">
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#d8e5e4] bg-white px-5 text-sm font-black text-[#12333f] shadow-sm transition hover:border-[#9fc9c6] hover:bg-[#f5fbfa]"
            href="/learn"
          >
            Về bảng học
          </Link>
          <Button className="sm:w-auto" onClick={() => setMode(getNextMode(mode))}>
            Đổi chức năng
          </Button>
        </div>
      </div>
    </main>
  );
}
