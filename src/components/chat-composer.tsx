"use client";

import { Globe, ImagePlus, Mic } from "lucide-react";

import { MessageComposerForm } from "@/components/message-composer-form";
import { Button } from "@/components/ui/button";

type ChatComposerProps = {
  chatId: string;
};

export function ChatComposer({ chatId }: ChatComposerProps) {
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
            現在はユーザーメッセージの保存のみ利用できます。
          </p>
        </div>
        <MessageComposerForm chatId={chatId} />
      </div>
    </footer>
  );
}
