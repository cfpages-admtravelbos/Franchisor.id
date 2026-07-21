# Suggestions

Ideas here are not automatically approved work.

## Network platform extraction

After Franchisor has a working read-only D1 build, consider extracting stable shared items into a versioned network package or infrastructure repository:

- D1 migrations and schema documentation;
- site identifiers and domain mapping;
- shared Zod contracts;
- identity/authorization helpers;
- rebuild queue protocol;
- canonical field normalization.

This would remove the current dependency on Franchisee.id as the migration owner and reduce contract drift. Do not attempt the extraction before the second consumer proves which code is genuinely shared.

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

