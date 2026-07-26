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
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-4xl text-primary">{intl.formatMessage({ id: "faq.title" })}</h2>
          <p className="font-condensed font-light text-foreground text-center">
            {intl.formatMessage({ id: "faq.subtitle" })}
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqData.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-border/30 rounded-md"
            >
              <AccordionTrigger className="bg-primary/10 text-primary hover:bg-primary/15 data-[state=open]:bg-primary data-[state=open]:text-primary-foreground px-6 py-4 rounded-md hover:no-underline font-sans font-medium text-sm data-[state=open]:rounded-b-none transition-all text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="bg-foreground/5 px-6 py-6 rounded-b-md font-condensed font-light text-base text-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}