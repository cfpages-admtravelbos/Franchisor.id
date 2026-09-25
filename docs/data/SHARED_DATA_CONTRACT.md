# Shared data contract

> Current membership and journey contracts: [rollout plan](../product/NETWORK_MEMBERSHIP_ROLLOUT_PLAN.md) and [user journeys](../product/FRANCHISOR_USER_JOURNEYS.md). This file's July baseline must be reconciled with the current Franchisee migration head before Franchisor writes are enabled.

## Ownership and membership additions — 2026-09-25

- One Premium Network subscription belongs to one canonical `franchise_id`; an account with two brands needs two entitlements unless an explicit discount changes order pricing. Reuse the shared order/subscription lifecycle; never create a Franchisor-only membership silo.
- Existing-brand claim submit creates a pending claim and does not set `owner_user_id`, expose owner leads, or alter public content. New-brand submit creates a private ownerless `pending_review` application. Admin approval requires independent evidence; rejection and stale decisions cannot publish or claim a brand.
- A published owner's public contact, listing, and media changes enter a review proposal. The previous public value remains until admin approval and successful site rebuild. Franchisee migrations `0035`–`0039` own the deployed guard chain; Franchisor's older submit/profile handlers require parity.
- Payment approval, entitlement, publication row, rebuild queue, completed deploy, and verified public URL are separate states. Model each in owner and admin views. A subscription cannot prove a page is live.
- One canonical brand can have site-specific content and SEO intent. Every public read remains scoped to that site's explicit `published` projection; no mass copy of Franchisee publication rows is allowed.
- **Brand-page URL family (2026-09-25):** franchisor.id uses `https://franchisor.id/usaha/{slug}` for legacy and new brands; the other three network sites keep `/peluang-usaha/{slug}/`. See §Canonical URLs and SEO.

Last updated: 2026-07-22

This document is the minimum contract Franchisor.id must obey when reading or writing Franchise Network data. It summarizes the deployed design; the authoritative migration SQL currently lives in `../Franchisee.id/migrations/`.

## Site identity

```ts
export const SITE_ID = "site_franchisor_id";
export const SITE_DOMAIN = "franchisor.id";
export const SITE_ROLE = "franchisor";
```

These literals are centralized in the implemented site configuration. Do not reintroduce scattered or conflicting copies.

## Core entity relationship

```text
network_sites (1) ----< franchise_site_publications >---- (1) franchises
                              site-scoped projection             |
                                                               +---- franchisor_profiles
                                                               +---- franchise_packages
                                                               +---- franchise_assets
                                                               +---- franchise_locations
                                                               +---- leads
```

The publication table has unique constraints for `(franchise_id, site_id)` and `(site_id, slug)`. Therefore one canonical brand has at most one publication per site, and a slug cannot identify two brands on the same site.

## Required public-read rules

- Bind queries to `site_franchisor_id`; never accept an arbitrary public `site_id` parameter for this site's normal pages.
- Require `publication_status = 'published'`.
- Exclude canonical states that are archived or suspended.
- Use the publication slug and canonical URL for Franchisor URLs.
- Treat missing optional fields as absent data, not as zero or fabricated claims.
- Validate database rows before rendering.
- Escape untrusted rich text or pass it through an approved sanitizer.
- Avoid exposing private contact data unless the field is explicitly public.

## Required write rules

- Authenticate the caller and authorize the action in D1.
- Validate request payloads with Zod-compatible schemas.
- Normalize phone numbers, URLs, country codes, money, percentages, and ranges consistently with the shared field dictionary.
- Prefer parameterized D1 statements and grouped/batched writes where atomic consistency is needed.
- Use `source_site_id = 'site_franchisor_id'` for records created from this site where the schema supports attribution.
- Never insert a new canonical franchise until existing brands have been checked by stable ID, normalized name, source identifiers, and relevant contact/company evidence.
- Append `audit_events` for material changes.
- Enqueue rebuilds for all site projections affected by the change.
- Return actionable errors without database internals or credentials.

## Publication state

At minimum, site code must preserve these publication concepts:

- `franchise_id`
- `site_id`
- `slug`
- `canonical_url`
- `publication_status`
- `is_primary`
- first-published and update timestamps

Publication eligibility, publication status, and deploy completion are different states:

```text
subscription/entitlement eligible
              |
              v
publication row created or updated
              |
              v
publication_status = published
              |
              v
site rebuild queued -> built -> deployed
```

UI and APIs should not describe a page as live until the site publication and deployment state support that claim.

## Canonical URLs and SEO

**Decision 2026-09-25 — franchisor.id has its own brand-page family.** Franchisor.id keeps `https://franchisor.id/usaha/{slug}` for **legacy and new brands**, instead of `https://franchisor.id/peluang-usaha/{slug}`. This is deliberate: the retained `/usaha/*` family is the only brand-detail URL that actually serves a page on this domain, and those pages already declare `canonical='/usaha/{slug}'` themselves. Franchisee.id, Franchise.id, and Waralaba.id keep `/peluang-usaha/{slug}/`. One brand, one canonical family per site; never advertise two URL families for the same brand.

Verified against production on 2026-09-25: `/usaha/{slug}` and `/usaha/{slug}/` return the real brand page, while `/peluang-usaha/{slug}` returns the domain's **soft-404 catch-all** (HTTP 200 with the directory home page). Because that catch-all answers every unknown URL with 200, route status alone can never prove a brand page exists.

The Franchisee Premium helper used to format every site as:

```text
https://franchisor.id/peluang-usaha/{slug}/
```

Both copies now map `site_franchisor_id` to `https://franchisor.id/usaha/{slug}`: this repository's `functions/_premium.js`, and `../Franchisee.id/functions/_premium.js` as of 2026-09-26 (`87a4d73`). That cross-repo change matters because Premium activation writes `franchise_site_publications.canonical_url` for all four sites from whichever dashboard runs the approval. It is guarded on both sides — `premium:lifecycle:check` in the owner repository and `ownership:check` here — so the two copies cannot drift apart silently.

Still open in this family: relocating the generated detail route to `usaha/[slug]`, retiring the 34 legacy `/usaha/*` files (they are currently the only working brand pages, because `site_franchisor_id` has zero published rows), generating one authoritative sitemap, the soft-404 fix, and the single slug divergence `/usaha/pisang-molen-m-a` → `/usaha/pisang-molen-ma`. Redirecting that slug before the replacement page is generated would break a working URL. Track these as D.2–D.3 in `../product/NETWORK_MEMBERSHIP_PROGRESS.md`.

Cross-domain pages should have distinct audience value. `is_primary` and `canonical_url` must be used intentionally; do not automatically point every page at Franchisee.id or self-canonicalize duplicates without an SEO decision.

## Identity and roles

Expected network roles include:

- `franchisee`
- `franchisor`
- `admin`
- `staff`

Roles may be network- or site-scoped. D1 is authoritative. A valid Clerk session alone does not grant an administrative or brand-owner action.

Resource authorization should check both role and ownership/assignment. For example, a `franchisor` may edit a franchise only when its profile or an approved claim connects that user to the franchise.

## Premium Network contract

The currently named Premium sites are:

```ts
[
  "site_franchisee_id",
  "site_franchise_id",
  "site_franchisor_id",
  "site_waralaba_id",
]
```

Premium activation can create missing publication rows for those sites. It must not create duplicate canonical franchises. Cancellation or expiry must follow the documented lifecycle rules and retain auditability rather than deleting business history.

## Rebuild queue contract

Writers enqueue site-specific rebuild requests. A Franchisor publisher must:

- query only `site_id = 'site_franchisor_id'`;
- deduplicate equivalent pending requests;
- update the matching site publish state;
- mark success only after its deployment trigger or fallback completes;
- leave retryable failures visible for another attempt;
- never acknowledge Franchisee.id or another domain's requests.

## Schema change protocol

1. Inspect the current migration head and deployed D1 schema in Franchisee.id.
2. Write a forward-only migration in the owner repository.
3. Add validation/backfill and compatibility checks.
4. Apply and verify it through the established Cloudflare account context.
5. Update shared contracts and consumers in both repositories.
6. Roll out readers before writers when compatibility requires it.

Do not add a Franchisor-only table to the shared database without considering naming, ownership, access, retention, audit, and effects on every network consumer.
