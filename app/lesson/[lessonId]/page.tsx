import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/LessonPlayer";
import { getMockLesson, mockLessons } from "@/data/mockLessons";

type LessonPageProps = {
  params: Promise<{
    lessonId: string;
  }>;
};

export function generateStaticParams() {
  return mockLessons.map((lesson) => ({
    lessonId: lesson.id,
  }));
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const lesson = getMockLesson(lessonId);

  if (!lesson) {
    notFound();
  }

  return <LessonPlayer lesson={lesson} />;
}

