import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export const metadata = {
  title: "Sign In | Customer Portal | Niu Web",
  description: "Sign in to access your website project dashboard, repository, and guides.",
};

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Image
            src="/niu-zi.webp"
            alt="Niu Web"
            width={40}
            height={40}
            className="h-10 w-auto mx-auto"
          />
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Customer Portal
          </h1>
          <p className="text-xs text-muted-foreground">
            Invitation-only customer portal. Sign in with your registered email.
          </p>
        </div>

        <div className="flex justify-center">
          <SignIn />
        </div>
      </div>
    </main>
  );
}
