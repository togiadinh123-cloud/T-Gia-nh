export type Question = {
  id: string;
  prompt: string;
  explanation: string;
};

export type MultipleChoiceQuestion = Question & {
  type: "multiple-choice";
  options: {
    id: string;
    label: string;
  }[];
  correctOptionId: string;
};

export type FillBlankQuestion = Question & {
  type: "fill_blank";
  sentenceParts: {
    before: string;
    after: string;
  };
  correctAnswer: string;
};

export type SentenceOrderQuestion = Question & {
  type: "sentence_order";
  shuffledWords: {
    id: string;
    label: string;
  }[];
  correctSentence: string;
};

type ListeningBaseQuestion = Question & {
  type: "listening";
  audioText: string;
};

export type ListeningMultipleChoiceQuestion = ListeningBaseQuestion & {
  answerMode: "multiple_choice";
  options: {
    id: string;
    label: string;
  }[];
  correctOptionId: string;
};

export type ListeningTextQuestion = ListeningBaseQuestion & {
  answerMode: "text";
  correctAnswer: string;
};

export type ListeningQuestion =
  | ListeningMultipleChoiceQuestion
  | ListeningTextQuestion;

export type LessonQuestion =
  | MultipleChoiceQuestion
  | FillBlankQuestion
  | SentenceOrderQuestion
  | ListeningQuestion;

export type LessonSessionResult = {
  lessonId: string;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  mistakeCount: number;
  mistakes: MistakeReviewItem[];
  accuracy: number;
  xpEarned: number;
};

export type MistakeReviewItem = {
  questionId: string;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
};

export type LessonSession = {
  id: string;
  title: string;
  description: string;
  xpPerQuestion: number;
  questions: LessonQuestion[];
};
