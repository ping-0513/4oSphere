import Link from "next/link";
import {
  BookOpen,
  LogOut,
  MessageSquare,
  Plus,
  Settings,
  User,
} from "lucide-react";

import { logoutAction } from "@/app/auth/actions";
import { createChatAction } from "@/app/chat/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AuthenticatedProfile } from "@/types/auth";
import type { ChatListItem } from "@/types/chat";

const navItems = [
  { label: "Knowledge", icon: BookOpen },
  { label: "Settings", icon: Settings },
  { label: "Account", icon: User },
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
      aria-label="Chat navigation"
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
        <form action={createChatAction}>
          <Button
            className="mt-2 h-11 w-full justify-start rounded-2xl shadow-sm shadow-primary/10"
            type="submit"
            variant="default"
          >
            <Plus aria-hidden="true" className="size-4" />
            <span className="leading-none">New chat</span>
          </Button>
        </form>
        <div className="mt-5 min-h-0 flex-1 overflow-y-auto">
          <div className="px-2 text-xs font-medium uppercase tracking-normal text-muted-foreground">
            Chats
          </div>
          <nav aria-label="Chats" className="mt-2 space-y-1">
            {chats.length ? (
              chats.map((chat) => {
                const selected = chat.id === currentChatId;

                return (
                  <Link
                    aria-current={selected ? "page" : undefined}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "h-10 w-full justify-start overflow-hidden rounded-2xl px-2 text-left",
                      selected && "bg-accent text-accent-foreground",
                    )}
                    href={`/chat/${chat.id}`}
                    key={chat.id}
                  >
                    <MessageSquare
                      aria-hidden="true"
                      className="size-4 shrink-0"
                    />
                    <span className="truncate leading-none">{chat.title}</span>
                  </Link>
                );
              })
            ) : (
              <p className="px-2 py-2 text-sm leading-6 text-muted-foreground">
                No chats yet
              </p>
            )}
          </nav>
        </div>
        <nav
          aria-label="App navigation"
          className="mt-4 shrink-0 space-y-1 border-t border-border/70 pt-3"
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
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="grid size-8 place-items-center rounded-full border border-border/70 bg-accent/60">
              <User aria-hidden="true" className="size-4" />
            </div>
            <span className="min-w-0 truncate text-sm text-muted-foreground">
              {profile.displayName}
            </span>
          </div>
          <form action={logoutAction}>
            <Button
              className="h-10 w-full justify-start rounded-2xl px-2"
              type="submit"
              variant="ghost"
            >
              <LogOut aria-hidden="true" className="size-4" />
              <span className="leading-none">Logout</span>
            </Button>
          </form>
        </nav>
      </div>
    </aside>
  );
}
