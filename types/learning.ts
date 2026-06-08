export type NavItem = {
  label: string;
  href: string;
  isActive?: boolean;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  skill: "listening" | "vocabulary" | "speaking" | "grammar";
  minutes: number;
  progress: number;
  status: "ready" | "locked" | "complete";
};

export type Stat = {
  label: string;
  value: string;
  helper: string;
};

export type DailyGoal = {
  completed: number;
  target: number;
  label: string;
};

export type Feature = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: "coral" | "teal" | "yellow" | "ink";
};

export type LessonStep = {
  id: string;
  title: string;
  description: string;
  status: "done" | "active" | "locked";
};
