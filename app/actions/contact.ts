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

// ── Global daily upload cap ──
const UPLOAD_DAILY_LIMIT = 6;
const uploadCounter = { count: 0, date: new Date().toDateString() };

function resetCounterIfNewDay() {
  const today = new Date().toDateString();
  if (uploadCounter.date !== today) {
    uploadCounter.count = 0;
    uploadCounter.date = today;
  }
}

export async function checkUploadQuota(): Promise<{ remaining: number; total: number }> {
  resetCounterIfNewDay();
  return { remaining: Math.max(0, UPLOAD_DAILY_LIMIT - uploadCounter.count), total: UPLOAD_DAILY_LIMIT };
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

async function createGitHubIssueIfConfigured(payload: SampleRequestData): Promise<string | null> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "xiaoniuniu89/nii-client-leads";

  if (!token) {
    console.warn("GITHUB_TOKEN environment variable is missing.");
    return null;
  }

  try {
    const issueTitle = `[Lead] ${payload.name} — ${payload.company || payload.industry}`;

    // Clean metadata payload for GitHub Issue (strip raw base64 file strings)
    const cleanPayload = {
      ...payload,
      attachments: payload.attachments?.map((att) => ({
        name: att.name,
        type: att.type,
        size: att.size,
        ...(att.url ? { url: att.url } : {}),
      })),
    };

    const rawJson = JSON.stringify(cleanPayload, null, 2);
    const safeJson = rawJson.length > 60000 ? rawJson.slice(0, 60000) + "\n...[truncated]" : rawJson;
    const issueBody = `\`\`\`json\n${safeJson}\n\`\`\``;

    const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "Niu-Agency-App",
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("GitHub Issue created successfully:", data.html_url);
      return data.html_url;
    } else {
      const errText = await res.text();
      console.error("GitHub issue creation failed status:", res.status, errText);
    }
  } catch (err) {
    console.error("Error creating GitHub Issue:", err);
  }
  return null;
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
    // Create GitHub Issue containing pure raw JSON payload metadata
    const githubIssueUrl = await createGitHubIssueIfConfigured(payload);

    const emailSubject = `🚀 Website Sample Request Lead: ${payload.name} (${payload.company || "Personal/Independent"})`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
          🚀 New Website Sample Request Lead
        </h2>

        <p style="font-size: 14px;">A new website sample request was submitted by <strong>${payload.name}</strong> (&lt;<a href="mailto:${payload.email}">${payload.email}</a>&gt;).</p>

        ${
          githubIssueUrl
            ? `<div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 8px; margin: 20px 0;">
                 <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #166534;">
                   GitHub Lead Issue Created:
                 </p>
                 <a href="${githubIssueUrl}" target="_blank" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px;">
                   Open GitHub Issue #${githubIssueUrl.split("/").pop()}
                 </a>
                 <p style="margin: 8px 0 0 0; font-size: 12px; color: #475569;">${githubIssueUrl}</p>
               </div>`
            : `<div style="background: #fef2f2; border: 1px solid #fecaca; padding: 14px; border-radius: 8px; margin: 20px 0; color: #991b1b; font-size: 13px;">
                 Notice: GITHUB_TOKEN or GITHUB_REPO environment variable was not detected on Vercel.
               </div>`
        }

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
          Sent automatically from www.niu.ie/contact
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: payload.email,
      subject: emailSubject,
      text: `New Website Sample Request Lead from ${payload.name}.\nGitHub Issue URL: ${githubIssueUrl || "GitHub integration not configured"}`,
      html: htmlBody,
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