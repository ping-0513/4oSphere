# 4oSphere product specification

Last updated from planning conversation: 2026-06-06

## 1. Product goal

Build a smartphone-friendly web chat app centered on GPT-4o snapshot models. The app should feel close to the previous GPT-4o ChatGPT experience while exposing API-based controls, cost metadata, knowledge controls, and stable chat UI behavior.

This is not a generic multi-provider chat app for the MVP. It is the GPT-4o-only edition.

## 2. Technology choices

Required:

- Next.js or equivalent modern React web stack
- TypeScript
- Google authentication
- Supabase
- Vercel
- Smartphone-friendly web implementation

Recommended:

- shadcn/ui
- Tailwind CSS
- React Hook Form
- Zod
- TanStack Query
- Zustand or Jotai

## 3. Visual direction

- Dark theme
- Mint green accent color
- Clean, stable, ChatGPT-like interaction model
- Use proper UI components, not emoji-in-circle controls
- Avoid a fragmented component feel
- Do not let refreshes or route changes break layout state

## 4. Layout requirements

The app shell must have three stable zones:

1. Header
2. Message list
3. Composer

Only the message list scrolls.

The header must remain available. The composer must remain available. Users must never have to scroll back to the top to change the model or open navigation, and the composer must not disappear while reading older messages.

Use `100dvh` and safe-area-aware spacing on mobile.

## 5. Left menu

Settings should follow a ChatGPT-like left menu model.

Desktop sidebar:

- New chat
- Chat list
- Knowledge management
- Settings
- Account
- Logout

Mobile:

- Header has a menu button
- Left drawer/sheet opens from the menu button
- Drawer contains new chat, chat list, knowledge management, settings, account, logout
- Opening or closing the drawer must not change the current chat

The chat header should contain only frequently used controls:

- Model picker
- Knowledge ON/OFF
- Web search ON/OFF
- Menu/sidebar control

## 6. Model picker

The `gpt-4o` alias is intentionally excluded from the picker.

Collapsed display:

- Always show `4o`

Opened display:

- `0513` -> `gpt-4o-2024-05-13`
- `0806` -> `gpt-4o-2024-08-06`
- `1120` -> `gpt-4o-2024-11-20`

Storage and API calls:

- Store and send the formal internal model ID.

Conversation metadata:

- If model-name display is enabled below assistant messages, show the formal internal model ID, for example `gpt-4o-2024-11-20`.

## 7. Chat basics that must not be omitted

User message actions:

- Copy
- Edit and resend
- Delete
- Sent timestamp
- Attachment details

Assistant message actions:

- Copy
- Regenerate
- Stop response while streaming
- Delete
- Model metadata
- Input/output token metadata
- Cost metadata
- Knowledge references
- Web references

Composer actions:

- Send
- Stop
- Attach images
- Add/manage PDF knowledge
- Voice input
- Newline support
- Multi-image support

## 8. Composer requirements

- Must not be cramped
- Minimum useful height around 56px
- Supports multiple lines
- Auto-expands until a max height, then scrolls internally
- Buttons must not overlap typed text
- Placeholder and typed text must not overlap icons
- Mobile keyboard must not push the composer out of reach

## 9. PDF knowledge

PDFs are knowledge, not ordinary temporary conversation attachments.

MVP must support PDF upload into a knowledge system with status tracking:

- Uploading
- Parsing
- Indexing
- Available
- Failed

Knowledge scopes:

- Global knowledge
- Chat-specific knowledge

Recommended additional scope:

- Temporary knowledge, searchable during a session or chat, then deleted later

Knowledge UI:

- Knowledge management screen from the left menu
- Chat-level knowledge ON/OFF
- Display referenced files/chunks below assistant messages when enabled
- UI deletion controls

Deletion must keep database metadata, storage, and search index state consistent.

## 10. Knowledge search and web search

Knowledge search and web search are separate and must have separate UI controls.

Recommended header controls:

```text
[4o ▼] [Knowledge ON/OFF] [Web ON/OFF]
```

Reference priority:

1. Recent conversation context
2. Chat-specific knowledge
3. Global knowledge
4. Web search, when enabled or required

## 11. Image handling

Images should be easy to send in large quantities.

Requirements:

- Client-side automatic compression before upload
- Support common phone image formats where practical
- Convert unsupported or inconvenient formats to JPEG or WebP where practical
- Store images outside the database body; database stores metadata and paths
- User can delete uploaded images from the UI
- Deletion should remove storage object and database metadata or mark metadata as deleted, depending on retention mode

Recommended defaults:

- Long edge around 1600-2048px
- Quality around 0.75-0.85
- Detail auto by default
- High detail for screenshots, documents, or text-heavy images

Image retention modes:

- Temporary save
- Chat save
- Immediate delete after API use

## 12. Settings

Settings should be reachable from the left menu and organized into categories:

- Model
- Display
- Prompt/developer instructions
- Knowledge
- Web search
- Images
- PDF/files
- Cost/API
- Account

Important number handling:

- Store numeric settings as numbers or null, not strings
- Distinguish empty, zero, and unset
- Avoid the old bug where a `0` remains stuck in a setting field
- Use validation before saving

The Model settings screen starts as a taxonomy shell. It should list the parent
OpenAI API setting areas first, then add individual controls in later phases.
The shell must not imply that every official API category is already available
inside 4oSphere. Use status labels such as implemented, planned, admin, legacy,
needs-confirmation, and unsupported to separate official API taxonomy from
4oSphere implementation state. Child setting candidates should remain visible
as implemented, fixed, placeholder, planned, needs-confirmation, admin, legacy,
or unsupported rows so broad API coverage is not silently narrowed. API keys
and administrator operations must not be exposed in the browser settings UI.
The normal parent-category order starts with Responses, then Common, followed by
the remaining canonical API taxonomy. Parent and child rows must show both an
official-like English name and Japanese label, and filtering must preserve their
metadata-defined relative order.
The settings panel must also show stable canonical parent/child numbers and
plain Japanese guidance for what each setting does, when to use it, and whether
it is editable, fixed, display-only, server-managed, or unsupported.

Responses settings are added incrementally. Developer instructions and custom
user instructions must remain separate from the normal composer message in UI,
validation, and settings snapshots. They may be composed into the Responses API
`instructions` field with explicit labels for the current non-streaming
generation path, but they must not be merged into the user message body or title
generation prompt. Editing a Responses setting should create a draft first;
normal send and regenerate should use only explicitly applied session settings.
Session-only Responses settings may be restored within the current browser tab
with `sessionStorage`, but should not be written to localStorage or a database
settings table until a dedicated persistence design is added.
Optional numeric Responses settings should start unset and clearly show that
the OpenAI API default will be used. They must be omitted from the API request
and settings snapshot until the user explicitly enables and supplies a valid
value.
Every settings child row should provide concise Japanese guidance for what the
item is, what changing it would do, when it is appropriate, the recommended
default posture, and important risks. Normal UI copy should avoid unexplained
API jargon; technical paths and internal handling belong in developer details.
Rows must visually distinguish editable settings, fixed/server-managed values,
inventory-only placeholders, needs-confirmation items, and administrator or
dangerous surfaces. API-reference audit findings may be added as display-only
metadata, but must not silently enable a new API behavior.
Dangerous or externally connected tool inventory rows must explicitly state
that they cannot be enabled or executed from the settings UI. They must not
render inputs, toggles, execution actions, or saved settings.
Lower API-reference categories should retain a detailed inventory of lifecycle,
status, security, file, evaluation, and administration concepts. Operation-like
rows such as create, update, delete, cancel, pause, resume, publish, and
administration actions are documentation only in Settings and must explicitly
state that they cannot be enabled or executed there.
Display-only inventory rows must also carry a persistent visual notice that
they cannot be operated from Settings; help and developer-detail controls must
not resemble API execution actions.

## 13. Metadata display

Each metadata item must be independently toggleable:

- User sent timestamp
- Assistant model formal ID
- Input tokens
- Output tokens
- Estimated API cost
- Response latency
- Knowledge references
- Web references
- Attachment details

## 14. Streaming

Use real streaming. Do not wait for the full response and then fake a typing animation.

The UI should append response deltas as they arrive.

The stop button must abort the active request.

## 15. Data model guidance

Suggested tables:

- users/profile table as needed
- chats
- messages
- attachments
- user_settings
- knowledge_files
- knowledge_sets
- message_knowledge_refs

Messages should store the formal model ID actually used for that assistant response.

## 16. Completion criteria

The UI is not complete if any of these are true:

- Header scrolls away
- Composer scrolls away
- Whole page scrolls instead of message list only
- Settings button or menu button is too small
- Composer is too narrow or too short
- Typed text overlaps icons
- New chat opens an existing chat
- Copy/regenerate/stop/delete are missing
- Model picker collapsed label is not `4o`
- Conversation model metadata does not show formal model ID when enabled
- PDF is implemented only as a temporary chat attachment
