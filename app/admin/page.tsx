import type { Metadata } from "next";
import { AdminLessonEditor } from "@/components/AdminLessonEditor";

export const metadata: Metadata = {
  title: "Quản trị bài học | Định English",
  description: "Trình biên tập bài học nội bộ cho Định English.",
};

export default function AdminPage() {
  return <AdminLessonEditor />;
}
