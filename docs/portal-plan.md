# Customer Portal Plan

Invite-only portal at `niu.ie/portal` for small business clients: see their project, hand over assets, and request changes without needing to know GitHub.

## Stack

- **App:** this repo (niu-ie), under `/portal`. Portal code lives in `app/portal/`, `components/portal/`, `lib/portal/`.
- **Auth + DB:** Supabase. Middleware scoped to `/portal/*` only; marketing pages never touch it.
- **Files:** UploadThing with **private ACL** — store file keys, serve via expiring signed URLs. Never store public URLs. (Verify private-mode API against current UploadThing docs before building.)
- **GitHub:** a GitHub App installed on Daniel's account/org. Portal creates issues on the client's behalf.
- **Agent changes:** Claude Code GitHub Action (`anthropics/claude-code-action`), running on Daniel's API key.

## Auth

- Public signups disabled in Supabase. Admin creates the user (secret key) and sends an invite email from Gmail pointing to `/portal/login`.
- Login email carries a **6-digit code plus link**. Outlook/Hotmail link scanners can consume one-time links; the code is the fallback.
- No passwords.
- Custom SMTP (e.g. Resend) — Supabase default email is rate-limited.

## Data model

- `clients` — business name, status, stripe_customer_id
- `admins` — user_id (Daniel; sees everything)
- `members` — user ↔ client
- `projects` — client_id, repo, Vercel project, live URL, preview URL
- `assets` — client_id, kind (`file` | `video_link`), uploadthing_key or url, filename, mime, size, note, uploaded_by
- `tasks` — client_id, title, body, guide_slug, kind (`action` | `choice` | `payment`), options, chosen_option, stripe_invoice_id, invoice_url, due_date, status (`todo` | `done` | `needs_help`), created_by
- `task_templates` — reusable task sets (e.g. new-client onboarding)
- `notifications` — user_id, type, title, link, read_at, emailed_at
- `requests` — client_id, type (`change` | `bug` | `question` | `transfer`), title, current, expected, page_url, attachments, size (`simple` | `complex`), gh_issue_number, status

RLS: users see only rows for their client. Admin sees all. UploadThing route checks Supabase session + membership before accepting a file.

## Features

### 1. Overview (post-login landing)
- Live site, preview, repo links
- Project status, open requests with status
- Recent assets
- "Request ownership transfer" button

### 2. Tasks (things the client must do)
- Daniel assigns tasks; client sees a checklist on the overview with due dates.
- Each task can link a guide (e.g. "Create Gmail app password" links the guide).
- Buttons: **Done**, **I need help**. "Need help" notifies Daniel.
- **Choice tasks** — e.g. domain: "I'll buy it myself" (links guide) or "Niu buys and sets it up" (creates a request for Daniel; domain registered in the client's name, billed to client via a payment task).
- **Payment tasks** — Daniel creates a Stripe invoice from admin (domain, hours, anything). Task shows amount + **Pay** button linking Stripe's hosted invoice page. Stripe webhook `invoice.paid` marks task done and notifies both sides. Stripe also emails the invoice.
- Task templates: one click applies the onboarding set to a new client (domain, email app password, Google Business Profile, logo/photos upload, etc.).
- In-site domain checkout deferred — payment tasks cover it.

### 3. Notifications
- In-app bell with unread count, plus email for each notification.
- Client notified on: new task, task due soon/overdue, request status change, preview ready, comment from Daniel.
- Daniel notified on: invoice paid, new request, "need help", choice made, task done, asset uploaded.
- Reminders via Vercel Cron (daily): due-soon and overdue nudges. No repeat email for same task within 3 days.
- Later: per-user preference (instant vs daily digest).

### 4. Assets
- Drag-drop upload: images, PDFs, docs. **Video files rejected.**
- Video handover = paste a YouTube link (unlisted fine). Store URL, show thumbnail.
- Optional note per asset ("use on About page"). Attach assets to requests.
- Out of scope: video hosting on the client's own site.

### 5. Requests → GitHub issues
- Guided form, one question per screen: which page, what happens now, what should happen, screenshot/asset (optional).
- AI tidy step rewrites into structured issue: title, current behaviour, expected behaviour, acceptance criteria, file hints. Client previews in plain English, then submits.
- AI classifies `simple` (copy, image swap, colour, add item) vs `complex`.
- Creates GitHub issue, labels, assigns to Daniel, emails Daniel.
- GitHub webhook syncs status back (open / in progress / preview ready / done); emails client on change.
- Asset links in issues are signed URLs, never public.

### 6. Agent changes
- `simple` + `agent-ok` label triggers Claude Code Action: PR opened, Vercel preview built.
- Portal shows preview link with **Approve / Not quite**.
- Approve: Daniel merges (auto-merge later, content-only).
- Not quite: feedback posted to issue, agent retries once, then routes to Daniel.
- Guardrails: branch protection, agent limited to content paths, no dependency/config edits, daily run cap per client.

### 7. Guides
MDX checklists with screenshots:
- Gmail app password
- Outlook/Hotmail app password
- Google Business Profile
- Meta Business account
- First Meta ad
- Upload a video to YouTube as unlisted
- Create a GitHub account
- Accept a GitHub repo transfer
- Accept a Vercel project transfer
- Install the Niu GitHub App

Later: per-client progress tick-off.

### 8. Ownership transfer
- Repos owned by Daniel by default.
- Transfer button creates a `transfer` request routed to Daniel — nothing automatic.
- Checklist: GitHub repo, Vercel project, domain, service accounts (email, forms).
- After transfer the GitHub App loses access unless the client installs it. If they decline: portal drops to read-only links; requests arrive by email.

### 9. Admin (Daniel only)
- Create client, invite members, link repo + Vercel project
- Assign tasks / apply templates
- Create Stripe invoice → payment task in one step
- All requests, tasks and assets, override simple/complex

## Deferred
- Bring-your-own AI subscription (client runs Claude Code themselves). Opt-in for technical clients only.

## Build order

0. ~~Remove old Clerk portal~~ (done)
1. Foundation: Supabase, invite + code login, schema + RLS, admin invite, overview
2. Notifications (in-app + email) — shared by everything after
3. Tasks + templates + domain choice + Stripe payment tasks
4. Assets
5. Requests → issues + AI tidy + status sync + emails
6. Agent changes
7. Guides
8. Transfer flow
9. (Maybe) BYO AI
