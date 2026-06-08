import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { LessonSessionResult } from "@/types/lesson";

type LessonAttemptPayload = {
  lessonId: string;
  completed: boolean;
  result: LessonSessionResult;
};

function isLessonSessionResult(value: unknown): value is LessonSessionResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const result = value as Partial<LessonSessionResult>;

  return (
    typeof result.lessonId === "string" &&
    typeof result.totalQuestions === "number" &&
    typeof result.attemptedQuestions === "number" &&
    typeof result.correctAnswers === "number" &&
    typeof result.mistakeCount === "number" &&
    Array.isArray(result.mistakes) &&
    typeof result.accuracy === "number" &&
    typeof result.xpEarned === "number"
  );
}

function isLessonAttemptPayload(value: unknown): value is LessonAttemptPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<LessonAttemptPayload>;

  return (
    typeof payload.lessonId === "string" &&
    typeof payload.completed === "boolean" &&
    isLessonSessionResult(payload.result)
  );
}

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Payload không hợp lệ." },
      { status: 400 },
    );
  }

  if (!isLessonAttemptPayload(payload)) {
    return NextResponse.json(
      { error: "Payload thiếu hoặc sai định dạng." },
      { status: 400 },
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      mode: "mock",
      saved: false,
      message: "Supabase chưa cấu hình, giữ tiến độ ở mock mode.",
    });
  }

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: userError?.message || "Bạn cần đăng nhập để lưu tiến độ." },
      { status: 401 },
    );
  }

  const { completed, lessonId, result } = payload;

  const { data: attempt, error: attemptError } = await supabase
    .from("lesson_attempts")
    .insert({
      user_id: user.id,
      lesson_id: lessonId,
      xp_earned: result.xpEarned,
      accuracy: result.accuracy,
      mistakes_count: result.mistakeCount,
      completed,
    })
    .select("id")
    .single();

  if (attemptError || !attempt) {
    return NextResponse.json(
      { error: attemptError?.message || "Không thể lưu lượt học." },
      { status: 500 },
    );
  }

  if (result.mistakes.length > 0) {
    const { error: mistakesError } = await supabase.from("mistakes").insert(
      result.mistakes.map((mistake) => ({
        attempt_id: attempt.id,
        user_id: user.id,
        question_id: mistake.questionId,
        user_answer: mistake.userAnswer,
        correct_answer: mistake.correctAnswer,
        explanation: mistake.explanation,
      })),
    );

    if (mistakesError) {
      return NextResponse.json(
        { error: mistakesError.message },
        { status: 500 },
      );
    }
  }

  const { data: profile, error: profileReadError } = await supabase
    .from("profiles")
    .select("total_xp")
    .eq("id", user.id)
    .maybeSingle();

  if (profileReadError) {
    return NextResponse.json(
      { error: profileReadError.message },
      { status: 500 },
    );
  }

  const nextTotalXp = (profile?.total_xp || 0) + result.xpEarned;
  const { error: profileWriteError } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: user.email?.split("@")[0] || "Learner",
    total_xp: nextTotalXp,
  });

  if (profileWriteError) {
    return NextResponse.json(
      { error: profileWriteError.message },
      { status: 500 },
    );
  }

  const { data: existingProgress, error: progressReadError } = await supabase
    .from("user_progress")
    .select("id,total_xp_earned,best_accuracy")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (progressReadError) {
    return NextResponse.json(
      { error: progressReadError.message },
      { status: 500 },
    );
  }

  const progressPayload = {
    user_id: user.id,
    lesson_id: lessonId,
    status: completed ? "completed" : "in_progress",
    best_accuracy: Math.max(existingProgress?.best_accuracy || 0, result.accuracy),
    total_xp_earned:
      (existingProgress?.total_xp_earned || 0) + result.xpEarned,
    completed_at: completed ? new Date().toISOString() : null,
  } as const;

  const progressWrite = existingProgress
    ? await supabase
        .from("user_progress")
        .update(progressPayload)
        .eq("id", existingProgress.id)
    : await supabase.from("user_progress").insert(progressPayload);

  if (progressWrite.error) {
    return NextResponse.json(
      { error: progressWrite.error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    mode: "supabase",
    saved: true,
  });
}
