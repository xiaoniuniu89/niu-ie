'use client';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useIntl } from "react-intl";

const imgBellaRose = "/bellarosebright.webp";
const imgCCPiano = "/ccpiano.webp";

export default function Portfolio() {
  const intl = useIntl();

  const portfolioItems = [
    {
      category: intl.formatMessage({ id: "portfolio.bella.cat" }),
      title: intl.formatMessage({ id: "portfolio.bella.title" }),
      description: intl.formatMessage({ id: "portfolio.bella.desc" }),
      image: imgBellaRose,
      link: "https://www.bellarosebright.com/",
    },
    {
      category: intl.formatMessage({ id: "portfolio.cc.cat" }),
      title: intl.formatMessage({ id: "portfolio.cc.title" }),
      description: intl.formatMessage({ id: "portfolio.cc.desc" }),
      image: imgCCPiano,
      link: "https://www.ccpiano.ie",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-8 py-20">
          <div className="mb-16">
            <h1 className="font-serif text-5xl text-primary mb-6">{intl.formatMessage({ id: "portfolio.title" })}</h1>
            <p className="font-condensed font-light text-xl text-foreground/80 max-w-3xl leading-relaxed">
              {intl.formatMessage({ id: "portfolio.intro" })}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-24">
            {portfolioItems.map((item, index) => (
              <Card key={index} className="group overflow-hidden border-border/50 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-[16/10] w-full bg-muted overflow-hidden">
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <CardHeader className="space-y-4">
                  <div className="text-secondary-text font-condensed font-medium text-sm tracking-wider uppercase">
                    {item.category}
                  </div>
                  <CardTitle className="font-sans font-bold text-2xl text-foreground">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="font-condensed font-light text-base text-foreground/80 leading-relaxed min-h-[4.5rem]">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5 p-0 font-condensed font-medium">
                    <Link
                      href={item.link}
                      target={item.link.startsWith("http") ? "_blank" : undefined}
                      rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-2"
                    >
                      {intl.formatMessage({ id: "portfolio.visit" })} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="bg-accent/10 rounded-3xl p-12 text-center max-w-4xl mx-auto mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-primary mb-6">
              {intl.formatMessage({ id: "portfolio.cta.title" })}
            </h2>
            <p className="font-condensed font-light text-lg text-foreground/80 mb-8 max-w-lg mx-auto">
              {intl.formatMessage({ id: "portfolio.cta.sub" })}
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-condensed px-8">
              <Link href="/contact">{intl.formatMessage({ id: "portfolio.cta.btn" })}</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer showCTA={false} />
    </div>
  );
}
