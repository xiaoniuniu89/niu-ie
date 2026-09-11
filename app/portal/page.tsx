import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getClientProject } from "@/config/clients";

export const metadata = {
  title: "Customer Portal | Niu Web",
  description: "Invitation-only customer portal.",
};

export default async function PortalPage() {
  const { isAuthenticated, redirectToSignIn } = await auth();
  if (!isAuthenticated) {
    return redirectToSignIn();
  }

  const user = await currentUser();

  // Once signed in, check if requirements have been completed
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
