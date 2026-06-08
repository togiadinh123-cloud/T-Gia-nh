import { PracticeHub, type PracticeMode } from "@/components/practice/PracticeHub";
import { mockSentencePatterns } from "@/data/mockSentencePatterns";
import { mockVocabulary } from "@/data/mockVocabulary";

export const metadata = {
  title: "Phòng luyện tập | Định English",
  description: "Luyện từ vựng, đoán hình, nối từ, nghe và mẫu câu B1.",
};

const validModes: PracticeMode[] = [
  "vocab",
  "image",
  "match",
  "listening",
  "patterns",
];

type PracticePageProps = {
  searchParams?: Promise<{
    mode?: string;
  }>;
};

export default async function PracticePage({ searchParams }: PracticePageProps) {
  const mode = (await searchParams)?.mode;
  const initialMode = validModes.includes(mode as PracticeMode)
    ? (mode as PracticeMode)
    : "vocab";

  return (
    <PracticeHub
      initialMode={initialMode}
      items={mockVocabulary}
      patterns={mockSentencePatterns}
    />
  );
}
