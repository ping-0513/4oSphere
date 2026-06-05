"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";

type MobileDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileDrawer({ open, onOpenChange }: MobileDrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm md:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 left-0 z-50 w-[min(84vw,20rem)] border-r border-border bg-card shadow-xl outline-none md:hidden"
        >
          <Dialog.Title className="sr-only">Navigation</Dialog.Title>
          <AppSidebar className="flex w-full border-r-0" />
          <Dialog.Close asChild>
            <Button
              aria-label="Close navigation"
              className="absolute right-3 top-3"
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
