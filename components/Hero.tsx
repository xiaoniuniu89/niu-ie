'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useIntl } from "react-intl";

const imgImageKanji = "/niu-zi.webp";
const imgImageNiuAgencyBull = "/niu.webp";

export function Hero() {
  const intl = useIntl();

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden bg-background border-b border-border/60">
      <div className="container mx-auto px-4 md:px-8 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col gap-6 z-10">
          <div className="inline-flex items-center gap-2 self-start px-2.5 py-1 rounded bg-muted text-muted-foreground text-xs font-condensed font-semibold tracking-wider uppercase border border-border">
            <span>Co. Westmeath, Ireland</span>
            <span className="text-border" aria-hidden="true">•</span>
            <span>Web Design & Local SEO</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.15] text-foreground tracking-tight">
            {intl.formatMessage({ id: "hero.title1" })}{" "}
            <span className="text-primary italic block sm:inline">
              {intl.formatMessage({ id: "hero.title2" })}
            </span>
          </h1>

          <p className="font-sans text-base sm:text-lg text-foreground/85 leading-relaxed max-w-xl">
            {intl.formatMessage({ id: "hero.subtext" })}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild size="lg" className="rounded-md px-7 h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-condensed font-semibold text-base shadow-xs">
              <Link href="/contact?mode=sample">
                <Sparkles className="mr-2 h-4 w-4 text-secondary" />
                Request Free Website Sample
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-md px-6 h-12 font-condensed font-semibold text-base">
              <Link href="/process">
                {intl.formatMessage({ id: "hero.ourProcess" })}
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="lg:col-span-5 relative w-full max-w-md mx-auto lg:max-w-none">
          <div className="relative rounded-lg border border-border/70 bg-card p-6 shadow-xs">
            <div className="relative">
              <Image 
                src={imgImageNiuAgencyBull} 
                alt={intl.formatMessage({ id: "hero.bullAlt", defaultMessage: "Niu Agency Bull Illustration" })} 
                width={600}
                height={357}
                priority
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-condensed text-muted-foreground">
              <span>Bespoke Web Development</span>
              <span>Fast • Accessible • Local</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
