import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Globe, PiggyBank, TrendingUp } from "lucide-react";

const expertiseData = [
  {
    title: "Web Development",
    description: "Modern, responsive websites.",
    content: "We build fast, secure, and scalable websites that look great on any device. Perfect for local businesses needing a professional online home.",
    icon: Globe,
    bg: "bg-white",
    iconBg: "bg-[#4a7c59]/10",
    iconColor: "text-[#4a7c59]",
  },
  {
    title: "Flexible Development",
    description: "We focus on efficient hosting and scaling.",
    content: "We use modern, efficient cloud platforms (like Vercel) to host your site at virtually zero ongoing platform cost, allowing you to invest your budget into active growth rather than high monthly platform overheads.",
    icon: PiggyBank,
    bg: "bg-primary/5 border-primary/20",
    iconBg: "bg-secondary-text/10",
    iconColor: "text-secondary-text",
  },
  {
    title: "Search Engine Optimization",
    description: "Get found by local customers on Google.",
    content: "We optimize your web presence to ensure you're visible when it matters most. Helping your business show up when local customers are searching for your services.",
    icon: TrendingUp,
    bg: "bg-white",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
];

export function Expertise() {
  return (
    <section id="services" className="py-24 bg-foreground/5">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-4xl text-primary">Our Expertise</h2>
          <p className="font-condensed font-light text-foreground max-w-2xl mx-auto">
            Comprehensive digital solutions tailored for small and medium-sized businesses.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {expertiseData.map((item, index) => (
            <Card 
              key={index} 
              className={`rounded-[25px] overflow-hidden shadow-sm border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30 ${item.bg}`}
            >
              <CardHeader className="p-6">
                <div className={`w-12 h-12 rounded-lg ${item.iconBg} flex items-center justify-center mb-6`}>
                  <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                <CardTitle className="font-sans font-semibold text-2xl text-foreground mb-2">
                  {item.title}
                </CardTitle>
                <CardDescription className="font-condensed font-light text-sm text-foreground leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-12">
                <p className="font-condensed font-light text-foreground/80 leading-relaxed">
                  {item.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}