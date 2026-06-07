"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { useState } from "react";

import { ChatDeleteDialog } from "@/components/chat-delete-dialog";
import { ChatRenameDialog } from "@/components/chat-rename-dialog";
import { buttonVariants } from "@/components/ui/button";
import { getChatDisplayTitle } from "@/lib/chat-display";
import { cn } from "@/lib/utils";
import type { ChatListItem } from "@/types/chat";

type ChatListRowProps = {
  chat: ChatListItem;
  selected: boolean;
};

type ActiveDialog = "delete" | "rename" | null;

export function ChatListRow({ chat, selected }: ChatListRowProps) {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
  const title = getChatDisplayTitle(chat.title);

  return (
    <div
      className={cn(
        "group flex h-10 w-full items-center rounded-2xl pr-1 transition-colors focus-within:bg-accent/70 hover:bg-accent/70",
        selected && "bg-accent text-accent-foreground shadow-inner",
      )}
    >
      <Link
        aria-current={selected ? "page" : undefined}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 min-w-0 flex-1 justify-start overflow-hidden rounded-2xl px-2 text-left hover:bg-transparent hover:shadow-none",
        )}
        href={`/chat/${chat.id}`}
      >
        <MessageSquare aria-hidden="true" className="size-4 shrink-0" />
        <span className="truncate leading-none">{title}</span>
      </Link>
      <div className="flex shrink-0 items-center opacity-70 transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
        <ChatRenameDialog
          chatId={chat.id}
          currentTitle={title}
          disabled={activeDialog !== null}
          onOpenChange={(open) => setActiveDialog(open ? "rename" : null)}
          open={activeDialog === "rename"}
        />
        <ChatDeleteDialog
          chatId={chat.id}
          chatTitle={title}
          disabled={activeDialog !== null}
          isCurrentChat={selected}
          onOpenChange={(open) => setActiveDialog(open ? "delete" : null)}
          open={activeDialog === "delete"}
        />
      </div>
    </div>
  );
}
