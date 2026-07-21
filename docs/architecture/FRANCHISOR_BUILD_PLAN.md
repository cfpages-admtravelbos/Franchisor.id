# Franchisor.id build plan

Last updated: 2026-07-22

## Goal

Turn the existing static export into the franchisor/operator-facing site of the Franchise Network while preserving useful legacy URLs and using the same canonical data platform as Franchisee.id.

This plan deliberately separates shared platform behavior from Franchisor presentation. The Franchisee runtime has been ported as a functional baseline, adapted to Franchisor identifiers and visuals, and locally verified. Provider-side setup and live end-to-end verification remain manual launch gates.

## Delivery snapshot

| Phase | Status on 2026-07-22 |
| --- | --- |
| 0 — guardrails/inventory | Documentation and non-overwriting legacy bridge complete; final SEO redirect inventory remains open. |
| 1 — scaffold/bridge | Complete locally. |
| 2 — D1 publication pipeline | Complete locally; remote query correctly found zero published Franchisor rows. |
| 3 — independent publishing | Code/workflow complete; Cloudflare Pages project, bindings, deploy hook, and live test pending. |
| 4 — identity/operator account | Code complete; Clerk satellite, DNS, variables, webhook, and live auth test pending. |
| 5 — onboarding/brand management | Ported and adapted; live authorization/write-flow verification pending. |
| 6 — Premium/leads | Ported and adapted; provider configuration and live lifecycle verification pending. |
| 7 — legacy retirement/SEO | Not started; legacy content is intentionally preserved. |

## Phase 0 — guardrails and inventory

Status: documentation baseline complete; route-level migration inventory still required.

- Keep `AGENTS.md`, `CODEBASE.md`, the network context, and data contract current.
- Record all legacy routes, titles, canonicals, sitemap entries, forms, and brand slugs.
- Match the 34 `/usaha/` pages to canonical D1 franchises without inserting records.
- Decide the long-term brand URL: retain `/usaha/{slug}` or adopt `/peluang-usaha/{slug}` with permanent redirects.
- Identify which WordPress assets are still referenced and which can be retired later.

Acceptance:

- Every legacy public URL has an owner: preserve, replace, redirect, or retire.
- Every legacy brand is matched, marked unmatched, or flagged ambiguous.
- No D1 writes occur during inventory.

## Phase 1 — application scaffold and legacy bridge

Status: complete locally.

- Add pnpm, TypeScript, Astro 5.x, Cloudflare adapter, Zod, and Wrangler.
- Configure `output: 'static'`, intentional trailing-slash behavior, and a generated `dist/`.
- Bind the existing `franchise_db` and `franchise-assets` resources.
- Centralize validated site constants for `site_franchisor_id` and `franchisor.id`.
- Add a copy step that moves legacy files into `dist` only when Astro has not claimed the route.
- Add syntax, type, build, and route-collision checks.

Acceptance:

- `pnpm build` succeeds from a clean checkout with documented environment requirements.
- New pages and preserved legacy pages coexist without overwrites.
- No Franchisee hard-coded site ID appears in Franchisor-owned site configuration.

## Phase 2 — read-only D1 publication pipeline

Status: complete locally. The verified remote result is zero `site_franchisor_id` publications, so no generated brand pages are expected yet.

- Adapt the Franchisee D1 generator pattern into a Franchisor-specific module.
- Query only published `site_franchisor_id` rows and active canonical franchises.
- Validate D1 snapshots before rendering.
- Generate a Franchisor directory and brand detail pages with operator-oriented templates.
- Generate deterministic sitemap, canonical, metadata, and structured data.
- Keep generated outputs reproducible and avoid committing them as editable source.

Acceptance:

- A canonical brand with no Franchisor publication does not appear.
- A published Franchisor row appears at its Franchisor slug.
- Archived or suspended records do not appear.
- Re-running a build with unchanged data produces no meaningful output changes.
- Page copy and calls to action are materially appropriate to franchisors, not cloned from Franchisee.id.

## Phase 3 — independent Franchisor publishing

Status: Franchisor-scoped code and GitHub workflow are present; provider-side setup and production verification remain.

- Configure a Franchisor Cloudflare Pages project.
- Add a Franchisor GitHub workflow based on the existing D1 static publisher.
- Set `SITE_ID=site_franchisor_id` and Franchisor-specific deploy secrets/hooks.
- Verify request deduplication, retry behavior, publish-state updates, and failure visibility.
- Do not reuse Franchisee deployment secrets unless they are intentionally network-scoped and safe.

Acceptance:

- A queued Franchisor request triggers only the Franchisor build/deploy.
- A Franchisee-only request is ignored by the Franchisor publisher.
- Failed deployment remains retryable and does not report a false live state.

## Phase 4 — shared identity and operator account

Status: auth/profile runtime is present and the client supports explicit Clerk satellite configuration without a hard-coded key. Clerk/DNS configuration and live verification remain.

- Configure Franchisor origin and callback URLs in the shared Clerk tenant.
- Implement server-side identity sync and D1 role checks.
- Build a Franchisor profile surface from shared `franchisor_profiles` data.
- Reuse ownership and claim rules rather than trusting email or client metadata alone.
- Replace legacy static login/registration routes only after the real routes work.

Acceptance:

- A network user can authenticate on Franchisor.id with the intended shared identity.
- Sessions do not depend on cross-domain cookie assumptions.
- Unauthorized users cannot edit brands or see protected data.
- Owner access is traceable to a profile, approved claim, or administrative assignment.

## Phase 5 — franchisor onboarding and brand management

Status: progressive profile/dashboard, claim, proposal, contacts, and asset flows are ported and adapted; production authorization and write-flow verification remain.

- Adapt the documented progressive franchisor form using shared field meanings.
- Preserve drafts and submitted values across validation/auth/network interruptions.
- Support brand create/claim, packages, operational details, financial ranges, contacts, countries, and media.
- Attribute writes to `site_franchisor_id` and append audit records.
- Add publication readiness and quality feedback suitable for operators.

Acceptance:

- The same canonical brand can be edited once and republished to eligible sites.
- Duplicate detection prevents creating a second canonical record accidentally.
- Validation semantics match the shared Franchisee field dictionary.
- Material changes are auditable and rebuild every affected published site.

## Phase 6 — Premium Network and lead operations

Status: Premium lifecycle, publication, analytics, email, and related server modules are ported. Provider setup and live verification remain; email scheduling is intentionally not duplicated.

- Show subscription and entitlement state from shared records.
- Let eligible operators understand and control network publication state.
- Surface leads and analytics with appropriate role and ownership checks.
- Reuse the established payment lifecycle unless a documented product decision changes it.
- Make per-site publication/deployment status honest and understandable.

Acceptance:

- Premium activation creates/updates site publications, not canonical duplicates.
- Operators can distinguish eligible, queued, published, deployed, expired, and failed states.
- Lead access is restricted to authorized brand owners and staff.

## Phase 7 — legacy retirement and SEO consolidation

Status: pending. No destructive legacy cleanup was performed during the application port.

- Apply the approved redirect map.
- Replace obsolete WordPress sitemaps with the generated sitemap.
- Remove unreferenced assets only after crawl/link verification.
- Validate canonicals, robots directives, structured data, status codes, and internal links.
- Monitor crawl and deployment results before deleting legacy sources.

Acceptance:

- No known valuable URL becomes an unexplained 404.
- One canonical URL exists for each Franchisor page intent.
- No static login, registration, or stale form is presented as functional.
- Legacy assets left in the repo have a documented consumer or retention reason.

## Next launch session checklist

When Codex is next opened in this repository for launch work:

1. Read `AGENTS.md`, `CODEBASE.md`, and all documents indexed by `docs/README.md`.
2. Confirm both repositories are clean enough to work safely.
3. Re-check the current migration head and relevant generator/publisher code in `../Franchisee.id`.
4. Follow `docs/operations/MANUAL_SETUP_CHECKLIST.md` for Cloudflare, Clerk, GitHub, and DNS.
5. Confirm the Pages build and Functions deployment before enabling mutations.
6. Create one explicit Franchisor publication through the intended admin/Premium flow; do not mass-copy publication rows.
7. Run auth, upload, proposal, publication, and deployment smoke tests with a disposable test account/record.
8. Update `CODEBASE.md`, `CHANGELOG.md`, and the session snapshot.

## Decisions still requiring evidence

- Whether legacy `/usaha/{slug}` pages should eventually redirect to the implemented `/peluang-usaha/{slug}/` application canonical route.
- Whether the Franchisor public directory should show all published brands or only operator-verified/Premium brands.
- Which dashboard capabilities belong directly in Franchisor.id versus a future shared network console.
- When shared schema, schemas, and reusable server code should move out of Franchisee.id into a dedicated package/repository.

These decisions should not block the Phase 1 scaffold, but they must be settled before broad page generation or destructive legacy cleanup.
