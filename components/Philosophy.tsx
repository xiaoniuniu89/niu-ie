import { Eye, ShieldCheck, Rocket } from "lucide-react";

const philosophyData = [
  {
    title: "Transparent Pricing",
    content: "No hidden fees or complex retainers. We bill straightforwardly in clear project phases, so you stay in complete control of your budget.",
    icon: Eye,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    title: "Complete Ownership",
    content: "You own your website 100%. No monthly website builder locks or mandatory platform retainers—your digital asset is entirely yours.",
    icon: ShieldCheck,
    iconBg: "bg-[#4a7c59]/10",
    iconColor: "text-[#4a7c59]",
  },
  {
    title: "Fast-Track Launch",
    content: "We don't take months to deliver. We focus on getting your core website live and searchable quickly so local customers can start calling and booking right away.",
    icon: Rocket,
    iconBg: "bg-secondary-text/10",
    iconColor: "text-secondary-text",
  },
];

export function Philosophy() {
  return (
    <section id="about" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-20 space-y-4">
          <h2 className="font-serif text-4xl text-primary">Our Core Values</h2>
          <h3 className="font-sans font-bold text-2xl text-secondary">
            Giving local services a powerful digital home.
          </h3>
          <div className="max-w-3xl mx-auto space-y-6 pt-4">
            <p className="font-condensed font-light text-lg text-foreground/80 leading-relaxed">
              Too many great local businesses—from tradespeople and garages to tutors and boutique services—are buried in social media feeds or have no proper online presence at all.
            </p>
            <p className="font-condensed font-light text-lg text-foreground/80 leading-relaxed">
              We exist to solve this. We build clean, high-performing websites that move your business out of the clutter and onto Google, where your local community can easily find, trust, and contact you.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {philosophyData.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center gap-6">
              <div className={`w-20 h-20 rounded-full ${item.iconBg} flex items-center justify-center`}>
                <item.icon className={`w-10 h-10 ${item.iconColor}`} />
              </div>
              <h4 className="font-sans font-bold text-2xl text-foreground">
                {item.title}
              </h4>
              <p className="font-condensed font-light text-foreground/80 leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
