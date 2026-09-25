import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
// @ts-ignore Pages Functions are JavaScript modules without generated declarations.
import { handleFranchisorSubmit } from "../functions/_form-submit-franchisor.js";
// @ts-ignore Pages Functions are JavaScript modules without generated declarations.
import { queueOwnerReview, OWNER_REVIEW_REASON } from "../functions/_profile-owner-review.js";

type PreparedStatement = {
  sql: string;
  params: unknown[];
};

type FakeDb = {
  db: unknown;
  prepared: PreparedStatement[];
  batchCalls: number;
};

function createDb(): FakeDb {
  const prepared: PreparedStatement[] = [];
  let batchCalls = 0;
  const db = {
    prepare(sql: string) {
      return {
        bind(...params: unknown[]) {
          const statement = {
            sql,
            params,
            all: async () => ({ results: [] }),
            first: async () => (/source_sheet = 'UNCLAIMED'/.test(sql)
              ? { id: "franchise_existing", slug: "existing-brand", legacy_row_id: "legacy_1" }
              : null),
          };
          prepared.push(statement);
          return statement;
        },
      };
    },
    async batch(statements: unknown[]) {
      batchCalls += 1;
      return statements.map(() => ({ meta: { changes: 1 } }));
    },
  };
  return { db, prepared, batchCalls };
}

function joined(db: FakeDb): string {
  return db.prepared.map((statement) => statement.sql).join("\n");
}

function source(path: string): string {
  assert.ok(existsSync(path), `${path} must exist`);
  return readFileSync(path, "utf8");
}

async function main() {
  // --- Claim submit: a complete claim is an allegation, never ownership. ---
  const claim = createDb();
  const claimResponse = await handleFranchisorSubmit(
    claim.db,
    {
      brand_name: "Existing Brand",
      company_name: "PT Existing",
      email_contact: "claimant@example.test",
      whatsapp: "081200000001",
      unclaimed_id: "franchise_existing",
    },
    true,
    { id: "user_claimant" },
  );
  const claimBody = await claimResponse.json();
  assert.equal(claimBody.status, "pending", "a claim must be returned as pending");
  assert.equal(claimBody.claim_id?.startsWith("claim_"), true, "a pending claim id must be returned");

  const claimSql = joined(claim);
  assert.doesNotMatch(claimSql, /UPDATE franchises/, "claim submit must not mutate the canonical listing");
  assert.doesNotMatch(claimSql, /owner_user_id = \?/, "claim submit must not assign ownership");
  assert.match(claimSql, /INSERT INTO franchise_claims/, "claim submit must create a claim row");
  assert.match(claimSql, /SELECT \?, id, \?, \?, \?, \?, 'pending'/, "claim insert must be guarded and pending");
  assert.match(claimSql, /owner_user_id IS NULL AND status = 'unclaimed' AND source_sheet = 'UNCLAIMED'/);
  assert.match(claimSql, /NOT EXISTS \(SELECT 1 FROM franchise_claims WHERE franchise_id = \? AND status = 'pending'\)/);
  assert.doesNotMatch(claimSql, /'approved'/, "claim submit must never write an approved decision");
  assert.doesNotMatch(claimSql, /reviewed_at/, "claim submit must not stamp a review decision");
  assert.doesNotMatch(claimSql, /site_rebuild_requests/, "a pending claim changes nothing public, so it must not queue a rebuild");

  // --- New brand submit: private, ownerless, draft, with a pending review. ---
  const brand = createDb();
  const brandResponse = await handleFranchisorSubmit(
    brand.db,
    {
      brand_name: "Brand Baru",
      company_name: "PT Baru",
      category: "Kuliner",
      email_contact: "newbrand@example.test",
      whatsapp: "081200000002",
    },
    false,
    { id: "user_applicant" },
  );
  const brandBody = await brandResponse.json();
  assert.equal(brandBody.status, "pending", "a new brand application must be returned as pending");

  const brandSql = joined(brand);
  const franchiseInsert = brand.prepared.find((statement) => /INSERT INTO franchises \(/.test(statement.sql));
  assert.ok(franchiseInsert, "new brand submit must insert a canonical franchise");
  assert.match(franchiseInsert.sql, /'pending_review'/, "a new brand must start in pending_review");
  assert.equal(franchiseInsert.params[1], null, "a new brand must be ownerless at submit");
  assert.equal(franchiseInsert.params[3], "site_franchisor_id", "new brand writes must be attributed to franchisor.id");

  const publicationInsert = brand.prepared.find((statement) => /INSERT INTO franchise_site_publications/.test(statement.sql));
  assert.ok(publicationInsert, "new brand submit must create the site publication row");
  assert.match(publicationInsert.sql, /'draft'/, "the new brand publication must be a draft, not published");
  assert.doesNotMatch(publicationInsert.sql, /'published'/, "a new brand must not be published at submit");
  assert.equal(publicationInsert.params[2], "site_franchisor_id");
  assert.equal(publicationInsert.params[4], "https://franchisor.id/usaha/brand-baru", "franchisor.id brand canonicals use the /usaha/{slug} family");

  assert.match(brandSql, /INSERT INTO franchise_submission_reviews/, "new brand submit must create the pending review record");
  assert.doesNotMatch(brandSql, /site_rebuild_requests/, "an unpublished new brand must not queue a rebuild");

  // --- Owner review proposals preserve the previous public values. ---
  const review = createDb();
  const queued = await queueOwnerReview(
    review.db,
    { id: "user_owner" },
    "franchise_1",
    { short_desc: "Deskripsi baru" },
    { short_desc: "Deskripsi lama" },
    "json_diff",
  );
  assert.equal(queued.pending, true, "queueOwnerReview must report a pending proposal");
  const reviewSql = joined(review);
  assert.match(reviewSql, /INSERT INTO listing_edit_suggestions/, "owner edits must be stored as suggestions");
  assert.match(reviewSql, /'pending'/, "owner suggestions start pending");
  assert.doesNotMatch(reviewSql, /UPDATE franchises/, "a queued owner review must not touch the public row");
  const suggestion = review.prepared.find((statement) => /INSERT INTO listing_edit_suggestions/.test(statement.sql));
  assert.ok(suggestion);
  assert.equal(suggestion.params[2], "site_franchisor_id", "owner reviews are franchisor-site scoped");
  assert.equal(suggestion.params[7], OWNER_REVIEW_REASON, "the review reason is the value migration 0039 guards on");
  assert.equal(JSON.parse(String(suggestion.params[5])).short_desc, "Deskripsi lama", "old_value must capture the current public value");

  // --- Poison: the pre-0035 write shapes must never come back. ---
  const submitSource = source("functions/_form-submit-franchisor.js");
  assert.doesNotMatch(submitSource, /'approved'/, "claim submit must not hardcode an approved claim");
  assert.doesNotMatch(submitSource, /SET owner_user_id = \?/, "claim submit must not assign ownership inline");
  assert.match(submitSource, /'pending_review'/);
  assert.match(submitSource, /INSERT INTO franchise_submission_reviews/);
  assert.match(submitSource, /owner_user_id IS NULL AND status = 'unclaimed' AND source_sheet = 'UNCLAIMED'/);

  const ownerReviewSource = source("functions/_profile-owner-review.js");
  assert.match(ownerReviewSource, /Perubahan pemilik setelah listing diterbitkan/, "the review reason string must match the 0039 guard");
  assert.match(ownerReviewSource, /SITE_FRANCHISOR_ID/);
  assert.doesNotMatch(ownerReviewSource, /SITE_FRANCHISEE_ID/, "franchisor handlers must not carry the franchisee site constant");

  const actionsSource = source("functions/_profile-franchisor-actions.js");
  assert.match(actionsSource, /queueOwnerReview/, "published owner edits must go through review");
  assert.match(actionsSource, /AND p\.publication_status = 'published'/, "the review branch must be gated on a published projection");
  assert.doesNotMatch(actionsSource, /SITE_FRANCHISEE_ID/);

  const uploadSource = source("functions/profile-upload.js");
  assert.match(uploadSource, /queueOwnerReview/, "published media uploads must go through review");
  assert.match(uploadSource, /\.\.\.\(!published \? \[/, "direct media writes must be gated on an unpublished listing");

  const dashboardActions = source("functions/_dashboard-actions.js");
  assert.match(dashboardActions, /export async function handleReviewBrandSubmission/);
  assert.match(dashboardActions, /OWNER_REVIEW_STALE/);
  assert.match(dashboardActions, /PROFILE_REVIEW_STALE/);
  assert.match(dashboardActions, /reviewedProfileStatements/);
  assert.match(dashboardActions, /CLAIM_EVIDENCE_REQUIRED/);
  assert.match(dashboardActions, /CLAIM_OWNER_CONFLICT/);
  assert.match(dashboardActions, /BRAND_EVIDENCE_REQUIRED/);
  assert.match(dashboardActions, /WHERE id = \? AND owner_user_id IS NULL AND status = 'unclaimed' AND source_sheet = 'UNCLAIMED'/);

  assert.match(source("functions/_dashboard-schemas.js"), /"review_brand_submission"/, "the new action must be accepted by the dashboard schema");
  assert.match(source("functions/dashboard-data.js"), /pending_brand_submissions/);
  assert.match(source("functions/dashboard-data.js"), /review_brand_submission/);
  assert.match(source("functions/_dashboard-queries.js"), /export async function getPendingBrandSubmissions/);
  assert.match(source("functions/_dashboard-queries.js"), /\/usaha\/\$\{row\.slug\}/, "dashboard public links follow the /usaha/ canonical family");
  assert.match(source("js/profile-franchisor.js"), /href="\/usaha\/\$\{encodeURIComponent/, "owner brand links follow the /usaha/ canonical family");
  assert.doesNotMatch(source("js/profile-franchisor.js"), /href="\/peluang-usaha\/\$\{/, "no brand-detail link may point at the /peluang-usaha/ soft-404");
  assert.match(source("js/dashboard-review.js"), /renderBrandSubmissions/);
  assert.match(source("src/components/dashboard/DashboardReviewPanel.astro"), /data-brand-submission-rows/);
  assert.match(source("js/profile-page.js"), /payload\.status === "pending"/, "owners must be told a change is awaiting review");

  // --- Poison: the queue producer and the consumer must agree on one table. ---
  assert.match(source("functions/_site-publish-queue.js"), /site_rebuild_requests/);
  const pollerSource = source("scripts/d1-static-publish-poller.mjs");
  assert.match(pollerSource, /site_rebuild_requests/, "the poller must consume the table the writers fill");
  assert.doesNotMatch(pollerSource, /site_publish_requests/, "site_publish_requests does not exist in the deployed schema");
  assert.match(pollerSource, /daily_publish_count/, "the poller must read the deployed daily counter column");
  assert.match(pollerSource, /error_message = \?/, "the poller must write the deployed error column");
  assert.doesNotMatch(pollerSource, /last_error/, "site_rebuild_requests has no last_error column");

  // --- Canonical URL family: franchisor.id keeps /usaha/{slug}. ---
  const premiumSource = source("functions/_premium.js");
  assert.match(premiumSource, /site_franchisor_id"\) return `https:\/\/franchisor\.id\/usaha\/\$\{slug\}`/, "the franchisor network canonical must be the /usaha/{slug} family");
  assert.match(premiumSource, /PREMIUM_BASE_AMOUNT = 3000000/, "the shared one-brand base price must stay Rp3.000.000 per brand per year");
  assert.match(premiumSource, /"site_franchisee_id",\s*"site_franchise_id",\s*"site_franchisor_id",\s*"site_waralaba_id",/, "the four named network sites remain the entitlement targets");
  const submitSourceCanonical = source("functions/_form-submit-franchisor.js");
  assert.doesNotMatch(submitSourceCanonical, /franchisor\.id\/peluang-usaha/, "no franchisor write may emit a /peluang-usaha/ canonical");

  console.log("Ownership contract check passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
