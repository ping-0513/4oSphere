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

After OpenAI API integration, add automatic chat-title generation:

- Run after the first user message is sent only when the chat title is still
  the initial default.
- Use `4o-1120` / `gpt-4o-2024-11-20`.
- Save the generated title to `chats.title`.
- Never overwrite a title that the user manually renamed.
- Limit generated titles to 40 characters.
- Do not couple title generation failure to user-message persistence.

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
