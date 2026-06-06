"use client";

import { useState } from "react";
import { LoaderCircle, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type LoginPanelProps = {
  authError?: boolean;
  supabaseConfigured: boolean;
};

export function LoginPanel({ authError, supabaseConfigured }: LoginPanelProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function signInWithGoogle() {
    setPending(true);
    setErrorMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMessage("Google ログインを開始できませんでした。");
        setPending(false);
      }
    } catch {
      setErrorMessage("Supabase の公開環境変数が設定されていません。");
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-dvh bg-background px-4 py-8 text-foreground">
      <section className="mx-auto flex w-full max-w-sm flex-col justify-center">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">4oSphere</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight">
            GPT-4o チャット
          </h1>
        </div>
        <Button
          className="h-12 rounded-2xl text-base"
          disabled={!supabaseConfigured || pending}
          onClick={signInWithGoogle}
          variant="default"
        >
          {pending ? (
            <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
          ) : (
            <LogIn aria-hidden="true" className="size-5" />
          )}
          <span>{pending ? "接続中..." : "Google でログイン"}</span>
        </Button>
        {!supabaseConfigured ? (
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Supabase の公開環境変数を設定してください。
          </p>
        ) : null}
        {authError ? (
          <p className="mt-4 text-sm leading-6 text-destructive">
            認証を完了できませんでした。
          </p>
        ) : null}
        {errorMessage ? (
          <p className="mt-4 text-sm leading-6 text-destructive">
            {errorMessage}
          </p>
        ) : null}
      </section>
    </main>
  );
}
