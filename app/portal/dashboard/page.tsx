import Link from "next/link";
import Image from "next/image";
import { getClientProject } from "@/config/clients";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ExternalLink,
  Github,
  Globe,
  Server,
  FolderLock,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Sparkles,
  HelpCircle,
  FileCode,
  Layers,
  Rocket,
  Send
} from "lucide-react";

import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Client Console | Niu Web",
  description: "Your personalized web project cloud console, deployment links, and roadmap.",
};

export default async function ClientDashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/portal/sign-in");
  }

  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const project = getClientProject(userEmail);

  const hasCompletedInClerk = user?.publicMetadata?.hasCompletedRequirements === true;
  const hasCompletedInConfig = project.status !== "onboarding";

  // If requirements have not been completed, immediately present the Onboarding discovery wizard
  if (!hasCompletedInClerk && !hasCompletedInConfig) {
    redirect("/portal/onboarding");
  }

  const companyName = project.companyName !== "Your Workspace"
    ? project.companyName
    : (user?.publicMetadata?.businessName as string) || "Your Workspace";

  const statusMap = {
    onboarding: { label: "Discovery & Intake", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
    discovery: { label: "Requirements Review", color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
    development: { label: "V1 Build In Progress", color: "bg-primary/10 text-primary border-primary/30" },
    staging: { label: "Staging Preview Ready", color: "bg-purple-500/10 text-purple-600 border-purple-500/30" },
    dns_setup: { label: "Connecting Domain", color: "bg-orange-500/10 text-orange-600 border-orange-500/30" },
    launched: { label: "Live in Production", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  };

  const currentStatus = statusMap[project.status] || statusMap.development;

  return (
    <main className="min-h-screen bg-background text-foreground py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Bar */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <Image
                src="/niu-zi.webp"
                alt="Niu Web"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl md:text-2xl font-bold tracking-tight">
                  {companyName}
                </h1>
                <Badge variant="outline" className={`font-condensed text-xs ${currentStatus.color}`}>
                  {currentStatus.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-condensed">
                Customer ID: <span className="font-mono">{project.id}</span> • Managed by Niu Web
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild className="font-condensed text-xs">
              <Link href="/portal/onboarding">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-secondary" />
                Retake Intake
              </Link>
            </Button>
            <Button variant="default" size="sm" asChild className="font-condensed text-xs bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/portal/guides">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                Guides
              </Link>
            </Button>
            <UserButton />
          </div>
        </header>

        {/* Milestone Progress Bar */}
        <Card className="border border-border shadow-sm bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-serif font-bold uppercase tracking-wider text-muted-foreground">
                V1 Launch Progression
              </CardTitle>
              <span className="text-xs font-condensed text-primary font-semibold">
                Target Launch: {project.targetLaunchDate}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { step: "01", name: "Requirements Brief", desc: "Intake captured", state: "done" },
                { step: "02", name: "V1 Architecture", desc: "Active development", state: "active" },
                { step: "03", name: "Staging Review", desc: "Client preview approval", state: "pending" },
                { step: "04", name: "Domain & Launch", desc: "DNS pointing & go-live", state: "pending" },
              ].map((m) => (
                <div
                  key={m.step}
                  className={`p-3 rounded-lg border transition-all ${
                    m.state === "done"
                      ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                      : m.state === "active"
                      ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                      : "border-border/60 bg-muted/20 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-condensed">
                    <span className="font-mono font-bold">{m.step}</span>
                    {m.state === "done" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {m.state === "active" && <Clock className="w-4 h-4 text-primary animate-pulse" />}
                  </div>
                  <h4 className="font-serif font-bold text-sm text-foreground mt-1">{m.name}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{m.desc}</p>
                </div>
              ))}
            </div>
            {project.statusMessage && (
              <div className="mt-4 p-3 rounded bg-muted/40 text-xs text-foreground/80 flex items-center gap-2 border border-border/40">
                <Sparkles className="w-4 h-4 text-secondary shrink-0" />
                <span><strong>Status Note:</strong> {project.statusMessage}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cloud Console Quick Access Bar */}
        <section className="space-y-3">
          <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-muted-foreground">
            Cloud Console & Deployments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Live Domain */}
            <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between space-y-3 hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[10px] font-condensed">
                  {project.domain.isConfigured ? "Connected" : "Pending DNS"}
                </Badge>
              </div>
              <div>
                <span className="text-xs font-condensed text-muted-foreground uppercase">Production Domain</span>
                <p className="font-serif font-bold text-sm text-foreground truncate">
                  {project.domain.domainName}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="w-full text-xs font-condensed">
                <Link href="/portal/guides/custom-domain-dns">
                  Setup DNS Records
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>

            {/* Vercel Staging */}
            <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between space-y-3 hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[10px] font-condensed text-purple-600 border-purple-500/30">
                  Staging / Preview
                </Badge>
              </div>
              <div>
                <span className="text-xs font-condensed text-muted-foreground uppercase">Live Preview Link</span>
                <p className="font-serif font-bold text-sm text-foreground truncate">
                  {project.urls.staging ? "Preview Deployment Active" : "Generating..."}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="w-full text-xs font-condensed" disabled={!project.urls.staging}>
                <a href={project.urls.staging} target="_blank" rel="noopener noreferrer">
                  Open Staging URL
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </a>
              </Button>
            </div>

            {/* Git Repository */}
            <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between space-y-3 hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-foreground/10 text-foreground flex items-center justify-center">
                  <Github className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[10px] font-condensed">
                  Source Code
                </Badge>
              </div>
              <div>
                <span className="text-xs font-condensed text-muted-foreground uppercase">GitHub Repository</span>
                <p className="font-serif font-bold text-sm text-foreground truncate">
                  {project.urls.github ? project.urls.github.split("/").slice(-2).join("/") : "Private Repo"}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="w-full text-xs font-condensed" disabled={!project.urls.github}>
                <a href={project.urls.github} target="_blank" rel="noopener noreferrer">
                  View Repository
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </a>
              </Button>
            </div>

            {/* Asset Vault */}
            <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between space-y-3 hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                  <FolderLock className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[10px] font-condensed text-secondary border-secondary/30">
                  Shared Drive
                </Badge>
              </div>
              <div>
                <span className="text-xs font-condensed text-muted-foreground uppercase">Brand Assets Vault</span>
                <p className="font-serif font-bold text-sm text-foreground truncate">
                  Logos & Media Folder
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="w-full text-xs font-condensed" disabled={!project.urls.driveFolder}>
                <a href={project.urls.driveFolder} target="_blank" rel="noopener noreferrer">
                  Open Drive Folder
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Core Setup Cards: Domain DNS & Contact Form Routing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Custom Domain DNS Card */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base font-serif">Domain & DNS Setup</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs font-condensed">
                  Registrar: {project.domain.registrar || "Not specified"}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                To launch your website, add these 2 DNS records in your domain registrar account:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 font-mono text-xs">
                <div className="p-2.5 rounded bg-muted/50 border border-border flex items-center justify-between">
                  <div>
                    <span className="text-muted-foreground font-sans font-semibold">Type:</span> A &nbsp;
                    <span className="text-muted-foreground font-sans font-semibold">Name:</span> @ &nbsp;
                  </div>
                  <span className="font-bold text-primary">76.76.21.21</span>
                </div>
                <div className="p-2.5 rounded bg-muted/50 border border-border flex items-center justify-between">
                  <div>
                    <span className="text-muted-foreground font-sans font-semibold">Type:</span> CNAME &nbsp;
                    <span className="text-muted-foreground font-sans font-semibold">Name:</span> www &nbsp;
                  </div>
                  <span className="font-bold text-primary">cname.vercel-dns.com</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">Need step-by-step guidance?</span>
                <Button variant="link" size="sm" asChild className="text-xs font-condensed p-0 h-auto">
                  <Link href="/portal/guides/custom-domain-dns">
                    Read DNS Walkthrough →
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form Routing Card (Pageclip / SMTP) */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                  <CardTitle className="text-base font-serif">Contact Form Routing</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs font-condensed text-secondary border-secondary/30">
                  {project.formSetup.method === "pageclip" ? "Pageclip Service" : "Direct SMTP"}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                {project.formSetup.method === "pageclip"
                  ? "Zero-password form handling powered by Pageclip. Inquiries are stored and routed to your email."
                  : "Direct server-to-server dispatch using your Gmail / Google Workspace App Password."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded bg-muted/40 text-xs space-y-1.5 border border-border">
                <p><strong>Form Name:</strong> <code className="text-primary">{project.formSetup.pageclipFormName || "contact-form"}</code></p>
                <p><strong>Status:</strong> <span className="text-emerald-600 font-semibold">Endpoint Verified & Active</span></p>
                <p className="text-[11px] text-muted-foreground">All visitor submissions are encrypted and forwarded instantly to <code>{project.clientEmail}</code>.</p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">Change routing or test form?</span>
                <Button variant="link" size="sm" asChild className="text-xs font-condensed p-0 h-auto">
                  <Link href="/portal/guides/pageclip-setup">
                    View Form Guide →
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scope Overview: V1 Launch Scope vs Future Product Backlog */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* V1 Launch Scope */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                <CardTitle className="text-base font-serif">Version 1 Launch Scope</CardTitle>
              </div>
              <CardDescription className="text-xs">
                The core pages and essential capabilities locked in for day-one launch.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-xs font-condensed uppercase font-semibold text-muted-foreground block mb-1.5">
                  Included Pages ({project.v1Scope.pages.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.v1Scope.pages.map((p) => (
                    <Badge key={p} variant="secondary" className="text-xs font-condensed py-1">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs font-condensed uppercase font-semibold text-muted-foreground block mb-1.5">
                  Key Technical Features
                </span>
                <ul className="space-y-1.5 text-xs text-foreground/80">
                  {project.v1Scope.coreFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Captured Product Backlog */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-secondary" />
                <CardTitle className="text-base font-serif">Captured Future Product Backlog</CardTitle>
              </div>
              <CardDescription className="text-xs">
                All long-term requirements and feature requests captured for post-launch grooming.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {project.productBacklog.map((item) => (
                  <div key={item.id} className="p-2.5 rounded border border-border/80 bg-muted/20 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground font-condensed">{item.title}</span>
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-condensed">
                        {item.priority} priority
                      </Badge>
                    </div>
                    {item.notes && (
                      <p className="text-[11px] text-muted-foreground">{item.notes}</p>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground pt-1 border-border/40 border-t">
                Want to add more requirements? Submit a request or retake the intake form anytime.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Step-by-Step Guides Shelf */}
        <section className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-serif font-bold text-foreground">
                Self-Service Setup Guides & Walkthroughs
              </h2>
              <p className="text-xs text-muted-foreground">
                Step-by-step visual documentation for setting up your accounts, domain, and services.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild className="font-condensed text-xs">
              <Link href="/portal/guides">View All Guides →</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/portal/guides/pageclip-setup"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:-translate-y-1 transition-all space-y-2 block"
            >
              <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <FileCode className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-sm text-foreground">Pageclip Forms Walkthrough</h3>
              <p className="text-xs text-muted-foreground">
                How to create a free Pageclip account and copy your form endpoint in under 3 minutes.
              </p>
            </Link>

            <Link
              href="/portal/guides/custom-domain-dns"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:-translate-y-1 transition-all space-y-2 block"
            >
              <div className="w-8 h-8 rounded-md bg-secondary/10 text-secondary flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-sm text-foreground">Custom Domain DNS Guide</h3>
              <p className="text-xs text-muted-foreground">
                How to log into Blacknight, GoDaddy, or Cloudflare and point CNAME & A records.
              </p>
            </Link>

            <Link
              href="/portal/guides/google-app-password"
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:-translate-y-1 transition-all space-y-2 block"
            >
              <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-sm text-foreground">Google App Password Setup</h3>
              <p className="text-xs text-muted-foreground">
                How to generate a 16-character app password for Gmail / Google Workspace SMTP.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
