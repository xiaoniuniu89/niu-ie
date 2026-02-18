import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { PostFrontmatter } from "@/lib/posts";

const categoryLabels: Record<string, { label: string; href: string }> = {
  music: { label: "Music", href: "/music" },
  games: { label: "Games", href: "/games" },
  software: { label: "Software", href: "/software" },
};

export function PostLayout({
  frontmatter,
  children,
}: {
  frontmatter: PostFrontmatter;
  children: React.ReactNode;
}) {
  const firstCat = categoryLabels[frontmatter.categories[0]];

  return (
    <article className="container mx-auto px-4 md:px-8 py-16 max-w-2xl">
      <Link
        href={firstCat?.href ?? "/"}
        className="inline-flex items-center gap-1.5 font-condensed text-sm text-foreground/60 hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {firstCat?.label ?? "Home"}
      </Link>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {frontmatter.categories.map((cat) => (
            <Link
              key={cat}
              href={categoryLabels[cat]?.href ?? "/"}
              className="font-condensed text-xs font-medium text-primary capitalize hover:underline"
            >
              {cat}
            </Link>
          ))}
          <time className="font-condensed text-xs text-foreground/50">
            {new Date(frontmatter.date).toLocaleDateString("en-IE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
          {frontmatter.title}
        </h1>
      </header>

      <div className="prose prose-lg max-w-none font-sans text-foreground/85 prose-headings:font-serif prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground">
        {children}
      </div>
    </article>
  );
}
