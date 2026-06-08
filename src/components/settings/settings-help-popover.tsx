"use client";

import { HelpCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type SettingsHelpPopoverProps = {
  detailDescription: string;
  label: string;
  shortDescription: string;
};

export function SettingsHelpPopover({
  detailDescription,
  label,
  shortDescription,
}: SettingsHelpPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        aria-expanded={open}
        aria-label={`${label} の説明を${open ? "閉じる" : "開く"}`}
        className="size-8 rounded-xl"
        onClick={() => setOpen((value) => !value)}
        title={`${label} の説明`}
        variant="ghost"
      >
        <HelpCircle aria-hidden="true" className="size-4" />
      </Button>
      {open ? (
        <div
          className="absolute right-0 top-9 z-40 w-[min(82vw,22rem)] rounded-2xl border border-border/70 bg-popover/95 p-3 text-sm shadow-xl shadow-black/20 backdrop-blur"
          role="note"
        >
          <p className="font-medium leading-6 text-popover-foreground">
            {shortDescription}
          </p>
          <p className="mt-2 leading-6 text-muted-foreground">
            {detailDescription}
          </p>
        </div>
      ) : null}
    </div>
  );
}
