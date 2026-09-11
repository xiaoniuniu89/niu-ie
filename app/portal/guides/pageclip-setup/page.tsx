import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GuideScreenshotPlaceholder } from "@/components/portal/GuidePlaceholder";
import { ArrowLeft, ExternalLink, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";

export const metadata = {
  title: "Setting Up Pageclip for Contact Forms | Niu Web Guides",
  description: "Step-by-step instructions on setting up Pageclip to receive website inquiries without creating email passwords.",
};

export default function PageclipGuidePage() {
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
              Forms & Inquiries
            </Badge>
            <Badge className="bg-secondary text-secondary-foreground font-condensed text-xs uppercase">
              Recommended Method
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-foreground mt-2">
            How to Set Up Pageclip for Your Website Forms
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            <a href="https://pageclip.co" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium inline-flex items-center gap-1">
              Pageclip.co <ExternalLink className="w-3 h-3" />
            </a> is a lightweight, zero-maintenance form backend. It captures your customer submissions, blocks spam, and forwards every inquiry straight to your inbox without needing server email passwords.
          </p>
        </div>

        {/* Why Pageclip callout */}
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-serif font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Why we recommend Pageclip</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Traditional contact forms require setting up SMTP email servers or generating sensitive Google App Passwords. Pageclip completely eliminates this: you get a free dedicated form endpoint that automatically logs inquiries in a clean web dashboard and emails them to you instantly.
          </p>
        </div>

        {/* Step 1 */}
        <section className="space-y-3 pt-2">
          <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">1</span>
            Create Your Free Pageclip Account
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Head to <a href="https://pageclip.co" target="_blank" rel="noopener noreferrer" className="text-primary underline">pageclip.co</a> and click <strong>"Get Started"</strong> or <strong>"Sign Up"</strong>. You can sign in with your work email or your Google account.
          </p>
          <GuideScreenshotPlaceholder
            stepNumber="1"
            title="Pageclip.co Homepage & Sign Up"
            caption="Click 'Sign Up' in the top right corner and authenticate with your business email."
            elements={[
              { label: "Target URL", value: "https://pageclip.co" },
              { label: "Account Tier", value: "Free Starter Plan (1,000 submissions/month)" },
            ]}
          />
        </section>

        {/* Step 2 */}
        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">2</span>
            Create a New Site & Form
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Once logged in, click <strong>"Create a Site"</strong> and name it after your business (e.g., <em>Midlands Craft Works</em>). Inside your site, create a form named <code>contact</code>.
          </p>
          <GuideScreenshotPlaceholder
            stepNumber="2"
            title="Create Site & Contact Form inside Pageclip"
            caption="Name your site and create a form named 'contact'. Set notification email to your primary inbox."
            elements={[
              { label: "Site Name", value: "Your Company Name" },
              { label: "Form Name", value: "contact" },
              { label: "Email Notifications", value: "Checked (Sends to your email address)" },
            ]}
          />
        </section>

        {/* Step 3 */}
        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">3</span>
            Copy Your Form API Key / Endpoint URL
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Pageclip will generate a unique form action URL that looks like:
            <br />
            <code className="bg-muted px-2 py-1 rounded text-primary text-xs font-mono mt-1 inline-block">
              https://send.pageclip.co/api_key/form_name
            </code>
          </p>
          <GuideScreenshotPlaceholder
            stepNumber="3"
            title="Pageclip Form Settings & Action URL"
            caption="Copy the action URL or the API key shown in the form integration settings tab."
            elements={[
              { label: "Action URL Pattern", value: "https://send.pageclip.co/<your-key>/contact" },
              { label: "API Key", value: "e.g. key_abc123xyz456..." },
            ]}
          />
        </section>

        {/* Step 4 */}
        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">4</span>
            Send Your Form Key to Daniel
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Paste your Pageclip URL or key into a message to Daniel (or in the Client Console support form). Daniel will wire it into your website contact form. Every time a visitor submits an inquiry:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-5">
            <li>The submission is encrypted and saved in your Pageclip dashboard.</li>
            <li>You receive an email notification immediately.</li>
            <li>You can export all past submissions to a CSV/Excel spreadsheet anytime.</li>
          </ul>
        </section>

        {/* Done Callout */}
        <div className="pt-6 border-t border-border flex items-center justify-between">
          <Button variant="outline" asChild size="sm" className="font-condensed text-xs">
            <Link href="/portal/dashboard">
              Back to Client Console
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-primary text-primary-foreground font-condensed text-xs">
            <Link href="/portal/guides/custom-domain-dns">
              Next Guide: Custom Domain DNS →
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
