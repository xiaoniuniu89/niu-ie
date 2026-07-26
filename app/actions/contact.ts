"use server";
/* impeccable-disable design-system-font,design-system-color,design-system-font-size,overused-font */

import nodemailer from "nodemailer";
import { contactFormSchema, sampleRequestSchema } from "@/lib/contact-schemas";
import type { ContactFormData, SampleRequestData } from "@/lib/contact-schemas";

// ── Form token (one-time per page load) ──
const consumedTokens = new Set<string>();

export async function consumeFormToken(token: string): Promise<boolean> {
  if (consumedTokens.has(token)) return false;
  consumedTokens.add(token);
  return true;
}

// ── Email rate limiter (contact form only, not wizard) ──
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(clientId: string = "global_client"): { allowed: boolean; message?: string } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 3;

  const record = rateLimitMap.get(clientId);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= maxRequests) {
    const minutesLeft = Math.ceil((record.resetTime - now) / (60 * 1000));
    return {
      allowed: false,
      message: `Rate limit reached. Please wait ${minutesLeft} minute(s) before submitting another request.`,
    };
  }

  record.count += 1;
  return { allowed: true };
}

export async function sendEmail(data: ContactFormData & { website?: string }) {
  if (data.website) return { success: false, message: "Spam detected" };

  const rateCheck = checkRateLimit(data.email || "inquiry_client");
  if (!rateCheck.allowed) {
    return { success: false, message: rateCheck.message || "Rate limit reached." };
  }

  const result = contactFormSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
    };
  }

  const { name, email, message } = result.data;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `📩 New Contact Form Inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    html: `
      <h2>New Contact Form Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Message sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send message. Please try again later." };
  }
}

export async function sendSampleRequestEmail(data: SampleRequestData & { website?: string }) {
  // Dev bypass: skip all validation when DEV_SKIP_VALIDATION=true
  if (process.env.DEV_SKIP_VALIDATION === "true") {
    console.log("DEV_SKIP_VALIDATION: mocking sample request email");
    return { success: true, message: "Sample request submitted successfully! (dev mock)" };
  }
  // Honeypot: hidden field filled = bot
  if (data.website) return { success: false, message: "Spam detected" };

  // Form token: one-time per page load
  if (!data.formToken) return { success: false, message: "Session expired. Please refresh the page." };
  const tokenValid = await consumeFormToken(data.formToken);
  if (!tokenValid) return { success: false, message: "Form already submitted. Please refresh the page." };

  // Timestamp: filled too fast = bot
  if (data.formStartAt) {
    const elapsed = Date.now() - parseInt(data.formStartAt);
    if (elapsed < 3000) return { success: false, message: "Spam detected" };
  }

  const result = sampleRequestSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
    };
  }

  const payload = result.data;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    const emailSubject = `🚀 Website Sample Request Lead: ${payload.name} (${payload.company || "Personal/Independent"})`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
          🚀 New Website Sample Request Lead
        </h2>

        <p style="font-size: 14px;">A new website sample request was submitted by <strong>${payload.name}</strong> (&lt;<a href="mailto:${payload.email}">${payload.email}</a>&gt;).</p>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
          Sent automatically from www.niu.ie/contact
        </div>
      </div>
    `;

    // Build email attachments from base64 content (no public URLs)
    const emailAttachments = payload.attachments?.filter(a => a.content).map((a) => ({
      filename: a.name,
      content: Buffer.from(a.content!, "base64"),
      encoding: "base64",
    })) || [];

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: payload.email,
      subject: emailSubject,
      text: `New Website Sample Request Lead from ${payload.name}.\nAttachments attached directly.`,
      html: htmlBody,
      attachments: emailAttachments,
    });

    return {
      success: true,
      message: "Sample request submitted successfully!",
    };
  } catch (error) {
    console.error("Error sending sample request email:", error);
    return { success: false, message: "Failed to submit request. Please try again later." };
  }
}