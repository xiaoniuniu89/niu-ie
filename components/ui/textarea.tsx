import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-1 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-card flex min-h-24 w-full rounded-md border bg-card px-3.5 py-2.5 text-base shadow-xs transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-sans text-foreground leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
