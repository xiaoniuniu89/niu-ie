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
        <section className="container mx-auto px-4 md:px-8 py-16 md:py-24 max-w-5xl">
          <h1 className="font-serif text-5xl md:text-6xl text-primary mb-6">
            {intl.formatMessage({ id: "process.title" })}
          </h1>
          <p className="font-condensed font-light text-xl md:text-2xl text-foreground max-w-3xl leading-relaxed">
            {intl.formatMessage({ id: "process.intro" })}
          </p>
        </section>

        {/* The 3 Steps */}
        <section className="relative py-12">
          {/* Gradient Line */}
          <div className="absolute top-1/3 left-0 right-0 h-1 bg-gradient-to-r from-accent/20 via-primary/20 to-secondary/20 w-full hidden md:block" />
          
          <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1: The Vision */}
            <div className="bg-background border border-foreground/20 rounded-2xl shadow-sm p-8 h-full flex flex-col">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-8 shrink-0">
                 <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-sans font-light text-2xl text-primary mb-4">
                {intl.formatMessage({ id: "process.step1.title" })}
              </h3>
              <p className="font-condensed font-light text-foreground/80 leading-relaxed">
                {intl.formatMessage({ id: "process.step1.desc" })}
              </p>
            </div>

            {/* Step 2: The Launch */}
            <div className="bg-background border border-foreground/20 rounded-2xl shadow-sm p-8 h-full flex flex-col">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-8 shrink-0">
                 <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-sans font-light text-2xl text-primary mb-4">
                {intl.formatMessage({ id: "process.step2.title" })}
              </h3>
              <p className="font-condensed font-light text-foreground/80 leading-relaxed">
                {intl.formatMessage({ id: "process.step2.desc" })}
              </p>
            </div>

            {/* Step 3: The Growth */}
            <div className="bg-background border border-foreground/20 rounded-2xl shadow-sm p-8 h-full flex flex-col">
              <div className="bg-secondary-text/10 w-16 h-16 rounded-full flex items-center justify-center mb-8 shrink-0">
                 <Hammer className="w-8 h-8 text-secondary-text" />
              </div>
              <h3 className="font-sans font-light text-2xl text-primary mb-4">
                {intl.formatMessage({ id: "process.step3.title" })}
              </h3>
              <p className="font-condensed font-light text-foreground/80 leading-relaxed">
                {intl.formatMessage({ id: "process.step3.desc" })}
              </p>
            </div>
          </div>
        </section>

        {/* See It In Action */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-8 mb-16 text-center">
            <h2 className="font-serif text-4xl text-primary mb-4">{intl.formatMessage({ id: "process.actionTitle" })}</h2>
            <p className="font-condensed font-light text-xl text-foreground">
              {intl.formatMessage({ id: "process.actionSub" })}
            </p>
          </div>

          {/* Case Study 1: Florist */}
          <div className="container mx-auto px-4 md:px-8 mb-24">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-8">
                <div className="inline-block bg-accent/20 rounded-full px-4 py-1">
                  <span className="font-condensed font-bold text-accent text-sm">{intl.formatMessage({ id: "process.florist.case" })}</span>
                </div>
                <h3 className="font-sans font-light text-3xl text-primary">{intl.formatMessage({ id: "process.florist.q" })}</h3>
                
                <div className="space-y-6">
                  <div className="bg-secondary-text/5 border border-secondary-text/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-foreground" />
                      <span className="font-sans font-bold text-lg text-foreground">{intl.formatMessage({ id: "process.ultimateGoal" })}</span>
                    </div>
                    <p className="font-condensed font-light text-foreground/80">
                      {intl.formatMessage({ id: "process.florist.ideal" })}
                    </p>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Rocket className="w-5 h-5 text-foreground" />
                      <span className="font-sans font-bold text-lg text-foreground">{intl.formatMessage({ id: "process.fastLaunch" })}</span>
                    </div>
                    <p className="font-condensed font-light text-foreground/80">
                      {intl.formatMessage({ id: "process.florist.launch" })}
                    </p>
                  </div>

                  <div className="bg-background border border-foreground/20 rounded-xl p-6">
                     <h4 className="font-sans font-bold text-lg text-foreground mb-6">{intl.formatMessage({ id: "process.roadmap" })}</h4>
                     <div className="space-y-6 ml-2 pl-6 relative">
                        <div className="relative">
                           <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-accent rounded-full ring-4 ring-background"></span>
                           <p className="font-condensed font-bold text-sm text-accent">{intl.formatMessage({ id: "process.ownership" })}</p>
                           <p className="font-condensed font-light text-xs text-foreground mt-1">
                             {intl.formatMessage({ id: "process.ownershipDesc" })}
                           </p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
              
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
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
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-1">
                <Image 
                  src={imgImageMechanicWorkingOnCar} 
                  alt="Mechanic working on car" 
                  fill 
                  className="object-cover"
                />
              </div>

              <div className="space-y-8 order-1 lg:order-2">
                <div className="inline-block bg-secondary-text/15 rounded-full px-4 py-1">
                  <span className="font-condensed font-bold text-secondary-text text-sm">{intl.formatMessage({ id: "process.auto.case" })}</span>
                </div>
                <h3 className="font-sans font-light text-3xl text-primary">{intl.formatMessage({ id: "process.auto.q" })}</h3>
                
                <div className="space-y-6">
                  <div className="bg-secondary-text/5 border border-secondary-text/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-foreground" />
                      <span className="font-sans font-bold text-lg text-foreground">{intl.formatMessage({ id: "process.ultimateGoal" })}</span>
                    </div>
                    <p className="font-condensed font-light text-foreground/80">
                      {intl.formatMessage({ id: "process.auto.ideal" })}
                    </p>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Rocket className="w-5 h-5 text-foreground" />
                      <span className="font-sans font-bold text-lg text-foreground">{intl.formatMessage({ id: "process.fastLaunch" })}</span>
                    </div>
                    <p className="font-condensed font-light text-foreground/80">
                      {intl.formatMessage({ id: "process.auto.launch" })}
                    </p>
                  </div>

                  <div className="bg-background border border-foreground/20 rounded-xl p-6">
                     <h4 className="font-sans font-bold text-lg text-foreground mb-6">{intl.formatMessage({ id: "process.roadmap" })}</h4>
                     <div className="space-y-6 ml-2 pl-6 relative">
                        <div className="relative">
                           <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-accent rounded-full ring-4 ring-background"></span>
                           <p className="font-condensed font-bold text-sm text-accent">{intl.formatMessage({ id: "process.ownership" })}</p>
                           <p className="font-condensed font-light text-xs text-foreground mt-1">
                             {intl.formatMessage({ id: "process.ownershipDesc" })}
                           </p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 md:px-8 pb-24">
          <div className="bg-secondary/10 rounded-3xl p-12 text-center max-w-4xl mx-auto">
             <h2 className="font-serif text-4xl text-primary mb-6">{intl.formatMessage({ id: "process.cta.title" })}</h2>
             <p className="font-condensed font-light text-xl text-foreground mb-8 max-w-2xl mx-auto">
               {intl.formatMessage({ id: "process.cta.sub" })}
             </p>
             <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-condensed text-lg px-8 h-12 shadow-lg">
               <Link href="/contact?mode=sample">{intl.formatMessage({ id: "process.cta.btn" })}</Link>
             </Button>
          </div>
        </section>
      </main>
      <Footer showCTA={false} />
    </div>
  );
}