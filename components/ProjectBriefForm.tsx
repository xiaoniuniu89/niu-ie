"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIntl } from "react-intl";
import { CheckCircle2, Paperclip, X } from "lucide-react";
import { sendProjectBriefEmail } from "@/app/actions/contact";
import {
  projectBriefSchema,
  BRIEF_PAGE_IDS,
  BRIEF_MAX_FILES,
  BRIEF_MAX_TOTAL_BYTES,
  BRIEF_FILE_TYPES,
  type ProjectBriefData,
} from "@/lib/contact-schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const defaultValues: ProjectBriefData = {
  name: "",
  email: "",
  phone: "",
  business: "",
  pages: ["home", "services", "contact"],
  otherPages: "",
  designLink: "",
  assetLinks: "",
  notes: "",
};

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ProjectBriefForm() {
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileWarning, setFileWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Form token: one-time per page load, prevents direct API calls
  const formTokenRef = useRef("");
  const formStartRef = useRef(Date.now());
  useEffect(() => {
    formTokenRef.current = crypto.randomUUID();
  }, []);

  const form = useForm<ProjectBriefData>({
    resolver: zodResolver(projectBriefSchema),
    defaultValues,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    const next = [...files];
    let skipped = false;
    for (const file of picked) {
      const total = next.reduce((sum, f) => sum + f.size, 0) + file.size;
      if (!BRIEF_FILE_TYPES.includes(file.type) || next.length >= BRIEF_MAX_FILES || total > BRIEF_MAX_TOTAL_BYTES) {
        skipped = true;
        continue;
      }
      next.push(file);
    }
    setFiles(next);
    setFileWarning(skipped);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function onSubmit(values: ProjectBriefData) {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const attachments = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          content: await readFileAsBase64(file),
        }))
      );
      const result = await sendProjectBriefEmail({
        ...values,
        attachments,
        website: honeypotRef.current?.value,
        formToken: formTokenRef.current,
        formStartAt: String(formStartRef.current),
      });
      if (result.success) {
        setIsSubmitted(true);
        setFiles([]);
        form.reset(defaultValues);
      } else {
        setSubmitError(result.message);
      }
    } catch (err) {
      console.error("Project brief submission failed", err);
      setSubmitError(t("brief.error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-card p-8 sm:p-10 rounded-lg border border-border shadow-xs text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-primary mx-auto" aria-hidden="true" />
        <h3 className="font-serif text-2xl text-foreground">{t("brief.successTitle")}</h3>
        <p className="font-sans text-base text-foreground/80 leading-relaxed max-w-md mx-auto">
          {t("brief.successText")}
        </p>
      </div>
    );
  }

  const labelClass = "font-sans font-semibold text-sm text-foreground";

  return (
    <div className="w-full max-w-2xl mx-auto bg-card p-6 sm:p-8 rounded-lg border border-border shadow-xs">
      <div className="mb-6">
        <h3 className="font-serif text-2xl text-foreground">{t("brief.title")}</h3>
        <p className="font-sans text-sm text-foreground/80 mt-1">{t("brief.sub")}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <input ref={honeypotRef} type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>{t("contact.nameLabel")} *</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" placeholder={t("contact.namePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage className="font-sans text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>{t("contact.emailLabel")} *</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" placeholder={t("contact.emailPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage className="font-sans text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>{t("brief.phoneLabel")}</FormLabel>
                  <FormControl>
                    <Input type="tel" autoComplete="tel" {...field} />
                  </FormControl>
                  <FormMessage className="font-sans text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="business"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>{t("brief.businessLabel")}</FormLabel>
                  <FormControl>
                    <Input autoComplete="organization" placeholder={t("brief.businessPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage className="font-sans text-xs" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="pages"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>{t("brief.pagesLabel")} *</FormLabel>
                <p className="font-sans text-xs text-foreground/70">{t("brief.pagesHint")}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {BRIEF_PAGE_IDS.map((id) => {
                    const checked = field.value.includes(id);
                    return (
                      <label
                        key={id}
                        className={`flex items-center gap-2 rounded-md border px-3 py-2.5 font-sans text-sm cursor-pointer transition-colors ${
                          checked ? "border-primary bg-primary/[0.06]" : "border-border hover:border-primary/40"
                        }`}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(isChecked) =>
                            field.onChange(isChecked ? [...field.value, id] : field.value.filter((p) => p !== id))
                          }
                        />
                        {t(`brief.page.${id}`)}
                      </label>
                    );
                  })}
                </div>
                <FormMessage className="font-sans text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="otherPages"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>{t("brief.pagesOtherLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("brief.pagesOtherPlaceholder")} {...field} />
                </FormControl>
                <FormMessage className="font-sans text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="designLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>{t("brief.designLabel")}</FormLabel>
                <FormControl>
                  <Input type="url" placeholder={t("brief.designPlaceholder")} {...field} />
                </FormControl>
                <FormMessage className="font-sans text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assetLinks"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>{t("brief.assetsLabel")}</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder={t("brief.assetsPlaceholder")} {...field} />
                </FormControl>
                <FormMessage className="font-sans text-xs" />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <p className={labelClass}>{t("brief.filesLabel")}</p>
            <p className="font-sans text-xs text-foreground/70">{t("brief.filesHint")}</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFileSelect}
              className="hidden"
              id="brief-files"
            />
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Paperclip className="w-4 h-4 mr-2" aria-hidden="true" />
              {t("brief.filesButton")}
            </Button>
            {fileWarning && <p className="font-sans text-xs text-destructive">{t("brief.filesTooBig")}</p>}
            {files.length > 0 && (
              <ul className="space-y-1.5 pt-1">
                {files.map((file, index) => (
                  <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded border border-border px-3 py-1.5 font-sans text-sm">
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={`${t("brief.remove")} ${file.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>{t("brief.notesLabel")}</FormLabel>
                <FormControl>
                  <Textarea rows={4} placeholder={t("brief.notesPlaceholder")} {...field} />
                </FormControl>
                <FormMessage className="font-sans text-xs" />
              </FormItem>
            )}
          />

          {submitError && (
            <p role="alert" className="font-sans text-sm text-destructive">{submitError}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-md font-condensed font-bold text-base bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? t("brief.submitting") : t("brief.submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
