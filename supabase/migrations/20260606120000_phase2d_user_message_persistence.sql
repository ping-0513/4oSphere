-- Phase 2D: persist user messages without creating assistant responses.
-- The function is security invoker so authenticated grants and RLS remain
-- authoritative. It accepts no user_id and derives ownership from auth.uid().

create or replace function public.create_user_message_turn(
  p_chat_id uuid,
  p_content_raw text
)
returns table (
  turn_id uuid,
  user_message_id uuid,
  turn_index bigint
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_turn_id uuid;
  v_user_message_id uuid;
  v_turn_index bigint;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'not_authenticated';
  end if;

  if p_content_raw is null or length(btrim(p_content_raw)) = 0 then
    raise exception using errcode = '22023', message = 'message_blank';
  end if;

  if char_length(p_content_raw) > 20000 then
    raise exception using errcode = '22001', message = 'message_too_long';
  end if;

  perform 1
  from public.chats
  where id = p_chat_id
    and user_id = v_user_id
    and deleted_at is null
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'chat_not_available';
  end if;

  select coalesce(max(mt.turn_index), -1) + 1
  into v_turn_index
  from public.message_turns mt
  where mt.chat_id = p_chat_id
    and mt.user_id = v_user_id;

  insert into public.message_turns (
    chat_id,
    user_id,
    turn_index
  )
  values (
    p_chat_id,
    v_user_id,
    v_turn_index
  )
  returning id into v_turn_id;

  insert into public.user_messages (
    turn_id,
    chat_id,
    user_id,
    content_raw
  )
  values (
    v_turn_id,
    p_chat_id,
    v_user_id,
    p_content_raw
  )
  returning id into v_user_message_id;

  update public.chats
  set updated_at = now()
  where id = p_chat_id
    and user_id = v_user_id
    and deleted_at is null;

  return query
  select v_turn_id, v_user_message_id, v_turn_index;
end;
$$;

revoke all on function public.create_user_message_turn(uuid, text) from public;
revoke all on function public.create_user_message_turn(uuid, text) from anon;
grant execute on function public.create_user_message_turn(uuid, text) to authenticated;
