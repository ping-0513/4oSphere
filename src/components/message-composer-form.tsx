"use client";

import {
  useActionState,
  useCallback,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { LoaderCircle, Send } from "lucide-react";
import { useRouter } from "next/navigation";

import { sendUserMessageAction } from "@/app/chat/message-actions";
import { Button } from "@/components/ui/button";
import { INITIAL_SEND_USER_MESSAGE_STATE } from "@/lib/message-action-state";
import {
  countMessageCharacters,
  MAX_USER_MESSAGE_CHARACTERS,
  validateUserMessageContent,
} from "@/lib/message-validation";

type MessageComposerFormProps = {
  chatId: string;
};

export function MessageComposerForm({ chatId }: MessageComposerFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [showServerError, setShowServerError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submittedRef = useRef(false);
  const runSendAction = useCallback(
    async (
      previousState: typeof INITIAL_SEND_USER_MESSAGE_STATE,
      formData: FormData,
    ) => {
      try {
        const result = await sendUserMessageAction(previousState, formData);

        submittedRef.current = false;
        setSubmitted(false);

        if (result.successId) {
          setContent("");
          setClientError(null);
          setShowServerError(false);
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
          error: "メッセージを保存できませんでした。",
          successId: null,
        };
      }
    },
    [router],
  );
  const [state, formAction, pending] = useActionState(
    runSendAction,
    INITIAL_SEND_USER_MESSAGE_STATE,
  );
  const characterCount = countMessageCharacters(content);
  const validationError = validateUserMessageContent(content);
  const liveValidationError =
    characterCount > MAX_USER_MESSAGE_CHARACTERS ? validationError : null;
  const busy = pending || submitted;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (submittedRef.current) {
      event.preventDefault();
      return;
    }

    const error = validateUserMessageContent(content);

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

  const displayedError =
    clientError ??
    liveValidationError ??
    (showServerError ? state.error : null);

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      <input name="chatId" type="hidden" value={chatId} />
      <div className="rounded-3xl border border-input/80 bg-card/70 p-2 shadow-sm shadow-black/10 backdrop-blur focus-within:border-ring/70 focus-within:ring-2 focus-within:ring-ring/25">
        <div className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <label className="sr-only" htmlFor="message-composer">
              メッセージ
            </label>
            <textarea
              aria-describedby="message-composer-status"
              className="max-h-[220px] min-h-20 w-full resize-none overflow-y-auto rounded-2xl bg-transparent px-3 py-2 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-wait disabled:opacity-60"
              disabled={pending}
              id="message-composer"
              name="contentRaw"
              onChange={(event) => {
                setContent(event.target.value);
                setClientError(null);
                setShowServerError(false);
              }}
              placeholder="メッセージを入力..."
              rows={2}
              value={content}
            />
          </div>
          <Button
            aria-label={busy ? "メッセージを保存中" : "メッセージを送信"}
            className="mb-1 shrink-0 rounded-2xl"
            disabled={busy || Boolean(validationError)}
            size="icon"
            title={busy ? "メッセージを保存中" : "メッセージを送信"}
            type="submit"
            variant="default"
          >
            {busy ? (
              <LoaderCircle
                aria-hidden="true"
                className="size-4 animate-spin"
              />
            ) : (
              <Send aria-hidden="true" className="size-4" />
            )}
          </Button>
        </div>
        <div
          className="flex items-start justify-between gap-3 px-3 pb-1 text-xs leading-5"
          id="message-composer-status"
        >
          <p
            className={
              displayedError ? "text-destructive" : "text-muted-foreground"
            }
          >
            {displayedError ?? "ユーザーメッセージのみ保存されます。"}
          </p>
          <span
            className={
              characterCount > MAX_USER_MESSAGE_CHARACTERS
                ? "shrink-0 text-destructive"
                : "shrink-0 text-muted-foreground"
            }
          >
            {characterCount.toLocaleString()} /{" "}
            {MAX_USER_MESSAGE_CHARACTERS.toLocaleString()}
          </span>
        </div>
      </div>
    </form>
  );
}
