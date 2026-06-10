"use client";

import { ChevronDown } from "lucide-react";

import type { ApiSettingSubcategory } from "@/lib/openai/api-setting-subcategories";
import type { ResponseSettings } from "@/lib/openai/response-settings";
import type { Gpt4oSnapshotLabel } from "@/types/chat";

type ResponseSettingsEffectivePreviewProps = {
  appliedSettings: ResponseSettings;
  dirty: boolean;
  selectedSnapshot: Gpt4oSnapshotLabel;
  unusedSubcategories: readonly ApiSettingSubcategory[];
};

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <li className="flex flex-col gap-1 rounded-lg border border-border/60 bg-background/45 px-3 py-2 text-xs sm:flex-row sm:items-center sm:justify-between">
      <span className="font-medium text-foreground">{label}</span>
      <span className="text-muted-foreground">{value}</span>
    </li>
  );
}

export function ResponseSettingsEffectivePreview({
  appliedSettings,
  dirty,
  selectedSnapshot,
  unusedSubcategories,
}: ResponseSettingsEffectivePreviewProps) {
  const sentRows: SummaryRowProps[] = [
    { label: "model / モデル", value: selectedSnapshot },
    ...(appliedSettings.developerInstructions.trim()
      ? [
          {
            label: "Developer instructions / 開発者指示",
            value: "設定済み",
          },
        ]
      : []),
    ...(appliedSettings.customUserInstructions.trim()
      ? [
          {
            label: "Custom user instructions / カスタム指示",
            value: "設定済み",
          },
        ]
      : []),
    ...(appliedSettings.maxOutputTokens === null
      ? []
      : [
          {
            label: "max_output_tokens / 最大出力トークン",
            value: appliedSettings.maxOutputTokens.toLocaleString(),
          },
        ]),
    ...(appliedSettings.temperature === null
      ? []
      : [
          {
            label: "temperature / 温度サンプリング",
            value: String(appliedSettings.temperature),
          },
        ]),
    ...(appliedSettings.topP === null
      ? []
      : [
          {
            label: "top_p / 候補範囲",
            value: String(appliedSettings.topP),
          },
        ]),
    { label: "store / OpenAI側保存", value: "false 固定" },
    { label: "stream / ストリーミング", value: "false 固定" },
    { label: "tools / ツール", value: "[] 固定" },
    { label: "tool_choice / ツール選択", value: "none 固定" },
  ];
  const defaultRows = [
    ...(appliedSettings.maxOutputTokens === null
      ? ["max_output_tokens / 最大出力トークン"]
      : []),
    ...(appliedSettings.temperature === null
      ? ["temperature / 温度サンプリング"]
      : []),
    ...(appliedSettings.topP === null ? ["top_p / 候補範囲"] : []),
  ];

  return (
    <section className="space-y-3 rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold leading-6 text-foreground">
            次回送信に使われる設定
          </h3>
          <span className="rounded-full border border-emerald-400/35 bg-emerald-400/10 px-2 py-1 text-[11px] font-medium text-emerald-300">
            保存済み設定の要約
          </span>
        </div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          保存済みの設定だけが、次回送信・次回再生成で使われます。未保存の入力中の内容はまだ使われません。
        </p>
        {dirty ? (
          <p className="mt-2 rounded-lg border border-amber-400/35 bg-amber-400/10 px-3 py-2 text-xs font-medium leading-5 text-amber-200">
            未保存の変更があります。この要約にはまだ反映されていません。
          </p>
        ) : null}
      </div>

      <div>
        <h4 className="text-xs font-semibold leading-5 text-foreground">
          次回APIへ送る設定
        </h4>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          開発者指示とカスタム指示は、保存済みの内容がある場合だけ「設定済み」と表示します。本文自体は表示しません。
        </p>
        <ul className="mt-2 grid gap-2">
          {sentRows.map((row) => (
            <SummaryRow key={row.label} {...row} />
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-blue-400/25 bg-blue-400/5 p-3">
        <h4 className="text-xs font-semibold leading-5 text-foreground">
          APIデフォルトに任せる設定
        </h4>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          ここにある項目は値を指定していないためAPIへ送りません。OpenAI
          API側の通常の挙動に任せます。
        </p>
        {defaultRows.length ? (
          <ul className="mt-2 grid gap-1 text-xs leading-5 text-muted-foreground">
            {defaultRows.map((label) => (
              <li key={label}>・{label}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            未指定の設定はありません。
          </p>
        )}
      </div>

      <details className="rounded-lg border border-zinc-400/25 bg-zinc-400/5 p-3">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-semibold leading-5 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
          <ChevronDown aria-hidden="true" className="size-4" />
          この画面ではまだ使わない項目（{unusedSubcategories.length}件）
        </summary>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          以下は棚卸しのみです。入力欄・toggle・実行ボタンはなく、次回送信には入りません。
        </p>
        <ul className="mt-2 grid gap-1 text-xs leading-5 text-muted-foreground sm:grid-cols-2">
          {unusedSubcategories.map((subcategory) => (
            <li key={subcategory.id}>
              {subcategory.categoryNumber}-{subcategory.subcategoryNumber}.{" "}
              {subcategory.displayName}
            </li>
          ))}
        </ul>
      </details>

      <p className="text-xs leading-5 text-muted-foreground">
        この要約にAPI
        key、通常メッセージ本文、会話履歴本文は表示しません。タイトル自動生成と回答候補の切り替えには反映されません。
      </p>
    </section>
  );
}
