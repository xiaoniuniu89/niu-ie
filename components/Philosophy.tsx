import { Eye, Scale, Zap } from "lucide-react";

const philosophyData = [
  {
    title: "Transparency",
    content: "No hidden fees or confusing quotes. We charge by the hour and work iteratively, so you always know exactly what you're paying for and seeing results instantly.",
    icon: Eye,
    iconBg: "bg-[#9d3860]/10",
    iconColor: "text-[#9d3860]",
  },
  {
    title: "Accessibility",
    content: "A professional web presence shouldn't be a luxury. We provide affordable, high-quality solutions to ensure every local business has equal footing online.",
    icon: Scale,
    iconBg: "bg-[#4a7c59]/10",
    iconColor: "text-[#4a7c59]",
  },
  {
    title: "Agility",
    content: "We don&apos;t wait months for perfection. We work backward from your ideal to an MVP that gets your essential services live and searchable in hours.",
    icon: Zap,
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
];

export function Philosophy() {
  return (
    <section id="about" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-20 space-y-4">
          <h2 className="font-serif text-4xl text-primary">Our Core Values</h2>
          <h3 className="font-sans font-bold text-2xl text-secondary">
            Bridging the gap for local services.
          </h3>
          <div className="max-w-3xl mx-auto space-y-6 pt-4">
            <p className="font-condensed font-light text-lg text-foreground/80 leading-relaxed">
              When our founder Daniel moved back to Ireland after living in China, he found it surprisingly hard to find essential local services—mechanics, montessori schools, physios, or even bouncy castle hire. Too often, great businesses are buried in Facebook posts or have no presence at all.
            </p>
            <p className="font-condensed font-light text-lg text-foreground/80 leading-relaxed">
              We exist to fix this. We want to get you out of the clutter and onto a professional platform where your community can find you.
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
