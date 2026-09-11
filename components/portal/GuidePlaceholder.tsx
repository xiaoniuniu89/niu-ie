import React from "react";
import { Camera, Sparkles } from "lucide-react";

interface GuideScreenshotPlaceholderProps {
  stepNumber?: number | string;
  title: string;
  caption: string;
  elements?: { label: string; value: string }[];
}

export function GuideScreenshotPlaceholder({
  stepNumber,
  title,
  caption,
  elements,
}: GuideScreenshotPlaceholderProps) {
  return (
    <div className="my-6 rounded-xl border border-border/80 bg-muted/30 overflow-hidden shadow-sm">
      {/* Browser mockup header */}
      <div className="px-4 py-2 bg-muted/60 border-b border-border/60 flex items-center justify-between text-xs text-muted-foreground font-mono">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="ml-2 text-[11px] truncate">{title}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-primary">
          <Camera className="w-3.5 h-3.5" />
          <span>Visual Walkthrough Mock</span>
        </div>
      </div>

      {/* Mock Graphic Content */}
      <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-4 bg-background/50">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-4 ring-primary/5">
          <Sparkles className="w-6 h-6" />
        </div>

        <div className="space-y-1 max-w-md">
          {stepNumber && (
            <span className="text-xs font-condensed uppercase tracking-wider text-primary font-bold">
              Step {stepNumber}
            </span>
          )}
          <h4 className="font-serif font-bold text-base text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{caption}</p>
        </div>

        {elements && elements.length > 0 && (
          <div className="w-full max-w-lg mt-2 p-3 rounded-lg border border-border bg-card text-left font-mono text-xs space-y-2">
            {elements.map((el, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-border/40 last:border-0 last:pb-0">
                <span className="text-muted-foreground font-sans font-medium">{el.label}:</span>
                <span className="text-primary font-bold break-all">{el.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Caption footer */}
      <div className="px-4 py-2 bg-muted/20 border-t border-border/40 text-center">
        <span className="text-[11px] text-muted-foreground">
          📸 Screenshot placeholder — will be updated with live interface snapshots.
        </span>
      </div>
    </div>
  );
}
