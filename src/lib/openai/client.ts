import "server-only";

import OpenAI from "openai";

export function hasOpenAiApiKey() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function createOpenAiClient() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("OpenAI API is not configured.");
  }

  return new OpenAI({
    apiKey,
    maxRetries: 0,
    timeout: 60_000,
  });
}
