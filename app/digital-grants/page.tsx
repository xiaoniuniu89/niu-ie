'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileText, Calendar, Heart, ShieldAlert, BadgeCheck, ChevronRight, Compass, Info, MapPin } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useIntl } from "react-intl";

export default function DigitalGrantsPage() {
  const intl = useIntl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Irish Government Digital Grants & Web Funding Guide",
    "url": "https://www.niu.ie/digital-grants",
    "description": "What website grants are available in Ireland in 2026: the LEO Grow Digital Voucher, Digital for Business consultancy, and the closed Trading Online Voucher.",
    "publisher": {
      "@type": "ProfessionalService",
      "name": "Niu Web",
      "url": "https://www.niu.ie"
    }
  };

  const grantOptions = [
    {
      title: "Digital for Business",
      subtitle: "Free Consultancy",
      amount: "Free",
      badge: "Step 1",
      badgeColor: "bg-accent/10 text-accent border border-accent/20",
      description: "Up to three days with an independent digital consultant, paid for by your Local Enterprise Office. They review your business and write a report recommending digital tools.",
      points: [
        "No cost to your business",
        "Required before applying for the Grow Digital Voucher",
        "Covers digital strategy, tools and processes",
        "Ends with a written recommendations report"
      ],
      cta: "Required first step"
    },
    {
      title: "Grow Digital Voucher",
      subtitle: "LEO Grant",
      amount: "Up to €5,000",
      badge: "50% Co-Funded",
      badgeColor: "bg-secondary/10 text-secondary border border-secondary/20",
      description: "Co-funds new software subscriptions and related training or setup, based on your Digital for Business report. It does not fund bespoke (custom-built) website development.",
      points: [
        "Grants from €500 to €5,000 at 50%",
        "Up to 50 employees, trading 6+ months",
        "Covers new software subscriptions (up to 1 year), training and configuration",
        "Custom-built websites are not eligible"
      ],
      cta: "Best for software & tools"
    },
    {
      title: "Trading Online Voucher",
      subtitle: "Closed",
      amount: "No longer available",
      badge: "Closed Dec 2024",
      badgeColor: "bg-muted text-muted-foreground border border-border",
      description: "The old €2,500 website grant closed to new applications on 13 December 2024. Some websites and blogs still advertise it; it is not available.",
      points: [
        "No new applications accepted",
        "Replaced by Digital for Business and the Grow Digital Voucher",
        "Check localenterprise.ie for any new schemes"
      ],
      cta: "Closed"
    }
  ];

  const timelineSteps = [
    {
      step: "01",
      title: "Contact your Local Enterprise Office",
      description: "Ask what your LEO currently offers and whether your project could qualify. Schemes and budgets change, so check before planning around a grant."
    },
    {
      step: "02",
      title: "Complete Digital for Business",
      description: "A funded consultant reviews your business and writes a report. The Grow Digital Voucher can only fund tools recommended in that report."
    },
    {
      step: "03",
      title: "Get quotes for eligible costs",
      description: "Grow Digital covers software subscriptions, training and configuration, not custom website builds. We can tell you which parts of a project are likely to qualify."
    },
    {
      step: "04",
      title: "Wait for the Letter of Offer",
      description: "Your LEO reviews the application. Don't pay a deposit or start work until you have the Letter of Offer, or those costs can't be claimed."
    },
    {
      step: "05",
      title: "Pay, then claim",
      description: "Pay the eligible costs in full, then submit proof of payment to your LEO to claim the 50% grant."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-8 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="max-w-3xl mb-14">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-muted text-muted-foreground text-xs font-condensed font-semibold tracking-wider uppercase border border-border mb-4">
          <BadgeCheck className="h-3.5 w-3.5 text-primary" />
          {intl.formatMessage({ id: "grantsPage.badge" })}
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-5 leading-tight tracking-tight">
          {intl.formatMessage({ id: "grantsPage.title" })}
        </h1>
        <p className="font-sans text-lg sm:text-xl text-foreground/80 leading-relaxed">
          {intl.formatMessage({ id: "grantsPage.intro" })}
        </p>
      </section>

      {/* Warning Callout */}
      <section className="mb-14">
        <div className="p-6 sm:p-7 rounded-lg border border-secondary/30 bg-secondary/5 text-foreground flex flex-col sm:flex-row gap-5 items-start shadow-xs">
          <div className="p-2.5 rounded-md bg-secondary/10 text-secondary-text shrink-0">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-sans text-lg font-bold text-foreground">
              {intl.formatMessage({ id: "grantsPage.warningTitle" })}
            </h3>
            <p className="font-sans text-sm sm:text-base text-foreground/80 leading-relaxed">
              {intl.formatMessage({ id: "grantsPage.warningText1" })}
            </p>
            <p className="font-sans text-sm sm:text-base text-foreground/80 leading-relaxed">
              {intl.formatMessage({ id: "grantsPage.warningText2" })}
            </p>
          </div>
        </div>
      </section>

      {/* Voucher Options Grid */}
      <section className="mb-18">
        <div className="max-w-2xl mb-8 space-y-2">
          <div className="text-xs font-condensed font-semibold uppercase tracking-wider text-secondary-text">
            Support Programs
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-primary tracking-tight">
            {intl.formatMessage({ id: "grantsPage.programsTitle" })}
          </h2>
          <p className="font-sans text-base text-foreground/80">
            {intl.formatMessage({ id: "grantsPage.programsSub" })}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {grantOptions.map((grant) => (
            <Card key={grant.title} className="rounded-xl border border-border bg-card flex flex-col justify-between shadow-xs hover:border-primary/50 transition-all duration-200">
              <CardHeader className="p-6 sm:p-7 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-condensed font-semibold uppercase tracking-wide ${grant.badgeColor}`}>
                    {grant.badge}
                  </span>
                  <span className="font-serif text-lg font-bold text-primary">
                    {grant.amount}
                  </span>
                </div>
                <CardTitle className="font-serif text-2xl text-foreground mb-1">
                  {grant.title}
                </CardTitle>
                <p className="font-sans text-xs font-semibold text-secondary-text">
                  {grant.subtitle}
                </p>
              </CardHeader>
              <CardContent className="p-6 sm:p-7 pt-0 flex-1 flex flex-col justify-between">
                <div className="mb-6">
                  <p className="font-sans text-sm text-foreground/80 leading-relaxed mb-5">
                    {grant.description}
                  </p>
                  <ul className="space-y-2">
                    {grant.points.map((point, index) => (
                      <li key={index} className="flex gap-2.5 items-start text-xs font-sans text-foreground/75 leading-relaxed">
                        <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4 border-t border-border text-xs font-condensed font-semibold text-primary uppercase tracking-wide">
                  {grant.cta}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Step-by-Step Timeline */}
      <section className="mb-18 py-12 border-y border-border/60">
        <div className="max-w-2xl mb-10 space-y-2">
          <div className="text-xs font-condensed font-semibold uppercase tracking-wider text-secondary-text">
            Application Workflow
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-primary tracking-tight">
            {intl.formatMessage({ id: "grantsPage.timelineTitle" })}
          </h2>
          <p className="font-sans text-base text-foreground/80">
            {intl.formatMessage({ id: "grantsPage.timelineSub" })}
          </p>
        </div>

        <div className="relative pl-6 border-l-2 border-border ml-3 space-y-10 max-w-3xl">
          {timelineSteps.map((step) => (
            <div key={step.step} className="relative flex items-start gap-4">
              <div className="bg-card border border-border rounded w-7 h-7 flex items-center justify-center shrink-0 mt-0.5 font-condensed text-xs font-bold text-primary shadow-xs">
                {step.step}
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-lg text-foreground font-bold">
                  {step.title}
                </h3>
                <p className="font-sans text-sm sm:text-base text-foreground/80 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Local Westmeath Travel Support & Maps callout */}
      <section className="mb-14">
        <div className="p-6 sm:p-7 rounded-lg border border-border bg-card flex flex-col md:flex-row gap-6 items-center shadow-xs">
          <div className="w-12 h-12 rounded-md bg-muted text-primary flex items-center justify-center border border-border shrink-0">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-sans text-lg font-bold text-foreground">
              {intl.formatMessage({ id: "grantsPage.westmeathTitle" })}
            </h3>
            <p className="font-sans text-sm sm:text-base text-foreground/80 leading-relaxed">
              {intl.formatMessage({ id: "grantsPage.westmeathDesc" })}
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-condensed pt-1">
              <a
                href="https://www.localenterprise.ie/westmeath"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LEO Westmeath website (opens in new tab)"
                className="text-primary hover:underline font-semibold"
              >
                Official LEO Westmeath Website
              </a>
              <span className="text-border" aria-hidden="true">|</span>
              <span className="text-foreground/75">
                Starting Eircode: <strong>N91PF96</strong>
              </span>
              <span className="text-border" aria-hidden="true">|</span>
              <a 
                href="https://www.google.com/maps/dir/?api=1&origin=N91PF96&destination=N91FH4N" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                Google Maps Car Directions (Mullingar Journey)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Charity Work Support Note */}
      <section className="mb-18">
        <div className="p-6 sm:p-7 rounded-lg border border-border bg-card flex flex-col md:flex-row gap-6 items-start shadow-xs">
          <div className="w-12 h-12 rounded-md bg-muted text-primary flex items-center justify-center border border-border shrink-0">
            <Heart className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-sans text-lg font-bold text-foreground">
              {intl.formatMessage({ id: "grantsPage.charityTitle" })}
            </h3>
            <p className="font-sans text-sm sm:text-base text-foreground/80 leading-relaxed">
              {intl.formatMessage({ id: "grantsPage.charityDesc1" })}
            </p>
            <p className="font-sans text-sm sm:text-base text-foreground/80 leading-relaxed">
              {intl.formatMessage({ id: "grantsPage.charityDesc2" })}
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="text-center py-12 max-w-2xl mx-auto space-y-4">
        <h2 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight">
          {intl.formatMessage({ id: "grantsPage.ctaTitle" })}
        </h2>
        <p className="font-sans text-base sm:text-lg text-foreground/80 leading-relaxed">
          {intl.formatMessage({ id: "grantsPage.ctaSub" })}
        </p>
        <div className="pt-2 flex justify-center">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-8 h-12 font-condensed font-semibold text-base shadow-xs"
          >
            <Link href="/contact?mode=sample">
              Start Your Website
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
      </main>
      <Footer showCTA={false} />
    </div>
  );
}
