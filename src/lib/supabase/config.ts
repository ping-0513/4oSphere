type SupabasePublicConfig = {
  url: string;
  publishableKey: string;
  keySource: "publishable" | "anon";
};

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = publishableKey || anonKey;

  if (!url || !key) {
    return null;
  }

  return {
    url,
    publishableKey: key,
    keySource: publishableKey ? "publishable" : "anon",
  };
}

export function requireSupabasePublicConfig(): SupabasePublicConfig {
  const config = getSupabasePublicConfig();

  if (!config) {
    throw new Error(
      "Supabase public environment variables are not configured.",
    );
  }

  return config;
}
