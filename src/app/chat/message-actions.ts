"use server";

import { revalidatePath } from "next/cache";

import { getVerifiedUserId } from "@/lib/auth";
import type { SendUserMessageState } from "@/lib/message-action-state";
import { validateUserMessageContent } from "@/lib/message-validation";
import { createUserMessageTurn, MessagePersistenceError } from "@/lib/messages";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function sendUserMessageAction(
  _previousState: SendUserMessageState,
  formData: FormData,
): Promise<SendUserMessageState> {
  const chatId = formData.get("chatId");
  const contentRaw = formData.get("contentRaw");

  if (typeof chatId !== "string" || typeof contentRaw !== "string") {
    return { error: "メッセージを保存できませんでした。", successId: null };
  }

  const validationError = validateUserMessageContent(contentRaw);

  if (validationError) {
    return { error: validationError, successId: null };
  }

  const supabase = await createSupabaseServerClient();
  const userId = await getVerifiedUserId(supabase);

  if (!userId) {
    return {
      error: "このチャットにメッセージを保存できません。",
      successId: null,
    };
  }

  try {
    const result = await createUserMessageTurn(supabase, chatId, contentRaw);

    revalidatePath("/");
    revalidatePath(`/chat/${chatId}`);

    return { error: null, successId: result.user_message_id };
  } catch (error) {
    if (error instanceof MessagePersistenceError) {
      return { error: error.message, successId: null };
    }

    return { error: "メッセージを保存できませんでした。", successId: null };
  }
}
