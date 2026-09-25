import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { GUIDES } from "@/lib/portal/guide-list";

// Guide bodies live as MDX in content/portal-guides/<slug>.mdx.
// next.config.ts traces that folder into the /portal build output.
const GUIDES_DIR = path.join(process.cwd(), "content", "portal-guides");

export function findGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}

export async function readGuideSource(slug: string) {
  if (!findGuide(slug)) return null;
  return readFile(path.join(GUIDES_DIR, `${slug}.mdx`), "utf8");
}
