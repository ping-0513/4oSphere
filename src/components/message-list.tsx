const messages = [
  {
    role: "assistant",
    text: "4oSphere is ready for shell validation.",
  },
  {
    role: "user",
    text: "Keep the header and composer fixed while the conversation scrolls.",
  },
  {
    role: "assistant",
    text: "The current view keeps navigation, model display, knowledge, and web controls visible.",
  },
  {
    role: "assistant",
    text: "API calls, streaming, persistence, authentication, uploads, and settings internals remain deferred.",
  },
];

export function MessageList() {
  return (
    <div
      aria-label="Message list"
      className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-8"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-4">
        {messages.map((message, index) => (
          <article
            className={
              message.role === "user"
                ? "ml-auto max-w-[82%] rounded-lg bg-primary px-4 py-3 text-primary-foreground"
                : "mr-auto max-w-[82%] rounded-lg bg-secondary px-4 py-3 text-secondary-foreground"
            }
            key={`${message.role}-${index}`}
          >
            <p className="text-sm leading-6">{message.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
