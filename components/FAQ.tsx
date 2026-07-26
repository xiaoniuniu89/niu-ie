import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "How much does a website cost?",
    answer: "We work in clear, transparent project phases so you always stay in complete control of your budget. By launching your core website first, you avoid paying thousands upfront for complex features before your business actually needs them. For registered local charities and community groups, we also offer pro-bono and sliding-scale support.",
  },
  {
    question: "Who is this for?",
    answer: "Our core mission is providing high-quality, professional websites for local Irish small businesses, service providers, tradespeople, and sole traders. We especially love helping businesses that are currently buried in social media feeds or stuck with an outdated site that no longer attracts customers.",
  },
  {
    question: "How long does it take to get live?",
    answer: "Because we focus on a streamlined launch phase, we can get your essential website built, approved, and live on Google in hours to days, rather than waiting months. You get online fast and can expand your site step-by-step as your business grows.",
  },
  {
    question: "How do website updates work?",
    answer: "You have 100% ownership of your site with zero forced monthly subscriptions. You can easily make text updates yourself anytime, or use simple AI writing tools with our clear guides to draft new content. Whenever you want design changes or new custom features, we are on standby to polish and publish updates for you on a flexible, on-demand basis.",
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