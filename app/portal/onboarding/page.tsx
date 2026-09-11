import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { OnboardingWizard } from "@/components/portal/OnboardingWizard";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Client Onboarding & Product Discovery | Niu Web",
  description: "Comprehensive product requirements and asset intake wizard for new client projects.",
};

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/portal/sign-in");
  }

  return (
    <main className="min-h-screen bg-background py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Simple Brand Nav */}
        <div className="flex items-center justify-between pb-6 border-b border-border/50">
          <Link href="/portal" className="flex items-center gap-3">
            <Image
              src="/niu-zi.webp"
              alt="Niu Web"
              width={36}
              height={36}
              className="h-9 w-auto"
            />
            <div className="leading-tight">
              <span className="font-serif font-bold text-lg text-foreground block">Niu Web</span>
              <span className="font-condensed text-xs text-muted-foreground uppercase tracking-wider block">
                Client Mission Control
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/portal/dashboard"
              className="font-condensed text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <span>Skip to Dashboard</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
            <UserButton />
          </div>
        </div>

        {/* Wizard */}
        <OnboardingWizard />
      </div>
    </main>
  );
}
