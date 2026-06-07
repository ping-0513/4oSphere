"use server";

import { revalidatePath } from "next/cache";

import { getVerifiedUserId } from "@/lib/auth";
import type { ChatManagementActionState } from "@/lib/chat-management-action-state";
import {
  ChatManagementError,
  renameVisibleChat,
  softDeleteVisibleChat,
} from "@/lib/chats";
import { normalizeChatTitle, validateChatTitle } from "@/lib/chat-validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function revalidateChatRoutes(chatId: string) {
  revalidatePath("/");
  revalidatePath(`/chat/${chatId}`);
  revalidatePath("/chat/[chatId]", "page");
}

export async function renameChatAction(
  _previousState: ChatManagementActionState,
  formData: FormData,
): Promise<ChatManagementActionState> {
  const chatId = formData.get("chatId");
  const title = formData.get("title");

  if (typeof chatId !== "string" || typeof title !== "string") {
    return { error: "このチャットを更新できませんでした。", success: false };
  }

  const validationError = validateChatTitle(title);

  if (validationError) {
    return { error: validationError, success: false };
  }

  const supabase = await createSupabaseServerClient();
  const userId = await getVerifiedUserId(supabase);

  if (!userId) {
    return { error: "このチャットを更新できませんでした。", success: false };
  }

  try {
    await renameVisibleChat(
      supabase,
      chatId,
      userId,
      normalizeChatTitle(title),
    );
    revalidateChatRoutes(chatId);

    return { error: null, success: true };
  } catch (error) {
    if (error instanceof ChatManagementError) {
      return { error: error.message, success: false };
    }

    return { error: "このチャットを更新できませんでした。", success: false };
  }
}

export async function softDeleteChatAction(
  _previousState: ChatManagementActionState,
  formData: FormData,
): Promise<ChatManagementActionState> {
  const chatId = formData.get("chatId");

  if (typeof chatId !== "string") {
    return { error: "このチャットを削除できませんでした。", success: false };
  }

  const supabase = await createSupabaseServerClient();
  const userId = await getVerifiedUserId(supabase);

  if (!userId) {
    return { error: "このチャットを削除できませんでした。", success: false };
  }

  try {
    await softDeleteVisibleChat(supabase, chatId, userId);
    revalidateChatRoutes(chatId);

    return { error: null, success: true };
  } catch {
    return { error: "このチャットを削除できませんでした。", success: false };
  }
}
