import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "How much does a website cost?",
    answer: "We charge a flat rate of €35 per hour. Our unique approach is to work backward from your &apos;ideal site&apos; to an MVP, breaking work into 1-2 hour iterative chunks. This allows us to get the essentials live quickly—often in just a couple of hours—avoiding huge upfront costs. For local community groups, churches, or charities that truly cannot afford the fee, we are happy to waive it entirely.",
  },
  {
    question: "Who is this for?",
    answer: "While we have the capability to serve everyone from small startups to large enterprises, our core mission is providing an affordable, premium web presence for local Irish businesses. We especially love helping those who currently have no online presence or are stuck with an outdated site that no longer represents them well.",
  },
  {
    question: "How long does it take?",
    answer: "Because we work in short, affordable bursts, we can often get your essential 'Version 1' live and searchable in just a few hours. We involve you directly in the design process to define features, and then build them out iteratively when your budget allows. You get online fast, and improve your site step-by-step without a massive waiting period.",
  },
  {
    question: "Do you offer ongoing support?",
    answer: "Of course. We don't believe in locking you into expensive monthly support packages. Instead, we’re available whenever you need us at our standard hourly rate. We also actively encourage you to take ownership of your site; we'll show you how you can handle many updates yourself, especially by leveraging modern AI tools to manage your content.",
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