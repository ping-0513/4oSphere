import { AppShell } from "@/components/app-shell";
import { LoginPanel } from "@/components/auth/login-panel";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{
    auth_error?: string;
  }>;
};

function getFallbackDisplayName(userId: string) {
  return `User ${userId.slice(0, 8)}`;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const supabaseConfigured = Boolean(getSupabasePublicConfig());

  if (!supabaseConfigured) {
    return (
      <LoginPanel
        authError={params.auth_error === "1"}
        supabaseConfigured={false}
      />
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims.sub) {
    return (
      <LoginPanel
        authError={params.auth_error === "1"}
        supabaseConfigured={true}
      />
    );
  }

  const userId = claimsData.claims.sub;
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  return (
    <AppShell
      profile={{
        id: userId,
        displayName: profile?.display_name ?? getFallbackDisplayName(userId),
        avatarUrl: profile?.avatar_url ?? null,
      }}
    />
  );
}
