import type { SupabaseClient } from "@supabase/supabase-js";

import type { ChatListItem, CurrentChat } from "@/types/chat";

const CHAT_SELECT_COLUMNS =
  "id,title,created_at,updated_at,archived_at,deleted_at";

type SupabaseQueryError = {
  code?: string | null;
  details?: string | null;
  hint?: string | null;
  message?: string | null;
};

export class ChatManagementError extends Error {
  constructor() {
    super("このチャットを更新できませんでした。");
  }
}

function redactSensitiveErrorText(value: string | null | undefined) {
  return (value ?? "")
    .replace(/Bearer\s+\S+/gi, "Bearer [REDACTED]")
    .replace(
      /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
      "[REDACTED_JWT]",
    )
    .replace(
      /\b(api[_-]?key|authorization|cookie|oauth[_-]?code|refresh[_-]?token|session[_-]?token|secret)\b\s*[:=]\s*\S+/gi,
      "$1=[REDACTED]",
    );
}

function createChatQueryError(
  fallbackMessage: string,
  error: SupabaseQueryError,
) {
  if (process.env.NODE_ENV !== "development") {
    return new Error(fallbackMessage);
  }

  const details = [
    redactSensitiveErrorText(error.code) || "no_code",
    redactSensitiveErrorText(error.message),
    redactSensitiveErrorText(error.details),
    redactSensitiveErrorText(error.hint),
  ]
    .filter(Boolean)
    .join(" ");

  return new Error(`${fallbackMessage}: ${details}`);
}

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
    throw createChatQueryError("Failed to load chats", error);
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
    throw createChatQueryError("Failed to load chat", error);
  }

  return data as CurrentChat | null;
}

export async function renameVisibleChat(
  supabase: SupabaseClient,
  chatId: string,
  userId: string,
  title: string,
) {
  if (!isUuid(chatId)) {
    throw new ChatManagementError();
  }

  // The Phase 2A chats_set_updated_at trigger updates updated_at.
  const { data, error } = await supabase
    .from("chats")
    .update({ title })
    .eq("id", chatId)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    throw new ChatManagementError();
  }
}

export async function softDeleteVisibleChat(
  supabase: SupabaseClient,
  chatId: string,
  userId: string,
) {
  if (!isUuid(chatId)) {
    throw new ChatManagementError();
  }

  // The Phase 2A chats_set_updated_at trigger updates updated_at.
  const { data, error } = await supabase
    .from("chats")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", chatId)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    throw new ChatManagementError();
  }
}
