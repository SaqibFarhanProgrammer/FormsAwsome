# FormsAwesome Optimization Plan

**Stack:** Next.js 16.3 · React 19.2 · TypeScript 5.8 · App Router · MongoDB/Mongoose · Redis

This document records optimizations that are applicable to the current repository. Work from P0 to P3, and measure before and after changes so that optimization does not become speculative refactoring.

## Current Baseline

- `next.config.ts` has no production-specific configuration yet.
- The root layout mounts Redux, global alerts, and theme initialization for every route.
- The form builder already uses narrow Redux selectors and memoized field items. Preserve that work; do not replace it with broad `useSelector` subscriptions.
- `axios` is used across many client components and API routes even though Next.js and the platform provide `fetch`.
- `recharts` and `jspdf` are feature-specific, browser-heavy dependencies and should not be part of the initial bundle for unrelated pages.
- Both `lucide-react` and `@tabler/icons-react` are installed. `dayjs` and `date-fns` also overlap in purpose.
- `pnpm lint` currently fails according to `PROJECT_AUDIT.md`; the project has no dedicated test script or full typecheck release gate.
- The audit also reports authorization and public-cache issues. These are correctness and security blockers, but they must be fixed before caching or prefetching is expanded.

## Priority Order

### P0: Correctness Before Speed

These items prevent an optimization from making a data leak or stale response faster.

- Lock down `app/api/forms/update/route.ts` or remove it after migrating callers to the canonical form route.
- Apply ownership checks before Redis reads and database fallbacks in the form service.
- Check `published` and `archived` status before public cache reads and public submission handling.
- Cache only a sanitized public form projection. Never place private form data or owner data in a public key.
- Return a response from every route `catch` block and use stable public error messages.
- Add rate limiting to login, verification resend, public form reads, and submissions.

**Done when:** User A, User B, and logged-out integration tests prove that private forms, drafts, archived forms, and submissions cannot cross the authorization boundary.

### P1: Server-First Data Fetching

- Keep initial dashboard, forms, profile, and analytics reads in Server Components where possible.
- Pass only serializable, minimal view models into Client Components. Do not pass complete Mongoose documents or internal fields.
- Replace client `useEffect` data fetching for initial page data with server-side service calls or route-level `fetch`.
- Use `fetch` with an explicit cache policy for server requests:
  - private/session data: `cache: "no-store"` or a deliberate short revalidation strategy;
  - public published forms: tagged revalidation with `revalidateTag` after publish/update/archive;
  - immutable assets: long-lived cache headers.
- Add pagination and bounded limits to forms, submissions, and analytics queries. Never load an unbounded collection for a page.
- Select only required MongoDB fields and add indexes for `ownerId`, `slug`, `formId + submittedAt`, and the actual sort fields.

**Done when:** dashboard navigation does not refetch unchanged server data unnecessarily, private responses are never shared, and database query explain plans use the intended indexes.

### P1: Bundle and Dependency Size

- Standardize on one icon library. Prefer `lucide-react` because it is already the dominant library; migrate the small `@tabler/icons-react` usage set and remove the dependency.
- Standardize on one date library. Choose `date-fns` or `dayjs`, migrate call sites, and remove the other dependency.
- Replace browser-side `axios` calls with a small typed `fetch` client. Keep server-only HTTP calls explicit and avoid shipping unnecessary client helpers.
- Load Recharts only on analytics routes and use `next/dynamic` for chart components when the page can render without them immediately.
- Load `jspdf` only when the user presses Export, using a dynamic import inside the event handler or a dynamically loaded export component.
- Keep route-specific dynamic imports in `components/lazy/LazyComponents.tsx`; use the shared shadcn `Skeleton` fallback so loading UI stays consistent.
- Lazy-load dashboard submissions, profile panels, and settings tabs independently. Keep server data fetching outside the lazy registry.
- Keep `framer-motion` limited to surfaces that need it. Do not import it in shared layouts or above-the-fold routes unless the animation is visible there.
- Audit duplicate and unused dependencies with `pnpm exec depcheck` or an equivalent review before removing packages.

**Done when:** production build output shows no chart/PDF code in unrelated route chunks, and the measured first-load JavaScript decreases for login, dashboard, and public form pages.

### P1: React 19 Rendering and State

- Keep Redux for shared interactive builder state, but avoid putting server data, session data, or page-local state in the global store.
- Preserve narrow selectors in `redux/features/form-builder/form.selectors.ts` and `React.memo` only for repeated field rows with stable props.
- Debounce draft persistence at the API boundary or in the save command, not every keystroke. Show `saving`, `saved`, and `failed` states.
- Use `startTransition` for non-urgent filtering, sorting, and preview updates when those interactions compete with typing.
- Use `useDeferredValue` only for expensive derived views such as large submission tables or live previews; measure before adding it.
- Avoid effect-driven derived state. Calculate values during render when possible, and clean up timers/listeners in effects.
- Keep client boundaries narrow. A page should not become client-rendered just because a toolbar or alert needs browser APIs.

**Done when:** typing in the builder stays responsive with 50+ fields, unrelated field rows do not rerender, and draft saves are coalesced instead of sent per keystroke.

### P1: Images, Fonts, and CSS

- Use `next/image` for user-uploaded and landing-page images with explicit dimensions, responsive sizes, and safe remote patterns.
- Keep only the font families and weights actually used. The root layout currently loads Geist and multiple Inter weights; remove unused weights or choose one family per design role.
- Avoid layout shifts by reserving dimensions for avatars, charts, QR codes, and form previews.
- Keep global CSS focused on tokens and shared primitives. Move feature-only styles and expensive animations closer to the feature.
- Respect `prefers-reduced-motion` for Framer Motion and CSS transitions.

**Done when:** Lighthouse or Web Vitals reports no avoidable layout shift from fonts/media, and mobile public forms do not download dashboard-only assets.

### P2: API and Database Efficiency

- Create typed Zod schemas once and reuse them in route handlers and service boundaries. Reject oversized payloads before database work.
- Use `.lean()` for read-only Mongoose queries where document methods are not needed.
- Use projections for list and public endpoints; omit password hashes, tokens, internal settings, and unused nested data.
- Prefer atomic updates for publish/archive/status changes and invalidate related cache tags in the same operation flow.
- Use cursor pagination for large submissions and stable sort keys. Offset pagination is acceptable only for small bounded lists.
- Batch independent reads with `Promise.all` only when they do not contend for the same limited resource and failures are handled deliberately.
- Avoid N+1 lookups when mapping submission answers to field labels. Fetch the form definition once and build a field-id map.
- Add request IDs and structured timing logs around database, Redis, and external mail/cloud calls.

**Done when:** API responses have stable bounded sizes, list queries remain indexed as data grows, and p95 route timings are visible in logs.

### P2: TypeScript and Quality Gates

- Add scripts for `typecheck`, focused tests, and a production verification command:

```json
{
  "typecheck": "tsc --noEmit",
  "test": "...",
  "verify": "pnpm typecheck && pnpm lint && pnpm format:check && pnpm test"
}
```

- Replace `any` in API payloads, forms, profiles, analytics, and error handling with shared types, `unknown`, or inferred Zod output.
- Use `unknown` in `catch` clauses and normalize errors in one server-side helper.
- Add integration tests for authorization, cache isolation, pagination, invalid payloads, and public draft rejection.
- Add a bundle-size check for route chunks after dependency or import changes.
- Treat lint errors as release blockers only after fixing the existing baseline in small feature-scoped batches.

**Done when:** `pnpm verify` is green in CI and a type error or authorization regression fails before deployment.

### P3: Observability and Continuous Measurement

- Record Web Vitals for public forms and dashboard routes: LCP, INP, CLS, TTFB, and client error rate.
- Track API p50/p95 latency, error rate, Redis hit ratio, database query time, and submission rejection rate.
- Compare production build output after each dependency or dynamic-import change.
- Re-test with realistic data: at least 50 fields, 10,000 submissions, and slow mobile network emulation.
- Document cache invalidation events for publish, update, archive, and delete flows.

## Suggested Implementation Sequence

1. Fix authorization, publication checks, error responses, and public cache isolation.
2. Add typecheck/test/verify scripts and establish the failing baseline in CI.
3. Consolidate data fetching and add pagination, projections, and database indexes.
4. Remove overlapping dependencies and replace browser Axios usage with typed fetch helpers.
5. Dynamically load charts, PDF export, and other feature-only code.
6. Tighten fonts, images, client boundaries, and builder save behavior.
7. Measure Web Vitals, route chunks, query timings, and real-user regressions.

## Optimization Rules

- Do not add `useMemo`, `useCallback`, dynamic imports, or caching without identifying the expensive work and a measurement that can prove improvement.
- Never cache private data under a public key.
- Never trade authorization, validation, or error clarity for a faster happy path.
- Prefer fewer well-typed dependencies and canonical API routes over parallel abstractions.
- Keep optimization changes small enough that a focused test can attribute the result.
