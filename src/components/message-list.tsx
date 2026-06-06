import { createChatAction } from "@/app/chat/actions";
import { NewChatForm } from "@/components/new-chat-submit-button";
import type { CurrentChat } from "@/types/chat";

type MessageListProps = {
  currentChat: CurrentChat | null;
};

export function MessageList({ currentChat }: MessageListProps) {
  return (
    <div
      aria-label={currentChat ? "メッセージ一覧" : "チャット未選択"}
      className="message-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8"
    >
      <div className="mx-auto grid h-full w-full max-w-3xl place-items-center">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-xl font-semibold leading-8">
            {currentChat
              ? "メッセージ送信はまだ未実装です"
              : "チャットが選択されていません"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {currentChat
              ? "このチャットへの保存・送信は次のフェーズで追加します。"
              : "新しいチャットを作成するか、サイドバーから選択してください。"}
          </p>
          {!currentChat ? (
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
