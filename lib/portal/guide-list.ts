// Guide metadata, safe to import from client components (the sidebar needs it).
// Order here is the order in the sidebar and on the guides index.

export type Guide = {
  slug: string;
  title: string;
  summary: string;
  section: GuideSection;
};

export const GUIDE_SECTIONS = [
  "Working with Niu",
  "Domains and DNS",
  "Email and forms",
  "Your code",
  "AI tools",
  "Payments",
  "Marketing",
] as const;

export type GuideSection = (typeof GUIDE_SECTIONS)[number];

export const GUIDES: Guide[] = [
  {
    slug: "requests",
    title: "Report an issue or request a change",
    summary: "How to write a bug report or feature request that gets fixed first time.",
    section: "Working with Niu",
  },
  {
    slug: "send-secrets",
    title: "Send passwords and keys safely",
    summary: "Share passwords, API keys and env variables with a link that works once.",
    section: "Working with Niu",
  },
  {
    slug: "costs",
    title: "What your site costs, and why",
    summary: "Work out a budget, and why some sites need a server or database.",
    section: "Working with Niu",
  },
  {
    slug: "buy-a-domain",
    title: "Buy a domain",
    summary: "Buy one yourself, or ask us to buy it and bill you.",
    section: "Domains and DNS",
  },
  {
    slug: "dns-records",
    title: "Set and manage DNS records",
    summary: "What A, CNAME, MX and TXT records do, and how to change them safely.",
    section: "Domains and DNS",
  },
  {
    slug: "gmail-app-password",
    title: "Create a Gmail app password",
    summary: "Let your website send email through your Gmail account.",
    section: "Email and forms",
  },
  {
    slug: "email-passwords",
    title: "Other email accounts",
    summary: "App passwords for Outlook and Hotmail, and settings for other providers.",
    section: "Email and forms",
  },
  {
    slug: "pageclip",
    title: "Contact forms with Pageclip",
    summary: "Collect form submissions without running a server.",
    section: "Email and forms",
  },
  {
    slug: "github",
    title: "What GitHub is, and how to join",
    summary: "Where your site's code lives, and how to set up an account.",
    section: "Your code",
  },
  {
    slug: "owning-your-code",
    title: "Ways to own and work on your code",
    summary: "Keep it with Niu, move it to your account, or edit it yourself.",
    section: "Your code",
  },
  {
    slug: "ai-subscriptions",
    title: "Buy an AI subscription",
    summary: "Choosing and paying for Claude, ChatGPT or Gemini.",
    section: "AI tools",
  },
  {
    slug: "ai-billing",
    title: "Subscription or pay per token?",
    summary: "The difference between a monthly plan and paying for what you use.",
    section: "AI tools",
  },
  {
    slug: "stripe-payment-links",
    title: "Set up Stripe payment links",
    summary: "Take card payments from a link or a button on your site.",
    section: "Payments",
  },
  {
    slug: "google-business-profile",
    title: "Google Business Profile",
    summary: "Show up on Google Maps and in local search.",
    section: "Marketing",
  },
  {
    slug: "meta-business",
    title: "Meta business account",
    summary: "Manage your Facebook page and Instagram from one place.",
    section: "Marketing",
  },
  {
    slug: "ad-images",
    title: "Make ad images",
    summary: "Sizes, tools and tips for images that work in Facebook and Instagram ads.",
    section: "Marketing",
  },
];

export const guidePath = (slug: string) => `/portal/guides/${slug}`;
