# Franchisor application port manifest

Last updated: 2026-07-22

> Historical scope record: this manifest describes the 2026-07-22 port and its file-level adaptations. Use `CODEBASE.md`, `docs/README.md`, and current code for present behavior; later documentation-only refreshes are recorded in `CHANGELOG.md` rather than expanding this port inventory.

This is the file-level record for the 2026-07-22 Franchisee-to-Franchisor application adaptation. `added` means a path was introduced relative to the original Franchisor repository; `modified` means an existing legacy path was replaced or updated.

## Post-port deployment hardening

- modified: `customer-cabinet/index.html`
- modified: `daftar/index.html`
- modified: `docs/operations/MANUAL_SETUP_CHECKLIST.md`
- modified: `login/index.html`
- modified: `package.json`
- modified: `projects/index.html`
- added: `scripts/check-built-assets.mjs`
- modified: `scripts/copy-legacy-static.mjs`
- modified: `services/index.html`
- modified: `src/pages/profil/index.astro`
- modified: `templates/detail-franchise-tpl.html`
- modified: `templates/peluang-usaha-tpl.html`
- modified: `wp-content/plugins/unlimited-elements-for-elementor/assets_libraries/owl-carousel-new/assets/owl.carousel.css`
- added: `wp-content/plugins/wpforms-lite/assets/pro/images/times-solid-white.svg`
- modified: `wrangler.example.toml`
- modified: `wrangler.toml`

## .context

- added: `.context/session-20260722-0429.md`
- added: `.context/session-20260722-0523.md`

## .github

- added: `.github/workflows/d1-static-publish.yaml`
- added: `.github/workflows/premium-email-worker.yaml`

## css

- added: `css/auth-clerk.css`
- added: `css/dashboard-auth.css`
- added: `css/dashboard-integration.css`
- added: `css/dashboard-ocr-execution.css`
- added: `css/dashboard-ocr-results.css`
- added: `css/dashboard-ocr-settings.css`
- added: `css/dashboard-ocr.css`
- added: `css/dashboard-operations.css`
- added: `css/dashboard-outreach.css`
- added: `css/dashboard-premium.css`
- added: `css/dashboard-review.css`
- added: `css/dashboard.css`
- added: `css/form-franchise.css`
- added: `css/form-franchise/01-utilities.css`
- added: `css/form-franchise/02-layout-tabs-steps.css`
- added: `css/form-franchise/03-form-core.css`
- added: `css/form-franchise/04-alerts-status.css`
- added: `css/form-franchise/05-packages-responsive.css`
- added: `css/form-franchise/06-claim-autocomplete.css`
- added: `css/form-franchise/CSS_USAGE_MAP.md`
- added: `css/franchise-buyer-tools.css`
- added: `css/franchisor-theme.css`
- added: `css/opportunity-save.css`
- added: `css/premium.css`
- added: `css/profile-analytics.css`
- added: `css/profile-franchisor.css`
- added: `css/profile-premium.css`
- added: `css/profile.css`
- added: `css/shared-tooltip.css`

## customer-cabinet

- added: `customer-cabinet/index.html`

## daftar

- added: `daftar/index.html`

## data

- added: `data/country-metadata.json`

## docs

- added: `docs/architecture/FRANCHISE_NETWORK_CONTEXT.md`
- added: `docs/architecture/FRANCHISOR_BUILD_PLAN.md`
- added: `docs/architecture/OCR_PROVIDER_STRATEGY.md`
- added: `docs/architecture/R2_D1_MIGRATION_RUNBOOK.md`
- added: `docs/data/FRANCHISE_FIELD_DICTIONARY.md`
- added: `docs/data/SHARED_DATA_CONTRACT.md`
- added: `docs/forms/AUTO_SAVE.md`
- added: `docs/forms/CLAIM_TRANSITION_MATRIX.md`
- added: `docs/operations/MANUAL_SETUP_CHECKLIST.md`
- added: `docs/PORT_MANIFEST.md`
- added: `docs/README.md`

## functions

- added: `functions/_analytics.js`
- added: `functions/_clerk-auth.js`
- added: `functions/_contact-normalization.js`
- added: `functions/_country-metadata.js`
- added: `functions/_d1-maintenance.js`
- added: `functions/_dashboard-actions.js`
- added: `functions/_dashboard-ocr-schemas.js`
- added: `functions/_dashboard-outreach-queries.js`
- added: `functions/_dashboard-queries.js`
- added: `functions/_dashboard-review-evidence.js`
- added: `functions/_dashboard-schemas.js`
- added: `functions/_dashboard-utils.js`
- added: `functions/_form-submit-franchisee.js`
- added: `functions/_form-submit-franchisor.js`
- added: `functions/_form-submit-test-actions.js`
- added: `functions/_form-submit-utils.js`
- added: `functions/_google-contacts-oauth.js`
- added: `functions/_google-contacts.js`
- added: `functions/_location-writes.js`
- added: `functions/_ocr-batch-runs.js`
- added: `functions/_ocr-credential-crypto.js`
- added: `functions/_ocr-enrichment-review.js`
- added: `functions/_ocr-job-actions.js`
- added: `functions/_ocr-job-claiming.js`
- added: `functions/_ocr-job-runner.js`
- added: `functions/_ocr-provider-adapters.js`
- added: `functions/_ocr-provider-config.js`
- added: `functions/_ocr-quota-policy.js`
- added: `functions/_ocr-run-lease.js`
- added: `functions/_ocr-scheduler-config.js`
- added: `functions/_ocr-text-store.js`
- added: `functions/_outreach-status.js`
- added: `functions/_premium-email-worker.js`
- added: `functions/_premium-lifecycle.js`
- added: `functions/_premium-notifications.js`
- added: `functions/_premium-ops-utils.js`
- added: `functions/_premium-ops.js`
- added: `functions/_premium-readiness.js`
- added: `functions/_premium-settings.js`
- added: `functions/_premium.js`
- added: `functions/_profile-account.js`
- added: `functions/_profile-franchisee-actions.js`
- added: `functions/_profile-franchisor-actions.js`
- added: `functions/_profile-listing-patch.js`
- added: `functions/_profile-owner-analytics.js`
- added: `functions/_profile-premium.js`
- added: `functions/_profile-read-model.js`
- added: `functions/_profile-recommendations.js`
- added: `functions/_profile-schemas.js`
- added: `functions/_profile-utils.js`
- added: `functions/_proposal-evidence.js`
- added: `functions/_proposal-knowledge.js`
- added: `functions/_proposal-pdf.js`
- added: `functions/_quality-checks.js`
- added: `functions/_shared-schemas.js`
- added: `functions/_site-publish-queue.js`
- added: `functions/_telemetry.js`
- added: `functions/auth-config.js`
- added: `functions/auth-sync.js`
- added: `functions/clerk-webhook.js`
- added: `functions/dashboard-data.js`
- added: `functions/form-submit.js`
- added: `functions/get-franchises.js`
- added: `functions/google-contacts-callback.js`
- added: `functions/google-contacts-start.js`
- added: `functions/ocr-worker.js`
- added: `functions/payment-method-upload.js`
- added: `functions/peluang-usaha/index.js`
- added: `functions/premium-email-worker.js`
- added: `functions/premium-event.js`
- added: `functions/premium-promo.js`
- added: `functions/premium-receipt-upload.js`
- added: `functions/product-event.js`
- added: `functions/profile-data.js`
- added: `functions/profile-upload.js`
- added: `functions/proposal-download.js`
- added: `functions/sync-clerk-metadata.js`
- added: `functions/user-role.js`

## js

- added: `js/auth-clerk-core.js`
- added: `js/auth-clerk-debug.js`
- added: `js/auth-clerk-ui.js`
- added: `js/auth-clerk.js`
- added: `js/auth-navbar.js`
- added: `js/build-details.js`
- added: `js/build-listing.js`
- added: `js/build-sitemap.js`
- added: `js/dashboard-admin.js`
- added: `js/dashboard-google-contacts.js`
- added: `js/dashboard-ocr-batches.js`
- added: `js/dashboard-ocr-jobs.js`
- added: `js/dashboard-ocr-providers.js`
- added: `js/dashboard-ocr-results.js`
- added: `js/dashboard-ocr-schedulers.js`
- added: `js/dashboard-ocr-state.js`
- added: `js/dashboard-ocr-worker.js`
- added: `js/dashboard-ocr.js`
- added: `js/dashboard-operations.js`
- added: `js/dashboard-outreach.js`
- added: `js/dashboard-premium-operations.js`
- added: `js/dashboard-review.js`
- added: `js/dashboard-utils.js`
- added: `js/fetch-json.js`
- added: `js/form-01-state-helpers.js`
- added: `js/form-02-claim-workflow.js`
- added: `js/form-03-navigation-steps.js`
- added: `js/form-04-calculation-city.js`
- added: `js/form-05-country-whatsapp.js`
- added: `js/form-06-submit-validation.js`
- added: `js/form-07-init.js`
- added: `js/form-08-franchisee-steps.js`
- added: `js/form-09-test-data-generator.js`
- added: `js/form-10-progressive-franchisor.js`
- added: `js/form-franchise.js`
- added: `js/form-utils.js`
- added: `js/franchise-buyer-tools.js`
- added: `js/franchise-compare.js`
- added: `js/opportunity-save.js`
- added: `js/premium-page.js`
- added: `js/product-events.js`
- added: `js/profile-account.js`
- added: `js/profile-analytics.js`
- added: `js/profile-franchisee.js`
- added: `js/profile-franchisor.js`
- added: `js/profile-leads.js`
- added: `js/profile-opportunities.js`
- added: `js/profile-page.js`
- added: `js/profile-premium.js`
- added: `js/profile-roles.js`
- added: `js/profile-ui-utils.js`
- added: `js/shared-tooltip.js`
- added: `js/site-promo-bar.js`
- added: `js/symbols_inventory.md`
- added: `js/technical_comparison.md`

## json

- added: `json/country-codes.json`
- added: `json/country-metadata.json`
- added: `json/d1-franchise-static-data.json`
- added: `json/unclaimed-brands.json`

## ogin

- M: `ogin/index.html`

## public

- added: `public/_redirects`

## register

- added: `register/index.html`

## root

- added: `.gitignore`
- added: `.node-version`
- added: `AGENTS.md`
- added: `astro.config.mjs`
- added: `CHANGELOG.md`
- added: `CODEBASE.md`
- added: `package.json`
- added: `pnpm-lock.yaml`
- added: `README.md`
- added: `SUGGESTION.md`
- added: `tsconfig.json`
- added: `wrangler.example.toml`
- added: `wrangler.toml`

## scripts

- added: `scripts/build-d1-franchise-pages.ts`
- added: `scripts/check-auth-client.mjs`
- added: `scripts/check-contact-parser.mjs`
- added: `scripts/check-country-metadata.mjs`
- added: `scripts/check-dashboard-ocr-client.mjs`
- added: `scripts/check-franchise-detail-assets.ts`
- added: `scripts/check-franchise-directory.ts`
- added: `scripts/check-google-contacts.ts`
- added: `scripts/check-ocr-job-runner.ts`
- added: `scripts/check-ocr-provider-config.ts`
- added: `scripts/check-pages-functions-methods.ts`
- added: `scripts/check-premium-lifecycle.ts`
- added: `scripts/check-profile-client.mjs`
- added: `scripts/check-proposal-download.ts`
- added: `scripts/check-proposal-knowledge.ts`
- added: `scripts/check-state-transitions.ts`
- added: `scripts/copy-legacy-static.mjs`
- added: `scripts/d1-page-renderer.ts`
- added: `scripts/d1-static-publish-poller.mjs`
- added: `scripts/enrich-ocr-structured-data.ts`
- added: `scripts/import-csv-to-d1.ts`
- added: `scripts/import-csv-utils.ts`
- added: `scripts/migrate-blogspot-proposals-to-r2.mjs`
- added: `scripts/migrate-ocr-text-to-r2.mjs`
- added: `scripts/shared-csv.cjs`
- added: `scripts/sync-franchise-locations.ts`

## src

- added: `src/components/dashboard/DashboardIntegrationGuide.astro`
- added: `src/components/dashboard/DashboardIntegrationPanel.astro`
- added: `src/components/dashboard/DashboardLeadsPanel.astro`
- added: `src/components/dashboard/DashboardOcrPanel.astro`
- added: `src/components/dashboard/DashboardPremiumPanel.astro`
- added: `src/components/dashboard/DashboardPublicationPanel.astro`
- added: `src/components/dashboard/DashboardReviewPanel.astro`
- added: `src/components/dashboard/DashboardSystemPanel.astro`
- added: `src/components/LegalPage.astro`
- added: `src/env.d.ts`
- added: `src/lib/country-metadata.ts`
- added: `src/lib/franchise-buyer-tools.ts`
- added: `src/lib/franchise-capital.ts`
- added: `src/lib/franchise-category-content.ts`
- added: `src/lib/franchise-category.ts`
- added: `src/lib/franchise-city.ts`
- added: `src/lib/franchise-contact.ts`
- added: `src/lib/franchise-detail-assets.ts`
- added: `src/lib/franchise-detail-scripts.ts`
- added: `src/lib/franchise-detail-styles.ts`
- added: `src/lib/franchise-detail-summary.ts`
- added: `src/lib/franchise-detail-tabs.ts`
- added: `src/lib/franchise-directory-assets.ts`
- added: `src/lib/franchise-directory-client.ts`
- added: `src/lib/franchise-directory-content-styles.ts`
- added: `src/lib/franchise-directory-document.ts`
- added: `src/lib/franchise-directory-styles.ts`
- added: `src/lib/franchise-directory-types.ts`
- added: `src/lib/franchise-field-dictionary.js`
- added: `src/lib/franchise-location-normalization.ts`
- added: `src/lib/franchise-premium-detail.ts`
- added: `src/lib/franchise-ranking.ts`
- added: `src/lib/franchise-static-assets.ts`
- added: `src/lib/franchise-static.ts`
- added: `src/lib/franchise-text.ts`
- added: `src/lib/ocr-provider-metadata.js`
- added: `src/lib/outreach-pipeline.js`
- added: `src/lib/shared-schemas.ts`
- added: `src/pages/alat-franchise/index.astro`
- added: `src/pages/bandingkan/index.astro`
- added: `src/pages/dashboard/index.astro`
- added: `src/pages/peluang-usaha/[slug].astro`
- added: `src/pages/peluang-usaha/index.astro`
- added: `src/pages/peluang-usaha/kategori/[slug].astro`
- added: `src/pages/peluang-usaha/kategori/index.astro`
- added: `src/pages/peluang-usaha/kota/[slug].astro`
- added: `src/pages/peluang-usaha/kota/index.astro`
- added: `src/pages/peluang-usaha/modal/[slug].astro`
- added: `src/pages/peluang-usaha/modal/index.astro`
- added: `src/pages/premium/index.astro`
- added: `src/pages/privacy-policy.astro`
- added: `src/pages/profil/index.astro`
- added: `src/pages/sso-callback/index.astro`
- added: `src/pages/terms-of-service.astro`
- added: `src/shared/franchise-category-route.d.mts`
- added: `src/shared/franchise-category-route.mjs`

## templates

- added: `templates/detail-franchise-tpl.html`
- added: `templates/peluang-usaha-tpl.html`

## wp-content

- added: `wp-content/plugins/analyticswp/Lib/analyticswp.min.js`
- added: `wp-content/plugins/latepoint/public/javascripts/front.js`
- added: `wp-content/plugins/latepoint/public/javascripts/vendor-front.js`
- added: `wp-content/plugins/latepoint/public/stylesheets/front.css`
- added: `wp-content/uploads/2025/09/FnB-KFC.png`
- added: `wp-content/uploads/2025/09/franchise-terbaik.jpg`
- added: `wp-content/uploads/2025/09/franchise.id-favicon-logo.png`
- added: `wp-content/uploads/2025/09/franchise.id-png-min.png`
- added: `wp-content/uploads/2025/09/logo-website-franchise.id_.png`
- added: `wp-content/uploads/2025/09/logo-website-franchise.id-white.png`
- added: `wp-content/uploads/2025/10/Coolio-Barbershop.jpg`
