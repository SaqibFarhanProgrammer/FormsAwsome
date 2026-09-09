# FormsAwesome — Production-Grade Roadmap

**Goal:** Take FormsAwesome from its current "strong skeleton, partially implemented" state to a fully working, production-grade form management platform, in small, ordered, low-risk steps.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS · Redux Toolkit · MongoDB/Mongoose · Redis · Nodemailer · Zod · Framer Motion · Recharts

---

## How to use this document

- Work **phase by phase, in order**. Don't jump to Phase 5 while Phase 2 is half-done.
- Each Phase has **Steps**, and each Step has **Sub-steps** (the actual checklist items).
- After finishing each Step, run the Quality Checks at the bottom before moving on.
- Tick items off as `- [x]` as you go — this file is meant to be a living checklist, not just a read-once plan.

---

## Phase 0 — Baseline Audit (do this first, ~half a day)

Before writing new code, know exactly what's broken vs. what's just unfinished.

### Step 0.1: Inventory the current auth flow

- [ ] List every auth API route and mark: working / partially working / stub only
- [ ] Check if JWT/session cookies are actually being set and read correctly
- [ ] Confirm whether email verification tokens are generated and stored (DB or Redis)
- [ ] Check password hashing (bcrypt/argon2) is actually implemented, not plaintext

### Step 0.2: Inventory form CRUD

- [ ] Compare legacy routes (`/api/forms/create`, `/api/forms/get-all-forms`, `/api/forms/update`) vs. new routes (`/api/forms`, `/api/forms/[formIdOrSlug]`)
- [ ] Decide: migrate fully to the new REST-style routes and **delete legacy routes** (recommended for production) — note the decision here
- [ ] Check Mongoose schemas for forms, fields, and submissions exist and are consistent

### Step 0.3: Inventory public flow

- [ ] Confirm `/api/f/[slug]` returns only published forms (not drafts) to the public
- [ ] Confirm `/app/(public-route)/f/[slug]` renders fields correctly for at least 3 field types

### Step 0.4: Write down known bugs

- [ ] Create a `KNOWN_ISSUES.md` or GitHub issues list from this audit — this becomes your Phase 1–4 backlog

---

## Phase 1: Finish Authentication (Foundation)

### Step 1.1: Harden the register flow

- [ ] Validate input with Zod (email format, password strength, required fields)
- [ ] Hash password with bcrypt (cost factor 10–12) before saving
- [ ] Generate email verification token (JWT or random string + expiry, stored in DB/Redis)
- [ ] Send verification email via Nodemailer with a working SMTP config (use env vars, never hardcode)
- [ ] Return generic success message (don't leak "email already exists" details that aid enumeration attacks — or handle deliberately if you accept that tradeoff)

### Step 1.2: Finish login flow

- [ ] Validate credentials, compare hashed password
- [ ] Block login if email is not verified (clear error message + "resend verification" hint)
- [ ] Issue JWT (short-lived access token) + refresh token (httpOnly, secure cookie)
- [ ] Set proper cookie flags: `httpOnly`, `secure` (in production), `sameSite: 'lax'`

### Step 1.3: Email verification + resend

- [ ] `/api/auth/verify-email` — validate token, mark user verified, invalidate token after use
- [ ] `/api/auth/resend-verification` — rate-limit this endpoint (Redis) to prevent spam abuse
- [ ] Handle expired-token case with a clear UI message and resend button

### Step 1.4: Logout + session handling

- [ ] `/api/auth/logout` — clear cookies server-side, not just client-side
- [ ] Add refresh-token rotation or blacklist (Redis) so logged-out tokens can't be reused

### Step 1.5: Protected route middleware

- [ ] Central `middleware.ts` (or per-route guard) checking valid session before allowing `/app/(pages)/*`
- [ ] Redirect unauthenticated users to `/app/auth/login` with a `?redirect=` param back to where they were going
- [ ] Add role/ownership checks later reused for form APIs (see Phase 2)

**Quality gate for Phase 1:** manually test register → verify email → login → access dashboard → logout, in a fresh browser/incognito session.

---

## Phase 2: Robust Form CRUD APIs

### Step 2.1: Consolidate routes

- [ ] Standardize on `/api/forms` (list/create) and `/api/forms/[formIdOrSlug]` (get/update/delete one)
- [ ] Migrate any logic still in `/api/forms/create`, `/api/forms/update`, `/api/forms/get-all-forms` into the standardized routes
- [ ] Delete the legacy route files once migration is confirmed working

### Step 2.2: Define the Form schema properly

- [ ] Fields: `title`, `description`, `slug` (unique, indexed), `status` (`draft`/`published`/`archived`), `ownerId`, `fields[]`, `createdAt`, `updatedAt`
- [ ] Each field in `fields[]`: `id`, `type`, `label`, `required`, `options` (for select/radio/checkbox), `order`
- [ ] Add Mongoose schema validation + indexes (`slug` unique, `ownerId` indexed)

### Step 2.3: Create form

- [ ] `POST /api/forms` — creates blank form, auto-generates unique slug, sets `status: draft`
- [ ] Validate request body with Zod before touching the DB

### Step 2.4: Read form(s)

- [ ] `GET /api/forms` — paginated list of forms owned by the logged-in user
- [ ] `GET /api/forms/[formIdOrSlug]` — single form; **must check `ownerId` matches the requester** before returning private/draft data

### Step 2.5: Update form (title, description, fields)

- [ ] `PATCH/PUT /api/forms/[formIdOrSlug]` — partial updates allowed
- [ ] Enforce ownership check on every write
- [ ] Validate field structure (no duplicate field ids, valid types) before saving

### Step 2.6: Draft save

- [ ] Debounced/manual "Save Draft" from the builder UI calls the update endpoint
- [ ] Show clear save state in UI: "Saving…" / "Saved" / "Failed to save — retry"

### Step 2.7: Publish / Archive flow

- [ ] `POST /api/forms/publish-form` (or fold into update with `status: published`) — validate the form has at least 1 field before allowing publish
- [ ] `POST /api/forms/archive` — soft-remove from public access without deleting data
- [ ] Once published, decide: can title/fields still be edited? (Recommended: allow edits, but warn "this form is live")

### Step 2.8: Delete form

- [ ] `DELETE /api/forms/delete` (or via `[formIdOrSlug]`) — require ownership, and consider soft-delete instead of hard-delete (safer for production, recoverable)

**Quality gate for Phase 2:** create → edit → save draft → publish → archive → delete, all via UI, and confirm ownership checks reject a second test user from touching the first user's form.

---

## Phase 3: Form Builder UI

### Step 3.1: Field type library

- [ ] Confirm supported types: text, textarea, email, number, select, radio, checkbox, date (start with these 8; expand later)
- [ ] Each field type has its own renderer component + its own "properties panel" config

### Step 3.2: Builder canvas

- [ ] Add field from a sidebar/palette
- [ ] Reorder fields (drag-and-drop — can use `@dnd-kit` or similar; keep it simple before optimizing)
- [ ] Delete field with confirmation
- [ ] Duplicate field (nice-to-have, not MVP-blocking)

### Step 3.3: Properties panel

- [ ] Edit label, placeholder, required toggle
- [ ] Edit options list for select/radio/checkbox
- [ ] Live preview of the field as it's edited

### Step 3.4: Form title/description editing

- [ ] Inline editable title and description at the top of the builder
- [ ] Autosave or explicit save wired to Step 2.6

**Quality gate for Phase 3:** build a 5-field form end-to-end using only the UI, save it, reload the page, confirm the fields persist in the same order.

---

## Phase 4: Public Form Experience & Submissions

### Step 4.1: Public form page

- [ ] `/app/(public-route)/f/[slug]` fetches via `/api/f/[slug]`
- [ ] Reject if form is not `published` (404 or "form not available" page)
- [ ] Render all supported field types with proper client-side validation matching field config (required, type)

### Step 4.2: Submission API

- [ ] `POST /api/forms/[formIdOrSlug]/submissions` — validate submitted data against the form's field definitions server-side (never trust client validation alone)
- [ ] Store submission with `formId`, `answers`, `submittedAt`, and optionally `ip`/`userAgent` for basic analytics
- [ ] Rate-limit submissions per IP per form (Redis) to prevent spam/abuse

### Step 4.3: Post-submit UX

- [ ] Show a clear "Thank you" state after successful submit
- [ ] Handle and display validation errors returned from the server
- [ ] Prevent duplicate double-submits (disable button while request is in flight)

### Step 4.4: Owner's submissions view

- [ ] `/app/(pages)/submissions` — list submissions across forms, or filtered by form
- [ ] Submission detail view — show all answers, submitted date, mapped to field labels (not raw field IDs)
- [ ] Ownership check: owner can only see submissions for forms they own

**Quality gate for Phase 4:** submit a real response as a logged-out user, then confirm it appears correctly in the owner's submissions view.

---

## Phase 5: Analytics & Dashboard

### Step 5.1: Basic dashboard summary

- [ ] Total forms, total submissions, published vs. draft counts
- [ ] Recent activity (last 5 submissions, last edited forms)

### Step 5.2: Per-form analytics

- [ ] Submission count over time (Recharts line/bar chart)
- [ ] Field-level breakdown for choice-based fields (e.g., pie/bar chart of selected options)
- [ ] "Form performance" card: views vs. submissions (requires basic view tracking — a lightweight counter on the public GET)

### Step 5.3: Analytics data pipeline

- [ ] Decide: compute analytics on-the-fly from submissions collection (fine for MVP scale) vs. pre-aggregated stats collection (needed later at scale)
- [ ] Add indexes on `formId` + `submittedAt` for fast queries as data grows

**Quality gate for Phase 5:** dashboard and analytics numbers match a manual count of test submissions.

---

## Phase 6: Validation, Error Handling & Security Hardening

_(This phase is what separates "MVP" from "production-grade" — don't skip it.)_

### Step 6.1: Centralized validation

- [ ] Every API route validates input with Zod schemas — no route trusts raw `req.body`
- [ ] Return consistent error shape across all APIs: `{ success: false, error: { code, message } }`

### Step 6.2: Centralized error handling

- [ ] Wrap route handlers in a shared error-handling utility (catch unhandled exceptions → log + return 500, don't leak stack traces to client)
- [ ] Add a global React error boundary for the dashboard app shell

### Step 6.3: Auth/session security

- [ ] Enforce HTTPS-only cookies in production
- [ ] Add CSRF protection for state-changing requests if using cookie-based auth
- [ ] Rate-limit login/register/resend-verification endpoints (Redis) to slow brute-force attempts

### Step 6.4: Input & data security

- [ ] Sanitize/escape any user-generated content rendered back in the UI (form titles, field labels, submission answers) to prevent XSS
- [ ] Enforce max lengths on all text fields (title, description, field labels, submission answers) both client- and server-side
- [ ] Validate `slug` format strictly (lowercase, alphanumeric + hyphen) to avoid routing/security issues

### Step 6.5: Authorization audit

- [ ] Re-check every form/submission endpoint enforces ownership — this is the #1 place SaaS apps leak other users' data
- [ ] Add automated tests specifically for "user A cannot access user B's form/submissions" (see Phase 7)

### Step 6.6: Environment & secrets

- [ ] All secrets (JWT secret, DB URI, SMTP creds, Redis URL) come from environment variables, never committed to git
- [ ] Add `.env.example` documenting required variables without real values

**Quality gate for Phase 6:** attempt each attack manually — access another user's form by guessing ID, submit oversized payloads, submit to a non-existent slug, hammer the login endpoint — confirm all are handled gracefully.

---

## Phase 7: Testing

### Step 7.1: Unit tests

- [ ] Test Zod schemas (valid/invalid inputs)
- [ ] Test utility functions (slug generation, token generation, formatting helpers)

### Step 7.2: API/integration tests

- [ ] Test each auth endpoint (happy path + failure cases)
- [ ] Test form CRUD ownership rules
- [ ] Test submission validation against field definitions

### Step 7.3: End-to-end tests (Playwright or Cypress)

- [ ] Full flow: register → verify → login → create form → add fields → publish → submit as public user → view submission
- [ ] Run E2E tests in CI before merging to main

**Quality gate for Phase 7:** CI pipeline runs unit + integration + at least the critical E2E path on every pull request.

---

## Phase 8: Performance & Optimization

### Step 8.1: Database

- [ ] Add indexes: `users.email` (unique), `forms.slug` (unique), `forms.ownerId`, `submissions.formId`
- [ ] Use `.lean()` on read-only Mongoose queries for performance
- [ ] Paginate all list endpoints (forms list, submissions list) — never return unbounded arrays

### Step 8.2: Frontend

- [ ] Code-split heavy builder/analytics components (`next/dynamic`)
- [ ] Memoize expensive Redux selectors and Recharts data transforms
- [ ] Audit bundle size (`next build` output) and trim unused dependencies

### Step 8.3: Caching

- [ ] Cache published form definitions in Redis (public form fetch is read-heavy, changes rarely)
- [ ] Invalidate cache on publish/update

**Quality gate for Phase 8:** run Lighthouse on the public form page and dashboard — target 90+ performance score on the public page.

---

## Phase 9: DevOps & Deployment

### Step 9.1: Environment setup

- [ ] Separate `.env` configs for development / staging / production
- [ ] Managed MongoDB (Atlas) and managed Redis (Upstash/Redis Cloud) for production

### Step 9.2: CI/CD pipeline

- [ ] GitHub Actions (or similar): on every PR run `pnpm exec tsc --noEmit`, `pnpm exec eslint .`, tests, and `pnpm build`
- [ ] On merge to main, auto-deploy to staging; manual promote to production

### Step 9.3: Hosting

- [ ] Deploy Next.js app to Vercel (simplest for Next.js) or a Node server on Railway/Render/AWS
- [ ] Configure custom domain, HTTPS, and environment variables in the hosting dashboard

### Step 9.4: Email in production

- [ ] Move from local SMTP testing to a real provider (Resend, SendGrid, Postmark) since raw SMTP + Nodemailer often gets throttled/blocked in production

**Quality gate for Phase 9:** a fresh deploy from a clean environment (new DB, new Redis) successfully completes the full MVP flow with real emails delivered.

---

## Phase 10: Monitoring, Logging & Maintenance

### Step 10.1: Logging

- [ ] Structured server-side logging (request id, user id, route, status, duration)
- [ ] Log all failed auth attempts and 5xx errors distinctly for alerting

### Step 10.2: Error tracking

- [ ] Integrate an error tracker (Sentry or similar) for both frontend and API routes

### Step 10.3: Uptime & alerts

- [ ] Basic uptime monitor on the public form endpoint and login endpoint
- [ ] Alert (email/Slack) on error-rate spikes or downtime

### Step 10.4: Backups

- [ ] Automated MongoDB backups (Atlas has this built-in) with a tested restore procedure

**Quality gate for Phase 10:** intentionally trigger a 500 error in staging and confirm it shows up in both logs and the error tracker.

---

## Phase 11: Documentation & Handover

### Step 11.1: Developer docs

- [ ] `README.md` with setup steps, required env vars, and how to run locally
- [ ] API reference (routes, request/response shapes) — even a simple markdown table is enough for MVP

### Step 11.2: User-facing help

- [ ] Short in-app guidance for first-time users creating their first form
- [ ] FAQ or help page for the public submission flow (optional, nice-to-have)

---

## Final Production-Readiness Checklist

Run through this before calling the app "production-grade":

- [ ] `pnpm exec tsc --noEmit` passes with zero errors
- [ ] `pnpm exec eslint .` passes with zero errors on changed files
- [ ] `pnpm build` completes successfully
- [ ] All API routes validate input and enforce ownership
- [ ] No secrets committed to git; `.env.example` is up to date
- [ ] Auth flow fully tested end-to-end (register → verify → login → logout)
- [ ] Publish/archive/delete flow tested end-to-end
- [ ] Public submission flow tested as a logged-out user
- [ ] Rate limiting active on auth + submission endpoints
- [ ] Error tracking and logging active in production
- [ ] Backups configured and restore tested at least once
- [ ] CI pipeline blocks merges on failing type-check/lint/tests/build

---

## Suggested Overall Order (condensed)

```
Phase 0  → Audit current state
Phase 1  → Finish Auth
Phase 2  → Finish Form CRUD APIs
Phase 3  → Finish Form Builder UI
Phase 4  → Public Form + Submissions
Phase 5  → Analytics + Dashboard
Phase 6  → Security & Validation Hardening   <-- production line starts here
Phase 7  → Testing
Phase 8  → Performance Optimization
Phase 9  → DevOps & Deployment
Phase 10 → Monitoring & Maintenance
Phase 11 → Documentation
```

Phases 0–5 complete your **functional MVP**. Phases 6–11 turn that MVP into something you can safely call **production-grade**.
