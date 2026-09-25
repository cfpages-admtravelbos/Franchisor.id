# Franchisor.id ↔ shared platform parity matrix (Gate 0)

Recorded 2026-09-25 (Asia/Jakarta) against repository code, the local `../Franchisee.id` authority checkout, and **read-only** live D1 queries on `franchise_db`. This is the Gate 0 artifact required by [the rollout plan](NETWORK_MEMBERSHIP_ROLLOUT_PLAN.md). Status key: ✅ aligned · 🔄 fix in progress · ⚠️ gap · 🛑 excluded from this release.

Authority order used: deployed D1 schema and triggers → `../Franchisee.id` current handlers → this repository's code → July port notes.

## 1. Ownership, membership, and publication parity

| Feature | Franchisor.id file | Shared dependency | Current behavior in this repository | Gap | Owner | Check | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Existing-brand claim submit | `functions/_form-submit-franchisor.js` | `franchise_claims`, `guard_franchise_claim_pending` | Inserts `franchise_claims` with hardcoded `'approved'` **and** stamps `reviewed_at` at submit time; `UPDATE franchises SET owner_user_id = …` in the same batch | Ownership and public publication granted with no independent admin decision | Franchisor.id | `ownership:check` | ✅ |
| Claim target guard | `functions/_form-submit-franchisor.js` | `guard_franchise_claim_pending` (0035) | No `NOT EXISTS (pending)` pre-check and no `unclaimed`/`UNCLAIMED` predicate in the insert | Concurrent applicants can open parallel claims; guard is bypassed because the row is inserted as `approved`, not `pending` | Franchisor.id | `ownership:check` | ✅ |
| New-brand submit | `functions/_form-submit-franchisor.js` | `franchises`, `franchise_submission_reviews`, `idx_pending_new_brand_name` | Binds `owner_user_id = actor.id`, `status='free'`, `verification_tier='free'` | Brand is owned and public before any review; `idx_pending_new_brand_name` never applies, so duplicate brands remain possible | Franchisor.id | `ownership:check` | ✅ |
| New-brand publication | `functions/_form-submit-franchisor.js` | `franchise_site_publications`, `guard_unreviewed_brand_publication_insert` | Inserts the publication row directly as `'published'` with `is_primary = 1` | Public page created with no review; guard not triggered because no non-approved review row exists | Franchisor.id | `ownership:check` | ✅ |
| New-brand review record | — (absent) | `franchise_submission_reviews` (0037) | No `franchise_submission_reviews` row is ever written | The review object the guards key on does not exist, so every 0037 guard is inert | Franchisor.id | `ownership:check` | ✅ |
| Brand-submission review | — (absent) | `franchise_submission_reviews` decision trigger (0038) | No `handleReviewBrandSubmission` handler at all | Approval/rejection of a new brand is impossible through the UI/API | Franchisor.id | `ownership:check` | ✅ |
| Claim review | `functions/_dashboard-actions.js` | `franchise_claims` | `handleReviewClaim` waits on `fc.status = 'pending'` | Dead path: nothing can create a `pending` claim, so the queue is permanently empty | Franchisor.id | `ownership:check` | ✅ |
| Claim review pre-checks | `functions/_dashboard-actions.js` | 0035 triggers | No owner-conflict pre-check and no required-review-notes check before approval | A stale or conflicting approval is not rejected with a clear reason | Franchisor.id | `ownership:check` | ✅ |
| Owner listing edit (published) | `functions/_profile-franchisor-actions.js` | `listing_edit_suggestions`, `guard_owner_edit_review_decision` (0039) | Plain `UPDATE franchises SET …` on the live public row, gated only by a 6-hour rate limit | Public values change immediately with no review; 0039 guard is never exercised | Franchisor.id | `ownership:check` | ✅ |
| Owner profile/contact edit (published) | `functions/_profile-franchisor-actions.js` | `franchisor_profiles` | Direct write to the shared profile row | Contact and identity changes go public without review | Franchisor.id | `ownership:check` | ✅ |
| Owner media upload (published) | `functions/profile-upload.js` | `franchises.logo_url` / `cover_url` / `proposal_url` | Direct `UPDATE franchises SET <column> = ?` | Media changes go public without review | Franchisor.id | `ownership:check` | ✅ |
| Owner-edit proposal store | — (absent) | `listing_edit_suggestions` | No `_profile-owner-review.js`; `queueOwnerReview` does not exist | Owner edits cannot even be expressed as a proposal | Franchisor.id | `ownership:check` | ✅ |
| Owner-edit review | `functions/_dashboard-actions.js` | 0039 decision trigger | `handleReviewEditSuggestion` has no owner-review branch, no `OWNER_REVIEW_STALE` re-check, no `franchisor_profile` path | A pending owner proposal could never be applied; no staleness protection | Franchisor.id | `ownership:check` | ✅ |
| Public read scoping | `functions/get-franchises.js` | `franchise_site_publications` | `p.site_id = 'site_franchisor_id' AND p.publication_status = 'published'`, archived/suspended excluded via the row contract | None found | — | existing `*:check` | ✅ |
| Legacy copy bridge | `scripts/copy-legacy-static.mjs` | — | Copies legacy files into `dist` with no-overwrite semantics | None found | — | `assets:check` | ✅ |
| Rebuild queue writer | `functions/_site-publish-queue.js` | `site_rebuild_requests`, `site_publish_state` | Writes deduplicated `site_rebuild_requests` + `site_publish_state` keyed by `site_id` | None found | — | `state-transitions:check` | ✅ |
| Premium order lifecycle | `functions/_profile-premium.js` | `premium_orders`, unique-code amounts | Reuses a live order instead of creating a duplicate; `payment_before_readiness` distinct from an active subscription | None found | — | `premium:lifecycle:check` | ✅ |
| Premium activation | `functions/_dashboard-actions.js` | `franchise_subscriptions`, `franchise_site_publications` | Admin approval creates the subscription and `INSERT OR IGNORE` published rows for the four network sites | None found | — | `premium:lifecycle:check` | ✅ |
| Rebuild poller (queue consumer) | `scripts/d1-static-publish-poller.mjs` | `site_rebuild_requests` | Now reads `site_rebuild_requests`, `site_publish_state.daily_publish_count`, and writes `error_message`; orders the FIFO queue by `created_at, id` instead of numerically coercing a TEXT id | Fixed in Franchisor.id 2026-09-25; the byte-identical Franchisee.id copy still needs the same correction | Franchisor.id (+ Franchisee.id copy) | `state-transitions:check`, `test-d1-static-publish-poller.mjs` | ✅ |
| Per-site publication state UI | `src/components/dashboard/DashboardPublicationPanel.astro` | `franchise_site_publications` | Shows per-franchise×site `draft/published/hidden/archived` and site-wide aggregate queue counts | No per-brand list of *eligible → needs work → queued → published in data → deployment pending → live → failed*; journeys step 8 and Gate 3.3 unmet | Franchisor.id | manual | ⚠️ |
| Canonical brand URL family | `_premium.js`, `src/pages/peluang-usaha/[slug].astro` | `franchise_site_publications.canonical_url` | The contract maps `site_franchisor_id` to `https://franchisor.id/usaha/{slug}` in **both** repositories; handler writes, owner/dashboard/lead links, and the read models were moved to that family | Decision 2026-09-25: franchisor.id uses `/usaha/{slug}` (no trailing slash) for legacy **and** new brands. Cross-repo copy done 2026-09-26 (`Franchisee.id` `87a4d73`, guarded by `checkPerSiteCanonicalFamilies()`). The generated detail route relocation, sitemap, and legacy retirement are deferred — see the tracker D.2–D.3 | Franchisor.id + Franchisee.id | `ownership:check` + `premium:lifecycle:check` | ✅ |
| Payment gateway | — | — | Manual unique-code transfer only | 🛑 Outside this release by decision | — | — | 🛑 |

## 2. Live D1 evidence snapshot (read-only, 2026-09-25)

| Observation | Value |
| --- | --- |
| `d1_migrations` rows | 35 (ids 1–33, 37, 38) |
| Migration objects present | `guard_franchise_claim_approval`, `guard_franchise_claim_pending`, `guard_franchise_claim_single_review`, `guard_new_brand_review_insert`, `guard_new_brand_review_decision`, `guard_unreviewed_brand_owner`, `guard_unreviewed_brand_publication_insert`, `guard_unreviewed_brand_publication_update`, `guard_owner_edit_review_decision`, plus indexes `unique_pending_owner_review`, `idx_franchises_brand_match`, `idx_pending_new_brand_name`, `idx_franchise_submission_reviews_status` |
| `franchises` rows | 197 — 196 `UNCLAIMED`/`unclaimed` (all with a slug) and 1 `FRANCHISOR`/`free` (`Kopi Coba`, `owner_user_id` NULL, created 2026-06-16) |
| `franchise_site_publications` rows | 197 published for `site_franchisee_id`; **0 for `site_franchisor_id`** (in any status) |
| `franchise_claims` rows | 0 |
| `franchise_submission_reviews` rows | 0 |
| `listing_edit_suggestions` rows | 58 — 1 `approved` (data quality) and 57 `pending`, all system-generated (OCR bundle / proposal extraction). **0 owner-review proposals** |
| `users` / `user_roles` | 4 / 3 |
| `network_sites` rows | 6 (`site_franchisee_id`, `site_franchisor_id`, `site_franchise_id`, `site_waralaba_id`, `site_franchise_co_id`, `site_waralaba_co_id`); column is `site_type`, not `role` |

**Ledger divergence:** migration ids 34, 35, 36 and 39 have **no `d1_migrations` row**, yet the objects they create are live (0035's three triggers, 0036's `idx_franchises_brand_match`, 0039's trigger and partial index). The deployed schema is therefore ahead of the ledger. The repository already exposes `reconcile_d1_migration_ledger` (`functions/_d1-maintenance.js`, dashboard action) for this; reconcile before treating the ledger as the head. Note that `0034_operation_events_retention` was not independently verified in this pass.

**Consequence for Gate 1:** because Franchisor's current inserts never create a `pending` claim or a `franchise_submission_reviews` row, they do **not** trip the guards — they *succeed* and skip review. This is a trust defect, not a crash, and it is worse than a rejection would be. It confirms the rollout plan's P0 ordering.

## 3. Publish-queue reconciliation finding

Writers (`functions/_site-publish-queue.js` in both repositories) enqueue into **`site_rebuild_requests`** and update **`site_publish_state`**. Both pollers (`scripts/d1-static-publish-poller.mjs`, byte-identical copies in Franchisor.id and Franchisee.id) read **`site_publish_requests`**, which exists in no migration in either repository and not in the deployed schema.

Verified mismatches in `scripts/d1-static-publish-poller.mjs`:

| Poller | Deployed schema |
| --- | --- |
| `FROM/UPDATE site_publish_requests` (lines 58, 65, 72, 77, 81, 94) | table is `site_rebuild_requests` |
| `state.published_today` (line 52) | `site_publish_state.daily_publish_count` |
| `last_error = ?` (line 72) | `site_rebuild_requests.error_message` |
| `publish_mode === 'direct' ? 'direct' : 'hook'` | live value is `cloudflare_deploy_hook`, so mode resolves to hook — behaviourally acceptable, but the literal is undocumented |

Live queue state confirms the loop is stuck: `site_rebuild_requests` holds **35 rows in `queued`** (created 2026-07-03 → 2026-07-06, all queued 2026-08-14 17:01:21), `site_publish_state` has a row only for `site_franchisee_id` with `pending_count = 0`, `queued_count = 35`, `last_published_at = NULL`, `is_enabled = 1`, `publish_mode = 'cloudflare_deploy_hook'`. No `site_franchisor_id` state row exists yet. Nothing has been marked deployed or failed, which is what a poller failing at its first query looks like.

Remediation owner: the poller copy in **each** repository, plus its `scripts/test-d1-static-publish-poller.mjs` fixture. Sequencing: fix only after Gate 1 lands, and never let the Franchisor poller acknowledge another site's rows.
