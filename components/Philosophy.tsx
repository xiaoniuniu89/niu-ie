'use client';

import { Eye, ShieldCheck, Rocket } from "lucide-react";
import { useIntl } from "react-intl";

export function Philosophy() {
  const intl = useIntl();

  const philosophyData = [
    {
      title: intl.formatMessage({ id: "values.pricing.title" }),
      content: intl.formatMessage({ id: "values.pricing.desc" }),
      icon: Eye,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: intl.formatMessage({ id: "values.ownership.title" }),
      content: intl.formatMessage({ id: "values.ownership.desc" }),
      icon: ShieldCheck,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      title: intl.formatMessage({ id: "values.launch.title" }),
      content: intl.formatMessage({ id: "values.launch.desc" }),
      icon: Rocket,
      iconBg: "bg-secondary-text/10",
      iconColor: "text-secondary-text",
    },
  ];

  return (
    <section id="about" className="py-20 bg-background border-b border-border/60">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mb-16 space-y-3">
          <div className="text-xs font-condensed font-semibold uppercase tracking-wider text-muted-foreground">
            Our Guiding Principles
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight">
            {intl.formatMessage({ id: "values.title" })}
          </h2>
          <p className="font-sans text-lg text-foreground/85 leading-relaxed pt-1">
            {intl.formatMessage({ id: "values.subtitle" })}
          </p>
          <div className="space-y-4 pt-2">
            <p className="font-sans text-base text-foreground/80 leading-relaxed">
              {intl.formatMessage({ id: "values.p1" })}
            </p>
            <p className="font-sans text-base text-foreground/80 leading-relaxed">
              {intl.formatMessage({ id: "values.p2" })}
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {philosophyData.map((item, index) => (
            <div 
              key={index} 
              className="bg-card border border-border rounded-lg p-6 sm:p-8 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-md bg-muted text-primary flex items-center justify-center border border-border">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-condensed font-bold text-xs text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="font-sans font-bold text-xl text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
