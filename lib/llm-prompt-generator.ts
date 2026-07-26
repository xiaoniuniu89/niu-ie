import { SampleRequestData } from "@/lib/contact-schemas";
import { KB_DESIGN_OPTIONS } from "@/lib/kb-designs";

export function generateLLMPrompt(data: SampleRequestData): string {
  const selectedKbDetails = (data.selectedKbDesigns || []).map((id) => {
    const opt = KB_DESIGN_OPTIONS.find((k) => k.id === id);
    if (!opt) return `- Concept ID: ${id}`;
    return `- ${opt.name} (${opt.vibeTag})
  * Category: ${opt.category}
  * Colors: Primary ${opt.colorPalette.primaryHex}, Secondary ${opt.colorPalette.secondaryHex}, Background ${opt.colorPalette.backgroundHex}
  * Key Triggers: ${opt.keyFeatures.join(", ")}
  * Ingested References: ${opt.sampleSites.join(", ")}`;
  }).join("\n");

  const attachedFileFormatted = data.attachments?.length
    ? data.attachments
        .map((a) => (a.url ? `${a.name} (${a.url})` : a.name))
        .join("\n- ")
    : "None attached";

  return `<TASK>
Bootstrap a ${data.siteStructure === "single-page" ? "Single-Page (1-Page Scroll)" : "Multi-Page (Up to 3 Pages)"} Website Prototype for a client in the ${data.industry} industry.
</TASK>

<CLIENT_SPECIFICATIONS>
- Client Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone || "Not provided"}
- Company / Brand: ${data.company || "Not provided"}
- Target Pages Scope (${data.pages.length} / 3): ${data.pages.join(", ")}
- Primary Business Goal: ${data.primaryGoal}
</CLIENT_SPECIFICATIONS>

<DESIGN_SYSTEM_BLUEPRINT>
${
  data.hasDesign === "yes"
    ? `- Custom Design Link Provided: ${data.designLink || "Not specified"}
- Reference Links: ${data.referenceLinks || "None provided"}`
    : `- Visual Concepts Selected from Agency Catalog:
${selectedKbDetails}`
}
</DESIGN_SYSTEM_BLUEPRINT>

<ASSETS_AND_RESOURCES>
- Resource Links & Socials: ${data.businessAssetLinks || "None provided"}
- Uploaded Pamphlets & Branding Files:
- ${attachedFileFormatted}
</ASSETS_AND_RESOURCES>

${
  data.additionalNotes
    ? `<ADDITIONAL_NOTES>
${data.additionalNotes}
</ADDITIONAL_NOTES>`
    : ""
}

<EXECUTION_INSTRUCTIONS_FOR_AI_ASSISTANT>
1. Inspect the design system blueprint and visual concept tokens above.
2. Initialize clean Next.js App Router page components matching the requested pages: ${data.pages.join(", ")}.
3. Enforce high-contrast, modern typography and structured section hierarchy tailored for ${data.industry}.
</EXECUTION_INSTRUCTIONS_FOR_AI_ASSISTANT>`;
}
