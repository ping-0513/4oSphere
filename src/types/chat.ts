export const GPT_4O_MODEL_OPTIONS = [
  {
    label: "4o-0513",
    apiModelId: "gpt-4o-2024-05-13",
  },
  {
    label: "4o-0806",
    apiModelId: "gpt-4o-2024-08-06",
  },
  {
    label: "4o-1120",
    apiModelId: "gpt-4o-2024-11-20",
  },
] as const;

export type Gpt4oSnapshotLabel = (typeof GPT_4O_MODEL_OPTIONS)[number]["label"];

export type Gpt4oApiModelId =
  (typeof GPT_4O_MODEL_OPTIONS)[number]["apiModelId"];

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type ChatRow = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
  deleted_at: string | null;
};

export type ChatListItem = Pick<
  ChatRow,
  "id" | "title" | "created_at" | "updated_at" | "archived_at" | "deleted_at"
>;

export type CurrentChat = ChatListItem;

export type MessageTurnRow = {
  id: string;
  chat_id: string;
  user_id: string;
  turn_index: number;
  parent_turn_id: string | null;
  branch_from_turn_id: string | null;
  created_at: string;
  deleted_at: string | null;
};

export type UserMessageRow = {
  id: string;
  turn_id: string;
  chat_id: string;
  user_id: string;
  content_raw: string;
  edit_of_message_id: string | null;
  resend_of_message_id: string | null;
  created_at: string;
  deleted_at: string | null;
};

export type PersistedUserMessage = {
  id: string;
  turnId: string;
  turnIndex: number;
  contentRaw: string;
  createdAt: string;
};

export type UserMessageInsertResult = {
  turn_id: string;
  user_message_id: string;
  turn_index: number;
};

export type AssistantResponseStatus =
  | "placeholder"
  | "pending"
  | "streaming"
  | "completed"
  | "failed"
  | "cancelled";

export type AssistantResponseVariantRow = {
  id: string;
  turn_id: string;
  chat_id: string;
  user_id: string;
  variant_index: number;
  content_raw: string;
  status: AssistantResponseStatus;
  api_model_id: Gpt4oApiModelId | null;
  selected_model_snapshot: Gpt4oSnapshotLabel | null;
  settings_snapshot: JsonValue;
  input_tokens: number | null;
  output_tokens: number | null;
  estimated_cost: number | null;
  latency_ms: number | null;
  created_at: string;
  completed_at: string | null;
  deleted_at: string | null;
};

export type TurnActiveVariantRow = {
  turn_id: string;
  chat_id: string;
  user_id: string;
  assistant_response_variant_id: string;
  updated_at: string;
};

export type AttachmentKind = "image" | "audio" | "pdf" | "other";

export type AttachmentRow = {
  id: string;
  chat_id: string;
  user_id: string;
  turn_id: string | null;
  user_message_id: string | null;
  kind: AttachmentKind;
  storage_bucket: string | null;
  storage_path: string | null;
  mime_type: string | null;
  byte_size: number | null;
  metadata: JsonValue;
  created_at: string;
  deleted_at: string | null;
};

export type WebSearchMode = "off" | "auto" | "required";

export type MessageWebSearchRefRow = {
  id: string;
  assistant_response_variant_id: string;
  turn_id: string;
  chat_id: string;
  user_id: string;
  mode: WebSearchMode;
  query: string | null;
  title: string | null;
  url: string | null;
  snippet: string | null;
  metadata: JsonValue;
  created_at: string;
};

export type ChatTurnWithActiveVariant = {
  turn: MessageTurnRow;
  userMessage: UserMessageRow;
  activeAssistantVariant: AssistantResponseVariantRow | null;
  assistantVariants: AssistantResponseVariantRow[];
};

// Raw Markdown is stored in content_raw and sanitized only at render time.
// Regenerate appends an AssistantResponseVariantRow for the same turn_id.
// User edit/resend creates a new MessageTurnRow branch and does not overwrite
// UserMessageRow.content_raw.
