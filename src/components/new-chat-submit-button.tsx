"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { LoaderCircle, Plus } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NewChatFormProps = {
  action: () => Promise<void>;
  buttonClassName?: string;
};

export function NewChatForm({ action, buttonClassName }: NewChatFormProps) {
  const submittedRef = useRef(false);
  const [submitted, setSubmitted] = useState(false);

  const resetSubmissionLock = useCallback(() => {
    submittedRef.current = false;
    setSubmitted(false);
  }, []);

  function preventDuplicateSubmit(event: FormEvent<HTMLFormElement>) {
    if (submittedRef.current) {
      event.preventDefault();
      return;
    }

    submittedRef.current = true;
    setSubmitted(true);
  }

  return (
    <form action={action} onSubmit={preventDuplicateSubmit}>
      <NewChatSubmitButton
        className={buttonClassName}
        submitted={submitted}
        onActionSettled={resetSubmissionLock}
      />
    </form>
  );
}

type NewChatSubmitButtonProps = {
  className?: string;
  submitted: boolean;
  onActionSettled: () => void;
};

export function NewChatSubmitButton({
  className,
  submitted,
  onActionSettled,
}: NewChatSubmitButtonProps) {
  const { pending } = useFormStatus();
  const sawPendingRef = useRef(false);
  const busy = submitted || pending;

  useEffect(() => {
    if (pending) {
      sawPendingRef.current = true;
      return;
    }

    if (sawPendingRef.current) {
      sawPendingRef.current = false;
      onActionSettled();
    }
  }, [onActionSettled, pending]);

  return (
    <Button
      aria-label={busy ? "新しいチャットを作成中" : "新しいチャットを作成"}
      aria-live="polite"
      className={cn(
        "mt-2 h-11 w-full justify-start rounded-2xl shadow-sm shadow-primary/10 disabled:bg-primary/70 disabled:text-primary-foreground/80 disabled:shadow-inner",
        className,
      )}
      disabled={busy}
      type="submit"
      variant="default"
    >
      {busy ? (
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      ) : (
        <Plus aria-hidden="true" className="size-4" />
      )}
      <span className="leading-none">
        {busy ? "作成中..." : "新しいチャット"}
      </span>
    </Button>
  );
}
