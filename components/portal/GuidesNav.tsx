"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { GUIDE_SECTIONS, GUIDES, guidePath } from "@/lib/portal/guide-list";
import { cn } from "@/lib/utils";

// Sidebar on desktop; a collapsible list above the guide on small screens.
export function GuidesNav() {
  const pathname = usePathname();
  const current = GUIDES.find((g) => guidePath(g.slug) === pathname);

  const links = (
    <div className="space-y-5">
      <Link
        href="/portal/guides"
        aria-current={pathname === "/portal/guides" ? "page" : undefined}
        className={cn(
          "block rounded-md px-2 py-1 text-sm hover:bg-muted",
          pathname === "/portal/guides" ? "font-semibold text-foreground" : "text-muted-foreground",
        )}
      >
        All guides
      </Link>
      {GUIDE_SECTIONS.map((section) => (
        <div key={section}>
          <p className="px-2 font-condensed text-xs font-medium uppercase tracking-wide text-muted-foreground">{section}</p>
          <ul className="mt-1.5 space-y-0.5">
            {GUIDES.filter((g) => g.section === section).map((g) => {
              const active = g === current;
              return (
                <li key={g.slug}>
                  <Link
                    href={guidePath(g.slug)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-2 py-1 text-sm hover:bg-muted hover:text-foreground",
                      active ? "bg-muted font-semibold text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {g.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* key closes the list after navigating to another guide */}
      <details key={pathname} className="group rounded-lg border border-border bg-card md:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium">
          {current ? current.title : "Browse guides"}
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <nav aria-label="Guides" className="border-t border-border px-2 py-4">
          {links}
        </nav>
      </details>
      <nav aria-label="Guides" className="sticky top-6 hidden md:block">
        {links}
      </nav>
    </>
  );
}
