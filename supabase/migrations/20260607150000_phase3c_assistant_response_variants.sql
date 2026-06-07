-- Phase 3C: regenerate and switch completed assistant response variants.
-- Until branch/edit/resend exists, both operations are limited to the latest
-- visible turn so downstream conversation context cannot become inconsistent.

create or replace function public.save_regenerated_assistant_response(
  p_turn_id uuid,
  p_content_raw text,
  p_api_model_id text,
  p_selected_model_snapshot text,
  p_settings_snapshot jsonb,
  p_input_tokens int,
  p_output_tokens int,
  p_latency_ms int
)
returns table (
  assistant_response_variant_id uuid,
  variant_index int
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_chat_id uuid;
  v_turn_index bigint;
  v_variant_id uuid;
  v_variant_index int;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'not_authenticated';
  end if;

  if p_content_raw is null or length(btrim(p_content_raw)) = 0 then
    raise exception using errcode = '22023', message = 'assistant_content_blank';
  end if;

  if not (
    (p_selected_model_snapshot = '4o-0513' and p_api_model_id = 'gpt-4o-2024-05-13')
    or (p_selected_model_snapshot = '4o-0806' and p_api_model_id = 'gpt-4o-2024-08-06')
    or (p_selected_model_snapshot = '4o-1120' and p_api_model_id = 'gpt-4o-2024-11-20')
  ) then
    raise exception using errcode = '22023', message = 'unsupported_model_snapshot';
  end if;

  select c.id
  into v_chat_id
  from public.chats c
  join public.message_turns mt
    on mt.chat_id = c.id
    and mt.user_id = c.user_id
  where mt.id = p_turn_id
    and mt.user_id = v_user_id
    and mt.deleted_at is null
    and c.user_id = v_user_id
    and c.deleted_at is null
  for update of c;

  if not found then
    raise exception using errcode = 'P0002', message = 'turn_not_available';
  end if;

  select mt.turn_index
  into v_turn_index
  from public.message_turns mt
  where mt.id = p_turn_id
    and mt.chat_id = v_chat_id
    and mt.user_id = v_user_id
    and mt.deleted_at is null
  for update;

  if not found
    or v_turn_index <> (
      select max(latest_mt.turn_index)
      from public.message_turns latest_mt
      where latest_mt.chat_id = v_chat_id
        and latest_mt.user_id = v_user_id
        and latest_mt.deleted_at is null
    )
  then
    raise exception using errcode = 'P0002', message = 'turn_not_available';
  end if;

  if not exists (
    select 1
    from public.user_messages um
    where um.turn_id = p_turn_id
      and um.chat_id = v_chat_id
      and um.user_id = v_user_id
      and um.deleted_at is null
  ) or not exists (
    select 1
    from public.turn_active_variants tav
    join public.assistant_response_variants arv
      on arv.id = tav.assistant_response_variant_id
      and arv.turn_id = tav.turn_id
      and arv.chat_id = tav.chat_id
      and arv.user_id = tav.user_id
    where tav.turn_id = p_turn_id
      and tav.chat_id = v_chat_id
      and tav.user_id = v_user_id
      and arv.status = 'completed'
      and arv.deleted_at is null
  ) then
    raise exception using errcode = 'P0002', message = 'turn_not_available';
  end if;

  select coalesce(max(arv.variant_index), -1) + 1
  into v_variant_index
  from public.assistant_response_variants arv
  where arv.turn_id = p_turn_id;

  insert into public.assistant_response_variants (
    turn_id,
    chat_id,
    user_id,
    variant_index,
    content_raw,
    status,
    api_model_id,
    selected_model_snapshot,
    settings_snapshot,
    input_tokens,
    output_tokens,
    estimated_cost,
    latency_ms,
    completed_at
  )
  values (
    p_turn_id,
    v_chat_id,
    v_user_id,
    v_variant_index,
    p_content_raw,
    'completed',
    p_api_model_id,
    p_selected_model_snapshot,
    coalesce(p_settings_snapshot, '{}'::jsonb),
    p_input_tokens,
    p_output_tokens,
    null,
    p_latency_ms,
    now()
  )
  returning id into v_variant_id;

  update public.turn_active_variants
  set assistant_response_variant_id = v_variant_id
  where turn_id = p_turn_id
    and chat_id = v_chat_id
    and user_id = v_user_id;

  if not found then
    raise exception using errcode = 'P0002', message = 'turn_not_available';
  end if;

  return query
  select v_variant_id, v_variant_index;
end;
$$;

create or replace function public.set_active_assistant_response_variant(
  p_turn_id uuid,
  p_assistant_response_variant_id uuid
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_chat_id uuid;
  v_turn_index bigint;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'not_authenticated';
  end if;

  select c.id
  into v_chat_id
  from public.chats c
  join public.message_turns mt
    on mt.chat_id = c.id
    and mt.user_id = c.user_id
  where mt.id = p_turn_id
    and mt.user_id = v_user_id
    and mt.deleted_at is null
    and c.user_id = v_user_id
    and c.deleted_at is null
  for update of c;

  if not found then
    raise exception using errcode = 'P0002', message = 'turn_not_available';
  end if;

  select mt.turn_index
  into v_turn_index
  from public.message_turns mt
  where mt.id = p_turn_id
    and mt.chat_id = v_chat_id
    and mt.user_id = v_user_id
    and mt.deleted_at is null
  for update;

  if not found
    or v_turn_index <> (
      select max(latest_mt.turn_index)
      from public.message_turns latest_mt
      where latest_mt.chat_id = v_chat_id
        and latest_mt.user_id = v_user_id
        and latest_mt.deleted_at is null
    )
  then
    raise exception using errcode = 'P0002', message = 'turn_not_available';
  end if;

  if not exists (
    select 1
    from public.user_messages um
    where um.turn_id = p_turn_id
      and um.chat_id = v_chat_id
      and um.user_id = v_user_id
      and um.deleted_at is null
  ) or not exists (
    select 1
    from public.assistant_response_variants arv
    where arv.id = p_assistant_response_variant_id
      and arv.turn_id = p_turn_id
      and arv.chat_id = v_chat_id
      and arv.user_id = v_user_id
      and arv.status = 'completed'
      and arv.deleted_at is null
  ) then
    raise exception using errcode = 'P0002', message = 'turn_not_available';
  end if;

  update public.turn_active_variants
  set assistant_response_variant_id = p_assistant_response_variant_id
  where turn_id = p_turn_id
    and chat_id = v_chat_id
    and user_id = v_user_id;

  if not found then
    raise exception using errcode = 'P0002', message = 'turn_not_available';
  end if;

  return v_chat_id;
end;
$$;

revoke all on function public.save_regenerated_assistant_response(
  uuid, text, text, text, jsonb, int, int, int
) from public;
revoke all on function public.save_regenerated_assistant_response(
  uuid, text, text, text, jsonb, int, int, int
) from anon;
grant execute on function public.save_regenerated_assistant_response(
  uuid, text, text, text, jsonb, int, int, int
) to authenticated;

revoke all on function public.set_active_assistant_response_variant(uuid, uuid)
from public;
revoke all on function public.set_active_assistant_response_variant(uuid, uuid)
from anon;
grant execute on function public.set_active_assistant_response_variant(uuid, uuid)
to authenticated;
