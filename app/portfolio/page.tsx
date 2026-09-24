'use client';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { useIntl } from "react-intl";

const imgCCPiano = "/ccpiano.webp";
const imgCJStrength = "/cjsstrengthandfitness.webp";
const imgBellaRose = "/bellarosebright.webp";

export default function Portfolio() {
  const intl = useIntl();

  const portfolioItems = [
    {
      category: intl.formatMessage({ id: "portfolio.cc.cat" }),
      title: intl.formatMessage({ id: "portfolio.cc.title" }),
      description: intl.formatMessage({ id: "portfolio.cc.desc" }),
      image: imgCCPiano,
      link: "https://www.ccpiano.ie",
    },
    {
      category: intl.formatMessage({ id: "portfolio.cj.cat" }),
      title: intl.formatMessage({ id: "portfolio.cj.title" }),
      description: intl.formatMessage({ id: "portfolio.cj.desc" }),
      image: imgCJStrength,
      link: "https://www.cjsstrengthfitness.com/",
    },
    {
      category: intl.formatMessage({ id: "portfolio.bella.cat" }),
      title: intl.formatMessage({ id: "portfolio.bella.title" }),
      description: intl.formatMessage({ id: "portfolio.bella.desc" }),
      image: imgBellaRose,
      link: "https://www.bellarosebright.com/",
    },
  ];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": intl.formatMessage({ id: "portfolio.title" }),
    "description": intl.formatMessage({ id: "portfolio.intro" }),
    "url": "https://www.niu.ie/portfolio",
    "mainEntity": portfolioItems.map((item) => ({
      "@type": "CreativeWork",
      "name": item.title,
      "description": item.description,
      "url": item.link,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Script id="collection-schema" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(collectionSchema)}
      </Script>
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-secondary/10 text-secondary-text text-xs font-condensed font-semibold tracking-wider uppercase border border-secondary/25 mb-4">
              Selected Client Work
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl text-primary mb-4 tracking-tight">{intl.formatMessage({ id: "portfolio.title" })}</h1>
            <p className="font-sans text-lg sm:text-xl text-foreground/80 max-w-3xl leading-relaxed">
              {intl.formatMessage({ id: "portfolio.intro" })}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {portfolioItems.map((item, index) => (
              <Card key={index} className="group overflow-hidden border border-border rounded-xl bg-card shadow-xs hover:border-primary/50 transition-all duration-200">
                <div className="relative aspect-[16/10] w-full bg-muted border-b border-border overflow-hidden">
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transform-none"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <CardHeader className="p-6 space-y-3">
                  <div className="text-secondary-text font-condensed font-semibold text-xs tracking-wider uppercase">
                    {item.category}
                  </div>
                  <CardTitle className="font-sans font-bold text-xl sm:text-2xl text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="font-sans text-sm sm:text-base text-foreground/80 leading-relaxed min-h-[4rem]">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Button asChild variant="outline" size="sm" className="font-condensed font-semibold text-primary border-primary/30 hover:bg-primary/10">
                    <Link
                      href={item.link}
                      target={item.link.startsWith("http") ? "_blank" : undefined}
                      rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-2"
                    >
                      {intl.formatMessage({ id: "portfolio.visit" })} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-border bg-card text-muted-foreground font-condensed text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
              More client projects in active development
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-10 sm:p-14 text-center max-w-4xl mx-auto mb-12 space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl text-primary tracking-tight">
              {intl.formatMessage({ id: "portfolio.cta.title" })}
            </h2>
            <p className="font-sans text-base sm:text-lg text-foreground/85 max-w-lg mx-auto leading-relaxed">
              {intl.formatMessage({ id: "portfolio.cta.sub" })}
            </p>
            <div className="pt-2">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-condensed font-bold px-8 h-12 shadow-md">
                <Link href="/contact?mode=sample">{intl.formatMessage({ id: "footer.ctaBtn" })}</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer showCTA={false} />
    </div>
  );
}
