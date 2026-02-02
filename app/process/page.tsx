import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sparkles, Zap, Hammer, Target, Rocket } from "lucide-react";

// Local images (keeping photography)
const imgImageFloristArrangingFlowers = "/process/florist.webp";
const imgImageMechanicWorkingOnCar = "/process/mechanic.webp";

export const metadata: Metadata = {
  title: "The Niu Process | From Ideal to MVP",
  description: "Our agile 3-step process: The Ideal, The MVP, and The Build. We help local businesses get online fast with high-quality web solutions.",
};

export default function ProcessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 overflow-hidden">
        {/* Intro Section */}
        <section className="container mx-auto px-4 md:px-8 py-16 md:py-24 max-w-5xl">
          <h1 className="font-serif text-5xl md:text-6xl text-primary mb-6">
            The Niu Process
          </h1>
          <p className="font-condensed font-light text-xl md:text-2xl text-foreground max-w-3xl leading-relaxed">
            We don&apos;t sell you a black box. We work with you to distill your &quot;ideal website&quot; into an actionable, affordable MVP (Minimum Viable Product) that gets you online fast. Then, we build the rest piece by piece.
          </p>
        </section>

        {/* The 3 Steps */}
        <section className="relative py-12">
          {/* Gradient Line */}
          <div className="absolute top-[200px] left-0 right-0 h-1 bg-gradient-to-r from-accent/20 via-primary/20 to-secondary/20 w-full hidden md:block" />
          
          <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1: The Ideal */}
            <div className="bg-background border border-foreground/20 rounded-2xl shadow-sm p-8 h-full flex flex-col">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-8 shrink-0">
                 <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-sans font-light text-2xl text-primary mb-4">
                1. The Ideal
              </h3>
              <p className="font-condensed font-light text-foreground/80 leading-relaxed">
                We start by listing everything you want. Online stores, booking systems, customer portals—nothing is off the table. We map out the ultimate version of your digital presence.
              </p>
            </div>

            {/* Step 2: The MVP */}
            <div className="bg-background border border-foreground/20 rounded-2xl shadow-sm p-8 h-full flex flex-col">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-8 shrink-0">
                 <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-sans font-light text-2xl text-primary mb-4">
                2. The MVP
              </h3>
              <p className="font-condensed font-light text-foreground/80 leading-relaxed">
                We strip it back. What is the single most important thing? Usually, it&apos;s just being found. We build a high-quality &quot;business card&quot; site to get you live in hours, not months.
              </p>
            </div>

            {/* Step 3: The Build */}
            <div className="bg-background border border-foreground/20 rounded-2xl shadow-sm p-8 h-full flex flex-col">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-8 shrink-0">
                 <Hammer className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-sans font-light text-2xl text-primary mb-4">
                3. The Build
              </h3>
              <p className="font-condensed font-light text-foreground/80 leading-relaxed">
                Once you&apos;re live, we iterate. We add the booking system next month. The online store the month after. You pay for what you need, when you can afford it.
              </p>
            </div>
          </div>
        </section>

        {/* See It In Action */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-8 mb-16 text-center">
            <h2 className="font-serif text-4xl text-primary mb-4">See It In Action</h2>
            <p className="font-condensed font-light text-xl text-foreground">
              Real examples of how we turn complex requests into immediate value.
            </p>
          </div>

          {/* Case Study 1: Florist */}
          <div className="container mx-auto px-4 md:px-8 mb-24">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-8">
                <div className="inline-block bg-accent/20 rounded-full px-4 py-1">
                  <span className="font-condensed font-bold text-accent text-sm">Case Study: The Local Florist</span>
                </div>
                <h3 className="font-sans font-light text-3xl text-primary">&quot;I want to sell flowers online.&quot;</h3>
                
                <div className="space-y-6">
                  {/* The Ideal Card */}
                  <div className="bg-muted/30 border-l-4 border-secondary rounded-r-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-foreground" />
                      <span className="font-sans font-bold text-lg text-foreground">The Ideal</span>
                    </div>
                    <p className="font-condensed font-light text-foreground/80">
                      A full e-commerce shop with inventory management, delivery zone calculation, and automated email receipts.
                    </p>
                  </div>

                  {/* The MVP Card */}
                  <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Rocket className="w-5 h-5 text-foreground" />
                      <span className="font-sans font-bold text-lg text-foreground">The MVP</span>
                    </div>
                    <p className="font-condensed font-normal text-foreground/80 mb-1">
                      A beautiful gallery & a phone number.
                    </p>
                    <p className="font-condensed font-light text-foreground/80">
                      A simple, elegant way for locals to see your style and call to order immediately. We got them online in 4 hours with a &quot;Call to Order&quot; button.
                    </p>
                  </div>

                  {/* The Roadmap */}
                  <div className="bg-background border border-foreground/20 rounded-xl p-6">
                     <h4 className="font-sans font-bold text-lg text-foreground mb-6">The Roadmap</h4>
                     <div className="space-y-6 border-l-2 border-border ml-2 pl-6 relative">
                        <div className="relative">
                          <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-primary rounded-full ring-4 ring-background"></span>
                          <p className="font-condensed font-medium text-sm text-foreground">Basic site live (Done)</p>
                        </div>
                        <div className="relative">
                          <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-foreground/30 rounded-full ring-4 ring-background"></span>
                          <p className="font-condensed font-medium text-sm text-foreground/70">Add &quot;Order Form&quot; (No payment processing yet)</p>
                        </div>
                        <div className="relative">
                          <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-foreground/30 rounded-full ring-4 ring-background"></span>
                          <p className="font-condensed font-medium text-sm text-foreground/70">Full Stripe integration for payments</p>
                        </div>
                        <div className="relative">
                           <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-accent rounded-full ring-4 ring-background"></span>
                           <p className="font-condensed font-bold text-sm text-accent">Ongoing Support & Training</p>
                           <p className="font-condensed font-light text-xs text-foreground mt-1">
                             We&apos;re here if you need us, but we also provide resources so you can manage your own site.
                           </p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
              
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src={imgImageFloristArrangingFlowers} 
                  alt="Florist arranging flowers" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Case Study 2: Auto Shop */}
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
               {/* Image on Left for Desktop, Top for Mobile */}
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-1">
                <Image 
                  src={imgImageMechanicWorkingOnCar} 
                  alt="Mechanic working on car" 
                  fill 
                  className="object-cover"
                />
              </div>

              <div className="space-y-8 order-1 lg:order-2">
                <div className="inline-block bg-secondary/20 rounded-full px-4 py-1">
                  <span className="font-condensed font-bold text-secondary-foreground text-sm">Case Study: The Auto Shop</span>
                </div>
                <h3 className="font-sans font-light text-3xl text-primary">&quot;I need an online booking system.&quot;</h3>
                
                <div className="space-y-6">
                  {/* The Ideal Card */}
                  <div className="bg-muted/30 border-l-4 border-secondary rounded-r-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-foreground" />
                      <span className="font-sans font-bold text-lg text-foreground">The Ideal</span>
                    </div>
                    <p className="font-condensed font-light text-foreground/80">
                      A real-time calendar where customers select their service, pick a time slot, and syncs with the garage&apos;s internal software.
                    </p>
                  </div>

                  {/* The MVP Card */}
                  <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Rocket className="w-5 h-5 text-foreground" />
                      <span className="font-sans font-bold text-lg text-foreground">The MVP</span>
                    </div>
                    <p className="font-condensed font-normal text-foreground/80 mb-1">
                      Location, hours & a &quot;Request Appointment&quot; form.
                    </p>
                    <p className="font-condensed font-light text-foreground/80">
                      Complex booking systems fail if they aren&apos;t managed. The MVP sends an email to the mechanic to confirm availability manually. Simple. Effective.
                    </p>
                  </div>

                  {/* The Roadmap */}
                  <div className="bg-background border border-foreground/20 rounded-xl p-6">
                     <h4 className="font-sans font-bold text-lg text-foreground mb-6">The Roadmap</h4>
                     <div className="space-y-6 border-l-2 border-border ml-2 pl-6 relative">
                        <div className="relative">
                          <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-primary rounded-full ring-4 ring-background"></span>
                          <p className="font-condensed font-medium text-sm text-foreground">Site live with location map (Done)</p>
                        </div>
                        <div className="relative">
                          <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-foreground/30 rounded-full ring-4 ring-background"></span>
                          <p className="font-condensed font-medium text-sm text-foreground/70">Simple email request form</p>
                        </div>
                        <div className="relative">
                          <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-foreground/30 rounded-full ring-4 ring-background"></span>
                          <p className="font-condensed font-medium text-sm text-foreground/70">Full calendar integration (if volume justifies it)</p>
                        </div>
                        <div className="relative">
                           <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-accent rounded-full ring-4 ring-background"></span>
                           <p className="font-condensed font-bold text-sm text-accent">Ongoing Support & Training</p>
                           <p className="font-condensed font-light text-xs text-foreground mt-1">
                             We&apos;re here if you need us, but we also provide resources so you can manage your own site.
                           </p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 md:px-8 pb-24">
          <div className="bg-secondary/10 rounded-3xl p-12 text-center max-w-4xl mx-auto">
             <h2 className="font-serif text-4xl text-primary mb-6">Have a big idea?</h2>
             <p className="font-condensed font-light text-xl text-foreground mb-8 max-w-2xl mx-auto">
               Let&apos;s chat about your &quot;Ideal&quot; and figure out your &quot;MVP&quot; together. No pressure, just a strategy session.
             </p>
             <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-condensed text-lg px-8 h-12 shadow-lg">
               <Link href="/contact">Contact</Link>
             </Button>
          </div>
        </section>
      </main>
      <Footer showCTA={false} />
    </div>
  );
}