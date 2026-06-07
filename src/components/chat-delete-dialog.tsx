"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { LoaderCircle, Trash2, X } from "lucide-react";
import {
  useActionState,
  useCallback,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

import { softDeleteChatAction } from "@/app/chat/chat-management-actions";
import { Button } from "@/components/ui/button";
import { INITIAL_CHAT_MANAGEMENT_ACTION_STATE } from "@/lib/chat-management-action-state";

type ChatDeleteDialogProps = {
  chatId: string;
  chatTitle: string;
  disabled: boolean;
  isCurrentChat: boolean;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function ChatDeleteDialog({
  chatId,
  chatTitle,
  disabled,
  isCurrentChat,
  onOpenChange,
  open,
}: ChatDeleteDialogProps) {
  const router = useRouter();
  const [showServerError, setShowServerError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submittedRef = useRef(false);
  const runDeleteAction = useCallback(
    async (
      previousState: typeof INITIAL_CHAT_MANAGEMENT_ACTION_STATE,
      formData: FormData,
    ) => {
      try {
        const result = await softDeleteChatAction(previousState, formData);

        submittedRef.current = false;
        setSubmitted(false);

        if (result.success) {
          setShowServerError(false);
          onOpenChange(false);

          if (isCurrentChat) {
            router.replace("/");
          } else {
            router.refresh();
          }
        } else {
          setShowServerError(Boolean(result.error));
        }

        return result;
      } catch {
        submittedRef.current = false;
        setSubmitted(false);
        setShowServerError(true);

        return {
          error: "このチャットを削除できませんでした。",
          success: false,
        };
      }
    },
    [isCurrentChat, onOpenChange, router],
  );
  const [state, formAction, pending] = useActionState(
    runDeleteAction,
    INITIAL_CHAT_MANAGEMENT_ACTION_STATE,
  );
  const busy = pending || submitted;

  function handleOpenChange(nextOpen: boolean) {
    if (busy) {
      return;
    }

    if (nextOpen) {
      setShowServerError(false);
    }

    onOpenChange(nextOpen);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (submittedRef.current) {
      event.preventDefault();
      return;
    }

    submittedRef.current = true;
    setSubmitted(true);
    setShowServerError(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <Button
          aria-label={`${chatTitle}を削除`}
          className="size-8 shrink-0 rounded-xl text-muted-foreground hover:text-destructive"
          disabled={disabled}
          size="icon"
          title={`${chatTitle}を削除`}
          variant="ghost"
        >
          <Trash2 aria-hidden="true" className="size-3.5" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-background/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] w-[min(92vw,26rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-popover p-4 shadow-2xl outline-none">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="text-base font-semibold">
                このチャットを削除しますか？
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm leading-6 text-muted-foreground">
                削除するとサイドバーには表示されなくなります。
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button
                aria-label="削除確認を閉じる"
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
          <p className="mt-4 truncate rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-sm">
            {chatTitle}
          </p>
          {showServerError && state.error ? (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}
          <form action={formAction} className="mt-5" onSubmit={handleSubmit}>
            <input name="chatId" type="hidden" value={chatId} />
            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button disabled={busy} variant="ghost">
                  キャンセル
                </Button>
              </Dialog.Close>
              <Button
                className="bg-destructive text-white hover:bg-destructive/90"
                disabled={busy}
                type="submit"
              >
                {busy ? (
                  <LoaderCircle
                    aria-hidden="true"
                    className="size-4 animate-spin"
                  />
                ) : (
                  <Trash2 aria-hidden="true" className="size-4" />
                )}
                {busy ? "削除中..." : "削除"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
