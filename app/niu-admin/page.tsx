import type { Metadata } from "next";
import { AdminSignInForm } from "@/components/portal/AdminSignInForm";

// Not linked from anywhere and left out of robots.ts so the path isn't advertised.
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function AdminSignInPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Admin sign in</h1>
        <AdminSignInForm />
      </div>
    </main>
  );
}
