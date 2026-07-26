export interface KBDesignOption {
  id: string;
  vibeTag: string;
  name: string;
  category: string;
  description: string;
  imageSrc: string;
  colorPalette: {
    name: string;
    primaryHex: string;
    secondaryHex: string;
    backgroundHex: string;
    mutedHex: string;
  };
  keyFeatures: string[];
  sampleSites: string[];
}

export const KB_DESIGN_OPTIONS: KBDesignOption[] = [
  {
    id: "clean-service-branding",
    vibeTag: "#clean-service-branding",
    name: "High-Contrast Local Service & Garage",
    category: "Trades & Local Contractors",
    description: "Energetic home & automotive service layout with prominent phone-first headers, high-contrast CTA buttons, and diagnostic card grids.",
    imageSrc: "/design-inspiration/clean-service-branding.png",
    colorPalette: {
      name: "Racing Red & Navy",
      primaryHex: "#D81324",
      secondaryHex: "#0B2154",
      backgroundHex: "#F7F7F7",
      mutedHex: "#596277"
    },
    keyFeatures: ["Emergency Phone CTA Bar", "Condensed Impact Headers", "Diagnostic Service Cards", "Instant Quote Request"],
    sampleSites: ["Apex Auto Garage", "Alliance Ireland Plumbing", "Dublin Plumbing Services"]
  },
  {
    id: "luxury-beauty",
    vibeTag: "#luxury-beauty",
    name: "Editorial Minimalist Beauty & Salon",
    category: "Salon, Spa & Aesthetic Clinics",
    description: "Airy whitespace, rounded pill CTAs, blush rose/champagne gold contrast, and high-fashion editorial lookbooks.",
    imageSrc: "/design-inspiration/luxury-beauty.png",
    colorPalette: {
      name: "Blush Rose & Matte Black",
      primaryHex: "#E0A49E",
      secondaryHex: "#000000",
      backgroundHex: "#F5F5F5",
      mutedHex: "#757575"
    },
    keyFeatures: ["Editorial Image Showcases", "Pill-shaped Action Triggers", "Mobile 'Book Now' Floating Bar", "Service Pricing Cards"],
    sampleSites: ["Dry & Fly Beauty Bar", "Hershesons Salon", "Peter Mark Hairdressers"]
  },
  {
    id: "healthcare-wellness",
    vibeTag: "#healthcare-wellness",
    name: "Calming Pastel Healthcare & Wellness",
    category: "Therapy, Clinics & Counseling",
    description: "Soothing pastel teal & emerald sage hues, warm linen background tones, serene typography, and reassuring patient booking flows.",
    imageSrc: "/design-inspiration/healthcare-wellness.png",
    colorPalette: {
      name: "Pastel Teal & Warm Linen",
      primaryHex: "#0D9488",
      secondaryHex: "#0F766E",
      backgroundHex: "#F0FDF4",
      mutedHex: "#64748B"
    },
    keyFeatures: ["Empathetic Hero Headers", "Practitioner Profile Cards", "Confidential Inquiry Triggers", "FAQ Accordion"],
    sampleSites: ["Mind & Body Works", "TalkHere Counseling"]
  },
  {
    id: "warm-editorial",
    vibeTag: "#warm-editorial",
    name: "Botanical Earthy & Warm Editorial",
    category: "Gardening, Artisans & Craft",
    description: "Editorial layout featuring warm cream & earthy gold tones, elegant serif headers, and magazine-style content flow.",
    imageSrc: "/design-inspiration/warm-editorial.png",
    colorPalette: {
      name: "Botanical Green & Cream",
      primaryHex: "#15803D",
      secondaryHex: "#B45309",
      backgroundHex: "#FEFCE8",
      mutedHex: "#4B5563"
    },
    keyFeatures: ["Magazine Editorial Flow", "Serif Typography", "Earthy Color Accents", "Showcase Feature Grid"],
    sampleSites: ["The Irish Gardener"]
  }
];
