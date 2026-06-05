"use server";

import { redirect } from "next/navigation";

import { getVerifiedUserId } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createChatAction() {
  const supabase = await createSupabaseServerClient();
  const userId = await getVerifiedUserId(supabase);

  if (!userId) {
    redirect("/");
  }

  const { data, error } = await supabase
    .from("chats")
    .insert({ user_id: userId })
    .select("id")
    .single();

  if (error || !data?.id) {
    throw new Error("Failed to create chat.");
  }

  // Phase 2D message inserts must also update chats.updated_at for list order.
  redirect(`/chat/${data.id}`);
}
