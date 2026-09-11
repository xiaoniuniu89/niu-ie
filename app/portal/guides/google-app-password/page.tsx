import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GuideScreenshotPlaceholder } from "@/components/portal/GuidePlaceholder";
import { ArrowLeft, ShieldCheck, AlertCircle, KeyRound, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Setting Up Google App Password (SMTP) | Niu Web Guides",
  description: "How to generate a secure 16-digit Google App Password for custom Gmail and Google Workspace form sending.",
};

export default function GoogleAppPasswordGuidePage() {
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
              Email & SMTP
            </Badge>
            <Badge variant="secondary" className="font-condensed text-xs uppercase">
              Advanced Method
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-foreground mt-2">
            How to Generate a Google App Password for Contact Forms
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            If your business uses <strong>Google Workspace</strong> or <strong>Gmail</strong> and you prefer sending contact form inquiries directly through your own Google mail server (instead of Pageclip), you will need to generate a dedicated 16-digit Google App Password.
          </p>
        </div>

        {/* Security Note */}
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
          <div className="flex items-center gap-2 text-primary font-serif font-bold text-sm">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Why an App Password instead of your regular password?</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Google does not allow third-party servers to use your primary account password. An App Password is a unique 16-letter code that grants single-purpose permission to your website server, and can be revoked by you at any time without changing your personal password.
          </p>
        </div>

        {/* Step 1 */}
        <section className="space-y-3 pt-2">
          <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">1</span>
            Ensure 2-Step Verification is Turned On
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            App Passwords require 2-Step Verification on your Google account.
            Go to <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">Google Account Security</a>. Under <em>"How you sign in to Google"</em>, ensure <strong>2-Step Verification</strong> is ON.
          </p>
          <GuideScreenshotPlaceholder
            stepNumber="1"
            title="Google Account Security: 2-Step Verification"
            caption="Check that 2-Step Verification is active on your Google Workspace or Gmail account."
            elements={[
              { label: "Settings URL", value: "myaccount.google.com/security" },
              { label: "Requirement", value: "2-Step Verification must be set to 'On'" },
            ]}
          />
        </section>

        {/* Step 2 */}
        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">2</span>
            Search for "App Passwords"
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            In the search bar at the top of your Google Account page, type <strong>"App passwords"</strong> and select the result, or navigate directly to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-primary underline">myaccount.google.com/apppasswords</a>.
          </p>
          <GuideScreenshotPlaceholder
            stepNumber="2"
            title="Google Account Search Bar"
            caption="Search for 'App passwords' in the top search bar and click the security link."
            elements={[
              { label: "Search Term", value: "App passwords" },
              { label: "Direct URL", value: "myaccount.google.com/apppasswords" },
            ]}
          />
        </section>

        {/* Step 3 */}
        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">3</span>
            Name and Generate Your App Password
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Enter an app name like <code>Website Contact Form</code> and click <strong>"Create"</strong>. Google will display a yellow modal with a 16-character password (e.g. <code>abcd efgh ijkl mnop</code>).
          </p>
          <GuideScreenshotPlaceholder
            stepNumber="3"
            title="Generated 16-Character Password Modal"
            caption="Copy the 16 letters in the yellow box without spaces. This password will not be shown again."
            elements={[
              { label: "App Name", value: "Website Contact Form" },
              { label: "Generated Format", value: "16 lowercase letters (e.g. xxxx xxxx xxxx xxxx)" },
            ]}
          />
        </section>

        {/* Step 4 */}
        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">4</span>
            Safely Provide the App Password to Daniel
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Send the 16-digit code along with your Gmail / Google Workspace email address to Daniel via encrypted message or phone. Daniel will configure it in your website server environment variables (`GMAIL_USER` and `GMAIL_APP_PASSWORD`).
          </p>
          <div className="p-3 bg-muted/40 rounded border border-border text-xs text-muted-foreground space-y-1">
            <p><strong>Note:</strong> You can revoke this password at any time with one click in your Google Security dashboard.</p>
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-border flex items-center justify-between">
          <Button variant="outline" asChild size="sm" className="font-condensed text-xs">
            <Link href="/portal/dashboard">
              Back to Client Console
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-primary text-primary-foreground font-condensed text-xs">
            <Link href="/portal/guides/vercel-github-invites">
              Next Guide: GitHub & Vercel Invites →
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
