"use client";

import { BookOpen, Globe, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

type ChatHeaderProps = {
  knowledgeEnabled: boolean;
  onKnowledgeChange: (enabled: boolean) => void;
  onMenuClick: () => void;
  onWebChange: (enabled: boolean) => void;
  webEnabled: boolean;
};

export function ChatHeader({
  knowledgeEnabled,
  onKnowledgeChange,
  onMenuClick,
  onWebChange,
  webEnabled,
}: ChatHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 px-3 md:px-4">
      <Button
        aria-label="Open navigation"
        className="md:hidden"
        onClick={onMenuClick}
        size="icon"
        variant="ghost"
      >
        <Menu aria-hidden="true" className="size-5" />
      </Button>
      <div className="min-w-0 flex-1">
        <Button
          aria-label="Selected model 4o"
          className="h-9 px-3 text-base"
          variant="ghost"
        >
          4o
        </Button>
      </div>
      <Button
        aria-pressed={knowledgeEnabled}
        className="px-2 sm:px-3"
        onClick={() => onKnowledgeChange(!knowledgeEnabled)}
        size="sm"
        variant={knowledgeEnabled ? "default" : "outline"}
      >
        <BookOpen aria-hidden="true" className="size-4" />
        <span className="hidden sm:inline">
          Knowledge {knowledgeEnabled ? "ON" : "OFF"}
        </span>
        <span className="sm:hidden">{knowledgeEnabled ? "K ON" : "K OFF"}</span>
      </Button>
      <Button
        aria-pressed={webEnabled}
        className="px-2 sm:px-3"
        onClick={() => onWebChange(!webEnabled)}
        size="sm"
        variant={webEnabled ? "default" : "outline"}
      >
        <Globe aria-hidden="true" className="size-4" />
        <span className="hidden sm:inline">
          Web {webEnabled ? "ON" : "OFF"}
        </span>
        <span className="sm:hidden">{webEnabled ? "W ON" : "W OFF"}</span>
      </Button>
    </header>
  );
}
