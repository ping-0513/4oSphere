import type { SupabaseClient, User } from "@supabase/supabase-js";

function readStringMetadata(
  metadata: User["user_metadata"] | undefined,
  keys: string[],
) {
  for (const key of keys) {
    const value = metadata?.[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

export async function upsertProfileForUser(
  supabase: SupabaseClient,
  user: User,
) {
  const displayName = readStringMetadata(user.user_metadata, [
    "full_name",
    "name",
  ]);
  const avatarUrl = readStringMetadata(user.user_metadata, [
    "avatar_url",
    "picture",
  ]);

  return supabase.from("profiles").upsert(
    {
      id: user.id,
      display_name: displayName,
      avatar_url: avatarUrl,
    },
    { onConflict: "id" },
  );
}
