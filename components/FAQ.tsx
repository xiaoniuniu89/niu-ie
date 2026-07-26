import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "How much does a website cost?",
    answer: "We bill transparently by the hour. Our approach is to focus on launching a high-quality initial version of your site quickly and then expanding it iteratively in clear phases. This avoids massive upfront design fees and lets you manage costs alongside business growth. For registered local charities, community groups, and churches that cannot afford standard rates, we offer pro-bono web services and sliding-scale sliding support.",
  },
  {
    question: "Who is this for?",
    answer: "While we have the capability to serve everyone from small startups to large enterprises, our core mission is providing an affordable, premium web presence for local Irish businesses. We especially love helping those who currently have no online presence or are stuck with an outdated site that no longer represents them well.",
  },
  {
    question: "How long does it take?",
    answer: "Because we work in structured, iterative phases, we can get your essential launch version live and searchable very quickly. We involve you directly in scoping features, then build them out step-by-step. You get online fast and improve your site over time without a massive waiting period.",
  },
  {
    question: "Do you offer ongoing support?",
    answer: "Of course. We don't believe in locking you into expensive monthly retainers. Instead, we are available for updates, migrations, and new features on a flexible hourly basis. We also actively encourage you to take ownership of your site; we'll show you how to manage your content yourself using our intuitive editor.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-4xl text-primary">Frequently Asked Questions</h2>
          <p className="font-condensed font-light text-foreground text-center">
            Common questions about our agency services.
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqData.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border-none"
            >
              <AccordionTrigger className="bg-primary text-primary-foreground px-6 py-4 rounded-md hover:no-underline font-sans font-medium text-sm data-[state=open]:rounded-b-none transition-all text-left">
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