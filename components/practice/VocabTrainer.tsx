"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/Button";
import { playFeedbackTone, speakEnglish } from "@/lib/clientAudio";
import type { VocabularyItem } from "@/types/vocabulary";

type VocabTrainerProps = {
  items: VocabularyItem[];
  onEarnXp: (xp: number) => void;
};

export function VocabTrainer({ items, onEarnXp }: VocabTrainerProps) {
  const [index, setIndex] = useState(0);
  const [reviewedIds, setReviewedIds] = useState<string[]>([]);
  const [audioMessage, setAudioMessage] = useState("");
  const item = items[index];
  const learnedCount = reviewedIds.length;

  function goNext() {
    if (!reviewedIds.includes(item.id)) {
      setReviewedIds((current) => [...current, item.id]);
      onEarnXp(2);
      playFeedbackTone("correct");
    }

    setIndex((current) => (current + 1) % items.length);
  }

  function playPronunciation() {
    const didSpeak = speakEnglish(item.english);
    setAudioMessage(
      didSpeak
        ? `Đang phát âm: ${item.english}`
        : "Trình duyệt này chưa hỗ trợ phát âm tự động.",
    );
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="overflow-hidden rounded-[2rem] border border-[#dcebea] bg-[#f7fbfa] p-5">
        <Image
          alt={item.vietnamese}
          className="mx-auto h-auto w-full max-w-[280px] drop-shadow-sm"
          height={240}
          priority
          src={item.imageSrc}
          width={240}
        />
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-sm font-extrabold uppercase tracking-wide text-[#0e9f91]">
          Học từ vựng
        </p>
        <h2 className="mt-2 text-5xl font-black leading-none text-[#12333f]">
          {item.english}
        </h2>
        <p className="mt-2 text-lg font-black text-[#ff6f61]">
          {item.pronunciation}
        </p>
        <div className="mt-4 rounded-3xl bg-[#f2fbfa] p-4 ring-1 ring-[#dcebea]">
          <p className="text-xs font-black uppercase tracking-wide text-[#0e9f91]">
            Nghĩa tiếng Việt
          </p>
          <p className="mt-2 text-2xl font-black text-[#12333f]">
            {item.vietnamese}
          </p>
        </div>
        <p className="mt-3 rounded-2xl bg-white p-4 text-base font-bold leading-7 text-[#5c747b] ring-1 ring-[#dcebea]">
          {item.example}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button className="gap-2 sm:w-auto" onClick={playPronunciation}>
            <span aria-hidden="true">▶</span>
            Nghe phát âm
          </Button>
          <Button className="sm:w-auto" onClick={goNext} variant="secondary">
            Từ tiếp theo
          </Button>
        </div>

        <p className="mt-4 text-sm font-extrabold text-[#5c747b]">
          Đã xem {learnedCount}/{items.length} từ trong vòng này.
        </p>
        {audioMessage ? (
          <p className="mt-3 rounded-2xl bg-[#f2fbfa] px-4 py-3 text-sm font-bold text-[#5c747b]">
            {audioMessage}
          </p>
        ) : null}
      </div>
    </section>
  );
}
