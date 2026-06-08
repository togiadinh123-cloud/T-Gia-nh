"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { playFeedbackTone, speakEnglish } from "@/lib/clientAudio";
import type { VocabularyItem } from "@/types/vocabulary";

type MeaningMatchGameProps = {
  items: VocabularyItem[];
  onEarnXp: (xp: number) => void;
};

export function MeaningMatchGame({ items, onEarnXp }: MeaningMatchGameProps) {
  const roundItems = items.slice(0, 5);
  const vietnameseItems = [...roundItems].reverse();
  const [selectedEnglishId, setSelectedEnglishId] = useState("");
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [message, setMessage] = useState(
    "Chọn một từ tiếng Anh rồi nối với nghĩa tiếng Việt.",
  );
  const isComplete = matchedIds.length === roundItems.length;

  function chooseEnglish(item: VocabularyItem) {
    if (matchedIds.includes(item.id)) {
      return;
    }

    setSelectedEnglishId(item.id);
    setMessage(`Đang chọn: ${item.english}`);
    speakEnglish(item.english);
  }

  function chooseVietnamese(item: VocabularyItem) {
    if (!selectedEnglishId || matchedIds.includes(item.id)) {
      return;
    }

    if (selectedEnglishId === item.id) {
      setMatchedIds((current) => [...current, item.id]);
      setSelectedEnglishId("");
      setMessage(`Đúng: ${item.english} là ${item.vietnamese}.`);
      onEarnXp(4);
      playFeedbackTone(
        matchedIds.length + 1 === roundItems.length ? "complete" : "correct",
      );
      return;
    }

    setMessage("Chưa khớp. Chọn lại cặp khác nhé.");
    setSelectedEnglishId("");
    playFeedbackTone("incorrect");
  }

  function resetRound() {
    setSelectedEnglishId("");
    setMatchedIds([]);
    setMessage("Chọn một từ tiếng Anh rồi nối với nghĩa tiếng Việt.");
  }

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-wide text-[#0e9f91]">
            Nối nghĩa
          </p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-[#12333f]">
            Ghép tiếng Anh với tiếng Việt
          </h2>
        </div>
        <Button className="sm:w-auto" onClick={resetRound} variant="secondary">
          Chơi lại
        </Button>
      </div>

      <div className="mt-5 grid gap-3 rounded-3xl bg-[#f7fbfa] p-4 text-sm font-extrabold text-[#5c747b] ring-1 ring-[#dcebea]">
        <p>{isComplete ? "Hoàn thành vòng nối nghĩa!" : message}</p>
        <div className="h-3 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-[#0e9f91] transition-all"
            style={{ width: `${(matchedIds.length / roundItems.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="grid gap-3">
          {roundItems.map((item) => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedEnglishId === item.id;

            return (
              <button
                className={`rounded-2xl border px-4 py-4 text-left text-base font-black transition active:scale-[0.98] ${
                  isMatched
                    ? "border-[#0e9f91] bg-[#d8f2ef] text-[#0b6f66]"
                    : isSelected
                      ? "border-[#ff6f61] bg-white text-[#12333f] shadow-[0_12px_28px_rgba(255,111,97,0.12)]"
                      : "border-[#dcebea] bg-white text-[#12333f] hover:border-[#9fc9c6]"
                }`}
                disabled={isMatched}
                key={item.id}
                onClick={() => chooseEnglish(item)}
                type="button"
              >
                {item.english}
              </button>
            );
          })}
        </div>

        <div className="grid gap-3">
          {vietnameseItems.map((item) => {
            const isMatched = matchedIds.includes(item.id);

            return (
              <button
                className={`rounded-2xl border px-4 py-4 text-left text-base font-black transition active:scale-[0.98] ${
                  isMatched
                    ? "border-[#0e9f91] bg-[#d8f2ef] text-[#0b6f66]"
                    : "border-[#dcebea] bg-white text-[#12333f] hover:border-[#9fc9c6]"
                }`}
                disabled={isMatched}
                key={item.id}
                onClick={() => chooseVietnamese(item)}
                type="button"
              >
                {item.vietnamese}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
