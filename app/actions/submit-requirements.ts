"use server";

import nodemailer from "nodemailer";
import { auth, clerkClient } from "@clerk/nextjs/server";
import type { ComprehensiveRequirements } from "@/lib/portal-types";

export async function submitRequirementsAction(data: ComprehensiveRequirements) {
  const { userId } = await auth();

  // Persist directly to Clerk user profile metadata (Zero-Database)
  if (userId) {
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          hasCompletedRequirements: true,
          businessName: data.businessName,
          completedAt: new Date().toISOString(),
          domainName: data.domainName,
          primaryConversionGoal: data.primaryConversionGoal,
        },
      });
    } catch (err) {
      console.error("Failed to update Clerk user metadata:", err);
    }
  }

  // Dev bypass for email sending
  if (process.env.DEV_SKIP_VALIDATION === "true") {
    console.log("[DEV_SKIP_VALIDATION] Mocked submitRequirementsAction submission:", data.businessName);
    return {
      success: true,
      message: "Requirements successfully captured and saved to your profile (Dev Mock mode).",
    };
  }

  // Basic validation
  if (!data.businessName || !data.contactEmail) {
    return {
      success: false,
      message: "Please provide at least your business name and contact email.",
    };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const emailSubject = `🚀 [Client Brief] ${data.businessName} — Complete Product Requirements & V1 Scope`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #2d3748; line-height: 1.6;">
      <div style="background-color: #3871c1; color: #ffffff; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 22px;">New Client Onboarding & Product Discovery Dossier</h1>
        <p style="margin: 6px 0 0 0; opacity: 0.9;">Business: <strong>${data.businessName}</strong> | Submitted via Niu.ie Portal</p>
      </div>

      <div style="border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px; background: #ffffff;">
        <!-- Section 1 -->
        <h2 style="color: #3871c1; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">
          1. Business & Contact Information
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr><td style="padding: 6px 0; width: 180px; font-weight: bold;">Business Name:</td><td>${data.businessName}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Contact Person:</td><td>${data.contactName}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td><a href="mailto:${data.contactEmail}">${data.contactEmail}</a></td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${data.contactPhone || "Not provided"}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Target Audience:</td><td>${data.targetAudience}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Primary Conversion Goal:</td><td><strong>${data.primaryConversionGoal.toUpperCase()}</strong> (${data.primaryConversionNotes || "None"})</td></tr>
        </table>
        <p><strong>Business Summary:</strong><br>${data.businessSummary.replace(/\n/g, "<br>")}</p>

        <!-- Section 2 -->
        <h2 style="color: #3871c1; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 24px;">
          2. Exact Offerings & Services (Zero Guesswork)
        </h2>
        <p><strong>Selected Standard Services:</strong> ${data.servicesOffered?.length ? data.servicesOffered.join(", ") : "None checked"}</p>
        <div style="background-color: #f7fafc; padding: 12px; border-left: 4px solid #3871c1; margin-bottom: 16px;">
          <strong>Detailed Offerings in Client's Words:</strong><br>
          ${data.customServices ? data.customServices.replace(/\n/g, "<br>") : "None specified"}
        </div>

        <!-- Section 3 -->
        <h2 style="color: #3871c1; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 24px;">
          3. V1 Website Scope & Content Readiness
        </h2>
        <p><strong>Required Pages for Launch:</strong> ${data.pagesRequired?.length ? data.pagesRequired.join(", ") : "None checked"}</p>
        ${data.customPages ? `<p><strong>Custom/Additional Pages:</strong> ${data.customPages}</p>` : ""}
        <p><strong>Content Status:</strong> <code>${data.contentStatus}</code></p>
        ${data.specializedCopyNotes ? `<p><strong>Copy Notes:</strong> ${data.specializedCopyNotes.replace(/\n/g, "<br>")}</p>` : ""}

        <!-- Section 4 -->
        <h2 style="color: #3871c1; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 24px;">
          4. Functional & System Requirements (Deep Dive)
        </h2>
        <ul style="padding-left: 20px;">
          <li><strong>Contact Form Routing Preference:</strong> <span style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${data.formMethodPreference.toUpperCase()}</span> ${data.formMethodPreference === "pageclip" ? "(Preferred: Zero-password Pageclip service)" : "(Direct SMTP / Google App Password)"}</li>
          <li><strong>Online Booking / Scheduling Needed:</strong> ${data.bookingNeeded ? `YES (${data.bookingTool || "TBD"})` : "No"}</li>
          <li><strong>E-Commerce / Stripe Payments Needed:</strong> ${data.ecommerceNeeded ? `YES (${data.ecommerceDetails || "TBD"})` : "No"}</li>
          <li><strong>Customer Portal / Login Needed:</strong> ${data.customerPortalNeeded ? `YES (${data.customerPortalDetails || "TBD"})` : "No"}</li>
          <li><strong>Integrations Needed:</strong> ${data.integrationsNeeded?.length ? data.integrationsNeeded.join(", ") : "None"}</li>
        </ul>
        ${data.customIntegrationNotes ? `<p><strong>Integration Notes:</strong><br>${data.customIntegrationNotes.replace(/\n/g, "<br>")}</p>` : ""}

        <!-- Section 5 -->
        <h2 style="color: #3871c1; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 24px;">
          5. Assets, Brand & Visual Direction
        </h2>
        <p><strong>Cloud Assets Drive Folder:</strong> <a href="${data.assetsDriveUrl}" target="_blank" style="color: #3871c1; font-weight: bold;">${data.assetsDriveUrl || "Not yet provided"}</a></p>
        <p><strong>Logo Available:</strong> ${data.hasLogo ? "Yes" : "No"}</p>
        <p><strong>Brand Colors Defined:</strong> ${data.hasBrandColors ? `Yes (${data.brandColorsDescription || "See notes"})` : "No"}</p>
        <p><strong>Reference Sites They Like:</strong><br>${data.referenceSitesLiked ? data.referenceSitesLiked.replace(/\n/g, "<br>") : "None"}</p>
        <p><strong>Styles / Competitors They Dislike:</strong><br>${data.stylesOrCompetitorsDisliked ? data.stylesOrCompetitorsDisliked.replace(/\n/g, "<br>") : "None"}</p>

        <!-- Section 6 -->
        <h2 style="color: #3871c1; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 24px;">
          6. Technical & Domain Infrastructure
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr><td style="padding: 6px 0; width: 180px; font-weight: bold;">Domain Name:</td><td><code>${data.domainName || "TBD"}</code></td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Registrar:</td><td>${data.domainRegistrar || "Unknown"}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Has DNS Access:</td><td>${data.hasDnsAccess ? "Yes" : "No (Needs assistance)"}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Email Provider:</td><td>${data.currentEmailProvider || "None / Not configured"}</td></tr>
        </table>

        <!-- Section 7 -->
        <h2 style="color: #f3a257; border-bottom: 2px solid #f3a257; padding-bottom: 6px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 24px;">
          7. Complete Future Product Features Backlog (For Grooming)
        </h2>
        <div style="background-color: #fffaf0; border: 1px solid #feebc8; padding: 16px; border-radius: 6px; margin-top: 10px;">
          <p style="margin-top: 0; font-weight: bold; color: #7b341e;">Customer's Full Long-Term Product Vision & Feature Requests:</p>
          <div style="white-space: pre-wrap; font-family: monospace; font-size: 13px; color: #2d3748;">
${data.futureFeatureIdeas || "No extra future features specified."}
          </div>
        </div>

        ${data.additionalNotes ? `
          <div style="margin-top: 20px;">
            <strong>Additional Notes:</strong><br>
            ${data.additionalNotes.replace(/\n/g, "<br>")}
          </div>
        ` : ""}
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: data.contactEmail,
      subject: emailSubject,
      text: `New Client Onboarding Brief from ${data.businessName} (${data.contactEmail}).\n\nCheck HTML email for full dossier breakdown.`,
      html: htmlContent,
    });

    return {
      success: true,
      message: "Your complete product requirements dossier has been submitted and delivered to Daniel!",
    };
  } catch (error) {
    console.error("Error sending requirements email:", error);
    return {
      success: false,
      message: "Failed to transmit your brief. Please check your network and try again.",
    };
  }
}
