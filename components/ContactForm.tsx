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
    <div className="w-full max-w-4xl mx-auto bg-card p-6 md:p-10 rounded-2xl border shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-sans font-semibold text-foreground">{intl.formatMessage({ id: "contact.nameLabel" })}</FormLabel>
                <FormControl>
                  <Input placeholder={intl.formatMessage({ id: "contact.namePlaceholder" })} autoComplete="name" {...field} className="font-condensed" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-sans font-semibold text-foreground">{intl.formatMessage({ id: "contact.emailLabel" })}</FormLabel>
                <FormControl>
                  <Input placeholder={intl.formatMessage({ id: "contact.emailPlaceholder" })} autoComplete="email" {...field} className="font-condensed" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-sans font-semibold text-foreground">{intl.formatMessage({ id: "contact.messageLabel" })}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={intl.formatMessage({ id: "contact.messagePlaceholder" })} 
                    className="min-h-[120px] font-condensed" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {submitStatus && (
            <div
              className={`p-4 rounded-xl text-sm font-condensed flex items-center justify-between gap-3 ${
                submitStatus.success
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              }`}
            >
              <span className="leading-relaxed">{submitStatus.message}</span>
              <button
                type="button"
                onClick={() => setSubmitStatus(null)}
                className="text-xs font-bold underline text-current hover:opacity-80 shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full md:w-auto md:px-8 font-condensed font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? intl.formatMessage({ id: "contact.sending" }) : intl.formatMessage({ id: "contact.sendBtn" })}
          </Button>
        </form>
      </Form>
    </div>
  );
}
