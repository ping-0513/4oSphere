export type ApiSettingCategoryStatus =
  | "implemented"
  | "planned"
  | "admin"
  | "legacy"
  | "needs-confirmation"
  | "unsupported";

export type ApiSettingCategory = {
  id: string;
  displayOrder: number;
  officialName: string;
  japaneseName: string;
  displayName: string;
  shortDescription: string;
  detailDescription: string;
  status: ApiSettingCategoryStatus;
  officialPath: string;
  phase: string;
  isModelBehaviorRelated: boolean;
  isAdminOnly: boolean;
  isImplemented: boolean;
  notes: string;
};

type ApiSettingCategoryDefinition = Omit<ApiSettingCategory, "displayOrder">;

export const API_SETTING_CATEGORY_CANONICAL_ORDER = [
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

const API_SETTING_CATEGORY_JAPANESE_METADATA = {
  responses: {
    japaneseName: "応答生成",
    shortDescription: "AIに入力を渡して返事を作る中心機能",
  },
  common: {
    japaneseName: "共通設定",
    shortDescription: "すべてのAPI呼び出しに関係する基本設定",
  },
  conversations: {
    japaneseName: "会話管理",
    shortDescription: "会話の流れや履歴を管理する機能",
  },
  "chat-completions": {
    japaneseName: "チャット補完",
    shortDescription: "メッセージ形式でAIに返事を作らせる旧来の主要API",
  },
  realtime: {
    japaneseName: "リアルタイム通信",
    shortDescription: "音声や会話を低遅延でやり取りする機能",
  },
  audio: {
    japaneseName: "音声",
    shortDescription: "音声を文字にしたり、文字を音声にする機能",
  },
  images: {
    japaneseName: "画像",
    shortDescription: "画像を作る・編集する・変化させる機能",
  },
  videos: {
    japaneseName: "動画",
    shortDescription: "動画を作る・編集する・延長する機能",
  },
  embeddings: {
    japaneseName: "埋め込み",
    shortDescription: "テキストなどを検索しやすい数値データに変換する機能",
  },
  moderations: {
    japaneseName: "安全性判定",
    shortDescription: "入力や出力が危険でないか判定する機能",
  },
  files: {
    japaneseName: "ファイル",
    shortDescription: "APIで使うファイルを管理する機能",
  },
  uploads: {
    japaneseName: "大容量アップロード",
    shortDescription: "大きなファイルを分割してアップロードする機能",
  },
  "vector-stores": {
    japaneseName: "ベクトルストア",
    shortDescription: "AIが参照する検索用データ置き場",
  },
  models: {
    japaneseName: "モデル",
    shortDescription: "利用できるAIモデルを確認・管理する機能",
  },
  batches: {
    japaneseName: "バッチ処理",
    shortDescription: "大量のAPIリクエストをまとめて非同期実行する機能",
  },
  "fine-tuning": {
    japaneseName: "ファインチューニング",
    shortDescription: "モデルを自分のデータで追加学習させる機能",
  },
  evals: {
    japaneseName: "評価",
    shortDescription: "AIの出力品質をテストする機能",
  },
  graders: {
    japaneseName: "採点器・評価器",
    shortDescription: "回答を自動採点するルールや仕組み",
  },
  webhooks: {
    japaneseName: "Webhook",
    shortDescription: "処理完了などのイベント通知を受け取る機能",
  },
  containers: {
    japaneseName: "実行コンテナ",
    shortDescription: "コード実行や作業用の隔離環境",
  },
  skills: {
    japaneseName: "スキル",
    shortDescription: "再利用できる作業手順や機能パック",
  },
  chatkit: {
    japaneseName: "ChatKit",
    shortDescription: "チャットUIやスレッドを組み込むための機能",
  },
  administration: {
    japaneseName: "管理者設定",
    shortDescription: "組織・プロジェクト・権限・利用量を管理する機能",
  },
  "legacy-apis": {
    japaneseName: "旧API・非推奨API",
    shortDescription: "以前の方式として残っているAPI",
  },
} satisfies Record<
  (typeof API_SETTING_CATEGORY_CANONICAL_ORDER)[number],
  { japaneseName: string; shortDescription: string }
>;

export const API_SETTING_STATUS_LABELS = {
  implemented: "一部使えます",
  planned: "後続予定",
  admin: "管理者・サーバー向け",
  legacy: "旧方式",
  "needs-confirmation": "対応要確認",
  unsupported: "画面からは使えません",
} satisfies Record<ApiSettingCategoryStatus, string>;

const API_SETTING_CATEGORY_DEFINITIONS = [
  {
    id: "common",
    officialName: "Common",
    japaneseName: "共通設定",
    displayName: "Common / 共通設定",
    shortDescription: "すべてのAPI呼び出しに関係する基本設定",
    detailDescription:
      "APIキー、プロジェクト指定、リクエストID、JSON形式など、どの機能を使うときにも共通で必要になる設定です。モデルの挙動というより「OpenAI APIにどう接続するか」を決めます。",
    status: "planned",
    officialPath:
      "API Reference > Introduction / Authentication / Common request options",
    phase: "Phase 4+",
    isModelBehaviorRelated: false,
    isAdminOnly: false,
    isImplemented: false,
    notes:
      "API keyやproject指定は秘密に関わるため、Phase 4Aでは親カテゴリのみ表示します。",
  },
  {
    id: "responses",
    officialName: "Responses",
    japaneseName: "応答生成",
    displayName: "Responses / 応答生成",
    shortDescription: "AIに入力を渡して返事を作る中心機能",
    detailDescription:
      "テキスト、画像、音声、ファイルなどを入力して、モデルから応答を受け取るための現在中心的なAPIです。ツール呼び出し、推論設定、ストリーミング、構造化出力などもここで扱います。",
    status: "implemented",
    officialPath: "API Reference > Responses API > Responses",
    phase: "Phase 3A+",
    isModelBehaviorRelated: true,
    isAdminOnly: false,
    isImplemented: true,
    notes:
      "4oSphereではnon-streaming text responseの一部のみ実装済みです。tools、streaming、structured output、multimodal inputは未実装です。",
  },
  {
    id: "conversations",
    officialName: "Conversations",
    japaneseName: "会話管理",
    displayName: "Conversations / 会話管理",
    shortDescription: "会話の流れや履歴を管理する機能",
    detailDescription:
      "複数ターンの会話を保存・取得・更新するための機能です。「前の発言を踏まえて答える」ようなアプリを作るときに使います。",
    status: "planned",
    officialPath: "API Reference > Responses API > Conversations",
    phase: "Future",
    isModelBehaviorRelated: true,
    isAdminOnly: false,
    isImplemented: false,
    notes:
      "現在の会話source of truthはSupabaseです。OpenAI Conversations APIはまだ使いません。",
  },
  {
    id: "chat-completions",
    officialName: "Chat Completions",
    japaneseName: "チャット補完",
    displayName: "Chat Completions / チャット補完",
    shortDescription: "メッセージ形式でAIに返事を作らせる旧来の主要API",
    detailDescription:
      "system、user、assistant のような会話メッセージを渡して応答を作るAPIです。現在はResponses APIが中心ですが、既存実装や互換性のためにまだ重要です。",
    status: "legacy",
    officialPath: "API Reference > Chat Completions",
    phase: "Deferred",
    isModelBehaviorRelated: true,
    isAdminOnly: false,
    isImplemented: false,
    notes:
      "4oSphereの新規実装はResponses APIを中心にします。互換用途として親カテゴリだけ残します。",
  },
  {
    id: "realtime",
    officialName: "Realtime",
    japaneseName: "リアルタイム通信",
    displayName: "Realtime / リアルタイム通信",
    shortDescription: "音声や会話を低遅延でやり取りする機能",
    detailDescription:
      "音声会話、リアルタイム翻訳、WebRTC/WebSocket接続など、すぐに返事が必要な体験で使います。電話・音声エージェント・ライブ会話向けです。",
    status: "planned",
    officialPath: "API Reference > Realtime",
    phase: "Future",
    isModelBehaviorRelated: true,
    isAdminOnly: false,
    isImplemented: false,
    notes: "Phase 4Aでは接続やclient secret生成UIは追加しません。",
  },
  {
    id: "audio",
    officialName: "Audio",
    japaneseName: "音声",
    displayName: "Audio / 音声",
    shortDescription: "音声を文字にしたり、文字を音声にする機能",
    detailDescription:
      "音声認識、音声翻訳、読み上げ音声の生成を扱います。録音ファイルの文字起こし、英語翻訳、AI音声の再生などに使います。",
    status: "planned",
    officialPath: "API Reference > Platform APIs > Audio",
    phase: "Future",
    isModelBehaviorRelated: true,
    isAdminOnly: false,
    isImplemented: false,
    notes: "voice inputやspeech generationの実処理は後続フェーズです。",
  },
  {
    id: "images",
    officialName: "Images",
    japaneseName: "画像",
    displayName: "Images / 画像",
    shortDescription: "画像を作る・編集する・変化させる機能",
    detailDescription:
      "テキストから画像を生成したり、既存画像を編集したり、別バリエーションを作ったりします。サイズ、品質、背景、マスクなどもここで設定します。",
    status: "planned",
    officialPath: "API Reference > Platform APIs > Images",
    phase: "Future",
    isModelBehaviorRelated: true,
    isAdminOnly: false,
    isImplemented: false,
    notes: "画像添付・生成・編集はPhase 4Aでは実装しません。",
  },
  {
    id: "videos",
    officialName: "Videos",
    japaneseName: "動画",
    displayName: "Videos / 動画",
    shortDescription: "動画を作る・編集する・延長する機能",
    detailDescription:
      "プロンプトや参照画像から動画を生成したり、既存動画を編集・延長・リミックスするための機能です。秒数やサイズもここで指定します。",
    status: "planned",
    officialPath: "API Reference > Platform APIs > Videos",
    phase: "Future",
    isModelBehaviorRelated: true,
    isAdminOnly: false,
    isImplemented: false,
    notes: "動画API実行は未実装です。",
  },
  {
    id: "embeddings",
    officialName: "Embeddings",
    japaneseName: "埋め込み",
    displayName: "Embeddings / 埋め込み",
    shortDescription: "テキストなどを検索しやすい数値データに変換する機能",
    detailDescription:
      "文章の意味をベクトルという数値に変換します。検索、類似度比較、RAG、分類などで使います。ユーザーには「意味検索のための変換」と説明できます。",
    status: "planned",
    officialPath: "API Reference > Platform APIs > Embeddings",
    phase: "Future",
    isModelBehaviorRelated: false,
    isAdminOnly: false,
    isImplemented: false,
    notes: "PDF knowledgeやRAG実装時に再検討します。",
  },
  {
    id: "moderations",
    officialName: "Moderations",
    japaneseName: "安全性判定",
    displayName: "Moderations / 安全性判定",
    shortDescription: "入力や出力が危険でないか判定する機能",
    detailDescription:
      "テキストや画像に、暴力・自傷・性的内容などの安全性リスクがあるかをチェックします。投稿前チェックやAI出力の安全確認に使います。",
    status: "planned",
    officialPath: "API Reference > Platform APIs > Moderations",
    phase: "Future",
    isModelBehaviorRelated: false,
    isAdminOnly: false,
    isImplemented: false,
    notes: "Phase 4Aでは安全性判定APIは呼びません。",
  },
  {
    id: "files",
    officialName: "Files",
    japaneseName: "ファイル",
    displayName: "Files / ファイル",
    shortDescription: "APIで使うファイルを管理する機能",
    detailDescription:
      "学習、検索、音声、画像、バッチ処理などで使うファイルをアップロード・取得・削除します。OpenAI側に渡す素材やデータの置き場です。",
    status: "planned",
    officialPath: "API Reference > Platform APIs > Files",
    phase: "Future",
    isModelBehaviorRelated: false,
    isAdminOnly: false,
    isImplemented: false,
    notes: "ファイル操作やOpenAI側削除は実装しません。",
  },
  {
    id: "uploads",
    officialName: "Uploads",
    japaneseName: "大容量アップロード",
    displayName: "Uploads / 大容量アップロード",
    shortDescription: "大きなファイルを分割してアップロードする機能",
    detailDescription:
      "サイズの大きいファイルを一度に送らず、複数パーツに分けてアップロードするための機能です。大容量データを扱うときに使います。",
    status: "planned",
    officialPath: "API Reference > Platform APIs > Uploads",
    phase: "Future",
    isModelBehaviorRelated: false,
    isAdminOnly: false,
    isImplemented: false,
    notes: "大容量アップロード処理は未実装です。",
  },
  {
    id: "vector-stores",
    officialName: "Vector Stores",
    japaneseName: "ベクトルストア",
    displayName: "Vector Stores / ベクトルストア",
    shortDescription: "AIが参照する検索用データ置き場",
    detailDescription:
      "ファイルや文書を検索しやすい形で保存し、質問に関係する情報を探せるようにする機能です。社内文書検索、FAQ、RAGなどで使います。",
    status: "planned",
    officialPath: "API Reference > Vector Stores",
    phase: "Future",
    isModelBehaviorRelated: false,
    isAdminOnly: false,
    isImplemented: false,
    notes:
      "PDF knowledge実装時にOpenAI Vector StoresかSupabase pgvectorかを判断します。",
  },
  {
    id: "models",
    officialName: "Models",
    japaneseName: "モデル",
    displayName: "Models / モデル",
    shortDescription: "利用できるAIモデルを確認・管理する機能",
    detailDescription:
      "使えるモデルの一覧を取得したり、特定モデルの情報を確認したりします。ファインチューニング済みモデルの削除などもここに含まれます。",
    status: "planned",
    officialPath: "API Reference > Platform APIs > Models",
    phase: "Future",
    isModelBehaviorRelated: true,
    isAdminOnly: false,
    isImplemented: false,
    notes:
      "4o snapshot selectorはありますが、OpenAI Models APIの一覧取得・管理は実装していません。",
  },
  {
    id: "batches",
    officialName: "Batches",
    japaneseName: "バッチ処理",
    displayName: "Batches / バッチ処理",
    shortDescription: "大量のAPIリクエストをまとめて非同期実行する機能",
    detailDescription:
      "すぐ返事が必要ない大量処理をまとめて実行する機能です。大量の分類、要約、変換などをコスト効率よく処理したいときに使います。",
    status: "planned",
    officialPath: "API Reference > Platform APIs > Batches",
    phase: "Future",
    isModelBehaviorRelated: false,
    isAdminOnly: false,
    isImplemented: false,
    notes: "batch実行・監視UIは未実装です。",
  },
  {
    id: "fine-tuning",
    officialName: "Fine-tuning",
    japaneseName: "ファインチューニング",
    displayName: "Fine-tuning / ファインチューニング",
    shortDescription: "モデルを自分のデータで追加学習させる機能",
    detailDescription:
      "既存モデルに特定の文体、形式、判断基準などを覚えさせるための機能です。学習ファイル、検証ファイル、学習回数などを設定します。",
    status: "planned",
    officialPath: "API Reference > Platform APIs > Fine Tuning",
    phase: "Future",
    isModelBehaviorRelated: true,
    isAdminOnly: false,
    isImplemented: false,
    notes: "4oSphereの通常チャットとは別の管理機能として扱います。",
  },
  {
    id: "evals",
    officialName: "Evals",
    japaneseName: "評価",
    displayName: "Evals / 評価",
    shortDescription: "AIの出力品質をテストする機能",
    detailDescription:
      "プロンプトやモデルの回答が期待通りかを測るための機能です。アプリの品質確認、モデル比較、変更前後の検証に使います。",
    status: "planned",
    officialPath: "API Reference > Platform APIs > Evals",
    phase: "Future",
    isModelBehaviorRelated: false,
    isAdminOnly: false,
    isImplemented: false,
    notes: "評価実行や結果保存は後続フェーズです。",
  },
  {
    id: "graders",
    officialName: "Graders",
    japaneseName: "採点器・評価器",
    displayName: "Graders / 採点器・評価器",
    shortDescription: "回答を自動採点するルールや仕組み",
    detailDescription:
      "AIの回答を「正しいか」「条件を満たすか」「望ましい形式か」などで評価するための部品です。Evalsと組み合わせて使うことが多いです。",
    status: "needs-confirmation",
    officialPath:
      "API Reference > Platform APIs > Fine Tuning > Alpha > Graders",
    phase: "Future",
    isModelBehaviorRelated: false,
    isAdminOnly: false,
    isImplemented: false,
    notes:
      "公式階層ではFine Tuning Alpha配下に現れるため、UIでは親カテゴリとして残しつつ扱いを要確認にします。",
  },
  {
    id: "webhooks",
    officialName: "Webhooks",
    japaneseName: "Webhook",
    displayName: "Webhooks / Webhook",
    shortDescription: "処理完了などのイベント通知を受け取る機能",
    detailDescription:
      "非同期処理やイベントが発生したときに、自分のサーバーへ通知を送ってもらう仕組みです。完了待ちをずっと監視しなくてよくなります。",
    status: "planned",
    officialPath: "API Reference > Webhooks",
    phase: "Future",
    isModelBehaviorRelated: false,
    isAdminOnly: false,
    isImplemented: false,
    notes: "webhook受信endpointや署名検証は未実装です。",
  },
  {
    id: "containers",
    officialName: "Containers",
    japaneseName: "実行コンテナ",
    displayName: "Containers / 実行コンテナ",
    shortDescription: "コード実行や作業用の隔離環境",
    detailDescription:
      "コード実行やファイル処理を行うための安全な実行環境です。ファイルを置いたり、処理結果を取得したりできます。",
    status: "needs-confirmation",
    officialPath: "API Reference > Containers",
    phase: "Future",
    isModelBehaviorRelated: false,
    isAdminOnly: false,
    isImplemented: false,
    notes: "4oSphere通常チャットに入れるか要確認です。実行UIは出しません。",
  },
  {
    id: "skills",
    officialName: "Skills",
    japaneseName: "スキル",
    displayName: "Skills / スキル",
    shortDescription: "再利用できる作業手順や機能パック",
    detailDescription:
      "特定の作業手順、ツール設定、知識、処理フローをまとめて再利用するための仕組みです。決まった業務やワークフローをAIに安定して実行させたいときに使います。",
    status: "needs-confirmation",
    officialPath: "API Reference > Skills",
    phase: "Future",
    isModelBehaviorRelated: false,
    isAdminOnly: false,
    isImplemented: false,
    notes:
      "4oSphereの機能として扱うか要確認です。provider generalizationはしません。",
  },
  {
    id: "chatkit",
    officialName: "ChatKit",
    japaneseName: "ChatKit",
    displayName: "ChatKit / ChatKit",
    shortDescription: "チャットUIやスレッドを組み込むための機能",
    detailDescription:
      "自分のアプリにチャット体験を組み込むための機能です。セッション、スレッド、チャット項目などを扱います。",
    status: "needs-confirmation",
    officialPath: "API Reference > ChatKit",
    phase: "Future",
    isModelBehaviorRelated: false,
    isAdminOnly: false,
    isImplemented: false,
    notes: "4oSphereは独自UIを持つため、ChatKit採用は要確認です。",
  },
  {
    id: "administration",
    officialName: "Administration",
    japaneseName: "管理者設定",
    displayName: "Administration / 管理者設定",
    shortDescription: "組織・プロジェクト・権限・利用量を管理する機能",
    detailDescription:
      "APIキー、ユーザー、ロール、プロジェクト、利用量、費用、レート制限、証明書、データ保持などを管理します。通常ユーザーではなく管理者向けです。",
    status: "admin",
    officialPath: "API Reference > Administration",
    phase: "Future",
    isModelBehaviorRelated: false,
    isAdminOnly: true,
    isImplemented: false,
    notes:
      "通常ユーザーUIでは実行機能を出しません。API key管理や管理者操作も実装しません。",
  },
  {
    id: "legacy-apis",
    officialName: "Legacy APIs",
    japaneseName: "旧API・非推奨API",
    displayName: "Legacy APIs / 旧API・非推奨API",
    shortDescription: "以前の方式として残っているAPI",
    detailDescription:
      "Assistants API、旧Completions、旧Realtime Betaなど、過去の実装との互換性のために残っているAPIです。新規実装では基本的に現在のAPIを優先します。",
    status: "legacy",
    officialPath: "API Reference > Legacy",
    phase: "Deferred",
    isModelBehaviorRelated: false,
    isAdminOnly: false,
    isImplemented: false,
    notes: "新規実装の中心にはしません。互換用途の親カテゴリとして残します。",
  },
] as const satisfies readonly ApiSettingCategoryDefinition[];

export const API_SETTING_CATEGORIES = API_SETTING_CATEGORY_CANONICAL_ORDER.map(
  (categoryId, index) => {
    const category = API_SETTING_CATEGORY_DEFINITIONS.find(
      (candidate) => candidate.id === categoryId,
    );

    if (!category) {
      throw new Error(`Missing API setting category metadata: ${categoryId}`);
    }

    return {
      ...category,
      displayOrder: index + 1,
      displayName: `${category.officialName} / ${API_SETTING_CATEGORY_JAPANESE_METADATA[categoryId].japaneseName}`,
      japaneseName:
        API_SETTING_CATEGORY_JAPANESE_METADATA[categoryId].japaneseName,
      shortDescription:
        API_SETTING_CATEGORY_JAPANESE_METADATA[categoryId].shortDescription,
    };
  },
) satisfies readonly ApiSettingCategory[];
