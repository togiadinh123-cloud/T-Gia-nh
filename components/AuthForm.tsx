"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmail, signUpWithEmail } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ensureUserProfile } from "@/lib/supabase/profiles";
import { Button } from "./Button";
import { Card } from "./Card";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
  redirectTo?: string;
};

const copy = {
  login: {
    title: "Đăng nhập",
    description: "Tiếp tục lộ trình học tiếng Anh của bạn.",
    action: "Đăng nhập",
    switchText: "Chưa có tài khoản?",
    switchAction: "Tạo tài khoản",
    switchHref: "/signup",
  },
  signup: {
    title: "Tạo tài khoản",
    description: "Bắt đầu học tiếng Anh với Định English.",
    action: "Đăng ký",
    switchText: "Đã có tài khoản?",
    switchAction: "Đăng nhập",
    switchHref: "/login",
  },
};

export function AuthForm({ mode, redirectTo = "/learn" }: AuthFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const activeCopy = copy[mode];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!isSupabaseConfigured()) {
      setError("Tính năng đăng nhập đang được chuẩn bị. Bạn vẫn có thể học thử ở trang Học ngay.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response =
        mode === "login"
          ? await signInWithEmail(email, password)
          : await signUpWithEmail(email, password, displayName);

      if (response.error) {
        setError(response.error.message);
        return;
      }

      const user = response.data.user;

      if (user) {
        await ensureUserProfile(user);
      }

      if (mode === "signup" && !response.data.session) {
        setMessage("Tài khoản đã được tạo. Hãy kiểm tra email để xác nhận.");
        return;
      }

      router.replace(redirectTo);
      router.refresh();
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : "Có lỗi xảy ra khi xác thực.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-center">
        <Link className="mb-6 flex items-center gap-3" href="/">
          <span className="grid size-11 place-items-center rounded-2xl bg-[#12333f] text-lg font-black text-[#ffd166]">
            Đ
          </span>
          <span className="text-xl font-black text-[#12333f]">Định English</span>
        </Link>

        <Card className="p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-[#0e9f91]">
            {activeCopy.title}
          </p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-[#12333f]">
            {activeCopy.description}
          </h1>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" ? (
              <label className="block">
                <span className="text-sm font-bold text-[#5c747b]">
                  Tên hiển thị
                </span>
                <input
                  className="mt-2 w-full rounded-2xl border border-[#dcebea] bg-white px-4 py-3 text-base font-bold text-[#12333f] outline-none transition focus:border-[#0e9f91] focus:ring-4 focus:ring-[#d8f2ef]"
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Định"
                  type="text"
                  value={displayName}
                />
              </label>
            ) : null}

            <label className="block">
              <span className="text-sm font-bold text-[#5c747b]">Email</span>
              <input
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-[#dcebea] bg-white px-4 py-3 text-base font-bold text-[#12333f] outline-none transition focus:border-[#0e9f91] focus:ring-4 focus:ring-[#d8f2ef]"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-[#5c747b]">Mật khẩu</span>
              <input
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="mt-2 w-full rounded-2xl border border-[#dcebea] bg-white px-4 py-3 text-base font-bold text-[#12333f] outline-none transition focus:border-[#0e9f91] focus:ring-4 focus:ring-[#d8f2ef]"
                minLength={6}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                required
                type="password"
                value={password}
              />
            </label>

            {error ? (
              <p className="rounded-2xl bg-[#ffe1dc] p-3 text-sm font-bold text-[#9a3b32]">
                {error}
              </p>
            ) : null}

            {message ? (
              <p className="rounded-2xl bg-[#d8f2ef] p-3 text-sm font-bold text-[#0b6f66]">
                {message}
              </p>
            ) : null}

            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Đang xử lý..." : activeCopy.action}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm font-semibold text-[#5c747b]">
            {activeCopy.switchText}{" "}
            <Link
              className="font-black text-[#ff6f61] hover:text-[#f45f54]"
              href={activeCopy.switchHref}
            >
              {activeCopy.switchAction}
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
