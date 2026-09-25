import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { AlertTriangle, ExternalLink, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

// Styles for rendered guide MDX. No typography plugin, so each element is mapped here.
export const guideComponents: MDXComponents = {
  h2: (props) => <h2 className="mt-10 font-serif text-xl font-semibold text-foreground first:mt-0" {...props} />,
  h3: (props) => <h3 className="mt-6 font-semibold text-foreground" {...props} />,
  p: (props) => <p className="mt-3 leading-relaxed" {...props} />,
  ul: (props) => <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-muted-foreground" {...props} />,
  ol: (props) => <ol className="mt-3 list-decimal space-y-1.5 pl-5 marker:text-muted-foreground" {...props} />,
  li: (props) => <li className="pl-1 leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
  code: (props) => <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]" {...props} />,
  hr: () => <hr className="my-8 border-border" />,
  blockquote: (props) => <blockquote className="mt-3 border-l-2 border-border pl-4 italic" {...props} />,
  table: (props) => (
    <div className="mt-4 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  thead: (props) => <thead className="border-b border-border bg-muted/50 text-left" {...props} />,
  tr: (props) => <tr className="border-b border-border last:border-0" {...props} />,
  th: (props) => <th className="px-3 py-2 font-medium text-foreground" {...props} />,
  td: (props) => <td className="px-3 py-2 align-top" {...props} />,
  a: ({ href = "", children, ...props }) => {
    const className = "text-primary underline underline-offset-4";
    if (href.startsWith("/"))
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      );
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
        {children}
        <ExternalLink className="ml-0.5 inline h-3 w-3 align-middle" aria-hidden />
        <span className="sr-only"> (opens in new tab)</span>
      </a>
    );
  },
  Tip: ({ children }: { children: React.ReactNode }) => <Callout kind="tip">{children}</Callout>,
  Warning: ({ children }: { children: React.ReactNode }) => <Callout kind="warning">{children}</Callout>,
};

function Callout({ kind, children }: { kind: "tip" | "warning"; children: React.ReactNode }) {
  const Icon = kind === "tip" ? Lightbulb : AlertTriangle;
  return (
    <div
      className={cn(
        "mt-4 flex gap-3 rounded-lg border px-4 py-3 [&>div>p:first-child]:mt-0",
        kind === "tip" ? "border-primary/25 bg-primary/5" : "border-secondary/50 bg-secondary/10",
      )}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", kind === "tip" ? "text-primary" : "text-secondary-text")} aria-hidden />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
