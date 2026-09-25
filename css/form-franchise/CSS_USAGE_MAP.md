# Form Franchise CSS usage map

> Current Franchise Network context: [membership rollout](../../docs/product/NETWORK_MEMBERSHIP_ROLLOUT_PLAN.md) and [Franchisor user journeys](../../docs/product/FRANCHISOR_USER_JOURNEYS.md). Historical implementation notes here do not prove production behavior.

Last updated: 2026-07-22 (Asia/Jakarta)

## Current role

The modular form CSS is the active styling baseline for `/daftar/` in the hybrid Astro/Cloudflare application. Keep selectors synchronized with `daftar/index.html` and the flat `js/form-01-*.js` through `js/form-10-*.js` runtime. `css/franchisor-theme.css` loads after application styles and supplies the Franchisor red/ink visual layer.

## Entry points

- Main form bundle: `/css/form-franchise.css`
- Page: `/daftar/index.html` via `<link id="form-daftar-franchise" ...>`
- Runtime class owners: `/js/form-utils.js` and `/js/form-01-*.js` through `/js/form-10-*.js`
- Legacy compatibility marker: `/js/form-franchise.js`; do not add new runtime logic there

## Module ownership

### `01-utilities.css`

- Bootstrap-like spacing, display, alignment, typography, color, validation, and shadow helpers.
- Owns `#autosave-indicator`; its red `#cf322e` styling matches Franchisor.id.
- Used by the page markup and classes added by form validation/state code.

### `02-layout-tabs-steps.css`

- Registration wrapper, role tabs, step indicator, active-step transitions, and navigation buttons.
- Closely coupled to `form-03-navigation-steps.js`, `form-08-franchisee-steps.js`, and `form-10-progressive-franchisor.js`.

### `03-form-core.css`

- Cards, field rows, controls, validation states, telephone/country inputs, outlet choices, calculations, and result panels.
- Used by `form-utils.js`, `form-04-calculation-city.js`, `form-05-country-whatsapp.js`, and `form-06-submit-validation.js`.

### `04-alerts-status.css`

- City autocomplete, general alerts, and claim-mode alert presentation.
- Closely coupled to `form-02-claim-workflow.js` and `form-04-calculation-city.js`.

### `05-packages-responsive.css`

- Package cards, responsive layout rules, badges, and remaining shared utilities.
- Used by package fields in `daftar/index.html` and the progressive form runtime.

### `06-claim-autocomplete.css`

- Claim-brand autocomplete list and suggestion rows.
- Coupled to `#claim-brand-search`, `#claim-search-results`, and `form-02-claim-workflow.js`.

## Change rules

- Preserve import order in `/css/form-franchise.css`; later modules intentionally override earlier rules.
- Update this map when a selector owner or module boundary changes.
- If tab/step markup changes, verify modules 02, 04, and 05 plus form scripts 03, 08, and 10.
- If claim markup changes, verify module 06 and scripts 01/02.
- Run `pnpm run build`; the final `assets:check` verifies that all deployed CSS and nested local assets resolve with exact casing.
