"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendEmail } from "@/app/actions/contact";
import { useIntl } from "react-intl";
import { useMemo } from "react";

export function ContactForm() {
  const intl = useIntl();
  const formSchema = useMemo(() => z.object({
    name: z.string().min(2, {
      message: intl.formatMessage({ id: "contact.validation.nameMin" }),
    }),
    email: z.string().email({
      message: intl.formatMessage({ id: "contact.validation.email" }),
    }),
    message: z.string().min(10, {
      message: intl.formatMessage({ id: "contact.validation.messageMin" }),
    }),
  }), [intl]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const result = await sendEmail(values);
      setSubmitStatus({
        success: result.success,
        message: result.message,
      });

      if (result.success) {
        form.reset();
      }
    } catch {
      setSubmitStatus({
        success: false,
        message: intl.formatMessage({ id: "contact.error" }),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-card p-6 sm:p-8 rounded-lg border border-border shadow-xs">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-sans font-semibold text-sm text-foreground">
                  {intl.formatMessage({ id: "contact.nameLabel" })} *
                </FormLabel>
                <FormControl>
                  <Input placeholder={intl.formatMessage({ id: "contact.namePlaceholder" })} autoComplete="name" {...field} />
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
                <FormLabel className="font-sans font-semibold text-sm text-foreground">
                  {intl.formatMessage({ id: "contact.emailLabel" })} *
                </FormLabel>
                <FormControl>
                  <Input placeholder={intl.formatMessage({ id: "contact.emailPlaceholder" })} autoComplete="email" {...field} />
                </FormControl>
                <FormMessage className="font-sans text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-sans font-semibold text-sm text-foreground">
                  {intl.formatMessage({ id: "contact.messageLabel" })} *
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={intl.formatMessage({ id: "contact.messagePlaceholder" })} 
                    className="min-h-[130px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="font-sans text-xs" />
              </FormItem>
            )}
          />
          
          {submitStatus && (
            <div
              className={`p-4 rounded-md text-sm font-sans flex items-center justify-between gap-3 border ${
                submitStatus.success
                  ? "bg-green-50 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800"
                  : "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800"
              }`}
            >
              <span className="leading-relaxed">{submitStatus.message}</span>
              <button
                type="button"
                onClick={() => setSubmitStatus(null)}
                className="text-xs font-semibold underline text-current hover:opacity-80 shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto font-condensed font-semibold px-8 h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-xs"
              disabled={isSubmitting}
            >
              {isSubmitting ? intl.formatMessage({ id: "contact.sending" }) : intl.formatMessage({ id: "contact.sendBtn" })}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
