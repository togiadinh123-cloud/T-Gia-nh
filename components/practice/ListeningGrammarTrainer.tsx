"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { playFeedbackTone, speakEnglish } from "@/lib/clientAudio";
import type { SentencePattern } from "@/types/vocabulary";

type ListeningGrammarTrainerProps = {
  onEarnXp: (xp: number) => void;
  patterns: SentencePattern[];
};

function getOptions(patterns: SentencePattern[], index: number) {
  return [0, 1, 2].map((offset) => patterns[(index + offset) % patterns.length]);
}

export function ListeningGrammarTrainer({
  onEarnXp,
  patterns,
}: ListeningGrammarTrainerProps) {
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState("");
  const [audioMessage, setAudioMessage] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const pattern = patterns[index];
  const options = useMemo(() => getOptions(patterns, index), [index, patterns]);
  const hasAnswered = selectedId.length > 0;
  const isCorrect = selectedId === pattern.id;

  function replayAudio() {
    const didSpeak = speakEnglish(pattern.example);
    setAudioMessage(
      didSpeak
        ? "Đang phát câu tiếng Anh."
        : "Trình duyệt này chưa hỗ trợ phát âm tự động.",
    );
  }

  function chooseOption(option: SentencePattern) {
    if (hasAnswered) {
      return;
    }

    setSelectedId(option.id);

    if (option.id === pattern.id) {
      setCorrectCount((count) => count + 1);
      onEarnXp(5);
      playFeedbackTone("correct");
      return;
    }

    playFeedbackTone("incorrect");
  }

  function nextQuestion() {
    setSelectedId("");
    setAudioMessage("");
    setIndex((current) => (current + 1) % patterns.length);
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] bg-[#12333f] p-5 text-white">
        <p className="text-sm font-extrabold uppercase tracking-wide text-[#ffd166]">
          Nghe & ngữ pháp
        </p>
        <h2 className="mt-3 text-3xl font-black leading-tight">
          Nghe câu rồi chọn đúng nghĩa.
        </h2>
        <div className="mt-5 rounded-3xl bg-white/10 p-4">
          <p className="text-sm font-extrabold text-[#d8f2ef]">Câu tiếng Anh</p>
          <p className="mt-2 text-2xl font-black leading-8">
            {pattern.example}
          </p>
        </div>
        <div className="mt-4 rounded-3xl bg-white/10 p-4">
          <p className="text-sm font-extrabold text-[#d8f2ef]">Khung câu</p>
          <p className="mt-2 text-xl font-black text-[#ffd166]">
            {pattern.pattern}
          </p>
        </div>
        <p className="mt-4 text-sm font-extrabold text-[#d8f2ef]">
          Đúng {correctCount} câu trong phiên này.
        </p>
      </div>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="gap-2 sm:w-auto" onClick={replayAudio}>
            <span aria-hidden="true">▶</span>
            Nghe câu
          </Button>
          <Button
            className="sm:w-auto"
            disabled={!hasAnswered}
            onClick={nextQuestion}
            variant="secondary"
          >
            Câu tiếp theo
          </Button>
        </div>

        {audioMessage ? (
          <p className="mt-3 rounded-2xl bg-[#f2fbfa] px-4 py-3 text-sm font-bold text-[#5c747b]">
            {audioMessage}
          </p>
        ) : null}

        <div className="mt-5 grid gap-3">
          {options.map((option) => {
            const isSelected = selectedId === option.id;
            const shouldShowCorrect = hasAnswered && option.id === pattern.id;
            const shouldShowWrong = isSelected && !isCorrect;

            return (
              <button
                className={`rounded-2xl border px-4 py-4 text-left text-base font-black transition active:scale-[0.98] ${
                  shouldShowCorrect
                    ? "animate-answer-pop border-[#0e9f91] bg-[#d8f2ef] text-[#0b6f66]"
                    : shouldShowWrong
                      ? "animate-answer-shake border-[#ffb2aa] bg-[#ffe1dc] text-[#9a3b32]"
                      : "border-[#dcebea] bg-white text-[#12333f] hover:border-[#9fc9c6]"
                }`}
                disabled={hasAnswered}
                key={option.id}
                onClick={() => chooseOption(option)}
                type="button"
              >
                {option.vietnamese}
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
            {isCorrect
              ? "Đúng rồi. Nghe câu và khớp nghĩa rất ổn."
              : `Chưa đúng. Nghĩa đúng là: ${pattern.vietnamese}`}
            <p className="mt-2 text-sm leading-6 opacity-85">
              {pattern.useCase}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
