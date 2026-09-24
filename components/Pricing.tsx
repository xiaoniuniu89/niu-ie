'use client';

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { useIntl } from "react-intl";

const tiers = [
  { id: "setup", features: 5, featured: true, href: "/contact?mode=sample" },
  { id: "hourly", features: 5, featured: false, href: "/contact?mode=inquiry" },
];

export function Pricing() {
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });

  return (
    <section id="pricing" className="py-20 bg-background border-b border-border/60">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mb-14 space-y-3">
          <div className="text-xs font-condensed font-semibold uppercase tracking-wider text-secondary-text">
            {t("pricing.eyebrow")}
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-primary tracking-tight">
            {t("pricing.title")}
          </h2>
          <p className="font-sans text-base sm:text-lg text-foreground/85 leading-relaxed pt-1">
            {t("pricing.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-stretch max-w-4xl">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-xl border p-6 sm:p-8 flex flex-col bg-card ${
                tier.featured ? "border-primary shadow-md ring-1 ring-primary/30" : "border-border shadow-xs"
              }`}
            >
              <h3 className="font-sans font-bold text-xl text-foreground">
                {t(`pricing.${tier.id}.name`)}
              </h3>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-serif text-4xl text-primary">{t(`pricing.${tier.id}.price`)}</span>
                <span className="font-condensed text-sm text-muted-foreground">{t(`pricing.${tier.id}.unit`)}</span>
              </p>
              <p className="mt-3 font-sans text-sm text-foreground/80 leading-relaxed">
                {t(`pricing.${tier.id}.desc`)}
              </p>
              <ul className="mt-6 space-y-3 flex-1">
                {Array.from({ length: tier.features }, (_, i) => (
                  <li key={i} className="flex gap-2.5 font-sans text-sm text-foreground/85">
                    <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" aria-hidden="true" />
                    {t(`pricing.${tier.id}.f${i + 1}`)}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={tier.featured ? "default" : "outline"}
                className="mt-8 w-full h-11 rounded-md font-condensed font-semibold text-base"
              >
                <Link href={tier.href}>{t(`pricing.${tier.id}.cta`)}</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-3xl font-sans text-sm text-foreground/75 leading-relaxed">
          {t("pricing.note")}
        </p>
      </div>
    </section>
  );
}
