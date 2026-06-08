import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Đăng ký | Định English",
};

type SignupPageProps = {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { redirectTo } = await searchParams;

  return <AuthForm mode="signup" redirectTo={redirectTo || "/learn"} />;
}
