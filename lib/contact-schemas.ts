import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export const sampleRequestSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().optional(),
  company: z.string().optional(),
  siteStructure: z.enum(["single-page", "multi-page"]),
  pages: z.array(z.string()).min(1, { message: "Select at least 1 page." }).max(3, { message: "Maximum 3 target pages allowed." }),
  hasDesign: z.enum(["yes", "no"]),
  designLink: z.string().optional().refine((val) => {
    if (!val || val.trim() === "") return true;
    try {
      const parsed = new URL(val);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }, { message: "Design link must be a valid HTTP or HTTPS URL." }),
  referenceLinks: z.string().optional(),
  selectedKbDesigns: z.array(z.string()).max(3, { message: "Select up to 3 design inspirations." }).optional(),
  industry: z.string().min(1, { message: "Please select an industry." }),
  primaryGoal: z.string().min(1, { message: "Please select a primary goal." }),
  additionalNotes: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type SampleRequestData = z.infer<typeof sampleRequestSchema>;
