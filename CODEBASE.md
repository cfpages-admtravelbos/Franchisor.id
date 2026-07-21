# Franchisor.id codebase

Last updated: 2026-07-22

## Current state

This repository is now a hybrid Franchisor application: the existing WordPress/Elementor static export remains the public legacy layer, while Astro, Cloudflare Pages Functions, D1 snapshot generation, shared authentication, operator profile/dashboard, Premium, proposal, OCR, and publishing modules have been adapted from the mature Franchisee.id implementation.

Implemented on 2026-07-22:

- 89 HTML files.
- 38 top-level route directories with HTML content.
- 34 legacy brand detail pages under `usaha/`.
- WordPress assets under `wp-content/` and `wp-includes/`.
- Legacy public routes including `peluang-usaha/`, `direktori-franchise/`, `pendaftaran/`, `daftar-outlet/`, `login/`, categories, articles, and brand pages.
- `package.json`, pnpm lockfile, Astro 5, TypeScript, Cloudflare adapter, and Wrangler configuration.
- `src/` routes and components for the generated directory/detail pages and authenticated operator surfaces.
- Cloudflare Pages Functions under `functions/`, scoped to `site_franchisor_id` where site ownership matters.
- D1 snapshot generation plus a non-overwriting legacy copy step that produces `dist/`.
- Shared D1 and R2 bindings; this repository intentionally has no independent `migrations/` directory.
- Franchisor-specific application theming in `css/franchisor-theme.css` using the existing site's red/ink palette, DM Sans/Lexend typography, and existing logo files.
- Explicit runtime Clerk configuration with optional shared-tenant satellite support and no embedded key fallback.
- GitHub workflows for Franchisor-scoped static publication and manual-only Premium email dispatch.
- Deployment and provider setup instructions in `docs/operations/MANUAL_SETUP_CHECKLIST.md`.

The existing home page still describes Franchisor.id as a directory of franchise and business opportunities. New application surfaces are operator/franchisor-facing while retaining public discovery. The shared database currently has zero published `site_franchisor_id` rows, so the generated directory is correctly empty until explicit publication rows are created.

## Target architecture

```text
                         shared identity tenant
                                 |
                         D1 authorization/roles
                                 |
Franchisee.id  -----+            v             +-----  Franchisor.id
(buyer-facing)      +----  franchise_db  -------+      (operator-facing)
                    |       canonical data       |
other sites  -------+   per-site publications ---+------ future network sites
                                  |
                           franchise-assets R2
```

Each site owns its routes, visual design, SEO intent, build, deploy, and per-site publication records. The network owns canonical franchise data, identities, roles, entitlements, audit history, and shared assets.

## Stable identifiers

| Purpose | Value |
| --- | --- |
| Franchisor site ID | `site_franchisor_id` |
| Franchisor domain | `franchisor.id` |
| Network role label | `franchisor` |
| D1 binding | `franchise_db` |
| D1 database ID | `812cd8ac-edd0-45d9-981f-c9a15358317b` |
| Cloudflare account alias | `franchise-network` |
| Cloudflare account ID | `0ba63b7f0096bc267a93fe5c80b1f571` |
| R2 binding convention | `FRANCHISE_ASSETS` |
| R2 bucket | `franchise-assets` |

## Application structure

The repository now has this hybrid shape:

```text
Franchisor.id/
├── AGENTS.md
├── CODEBASE.md
├── CHANGELOG.md
├── package.json
├── astro.config.mjs
├── wrangler.toml
├── src/
│   ├── components/
│   ├── layouts/
│   ├── lib/
│   └── pages/
├── functions/             # Cloudflare Pages Functions
├── scripts/
├── css/franchisor-theme.css
├── docs/
│   ├── architecture/
│   └── data/
├── .context/
├── usaha/                 # legacy brand URLs during transition
├── wp-content/            # legacy assets during transition
└── dist/                  # generated; do not hand-edit or commit unless policy changes
```

The Astro build uses this bridge approach now: it builds D1-backed pages, then copies legacy static content into `dist` without overwriting routes owned by Astro. `dist/` and generated snapshots are build artifacts and must not be hand-edited.

## Reference implementation in Franchisee.id

The sibling `../Franchisee.id` repository is mature and contains useful patterns, but many constants and flows are site-specific.

High-value references:

- `wrangler.toml`: shared D1 and R2 bindings.
- `astro.config.mjs`: static Astro build baseline.
- `scripts/build-d1-franchise-pages.ts`: D1 snapshot and static page generation.
- `scripts/copy-legacy-static.mjs`: legacy-to-Astro bridge.
- `scripts/d1-static-publish-poller.mjs`: site-scoped rebuild queue processing.
- `functions/_premium.js`: Premium Network site identifiers and canonical URL rules.
- `functions/_site-publish-queue.js`: rebuild queue writes.
- `functions/_clerk-auth.js`: Clerk identity plus D1 authorization pattern.
- `src/lib/shared-schemas.ts` and `functions/_shared-schemas.js`: shared validation concepts.
- `.github/workflows/d1-static-publish.yaml`: scheduled publication/deploy pattern.
- `migrations/`: authoritative shared D1 history for now.

The runtime was copied as an implementation baseline and then adapted. Shared network constants intentionally still contain all four network sites and `assets.franchisee.id` remains the current shared R2 hostname. Franchisor-owned code uses `site_franchisor_id`, `franchisor.id`, operator-facing copy, and the Franchisor visual layer. Future changes must preserve that separation.

## Build and verification

- Install: `pnpm install --frozen-lockfile`
- Static/type diagnostics: `pnpm run astro:check`
- Production build: `pnpm run build`
- Asset routing: the production build finishes with `scripts/check-built-assets.mjs`, which rejects missing/case-mismatched local dependencies before `dist` can be deployed.
- Feature checks are exposed as the `*:check` scripts in `package.json`.
- Do not start the development server unless the user explicitly asks.

The build requires Cloudflare credentials to fetch the remote D1 snapshot. Production bindings and secrets are documented in `docs/operations/MANUAL_SETUP_CHECKLIST.md`.

## Known migration risks

- Existing `/usaha/*` brand pages may collide with a proposed shared `/peluang-usaha/{slug}/` convention.
- Old sitemap and canonical entries must not advertise both old and new URLs as primary.
- Legacy form and login pages are static and must not be mistaken for working network authentication.
- Re-importing the 34 legacy brand pages as new brands could duplicate canonical D1 records.
- Copying Franchisee migrations into this repo would create split-brain schema ownership.
- Shared identity does not mean cross-domain cookies; each origin needs explicit Clerk configuration.
- A Premium Network subscription does not make a page live by itself; a published per-site row and successful Franchisor build are both required.

See `docs/architecture/FRANCHISOR_BUILD_PLAN.md` for the implementation sequence.
