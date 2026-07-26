'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Globe, PiggyBank, TrendingUp } from "lucide-react";
import { useIntl } from "react-intl";

export function Expertise() {
  const intl = useIntl();

  const expertiseData = [
    {
      title: intl.formatMessage({ id: "expertise.design.title" }),
      description: intl.formatMessage({ id: "expertise.design.sub" }),
      content: intl.formatMessage({ id: "expertise.design.desc" }),
      icon: Globe,
      bg: "bg-white",
      iconBg: "bg-[#4a7c59]/10",
      iconColor: "text-[#4a7c59]",
    },
    {
      title: intl.formatMessage({ id: "expertise.retainers.title" }),
      description: intl.formatMessage({ id: "expertise.retainers.sub" }),
      content: intl.formatMessage({ id: "expertise.retainers.desc" }),
      icon: PiggyBank,
      bg: "bg-primary/5 border-primary/20",
      iconBg: "bg-secondary-text/10",
      iconColor: "text-secondary-text",
    },
    {
      title: intl.formatMessage({ id: "expertise.seo.title" }),
      description: intl.formatMessage({ id: "expertise.seo.sub" }),
      content: intl.formatMessage({ id: "expertise.seo.desc" }),
      icon: TrendingUp,
      bg: "bg-white",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
  ];

  return (
    <section id="services" className="py-24 bg-foreground/5">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-4xl text-primary">{intl.formatMessage({ id: "expertise.title" })}</h2>
          <p className="font-condensed font-light text-foreground max-w-2xl mx-auto">
            {intl.formatMessage({ id: "expertise.subtitle" })}
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