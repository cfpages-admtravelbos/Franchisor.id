# Franchisor.id repository instructions

Read this file first, then `CODEBASE.md` and `docs/README.md` before making substantial changes.

## Product boundary

Franchisor.id is the franchisor/operator-facing member of the Franchise Network. It is a separate site, repository, deployment, domain, presentation layer, and SEO surface from Franchisee.id. It is not a separate business-data silo.

The sites share the Cloudflare D1 database `franchise_db`. A franchise brand is represented once in the canonical `franchises` table. Per-domain visibility, slug, canonical URL, primary-site status, and publication state belong in `franchise_site_publications`.

The invariant for this repository is:

```text
site_id = site_franchisor_id
domain  = franchisor.id
role    = franchisor
```

Public Franchisor pages must only render records whose Franchisor publication row is `published`. Never duplicate a `franchises` row merely to show it on this domain.

## Sources of truth

- Shared network context: `docs/architecture/FRANCHISE_NETWORK_CONTEXT.md`
- Franchisor delivery plan: `docs/architecture/FRANCHISOR_BUILD_PLAN.md`
- Shared data rules: `docs/data/SHARED_DATA_CONTRACT.md`
- Current repository map: `CODEBASE.md`
- Documentation index: `docs/README.md`
- Production deployment and launch gates: `docs/operations/MANUAL_SETUP_CHECKLIST.md`
- Historical implementation reference: sibling repository `../Franchisee.id`

The Franchisee.id repository currently owns the shared D1 migration history. Do not create an independent or conflicting D1 migration chain here. Until migration ownership is moved to a dedicated shared package or infrastructure repository, shared schema changes must be designed and applied through Franchisee.id, then documented here.

Do not blindly copy Franchisee-specific constants or UI. In particular, replace `site_franchisee_id`, `franchisee.id`, buyer-oriented copy, and Franchisee-specific routes with Franchisor equivalents where appropriate.

## Engineering conventions

- Use TypeScript for new application and build code.
- Validate trust boundaries with Zod: requests, environment values, database result shapes, and imported data.
- Use Astro 5.x with the Cloudflare adapter unless a later documented decision replaces it.
- Use `pnpm`; do not introduce npm or Yarn lockfiles.
- Keep code modular. If a file approaches 500 lines, split it by responsibility.
- Use actionable, user-facing error messages. Do not expose infrastructure jargon in public copy.
- Preserve submitted form data when validation, authentication, or network failures interrupt a flow.
- Do not start a development server unless the user asks for one.
- Do not commit secrets, cookies, tokens, local database exports, or credentials.

## Identity and authorization

Use the same Clerk tenant as the network when feasible so one person has one network identity. Configure each Franchisor origin, redirect URL, and webhook explicitly; do not assume browser cookies are shared between domains.

Clerk proves identity. D1 remains authoritative for roles and permissions. Every server-side protected action must re-check D1 authorization. Expected roles include `franchisee`, `franchisor`, `admin`, and `staff`.

## Data and publishing rules

- Shared D1 binding: `franchise_db`
- Shared D1 database ID: `812cd8ac-edd0-45d9-981f-c9a15358317b`
- Cloudflare account alias: `franchise-network`
- Franchisor network site ID: `site_franchisor_id`
- Shared R2 binding convention: `FRANCHISE_ASSETS`
- Shared R2 bucket: `franchise-assets`

For public reads, join `franchises` to `franchise_site_publications`, scope by `site_franchisor_id`, require `publication_status = 'published'`, and exclude archived or suspended canonical rows.

For Franchisor-origin writes, use `source_site_id = 'site_franchisor_id'` where that field exists, append an `audit_events` record, and enqueue rebuild requests for every affected site. A Premium Network entitlement may make a listing eligible for multiple sites, but each site still needs its own publication row and successful deployment.

## Working agreements

- Preserve existing legacy URLs until a redirect/canonical migration is documented and verified.
- Keep Cloudflare Pages production configuration in the dashboard. This repository deliberately omits `pages_build_output_dir`; the D1/R2 entries in `wrangler.toml` are for local tooling.
- Keep `pnpm run assets:check` at the end of the production build so broken or case-mismatched local asset routes fail before deployment.
- Treat the current WordPress-export HTML as legacy input, not as the future data model.
- Before modifying shared behavior, inspect the corresponding implementation and current docs in `../Franchisee.id`.
- Update `CODEBASE.md` when architecture or important paths change.
- Record every repository file creation, update, move, or deletion in `CHANGELOG.md`.
- Record important technical decisions in the relevant architecture document.
- End substantial sessions with a timestamped `.context/session-YYYYMMDD-HHmm.md` snapshot.
- Keep future ideas in `SUGGESTION.md`; do not silently expand the requested scope.
- Verify changes in proportion to risk and report any checks that could not be run.
