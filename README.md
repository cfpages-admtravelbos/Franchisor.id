# Franchisor.id

Franchisor/operator-facing member of the shared Franchise Network. This repository builds a hybrid WordPress-export and Astro/Cloudflare Pages application adapted from Franchisee.id. The live domain still served legacy HTML for protected routes at the 2026-09-25 review, so repository implementation is not production acceptance. Read the [membership rollout plan](docs/product/NETWORK_MEMBERSHIP_ROLLOUT_PLAN.md), [user journeys](docs/product/FRANCHISOR_USER_JOURNEYS.md), and [documentation index](docs/README.md) before extending the app.

## Local verification

Requirements: Node `20.19.4` and pnpm `10.34.1`.

```powershell
pnpm install --frozen-lockfile
pnpm run astro:check
pnpm run build
```

The build reads only published `site_franchisor_id` rows from the shared D1 database. An empty generated directory is valid when no Franchisor publication rows exist.

The last verified build on 2026-07-23 generated 12 Astro pages, preserved the legacy site, and validated 4,887 deployed files for missing or case-mismatched HTML/CSS asset references. The build fetched zero published Franchisor rows. Provider-side production setup and live smoke tests are still pending; see the manual checklist before treating the site as launched.

## Documentation

- `AGENTS.md` — repository rules and shared-network invariants.
- `CODEBASE.md` — current architecture and important paths.
- `TOPICAL_AUTHORITY.md` — audited operator-facing topical map, boundaries, evidence gates, and first publication cluster.
- `ARTICLE_CATALOG.md` — 114 non-cannibalizing article briefs across 19 parent topics.
- `docs/operations/MANUAL_SETUP_CHECKLIST.md` — required Cloudflare, Clerk, GitHub, DNS, and optional integration setup.
- `docs/architecture/FRANCHISOR_BUILD_PLAN.md` — implementation status and remaining phases.
- `docs/data/SHARED_DATA_CONTRACT.md` — shared D1/R2 contract.
- `docs/README.md` — complete documentation index and freshness rules.

Do not add an independent D1 migration chain here. The sibling Franchisee.id repository currently owns the shared migrations.
