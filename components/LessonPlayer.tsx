"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { mockProgress } from "@/data/mockProgress";
import {
  getLessonSessionResult,
  getStreakMessage,
  isCorrectAnswer,
  type AnswerMap,
} from "@/lib/lessonSession";
import type {
  FillBlankQuestion,
  LessonSession,
  LessonSessionResult,
  ListeningQuestion,
  MultipleChoiceQuestion,
  SentenceOrderQuestion,
} from "@/types/lesson";
import { Button } from "./Button";
import { Card } from "./Card";
import { ProgressBar } from "./ProgressBar";

type LessonPlayerProps = {
  lesson: LessonSession;
};

type SaveState = "idle" | "saving" | "saved" | "mock" | "error";
type FeedbackTone = "correct" | "incorrect" | "complete";

function playFeedbackTone(tone: FeedbackTone) {
  if (typeof window === "undefined") {
    return;
  }

  const audioWindow = window as typeof window & {
    webkitAudioContext?: typeof AudioContext;
  };
  const AudioContextConstructor =
    audioWindow.AudioContext || audioWindow.webkitAudioContext;

  if (!AudioContextConstructor) {
    return;
  }

  try {
    const context = new AudioContextConstructor();
    const gain = context.createGain();
    const notes =
      tone === "correct"
        ? [
            { frequency: 523.25, start: 0, duration: 0.08 },
            { frequency: 659.25, start: 0.08, duration: 0.1 },
            { frequency: 783.99, start: 0.18, duration: 0.14 },
          ]
        : tone === "complete"
          ? [
              { frequency: 523.25, start: 0, duration: 0.08 },
              { frequency: 659.25, start: 0.08, duration: 0.08 },
              { frequency: 783.99, start: 0.16, duration: 0.08 },
              { frequency: 1046.5, start: 0.24, duration: 0.18 },
            ]
          : [
              { frequency: 220, start: 0, duration: 0.1 },
              { frequency: 164.81, start: 0.1, duration: 0.16 },
            ];

    gain.connect(context.destination);
    gain.gain.setValueAtTime(0.001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.5);

    notes.forEach((note) => {
      const oscillator = context.createOscillator();
      oscillator.type = tone === "incorrect" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(
        note.frequency,
        context.currentTime + note.start,
      );
      oscillator.connect(gain);
      oscillator.start(context.currentTime + note.start);
      oscillator.stop(context.currentTime + note.start + note.duration);
    });

    window.setTimeout(() => void context.close(), 700);
  } catch {
    // Browsers can block Web Audio. The lesson should still work without sound.
  }
}

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isReviewingMistakes, setIsReviewingMistakes] = useState(false);
  const [hasSyncedResult, setHasSyncedResult] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState("");
  const [feedbackPulseKey, setFeedbackPulseKey] = useState(0);

  const question = lesson.questions[questionIndex];
  const totalQuestions = lesson.questions.length;
  const streakDays = mockProgress.streakDays;
  const progress =
    totalQuestions === 0
      ? 0
      : Math.round(
          ((questionIndex + (hasSubmitted || isFinished ? 1 : 0)) /
            totalQuestions) *
            100,
        );
  const orderedSentence =
    question?.type === "sentence_order"
      ? selectedWordIds
          .map(
            (wordId) =>
              question.shuffledWords.find((word) => word.id === wordId)?.label,
          )
          .filter(Boolean)
          .join(" ")
      : "";
  const currentAnswer =
    question?.type === "multiple-choice"
      ? selectedOptionId ?? ""
      : question?.type === "fill_blank"
        ? typedAnswer
        : question?.type === "sentence_order"
          ? orderedSentence
          : question?.type === "listening"
            ? question.answerMode === "multiple_choice"
              ? selectedOptionId ?? ""
              : typedAnswer
            : "";
  const submittedIsCorrect =
    question && currentAnswer ? isCorrectAnswer(question, currentAnswer) : false;
  const result = useMemo(
    () => getLessonSessionResult(lesson, answers),
    [answers, lesson],
  );
  const streakMessage = getStreakMessage(streakDays, false);
  const usesInstantFeedback =
    question?.type === "multiple-choice" ||
    question?.type === "sentence_order" ||
    (question?.type === "listening" &&
      question.answerMode === "multiple_choice");

  useEffect(() => {
    if (!isFinished || hasSyncedResult) {
      return;
    }

    async function saveLessonAttempt() {
      setSaveState("saving");
      setSaveError("");

      try {
        const response = await fetch("/api/lesson-attempts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lessonId: lesson.id,
            completed: true,
            result,
          }),
        });
        const data = (await response.json()) as {
          error?: string;
          mode?: "mock" | "supabase";
          saved?: boolean;
        };

        if (!response.ok) {
          throw new Error(data.error || "Không thể lưu tiến độ.");
        }

        setSaveState(data.mode === "mock" ? "mock" : "saved");
        setHasSyncedResult(true);
      } catch (error) {
        setSaveState("error");
        setSaveError(
          error instanceof Error ? error.message : "Không thể lưu tiến độ.",
        );
      }
    }

    void saveLessonAttempt();
  }, [
    hasSyncedResult,
    isFinished,
    lesson.id,
    result,
  ]);

  function selectAnswer(optionId: string) {
    if (!question || hasSubmitted) {
      return;
    }

    setSelectedOptionId(optionId);

    if (
      question.type === "multiple-choice" ||
      (question.type === "listening" &&
        question.answerMode === "multiple_choice")
    ) {
      submitAnswer(optionId);
    }
  }

  function addWord(wordId: string) {
    if (
      !question ||
      question.type !== "sentence_order" ||
      hasSubmitted ||
      selectedWordIds.includes(wordId)
    ) {
      return;
    }

    setSelectedWordIds((current) => {
      const nextWordIds = [...current, wordId];

      if (nextWordIds.length === question.shuffledWords.length) {
        const nextAnswer = nextWordIds
          .map(
            (selectedWordId) =>
              question.shuffledWords.find((word) => word.id === selectedWordId)
                ?.label,
          )
          .filter(Boolean)
          .join(" ");

        window.setTimeout(() => submitAnswer(nextAnswer), 120);
      }

      return nextWordIds;
    });
  }

  function removeWord(wordId: string) {
    if (!hasSubmitted) {
      setSelectedWordIds((current) => current.filter((id) => id !== wordId));
    }
  }

  function submitAnswer(answerOverride = currentAnswer) {
    const answerToSubmit = answerOverride.trim();

    if (!question || !answerToSubmit) {
      return;
    }

    const answerIsCorrect = isCorrectAnswer(question, answerToSubmit);
    const isLastQuestion = questionIndex === totalQuestions - 1;

    setAnswers((current) => ({
      ...current,
      [question.id]: answerToSubmit,
    }));
    setHasSubmitted(true);
    setFeedbackPulseKey((current) => current + 1);
    playFeedbackTone(
      answerIsCorrect && isLastQuestion
        ? "complete"
        : answerIsCorrect
          ? "correct"
          : "incorrect",
    );
  }

  function continueLesson() {
    if (questionIndex === totalQuestions - 1) {
      setIsFinished(true);
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelectedOptionId(null);
    setTypedAnswer("");
    setSelectedWordIds([]);
    setHasSubmitted(false);
  }

  if (!question && !isFinished) {
    return <EmptyLessonState lessonTitle={lesson.title} />;
  }

  if (isFinished && isReviewingMistakes) {
    return (
      <MistakeReviewScreen
        mistakes={result.mistakes}
        onBack={() => setIsReviewingMistakes(false)}
      />
    );
  }

  if (isFinished) {
    return (
      <ResultScreen
        onReviewMistakes={() => setIsReviewingMistakes(true)}
        result={result}
        saveError={saveError}
        saveState={saveState}
        streakMessage={streakMessage}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#f7fbfa]">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-4 sm:px-6">
        <header className="sticky top-0 z-20 -mx-4 bg-[#f7fbfa]/95 px-4 pb-3 pt-2 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <Link
              className="rounded-2xl px-3 py-2 text-sm font-extrabold text-[#5c747b] transition hover:bg-[#eaf5f3]"
              href="/learn"
            >
              Lộ trình
            </Link>
            <div className="min-w-0 flex-1">
              <ProgressBar value={progress} label="Tiến độ bài học" />
            </div>
            <div className="flex min-w-fit items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-black text-[#12333f] shadow-sm ring-1 ring-[#dcebea]">
              <span className="text-[#0e9f91]">∞</span>
              Tự do
            </div>
          </div>
        </header>

        <div className="mt-2 flex items-center justify-between gap-3 rounded-3xl bg-white px-4 py-3 text-sm font-extrabold text-[#5c747b] shadow-sm ring-1 ring-[#dcebea]">
          <span>
            Câu {questionIndex + 1}/{totalQuestions}
          </span>
          <span className="rounded-full bg-[#fff0bd] px-3 py-1 text-[#7c5700]">
            Chơi nhanh +{lesson.xpPerQuestion} XP
          </span>
        </div>

        <section className="flex flex-1 items-start py-8 sm:items-center">
          <Card className="w-full overflow-hidden p-5 sm:p-8">
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#0e9f91]">
              {lesson.title}
            </p>
            <h1 className="mt-4 text-3xl font-black leading-tight text-[#12333f] sm:text-4xl">
              {question.prompt}
            </h1>

            {question.type === "multiple-choice" ? (
              <MultipleChoicePrompt
                hasSubmitted={hasSubmitted}
                onSelect={selectAnswer}
                question={question}
                selectedOptionId={selectedOptionId}
                submittedIsCorrect={submittedIsCorrect}
              />
            ) : question.type === "fill_blank" ? (
              <FillBlankPrompt
                hasSubmitted={hasSubmitted}
                onSubmit={() => submitAnswer()}
                question={question}
                setTypedAnswer={setTypedAnswer}
                typedAnswer={typedAnswer}
              />
            ) : question.type === "sentence_order" ? (
              <SentenceOrderPrompt
                addWord={addWord}
                hasSubmitted={hasSubmitted}
                question={question}
                removeWord={removeWord}
                selectedWordIds={selectedWordIds}
              />
            ) : (
              <ListeningPrompt
                hasSubmitted={hasSubmitted}
                onSubmit={() => submitAnswer()}
                onSelect={selectAnswer}
                question={question}
                selectedOptionId={selectedOptionId}
                setTypedAnswer={setTypedAnswer}
                submittedIsCorrect={submittedIsCorrect}
                typedAnswer={typedAnswer}
              />
            )}

            {hasSubmitted ? (
              <FeedbackPanel
                explanation={question.explanation}
                isCorrect={submittedIsCorrect}
                key={feedbackPulseKey}
              />
            ) : null}

            <div className="mt-6">
              {hasSubmitted ? (
                <Button className="w-full" onClick={continueLesson}>
                  {questionIndex === totalQuestions - 1
                    ? "Xem kết quả"
                    : "Tiếp tục"}
                </Button>
              ) : usesInstantFeedback ? (
                <p className="rounded-2xl bg-[#f2fbfa] px-4 py-3 text-center text-sm font-extrabold text-[#5c747b]">
                  {question.type === "sentence_order"
                    ? "Chọn đủ các từ, hệ thống sẽ chấm ngay."
                    : "Chạm một đáp án để biết kết quả ngay."}
                </p>
              ) : (
                <Button
                  className="w-full"
                  disabled={!currentAnswer.trim()}
                  onClick={() => submitAnswer()}
                >
                  Kiểm tra đáp án
                </Button>
              )}
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}

function EmptyLessonState({ lessonTitle }: { lessonTitle: string }) {
  return (
    <main className="min-h-screen bg-[#f7fbfa]">
      <div className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4">
        <Card className="w-full p-6 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-[#fff0bd] text-2xl font-black text-[#7c5700]">
            Đ
          </div>
          <h1 className="mt-5 text-3xl font-black text-[#12333f]">
            Bài học chưa có câu hỏi
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#5c747b]">
            {lessonTitle} đang chờ nội dung. Bạn có thể quay lại lộ trình để học
            bài khác.
          </p>
          <Link
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#ff6f61] px-5 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(255,111,97,0.28)]"
            href="/learn"
          >
            Quay lại lộ trình
          </Link>
        </Card>
      </div>
    </main>
  );
}

function ResultScreen({
  onReviewMistakes,
  result,
  saveError,
  saveState,
  streakMessage,
}: {
  onReviewMistakes: () => void;
  result: LessonSessionResult;
  saveError: string;
  saveState: SaveState;
  streakMessage: string;
}) {
  useEffect(() => {
    playFeedbackTone("complete");
  }, []);

  return (
    <main className="min-h-screen bg-[#f7fbfa]">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-4 py-8 sm:px-6">
        <Card className="animate-soft-pop relative overflow-hidden p-6 text-center sm:p-10">
          <CelebrationBurst />
          <div className="mx-auto grid size-20 place-items-center rounded-[2rem] bg-[#ffd166] text-3xl font-black text-[#7c5700]">
            XP
          </div>
          <h1 className="mt-6 text-4xl font-black leading-tight text-[#12333f] sm:text-5xl">
            Hoàn thành vòng học!
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[#5c747b]">
            Bạn đã trả lời đúng {result.correctAnswers}/
            {result.attemptedQuestions} câu đã làm. Kết quả được tính từ phiên
            học hiện tại.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <ResultMetric label="XP nhận được" value={String(result.xpEarned)} />
            <ResultMetric label="Độ chính xác" value={`${result.accuracy}%`} />
            <ResultMetric label="Số lỗi" value={String(result.mistakeCount)} />
            <div className="rounded-3xl bg-[#d8f2ef] p-5 text-left">
              <p className="text-sm font-extrabold text-[#0b6f66]">
                Chuỗi ngày
              </p>
              <p className="mt-2 text-lg font-black leading-tight text-[#12333f]">
                {streakMessage}
              </p>
            </div>
          </div>

          <SaveStatusMessage error={saveError} state={saveState} />

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {result.mistakeCount > 0 ? (
              <Button onClick={onReviewMistakes} variant="secondary">
                Ôn lỗi sai
              </Button>
            ) : null}
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#ff6f61] px-5 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(255,111,97,0.28)] transition hover:bg-[#f45f54]"
              href="/learn"
            >
              Quay lại lộ trình
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}

function CelebrationBurst() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <span
          className="animate-confetti-pop absolute block h-8 w-2 rounded-full"
          key={item}
          style={{
            animationDelay: `${item * 80}ms`,
            backgroundColor: ["#ff6f61", "#ffd166", "#0e9f91"][item % 3],
            left: `${16 + item * 13}%`,
            top: `${8 + (item % 2) * 8}%`,
            transform: `rotate(${item * 24}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-[#f7fbfa] p-5 text-left ring-1 ring-[#dcebea]">
      <p className="text-sm font-extrabold text-[#5c747b]">{label}</p>
      <p className="mt-2 text-4xl font-black text-[#12333f]">{value}</p>
    </div>
  );
}

function SaveStatusMessage({
  error,
  state,
}: {
  error: string;
  state: SaveState;
}) {
  if (state === "idle") {
    return null;
  }

  const messages = {
    saving: "Đang lưu tiến độ...",
    saved: "Đã lưu tiến độ học của bạn.",
    mock: "Đã ghi nhận kết quả cho phiên học này.",
    error: error || "Không thể lưu tiến độ.",
  };
  const styles = {
    saving: "bg-[#f2fbfa] text-[#5c747b]",
    saved: "bg-[#d8f2ef] text-[#0b6f66]",
    mock: "bg-[#fff0bd] text-[#7c5700]",
    error: "bg-[#ffe1dc] text-[#9a3b32]",
  };

  return (
    <p className={`mt-5 rounded-2xl p-3 text-sm font-extrabold ${styles[state]}`}>
      {messages[state]}
    </p>
  );
}

function FeedbackPanel({
  explanation,
  isCorrect,
}: {
  explanation: string;
  isCorrect: boolean;
}) {
  return (
    <div
      className={`mt-5 flex items-start gap-3 rounded-3xl p-4 ${
        isCorrect
          ? "animate-answer-pop bg-[#d8f2ef] text-[#0b6f66]"
          : "animate-answer-shake bg-[#ffe1dc] text-[#9a3b32]"
      }`}
    >
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white/80 text-xl font-black"
      >
        {isCorrect ? "✓" : "!"}
      </span>
      <div>
        <p className="text-lg font-black">
          {isCorrect ? "Chính xác!" : "Chưa đúng."}
        </p>
        <p className="mt-1 text-sm font-semibold leading-6">{explanation}</p>
      </div>
    </div>
  );
}

function MistakeReviewScreen({
  mistakes,
  onBack,
}: {
  mistakes: LessonSessionResult["mistakes"];
  onBack: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#f7fbfa]">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-6 sm:px-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#ff6f61]">
              Ôn lỗi sai
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-[#12333f]">
              Nhìn lại câu chưa đúng
            </h1>
          </div>
          <Button onClick={onBack} variant="secondary">
            Kết quả
          </Button>
        </header>

        {mistakes.length === 0 ? (
          <Card className="mt-6 p-6 text-center">
            <h2 className="text-2xl font-black text-[#12333f]">
              Không có lỗi nào để ôn
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#5c747b]">
              Phiên học này sạch sẽ rồi. Quay lại kết quả để tiếp tục nhé.
            </p>
          </Card>
        ) : (
          <div className="mt-6 grid gap-4">
            {mistakes.map((mistake, index) => (
              <Card className="animate-soft-pop p-5" key={mistake.questionId}>
                <p className="text-sm font-extrabold text-[#ff6f61]">
                  Lỗi {index + 1}
                </p>
                <h2 className="mt-2 text-xl font-black leading-tight text-[#12333f]">
                  {mistake.prompt}
                </h2>
                <div className="mt-4 grid gap-3">
                  <ReviewBlock
                    label="Đáp án của bạn"
                    tone="bad"
                    value={mistake.userAnswer}
                  />
                  <ReviewBlock
                    label="Đáp án đúng"
                    tone="good"
                    value={mistake.correctAnswer}
                  />
                  <ReviewBlock
                    label="Giải thích"
                    tone="neutral"
                    value={mistake.explanation}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function ReviewBlock({
  label,
  tone,
  value,
}: {
  label: string;
  tone: "bad" | "good" | "neutral";
  value: string;
}) {
  const styles = {
    bad: "bg-[#ffe1dc] text-[#9a3b32]",
    good: "bg-[#d8f2ef] text-[#0b6f66]",
    neutral: "bg-[#f2fbfa] text-[#5c747b]",
  };

  return (
    <div className={`rounded-2xl p-4 ${styles[tone]}`}>
      <p className="text-sm font-extrabold">{label}</p>
      <p className="mt-1 text-base font-black leading-6 text-[#12333f]">
        {value}
      </p>
    </div>
  );
}

function MultipleChoicePrompt({
  hasSubmitted,
  onSelect,
  question,
  selectedOptionId,
  submittedIsCorrect,
}: {
  hasSubmitted: boolean;
  onSelect: (optionId: string) => void;
  question: MultipleChoiceQuestion;
  selectedOptionId: string | null;
  submittedIsCorrect: boolean;
}) {
  return (
    <OptionGrid
      correctOptionId={question.correctOptionId}
      hasSubmitted={hasSubmitted}
      onSelect={onSelect}
      options={question.options}
      selectedOptionId={selectedOptionId}
      submittedIsCorrect={submittedIsCorrect}
    />
  );
}

function OptionGrid({
  correctOptionId,
  hasSubmitted,
  onSelect,
  options,
  selectedOptionId,
  submittedIsCorrect,
}: {
  correctOptionId?: string;
  hasSubmitted: boolean;
  onSelect: (optionId: string) => void;
  options?: { id: string; label: string }[];
  selectedOptionId: string | null;
  submittedIsCorrect: boolean;
}) {
  return (
    <div className="mt-6 grid gap-3">
      {(options || []).map((option) => {
        const isSelected = selectedOptionId === option.id;
        const isCorrect = correctOptionId === option.id;
        const showCorrect = hasSubmitted && isCorrect;
        const showIncorrect = hasSubmitted && isSelected && !submittedIsCorrect;

        return (
          <button
            className={`min-h-14 rounded-2xl border p-4 text-left text-base font-extrabold transition duration-200 active:scale-[0.98] ${
              showCorrect
                ? "animate-answer-pop border-[#0e9f91] bg-[#d8f2ef] text-[#0b6f66]"
                : showIncorrect
                  ? "animate-answer-shake border-[#ffb2aa] bg-[#ffe1dc] text-[#9a3b32]"
                  : isSelected
                    ? "border-[#ff6f61] bg-white text-[#12333f] shadow-[0_12px_28px_rgba(255,111,97,0.12)]"
                    : "border-[#dcebea] bg-white text-[#12333f] hover:border-[#9fc9c6] hover:bg-[#f7fbfa]"
            }`}
            disabled={hasSubmitted}
            key={option.id}
            onClick={() => onSelect(option.id)}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function FillBlankPrompt({
  hasSubmitted,
  onSubmit,
  question,
  setTypedAnswer,
  typedAnswer,
}: {
  hasSubmitted: boolean;
  onSubmit: () => void;
  question: FillBlankQuestion;
  setTypedAnswer: (value: string) => void;
  typedAnswer: string;
}) {
  const beforeText = question.sentenceParts.before.trimEnd();
  const afterText = question.sentenceParts.after.trimStart();
  const shouldSpaceBeforeBlank = beforeText.length > 0;
  const shouldSpaceAfterBlank =
    afterText.length > 0 && !/^[.,!?;:]/.test(afterText);

  return (
    <div className="mt-6 rounded-3xl border border-[#dcebea] bg-[#f7fbfa] p-4">
      <p className="text-lg font-black leading-8 text-[#12333f]">
        {beforeText}
        {shouldSpaceBeforeBlank ? " " : ""}
        <span className="mx-2 inline-block min-w-20 border-b-4 border-[#ff6f61]">
          <span className="sr-only">____</span>
        </span>
        {shouldSpaceAfterBlank ? " " : ""}
        {afterText}
      </p>
      <AnswerTextInput
        disabled={hasSubmitted}
        id={`answer-${question.id}`}
        label="Nhập đáp án"
        onChange={setTypedAnswer}
        onSubmit={onSubmit}
        placeholder="Viết đáp án vào đây"
        value={typedAnswer}
      />
    </div>
  );
}

function ListeningPrompt({
  hasSubmitted,
  onSubmit,
  onSelect,
  question,
  selectedOptionId,
  setTypedAnswer,
  submittedIsCorrect,
  typedAnswer,
}: {
  hasSubmitted: boolean;
  onSubmit: () => void;
  onSelect: (optionId: string) => void;
  question: ListeningQuestion;
  selectedOptionId: string | null;
  setTypedAnswer: (value: string) => void;
  submittedIsCorrect: boolean;
  typedAnswer: string;
}) {
  const [speechSupport, setSpeechSupport] = useState<
    "checking" | "supported" | "unsupported"
  >("supported");
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakSentence = useCallback(() => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      typeof SpeechSynthesisUtterance === "undefined"
    ) {
      setSpeechSupport("unsupported");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question.audioText);
    utterance.lang = "en-US";
    utterance.rate = 0.88;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setSpeechSupport("supported");
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [question.audioText]);

  useEffect(() => {
    const timer = window.setTimeout(speakSentence, 400);
    return () => window.clearTimeout(timer);
  }, [speakSentence]);

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-3xl border border-[#dcebea] bg-[#f7fbfa] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#0e9f91]">
              Listening
            </p>
            <p className="mt-1 text-sm font-semibold leading-6 text-[#5c747b]">
              Nghe câu tiếng Anh rồi trả lời bên dưới.
            </p>
          </div>
          <Button
            className="w-full gap-3 sm:w-auto"
            disabled={speechSupport === "checking"}
            onClick={speakSentence}
            variant="secondary"
          >
            <span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-[#12333f] text-xs text-white">
              ▶
            </span>
            {isSpeaking ? "Đang phát..." : "Nghe lại"}
          </Button>
        </div>

        {speechSupport === "unsupported" ? (
          <div className="mt-4 rounded-2xl bg-[#fff0bd] p-4 text-sm font-bold leading-6 text-[#7c5700]">
            Trình duyệt này chưa hỗ trợ speech synthesis. Tạm thời đọc câu mẫu:
            <span className="mt-2 block text-base font-black text-[#12333f]">
              {question.audioText}
            </span>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-white p-4 text-sm font-bold text-[#5c747b]">
            <span>
              {isSpeaking
                ? "Đang đọc câu mẫu bằng giọng trình duyệt."
                : "Bấm “Nghe lại” để phát âm thanh."}
            </span>
            <SoundWave isActive={isSpeaking} />
          </div>
        )}
      </div>

      {question.answerMode === "multiple_choice" ? (
        <OptionGrid
          correctOptionId={question.correctOptionId}
          hasSubmitted={hasSubmitted}
          onSelect={onSelect}
          options={question.options}
          selectedOptionId={selectedOptionId}
          submittedIsCorrect={submittedIsCorrect}
        />
      ) : (
        <div className="rounded-3xl border border-[#dcebea] bg-white p-4">
          <AnswerTextInput
            disabled={hasSubmitted}
            id={`answer-${question.id}`}
            label="Nhập câu bạn nghe được"
            onChange={setTypedAnswer}
            onSubmit={onSubmit}
            placeholder="Ví dụ: I live in Hanoi."
            value={typedAnswer}
          />
        </div>
      )}
    </div>
  );
}

function SoundWave({ isActive }: { isActive: boolean }) {
  return (
    <span aria-hidden="true" className="flex h-8 items-center gap-1">
      {[0, 1, 2, 3].map((bar) => (
        <span
          className={`block w-1.5 rounded-full bg-[#0e9f91] ${
            isActive ? "animate-sound-wave" : "h-3 opacity-40"
          }`}
          key={bar}
          style={isActive ? { animationDelay: `${bar * 90}ms` } : undefined}
        />
      ))}
    </span>
  );
}

function AnswerTextInput({
  disabled,
  id,
  label,
  onChange,
  onSubmit,
  placeholder,
  value,
}: {
  disabled: boolean;
  id: string;
  label: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  value: string;
}) {
  return (
    <>
      <label className="mt-5 block text-sm font-extrabold text-[#5c747b]" htmlFor={id}>
        {label}
      </label>
      <input
        className="mt-2 w-full rounded-2xl border border-[#dcebea] bg-white px-4 py-3 text-base font-extrabold text-[#12333f] outline-none transition focus:border-[#0e9f91] focus:ring-4 focus:ring-[#d8f2ef]"
        disabled={disabled}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onSubmit();
          }
        }}
        placeholder={placeholder}
        type="text"
        value={value}
      />
    </>
  );
}

function SentenceOrderPrompt({
  addWord,
  hasSubmitted,
  question,
  removeWord,
  selectedWordIds,
}: {
  addWord: (wordId: string) => void;
  hasSubmitted: boolean;
  question: SentenceOrderQuestion;
  removeWord: (wordId: string) => void;
  selectedWordIds: string[];
}) {
  return (
    <div className="mt-6 space-y-4">
      <div className="min-h-28 rounded-3xl border border-[#dcebea] bg-[#f7fbfa] p-4">
        <p className="text-sm font-extrabold text-[#5c747b]">Câu của bạn</p>
        <div className="mt-3 flex min-h-14 flex-wrap gap-2">
          {selectedWordIds.length > 0 ? (
            selectedWordIds.map((wordId) => {
              const word = question.shuffledWords.find(
                (item) => item.id === wordId,
              );

              if (!word) {
                return null;
              }

              return (
                <button
                  className="rounded-2xl bg-[#12333f] px-4 py-3 text-sm font-black text-white transition hover:bg-[#284b59]"
                  disabled={hasSubmitted}
                  key={word.id}
                  onClick={() => removeWord(word.id)}
                  type="button"
                >
                  {word.label}
                </button>
              );
            })
          ) : (
            <span className="text-sm font-semibold text-[#8aa0a5]">
              Chạm các từ bên dưới để xếp câu.
            </span>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-[#dcebea] bg-white p-4">
        <p className="text-sm font-extrabold text-[#5c747b]">Từ gợi ý</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {question.shuffledWords.map((word) => {
            const isUsed = selectedWordIds.includes(word.id);

            return (
              <button
                className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                  isUsed
                    ? "bg-[#edf3f2] text-[#9aacb1]"
                    : "bg-[#fff0bd] text-[#7c5700] hover:bg-[#ffe08a]"
                }`}
                disabled={hasSubmitted || isUsed}
                key={word.id}
                onClick={() => addWord(word.id)}
                type="button"
              >
                {word.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
