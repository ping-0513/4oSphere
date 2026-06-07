"use client";

import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  regenerateAssistantResponseAction,
  switchActiveAssistantVariantAction,
} from "@/app/chat/assistant-variant-actions";
import { Button } from "@/components/ui/button";
import type { AssistantVariantSummary, Gpt4oSnapshotLabel } from "@/types/chat";

type AssistantMessageActionsProps = {
  activeVariantId: string;
  selectedSnapshot: Gpt4oSnapshotLabel;
  turnId: string;
  variants: AssistantVariantSummary[];
};

export function AssistantMessageActions({
  activeVariantId,
  selectedSnapshot,
  turnId,
  variants,
}: AssistantMessageActionsProps) {
  const router = useRouter();
  const busyRef = useRef(false);
  const [busyAction, setBusyAction] = useState<"regenerate" | "switch" | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const activePosition = variants.findIndex(
    (variant) => variant.id === activeVariantId,
  );
  const busy = busyAction !== null;

  async function runAction(
    action: () => Promise<{ error: string | null; success: boolean }>,
    kind: "regenerate" | "switch",
  ) {
    if (busyRef.current) {
      return;
    }

    busyRef.current = true;
    setBusyAction(kind);
    setError(null);

    try {
      const result = await action();

      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch {
      setError("この回答は現在操作できません。");
    } finally {
      busyRef.current = false;
      setBusyAction(null);
    }
  }

  function switchTo(position: number) {
    const target = variants[position];

    if (!target) {
      return;
    }

    void runAction(() => {
      const formData = new FormData();

      formData.set("turnId", turnId);
      formData.set("assistantResponseVariantId", target.id);
      return switchActiveAssistantVariantAction(formData);
    }, "switch");
  }

  function regenerate() {
    void runAction(() => {
      const formData = new FormData();

      formData.set("turnId", turnId);
      formData.set("selectedSnapshot", selectedSnapshot);
      return regenerateAssistantResponseAction(formData);
    }, "regenerate");
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <Button
        aria-label="前の回答を表示"
        className="size-8 rounded-xl"
        disabled={busy || activePosition <= 0}
        onClick={() => switchTo(activePosition - 1)}
        size="icon"
        title="前の回答"
        variant="ghost"
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
      </Button>
      <span
        aria-label={`回答 ${activePosition + 1} / ${variants.length}`}
        aria-live="polite"
        className="inline-flex min-w-12 items-center justify-center text-center text-xs text-muted-foreground"
      >
        {busyAction === "switch" ? (
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <>
            {activePosition + 1} / {variants.length}
          </>
        )}
      </span>
      <Button
        aria-label="次の回答を表示"
        className="size-8 rounded-xl"
        disabled={
          busy || activePosition < 0 || activePosition >= variants.length - 1
        }
        onClick={() => switchTo(activePosition + 1)}
        size="icon"
        title="次の回答"
        variant="ghost"
      >
        <ChevronRight aria-hidden="true" className="size-4" />
      </Button>
      <Button
        aria-label={
          busyAction === "regenerate" ? "回答を再生成中" : "回答を再生成"
        }
        className="h-8 rounded-xl px-2.5"
        disabled={busy || activePosition < 0}
        onClick={regenerate}
        size="sm"
        title="回答を再生成"
        variant="ghost"
      >
        {busyAction === "regenerate" ? (
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <RefreshCw aria-hidden="true" className="size-4" />
        )}
        再生成
      </Button>
      {error ? (
        <p className="basis-full text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
