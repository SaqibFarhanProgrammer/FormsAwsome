# FormsAwesome Project Audit

**Audit date:** 2026-09-13  
**Scope:** Next.js App Router API routes, authentication, form CRUD, public forms, submissions, profile, theme, validation, authorization, and current quality checks.

## Executive Summary

The project has a broad API surface and a usable service layer, but it is not production-safe yet. The highest priority is authorization and public/private data separation. Fix these before adding features:

1. Lock down the legacy form update route.
2. Fix private form reads and cache ordering.
3. Ensure unpublished forms can never be returned or submitted publicly.
4. Fix route handlers that swallow errors and return `undefined`.
5. Add request validation, rate limiting, and API integration tests.

The existing product roadmap remains useful, but this audit should be the working order for API hardening. Do not mark an endpoint complete because its happy path works; every endpoint needs an unauthenticated, invalid-input, cross-user, and failure-path check where applicable.

## Verified Baseline

### Quality checks

- `pnpm lint`: **fails** with 43 errors and 17 warnings.
- The lint failures include extensive `any` usage, unused variables/imports, React effect warnings, and unescaped entities. These are tracked separately from the API security blockers.
- No dedicated automated API test script exists in `package.json`.
- TypeScript diagnostics were not reported for the inspected API files and service helpers, but a full `pnpm exec tsc --noEmit` must still be added to the release gate.

### Critical and high-risk findings

| Priority | Finding                                                                                                  | Location                                                                    | Required action                                                                               |
| -------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Critical | Legacy update can mutate any form by slug without authentication or ownership checking.                  | `app/api/forms/update/route.ts`                                             | Remove the route after migration, or require authenticated ownership immediately.             |
| Critical | Legacy update catches errors without returning the response.                                             | `app/api/forms/update/route.ts`                                             | Return `CatchErrorFunctionForRoute(...)` or use a shared route wrapper.                       |
| High     | Form detail service reads Redis and falls back to a slug query before applying ownership.                | `core/services/form/forms.service.ts`                                       | Authenticate before private reads; filter by owner; never cache private data in a public key. |
| High     | Public form service can return cached data before checking `published` status.                           | `core/services/form/forms.service.ts`                                       | Check publication status before cache reads and cache only a sanitized published projection.  |
| High     | Public submission path has the same cache/publication risk.                                              | `core/services/form/forms.service.ts`                                       | Reject drafts and archived forms before accepting answers.                                    |
| High     | Resend verification catches errors without returning a response.                                         | `app/api/auth/resend-verification/route.ts`                                 | Return a consistent error response.                                                           |
| Medium   | Google OAuth has no `state` generation and callback validation.                                          | `app/api/auth/google/route.ts`, `app/api/auth/google/callback/route.ts`     | Add CSRF state, bind it to a short-lived cookie/session, and verify it in callback.           |
| Medium   | Registration, form creation, updates, and submissions do not consistently use structural Zod validation. | Auth and form services/routes                                               | Add shared schemas with length, enum, format, and payload-size limits.                        |
| Medium   | Stored submission regex patterns can throw when used to build `RegExp`.                                  | `core/services/form/forms.service.ts`                                       | Validate regex at form-save time and safely handle invalid stored data.                       |
| Medium   | Generic error helper exposes ordinary `Error.message` values to clients.                                 | `utils/catchErrorFunction.ts`                                               | Log internal details server-side; return stable public error codes/messages.                  |
| Low      | Logout uses `GET` for a state-changing operation.                                                        | `app/api/auth/logout/route.ts`                                              | Move to `POST`; keep cookie clearing server-side.                                             |
| Low      | Login response distinguishes unknown email from invalid password.                                        | `core/services/auth/login.service.ts`                                       | Return one generic invalid-credentials response.                                              |
| Low      | Duplicate API surfaces create inconsistent behavior and response shapes.                                 | `/api/forms/create`, `/api/forms/get-all-forms`, `/api/profile/get-profile` | Migrate callers to canonical routes, then delete legacy routes.                               |

## API Inventory

### Authentication and request metadata

| Route                           |        Method | Intended access         | Audit status                                                            |
| ------------------------------- | ------------: | ----------------------- | ----------------------------------------------------------------------- |
| `/api/auth/get-ip`              |           GET | Public/request metadata | Review proxy headers and spoofing assumptions.                          |
| `/api/auth/get-user-det`        |           GET | Public/request metadata | Review whether IP, geo, and device data should be exposed.              |
| `/api/auth/google`              |           GET | Public                  | Add OAuth `state`.                                                      |
| `/api/auth/google/callback`     |           GET | Public callback         | Validate `state`, code, redirect URI, and token errors.                 |
| `/api/auth/login`               |          POST | Public                  | Validate input, rate-limit, generic errors, secure cookies.             |
| `/api/auth/logout`              | GET currently | Authenticated           | Change to POST and clear all session cookies.                           |
| `/api/auth/register`            |          POST | Public                  | Add schema validation, rate limit, generic response, email flow checks. |
| `/api/auth/resend-verification` |          POST | Public                  | Return errors, rate-limit, avoid account enumeration.                   |
| `/api/auth/verify-email`        |          POST | Public token flow       | Validate and invalidate token/code after successful use.                |

### Forms

| Route                                   | Method | Intended access            | Audit status                                              |
| --------------------------------------- | -----: | -------------------------- | --------------------------------------------------------- |
| `/api/forms`                            |    GET | Authenticated owner        | Canonical list route; add pagination and ownership tests. |
| `/api/forms`                            |   POST | Authenticated owner        | Canonical create route; add Zod field validation.         |
| `/api/forms/create`                     |   POST | Authenticated owner        | Legacy duplicate; migrate and delete.                     |
| `/api/forms/get-all-forms`              |    GET | Authenticated owner        | Legacy duplicate; migrate and delete.                     |
| `/api/forms/[formIdOrSlug]`             |    GET | Authenticated owner        | Fix ownership and cache ordering.                         |
| `/api/forms/[formIdOrSlug]`             |    PUT | Authenticated owner        | Test partial/complete update and invalid fields.          |
| `/api/forms/[formIdOrSlug]/analytics`   |    GET | Authenticated owner        | Verify ownership and bounded date/query parameters.       |
| `/api/forms/[formIdOrSlug]/submissions` |    GET | Authenticated owner        | Verify ownership, pagination, and answer privacy.         |
| `/api/forms/update`                     |  PATCH | Legacy authenticated owner | Critical vulnerability; migrate or lock down immediately. |
| `/api/forms/delete`                     | DELETE | Authenticated owner        | Verify ownership and soft-delete decision.                |
| `/api/forms/archive`                    |  PATCH | Authenticated owner        | Verify ownership and public access is removed.            |
| `/api/forms/publish-form`               |   POST | Authenticated owner        | Require at least one valid field and publish atomically.  |

### Public forms and submissions

| Route           | Method | Intended access              | Audit status                                             |
| --------------- | -----: | ---------------------------- | -------------------------------------------------------- |
| `/api/f/[slug]` |    GET | Public, published forms only | Test draft, archived, unknown, and cached states.        |
| `/api/f/[slug]` |   POST | Public, published forms only | Validate answers server-side and rate-limit per IP/form. |

### Profile, submissions, and theme

| Route                             | Method | Intended access            | Audit status                                                          |
| --------------------------------- | -----: | -------------------------- | --------------------------------------------------------------------- |
| `/api/profile`                    |    GET | Authenticated current user | Verify no password/token fields leak.                                 |
| `/api/profile`                    |  PATCH | Authenticated current user | Validate fields and upload limits; verify user ID comes from session. |
| `/api/profile/get-profile`        |    GET | Authenticated current user | Legacy duplicate; migrate and delete.                                 |
| `/api/submissions`                |    GET | Authenticated current user | Verify only owned-form submissions are returned; paginate.            |
| `/api/submissions/[submissionId]` |    GET | Authenticated owner        | Test cross-user access and field-label mapping.                       |
| `/api/submissions/[submissionId]` | DELETE | Authenticated owner        | Test cross-user deletion and repeat deletion.                         |
| `/api/theme`                      |    GET | Browser cookie             | Confirm no sensitive state is represented by the cookie.              |
| `/api/theme`                      |  PATCH | Browser cookie             | Validate allowed theme values and cookie flags.                       |

## Step-by-Step API Audit Roadmap

Run these steps in order. Record the result in the status column or an issue tracker. Use two accounts, `User A` and `User B`, plus a logged-out browser.

### Step 1: Establish test data and environment

- [ ] Add local environment values for MongoDB, Redis, JWT/session secret, and mail provider.
- [ ] Start the app with `pnpm dev`.
- [ ] Create User A and User B.
- [ ] Create one draft form, one published form, and one archived form owned by User A.
- [ ] Create at least three fields: text, email, and select/radio.
- [ ] Record form IDs, slugs, cookies, and one submission ID.
- [ ] Confirm test data is disposable and contains no real personal information.

### Step 2: Audit registration and verification

Visit `/api/auth/register`:

- [ ] Valid registration returns the documented success status.
- [ ] Missing email, malformed email, weak password, and oversized values return `4xx` JSON.
- [ ] Password is stored as a hash, never plaintext.
- [ ] Duplicate registration does not reveal whether an account exists, unless this is an explicit product decision.

Visit `/api/auth/resend-verification`:

- [ ] Missing and malformed email return a valid error response, not an empty/undefined response.
- [ ] Repeated calls are rate-limited.
- [ ] Verification code/token has an expiry and cannot be reused.

Visit `/api/auth/verify-email`:

- [ ] Valid token verifies the account.
- [ ] Expired, invalid, and already-used tokens fail safely.
- [ ] Tokens/codes are invalidated after success.

### Step 3: Audit login, cookies, logout, and OAuth

Visit `/api/auth/login`:

- [ ] Valid credentials issue the expected session/access cookie.
- [ ] Cookies are `httpOnly`, `sameSite=lax` or stricter, and `secure` in production.
- [ ] Unknown email and wrong password return the same public error.
- [ ] Repeated failures are rate-limited.
- [ ] Unverified users are blocked or handled according to the documented product rule.

Visit `/api/auth/logout`:

- [ ] Change the client flow to `POST`.
- [ ] Session cookies are cleared server-side.
- [ ] Previously authenticated requests fail after logout.

Visit `/api/auth/google` and `/api/auth/google/callback`:

- [ ] OAuth initiation creates a short-lived `state` value.
- [ ] Callback rejects missing, expired, or mismatched state.
- [ ] Callback validates code exchange errors and does not trust arbitrary redirect values.

### Step 4: Audit canonical form creation and listing

Visit `POST /api/forms` and `GET /api/forms`:

- [ ] Anonymous requests return `401`.
- [ ] User A can create and list only User A forms.
- [ ] User B cannot see User A drafts or archived forms through the authenticated list.
- [ ] Invalid field type, duplicate field ID, invalid option shape, oversized label, and invalid slug are rejected.
- [ ] List results are paginated and have a stable response shape.
- [ ] Slugs are lowercase, unique, and safe for routing.

Then compare `/api/forms/create` and `/api/forms/get-all-forms`:

- [ ] Find every client call to the legacy routes.
- [ ] Move each caller to `/api/forms`.
- [ ] Delete the legacy routes only after the replacement flow passes.

### Step 5: Audit form detail and update authorization

Visit `/api/forms/[formIdOrSlug]` as User A, User B, and logged out:

- [ ] User A can read and update User A forms.
- [ ] User B receives `403` or a non-enumerating `404` for User A private forms.
- [ ] Logged-out users cannot read drafts or archived forms through this route.
- [ ] PATCH/PUT partial updates do not crash when `title` is omitted.
- [ ] Invalid status transitions and invalid field structures are rejected.

Visit `/api/forms/update` specifically:

- [ ] Reproduce the current unauthenticated mutation attempt using a known slug.
- [ ] Lock it down immediately or remove the route after migration.
- [ ] Confirm the error path returns JSON with an HTTP status.

### Step 6: Audit publish, archive, and delete

Visit `/api/forms/publish-form`:

- [ ] User B cannot publish User A's form.
- [ ] Empty or invalid forms cannot be published.
- [ ] Publishing invalidates any stale cache.

Visit `/api/forms/archive`:

- [ ] User B cannot archive User A's form.
- [ ] Archived forms disappear from the public endpoint immediately.
- [ ] Existing submissions remain available to the owner according to the retention policy.

Visit `/api/forms/delete`:

- [ ] User B cannot delete User A's form.
- [ ] Repeat deletion returns a stable `404` or documented idempotent response.
- [ ] Decide and document hard-delete versus recoverable soft-delete.

### Step 7: Audit public form retrieval and cache safety

Visit `GET /api/f/[slug]` while logged out:

- [ ] Published form returns only the public form definition.
- [ ] Response does not contain owner ID, private settings, internal tokens, or private submissions.
- [ ] Draft, archived, and unknown slugs return the same appropriate non-success behavior.
- [ ] Fetching a private form as an owner cannot populate a public cache key.
- [ ] Updating or archiving a published form invalidates the public cache.

### Step 8: Audit public submissions

Visit `POST /api/f/[slug]` while logged out:

- [ ] Valid text, email, and select/radio answers are stored correctly.
- [ ] Missing required answers fail server-side even when client validation is bypassed.
- [ ] Wrong answer types, unknown field IDs, invalid options, oversized strings, and malformed regex inputs fail safely.
- [ ] Draft and archived forms reject submissions.
- [ ] Duplicate rapid submissions and high request volume are rate-limited.
- [ ] Response does not expose internal database errors.

### Step 9: Audit owner submissions and analytics

Visit `/api/forms/[formIdOrSlug]/submissions`, `/api/submissions`, and `/api/submissions/[submissionId]`:

- [ ] User A sees only submissions for forms owned by User A.
- [ ] User B cannot list, read, or delete User A submissions by ID, slug, or query manipulation.
- [ ] Detail output maps answers to labels without exposing hidden internal data.
- [ ] Lists are paginated and bounded.
- [ ] Deleting a submission enforces ownership and has a stable repeat-delete response.

Visit `/api/forms/[formIdOrSlug]/analytics`:

- [ ] User B cannot access User A analytics.
- [ ] Date ranges and filters are validated and bounded.
- [ ] Counts match a direct manual count of test submissions.
- [ ] Empty forms and empty date ranges return valid zero-value responses.

### Step 10: Audit profile, metadata, and theme routes

- [ ] `GET/PATCH /api/profile` always derives the user ID from the authenticated session.
- [ ] Profile responses never include password hashes, verification tokens, or refresh tokens.
- [ ] Profile image uploads enforce type, size, and provider error handling.
- [ ] `/api/profile/get-profile` is migrated to `/api/profile`.
- [ ] IP and user-agent endpoints document trusted proxy assumptions and do not treat client headers as authoritative security identity.
- [ ] `/api/theme` accepts only an allowlisted theme and sets appropriate cookie flags.

### Step 11: Add automated regression coverage

- [ ] Add schema unit tests for auth, form fields, and submission answers.
- [ ] Add integration tests for every critical route above.
- [ ] Add explicit User A/User B authorization tests for forms, submissions, and analytics.
- [ ] Add public cache tests proving drafts never leak after an authenticated request.
- [ ] Add tests for swallowed-error routes and malformed JSON.
- [ ] Add one end-to-end path: register -> verify -> login -> create -> edit -> publish -> public submit -> owner review -> logout.

## Recommended Fix Order

1. Fix `/api/forms/update` authentication/ownership and returned error response.
2. Fix private form detail authorization and separate private/public cache keys.
3. Enforce published status before public form reads and submissions.
4. Fix `/api/auth/resend-verification` error return and standardize route error handling.
5. Add shared Zod schemas and maximum payload/text lengths.
6. Add login, registration, resend, and submission rate limits.
7. Add OAuth state validation and change logout to POST.
8. Migrate and delete duplicate legacy routes.
9. Add authorization and public-cache integration tests.
10. Clean lint/typecheck failures, then run the full release gate.

## API Contract Standard

All routes should converge on these response rules:

```json
{
  "success": true,
  "data": {},
  "message": "Optional human-readable message"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request is invalid"
  }
}
```

Do not send stack traces, raw database messages, password-related data, tokens, or internal identifiers unless the endpoint explicitly requires them.

## Release Gate

Run all of these before calling the API layer production-ready:

```text
pnpm exec tsc --noEmit
pnpm lint
pnpm format:check
pnpm build
```

Additionally verify:

- [ ] All API routes validate inputs.
- [ ] All private form and submission routes enforce ownership.
- [ ] Public routes return published forms only.
- [ ] No public cache key contains private form data.
- [ ] Auth and submission rate limits are active.
- [ ] `.env.example` documents required variables without secrets.
- [ ] Integration and critical E2E tests pass in CI.
- [ ] Logs include route, status, duration, request ID, and user ID where available.

## Audit Status

**Current state:** API audit documented; fixes are not yet applied.  
**Next implementation slice:** Steps 1-4 of the Recommended Fix Order, followed immediately by focused integration tests for cross-user form access and public draft leakage.
