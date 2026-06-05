import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ChatComposer() {
  return (
    <footer className="shrink-0 border-t border-border bg-background px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:px-6">
      <form className="mx-auto flex w-full max-w-3xl items-end gap-2">
        <label className="sr-only" htmlFor="message-composer">
          Message
        </label>
        <textarea
          className="max-h-36 min-h-14 flex-1 resize-none rounded-lg border border-input bg-card px-4 py-3 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          id="message-composer"
          placeholder="Message 4oSphere"
          rows={1}
        />
        <Button aria-label="Send message" size="icon" variant="default">
          <Send aria-hidden="true" className="size-4" />
        </Button>
      </form>
    </footer>
  );
}
