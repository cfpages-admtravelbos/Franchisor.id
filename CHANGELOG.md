# Changelog

All notable repository file changes are recorded here.

## 2026-07-22

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
