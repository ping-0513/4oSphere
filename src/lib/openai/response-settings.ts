import { GPT_4O_MODEL_OPTIONS } from "@/lib/openai/models";
import type { Gpt4oSnapshotLabel, JsonValue } from "@/types/chat";

export const MAX_RESPONSE_INSTRUCTIONS_CHARACTERS = 8000;
export const MIN_MAX_OUTPUT_TOKENS = 1;
export const MAX_MAX_OUTPUT_TOKENS = 4096;
export const MIN_TEMPERATURE = 0;
export const MAX_TEMPERATURE = 2;
export const MIN_TOP_P = 0;
export const MAX_TOP_P = 1;
export const RESPONSE_SETTINGS_SESSION_STORAGE_KEY =
  "4osphere:responses-settings:v1";

export type ResponseSettings = {
  customUserInstructions: string;
  developerInstructions: string;
  maxOutputTokens: number;
  store: false;
  stream: false;
  temperature: number;
  toolChoice: "none";
  tools: [];
  topP: number;
};

export type ResponseSettingsBySnapshot = Record<
  Gpt4oSnapshotLabel,
  ResponseSettings
>;

export type ResponseSettingsDraft = {
  customUserInstructions: string;
  developerInstructions: string;
  maxOutputTokens: string;
  store: false;
  stream: false;
  temperature: string;
  toolChoice: "none";
  tools: [];
  topP: string;
};

export type ResponseSettingsDraftBySnapshot = Record<
  Gpt4oSnapshotLabel,
  ResponseSettingsDraft
>;

export type ResponseSettingsFieldErrors = Partial<
  Record<
    | "customUserInstructions"
    | "developerInstructions"
    | "maxOutputTokens"
    | "store"
    | "stream"
    | "temperature"
    | "toolChoice"
    | "tools"
    | "topP",
    string
  >
>;

export const DEFAULT_RESPONSE_SETTINGS = {
  customUserInstructions: "",
  developerInstructions: "",
  maxOutputTokens: MAX_MAX_OUTPUT_TOKENS,
  store: false,
  stream: false,
  temperature: 1,
  toolChoice: "none",
  tools: [],
  topP: 1,
} satisfies ResponseSettings;

export type ResponseSettingsValidationResult =
  | { error: null; settings: ResponseSettings }
  | { error: string; settings: null };

export type ResponseSettingsDraftValidationResult =
  | {
      error: null;
      fieldErrors: ResponseSettingsFieldErrors;
      settings: ResponseSettings;
    }
  | {
      error: string;
      fieldErrors: ResponseSettingsFieldErrors;
      settings: null;
    };

function copyResponseSettings(settings: ResponseSettings): ResponseSettings {
  return {
    customUserInstructions: settings.customUserInstructions,
    developerInstructions: settings.developerInstructions,
    maxOutputTokens: settings.maxOutputTokens,
    store: false,
    stream: false,
    temperature: settings.temperature,
    toolChoice: "none",
    tools: [],
    topP: settings.topP,
  };
}

export function createDefaultResponseSettingsBySnapshot(): ResponseSettingsBySnapshot {
  return Object.fromEntries(
    GPT_4O_MODEL_OPTIONS.map((option) => [
      option.label,
      copyResponseSettings(DEFAULT_RESPONSE_SETTINGS),
    ]),
  ) as ResponseSettingsBySnapshot;
}

export function copyResponseSettingsBySnapshot(
  settingsBySnapshot: ResponseSettingsBySnapshot,
): ResponseSettingsBySnapshot {
  return Object.fromEntries(
    GPT_4O_MODEL_OPTIONS.map((option) => [
      option.label,
      copyResponseSettings(settingsBySnapshot[option.label]),
    ]),
  ) as ResponseSettingsBySnapshot;
}

export function createResponseSettingsDraft(
  settings: ResponseSettings,
): ResponseSettingsDraft {
  return {
    customUserInstructions: settings.customUserInstructions,
    developerInstructions: settings.developerInstructions,
    maxOutputTokens: String(settings.maxOutputTokens),
    store: false,
    stream: false,
    temperature: String(settings.temperature),
    toolChoice: "none",
    tools: [],
    topP: String(settings.topP),
  };
}

export function createResponseSettingsDraftBySnapshot(
  settingsBySnapshot: ResponseSettingsBySnapshot,
): ResponseSettingsDraftBySnapshot {
  return Object.fromEntries(
    GPT_4O_MODEL_OPTIONS.map((option) => [
      option.label,
      createResponseSettingsDraft(settingsBySnapshot[option.label]),
    ]),
  ) as ResponseSettingsDraftBySnapshot;
}

function countCharacters(value: string) {
  return Array.from(value).length;
}

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function readNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    return Number(value);
  }

  return Number.NaN;
}

function validateInstructions(value: string, label: string) {
  if (countCharacters(value) > MAX_RESPONSE_INSTRUCTIONS_CHARACTERS) {
    return `${label}は${MAX_RESPONSE_INSTRUCTIONS_CHARACTERS.toLocaleString()}文字以内で入力してください。`;
  }

  return null;
}

function buildDraftFieldErrors(draft: ResponseSettingsDraft) {
  const fieldErrors: ResponseSettingsFieldErrors = {};
  const developerInstructionsError = validateInstructions(
    draft.developerInstructions,
    "開発者指示",
  );
  const customUserInstructionsError = validateInstructions(
    draft.customUserInstructions,
    "カスタム指示",
  );
  const maxOutputTokens = readNumber(draft.maxOutputTokens);
  const temperature = readNumber(draft.temperature);
  const topP = readNumber(draft.topP);

  if (developerInstructionsError) {
    fieldErrors.developerInstructions = developerInstructionsError;
  }

  if (customUserInstructionsError) {
    fieldErrors.customUserInstructions = customUserInstructionsError;
  }

  if (
    !Number.isInteger(maxOutputTokens) ||
    maxOutputTokens < MIN_MAX_OUTPUT_TOKENS ||
    maxOutputTokens > MAX_MAX_OUTPUT_TOKENS
  ) {
    fieldErrors.maxOutputTokens = `最大出力トークンは${MIN_MAX_OUTPUT_TOKENS}から${MAX_MAX_OUTPUT_TOKENS.toLocaleString()}の整数で指定してください。`;
  }

  if (
    !Number.isFinite(temperature) ||
    temperature < MIN_TEMPERATURE ||
    temperature > MAX_TEMPERATURE
  ) {
    fieldErrors.temperature = `temperatureは${MIN_TEMPERATURE}から${MAX_TEMPERATURE}の範囲で指定してください。`;
  }

  if (!Number.isFinite(topP) || topP < MIN_TOP_P || topP > MAX_TOP_P) {
    fieldErrors.topP = `top_pは${MIN_TOP_P}から${MAX_TOP_P}の範囲で指定してください。`;
  }

  if (draft.store !== false) {
    fieldErrors.store = "storeはこのフェーズではfalse固定です。";
  }

  if (draft.stream !== false) {
    fieldErrors.stream = "streamはこのフェーズではfalse固定です。";
  }

  if (draft.tools.length !== 0) {
    fieldErrors.tools = "toolsはこのフェーズでは空配列固定です。";
  }

  if (draft.toolChoice !== "none") {
    fieldErrors.toolChoice = "tool_choiceはこのフェーズではnone固定です。";
  }

  return fieldErrors;
}

export function validateResponseSettingsDraft(
  draft: ResponseSettingsDraft,
): ResponseSettingsDraftValidationResult {
  const fieldErrors = buildDraftFieldErrors(draft);
  const firstError = Object.values(fieldErrors)[0] ?? null;

  if (firstError) {
    return { error: firstError, fieldErrors, settings: null };
  }

  return {
    error: null,
    fieldErrors,
    settings: {
      customUserInstructions: draft.customUserInstructions,
      developerInstructions: draft.developerInstructions,
      maxOutputTokens: Number(draft.maxOutputTokens),
      store: false,
      stream: false,
      temperature: Number(draft.temperature),
      toolChoice: "none",
      tools: [],
      topP: Number(draft.topP),
    },
  };
}

export function areResponseSettingsEqual(
  left: ResponseSettings,
  right: ResponseSettings,
) {
  return (
    left.customUserInstructions === right.customUserInstructions &&
    left.developerInstructions === right.developerInstructions &&
    left.maxOutputTokens === right.maxOutputTokens &&
    left.store === right.store &&
    left.stream === right.stream &&
    left.temperature === right.temperature &&
    left.toolChoice === right.toolChoice &&
    left.tools.length === right.tools.length &&
    left.topP === right.topP
  );
}

export function isResponseSettingsDraftApplied(
  draft: ResponseSettingsDraft,
  applied: ResponseSettings,
) {
  const validation = validateResponseSettingsDraft(draft);

  return Boolean(
    validation.settings &&
    areResponseSettingsEqual(validation.settings, applied),
  );
}

export function validateResponseSettings(
  value: unknown,
): ResponseSettingsValidationResult {
  if (typeof value !== "object" || value === null) {
    return {
      error: "応答生成設定を読み取れませんでした。",
      settings: null,
    };
  }

  const record = value as Record<string, unknown>;
  const developerInstructions = readString(record.developerInstructions);
  const customUserInstructions = readString(record.customUserInstructions);
  const developerInstructionsError = validateInstructions(
    developerInstructions,
    "開発者指示",
  );
  const customUserInstructionsError = validateInstructions(
    customUserInstructions,
    "カスタム指示",
  );

  if (developerInstructionsError) {
    return { error: developerInstructionsError, settings: null };
  }

  if (customUserInstructionsError) {
    return { error: customUserInstructionsError, settings: null };
  }

  const maxOutputTokens = readNumber(record.maxOutputTokens);

  if (
    !Number.isInteger(maxOutputTokens) ||
    maxOutputTokens < MIN_MAX_OUTPUT_TOKENS ||
    maxOutputTokens > MAX_MAX_OUTPUT_TOKENS
  ) {
    return {
      error: `最大出力トークンは${MIN_MAX_OUTPUT_TOKENS}から${MAX_MAX_OUTPUT_TOKENS.toLocaleString()}の整数で指定してください。`,
      settings: null,
    };
  }

  const temperature = readNumber(record.temperature);

  if (
    !Number.isFinite(temperature) ||
    temperature < MIN_TEMPERATURE ||
    temperature > MAX_TEMPERATURE
  ) {
    return {
      error: `temperatureは${MIN_TEMPERATURE}から${MAX_TEMPERATURE}の範囲で指定してください。`,
      settings: null,
    };
  }

  const topP = readNumber(record.topP);

  if (!Number.isFinite(topP) || topP < MIN_TOP_P || topP > MAX_TOP_P) {
    return {
      error: `top_pは${MIN_TOP_P}から${MAX_TOP_P}の範囲で指定してください。`,
      settings: null,
    };
  }

  if (record.store !== undefined && record.store !== false) {
    return { error: "storeはこのフェーズではfalse固定です。", settings: null };
  }

  if (record.stream !== undefined && record.stream !== false) {
    return {
      error: "streamはこのフェーズではfalse固定です。",
      settings: null,
    };
  }

  if (record.tools !== undefined) {
    if (!Array.isArray(record.tools) || record.tools.length !== 0) {
      return {
        error: "toolsはこのフェーズでは空配列固定です。",
        settings: null,
      };
    }
  }

  if (record.toolChoice !== undefined && record.toolChoice !== "none") {
    return {
      error: "tool_choiceはこのフェーズではnone固定です。",
      settings: null,
    };
  }

  return {
    error: null,
    settings: {
      customUserInstructions,
      developerInstructions,
      maxOutputTokens,
      store: false,
      stream: false,
      temperature,
      toolChoice: "none",
      tools: [],
      topP,
    },
  };
}

export function parseResponseSettingsFormValue(
  value: FormDataEntryValue | null,
): ResponseSettingsValidationResult {
  if (value === null || value === "") {
    return {
      error: null,
      settings: copyResponseSettings(DEFAULT_RESPONSE_SETTINGS),
    };
  }

  if (typeof value !== "string") {
    return {
      error: "応答生成設定を読み取れませんでした。",
      settings: null,
    };
  }

  try {
    return validateResponseSettings(JSON.parse(value));
  } catch {
    return {
      error: "応答生成設定を読み取れませんでした。",
      settings: null,
    };
  }
}

export function serializeResponseSettingsForForm(settings: ResponseSettings) {
  return JSON.stringify(copyResponseSettings(settings));
}

export function serializeResponseSettingsBySnapshotForSession(
  settingsBySnapshot: ResponseSettingsBySnapshot,
) {
  return JSON.stringify(copyResponseSettingsBySnapshot(settingsBySnapshot));
}

export function parseResponseSettingsBySnapshotSessionValue(
  value: string | null,
) {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);

    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }

    const record = parsed as Record<string, unknown>;
    const defaults = createDefaultResponseSettingsBySnapshot();

    return Object.fromEntries(
      GPT_4O_MODEL_OPTIONS.map((option) => {
        const result = validateResponseSettings(record[option.label]);

        return [
          option.label,
          result.settings ?? copyResponseSettings(defaults[option.label]),
        ];
      }),
    ) as ResponseSettingsBySnapshot;
  } catch {
    return null;
  }
}

export function composeResponseInstructions(settings: ResponseSettings) {
  const sections: string[] = [];
  const developerInstructions = settings.developerInstructions.trim();
  const customUserInstructions = settings.customUserInstructions.trim();

  if (developerInstructions) {
    sections.push(`[Developer instructions]\n${developerInstructions}`);
  }

  if (customUserInstructions) {
    sections.push(`[Custom user instructions]\n${customUserInstructions}`);
  }

  return sections.length ? sections.join("\n\n") : undefined;
}

export function createResponseSettingsSnapshot(
  settings: ResponseSettings,
): JsonValue {
  return {
    api: "responses",
    customUserInstructions: settings.customUserInstructions,
    developerInstructions: settings.developerInstructions,
    instructionsComposition: "developer_plus_custom_user",
    maxOutputTokens: settings.maxOutputTokens,
    schemaVersion: 2,
    settingsProfile: "session-ui",
    store: false,
    stream: false,
    temperature: settings.temperature,
    toolChoice: "none",
    tools: [],
    topP: settings.topP,
  };
}
