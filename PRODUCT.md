# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Blog Readers**: Tech enthusiasts, gamers, and music lovers who read Daniel's personal posts about software/AI, video/board games, and music.
- **Web Services Clients**: Potential clients (small businesses, startups, and individuals) looking for agency-quality freelance web development services.

## Product Purpose
The rebuilt `niu.ie` serves as the personal website, portfolio, and blog of Daniel Callaghan (小牛 / xiǎo niú). It replaces the previous agency site with a hybrid platform: a space to write about music, games, software, and AI, while retaining a single-page portal to offer web development services and collect client leads.

## Positioning
A highly personalized, developer-crafted hybrid site that showcases technical capability not just through a services page, but through custom, interactive, and high-performance MDX-based content.

## Operating Context
- Authorship is file-based (Markdown/MDX on disk), optionally managed via Keystatic.
- Builds are static/server-rendered and hosted on Vercel.
- Readers interact with the blog listings and individual post pages; prospective clients view the web services page and fill out the contact form.

## Capabilities and Constraints
- **Content Storage**: Local `.mdx` files in the `content/posts/` directory with gray-matter parsed YAML frontmatter.
- **Rendering**: Next.js App Router (using React 19) rendering MDX content via `next-mdx-remote` and `gray-matter`.
- **Zero Database**: The filesystem is the single source of truth; no external database is configured.
- **Contact Form**: Uses NodeMailer to send emails directly via a Next.js Server Action.

## Brand Commitments
- **Name/Identity**: Daniel Callaghan (小牛 / xiǎo niú).
- **Logo/Assets**: `public/niu-zi.webp` (logo badge), `public/niu.webp` (bull image).
- **Typography**: Lora (serif), Roboto Condensed, and Nunito (sans-serif) fonts.
- **Theme/Palette**: A custom dark-mode-first aesthetic with warm, vibrant accents.

## Evidence on Hand
- MDX posts stored under [content/posts](file:///Users/danielcallaghan/Stash/niu-ie/content/posts).
- Working site layout under [app/layout.tsx](file:///Users/danielcallaghan/Stash/niu-ie/app/layout.tsx) loading fonts and site metadata.
- Pre-configured email server action at [app/actions/contact.ts](file:///Users/danielcallaghan/Stash/niu-ie/app/actions/contact.ts).

## Product Principles
- **Content Customizability**: Every blog post can be as custom as the author wants, using embedded React components within MDX to create interactive and rich visual layouts.
- **Zero-Baggage Performance**: Deliver blazing fast load times using static/server rendering and local file lookups, avoiding the latency and cost of database calls.
- **Cohesive Hybrid Design**: Unify Daniel's personal writing and professional web development services under a singular, premium, and visually engaging design theme.
