import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "./client";

export async function ensureUserProfile(user: User) {
  const supabase = getSupabaseBrowserClient();
  const displayName =
    typeof user.user_metadata.display_name === "string"
      ? user.user_metadata.display_name
      : user.email?.split("@")[0] || "Learner";

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        display_name: displayName,
      },
      {
        onConflict: "id",
        ignoreDuplicates: false,
      },
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

