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
  effect: string;
  error?: string;
  guidance: string;
  id: string;
  label: string;
  number: string;
  onChange: (value: string) => void;
  placeholder: string;
  recommendation: string;
  shortDescription: string;
  value: string;
};

type NumberSettingProps = {
  detail: string;
  enabled: boolean;
  effect: string;
  error?: string;
  guidance: string;
  id: string;
  label: string;
  max: number;
  min: number;
  onChange: (value: string) => void;
  onEnabledChange: (enabled: boolean) => void;
  number: string;
  recommendation: string;
  shortDescription: string;
  step: number;
  value: string;
};

function countCharacters(value: string) {
  return Array.from(value).length;
}

function SettingExplanation({
  effect,
  guidance,
  recommendation,
  shortDescription,
}: {
  effect: string;
  guidance: string;
  recommendation: string;
  shortDescription: string;
}) {
  return (
    <dl className="mt-2 grid gap-1 text-xs leading-5 text-muted-foreground">
      <div>
        <dt className="inline font-medium text-foreground">これは何？ </dt>
        <dd className="inline">{shortDescription}</dd>
      </div>
      <div>
        <dt className="inline font-medium text-foreground">
          変えるとどうなる？{" "}
        </dt>
        <dd className="inline">{effect}</dd>
      </div>
      <div>
        <dt className="inline font-medium text-foreground">いつ触る？ </dt>
        <dd className="inline">{guidance}</dd>
      </div>
      <div>
        <dt className="inline font-medium text-foreground">おすすめ </dt>
        <dd className="inline">{recommendation}</dd>
      </div>
    </dl>
  );
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
  effect,
  error,
  guidance,
  id,
  label,
  number,
  onChange,
  placeholder,
  recommendation,
  shortDescription,
  value,
}: TextareaSettingProps) {
  const characterCount = countCharacters(value);
  const statusId = `${id}-status`;

  return (
    <div className="rounded-xl border border-border/70 bg-card/60 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <label
              className="text-sm font-medium leading-6 text-foreground"
              htmlFor={id}
            >
              {number}. {label}
            </label>
            <span className="rounded-full border border-primary/35 bg-primary/10 px-2 py-1 text-[11px] font-medium leading-none text-primary">
              変更できます
            </span>
          </div>
          <SettingExplanation
            effect={effect}
            guidance={guidance}
            recommendation={recommendation}
            shortDescription={shortDescription}
          />
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
  enabled,
  effect,
  error,
  guidance,
  id,
  label,
  max,
  min,
  onChange,
  onEnabledChange,
  number,
  recommendation,
  shortDescription,
  step,
  value,
}: NumberSettingProps) {
  const statusId = `${id}-status`;

  return (
    <div className="rounded-xl border border-border/70 bg-card/60 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium leading-6 text-foreground">
              {number}. {label}
            </p>
            <span className="rounded-full border border-primary/35 bg-primary/10 px-2 py-1 text-[11px] font-medium leading-none text-primary">
              変更できます
            </span>
          </div>
          <SettingExplanation
            effect={effect}
            guidance={guidance}
            recommendation={recommendation}
            shortDescription={shortDescription}
          />
        </div>
        <SettingsHelpPopover
          detailDescription={detail}
          label={label}
          shortDescription={shortDescription}
        />
      </div>
      <label className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-sm">
        <span>{label}を指定する</span>
        <input
          checked={enabled}
          className="size-4 accent-primary"
          onChange={(event) => onEnabledChange(event.target.checked)}
          type="checkbox"
        />
      </label>
      <p className="mt-2 text-xs font-medium text-primary">
        現在: {enabled ? "指定した値を使う" : "APIデフォルトに任せる"}
      </p>
      <input
        aria-describedby={statusId}
        aria-invalid={Boolean(error)}
        className="mt-2 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30"
        disabled={!enabled}
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
        {error ??
          (enabled
            ? `範囲: ${min} - ${max.toLocaleString()}`
            : "値はAPIへ送りません。OpenAIの標準動作を使います。")}
      </p>
    </div>
  );
}

function FixedSettingRow({
  detail,
  label,
  number,
  value,
}: {
  detail: string;
  label: string;
  number: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-card/50 px-3 py-2">
      <div>
        <p className="text-sm font-medium leading-6 text-foreground">
          {number}. {label}
        </p>
        <dl className="mt-1 grid gap-1 text-xs leading-5 text-muted-foreground">
          <div>
            <dt className="inline font-medium text-foreground">これは何？ </dt>
            <dd className="inline">{detail}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-foreground">
              変えるとどうなる？{" "}
            </dt>
            <dd className="inline">
              この行は現在の入力元や固定値を表示するため、ここでは変更できません。
            </dd>
          </div>
          <div>
            <dt className="inline font-medium text-foreground">いつ触る？ </dt>
            <dd className="inline">
              現在の動作を確認したいときだけ見てください。
            </dd>
          </div>
          <div>
            <dt className="inline font-medium text-foreground">おすすめ </dt>
            <dd className="inline">通常はそのまま使ってください。</dd>
          </div>
        </dl>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="rounded-full border border-border/70 bg-background px-2 py-1 text-xs text-muted-foreground">
          {value}
        </span>
        <span className="text-[11px] text-muted-foreground">
          ここでは変更不可
        </span>
      </div>
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
              ? "保存中..."
              : dirty
                ? "未保存の変更があります"
                : "保存済み（このタブ内）"}
          </p>
          <p className="text-xs leading-5 text-muted-foreground">
            このタブ内の生成設定として保存します。アカウント全体への保存ではありません。次回送信・次回再生成から反映されます。
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
            設定を保存
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
          入力中の内容はまだ未保存です。設定を保存した後、次回送信と次回再生成から使われます。タイトル自動生成と回答候補の切り替えには反映されません。
        </p>
      </div>

      <section className="space-y-3">
        <SectionTitle description="文字入力系は通常メッセージと分けて扱います。">
          基本設定
        </SectionTitle>
        <TextareaSetting
          detail="Responses APIのinstructionsへ反映します。4oSphere側・開発者側がモデルに守らせたい基本方針です。通常メッセージ本文とは結合しません。"
          effect="保存後の回答すべてに、ここで指定した基本方針が追加されます。"
          error={fieldErrors.developerInstructions}
          guidance="このチャット全体でAIに必ず守らせたい方針があるときに使います。"
          id="response-developer-instructions"
          label="Developer instructions / 開発者指示"
          number="1-1"
          onChange={(developerInstructions) =>
            update({ developerInstructions })
          }
          placeholder="このチャットでAIに守らせたい基本方針を入力"
          recommendation="必要な場合だけ入力し、通常の質問や依頼はチャット下部から送ってください。"
          shortDescription="AIへ送る設定内容に含める、優先度の高い指示です。"
          value={draftSettings.developerInstructions}
        />
        <TextareaSetting
          detail="ユーザーがこのチャット生成に追加したい回答の好み、口調、前提条件などです。Phase 4BではDeveloper instructionsと区切ってinstructionsへ合成します。"
          effect="保存後の回答に、口調や長さなどの好みが追加されます。"
          error={fieldErrors.customUserInstructions}
          guidance="回答の長さ、口調、前提条件などを毎回指定したいときに使います。"
          id="response-custom-user-instructions"
          label="Custom user instructions / カスタム指示"
          number="1-2"
          onChange={(customUserInstructions) =>
            update({ customUserInstructions })
          }
          placeholder="回答の好み、口調、前提条件などを入力"
          recommendation="一時的な依頼なら通常メッセージを使い、継続したい好みだけを入力してください。"
          shortDescription="通常メッセージ本文とは別の任意指示です。"
          value={draftSettings.customUserInstructions}
        />
      </section>

      <section className="space-y-3">
        <SectionTitle description="AIへ渡す会話内容が、どこから用意されるかを表示します。">
          入力構成
        </SectionTitle>
        <FixedSettingRow
          detail="チャット下部の入力欄から送信されます。この設定画面内では編集しません。"
          label="Current user message / 通常メッセージ"
          number="1-3"
          value="チャット下部"
        />
        <FixedSettingRow
          detail="保存済みの会話履歴から自動で用意されます。ここでは変更できません。"
          label="Conversation history / 会話履歴"
          number="1-4"
          value="自動"
        />
        <FixedSettingRow
          detail="現在選ばれている回答候補だけが会話履歴に使われます。"
          label="Assistant history / アシスタント履歴"
          number="1-5"
          value="選択中のみ"
        />
        <FixedSettingRow
          detail="画面上部で選択した4oモデルを使います。"
          label="model / モデル"
          number="1-6"
          value={selectedSnapshot}
        />
        <NumberSetting
          detail="Responses APIのmax_output_tokensに反映します。大きいほど長い応答を許容します。"
          effect="小さくすると回答が短く切れやすくなり、大きくすると長い回答を許可します。"
          enabled={draftSettings.specifyMaxOutputTokens}
          error={fieldErrors.maxOutputTokens}
          guidance="回答が長すぎる、または長い回答を許可したいときだけ指定します。"
          id="response-max-output-tokens"
          label="max_output_tokens / 最大出力トークン"
          max={MAX_MAX_OUTPUT_TOKENS}
          min={MIN_MAX_OUTPUT_TOKENS}
          onChange={(maxOutputTokens) => update({ maxOutputTokens })}
          onEnabledChange={(specifyMaxOutputTokens) =>
            update({
              maxOutputTokens: specifyMaxOutputTokens
                ? draftSettings.maxOutputTokens
                : "",
              specifyMaxOutputTokens,
            })
          }
          number="1-7"
          recommendation="通常はOFFのままAPIデフォルトに任せます。指定すると長さと料金に影響します。"
          shortDescription="応答で生成できる最大トークン数です。"
          step={1}
          value={draftSettings.maxOutputTokens}
        />
        <NumberSetting
          detail="Responses APIのtemperatureに反映します。高いほど揺らぎが増えます。top_pと同時に大きく動かすと挙動が読みづらくなります。"
          effect="低いほど安定しやすく、高いほど多様・意外な返答になりやすくなります。"
          enabled={draftSettings.specifyTemperature}
          error={fieldErrors.temperature}
          guidance="回答が毎回ぶれすぎる、または創作的に広げたいときだけ指定します。"
          id="response-temperature"
          label="temperature / 温度サンプリング"
          max={MAX_TEMPERATURE}
          min={MIN_TEMPERATURE}
          onChange={(temperature) => update({ temperature })}
          onEnabledChange={(specifyTemperature) =>
            update({
              specifyTemperature,
              temperature: specifyTemperature ? draftSettings.temperature : "",
            })
          }
          number="1-8"
          recommendation="通常はOFFのままAPIデフォルトに任せます。top_pと同時に変えないでください。"
          shortDescription="応答の候補選びの広がりです。低いほど安定し、高いほど多様になりやすくなります。"
          step={0.1}
          value={draftSettings.temperature}
        />
        <NumberSetting
          detail="Responses APIのtop_pに反映します。候補トークンの確率質量を制限します。temperatureと同時に大きく動かす場合は注意してください。"
          effect="小さくすると有力な候補に絞り、大きくすると幅広い候補から選びます。"
          enabled={draftSettings.specifyTopP}
          error={fieldErrors.topP}
          guidance="候補の選び方を細かく調整したい場合だけ指定します。"
          id="response-top-p"
          label="top_p / 確率質量"
          max={MAX_TOP_P}
          min={MIN_TOP_P}
          onChange={(topP) => update({ topP })}
          onEnabledChange={(specifyTopP) =>
            update({
              specifyTopP,
              topP: specifyTopP ? draftSettings.topP : "",
            })
          }
          number="1-9"
          recommendation="通常はOFFのままAPIデフォルトに任せます。temperatureと同時に変えないでください。"
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
          detail="OpenAI側には会話を保存せず、4oSphere側で管理します。"
          label="store / OpenAI側保存"
          number="1-10"
          value="false固定"
        />
        <FixedSettingRow
          detail="現在は回答が完成してからまとめて表示されます。少しずつ表示する方式には変更できません。"
          label="stream / ストリーミング"
          number="1-11"
          value="false固定"
        />
        <FixedSettingRow
          detail="検索・ファイル参照・関数実行などの追加機能は、まだ使いません。"
          label="tools / ツール"
          number="1-12"
          value="なし"
        />
        <FixedSettingRow
          detail="追加機能を使わないため、ツール選択も「使わない」に固定されています。"
          label="tool_choice / ツール選択"
          number="1-13"
          value="使わない"
        />
      </section>
    </div>
  );
}
