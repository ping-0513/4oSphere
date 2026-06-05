import { NextResponse } from "next/server";

import { upsertProfileForUser } from "@/lib/profiles";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getSafeRedirect(origin: string, nextPath: string | null) {
  if (nextPath?.startsWith("/") && !nextPath.startsWith("//")) {
    return `${origin}${nextPath}`;
  }

  return `${origin}/`;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = getSafeRedirect(
    requestUrl.origin,
    requestUrl.searchParams.get("next"),
  );

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/?auth_error=1`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${requestUrl.origin}/?auth_error=1`);
  }

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (!claimsError && claimsData?.claims.sub) {
    const { data: userData } = await supabase.auth.getUser();

    if (userData.user?.id === claimsData.claims.sub) {
      await upsertProfileForUser(supabase, userData.user);
    }
  }

  return NextResponse.redirect(redirectTo);
}
