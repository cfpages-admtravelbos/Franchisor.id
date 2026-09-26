# Franchisor.id network membership rollout — progress tracker

Execution tracker for [one membership, four sites](NETWORK_MEMBERSHIP_ROLLOUT_PLAN.md) and the [user journeys](FRANCHISOR_USER_JOURNEYS.md). Update this file as work executes; it is the canonical status surface for the rollout, and the plan and journey documents carry matching gate markers.

**Independent code review, 2026-09-26:** [R1–R4 findings and acceptance steps](ROLLOUT_CODE_REVIEW_2026-09-26.md). The `/usaha/{slug}` brand URL decision is correct, but generated detail pages, metadata, and the CSV/bridge paths still need alignment before a published-brand pilot. The current zero-publication-row build cannot prove that journey.

Status key: ⬜ pending · 🔄 in progress · ✅ done · ⚠️ blocked · 🛑 excluded from this release

| ID | Step | Gate | Owner | Status | Evidence | Date |
| --- | --- | --- | --- | --- | --- | --- |
| 0.1 | Compare the July port against current Franchisee auth, claim, new-brand, owner-edit, Premium, publication, privacy, and dashboard paths; record a parity matrix | Gate 0 | Franchisor.id | ✅ | [parity matrix](FRANCHISOR_PARITY_MATRIX.md) | 2026-09-25 |
| 0.2 | Identify the Pages project, branch, domain, D1/R2 bindings, Clerk tenant/satellite, publisher, dispatcher, and deployment SHA; record pass/fail/not verified | Gate 0 | Franchisor.id | ✅ | [provider boundary record](../operations/PROVIDER_BOUNDARY_RECORD.md) | 2026-09-25 |
| 0.3 | Match every retained `/usaha/*` legacy brand to a canonical `franchises.id` and a Franchisor publication row | Gate 0 | Franchisor.id | ⚠️ | [Legacy brand match](LEGACY_BRAND_MATCH.md): 34/34 canonical brand IDs matched, 0 duplicates and 0 writes; **0 Franchisor publication rows existed**, so row reconciliation remains open (review R3). | 2026-09-26 |
| 0.4 | Reconcile the publish queue: producers write `site_rebuild_requests`, the poller read a table that does not exist | Gate 0 | Franchisor.id | ✅ | Poller now reads `site_rebuild_requests`, `daily_publish_count`, `error_message`; `ownership:check` + `state-transitions:check` + poller tests pass | 2026-09-25 |
| 0.5 | Reconcile the `d1_migrations` ledger against the applied schema (ids 34–36 and 39 have objects but no ledger row) | Gate 0 | Franchisee.id | ⚠️ | Recorded in the parity matrix §2; the repo already exposes `reconcile_d1_migration_ledger`. Needs the owner repository | 2026-09-25 |
| 1.1 | Reuse the shared Clerk identity with server-side D1 authorization; a role alone cannot edit a brand | Gate 1 | Franchisor.id | ✅ | `functions/_clerk-auth.js` unchanged and already enforces role + D1 lookup; `auth:check` passes | 2026-09-25 |
| 1.2 | Port brand match, pending claim, private new-brand review, rejected resubmission, and pending owner-edit proposal contracts into Franchisor handlers and UI | Gate 1 | Franchisor.id | ✅ | `_form-submit-franchisor.js`, `_profile-owner-review.js`, `_profile-franchisor-actions.js`, `profile-upload.js`, `_dashboard-actions.js`, `_dashboard-queries.js`, `dashboard-review.js`; `ownership:check` passes | 2026-09-25 |
| 1.3 | Test signed-out, expired, wrong-role, wrong-owner, two-applicant, duplicate, stale-decision, rejected-resubmission, and direct API paths against the deployed schema | Gate 1 | Franchisor.id | ⚠️ | Local code paths asserted by `ownership:check`; the signed-in two-account scenarios need a deployed app (see 2.1) | 2026-09-25 |
| 2.1 | Deploy the adapted app from its reviewed commit; bind shared D1/R2 to the Pages project; set build and runtime secrets in Cloudflare | Gate 2 | Syamsul (dashboard) | ⬜ | Anonymous check still serves the legacy catch-all; the exact step list is in the provider boundary record §6 | 2026-09-25 |
| 2.2 | Configure the Clerk satellite/origin/callback/webhook path; verify cross-domain sign-in by identity, not cookies | Gate 2 | Syamsul (dashboard) | ⬜ | Blocked on 2.1 | 2026-09-25 |
| 2.3 | Replace legacy login/profile/dashboard/Premium fallbacks after the new routes and assets pass; preserve legacy URLs through an explicit redirect/canonical map | Gate 2 | Franchisor.id | ⬜ | Blocked on 2.1 | 2026-09-25 |
| 3.1 | Show the offer, term, selected brand, included sites, readiness work, and manual payment steps in plain Indonesian | Gate 3 | Franchisor.id | 🔄 | `/premium/` exists; the "narrow pilot" policy is adopted, and the owner-facing pending-review copy is in place | 2026-09-25 |
| 3.2 | Reuse the shared order, unique-code amount, confirmation, admin review, activation, renewal, expiry, and audit lifecycle without duplicating an order | Gate 3 | Franchisor.id | ✅ | `_profile-premium.js` reuses a live order; `premium:lifecycle:check` passes | 2026-09-25 |
| 3.3 | Give the owner a per-site state list (not eligible / needs work / queued / published in data / deployment pending / live / failed) with the next actor for each blocked state | Gate 3 | Franchisor.id | ⬜ | Only aggregate queue counts exist today; per-brand deployment state is not modelled in the UI | 2026-09-25 |
| 3.4 | Keep one Premium email scheduler and source-attributed notifications | Gate 3 | Franchisee.id | ✅ | Franchisor's workflow is `workflow_dispatch` only; the scheduled dispatcher stays in Franchisee.id | 2026-09-25 |
| 4.1 | Publish only explicit `published` Franchisor rows; define distinct purpose per site before treating URLs as delivery | Gate 4 | Franchisor.id | ⬜ | No `site_franchisor_id` publication rows exist yet | 2026-09-25 |
| 4.2 | Keep owner profile, media, leads, analytics, and per-site dashboard tied to the shared brand ID with honest labels | Gate 4 | Franchisor.id | 🔄 | Read models and owner surfaces exist; lead scoping asserted in code | 2026-09-25 |
| 4.3 | Follow each affected site's rebuild to its own successful deployment; one failure stays visible and retryable | Gate 4 | Franchisor.id | ⬜ | Blocked on 2.1 and 3.3 | 2026-09-25 |
| 5.1 | Limited pilot on disposable/consenting brands with a reversible content change across desktop, mobile, old URLs, both roles, payment failure, build failure, renewal | Gate 5 | Syamsul | ⬜ | Blocked on Gate 2 | 2026-09-25 |
| 5.2 | Record baseline and pilot evidence per brand/site | Gate 5 | Franchisor.id | ⬜ | Blocked on 5.1 | 2026-09-25 |
| 5.3 | Roll out to more brands only after every recovery path works without manual database edits | Gate 5 | Franchisor.id | ⬜ | Blocked on 5.1 | 2026-09-25 |
| D.1 | Canonical brand URL family for franchisor.id decided as `/usaha/{slug}` for legacy **and** new brands, deliberately different from Franchisee.id | Gate 4 (decided early) | Franchisor.id | ✅ | `_premium.js` maps `site_franchisor_id` to `/usaha/${slug}`; canonical writes, owner/dashboard/lead links updated; `ownership:check` asserts no franchisor write emits a `/peluang-usaha/` canonical | 2026-09-25 |
| D.1b | Complete that migration: generated detail route, structured data, directory cards, detail template, and bridge/import generators all on the `/usaha/` family; deprecated `/peluang-usaha/{slug}` consolidated | Gate 4 | Franchisor.id | ✅ code | Added `src/pages/usaha/[slug].astro`; `src/pages/peluang-usaha/[slug].astro` now meta-refreshes to it with canonical + `noindex`; aligned `franchise-static.ts`, `franchise-directory-document.ts`, `franchise-buyer-tools.ts`, `franchise-premium-detail.ts`, `templates/detail-franchise-tpl.html`, `d1-page-renderer.ts`, `import-csv-utils.ts`, and `build-d1-franchise-pages.ts` (detail dir split from the hub dir). `ownership:check` now asserts the whole family. **Not proven:** a synthetic published-row build or any deployed URL (review R1/R2) | 2026-09-26 |
| D.2 | Retire the legacy `/usaha/*` files and generate one authoritative sitemap | Gate 4 | Franchisor.id | ⚠️ | The generated route now lives at `usaha/[slug]` (D.1b), but the **legacy files must stay**: with 0 published Franchisor rows Astro generates no detail pages, so the 34 legacy pages are still the only working `/usaha/*` urls. Removing them now would 404 a live family. Retire only after the 34 rows are published and generated (review R1) | 2026-09-26 |
| D.2b | Prove the published-brand path: one synthetic published row through a real build must produce a `/usaha/{slug}` page whose canonical matches, with its directory card linking there and no public detail for an unpublished row | Gate 4 | Franchisor.id | ⬜ | Required by review R1 before any paid pilot. The current zero-row build cannot prove it | 2026-09-26 |
| D.3 | 301 `/usaha/pisang-molen-m-a` → `/usaha/pisang-molen-ma` (the one slug divergence) | Gate 4 | Franchisor.id | ⚠️ | Blocked: `/usaha/pisang-molen-ma` is currently a soft-404. Redirecting now would break a working page. Redirect after the generated page exists | 2026-09-25 |
| D.4 | Update `../Franchisee.id/functions/_premium.js` so a Premium approval run from Franchisee's dashboard writes the franchisor `/usaha/` canonical | Gate 4 | Franchisee.id | ✅ | Done 2026-09-26 in Franchisee.id `87a4d73`: `premiumCanonicalUrl` maps `site_franchisor_id` to `https://franchisor.id/usaha/{slug}`; guarded by a new `checkPerSiteCanonicalFamilies()` in `scripts/check-premium-lifecycle.ts`; recorded in that repository's `CHANGELOG.md` and `.context/session-20260926-0634.md` for cross-harness review | 2026-09-26 |
| X.1 | Production domain is a soft-404 catch-all: any unknown URL returns 200 with the directory home page | Cross-cutting | Franchisor.id | ⚠️ | Recorded in the provider boundary record §1; logged-out route checks cannot distinguish real pages from the fallback by status alone | 2026-09-25 |
| X.2 | Payment gateway, automated editorial article generation, social campaign, guaranteed ranking/leads, and new network sites | — | — | 🛑 | Outside this release by decision | 2026-09-25 |

## Local verification recorded for this run

| Check | Result |
| --- | --- |
| `pnpm install --frozen-lockfile` | not re-run (lockfile unchanged; no dependency edits) |
| `pnpm run astro:check` | ✅ 0 errors, 0 warnings, 5 hints (matches the documented baseline) |
| All `*:check` feature scripts (16) | ✅ pass |
| `pnpm run ownership:check` (new) | ✅ pass |
| `node scripts/test-d1-static-publish-poller.mjs` | ✅ pass |
| `pnpm run build` | ✅ 12 pages, 5,001 deployed files, `Built asset check passed` |
| Live read-only D1 queries | ✅ migration objects, queue state, 0 published franchisor rows, 34/34 brand match |
| Signed-in production scenarios (journey acceptance matrix) | ⬜ not run — blocked on Gate 2 |

## Two pre-existing broken checks repaired

`state-transitions:check` was already failing at the committed HEAD (verified with `git show HEAD:scripts/d1-static-publish-poller.mjs`). It asserted that the poller contained `pending_count = (` and `queued_count = (`, which never appeared in the file, and that `docs/forms/AUTO_SAVE.md` contained a heading that did not exist. Both assertions now match the real contract, and the renewed check guards the queue-table agreement instead.
