-- Phase 3A: atomically save the first completed assistant response for a turn.
-- The function is security invoker, derives ownership from auth.uid(), and
-- does not bypass the existing authenticated grants or RLS policies.

create or replace function public.save_initial_assistant_response(
  p_turn_id uuid,
  p_content_raw text,
  p_api_model_id text,
  p_selected_model_snapshot text,
  p_settings_snapshot jsonb,
  p_input_tokens int,
  p_output_tokens int,
  p_latency_ms int
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_chat_id uuid;
  v_variant_id uuid;
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

  select mt.chat_id
  into v_chat_id
  from public.message_turns mt
  join public.chats c
    on c.id = mt.chat_id
    and c.user_id = mt.user_id
  where mt.id = p_turn_id
    and mt.user_id = v_user_id
    and mt.deleted_at is null
    and c.deleted_at is null
  for update of mt;

  if not found then
    raise exception using errcode = 'P0002', message = 'turn_not_available';
  end if;

  if exists (
    select 1
    from public.assistant_response_variants arv
    where arv.turn_id = p_turn_id
  ) then
    raise exception using errcode = '23505', message = 'initial_variant_exists';
  end if;

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
    0,
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

  insert into public.turn_active_variants (
    turn_id,
    chat_id,
    user_id,
    assistant_response_variant_id
  )
  values (
    p_turn_id,
    v_chat_id,
    v_user_id,
    v_variant_id
  )
  on conflict (turn_id) do update
  set
    chat_id = excluded.chat_id,
    user_id = excluded.user_id,
    assistant_response_variant_id = excluded.assistant_response_variant_id;

  return v_variant_id;
end;
$$;

revoke all on function public.save_initial_assistant_response(
  uuid, text, text, text, jsonb, int, int, int
) from public;
revoke all on function public.save_initial_assistant_response(
  uuid, text, text, text, jsonb, int, int, int
) from anon;
grant execute on function public.save_initial_assistant_response(
  uuid, text, text, text, jsonb, int, int, int
) to authenticated;
