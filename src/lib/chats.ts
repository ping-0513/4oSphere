import type { SupabaseClient } from "@supabase/supabase-js";

import type { ChatListItem, CurrentChat } from "@/types/chat";

const CHAT_SELECT_COLUMNS =
  "id,title,created_at,updated_at,archived_at,deleted_at";

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function listVisibleChats(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("chats")
    .select(CHAT_SELECT_COLUMNS)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new Error("Failed to load chats.");
  }

  return (data ?? []) as ChatListItem[];
}

export async function getVisibleChatById(
  supabase: SupabaseClient,
  chatId: string,
) {
  if (!isUuid(chatId)) {
    return null;
  }

  const { data, error } = await supabase
    .from("chats")
    .select(CHAT_SELECT_COLUMNS)
    .eq("id", chatId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to load chat.");
  }

  return data as CurrentChat | null;
}
