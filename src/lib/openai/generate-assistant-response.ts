import "server-only";

import type { ResponseInput } from "openai/resources/responses/responses";

import { createOpenAiClient } from "@/lib/openai/client";
import {
  composeResponseInstructions,
  createResponseSettingsSnapshot,
  DEFAULT_RESPONSE_SETTINGS,
  type ResponseSettings,
} from "@/lib/openai/response-settings";
import type {
  AssistantGenerationResult,
  ConversationMessage,
  Gpt4oApiModelId,
  Gpt4oSnapshotLabel,
  JsonValue,
} from "@/types/chat";

export const PHASE_3A_SETTINGS_SNAPSHOT = {
  schemaVersion: 1,
  api: "responses",
  stream: false,
  store: false,
  tools: [],
  toolChoice: "none",
  maxOutputTokens: DEFAULT_RESPONSE_SETTINGS.maxOutputTokens,
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
  responseSettings: ResponseSettings = DEFAULT_RESPONSE_SETTINGS,
): Promise<AssistantGenerationResult> {
  const client = createOpenAiClient();
  const startedAt = performance.now();
  const instructions = composeResponseInstructions(responseSettings);

  try {
    const response = await client.responses.create({
      input: toResponseInput(messages),
      instructions,
      max_output_tokens: responseSettings.maxOutputTokens,
      model: apiModelId,
      store: false,
      stream: false,
      temperature: responseSettings.temperature,
      tool_choice: "none",
      tools: [],
      top_p: responseSettings.topP,
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
      settingsSnapshot: createResponseSettingsSnapshot(responseSettings),
    };
  } catch {
    throw new AssistantGenerationError();
  }
}
