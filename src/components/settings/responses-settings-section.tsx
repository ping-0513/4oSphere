"use client";

import { LoaderCircle, Save, Undo2 } from "lucide-react";

import { SettingsHelpPopover } from "@/components/settings/settings-help-popover";
import { Button } from "@/components/ui/button";
import {
  MAX_MAX_OUTPUT_TOKENS,
  MAX_RESPONSE_INSTRUCTIONS_CHARACTERS,
  MAX_TEMPERATURE,
  MAX_TOP_P,
  MIN_MAX_OUTPUT_TOKENS,
  MIN_TEMPERATURE,
  MIN_TOP_P,
  type ResponseSettingsDraft,
  type ResponseSettingsFieldErrors,
} from "@/lib/openai/response-settings";
import type { Gpt4oSnapshotLabel } from "@/types/chat";

type ResponsesSettingsSectionProps = {
  dirty: boolean;
  draftSettings: ResponseSettingsDraft;
  fieldErrors: ResponseSettingsFieldErrors;
  onDiscard: () => void;
  onDraftSettingsChange: (settings: ResponseSettingsDraft) => void;
  onSave: () => void;
  saveStatus: "idle" | "saved" | "saving";
  selectedSnapshot: Gpt4oSnapshotLabel;
};

type TextareaSettingProps = {
  detail: string;
  error?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  shortDescription: string;
  value: string;
};

type NumberSettingProps = {
  detail: string;
  error?: string;
  id: string;
  label: string;
  max: number;
  min: number;
  onChange: (value: string) => void;
  shortDescription: string;
  step: number;
  value: string;
};

function countCharacters(value: string) {
  return Array.from(value).length;
}

function SectionTitle({
  children,
  description,
}: {
  children: string;
  description?: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold leading-6 text-foreground">
        {children}
      </h3>
      {description ? (
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function TextareaSetting({
  detail,
  error,
  id,
  label,
  onChange,
  placeholder,
  shortDescription,
  value,
}: TextareaSettingProps) {
  const characterCount = countCharacters(value);
  const statusId = `${id}-status`;

  return (
    <div className="rounded-xl border border-border/70 bg-card/60 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <label
            className="text-sm font-medium leading-6 text-foreground"
            htmlFor={id}
          >
            {label}
          </label>
          <p className="text-xs leading-5 text-muted-foreground">
            {shortDescription}
          </p>
        </div>
        <SettingsHelpPopover
          detailDescription={detail}
          label={label}
          shortDescription={shortDescription}
        />
      </div>
      <textarea
        aria-describedby={statusId}
        aria-invalid={Boolean(error)}
        className="mt-2 min-h-24 w-full resize-y rounded-xl border border-input bg-background px-3 py-2 text-sm leading-6 outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30"
        id={id}
        maxLength={MAX_RESPONSE_INSTRUCTIONS_CHARACTERS + 1}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
      <div
        className="mt-1 flex items-start justify-between gap-3 text-xs leading-5"
        id={statusId}
      >
        <p className={error ? "text-destructive" : "text-muted-foreground"}>
          {error ?? "保存するまで送信には反映されません。"}
        </p>
        <span
          className={
            characterCount > MAX_RESPONSE_INSTRUCTIONS_CHARACTERS
              ? "shrink-0 text-destructive"
              : "shrink-0 text-muted-foreground"
          }
        >
          {characterCount.toLocaleString()} /{" "}
          {MAX_RESPONSE_INSTRUCTIONS_CHARACTERS.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function NumberSetting({
  detail,
  error,
  id,
  label,
  max,
  min,
  onChange,
  shortDescription,
  step,
  value,
}: NumberSettingProps) {
  const statusId = `${id}-status`;

  return (
    <div className="rounded-xl border border-border/70 bg-card/60 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <label
            className="text-sm font-medium leading-6 text-foreground"
            htmlFor={id}
          >
            {label}
          </label>
          <p className="text-xs leading-5 text-muted-foreground">
            {shortDescription}
          </p>
        </div>
        <SettingsHelpPopover
          detailDescription={detail}
          label={label}
          shortDescription={shortDescription}
        />
      </div>
      <input
        aria-describedby={statusId}
        aria-invalid={Boolean(error)}
        className="mt-2 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30"
        id={id}
        max={max}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        step={step}
        type="number"
        value={value}
      />
      <p
        className={
          error
            ? "mt-1 text-xs leading-5 text-destructive"
            : "mt-1 text-xs leading-5 text-muted-foreground"
        }
        id={statusId}
      >
        {error ?? `範囲: ${min} - ${max.toLocaleString()}`}
      </p>
    </div>
  );
}

function FixedSettingRow({
  detail,
  label,
  value,
}: {
  detail: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-card/50 px-3 py-2">
      <div>
        <p className="text-sm font-medium leading-6 text-foreground">{label}</p>
        <p className="text-xs leading-5 text-muted-foreground">{detail}</p>
      </div>
      <span className="shrink-0 rounded-full border border-border/70 bg-background px-2 py-1 text-xs text-muted-foreground">
        {value}
      </span>
    </div>
  );
}

function SaveActionBar({
  dirty,
  onDiscard,
  onSave,
  saveStatus,
}: {
  dirty: boolean;
  onDiscard: () => void;
  onSave: () => void;
  saveStatus: ResponsesSettingsSectionProps["saveStatus"];
}) {
  const saving = saveStatus === "saving";

  return (
    <div className="sticky top-0 z-20 -mx-3 -mt-3 rounded-t-xl border-b border-border/70 bg-background/95 p-3 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p
            aria-live="polite"
            className={
              dirty ? "text-sm font-medium text-primary" : "text-sm font-medium"
            }
          >
            {saving
              ? "適用中..."
              : dirty
                ? "未保存の変更があります"
                : "適用済み（このタブ内）"}
          </p>
          <p className="text-xs leading-5 text-muted-foreground">
            変更を適用すると次回送信・次回再生成から反映されます。
          </p>
        </div>
        <div className="flex min-w-0 flex-wrap gap-2 sm:justify-end">
          <Button
            className="h-9 min-w-0 rounded-xl"
            disabled={!dirty || saving}
            onClick={onDiscard}
            size="sm"
            type="button"
            variant="outline"
          >
            <Undo2 aria-hidden="true" className="size-4" />
            変更を破棄
          </Button>
          <Button
            className="h-9 min-w-0 rounded-xl"
            disabled={!dirty || saving}
            onClick={onSave}
            size="sm"
            type="button"
            variant="default"
          >
            {saving ? (
              <LoaderCircle
                aria-hidden="true"
                className="size-4 animate-spin"
              />
            ) : (
              <Save aria-hidden="true" className="size-4" />
            )}
            変更を適用
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ResponsesSettingsSection({
  dirty,
  draftSettings,
  fieldErrors,
  onDiscard,
  onDraftSettingsChange,
  onSave,
  saveStatus,
  selectedSnapshot,
}: ResponsesSettingsSectionProps) {
  function update(next: Partial<ResponseSettingsDraft>) {
    onDraftSettingsChange({
      ...draftSettings,
      ...next,
      store: false,
      stream: false,
      toolChoice: "none",
      tools: [],
    });
  }

  return (
    <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-3">
      <SaveActionBar
        dirty={dirty}
        onDiscard={onDiscard}
        onSave={onSave}
        saveStatus={saveStatus}
      />

      <div>
        <h3 className="text-sm font-semibold leading-6 text-foreground">
          現在のチャット生成に反映される設定
        </h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          入力中の内容はdraftです。適用した設定だけが次回送信と次回再生成に反映されます。タイトル自動生成とvariant切り替えには反映されません。
        </p>
      </div>

      <section className="space-y-3">
        <SectionTitle description="文字入力系は通常メッセージと分けて扱います。">
          基本設定
        </SectionTitle>
        <TextareaSetting
          detail="Responses APIのinstructionsへ反映します。4oSphere側・開発者側がモデルに守らせたい基本方針です。通常メッセージ本文とは結合しません。"
          error={fieldErrors.developerInstructions}
          id="response-developer-instructions"
          label="Developer instructions / 開発者指示"
          onChange={(developerInstructions) =>
            update({ developerInstructions })
          }
          placeholder="このチャットでAIに守らせたい基本方針を入力"
          shortDescription="API payload上はinstructionsに入る上位指示です。"
          value={draftSettings.developerInstructions}
        />
        <TextareaSetting
          detail="ユーザーがこのチャット生成に追加したい回答の好み、口調、前提条件などです。Phase 4BではDeveloper instructionsと区切ってinstructionsへ合成します。"
          error={fieldErrors.customUserInstructions}
          id="response-custom-user-instructions"
          label="Custom user instructions / カスタム指示"
          onChange={(customUserInstructions) =>
            update({ customUserInstructions })
          }
          placeholder="回答の好み、口調、前提条件などを入力"
          shortDescription="通常メッセージ本文とは別の任意指示です。"
          value={draftSettings.customUserInstructions}
        />
      </section>

      <section className="space-y-3">
        <SectionTitle description="Responses APIに渡す入力の組み立てを表示します。">
          入力構成
        </SectionTitle>
        <FixedSettingRow
          detail="チャット下部の入力欄から送信されます。Settings panel内では編集しません。"
          label="Current user message / 通常メッセージ"
          value="composer"
        />
        <FixedSettingRow
          detail="Supabaseに保存されたturn履歴から構築します。"
          label="Conversation history / 会話履歴"
          value="DB"
        />
        <FixedSettingRow
          detail="active variantのみが履歴に使われます。"
          label="Assistant history / アシスタント履歴"
          value="active only"
        />
        <FixedSettingRow
          detail="既存の4o-only snapshot selectorで選択したモデルを使います。"
          label="model / モデル"
          value={selectedSnapshot}
        />
        <NumberSetting
          detail="Responses APIのmax_output_tokensに反映します。大きいほど長い応答を許容します。"
          error={fieldErrors.maxOutputTokens}
          id="response-max-output-tokens"
          label="max_output_tokens / 最大出力トークン"
          max={MAX_MAX_OUTPUT_TOKENS}
          min={MIN_MAX_OUTPUT_TOKENS}
          onChange={(maxOutputTokens) => update({ maxOutputTokens })}
          shortDescription="応答で生成できる最大トークン数です。"
          step={1}
          value={draftSettings.maxOutputTokens}
        />
        <NumberSetting
          detail="Responses APIのtemperatureに反映します。高いほど揺らぎが増えます。top_pと同時に大きく動かすと挙動が読みづらくなります。"
          error={fieldErrors.temperature}
          id="response-temperature"
          label="temperature / 生成の揺らぎ"
          max={MAX_TEMPERATURE}
          min={MIN_TEMPERATURE}
          onChange={(temperature) => update({ temperature })}
          shortDescription="出力のランダム性を調整します。"
          step={0.1}
          value={draftSettings.temperature}
        />
        <NumberSetting
          detail="Responses APIのtop_pに反映します。候補トークンの確率質量を制限します。temperatureと同時に大きく動かす場合は注意してください。"
          error={fieldErrors.topP}
          id="response-top-p"
          label="top_p / 確率質量"
          max={MAX_TOP_P}
          min={MIN_TOP_P}
          onChange={(topP) => update({ topP })}
          shortDescription="候補の絞り込み幅を調整します。"
          step={0.05}
          value={draftSettings.topP}
        />
      </section>

      <section className="space-y-3">
        <SectionTitle description="Phase 4Bでは安全側の固定値だけを使います。">
          保存・実行方式
        </SectionTitle>
        <FixedSettingRow
          detail="OpenAI側には保存せず、Supabase DBを会話のsource of truthにします。"
          label="store / OpenAI側保存"
          value="false"
        />
        <FixedSettingRow
          detail="Phase 4Bではnon-streamingのみです。"
          label="stream / ストリーミング"
          value="false"
        />
        <FixedSettingRow
          detail="web/file/function toolsはまだ使いません。"
          label="tools / ツール"
          value="[]"
        />
        <FixedSettingRow
          detail="toolsが空のため、tool_choiceはnone固定です。"
          label="tool_choice / ツール選択"
          value="none"
        />
      </section>
    </div>
  );
}
