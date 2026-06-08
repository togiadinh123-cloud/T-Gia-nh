"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { mockLessons } from "@/data/mockLessons";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Json, QuestionType } from "@/types/database";
import type { LessonQuestion, LessonSession } from "@/types/lesson";
import { Button } from "./Button";
import { Card } from "./Card";

type AdminQuestionType = Exclude<QuestionType, "listening">;

type LessonFormState = {
  id: string;
  unitId: string;
  title: string;
  description: string;
  xpPerQuestion: string;
};

type QuestionFormState = {
  lessonId: string;
  type: AdminQuestionType;
  prompt: string;
  explanation: string;
  optionsText: string;
  correctOptionId: string;
  blankBefore: string;
  blankAfter: string;
  correctAnswer: string;
  wordsText: string;
  correctSentence: string;
};

const initialLessonForm: LessonFormState = {
  id: "",
  unitId: "unit-1",
  title: "",
  description: "",
  xpPerQuestion: "10",
};

const initialQuestionForm: QuestionFormState = {
  lessonId: "",
  type: "multiple_choice",
  prompt: "",
  explanation: "",
  optionsText: "a|My answer\nb|Another answer\nc|Third answer",
  correctOptionId: "a",
  blankBefore: "",
  blankAfter: "",
  correctAnswer: "",
  wordsText: "I\nlive\nin\nHanoi.",
  correctSentence: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getQuestionTypeLabel(type: AdminQuestionType) {
  const labels: Record<AdminQuestionType, string> = {
    multiple_choice: "trắc nghiệm",
    fill_blank: "điền từ",
    sentence_order: "sắp xếp câu",
  };

  return labels[type];
}

function getQuestionData(form: QuestionFormState): Json {
  if (form.type === "multiple_choice") {
    return {
      options: parseOptions(form.optionsText),
      correctOptionId: form.correctOptionId.trim(),
    };
  }

  if (form.type === "fill_blank") {
    return {
      sentenceParts: {
        before: form.blankBefore.trim(),
        after: form.blankAfter.trim(),
      },
      correctAnswer: form.correctAnswer.trim(),
    };
  }

  return {
    shuffledWords: parseWords(form.wordsText),
    correctSentence: form.correctSentence.trim(),
  };
}

function parseOptions(optionsText: string) {
  return optionsText
    .split("\n")
    .flatMap((line) => {
      const [id, ...labelParts] = line.split("|");
      const optionId = id?.trim();
      const label = labelParts.join("|").trim();

      return optionId && label ? [{ id: optionId, label }] : [];
    });
}

function parseWords(wordsText: string) {
  return wordsText
    .split("\n")
    .map((label, index) => ({
      id: `w${index + 1}`,
      label: label.trim(),
    }))
    .filter((word) => word.label);
}

function buildLocalQuestion(form: QuestionFormState): LessonQuestion {
  const base = {
    id: `q-${Date.now()}`,
    prompt: form.prompt.trim(),
    explanation: form.explanation.trim(),
  };

  if (form.type === "multiple_choice") {
    return {
      ...base,
      type: "multiple-choice",
      options: parseOptions(form.optionsText),
      correctOptionId: form.correctOptionId.trim(),
    };
  }

  if (form.type === "fill_blank") {
    return {
      ...base,
      type: "fill_blank",
      sentenceParts: {
        before: form.blankBefore.trim(),
        after: form.blankAfter.trim(),
      },
      correctAnswer: form.correctAnswer.trim(),
    };
  }

  return {
    ...base,
    type: "sentence_order",
    shuffledWords: parseWords(form.wordsText),
    correctSentence: form.correctSentence.trim(),
  };
}

function validateLessonForm(form: LessonFormState) {
  const lessonId = form.id.trim() || slugify(form.title);

  if (!lessonId) {
    return "Cần nhập Lesson ID hoặc tiêu đề có thể tạo slug.";
  }

  if (!form.title.trim()) {
    return "Cần nhập tiêu đề bài học.";
  }

  if (!form.unitId.trim()) {
    return "Cần nhập Unit ID.";
  }

  if (
    Number(form.xpPerQuestion) <= 0 ||
    Number.isNaN(Number(form.xpPerQuestion))
  ) {
    return "XP phải là số dương.";
  }

  return "";
}

function validateQuestionForm(form: QuestionFormState) {
  if (!form.lessonId) {
    return "Chọn một bài học trước.";
  }

  if (!form.prompt.trim()) {
    return "Cần nhập câu hỏi.";
  }

  if (!form.explanation.trim()) {
    return "Cần nhập giải thích ngắn.";
  }

  if (form.type === "multiple_choice") {
    const options = parseOptions(form.optionsText);

    if (options.length < 2) {
      return "Câu multiple_choice cần ít nhất hai lựa chọn.";
    }

    if (!options.some((option) => option.id === form.correctOptionId.trim())) {
      return "ID đáp án đúng phải trùng với một lựa chọn.";
    }
  }

  if (form.type === "fill_blank") {
    if (!form.correctAnswer.trim()) {
      return "Cần nhập đáp án đúng.";
    }

    if (!form.blankBefore.trim() && !form.blankAfter.trim()) {
      return "Cần nhập phần câu trước hoặc sau chỗ trống.";
    }
  }

  if (form.type === "sentence_order") {
    if (parseWords(form.wordsText).length < 2) {
      return "Câu sentence_order cần ít nhất hai thẻ từ.";
    }

    if (!form.correctSentence.trim()) {
      return "Cần nhập câu đúng.";
    }
  }

  return "";
}

export function AdminLessonEditor() {
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [lessons, setLessons] = useState<LessonSession[]>(mockLessons);
  const [lessonForm, setLessonForm] = useState(initialLessonForm);
  const [questionForm, setQuestionForm] = useState({
    ...initialQuestionForm,
    lessonId: mockLessons[0]?.id || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(
    isSupabaseConfigured()
      ? "Đã cấu hình Supabase. Hệ thống sẽ thử lưu vào database."
      : "Đang ở mock/local mode vì thiếu biến môi trường Supabase.",
  );
  const [error, setError] = useState("");
  const selectedLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === questionForm.lessonId),
    [lessons, questionForm.lessonId],
  );

  useEffect(() => {
    async function loadSupabaseLessons() {
      if (!isSupabaseConfigured()) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error: loadError } = await supabase
          .from("lessons")
          .select("id,title,description,xp_reward")
          .order("sort_order");

        if (loadError) {
          throw loadError;
        }

        if (data && data.length > 0) {
          const remoteLessons = data.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description || "",
            xpPerQuestion: lesson.xp_reward,
            questions: [],
          }));

          setLessons(remoteLessons);
          setQuestionForm((current) => ({
            ...current,
            lessonId: remoteLessons[0]?.id || "",
          }));
          setStatus(
            "Đã tải lesson từ Supabase. Question mới sẽ được lưu khi bạn bấm thêm.",
          );
        }
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Không tải được lesson từ Supabase.",
        );
        setStatus("Đã quay về mock lessons.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadSupabaseLessons();
  }, []);

  function unlockAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (adminCode.trim().toLowerCase() === "admin") {
      setIsAdminUnlocked(true);
      setError("");
      return;
    }

    setError("Mã admin tạm thời là 'admin'. Sau này thay bằng role thật.");
  }

  async function createLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateLessonForm(lessonForm);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsLoading(true);

    const id = lessonForm.id.trim() || slugify(lessonForm.title);
    if (lessons.some((lesson) => lesson.id === id)) {
      setError("Lesson ID này đã tồn tại.");
      setIsLoading(false);
      return;
    }

    const newLesson: LessonSession = {
      id,
      title: lessonForm.title.trim(),
      description: lessonForm.description.trim(),
      xpPerQuestion: Number(lessonForm.xpPerQuestion),
      questions: [],
    };

    try {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseBrowserClient();
        const { count } = await supabase
          .from("lessons")
          .select("id", { count: "exact", head: true });
        const { error: saveError } = await supabase.from("lessons").insert({
          id,
          unit_id: lessonForm.unitId.trim(),
          title: newLesson.title,
          description: newLesson.description,
          xp_reward: newLesson.xpPerQuestion,
          sort_order: (count || 0) + 1,
          is_published: false,
        });

        if (saveError) {
          throw saveError;
        }

        setStatus(`Đã lưu lesson "${newLesson.title}" vào Supabase.`);
      } else {
        setStatus(`Đã tạo lesson "${newLesson.title}" trong local.`);
      }

      setLessons((current) => [...current, newLesson]);
      setQuestionForm((current) => ({
        ...current,
        lessonId: newLesson.id,
      }));
      setLessonForm(initialLessonForm);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Không lưu được lesson.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function addQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateQuestionForm(questionForm);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const question = buildLocalQuestion(questionForm);

      if (isSupabaseConfigured()) {
        const supabase = getSupabaseBrowserClient();
        const existingCount =
          lessons.find((lesson) => lesson.id === questionForm.lessonId)?.questions
            .length || 0;
        const { error: saveError } = await supabase.from("questions").insert({
          id: question.id,
          lesson_id: questionForm.lessonId,
          type: questionForm.type,
          prompt: questionForm.prompt.trim(),
          explanation: questionForm.explanation.trim(),
          data: getQuestionData(questionForm),
          sort_order: existingCount + 1,
        });

        if (saveError) {
          throw saveError;
        }

        setStatus("Đã lưu question vào Supabase.");
      } else {
        setStatus("Đã thêm question trong local.");
      }

      setLessons((current) =>
        current.map((lesson) =>
          lesson.id === questionForm.lessonId
            ? {
                ...lesson,
                questions: [...lesson.questions, question],
              }
            : lesson,
        ),
      );
      setQuestionForm((current) => ({
        ...initialQuestionForm,
        lessonId: current.lessonId,
        type: current.type,
      }));
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Không lưu được question.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (!isAdminUnlocked) {
    return (
      <AdminShell>
        <Card className="mx-auto max-w-md p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-[#ff6f61]">
            Bảo vệ tạm thời
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#12333f]">
            Mở trình sửa bài học
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#5c747b]">
            Đây chỉ là lớp bảo vệ tạm thời. Dùng mã <strong>admin</strong> để
            vào editor.
          </p>
          <form className="mt-5 space-y-4" onSubmit={unlockAdmin}>
            <input
              className="w-full rounded-2xl border border-[#dcebea] px-4 py-3 text-base font-bold text-[#12333f] outline-none focus:border-[#0e9f91] focus:ring-4 focus:ring-[#d8f2ef]"
              onChange={(event) => setAdminCode(event.target.value)}
              placeholder="Mã admin"
              type="password"
              value={adminCode}
            />
            {error ? (
              <p className="rounded-2xl bg-[#ffe1dc] p-3 text-sm font-bold text-[#9a3b32]">
                {error}
              </p>
            ) : null}
            <Button className="w-full" type="submit">
              Mở editor
            </Button>
          </form>
        </Card>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-4">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#0e9f91]">
                  Bài học
                </p>
                <h1 className="mt-2 text-3xl font-black text-[#12333f]">
                  Trình sửa bài học
                </h1>
              </div>
              <span className="rounded-2xl bg-[#fff0bd] px-3 py-2 text-xs font-black text-[#7c5700]">
                {isSupabaseConfigured() ? "Supabase" : "Local"}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#5c747b]">{status}</p>
            {error ? (
              <p className="mt-3 rounded-2xl bg-[#ffe1dc] p-3 text-sm font-bold text-[#9a3b32]">
                {error}
              </p>
            ) : null}
          </Card>

          <div className="grid gap-3">
            {lessons.map((lesson) => (
              <button
                className={`rounded-2xl border bg-white p-4 text-left transition hover:border-[#9fc9c6] ${
                  questionForm.lessonId === lesson.id
                    ? "border-[#0e9f91] shadow-[0_14px_34px_rgba(18,51,63,0.08)]"
                    : "border-[#dcebea]"
                }`}
                key={lesson.id}
                onClick={() =>
                  setQuestionForm((current) => ({
                    ...current,
                    lessonId: lesson.id,
                  }))
                }
                type="button"
              >
                <p className="text-lg font-black text-[#12333f]">
                  {lesson.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#5c747b]">
                  {lesson.description}
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-[#0e9f91]">
                  {lesson.questions.length} câu hỏi / +{lesson.xpPerQuestion} XP
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <LessonCreateForm
            form={lessonForm}
            isLoading={isLoading}
            onChange={setLessonForm}
            onSubmit={createLesson}
          />
          <QuestionCreateForm
            form={questionForm}
            isLoading={isLoading}
            lessons={lessons}
            onChange={setQuestionForm}
            onSubmit={addQuestion}
            selectedLesson={selectedLesson}
          />
        </section>
      </div>
    </AdminShell>
  );
}

function AdminShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#12333f] text-lg font-black text-[#ffd166]">
              Đ
            </span>
            <span className="text-xl font-black text-[#12333f]">Định English</span>
          </Link>
          <Link
            className="rounded-2xl bg-white px-4 py-2 text-sm font-bold text-[#47626c] shadow-sm ring-1 ring-[#dcebea]"
            href="/learn"
          >
            Học ngay
          </Link>
        </header>
        {children}
      </div>
    </main>
  );
}

function LessonCreateForm({
  form,
  isLoading,
  onChange,
  onSubmit,
}: {
  form: LessonFormState;
  isLoading: boolean;
  onChange: (form: LessonFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Card className="p-5">
      <h2 className="text-2xl font-black text-[#12333f]">Tạo bài học</h2>
      <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
        <TextInput
          label="Lesson ID"
          onChange={(id) => onChange({ ...form, id })}
          placeholder="slug-tuy-chon"
          value={form.id}
        />
        <TextInput
          label="Unit ID"
          onChange={(unitId) => onChange({ ...form, unitId })}
          placeholder="unit-1"
          value={form.unitId}
        />
        <TextInput
          label="Tiêu đề"
          onChange={(title) => onChange({ ...form, title })}
          placeholder="Thói quen buổi sáng"
          value={form.title}
        />
        <TextInput
          label="Mô tả"
          onChange={(description) => onChange({ ...form, description })}
          placeholder="Tóm tắt ngắn về bài học"
          value={form.description}
        />
        <TextInput
          label="XP mỗi câu"
          onChange={(xpPerQuestion) => onChange({ ...form, xpPerQuestion })}
          placeholder="10"
          type="number"
          value={form.xpPerQuestion}
        />
        <Button disabled={isLoading} type="submit">
          Tạo bài học
        </Button>
      </form>
    </Card>
  );
}

function QuestionCreateForm({
  form,
  isLoading,
  lessons,
  onChange,
  onSubmit,
  selectedLesson,
}: {
  form: QuestionFormState;
  isLoading: boolean;
  lessons: LessonSession[];
  onChange: (form: QuestionFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  selectedLesson?: LessonSession;
}) {
  return (
    <Card className="p-5">
      <h2 className="text-2xl font-black text-[#12333f]">Thêm câu hỏi</h2>
      <p className="mt-1 text-sm text-[#5c747b]">
        Bài học đang chọn: {selectedLesson?.title || "Chưa có"}
      </p>
      <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
        <label className="block">
          <span className="text-sm font-bold text-[#5c747b]">Bài học</span>
          <select
            className="mt-2 w-full rounded-2xl border border-[#dcebea] bg-white px-4 py-3 text-base font-bold text-[#12333f]"
            onChange={(event) =>
              onChange({ ...form, lessonId: event.target.value })
            }
            value={form.lessonId}
          >
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-bold text-[#5c747b]">Kiểu câu hỏi</span>
          <select
            className="mt-2 w-full rounded-2xl border border-[#dcebea] bg-white px-4 py-3 text-base font-bold text-[#12333f]"
            onChange={(event) =>
              onChange({
                ...form,
                type: event.target.value as AdminQuestionType,
              })
            }
            value={form.type}
          >
            <option value="multiple_choice">Trắc nghiệm</option>
            <option value="fill_blank">Điền từ</option>
            <option value="sentence_order">Sắp xếp câu</option>
          </select>
        </label>
        <TextInput
          label="Nội dung câu hỏi"
          onChange={(prompt) => onChange({ ...form, prompt })}
          placeholder="Người học cần làm gì?"
          value={form.prompt}
        />
        <TextInput
          label="Giải thích"
          onChange={(explanation) => onChange({ ...form, explanation })}
          placeholder="Phần giải thích ngắn sau khi trả lời"
          value={form.explanation}
        />
        <QuestionTypeFields form={form} onChange={onChange} />
        <Button disabled={isLoading} type="submit">
          Thêm câu {getQuestionTypeLabel(form.type)}
        </Button>
      </form>
    </Card>
  );
}

function QuestionTypeFields({
  form,
  onChange,
}: {
  form: QuestionFormState;
  onChange: (form: QuestionFormState) => void;
}) {
  if (form.type === "multiple_choice") {
    return (
      <>
        <TextArea
          helper="Mỗi lựa chọn một dòng: id|nội dung"
          label="Lựa chọn"
          onChange={(optionsText) => onChange({ ...form, optionsText })}
          value={form.optionsText}
        />
        <TextInput
          label="ID đáp án đúng"
          onChange={(correctOptionId) => onChange({ ...form, correctOptionId })}
          placeholder="a"
          value={form.correctOptionId}
        />
      </>
    );
  }

  if (form.type === "fill_blank") {
    return (
      <>
        <TextInput
          label="Phần câu trước chỗ trống"
          onChange={(blankBefore) => onChange({ ...form, blankBefore })}
          placeholder="My name"
          value={form.blankBefore}
        />
        <TextInput
          label="Phần câu sau chỗ trống"
          onChange={(blankAfter) => onChange({ ...form, blankAfter })}
          placeholder="Định."
          value={form.blankAfter}
        />
        <TextInput
          label="Đáp án đúng"
          onChange={(correctAnswer) => onChange({ ...form, correctAnswer })}
          placeholder="is"
          value={form.correctAnswer}
        />
      </>
    );
  }

  return (
    <>
      <TextArea
        helper="Mỗi thẻ từ một dòng"
        label="Thẻ từ đã trộn"
        onChange={(wordsText) => onChange({ ...form, wordsText })}
        value={form.wordsText}
      />
      <TextInput
        label="Câu đúng"
        onChange={(correctSentence) => onChange({ ...form, correctSentence })}
        placeholder="I live in Hanoi."
        value={form.correctSentence}
      />
    </>
  );
}

function TextInput({
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-[#5c747b]">{label}</span>
      <input
        className="mt-2 w-full rounded-2xl border border-[#dcebea] bg-white px-4 py-3 text-base font-bold text-[#12333f] outline-none transition focus:border-[#0e9f91] focus:ring-4 focus:ring-[#d8f2ef]"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}

function TextArea({
  helper,
  label,
  onChange,
  value,
}: {
  helper: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-[#5c747b]">{label}</span>
      <textarea
        className="mt-2 min-h-28 w-full rounded-2xl border border-[#dcebea] bg-white px-4 py-3 text-base font-bold text-[#12333f] outline-none transition focus:border-[#0e9f91] focus:ring-4 focus:ring-[#d8f2ef]"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
      <span className="mt-1 block text-xs font-semibold text-[#8aa0a5]">
        {helper}
      </span>
    </label>
  );
}
