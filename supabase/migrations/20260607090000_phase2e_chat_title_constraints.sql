-- Phase 2E: enforce the same chat-title rules used by the client and server.
-- This migration intentionally does not rewrite existing data. It can fail if
-- existing chat titles are whitespace-only or longer than 80 characters.

alter table public.chats
add constraint chats_title_present_check
check (title ~ '[^[:space:]]');

alter table public.chats
add constraint chats_title_max_length_check
check (char_length(title) <= 80);
