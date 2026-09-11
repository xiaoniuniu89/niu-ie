import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GuideScreenshotPlaceholder } from "@/components/portal/GuidePlaceholder";
import { ArrowLeft, Globe, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Connecting Your Custom Domain (DNS Guide) | Niu Web Guides",
  description: "Step-by-step instructions on pointing your custom domain from Blacknight, GoDaddy, or Cloudflare to Vercel.",
};

export default function CustomDomainGuidePage() {
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
              Domains & DNS
            </Badge>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-condensed text-xs uppercase">
              Crucial for Launch
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-foreground mt-2">
            How to Point Your Custom Domain to Your Website
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            To connect your live domain (e.g. <code>yourbusiness.ie</code>) to our high-performance cloud hosting network, you only need to add <strong>two DNS records</strong> in your domain registrar control panel.
          </p>
        </div>

        {/* The Exact Records Card */}
        <div className="p-5 rounded-xl border border-primary/30 bg-primary/5 space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary shrink-0" />
            <h3 className="font-serif font-bold text-base text-foreground">
              The Exact DNS Records You Need to Add
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Log into your registrar (Blacknight, LetsHost, GoDaddy, Namecheap, etc.) and navigate to <strong>DNS Management</strong> or <strong>Manage Zone Records</strong>:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-card rounded-lg border border-border space-y-1 font-mono text-xs">
              <span className="text-[11px] font-sans font-bold text-muted-foreground uppercase block">Record 1 (Apex / Root Domain)</span>
              <p><span className="text-muted-foreground font-sans">Type:</span> <strong>A</strong></p>
              <p><span className="text-muted-foreground font-sans">Host / Name:</span> <strong>@</strong> (or leave blank)</p>
              <p><span className="text-muted-foreground font-sans">Value / Points to:</span> <strong className="text-primary">76.76.21.21</strong></p>
              <p><span className="text-muted-foreground font-sans">TTL:</span> Automatic / 3600</p>
            </div>

            <div className="p-3 bg-card rounded-lg border border-border space-y-1 font-mono text-xs">
              <span className="text-[11px] font-sans font-bold text-muted-foreground uppercase block">Record 2 (WWW Subdomain)</span>
              <p><span className="text-muted-foreground font-sans">Type:</span> <strong>CNAME</strong></p>
              <p><span className="text-muted-foreground font-sans">Host / Name:</span> <strong>www</strong></p>
              <p><span className="text-muted-foreground font-sans">Value / Points to:</span> <strong className="text-primary">cname.vercel-dns.com</strong></p>
              <p><span className="text-muted-foreground font-sans">TTL:</span> Automatic / 3600</p>
            </div>
          </div>
        </div>

        {/* Email Safety Warning */}
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-serif font-bold text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Important: Do NOT touch your MX or TXT records!</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Only add or edit the <strong>A</strong> and <strong>CNAME</strong> records for web traffic. Leaving your <strong>MX (Mail Exchange)</strong> and <strong>TXT (SPF/DKIM)</strong> records untouched guarantees that your business emails (Google Workspace, Office 365, etc.) continue working with zero interruption.
          </p>
        </div>

        {/* Step 1 */}
        <section className="space-y-3 pt-2">
          <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">1</span>
            Log into Your Domain Registrar
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Sign into the account where you purchased your domain (e.g. <em>Blacknight Solutions, LetsHost, GoDaddy, Cloudflare</em>). Look for <strong>Domains</strong> &gt; <strong>Manage DNS</strong>.
          </p>
          <GuideScreenshotPlaceholder
            stepNumber="1"
            title="Registrar DNS Management Panel"
            caption="Find your domain in the dashboard and click 'DNS Zone Editor' or 'Manage DNS'."
            elements={[
              { label: "Example Registrars", value: "Blacknight, LetsHost, GoDaddy, Cloudflare" },
              { label: "Section to find", value: "DNS Zone Editor / Advanced DNS Settings" },
            ]}
          />
        </section>

        {/* Step 2 */}
        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">2</span>
            Add the A Record
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            If an existing A record exists for <code>@</code>, update its IP address to <code>76.76.21.21</code>. If not, click <strong>"Add New Record"</strong>, choose type <strong>A</strong>, set Name to <code>@</code>, and enter <code>76.76.21.21</code>.
          </p>
          <GuideScreenshotPlaceholder
            stepNumber="2"
            title="Adding the A Record"
            caption="Directs root traffic (yourcompany.ie) to the Vercel edge network."
            elements={[
              { label: "Record Type", value: "A" },
              { label: "Host", value: "@" },
              { label: "Target IP", value: "76.76.21.21" },
            ]}
          />
        </section>

        {/* Step 3 */}
        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">3</span>
            Add the CNAME Record
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Click <strong>"Add New Record"</strong>, select type <strong>CNAME</strong>, enter <code>www</code> as the Host/Name, and point it to <code>cname.vercel-dns.com</code>.
          </p>
          <GuideScreenshotPlaceholder
            stepNumber="3"
            title="Adding the CNAME Record"
            caption="Directs www traffic (www.yourcompany.ie) to the verified SSL cloud endpoint."
            elements={[
              { label: "Record Type", value: "CNAME" },
              { label: "Host", value: "www" },
              { label: "Points to", value: "cname.vercel-dns.com" },
            ]}
          />
        </section>

        {/* Step 4 */}
        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">4</span>
            Wait for Propagation (Automatic SSL)
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            DNS changes usually take anywhere between 15 minutes to a couple of hours to propagate worldwide. Once detected, our hosting infrastructure will automatically provision a free, auto-renewing SSL certificate (HTTPS padlock) for your domain.
          </p>
        </section>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-border flex items-center justify-between">
          <Button variant="outline" asChild size="sm" className="font-condensed text-xs">
            <Link href="/portal/dashboard">
              Back to Client Console
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-primary text-primary-foreground font-condensed text-xs">
            <Link href="/portal/guides/google-app-password">
              Next Guide: Google App Passwords →
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
