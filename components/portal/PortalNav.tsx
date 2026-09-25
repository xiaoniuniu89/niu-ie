"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { BookOpen, ChevronDown, FolderOpen, LayoutGrid, Menu, ShieldCheck } from "lucide-react";
import { GUIDE_SECTIONS, GUIDES, guidePath } from "@/lib/portal/guide-list";
import { projectPath, projectsKey, type ProjectsResponse } from "@/lib/portal/projects";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const DOCS_PATH = "/portal/guides";

// Desktop sidebar. Sticky, and scrolls on its own when the docs list is open.
export function PortalSidebar({ isAdmin }: { isAdmin: boolean }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border md:block">
      <div className="sticky top-0 max-h-screen overflow-y-auto py-8 pr-4">
        <PortalNav isAdmin={isAdmin} />
      </div>
    </aside>
  );
}

// Small screens get the same nav in a sheet opened from the header.
export function PortalMobileNav({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-muted md:hidden">
        <Menu className="h-5 w-5" aria-hidden />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 gap-0 overflow-y-auto px-3 py-6">
        <SheetTitle className="px-3 font-serif text-lg">Niu portal</SheetTitle>
        <SheetDescription className="sr-only">Projects, documentation and account links</SheetDescription>
        {/* Close once a link is followed. */}
        <div className="mt-6" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
          <PortalNav isAdmin={isAdmin} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PortalNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Portal" className="space-y-7 text-sm">
      <NavLink href="/portal" icon={LayoutGrid} active={pathname === "/portal"}>
        Overview
      </NavLink>
      <ProjectsGroup pathname={pathname} />
      <DocsGroup pathname={pathname} />
      {isAdmin && (
        <NavLink href="/portal/admin" icon={ShieldCheck} active={pathname.startsWith("/portal/admin")}>
          Admin
        </NavLink>
      )}
    </nav>
  );
}

function ProjectsGroup({ pathname }: { pathname: string }) {
  // Same cached key as the overview and project pages, so this costs no extra request.
  const { data, error } = useSWR<ProjectsResponse>(projectsKey);
  const clients = data?.clients.filter((c) => c.projects.length > 0) ?? [];
  // Admins see every client, so label projects by business once there's more than one.
  const showClient = clients.length > 1;

  return (
    <div>
      <GroupLabel icon={FolderOpen}>Projects</GroupLabel>
      {error ? (
        <p className="ml-5 mt-2 border-l border-border pl-5 text-muted-foreground">Couldn&apos;t load projects.</p>
      ) : !data ? (
        <div className="ml-5 mt-2 space-y-2 border-l border-border pl-5" aria-busy="true">
          <div className="h-4 w-36 animate-pulse rounded bg-muted" />
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        </div>
      ) : clients.length === 0 ? (
        <p className="ml-5 mt-2 border-l border-border pl-5 text-muted-foreground">No projects yet.</p>
      ) : (
        <div className="ml-5 mt-1.5 space-y-3 border-l border-border pl-2">
          {clients.map((client) => (
            <div key={client.id}>
              {showClient && <p className="truncate px-3 pb-0.5 pt-1 text-xs text-muted-foreground">{client.business_name}</p>}
              <ul className="space-y-0.5">
                {client.projects.map((project) => (
                  <li key={project.id}>
                    <SubLink href={projectPath(project.id)} active={pathname === projectPath(project.id)}>
                      {project.name}
                    </SubLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DocsGroup({ pathname }: { pathname: string }) {
  const inDocs = pathname === DOCS_PATH || pathname.startsWith(`${DOCS_PATH}/`);
  const [open, setOpen] = useState(inDocs);
  const [wasInDocs, setWasInDocs] = useState(inDocs);

  // Arriving at a guide from anywhere else expands the list.
  if (inDocs !== wasInDocs) {
    setWasInDocs(inDocs);
    if (inDocs) setOpen(true);
  }

  return (
    <div>
      <div className="flex items-center gap-1">
        <NavLink href={DOCS_PATH} icon={BookOpen} active={pathname === DOCS_PATH} className="flex-1">
          Documentation hub
        </NavLink>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="docs-nav"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-9 md:w-9"
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden />
          <span className="sr-only">{open ? "Hide guides" : "Show guides"}</span>
        </button>
      </div>
      {open && (
        <div id="docs-nav" className="ml-5 mt-2 space-y-4 border-l border-border pl-2">
          {GUIDE_SECTIONS.map((section) => (
            <div key={section}>
              <p className="px-3 font-condensed text-xs font-medium uppercase tracking-wide text-muted-foreground">{section}</p>
              <ul className="mt-1 space-y-0.5">
                {GUIDES.filter((g) => g.section === section).map((g) => (
                  <li key={g.slug}>
                    <SubLink href={guidePath(g.slug)} active={pathname === guidePath(g.slug)}>
                      {g.title}
                    </SubLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type Icon = React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

function GroupLabel({ icon: Icon, children }: { icon: Icon; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 px-3 font-medium text-foreground">
      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
      {children}
    </p>
  );
}

function NavLink({
  href,
  icon: Icon,
  active,
  className,
  children,
}: {
  href: string;
  icon: Icon;
  active: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-11 md:min-h-9 items-center gap-2.5 rounded-md px-3 py-1.5 font-medium hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "bg-muted text-foreground" : "text-foreground/80 hover:text-foreground",
        className,
      )}
    >
      <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} aria-hidden />
      {children}
    </Link>
  );
}

function SubLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-11 items-center md:min-h-0 rounded-md px-3 py-1.5 leading-snug hover:bg-muted hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "bg-muted font-semibold text-foreground" : "text-muted-foreground",
      )}
    >
      {children}
    </Link>
  );
}
