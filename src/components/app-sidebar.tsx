import {
  BookOpen,
  LogOut,
  MessageSquare,
  Plus,
  Settings,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const chatItems = [
  "現在のシェル",
  "ナレッジメモ",
  "下書きチャット",
  "モバイル表示確認",
];

const navItems = [
  { label: "ナレッジ管理", icon: BookOpen },
  { label: "設定", icon: Settings },
  { label: "アカウント", icon: User },
  { label: "ログアウト", icon: LogOut },
];

type AppSidebarProps = {
  className?: string;
};

export function AppSidebar({ className }: AppSidebarProps) {
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
          <span className="text-base font-semibold leading-none">4oSphere</span>
        </div>
        <Button
          className="mt-2 h-11 justify-start rounded-2xl shadow-sm shadow-primary/10"
          variant="default"
        >
          <Plus aria-hidden="true" className="size-4" />
          <span className="leading-none">新しいチャット</span>
        </Button>
        <div className="mt-5 min-h-0 flex-1 overflow-y-auto">
          <div className="px-2 text-xs font-medium uppercase tracking-normal text-muted-foreground">
            チャット一覧
          </div>
          <nav aria-label="チャット一覧" className="mt-2 space-y-1">
            {chatItems.map((item) => (
              <Button
                className="h-10 w-full justify-start overflow-hidden rounded-2xl px-2 text-left"
                key={item}
                variant="ghost"
              >
                <MessageSquare aria-hidden="true" className="size-4 shrink-0" />
                <span className="truncate leading-none">{item}</span>
              </Button>
            ))}
          </nav>
        </div>
        <nav
          aria-label="アプリナビゲーション"
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
        </nav>
      </div>
    </aside>
  );
}
