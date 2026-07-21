# Franchisor.id

Franchisor/operator-facing member of the shared Franchise Network. The application now combines the existing Franchisor.id WordPress-exported public site with an Astro/Cloudflare Pages application adapted from the proven Franchisee.id runtime.

## Local verification

Requirements: Node `20.19.4` and pnpm `10.34.1`.

```powershell
pnpm install --frozen-lockfile
pnpm run astro:check
pnpm run build
```

The build reads only published `site_franchisor_id` rows from the shared D1 database. An empty generated directory is valid when no Franchisor publication rows exist.

## Documentation

- `AGENTS.md` — repository rules and shared-network invariants.
- `CODEBASE.md` — current architecture and important paths.
- `docs/operations/MANUAL_SETUP_CHECKLIST.md` — required Cloudflare, Clerk, GitHub, DNS, and optional integration setup.
- `docs/architecture/FRANCHISOR_BUILD_PLAN.md` — implementation status and remaining phases.
- `docs/data/SHARED_DATA_CONTRACT.md` — shared D1/R2 contract.

Do not add an independent D1 migration chain here. The sibling Franchisee.id repository currently owns the shared migrations.
