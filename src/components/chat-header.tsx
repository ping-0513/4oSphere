"use client";

import { useState } from "react";
import { Check, ChevronDown, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatHeaderProps = {
  onMenuClick: () => void;
  currentChatTitle: string | null;
};

const modelOptions = [
  { label: "4o-0513", modelId: "gpt-4o-2024-05-13" },
  { label: "4o-0806", modelId: "gpt-4o-2024-08-06" },
  { label: "4o-1120", modelId: "gpt-4o-2024-11-20" },
] as const;

export function ChatHeader({ currentChatTitle, onMenuClick }: ChatHeaderProps) {
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<
    (typeof modelOptions)[number]
  >(modelOptions[2]);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/70 bg-background/90 px-3 backdrop-blur md:px-4">
      <Button
        aria-label="ナビゲーションを開く"
        className="rounded-xl md:hidden"
        onClick={onMenuClick}
        size="icon"
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
            "h-11 min-w-40 justify-between rounded-2xl border border-border/70 bg-card/75 px-4 text-base font-semibold leading-none shadow-sm shadow-black/10 backdrop-blur transition-colors hover:bg-accent/80",
            modelMenuOpen && "border-ring/60 bg-accent/80 ring-2 ring-ring/20",
          )}
          onClick={() => setModelMenuOpen((open) => !open)}
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
            aria-label="モデル候補"
            className="absolute left-0 top-12 z-30 w-72 rounded-3xl border border-border/70 bg-popover/90 p-2 shadow-xl shadow-black/20 backdrop-blur"
            role="listbox"
          >
            {modelOptions.map((model) => (
              <button
                aria-selected={selectedModel.label === model.label}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left text-sm text-popover-foreground outline-none transition-colors hover:bg-accent/80 focus-visible:ring-2 focus-visible:ring-ring/50",
                  selectedModel.label === model.label && "bg-accent/80",
                )}
                key={model.modelId}
                onClick={() => {
                  setSelectedModel(model);
                  setModelMenuOpen(false);
                }}
                role="option"
                type="button"
              >
                <span className="min-w-0 leading-tight">
                  <span className="block font-medium">{model.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {model.modelId}
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
            {currentChatTitle ?? "No chat selected"}
          </p>
        </div>
      </div>
    </header>
  );
}
