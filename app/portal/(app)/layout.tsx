import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/portal/auth";
import { signOut } from "@/app/portal/actions";
import { Button } from "@/components/ui/button";
import { PortalSWRProvider } from "@/components/portal/PortalSWRProvider";

export const metadata: Metadata = {
  title: "Client portal",
  robots: { index: false, follow: false },
};

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = await requireUser();

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/portal" className="font-serif text-lg font-semibold text-foreground">
              Niu portal
            </Link>
            {isAdmin && (
              <Link href="/portal/admin" className="text-muted-foreground hover:text-foreground">
                Admin
              </Link>
            )}
          </nav>
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
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <PortalSWRProvider>{children}</PortalSWRProvider>
      </main>
    </div>
  );
}
