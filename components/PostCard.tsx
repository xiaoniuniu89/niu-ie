import Link from "next/link";
import type { Post } from "@/lib/posts";

const categoryColors: Record<string, string> = {
  music: "bg-secondary-text/15 text-secondary-text",
  games: "bg-accent/15 text-accent",
  software: "bg-primary/15 text-primary",
};

export function PostCard({ post }: { post: Post }) {
  const { slug, frontmatter } = post;

  return (
    <Link
      href={`/posts/${slug}`}
      className="group block bg-card border border-border rounded-xl p-6 hover:-translate-y-1 hover:shadow-md transition-all"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {frontmatter.categories.map((cat) => (
          <span
            key={cat}
            className={`font-condensed text-xs font-medium px-2.5 py-1 rounded-full capitalize ${categoryColors[cat] ?? "bg-muted text-muted-foreground"}`}
          >
            {cat}
          </span>
        ))}
        <time className="font-condensed text-xs text-foreground/50">
          {new Date(frontmatter.date).toLocaleDateString("en-IE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>
      <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors mb-2">
        {frontmatter.title}
      </h3>
      <p className="font-condensed font-light text-sm text-foreground/70 leading-relaxed">
        {frontmatter.description}
      </p>
    </Link>
  );
}
