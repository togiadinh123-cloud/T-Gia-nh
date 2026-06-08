import type { Lesson, UserProgress } from "@/types/progress";

function lesson(
  id: string,
  title: string,
  description: string,
  xp: number,
  status: Lesson["status"],
): Lesson {
  return {
    id,
    title,
    description,
    xp,
    status,
  };
}

export const mockProgress: UserProgress = {
  user: {
    name: "Định",
    level: "B1",
  },
  dailyXp: {
    current: 220,
    target: 300,
  },
  streakDays: 9,
  units: [
    {
      id: "unit-1",
      title: "Quan điểm và lập luận B1",
      description: "Nêu ý kiến, đưa bằng chứng, đồng ý và không đồng ý lịch sự.",
      accent: "teal",
      lessons: [
        lesson("express-opinions", "Nêu ý kiến rõ ràng", "Dùng opinion và reason.", 45, "active"),
        lesson("support-arguments", "Bảo vệ lập luận", "Thêm evidence vào câu trả lời.", 45, "unlocked"),
        lesson("agree-politely", "Đồng ý lịch sự", "Đồng ý một phần và giải thích.", 45, "unlocked"),
        lesson("disagree-respectfully", "Không đồng ý tôn trọng", "Nói khác ý mà vẫn lịch sự.", 45, "unlocked"),
        lesson("summarize-ideas", "Tóm tắt ý chính", "Chốt ý ngắn gọn, rõ ràng.", 45, "unlocked"),
      ],
    },
    {
      id: "unit-2",
      title: "Công việc và giao tiếp",
      description: "Meeting, feedback, deadline, remote work và career.",
      accent: "coral",
      lessons: [
        lesson("work-priorities", "Ưu tiên công việc", "Nói priority và deadline.", 50, "unlocked"),
        lesson("meeting-updates", "Cập nhật trong cuộc họp", "Nói progress trong meeting.", 50, "unlocked"),
        lesson("give-feedback", "Đưa phản hồi", "Feedback cụ thể và hữu ích.", 50, "unlocked"),
        lesson("remote-work", "Làm việc từ xa", "Nói ưu và nhược điểm.", 50, "unlocked"),
        lesson("career-growth", "Phát triển sự nghiệp", "Career và opportunity.", 50, "unlocked"),
      ],
    },
    {
      id: "unit-3",
      title: "Kỹ năng chuyên nghiệp",
      description: "Interview, teamwork, conflict, budget và schedule.",
      accent: "yellow",
      lessons: [
        lesson("job-interviews", "Phỏng vấn việc làm", "Trả lời interview tự tin.", 50, "unlocked"),
        lesson("teamwork-skills", "Kỹ năng làm việc nhóm", "Teamwork và communication.", 50, "unlocked"),
        lesson("handle-conflict", "Xử lý mâu thuẫn", "Compromise và stress.", 50, "unlocked"),
        lesson("project-budget", "Ngân sách dự án", "Budget và realistic plan.", 50, "unlocked"),
        lesson("time-management", "Quản lý thời gian", "Schedule và productivity.", 50, "unlocked"),
      ],
    },
    {
      id: "unit-4",
      title: "Phát triển cá nhân",
      description: "Habit, goal, confidence, progress và study strategy.",
      accent: "ink",
      lessons: [
        lesson("healthy-habits", "Thói quen lành mạnh", "Habit và concentration.", 48, "unlocked"),
        lesson("personal-goals", "Mục tiêu cá nhân", "Goal và meetings.", 48, "unlocked"),
        lesson("build-confidence", "Xây dựng tự tin", "Confidence khi speaking.", 48, "unlocked"),
        lesson("learning-progress", "Theo dõi tiến bộ", "Progress và mistake review.", 48, "unlocked"),
        lesson("study-strategies", "Chiến lược học tập", "Research cách học hiệu quả.", 48, "unlocked"),
      ],
    },
    {
      id: "unit-5",
      title: "Xã hội và giáo dục",
      description: "Education, community, healthcare và public transport.",
      accent: "teal",
      lessons: [
        lesson("education-access", "Tiếp cận giáo dục", "Education và opportunity.", 52, "unlocked"),
        lesson("community-support", "Hỗ trợ cộng đồng", "Volunteer và community.", 52, "unlocked"),
        lesson("healthcare-access", "Chăm sóc sức khỏe", "Healthcare cho gia đình.", 52, "unlocked"),
        lesson("public-transport", "Giao thông công cộng", "Transport và pollution.", 52, "unlocked"),
        lesson("environmental-action", "Hành động vì môi trường", "Environment và responsibility.", 52, "unlocked"),
      ],
    },
    {
      id: "unit-6",
      title: "Môi trường và thành phố",
      description: "Renewable energy, apartment, city life và travel planning.",
      accent: "coral",
      lessons: [
        lesson("renewable-energy", "Năng lượng tái tạo", "Renewable energy và pollution.", 52, "unlocked"),
        lesson("city-apartment", "Sống ở thành phố", "Apartment và convenience.", 52, "unlocked"),
        lesson("compare-living-places", "So sánh nơi sống", "City vs countryside.", 52, "unlocked"),
        lesson("travel-planning", "Lập kế hoạch du lịch", "Schedule và budget.", 52, "unlocked"),
        lesson("customer-service", "Dịch vụ khách hàng", "Problem và solution lịch sự.", 52, "unlocked"),
      ],
    },
    {
      id: "unit-7",
      title: "Viết và phản hồi B1",
      description: "Formal email, decision, result và explaining change.",
      accent: "yellow",
      lessons: [
        lesson("formal-email", "Email trang trọng", "Confirm schedule politely.", 55, "unlocked"),
        lesson("make-decisions", "Ra quyết định", "Compare advantages.", 55, "unlocked"),
        lesson("discuss-results", "Thảo luận kết quả", "Results và steady progress.", 55, "unlocked"),
        lesson("explain-change", "Giải thích thay đổi", "Why a situation improved.", 55, "unlocked"),
        lesson("future-goals", "Mục tiêu tương lai", "Career plans.", 55, "unlocked"),
      ],
    },
    {
      id: "unit-8",
      title: "Tổng hợp phản xạ B1",
      description: "Balanced view, problem-solution, reflection, negotiation và growth.",
      accent: "ink",
      lessons: [
        lesson("balanced-view", "Quan điểm cân bằng", "Although và contrast.", 60, "unlocked"),
        lesson("problem-solution", "Vấn đề và giải pháp", "Problem, reason, solution.", 60, "unlocked"),
        lesson("reflect-learning", "Tự đánh giá việc học", "Feedback và progress.", 60, "unlocked"),
        lesson("negotiate-plan", "Đàm phán kế hoạch", "Negotiation và agreement.", 60, "unlocked"),
        lesson("professional-growth", "Phát triển chuyên nghiệp", "Responsibility và career.", 60, "unlocked"),
      ],
    },
  ],
};
