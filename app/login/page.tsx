import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Đăng nhập | Định English",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-[#5c747b]">Đang tải...</div>}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
