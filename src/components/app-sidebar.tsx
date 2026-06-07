import Link from "next/link";
import { BookOpen, Settings } from "lucide-react";

import { createChatAction } from "@/app/chat/actions";
import { AccountMenu } from "@/components/account-menu";
import { ChatListRow } from "@/components/chat-list-row";
import { NewChatForm } from "@/components/new-chat-submit-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AuthenticatedProfile } from "@/types/auth";
import type { ChatListItem } from "@/types/chat";

const navItems = [
  { label: "ナレッジ管理", icon: BookOpen },
  { label: "設定", icon: Settings },
];

type AppSidebarProps = {
  chats: ChatListItem[];
  className?: string;
  currentChatId: string | null;
  profile: AuthenticatedProfile;
};

export function AppSidebar({
  chats,
  className,
  currentChatId,
  profile,
}: AppSidebarProps) {
  return (
    <aside
      aria-label="チャットナビゲーション"
      className={cn(
        "h-dvh w-72 shrink-0 flex-col border-r border-border/70 bg-card/70 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur",
        className,
      )}
    >
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <div className="flex items-center px-2 py-2">
          <Link className="text-base font-semibold leading-none" href="/">
            4oSphere
          </Link>
        </div>
        <NewChatForm action={createChatAction} />
        <div className="mt-5 min-h-0 flex-1 overflow-y-auto">
          <div className="px-2 text-xs font-medium text-muted-foreground">
            チャット一覧
          </div>
          <nav aria-label="チャット一覧" className="mt-2 space-y-1">
            {chats.length ? (
              chats.map((chat) => (
                <ChatListRow
                  chat={chat}
                  key={chat.id}
                  selected={chat.id === currentChatId}
                />
              ))
            ) : (
              <p className="px-2 py-2 text-sm leading-6 text-muted-foreground">
                まだチャットはありません
              </p>
            )}
          </nav>
        </div>
        <nav
          aria-label="アプリナビゲーション"
          className="mt-4 shrink-0 space-y-1"
        >
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Button
                className="h-10 w-full justify-start rounded-2xl px-2"
                key={item.label}
                variant="ghost"
              >
                <Icon aria-hidden="true" className="size-4" />
                <span className="leading-none">{item.label}</span>
              </Button>
            );
          })}
        </nav>
        <AccountMenu displayName={profile.displayName} />
      </div>
    </aside>
  );
}
