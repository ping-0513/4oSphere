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
  implemented: "border-emerald-400/35 bg-emerald-400/10 text-emerald-300",
  planned: "border-zinc-400/30 bg-zinc-400/10 text-zinc-300",
  admin: "border-red-400/35 bg-red-400/10 text-red-300",
  legacy: "border-amber-400/35 bg-amber-400/10 text-amber-200",
  "needs-confirmation": "border-violet-400/35 bg-violet-400/10 text-violet-200",
  unsupported: "border-destructive/35 bg-destructive/10 text-destructive",
} satisfies Record<ApiSettingCategory["status"], string>;

type ApiSettingCategoryCardProps = {
  category: ApiSettingCategory;
  children?: ReactNode;
  collapsed: boolean;
  matchingSubcategoryCount: number;
  onToggle: () => void;
  searchOrFilterActive: boolean;
};

export function ApiSettingCategoryCard({
  category,
  children,
  collapsed,
  matchingSubcategoryCount,
  onToggle,
  searchOrFilterActive,
}: ApiSettingCategoryCardProps) {
  const contentId = `settings-category-${category.id}-content`;

  return (
    <article className="rounded-2xl border border-border/70 bg-card/70 shadow-sm shadow-black/10">
      <div className="flex flex-wrap items-start gap-2 p-3">
        <button
          aria-controls={contentId}
          aria-expanded={!collapsed}
          aria-label={`${category.displayName} を${collapsed ? "開く" : "閉じる"}`}
          className="min-w-0 flex-1 cursor-pointer rounded-xl p-1 text-left outline-none transition-colors hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring/50"
          onClick={onToggle}
          type="button"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background shadow-sm">
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "size-4 text-muted-foreground transition-transform",
                  collapsed && "-rotate-90",
                )}
              />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold leading-6 text-foreground">
                {category.displayOrder}. {category.displayName}
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
        {searchOrFilterActive ? (
          <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[11px] font-medium leading-none text-primary">
            {matchingSubcategoryCount
              ? `子設定 ${matchingSubcategoryCount}件一致${collapsed ? "・開いて確認" : ""}`
              : "親カテゴリが一致"}
          </span>
        ) : null}
        <SettingsHelpPopover
          detailDescription={category.detailDescription}
          label={category.displayName}
          shortDescription={category.shortDescription}
        />
      </div>
      <div className="px-3 pb-3">
        <p className="break-words text-sm leading-6 text-muted-foreground">
          {category.shortDescription}
        </p>
        {!collapsed ? (
          <div
            className="mt-3 space-y-3 rounded-xl border border-border/70 bg-background/35 p-3 text-sm leading-6"
            id={contentId}
          >
            {children ?? (
              <p className="rounded-xl border border-dashed border-border/80 px-3 py-2 text-xs text-muted-foreground">
                このカテゴリの個別設定は後続フェーズで追加します。
              </p>
            )}
            <details className="rounded-xl border border-border/70 bg-card/50 p-3 text-xs text-muted-foreground">
              <summary className="cursor-pointer font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                開発者向け詳細
              </summary>
              <p className="mt-3 leading-5">{category.detailDescription}</p>
              <dl className="mt-3 grid gap-2 sm:grid-cols-[7rem_1fr]">
                <dt className="font-medium text-foreground">officialPath</dt>
                <dd className="break-words [overflow-wrap:anywhere]">
                  {category.officialPath}
                </dd>
                <dt className="font-medium text-foreground">phase</dt>
                <dd className="break-words [overflow-wrap:anywhere]">
                  {category.phase}
                </dd>
                <dt className="font-medium text-foreground">notes</dt>
                <dd className="break-words [overflow-wrap:anywhere]">
                  {category.notes}
                </dd>
              </dl>
            </details>
          </div>
        ) : null}
      </div>
    </article>
  );
}
