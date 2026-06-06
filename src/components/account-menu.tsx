"use client";

import { useState } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";

import { logoutAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AccountMenuProps = {
  displayName: string;
};

export function AccountMenu({ displayName }: AccountMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative border-t border-border/70 pt-3">
      {open ? (
        <div className="absolute bottom-12 left-0 right-0 z-30 rounded-2xl border border-border/70 bg-popover/95 p-1.5 shadow-xl shadow-black/20 backdrop-blur">
          <Button
            className="h-10 w-full justify-start rounded-xl px-2"
            disabled
            variant="ghost"
          >
            <User aria-hidden="true" className="size-4" />
            <span className="leading-none">アカウント</span>
          </Button>
          <form action={logoutAction}>
            <Button
              className="h-10 w-full justify-start rounded-xl px-2"
              type="submit"
              variant="ghost"
            >
              <LogOut aria-hidden="true" className="size-4" />
              <span className="leading-none">ログアウト</span>
            </Button>
          </form>
        </div>
      ) : null}
      <Button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="アカウントメニュー"
        className={cn(
          "h-11 w-full justify-start rounded-2xl px-2",
          open && "bg-accent text-accent-foreground shadow-inner",
        )}
        onClick={() => setOpen((value) => !value)}
        variant="ghost"
      >
        <div className="grid size-8 shrink-0 place-items-center rounded-full border border-border/70 bg-accent/60">
          <User aria-hidden="true" className="size-4" />
        </div>
        <span className="min-w-0 flex-1 truncate text-left leading-none">
          {displayName}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn("size-4 transition-transform", open && "rotate-180")}
        />
      </Button>
    </div>
  );
}
