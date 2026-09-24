'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useIntl } from "react-intl";

const steps = [
  { id: "setup", label: "pricing.step1", features: 3, href: "/contact?mode=sample", primary: true },
  { id: "hourly", label: "pricing.step2", features: 4, href: "/contact?mode=inquiry", primary: false },
];

export function Pricing() {
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });

  return (
    <section id="pricing" className="py-20 sm:py-24 bg-background border-b border-border/60">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="font-serif text-3xl sm:text-5xl text-primary tracking-tight text-balance">
            {t("pricing.title")}
          </h2>
          <p className="font-sans text-base sm:text-lg text-foreground/85 leading-relaxed mt-4">
            {t("pricing.subtitle")}
          </p>
        </div>

        <ol className="grid md:grid-cols-2 max-w-5xl mx-auto rounded-xl border border-border bg-card overflow-hidden">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className={`relative flex flex-col p-7 sm:p-10 ${
                index > 0 ? "border-t md:border-t-0 md:border-l border-border" : ""
              }`}
            >
              {index > 0 && (
                <span
                  className="absolute left-1/2 -top-4 -translate-x-1/2 md:left-0 md:top-1/2 md:-translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-primary"
                  aria-hidden="true"
                >
                  <ArrowRight className="h-4 w-4 rotate-90 md:rotate-0" />
                </span>
              )}
              <p className="font-condensed font-semibold text-sm text-secondary-text">{t(step.label)}</p>
              <h3 className="font-sans font-bold text-xl text-foreground mt-2">{t(`pricing.${step.id}.name`)}</h3>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-serif text-5xl text-primary tabular-nums">{t(`pricing.${step.id}.price`)}</span>
                <span className="font-condensed text-base text-muted-foreground">{t(`pricing.${step.id}.unit`)}</span>
              </p>
              <p className="mt-3 font-sans text-base text-foreground/80 leading-relaxed">{t(`pricing.${step.id}.desc`)}</p>
              <ul className="mt-6 space-y-3 flex-1">
                {Array.from({ length: step.features }, (_, i) => (
                  <li key={i} className="flex gap-2.5 font-sans text-sm sm:text-base text-foreground/85">
                    <Check className="h-4 w-4 mt-1 text-accent shrink-0" aria-hidden="true" />
                    {t(`pricing.${step.id}.f${i + 1}`)}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={step.primary ? "default" : "outline"}
                className="mt-8 self-start h-11 px-6 rounded-md font-condensed font-semibold text-base"
              >
                <Link href={step.href}>{t(`pricing.${step.id}.cta`)}</Link>
              </Button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
