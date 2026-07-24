# Changelog

All notable repository file changes are recorded here.

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
