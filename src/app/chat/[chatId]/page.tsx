import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { LoginPanel } from "@/components/auth/login-panel";
import { getAuthenticatedAppContext } from "@/lib/auth";
import { getVisibleChatById, listVisibleChats } from "@/lib/chats";

export const dynamic = "force-dynamic";

type ChatPageProps = {
  params: Promise<{
    chatId: string;
  }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params;
  const auth = await getAuthenticatedAppContext();

  if (auth.status !== "authenticated") {
    return (
      <LoginPanel
        authError={false}
        supabaseConfigured={auth.status !== "unconfigured"}
      />
    );
  }

  const [chats, currentChat] = await Promise.all([
    listVisibleChats(auth.supabase),
    getVisibleChatById(auth.supabase, chatId),
  ]);

  if (!currentChat) {
    notFound();
  }

  return (
    <AppShell chats={chats} currentChat={currentChat} profile={auth.profile} />
  );
}
