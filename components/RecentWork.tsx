'use client';

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useIntl } from "react-intl";

const sites = [
  { id: "cj", image: "/cjsstrengthandfitness.webp", url: "https://www.cjsstrengthfitness.com/" },
  { id: "cc", image: "/ccpiano.webp", url: "https://www.ccpiano.ie" },
  { id: "bella", image: "/bellarosebright.webp", url: "https://www.bellarosebright.com/" },
];

export function RecentWork() {
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });

  return (
    <section id="work" className="py-20 sm:py-24 bg-foreground text-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl sm:text-5xl tracking-tight text-balance">{t("work.title")}</h2>
            <p className="font-sans text-base sm:text-lg text-background/75 leading-relaxed mt-3">{t("work.sub")}</p>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 font-condensed font-semibold text-base text-background hover:text-secondary transition-colors underline-offset-4 hover:underline"
          >
            {t("work.all")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid gap-10 lg:grid-cols-2 lg:grid-rows-2 lg:gap-x-10 lg:gap-y-8">
          {sites.map((site, index) => (
            <li key={site.id} className={index === 0 ? "lg:row-span-2 lg:flex" : undefined}>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col w-full rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
              >
                <div
                  className={`relative w-full overflow-hidden rounded-lg bg-background/5 ring-1 ring-background/10 ${
                    index === 0 ? "aspect-[16/10] lg:aspect-auto lg:flex-1 lg:min-h-[20rem]" : "aspect-[16/9]"
                  }`}
                >
                  <Image
                    src={site.image}
                    alt={t(`portfolio.${site.id}.title`)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="flex items-start justify-between gap-4 pt-4">
                  <div>
                    <p className="font-sans font-bold text-lg sm:text-xl">{t(`portfolio.${site.id}.title`)}</p>
                    <p className="font-sans text-sm text-background/70 mt-0.5">{t(`work.${site.id}.line`)}</p>
                  </div>
                  <ArrowUpRight
                    className="h-5 w-5 mt-1 shrink-0 text-background/60 transition-colors group-hover:text-secondary"
                    aria-hidden="true"
                  />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
