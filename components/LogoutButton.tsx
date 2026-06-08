"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/supabase/auth";

export function LogoutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    setIsSigningOut(true);
    await signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      className="rounded-xl px-4 py-2 text-[#47626c] transition hover:bg-[#edf7f6] disabled:opacity-60"
      disabled={isSigningOut}
      onClick={handleLogout}
      type="button"
    >
      {isSigningOut ? "Đang thoát..." : "Đăng xuất"}
    </button>
  );
}
