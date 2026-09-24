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
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
      cardBg: "bg-card border-border",
    },
    {
      title: intl.formatMessage({ id: "expertise.retainers.title" }),
      description: intl.formatMessage({ id: "expertise.retainers.sub" }),
      content: intl.formatMessage({ id: "expertise.retainers.desc" }),
      icon: PiggyBank,
      iconBg: "bg-secondary/15",
      iconColor: "text-secondary-text",
      cardBg: "bg-primary/[0.04] border-primary/30 shadow-sm",
    },
    {
      title: intl.formatMessage({ id: "expertise.seo.title" }),
      description: intl.formatMessage({ id: "expertise.seo.sub" }),
      content: intl.formatMessage({ id: "expertise.seo.desc" }),
      icon: TrendingUp,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      cardBg: "bg-card border-border",
    },
  ];

  return (
    <section id="services" className="py-20 bg-muted/30 border-b border-border/60">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mb-16 space-y-3">
          <div className="text-xs font-condensed font-semibold uppercase tracking-wider text-secondary-text">
            {intl.formatMessage({ id: "expertise.eyebrow" })}
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-primary tracking-tight">
            {intl.formatMessage({ id: "expertise.title" })}
          </h2>
          <p className="font-sans text-base sm:text-lg text-foreground/85 leading-relaxed pt-1">
            {intl.formatMessage({ id: "expertise.subtitle" })}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {expertiseData.map((item, index) => (
            <Card 
              key={index} 
              className={`border rounded-xl p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-all duration-200 ${item.cardBg}`}
            >
              <div>
                <div className={`w-12 h-12 rounded-lg ${item.iconBg} ${item.iconColor} flex items-center justify-center border border-current/15 mb-5`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-sans font-bold text-xl text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="font-sans text-xs font-semibold text-secondary-text uppercase tracking-wide mb-4">
                  {item.description}
                </p>
                <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                  {item.content}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}