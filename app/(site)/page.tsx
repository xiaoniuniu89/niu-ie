import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Hero } from "@/components/Hero";

export default function Home() {
  const posts = getAllPosts();

  return (
    <>
      <Hero />

      {/* Latest posts */}
      {posts.length > 0 && (
        <section className="container mx-auto px-4 md:px-8 pb-20">
          <h2 className="font-serif text-2xl text-foreground mb-8">Latest</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
