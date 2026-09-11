import { SignIn } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getClientProject } from "@/config/clients";
import Image from "next/image";

export const metadata = {
  title: "Client Portal | Niu Web",
  description: "Invitation-only client portal.",
};

export default async function PortalPage() {
  const { userId } = await auth();

  // If user is not signed in, show the login form right here on /portal
  if (!userId) {
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
              Client Mission Control
            </h1>
            <p className="text-xs text-muted-foreground">
              Invitation-only client portal. Sign in with the email invited by Daniel.
            </p>
          </div>

          <div className="flex justify-center">
            <SignIn routing="hash" fallbackRedirectUrl="/portal" />
          </div>
        </div>
      </main>
    );
  }

  // Once signed in, check if requirements have been completed
  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const project = getClientProject(userEmail);

  const hasCompletedInClerk = user?.publicMetadata?.hasCompletedRequirements === true;
  const hasCompletedInConfig = project.status !== "onboarding";

  // If requirements are not done, send them to Onboarding
  if (!hasCompletedInClerk && !hasCompletedInConfig) {
    redirect("/portal/onboarding");
  }

  // Otherwise, send them to their dashboard
  redirect("/portal/dashboard");
}
