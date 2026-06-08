"use client";

import { useState } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { ChatComposer } from "@/components/chat-composer";
import { ChatHeader } from "@/components/chat-header";
import { MessageList } from "@/components/message-list";
import { MobileDrawer } from "@/components/mobile-drawer";
import { ModelSettingsPanel } from "@/components/settings/model-settings-panel";
import { getChatDisplayTitle } from "@/lib/chat-display";
import { DEFAULT_GPT_4O_SNAPSHOT } from "@/lib/openai/models";
import type { AuthenticatedProfile } from "@/types/auth";
import type {
  ChatListItem,
  CurrentChat,
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

  return (
    <main className="flex h-dvh min-h-dvh overflow-hidden bg-background text-foreground">
      <AppSidebar
        chats={chats}
        className="hidden md:flex"
        currentChatId={currentChat?.id ?? null}
        onSettingsClick={() => setSettingsOpen(true)}
        profile={profile}
      />
      <MobileDrawer
        chats={chats}
        currentChatId={currentChat?.id ?? null}
        onOpenChange={setDrawerOpen}
        onSettingsClick={() => setSettingsOpen(true)}
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
          selectedSnapshot={selectedSnapshot}
        />
        {currentChat ? (
          <ChatComposer
            chatId={currentChat.id}
            selectedSnapshot={selectedSnapshot}
          />
        ) : null}
      </section>
      <ModelSettingsPanel
        onOpenChange={setSettingsOpen}
        onSelectedSnapshotChange={setSelectedSnapshot}
        open={settingsOpen}
        selectedSnapshot={selectedSnapshot}
      />
    </main>
  );
}
