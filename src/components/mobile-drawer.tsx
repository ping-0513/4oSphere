"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import type { AuthenticatedProfile } from "@/types/auth";

type MobileDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: AuthenticatedProfile;
};

export function MobileDrawer({
  open,
  onOpenChange,
  profile,
}: MobileDrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm md:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 left-0 z-50 max-h-dvh w-[min(88vw,20rem)] overflow-hidden rounded-r-3xl border-r border-border/70 bg-card/85 shadow-xl shadow-black/25 outline-none backdrop-blur md:hidden"
        >
          <Dialog.Title className="sr-only">ナビゲーション</Dialog.Title>
          <AppSidebar className="flex w-full border-r-0" profile={profile} />
          <Dialog.Close asChild>
            <Button
              aria-label="ナビゲーションを閉じる"
              className="absolute right-3 top-3 rounded-2xl"
              size="icon"
              variant="ghost"
            >
              <X aria-hidden="true" className="size-4" />
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
