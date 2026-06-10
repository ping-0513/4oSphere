"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ApiSettingPlaceholderSection } from "@/components/settings/api-setting-placeholder-section";
import { ApiSettingCategoryCard } from "@/components/settings/api-setting-category-card";
import { ModelSnapshotSelect } from "@/components/settings/model-snapshot-select";
import { ResponseSettingsEffectivePreview } from "@/components/settings/response-settings-effective-preview";
import { ResponsesSettingsSection } from "@/components/settings/responses-settings-section";
import { Button } from "@/components/ui/button";
import {
  API_SETTING_CATEGORIES,
  API_SETTING_STATUS_LABELS,
  type ApiSettingCategoryStatus,
} from "@/lib/openai/api-setting-categories";
import { getApiSettingSubcategories } from "@/lib/openai/api-setting-subcategories";
import {
  createResponseSettingsDraft,
  createResponseSettingsDraftBySnapshot,
  isResponseSettingsDraftApplied,
  validateResponseSettingsDraft,
  type ResponseSettingsBySnapshot,
  type ResponseSettingsDraftBySnapshot,
  type ResponseSettingsFieldErrors,
} from "@/lib/openai/response-settings";
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
  onResponseSettingsApply: (
    snapshot: Gpt4oSnapshotLabel,
    settings: ResponseSettingsBySnapshot[Gpt4oSnapshotLabel],
  ) => void;
  onSelectedSnapshotChange: (snapshot: Gpt4oSnapshotLabel) => void;
  open: boolean;
  responseSettingsBySnapshot: ResponseSettingsBySnapshot;
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
  onResponseSettingsApply,
  onSelectedSnapshotChange,
  open,
  responseSettingsBySnapshot,
  selectedSnapshot,
}: ModelSettingsPanelProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [collapsedById, setCollapsedById] = useState<Record<string, boolean>>(
    {},
  );
  const [draftSettingsBySnapshot, setDraftSettingsBySnapshot] =
    useState<ResponseSettingsDraftBySnapshot>(() =>
      createResponseSettingsDraftBySnapshot(responseSettingsBySnapshot),
    );
  const [responseSettingsErrors, setResponseSettingsErrors] =
    useState<ResponseSettingsFieldErrors>({});
  const [responseSettingsStatus, setResponseSettingsStatus] = useState<
    "idle" | "saved" | "saving"
  >("idle");
  const [collapseStateLoaded, setCollapseStateLoaded] = useState(false);
  const selectedAppliedResponseSettings =
    responseSettingsBySnapshot[selectedSnapshot];
  const selectedDraftResponseSettings =
    draftSettingsBySnapshot[selectedSnapshot];
  const responseSettingsDirty = !isResponseSettingsDraftApplied(
    selectedDraftResponseSettings,
    selectedAppliedResponseSettings,
  );
  const hasAnyUnsavedResponseSettings = Object.entries(
    draftSettingsBySnapshot,
  ).some(
    ([snapshot, draft]) =>
      !isResponseSettingsDraftApplied(
        draft,
        responseSettingsBySnapshot[snapshot as Gpt4oSnapshotLabel],
      ),
  );

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
        ...getApiSettingSubcategories(category.id).flatMap((subcategory) => [
          subcategory.officialName,
          subcategory.japaneseName,
          subcategory.shortDescription,
          subcategory.detailDescription,
          subcategory.uiPlacement,
          subcategory.implementation,
          subcategory.caution,
        ]),
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesStatus &&
        (!normalizedQuery || searchableText.includes(normalizedQuery))
      );
    });
  }, [query, statusFilter]);

  function handlePanelOpenChange(nextOpen: boolean) {
    if (!nextOpen && hasAnyUnsavedResponseSettings) {
      const shouldDiscard = window.confirm(
        "未保存の変更があります。破棄して閉じますか？",
      );

      if (!shouldDiscard) {
        return;
      }
    }

    onOpenChange(nextOpen);
  }

  function handleSelectedSnapshotChange(snapshot: Gpt4oSnapshotLabel) {
    setResponseSettingsErrors({});
    setResponseSettingsStatus("idle");
    onSelectedSnapshotChange(snapshot);
  }

  function handleResponseSettingsDraftChange(
    draft: ResponseSettingsDraftBySnapshot[Gpt4oSnapshotLabel],
  ) {
    setDraftSettingsBySnapshot((current) => ({
      ...current,
      [selectedSnapshot]: draft,
    }));
    setResponseSettingsErrors({});
    setResponseSettingsStatus("idle");
  }

  function handleResponseSettingsDiscard() {
    setDraftSettingsBySnapshot((current) => ({
      ...current,
      [selectedSnapshot]: createResponseSettingsDraft(
        selectedAppliedResponseSettings,
      ),
    }));
    setResponseSettingsErrors({});
    setResponseSettingsStatus("idle");
  }

  function handleResponseSettingsSave() {
    const result = validateResponseSettingsDraft(selectedDraftResponseSettings);

    if (result.error || !result.settings) {
      setResponseSettingsErrors(result.fieldErrors);
      setResponseSettingsStatus("idle");
      return;
    }

    setResponseSettingsErrors({});
    setResponseSettingsStatus("saving");
    onResponseSettingsApply(selectedSnapshot, result.settings);

    window.setTimeout(() => {
      setResponseSettingsStatus("saved");
    }, 150);
  }

  return (
    <Dialog.Root open={open} onOpenChange={handlePanelOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[120] bg-background/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-2 top-2 z-[130] flex max-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl outline-none md:inset-x-auto md:left-1/2 md:w-[min(72rem,calc(100vw-2rem))] md:-translate-x-1/2">
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border/70 p-4">
            <div className="min-w-0">
              <Dialog.Title className="text-lg font-semibold leading-7">
                設定 &gt; モデル
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm leading-6 text-muted-foreground">
                OpenAI
                APIで調整できる内容を、日本語の説明付きで整理しています。変更できない項目は説明・棚卸し用です。
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
                    チャット上部、メッセージ送信、回答の再生成で同じモデルを使います。アカウント全体には保存しません。
                  </p>
                  <ModelSnapshotSelect
                    buttonClassName="mt-3 w-full"
                    menuClassName="w-full"
                    onSelectedSnapshotChange={handleSelectedSnapshotChange}
                    selectedSnapshot={selectedSnapshot}
                  />
                </section>
                <section className="rounded-2xl border border-border/70 bg-card/70 p-3">
                  <h2 className="text-sm font-semibold leading-6">見分け方</h2>
                  <div className="mt-2 grid gap-2 text-xs leading-6 text-muted-foreground">
                    <p>
                      <span className="mr-2 rounded-full border border-emerald-400/35 bg-emerald-400/10 px-2 py-1 text-emerald-300">
                        緑
                      </span>
                      保存すると生成に使われる設定
                    </p>
                    <p>
                      <span className="mr-2 rounded-full border border-blue-400/35 bg-blue-400/10 px-2 py-1 text-blue-300">
                        青
                      </span>
                      サーバー側で固定・管理される設定
                    </p>
                    <p>
                      <span className="mr-2 rounded-full border border-zinc-400/30 bg-zinc-400/10 px-2 py-1 text-zinc-300">
                        灰
                      </span>
                      点線の項目はまだ画面から使えません。
                    </p>
                    <p>
                      <span className="mr-2 rounded-full border border-violet-400/35 bg-violet-400/10 px-2 py-1 text-violet-300">
                        紫
                      </span>
                      公式仕様や対応可否の確認が必要
                    </p>
                    <p>
                      <span className="mr-2 rounded-full border border-red-400/35 bg-red-400/10 px-2 py-1 text-red-300">
                        赤
                      </span>
                      管理者向け・危険操作に関係
                    </p>
                  </div>
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
                    状態
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
                    24カテゴリの順番は変わりません。検索と状態の絞り込みは、表示する項目だけを減らします。
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
                  {visibleCategories.map((category) => {
                    const subcategories = getApiSettingSubcategories(
                      category.id,
                    );
                    const unusedResponseSubcategories =
                      category.id === "responses"
                        ? subcategories.filter((subcategory) =>
                            [
                              "admin",
                              "legacy",
                              "needs-confirmation",
                              "placeholder",
                              "planned",
                              "unsupported",
                            ].includes(subcategory.status),
                          )
                        : [];

                    return (
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
                      >
                        {category.id === "responses" ? (
                          <>
                            <ResponsesSettingsSection
                              dirty={responseSettingsDirty}
                              draftSettings={selectedDraftResponseSettings}
                              fieldErrors={responseSettingsErrors}
                              onDiscard={handleResponseSettingsDiscard}
                              onDraftSettingsChange={
                                handleResponseSettingsDraftChange
                              }
                              onSave={handleResponseSettingsSave}
                              saveStatus={responseSettingsStatus}
                              selectedSnapshot={selectedSnapshot}
                            />
                            <ResponseSettingsEffectivePreview
                              appliedSettings={selectedAppliedResponseSettings}
                              dirty={responseSettingsDirty}
                              selectedSnapshot={selectedSnapshot}
                              unusedSubcategories={unusedResponseSubcategories}
                            />
                            <ApiSettingPlaceholderSection
                              categoryDisplayName={category.displayName}
                              categoryDisplayOrder={category.displayOrder}
                              heading="後続で追加する項目"
                              subcategories={subcategories.filter(
                                (subcategory) => subcategory.order >= 14,
                              )}
                            />
                          </>
                        ) : (
                          <ApiSettingPlaceholderSection
                            categoryDisplayName={category.displayName}
                            categoryDisplayOrder={category.displayOrder}
                            subcategories={subcategories}
                          />
                        )}
                      </ApiSettingCategoryCard>
                    );
                  })}
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
