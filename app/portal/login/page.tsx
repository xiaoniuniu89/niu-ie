import type { Metadata } from "next";
import { LoginForm } from "@/components/portal/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Niu client portal</h1>
        <p className="mt-2 text-sm text-muted-foreground">Access is by invitation. Enter the email we invited.</p>
        {error === "link" && (
          <p role="alert" className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            That sign-in link has expired or was already used. Request a new one below.
          </p>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
