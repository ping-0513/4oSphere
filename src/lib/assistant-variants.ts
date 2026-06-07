import type { SupabaseClient } from "@supabase/supabase-js";

import { listVisibleChatMessages } from "@/lib/messages";
import type {
  AssistantGenerationResult,
  ConversationMessage,
  RegeneratedAssistantResponseInsertResult,
} from "@/types/chat";

export class AssistantVariantError extends Error {
  constructor() {
    super("この回答は現在操作できません。");
  }
}

export async function getLatestTurnRegenerationContext(
  supabase: SupabaseClient,
  turnId: string,
  userId: string,
) {
  const { data: targetTurn, error: targetTurnError } = await supabase
    .from("message_turns")
    .select("id,chat_id,turn_index")
    .eq("id", turnId)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .maybeSingle();

  if (targetTurnError || !targetTurn) {
    throw new AssistantVariantError();
  }

  const [{ data: chat }, { data: latestTurn, error: latestTurnError }] =
    await Promise.all([
      supabase
        .from("chats")
        .select("id")
        .eq("id", targetTurn.chat_id)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .maybeSingle(),
      supabase
        .from("message_turns")
        .select("id,turn_index")
        .eq("chat_id", targetTurn.chat_id)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .order("turn_index", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  if (
    !chat ||
    latestTurnError ||
    !latestTurn ||
    latestTurn.id !== targetTurn.id
  ) {
    throw new AssistantVariantError();
  }

  const messages = await listVisibleChatMessages(supabase, targetTurn.chat_id);
  const targetUserMessage = messages.find(
    (message) => message.turnId === turnId && message.role === "user",
  );
  const targetAssistantMessage = messages.find(
    (message) => message.turnId === turnId && message.role === "assistant",
  );

  if (!targetUserMessage || !targetAssistantMessage) {
    throw new AssistantVariantError();
  }

  const conversation = messages
    .filter(
      (message) =>
        message.turnIndex < targetTurn.turn_index ||
        (message.turnId === turnId && message.role === "user"),
    )
    .map(
      (message) =>
        ({
          role: message.role,
          contentRaw: message.contentRaw,
        }) satisfies ConversationMessage,
    );

  return {
    chatId: targetTurn.chat_id,
    conversation,
  };
}

export async function saveRegeneratedAssistantResponse(
  supabase: SupabaseClient,
  turnId: string,
  result: AssistantGenerationResult,
) {
  const { data, error } = await supabase.rpc(
    "save_regenerated_assistant_response",
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
  const saved = data?.[0] as
    | RegeneratedAssistantResponseInsertResult
    | undefined;

  if (error || !saved) {
    throw new AssistantVariantError();
  }

  return saved;
}

export async function setActiveAssistantResponseVariant(
  supabase: SupabaseClient,
  turnId: string,
  assistantResponseVariantId: string,
) {
  const { data, error } = await supabase.rpc(
    "set_active_assistant_response_variant",
    {
      p_assistant_response_variant_id: assistantResponseVariantId,
      p_turn_id: turnId,
    },
  );

  if (error || typeof data !== "string") {
    throw new AssistantVariantError();
  }

  return data;
}
