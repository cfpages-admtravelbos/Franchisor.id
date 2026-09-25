# JavaScript runtime comparison and compatibility notes

> Current Franchise Network context: [membership rollout](../docs/product/NETWORK_MEMBERSHIP_ROLLOUT_PLAN.md) and [Franchisor user journeys](../docs/product/FRANCHISOR_USER_JOURNEYS.md). Historical implementation notes here do not prove production behavior.

Last updated: 2026-07-22 (Asia/Jakarta)

## Current versus legacy paths

| Area | Current production path | Retained legacy/compatibility path |
| --- | --- | --- |
| Form submission | Clerk-authenticated, D1-authorized `/form-submit` Pages Function | Payload names and browser UX retained from the static form |
| Form runtime | Modular `form-01` through `form-10` plus `form-utils.js` | `form-franchise.js` is a non-executing shim |
| Public generation | D1 snapshot → Astro → non-overwriting legacy copy | `build-listing.js`, `build-details.js`, and `build-sitemap.js` remain legacy generators |
| Claim search | Static JSON first, then site-scoped `/get-franchises` fallback | Legacy JSON generation remains available |
| Identity/authorization | Clerk identity plus D1 role/resource checks | Static login has been replaced; no embedded Clerk key fallback |
| Assets | Shared R2 pointers and retained exported assets | WordPress asset tree remains during route/SEO transition |

## Compatibility invariants

- Claim-search sanitization must stay aligned across `form-01-state-helpers.js`, `form-02-claim-workflow.js`, `functions/get-franchises.js`, and any retained JSON generator.
- Browser validation and draft recovery may improve, but server-side validation and authorization remain authoritative.
- `form-09-test-data-generator.js` is explicit test support and must never populate a production form without a deliberate user/test action.
- Legacy `/usaha/*` pages must not be silently duplicated as canonical `/peluang-usaha/*` pages; finish the redirect/canonical inventory first.
- Changes to shared data shapes require coordinated updates to schemas, Functions, Astro generators, focused docs, and the migration-owning Franchisee.id repository when schema changes are involved.

## Remaining migration work

The D1/R2/Clerk/Astro transition is implemented. Remaining JavaScript-related work is live provider verification, final legacy route retirement, and removal of legacy generators only after their remaining consumers are proven absent.
