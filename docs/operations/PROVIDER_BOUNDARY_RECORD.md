# Franchisor.id provider and deployment boundary record (Gate 0)

Next verification sequence: [Astro/Cloudflare brand publishing plan](ASTRO_CLOUDFLARE_BRAND_PUBLISH_PLAN.md). It preserves `/peluang-usaha/` as the directory and `/usaha/{slug}` as the brand detail family while checking D1 builds, theme/assets, and deployment identity. The dated production observations below remain historical until a fresh Pages deployment is verified.

**Fresh anonymous HTTP check, 2026-09-26:** `/auth-config` returned HTTP 200 with the legacy directory title, 333,850 bytes, and canonical `/`; `/peluang-usaha/` returned its directory title, 339,459 bytes, and canonical `/peluang-usaha`; `/usaha/abo-meatshop` returned its brand title, 319,640 bytes, and canonical `/usaha/abo-meatshop`; `/this-does-not-exist-20260926/` returned HTTP 200 with the same legacy directory title, 333,850 bytes, and canonical `/`. This confirms the soft-404 and legacy public surface still exist at the checked time. It does not identify the Pages project or prove whether any preview deployment exists.

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
| Repository | `https://github.com/cfpages-syamsulalam-net/Franchisor.id.git` | ✅ confirmed from `.git/config` |
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
| Workflow repo guard | `GITHUB_REPOSITORY: cfpages-syamsulalam-net/Franchisor.id` | ✅ matches |
| Queue consumer | `scripts/d1-static-publish-poller.mjs` | ✅ code fixed in `eb94f7d` — reads `site_rebuild_requests`, `site_publish_state.daily_publish_count`, writes `error_message`, orders FIFO by `created_at, id`; local tests pass. ⬜ the real GitHub workflow run, deploy hook and production Pages wiring remain unverified. The original `site_publish_requests` defect stays in §3 for chronology, not as a current code blocker |
| `PAGES_DEPLOY_HOOK_FRANCHISOR_ID` | GitHub secret | ⬜ not verified; the local poller no longer blocks it, but no real hook invocation has been observed |
| Direct-deploy fallback | `pnpm run build:astro` + `wrangler pages deploy dist` | ⬜ not verified; its workflow step now runs Node 22 so the `schema:check` gate is real there |
| Build gate | `pnpm run build` runs `ownership:check` then `schema:check` before the D1 snapshot | ⬜ `schema:check` needs Node 22+ (`node:sqlite`) and the sibling `Franchisee.id/migrations` chain; without either it prints SKIP and exits 0, so a green build alone does not prove the schema assertions ran. Set `NODE_VERSION=22` for the Pages build, as the setup checklist now does, to make the gate real in production too |
| Premium email dispatcher | `.github/workflows/premium-email-worker.yaml`, `workflow_dispatch` **only** | ✅ correctly manual-only, matching the "one scheduler" rule; the other repository owns scheduling |
| `PREMIUM_EMAIL_WORKER_SECRET`, `RESEND_API_KEY` | secrets | ⬜ not verified |

Single-dispatcher rule: the rollout plan requires naming the active dispatcher and disabling duplicate scheduled Premium emails across repositories. Franchisor's workflow has no `schedule:` trigger, which satisfies its half; confirm the active scheduler lives in Franchisee.id before enabling sending.

## 6. Blockers and next actions

**Repository moved to match the hosting marker — 2026-09-26.** Syamsul uses the GitHub organization name as his own marker for which Cloudflare account hosts a project, because he hosts many: `cfpages-syamsulalam-net` means the `me@syamsulalam.net` account (the `franchise-network` account, `0ba63b7f…`), and `cfpages-admtravelbos` means the `admtravelbos@gmail.com` account. Franchisor.id must be hosted in `franchise-network` (see below), so the repository was transferred from `cfpages-admtravelbos` to `cfpages-syamsulalam-net` so the marker tells the truth. The old URL redirects. Updated in the same commit: `package.json`, `.github/workflows/d1-static-publish.yaml` (`GITHUB_REPOSITORY`), `scripts/d1-static-publish-poller.mjs` (the `REPOS` allowlist key), and the poller test fixture.

**Which Cloudflare account, and why.** The Pages project **must** be created in the **`franchise-network`** account (`0ba63b7f0096bc267a93fe5c80b1f571`), the same one that holds `franchise_db`, `franchise-assets` and the `franchisee-id` project. Cloudflare bindings are account-scoped: a project can only bind D1/R2 resources in its own account. The build's D1 *REST* query can cross accounts with a token, but a *runtime* `env.franchise_db` / `env.FRANCHISE_ASSETS` cannot — and the Functions depend on both (`_clerk-auth.js`, `profile-data.js`, `dashboard-data.js`, `form-submit.js`, and the `/peluang-usaha/[slug]` redirect). A project in any other account would deploy a public directory and then fail every authenticated call.

This is forced, not preferred: Franchisor.id and Franchisee.id share one database, so they must share one Cloudflare account and therefore one set of nameservers. Their identity separation can be organisational only, unless Franchisor.id is given its own D1 — which would break the shared-platform contract.

The organization name is a **marker, not a mechanism**: it does not itself determine where a project deploys, it just makes placement legible at a glance. That legibility is the reason for the move above, not a technical requirement.

**Gate 2 cannot pass** until all of the following are done by an operator with dashboard access, in this order:

1. ✅ **DONE 2026-09-26.** Project `franchisor-id` created (id `866cd8f9-e5bc-4d73-a253-a96a0d161f7e`, subdomain `franchisor-id-9ar.pages.dev`), Git-integrated to `cfpages-syamsulalam-net/Franchisor.id` on `main`, `build_config` = `pnpm run build` → `dist`, root at the repository root. Created through the API rather than the dashboard, so the settings are exact.
2. ✅ **DONE 2026-09-26.** `franchise_db` and `FRANCHISE_ASSETS` bindings set for **both** Production and Preview, copied verbatim from the working `franchisee-id` project.
3. ✅ **DONE 2026-09-26.** Build variables set for both environments: `NODE_VERSION=22`, `PNPM_VERSION=10.34.1`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID` as plain text, and `CLOUDFLARE_API_TOKEN` as an encrypted `secret_text`. ⬜ The Clerk variables are still unset, which is why `/auth-config` reports `configured: false`; their values are Syamsul's to supply.
4. Configure `franchisor.id` as a Clerk satellite of the shared tenant, add the DNS CNAME, wait for verification, add the allowed redirect origins, and create the `/clerk-webhook` endpoint with its three events.
5. Map `franchisor.id` and `www.franchisor.id` as custom domains with HTTPS active, apex canonical, `www` redirected to apex.
6. Add the GitHub secrets/variables and create the Pages Deploy Hook; store its URL only in the secret.
7. Run one Franchisor-scoped rebuild end to end and confirm the poller's deploy hook actually fires and the row is marked deployed. The local table/column defect is already fixed in `eb94f7d`; what remains unverified is real workflow execution, not the code.
8. Reconcile the `d1_migrations` ledger (§2 of the parity matrix).

Success signals to record after each step: `/auth-config` returns JSON with `configured: true`, `isSatellite: true`, and no secret; `/profil/`, `/dashboard/`, `/premium/`, `/daftar/` render the application rather than the 333,814-byte legacy document; unauthorized API methods return 405 and protected endpoints 401/403; one disposable asset uploads to `franchise-assets` and resolves publicly; one Franchisor-scoped rebuild triggers **only** the Franchisor Pages project.

Until then, this release is `locally validated`, never `deployed`.

## 7. First live deployment and what it proves — 2026-09-26

Deployment `8588ba9d-95c7-4950-9422-97eee771f159`, environment `production`, canonical, commit `d028dea7f599840df28bf2461e8502c92e52a3fd`, branch `main`, `commit_dirty=false`. Stage `deploy/success`. Build log line: `Built asset check passed for 5001 deployed files; all local HTML/CSS asset references resolve with exact casing.` Site: `https://franchisor-id-9ar.pages.dev`.

**Confirmed working (anonymous, no auth):**

| Check | Result |
| --- | --- |
| `/auth-config` | ✅ **156 bytes of JSON** — `{"publishableKey":"","configured":false,"isSatellite":false,…}`. Previously the legacy directory document; the Functions are live and the documented "JSON, never the legacy HTML" signal now holds |
| `/dashboard/` | ✅ 58,400 bytes — the application, not the legacy document |
| `/profil/` | ✅ 2,923 bytes — the application |
| `/premium/` | ✅ 8,684 bytes — the application |
| `/peluang-usaha/` | ✅ 273,474 bytes — the Astro directory page |
| Build pipeline | ✅ `ownership:check` and `schema:check` ran inside the Pages build without failing, at `NODE_VERSION=22` |

**Findings from that deployment, and what has since happened to each:**

1. ⬜ **Still open — unknown URLs answer HTTP 200 with the legacy document instead of a real 404.** `/usaha/definitely-not-a-real-brand-xyz` and `/peluang-usaha/definitely-not-a-real-brand-xyz` both return **200** with 331,549 bytes, byte-identical to `/`. This is the Gate 2 soft-404, confirmed on a live deployment. The planned anonymous "real 404" check therefore fails.
2. ✅ **FIXED 2026-09-26 (`2dd0702`).** Legacy brand URLs no longer 308-redirect to a trailing slash. The 34 legacy pages were exported as `usaha/<slug>/index.html`, so Cloudflare answered `/usaha/<slug>` with a 308 to the slash form while the declared canonical family is `/usaha/{slug}` — meaning every legacy brand served from a URL that contradicted its own canonical. `copy-legacy-static.mjs` now emits those pages flat as `usaha/<slug>.html`, which is also where the Astro-generated brand pages already land (`trailingSlash: "never"`, `build.format: "preserve"`), so the two sources collide on one path and the existing no-overwrite rule still lets the generated page win. Verified live on deployment `f9fd9747` (commit `2dd0702`): `/usaha/abo-meatshop` → **200** (was 308), `/usaha/abo-meatshop/` → **308 to `/usaha/abo-meatshop`** (the correct direction now), `/usaha/al-arashy-tour-travel` → 200. Flattening was proven safe first: the legacy HTML contains **zero** relative asset references (`href`/`src` starting with `../`), so moving it up one directory level cannot break asset resolution. A new gate in `check-built-assets.mjs` fails the build if any brand in the source tree lacks a flat page or if the directory form reappears — it reads the source tree, so it cannot go stale.

Finding 1 is route-level work still deliberately deferred; finding 2 is closed with a build-enforced regression guard.

## 8. Custom domains and runtime variables — state at 2026-09-26

**Custom domains.** `franchisor.id` and `www.franchisor.id` were both added to the Pages project through the API; both report `pending` after several minutes of polling. Public DNS for the apex resolves to Cloudflare-proxied addresses, but **`www.franchisor.id` does not resolve at all** — Cloudflare did not auto-create that record. Finishing this needs capabilities this token does not have: `GET`/`POST` on `/zones/{id}/dns_records` and `/zones/{id}/rulesets` both return **403**, so the token is Pages/D1/Workers-scoped with no Zone DNS or Zone Rules access. Outstanding: create a proxied `www` CNAME to `franchisor-id-9ar.pages.dev` (or grant Zone DNS edit), and create the `www` → apex 301 (needs Zone Rules edit) if the plan's "www redirected to apex" is to be enforced at the edge. If the apex stays `pending`, the Pages custom-domain panel names the exact record it is waiting for.

**Runtime variables — and why they cannot simply be copied from `franchisee-id`.** Syamsul's proposal was to make this project's variables "the same" as `franchisee-id`, on the reasoning that Franchisee.id already holds them. Two independent reasons that does not work:

1. **The values are unreadable.** Cloudflare returns every `secret_text` variable with an **empty value** (`len=0`); only `plain_text` values come back. Verified by reading both projects. There is no API path that copies a secret from one Pages project to another, so each secret must be re-supplied. The names are readable; the values are write-only.
2. **The two sets are not the same, and copying would be wrong for several entries.** `franchisee-id` holds 14 variables; the Franchisor code reads roughly 35. The Clerk **satellite** set has no counterpart on `franchisee-id` at all — `CLERK_PUBLISHABLE_KEY`, `CLERK_DOMAIN`, `CLERK_IS_SATELLITE`, `CLERK_SATELLITE_AUTO_SYNC`, `CLERK_SIGN_IN_URL`, `CLERK_SIGN_UP_URL`, `CLERK_ALLOWED_REDIRECT_ORIGINS`, `CLERK_AUTHORIZED_PARTIES` — so copying the existing list verbatim would still leave `/auth-config` reporting `configured: false`.

Entries that must be **site-specific rather than copied**:

| Variable | Why it must differ |
| --- | --- |
| `CLERK_WEBHOOK_SIGNING_SECRET` | Clerk signing secrets are issued **per webhook endpoint**; the new `/clerk-webhook` endpoint has its own. A copied value would fail signature verification |
| `GOOGLE_CONTACTS_REDIRECT_URI` | Used as `env.GOOGLE_CONTACTS_REDIRECT_URI \|\| ${origin}/google-contacts-callback`. It auto-derives correctly per origin, and the `franchisee-id` value would send the OAuth callback to the **wrong domain** — best left unset |
| `PREMIUM_EMAIL_FROM`, `PREMIUM_EMAIL_REPLY_TO` | Brand-facing sender addresses; reusing Franchisee.id's would send Franchisor mail from the other brand |
| `CLERK_DOMAIN`, `CLERK_*_URL`, `*_ORIGINS`, `*_PARTIES` | Franchisor.id's own satellite identity |

Safe to reuse verbatim (shared provider resources): `FRANCHISE_ASSETS_PUBLIC_BASE_URL` / `R2_PUBLIC_BASE_URL` — they are read as `env.FRANCHISE_ASSETS_PUBLIC_BASE_URL || env.R2_PUBLIC_BASE_URL` and name the one shared R2 asset host, correct for both sites; `RESEND_API_KEY`; `OCR_KEY`, `OCR_SECRET`; `GOOGLE_CONTACTS_CLIENT_ID/_SECRET/_TOKEN_KEY`; `G_PRIVATE_KEY`; `PREMIUM_EMAIL_WORKER_SECRET` if the same worker serves both sites. `CLERK_SECRET_KEY` is the shared tenant secret and is reusable because this site is a satellite of the same tenant.

Nothing was guessed into place: a half-set Clerk configuration would make `/auth-config` claim `configured: true` while sign-in still failed, which is worse than an honest `configured: false`. `/auth-config` currently reports `configured: false`, and that is the accurate state.
