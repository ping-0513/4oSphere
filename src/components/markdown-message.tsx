import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

type MarkdownMessageProps = {
  content: string;
};

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeSanitize]}
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ ...props }) => (
          <a
            className="text-primary underline underline-offset-4"
            rel="noreferrer"
            target="_blank"
            {...props}
          />
        ),
        blockquote: ({ ...props }) => (
          <blockquote
            className="border-l-2 border-border pl-3 text-muted-foreground"
            {...props}
          />
        ),
        code: ({ className, ...props }) => (
          <code
            className={
              className
                ? "block overflow-x-auto rounded-xl border border-border bg-background/70 p-3 text-sm"
                : "rounded-md bg-muted px-1.5 py-0.5 text-[0.9em]"
            }
            {...props}
          />
        ),
        h2: ({ ...props }) => (
          <h2 className="text-lg font-semibold leading-7" {...props} />
        ),
        h3: ({ ...props }) => (
          <h3 className="text-base font-semibold leading-7" {...props} />
        ),
        li: ({ ...props }) => <li className="pl-1" {...props} />,
        ol: ({ ...props }) => (
          <ol className="ml-5 list-decimal space-y-1" {...props} />
        ),
        p: ({ ...props }) => <p className="leading-[1.55]" {...props} />,
        pre: ({ ...props }) => (
          <pre className="overflow-x-auto rounded-xl" {...props} />
        ),
        table: ({ ...props }) => (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table
              className="w-full min-w-96 border-collapse text-sm"
              {...props}
            />
          </div>
        ),
        td: ({ ...props }) => (
          <td className="border-t border-border px-3 py-2" {...props} />
        ),
        th: ({ ...props }) => (
          <th className="bg-muted px-3 py-2 text-left font-medium" {...props} />
        ),
        ul: ({ ...props }) => (
          <ul className="ml-5 list-disc space-y-1" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// TODO: code block copy is required in Phase 4/5.
