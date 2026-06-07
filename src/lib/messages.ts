import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  PersistedUserMessage,
  UserMessageInsertResult,
  UserMessageRow,
} from "@/types/chat";

type MessageQueryError = {
  code?: string | null;
  message?: string | null;
};

export class MessagePersistenceError extends Error {
  code: "blank" | "too_long" | "unavailable" | "unknown";

  constructor(code: MessagePersistenceError["code"], message: string) {
    super(message);
    this.code = code;
  }
}

function normalizeMessageError(error: MessageQueryError) {
  if (error.message?.includes("message_blank")) {
    return new MessagePersistenceError(
      "blank",
      "メッセージを入力してください。",
    );
  }

  if (error.message?.includes("message_too_long") || error.code === "22001") {
    return new MessagePersistenceError("too_long", "メッセージが長すぎます。");
  }

  if (
    error.message?.includes("chat_not_available") ||
    error.message?.includes("not_authenticated") ||
    error.code === "42501" ||
    error.code === "P0002"
  ) {
    return new MessagePersistenceError(
      "unavailable",
      "このチャットにメッセージを保存できません。",
    );
  }

  return new MessagePersistenceError(
    "unknown",
    "メッセージを保存できませんでした。",
  );
}

export async function createUserMessageTurn(
  supabase: SupabaseClient,
  chatId: string,
  contentRaw: string,
) {
  const { data, error } = await supabase.rpc("create_user_message_turn", {
    p_chat_id: chatId,
    p_content_raw: contentRaw,
  });

  if (error) {
    throw normalizeMessageError(error);
  }

  const result = data?.[0] as UserMessageInsertResult | undefined;

  if (!result) {
    throw new MessagePersistenceError(
      "unknown",
      "メッセージを保存できませんでした。",
    );
  }

  return result;
}

export async function listVisibleUserMessages(
  supabase: SupabaseClient,
  chatId: string,
) {
  const [
    { data: turns, error: turnsError },
    { data: messages, error: messagesError },
  ] = await Promise.all([
    supabase
      .from("message_turns")
      .select("id,turn_index,created_at")
      .eq("chat_id", chatId)
      .is("deleted_at", null)
      .order("turn_index", { ascending: true }),
    supabase
      .from("user_messages")
      .select("id,turn_id,content_raw,created_at")
      .eq("chat_id", chatId)
      .is("deleted_at", null),
  ]);

  if (turnsError || messagesError) {
    throw new Error("Failed to load messages.");
  }

  const messagesByTurnId = new Map(
    (
      (messages ?? []) as Pick<
        UserMessageRow,
        "id" | "turn_id" | "content_raw" | "created_at"
      >[]
    ).map((message) => [message.turn_id, message]),
  );

  return (turns ?? []).flatMap((turn) => {
    const message = messagesByTurnId.get(turn.id);

    if (!message) {
      return [];
    }

    return [
      {
        id: message.id,
        turnId: turn.id,
        turnIndex: turn.turn_index,
        contentRaw: message.content_raw,
        createdAt: message.created_at,
      } satisfies PersistedUserMessage,
    ];
  });
}
