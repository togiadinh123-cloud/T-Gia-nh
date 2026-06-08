"use client";

import { CustomImage as Image } from "@/components/CustomImage";
import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { playFeedbackTone, speakEnglish } from "@/lib/clientAudio";
import type { VocabularyItem } from "@/types/vocabulary";

type ImageGuessGameProps = {
  items: VocabularyItem[];
  onEarnXp: (xp: number) => void;
};

function getOptions(items: VocabularyItem[], index: number) {
  return [0, 1, 2].map((offset) => items[(index + offset) % items.length]);
}

export function ImageGuessGame({ items, onEarnXp }: ImageGuessGameProps) {
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const current = items[index];
  const options = useMemo(() => getOptions(items, index), [index, items]);
  const hasAnswered = selectedId.length > 0;
  const isCorrect = selectedId === current.id;

  function selectOption(item: VocabularyItem) {
    if (hasAnswered) {
      return;
    }

    setSelectedId(item.id);

    if (item.id === current.id) {
      setCorrectCount((count) => count + 1);
      onEarnXp(5);
      playFeedbackTone("correct");
      speakEnglish(current.english);
    } else {
      playFeedbackTone("incorrect");
    }
  }

  function nextRound() {
    setSelectedId("");
    setIndex((currentIndex) => (currentIndex + 1) % items.length);
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] bg-[#fff7df] p-5 text-center ring-1 ring-[#f2dfb5]">
        <Image
          alt="Hình gợi ý từ vựng"
          className="mx-auto h-auto w-full max-w-[270px]"
          height={240}
          priority
          src={current.imageSrc}
          width={240}
        />
        <p className="mt-3 text-sm font-extrabold text-[#7c5700]">
          Nhìn hình và chọn từ tiếng Anh.
        </p>
      </div>

      <div>
        <p className="text-sm font-extrabold uppercase tracking-wide text-[#0e9f91]">
          Đoán từ qua hình
        </p>
        <h2 className="mt-2 text-3xl font-black leading-tight text-[#12333f]">
          Hình này là từ nào?
        </h2>

        <div className="mt-5 grid gap-3">
          {options.map((option) => {
            const isSelected = selectedId === option.id;
            const shouldShowCorrect = hasAnswered && option.id === current.id;
            const shouldShowWrong = isSelected && !isCorrect;

            return (
              <button
                className={`min-h-14 rounded-2xl border px-4 py-3 text-left text-base font-black transition active:scale-[0.98] ${
                  shouldShowCorrect
                    ? "animate-answer-pop border-[#0e9f91] bg-[#d8f2ef] text-[#0b6f66]"
                    : shouldShowWrong
                      ? "animate-answer-shake border-[#ffb2aa] bg-[#ffe1dc] text-[#9a3b32]"
                      : "border-[#dcebea] bg-white text-[#12333f] hover:border-[#9fc9c6]"
                }`}
                disabled={hasAnswered}
                key={option.id}
                onClick={() => selectOption(option)}
                type="button"
              >
                {option.english}
              </button>
            );
          })}
        </div>

        {hasAnswered ? (
          <div
            className={`mt-4 rounded-3xl p-4 text-sm font-extrabold ${
              isCorrect
                ? "bg-[#d8f2ef] text-[#0b6f66]"
                : "bg-[#ffe1dc] text-[#9a3b32]"
            }`}
          >
            <p className="text-xs font-black uppercase tracking-wide opacity-80">
              Nghĩa tiếng Việt
            </p>
            {isCorrect
              ? `Đúng rồi: ${current.english} nghĩa là ${current.vietnamese}.`
              : `Chưa đúng. Đáp án là ${current.english} - ${current.vietnamese}.`}
          </div>
        ) : null}

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-sm font-extrabold text-[#5c747b]">
            Đúng {correctCount} lượt
          </p>
          <Button disabled={!hasAnswered} onClick={nextRound} variant="secondary">
            Hình tiếp theo
          </Button>
        </div>
      </div>
    </section>
  );
}
