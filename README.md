# 4oSphere

4oSphere is the GPT-4o-only edition of the web chat app described in
`docs/PROJECT_SPEC.md`.

## Phase 0 foundation

This repository currently contains the Next.js, TypeScript, Tailwind CSS,
component, linting, formatting, environment, Supabase Auth wiring, chat routing,
chat creation, chat list loading, chat rename and soft delete, user-message
persistence, non-streaming GPT-4o assistant responses, and the Phase 1 app
shell.

## Local setup

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Set these public Supabase values in `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is preferred. The legacy
`NEXT_PUBLIC_SUPABASE_ANON_KEY` remains supported as a fallback for existing
local environments.

Do not put Supabase service-role keys or private provider secrets in public
client environment variables.

Set the server-only OpenAI API key in `.env.local`:

```text
OPENAI_API_KEY=
```

Do not prefix the OpenAI API key with `NEXT_PUBLIC_`. It is read only by
server-side helpers and must not be exposed to browser code.

## Google OAuth setup

Google login also requires repo-external provider configuration:

- Enable the Google provider in the Supabase Dashboard.
- Create a Google Cloud OAuth web client and copy its client ID and client
  secret into the Supabase Google provider settings.
- Add the local callback URL to the Supabase redirect allow list:
  `http://localhost:3000/auth/callback`.
- After deployment, add the production callback URL as well:
  `https://<your-production-domain>/auth/callback`.

The app exchanges the OAuth callback code at `/auth/callback`, refreshes
Supabase Auth cookies through the Next.js proxy, and upserts the signed-in user
into the existing `profiles` table.

## Chat routing

Authenticated users can create chats from the sidebar. Each New chat action
creates a new `chats` row and redirects to `/chat/{chatId}`. The root `/` route
does not automatically open an existing chat.

Chat lists and direct chat loads only read rows where `deleted_at is null`.
Deleted chats are hidden from the list and direct deleted-chat URLs return the
same not-found behavior as missing or inaccessible chats.

Authenticated users can rename their own visible chats and soft-delete them
from the desktop sidebar or mobile drawer. Chat deletion only sets
`chats.deleted_at`; the app does not grant or use hard-delete operations.

The Phase 2E migration adds database checks that reject whitespace-only chat
titles and titles longer than 40 characters. It intentionally does not rewrite
existing data, so applying it can fail if existing rows violate those rules.

User messages are saved through the authenticated-only
`create_user_message_turn` RPC. The RPC uses `auth.uid()`, respects RLS, creates
the message turn and user message atomically, and updates the chat ordering
timestamp.

After a user message is saved, the server calls the OpenAI Responses API
without streaming or tools. The selected GPT-4o snapshot is validated against
the three supported formal model IDs, and the completed assistant response plus
its active-variant pointer are saved atomically through the authenticated-only
`save_initial_assistant_response` RPC. OpenAI response storage is disabled with
`store: false`; the Supabase database remains the conversation source of truth.

After the first user message and assistant response are saved, the server makes
a best-effort title-generation request with the fixed
`gpt-4o-2024-11-20` snapshot. It only updates a visible chat whose raw database
title is still `New chat`, so a manual rename is not overwritten. Generated
titles are rejected unless they are a single safe line of at most 40
characters. A title-generation failure does not fail the saved conversation.

User edit, streaming, tools, and title-regeneration UI remain deferred.

Phase 3C adds non-streaming assistant-response regeneration and active-variant
switching. Regeneration appends a completed `assistant_response_variants` row
to the same turn and atomically selects it; it does not create another user
message or message turn. Until branch/edit/resend support exists, regenerate
and variant switching are intentionally limited to the latest visible turn.
Older turns and user-only turns without a completed active assistant response
cannot be operated on.

The Settings > Model panel is a taxonomy shell for OpenAI API setting areas. It
lists all 24 parent categories kept in `src/lib/openai/api-setting-categories.ts`
with status badges, help text, search, filtering, and collapsible sections. It
also shows child setting candidates from
`src/lib/openai/api-setting-subcategories.ts` so broad API surfaces remain
visible even when they are deferred. It does not expose API keys or execute
administration APIs.

Parent categories use the canonical display order defined in
`API_SETTING_CATEGORY_CANONICAL_ORDER`, beginning with Responses and then
Common. Child setting rows carry `officialName`, `japaneseName`, `displayName`,
and `order`; search and status filters only remove non-matching rows and do not
reorder the remaining metadata. The panel displays stable parent/child numbers,
Japanese explanations, and visually separates editable settings, fixed values,
display-only inventory rows, and server-managed settings.

The Responses category now includes session-only detail controls for the current
non-streaming chat generation path. Developer instructions and custom user
instructions are separate text fields; the normal user message remains the
composer body. For normal send and regenerate, the server validates these values
and combines them with explicit section labels into the Responses API
`instructions` field. Edits stay as draft values until the user applies them;
only applied session settings are used by the next normal send or regenerate.
Optional numeric settings (`max_output_tokens`, `temperature`, and `top_p`)
start unset. The UI sends them only after the user explicitly enables and enters
a valid value; otherwise the OpenAI API default is used.
Applied settings are restored within the same browser tab through
`sessionStorage`; they are not account or database settings. The settings used
for a generated response are written to
`assistant_response_variants.settings_snapshot` with schema version 2 for the
generated assistant response, but they are not persisted to localStorage or a
settings table. Title generation keeps its fixed prompt and model and does not
use these chat response settings. Responses settings that are not explicitly
connected to the current non-streaming chat path remain visible as fixed,
planned, placeholder, unsupported, needs-confirmation, admin, or legacy rows and
are not sent to the OpenAI API.

The settings inventory also provides plain-Japanese guidance for every child
row: what it is, what changes, when to use it, a recommendation, and a risk
note. Stable canonical numbers remain visible after search and filtering.
Editable, fixed/server-managed, inventory-only, needs-confirmation, and
administrator-facing rows use distinct status labels and colors. The Responses
inventory includes display-only coverage for additional Create Response fields
and tool families found during the API reference audit; these rows do not
enable streaming, tools, multimodal input, or additional API calls.
Code interpreter/container, MCP, computer use, image generation, and
shell/apply-patch tool rows are inventory-only safety references. They expose
no input, toggle, execution action, saved setting, or API connection.

## Verification

```powershell
npm run lint
npm run typecheck
npm run build
npm run verify
```

`npm run verify` runs the minimal lint and typecheck gate. Run
`npm run build` separately for production build verification.
