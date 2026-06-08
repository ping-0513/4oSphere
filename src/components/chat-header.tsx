"use client";

import { Menu } from "lucide-react";

import { ModelSnapshotSelect } from "@/components/settings/model-snapshot-select";
import { Button } from "@/components/ui/button";
import type { Gpt4oSnapshotLabel } from "@/types/chat";

type ChatHeaderProps = {
  currentChatTitle: string | null;
  onMenuClick: () => void;
  onSelectedSnapshotChange: (snapshot: Gpt4oSnapshotLabel) => void;
  selectedSnapshot: Gpt4oSnapshotLabel;
};

export function ChatHeader({
  currentChatTitle,
  onMenuClick,
  onSelectedSnapshotChange,
  selectedSnapshot,
}: ChatHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/70 bg-background/90 px-3 backdrop-blur md:px-4">
      <Button
        aria-label="ナビゲーションを開く"
        className="rounded-xl md:hidden"
        onClick={onMenuClick}
        size="icon"
        title="ナビゲーションを開く"
        variant="ghost"
      >
        <Menu aria-hidden="true" className="size-5" />
      </Button>
      <div className="relative flex min-w-0 flex-1 items-center gap-3">
        <ModelSnapshotSelect
          onSelectedSnapshotChange={onSelectedSnapshotChange}
          selectedSnapshot={selectedSnapshot}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {currentChatTitle ?? "チャットが選択されていません"}
          </p>
        </div>
      </div>
    </header>
  );
}
