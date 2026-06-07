import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  AssistantGenerationResult,
  AssistantResponseInsertResult,
  AssistantResponseVariantRow,
  ConversationMessage,
  PersistedChatMessage,
  TurnActiveVariantRow,
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

export async function saveInitialAssistantResponse(
  supabase: SupabaseClient,
  turnId: string,
  result: AssistantGenerationResult,
) {
  const { data, error } = await supabase.rpc(
    "save_initial_assistant_response",
    {
      p_api_model_id: result.apiModelId,
      p_content_raw: result.contentRaw,
      p_input_tokens: result.inputTokens,
      p_latency_ms: result.latencyMs,
      p_output_tokens: result.outputTokens,
      p_selected_model_snapshot: result.selectedSnapshot,
      p_settings_snapshot: result.settingsSnapshot,
      p_turn_id: turnId,
    },
  );

  if (error || typeof data !== "string") {
    throw new MessagePersistenceError(
      "unknown",
      "メッセージは保存されましたが、応答生成に失敗しました。",
    );
  }

  return {
    assistant_response_variant_id: data,
  } satisfies AssistantResponseInsertResult;
}

export async function listVisibleChatMessages(
  supabase: SupabaseClient,
  chatId: string,
) {
  const [
    { data: turns, error: turnsError },
    { data: messages, error: messagesError },
    { data: activeVariants, error: activeVariantsError },
    { data: assistantVariants, error: assistantVariantsError },
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
    supabase
      .from("turn_active_variants")
      .select("turn_id,assistant_response_variant_id")
      .eq("chat_id", chatId),
    supabase
      .from("assistant_response_variants")
      .select(
        "id,turn_id,variant_index,content_raw,api_model_id,input_tokens,output_tokens,estimated_cost,latency_ms,created_at",
      )
      .eq("chat_id", chatId)
      .eq("status", "completed")
      .is("deleted_at", null),
  ]);

  if (
    turnsError ||
    messagesError ||
    activeVariantsError ||
    assistantVariantsError
  ) {
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
  const activeVariantIdsByTurnId = new Map(
    (
      (activeVariants ?? []) as Pick<
        TurnActiveVariantRow,
        "turn_id" | "assistant_response_variant_id"
      >[]
    ).map((activeVariant) => [
      activeVariant.turn_id,
      activeVariant.assistant_response_variant_id,
    ]),
  );
  const assistantVariantsById = new Map(
    (
      (assistantVariants ?? []) as Pick<
        AssistantResponseVariantRow,
        | "id"
        | "turn_id"
        | "variant_index"
        | "content_raw"
        | "api_model_id"
        | "input_tokens"
        | "output_tokens"
        | "estimated_cost"
        | "latency_ms"
        | "created_at"
      >[]
    ).map((variant) => [variant.id, variant]),
  );
  const assistantVariantsByTurnId = new Map<
    string,
    { id: string; variantIndex: number }[]
  >();

  for (const variant of assistantVariantsById.values()) {
    const variants = assistantVariantsByTurnId.get(variant.turn_id) ?? [];

    variants.push({ id: variant.id, variantIndex: variant.variant_index });
    assistantVariantsByTurnId.set(variant.turn_id, variants);
  }

  for (const variants of assistantVariantsByTurnId.values()) {
    variants.sort((a, b) => a.variantIndex - b.variantIndex);
  }

  const latestTurnIndex = Math.max(
    -1,
    ...(turns ?? []).map((turn) => turn.turn_index),
  );

  return (turns ?? []).flatMap((turn) => {
    const message = messagesByTurnId.get(turn.id);

    if (!message) {
      return [];
    }

    const result: PersistedChatMessage[] = [
      {
        id: message.id,
        role: "user",
        turnId: turn.id,
        turnIndex: turn.turn_index,
        contentRaw: message.content_raw,
        createdAt: message.created_at,
      },
    ];

    const activeVariantId = activeVariantIdsByTurnId.get(turn.id);
    const activeVariant = activeVariantId
      ? assistantVariantsById.get(activeVariantId)
      : null;

    if (activeVariant?.api_model_id) {
      result.push({
        id: activeVariant.id,
        role: "assistant",
        turnId: turn.id,
        turnIndex: turn.turn_index,
        contentRaw: activeVariant.content_raw,
        createdAt: activeVariant.created_at,
        apiModelId: activeVariant.api_model_id,
        inputTokens: activeVariant.input_tokens,
        outputTokens: activeVariant.output_tokens,
        estimatedCost: activeVariant.estimated_cost,
        latencyMs: activeVariant.latency_ms,
        isLatestTurn: turn.turn_index === latestTurnIndex,
        variantIndex: activeVariant.variant_index,
        variants: assistantVariantsByTurnId.get(turn.id) ?? [],
      });
    }

    return result;
  });
}

export async function listConversationMessages(
  supabase: SupabaseClient,
  chatId: string,
) {
  const messages = await listVisibleChatMessages(supabase, chatId);

  return messages.map(
    (message) =>
      ({
        role: message.role,
        contentRaw: message.contentRaw,
      }) satisfies ConversationMessage,
  );
}
