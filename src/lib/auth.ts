import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AuthenticatedProfile } from "@/types/auth";

type AuthenticatedAppContext = {
  status: "authenticated";
  supabase: SupabaseClient;
  userId: string;
  profile: AuthenticatedProfile;
};

type UnauthenticatedAppContext = {
  status: "unauthenticated" | "unconfigured";
};

export async function getVerifiedUserId(supabase: SupabaseClient) {
  const { data: claimsData, error } = await supabase.auth.getClaims();

  if (error || !claimsData?.claims.sub) {
    return null;
  }

  return claimsData.claims.sub;
}

export async function getAuthenticatedAppContext(): Promise<
  AuthenticatedAppContext | UnauthenticatedAppContext
> {
  if (!getSupabasePublicConfig()) {
    return { status: "unconfigured" };
  }

  const supabase = await createSupabaseServerClient();
  const userId = await getVerifiedUserId(supabase);

  if (!userId) {
    return { status: "unauthenticated" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  return {
    status: "authenticated",
    supabase,
    userId,
    profile: {
      id: userId,
      displayName: profile?.display_name?.trim() || "アカウント",
      avatarUrl: profile?.avatar_url ?? null,
    },
  };
}
