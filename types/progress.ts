export type LessonStatus = "completed" | "active" | "unlocked" | "locked";

export type Lesson = {
  id: string;
  title: string;
  description: string;
  xp: number;
  status: LessonStatus;
};

export type Unit = {
  id: string;
  title: string;
  description: string;
  accent: "coral" | "teal" | "yellow" | "ink";
  lessons: Lesson[];
};

export type UserProgress = {
  user: {
    name: string;
    level: string;
  };
  dailyXp: {
    current: number;
    target: number;
  };
  streakDays: number;
  units: Unit[];
};
