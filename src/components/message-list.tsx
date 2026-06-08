import { createChatAction } from "@/app/chat/actions";
import { AssistantMessageActions } from "@/components/assistant-message-actions";
import { MarkdownMessage } from "@/components/markdown-message";
import { NewChatForm } from "@/components/new-chat-submit-button";
import type { ResponseSettings } from "@/lib/openai/response-settings";
import { cn } from "@/lib/utils";
import type {
  CurrentChat,
  Gpt4oSnapshotLabel,
  PersistedChatMessage,
} from "@/types/chat";

type MessageListProps = {
  currentChat: CurrentChat | null;
  messages: PersistedChatMessage[];
  responseSettings: ResponseSettings;
  selectedSnapshot: Gpt4oSnapshotLabel;
};

const timestampFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Asia/Tokyo",
});

export function MessageList({
  currentChat,
  messages,
  responseSettings,
  selectedSnapshot,
}: MessageListProps) {
  if (!currentChat) {
    return (
      <MessageEmptyState
        description="新しいチャットを作成するか、サイドバーから選択してください。"
        showCreateChat
        title="チャットが選択されていません"
      />
    );
  }

  if (!messages.length) {
    return (
      <MessageEmptyState
        description="最初のユーザーメッセージを入力してください。"
        title="このチャットにはまだメッセージがありません"
      />
    );
  }

  return (
    <div
      aria-label="メッセージ一覧"
      className="message-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-6">
        {messages.map((message) => (
          <article
            className={cn(
              "w-fit max-w-[88%] md:max-w-[78%]",
              message.role === "user" && "ml-auto max-w-[78%] md:max-w-[70%]",
            )}
            key={message.id}
          >
            <div
              className={cn(
                "rounded-3xl border px-4 py-3 shadow-sm backdrop-blur",
                message.role === "user"
                  ? "border-primary/20 bg-primary/78 text-primary-foreground shadow-primary/10"
                  : "border-border/70 bg-card/75 text-card-foreground shadow-black/10",
              )}
            >
              <div className="text-sm leading-6">
                <MarkdownMessage content={message.contentRaw} />
              </div>
            </div>
            <div
              className={cn(
                "mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground",
                message.role === "user" && "justify-end text-right",
              )}
            >
              <span>
                {timestampFormatter.format(new Date(message.createdAt))}
              </span>
              {message.role === "assistant" ? (
                <>
                  <span>{message.apiModelId}</span>
                  {message.inputTokens !== null &&
                  message.outputTokens !== null ? (
                    <span>
                      {message.inputTokens.toLocaleString()} in /{" "}
                      {message.outputTokens.toLocaleString()} out
                    </span>
                  ) : null}
                  {message.latencyMs !== null ? (
                    <span>{message.latencyMs.toLocaleString()} ms</span>
                  ) : null}
                </>
              ) : null}
            </div>
            {message.role === "assistant" && message.isLatestTurn ? (
              <AssistantMessageActions
                activeVariantId={message.id}
                responseSettings={responseSettings}
                selectedSnapshot={selectedSnapshot}
                turnId={message.turnId}
                variants={message.variants}
              />
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

type MessageEmptyStateProps = {
  description: string;
  showCreateChat?: boolean;
  title: string;
};

function MessageEmptyState({
  description,
  showCreateChat = false,
  title,
}: MessageEmptyStateProps) {
  return (
    <div
      aria-label="メッセージ一覧"
      className="message-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8"
    >
      <div className="mx-auto grid h-full w-full max-w-3xl place-items-center">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-xl font-semibold leading-8">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
          {showCreateChat ? (
            <NewChatForm
              action={createChatAction}
              buttonClassName="mx-auto mt-5 w-auto justify-center px-5"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
