export function CostComparison() {
  return (
    <section className="container mx-auto px-4 md:px-8 pb-20">
      <h2 className="font-serif text-2xl text-foreground mb-6">The Long-Term Cost: Custom vs. Website Builders</h2>
      <p className="font-condensed font-light text-foreground/80 leading-relaxed mb-8 max-w-2xl">
        While drag-and-drop builders seem cheap upfront, monthly subscriptions, platform fees, and app add-ons compound over time. By owning your code, your ongoing monthly costs drop to virtually zero.
      </p>

      <div className="overflow-x-auto rounded-[20px] border border-border bg-card">
        <table className="w-full text-left border-collapse font-condensed">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="p-6 font-serif text-lg text-foreground">Feature / Cost</th>
              <th className="p-6 font-serif text-lg text-secondary-text">Squarespace / Wix</th>
              <th className="p-6 font-serif text-lg text-primary">Custom Site (Own Your Code)</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light text-foreground/90">
            <tr className="border-b border-border">
              <td className="p-6 font-medium text-foreground">Monthly Platform Fee</td>
              <td className="p-6">€20 – €40 / month</td>
              <td className="p-6 font-medium text-accent">€0 / month (Hosted free on Vercel)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-6 font-medium text-foreground">3-Year Running Costs</td>
              <td className="p-6">€720 – €1,440+</td>
              <td className="p-6 font-medium text-accent">~€30 (Domain registration only)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-6 font-medium text-foreground">Platform Lock-in</td>
              <td className="p-6">High. Moving means rebuilding from scratch.</td>
              <td className="p-6 font-medium text-accent">None. You own all files & database-free content.</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-6 font-medium text-foreground">Loading Speed & SEO</td>
              <td className="p-6">Average (Heavy platform scripts)</td>
              <td className="p-6 font-medium text-accent">Ultra Fast (Static HTML Next.js framework)</td>
            </tr>
            <tr>
              <td className="p-6 font-medium text-foreground">Design Limits</td>
              <td className="p-6">Restricted to template layouts</td>
              <td className="p-6 font-medium text-accent">100% custom React layouts & elements</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
