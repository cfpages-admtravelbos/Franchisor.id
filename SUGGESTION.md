# Suggestions

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
