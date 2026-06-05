import { Copy, Pencil, RefreshCcw } from "lucide-react";

import { MarkdownMessage } from "@/components/markdown-message";
import { Button } from "@/components/ui/button";
import type { CurrentChat } from "@/types/chat";

type AssistantMetadata = {
  modelId: "gpt-4o-2024-05-13" | "gpt-4o-2024-08-06" | "gpt-4o-2024-11-20";
  inputTokens: number;
  outputTokens: number;
  estimatedCost: string;
};

type Message =
  | {
      role: "user";
      text: string;
      timestamp: string;
    }
  | {
      role: "assistant";
      text: string;
      metadata: AssistantMetadata;
    };

const messages: Message[] = [
  {
    role: "assistant",
    text: "4oSphere のアプリシェルを確認できます。ここでは API 呼び出しや永続化を行わず、画面構造だけを検証します。",
    metadata: {
      modelId: "gpt-4o-2024-05-13",
      inputTokens: 96,
      outputTokens: 128,
      estimatedCost: "$0.0019",
    },
  },
  {
    role: "assistant",
    text: "ヘッダーと入力欄は画面内に残り、会話リストだけがスクロールする構造です。",
    metadata: {
      modelId: "gpt-4o-2024-05-13",
      inputTokens: 104,
      outputTokens: 86,
      estimatedCost: "$0.0015",
    },
  },
  {
    role: "user",
    timestamp: "2026/06/06 14:04",
    text: "デスクトップでは左サイドバーを固定したまま、会話だけを読めるようにしたいです。",
  },
  {
    role: "assistant",
    text: "デスクトップでは左側にチャット一覧とナビゲーションを置き、中央の会話領域だけにスクロールを閉じ込めています。",
    metadata: {
      modelId: "gpt-4o-2024-08-06",
      inputTokens: 142,
      outputTokens: 118,
      estimatedCost: "$0.0022",
    },
  },
  {
    role: "user",
    timestamp: "2026/06/06 14:06",
    text: "モバイルではドロワーが下端で切れないかも確認したいです。",
  },
  {
    role: "assistant",
    text: "モバイルでは Radix Dialog のドロワーを使い、下端に safe-area 分の余白を確保しています。",
    metadata: {
      modelId: "gpt-4o-2024-08-06",
      inputTokens: 118,
      outputTokens: 104,
      estimatedCost: "$0.0019",
    },
  },
  {
    role: "assistant",
    text: "ナレッジ管理、設定、アカウント、ログアウトは Phase 1 では表示だけです。押しても認証や保存処理にはつながりません。",
    metadata: {
      modelId: "gpt-4o-2024-08-06",
      inputTokens: 132,
      outputTokens: 122,
      estimatedCost: "$0.0021",
    },
  },
  {
    role: "user",
    timestamp: "2026/06/06 14:09",
    text: "モデル表示は 4o-only の範囲で、押せるなら最低限の選択候補だけ見せてください。",
  },
  {
    role: "assistant",
    text: "モデル候補は `4o-0513`、`4o-0806`、`4o-1120` だけに限定しています。選択はローカル UI state のみで、API payload にはまだ反映しません。",
    metadata: {
      modelId: "gpt-4o-2024-11-20",
      inputTokens: 156,
      outputTokens: 132,
      estimatedCost: "$0.0025",
    },
  },
  {
    role: "user",
    timestamp: "2026/06/06 14:11",
    text: "Markdown の見出しや表も placeholder で確認したいです。",
  },
  {
    role: "assistant",
    text: `## Markdown 表示確認

- 箇条書き
- **強調**
- \`inline code\`

> 引用の確認

| 項目 | 状態 |
|---|---|
| Markdown | 表示確認 |
| Table | 横スクロール確認 |

\`\`\`ts
const model = "gpt-4o-2024-05-13";
\`\`\``,
    metadata: {
      modelId: "gpt-4o-2024-05-13",
      inputTokens: 128,
      outputTokens: 312,
      estimatedCost: "$0.0031",
    },
  },
  {
    role: "user",
    timestamp: "2026/06/06 14:13",
    text: "入力欄は複数行を書けるようにして、操作ボタンと重ならないようにしてください。",
  },
  {
    role: "assistant",
    text: "入力欄は自動で下方向に広がり、最大高さを超えたら入力欄の中だけがスクロールします。",
    metadata: {
      modelId: "gpt-4o-2024-11-20",
      inputTokens: 92,
      outputTokens: 88,
      estimatedCost: "$0.0015",
    },
  },
  {
    role: "assistant",
    text: "画像、マイク、Web 検索は composer の近くに並べています。画像とマイクは placeholder control で、実処理はありません。",
    metadata: {
      modelId: "gpt-4o-2024-11-20",
      inputTokens: 110,
      outputTokens: 108,
      estimatedCost: "$0.0018",
    },
  },
  {
    role: "user",
    timestamp: "2026/06/06 14:16",
    text: "Web 検索も実処理なしで、見た目の切り替えだけ確認できれば十分です。",
  },
  {
    role: "assistant",
    text: "Web 検索は local state の OFF / ON 表示だけです。検索リクエストや外部アクセスは発生しません。",
    metadata: {
      modelId: "gpt-4o-2024-05-13",
      inputTokens: 116,
      outputTokens: 96,
      estimatedCost: "$0.0018",
    },
  },
  {
    role: "assistant",
    text: "このメッセージ量で、header と composer が固定されているか、message list だけがスクロールするかを目視確認できます。",
    metadata: {
      modelId: "gpt-4o-2024-05-13",
      inputTokens: 120,
      outputTokens: 114,
      estimatedCost: "$0.0020",
    },
  },
  {
    role: "user",
    timestamp: "2026/06/06 14:19",
    text: "ユーザー発言は右寄せの吹き出し、モデル側は枠なし本文のほうが自然です。",
  },
  {
    role: "assistant",
    text: "モデル側の本文は吹き出しにせず、左寄せの読み物として表示しています。同一話者の連続発言は近く、話者が切り替わる箇所は少し間隔を広げています。",
    metadata: {
      modelId: "gpt-4o-2024-08-06",
      inputTokens: 144,
      outputTokens: 126,
      estimatedCost: "$0.0023",
    },
  },
];

type MessageListProps = {
  currentChat: CurrentChat | null;
};

export function MessageList({ currentChat }: MessageListProps) {
  if (!currentChat) {
    return (
      <div
        aria-label="No selected chat"
        className="message-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8"
      >
        <div className="mx-auto grid h-full w-full max-w-3xl place-items-center">
          <div className="max-w-sm text-center">
            <h1 className="text-xl font-semibold leading-8">
              No chat selected
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Create a new chat or choose one from the sidebar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label="メッセージ一覧"
      className="message-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col pb-6">
        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const speakerChanged = previous && previous.role !== message.role;
          const topMargin =
            index === 0 ? "mt-0" : speakerChanged ? "mt-8" : "mt-3";

          return message.role === "user" ? (
            <UserMessage
              key={`${message.role}-${index}`}
              message={message}
              topMargin={topMargin}
            />
          ) : (
            <AssistantMessage
              key={`${message.role}-${index}`}
              message={message}
              topMargin={topMargin}
            />
          );
        })}
      </div>
    </div>
  );
}

function UserMessage({
  message,
  topMargin,
}: {
  message: Extract<Message, { role: "user" }>;
  topMargin: string;
}) {
  return (
    <article
      className={`${topMargin} ml-auto w-fit max-w-[78%] md:max-w-[70%]`}
    >
      <div className="rounded-3xl border border-primary/20 bg-primary/78 px-4 py-3 text-primary-foreground shadow-sm shadow-primary/10 backdrop-blur">
        <p className="text-sm leading-6">{message.text}</p>
      </div>
      <div className="mt-1.5 flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <span className="mr-1">{message.timestamp}</span>
        <MessageAction
          icon="copy"
          label="ユーザーメッセージをコピー（未実装）"
        />
        <MessageAction icon="edit" label="ユーザーメッセージを編集（未実装）" />
      </div>
    </article>
  );
}

function AssistantMessage({
  message,
  topMargin,
}: {
  message: Extract<Message, { role: "assistant" }>;
  topMargin: string;
}) {
  const metadata = `${message.metadata.modelId} · In ${message.metadata.inputTokens} · Out ${message.metadata.outputTokens} · ${message.metadata.estimatedCost}`;

  return (
    <article
      className={`${topMargin} mr-auto w-full max-w-3xl px-1 py-1 text-foreground`}
    >
      <div className="max-w-[42rem] space-y-3 text-[0.95rem] leading-[1.55]">
        <MarkdownMessage content={message.text} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        <span className="mr-1">{metadata}</span>
        <MessageAction icon="copy" label="回答をコピー（未実装）" />
        <MessageAction icon="regenerate" label="回答を再生成（未実装）" />
      </div>
    </article>
  );
}

function MessageAction({
  icon,
  label,
}: {
  icon: "copy" | "edit" | "regenerate";
  label: string;
}) {
  const Icon = icon === "copy" ? Copy : icon === "edit" ? Pencil : RefreshCcw;

  return (
    <Button
      aria-label={label}
      className="size-7 rounded-xl text-muted-foreground hover:bg-accent/70"
      disabled
      size="icon"
      title={label}
      variant="ghost"
    >
      <Icon aria-hidden="true" className="size-3.5" />
    </Button>
  );
}

// TODO: regenerate は将来「新規 user prompt」として扱わず、同じ user
// message / turn に対する assistant response variant として扱う。
// TODO: user edit は将来、既存 message を単純上書きせず branch / resend として扱う。
