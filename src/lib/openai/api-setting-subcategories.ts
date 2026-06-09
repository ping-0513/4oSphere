import { LOWER_CATEGORY_INVENTORY_SEEDS } from "@/lib/openai/api-setting-lower-category-inventory";

export type ApiSettingSubcategoryStatus =
  | "implemented"
  | "planned"
  | "fixed"
  | "placeholder"
  | "needs-confirmation"
  | "admin"
  | "legacy"
  | "unsupported";

export type ApiSettingSubcategory = {
  id: string;
  categoryId: string;
  order: number;
  officialName: string;
  japaneseName: string;
  displayName: string;
  officialPath: string;
  shortDescription: string;
  detailDescription: string;
  status: ApiSettingSubcategoryStatus;
  phase: string;
  uiPlacement: string;
  implementation: string;
  caution: string;
  notes: string;
  what: string;
  effect: string;
  whenToUse: string;
  recommendation: string;
  risk: string;
  nonTechnicalLabel: string;
  technicalLabel: string;
  displayStatusLabel: string;
  categoryNumber: number;
  subcategoryNumber: number;
};

type ApiSettingSubcategoryDefinition = Omit<
  ApiSettingSubcategory,
  | "categoryNumber"
  | "displayName"
  | "displayStatusLabel"
  | "effect"
  | "nonTechnicalLabel"
  | "notes"
  | "officialPath"
  | "order"
  | "recommendation"
  | "risk"
  | "subcategoryNumber"
  | "technicalLabel"
  | "what"
  | "whenToUse"
>;

export const RESPONSES_SUBCATEGORY_CANONICAL_ORDER = [
  "responses-developer-instructions",
  "responses-custom-user-instructions",
  "responses-current-user-message",
  "responses-conversation-history",
  "responses-assistant-history",
  "responses-model",
  "responses-max-output-tokens",
  "responses-temperature",
  "responses-top-p",
  "responses-store",
  "responses-stream",
  "responses-tools",
  "responses-tool-choice",
  "responses-text-format",
  "responses-metadata",
  "responses-previous-response-id",
  "responses-conversation",
  "responses-truncation",
  "responses-include",
  "responses-parallel-tool-calls",
  "responses-max-tool-calls",
  "responses-service-tier",
  "responses-safety-identifier",
  "responses-prompt-cache-key",
  "responses-prompt-cache-retention",
  "responses-context-management",
  "responses-background",
  "responses-reasoning",
  "responses-structured-output",
  "responses-multimodal-input",
  "responses-image-input",
  "responses-audio-input",
  "responses-file-input",
  "responses-web-file-function-tools",
  "responses-input",
  "responses-stream-options",
  "responses-text-verbosity",
  "responses-prompt",
  "responses-web-search-tool",
  "responses-file-search-tool",
  "responses-function-tool",
  "responses-code-interpreter-tool",
  "responses-top-logprobs",
  "responses-deprecated-user",
  "responses-mcp-tool",
  "responses-computer-use-tool",
  "responses-image-generation-tool",
  "responses-shell-apply-patch-tool",
] as const;

export const API_SETTING_SUBCATEGORY_STATUS_LABELS = {
  implemented: "変更・利用できます",
  planned: "予定",
  fixed: "変更できません",
  placeholder: "棚卸しのみ",
  "needs-confirmation": "要確認",
  admin: "管理者・開発者向け",
  legacy: "旧API",
  unsupported: "非対応",
} satisfies Record<ApiSettingSubcategoryStatus, string>;

const BASE_API_SETTING_SUBCATEGORY_DEFINITIONS = [
  {
    id: "common-api-key",
    categoryId: "common",
    officialName: "API key",
    japaneseName: "APIキー",
    shortDescription: "OpenAI APIの認証に使う秘密鍵です。",
    detailDescription:
      "4oSphereではserver-only envのOPENAI_API_KEYだけを使います。ブラウザUIで入力、表示、マスク表示、有無表示はしません。",
    status: "fixed",
    phase: "Phase 3A+",
    uiPlacement: "Common > Security",
    implementation: "server-only env only",
    caution: "client bundle、sessionStorage、localStorage、DBに保存しません。",
  },
  {
    id: "common-organization",
    categoryId: "common",
    officialName: "Organization",
    japaneseName: "組織",
    shortDescription: "OpenAI組織を指定するための接続設定候補です。",
    detailDescription:
      "複数組織を使い分ける場合の設定です。Phase 4では通常ユーザーUIに出さず、必要性を確認してからserver-only設定として扱います。",
    status: "placeholder",
    phase: "Future",
    uiPlacement: "Common > Connection",
    implementation: "not connected",
    caution: "ブラウザから組織IDを編集するUIは作りません。",
  },
  {
    id: "common-project",
    categoryId: "common",
    officialName: "Project",
    japaneseName: "プロジェクト",
    shortDescription: "OpenAI projectを指定する接続設定候補です。",
    detailDescription:
      "課金・権限・利用量管理に関係します。4oSphereではまだUIから切り替えません。",
    status: "placeholder",
    phase: "Future",
    uiPlacement: "Common > Connection",
    implementation: "not connected",
    caution: "project指定をclientへ出す設計は未採用です。",
  },
  {
    id: "common-request-id",
    categoryId: "common",
    officialName: "Request ID",
    japaneseName: "リクエストID",
    shortDescription: "API呼び出しの追跡に使うIDです。",
    detailDescription:
      "障害調査やサポートで使う識別子です。Phase 4ではprovider raw responseやheadersをログに出さない方針のため表示しません。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Common > Observability",
    implementation: "display/debug design pending",
    caution: "headersやraw responseを丸ごと保存しません。",
  },
  {
    id: "common-idempotency",
    categoryId: "common",
    officialName: "Idempotency",
    japaneseName: "冪等性",
    shortDescription: "同じ操作の重複実行を避けるための仕組みです。",
    detailDescription:
      "送信やバッチ作成の二重実行防止に関係します。現在はUI pendingとRPC transactionで重複を抑えています。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Common > Reliability",
    implementation: "not connected to OpenAI request",
    caution: "idempotency keyの生成・保存設計が必要です。",
  },
  {
    id: "common-json-request-format",
    categoryId: "common",
    officialName: "JSON request format",
    japaneseName: "JSONリクエスト形式",
    shortDescription: "APIへ送るJSON payloadの基本形式です。",
    detailDescription:
      "4oSphereではResponses API helperがpayloadを構築します。危険なraw JSON編集UIはまだ出しません。",
    status: "fixed",
    phase: "Phase 3A+",
    uiPlacement: "Common > Request",
    implementation: "server helper builds payload",
    caution:
      "raw JSON編集はprompt injectionや不正設定の温床になるため後回しです。",
  },
  {
    id: "common-errors",
    categoryId: "common",
    officialName: "Errors",
    japaneseName: "エラー",
    shortDescription: "API失敗時の扱いとユーザー表示です。",
    detailDescription:
      "user message保存前の事前エラー、API失敗、assistant保存失敗を分けて扱います。provider raw errorは表示しません。",
    status: "implemented",
    phase: "Phase 3A+",
    uiPlacement: "Common > Reliability",
    implementation: "sanitized user-facing errors",
    caution: "API key、headers、tokens、raw responseはログ出力しません。",
  },
  {
    id: "common-rate-limits",
    categoryId: "common",
    officialName: "Rate limits",
    japaneseName: "レート制限",
    shortDescription: "API利用頻度の制約です。",
    detailDescription:
      "Phase 4では表示のみです。将来、429時の案内、backoff、利用状況表示を検討します。",
    status: "placeholder",
    phase: "Future",
    uiPlacement: "Common > Reliability",
    implementation: "not connected",
    caution: "利用量や組織情報をclientへ出しません。",
  },
  {
    id: "common-timeout",
    categoryId: "common",
    officialName: "Timeout",
    japaneseName: "タイムアウト",
    shortDescription: "API応答待ちの最大時間です。",
    detailDescription:
      "title generationでは専用timeoutを持っています。通常assistant responseのtimeout UIは未実装です。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Common > Reliability",
    implementation: "partially internal",
    caution: "長すぎるtimeoutはUXとコスト管理に影響します。",
  },
  {
    id: "common-retries",
    categoryId: "common",
    officialName: "Retries",
    japaneseName: "再試行",
    shortDescription: "一時的なAPI失敗時の再試行方針です。",
    detailDescription:
      "Phase 4では自動retryを増やしません。user message保存後のassistant生成失敗retryは別フェーズで設計します。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Common > Reliability",
    implementation: "not connected",
    caution: "自動retryは重複生成や追加コストにつながります。",
  },
  {
    id: "common-debugging",
    categoryId: "common",
    officialName: "Debugging",
    japaneseName: "デバッグ",
    shortDescription: "開発中の診断情報の扱いです。",
    detailDescription:
      "Supabase errorはsanitized detailのみ開発時に扱います。OpenAI raw payloadやinstructions全文のログ出力はしません。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Common > Observability",
    implementation: "limited sanitized diagnostics",
    caution: "private instructionsやuser messagesをdebug exportしません。",
  },
  {
    id: "common-sdk-client-config",
    categoryId: "common",
    officialName: "SDK/client config",
    japaneseName: "SDK/client設定",
    shortDescription: "OpenAI SDKのserver-side client設定です。",
    detailDescription:
      "OpenAI SDKはserver-only helperからだけ使います。ブラウザclientからOpenAI APIは呼びません。",
    status: "implemented",
    phase: "Phase 3A+",
    uiPlacement: "Common > Connection",
    implementation: "server-only OpenAI SDK",
    caution: "client componentにOpenAI SDKをimportしません。",
  },
  {
    id: "common-authentication",
    categoryId: "common",
    officialName: "Authentication",
    japaneseName: "認証",
    shortDescription: "OpenAIと4oSphere user authの境界です。",
    detailDescription:
      "OpenAI認証はserver-only env、ユーザー認証はSupabase Authです。server actionではgetClaims系のverified userを使います。",
    status: "implemented",
    phase: "Phase 2B+",
    uiPlacement: "Common > Security",
    implementation: "Supabase auth + server-only provider auth",
    caution: "getSessionを保護判定に使いません。",
  },
  {
    id: "common-environment-variables",
    categoryId: "common",
    officialName: "Environment variables",
    japaneseName: "環境変数",
    shortDescription: "server/client環境変数の境界です。",
    detailDescription:
      "OPENAI_API_KEYはserver-onlyです。Supabase public keyだけNEXT_PUBLICとして扱います。",
    status: "implemented",
    phase: "Phase 2B+",
    uiPlacement: "Common > Security",
    implementation: "env boundary documented",
    caution: "OpenAI API keyはNEXT_PUBLIC接頭辞で追加しません。",
  },

  {
    id: "responses-model",
    categoryId: "responses",
    officialName: "model",
    japaneseName: "モデル",
    shortDescription: "Responses APIで使うモデルIDです。",
    detailDescription:
      "4oSphereでは既存GPT_4O_MODEL_OPTIONSだけを使い、selected snapshot labelをserverでformal model idへ変換します。",
    status: "implemented",
    phase: "Phase 3A+",
    uiPlacement: "Settings header / ChatHeader",
    implementation: "4o snapshot allowlist",
    caution: "gpt-4o aliasや他modelは出しません。",
  },
  {
    id: "responses-developer-instructions",
    categoryId: "responses",
    officialName: "Developer instructions",
    japaneseName: "開発者指示",
    shortDescription: "アプリ側・開発者側がモデルに守らせる上位指示です。",
    detailDescription:
      "保存後、Custom user instructionsと明示的な区切り付きでResponses APIのinstructionsへ合成します。",
    status: "implemented",
    phase: "Phase 4B",
    uiPlacement: "Responses > Basic settings",
    implementation: "payload + settings_snapshot",
    caution: "通常user message本文とは結合しません。",
  },
  {
    id: "responses-custom-user-instructions",
    categoryId: "responses",
    officialName: "Custom user instructions",
    japaneseName: "カスタム指示",
    shortDescription: "回答の好み、口調、前提条件などを追加する任意指示です。",
    detailDescription:
      "通常user messageとは分けて扱い、保存後にDeveloper instructionsと区切ってResponses API instructionsへ合成します。",
    status: "implemented",
    phase: "Phase 4B",
    uiPlacement: "Responses > Basic settings",
    implementation: "payload + settings_snapshot",
    caution: "通常user message本文やtitle generation promptには混ぜません。",
  },
  {
    id: "responses-current-user-message",
    categoryId: "responses",
    officialName: "Current user message",
    japaneseName: "通常メッセージ",
    shortDescription: "チャット下部の入力欄から送る現在のuser messageです。",
    detailDescription:
      "Settings panelでは編集せず、既存composer本文として保存・送信します。instructionsとは結合しません。",
    status: "implemented",
    phase: "Phase 2D+",
    uiPlacement: "Responses > Input composition",
    implementation: "composer + DB persistence",
    caution: "Developer/Custom instructionsとは別のinputです。",
  },
  {
    id: "responses-conversation-history",
    categoryId: "responses",
    officialName: "Conversation history",
    japaneseName: "会話履歴",
    shortDescription: "DBに保存されたturn履歴から構築する会話contextです。",
    detailDescription:
      "message_turns.turn_index順のuser messageとactive assistant responseからResponses API inputを構築します。",
    status: "implemented",
    phase: "Phase 3A+",
    uiPlacement: "Responses > Input composition",
    implementation: "server-side DB history construction",
    caution: "DBをconversation source of truthとして維持します。",
  },
  {
    id: "responses-assistant-history",
    categoryId: "responses",
    officialName: "Assistant history",
    japaneseName: "アシスタント履歴",
    shortDescription: "各turnのactive assistant variantだけを履歴に使います。",
    detailDescription:
      "activeでないassistant variantsは通常のconversation historyへ含めません。",
    status: "implemented",
    phase: "Phase 3C+",
    uiPlacement: "Responses > Input composition",
    implementation: "active variant only",
    caution: "過去variantの切り替え制限とbranch未実装方針を維持します。",
  },
  {
    id: "responses-max-output-tokens",
    categoryId: "responses",
    officialName: "max_output_tokens",
    japaneseName: "最大出力トークン",
    shortDescription: "応答の長さの上限です。品質を上げる設定ではありません。",
    detailDescription:
      "未指定ならAPIデフォルトを使います。指定する場合は1〜4096の整数として画面とserver actionで検証し、APIへ送る設定とsettings_snapshotへ反映します。",
    status: "implemented",
    phase: "Phase 4B",
    uiPlacement: "Responses > Basic settings",
    implementation: "payload + settings_snapshot",
    caution: "過大な値はコストと待ち時間に影響します。",
  },
  {
    id: "responses-temperature",
    categoryId: "responses",
    officialName: "temperature",
    japaneseName: "温度サンプリング",
    shortDescription:
      "応答の候補選びの広がりです。低いほど安定し、高いほど多様になりやすくなります。",
    detailDescription:
      "未指定ならAPIデフォルトを使います。指定する場合は0〜2の範囲で検証し、normal sendとregenerateに反映します。",
    status: "implemented",
    phase: "Phase 4B",
    uiPlacement: "Responses > Basic settings",
    implementation: "payload + settings_snapshot",
    caution: "top_pと同時に大きく動かす場合は挙動確認が必要です。",
  },
  {
    id: "responses-top-p",
    categoryId: "responses",
    officialName: "top_p",
    japaneseName: "候補範囲",
    shortDescription: "候補に入れる単語の範囲を確率で絞る設定です。",
    detailDescription:
      "未指定ならAPIデフォルトを使います。指定する場合は0〜1の範囲で検証し、normal sendとregenerateに反映します。",
    status: "implemented",
    phase: "Phase 4B",
    uiPlacement: "Responses > Basic settings",
    implementation: "payload + settings_snapshot",
    caution: "temperatureとの併用は慎重に扱います。",
  },
  {
    id: "responses-store",
    categoryId: "responses",
    officialName: "store",
    japaneseName: "OpenAI側保存",
    shortDescription: "OpenAI側にresponseを保存するかどうかです。",
    detailDescription:
      "4oSphereではSupabase DBを会話source of truthにするためstore:false固定です。",
    status: "fixed",
    phase: "Phase 3A+",
    uiPlacement: "Responses > Execution mode",
    implementation: "fixed payload + settings_snapshot",
    caution: "UIからtrueへ変更できません。",
  },
  {
    id: "responses-stream",
    categoryId: "responses",
    officialName: "stream",
    japaneseName: "ストリーミング",
    shortDescription: "deltaを逐次受け取るかどうかです。",
    detailDescription:
      "Phase 4Bではnon-streamingのみです。stream:false固定で、実ストリーミングは後続フェーズです。",
    status: "fixed",
    phase: "Phase 3A+",
    uiPlacement: "Responses > Execution mode",
    implementation: "fixed payload + settings_snapshot",
    caution: "streaming UIやstop処理なしにtrueへしません。",
  },
  {
    id: "responses-tools",
    categoryId: "responses",
    officialName: "tools",
    japaneseName: "ツール",
    shortDescription: "web/file/function等のツール呼び出し設定です。",
    detailDescription:
      "Phase 4Bではtools:[]固定です。web search、file search、function toolsの実処理はまだ入れません。",
    status: "fixed",
    phase: "Phase 3A+",
    uiPlacement: "Responses > Execution mode",
    implementation: "fixed payload + settings_snapshot",
    caution: "tool実行は外部アクセスや権限境界の設計が必要です。",
  },
  {
    id: "responses-tool-choice",
    categoryId: "responses",
    officialName: "tool_choice",
    japaneseName: "ツール選択",
    shortDescription: "ツール使用をモデルにどう許可するかです。",
    detailDescription:
      "Phase 4Bではtool_choice:none固定です。SDK型に合わせて安全な値のみserver helperから送ります。",
    status: "fixed",
    phase: "Phase 3A+",
    uiPlacement: "Responses > Execution mode",
    implementation: "fixed payload + settings_snapshot",
    caution: "toolsが空のためユーザー変更UIは出しません。",
  },
  {
    id: "responses-text-format",
    categoryId: "responses",
    officialName: "text.format",
    japaneseName: "応答形式",
    shortDescription: "plain textやstructured outputの形式指定です。",
    detailDescription:
      "structured outputは重要ですが、schema UIとvalidation設計が必要なためPhase 4ではplaceholderとして残します。",
    status: "placeholder",
    phase: "Future",
    uiPlacement: "Responses > Advanced",
    implementation: "not connected",
    caution: "型安全にpayloadへ入れられる設計まで有効化しません。",
  },
  {
    id: "responses-metadata",
    categoryId: "responses",
    officialName: "metadata",
    japaneseName: "メタデータ",
    shortDescription: "APIリクエストに付与する補助情報です。",
    detailDescription:
      "4oSphere DB側のmetadataとOpenAI API metadataの境界を整理してから接続します。",
    status: "placeholder",
    phase: "Future",
    uiPlacement: "Responses > Advanced",
    implementation: "not connected",
    caution: "private情報や内部IDを不用意にproviderへ渡しません。",
  },
  {
    id: "responses-previous-response-id",
    categoryId: "responses",
    officialName: "previous_response_id",
    japaneseName: "前回応答ID",
    shortDescription: "OpenAI側の前回responseを参照する設定です。",
    detailDescription:
      "4oSphereではDB履歴をsource of truthにするため使いません。Phase 4では固定で未使用です。",
    status: "unsupported",
    phase: "Deferred",
    uiPlacement: "Responses > Advanced",
    implementation: "not used",
    caution: "OpenAI側conversation stateへ依存しません。",
  },
  {
    id: "responses-conversation",
    categoryId: "responses",
    officialName: "conversation",
    japaneseName: "Conversation連携",
    shortDescription: "OpenAI Conversations連携です。",
    detailDescription:
      "Supabaseのchat/turn/variant modelを壊さない範囲で後続検討します。Phase 4では表示のみです。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Responses > Advanced",
    implementation: "not connected",
    caution: "DB source of truthを維持します。",
  },
  {
    id: "responses-truncation",
    categoryId: "responses",
    officialName: "truncation",
    japaneseName: "コンテキスト切り詰め",
    shortDescription: "context過大時の入力削減方針です。",
    detailDescription:
      "現在は高度な要約やtruncation UIを持ちません。将来、turn履歴の切り詰め方として設計します。",
    status: "placeholder",
    phase: "Future",
    uiPlacement: "Responses > Context",
    implementation: "not connected",
    caution: "過去turnの意味を壊すため自動化は慎重にします。",
  },
  {
    id: "responses-include",
    categoryId: "responses",
    officialName: "include",
    japaneseName: "追加取得項目",
    shortDescription: "responseに含める追加情報の指定候補です。",
    detailDescription:
      "API仕様とSDK型に合わせて、必要なincludeだけを後続で表示します。Phase 4ではplaceholderです。",
    status: "needs-confirmation",
    phase: "Future",
    uiPlacement: "Responses > Advanced",
    implementation: "not connected",
    caution: "raw provider responseの露出は避けます。",
  },
  {
    id: "responses-parallel-tool-calls",
    categoryId: "responses",
    officialName: "parallel_tool_calls",
    japaneseName: "並列ツール呼び出し",
    shortDescription: "複数ツール呼び出しの並列許可です。",
    detailDescription:
      "tools自体を未実装のため固定表示のみです。tool実行設計後に扱います。",
    status: "placeholder",
    phase: "Future",
    uiPlacement: "Responses > Tools",
    implementation: "not connected",
    caution: "外部アクセスや副作用を伴う可能性があります。",
  },
  {
    id: "responses-max-tool-calls",
    categoryId: "responses",
    officialName: "max_tool_calls",
    japaneseName: "最大ツール呼び出し回数",
    shortDescription: "tool呼び出し回数の上限です。",
    detailDescription:
      "tools有効化後のコスト・安全制御として必要です。Phase 4ではplaceholderです。",
    status: "placeholder",
    phase: "Future",
    uiPlacement: "Responses > Tools",
    implementation: "not connected",
    caution: "tools未実装のためpayloadへ入れません。",
  },
  {
    id: "responses-service-tier",
    categoryId: "responses",
    officialName: "service_tier",
    japaneseName: "サービス階層",
    shortDescription: "API処理のサービス階層指定です。",
    detailDescription:
      "契約・料金・可用性に関係するため、通常ユーザーUIでは未接続です。",
    status: "needs-confirmation",
    phase: "Future",
    uiPlacement: "Responses > Advanced",
    implementation: "not connected",
    caution: "課金・権限への影響を確認してから扱います。",
  },
  {
    id: "responses-safety-identifier",
    categoryId: "responses",
    officialName: "safety_identifier",
    japaneseName: "安全識別子",
    shortDescription: "安全性関連の識別情報候補です。",
    detailDescription:
      "どの識別子を送るべきか、privacyと規約を確認してから扱います。",
    status: "needs-confirmation",
    phase: "Future",
    uiPlacement: "Responses > Safety",
    implementation: "not connected",
    caution: "個人情報や内部IDを不用意に送信しません。",
  },
  {
    id: "responses-prompt-cache-key",
    categoryId: "responses",
    officialName: "prompt_cache_key",
    japaneseName: "プロンプトキャッシュキー",
    shortDescription: "prompt cacheのキー候補です。",
    detailDescription:
      "キャッシュ設計とprivacy境界が必要なため、Phase 4では表示のみです。",
    status: "placeholder",
    phase: "Future",
    uiPlacement: "Responses > Performance",
    implementation: "not connected",
    caution: "private instructionsを安易にcache key化しません。",
  },
  {
    id: "responses-prompt-cache-retention",
    categoryId: "responses",
    officialName: "prompt_cache_retention",
    japaneseName: "プロンプトキャッシュ保持",
    shortDescription: "prompt cacheの保持方針候補です。",
    detailDescription:
      "保持期間やデータ扱いに関係するため、設定可能にする前に仕様確認が必要です。",
    status: "needs-confirmation",
    phase: "Future",
    uiPlacement: "Responses > Performance",
    implementation: "not connected",
    caution: "データ保持方針と衝突しないようにします。",
  },
  {
    id: "responses-context-management",
    categoryId: "responses",
    officialName: "context_management",
    japaneseName: "コンテキスト管理",
    shortDescription: "長い会話履歴の管理方針です。",
    detailDescription:
      "会話要約、履歴削減、知識参照との優先順位を整理してから実装します。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Responses > Context",
    implementation: "not connected",
    caution: "branch/edit/regenerateとの整合が必要です。",
  },
  {
    id: "responses-background",
    categoryId: "responses",
    officialName: "background",
    japaneseName: "バックグラウンド実行",
    shortDescription: "長時間処理を背景で進める設定候補です。",
    detailDescription:
      "UI通知、revalidation、DB状態管理が必要なため、Phase 4ではplaceholderです。",
    status: "placeholder",
    phase: "Future",
    uiPlacement: "Responses > Execution mode",
    implementation: "not connected",
    caution: "非同期完了管理なしに有効化しません。",
  },
  {
    id: "responses-reasoning",
    categoryId: "responses",
    officialName: "reasoning",
    japaneseName: "推論設定",
    shortDescription: "reasoning系モデル向け設定候補です。",
    detailDescription:
      "4o snapshotでの対応可否を確認するまで有効化しません。4o-only方針は維持します。",
    status: "needs-confirmation",
    phase: "Future",
    uiPlacement: "Responses > Model-dependent",
    implementation: "not connected",
    caution: "非4oモデル追加やprovider generalizationはしません。",
  },
  {
    id: "responses-structured-output",
    categoryId: "responses",
    officialName: "Structured output",
    japaneseName: "構造化出力",
    shortDescription: "schemaに従う出力を求める設定です。",
    detailDescription:
      "JSON schema editorやpreset管理が必要です。Phase 4ではresponse format placeholderとして残します。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Responses > Output format",
    implementation: "not connected",
    caution: "型安全なschema validationなしにpayloadへ入れません。",
  },
  {
    id: "responses-multimodal-input",
    categoryId: "responses",
    officialName: "Multimodal input",
    japaneseName: "マルチモーダル入力",
    shortDescription: "text以外のinput partsを扱います。",
    detailDescription:
      "image/audio/file inputは添付・保存・retention設計が必要なため、Phase 4ではplaceholderです。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Responses > Input composition",
    implementation: "not connected",
    caution: "binaryやfile idをDB本文に混ぜません。",
  },
  {
    id: "responses-image-input",
    categoryId: "responses",
    officialName: "image input",
    japaneseName: "画像入力",
    shortDescription: "画像を入力として渡す設定候補です。",
    detailDescription:
      "画像upload、圧縮、保存、削除、detail設定が必要です。Phase 4ではdisabled rowです。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Responses > Input composition",
    implementation: "not connected",
    caution: "画像実処理は有効化しません。",
  },
  {
    id: "responses-audio-input",
    categoryId: "responses",
    officialName: "audio input",
    japaneseName: "音声入力",
    shortDescription: "音声を入力として渡す設定候補です。",
    detailDescription:
      "録音、権限、変換、保存方針が必要です。Phase 4ではplaceholderです。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Responses > Input composition",
    implementation: "not connected",
    caution: "voice input実処理はまだ入れません。",
  },
  {
    id: "responses-file-input",
    categoryId: "responses",
    officialName: "file input",
    japaneseName: "ファイル入力",
    shortDescription: "file idやcontent partとしてファイルを渡す候補です。",
    detailDescription:
      "Files/Uploads/Vector Stores/PDF knowledgeの設計と合わせて扱います。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Responses > Input composition",
    implementation: "not connected",
    caution: "PDF knowledgeを通常message attachmentとして混ぜません。",
  },
  {
    id: "responses-web-file-function-tools",
    categoryId: "responses",
    officialName: "web/file/function tools",
    japaneseName: "Web・ファイル・関数ツール",
    shortDescription: "外部検索や関数実行などのtool候補です。",
    detailDescription:
      "安全境界、権限、UI toggle、結果保存、参照表示が必要です。Phase 4ではplaceholderです。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Responses > Tools",
    implementation: "not connected",
    caution: "web/file/function toolsは実行しません。",
  },
  {
    id: "responses-input",
    categoryId: "responses",
    officialName: "input",
    japaneseName: "入力内容",
    shortDescription: "AIへ渡すメッセージや入力素材をまとめた内容です。",
    detailDescription:
      "Responses Createのinputです。現在は保存済み会話履歴と通常メッセージからサーバー側で組み立てます。",
    status: "fixed",
    phase: "Phase 3A+",
    uiPlacement: "Responses > Input composition",
    implementation: "constructed from DB conversation history",
    caution: "生のinput配列を直接編集するUIは追加しません。",
  },
  {
    id: "responses-stream-options",
    categoryId: "responses",
    officialName: "stream_options",
    japaneseName: "ストリーミング追加設定",
    shortDescription:
      "返答を少しずつ表示するときの追加動作を指定する設定です。",
    detailDescription:
      "stream=trueで使う追加設定です。4oSphereはstream:false固定のため、現在は利用しません。",
    status: "placeholder",
    phase: "Future streaming phase",
    uiPlacement: "Responses > Streaming",
    implementation: "not connected",
    caution: "ストリーミング実処理と停止・再接続設計なしに有効化しません。",
  },
  {
    id: "responses-text-verbosity",
    categoryId: "responses",
    officialName: "text.verbosity",
    japaneseName: "回答の詳しさ",
    shortDescription: "回答を簡潔にするか詳しくするかを指定する設定候補です。",
    detailDescription:
      "Responses Createのtext.verbosity候補です。GPT-4o snapshotでの対応可否とSDK型を公式確認してから扱います。",
    status: "needs-confirmation",
    phase: "Future",
    uiPlacement: "Responses > Output format",
    implementation: "not connected",
    caution: "4o-only allowlistで利用可能か確認できるまでAPIへ送りません。",
  },
  {
    id: "responses-prompt",
    categoryId: "responses",
    officialName: "prompt",
    japaneseName: "保存済みプロンプト",
    shortDescription:
      "OpenAI側で管理する再利用可能な指示テンプレートを参照する設定候補です。",
    detailDescription:
      "Responses Createのprompt参照です。現在のDeveloper instructionsやDB source of truthとの役割を整理してから扱います。",
    status: "needs-confirmation",
    phase: "Future",
    uiPlacement: "Responses > Prompt",
    implementation: "not connected",
    caution: "OpenAI側の保存済み設定へ依存するため、現在はAPIへ送りません。",
  },
  {
    id: "responses-web-search-tool",
    categoryId: "responses",
    officialName: "web search tool",
    japaneseName: "Web検索ツール",
    shortDescription:
      "AIがインターネット上の情報を検索するための追加機能です。",
    detailDescription:
      "Responses toolsのWeb searchです。参照表示、外部アクセス、保存方針を設計してから実装します。",
    status: "planned",
    phase: "Future tools phase",
    uiPlacement: "Responses > Tools",
    implementation: "not connected",
    caution: "外部検索を勝手に実行しません。",
  },
  {
    id: "responses-file-search-tool",
    categoryId: "responses",
    officialName: "file search tool",
    japaneseName: "ファイル検索ツール",
    shortDescription:
      "登録済みファイルから関係する情報を探すための追加機能です。",
    detailDescription:
      "Responses toolsのFile searchです。Files、Vector Stores、権限、引用表示と合わせて設計します。",
    status: "planned",
    phase: "Future tools phase",
    uiPlacement: "Responses > Tools",
    implementation: "not connected",
    caution: "ファイル・PDF・Vector Store実処理はまだ有効化しません。",
  },
  {
    id: "responses-function-tool",
    categoryId: "responses",
    officialName: "function tool",
    japaneseName: "関数ツール",
    shortDescription:
      "AIからアプリ内の決められた処理を呼び出すための追加機能です。",
    detailDescription:
      "Responses toolsのFunction callingです。許可一覧、入力検証、副作用確認、結果保存が必要です。",
    status: "planned",
    phase: "Future tools phase",
    uiPlacement: "Responses > Tools",
    implementation: "not connected",
    caution: "任意処理や危険な操作を実行可能にしません。",
  },
  {
    id: "responses-code-interpreter-tool",
    categoryId: "responses",
    officialName: "code interpreter / container tool",
    japaneseName: "コード実行・コンテナツール",
    shortDescription:
      "隔離された環境でコードやファイル処理を実行する追加機能です。",
    detailDescription:
      "Responses toolsのCode InterpreterやContainer関連機能候補です。公式階層と4oSphereでの扱いは要確認です。",
    status: "needs-confirmation",
    phase: "Future tools phase",
    uiPlacement: "Responses > Tools",
    implementation: "not connected",
    caution: "コード実行、ファイル処理、外部アクセスを有効化しません。",
  },
  {
    id: "responses-top-logprobs",
    categoryId: "responses",
    officialName: "top_logprobs",
    japaneseName: "候補確率の詳細",
    shortDescription:
      "各位置で選ばれやすかった単語候補と確率情報を追加取得する設定です。",
    detailDescription:
      "Responses Createのtop_logprobsです。通常チャット表示には不要な分析向け情報のため、現在は利用しません。",
    status: "placeholder",
    phase: "Future developer diagnostics",
    uiPlacement: "Responses > Developer diagnostics",
    implementation: "not connected",
    caution: "表示量と保存量が増えるため、通常UIへ出しません。",
  },
  {
    id: "responses-deprecated-user",
    categoryId: "responses",
    officialName: "user",
    japaneseName: "旧ユーザー識別子",
    shortDescription:
      "以前使われていた、利用者を安定して識別するための設定です。",
    detailDescription:
      "Responses Createでdeprecatedのuserです。公式Referenceではsafety_identifierとprompt_cache_keyへの移行が案内されています。",
    status: "legacy",
    phase: "Deferred",
    uiPlacement: "Responses > Legacy",
    implementation: "not connected",
    caution: "個人情報や内部user idをOpenAIへ送らず、この旧設定も使いません。",
  },
  {
    id: "responses-mcp-tool",
    categoryId: "responses",
    officialName: "MCP tool",
    japaneseName: "外部サービス連携ツール",
    shortDescription: "外部サービスや専用ツールへ接続するための追加機能です。",
    detailDescription:
      "Responses toolsのMCP tool候補です。認証、許可、承認、外部送信範囲の設計が必要です。",
    status: "needs-confirmation",
    phase: "Future tools phase",
    uiPlacement: "Responses > Tools",
    implementation: "not connected",
    caution: "外部サービスへの接続やデータ送信を有効化しません。",
  },
  {
    id: "responses-computer-use-tool",
    categoryId: "responses",
    officialName: "computer use tool",
    japaneseName: "画面操作ツール",
    shortDescription: "AIが画面を見ながら操作するための追加機能です。",
    detailDescription:
      "Responses toolsのComputer use候補です。4o-only方針との対応可否も含めて要確認です。",
    status: "unsupported",
    phase: "Deferred",
    uiPlacement: "Responses > Dangerous tools",
    implementation: "not connected",
    caution: "画面操作や外部操作を実行可能にしません。",
  },
  {
    id: "responses-image-generation-tool",
    categoryId: "responses",
    officialName: "image generation tool",
    japaneseName: "画像生成ツール",
    shortDescription: "AIの応答中に画像を生成するための追加機能です。",
    detailDescription:
      "Responses toolsのImage generation候補です。画像保存・表示・モデル方針と合わせて後続検討します。",
    status: "unsupported",
    phase: "Future image phase",
    uiPlacement: "Responses > Tools",
    implementation: "not connected",
    caution: "画像生成実処理や画像モデル追加は行いません。",
  },
  {
    id: "responses-shell-apply-patch-tool",
    categoryId: "responses",
    officialName: "shell / apply_patch tools",
    japaneseName: "コマンド・ファイル変更ツール",
    shortDescription:
      "コマンド実行やファイル変更を行う危険性の高い追加機能です。",
    detailDescription:
      "Responses toolsのShellやApply patch候補です。4oSphere通常チャットでは実行しません。",
    status: "unsupported",
    phase: "Deferred",
    uiPlacement: "Responses > Dangerous tools",
    implementation: "not connected",
    caution: "シェル実行、ファイル変更、破壊的操作を有効化しません。",
  },

  {
    id: "conversations-create",
    categoryId: "conversations",
    officialName: "Create conversation",
    japaneseName: "会話作成",
    shortDescription: "OpenAI側conversationを作る候補です。",
    detailDescription:
      "4oSphereではSupabase chatsがsource of truthです。OpenAI Conversations API連携はまだ行いません。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Conversations > Lifecycle",
    implementation: "placeholder",
    caution: "既存chat routingと二重管理にしません。",
  },
  {
    id: "conversations-items",
    categoryId: "conversations",
    officialName: "Conversation items",
    japaneseName: "会話項目",
    shortDescription: "会話内itemの追加・取得・更新候補です。",
    detailDescription:
      "message_turns/user_messages/assistant variantsとの対応関係を設計してから扱います。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Conversations > Items",
    implementation: "placeholder",
    caution: "turn/variant modelを壊しません。",
  },
  {
    id: "conversations-state",
    categoryId: "conversations",
    officialName: "State synchronization",
    japaneseName: "状態同期",
    shortDescription: "OpenAI側会話状態とDB状態の同期候補です。",
    detailDescription:
      "現時点ではprevious_response_idやconversation stateを使わず、DB履歴から毎回inputを構築します。",
    status: "unsupported",
    phase: "Deferred",
    uiPlacement: "Conversations > State",
    implementation: "not used",
    caution: "source of truthを分散させません。",
  },

  {
    id: "chat-completions-messages",
    categoryId: "chat-completions",
    officialName: "messages",
    japaneseName: "メッセージ配列",
    shortDescription: "Chat Completions形式のmessage payloadです。",
    detailDescription:
      "4oSphereの新規実装はResponses API中心です。互換用途のplaceholderとして残します。",
    status: "legacy",
    phase: "Deferred",
    uiPlacement: "Chat Completions > Request",
    implementation: "not connected",
    caution: "Responsesと二重実装しません。",
  },
  {
    id: "chat-completions-stream",
    categoryId: "chat-completions",
    officialName: "stream",
    japaneseName: "ストリーミング",
    shortDescription: "Chat Completions旧APIのstream設定です。",
    detailDescription:
      "streamingを実装するときも現行方針ではResponses APIを優先します。",
    status: "legacy",
    phase: "Deferred",
    uiPlacement: "Chat Completions > Execution",
    implementation: "not connected",
    caution: "旧APIで新規streaming実装しません。",
  },

  {
    id: "realtime-sessions",
    categoryId: "realtime",
    officialName: "sessions",
    japaneseName: "セッション",
    shortDescription: "Realtime接続用sessionの設定候補です。",
    detailDescription:
      "WebRTC/WebSocket接続、ephemeral secret、音声入出力UIが必要です。Phase 4では入口のみです。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Realtime > Sessions",
    implementation: "placeholder",
    caution: "client secret発行UIは作りません。",
  },
  {
    id: "realtime-audio",
    categoryId: "realtime",
    officialName: "audio",
    japaneseName: "リアルタイム音声",
    shortDescription: "低遅延音声会話の設定候補です。",
    detailDescription:
      "microphone permission、codec、turn detection、interrupt handlingが必要です。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Realtime > Audio",
    implementation: "placeholder",
    caution: "音声実処理はまだ有効化しません。",
  },

  {
    id: "audio-transcriptions",
    categoryId: "audio",
    officialName: "Transcriptions",
    japaneseName: "文字起こし",
    shortDescription: "音声を文字に変換します。",
    detailDescription:
      "voice input実装時に録音、upload、言語指定、結果編集UIと合わせて扱います。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Audio > Input",
    implementation: "placeholder",
    caution: "録音データの保存方針が必要です。",
  },
  {
    id: "audio-speech",
    categoryId: "audio",
    officialName: "Speech",
    japaneseName: "読み上げ",
    shortDescription: "テキストから音声を生成します。",
    detailDescription:
      "assistant responseの読み上げ、voice選択、再生UI、保存方針を後続で設計します。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Audio > Output",
    implementation: "placeholder",
    caution: "音声生成APIはまだ呼びません。",
  },

  {
    id: "images-generate",
    categoryId: "images",
    officialName: "Generate image",
    japaneseName: "画像生成",
    shortDescription: "promptから画像を生成します。",
    detailDescription:
      "画像生成はchat responseとは別の出力管理が必要です。Phase 4では項目のみ残します。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Images > Generation",
    implementation: "placeholder",
    caution: "画像生成APIは呼びません。",
  },
  {
    id: "images-edit",
    categoryId: "images",
    officialName: "Edit image",
    japaneseName: "画像編集",
    shortDescription: "既存画像を編集します。",
    detailDescription:
      "upload、mask、出力保存、削除UIが必要です。実処理は後続です。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Images > Editing",
    implementation: "placeholder",
    caution: "画像upload実処理はまだ入れません。",
  },

  {
    id: "videos-generate",
    categoryId: "videos",
    officialName: "Generate video",
    japaneseName: "動画生成",
    shortDescription: "promptや参照素材から動画を生成します。",
    detailDescription:
      "長時間ジョブ、進捗、保存、再生UIが必要です。Phase 4ではplaceholderです。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Videos > Generation",
    implementation: "placeholder",
    caution: "動画APIは呼びません。",
  },
  {
    id: "videos-remix-extend",
    categoryId: "videos",
    officialName: "Remix / extend",
    japaneseName: "リミックス・延長",
    shortDescription: "既存動画の編集や延長候補です。",
    detailDescription:
      "file handlingとasync job管理が必要なため入口のみ表示します。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Videos > Editing",
    implementation: "placeholder",
    caution: "動画実処理は入れません。",
  },

  {
    id: "embeddings-create",
    categoryId: "embeddings",
    officialName: "Create embeddings",
    japaneseName: "埋め込み作成",
    shortDescription: "textをvectorへ変換します。",
    detailDescription:
      "PDF knowledgeやsemantic searchで使う候補です。Phase 4では呼びません。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Embeddings > Create",
    implementation: "placeholder",
    caution: "vector DB設計が必要です。",
  },
  {
    id: "embeddings-dimensions",
    categoryId: "embeddings",
    officialName: "dimensions",
    japaneseName: "次元数",
    shortDescription: "embedding vectorの次元指定候補です。",
    detailDescription:
      "保存先index schemaとセットで決める必要があります。Phase 4では表示のみです。",
    status: "needs-confirmation",
    phase: "Future",
    uiPlacement: "Embeddings > Advanced",
    implementation: "placeholder",
    caution: "DB schema変更なしに有効化しません。",
  },

  {
    id: "moderations-input",
    categoryId: "moderations",
    officialName: "Input moderation",
    japaneseName: "入力安全性判定",
    shortDescription: "user inputを送信前に判定する候補です。",
    detailDescription:
      "UX、ブロック理由、保存前/保存後の扱いを設計してから入れます。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Moderations > Input",
    implementation: "placeholder",
    caution: "判定結果の保存と表示方針が必要です。",
  },
  {
    id: "moderations-output",
    categoryId: "moderations",
    officialName: "Output moderation",
    japaneseName: "出力安全性判定",
    shortDescription: "assistant outputを表示前に判定する候補です。",
    detailDescription:
      "response generation後の追加API呼び出しになるため、latencyとエラー処理設計が必要です。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Moderations > Output",
    implementation: "placeholder",
    caution: "OpenAI API呼び出しはまだ追加しません。",
  },

  {
    id: "files-upload",
    categoryId: "files",
    officialName: "Upload file",
    japaneseName: "ファイルアップロード",
    shortDescription: "OpenAI側へファイルをアップロードします。",
    detailDescription:
      "Files API実処理はまだ入れません。Supabase storageやretentionと分けて設計します。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Files > Upload",
    implementation: "placeholder",
    caution: "API実行ボタンは作りません。",
  },
  {
    id: "files-purpose",
    categoryId: "files",
    officialName: "purpose",
    japaneseName: "用途",
    shortDescription: "fileの用途指定です。",
    detailDescription:
      "fine-tuning、assistants/vector search等で用途が異なります。Phase 4では説明のみです。",
    status: "placeholder",
    phase: "Future",
    uiPlacement: "Files > Metadata",
    implementation: "placeholder",
    caution: "用途別retention設計が必要です。",
  },

  {
    id: "uploads-parts",
    categoryId: "uploads",
    officialName: "Upload parts",
    japaneseName: "分割アップロード",
    shortDescription: "大容量fileをpartsに分けて送ります。",
    detailDescription:
      "大容量uploadの進捗、resume、failure handlingが必要です。Phase 4では入口のみです。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Uploads > Parts",
    implementation: "placeholder",
    caution: "実upload処理は入れません。",
  },
  {
    id: "uploads-complete-cancel",
    categoryId: "uploads",
    officialName: "Complete / cancel upload",
    japaneseName: "完了・キャンセル",
    shortDescription: "分割uploadの完了や中止です。",
    detailDescription:
      "中止やcleanupは副作用を伴うため、確認UIと状態管理が必要です。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Uploads > Lifecycle",
    implementation: "placeholder",
    caution: "destructive操作は作りません。",
  },

  {
    id: "vector-stores-create",
    categoryId: "vector-stores",
    officialName: "Create vector store",
    japaneseName: "ベクトルストア作成",
    shortDescription: "検索用data storeを作成します。",
    detailDescription:
      "PDF knowledge実装時にOpenAI Vector StoresかSupabase pgvectorか判断します。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Vector Stores > Lifecycle",
    implementation: "placeholder",
    caution: "DB/storage/index整合が必要です。",
  },
  {
    id: "vector-stores-file-batches",
    categoryId: "vector-stores",
    officialName: "File batches",
    japaneseName: "ファイルバッチ",
    shortDescription: "複数fileをvector storeへ投入します。",
    detailDescription:
      "upload、indexing status、失敗retry、参照表示を後続で扱います。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Vector Stores > Files",
    implementation: "placeholder",
    caution: "PDF knowledge phaseまで実行しません。",
  },

  {
    id: "models-list",
    categoryId: "models",
    officialName: "List models",
    japaneseName: "モデル一覧",
    shortDescription: "利用可能モデル一覧を取得します。",
    detailDescription:
      "4oSphereはGPT_4O_MODEL_OPTIONSをsource of truthにします。Models API一覧取得はまだしません。",
    status: "needs-confirmation",
    phase: "Future",
    uiPlacement: "Models > Discovery",
    implementation: "placeholder",
    caution: "4o-only allowlistを崩しません。",
  },
  {
    id: "models-retrieve",
    categoryId: "models",
    officialName: "Retrieve model",
    japaneseName: "モデル詳細",
    shortDescription: "特定モデルの情報を取得します。",
    detailDescription:
      "model metadata表示は将来候補ですが、現在はformal model idだけ保存・表示します。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Models > Metadata",
    implementation: "placeholder",
    caution: "gpt-4o aliasは使いません。",
  },

  {
    id: "batches-create",
    categoryId: "batches",
    officialName: "Create batch",
    japaneseName: "バッチ作成",
    shortDescription: "大量requestを非同期で作成します。",
    detailDescription:
      "4oSphere通常チャットとは別のjob UIが必要です。Phase 4では実行しません。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Batches > Lifecycle",
    implementation: "placeholder",
    caution: "実行ボタンは作りません。",
  },
  {
    id: "batches-status",
    categoryId: "batches",
    officialName: "Batch status",
    japaneseName: "バッチ状態",
    shortDescription: "非同期batchの進行状態です。",
    detailDescription:
      "monitoring、webhook、結果file取得が必要です。入口のみ表示します。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Batches > Monitoring",
    implementation: "placeholder",
    caution: "Files API連携が必要です。",
  },

  {
    id: "fine-tuning-jobs",
    categoryId: "fine-tuning",
    officialName: "Fine-tuning jobs",
    japaneseName: "学習ジョブ",
    shortDescription: "fine-tuning jobを作成・管理します。",
    detailDescription:
      "training file、validation、cost、job monitoringが必要です。通常チャットUIからは実行しません。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Fine-tuning > Jobs",
    implementation: "placeholder",
    caution: "実行UIは作りません。",
  },
  {
    id: "fine-tuning-checkpoints",
    categoryId: "fine-tuning",
    officialName: "Checkpoints",
    japaneseName: "チェックポイント",
    shortDescription: "学習途中や結果モデルの管理候補です。",
    detailDescription: "4oSphere通常ユーザー設定とは分けた管理画面が必要です。",
    status: "needs-confirmation",
    phase: "Future",
    uiPlacement: "Fine-tuning > Outputs",
    implementation: "placeholder",
    caution: "4o-only app方針との整合確認が必要です。",
  },

  {
    id: "evals-create",
    categoryId: "evals",
    officialName: "Create eval",
    japaneseName: "評価作成",
    shortDescription: "評価定義を作ります。",
    detailDescription:
      "prompt/model変更の品質確認に使える可能性がありますが、Phase 4では入口のみです。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Evals > Definitions",
    implementation: "placeholder",
    caution: "評価data管理が必要です。",
  },
  {
    id: "evals-runs",
    categoryId: "evals",
    officialName: "Runs",
    japaneseName: "評価実行",
    shortDescription: "評価を実行して結果を確認します。",
    detailDescription:
      "実行コストと結果保存があるため、通常チャット設定とは別管理にします。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Evals > Runs",
    implementation: "placeholder",
    caution: "実行ボタンは作りません。",
  },

  {
    id: "graders-definition",
    categoryId: "graders",
    officialName: "Grader definition",
    japaneseName: "採点器定義",
    shortDescription: "回答を評価するgrader設定です。",
    detailDescription:
      "公式階層と4oSphereでの扱いを要確認です。Evals/Fine-tuningとの関係を整理します。",
    status: "needs-confirmation",
    phase: "Future",
    uiPlacement: "Graders > Definition",
    implementation: "placeholder",
    caution: "独立親カテゴリとして残しつつ実行はしません。",
  },
  {
    id: "graders-rubrics",
    categoryId: "graders",
    officialName: "Rubrics",
    japaneseName: "採点基準",
    shortDescription: "評価観点や採点ルールです。",
    detailDescription:
      "将来、assistant response品質評価に使える可能性があります。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Graders > Rubrics",
    implementation: "placeholder",
    caution: "Phase 4では評価実行しません。",
  },

  {
    id: "webhooks-events",
    categoryId: "webhooks",
    officialName: "Events",
    japaneseName: "イベント",
    shortDescription: "通知対象のイベントです。",
    detailDescription:
      "batchやfine-tuning等の非同期処理と合わせて後続で扱います。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Webhooks > Events",
    implementation: "placeholder",
    caution: "webhook endpointは作りません。",
  },
  {
    id: "webhooks-verification",
    categoryId: "webhooks",
    officialName: "Signature verification",
    japaneseName: "署名検証",
    shortDescription: "webhook通知が正当か検証します。",
    detailDescription:
      "webhookを受ける場合はserver routeと署名検証が必須です。",
    status: "planned",
    phase: "Future",
    uiPlacement: "Webhooks > Security",
    implementation: "placeholder",
    caution: "secretをclientへ出しません。",
  },

  {
    id: "containers-create",
    categoryId: "containers",
    officialName: "Create container",
    japaneseName: "コンテナ作成",
    shortDescription: "隔離実行環境の作成候補です。",
    detailDescription:
      "code executionやfile処理の安全境界が必要です。通常チャット設定では実行しません。",
    status: "needs-confirmation",
    phase: "Future",
    uiPlacement: "Containers > Lifecycle",
    implementation: "placeholder",
    caution: "code execution実行UIは作りません。",
  },
  {
    id: "containers-files",
    categoryId: "containers",
    officialName: "Container files",
    japaneseName: "コンテナファイル",
    shortDescription: "実行環境内fileの扱いです。",
    detailDescription: "file lifecycleとretentionを設計してから扱います。",
    status: "needs-confirmation",
    phase: "Future",
    uiPlacement: "Containers > Files",
    implementation: "placeholder",
    caution: "外部file操作は有効化しません。",
  },

  {
    id: "skills-definitions",
    categoryId: "skills",
    officialName: "Skill definitions",
    japaneseName: "スキル定義",
    shortDescription: "再利用可能な作業手順の定義候補です。",
    detailDescription:
      "4oSphereの通常チャットにどう対応させるか要確認です。provider generalizationはしません。",
    status: "needs-confirmation",
    phase: "Future",
    uiPlacement: "Skills > Definitions",
    implementation: "placeholder",
    caution: "任意tool実行や外部操作は入れません。",
  },
  {
    id: "skills-packaging",
    categoryId: "skills",
    officialName: "Packaging",
    japaneseName: "パッケージ化",
    shortDescription: "skillの配布・再利用単位です。",
    detailDescription:
      "4oSphere内で扱うか、OpenAI APIカテゴリとして表示だけにするか要確認です。",
    status: "needs-confirmation",
    phase: "Future",
    uiPlacement: "Skills > Management",
    implementation: "placeholder",
    caution: "plugin/provider拡張に広げません。",
  },

  {
    id: "chatkit-sessions",
    categoryId: "chatkit",
    officialName: "Sessions",
    japaneseName: "セッション",
    shortDescription: "ChatKitのsession管理候補です。",
    detailDescription:
      "4oSphereは独自AppShellを持つため、ChatKit採用は要確認です。",
    status: "needs-confirmation",
    phase: "Future",
    uiPlacement: "ChatKit > Sessions",
    implementation: "placeholder",
    caution: "既存UIを置き換えません。",
  },
  {
    id: "chatkit-threads",
    categoryId: "chatkit",
    officialName: "Threads / items",
    japaneseName: "スレッド・項目",
    shortDescription: "ChatKit上のthread/item管理候補です。",
    detailDescription:
      "Supabase chats/message_turnsとの二重管理になる可能性があります。",
    status: "needs-confirmation",
    phase: "Future",
    uiPlacement: "ChatKit > Data",
    implementation: "placeholder",
    caution: "既存DB routingを壊しません。",
  },

  {
    id: "administration-api-keys",
    categoryId: "administration",
    officialName: "API keys",
    japaneseName: "APIキー管理",
    shortDescription: "組織・projectのAPI key管理です。",
    detailDescription:
      "4oSphere通常ユーザーUIでは実行しません。API keyの表示・作成・削除UIは作りません。",
    status: "admin",
    phase: "Not in user UI",
    uiPlacement: "Administration > Security",
    implementation: "display-only warning",
    caution: "secretや管理者操作をclientへ出しません。",
  },
  {
    id: "administration-users-roles",
    categoryId: "administration",
    officialName: "Users / roles",
    japaneseName: "ユーザー・ロール",
    shortDescription: "組織ユーザーや権限管理です。",
    detailDescription:
      "通常チャットアプリのSettings > Modelから操作するものではありません。",
    status: "admin",
    phase: "Not in user UI",
    uiPlacement: "Administration > Access",
    implementation: "display-only warning",
    caution: "Admin API実行UIは作りません。",
  },
  {
    id: "administration-usage-costs",
    categoryId: "administration",
    officialName: "Usage / costs",
    japaneseName: "利用量・費用",
    shortDescription: "組織やprojectの利用量・費用管理です。",
    detailDescription:
      "将来のcost表示はassistant_response_variants metadataから始めます。Admin APIは実行しません。",
    status: "admin",
    phase: "Future",
    uiPlacement: "Administration > Usage",
    implementation: "display-only warning",
    caution: "組織利用量をclientへ出しません。",
  },

  {
    id: "legacy-assistants",
    categoryId: "legacy-apis",
    officialName: "Assistants API",
    japaneseName: "旧Assistants API",
    shortDescription: "旧来のassistant/thread/run APIです。",
    detailDescription:
      "4oSphereの新規実装ではResponses APIを優先します。互換用途として分類のみ残します。",
    status: "legacy",
    phase: "Deferred",
    uiPlacement: "Legacy APIs > Assistants",
    implementation: "not connected",
    caution: "新規実装の中心にしません。",
  },
  {
    id: "legacy-completions",
    categoryId: "legacy-apis",
    officialName: "Completions",
    japaneseName: "旧Completions",
    shortDescription: "prompt文字列ベースの旧APIです。",
    detailDescription:
      "チャット履歴やvariant modelと相性が悪いため、表示のみ残します。",
    status: "legacy",
    phase: "Deferred",
    uiPlacement: "Legacy APIs > Completions",
    implementation: "not connected",
    caution: "payloadへ接続しません。",
  },
  {
    id: "legacy-realtime-beta",
    categoryId: "legacy-apis",
    officialName: "Realtime Beta",
    japaneseName: "旧Realtime Beta",
    shortDescription: "旧beta系Realtime APIです。",
    detailDescription:
      "Realtime実装時も現在のAPIを優先し、旧betaは互換用途として扱います。",
    status: "legacy",
    phase: "Deferred",
    uiPlacement: "Legacy APIs > Realtime",
    implementation: "not connected",
    caution: "旧APIへ新規接続しません。",
  },
] as const satisfies readonly ApiSettingSubcategoryDefinition[];

const API_SETTING_SUBCATEGORY_DEFINITIONS: readonly ApiSettingSubcategoryDefinition[] =
  [
    ...BASE_API_SETTING_SUBCATEGORY_DEFINITIONS,
    ...LOWER_CATEGORY_INVENTORY_SEEDS.map((seed) => ({
      ...seed,
      caution:
        "この画面からは有効化・実行できません。入力欄、toggle、実行ボタン、API接続、保存対象は追加しません。",
      detailDescription: `${seed.shortDescription} OpenAI API Reference上の棚卸し候補として表示しますが、4oSphereの現Phaseでは実行しません。`,
      implementation: "display-only inventory; not connected",
      phase: "Inventory only",
    })),
  ];

const subcategoryOrderByCategory = new Map<string, number>();
const CATEGORY_CANONICAL_ORDER = [
  "responses",
  "common",
  "conversations",
  "chat-completions",
  "realtime",
  "audio",
  "images",
  "videos",
  "embeddings",
  "moderations",
  "files",
  "uploads",
  "vector-stores",
  "models",
  "batches",
  "fine-tuning",
  "evals",
  "graders",
  "webhooks",
  "containers",
  "skills",
  "chatkit",
  "administration",
  "legacy-apis",
] as const;

type FriendlyCopy = Pick<
  ApiSettingSubcategory,
  "effect" | "recommendation" | "whenToUse"
>;

const FRIENDLY_COPY_OVERRIDES: Partial<Record<string, FriendlyCopy>> = {
  "common-api-key": {
    effect:
      "この鍵があることで、4oSphereのサーバーがOpenAI APIを呼び出せます。",
    whenToUse: "画面からは触りません。管理者がサーバー環境変数で管理します。",
    recommendation:
      "ブラウザ、このタブ内の保存領域、端末への恒久保存、DBには保存しません。",
  },
  "responses-max-output-tokens": {
    effect:
      "小さくすると短くなり、長い説明は途中で切れることがあります。大きくすると長文を返せますが、時間やコストが増える場合があります。",
    whenToUse: "返答を短くしたい、または長文を許可したいときだけ指定します。",
    recommendation:
      "通常は未設定のままAPIデフォルトに任せます。目安は短め512、標準1024、長め2048、最大寄り4096です。",
  },
  "responses-temperature": {
    effect:
      "低いほど安定しやすく、高いほど多様・意外な返答になりやすくなります。賢さそのものを上げる設定ではありません。",
    whenToUse:
      "回答がぶれすぎる、または創作や発想を広げたいときだけ指定します。",
    recommendation:
      "通常は未設定です。安定寄りは0.2〜0.5、標準寄りは0.7前後、創作寄りは1.0前後が目安です。top_pと同時に変えないでください。",
  },
  "responses-top-p": {
    effect:
      "小さくすると有力な単語候補へ絞り、大きくすると幅広い候補から選びます。temperatureと似た方向の調整です。",
    whenToUse: "候補の選び方を細かく調整したいときだけ指定します。",
    recommendation:
      "通常は未設定です。基本はtemperatureかtop_pのどちらか一方だけを調整します。",
  },
  "responses-code-interpreter-tool": {
    effect:
      "4oSphereの通常チャット設定としては使いません。この画面から有効化・実行はできません。",
    whenToUse:
      "現Phaseでは触りません。安全な実行環境や許可設計を検討するときだけ確認します。",
    recommendation:
      "要確認のままにします。入力欄、toggle、実行ボタン、API接続は追加しません。",
  },
  "responses-mcp-tool": {
    effect:
      "外部サービスへ接続できる可能性がありますが、この画面から有効化・実行はできません。",
    whenToUse:
      "現Phaseでは触りません。認証、許可、送信範囲を安全に設計するときだけ確認します。",
    recommendation:
      "要確認のままにします。入力欄、toggle、実行ボタン、API接続は追加しません。",
  },
  "responses-computer-use-tool": {
    effect:
      "画面操作に関係する機能ですが、4oSphereでは使いません。この画面から有効化・実行はできません。",
    whenToUse: "触りません。現Phaseでは棚卸しのみです。",
    recommendation:
      "非対応のままにします。入力欄、toggle、実行ボタン、API接続は追加しません。",
  },
  "responses-image-generation-tool": {
    effect:
      "画像生成に関係する機能ですが、4oSphereの通常チャットでは使いません。この画面から有効化・実行はできません。",
    whenToUse: "触りません。現Phaseでは棚卸しのみです。",
    recommendation:
      "非対応のままにします。入力欄、toggle、実行ボタン、API接続は追加しません。",
  },
  "responses-shell-apply-patch-tool": {
    effect:
      "4oSphereの通常チャット設定としては使いません。この画面から有効化・実行はできません。",
    whenToUse: "触りません。現Phaseでは棚卸しのみです。",
    recommendation:
      "非対応のままにします。実行UI、toggle、API接続は追加しません。",
  },
};

function getDefaultFriendlyCopy(
  status: ApiSettingSubcategoryStatus,
): FriendlyCopy {
  switch (status) {
    case "implemented":
      return {
        effect: "現在の4oSphereの動作や生成内容に使われています。",
        whenToUse: "現在の動作や設定内容を確認したいときに見ます。",
        recommendation:
          "変更できる画面がある場合だけ、目的が明確なときに調整してください。",
      };
    case "fixed":
      return {
        effect: "現在は安全な値またはサーバー側の設定に固定されています。",
        whenToUse: "なぜ変更できないかを確認したいときに見ます。",
        recommendation: "通常は触る必要がありません。",
      };
    case "admin":
      return {
        effect:
          "組織やサーバー全体へ影響する可能性があります。この画面からは有効化・実行できません。",
        whenToUse: "管理者が運用方針を検討するときだけ確認します。",
        recommendation:
          "通常ユーザーは触りません。入力欄、toggle、実行ボタンは追加しません。",
      };
    case "legacy":
      return {
        effect:
          "以前の方式との互換性に関係します。この画面からは有効化・実行できません。",
        whenToUse: "古い実装との互換性を調べるときだけ確認します。",
        recommendation:
          "新しく使い始める場合は現在のAPI機能を優先し、旧APIの実行UIは追加しません。",
      };
    case "unsupported":
      return {
        effect:
          "4oSphereの現在の設計では利用しません。この画面からは有効化・実行できません。",
        whenToUse: "非対応の理由を確認したいときに見ます。",
        recommendation:
          "非対応のままにします。入力欄、toggle、実行ボタンは追加しません。",
      };
    case "needs-confirmation":
      return {
        effect:
          "対応可否や安全な使い方がまだ確定しておらず、この画面からは有効化・実行できません。",
        whenToUse: "将来の対応範囲を検討するときに確認します。",
        recommendation:
          "公式仕様と安全性の確認が終わるまで、入力欄、toggle、実行ボタンは追加しません。",
      };
    case "planned":
    case "placeholder":
      return {
        effect:
          "この画面からは有効化・実行できません。現在は説明だけで、チャット生成の動作も変わりません。",
        whenToUse: "今後追加される可能性のある設定を確認するときに見ます。",
        recommendation:
          "今は棚卸しのみです。入力欄、toggle、実行ボタンは追加しません。",
      };
  }
}

export const API_SETTING_SUBCATEGORIES =
  API_SETTING_SUBCATEGORY_DEFINITIONS.map((subcategory) => {
    const canonicalResponsesIndex =
      subcategory.categoryId === "responses"
        ? RESPONSES_SUBCATEGORY_CANONICAL_ORDER.indexOf(
            subcategory.id as (typeof RESPONSES_SUBCATEGORY_CANONICAL_ORDER)[number],
          )
        : -1;
    const nextCategoryOrder =
      (subcategoryOrderByCategory.get(subcategory.categoryId) ?? 0) + 1;
    const order =
      canonicalResponsesIndex >= 0
        ? canonicalResponsesIndex + 1
        : nextCategoryOrder;
    const categoryNumber =
      CATEGORY_CANONICAL_ORDER.indexOf(
        subcategory.categoryId as (typeof CATEGORY_CANONICAL_ORDER)[number],
      ) + 1;
    const friendlyCopy =
      FRIENDLY_COPY_OVERRIDES[subcategory.id] ??
      getDefaultFriendlyCopy(subcategory.status);

    subcategoryOrderByCategory.set(
      subcategory.categoryId,
      Math.max(nextCategoryOrder, order),
    );

    return {
      ...subcategory,
      displayName: `${subcategory.officialName} / ${subcategory.japaneseName}`,
      displayStatusLabel:
        subcategory.id === "common-api-key"
          ? "サーバー管理"
          : API_SETTING_SUBCATEGORY_STATUS_LABELS[subcategory.status],
      effect: friendlyCopy.effect,
      nonTechnicalLabel: subcategory.japaneseName,
      notes: subcategory.detailDescription,
      officialPath: `API Reference > ${subcategory.uiPlacement} > ${subcategory.officialName}`,
      order,
      categoryNumber,
      recommendation: friendlyCopy.recommendation,
      risk: subcategory.caution,
      subcategoryNumber: order,
      technicalLabel: subcategory.officialName,
      what: subcategory.shortDescription,
      whenToUse: friendlyCopy.whenToUse,
    };
  }) satisfies readonly ApiSettingSubcategory[];

export function getApiSettingSubcategories(categoryId: string) {
  return API_SETTING_SUBCATEGORIES.filter(
    (subcategory) => subcategory.categoryId === categoryId,
  ).sort((left, right) => left.order - right.order);
}
