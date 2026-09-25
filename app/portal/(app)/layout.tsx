import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/portal/auth";
import { signOut } from "@/app/portal/actions";
import { Button } from "@/components/ui/button";
import { PortalMobileNav, PortalSidebar } from "@/components/portal/PortalNav";
import { PortalSWRProvider } from "@/components/portal/PortalSWRProvider";

export const metadata: Metadata = {
  title: "Client portal",
  robots: { index: false, follow: false },
};

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = await requireUser();

  return (
    // The sidebar reads the cached project list, so the SWR provider wraps the whole shell.
    <PortalSWRProvider>
      <div className="flex flex-1 flex-col">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-2">
              <PortalMobileNav isAdmin={isAdmin} />
              <Link href="/portal" className="font-serif text-lg font-semibold text-foreground">
                Niu portal
              </Link>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="hidden sm:inline">{user.email}</span>
              <form action={signOut}>
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </header>
        <div className="mx-auto flex w-full max-w-7xl flex-1 px-4">
          <PortalSidebar isAdmin={isAdmin} />
          <main className="min-w-0 flex-1 py-8 md:pl-10">{children}</main>
        </div>
      </div>
    </PortalSWRProvider>
  );
}
