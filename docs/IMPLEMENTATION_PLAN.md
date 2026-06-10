# 4oSphere implementation plan

This plan is for Codex or another coding agent implementing 4oSphere.

## Rule for uncertain behavior

When a requirement is undefined, choose the conservative option for privacy, data retention, API cost, and UI stability. Implement the conservative default and report the decision in the summary.

## Phase 0: repository foundation

Set up the project stack:

- Next.js app
- TypeScript
- Tailwind CSS
- shadcn/ui or equivalent stable component library
- ESLint/formatting
- Environment variable examples
- Supabase client wiring
- Vercel-compatible structure

Add a minimal test or verification script as soon as practical.

## Phase 1: app shell and navigation

Implement the layout before implementing model calls.

Required app shell:

- Left sidebar on desktop
- Left drawer/sheet on mobile
- Fixed header
- Scroll-only message list
- Fixed composer
- `100dvh` mobile behavior
- Safe-area spacing

Sidebar/drawer contents:

- New chat
- Chat list
- Knowledge management
- Settings
- Account
- Logout

Header contents:

- Menu/sidebar control
- Collapsed `4o` model picker
- Knowledge ON/OFF
- Web ON/OFF

Do not continue to API integration until this shell is stable.

## Phase 2: chat state and persistence

Implement:

- Google login
- Chat creation
- Chat list
- Chat selection via route or stable state
- Message persistence
- New chat must not open an existing chat
- Refresh must preserve the current chat route

Recommended route shape:

```text
/chat/[chatId]
```

## Phase 3: model picker and settings

Implement GPT-4o snapshot picker:

- Collapsed display: `4o`
- Open options: `0513`, `0806`, `1120`
- Internal IDs:
  - `gpt-4o-2024-05-13`
  - `gpt-4o-2024-08-06`
  - `gpt-4o-2024-11-20`

Do not include the `gpt-4o` alias in the picker.

Settings categories:

- Model
- Display
- Prompt/developer instructions
- Knowledge
- Web search
- Images
- PDF/files
- Cost/API
- Account

Use validation and proper numeric storage. Distinguish `0`, null, and empty fields.

## Phase 4: streaming chat API

Implement real streaming:

- Send message
- Receive deltas incrementally
- Render deltas as they arrive
- Stop button aborts the active request
- Regenerate creates a new assistant response using the same or currently selected settings, depending on final design
- Store formal model ID used
- Store input/output tokens and estimated cost when available

Do not fake typing after full response receipt.

The preceding Phase 3A integration uses the OpenAI Responses API in
non-streaming mode, disables OpenAI response storage, uses no tools, and stores
one completed assistant variant plus its active-variant pointer for each new
user turn.

The Phase 3B integration adds automatic chat-title generation:

- Run after the first user message and assistant response are saved only when
  the raw database chat title is still `New chat`.
- Use `4o-1120` / `gpt-4o-2024-11-20`.
- Save a validated, single-line generated title to `chats.title`.
- Never overwrite a title that the user manually renamed.
- Limit generated titles to 40 characters.
- Do not couple title generation failure to user-message persistence.

The Phase 3C integration adds non-streaming assistant-response variants:

- Regenerate appends a completed assistant variant to the same message turn.
- The new variant becomes active atomically; no user message or turn is added.
- Existing completed variants can be selected without calling OpenAI.
- Until branch/edit/resend support exists, regenerate and variant switching are
  limited to the latest visible turn.
- User-only turns without a completed active assistant response are not
  retryable in this phase.

The Phase 4A settings shell adds the Settings > Model taxonomy:

- Use the existing GPT-4o snapshot options only: `4o-0513`, `4o-0806`, `4o-1120`.
- Show all 24 OpenAI API parent categories as metadata-driven accordion rows.
- Treat the list as parent categories, not individual API parameters.
- Distinguish OpenAI API category existence from 4oSphere implementation status.
- Do not expose or edit API keys in browser UI.
- Do not persist settings or add them to `settings_snapshot` yet.
- Do not execute Administration, Files, Uploads, Vector Stores, Images, Audio,
  Video, Realtime, Chat Completions, or Legacy APIs in this phase.
- Keep child setting candidates visible under each parent category via metadata.
  Deferred surfaces should be organized with status badges and placeholder rows
  instead of being removed.
- Preserve the canonical parent order beginning with Responses and then Common.
  Every child setting candidate must keep an explicit Japanese label,
  bilingual display name, and metadata order. Search/filter operations must not
  reorder remaining items.
- Display stable canonical parent/child numbers and short Japanese guidance so
  non-technical Japanese speakers can distinguish editable, fixed,
  display-only, server-managed, and unsupported items.
- Search and status filters inspect parent and child metadata, show child match
  counts, and mark matching child rows without changing canonical order. Keep a
  combined reset action available while filtering and in the zero-result state.

The Phase 4B Responses settings detail connects a small, safe subset of the
Responses API settings to the current non-streaming chat generation path:

- Developer instructions and custom user instructions are separate UI fields.
- The normal user message remains the composer body and is not merged into
  settings instructions.
- UI edits remain draft values until the user applies them; discarding resets
  the draft to the currently applied session settings.
- Normal send and regenerate pass the validated session settings to the server.
- The server combines developer and custom instructions with explicit section
  labels into the Responses API `instructions` field.
- `max_output_tokens`, `temperature`, and `top_p` are optional. They start
  unset, show that the API default will be used, and are sent only after the
  user explicitly enables and enters a value. Enabled values are validated on
  the client and server before any user message is saved.
- `store: false`, `stream: false`, `tools: []`, and `tool_choice: none` remain
  fixed.
- The used settings are saved in `assistant_response_variants.settings_snapshot`
  with schema version 2.
- Settings are not persisted to localStorage or a database settings table in
  this phase.
- Applied settings may be restored within the current browser tab through
  `sessionStorage`; this must store only Responses settings, never API keys or
  provider secrets.
- Show a plain-Japanese applied-settings summary for the next normal send and
  regenerate. Separate values that will be sent from optional values omitted
  in favor of API defaults, and keep deferred Responses inventory visibly
  display-only.
- The summary must show only setting state, never instruction text, user
  messages, conversation history, API keys, headers, or raw provider output.
- Closing the settings panel with unsaved draft changes should require explicit
  confirmation before those draft changes are discarded.
- Title generation keeps its fixed `gpt-4o-2024-11-20` behavior and does not
  use Responses settings.
- Settings not listed as payload-connected in this phase remain display-only
  shell rows. They must not be added to OpenAI payloads or
  `settings_snapshot`.
- Enrich every child metadata row with concise Japanese guidance for meaning,
  effect, appropriate use, recommendation, and risk. Keep official paths and
  internal handling in developer details.
- Preserve canonical parent and child numbers through search and filtering, and
  use semantic status treatments to distinguish editable, fixed/server-managed,
  inventory-only, needs-confirmation, and administrator-facing rows.
- Record additional Responses Create fields and tool families found during API
  reference review as display-only metadata. Do not connect these audit rows to
  OpenAI requests until a dedicated implementation phase validates support and
  safety.
- Expand the lower API-reference categories with display-only lifecycle,
  status, file, evaluation, webhook, container, skill, ChatKit,
  administration, and legacy-operation inventory. These rows must expose no
  input, toggle, execution action, persistence, or API connection.
- Keep the large display-only inventory split into category-range metadata
  modules behind a single aggregate export. Refactoring these files must
  preserve IDs, array order, numbering, Japanese guidance, and statuses.

## Phase 5: message actions and metadata

Add required message actions:

User messages:

- Copy
- Edit and resend
- Delete
- Timestamp

Assistant messages:

- Copy
- Regenerate
- Delete
- Metadata display

Metadata toggles:

- Formal model ID
- Input tokens
- Output tokens
- Estimated cost
- Latency
- Knowledge references
- Web references

## Phase 6: image handling

Implement:

- Multi-image attach
- Client-side compression
- Storage metadata
- Retention mode
- UI deletion
- No binary blobs in normal database fields

Recommended retention modes:

- Temporary save
- Chat save
- Immediate delete after API use

## Phase 7: PDF knowledge

Implement PDFs as knowledge, not message attachments.

Required:

- Knowledge management page
- PDF upload
- Status tracking: uploading, parsing, indexing, available, failed
- Global knowledge
- Chat-specific knowledge
- Knowledge toggle in chat header
- References under assistant responses when enabled
- Delete knowledge and keep DB/storage/index consistent

MVP may use OpenAI vector stores for retrieval while storing metadata in Supabase. If Supabase pgvector is chosen instead, document the reason.

## Phase 8: web search

Implement web search as a separate toggle from knowledge.

Modes may be:

- OFF
- AUTO
- REQUIRED

Do not mix web search with PDF knowledge under one ambiguous setting.

## Phase 9: voice input and finishing polish

Add:

- Voice input
- Better loading states
- Empty states
- Error states
- Mobile keyboard testing
- Accessibility labels
- Cost summary if feasible

## Verification checklist

Before claiming completion, check:

- Header stays fixed
- Composer stays fixed
- Only message list scrolls
- Mobile drawer does not change current chat
- Model picker collapsed text is `4o`
- Open model options are `0513`, `0806`, `1120`
- Formal model ID appears below assistant message when setting is on
- Copy/regenerate/stop/delete exist
- Composer text never overlaps icons
- New chat creates and opens a new chat
- Refresh preserves current chat
- PDF is represented as knowledge
- Knowledge and web search controls are separate
- Streaming is real delta rendering
