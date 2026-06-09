"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { SettingsHelpPopover } from "@/components/settings/settings-help-popover";
import { Button } from "@/components/ui/button";
import {
  API_SETTING_SUBCATEGORY_STATUS_LABELS,
  type ApiSettingSubcategory,
} from "@/lib/openai/api-setting-subcategories";
import { cn } from "@/lib/utils";

const subcategoryStatusClassNames = {
  implemented: "border-primary/35 bg-primary/12 text-primary shadow-primary/10",
  planned: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  fixed: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  placeholder: "border-zinc-400/30 bg-zinc-400/10 text-zinc-200",
  "needs-confirmation": "border-violet-400/35 bg-violet-400/10 text-violet-200",
  admin: "border-amber-400/35 bg-amber-400/10 text-amber-200",
  legacy: "border-zinc-500/30 bg-zinc-500/10 text-zinc-200",
  unsupported: "border-destructive/35 bg-destructive/10 text-destructive",
} satisfies Record<ApiSettingSubcategory["status"], string>;

type ApiSettingPlaceholderSectionProps = {
  categoryDisplayName: string;
  subcategories: readonly ApiSettingSubcategory[];
};

function ApiSettingSubcategoryRow({
  subcategory,
}: {
  subcategory: ApiSettingSubcategory;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsId = `${subcategory.id}-developer-details`;

  return (
    <article className="rounded-xl border border-border/70 bg-card/60 p-3">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold leading-6">
              {subcategory.displayName}
            </h4>
            <span
              className={cn(
                "rounded-full border px-2 py-1 text-[11px] font-medium leading-none",
                subcategoryStatusClassNames[subcategory.status],
              )}
            >
              {API_SETTING_SUBCATEGORY_STATUS_LABELS[subcategory.status]}
            </span>
          </div>
        </div>
        <SettingsHelpPopover
          detailDescription={subcategory.detailDescription}
          label={subcategory.displayName}
          shortDescription={subcategory.shortDescription}
        />
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {subcategory.shortDescription}
      </p>
      <Button
        aria-controls={detailsId}
        aria-expanded={detailsOpen}
        className="mt-2 h-8 rounded-lg px-2 text-xs"
        onClick={() => setDetailsOpen((current) => !current)}
        size="sm"
        variant="ghost"
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
          <dd>{subcategory.caution}</dd>
        </dl>
      ) : null}
    </article>
  );
}

export function ApiSettingPlaceholderSection({
  categoryDisplayName,
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
          {categoryDisplayName} の子設定候補
        </h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          ここにある項目はOpenAI
          APIで触れる挙動の棚卸しです。実装済み以外はまだAPI
          payloadへ反映せず、disabled / placeholder / plannedとして残します。
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
