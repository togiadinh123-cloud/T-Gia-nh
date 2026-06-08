import type {
  LessonQuestion,
  LessonSession,
  LessonSessionResult,
} from "@/types/lesson";

export type AnswerMap = Record<string, string>;

export function normalizeAnswer(answer: string) {
  return answer.trim().toLowerCase();
}

export function normalizeSentence(sentence: string) {
  return normalizeAnswer(sentence).replace(/\s+/g, " ");
}

export function isCorrectAnswer(question: LessonQuestion, answer: string) {
  if (question.type === "multiple-choice") {
    return question.correctOptionId === answer;
  }

  if (question.type === "listening") {
    if (question.answerMode === "multiple_choice") {
      return question.correctOptionId === answer;
    }

    return normalizeAnswer(question.correctAnswer) === normalizeAnswer(answer);
  }

  if (question.type === "sentence_order") {
    return normalizeSentence(question.correctSentence) === normalizeSentence(answer);
  }

  return normalizeAnswer(question.correctAnswer) === normalizeAnswer(answer);
}

export function getReadableAnswer(question: LessonQuestion, answer: string) {
  if (question.type === "multiple-choice") {
    return (
      question.options.find((option) => option.id === answer)?.label || answer
    );
  }

  if (question.type === "listening" && question.answerMode === "multiple_choice") {
    return (
      question.options.find((option) => option.id === answer)?.label || answer
    );
  }

  return answer;
}

export function getCorrectAnswer(question: LessonQuestion) {
  if (question.type === "multiple-choice") {
    return (
      question.options.find((option) => option.id === question.correctOptionId)
        ?.label || ""
    );
  }

  if (question.type === "listening") {
    if (question.answerMode === "multiple_choice") {
      return (
        question.options.find((option) => option.id === question.correctOptionId)
          ?.label || ""
      );
    }

    return question.correctAnswer;
  }

  if (question.type === "sentence_order") {
    return question.correctSentence;
  }

  return question.correctAnswer;
}

export function getStreakMessage(streakDays: number, didFail: boolean) {
  if (didFail) {
    return `Chuỗi ${streakDays} ngày vẫn đang chờ bạn thử lại.`;
  }

  if (streakDays >= 7) {
    return `Tuyệt vời, bạn đang giữ chuỗi ${streakDays} ngày học liên tiếp.`;
  }

  return `Bạn đang có chuỗi ${streakDays} ngày. Học thêm một bài để giữ nhịp.`;
}

export function getLessonSessionResult(
  lesson: LessonSession,
  answers: AnswerMap,
): LessonSessionResult {
  const attemptedQuestions = lesson.questions.filter(
    (question) => answers[question.id],
  );
  const correctAnswers = attemptedQuestions.reduce((total, question) => {
    const answer = answers[question.id];
    return answer && isCorrectAnswer(question, answer) ? total + 1 : total;
  }, 0);
  const mistakes = attemptedQuestions
    .filter((question) => {
      const answer = answers[question.id];
      return answer && !isCorrectAnswer(question, answer);
    })
    .map((question) => {
      const answer = answers[question.id] || "";

      return {
        questionId: question.id,
        prompt: question.prompt,
        userAnswer: getReadableAnswer(question, answer),
        correctAnswer: getCorrectAnswer(question),
        explanation: question.explanation,
      };
    });
  const accuracy =
    attemptedQuestions.length === 0
      ? 0
      : Math.round((correctAnswers / attemptedQuestions.length) * 100);

  return {
    lessonId: lesson.id,
    totalQuestions: lesson.questions.length,
    attemptedQuestions: attemptedQuestions.length,
    correctAnswers,
    mistakeCount: mistakes.length,
    mistakes,
    accuracy,
    xpEarned: correctAnswers * lesson.xpPerQuestion,
  };
}
