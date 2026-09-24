'use client';

import { Check } from "lucide-react";
import { useIntl } from "react-intl";

const items = ["why.i1", "why.i2", "why.i3", "why.i4", "why.i5", "why.i6"];

export function WhyNiu() {
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });

  return (
    <section id="services" className="py-20 sm:py-24 bg-background border-b border-border/60">
      <div className="container mx-auto px-4 md:px-8 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20 items-start">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl sm:text-5xl text-primary tracking-tight text-balance">
            {t("why.title")}
          </h2>
          <div className="space-y-4 mt-6 font-sans text-base sm:text-lg text-foreground/85 leading-relaxed">
            <p>{t("why.p1")}</p>
            <p>{t("why.p2")}</p>
          </div>
        </div>

        <div className="lg:pt-3">
          <h3 className="font-sans font-bold text-lg text-foreground pb-4 border-b border-border">
            {t("why.listTitle")}
          </h3>
          <ul>
            {items.map((id) => (
              <li key={id} className="flex gap-3 py-4 border-b border-border font-sans text-base text-foreground/90">
                <Check className="h-5 w-5 mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                {t(id)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
