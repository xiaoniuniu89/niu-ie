import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GuideScreenshotPlaceholder } from "@/components/portal/GuidePlaceholder";
import { ArrowLeft, Github, Server, CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Accepting GitHub & Vercel Invites | Niu Web Guides",
  description: "How to accept ownership transfers and collaborator invites for your website repository and hosting.",
};

export default function VercelGithubInvitesGuidePage() {
  return (
    <main className="min-h-screen bg-background py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Back Link */}
        <div>
          <Button variant="ghost" size="sm" asChild className="font-condensed text-xs mb-2 -ml-2">
            <Link href="/portal/guides">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back to All Guides
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-condensed text-xs text-primary border-primary/30 uppercase">
              Account Handover
            </Badge>
            <Badge variant="secondary" className="font-condensed text-xs uppercase">
              Ownership Transfer
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-foreground mt-2">
            How to Accept Your GitHub & Vercel Project Invites
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            At Niu Web, we believe you should own 100% of your website code, assets, and hosting accounts. When your website build is ready for handover, Daniel will invite you as the owner of your GitHub code repository and Vercel cloud hosting project.
          </p>
        </div>

        {/* Part 1: GitHub */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-foreground shrink-0" />
            <h2 className="text-xl font-serif font-bold text-foreground">
              Part 1: Accepting Your GitHub Repository Invite
            </h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            1. If you do not have a free GitHub account, register one at <a href="https://github.com/signup" target="_blank" rel="noopener noreferrer" className="text-primary underline">github.com/signup</a>.
            <br />
            2. Check your email for an invitation from <strong>Daniel Callaghan (xiaoniuniu89)</strong> with the subject <em>"xiaoniuniu89 invited you to collaborate..."</em>.
            <br />
            3. Click <strong>"View Invitation"</strong> and then <strong>"Accept Invitation"</strong>.
          </p>
          <GuideScreenshotPlaceholder
            stepNumber="1"
            title="GitHub Repository Collaboration Invite"
            caption="Click 'Accept Invitation' to gain full administrator access to your website's private source code."
            elements={[
              { label: "Inviter", value: "Daniel Callaghan (@xiaoniuniu89)" },
              { label: "Access Level", value: "Admin / Collaborator" },
            ]}
          />
        </section>

        {/* Part 2: Vercel */}
        <section className="space-y-3 pt-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-primary shrink-0" />
            <h2 className="text-xl font-serif font-bold text-foreground">
              Part 2: Accepting Your Vercel Hosting Invite
            </h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            1. Sign in to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">vercel.com</a> using your GitHub account or work email.
            <br />
            2. When Daniel transfers the production project or invites your team, you will receive an email invite to join the project team or accept ownership transfer.
            <br />
            3. Once accepted, you can view analytics, live logs, deployment history, and manage domain settings directly.
          </p>
          <GuideScreenshotPlaceholder
            stepNumber="2"
            title="Vercel Team & Project Transfer Confirmation"
            caption="Click 'Accept Transfer' in the Vercel dashboard to take full billing and administrative control."
            elements={[
              { label: "Hosting Platform", value: "Vercel Enterprise Edge Network" },
              { label: "Account Type", value: "Hobby (Free) or Pro" },
            ]}
          />
        </section>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-border flex items-center justify-between">
          <Button variant="outline" asChild size="sm" className="font-condensed text-xs">
            <Link href="/portal/dashboard">
              Back to Client Console
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-primary text-primary-foreground font-condensed text-xs">
            <Link href="/portal/guides">
              View All Guides →
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
