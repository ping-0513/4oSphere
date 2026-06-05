import { AppShell } from "@/components/app-shell";
import { LoginPanel } from "@/components/auth/login-panel";
import { getAuthenticatedAppContext } from "@/lib/auth";
import { listVisibleChats } from "@/lib/chats";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{
    auth_error?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const auth = await getAuthenticatedAppContext();

  if (auth.status !== "authenticated") {
    return (
      <LoginPanel
        authError={params.auth_error === "1"}
        supabaseConfigured={auth.status !== "unconfigured"}
      />
    );
  }

  const chats = await listVisibleChats(auth.supabase);

  return <AppShell chats={chats} currentChat={null} profile={auth.profile} />;
}
