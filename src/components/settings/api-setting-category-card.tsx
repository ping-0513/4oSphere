"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import { SettingsHelpPopover } from "@/components/settings/settings-help-popover";
import {
  API_SETTING_STATUS_LABELS,
  type ApiSettingCategory,
} from "@/lib/openai/api-setting-categories";
import { cn } from "@/lib/utils";

const statusClassNames = {
  implemented: "border-primary/35 bg-primary/12 text-primary shadow-primary/10",
  planned: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  admin: "border-amber-400/35 bg-amber-400/10 text-amber-200",
  legacy: "border-zinc-400/30 bg-zinc-400/10 text-zinc-200",
  "needs-confirmation": "border-violet-400/35 bg-violet-400/10 text-violet-200",
  unsupported: "border-destructive/35 bg-destructive/10 text-destructive",
} satisfies Record<ApiSettingCategory["status"], string>;

type ApiSettingCategoryCardProps = {
  category: ApiSettingCategory;
  children?: ReactNode;
  collapsed: boolean;
  onToggle: () => void;
};

export function ApiSettingCategoryCard({
  category,
  children,
  collapsed,
  onToggle,
}: ApiSettingCategoryCardProps) {
  return (
    <article className="rounded-2xl border border-border/70 bg-card/70 shadow-sm shadow-black/10">
      <div className="flex items-start gap-2 p-3">
        <button
          aria-expanded={!collapsed}
          className="min-w-0 flex-1 rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          onClick={onToggle}
          type="button"
        >
          <span className="flex min-w-0 items-center gap-2">
            <ChevronDown
              aria-hidden="true"
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform",
                collapsed && "-rotate-90",
              )}
            />
            <span className="min-w-0">
              <span className="block text-sm font-semibold leading-6 text-foreground">
                {category.displayName}
              </span>
            </span>
          </span>
        </button>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-1 text-[11px] font-medium leading-none",
            statusClassNames[category.status],
          )}
        >
          {API_SETTING_STATUS_LABELS[category.status]}
        </span>
        <SettingsHelpPopover
          detailDescription={category.detailDescription}
          label={category.displayName}
          shortDescription={category.shortDescription}
        />
      </div>
      <div className="px-3 pb-3">
        <p className="text-sm leading-6 text-muted-foreground">
          {category.shortDescription}
        </p>
        {!collapsed ? (
          <div className="mt-3 space-y-3 rounded-xl border border-border/70 bg-background/35 p-3 text-sm leading-6">
            <p>{category.detailDescription}</p>
            <dl className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-[7rem_1fr]">
              <dt className="font-medium text-foreground">officialPath</dt>
              <dd>{category.officialPath}</dd>
              <dt className="font-medium text-foreground">phase</dt>
              <dd>{category.phase}</dd>
              <dt className="font-medium text-foreground">notes</dt>
              <dd>{category.notes}</dd>
            </dl>
            {children ?? (
              <p className="rounded-xl border border-dashed border-border/80 px-3 py-2 text-xs text-muted-foreground">
                このカテゴリの個別設定は後続フェーズで追加します。
              </p>
            )}
          </div>
        ) : null}
      </div>
    </article>
  );
}
