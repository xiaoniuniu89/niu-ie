import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Globe, PiggyBank, TrendingUp } from "lucide-react";

const expertiseData = [
  {
    title: "Custom Web Design",
    description: "Modern, mobile-friendly websites that build instant trust.",
    content: "We design fast, easy-to-navigate websites tailored to your business. Every page is crafted to look great on smartphones, tablets, and computers.",
    icon: Globe,
    bg: "bg-white",
    iconBg: "bg-[#4a7c59]/10",
    iconColor: "text-[#4a7c59]",
  },
  {
    title: "Zero Monthly Retainers",
    description: "No mandatory monthly platform fees or subscription traps.",
    content: "We build your site on high-speed infrastructure with zero platform subscription fees. You own your website completely and invest your budget where it matters.",
    icon: PiggyBank,
    bg: "bg-primary/5 border-primary/20",
    iconBg: "bg-secondary-text/10",
    iconColor: "text-secondary-text",
  },
  {
    title: "Local Google SEO",
    description: "Get found by local customers when they need your services.",
    content: "We optimize your digital presence so your business appears clearly on Google searches and local maps when nearby customers are ready to book or call.",
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