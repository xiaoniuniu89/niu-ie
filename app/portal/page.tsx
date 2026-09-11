import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getClientProject } from "@/config/clients";

export const metadata = {
  title: "Client Portal | Niu Web",
  description: "Invitation-only client portal.",
};

export default async function PortalPage() {
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
