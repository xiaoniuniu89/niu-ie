'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useIntl } from "react-intl";

const imgImageKanji = "/niu-zi.webp";
const imgImageNiuAgencyBull = "/niu.webp";

export function Hero() {
  const intl = useIntl();

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-8 z-10">
          <div className="flex flex-col">
            <h1 className="font-serif text-5xl md:text-7xl leading-tight text-primary">
              {intl.formatMessage({ id: "hero.title1" })}{" "}
              <span className="text-secondary-text block">
                {intl.formatMessage({ id: "hero.title2" })}
              </span>
            </h1>
          </div>

          <p className="font-sans text-lg text-foreground/85 leading-relaxed max-w-lg">
            {intl.formatMessage({ id: "hero.subtext" })}
          </p>

          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="rounded-md px-8 h-12 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 font-condensed font-bold text-base">
              <Link href="/contact?mode=sample">
                <Sparkles className="mr-2 h-4 w-4 text-secondary" />
                {intl.formatMessage({ id: "hero.startProject" })}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-md px-8 h-12 font-condensed font-semibold text-base">
              <Link href="/#pricing">
                {intl.formatMessage({ id: "hero.seePricing" })}
              </Link>
            </Button>
          </div>

          <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2 font-sans text-sm text-foreground/80">
            {["hero.trust1", "hero.trust2", "hero.trust3"].map((id) => (
              <li key={id} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                {intl.formatMessage({ id })}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="relative w-full max-w-xl mx-auto lg:mx-0 hidden lg:block">
          <div className="absolute -inset-10 bg-secondary/10 blur-3xl rounded-full opacity-50" />
          <div className="absolute top-[-10%] right-[-5%] w-[80%] opacity-[0.03] -rotate-12 pointer-events-none">
            <Image 
              src={imgImageKanji} 
              alt="" 
              width={400} 
              height={400} 
              className="w-full h-auto" 
            />
          </div>
          <div className="relative">
            <Image 
              src={imgImageNiuAgencyBull} 
              alt={intl.formatMessage({ id: "hero.bullAlt", defaultMessage: "Niu Web bull logo" })} 
              width={600}
              height={357}
              priority
              className="w-full h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
