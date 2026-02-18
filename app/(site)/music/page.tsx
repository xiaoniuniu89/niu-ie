import { getPostsByCategory } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music",
  description: "Posts about music — trad, folk, whatever catches my ear.",
};

export default function MusicPage() {
  const posts = getPostsByCategory("music");

  return (
    <div className="container mx-auto px-4 md:px-8 py-16">
      <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Music</h1>
      <p className="font-condensed font-light text-lg text-foreground/70 mb-12 max-w-xl">
        Trad, folk, and whatever else catches my ear.
      </p>

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="font-condensed text-foreground/50">No posts yet. Check back soon.</p>
      )}
    </div>
  );
}
