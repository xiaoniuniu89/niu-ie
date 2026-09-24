'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIntl } from "react-intl";

export function Founder() {
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });

  return (
    <section id="about" className="py-20 sm:py-24 bg-muted/50 border-b border-border/60">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <h2 className="font-serif text-3xl sm:text-5xl text-foreground tracking-tight text-balance">
          {t("founder.title")}
        </h2>
        <div className="space-y-4 mt-6 font-sans text-base sm:text-lg text-foreground/85 leading-relaxed">
          <p>{t("founder.p1")}</p>
          <p>{t("founder.p2")}</p>
        </div>
        <p className="mt-6 font-serif italic text-xl text-primary">{t("founder.signature")}</p>
        <Button
          asChild
          size="lg"
          className="mt-8 rounded-md px-7 h-12 font-condensed font-bold text-base"
        >
          <Link href="/contact?mode=sample">
            {t("founder.cta")}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
