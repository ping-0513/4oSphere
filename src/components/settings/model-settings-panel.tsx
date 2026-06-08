"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ApiSettingCategoryCard } from "@/components/settings/api-setting-category-card";
import { ModelSnapshotSelect } from "@/components/settings/model-snapshot-select";
import { Button } from "@/components/ui/button";
import {
  API_SETTING_CATEGORIES,
  API_SETTING_STATUS_LABELS,
  type ApiSettingCategoryStatus,
} from "@/lib/openai/api-setting-categories";
import type { Gpt4oSnapshotLabel } from "@/types/chat";

const COLLAPSE_STORAGE_KEY = "4osphere:model-settings-category-collapse";
const STATUS_FILTERS = [
  "all",
  "implemented",
  "planned",
  "admin",
  "legacy",
  "needs-confirmation",
  "unsupported",
] as const satisfies readonly ("all" | ApiSettingCategoryStatus)[];

type StatusFilter = (typeof STATUS_FILTERS)[number];

type ModelSettingsPanelProps = {
  onOpenChange: (open: boolean) => void;
  onSelectedSnapshotChange: (snapshot: Gpt4oSnapshotLabel) => void;
  open: boolean;
  selectedSnapshot: Gpt4oSnapshotLabel;
};

function getStatusFilterLabel(status: StatusFilter) {
  return status === "all" ? "すべて" : API_SETTING_STATUS_LABELS[status];
}

function loadCollapsedState() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(COLLAPSE_STORAGE_KEY) ?? "{}",
    );

    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, boolean>)
      : {};
  } catch {
    return {};
  }
}

export function ModelSettingsPanel({
  onOpenChange,
  onSelectedSnapshotChange,
  open,
  selectedSnapshot,
}: ModelSettingsPanelProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [collapsedById, setCollapsedById] = useState<Record<string, boolean>>(
    {},
  );
  const [collapseStateLoaded, setCollapseStateLoaded] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCollapsedById(loadCollapsedState());
      setCollapseStateLoaded(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [open]);

  useEffect(() => {
    if (!open || !collapseStateLoaded) {
      return;
    }

    window.localStorage.setItem(
      COLLAPSE_STORAGE_KEY,
      JSON.stringify(collapsedById),
    );
  }, [collapsedById, collapseStateLoaded, open]);

  const visibleCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return API_SETTING_CATEGORIES.filter((category) => {
      const matchesStatus =
        statusFilter === "all" || category.status === statusFilter;
      const searchableText = [
        category.officialName,
        category.japaneseName,
        category.shortDescription,
        category.detailDescription,
        category.officialPath,
        category.notes,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesStatus &&
        (!normalizedQuery || searchableText.includes(normalizedQuery))
      );
    });
  }, [query, statusFilter]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[120] bg-background/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-2 top-2 z-[130] flex max-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl outline-none md:inset-x-auto md:left-1/2 md:w-[min(72rem,calc(100vw-2rem))] md:-translate-x-1/2">
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border/70 p-4">
            <div className="min-w-0">
              <Dialog.Title className="text-lg font-semibold leading-7">
                設定 &gt; モデル
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm leading-6 text-muted-foreground">
                これはOpenAI API設定の親カテゴリ一覧です。個別パラメータとAPI
                payload反映は後続フェーズで追加します。
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button
                aria-label="設定を閉じる"
                className="shrink-0 rounded-xl"
                size="icon"
                title="閉じる"
                variant="ghost"
              >
                <X aria-hidden="true" className="size-4" />
              </Button>
            </Dialog.Close>
          </div>
          <div className="message-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
            <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
              <aside className="space-y-4">
                <section className="rounded-2xl border border-border/70 bg-card/70 p-3">
                  <h2 className="text-sm font-semibold leading-6">
                    選択中モデル
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    ChatHeader、Composer、Regenerateと同じ一時stateを使います。保存はしません。
                  </p>
                  <ModelSnapshotSelect
                    buttonClassName="mt-3 w-full"
                    menuClassName="w-full"
                    onSelectedSnapshotChange={onSelectedSnapshotChange}
                    selectedSnapshot={selectedSnapshot}
                  />
                </section>
                <section className="rounded-2xl border border-border/70 bg-card/70 p-3">
                  <h2 className="flex items-center gap-2 text-sm font-semibold leading-6">
                    <SlidersHorizontal aria-hidden="true" className="size-4" />
                    表示フィルタ
                  </h2>
                  <label
                    className="mt-3 block text-xs font-medium text-muted-foreground"
                    htmlFor="settings-category-search"
                  >
                    検索
                  </label>
                  <div className="mt-1 flex h-10 items-center gap-2 rounded-xl border border-input bg-background px-3">
                    <Search
                      aria-hidden="true"
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                    <input
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      id="settings-category-search"
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="カテゴリを検索"
                      type="search"
                      value={query}
                    />
                  </div>
                  <label
                    className="mt-3 block text-xs font-medium text-muted-foreground"
                    htmlFor="settings-category-status"
                  >
                    status
                  </label>
                  <select
                    className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                    id="settings-category-status"
                    onChange={(event) =>
                      setStatusFilter(event.target.value as StatusFilter)
                    }
                    value={statusFilter}
                  >
                    {STATUS_FILTERS.map((status) => (
                      <option key={status} value={status}>
                        {getStatusFilterLabel(status)}
                      </option>
                    ))}
                  </select>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    metadataは24カテゴリすべてを保持します。検索とfilterは表示だけを絞ります。
                  </p>
                </section>
              </aside>
              <section className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold leading-6">
                    APIカテゴリ
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {visibleCategories.length} / {API_SETTING_CATEGORIES.length}
                  </p>
                </div>
                <div className="space-y-3">
                  {visibleCategories.map((category) => (
                    <ApiSettingCategoryCard
                      category={category}
                      collapsed={collapsedById[category.id] ?? true}
                      key={category.id}
                      onToggle={() =>
                        setCollapsedById((current) => ({
                          ...current,
                          [category.id]: !(current[category.id] ?? true),
                        }))
                      }
                    />
                  ))}
                  {!visibleCategories.length ? (
                    <p className="rounded-2xl border border-border/70 bg-card/70 p-4 text-sm text-muted-foreground">
                      条件に一致するカテゴリはありません。
                    </p>
                  ) : null}
                </div>
              </section>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
