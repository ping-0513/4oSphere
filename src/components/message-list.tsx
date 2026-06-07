import { createChatAction } from "@/app/chat/actions";
import { MarkdownMessage } from "@/components/markdown-message";
import { NewChatForm } from "@/components/new-chat-submit-button";
import type { CurrentChat, PersistedUserMessage } from "@/types/chat";

type MessageListProps = {
  currentChat: CurrentChat | null;
  messages: PersistedUserMessage[];
};

const timestampFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Asia/Tokyo",
});

export function MessageList({ currentChat, messages }: MessageListProps) {
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
            className="ml-auto w-fit max-w-[78%] md:max-w-[70%]"
            key={message.id}
          >
            <div className="rounded-3xl border border-primary/20 bg-primary/78 px-4 py-3 text-primary-foreground shadow-sm shadow-primary/10 backdrop-blur">
              <div className="text-sm leading-6">
                <MarkdownMessage content={message.contentRaw} />
              </div>
            </div>
            <p className="mt-1.5 text-right text-xs text-muted-foreground">
              {timestampFormatter.format(new Date(message.createdAt))}
            </p>
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
