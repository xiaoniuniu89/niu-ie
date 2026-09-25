import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { findGuide, readGuideSource } from "@/lib/portal/guides";
import { guideComponents } from "@/components/portal/GuideContent";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = findGuide((await params).slug);
  return { title: guide ? `${guide.title} · Documentation hub` : "Documentation hub" };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = findGuide(slug);
  const source = await readGuideSource(slug);
  if (!guide || source === null) notFound();

  return (
    <article className="max-w-prose">
      <nav aria-label="Breadcrumb" className="font-condensed text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Link href="/portal/guides" className="hover:text-foreground hover:underline">
          Documentation hub
        </Link>
        <span aria-hidden> / </span>
        {guide.section}
      </nav>
      <h1 className="mt-1 font-serif text-2xl font-semibold">{guide.title}</h1>
      <div className="mt-6 text-foreground/90">
        <MDXRemote source={source} components={guideComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </div>
    </article>
  );
}
