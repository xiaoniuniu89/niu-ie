'use client';

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sparkles, Zap, Hammer, Target, Rocket } from "lucide-react";
import { useIntl } from "react-intl";

const imgImageFloristArrangingFlowers = "/process/florist.webp";
const imgImageMechanicWorkingOnCar = "/process/mechanic.webp";

export default function ProcessPage() {
  const intl = useIntl();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": intl.formatMessage({ id: "process.step1.title" }),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": intl.formatMessage({ id: "process.step1.desc" }),
        },
      },
      {
        "@type": "Question",
        "name": intl.formatMessage({ id: "process.step2.title" }),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": intl.formatMessage({ id: "process.step2.desc" }),
        },
      },
      {
        "@type": "Question",
        "name": intl.formatMessage({ id: "process.step3.title" }),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": intl.formatMessage({ id: "process.step3.desc" }),
        },
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Script id="faq-schema" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(faqSchema)}
      </Script>
      <Header />
      <main className="flex-1 overflow-hidden">
        {/* Intro Section */}
        <section className="container mx-auto px-4 md:px-8 py-14 md:py-20 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-muted text-muted-foreground text-xs font-condensed font-semibold tracking-wider uppercase border border-border mb-4">
            Our Transparent Approach
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-5 tracking-tight">
            {intl.formatMessage({ id: "process.title" })}
          </h1>
          <p className="font-sans text-lg sm:text-xl text-foreground/80 max-w-3xl leading-relaxed">
            {intl.formatMessage({ id: "process.intro" })}
          </p>
        </section>

        {/* The 3 Steps */}
        <section className="py-8 border-y border-border/60 bg-muted/20">
          <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-3 gap-6">
            {/* Step 1: The Vision */}
            <div className="bg-card border border-border rounded-lg shadow-xs p-6 sm:p-8 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-md bg-muted text-primary flex items-center justify-center border border-border">
                  <Sparkles className="w-5 h-5 text-secondary" />
                </div>
                <span className="font-condensed font-bold text-xs text-muted-foreground uppercase tracking-wider">
                  Step 01
                </span>
              </div>
              <h3 className="font-sans font-bold text-xl text-foreground mb-3">
                {intl.formatMessage({ id: "process.step1.title" })}
              </h3>
              <p className="font-sans text-sm sm:text-base text-foreground/80 leading-relaxed">
                {intl.formatMessage({ id: "process.step1.desc" })}
              </p>
            </div>

            {/* Step 2: The Launch */}
            <div className="bg-card border border-border rounded-lg shadow-xs p-6 sm:p-8 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-md bg-muted text-primary flex items-center justify-center border border-border">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <span className="font-condensed font-bold text-xs text-muted-foreground uppercase tracking-wider">
                  Step 02
                </span>
              </div>
              <h3 className="font-sans font-bold text-xl text-foreground mb-3">
                {intl.formatMessage({ id: "process.step2.title" })}
              </h3>
              <p className="font-sans text-sm sm:text-base text-foreground/80 leading-relaxed">
                {intl.formatMessage({ id: "process.step2.desc" })}
              </p>
            </div>

            {/* Step 3: The Growth */}
            <div className="bg-card border border-border rounded-lg shadow-xs p-6 sm:p-8 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-md bg-muted text-primary flex items-center justify-center border border-border">
                  <Hammer className="w-5 h-5 text-foreground/80" />
                </div>
                <span className="font-condensed font-bold text-xs text-muted-foreground uppercase tracking-wider">
                  Step 03
                </span>
              </div>
              <h3 className="font-sans font-bold text-xl text-foreground mb-3">
                {intl.formatMessage({ id: "process.step3.title" })}
              </h3>
              <p className="font-sans text-sm sm:text-base text-foreground/80 leading-relaxed">
                {intl.formatMessage({ id: "process.step3.desc" })}
              </p>
            </div>
          </div>
        </section>

        {/* See It In Action */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 md:px-8 mb-16 text-center max-w-2xl">
            <div className="text-xs font-condensed font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Real Scenarios
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-3 tracking-tight">
              {intl.formatMessage({ id: "process.actionTitle" })}
            </h2>
            <p className="font-sans text-base text-foreground/80">
              {intl.formatMessage({ id: "process.actionSub" })}
            </p>
          </div>

          {/* Case Study 1: Florist */}
          <div className="container mx-auto px-4 md:px-8 mb-20">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="inline-block bg-muted border border-border rounded px-2.5 py-1 text-xs font-condensed font-semibold text-foreground tracking-wider uppercase">
                  {intl.formatMessage({ id: "process.florist.case" })}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-foreground tracking-tight">
                  {intl.formatMessage({ id: "process.florist.q" })}
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-lg p-5 shadow-xs">
                    <div className="flex items-center gap-2.5 mb-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="font-sans font-bold text-base text-foreground">{intl.formatMessage({ id: "process.ultimateGoal" })}</span>
                    </div>
                    <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                      {intl.formatMessage({ id: "process.florist.ideal" })}
                    </p>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-5 shadow-xs">
                    <div className="flex items-center gap-2.5 mb-2">
                      <Rocket className="w-4 h-4 text-secondary" />
                      <span className="font-sans font-bold text-base text-foreground">{intl.formatMessage({ id: "process.fastLaunch" })}</span>
                    </div>
                    <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                      {intl.formatMessage({ id: "process.florist.launch" })}
                    </p>
                  </div>

                  <div className="bg-muted/30 border border-border rounded-lg p-5">
                    <h4 className="font-sans font-bold text-sm text-foreground mb-3">{intl.formatMessage({ id: "process.roadmap" })}</h4>
                    <div className="pl-4 border-l-2 border-primary/40 space-y-1">
                      <p className="font-sans font-semibold text-xs text-primary">{intl.formatMessage({ id: "process.ownership" })}</p>
                      <p className="font-sans text-xs text-foreground/75 leading-relaxed">
                        {intl.formatMessage({ id: "process.ownershipDesc" })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative h-[420px] rounded-lg border border-border overflow-hidden shadow-xs bg-muted">
                <Image 
                  src={imgImageFloristArrangingFlowers} 
                  alt="Florist arranging flowers" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Case Study 2: Auto Shop */}
          <div className="container mx-auto px-4 md:px-8 mb-20">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="relative h-[420px] rounded-lg border border-border overflow-hidden shadow-xs bg-muted order-2 lg:order-1">
                <Image 
                  src={imgImageMechanicWorkingOnCar} 
                  alt="Mechanic working on car" 
                  fill 
                  className="object-cover"
                />
              </div>

              <div className="space-y-6 order-1 lg:order-2">
                <div className="inline-block bg-muted border border-border rounded px-2.5 py-1 text-xs font-condensed font-semibold text-foreground tracking-wider uppercase">
                  {intl.formatMessage({ id: "process.auto.case" })}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-foreground tracking-tight">
                  {intl.formatMessage({ id: "process.auto.q" })}
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-lg p-5 shadow-xs">
                    <div className="flex items-center gap-2.5 mb-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="font-sans font-bold text-base text-foreground">{intl.formatMessage({ id: "process.ultimateGoal" })}</span>
                    </div>
                    <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                      {intl.formatMessage({ id: "process.auto.ideal" })}
                    </p>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-5 shadow-xs">
                    <div className="flex items-center gap-2.5 mb-2">
                      <Rocket className="w-4 h-4 text-secondary" />
                      <span className="font-sans font-bold text-base text-foreground">{intl.formatMessage({ id: "process.fastLaunch" })}</span>
                    </div>
                    <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                      {intl.formatMessage({ id: "process.auto.launch" })}
                    </p>
                  </div>

                  <div className="bg-muted/30 border border-border rounded-lg p-5">
                    <h4 className="font-sans font-bold text-sm text-foreground mb-3">{intl.formatMessage({ id: "process.roadmap" })}</h4>
                    <div className="pl-4 border-l-2 border-primary/40 space-y-1">
                      <p className="font-sans font-semibold text-xs text-primary">{intl.formatMessage({ id: "process.ownership" })}</p>
                      <p className="font-sans text-xs text-foreground/75 leading-relaxed">
                        {intl.formatMessage({ id: "process.ownershipDesc" })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 md:px-8 pb-20">
          <div className="bg-card border border-border rounded-lg p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-xs space-y-5">
             <h2 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight">
               {intl.formatMessage({ id: "process.cta.title" })}
             </h2>
             <p className="font-sans text-base sm:text-lg text-foreground/80 max-w-xl mx-auto leading-relaxed">
               {intl.formatMessage({ id: "process.cta.sub" })}
             </p>
             <div className="pt-2">
               <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-condensed font-semibold text-base px-8 h-12 shadow-xs">
                 <Link href="/contact?mode=sample">{intl.formatMessage({ id: "process.cta.btn" })}</Link>
               </Button>
             </div>
          </div>
        </section>
      </main>
      <Footer showCTA={false} />
    </div>
  );
}