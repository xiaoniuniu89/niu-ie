import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Key, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Design & Development Ireland",
  description: "Custom web design and development services for small businesses and organizations across Ireland. Fast, accessible, and SEO-optimized.",
};

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Modern, secure, and fast-loading websites optimized for SEO and performance. Built with Next.js and fully responsive on all screens.",
    color: "#4a7c59",
  },
  {
    icon: Key,
    title: "Complete Ownership",
    description:
      "You own 100% of your code, content, and hosting from day one. Manage updates yourself using a simple, integrated editor, with zero vendor lock-in.",
    color: "hsl(var(--secondary))",
  },
  {
    icon: TrendingUp,
    title: "Iterative Growth",
    description:
      "Start with a solid, budget-friendly launch version and scale when you are ready. We add new features step-by-step as your business grows.",
    color: "#9d3860",
  },
];

export default function WebPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "niu.ie",
    "url": "https://www.niu.ie/web",
    "logo": "https://www.niu.ie/niu-zi.webp",
    "image": "https://www.niu.ie/niu.webp",
    "description": "Custom web design and development services for small businesses and organizations in Ireland.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IE"
    },
    "priceRange": "$$"
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="max-w-2xl mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
          Web Design & Development in Ireland
        </h1>
        <p className="font-condensed font-light text-lg text-foreground/80 leading-relaxed mb-4">
          I build high-performance websites for small businesses and community organisations across Ireland. My process focuses on launching a solid, lightweight foundation quickly and expanding it iteratively as your business grows.
        </p>
        <p className="font-condensed font-light text-lg text-foreground/80 leading-relaxed">
          No complex monthly retainers, no proprietary platforms, and no vendor lock-in. You get clean code, an intuitive editor to manage your content, and complete ownership of your site from day one.
        </p>
      </section>

      <section className="mb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="rounded-[25px] border border-border hover:-translate-y-2 transition-all">
              <CardContent className="p-8">
                <service.icon
                  className="h-10 w-10 mb-4"
                  style={{ color: service.color }}
                />
                <h3 className="font-serif text-xl text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="font-condensed font-light text-sm text-foreground/70 leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-2xl mb-16">
        <h2 className="font-serif text-2xl text-foreground mb-6">How It Works</h2>
        <div className="space-y-6 font-condensed font-light text-foreground/80 leading-relaxed">
          <div>
            <h3 className="font-serif text-lg text-foreground mb-2">1. The Launch Version</h3>
            <p>We define and build a high-quality initial version that covers your immediate needs. This gets your brand online quickly and cleanly without large upfront design fees.</p>
          </div>
          <div>
            <h3 className="font-serif text-lg text-foreground mb-2">2. Full Self-Management</h3>
            <p>Once live, you can edit text, publish articles, or update images yourself using an intuitive visual editor. You aren't tied to ongoing developer retainers or custom platforms.</p>
          </div>
          <div>
            <h3 className="font-serif text-lg text-foreground mb-2">3. Phase-by-Phase Iteration</h3>
            <p>A website is an active asset. As your business grows and your budget permits, we continuously build out advanced integrations and custom features (like booking systems or e-commerce) in manageable, affordable steps.</p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-serif text-2xl text-foreground mb-6">The Long-Term Cost: Custom vs. Website Builders</h2>
        <p className="font-condensed font-light text-foreground/80 leading-relaxed mb-8 max-w-2xl">
          While drag-and-drop builders seem cheap upfront, monthly subscriptions, platform fees, and app add-ons compound over time. By owning your code, your ongoing monthly costs drop to virtually zero.
        </p>

        <div className="overflow-x-auto rounded-[20px] border border-border bg-card">
          <table className="w-full text-left border-collapse font-condensed">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="p-6 font-serif text-lg text-foreground">Feature / Cost</th>
                <th className="p-6 font-serif text-lg text-secondary">Squarespace / Wix</th>
                <th className="p-6 font-serif text-lg text-primary">Custom Site (Own Your Code)</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light text-foreground/90">
              <tr className="border-b border-border">
                <td className="p-6 font-medium text-foreground">Monthly Platform Fee</td>
                <td className="p-6">€20 – €40 / month</td>
                <td className="p-6 font-medium text-accent">€0 / month (Hosted free on Vercel)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-6 font-medium text-foreground">3-Year Running Costs</td>
                <td className="p-6">€720 – €1,440+</td>
                <td className="p-6 font-medium text-accent">~€30 (Domain registration only)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-6 font-medium text-foreground">Platform Lock-in</td>
                <td className="p-6">High. Moving means rebuilding from scratch.</td>
                <td className="p-6 font-medium text-accent">None. You own all files & database-free content.</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-6 font-medium text-foreground">Loading Speed & SEO</td>
                <td className="p-6">Average (Heavy platform scripts)</td>
                <td className="p-6 font-medium text-accent">Ultra Fast (Static HTML Next.js framework)</td>
              </tr>
              <tr>
                <td className="p-6 font-medium text-foreground">Design Limits</td>
                <td className="p-6">Restricted to template layouts</td>
                <td className="p-6 font-medium text-accent">100% custom React layouts & elements</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="text-center py-12">
        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
          Have a project in mind?
        </h2>
        <p className="font-condensed font-light text-lg text-foreground/70 mb-6">
          Get in touch for a free consultation.
        </p>
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-8 h-10 font-condensed font-medium"
        >
          <Link href="/contact">Contact</Link>
        </Button>
      </section>
    </div>
  );
}
