import { mockProgress } from "@/data/mockProgress";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { LessonStatus, UserProgress } from "@/types/progress";

type UserProgressLoadResult = {
  progress: UserProgress;
  isMockMode: boolean;
  error?: string;
};

const completedStatus: LessonStatus = "completed";

function getTodayIsoStart() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
}

function mergeLessonStatuses(
  progress: UserProgress,
  completedLessonIds: Set<string>,
) {
  return {
    ...progress,
    units: progress.units.map((unit) => ({
      ...unit,
      lessons: unit.lessons.map((lesson) => ({
        ...lesson,
        status: completedLessonIds.has(lesson.id)
          ? completedStatus
          : lesson.status,
      })),
    })),
  };
}

export async function loadUserProgress(): Promise<UserProgressLoadResult> {
  if (!isSupabaseConfigured()) {
    return {
      progress: mockProgress,
      isMockMode: true,
    };
  }

  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        progress: mockProgress,
        isMockMode: true,
        error: userError?.message || "Bạn cần đăng nhập để tải tiến độ.",
      };
    }

    const [profileResult, streakResult, progressResult, attemptsResult] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("streaks").select("*").eq("user_id", user.id).maybeSingle(),
        supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "completed"),
        supabase
          .from("lesson_attempts")
          .select("xp_earned")
          .eq("user_id", user.id)
          .gte("created_at", getTodayIsoStart()),
      ]);

    const queryError =
      profileResult.error ||
      streakResult.error ||
      progressResult.error ||
      attemptsResult.error;

    if (queryError) {
      return {
        progress: mockProgress,
        isMockMode: true,
        error: queryError.message,
      };
    }

    const completedLessonIds = new Set(
      (progressResult.data || [])
        .map((row) => row.lesson_id)
        .filter((lessonId): lessonId is string => Boolean(lessonId)),
    );
    const dailyXp = (attemptsResult.data || []).reduce(
      (total, attempt) => total + attempt.xp_earned,
      0,
    );
    const profile = profileResult.data;
    const streak = streakResult.data;
    const mergedProgress = mergeLessonStatuses(mockProgress, completedLessonIds);

    return {
      progress: {
        ...mergedProgress,
        user: {
          name:
            profile?.display_name ||
            user.email?.split("@")[0] ||
            mergedProgress.user.name,
          level: profile?.level || mergedProgress.user.level,
        },
        dailyXp: {
          ...mergedProgress.dailyXp,
          current: dailyXp,
        },
        streakDays: streak?.current_streak ?? mergedProgress.streakDays,
      },
      isMockMode: false,
    };
  } catch (error) {
    return {
      progress: mockProgress,
      isMockMode: true,
      error:
        error instanceof Error
          ? error.message
          : "Không thể tải tiến độ từ Supabase.",
    };
  }
}
