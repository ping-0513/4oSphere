"use client";

import { useState } from "react";
import { Check, ChevronDown, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GPT_4O_MODEL_OPTIONS } from "@/lib/openai/models";
import { cn } from "@/lib/utils";
import type { Gpt4oSnapshotLabel } from "@/types/chat";

type ChatHeaderProps = {
  onMenuClick: () => void;
  currentChatTitle: string | null;
  onSelectedSnapshotChange: (snapshot: Gpt4oSnapshotLabel) => void;
  selectedSnapshot: Gpt4oSnapshotLabel;
};

export function ChatHeader({
  currentChatTitle,
  onMenuClick,
  onSelectedSnapshotChange,
  selectedSnapshot,
}: ChatHeaderProps) {
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const selectedModel =
    GPT_4O_MODEL_OPTIONS.find((model) => model.label === selectedSnapshot) ??
    GPT_4O_MODEL_OPTIONS[2];

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
        <Button
          aria-expanded={modelMenuOpen}
          aria-haspopup="listbox"
          aria-label={`選択中のモデル ${selectedModel.label}`}
          className={cn(
            "h-11 min-w-36 justify-between rounded-2xl border border-border/70 bg-card/75 px-4 text-base font-semibold leading-none shadow-sm shadow-black/10 backdrop-blur hover:bg-accent/80",
            modelMenuOpen && "border-ring/60 bg-accent/80 ring-2 ring-ring/20",
          )}
          onClick={() => setModelMenuOpen((open) => !open)}
          title={`選択中: ${selectedModel.label}`}
          variant="outline"
        >
          <span>{selectedModel.label}</span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              modelMenuOpen && "rotate-180",
            )}
          />
        </Button>
        {modelMenuOpen ? (
          <div
            aria-label="モデル選択"
            className="absolute left-0 top-12 z-30 w-72 rounded-3xl border border-border/70 bg-popover/90 p-2 shadow-xl shadow-black/20 backdrop-blur"
            role="listbox"
          >
            {GPT_4O_MODEL_OPTIONS.map((model) => (
              <button
                aria-selected={selectedModel.label === model.label}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left text-sm text-popover-foreground outline-none transition-[background-color,box-shadow,transform] hover:bg-accent/80 active:translate-y-px active:scale-[0.98] active:shadow-inner focus-visible:ring-2 focus-visible:ring-ring/50",
                  selectedModel.label === model.label && "bg-accent/80",
                )}
                key={model.apiModelId}
                onClick={() => {
                  onSelectedSnapshotChange(model.label);
                  setModelMenuOpen(false);
                }}
                role="option"
                type="button"
              >
                <span className="min-w-0 leading-tight">
                  <span className="block font-medium">{model.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {model.apiModelId}
                  </span>
                </span>
                {selectedModel.label === model.label ? (
                  <Check aria-hidden="true" className="size-4 shrink-0" />
                ) : null}
              </button>
            ))}
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {currentChatTitle ?? "チャットが選択されていません"}
          </p>
        </div>
      </div>
    </header>
  );
}
