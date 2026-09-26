# One membership, four network sites: Franchisor.id rollout plan

Reviewed 2026-09-25 against the current local `Franchisee.id` and `Franchisor.id` repositories and anonymous responses from `https://franchisor.id`. This is a delivery plan, not a claim that the Franchisor application is live. Start with [the user journeys](FRANCHISOR_USER_JOURNEYS.md), then use the [network context](../architecture/FRANCHISE_NETWORK_CONTEXT.md) and [shared data contract](../data/SHARED_DATA_CONTRACT.md) for implementation.

> **Progress tracker:** [network membership rollout progress](NETWORK_MEMBERSHIP_PROGRESS.md) — status key ⬜ pending · 🔄 in progress · ✅ done · ⚠️ blocked · 🛑 excluded.

## Outcome and offer

An authorized brand owner pays for **one Premium Network membership for one brand/listing** and receives eligibility for useful, audience-specific exposure on Franchisee.id, Franchise.id, Franchisor.id, and Waralaba.id. The current shared code sets a base price of **Rp3.000.000 per brand per year** (`Franchisee.id/functions/_premium.js`); a second brand needs its own membership unless an explicit campaign or discount rule applies. One account may manage more than one brand. Payment does not prove brand ownership, listing accuracy, page readiness, successful deployment, traffic, leads, or sales. Promise exposure only after each eligible site's public page is actually deployed.

Franchisee.id remains the buyer-facing discovery and shared-platform reference. Franchisor.id becomes the operator-facing place to understand the membership, register or claim a brand, complete its profile, submit payment, inspect network publication, and work leads. Both sites use the same canonical D1 brand, user, subscription, order, lead, and audit records. Each domain keeps its own presentation, SEO intent, URLs, and publication/deployment state. Initially, consequential claim, new-brand, owner-edit, and payment decisions should have one admin decision path in the shared platform; a Franchisor dashboard may display or invoke it only after it enforces the same current contract.

## Evidence and current boundary

| Surface | Observed 2026-09-25 | Consequence |
| --- | --- | --- |
| Shared offer | Franchisee Premium code has `PREMIUM_BASE_AMOUNT = 3000000` and four site IDs; its plan records one brand per membership and a manual unique-code transfer flow. | Reuse one order/subscription lifecycle. Do not sell a second Franchisor-only membership. |
| Franchisor repository | Astro routes, Pages Functions, D1/R2 integration, profile/dashboard, Premium, and a site-scoped publisher were ported in July. | Treat this as a locally implemented baseline requiring fresh parity checks, not a blank build. |
| Live Franchisor domain | `/` served the legacy directory title. `/auth-config` returned `text/html` containing legacy HTML; `/profil/`, `/dashboard/`, and `/premium/` served legacy-home HTML. | The current domain does not prove that the ported app, authentication, protected endpoints, or membership journey are deployed. Recheck at launch. |
| Ownership trust | Franchisor's older `functions/_form-submit-franchisor.js` assigns `owner_user_id` on an existing-brand claim. Franchisee's current path creates a pending claim; new brands stay private in `pending_review`; owner public edits await admin review. Shared D1 migrations `0035`–`0039` guard those states. | **P0:** align every Franchisor write and admin review path with deployed shared D1 rules before enabling real users. Do not copy the old handler into production. |
| Publication | `franchise_site_publications` owns per-site visibility. D1 writes enqueue site rebuilds; each site must build and deploy independently. | Entitlement, publication row, queued build, and live URL must be shown as separate states. |
| Production evidence | Franchisor's July setup checklist recorded provider-side Cloudflare and Clerk work as pending. Anonymous route checks do not establish the current provider configuration or signed-in behavior. | Audit current settings and run controlled identity, payment, ownership, and publish tests on the exact release commit. |

## Product contract and decision record

| Decision | Adopt for this rollout | Verify or decide before charging a customer |
| --- | --- | --- |
| Membership unit | One subscription covers one canonical `franchise_id`, not all brands under an account. | Confirm offer copy, invoice, and admin UI all name the selected brand. |
| Price and term | Reuse the current Rp3.000.000/year base and manual payment order; admin settings may change a promotion or discount. | Verify current production settings before publishing an exact payable amount. A gateway remains a separate future decision. |
| Free presence | A free/unclaimed directory presence on Franchisee.id is distinct from paid network distribution. | Verify which sites may retain a free or historical publication row before expiry; never mass-hide by assumption. |
| Ownership | Authenticated registration, NIB/HAKI entry, payment, or a complete form never grants owner authority. Existing claims and new brands require the current independent admin review; public trust-sensitive edits require owner-edit review. | Align Franchisor runtime and its review UI/API with migrations `0035`–`0039`, then test competing accounts. |
| Activation | A valid approved payment creates a subscription and eligible site projections; site publication still requires owner authority, accurate public data, appropriate content, and a successful site build. | The current Franchisee plan allows payment before completeness and describes readiness warnings. Freeze the minimum public-readiness gate and the treatment of paid-but-not-ready days before launch. Do not silently promise instant publication. |
| Operations owner | Reuse one shared payment/ownership decision and email scheduler while Franchisor parity is proven. | Name the active dispatcher and disable duplicate scheduled Premium emails across repositories. |
| SEO | Each domain needs distinct intent and useful content; a publication row is not permission to clone the buyer page. | Approve Franchisor `/usaha/*` versus `/peluang-usaha/*` redirect/canonical map before broad indexing. |

**Recommended first-launch policy:** invite a pilot owner to pay only after ownership and a minimum publishable listing are approved. For that ready brand, keep the existing payment-approval term start. Existing paid-but-not-ready orders need an explicit support resolution and owner-visible term before they are used as pilot evidence. This narrows the first launch without silently rewriting the current shared subscription lifecycle; Syamsul can approve a broader pay-before-readiness policy separately after seeing actual fulfillment time.

## Delivery sequence

### Gate 0 — freeze a current contract and release boundary — ⚠️ partial after 2026-09-26 review

The 34 legacy `/usaha/*` paths were matched to canonical brand IDs, but no Franchisor publication rows existed at the dated snapshot, so the publication-row part of Gate 0.3 remains open. See [review R3](ROLLOUT_CODE_REVIEW_2026-09-26.md) and the [progress tracker](NETWORK_MEMBERSHIP_PROGRESS.md). No row should be created merely to make this document appear complete.

1. Compare Franchisor's July port against current Franchisee auth, new-brand, claim, owner-edit, Premium, publication, privacy, and dashboard-account paths. Treat the shared D1 migration head and current code as authority over old port notes. Record a parity matrix: feature, Franchisor file, shared dependency, current behavior, gap, owner, and check.
2. Identify the exact Cloudflare Pages project, production branch, domain mapping, D1/R2 bindings, Clerk tenant/satellite settings, GitHub publisher, email dispatcher, and deployment SHA without copying secrets. Record `pass`, `fail`, or `not verified`; do not infer readiness from route status 200.
3. Match every retained `/usaha/*` legacy brand to a canonical `franchises.id` and a Franchisor publication row. Mark unmatched and ambiguous entries; do not import duplicates.

**Gate passes when:** the release has an exact commit, no unresolved ownership or duplicate-brand path, and each required provider setting has evidence or a named blocker.

### Gate 1 — protect shared identity and ownership — ✅ code done 2026-09-25; ⚠️ signed-in tests pending

1. Use the same Clerk identity tenant only with verified Franchisor origins/callbacks and server-side D1 authorization. A user may carry both buyer and franchisor roles; a role alone cannot edit a brand without approved ownership.
2. Port the current brand-match, pending claim, private new-brand review, rejected resubmission, and pending owner-edit proposal contracts into Franchisor handlers and UI. Keep existing public values and lead access unchanged until approval. Do not duplicate Franchisee's migration chain in this repo.
3. Test signed-out, expired, wrong-role, wrong-owner, two-applicant, duplicate, stale decision, rejected resubmission, and direct API paths against the deployed shared schema. Give applicants a clear pending/rejected next step without exposing another applicant's details.

**Gate passes when:** a disposable applicant cannot take over an existing brand, publish a new brand, change public contact/media, or see its leads before an independently evidenced admin decision; current Franchisee behavior still passes.

### Gate 2 — make the Franchisor application reachable — ⬜ pending

1. Deploy the adapted app from its reviewed commit with the existing `pnpm run build` and asset check. Bind the shared D1/R2 resources to the Franchisor Pages project. Set the build D1 read token and runtime secrets in Cloudflare, never in Git.
2. Configure the Clerk satellite/origin/callback/webhook path supported by the current tenant plan. Verify cross-domain sign-in by account identity, not by an assumption that browser cookies are shared.
3. Replace legacy login/profile/dashboard/Premium route fallbacks only after the new routes and assets pass; preserve valuable legacy URLs through an explicit redirect/canonical map.

**Gate passes when:** `/auth-config` is a safe JSON response on the production domain, protected routes render the application, unauthorized APIs reject access, and the configured D1/R2 and Clerk paths work on the same deployed SHA.

### Gate 3 — sell and fulfill one membership — 🔄 partial

1. Show the offer, term, selected brand, included network sites, readiness work, and manual payment steps in plain Indonesian. Do not claim a site is live when it is merely eligible or queued.
2. Reuse the existing shared order, unique-code amount, confirmation/proof upload, admin review, subscription activation, renewal, expiry, and audit event lifecycle. A retry must not create two active orders or subscriptions for the same brand/term.
3. Give the owner a per-site state list: **not eligible**, **needs work**, **queued**, **published in data**, **deployment pending**, **live** (verified URL), or **failed; action needed**. Show the next actor and action for each blocked state. Distinguish membership term from publication completion.
4. Keep a single Premium email scheduler and source-attributed notifications. A Franchisor-origin order should be visible to the authorized owner and to the one admin review queue.

**Gate passes when:** one controlled order moves through pending, confirmation, admin approval or rejection, subscription, site publication, rebuild, deployment, owner receipt, renewal, and expiry with consistent records and no second payment.

### Gate 4 — create distinct network exposure and useful owner work — 🔄 partial

1. Publish only explicit `published` Franchisor rows for active canonical brands. Present operator-facing proof, support, requirements, and partnership model on Franchisor.id; preserve buyer-facing comparison, inquiry, and matching intent on Franchisee.id. Define the distinct purpose for Franchise.id and Waralaba.id before treating their URLs as delivery.
2. Keep the owner profile, media/proposal, lead inbox, analytics, and per-site publication dashboard tied to the shared brand ID. Protect lead and contact data by owner scope and consent. Use honest labels for measured views, inquiries, saves, and contact clicks; never promise leads or ROI.
3. Follow each affected site's rebuild request to its own successful deployment. A failure on one site remains visible and retryable without falsely marking the other sites failed or live.

**Gate passes when:** an approved test brand has audience-specific pages at every included site, each URL and canonical is intentional, the owner sees the actual per-site state, and buyer inquiries reach only the approved owner.

### Gate 5 — limited launch, recovery, and scale — ⬜ pending

1. Start with disposable or explicitly consenting pilot brands, one controlled membership, and a reversible content change. Test browser desktop/mobile, old URLs, both identity roles, payment failure, site build failure, and renewal/expiry before public sales copy promises network exposure.
2. Record baseline and pilot evidence per brand/site: membership state, publication row, deployed URL and SHA, first-party events, inquiry receipt, owner response, and open support issue. Choose success thresholds only after observing real traffic and support load.
3. Roll out to more brands only after the operator can recover from an unpaid order, a rejected claim, a stale session, an incomplete listing, a failed site deploy, and a subscription expiry without manual database edits.

**Gate passes when:** the acceptance matrix in [the journey document](FRANCHISOR_USER_JOURNEYS.md) is recorded on the deployed release, the pilot support runbook names owners, and no customer is shown a false live or ownership state.

## Dependency order and exclusions

Trust and live deployment precede membership marketing. Shared schema changes, if needed, are designed and migrated through Franchisee.id; Franchisor readers must tolerate the deployed schema during rollout. A payment gateway, automated editorial article, social campaign, guaranteed ranking, guaranteed leads, and new network sites are outside this first release. They require separate decisions and evidence. The existing manual transfer and four named sites are the starting contract, not proof every site is already deployed.

## Verification ledger for each release

For every gate record the repository commit and remote ref, relevant shared migration head, local checks, production deployment identifier, sanitized D1 row IDs, tested persona and role, expected versus observed result, owner of a failed step, and date. Use the Franchisor launch checklist and Franchisee's [controlled account QA](https://github.com/cfpages-syamsulalam-net/Franchisee.id/blob/main/docs/product/AUTH_AND_DASHBOARD_QA.md) together. Never store secrets, personal leads, or real payment proof in Markdown.
