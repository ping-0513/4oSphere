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
  "Current shell",
  "Knowledge notes",
  "Draft conversation",
  "Mobile layout check",
];

const navItems = [
  { label: "Knowledge management", icon: BookOpen },
  { label: "Settings", icon: Settings },
  { label: "Account", icon: User },
  { label: "Logout", icon: LogOut },
];

type AppSidebarProps = {
  className?: string;
};

export function AppSidebar({ className }: AppSidebarProps) {
  return (
    <aside
      aria-label="Chat navigation"
      className={cn(
        "h-dvh w-72 shrink-0 flex-col border-r border-border bg-card/60 px-3 py-3",
        className,
      )}
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex items-center px-2 py-2">
          <span className="text-base font-semibold">4oSphere</span>
        </div>
        <Button className="mt-2 justify-start" variant="outline">
          <Plus aria-hidden="true" className="size-4" />
          New chat
        </Button>
        <div className="mt-5 min-h-0 flex-1 overflow-y-auto">
          <div className="px-2 text-xs font-medium uppercase tracking-normal text-muted-foreground">
            Chat list
          </div>
          <nav aria-label="Chat list" className="mt-2 space-y-1">
            {chatItems.map((item) => (
              <Button
                className="w-full justify-start overflow-hidden px-2 text-left"
                key={item}
                variant="ghost"
              >
                <MessageSquare aria-hidden="true" className="size-4 shrink-0" />
                <span className="truncate">{item}</span>
              </Button>
            ))}
          </nav>
        </div>
        <nav
          aria-label="App navigation"
          className="mt-4 space-y-1 border-t pt-3"
        >
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Button
                className="w-full justify-start px-2"
                key={item.label}
                variant="ghost"
              >
                <Icon aria-hidden="true" className="size-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
