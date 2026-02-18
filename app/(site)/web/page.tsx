import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, PiggyBank, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Development",
  description: "Web development services for local businesses. Accessible, affordable, and built with care.",
};

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Modern, fast, responsive websites built with Next.js and deployed on Vercel. I focus on performance, accessibility, and clean code.",
    color: "#4a7c59",
  },
  {
    icon: PiggyBank,
    title: "Affordable Setup",
    description:
      "Free for charities and community organisations. For small businesses, I keep costs low — starting at €35/hr with an MVP-first approach so you only pay for what you need.",
    color: "hsl(var(--secondary))",
  },
  {
    icon: TrendingUp,
    title: "SEO & Performance",
    description:
      "Every site I build is optimised for search engines from day one. Fast load times, semantic HTML, structured data, and proper meta tags.",
    color: "#9d3860",
  },
];

export default function WebPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-16">
      <section className="max-w-2xl mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
          Web Development
        </h1>
        <p className="font-condensed font-light text-lg text-foreground/80 leading-relaxed mb-4">
          I build websites for local Irish businesses. The approach is simple: start with what you actually need (an MVP), launch fast, and iterate from there. No bloated proposals, no unnecessary features.
        </p>
        <p className="font-condensed font-light text-lg text-foreground/80 leading-relaxed">
          I charge €35/hr, work is free for charities, and there are no retainers — just honest, hourly work. I want to empower you to manage your own site, not create dependency.
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
            <h3 className="font-serif text-lg text-foreground mb-2">1. The Ideal</h3>
            <p>Tell me everything you want your website to do — the full dream. E-commerce, booking systems, member areas — no filter.</p>
          </div>
          <div>
            <h3 className="font-serif text-lg text-foreground mb-2">2. The MVP</h3>
            <p>Together we figure out the smallest version that gets you online and working. A florist might just need a gallery and a phone number. An auto shop might need hours and an email form.</p>
          </div>
          <div>
            <h3 className="font-serif text-lg text-foreground mb-2">3. The Build</h3>
            <p>I build the MVP quickly, deploy it, and hand it over. From there, we can iterate — adding features from your roadmap as your business grows.</p>
          </div>
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
