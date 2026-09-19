'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMemo } from "react";
import { useIntl } from "react-intl";

export function FAQ() {
  const intl = useIntl();

  const faqData = useMemo(() => [
    {
      question: intl.formatMessage({ id: "faq.q1" }),
      answer: intl.formatMessage({ id: "faq.a1" }),
    },
    {
      question: intl.formatMessage({ id: "faq.q2" }),
      answer: intl.formatMessage({ id: "faq.a2" }),
    },
    {
      question: intl.formatMessage({ id: "faq.q3" }),
      answer: intl.formatMessage({ id: "faq.a3" }),
    },
    {
      question: intl.formatMessage({ id: "faq.q4" }),
      answer: intl.formatMessage({ id: "faq.a4" }),
    },
  ], [intl]);

  return (
    <section id="faq" className="py-20 bg-background border-b border-border/60">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <div className="text-center mb-14 space-y-3">
          <div className="text-xs font-condensed font-semibold uppercase tracking-wider text-muted-foreground">
            Got Questions?
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight">
            {intl.formatMessage({ id: "faq.title" })}
          </h2>
          <p className="font-sans text-base text-foreground/80 max-w-xl mx-auto">
            {intl.formatMessage({ id: "faq.subtitle" })}
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg px-6 sm:px-8 divide-y divide-border shadow-xs">
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-b-0 py-1"
              >
                <AccordionTrigger className="py-5 text-left font-sans font-semibold text-base sm:text-lg text-foreground hover:text-primary transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 font-sans text-sm sm:text-base text-foreground/80 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}