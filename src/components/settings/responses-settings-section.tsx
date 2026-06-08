"use client";

import { Lock } from "lucide-react";

import { SettingsHelpPopover } from "@/components/settings/settings-help-popover";
import {
  MAX_MAX_OUTPUT_TOKENS,
  MAX_RESPONSE_INSTRUCTIONS_CHARACTERS,
  MAX_TEMPERATURE,
  MAX_TOP_P,
  MIN_MAX_OUTPUT_TOKENS,
  MIN_TEMPERATURE,
  MIN_TOP_P,
  type ResponseSettings,
} from "@/lib/openai/response-settings";

type ResponsesSettingsSectionProps = {
  onResponseSettingsChange: (settings: ResponseSettings) => void;
  responseSettings: ResponseSettings;
};

type TextareaSettingProps = {
  detail: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  shortDescription: string;
  value: string;
};

type NumberSettingProps = {
  detail: string;
  id: string;
  integer?: boolean;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  shortDescription: string;
  step: number;
  value: number;
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
  id,
  label,
  onChange,
  placeholder,
  shortDescription,
  value,
}: TextareaSettingProps) {
  const characterCount = countCharacters(value);

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
        className="mt-2 min-h-24 w-full resize-y rounded-xl border border-input bg-background px-3 py-2 text-sm leading-6 outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        id={id}
        maxLength={MAX_RESPONSE_INSTRUCTIONS_CHARACTERS}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
      <p className="mt-1 text-right text-xs leading-5 text-muted-foreground">
        {characterCount.toLocaleString()} /{" "}
        {MAX_RESPONSE_INSTRUCTIONS_CHARACTERS.toLocaleString()}
      </p>
    </div>
  );
}

function NumberSetting({
  detail,
  id,
  integer = false,
  label,
  max,
  min,
  onChange,
  shortDescription,
  step,
  value,
}: NumberSettingProps) {
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
        className="mt-2 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        id={id}
        max={max}
        min={min}
        onChange={(event) => {
          const next = Number(event.target.value);

          if (
            Number.isFinite(next) &&
            next >= min &&
            next <= max &&
            (!integer || Number.isInteger(next))
          ) {
            onChange(next);
          }
        }}
        step={step}
        type="number"
        value={value}
      />
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        範囲: {min} - {max.toLocaleString()}
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

function DisabledSettingRow({
  detail,
  label,
}: {
  detail: string;
  label: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-dashed border-border/70 bg-card/35 px-3 py-2 text-muted-foreground">
      <Lock aria-hidden="true" className="mt-1 size-3.5 shrink-0" />
      <div>
        <p className="text-sm font-medium leading-6">{label}</p>
        <p className="text-xs leading-5">{detail}</p>
      </div>
    </div>
  );
}

export function ResponsesSettingsSection({
  onResponseSettingsChange,
  responseSettings,
}: ResponsesSettingsSectionProps) {
  function update(next: Partial<ResponseSettings>) {
    onResponseSettingsChange({
      ...responseSettings,
      ...next,
      store: false,
      stream: false,
      toolChoice: "none",
      tools: [],
    });
  }

  return (
    <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-3">
      <div>
        <h3 className="text-sm font-semibold leading-6 text-foreground">
          現在のチャット生成に反映される設定
        </h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          変更は次回送信と次回再生成から反映されます。タイトル自動生成とvariant切り替えには反映されません。
        </p>
      </div>

      <section className="space-y-3">
        <SectionTitle description="文字入力系は通常メッセージと分けて扱います。">
          基本設定
        </SectionTitle>
        <TextareaSetting
          detail="Responses APIのinstructionsへ反映します。4oSphere側・開発者側がモデルに守らせたい基本方針です。通常メッセージ本文とは結合しません。"
          id="response-developer-instructions"
          label="Developer instructions / 開発者指示"
          onChange={(developerInstructions) =>
            update({ developerInstructions })
          }
          placeholder="このチャットでAIに守らせたい基本方針を入力"
          shortDescription="API payload上はinstructionsに入る上位指示です。"
          value={responseSettings.developerInstructions}
        />
        <TextareaSetting
          detail="ユーザーがこのチャット生成に追加したい回答の好み、口調、前提条件などです。Phase 4BではDeveloper instructionsと区切ってinstructionsへ合成します。"
          id="response-custom-user-instructions"
          label="Custom user instructions / カスタム指示"
          onChange={(customUserInstructions) =>
            update({ customUserInstructions })
          }
          placeholder="回答の好み、口調、前提条件などを入力"
          shortDescription="通常メッセージ本文とは別の任意指示です。"
          value={responseSettings.customUserInstructions}
        />
        <NumberSetting
          detail="Responses APIのmax_output_tokensに反映します。大きいほど長い応答を許容します。"
          id="response-max-output-tokens"
          label="max_output_tokens / 最大出力トークン"
          max={MAX_MAX_OUTPUT_TOKENS}
          min={MIN_MAX_OUTPUT_TOKENS}
          integer
          onChange={(maxOutputTokens) => update({ maxOutputTokens })}
          shortDescription="応答で生成できる最大トークン数です。"
          step={1}
          value={responseSettings.maxOutputTokens}
        />
        <NumberSetting
          detail="Responses APIのtemperatureに反映します。高いほど揺らぎが増えます。top_pと同時に大きく動かすと挙動が読みづらくなります。"
          id="response-temperature"
          label="temperature / 生成の揺らぎ"
          max={MAX_TEMPERATURE}
          min={MIN_TEMPERATURE}
          onChange={(temperature) => update({ temperature })}
          shortDescription="出力のランダム性を調整します。"
          step={0.1}
          value={responseSettings.temperature}
        />
        <NumberSetting
          detail="Responses APIのtop_pに反映します。候補トークンの確率質量を制限します。temperatureと同時に大きく動かす場合は注意してください。"
          id="response-top-p"
          label="top_p / 確率質量"
          max={MAX_TOP_P}
          min={MIN_TOP_P}
          onChange={(topP) => update({ topP })}
          shortDescription="候補の絞り込み幅を調整します。"
          step={0.05}
          value={responseSettings.topP}
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
        <DisabledSettingRow
          detail="生input配列の編集は開発者モードの後続フェーズで扱います。"
          label="Raw input items"
        />
        <DisabledSettingRow
          detail="image/audio/file content partsは各入力機能の実装時に追加します。"
          label="Content parts"
        />
      </section>

      <section className="space-y-3">
        <SectionTitle description="Phase 4Bでは安全側の固定値だけを使います。">
          保存・実行方式
        </SectionTitle>
        <FixedSettingRow
          detail="OpenAI側には保存せず、Supabase DBを会話のsource of truthにします。"
          label="store"
          value="false"
        />
        <FixedSettingRow
          detail="Phase 4Bではnon-streamingのみです。"
          label="stream"
          value="false"
        />
        <FixedSettingRow
          detail="web/file/function toolsはまだ使いません。"
          label="tools"
          value="[]"
        />
        <FixedSettingRow
          detail="toolsが空のため、tool_choiceはnone固定です。"
          label="tool_choice"
          value="none"
        />
      </section>

      <section className="space-y-3">
        <SectionTitle description="項目は削らず、後続フェーズの入口として残します。">
          高度な設定
        </SectionTitle>
        <DisabledSettingRow
          detail="system/developerの使い分けは後続で確認します。Phase 4Bでは開発者指示に寄せます。"
          label="System message / システム指示"
        />
        <DisabledSettingRow
          detail="structured output本実装までplaceholderです。"
          label="text.format / response format"
        />
        <DisabledSettingRow
          detail="管理・分析用metadataの送信は後続で設計します。"
          label="metadata"
        />
        <DisabledSettingRow
          detail="長い入力の切り詰め方はcontext設計と合わせて後続で扱います。"
          label="truncation"
        />
        <DisabledSettingRow
          detail="追加出力項目のinclude指定は後続です。"
          label="include"
        />
        <DisabledSettingRow
          detail="DBを会話のsource of truthにするためPhase 4Bでは使いません。"
          label="previous_response_id / conversation"
        />
        <DisabledSettingRow
          detail="prompt cache、context management、service tier、safety identifierは後続または要確認です。"
          label="prompt cache / context / service / safety"
        />
      </section>
    </div>
  );
}
