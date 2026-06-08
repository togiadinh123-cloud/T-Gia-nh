import { Suspense } from "react";
import { PracticeHub } from "@/components/practice/PracticeHub";
import { mockSentencePatterns } from "@/data/mockSentencePatterns";
import { mockVocabulary } from "@/data/mockVocabulary";

export const metadata = {
  title: "Phòng luyện tập | Định English",
  description: "Luyện từ vựng, đoán hình, nối từ, nghe và mẫu câu B1.",
};

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-[#5c747b]">Đang tải...</div>}>
      <PracticeHub
        items={mockVocabulary}
        patterns={mockSentencePatterns}
      />
    </Suspense>
  );
}
