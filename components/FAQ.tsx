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
    {
      question: intl.formatMessage({ id: "faq.q5" }),
      answer: intl.formatMessage({ id: "faq.a5" }),
    },
    {
      question: intl.formatMessage({ id: "faq.q6" }),
      answer: intl.formatMessage({ id: "faq.a6" }),
    },
  ], [intl]);

  return (
    <section id="faq" className="py-20 bg-background border-b border-border/60">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <div className="text-center mb-14 space-y-3">
          <div className="text-xs font-condensed font-semibold uppercase tracking-wider text-secondary-text">
            Got Questions?
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-primary tracking-tight">
            {intl.formatMessage({ id: "faq.title" })}
          </h2>
          <p className="font-sans text-base text-foreground/80 max-w-xl mx-auto">
            {intl.formatMessage({ id: "faq.subtitle" })}
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-3">
          {faqData.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-border/60 rounded-xl overflow-hidden shadow-xs bg-card"
            >
              <AccordionTrigger className="bg-primary/[0.04] text-foreground hover:bg-primary/10 data-[state=open]:bg-primary data-[state=open]:text-primary-foreground px-6 py-4.5 hover:no-underline font-sans font-semibold text-base sm:text-lg transition-all text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 py-5 font-sans text-sm sm:text-base text-foreground/85 leading-relaxed whitespace-pre-line">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}