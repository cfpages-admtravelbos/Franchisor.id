# JavaScript symbols and ownership inventory

> Current Franchise Network context: [membership rollout](../docs/product/NETWORK_MEMBERSHIP_ROLLOUT_PLAN.md) and [Franchisor user journeys](../docs/product/FRANCHISOR_USER_JOURNEYS.md). Historical implementation notes here do not prove production behavior.

Last updated: 2026-07-22 (Asia/Jakarta)

This document maps the browser runtime in `/js`. The production data path is now D1/Clerk/R2 through Cloudflare Pages Functions; Google Sheets remains only in isolated legacy generator/fallback code.

## Form runtime

| File | Current ownership |
| --- | --- |
| `form-01-state-helpers.js` | `window.FranchiseForm` state/constants/helpers, 72-hour franchisor draft, claim state, and claim-search sanitization. |
| `form-02-claim-workflow.js` | Unclaimed-brand dataset/API fallback, claim autocomplete, claim fill/reset. |
| `form-03-navigation-steps.js` | Role tabs plus franchisor next/back/validation navigation. |
| `form-04-calculation-city.js` | Investment/BEP calculations and city autocomplete. |
| `form-05-country-whatsapp.js` | Country data/flags and WhatsApp normalization. |
| `form-06-submit-validation.js` | Live validation, browser draft hooks, and authenticated submission to the D1-backed `/form-submit` Function. |
| `form-07-init.js` | DOM bootstrap, saved-state restoration, compatibility globals. |
| `form-08-franchisee-steps.js` | Franchisee-side step flow present on the shared registration page. |
| `form-09-test-data-generator.js` | Explicit test-data helpers; must not run implicitly in production. |
| `form-10-progressive-franchisor.js` | Progressive franchisor field/step behavior. |
| `form-utils.js` | Shared formatting, cleaning, progress, highlighting, error, and field-validation helpers. |
| `form-franchise.js` | Non-executing legacy shim. Do not restore monolithic logic here. |

`/form-submit` authenticates with Clerk and authorizes the operation against D1 roles/ownership. It is not a Google Sheets submission endpoint.

## Auth, profile, dashboard, and feature clients

- `auth-*.js` and `clerk-*.js` coordinate explicit runtime Clerk configuration, browser auth, and session sync. There is no hard-coded publishable-key fallback.
- Profile/customer-cabinet scripts call protected Pages Functions and rely on server-side D1 authorization.
- Dashboard, Premium, proposal, Google Contacts, publishing, and OCR clients are UI clients for the corresponding Functions; client state never grants authorization.
- OCR provider credentials are masked/encrypted server-side and must never be logged or embedded in browser code.

## Legacy build scripts

`build-listing.js`, `build-details.js`, and `build-sitemap.js` are retained legacy generators. `build-listing.js` still contains a Google Sheets/CSV fallback and can produce claim-search data, but these files are not the production Astro build path.

The production path is:

1. `scripts/build-d1-franchise-pages.ts` reads published `site_franchisor_id` snapshots.
2. Astro builds application routes.
3. `scripts/copy-legacy-static.mjs` copies retained static files without overwriting Astro routes.
4. `scripts/check-built-assets.mjs` validates deployed HTML/CSS asset references.

## Guardrails

- Keep the form runtime modular across files 01–10.
- Keep shared validators/formatters in `form-utils.js`.
- Preserve `site_franchisor_id` scoping and server authorization when changing browser requests.
- Treat Sheets access as legacy fallback code, not a new source of truth.
- Update this file, `CODEBASE.md`, and `CHANGELOG.md` when module ownership changes.
