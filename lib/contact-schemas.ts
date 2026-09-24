import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const optionalUrl = z.string().optional().refine((val) => {
  if (!val || val.trim() === "") return true;
  try {
    const parsed = new URL(val);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}, { message: "Please enter a full link starting with https://" });

export const BRIEF_PAGE_IDS = ["home", "about", "services", "prices", "gallery", "reviews", "faq", "contact"] as const;
export const BRIEF_MAX_FILES = 5;
export const BRIEF_MAX_TOTAL_BYTES = 15 * 1024 * 1024;
export const BRIEF_FILE_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"];

export const projectBriefSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().max(40).optional(),
  business: z.string().max(120).optional(),
  pages: z.array(z.enum(BRIEF_PAGE_IDS)).min(1, { message: "Pick at least one." }),
  otherPages: z.string().max(500).optional(),
  designLink: optionalUrl,
  assetLinks: z.string().max(2000).optional(),
  notes: z.string().max(3000).optional(),
  attachments: z.array(z.object({
    name: z.string().max(200),
    type: z.string().refine((t) => BRIEF_FILE_TYPES.includes(t)),
    size: z.number(),
    content: z.string(),
  })).max(BRIEF_MAX_FILES).optional(),
  formToken: z.string().optional(),
  formStartAt: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ProjectBriefData = z.infer<typeof projectBriefSchema>;
