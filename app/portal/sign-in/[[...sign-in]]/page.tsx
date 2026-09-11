import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Sign In to Client Portal | Niu Web",
  description: "Sign in to access your website project dashboard, repository, and guides.",
};

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/niu-zi.webp"
              alt="Niu Web"
              width={40}
              height={40}
              className="h-10 w-auto mx-auto"
            />
          </Link>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Client Mission Control
          </h1>
          <p className="text-xs text-muted-foreground">
            Invitation-only client portal. Sign in with the email invited by Daniel.
          </p>
        </div>

        <div className="flex justify-center">
          <SignIn
            routing="path"
            path="/portal/sign-in"
            fallbackRedirectUrl="/portal"
          />
        </div>

        <div className="text-center pt-2">
          <Link
            href="/portal"
            className="text-xs font-condensed text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Portal Overview
          </Link>
        </div>
      </div>
    </main>
  );
}
