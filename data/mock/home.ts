import type {
  DailyGoal,
  Feature,
  Lesson,
  LessonStep,
  NavItem,
  Stat,
} from "@/types/learning";

export const navItems: NavItem[] = [
  { label: "Tính năng", href: "#features" },
  { label: "Lộ trình", href: "#path" },
  { label: "Mục tiêu", href: "#goal" },
  { label: "Bắt đầu", href: "#start", isActive: true },
];

export const dailyGoal: DailyGoal = {
  completed: 3,
  target: 5,
  label: "Mục tiêu hôm nay",
};

export const stats: Stat[] = [
  {
    label: "Chuỗi ngày",
    value: "7",
    helper: "ngày liên tiếp",
  },
  {
    label: "XP",
    value: "420",
    helper: "tuần này",
  },
  {
    label: "Cấp độ",
    value: "B1",
    helper: "trung cấp tự tin",
  },
];

export const features: Feature[] = [
  {
    id: "speaking",
    title: "Luyện nói",
    description:
      "Tập trình bày ý kiến, giải thích lý do và phản hồi tự nhiên hơn.",
    icon: "S",
    color: "coral",
  },
  {
    id: "vocabulary",
    title: "Từ vựng B1",
    description:
      "Học từ theo chủ đề công việc, xã hội, môi trường và đời sống hiện đại.",
    icon: "V",
    color: "yellow",
  },
  {
    id: "grammar",
    title: "Mẫu câu B1",
    description:
      "Luyện because, although, should, used to và các cấu trúc diễn đạt quan điểm.",
    icon: "G",
    color: "teal",
  },
  {
    id: "listening",
    title: "Nghe hiểu",
    description:
      "Nghe câu tiếng Anh rõ nghĩa rồi chọn hoặc gõ lại câu trả lời phù hợp.",
    icon: "L",
    color: "ink",
  },
  {
    id: "streaks",
    title: "Chuỗi ngày",
    description:
      "Giữ nhịp học đều mà không bị áp lực, mỗi ngày một phiên ngắn.",
    icon: "7",
    color: "coral",
  },
  {
    id: "xp",
    title: "XP",
    description:
      "Theo dõi tiến bộ sau mỗi bài học, ôn lỗi sai và mở thêm chủ đề B1.",
    icon: "XP",
    color: "teal",
  },
];

export const lessonSteps: LessonStep[] = [
  {
    id: "express-opinions",
    title: "Nêu quan điểm",
    description: "Dùng opinion, evidence và reason để nói rõ ý của mình.",
    status: "done",
  },
  {
    id: "work-priorities",
    title: "Ưu tiên công việc",
    description: "Nói về priority, deadline và cách sắp xếp nhiệm vụ.",
    status: "active",
  },
  {
    id: "environmental-action",
    title: "Hành động vì môi trường",
    description: "Giải thích renewable energy, pollution và thói quen xanh.",
    status: "locked",
  },
];

export const lessons: Lesson[] = [
  {
    id: "listening-b1",
    title: "Nghe hiểu B1",
    description:
      "Bắt ý chính trong câu về công việc, học tập và cuộc sống hằng ngày.",
    skill: "listening",
    minutes: 8,
    progress: 72,
    status: "ready",
  },
  {
    id: "vocabulary-b1",
    title: "Từ vựng B1",
    description: "Ôn từ dùng trong thảo luận, lập kế hoạch và giải quyết vấn đề.",
    skill: "vocabulary",
    minutes: 10,
    progress: 44,
    status: "ready",
  },
  {
    id: "speaking-b1",
    title: "Luyện nói B1",
    description: "Trả lời câu hỏi bằng câu dài hơn, có lý do và ví dụ.",
    skill: "speaking",
    minutes: 6,
    progress: 18,
    status: "locked",
  },
];
