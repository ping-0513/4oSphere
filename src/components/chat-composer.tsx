"use client";

import { Globe, ImagePlus, Mic, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ChatComposer() {
  return (
    <footer className="shrink-0 border-t border-border/70 bg-background/90 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <div className="flex items-center gap-2">
          <Button
            aria-label="画像添付はまだ利用できません"
            className="rounded-2xl"
            disabled
            size="icon"
            title="画像添付はまだ利用できません"
            variant="outline"
          >
            <ImagePlus aria-hidden="true" className="size-4" />
          </Button>
          <Button
            aria-label="音声入力はまだ利用できません"
            className="rounded-2xl"
            disabled
            size="icon"
            title="音声入力はまだ利用できません"
            variant="outline"
          >
            <Mic aria-hidden="true" className="size-4" />
          </Button>
          <Button
            aria-label="Web 検索はまだ利用できません"
            className="rounded-2xl"
            disabled
            size="icon"
            title="Web 検索はまだ利用できません"
            variant="outline"
          >
            <Globe aria-hidden="true" className="size-4" />
          </Button>
          <p className="ml-1 text-xs leading-5 text-muted-foreground">
            現在はチャット作成と選択のみ確認できます。
          </p>
        </div>

        <div className="rounded-3xl border border-input/60 bg-card/45 p-2 opacity-75 shadow-inner">
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <label className="sr-only" htmlFor="message-composer">
                メッセージ
              </label>
              <textarea
                aria-describedby="composer-unavailable-note"
                className="min-h-20 w-full cursor-not-allowed resize-none rounded-2xl bg-transparent px-3 py-2 text-sm leading-6 text-muted-foreground outline-none placeholder:text-muted-foreground/80 disabled:opacity-100"
                disabled
                id="message-composer"
                placeholder="メッセージ送信は次のフェーズで実装します"
                rows={2}
              />
            </div>
            <Button
              aria-label="送信はまだ利用できません"
              className="mb-1 shrink-0 rounded-2xl"
              disabled
              size="icon"
              title="送信はまだ利用できません"
              variant="default"
            >
              <Send aria-hidden="true" className="size-4" />
            </Button>
          </div>
          <p
            className="px-3 pb-1 text-xs leading-5 text-muted-foreground"
            id="composer-unavailable-note"
          >
            メッセージの保存・送信は次のフェーズで追加します。
          </p>
        </div>
      </div>
    </footer>
  );
}
