"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { playFeedbackTone, speakEnglish } from "@/lib/clientAudio";
import type { SentencePattern } from "@/types/vocabulary";

type SentencePatternTrainerProps = {
  patterns: SentencePattern[];
  onEarnXp: (xp: number) => void;
};

export function SentencePatternTrainer({
  patterns,
  onEarnXp,
}: SentencePatternTrainerProps) {
  const [index, setIndex] = useState(0);
  const [practicedIds, setPracticedIds] = useState<string[]>([]);
  const [audioMessage, setAudioMessage] = useState("");
  const pattern = patterns[index];

  function nextPattern() {
    if (!practicedIds.includes(pattern.id)) {
      setPracticedIds((current) => [...current, pattern.id]);
      onEarnXp(4);
      playFeedbackTone("correct");
    }

    setIndex((current) => (current + 1) % patterns.length);
    setAudioMessage("");
  }

  function playExample() {
    const didSpeak = speakEnglish(pattern.example);
    setAudioMessage(
      didSpeak
        ? "Đang phát câu mẫu."
        : "Trình duyệt này chưa hỗ trợ phát âm tự động.",
    );
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-[2rem] bg-[#12333f] p-5 text-white">
        <p className="text-sm font-extrabold uppercase tracking-wide text-[#ffd166]">
          Mẫu câu B1
        </p>
        <h2 className="mt-4 text-3xl font-black leading-tight">
          {pattern.title}
        </h2>
        <p className="mt-4 rounded-3xl bg-white/10 p-4 text-base font-bold leading-7 text-[#d8f2ef]">
          {pattern.useCase}
        </p>
        <p className="mt-5 text-sm font-extrabold text-[#d8f2ef]">
          Đã luyện {practicedIds.length}/{patterns.length} mẫu câu
        </p>
      </div>

      <div>
        <div className="rounded-3xl bg-[#f7fbfa] p-5 ring-1 ring-[#dcebea]">
          <p className="text-sm font-extrabold text-[#5c747b]">
            Nghĩa tiếng Việt
          </p>
          <p className="mt-2 text-2xl font-black text-[#12333f]">
            {pattern.vietnamese}
          </p>
        </div>

        <div className="mt-4 rounded-3xl bg-[#fff7df] p-5 ring-1 ring-[#f2dfb5]">
          <p className="text-sm font-extrabold text-[#7c5700]">Khung câu</p>
          <p className="mt-2 text-3xl font-black leading-tight text-[#12333f]">
            {pattern.pattern}
          </p>
        </div>

        <div className="mt-4 rounded-3xl bg-white p-5 ring-1 ring-[#dcebea]">
          <p className="text-sm font-extrabold text-[#5c747b]">Ví dụ</p>
          <p className="mt-2 text-xl font-black leading-8 text-[#12333f]">
            {pattern.example}
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button className="gap-2 sm:w-auto" onClick={playExample}>
            <span aria-hidden="true">▶</span>
            Nghe câu mẫu
          </Button>
          <Button className="sm:w-auto" onClick={nextPattern} variant="secondary">
            Mẫu tiếp theo
          </Button>
        </div>

        {audioMessage ? (
          <p className="mt-3 rounded-2xl bg-[#f2fbfa] px-4 py-3 text-sm font-bold text-[#5c747b]">
            {audioMessage}
          </p>
        ) : null}
      </div>
    </section>
  );
}
