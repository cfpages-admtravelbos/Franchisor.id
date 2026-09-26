# Changelog

## 2026-09-26 — Independent re-review of `27a783c`

- Expanded `docs/product/ROLLOUT_CODE_REVIEW_2026-09-26.md` with a disposable published-row build result and bounded answers for profile-proposal approval, account/public-contact writes, claim decision concurrency, orphan profiles, and staff access to claimant evidence. Updated `docs/product/NETWORK_MEMBERSHIP_PROGRESS.md` to distinguish local `/usaha/{slug}` build proof from deployment and signed-in acceptance.
- Added `.context/session-20260926-1229.md` for the cross-harness handoff. No application code, D1 rows, provider settings, or production deployment changed.

## 2026-09-26 — Independent rollout code review feedback

- Added `docs/product/ROLLOUT_CODE_REVIEW_2026-09-26.md` with R1–R4 evidence and acceptance checks for the Franchisor `/usaha/{slug}` generated route, CSV/bridge producer paths, publication-row gate status, and the stale provider-record poller note.
- Updated `docs/product/NETWORK_MEMBERSHIP_PROGRESS.md`, `docs/product/NETWORK_MEMBERSHIP_ROLLOUT_PLAN.md`, `docs/product/FRANCHISOR_PARITY_MATRIX.md`, `docs/operations/PROVIDER_BOUNDARY_RECORD.md`, `CODEBASE.md`, and `docs/README.md` to route the implementing harness to the review and distinguish local code checks from published-brand and production proof.
- Added `.context/session-20260926-franchisor-review.md` as the cross-harness continuation snapshot. No application code, D1 row, or production deployment changed in this review.

All notable repository file changes are recorded here.

## 2026-09-26 (later) — Cross-repo follow-up D.4 closed

Authorized cross-repo change, recorded here and in the owning repository so another harness can review it.

- `../Franchisee.id` commit `87a4d73` maps `site_franchisor_id` to `https://franchisor.id/usaha/{slug}` in its own `functions/_premium.js`, adds a `checkPerSiteCanonicalFamilies()` guard to `scripts/check-premium-lifecycle.ts`, and records the decision in `docs/architecture/PREMIUM_MONETIZATION_PLAN.md`, `CHANGELOG.md`, and `.context/session-20260926-0634.md`. No schema, secret, or D1 change; all 15 of that repository's `*:check` scripts pass.
- Updated `docs/product/NETWORK_MEMBERSHIP_PROGRESS.md` (D.4 → done, with the commit and guard), `docs/product/FRANCHISOR_PARITY_MATRIX.md` (canonical family row closed), `docs/data/SHARED_DATA_CONTRACT.md`, and `docs/architecture/FRANCHISE_NETWORK_CONTEXT.md` to record that both `_premium.js` copies now agree and are guarded on each side.

Still open from that repository's findings, recorded so it is not lost: its `scripts/d1-static-publish-poller.mjs` needs the same table/column/ordering correction applied here in `eb94f7d`, and the `d1_migrations` ledger still lacks rows for 0034–0036 and 0039.

## 2026-09-26 — Gate 0 audits and Gate 1 ownership parity

Executed Gates 0 and 1 of `docs/product/NETWORK_MEMBERSHIP_ROLLOUT_PLAN.md` (continued from the 2026-09-25 planning review into this date). No D1 migration, secret, or live-provider change was made, and no row was written to the shared database — all live access was read-only.

### Audit artifacts (new)

- Added `docs/product/FRANCHISOR_PARITY_MATRIX.md`: feature-by-feature parity matrix against the current Franchisee.id authority, the read-only live D1 evidence snapshot, and the publish-queue reconciliation finding.
- Added `docs/operations/PROVIDER_BOUNDARY_RECORD.md`: Pages project, branch, domain, D1/R2 bindings, Clerk, publisher and dispatcher state with `pass` / `fail` / `not verified`, the anonymous route check, and the soft-404 catch-all finding.
- Added `docs/product/LEGACY_BRAND_MATCH.md`: 34/34 legacy `/usaha/*` brands matched to canonical `franchises.id` with zero writes.
- Added `docs/product/NETWORK_MEMBERSHIP_PROGRESS.md`: Unicode-status rollout tracker covering Gates 0–5.

### Gate 1 ownership and membership parity (runtime)

- Added `functions/_profile-owner-review.js`: `queueOwnerReview` and `reviewedProfileStatements`, ported with `SITE_FRANCHISOR_ID`.
- Rewrote `functions/_form-submit-franchisor.js`: existing-brand claims are now guarded `pending` rows that never touch `owner_user_id`; new brands are private `pending_review` rows that are ownerless, draft-published, and carry a `franchise_submission_reviews` record.
- Added `findExistingBrands` and aligned `findClaimSource` to the guarded form in `functions/_form-submit-utils.js`.
- Routed published owner listing and profile edits through review proposals in `functions/_profile-franchisor-actions.js`, and published media uploads in `functions/profile-upload.js`.
- Added `handleReviewBrandSubmission` and extended `handleReviewEditSuggestion` and `handleReviewClaim` with staleness, evidence, and conflict guards in `functions/_dashboard-actions.js`; registered `review_brand_submission` in `functions/_dashboard-schemas.js` and `functions/dashboard-data.js`; added the brand-submission and owner-proposal review queues in `functions/_dashboard-queries.js`.
- Moved the franchisor brand canonical to the `/usaha/{slug}` family in `functions/_premium.js`, `functions/_form-submit-franchisor.js`, `functions/_form-submit-test-actions.js`, and the brand-detail links in `_dashboard-queries.js`, `_dashboard-outreach-queries.js`, `_dashboard-utils.js`, `_profile-read-model.js`, `_profile-recommendations.js`, and `_ocr-enrichment-review.js`.

### Client surfaces

- Added brand-submission review rendering and submission in `js/dashboard-review.js`, wired `js/dashboard-admin.js`, and added the panel to `src/components/dashboard/DashboardReviewPanel.astro`.
- Surfaced pending-review status to owners in `js/profile-page.js` and corrected the listing panel copy in `js/profile-franchisor.js`; moved brand-detail links to `/usaha/` in `js/profile-analytics.js`, `js/profile-leads.js`, `js/profile-franchisee.js`, `js/dashboard-ocr-results.js`, and `js/dashboard-ocr-jobs.js`.

### Publish queue

- Corrected `scripts/d1-static-publish-poller.mjs`: it read the nonexistent `site_publish_requests` table, `published_today`, and `last_error`. It now reads `site_rebuild_requests`, `daily_publish_count`, writes `error_message`, orders the FIFO queue by `created_at, id` instead of coercing a TEXT id to a number, and treats any explicit direct mode as direct.

### Tests and build

- Added `scripts/check-ownership-contract.ts` and the `ownership:check` script; it gates `build:astro` so the pre-0035 write shapes and the queue-table divergence cannot return.
- Repaired two pre-existing stale assertions in `scripts/check-state-transitions.ts` (verified failing at the previous HEAD) and extended it to guard the queue producer/consumer table agreement.

### Documentation

- Updated `docs/product/NETWORK_MEMBERSHIP_ROLLOUT_PLAN.md` and `FRANCHISOR_USER_JOURNEYS.md` with Unicode gate markers, a tracker link, and a status column on the acceptance matrix.
- Recorded the `/usaha/{slug}` brand URL family decision and the soft-404 finding in `docs/architecture/FRANCHISE_NETWORK_CONTEXT.md` and `docs/data/SHARED_DATA_CONTRACT.md`; added the multi-tab and stale draft policy to `docs/forms/AUTO_SAVE.md`.
- Updated `AGENTS.md`, `CODEBASE.md`, and `docs/README.md` to route to the new artifacts; added `.context/session-20260926-0611.md`.

## 2026-09-25 — Franchise Network membership plan and context refresh

- Added `docs/product/NETWORK_MEMBERSHIP_ROLLOUT_PLAN.md` and `docs/product/FRANCHISOR_USER_JOURNEYS.md` for the one-brand annual membership, four-site exposure, current trust/deployment gaps, release gates, recovery paths, and controlled acceptance.
- Updated `AGENTS.md`, `CODEBASE.md`, `README.md`, `docs/README.md`, `docs/architecture/FRANCHISE_NETWORK_CONTEXT.md`, `docs/architecture/FRANCHISOR_BUILD_PLAN.md`, `docs/data/SHARED_DATA_CONTRACT.md`, and `docs/operations/MANUAL_SETUP_CHECKLIST.md` to route agents to the current network contract and distinguish July code from live production.
- Updated `docs/forms/CLAIM_TRANSITION_MATRIX.md` to reflect current pending/conflict rules and label Franchisor's old handler unaligned; linked `docs/forms/AUTO_SAVE.md`, `docs/data/FRANCHISE_FIELD_DICTIONARY.md`, `docs/architecture/OCR_PROVIDER_STRATEGY.md`, and `docs/architecture/R2_D1_MIGRATION_RUNBOOK.md` to the current journey.
- Linked `ARTICLE_CATALOG.md`, `TOPICAL_AUTHORITY.md`, `docs/PORT_MANIFEST.md`, `js/technical_comparison.md`, `js/symbols_inventory.md`, and `css/form-franchise/CSS_USAGE_MAP.md` to the current product context while preserving their historical/detail roles; `SUGGESTION.md` now records the evidenced P0 ownership/live-route gap.
- Added `.context/session-20260925-1913.md`; this `CHANGELOG.md` entry records the change. No runtime code, schema, secret, or live payment state changed.

## 2026-07-25

### Operator global-research foundation

- Added `GLOBAL_RESEARCH.md` with 20 direct-source evidence records, exact 19/19 topic-family coverage, 12 legal/financial/sector/offer gates, and refresh triggers shared with the buyer-side franchise research family.
- Updated `CODEBASE.md` and `docs/README.md` to register the research artifact as the constrained bridge from the frozen catalog to separately authorized outlining and drafting.
- Added a legacy-law/financial-claim reconciliation suggestion to `SUGGESTION.md`.
- Added `.context/session-20260725-2350.md` with research validation, current-law changes, and the remaining project-specific gates.

## 2026-07-23

### Operator topical-authority plan

- Added `TOPICAL_AUTHORITY.md` after auditing the hybrid Astro/Cloudflare and legacy WordPress-export route model, all sitemap children, 70 sitemap page URLs, 34 legacy brand pages, application surfaces, and the shared Franchise Network boundary.
- Added `ARTICLE_CATALOG.md` with 19 parent topics and 114 distinct operator-facing briefs, six per topic, including explicit intent, exclusions, evidence formats, related IDs, priority, waves, an anti-cannibalization register, and a matching coverage ledger.
- Defined Franchisor.id as the network-owner, seller, and operator knowledge surface while preserving Franchisee.id as an independent buyer-facing domain; excluded location-swapped briefs and thin city filter pages.
- Added current official Indonesian source and qualified-review gates for franchise regulation, STPW/licensing, trademarks/IP, financial claims, tax, competition, privacy, safety, and international expansion.
- Updated `README.md`, `CODEBASE.md`, and `docs/README.md` to index the authority artifacts.
- Refreshed the current build evidence after the 2026-07-23 production build again fetched zero published Franchisor rows, generated 12 Astro pages, and validated all 4,887 deployed files.
- Added `.context/session-20260723-2337.md` with audit, validation, build-impact, and handoff evidence.

## 2026-07-22

### Documentation freshness reconciliation

- Reconciled all 21 pre-existing repository Markdown files with the completed Franchisor runtime port, current D1/Clerk/R2/Astro architecture, dashboard-managed Cloudflare deployment model, and 2026-07-22 verification evidence.
- Updated root guidance and status in `AGENTS.md`, `README.md`, `CODEBASE.md`, `SUGGESTION.md`, and this changelog.
- Updated architecture/data/operations references in `docs/README.md`, `docs/architecture/FRANCHISE_NETWORK_CONTEXT.md`, `docs/architecture/FRANCHISOR_BUILD_PLAN.md`, `docs/architecture/OCR_PROVIDER_STRATEGY.md`, `docs/architecture/R2_D1_MIGRATION_RUNBOOK.md`, `docs/data/FRANCHISE_FIELD_DICTIONARY.md`, `docs/data/SHARED_DATA_CONTRACT.md`, `docs/forms/AUTO_SAVE.md`, `docs/forms/CLAIM_TRANSITION_MATRIX.md`, and `docs/operations/MANUAL_SETUP_CHECKLIST.md`.
- Marked `docs/PORT_MANIFEST.md` and the two earlier `.context/` records as historical evidence so they cannot override current-state documentation.
- Rebuilt `css/form-franchise/CSS_USAGE_MAP.md`, `js/symbols_inventory.md`, and `js/technical_comparison.md` around the active form-01–10 runtime, D1-backed submission path, Astro production build, Franchisor theme, and clearly isolated legacy generators.
- Removed stale references to nonexistent local documents, an unconfigured OCR schedule, an unverified installed secret, and the obsolete static/Sheets migration state.
- Added `.context/session-20260722-0602.md` as the documentation-refresh handoff and validation record.

### Adapted application runtime

- Ported the Astro/Cloudflare application runtime from Franchisee.id and adapted site ownership to `site_franchisor_id`, public URLs to `franchisor.id`, and operator-facing identity/copy where site-specific.
- Preserved the existing Franchisor WordPress-exported public content and added a non-overwriting legacy-to-`dist` bridge.
- Added D1-backed directory/detail generation, Cloudflare Pages Functions, profile/dashboard, claims, proposals, Premium lifecycle, analytics, contacts, OCR, assets, publishing queues, and verification scripts.
- Added `css/franchisor-theme.css` and applied it after the ported application styles. It uses the existing Franchisor red/ink palette (`#cf322e`, `#a9201c`, `#1c0d0a`), DM Sans/Lexend typography, and existing Franchisor logo assets rather than presenting Franchisee styling.
- Added Franchisor-specific Pages publishing and manual-only Premium email workflows. The email schedule is intentionally omitted to avoid duplicate network lifecycle messages.
- Added pnpm/Astro/TypeScript/Wrangler configuration and shared D1/R2 bindings. No `migrations/` directory was copied because Franchisee.id remains the shared migration owner.
- Removed the inherited browser-side Clerk publishable-key fallback and added explicit runtime configuration for Clerk shared-tenant satellite domains.
- Replaced the legacy static `login/index.html` with the functional network-auth route while retaining its Franchisor presentation layer.
- Added the exact file-level creation/update inventory in `docs/PORT_MANIFEST.md`; that manifest is the authoritative expansion of every path covered by this changelog entry.

### Documentation and operations

- Added `README.md` with local build and documentation entry points.
- Updated `CODEBASE.md`, `docs/README.md`, and `docs/architecture/FRANCHISOR_BUILD_PLAN.md` to describe the implemented hybrid application and remaining provider-side launch gates.
- Added `docs/operations/MANUAL_SETUP_CHECKLIST.md` with explicit Cloudflare Pages, D1, R2, Clerk satellite, DNS, GitHub Actions, email, OCR, and Google Contacts steps.
- Added adapted shared-contract references for the field dictionary, claims, autosave, OCR, and R2/D1 operations; each retains Franchisee.id as the upstream migration/contract authority where applicable.
- Recorded local verification and handoff context in `.context/session-20260722-0523.md`.
- Expanded `docs/operations/MANUAL_SETUP_CHECKLIST.md` with a click-by-click, dashboard-only Astro deployment procedure, exact build fields, encrypted-secret flow, binding setup, deployment-log checks, and browser asset verification.

### Deployment asset hardening

- Added `scripts/check-built-assets.mjs` and the `assets:check` package script. Production builds now crawl every deployed HTML file plus reachable CSS dependencies and fail on missing or case-mismatched local stylesheets, scripts, images, fonts, or nested assets.
- Updated `package.json` so asset validation runs automatically after Astro generation and the legacy static bridge.
- Updated `scripts/copy-legacy-static.mjs` to remove obsolete, unavailable WordPress server-runtime scripts and an unused LatePoint stylesheet from retained static output.
- Removed obsolete runtime/style references from `login/index.html`, `daftar/index.html`, `customer-cabinet/index.html`, both HTML templates, and the Astro profile page.
- Corrected broken legacy image references in `projects/index.html` and `services/index.html` to point at existing exported files.
- Replaced the unavailable Owl video-control image reference in `wp-content/plugins/unlimited-elements-for-elementor/assets_libraries/owl-carousel-new/assets/owl.carousel.css` with a native Franchisor-red background.
- Added `wp-content/plugins/wpforms-lite/assets/pro/images/times-solid-white.svg` for a stylesheet dependency retained by visible legacy forms.
- Removed `pages_build_output_dir` from `wrangler.toml` and `wrangler.example.toml` so dashboard Git integration remains the production source of truth and bindings/secrets stay editable through the Cloudflare web UI.

### Added

- `AGENTS.md` with repository instructions and shared-network invariants.
- `CODEBASE.md` with the legacy inventory, target architecture, identifiers, and implementation references.
- `docs/README.md` as the documentation entry point and upstream-source record.
- `docs/architecture/FRANCHISE_NETWORK_CONTEXT.md` with the cross-site product, data, identity, and publishing model.
- `docs/architecture/FRANCHISOR_BUILD_PLAN.md` with a phased migration and acceptance plan.
- `docs/data/SHARED_DATA_CONTRACT.md` with required D1 read/write and publication rules.
- `SUGGESTION.md` for non-committed platform and migration ideas.
- `.context/session-20260722-0429.md` as the initial Franchisor context handoff.

## 2026-07-25 17:54 (Asia/Jakarta)

### Added

- `ARTICLE-GUIDE.md`: repository-local one-article-at-a-time writing instructions.
- `artikel/*.md` (114 files): source-constrained article outlines appointed by `ARTICLE_CATALOG.md`.
- `.context/session-20260725-1754.md`: recorded this bounded handoff session.

### Changed

- `ARTICLE_CATALOG.md`: assigned unique historical CMS publication dates.
- `AGENTS.md`: appended the managed repository-local article workflow without replacing existing rules.
- `CODEBASE.md`: recorded the outline-only article handoff and publication boundary.
- `CHANGELOG.md`: recorded every path class changed by this handoff.

### Removed

- None.
