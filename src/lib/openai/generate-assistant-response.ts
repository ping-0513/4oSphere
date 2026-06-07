import "server-only";

import type { ResponseInput } from "openai/resources/responses/responses";

import { createOpenAiClient } from "@/lib/openai/client";
import type {
  AssistantGenerationResult,
  ConversationMessage,
  Gpt4oApiModelId,
  Gpt4oSnapshotLabel,
  JsonValue,
} from "@/types/chat";

const MAX_OUTPUT_TOKENS = 4096;

export const PHASE_3A_SETTINGS_SNAPSHOT = {
  schemaVersion: 1,
  api: "responses",
  stream: false,
  store: false,
  tools: [],
  toolChoice: "none",
  maxOutputTokens: MAX_OUTPUT_TOKENS,
} satisfies JsonValue;

export class AssistantGenerationError extends Error {
  constructor() {
    super("メッセージは保存されましたが、応答生成に失敗しました。");
  }
}

function toResponseInput(messages: ConversationMessage[]): ResponseInput {
  return messages.map((message) => ({
    role: message.role,
    content: message.contentRaw,
  }));
}

export async function generateAssistantResponse(
  messages: ConversationMessage[],
  selectedSnapshot: Gpt4oSnapshotLabel,
  apiModelId: Gpt4oApiModelId,
): Promise<AssistantGenerationResult> {
  const client = createOpenAiClient();
  const startedAt = performance.now();

  try {
    const response = await client.responses.create({
      input: toResponseInput(messages),
      max_output_tokens: MAX_OUTPUT_TOKENS,
      model: apiModelId,
      store: false,
      stream: false,
      tool_choice: "none",
      tools: [],
    });
    const contentRaw = response.output_text.trim();

    if (
      response.status !== "completed" ||
      response.model !== apiModelId ||
      !contentRaw
    ) {
      throw new AssistantGenerationError();
    }

    return {
      apiModelId,
      contentRaw,
      inputTokens: response.usage?.input_tokens ?? null,
      latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
      outputTokens: response.usage?.output_tokens ?? null,
      selectedSnapshot,
      settingsSnapshot: PHASE_3A_SETTINGS_SNAPSHOT,
    };
  } catch {
    throw new AssistantGenerationError();
  }
}
