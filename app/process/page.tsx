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
  title: "The Niu Process | Clear, Fast, Phased Web Design",
  description: "Our 3-step approach: The Vision, The Launch, and The Growth. We help local businesses get online fast with high-quality web solutions.",
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
            We don&apos;t sell you a black box. We work with you to outline your goals, launch a fast, high-performing initial site so local customers can find you right away, and expand additional features whenever your business is ready.
          </p>
        </section>

        {/* The 3 Steps */}
        <section className="relative py-12">
          {/* Gradient Line */}
          <div className="absolute top-[200px] left-0 right-0 h-1 bg-gradient-to-r from-accent/20 via-primary/20 to-secondary/20 w-full hidden md:block" />
          
          <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1: The Vision */}
            <div className="bg-background border border-foreground/20 rounded-2xl shadow-sm p-8 h-full flex flex-col">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-8 shrink-0">
                 <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-sans font-light text-2xl text-primary mb-4">
                1. The Vision
              </h3>
              <p className="font-condensed font-light text-foreground/80 leading-relaxed">
                We map out everything your business might need online—from booking forms to digital shopfronts. We prioritize what matters most so you only spend budget on what drives real customer leads.
              </p>
            </div>

            {/* Step 2: The Launch */}
            <div className="bg-background border border-foreground/20 rounded-2xl shadow-sm p-8 h-full flex flex-col">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-8 shrink-0">
                 <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-sans font-light text-2xl text-primary mb-4">
                2. The Launch
              </h3>
              <p className="font-condensed font-light text-foreground/80 leading-relaxed">
                We build and launch your core website fast. You get a sleek, professional digital home that ranks on Google and makes it effortless for local clients to call, visit, or request quotes.
              </p>
            </div>

            {/* Step 3: The Growth */}
            <div className="bg-background border border-foreground/20 rounded-2xl shadow-sm p-8 h-full flex flex-col">
              <div className="bg-secondary-text/10 w-16 h-16 rounded-full flex items-center justify-center mb-8 shrink-0">
                 <Hammer className="w-8 h-8 text-secondary-text" />
              </div>
              <h3 className="font-sans font-light text-2xl text-primary mb-4">
                3. The Growth
              </h3>
              <p className="font-condensed font-light text-foreground/80 leading-relaxed">
                Once live, we expand step-by-step. Add automated booking or online payments when your business volume justifies it. You stay in control of your budget with 100% site ownership.
              </p>
            </div>
          </div>
        </section>

        {/* See It In Action */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-8 mb-16 text-center">
            <h2 className="font-serif text-4xl text-primary mb-4">See It In Action</h2>
            <p className="font-condensed font-light text-xl text-foreground">
              Real examples of how we turn big client goals into immediate digital results.
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
                  {/* The Ultimate Goal Card */}
                  <div className="bg-secondary-text/5 border border-secondary-text/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-foreground" />
                      <span className="font-sans font-bold text-lg text-foreground">The Ultimate Goal</span>
                    </div>
                    <p className="font-condensed font-light text-foreground/80">
                      A full e-commerce online shop with inventory tracking, delivery zone calculation, and automated email receipts.
                    </p>
                  </div>

                  {/* The Fast Launch Card */}
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Rocket className="w-5 h-5 text-foreground" />
                      <span className="font-sans font-bold text-lg text-foreground">The Fast Launch</span>
                    </div>
                    <p className="font-condensed font-normal text-foreground/80 mb-1">
                      A beautiful bouquet gallery & a prominent phone number.
                    </p>
                    <p className="font-condensed font-light text-foreground/80">
                      A simple, elegant showcase for locals to view floral arrangements and call to order immediately. We got them online quickly with direct &quot;Call to Order&quot; buttons.
                    </p>
                  </div>

                  {/* The Roadmap */}
                  <div className="bg-background border border-foreground/20 rounded-xl p-6">
                     <h4 className="font-sans font-bold text-lg text-foreground mb-6">The Expansion Roadmap</h4>
                     <div className="space-y-6 border-l-2 border-border ml-2 pl-6 relative">
                        <div className="relative">
                          <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-primary rounded-full ring-4 ring-background"></span>
                          <p className="font-condensed font-medium text-sm text-foreground">Core website live (Done)</p>
                        </div>
                        <div className="relative">
                          <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-foreground/30 rounded-full ring-4 ring-background"></span>
                          <p className="font-condensed font-medium text-sm text-foreground/70">Add simple online &quot;Inquiry &amp; Order Form&quot;</p>
                        </div>
                        <div className="relative">
                          <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-foreground/30 rounded-full ring-4 ring-background"></span>
                          <p className="font-condensed font-medium text-sm text-foreground/70">Full Stripe payment integration for instant checkout</p>
                        </div>
                        <div className="relative">
                           <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-accent rounded-full ring-4 ring-background"></span>
                           <p className="font-condensed font-bold text-sm text-accent">100% Ownership &amp; Flexible Support</p>
                           <p className="font-condensed font-light text-xs text-foreground mt-1">
                             You own the site completely with zero monthly fees. Edit content yourself, or reach out anytime for on-demand developer updates.
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
                <div className="inline-block bg-secondary-text/15 rounded-full px-4 py-1">
                  <span className="font-condensed font-bold text-secondary-text text-sm">Case Study: The Auto Shop</span>
                </div>
                <h3 className="font-sans font-light text-3xl text-primary">&quot;I need an online booking system.&quot;</h3>
                
                <div className="space-y-6">
                  {/* The Ultimate Goal Card */}
                  <div className="bg-secondary-text/5 border border-secondary-text/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-foreground" />
                      <span className="font-sans font-bold text-lg text-foreground">The Ultimate Goal</span>
                    </div>
                    <p className="font-condensed font-light text-foreground/80">
                      A real-time calendar where customers select their service, pick a time slot, and sync with garage management software.
                    </p>
                  </div>

                  {/* The Fast Launch Card */}
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Rocket className="w-5 h-5 text-foreground" />
                      <span className="font-sans font-bold text-lg text-foreground">The Fast Launch</span>
                    </div>
                    <p className="font-condensed font-normal text-foreground/80 mb-1">
                      Location, opening hours &amp; a &quot;Request Appointment&quot; form.
                    </p>
                    <p className="font-condensed font-light text-foreground/80">
                      Automated booking tools can be complicated to manage. We launched a clean page with location maps and an instant email request form—getting appointments booked immediately.
                    </p>
                  </div>

                  {/* The Roadmap */}
                  <div className="bg-background border border-foreground/20 rounded-xl p-6">
                     <h4 className="font-sans font-bold text-lg text-foreground mb-6">The Expansion Roadmap</h4>
                     <div className="space-y-6 border-l-2 border-border ml-2 pl-6 relative">
                        <div className="relative">
                          <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-primary rounded-full ring-4 ring-background"></span>
                          <p className="font-condensed font-medium text-sm text-foreground">Site live with Google maps &amp; phone link (Done)</p>
                        </div>
                        <div className="relative">
                          <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-foreground/30 rounded-full ring-4 ring-background"></span>
                          <p className="font-condensed font-medium text-sm text-foreground/70">Add simple appointment request form</p>
                        </div>
                        <div className="relative">
                          <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-foreground/30 rounded-full ring-4 ring-background"></span>
                          <p className="font-condensed font-medium text-sm text-foreground/70">Full calendar integration (when booking volume demands it)</p>
                        </div>
                        <div className="relative">
                           <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-accent rounded-full ring-4 ring-background"></span>
                           <p className="font-condensed font-bold text-sm text-accent">100% Ownership &amp; Flexible Support</p>
                           <p className="font-condensed font-light text-xs text-foreground mt-1">
                             You own the site completely with zero monthly fees. Edit content yourself, or reach out anytime for on-demand developer updates.
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
             <h2 className="font-serif text-4xl text-primary mb-6">Ready to get your business online?</h2>
             <p className="font-condensed font-light text-xl text-foreground mb-8 max-w-2xl mx-auto">
               Let&apos;s chat about your project goals and map out a clear, fast-track launch plan. No pressure, just a friendly strategy consultation.
             </p>
             <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-condensed text-lg px-8 h-12 shadow-lg">
               <Link href="/contact">Contact Us</Link>
             </Button>
          </div>
        </section>
      </main>
      <Footer showCTA={false} />
    </div>
  );
}