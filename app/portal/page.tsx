import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getClientProject } from "@/config/clients";

export default async function PortalIndexPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/portal/sign-in");
  }

  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const project = getClientProject(userEmail);

  const hasCompletedInClerk = user?.publicMetadata?.hasCompletedRequirements === true;
  const hasCompletedInConfig = project.status !== "onboarding";

  // If user hasn't completed product requirements, route directly to the Onboarding wizard
  if (!hasCompletedInClerk && !hasCompletedInConfig) {
    redirect("/portal/onboarding");
  }

  // Otherwise, route to their active dashboard
  redirect("/portal/dashboard");
}
