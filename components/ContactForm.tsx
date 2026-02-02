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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export function ContactForm() {
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
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-card p-6 md:p-10 rounded-xl shadow-sm border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-sans font-semibold text-foreground">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} className="font-condensed" />
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
                <FormLabel className="font-sans font-semibold text-foreground">Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} className="font-condensed" />
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
                <FormLabel className="font-sans font-semibold text-foreground">Message</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about your project..." 
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
              className={`p-3 rounded-md text-sm font-condensed ${
                submitStatus.success
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full font-condensed font-medium" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
