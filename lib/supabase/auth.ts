import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "./client";

export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentSession() {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabaseBrowserClient();

  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string,
) {
  const supabase = getSupabaseBrowserClient();

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });
}

export async function signOut() {
  const supabase = getSupabaseBrowserClient();

  return supabase.auth.signOut();
}
