# Suggestions

> Current Franchise Network context: [membership rollout](docs/product/NETWORK_MEMBERSHIP_ROLLOUT_PLAN.md) and [Franchisor user journeys](docs/product/FRANCHISOR_USER_JOURNEYS.md). Historical implementation notes here do not prove production behavior.

## P0 — close the ownership and live-route gap before paid onboarding

Evidence on 2026-09-25: `functions/_form-submit-franchisor.js` still writes `owner_user_id` during an existing-brand claim, while current Franchisee submit and shared D1 guards require pending review; anonymous Franchisor `/auth-config` and protected routes served legacy HTML. Align the Franchisor claim, new-brand, owner-edit, and admin decision paths with shared migrations `0035`–`0039`, then deploy the adapted app and run two-applicant, wrong-owner, payment, and per-site publication acceptance on the exact production commit. The [rollout plan](docs/product/NETWORK_MEMBERSHIP_ROLLOUT_PLAN.md) owns sequence and release criteria.

Ideas here are not automatically approved work.

## Network platform extraction

Franchisor now has a working read-only D1 build and is the second implemented consumer. Consider extraction only after the first live Franchisor deployment proves the shared interfaces under real auth, publication, and rebuild traffic:

- D1 migrations and schema documentation;
- site identifiers and domain mapping;
- shared Zod contracts;
- identity/authorization helpers;
- rebuild queue protocol;
- canonical field normalization.

This would remove the current dependency on Franchisee.id as the migration owner and reduce contract drift. The local port proves reuse; the live launch should determine which interfaces are stable enough to version.

## Legacy route matcher

Build a dry-run inventory tool that extracts the 34 legacy `/usaha/` brands and proposes D1 matches using normalized brand name, slug, company, and contact evidence. Require manual review for ambiguous matches and never write D1 from the matching command.

## Contract tests across repositories

Add a small fixture-based contract suite that both sites run to verify:

- identical accepted D1 row shapes;
- correct site scoping;
- no archived/suspended rendering;
- Premium site mapping;
- rebuild queue isolation;
- canonical URL rules.

## Reconcile legacy franchise-law and financial claims

Before the separately authorized outline/publication stage, inventory legacy pages that cite PP 42/2007, omit the 2025 STPW/licensing changes, or imply guaranteed returns. Preserve useful URLs, update them against `GLOBAL_RESEARCH.md`, remove unsupported guarantees, and require current Indonesian legal/financial review for definitive claims.
