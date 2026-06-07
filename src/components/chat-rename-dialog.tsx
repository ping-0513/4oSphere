"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { LoaderCircle, Pencil, X } from "lucide-react";
import {
  useActionState,
  useCallback,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

import { renameChatAction } from "@/app/chat/chat-management-actions";
import { Button } from "@/components/ui/button";
import { INITIAL_CHAT_MANAGEMENT_ACTION_STATE } from "@/lib/chat-management-action-state";
import {
  countChatTitleCharacters,
  MAX_CHAT_TITLE_CHARACTERS,
  validateChatTitle,
} from "@/lib/chat-validation";

type ChatRenameDialogProps = {
  chatId: string;
  currentTitle: string;
  disabled: boolean;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function ChatRenameDialog({
  chatId,
  currentTitle,
  disabled,
  onOpenChange,
  open,
}: ChatRenameDialogProps) {
  const router = useRouter();
  const [title, setTitle] = useState(currentTitle);
  const [clientError, setClientError] = useState<string | null>(null);
  const [showServerError, setShowServerError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submittedRef = useRef(false);
  const runRenameAction = useCallback(
    async (
      previousState: typeof INITIAL_CHAT_MANAGEMENT_ACTION_STATE,
      formData: FormData,
    ) => {
      try {
        const result = await renameChatAction(previousState, formData);

        submittedRef.current = false;
        setSubmitted(false);

        if (result.success) {
          setShowServerError(false);
          onOpenChange(false);
          router.refresh();
        } else {
          setShowServerError(Boolean(result.error));
        }

        return result;
      } catch {
        submittedRef.current = false;
        setSubmitted(false);
        setShowServerError(true);

        return {
          error: "このチャットを更新できませんでした。",
          success: false,
        };
      }
    },
    [onOpenChange, router],
  );
  const [state, formAction, pending] = useActionState(
    runRenameAction,
    INITIAL_CHAT_MANAGEMENT_ACTION_STATE,
  );
  const validationError = validateChatTitle(title);
  const characterCount = countChatTitleCharacters(title);
  const busy = pending || submitted;

  function handleOpenChange(nextOpen: boolean) {
    if (busy) {
      return;
    }

    if (nextOpen) {
      setTitle(currentTitle);
      setClientError(null);
      setShowServerError(false);
    }

    onOpenChange(nextOpen);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (submittedRef.current) {
      event.preventDefault();
      return;
    }

    const error = validateChatTitle(title);

    if (error) {
      event.preventDefault();
      setClientError(error);
      return;
    }

    submittedRef.current = true;
    setSubmitted(true);
    setClientError(null);
    setShowServerError(false);
  }

  const displayedError = clientError ?? (showServerError ? state.error : null);

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <Button
          aria-label={`${currentTitle}の名前を変更`}
          className="size-8 shrink-0 rounded-xl"
          disabled={disabled}
          size="icon"
          title={`${currentTitle}の名前を変更`}
          variant="ghost"
        >
          <Pencil aria-hidden="true" className="size-3.5" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-background/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] w-[min(92vw,26rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-popover p-4 shadow-2xl outline-none">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="text-base font-semibold">
                チャット名を変更
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm leading-6 text-muted-foreground">
                80文字以内の名前を入力してください。
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button
                aria-label="名前変更を閉じる"
                className="shrink-0 rounded-xl"
                disabled={busy}
                size="icon"
                title="閉じる"
                variant="ghost"
              >
                <X aria-hidden="true" className="size-4" />
              </Button>
            </Dialog.Close>
          </div>
          <form action={formAction} className="mt-4" onSubmit={handleSubmit}>
            <input name="chatId" type="hidden" value={chatId} />
            <label
              className="text-sm font-medium"
              htmlFor={`chat-title-${chatId}`}
            >
              チャット名
            </label>
            <input
              aria-describedby={`chat-title-status-${chatId}`}
              autoFocus
              className="mt-2 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-wait disabled:opacity-60"
              disabled={busy}
              id={`chat-title-${chatId}`}
              name="title"
              onChange={(event) => {
                setTitle(event.target.value);
                setClientError(null);
                setShowServerError(false);
              }}
              value={title}
            />
            <div
              className="mt-2 flex min-h-5 items-start justify-between gap-3 text-xs"
              id={`chat-title-status-${chatId}`}
            >
              <p
                className="text-destructive"
                role={displayedError ? "alert" : undefined}
              >
                {displayedError}
              </p>
              <span
                className={
                  characterCount > MAX_CHAT_TITLE_CHARACTERS
                    ? "shrink-0 text-destructive"
                    : "shrink-0 text-muted-foreground"
                }
              >
                {characterCount} / {MAX_CHAT_TITLE_CHARACTERS}
              </span>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button disabled={busy} variant="ghost">
                  キャンセル
                </Button>
              </Dialog.Close>
              <Button disabled={busy || Boolean(validationError)} type="submit">
                {busy ? (
                  <LoaderCircle
                    aria-hidden="true"
                    className="size-4 animate-spin"
                  />
                ) : (
                  <Pencil aria-hidden="true" className="size-4" />
                )}
                {busy ? "変更中..." : "変更"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
