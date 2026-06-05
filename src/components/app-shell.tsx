"use client";

import { useState } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { ChatComposer } from "@/components/chat-composer";
import { ChatHeader } from "@/components/chat-header";
import { MessageList } from "@/components/message-list";
import { MobileDrawer } from "@/components/mobile-drawer";

export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <main className="flex h-dvh min-h-dvh overflow-hidden bg-background text-foreground">
      <AppSidebar className="hidden md:flex" />
      <MobileDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <ChatHeader onMenuClick={() => setDrawerOpen(true)} />
        <MessageList />
        <ChatComposer />
      </section>
    </main>
  );
}
