# Niu.ie Rebuild — Personal Site

## Context
The current niu.ie is a web dev agency site that isn't getting traffic. Rebuilding it as a personal site for Daniel (小牛 / xiǎo niú) — a space to write about music, games, software/AI, and still offer web dev services on one page. Posts are markdown files on disk. No database. Each post can be as custom or as simple as the author wants.

## Tech Decisions
- **Content storage**: `.mdx` files in `content/` directory with YAML frontmatter
- **MDX over plain markdown**: Since Daniel wants posts to be unique and he's an engineer, MDX lets him drop React components into any post (embeds, custom layouts, interactive elements) while still writing mostly markdown
- **Rendering**: `next-mdx-remote` to load MDX from disk + `gray-matter` for frontmatter parsing
- **No database**: filesystem is the source of truth
- **Keep**: all fonts (Lora, Nunito, Roboto Condensed), color palette, shadcn/ui components, Tailwind setup, Vercel deployment

## Site Structure

```
/                       → Home (intro + latest posts across all categories)
/music                  → Music posts listing
/games                  → Games posts listing (video + board)
/software               → Software & AI posts listing
/web                    → Web dev services page (condensed current site content)
/contact                → Contact form (kept from current site)
/posts/[slug]           → Individual post (rendered from MDX)
```

## Content Structure

```
content/
├── posts/
│   ├── example-music-post.mdx
│   ├── example-games-post.mdx
│   └── example-software-post.mdx
```

Each `.mdx` file has frontmatter:
```yaml
---
title: "Post Title"
date: "2026-02-18"
category: "music" | "games" | "software"
description: "Short description for listing cards"
published: true
---

Content here. Can use markdown, or import and use React components.
```

## New Dependencies
- `next-mdx-remote` — render MDX from file content in server components
- `gray-matter` — parse YAML frontmatter from MDX files
- `remark-gfm` — GitHub-flavored markdown (tables, strikethrough, etc.)

Keep: `nodemailer`, `@hookform/resolvers`, `react-hook-form`, `zod` (contact form stays)

## File Changes

### Keep as-is
- `app/globals.css` — color palette, theme, Tailwind config
- `lib/utils.ts` — cn() utility
- `components/ui/*` — all shadcn components (useful for posts and layouts)
- `public/niu-zi.webp` — logo
- `public/niu.webp` — bull image (may use on home)
- `components.json`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`

### Modify
- `package.json` — add new deps, remove unused ones
- `app/layout.tsx` — update metadata (personal site, not agency), keep fonts/analytics
- `next.config.ts` — add MDX-related config if needed
- `app/robots.ts` — update for new routes
- `app/sitemap.ts` — update for new routes

### New files
- `lib/posts.ts` — utility functions to read MDX files from disk, parse frontmatter, sort by date, filter by category
- `app/page.tsx` — new home page (brief intro + recent posts from all categories)
- `app/music/page.tsx` — music category listing
- `app/games/page.tsx` — games category listing
- `app/software/page.tsx` — software/AI category listing
- `app/web/page.tsx` — web dev services (condensed from current site)
- `app/posts/[slug]/page.tsx` — dynamic post page, renders MDX content
- `components/Header.tsx` — rewrite nav for new pages (Home, Music, Games, Software, Web, Contact)
- `components/Footer.tsx` — simplify, keep aesthetic
- `components/PostCard.tsx` — card component for post listings
- `components/PostLayout.tsx` — default layout wrapper for posts (title, date, category, back link)
- `components/mdx/` — optional custom MDX components (can add over time)
- `content/posts/example-music-post.mdx` — placeholder post
- `content/posts/example-games-post.mdx` — placeholder post
- `content/posts/example-software-post.mdx` — placeholder post

### Keep (from current site)
- `app/contact/page.tsx` — contact page (update layout/nav to match new site)
- `app/actions/contact.ts` — email server action
- `components/ContactForm.tsx` — contact form component

### Delete
- `app/portfolio/` — folding into web services page or dropping
- `app/process/` — folding into web services page or dropping
- `components/Hero.tsx` — agency-specific
- `components/Philosophy.tsx` — agency-specific
- `components/Expertise.tsx` — agency-specific
- `components/FAQ.tsx` — agency-specific
- `public/bellarosebright.webp` — portfolio image
- `public/ccpiano.webp` — portfolio image
- `public/process/` — process images

## Implementation Order

1. **Install deps** — `next-mdx-remote`, `gray-matter`, `remark-gfm`
2. **Create `lib/posts.ts`** — file-reading utilities (getAllPosts, getPostBySlug, getPostsByCategory)
3. **Create content directory** — with 3 placeholder MDX posts (one per category)
4. **Rewrite `app/layout.tsx`** — update metadata for personal site
5. **Rewrite `components/Header.tsx`** — new nav: Home, Music, Games, Software, Web, Contact
6. **Rewrite `components/Footer.tsx`** — simplified footer
7. **Create `app/page.tsx`** — new home page
8. **Create `app/posts/[slug]/page.tsx`** — MDX post renderer with `PostLayout`
9. **Create category pages** — `/music`, `/games`, `/software`
10. **Create `app/web/page.tsx`** — condensed web dev services page from existing content
11. **Update `app/contact/page.tsx`** — update to use new Header/Footer
12. **Delete old files** — agency components, portfolio, process pages
13. **Update sitemap + robots** — reflect new routes
14. **Verify** — `npm run build` passes, dev server works, all routes render

## Verification
- `npm run dev` — all pages load without errors
- `npm run build` — clean production build
- Navigate each route: `/`, `/music`, `/games`, `/software`, `/web`, `/contact`, `/posts/[slug]`
- Confirm placeholder posts render correctly with frontmatter metadata
- Confirm category filtering works
- Confirm responsive layout (mobile nav, post cards)
