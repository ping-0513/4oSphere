"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

import { getVerifiedUserId } from "@/lib/auth";
import {
  isVisibleChatUsingInitialTitle,
  updateInitialChatTitle,
} from "@/lib/chats";
import type { SendUserMessageState } from "@/lib/message-action-state";
import { validateUserMessageContent } from "@/lib/message-validation";
import {
  createUserMessageTurn,
  listConversationMessages,
  MessagePersistenceError,
  saveInitialAssistantResponse,
} from "@/lib/messages";
import { hasOpenAiApiKey } from "@/lib/openai/client";
import { generateAssistantResponse } from "@/lib/openai/generate-assistant-response";
import { generateChatTitle } from "@/lib/openai/generate-chat-title";
import { getGpt4oApiModelId, isGpt4oSnapshotLabel } from "@/lib/openai/models";
import { parseResponseSettingsFormValue } from "@/lib/openai/response-settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const GENERATION_FAILED_MESSAGE =
  "メッセージは保存されましたが、応答生成に失敗しました。";

async function tryGenerateInitialChatTitle(
  supabase: SupabaseClient,
  chatId: string,
  userId: string,
  firstUserMessage: string,
  turnIndex: number,
) {
  try {
    if (
      turnIndex !== 0 ||
      !(await isVisibleChatUsingInitialTitle(supabase, chatId, userId))
    ) {
      return;
    }

    const title = await generateChatTitle(firstUserMessage);
    await updateInitialChatTitle(supabase, chatId, userId, title);
  } catch {
    // Title generation is best-effort and must not fail a saved conversation.
  }
}

export async function sendUserMessageAction(
  _previousState: SendUserMessageState,
  formData: FormData,
): Promise<SendUserMessageState> {
  const chatId = formData.get("chatId");
  const contentRaw = formData.get("contentRaw");
  const responseSettingsValue = formData.get("responseSettings");
  const selectedSnapshot = formData.get("selectedSnapshot");

  if (
    typeof chatId !== "string" ||
    typeof contentRaw !== "string" ||
    typeof selectedSnapshot !== "string"
  ) {
    return {
      error: "メッセージを保存できませんでした。",
      generationFailed: false,
      successId: null,
    };
  }

  const validationError = validateUserMessageContent(contentRaw);

  if (validationError) {
    return { error: validationError, generationFailed: false, successId: null };
  }

  if (!isGpt4oSnapshotLabel(selectedSnapshot)) {
    return {
      error: "選択されたモデルを使用できません。",
      generationFailed: false,
      successId: null,
    };
  }

  const responseSettingsResult = parseResponseSettingsFormValue(
    responseSettingsValue,
  );

  if (responseSettingsResult.error) {
    return {
      error: responseSettingsResult.error,
      generationFailed: false,
      successId: null,
    };
  }

  const responseSettings = responseSettingsResult.settings;

  if (!responseSettings) {
    return {
      error: "応答生成設定を読み取れませんでした。",
      generationFailed: false,
      successId: null,
    };
  }

  const supabase = await createSupabaseServerClient();
  const userId = await getVerifiedUserId(supabase);

  if (!userId) {
    return {
      error: "このチャットにメッセージを保存できません。",
      generationFailed: false,
      successId: null,
    };
  }

  if (!hasOpenAiApiKey()) {
    return {
      error: "OpenAI APIが設定されていません。",
      generationFailed: false,
      successId: null,
    };
  }

  try {
    const result = await createUserMessageTurn(supabase, chatId, contentRaw);

    try {
      const conversation = await listConversationMessages(supabase, chatId);
      const generation = await generateAssistantResponse(
        conversation,
        selectedSnapshot,
        getGpt4oApiModelId(selectedSnapshot),
        responseSettings,
      );

      await saveInitialAssistantResponse(supabase, result.turn_id, generation);
      await tryGenerateInitialChatTitle(
        supabase,
        chatId,
        userId,
        contentRaw,
        result.turn_index,
      );

      revalidatePath("/");
      revalidatePath(`/chat/${chatId}`);

      return {
        error: null,
        generationFailed: false,
        successId: result.user_message_id,
      };
    } catch {
      revalidatePath("/");
      revalidatePath(`/chat/${chatId}`);

      return {
        error: GENERATION_FAILED_MESSAGE,
        generationFailed: true,
        successId: result.user_message_id,
      };
    }
  } catch (error) {
    if (error instanceof MessagePersistenceError) {
      return {
        error: error.message,
        generationFailed: false,
        successId: null,
      };
    }

    return {
      error: "メッセージを保存できませんでした。",
      generationFailed: false,
      successId: null,
    };
  }
}
