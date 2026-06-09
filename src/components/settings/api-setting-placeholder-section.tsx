"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { SettingsHelpPopover } from "@/components/settings/settings-help-popover";
import { Button } from "@/components/ui/button";
import type { ApiSettingSubcategory } from "@/lib/openai/api-setting-subcategories";
import { cn } from "@/lib/utils";

const subcategoryStatusClassNames = {
  implemented: "border-emerald-400/35 bg-emerald-400/10 text-emerald-300",
  planned: "border-zinc-400/30 bg-zinc-400/10 text-zinc-300",
  fixed: "border-blue-400/35 bg-blue-400/10 text-blue-300",
  placeholder: "border-zinc-400/30 bg-zinc-400/10 text-zinc-200",
  "needs-confirmation": "border-violet-400/35 bg-violet-400/10 text-violet-200",
  admin: "border-red-400/35 bg-red-400/10 text-red-300",
  legacy: "border-zinc-500/30 bg-zinc-500/10 text-zinc-200",
  unsupported: "border-destructive/35 bg-destructive/10 text-destructive",
} satisfies Record<ApiSettingSubcategory["status"], string>;

type ApiSettingPlaceholderSectionProps = {
  categoryDisplayName: string;
  categoryDisplayOrder: number;
  heading?: string;
  subcategories: readonly ApiSettingSubcategory[];
};

function getFriendlyStatusClassName(subcategory: ApiSettingSubcategory) {
  return subcategory.id === "common-api-key"
    ? subcategoryStatusClassNames.admin
    : subcategoryStatusClassNames[subcategory.status];
}

function getInventoryRowClassName(subcategory: ApiSettingSubcategory) {
  if (subcategory.status === "admin" || subcategory.status === "unsupported") {
    return "border-red-400/35 bg-red-400/5";
  }

  if (subcategory.status === "needs-confirmation") {
    return "border-violet-400/35 bg-violet-400/5";
  }

  return "border-border/80 bg-card/45";
}

function ApiSettingSubcategoryRow({
  subcategory,
}: {
  subcategory: ApiSettingSubcategory;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsId = `${subcategory.id}-developer-details`;

  return (
    <article
      className={cn(
        "rounded-xl border border-dashed p-3",
        getInventoryRowClassName(subcategory),
      )}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold leading-6">
              {subcategory.categoryNumber}-{subcategory.subcategoryNumber}.{" "}
              {subcategory.displayName}
            </h4>
            <span
              className={cn(
                "rounded-full border px-2 py-1 text-[11px] font-medium leading-none",
                getFriendlyStatusClassName(subcategory),
              )}
            >
              {subcategory.displayStatusLabel}
            </span>
          </div>
        </div>
        <SettingsHelpPopover
          detailDescription={subcategory.detailDescription}
          label={subcategory.displayName}
          shortDescription={subcategory.shortDescription}
        />
      </div>
      <dl className="mt-2 grid gap-1 text-xs leading-5 text-muted-foreground">
        <div>
          <dt className="inline font-medium text-foreground">これは何？ </dt>
          <dd className="inline">{subcategory.what}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-foreground">
            変えるとどうなる？{" "}
          </dt>
          <dd className="inline">{subcategory.effect}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-foreground">いつ触る？ </dt>
          <dd className="inline">{subcategory.whenToUse}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-foreground">おすすめ </dt>
          <dd className="inline">{subcategory.recommendation}</dd>
        </div>
      </dl>
      <Button
        aria-controls={detailsId}
        aria-expanded={detailsOpen}
        aria-label={`${subcategory.displayName} の開発者向け詳細を${detailsOpen ? "閉じる" : "開く"}`}
        className="mt-2 h-9 cursor-pointer rounded-lg border border-border bg-background px-3 text-xs shadow-sm"
        onClick={() => setDetailsOpen((current) => !current)}
        size="sm"
        variant="outline"
      >
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-3.5 transition-transform",
            !detailsOpen && "-rotate-90",
          )}
        />
        開発者向け詳細
      </Button>
      {detailsOpen ? (
        <dl
          className="mt-2 grid gap-2 rounded-lg border border-border/60 bg-background/35 p-3 text-xs text-muted-foreground sm:grid-cols-[8rem_1fr]"
          id={detailsId}
        >
          <dt className="font-medium text-foreground">表示名</dt>
          <dd>{subcategory.displayName}</dd>
          <dt className="font-medium text-foreground">officialPath</dt>
          <dd>{subcategory.officialPath}</dd>
          <dt className="font-medium text-foreground">4oSphereでの扱い</dt>
          <dd>{subcategory.implementation}</dd>
          <dt className="font-medium text-foreground">UI配置案</dt>
          <dd>{subcategory.uiPlacement}</dd>
          <dt className="font-medium text-foreground">phase</dt>
          <dd>{subcategory.phase}</dd>
          <dt className="font-medium text-foreground">注意点</dt>
          <dd>{subcategory.risk}</dd>
        </dl>
      ) : null}
    </article>
  );
}

export function ApiSettingPlaceholderSection({
  categoryDisplayName,
  categoryDisplayOrder,
  heading,
  subcategories,
}: ApiSettingPlaceholderSectionProps) {
  if (!subcategories.length) {
    return (
      <p className="rounded-xl border border-dashed border-border/80 px-3 py-2 text-xs text-muted-foreground">
        このカテゴリの子設定候補は後続フェーズで追加します。
      </p>
    );
  }

  return (
    <section className="space-y-3">
      <div className="rounded-xl border border-dashed border-border/80 bg-card/45 p-3">
        <h3 className="text-sm font-semibold leading-6">
          {heading ??
            `${categoryDisplayOrder}. ${categoryDisplayName} の設定項目`}
        </h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          点線の項目は説明・棚卸し用です。入力欄ではなく、現在は画面から変更できません。
        </p>
      </div>
      <div className="grid gap-2">
        {subcategories.map((subcategory) => (
          <ApiSettingSubcategoryRow
            key={subcategory.id}
            subcategory={subcategory}
          />
        ))}
      </div>
    </section>
  );
}
