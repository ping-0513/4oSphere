"use client";

import { useCallback, useEffect, useState } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { ChatComposer } from "@/components/chat-composer";
import { ChatHeader } from "@/components/chat-header";
import { MessageList } from "@/components/message-list";
import { MobileDrawer } from "@/components/mobile-drawer";
import { ModelSettingsPanel } from "@/components/settings/model-settings-panel";
import { getChatDisplayTitle } from "@/lib/chat-display";
import { DEFAULT_GPT_4O_SNAPSHOT } from "@/lib/openai/models";
import {
  createDefaultResponseSettingsBySnapshot,
  parseResponseSettingsBySnapshotSessionValue,
  RESPONSE_SETTINGS_SESSION_STORAGE_KEY,
  serializeResponseSettingsBySnapshotForSession,
  type ResponseSettingsBySnapshot,
  type ResponseSettings,
} from "@/lib/openai/response-settings";
import type { AuthenticatedProfile } from "@/types/auth";
import type {
  ChatListItem,
  CurrentChat,
  Gpt4oSnapshotLabel,
  PersistedChatMessage,
} from "@/types/chat";

type AppShellProps = {
  chats: ChatListItem[];
  currentChat: CurrentChat | null;
  messages: PersistedChatMessage[];
  profile: AuthenticatedProfile;
};

export function AppShell({
  chats,
  currentChat,
  messages,
  profile,
}: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState(
    DEFAULT_GPT_4O_SNAPSHOT,
  );
  const [responseSettingsBySnapshot, setResponseSettingsBySnapshot] = useState(
    () => createDefaultResponseSettingsBySnapshot(),
  );
  const selectedResponseSettings = responseSettingsBySnapshot[selectedSnapshot];
  useEffect(() => {
    let storedSettings: ResponseSettingsBySnapshot | null = null;

    try {
      storedSettings = parseResponseSettingsBySnapshotSessionValue(
        window.sessionStorage.getItem(RESPONSE_SETTINGS_SESSION_STORAGE_KEY),
      );
    } catch {
      storedSettings = null;
    }

    if (storedSettings) {
      const restoreTimer = window.setTimeout(() => {
        setResponseSettingsBySnapshot(storedSettings);
      }, 0);

      return () => window.clearTimeout(restoreTimer);
    }
  }, []);
  const openSettings = useCallback(() => {
    setSettingsOpen(true);
  }, []);
  const handleSettingsOpenChange = useCallback((open: boolean) => {
    setSettingsOpen(open);
  }, []);
  const handleResponseSettingsApply = useCallback(
    (snapshot: Gpt4oSnapshotLabel, settings: ResponseSettings) => {
      setResponseSettingsBySnapshot((current) => {
        const next = {
          ...current,
          [snapshot]: settings,
        };

        try {
          window.sessionStorage.setItem(
            RESPONSE_SETTINGS_SESSION_STORAGE_KEY,
            serializeResponseSettingsBySnapshotForSession(next),
          );
        } catch {
          // Applied settings still live in AppShell state for this mounted app.
        }

        return next;
      });
    },
    [],
  );

  return (
    <main className="flex h-dvh min-h-dvh overflow-hidden bg-background text-foreground">
      <AppSidebar
        chats={chats}
        className="hidden md:flex"
        currentChatId={currentChat?.id ?? null}
        onSettingsClick={openSettings}
        profile={profile}
      />
      <MobileDrawer
        chats={chats}
        currentChatId={currentChat?.id ?? null}
        onOpenChange={setDrawerOpen}
        onSettingsClick={openSettings}
        open={drawerOpen}
        profile={profile}
      />
      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <ChatHeader
          currentChatTitle={
            currentChat ? getChatDisplayTitle(currentChat.title) : null
          }
          onMenuClick={() => setDrawerOpen(true)}
          onSelectedSnapshotChange={setSelectedSnapshot}
          selectedSnapshot={selectedSnapshot}
        />
        <MessageList
          currentChat={currentChat}
          messages={messages}
          responseSettings={selectedResponseSettings}
          selectedSnapshot={selectedSnapshot}
        />
        {currentChat ? (
          <ChatComposer
            chatId={currentChat.id}
            responseSettings={selectedResponseSettings}
            selectedSnapshot={selectedSnapshot}
          />
        ) : null}
      </section>
      {settingsOpen ? (
        <ModelSettingsPanel
          onOpenChange={handleSettingsOpenChange}
          onResponseSettingsApply={handleResponseSettingsApply}
          onSelectedSnapshotChange={setSelectedSnapshot}
          open={settingsOpen}
          responseSettingsBySnapshot={responseSettingsBySnapshot}
          selectedSnapshot={selectedSnapshot}
        />
      ) : null}
    </main>
  );
}
