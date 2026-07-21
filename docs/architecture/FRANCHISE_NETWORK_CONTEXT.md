# Franchise Network context for Franchisor.id

Last updated: 2026-07-22

## Executive summary

Franchisee.id and Franchisor.id are two products in one data network, not two copies of one website and not two isolated databases.

- Franchisee.id is primarily buyer/franchisee-facing: discovery, comparison, inquiry, and prospective franchisee workflows.
- Franchisor.id is primarily operator/franchisor-facing: brand authority, owner onboarding, listing quality, publishing, network reach, and lead operations.
- Both may expose public brand discovery, but their page intent, copy, navigation, structured data, and conversion paths should suit their audiences.
- Canonical business records, identities, permissions, subscriptions, entitlements, audit history, and asset pointers are shared.
- Domain visibility and URLs are site-specific through publication records.

The central rule is: **one canonical franchise, many controlled site publications**.

## Network topology

The initial schema registers these sites:

| Site ID | Domain | Network role |
| --- | --- | --- |
| `site_franchisee_id` | `franchisee.id` | `franchisee` |
| `site_franchisor_id` | `franchisor.id` | `franchisor` |
| `site_franchise_id` | `franchise.id` | network publication surface |
| `site_waralaba_id` | `waralaba.id` | network publication surface |

Other seeded network sites exist in the shared schema, but the Premium Network implementation currently names the four sites above. Do not infer that an unlisted site is live merely because it has a `network_sites` row.

## Shared platform services

### D1

`franchise_db` is the system of record. Its database ID is `812cd8ac-edd0-45d9-981f-c9a15358317b` in Cloudflare account alias `franchise-network`.

Important shared areas include:

- `network_sites`
- `users` and `user_roles`
- `franchisee_profiles` and `franchisor_profiles`
- `franchises` and `franchise_packages`
- `franchise_claims`
- `franchise_assets`
- `locations` and `franchise_locations`
- `leads`
- `franchise_site_publications`
- subscription, order, confirmation, and entitlement tables
- rebuild queue and per-site publication state tables
- `audit_events`

The `franchises` table is canonical. Site-specific slugs and state belong in `franchise_site_publications`, whose uniqueness rules prevent duplicate slugs on one site while allowing different sites to choose different URLs.

### R2

Shared media is stored in the `franchise-assets` R2 bucket through the `FRANCHISE_ASSETS` binding convention. D1 stores asset metadata and pointers. Site code should render those references safely rather than create domain-local copies without a reason.

### Clerk

The network direction is a shared Clerk tenant so users keep one identity. Cookies and browser sessions are still origin-sensitive. Franchisor.id needs its own allowed origins, redirect URLs, and webhook configuration.

Clerk authenticates a person; D1 authorizes their action. Protected server handlers must check the D1 role and relevant resource ownership on every request. Client-side metadata is never sufficient authorization.

## Canonical data versus site projection

Use this ownership split:

| Shared canonical/network data | Franchisor-specific projection |
| --- | --- |
| Brand identity and descriptions | Franchisor publication status |
| Investment, fees, performance estimates | Franchisor slug and canonical URL |
| Franchisor profile and contacts | Franchisor primary-site flag |
| Packages and operational requirements | Franchisor page layout and copy |
| Locations and assets | Franchisor SEO metadata/intent when modeled |
| Users, roles, subscriptions, entitlements | Franchisor navigation and conversions |
| Leads and audit events | Franchisor deploy/publish state |

Do not add a second brand record because the same brand appears on both domains. Do not let a theme or legacy page become a competing source of truth.

## Public publication contract

A public Franchisor page is eligible to render only when all applicable checks pass:

1. The canonical franchise exists.
2. Its status is not archived or suspended.
3. A `franchise_site_publications` row exists for `site_franchisor_id`.
4. That row has `publication_status = 'published'`.
5. The Franchisor static build has consumed the current D1 state and deployed successfully.

The query shape should be equivalent to:

```sql
SELECT f.*, p.slug, p.canonical_url, p.is_primary, p.first_published_at
FROM franchises AS f
JOIN franchise_site_publications AS p ON p.franchise_id = f.id
WHERE p.site_id = 'site_franchisor_id'
  AND p.publication_status = 'published'
  AND f.status NOT IN ('archived', 'suspended');
```

Validate the result with a shared Zod-compatible schema before rendering.

## Writes and synchronization

“Connected” means changes flow through shared records and explicit site projections; it does not mean every edit is automatically safe to display everywhere.

For a Franchisor-origin create or update:

1. Authenticate with Clerk and authorize through D1.
2. Validate and normalize the input.
3. Create or update the canonical record, using `source_site_id = 'site_franchisor_id'` where supported.
4. Create or update the intended per-site publication rows.
5. Append an audit event containing actor, source site, entity, action, and safe metadata.
6. Enqueue deduplicated `site_rebuild_requests` for every affected site.
7. Let each site's independent publisher rebuild and deploy its own presentation.

Avoid cross-site synchronous HTTP fan-out for normal data changes. Shared D1 state plus a rebuild queue is the established reliability model.

## Static publishing model

D1 mutations do not automatically rebuild Cloudflare Pages. Franchisee.id implements a queue and scheduled poller:

- writes create or refresh a pending rebuild request;
- per-site publish state tracks dirty and pending state;
- a GitHub Actions poller checks the site ID on a schedule;
- it prefers a Pages Deploy Hook and can use a direct `dist` deploy fallback;
- success or retryable failure is written back to D1.

Franchisor.id now contains its separate `d1-static-publish.yaml` workflow scoped to `SITE_ID=site_franchisor_id`. The Pages project, secrets, and deploy hook still require provider-side setup and a live test. The poller must not consume or acknowledge another site's queue rows.

Generated output should not be used as an editable source or committed merely to trigger a deployment.

## Premium Network

The current Premium Network product is documented as Rp3,000,000 per brand per year. Its four publication targets are Franchisee.id, Franchise.id, Franchisor.id, and Waralaba.id.

Free listings are primarily published on Franchisee.id. Premium activation creates or updates publication eligibility across the four network sites and queues their rebuilds. This is an entitlement and orchestration rule—not permission to serve identical pages everywhere.

Franchisor.id should turn eligible shared data into an operator-authority experience: richer brand proof, business support, owner controls, lead handling, and appropriate calls to action. It should avoid thin duplicated SEO pages and should set canonicals intentionally.

## Product flows reused by Franchisor

Franchisee.id already documents and implements a progressive franchisor onboarding model. The canonical concepts include:

- brand and company identity;
- category, origin, establishment year, and operating geography;
- investment components and packages;
- fees, royalty basis, revenue, margin, and break-even estimates;
- site, space, staffing, setup, and support requirements;
- contact and social channels;
- logo, cover, gallery, video, and proposal assets;
- claim/ownership state, verification, and publication readiness;
- Indonesian defaults with optional international-brand country fields.

The ported Franchisor runtime reuses these field meanings and validation rules while presenting an operator-focused interface. Future changes must not invent incompatible columns or redefine financial terms.

## Repository and migration ownership

The shared migration chain currently lives in Franchisee.id and has accumulated many production migrations. Creating a second independent `migrations/` history in Franchisor.id would make ordering and rollback ambiguous.

Until a dedicated network platform repository or shared package is created:

- Franchisee.id owns shared schema migrations.
- Franchisor.id consumes the resulting schema.
- A proposed shared-schema change must be documented and applied at the owner first.
- Franchisor code must tolerate the deployed schema version it targets.
- Cross-repository contract changes must update documentation and tests in both affected repos.

Longer term, shared schemas, identifiers, D1 migrations, and reusable server libraries should move to one explicitly versioned network package or infrastructure repository.

## Legacy Franchisor site

The repository is now a hybrid application. Astro routes, Pages Functions, Clerk integration code, D1 snapshot generation, and shared R2 support coexist with the retained WordPress export. The export remains useful legacy input for design assets, content, routes, and search history; it is not the live network data source.

Migration principles:

- preserve valuable URLs during transition;
- inventory and match legacy brands against canonical D1 identities before importing anything;
- choose whether `/usaha/{slug}` redirects to or remains distinct from `/peluang-usaha/{slug}`;
- generate one authoritative sitemap from the new build;
- keep the implemented functional login/registration routes authoritative and remove only obsolete legacy copies after production verification;
- copy legacy content into the build only when it does not overwrite new routes;
- assign intentional canonical URLs and redirects before removing old files.

## What “done” means

The sites form one working network when:

- one canonical brand update is visible to every eligible site after each independent publish cycle;
- each domain displays only its own published projection;
- one user identity can receive network roles without trusting client claims;
- Premium entitlements create the correct site publications without duplicate franchises;
- audit history identifies the actor and source site;
- legacy URLs resolve or redirect intentionally;
- each site can deploy and fail independently without corrupting shared state.
