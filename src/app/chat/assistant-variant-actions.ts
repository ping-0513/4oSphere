"use server";

import { revalidatePath } from "next/cache";

import {
  getLatestTurnRegenerationContext,
  saveRegeneratedAssistantResponse,
  setActiveAssistantResponseVariant,
} from "@/lib/assistant-variants";
import type { AssistantVariantActionState } from "@/lib/assistant-variant-action-state";
import { getVerifiedUserId } from "@/lib/auth";
import { isUuid } from "@/lib/chats";
import { hasOpenAiApiKey } from "@/lib/openai/client";
import { generateAssistantResponse } from "@/lib/openai/generate-assistant-response";
import { getGpt4oApiModelId, isGpt4oSnapshotLabel } from "@/lib/openai/models";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const VARIANT_ACTION_ERROR = "この回答は現在操作できません。";
const REGENERATE_ERROR = "回答を再生成できませんでした。";

export async function regenerateAssistantResponseAction(
  formData: FormData,
): Promise<AssistantVariantActionState> {
  const turnId = formData.get("turnId");
  const selectedSnapshot = formData.get("selectedSnapshot");

  if (
    typeof turnId !== "string" ||
    !isUuid(turnId) ||
    typeof selectedSnapshot !== "string" ||
    !isGpt4oSnapshotLabel(selectedSnapshot) ||
    !hasOpenAiApiKey()
  ) {
    return { error: REGENERATE_ERROR, success: false };
  }

  const supabase = await createSupabaseServerClient();
  const userId = await getVerifiedUserId(supabase);

  if (!userId) {
    return { error: REGENERATE_ERROR, success: false };
  }

  try {
    const context = await getLatestTurnRegenerationContext(
      supabase,
      turnId,
      userId,
    );
    const generation = await generateAssistantResponse(
      context.conversation,
      selectedSnapshot,
      getGpt4oApiModelId(selectedSnapshot),
    );

    await saveRegeneratedAssistantResponse(supabase, turnId, generation);
    revalidatePath(`/chat/${context.chatId}`);

    return { error: null, success: true };
  } catch {
    return { error: REGENERATE_ERROR, success: false };
  }
}

export async function switchActiveAssistantVariantAction(
  formData: FormData,
): Promise<AssistantVariantActionState> {
  const turnId = formData.get("turnId");
  const assistantResponseVariantId = formData.get("assistantResponseVariantId");

  if (
    typeof turnId !== "string" ||
    !isUuid(turnId) ||
    typeof assistantResponseVariantId !== "string" ||
    !isUuid(assistantResponseVariantId)
  ) {
    return { error: VARIANT_ACTION_ERROR, success: false };
  }

  const supabase = await createSupabaseServerClient();
  const userId = await getVerifiedUserId(supabase);

  if (!userId) {
    return { error: VARIANT_ACTION_ERROR, success: false };
  }

  try {
    const chatId = await setActiveAssistantResponseVariant(
      supabase,
      turnId,
      assistantResponseVariantId,
    );
    revalidatePath(`/chat/${chatId}`);

    return { error: null, success: true };
  } catch {
    return { error: VARIANT_ACTION_ERROR, success: false };
  }
}
