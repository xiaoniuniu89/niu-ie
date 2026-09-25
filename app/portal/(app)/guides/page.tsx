import type { Metadata } from "next";
import Link from "next/link";
import { GUIDE_SECTIONS, GUIDES, guidePath } from "@/lib/portal/guide-list";

export const metadata: Metadata = { title: "Documentation hub" };

export default function GuidesPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Documentation hub</h1>
      <p className="mt-2 max-w-prose text-muted-foreground">
        Step-by-step help with domains, email, payments, AI and the other services around your website. Stuck on a step?
        Send a request from your project and we&apos;ll help.
      </p>
      <div className="mt-8 space-y-8">
        {GUIDE_SECTIONS.map((section) => (
          <section key={section}>
            <h2 className="font-serif text-lg font-semibold">{section}</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {GUIDES.filter((g) => g.section === section).map((g) => (
                <li key={g.slug}>
                  <Link
                    href={guidePath(g.slug)}
                    className="block h-full rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40"
                  >
                    <span className="font-medium text-foreground">{g.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{g.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
