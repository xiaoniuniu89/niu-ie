"use server";
/* impeccable-disable design-system-font,design-system-color,design-system-font-size,overused-font */

import nodemailer from "nodemailer";
import { contactFormSchema, projectBriefSchema, BRIEF_MAX_TOTAL_BYTES } from "@/lib/contact-schemas";
import type { ContactFormData, ProjectBriefData } from "@/lib/contact-schemas";

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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendProjectBriefEmail(data: ProjectBriefData & { website?: string }) {
  // Dev bypass: skip all validation when DEV_SKIP_VALIDATION=true
  if (process.env.DEV_SKIP_VALIDATION === "true") {
    console.log("DEV_SKIP_VALIDATION: mocking project brief email");
    return { success: true, message: "Brief submitted successfully! (dev mock)" };
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

  const result = projectBriefSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Validation failed. Please check your inputs." };
  }

  const brief = result.data;
  const attachments = brief.attachments ?? [];
  const totalBytes = attachments.reduce((sum, a) => sum + Buffer.byteLength(a.content, "base64"), 0);
  if (totalBytes > BRIEF_MAX_TOTAL_BYTES) {
    return { success: false, message: "Attachments are too large. Please keep them under 15MB in total." };
  }

  const rows: [string, string][] = [
    ["Name", brief.name],
    ["Email", brief.email],
    ["Phone", brief.phone || "-"],
    ["Business", brief.business || "-"],
    ["Sections / pages", brief.pages.join(", ")],
    ["Other", brief.otherPages || "-"],
    ["Design link", brief.designLink || "-"],
    ["Asset links", brief.assetLinks || "-"],
    ["Notes", brief.notes || "-"],
    ["Files", attachments.map((a) => a.name).join(", ") || "-"],
  ];

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: brief.email,
      subject: `New website brief: ${brief.business || brief.name}`,
      text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
      html: `
        <h2>New website brief</h2>
        <table style="font-family: Arial, sans-serif; font-size: 14px; border-collapse: collapse;">
          ${rows
            .map(([label, value]) => `<tr><td style="padding: 6px 12px 6px 0; font-weight: bold; vertical-align: top;">${label}</td><td style="padding: 6px 0; white-space: pre-wrap;">${escapeHtml(value)}</td></tr>`)
            .join("")}
        </table>
      `,
      attachments: attachments.map((a) => ({
        filename: a.name,
        content: Buffer.from(a.content, "base64"),
      })),
    });

    return { success: true, message: "Brief submitted successfully!" };
  } catch (error) {
    console.error("Error sending project brief email:", error);
    return { success: false, message: "Failed to submit. Please try again later." };
  }
}
