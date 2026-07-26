"use server";

import nodemailer from "nodemailer";
import { contactFormSchema, sampleRequestSchema } from "@/lib/contact-schemas";
import type { ContactFormData, SampleRequestData } from "@/lib/contact-schemas";
import crypto from "crypto";

// In-memory rate limiter (Max 3 submissions per 15 minutes per IP session)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

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

function sanitizeUrlString(input?: string): string {
  if (!input) return "";
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      try {
        const url = new URL(line);
        if (url.protocol === "http:" || url.protocol === "https:") {
          return url.toString();
        }
      } catch {
        // Safe string fallback
      }
      return line.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    })
    .join("<br>");
}

function validateFileMagicBytes(buffer: Buffer, fileType: string): boolean {
  if (buffer.length < 4) return false;
  const hex = buffer.toString("hex", 0, 4).toUpperCase();
  
  if (fileType.includes("pdf")) {
    return hex.startsWith("25504446"); // %PDF
  }
  if (fileType.includes("png")) {
    return hex.startsWith("89504E47"); // PNG
  }
  if (fileType.includes("jpg") || fileType.includes("jpeg")) {
    return hex.startsWith("FFD8FF"); // JPEG
  }
  if (fileType.includes("webp")) {
    return buffer.toString("utf8", 8, 12) === "WEBP";
  }
  return false;
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
    const sanitizedDesignLink = sanitizeUrlString(payload.designLink);
    const sanitizedReferenceLinks = sanitizeUrlString(payload.referenceLinks);
    const sanitizedAssetLinks = sanitizeUrlString(payload.businessAssetLinks);

    const emailSubject = `🚀 Website Sample Request: ${payload.name} (${payload.company || "Personal/Independent"})`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
          🚀 New 3-Page Website Sample Request
        </h2>

        <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">1. Client & Contact Info</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Name:</td><td>${payload.name}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td><a href="mailto:${payload.email}">${payload.email}</a></td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${payload.phone || "Not provided"}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Company/Brand:</td><td>${payload.company || "Not provided"}</td></tr>
        </table>

        <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">2. Target Pages Scope</h3>
        <p><strong>Site Structure:</strong> ${payload.siteStructure === "single-page" ? "Single-Page (1-Page Scroll)" : "Multi-Page Website (Up to 3 Pages)"}</p>
        <p><strong>Selected Target Pages (${payload.pages.length} / 3):</strong> ${payload.pages.join(", ")}</p>

        <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">3. Design Preferences</h3>
        <p><strong>Has Design / Reference:</strong> ${payload.hasDesign.toUpperCase()}</p>
        ${
          payload.hasDesign === "yes"
            ? `<p><strong>Design Link:</strong> ${
                sanitizedDesignLink
                  ? `<a href="${sanitizedDesignLink}" target="_blank">${sanitizedDesignLink}</a>`
                  : "None provided"
              }</p>
               <p><strong>Reference Links:</strong> ${sanitizedReferenceLinks || "None provided"}</p>`
            : `<p><strong>Selected KB Visual Vibes:</strong> ${payload.selectedKbDesigns?.length ? payload.selectedKbDesigns.join(", ") : "None selected"}</p>`
        }

        <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">4. Business Context & Assets</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 160px;">Industry:</td><td>${payload.industry}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Primary Goal:</td><td>${payload.primaryGoal}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Resource / Asset Links:</td><td>${sanitizedAssetLinks || "None provided"}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Direct Email Attachments:</td><td style="color: #0284c7; font-weight: bold;">${payload.attachments?.length ? `${payload.attachments.length} file(s) attached below` : "None attached"}</td></tr>
        </table>

        ${
          payload.additionalNotes
            ? `<h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">5. Additional Notes</h3>
               <p style="white-space: pre-wrap; background: #f8fafc; padding: 12px; border-radius: 6px; font-size: 14px;">${payload.additionalNotes}</p>`
            : ""
        }

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
          Sent automatically from www.niu.ie/contact
        </div>
      </div>
    `;

    const mailAttachments = [];
    if (payload.attachments && payload.attachments.length > 0) {
      for (const att of payload.attachments) {
        const base64Data = att.content.includes(";base64,")
          ? att.content.split(";base64,")[1]
          : att.content;
        const fileBuffer = Buffer.from(base64Data, "base64");

        const isValidBinary = validateFileMagicBytes(fileBuffer, att.type);
        if (!isValidBinary) {
          return {
            success: false,
            message: `Security validation failed: File "${att.name}" does not match valid PDF or image binary signatures. Please attach genuine PDF, PNG, or JPG files.`,
          };
        }

        mailAttachments.push({
          filename: att.name.replace(/[^a-zA-Z0-9_.-]/g, "_"),
          content: fileBuffer,
          contentType: att.type,
        });
      }
    }

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: payload.email,
      subject: emailSubject,
      text: JSON.stringify(payload, null, 2),
      html: htmlBody,
      attachments: mailAttachments,
    });

    return { success: true, message: "Sample request submitted successfully!" };
  } catch (error) {
    console.error("Error sending sample request email:", error);
    return { success: false, message: "Failed to submit request. Please try again later." };
  }
}