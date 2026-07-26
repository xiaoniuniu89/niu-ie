"use server";

import nodemailer from "nodemailer";
import { headers } from "next/headers";
import { contactFormSchema, sampleRequestSchema } from "@/lib/contact-schemas";
import type { ContactFormData, SampleRequestData } from "@/lib/contact-schemas";

// In-memory rate limiter (Max 3 submissions per 15 minutes per email)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// IP-based rate limiter for wizard (Max 1 request per IP, 30-day window)
const wizardIPMap = new Map<string, { count: number; resetTime: number }>();

async function getClientIP(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headersList.get("x-real-ip") || "unknown";
}

function checkRateLimit(clientId: string = "global_client"): { allowed: boolean; message?: string } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
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

async function checkWizardRateLimitByIP(): Promise<{ allowed: boolean; message?: string }> {
  const ip = await getClientIP();
  const now = Date.now();
  const windowMs = 30 * 24 * 60 * 60 * 1000; // 30 days
  const maxRequests = 1;

  const record = wizardIPMap.get(ip);
  if (!record || now > record.resetTime) {
    wizardIPMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      message: "You've already submitted a sample website request. Please use the general inquiry form for further questions.",
    };
  }

  record.count += 1;
  return { allowed: true };
}

export async function checkWizardAccess(): Promise<{ allowed: boolean }> {
  const result = await checkWizardRateLimitByIP();
  return { allowed: result.allowed };
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
  if (data.website) return { success: false, message: "Spam detected" };

  // IP-based rate limit: max 1 wizard request per IP
  const ipRateCheck = await checkWizardRateLimitByIP();
  if (!ipRateCheck.allowed) {
    return { success: false, message: ipRateCheck.message || "Rate limit reached." };
  }

  const rateCheck = checkRateLimit(data.email || "sample_client");
  if (!rateCheck.allowed) {
    return { success: false, message: rateCheck.message || "Rate limit reached." };
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