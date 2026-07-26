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
      iconBg: "bg-[#4a7c59]/10",
      iconColor: "text-[#4a7c59]",
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
    <section id="about" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-20 space-y-4">
          <h2 className="font-serif text-4xl text-primary">{intl.formatMessage({ id: "values.title" })}</h2>
          <h3 className="font-sans font-bold text-2xl text-secondary">
            {intl.formatMessage({ id: "values.subtitle" })}
          </h3>
          <div className="max-w-3xl mx-auto space-y-6 pt-4">
            <p className="font-condensed font-light text-lg text-foreground/80 leading-relaxed">
              {intl.formatMessage({ id: "values.p1" })}
            </p>
            <p className="font-condensed font-light text-lg text-foreground/80 leading-relaxed">
              {intl.formatMessage({ id: "values.p2" })}
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
