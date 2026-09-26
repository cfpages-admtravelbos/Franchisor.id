# Franchisor.id Astro, Cloudflare Pages, and brand-page delivery plan

Status: implementation handoff, 2026-09-26. This document records reviewed repository behavior and the remaining work. It does not assert that the Astro app is deployed on the production domain. Follow the [rollout tracker](../product/NETWORK_MEMBERSHIP_PROGRESS.md) for gate status, the [provider record](PROVIDER_BOUNDARY_RECORD.md) for dated live evidence, and the [manual setup checklist](MANUAL_SETUP_CHECKLIST.md) for provider settings.

## URL contract and user journey

| Site | Directory and category discovery | Individual brand | Detail canonical |
| --- | --- | --- | --- |
| Franchisee.id | `/peluang-usaha/`, `/peluang-usaha/kategori/{slug}` | `/peluang-usaha/{slug}` | `https://franchisee.id/peluang-usaha/{slug}` (follow that repository's trailing-slash policy) |
| Franchisor.id | `/peluang-usaha/`, `/peluang-usaha/kategori/{slug}`; city and capital archives also remain under this hub | `/usaha/{slug}` | `https://franchisor.id/usaha/{slug}` with no trailing slash |

A visitor opens Franchisor's `/peluang-usaha/` directory, filters the published cards, and follows a card to `/usaha/{slug}`. The detail page, canonical, Open Graph URL, breadcrumb, structured data, sitemap, and any owner or lead link must identify that same detail URL. `/usaha/` is not the directory. `/peluang-usaha/{slug}` is a deprecated brand-detail path only when a published row for that slug exists; it currently emits a `noindex` meta refresh, not an HTTP 301. Preserve `/peluang-usaha/kategori/*`, `/peluang-usaha/kota/*`, and `/peluang-usaha/modal/*` as directory subroutes when designing any redirect.

## Reviewed starting point

- `src/pages/peluang-usaha/index.astro` owns the Franchisor directory; `src/pages/usaha/[slug].astro` owns generated detail pages. Both use `src/lib/franchise-static.ts`. The old `src/pages/peluang-usaha/[slug].astro` emits a browser meta refresh only for rows in the snapshot.
- `scripts/build-d1-franchise-pages.ts` queries the shared D1 database for `site_franchisor_id` rows with `publication_status = 'published'` and excludes inactive canonical brands, then validates and writes the snapshot consumed by Astro. The optional bridge is a separate output path and must follow the same detail URL contract.
- `pnpm run build` runs `build:astro`: ownership and schema checks, D1 snapshot, Astro build, non-overwriting legacy copy, and `assets:check`. `schema:check` currently exits successfully with an explicit SKIP on Node 20 or without the sibling migration chain; a green build alone therefore does not prove that schema check ran.
- The legacy copy retains 34 existing `/usaha/*` pages unless Astro has produced the same output path. A disposable new-slug published-row build proved the generated detail, directory card, ItemList, canonical, and Open Graph URL agreed; it did not prove an existing-slug collision or a deployed response. The dated D1 snapshot had zero Franchisor publication rows. Re-query before using that count.
- The public templates `templates/peluang-usaha-tpl.html` and `templates/detail-franchise-tpl.html` use the retained WordPress/Astra/Elementor assets and `/css/franchisor-theme.css`. Franchisor's red/ink palette, DM Sans/Lexend text, logo, header, footer, card treatment, and mobile behavior are the visual reference. Do not substitute Franchisee's CSS or page shell.

## Work sequence for the implementing harness

### 1. Freeze provider and source state

Record the source commit, GitHub branch, Pages project/account, current production and preview deployment IDs, build command, output directory, production/preview bindings, build variables, runtime secrets by name only, custom domains, and deploy hook. Compare the dashboard with [the provider record](PROVIDER_BOUNDARY_RECORD.md); mark each item verified, absent, or inaccessible. Confirm the production domain's actual content signatures, since the legacy soft-404 returns HTTP 200 for unknown routes. Do not infer Astro deployment from a 200 status or a successful local build.

### 2. Prove one build from the shared data contract

Use the Git-integrated Cloudflare **Pages** project for `cfpages-admtravelbos/Franchisor.id` on the reviewed `main` commit, root at repository root, build command `pnpm run build`, output `dist`, and a supported Node/pnpm pair consistent with `package.json`. Keep Pages dashboard configuration as the production source: this repository intentionally omits `pages_build_output_dir` from `wrangler.toml`. Confirm `CLOUDFLARE_API_TOKEN` is an encrypted Pages build secret with read access to the existing shared D1 database; GitHub Actions secrets do not reach Pages builds. Set `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_D1_DATABASE_ID` for the snapshot query. Bind `franchise_db` and `FRANCHISE_ASSETS` to the existing resources for both Production and Preview, as the checklist names. Do not create a second D1 database, R2 bucket, migration chain, or brand record.

The build must fail visibly if its D1 query or snapshot validation fails; it must not silently publish an empty directory as a successful substitute. Record the source SHA and build log, including the snapshot row count, Astro route count, legacy-copy summary, and `Built asset check passed`. If `schema:check` SKIPs in Cloudflare's Node version, record that as a skip and run its real migration-backed execution in a compatible local/CI environment before relying on its claims. Deploy Pages Functions from `functions/` and verify their bindings separately from the static output.

### 3. Pin the published-row regression proof

Turn the previously hand-run `--from-json` synthetic row into one repeatable, disposable check against the real snapshot → Astro → legacy-copy → asset-check chain. It should include a published new slug, an unpublished slug, and a published slug colliding with a retained legacy `/usaha/*` page. Assert that the new and colliding `dist/usaha/{slug}.html` outputs are generated and show the intended brand rather than the copied legacy HTML; the unpublished slug has no generated public detail or directory card. Assert the directory card and ItemList, detail canonical and Open Graph URL, breadcrumb/JSON-LD, and sitemap agree on `/usaha/{slug}` and never present `/peluang-usaha/{slug}` as the brand canonical. Restore the ordinary D1 snapshot and clean tree after the fixture; do not write synthetic rows to remote D1. A green zero-row build is not this proof.

### 4. Preserve Franchisor's theme and assets

Compare desktop and narrow-screen screenshots of the current legacy directory and one legacy brand page with the Astro-generated directory and generated detail before deployment. Check header, logo, navigation, card grid, typography, colors, spacing, CTA, footer, and the owner/claim states using Franchisor content. The generated pages already inherit WordPress/Astra/Elementor CSS plus `/css/franchisor-theme.css`; inspect the rendered cascade and fix only concrete regressions in Franchisor-owned templates or CSS. Run `pnpm run assets:check` after the full build, then load CSS, fonts, images, JS, and nested CSS URLs on the Pages preview with browser network and console checks. Verify correct MIME types and no HTML fallback at CSS/JS URLs; case-sensitive deployed paths matter. Confirm legacy `/usaha/*` files and the `wp-content/`, `wp-includes/`, `css/`, `js/`, `_astro/`, and `clerk/` assets remain available until their actual consumers are retired.

### 5. Verify routing and SEO on Pages preview, then production

Use a controlled published row and a genuinely unpublished row to test direct navigation, not only links. Verify `/peluang-usaha/` is the directory, `/usaha/{slug}` is the brand, an unknown `/usaha/{slug}` is a real 404 rather than the old directory soft-404, and directory filters/category/city/capital routes still work. Compare final response body, title, canonical, Open Graph URL, JSON-LD, directory card, and sitemap. Test both an existing legacy slug and a newly generated slug on the exact deployed SHA. Decide and implement an HTTP 301 for deprecated `/peluang-usaha/{slug}` only after ensuring directory subroutes cannot be captured; document/test the one known legacy slug correction separately, only after its target exists. A meta refresh must not be reported as a 301.

After provider configuration, prove Pages Functions and Clerk using the [user-journey acceptance matrix](../product/FRANCHISOR_USER_JOURNEYS.md): `/auth-config` returns structured configured data, protected endpoints enforce D1 authorization, and a real shared identity can reach its own profile. Keep preview and production secrets/bindings scoped explicitly. Point custom domains only after preview passes; record production deployment ID/SHA and retest the exact public URLs and asset responses after DNS/cache propagation. Roll back to the last known good deployment if a live route or CSS breaks, retaining the source SHA and failure evidence.

### 6. Close the per-site rebuild loop

Confirm Franchisor-scoped writes enqueue `site_rebuild_requests` for `site_franchisor_id`; the Franchisor poller reads that table, invokes only the Franchisor Pages Deploy Hook, and observes a terminal deployment before marking the site live. A Franchisee-only queue item must not trigger Franchisor deployment. Test a queued change, repeated request, build failure, retry, and successful deployment; distinguish `published` in D1 from deployed/live on Franchisor. Keep the existing Franchisee poller defect and `d1_migrations` ledger gap assigned to the owner repository rather than hiding them under Franchisor's deployment pass. Only after the same brand is live across its intended sites should the owner UI describe exposure as delivered.

## Completion evidence

Attach the fixture command/result, route and asset checks, desktop/mobile comparison, provider setting inventory without secret values, build/deployment SHA, Pages Functions and Clerk smoke results, and queue-to-deployment trace to the [rollout tracker](../product/NETWORK_MEMBERSHIP_PROGRESS.md). Update `CODEBASE.md`, the provider record, manual checklist, and `CHANGELOG.md` when implementation changes their claims. A paid pilot remains gated on the signed-in ownership tests and actual per-site live publication checks.

Official provider references checked on 2026-09-26: [Cloudflare Astro on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/) and [Pages Deploy Hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/). Verify the current dashboard labels during implementation.

## Progress against this plan — 2026-09-26

Steps 1, 2, 5 (deployed half), and 6 still need the Cloudflare dashboard and a real signed-in session.

- **Step 3 (the fixture) is done** in `scripts/check-published-brand-build.mjs`, run with `pnpm run published:check`. It is intentionally not part of `build:astro`, which would recurse. It drives the real chain from a synthetic snapshot and asserts both a new published slug and a published slug colliding with a retained legacy `/usaha/{slug}/` page; the unpublished half lives in `pnpm run schema:check`, which tests the public-read predicate against the real migrations because a `--from-json` row set is already the published set. Proved it can fail by regressing the directory link and observing the assertion.
- **Step 5 (the redirect) is done**: `functions/peluang-usaha/[slug].js` answers `301` to `/usaha/{slug}` when the shared D1 confirms a published Franchisor projection, reserves `kategori`/`kota`/`modal` (and their aliases) so directory subroutes are never captured, and falls through on an unverified slug, a D1 failure, or a non-GET method. The Astro route remains only as a `noindex` fallback. Covered by `pnpm run directory:check`.
- **Step 2's Node requirement is applied**: the Pages build should set `NODE_VERSION=22` (see the checklist) and the direct-deploy workflow now runs Node 22, so `schema:check` executes instead of skipping.
