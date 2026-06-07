import "server-only";

import {
  MAX_CHAT_TITLE_CHARACTERS,
  normalizeChatTitle,
  validateChatTitle,
} from "@/lib/chat-validation";
import { createOpenAiClient } from "@/lib/openai/client";

const TITLE_MODEL_ID = "gpt-4o-2024-11-20";
const TITLE_MAX_OUTPUT_TOKENS = 64;
const TITLE_REQUEST_TIMEOUT_MS = 15_000;
const TITLE_INSTRUCTIONS = `Create a concise chat title from the first user message.
Return only the title in the user's language.
The title must be one line and at most ${MAX_CHAT_TITLE_CHARACTERS} characters.
Do not use quotation marks, emoji, Markdown, or ending punctuation.
Do not exaggerate the content.
Do not expose API keys, tokens, credentials, URLs, personal information, or identifier-like strings.`;

const QUOTE_PATTERN = /["'“”‘’「」『』]/u;
const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;
const MARKDOWN_PATTERN =
  /(^|\s)(?:#{1,6}\s|[-*+]\s|\d+\.\s|```|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*|__)/mu;
const ENDING_PUNCTUATION_PATTERN = /[。．.!！?？]$/u;
const SECRET_LIKE_PATTERNS = [
  /\bBearer\s+\S+/iu,
  /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/u,
  /https?:\/\/\S+/iu,
  /\b(?:api[_ -]?key|access[_ -]?token|refresh[_ -]?token|secret|credential)\b/iu,
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/iu,
  /\b(?:\d{1,3}\.){3}\d{1,3}\b/u,
  /(?:\+?\d[\d ()-]{8,}\d)/u,
  /\b[A-Za-z0-9_-]{32,}\b/u,
  /\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/u,
];

export class ChatTitleGenerationError extends Error {
  constructor() {
    super("Chat title generation failed.");
  }
}

function validateGeneratedTitle(title: string) {
  const normalizedTitle = normalizeChatTitle(title);

  if (
    validateChatTitle(normalizedTitle) ||
    /[\r\n]/u.test(title) ||
    QUOTE_PATTERN.test(normalizedTitle) ||
    EMOJI_PATTERN.test(normalizedTitle) ||
    MARKDOWN_PATTERN.test(normalizedTitle) ||
    ENDING_PUNCTUATION_PATTERN.test(normalizedTitle) ||
    SECRET_LIKE_PATTERNS.some((pattern) => pattern.test(normalizedTitle))
  ) {
    throw new ChatTitleGenerationError();
  }

  return normalizedTitle;
}

export async function generateChatTitle(firstUserMessage: string) {
  const client = createOpenAiClient();

  try {
    const response = await client.responses.create(
      {
        input: firstUserMessage,
        instructions: TITLE_INSTRUCTIONS,
        max_output_tokens: TITLE_MAX_OUTPUT_TOKENS,
        model: TITLE_MODEL_ID,
        store: false,
        stream: false,
        tool_choice: "none",
        tools: [],
      },
      { timeout: TITLE_REQUEST_TIMEOUT_MS },
    );

    if (response.status !== "completed" || response.model !== TITLE_MODEL_ID) {
      throw new ChatTitleGenerationError();
    }

    return validateGeneratedTitle(response.output_text);
  } catch {
    throw new ChatTitleGenerationError();
  }
}
