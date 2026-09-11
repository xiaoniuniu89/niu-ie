import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileCode,
  Globe,
  ShieldCheck,
  Github,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Sparkles
} from "lucide-react";

export const metadata = {
  title: "Client Guides & Walkthroughs | Niu Web",
  description: "Step-by-step technical guides for setting up domain DNS, Pageclip forms, Google App passwords, and Vercel accounts.",
};

const GUIDES = [
  {
    slug: "pageclip-setup",
    title: "Pageclip Contact Form Setup",
    description: "The easiest way to receive website inquiries without creating email passwords. Free, secure, and takes 3 minutes.",
    category: "Forms & Inquiries",
    timeToComplete: "3 mins",
    icon: FileCode,
    recommended: true,
  },
  {
    slug: "custom-domain-dns",
    title: "Connecting Your Custom Domain (DNS)",
    description: "Exact A and CNAME records to point your domain from Blacknight, GoDaddy, LetsHost, or Cloudflare to Vercel.",
    category: "Domains & DNS",
    timeToComplete: "5 mins",
    icon: Globe,
    recommended: true,
  },
  {
    slug: "google-app-password",
    title: "Creating a Google App Password",
    description: "For clients using custom SMTP. How to enable 2-Step Verification and generate a 16-character Gmail App Password.",
    category: "Email & SMTP",
    timeToComplete: "4 mins",
    icon: ShieldCheck,
    recommended: false,
  },
  {
    slug: "vercel-github-invites",
    title: "Accepting GitHub & Vercel Invites",
    description: "How to accept ownership or collaborator invites so you have full control over your website repository and hosting.",
    category: "Account Handover",
    timeToComplete: "3 mins",
    icon: Github,
    recommended: false,
  },
];

export default function GuidesHubPage() {
  return (
    <main className="min-h-screen bg-background py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Header */}
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
                Technical Knowledge Base
              </span>
            </div>
          </Link>

          <Button variant="outline" size="sm" asChild className="font-condensed text-xs">
            <Link href="/portal/dashboard">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back to Console
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="space-y-3">
          <Badge variant="outline" className="font-condensed text-xs text-primary border-primary/30 uppercase tracking-wider">
            Self-Service Walkthroughs
          </Badge>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Client Setup Guides
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
            Clear, step-by-step visual instructions on how to set up your domain, wire up contact forms with Pageclip, and accept account ownership.
          </p>
        </div>

        {/* Guides List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GUIDES.map((guide) => {
            const Icon = guide.icon;
            return (
              <Card key={guide.slug} className="border border-border hover:border-primary/40 hover:-translate-y-1 transition-all flex flex-col justify-between shadow-sm">
                <CardHeader className="space-y-2 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      {guide.recommended && (
                        <Badge className="bg-secondary text-secondary-foreground font-condensed text-[10px] uppercase">
                          Recommended
                        </Badge>
                      )}
                      <span className="text-xs font-mono text-muted-foreground">{guide.timeToComplete}</span>
                    </div>
                  </div>
                  <CardTitle className="font-serif text-lg text-foreground pt-1">
                    {guide.title}
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {guide.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="outline" size="sm" asChild className="w-full text-xs font-condensed justify-between mt-2">
                    <Link href={`/portal/guides/${guide.slug}`}>
                      <span>Read Step-by-Step Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="p-6 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif font-bold text-base text-foreground">Need us to handle this for you?</h3>
            <p className="text-xs text-muted-foreground">
              If you’d rather not touch DNS records or account configs, our team can handle it directly via temporary delegate access.
            </p>
          </div>
          <Button asChild size="sm" className="bg-primary text-primary-foreground font-condensed text-xs shrink-0">
            <Link href="/portal/dashboard">
              Send Support Request
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
