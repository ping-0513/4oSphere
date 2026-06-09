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
  categoryDisplayOrder: number;
  subcategories: readonly ApiSettingSubcategory[];
};

function getFriendlyStatus(subcategory: ApiSettingSubcategory) {
  if (subcategory.id === "common-api-key") {
    return "サーバー管理";
  }

  return API_SETTING_SUBCATEGORY_STATUS_LABELS[subcategory.status];
}

function getFriendlyStatusClassName(subcategory: ApiSettingSubcategory) {
  return subcategory.id === "common-api-key"
    ? subcategoryStatusClassNames.admin
    : subcategoryStatusClassNames[subcategory.status];
}

function getFriendlyGuidance(subcategory: ApiSettingSubcategory) {
  switch (subcategory.status) {
    case "implemented":
      return {
        effect: "現在の4oSphereの動作に使われています。",
        recommendation:
          "変更できる画面がある場合だけ、目的が明確なときに調整してください。",
        when: "現在の動作や設定内容を確認したいときに見ます。",
      };
    case "fixed":
      return {
        effect: "現在は安全な値またはサーバー側の設定に固定されています。",
        recommendation: "通常は触る必要がありません。",
        when: "なぜ変更できないかを確認したいときに見ます。",
      };
    case "admin":
      return {
        effect: "組織やサーバー全体へ影響する可能性があります。",
        recommendation: "通常ユーザーは触らず、管理者の判断に任せます。",
        when: "管理者が運用方針を検討するときに確認します。",
      };
    case "legacy":
      return {
        effect: "以前の方式との互換性に関係します。",
        recommendation: "新しく使い始める場合は現在のAPI機能を優先します。",
        when: "古い実装との互換性を調べるときだけ確認します。",
      };
    case "unsupported":
      return {
        effect: "4oSphereの現在の設計とは両立しないため使いません。",
        recommendation: "変更せず、代わりに現在対応している機能を使います。",
        when: "非対応の理由を確認したいときに見ます。",
      };
    case "needs-confirmation":
      return {
        effect: "対応可否や安全な使い方がまだ確定していません。",
        recommendation: "確認が終わるまで変更しません。",
        when: "将来の対応範囲を検討するときに確認します。",
      };
    case "planned":
    case "placeholder":
      return {
        effect: "現在は説明だけで、チャット生成の動作は変わりません。",
        recommendation: "実装されるまで触る必要はありません。",
        when: "今後追加される可能性のある設定を確認するときに見ます。",
      };
  }
}

function ApiSettingSubcategoryRow({
  categoryDisplayOrder,
  subcategory,
}: {
  categoryDisplayOrder: number;
  subcategory: ApiSettingSubcategory;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsId = `${subcategory.id}-developer-details`;
  const guidance = getFriendlyGuidance(subcategory);

  return (
    <article className="rounded-xl border border-dashed border-border/80 bg-card/45 p-3">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold leading-6">
              {categoryDisplayOrder}-{subcategory.order}.{" "}
              {subcategory.displayName}
            </h4>
            <span
              className={cn(
                "rounded-full border px-2 py-1 text-[11px] font-medium leading-none",
                getFriendlyStatusClassName(subcategory),
              )}
            >
              {getFriendlyStatus(subcategory)}
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
          <dd className="inline">{subcategory.shortDescription}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-foreground">
            変えるとどうなる？{" "}
          </dt>
          <dd className="inline">{guidance.effect}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-foreground">いつ触る？ </dt>
          <dd className="inline">{guidance.when}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-foreground">おすすめ </dt>
          <dd className="inline">{guidance.recommendation}</dd>
        </div>
      </dl>
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
  categoryDisplayOrder,
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
          {categoryDisplayOrder}. {categoryDisplayName} の設定項目
        </h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          点線の項目は説明・棚卸し用です。入力欄ではなく、現在は画面から変更できません。
        </p>
      </div>
      <div className="grid gap-2">
        {subcategories.map((subcategory) => (
          <ApiSettingSubcategoryRow
            categoryDisplayOrder={categoryDisplayOrder}
            key={subcategory.id}
            subcategory={subcategory}
          />
        ))}
      </div>
    </section>
  );
}
