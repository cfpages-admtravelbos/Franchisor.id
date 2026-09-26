# Franchisor.id provider and deployment boundary record (Gate 0)

Next verification sequence: [Astro/Cloudflare brand publishing plan](ASTRO_CLOUDFLARE_BRAND_PUBLISH_PLAN.md). It preserves `/peluang-usaha/` as the directory and `/usaha/{slug}` as the brand detail family while checking D1 builds, theme/assets, and deployment identity. The dated production observations below remain historical until a fresh Pages deployment is verified.

**2026-09-26 correction:** The poller defect described later in §5 was fixed locally in `eb94f7d`: `scripts/d1-static-publish-poller.mjs` now reads `site_rebuild_requests`, and its local tests passed. Actual GitHub workflow execution, Pages bindings, deploy hook, and production publication remain **not verified**. See [rollout code review R4](../product/ROLLOUT_CODE_REVIEW_2026-09-26.md); keep the historical finding for chronology, not as a current code blocker.

Recorded 2026-09-25 (Asia/Jakarta). This is the Gate 0.2 artifact from [the rollout plan](../product/NETWORK_MEMBERSHIP_ROLLOUT_PLAN.md): identify the exact Pages project, production branch, domain mapping, D1/R2 bindings, Clerk tenant/satellite settings, GitHub publisher, email dispatcher, and deployment SHA **without copying secrets**. Status key: ✅ pass · ❌ fail · ⬜ not verified (needs a dashboard or signed-in session).

Every row below is either verified evidence, a named blocker, or explicitly `not verified`. Route status 200 is never treated as readiness.

## 1. Anonymous production route check (2026-09-25)

Method: `GET https://franchisor.id<path>` with no session, no cookies, redirects not followed; recorded status, `Content-Type`, byte length, and `<title>`.

| Route | Status | Content-Type | Bytes | Title | Reading |
| --- | --- | --- | --- | --- | --- |
| `/` | 200 | text/html | 333814 | Direktori Franchise & Peluang Usaha Terlengkap di Indonesia | Legacy directory home |
| `/auth-config` | 200 | **text/html** | 333814 | same legacy title | ❌ Must be a safe JSON response. Currently the legacy HTML fallback |
| `/profil/` | 200 | text/html | 333814 | same legacy title | ❌ Legacy fallback, not the application |
| `/dashboard/` | 200 | text/html | 333814 | same legacy title | ❌ Legacy fallback, not the application |
| `/premium/` | 200 | text/html | 333814 | same legacy title | ❌ Legacy fallback, not the Premium page |
| `/daftar/` | 200 | text/html | 333814 | same legacy title | ❌ Legacy fallback, not the registration flow |
| `/login/` | 200 | text/html | 228577 | Login - Franchisor.id | Legacy login page (distinct size from the fallback) |
| `/usaha/abo-meatshop/` | 200 | text/html | 319638 | Abo Meatshop - Franchisor.id | ✅ Legacy brand page resolves |
| `/peluang-usaha/` | 200 | text/html | 339449 | Cari Franchise / Peluang Usaha - Franchisor.id | Legacy directory listing resolves |
| `/robots.txt` | 200 | text/plain | 115 | — | ⚠️ Declares `Sitemap: https://wp.codev.id/sitemap_index.xml` — a stale legacy sitemap host, not this domain |

Five distinct routes returning the identical 333,814-byte document is conclusive evidence of a legacy catch-all: the ported Astro application and its Pages Functions are **not** serving production. This reproduces the 2026-09-25 review finding and means Gate 2 has not been started, not merely incomplete.

**Soft-404 catch-all:** a deliberately nonexistent path (`/this-does-not-exist-12345/`) also returns **200** with the same 333,814-byte directory home page and `canonical='/'`. The origin therefore answers **every** unknown URL with a 200. Consequences: (a) route status is worthless as a readiness signal on this domain — only content signature and byte length distinguish a real page from the fallback; (b) `/peluang-usaha/{slug}` returns 200 but is **not** a brand page, it is this fallback; (c) this is a real SEO defect that Gate 4 must resolve alongside the legacy redirect map, because soft-404s let crawlers index unlimited nonexistent URLs.

**Verified brand-detail family:** `/usaha/{slug}` and `/usaha/{slug}/` both serve the real brand page (`Abo Meatshop` 319,638 bytes, `Codero` 322,496 bytes), and those pages declare `<link rel="canonical" href="/usaha/{slug}">` — no trailing slash. That matches this site's `trailingSlash: "never"` build and is the family the amended decision adopts for legacy **and** new brands. `/usaha/` itself (no slug) falls through to the catch-all, so there is no `/usaha/` index page today.

## 2. Release identity

| Item | Value | Status |
| --- | --- | --- |
| Repository | `https://github.com/cfpages-admtravelbos/Franchisor.id.git` | ✅ confirmed from `.git/config` |
| Production branch | `main` | ✅ confirmed (`docs/operations/MANUAL_SETUP_CHECKLIST.md`, workflow guard `github.ref_name == github.event.repository.default_branch`) |
| Local HEAD at audit | `8dfadf9a94a01edf3f6bd8888f66b533b4334761` | ✅ this is the release commit for the Gate 1 change set |
| Deployed SHA | unknown | ⬜ anonymous checks cannot read the deployed commit; requires the Pages dashboard |
| Pages project name | `franchisor-id` | ⬜ matches `wrangler.toml` `name`, the poller allowlist, and the manual checklist; not verified in the dashboard |
| Pages production domain | `franchisor.id`, `www.franchisor.id` | ⬜ domain resolves and serves the legacy export, so DNS is pointed somewhere valid; the Pages project mapping itself is unverified |
| Pages deploy mode | hook (expected) | ⬜ `site_publish_state` row for `site_franchisor_id` does not exist yet, so the live `publish_mode` is unset |

## 3. Bindings

| Binding | Expected | Status |
| --- | --- | --- |
| D1 | `franchise_db` → `812cd8ac-edd0-45d9-981f-c9a15358317b` | ✅ the database exists, is reachable, and holds the shared schema (verified read-only this session). Whether the *Pages project* declares the binding is ⬜ |
| R2 | `FRANCHISE_ASSETS` → `franchise-assets` | ⬜ not verified from here |
| `assets.franchisee.id` public base | shared R2 hostname by design | ⬜ not verified |
| `pages_build_output_dir` | deliberately absent | ✅ confirmed absent from both TOML files (dashboard remains the production config source) |
| `CLOUDFLARE_API_TOKEN` | Pages build secret | ⬜ not verified |

## 4. Identity (Clerk)

| Item | Expected | Status |
| --- | --- | --- |
| Tenant | shared Clerk tenant, franchisor.id as a **satellite** | ⬜ requires the Clerk dashboard |
| `PUBLIC_CLERK_PUBLISHABLE_KEY` | configured in Pages | ⬜ `/auth-config` returns HTML, so nothing can be read from it |
| `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SIGNING_SECRET` | set as secrets | ⬜ never retrievable; presence cannot be inferred |
| `CLERK_AUTHORIZED_PARTIES` | `https://franchisor.id,https://www.franchisor.id` | ⬜ |
| `CLERK_IS_SATELLITE`, `CLERK_DOMAIN`, sign-in/sign-up URLs | per manual checklist | ⬜ |
| Webhook `/clerk-webhook` | `user.created|updated|deleted` | ⬜ |
| Cross-domain sign-in by identity | one Clerk identity ↔ one D1 user | ⬜ cannot be tested without the app being served |

Local code does enforce the safe pattern — `functions/_clerk-auth.js` verifies the bearer token against `CLERK_AUTHORIZED_PARTIES`, resolves roles from D1 (`user_roles`), and treats admin/staff as supersets. Clerk proves identity; D1 authorizes. That is ✅ at the code level and ⬜ at the deployment level.

## 5. Publisher and dispatcher

| Item | Value | Status |
| --- | --- | --- |
| Publish workflow | `.github/workflows/d1-static-publish.yaml`, cron `7,37 * * * *`, `SITE_ID=site_franchisor_id` | ✅ code present and site-scoped |
| Workflow repo guard | `GITHUB_REPOSITORY: cfpages-admtravelbos/Franchisor.id` | ✅ matches |
| Queue consumer | `scripts/d1-static-publish-poller.mjs` | ✅ code fixed in `eb94f7d` — reads `site_rebuild_requests`, `site_publish_state.daily_publish_count`, writes `error_message`, orders FIFO by `created_at, id`; local tests pass. ⬜ the real GitHub workflow run, deploy hook and production Pages wiring remain unverified. The original `site_publish_requests` defect stays in §3 for chronology, not as a current code blocker |
| `PAGES_DEPLOY_HOOK_FRANCHISOR_ID` | GitHub secret | ⬜ not verified; the local poller no longer blocks it, but no real hook invocation has been observed |
| Direct-deploy fallback | `pnpm run build:astro` + `wrangler pages deploy dist` | ⬜ not verified |
| Premium email dispatcher | `.github/workflows/premium-email-worker.yaml`, `workflow_dispatch` **only** | ✅ correctly manual-only, matching the "one scheduler" rule; the other repository owns scheduling |
| `PREMIUM_EMAIL_WORKER_SECRET`, `RESEND_API_KEY` | secrets | ⬜ not verified |

Single-dispatcher rule: the rollout plan requires naming the active dispatcher and disabling duplicate scheduled Premium emails across repositories. Franchisor's workflow has no `schedule:` trigger, which satisfies its half; confirm the active scheduler lives in Franchisee.id before enabling sending.

## 6. Blockers and next actions

**Gate 2 cannot pass** until all of the following are done by an operator with dashboard access, in this order:

1. Confirm the `franchisor-id` Pages project exists, is Git-integrated on `main`, builds with `pnpm run build`, outputs `dist`, and is **not** a Direct Upload project (Pages Functions require Git integration).
2. Add the D1 `franchise_db` and R2 `FRANCHISE_ASSETS` bindings for Production **and** Preview; confirm they appear in a deployment's Functions view.
3. Add the Pages build variable `NODE_VERSION=20.19.4`, `PNPM_VERSION=10.34.1`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID`; the encrypted `CLOUDFLARE_API_TOKEN`; and the Clerk variables listed in `docs/operations/MANUAL_SETUP_CHECKLIST.md`.
4. Configure `franchisor.id` as a Clerk satellite of the shared tenant, add the DNS CNAME, wait for verification, add the allowed redirect origins, and create the `/clerk-webhook` endpoint with its three events.
5. Map `franchisor.id` and `www.franchisor.id` as custom domains with HTTPS active, apex canonical, `www` redirected to apex.
6. Add the GitHub secrets/variables and create the Pages Deploy Hook; store its URL only in the secret.
7. Run one Franchisor-scoped rebuild end to end and confirm the poller's deploy hook actually fires and the row is marked deployed. The local table/column defect is already fixed in `eb94f7d`; what remains unverified is real workflow execution, not the code.
8. Reconcile the `d1_migrations` ledger (§2 of the parity matrix).

Success signals to record after each step: `/auth-config` returns JSON with `configured: true`, `isSatellite: true`, and no secret; `/profil/`, `/dashboard/`, `/premium/`, `/daftar/` render the application rather than the 333,814-byte legacy document; unauthorized API methods return 405 and protected endpoints 401/403; one disposable asset uploads to `franchise-assets` and resolves publicly; one Franchisor-scoped rebuild triggers **only** the Franchisor Pages project.

Until then, this release is `locally validated`, never `deployed`.
