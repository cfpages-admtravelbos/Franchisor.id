# Franchisor.id documentation

Start here after reading the root `AGENTS.md`.

## Current status

The D1/Clerk/Astro/Pages Functions runtime is implemented and locally verified. The repository is not yet documented as production-live: Cloudflare Pages bindings, Clerk satellite configuration, custom domains, provider secrets, and live smoke tests remain manual launch gates. The shared D1 query returned zero published `site_franchisor_id` rows again on 2026-07-23; that is timestamped evidence, not a permanent assumption.

## Core documents

- `../CODEBASE.md` — current repository inventory, target structure, stable identifiers, and reference paths.
- `../TOPICAL_AUTHORITY.md` — audited Franchisor/operator knowledge universe, existing-route decisions, evidence standards, and bounded first cluster.
- `../ARTICLE_CATALOG.md` — 114 distinct briefs with intent, scope boundaries, evidence formats, links, priority, and publication waves.
- `architecture/FRANCHISE_NETWORK_CONTEXT.md` — the complete cross-site architecture and product boundary distilled from Franchisee.id.
- `data/SHARED_DATA_CONTRACT.md` — required D1 read/write, publication, identity, and asset contracts.
- `architecture/FRANCHISOR_BUILD_PLAN.md` — phased implementation plan and acceptance criteria.
- `operations/MANUAL_SETUP_CHECKLIST.md` — exact Cloudflare, Clerk, GitHub, DNS, and optional-provider actions required before production launch.
- `PORT_MANIFEST.md` — file-level record of the application port and adaptations.
- `../SUGGESTION.md` — ideas that are useful but not part of the current committed scope.
- `../CHANGELOG.md` — repository documentation and code changes.
- `../.context/` — timestamped working-session handoffs.

Additional focused references:

- `forms/CLAIM_TRANSITION_MATRIX.md` and `forms/AUTO_SAVE.md` — current claim and browser-draft behavior.
- `architecture/OCR_PROVIDER_STRATEGY.md` and `architecture/R2_D1_MIGRATION_RUNBOOK.md` — OCR/R2 behavior and shared migration ownership.
- `data/FRANCHISE_FIELD_DICTIONARY.md` — review-facing field normalization contract.
- `../css/form-franchise/CSS_USAGE_MAP.md` — form stylesheet ownership.
- `../js/symbols_inventory.md` and `../js/technical_comparison.md` — current browser runtime and legacy-generator boundaries.

## Upstream context reviewed

This documentation was produced after reading all 185 tracked Markdown files in the sibling `../Franchisee.id` repository: 54 core documents and 131 timestamped session records. The most authoritative upstream sources were:

- `../Franchisee.id/AGENTS.md`
- `../Franchisee.id/CODEBASE.md`
- `../Franchisee.id/docs/architecture/TECH_STACK_DECISIONS.md`
- `../Franchisee.id/docs/architecture/D1_STATIC_PUBLISH_STRATEGY.md`
- `../Franchisee.id/docs/architecture/CLERK_SETUP.md`
- `../Franchisee.id/docs/architecture/PREMIUM_MONETIZATION_PLAN.md`
- `../Franchisee.id/docs/forms/FRANCHISOR_PROGRESSIVE_FORM_PLAN.md`
- `../Franchisee.id/docs/architecture/INTERNATIONAL_FRANCHISOR_POLICY.md`
- `../Franchisee.id/docs/data/FRANCHISE_FIELD_DICTIONARY.md`
- `../Franchisee.id/migrations/0001_initial_network_schema.sql`

The many upstream session files are useful historical evidence, but they are not copied here. This repository should maintain its own concise session history from this point forward.

## Current implementation note

The application runtime has now been ported and adapted. Franchisee.id remains a historical implementation reference and the current shared D1 migration owner; its visual identity is not the Franchisor design source. New application routes load `css/franchisor-theme.css`, which derives its palette, typography, and logos from the existing Franchisor.id export.

If an upstream document conflicts with this repository's documentation, verify the current code and migration state before changing anything. Record the resolution in both repositories when it affects the shared network contract.

## Freshness and authority

For current behavior, use this order: deployed schema/runtime code, repository code and package scripts, `CODEBASE.md` plus the focused contract document, then timestamped session records. `docs/PORT_MANIFEST.md` and `.context/` are historical evidence; they do not override later code or current-state documentation.
