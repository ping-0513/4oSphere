-- Phase 2A: chat state and persistence foundation.
-- This migration intentionally does not implement OpenAI calls, streaming,
-- Google OAuth UI, upload processing, voice input, web search, or provider
-- generalization. 4oSphere remains GPT-4o-only.
-- Deletion policy: Phase 2A uses deleted_at soft delete columns and does not
-- grant authenticated clients direct hard delete policies. Hard delete requires
-- an explicit later design.
-- TODO Phase 2B/2C: app queries must filter deleted_at is null for visible
-- records. Decide whether RLS should also hide deleted rows or whether UI/query
-- filtering plus future admin/service maintenance is sufficient.

create extension if not exists pgcrypto with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New chat',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  deleted_at timestamptz,
  constraint chats_id_user_id_unique unique (id, user_id)
);

create table public.message_turns (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  turn_index bigint not null,
  parent_turn_id uuid,
  branch_from_turn_id uuid,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint message_turns_chat_user_fk
    foreign key (chat_id, user_id)
    references public.chats(id, user_id)
    on delete cascade,
  constraint message_turns_id_chat_user_unique unique (id, chat_id, user_id),
  constraint message_turns_chat_user_index_unique unique (chat_id, user_id, turn_index),
  constraint message_turns_parent_same_chat_fk
    foreign key (parent_turn_id, chat_id, user_id)
    references public.message_turns(id, chat_id, user_id),
  constraint message_turns_branch_same_chat_fk
    foreign key (branch_from_turn_id, chat_id, user_id)
    references public.message_turns(id, chat_id, user_id),
  constraint message_turns_turn_index_nonnegative check (turn_index >= 0)
);

create table public.user_messages (
  id uuid primary key default gen_random_uuid(),
  turn_id uuid not null,
  chat_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  content_raw text not null,
  edit_of_message_id uuid,
  resend_of_message_id uuid,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint user_messages_turn_fk
    foreign key (turn_id, chat_id, user_id)
    references public.message_turns(id, chat_id, user_id)
    on delete cascade,
  constraint user_messages_id_chat_user_unique unique (id, chat_id, user_id),
  constraint user_messages_id_turn_chat_user_unique unique (id, turn_id, chat_id, user_id),
  constraint user_messages_edit_same_chat_fk
    foreign key (edit_of_message_id, chat_id, user_id)
    references public.user_messages(id, chat_id, user_id),
  constraint user_messages_resend_same_chat_fk
    foreign key (resend_of_message_id, chat_id, user_id)
    references public.user_messages(id, chat_id, user_id),
  constraint user_messages_content_not_blank check (length(btrim(content_raw)) > 0)
);

create table public.assistant_response_variants (
  id uuid primary key default gen_random_uuid(),
  turn_id uuid not null,
  chat_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  variant_index int not null,
  content_raw text not null default '',
  status text not null default 'placeholder',
  api_model_id text,
  selected_model_snapshot text,
  settings_snapshot jsonb not null default '{}'::jsonb,
  input_tokens int,
  output_tokens int,
  estimated_cost numeric(12, 6),
  latency_ms int,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  deleted_at timestamptz,
  constraint assistant_response_variants_turn_fk
    foreign key (turn_id, chat_id, user_id)
    references public.message_turns(id, chat_id, user_id)
    on delete cascade,
  constraint assistant_response_variants_id_turn_chat_user_unique
    unique (id, turn_id, chat_id, user_id),
  constraint assistant_response_variants_turn_index_unique unique (turn_id, variant_index),
  constraint assistant_response_variants_variant_index_nonnegative check (variant_index >= 0),
  constraint assistant_response_variants_status_check
    check (status in ('placeholder', 'pending', 'streaming', 'completed', 'failed', 'cancelled')),
  constraint assistant_response_variants_api_model_4o_check
    check (
      api_model_id is null
      or api_model_id in (
        'gpt-4o-2024-05-13',
        'gpt-4o-2024-08-06',
        'gpt-4o-2024-11-20'
      )
    ),
  constraint assistant_response_variants_snapshot_4o_check
    check (
      selected_model_snapshot is null
      or selected_model_snapshot in ('4o-0513', '4o-0806', '4o-1120')
    ),
  constraint assistant_response_variants_input_tokens_nonnegative
    check (input_tokens is null or input_tokens >= 0),
  constraint assistant_response_variants_output_tokens_nonnegative
    check (output_tokens is null or output_tokens >= 0),
  constraint assistant_response_variants_estimated_cost_nonnegative
    check (estimated_cost is null or estimated_cost >= 0),
  constraint assistant_response_variants_latency_nonnegative
    check (latency_ms is null or latency_ms >= 0)
);

create table public.turn_active_variants (
  turn_id uuid primary key,
  chat_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  assistant_response_variant_id uuid not null,
  updated_at timestamptz not null default now(),
  constraint turn_active_variants_turn_fk
    foreign key (turn_id, chat_id, user_id)
    references public.message_turns(id, chat_id, user_id)
    on delete cascade,
  constraint turn_active_variants_variant_same_turn_fk
    foreign key (assistant_response_variant_id, turn_id, chat_id, user_id)
    references public.assistant_response_variants(id, turn_id, chat_id, user_id)
    on delete cascade
);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  turn_id uuid,
  user_message_id uuid,
  kind text not null,
  storage_bucket text,
  storage_path text,
  mime_type text,
  byte_size int,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint attachments_chat_user_fk
    foreign key (chat_id, user_id)
    references public.chats(id, user_id)
    on delete cascade,
  constraint attachments_turn_same_chat_fk
    foreign key (turn_id, chat_id, user_id)
    references public.message_turns(id, chat_id, user_id)
    on delete cascade,
  constraint attachments_user_message_same_chat_fk
    foreign key (user_message_id, chat_id, user_id)
    references public.user_messages(id, chat_id, user_id)
    on delete cascade,
  constraint attachments_kind_check check (kind in ('image', 'audio', 'pdf', 'other')),
  constraint attachments_byte_size_nonnegative check (byte_size is null or byte_size >= 0)
);

create table public.message_web_search_refs (
  id uuid primary key default gen_random_uuid(),
  assistant_response_variant_id uuid not null,
  turn_id uuid not null,
  chat_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null,
  query text,
  title text,
  url text,
  snippet text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint message_web_search_refs_variant_fk
    foreign key (assistant_response_variant_id, turn_id, chat_id, user_id)
    references public.assistant_response_variants(id, turn_id, chat_id, user_id)
    on delete cascade,
  constraint message_web_search_refs_mode_check check (mode in ('off', 'auto', 'required'))
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger chats_set_updated_at
before update on public.chats
for each row execute function public.set_updated_at();

create trigger turn_active_variants_set_updated_at
before update on public.turn_active_variants
for each row execute function public.set_updated_at();

create index chats_user_updated_idx on public.chats(user_id, updated_at desc) where deleted_at is null;
create index message_turns_chat_order_idx on public.message_turns(chat_id, user_id, turn_index);
create index user_messages_turn_idx on public.user_messages(turn_id, created_at);
create index assistant_response_variants_turn_idx
  on public.assistant_response_variants(turn_id, variant_index);
create index attachments_chat_idx on public.attachments(chat_id, user_id);
create index message_web_search_refs_variant_idx
  on public.message_web_search_refs(assistant_response_variant_id);

grant usage on schema public to authenticated;

grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update on table public.chats to authenticated;
grant select, insert, update on table public.message_turns to authenticated;
grant select, insert, update on table public.user_messages to authenticated;
grant select, insert, update on table public.assistant_response_variants to authenticated;
grant select, insert, update on table public.turn_active_variants to authenticated;
grant select, insert, update on table public.attachments to authenticated;
grant select, insert, update on table public.message_web_search_refs to authenticated;

alter table public.profiles enable row level security;
alter table public.chats enable row level security;
alter table public.message_turns enable row level security;
alter table public.user_messages enable row level security;
alter table public.assistant_response_variants enable row level security;
alter table public.turn_active_variants enable row level security;
alter table public.attachments enable row level security;
alter table public.message_web_search_refs enable row level security;

create policy profiles_select_own on public.profiles
for select using (id = auth.uid());

create policy profiles_insert_own on public.profiles
for insert with check (id = auth.uid());

create policy profiles_update_own on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid());

create policy chats_select_own on public.chats
for select using (user_id = auth.uid());

create policy chats_insert_own on public.chats
for insert with check (user_id = auth.uid());

create policy chats_update_own on public.chats
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy message_turns_select_own on public.message_turns
for select using (user_id = auth.uid());

create policy message_turns_insert_own_chat on public.message_turns
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.chats
    where chats.id = message_turns.chat_id
      and chats.user_id = auth.uid()
      and chats.deleted_at is null
  )
);

create policy message_turns_update_own on public.message_turns
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy user_messages_select_own on public.user_messages
for select using (user_id = auth.uid());

create policy user_messages_insert_own_turn on public.user_messages
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.message_turns
    where message_turns.id = user_messages.turn_id
      and message_turns.chat_id = user_messages.chat_id
      and message_turns.user_id = auth.uid()
      and message_turns.deleted_at is null
  )
);

create policy user_messages_update_own on public.user_messages
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy assistant_response_variants_select_own on public.assistant_response_variants
for select using (user_id = auth.uid());

create policy assistant_response_variants_insert_own_turn on public.assistant_response_variants
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.message_turns
    where message_turns.id = assistant_response_variants.turn_id
      and message_turns.chat_id = assistant_response_variants.chat_id
      and message_turns.user_id = auth.uid()
      and message_turns.deleted_at is null
  )
);

create policy assistant_response_variants_update_own on public.assistant_response_variants
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy turn_active_variants_select_own on public.turn_active_variants
for select using (user_id = auth.uid());

create policy turn_active_variants_insert_own_variant on public.turn_active_variants
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.assistant_response_variants
    where assistant_response_variants.id = turn_active_variants.assistant_response_variant_id
      and assistant_response_variants.turn_id = turn_active_variants.turn_id
      and assistant_response_variants.chat_id = turn_active_variants.chat_id
      and assistant_response_variants.user_id = auth.uid()
      and assistant_response_variants.deleted_at is null
  )
);

create policy turn_active_variants_update_own_variant on public.turn_active_variants
for update using (user_id = auth.uid()) with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.assistant_response_variants
    where assistant_response_variants.id = turn_active_variants.assistant_response_variant_id
      and assistant_response_variants.turn_id = turn_active_variants.turn_id
      and assistant_response_variants.chat_id = turn_active_variants.chat_id
      and assistant_response_variants.user_id = auth.uid()
      and assistant_response_variants.deleted_at is null
  )
);

create policy attachments_select_own on public.attachments
for select using (user_id = auth.uid());

create policy attachments_insert_own_chat on public.attachments
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.chats
    where chats.id = attachments.chat_id
      and chats.user_id = auth.uid()
      and chats.deleted_at is null
  )
);

create policy attachments_update_own on public.attachments
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy message_web_search_refs_select_own on public.message_web_search_refs
for select using (user_id = auth.uid());

create policy message_web_search_refs_insert_own_variant on public.message_web_search_refs
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.assistant_response_variants
    where assistant_response_variants.id = message_web_search_refs.assistant_response_variant_id
      and assistant_response_variants.turn_id = message_web_search_refs.turn_id
      and assistant_response_variants.chat_id = message_web_search_refs.chat_id
      and assistant_response_variants.user_id = auth.uid()
      and assistant_response_variants.deleted_at is null
  )
);

create policy message_web_search_refs_update_own on public.message_web_search_refs
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

comment on table public.message_turns is
  'A user turn. User edits create a new turn/branch rather than overwriting existing user_messages.content_raw.';
comment on column public.message_turns.turn_index is
  'Stable ordering key within a chat. App code should allocate the next index transactionally.';
comment on column public.message_turns.branch_from_turn_id is
  'Future branch/resend support. Edits should branch from an existing turn instead of mutating it.';
comment on table public.assistant_response_variants is
  'Regenerate creates a new assistant response variant for the same message_turns.id; it is not a new user prompt.';
comment on table public.turn_active_variants is
  'Selected assistant response variant per turn. Future regenerate/active-variant updates should use a transaction or RPC.';
comment on column public.user_messages.content_raw is
  'Raw user Markdown/text. Treat as untrusted input and sanitize on render.';
comment on column public.assistant_response_variants.content_raw is
  'Raw assistant Markdown/text. Treat model output as untrusted input and sanitize on render.';
comment on table public.message_web_search_refs is
  'Future web search references. External URLs are untrusted and must be sanitized/safely rendered.';
