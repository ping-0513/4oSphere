"use client";

import { useRef, useState } from "react";
import { ChevronUp, Globe, ImagePlus, Mic, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ChatComposer() {
  const [dummyImageAttached, setDummyImageAttached] = useState(false);
  const [recording, setRecording] = useState(false);
  const [webEnabled, setWebEnabled] = useState(false);
  const [webMenuOpen, setWebMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function resizeTextarea() {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
  }

  return (
    <footer className="shrink-0 border-t border-border/70 bg-background/90 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:px-6">
      <form className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            aria-label={
              dummyImageAttached
                ? "画像添付プレビューを非表示（未実装）"
                : "画像添付プレビューを表示（未実装）"
            }
            className="rounded-2xl"
            onClick={() => setDummyImageAttached((attached) => !attached)}
            size="icon"
            title="画像添付（未実装）"
            variant={dummyImageAttached ? "default" : "outline"}
          >
            <ImagePlus aria-hidden="true" className="size-4" />
          </Button>
          <Button
            aria-label={
              recording
                ? "音声入力を停止（未実装）"
                : "音声入力を開始（未実装）"
            }
            className="rounded-2xl"
            onClick={() => setRecording((enabled) => !enabled)}
            size="icon"
            title="音声入力（未実装）"
            variant={recording ? "default" : "outline"}
          >
            <Mic aria-hidden="true" className="size-4" />
          </Button>
          <div className="relative">
            <Button
              aria-expanded={webMenuOpen}
              aria-haspopup="listbox"
              aria-label={`Web 検索: ${webEnabled ? "ON" : "OFF"}`}
              className="rounded-2xl"
              onClick={() => setWebMenuOpen((open) => !open)}
              size="icon"
              title={`Web 検索: ${webEnabled ? "ON" : "OFF"}`}
              variant={webEnabled ? "default" : "outline"}
            >
              <Globe aria-hidden="true" className="size-4" />
              <ChevronUp
                aria-hidden="true"
                className="absolute -right-1 -top-1 size-3 rounded-full bg-background/80 text-muted-foreground"
              />
            </Button>
            {webMenuOpen ? (
              <div
                aria-label="Web 検索候補"
                className="absolute bottom-12 left-0 z-30 w-44 rounded-3xl border border-border/70 bg-popover/90 p-2 shadow-xl shadow-black/20 backdrop-blur"
                role="listbox"
              >
                {[
                  { label: "Web 検索 OFF", value: false },
                  { label: "Web 検索 ON", value: true },
                ].map((option) => (
                  <button
                    aria-selected={webEnabled === option.value}
                    className="w-full rounded-2xl px-3 py-2 text-left text-sm text-popover-foreground outline-none transition-colors hover:bg-accent/80 focus-visible:ring-2 focus-visible:ring-ring/50"
                    key={option.label}
                    onClick={() => {
                      setWebEnabled(option.value);
                      setWebMenuOpen(false);
                    }}
                    role="option"
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {dummyImageAttached ? (
          <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/65 p-2 shadow-sm backdrop-blur">
            <div className="grid size-16 place-items-center overflow-hidden rounded-xl border border-border/60 bg-accent/45">
              <ImagePlus
                aria-hidden="true"
                className="size-6 text-accent-foreground"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">
                画像プレビュー.jpg
              </div>
              <div className="text-xs text-muted-foreground">
                添付後の見え方（未実装）
              </div>
            </div>
            <Button
              aria-label="画像プレビューを削除"
              className="rounded-xl"
              onClick={() => setDummyImageAttached(false)}
              size="icon"
              variant="ghost"
            >
              <X aria-hidden="true" className="size-4" />
            </Button>
          </div>
        ) : null}

        <div className="rounded-3xl border border-input/80 bg-card/70 p-2 shadow-sm shadow-black/10 backdrop-blur focus-within:border-ring/70 focus-within:ring-2 focus-within:ring-ring/25">
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <label className="sr-only" htmlFor="message-composer">
                メッセージ
              </label>
              <textarea
                className="max-h-[220px] min-h-24 w-full resize-none overflow-y-auto rounded-2xl bg-transparent px-3 py-2 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground"
                id="message-composer"
                onChange={(event) => {
                  setMessage(event.target.value);
                  resizeTextarea();
                }}
                placeholder="メッセージを入力…"
                ref={textareaRef}
                rows={3}
                value={message}
              />
            </div>
            <Button
              aria-label="メッセージを送信"
              className="mb-1 shrink-0 rounded-2xl"
              size="icon"
              variant="default"
            >
              <Send aria-hidden="true" className="size-4" />
            </Button>
          </div>
          {recording ? (
            <div className="mt-2 flex items-center gap-2 rounded-2xl bg-muted/55 px-3 py-2 text-xs text-muted-foreground">
              <span>音声を拾っています</span>
              <div aria-hidden="true" className="flex h-5 items-center gap-1">
                {[8, 14, 20, 12, 18].map((height, index) => (
                  <span
                    className="w-1 rounded-full bg-primary/75"
                    key={`${height}-${index}`}
                    style={{ height }}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </form>
    </footer>
  );
}

// TODO: Web 検索 ON は実質 AUTO 寄り。こんにちは、だいすき！、
// ありがとう、眠い等の明らかな日常会話・挨拶・感情表現では検索しない。
// 将来は OFF / AUTO / REQUIRED の 3 値を検討し、REQUIRED の場合だけ必ず検索する。
