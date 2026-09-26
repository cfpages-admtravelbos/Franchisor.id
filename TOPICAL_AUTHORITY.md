# Topical Authority — franchisor.id

> Current Franchise Network context: [membership rollout](docs/product/NETWORK_MEMBERSHIP_ROLLOUT_PLAN.md) and [Franchisor user journeys](docs/product/FRANCHISOR_USER_JOURNEYS.md). Historical implementation notes here do not prove production behavior.

## Role and boundary

Franchisor.id is the operator-facing knowledge and workflow surface of the shared Franchise Network. Its primary reader is an Indonesian business owner, leadership team, franchise-development manager, or existing franchisor who must decide whether a business is ready to franchise, design and govern the system, recruit and support qualified partners, and grow without making unsupported performance promises.

The editorial role is **network owner, seller, and operator**. Franchisee.id independently owns the buyer's journey: finding, comparing, financing, and evaluating a franchise from the prospective franchisee's point of view. Both domains may discuss the same subject because they are separate editorial properties, but Franchisor.id must answer the franchisor's job and use operator-oriented calls to action. Brand-directory and transactional pages on this domain remain separate from neutral knowledge pages.

Geography is Indonesia by default. Regional and international expansion appear only where territory design, law, language, supply, currency, tax, or operating control changes the substance. City/province name swaps and other doorway patterns are excluded.

This is a complete planning map, not permission to mass-publish. Every legal conclusion, agreement clause, disclosure statement, financial model, tax treatment, privacy control, or international structure requires current qualified review before publication or operational use.

## Evidence audited

Audit completed 2026-07-23 against local `main` at commit `513f62f645557bfa00913459a4fe915f813d5e78`.

- Canonical repository: `cfpages-syamsulalam-net/Franchisor.id`; local branch `main` tracked `origin/main` and was clean before this documentation work.
- Architecture: hybrid Astro 5 static application plus Cloudflare Pages Functions and a retained WordPress/Elementor export. Shared D1/R2/Clerk contracts are documented in `AGENTS.md`, `CODEBASE.md`, `docs/architecture/FRANCHISE_NETWORK_CONTEXT.md`, and `docs/data/SHARED_DATA_CONTRACT.md`.
- Source inventory: 94 legacy source HTML files outside build/vendor/WordPress-asset trees, including 34 `/usaha/` brand pages and 13 `/category/` pages.
- Application inventory: 16 Astro page files, 78 Pages Function files, and 27 scripts. Public and operator surfaces include `/peluang-usaha/`, `/peluang-usaha/{slug}/`, category/city/capital filters, `/bandingkan/`, `/alat-franchise/`, `/premium/`, `/profil/`, and `/dashboard/`.
- Sitemap index: `sitemap.xml` and `sitemap_index.xml` both point to the same three child sitemaps. The children contain 70 page URLs: 32 in `page-sitemap.xml`, 4 in `post-sitemap.xml`, and 34 in `usaha-sitemap.xml`. They also contain 1,350 image references, which are not editorial pages.
- Existing editorial signals: generic article/archive routes, `franchisepedia`, `peraturan-waralaba`, three long-form posts, directory/recommendation/location routes, 13 category archives, and retained author/template/archive files.
- Existing commercial signals: registration, login, profile/dashboard, brand onboarding/claim, proposal/OCR, Premium Network, publishing, lead, analytics, and franchise-directory functionality.
- Build state: repository documentation records a 2026-07-22 successful local Astro check/build with 12 generated Astro pages and 4,887 deployed files checked for asset routes. Provider launch gates and live smoke tests remain open.
- Shared network: the canonical `franchises` row is projected per site through `franchise_site_publications`; Franchisor reads must be scoped to `site_franchisor_id`. Franchisee.id owns the current shared D1 migration chain.

Primary Indonesian sources checked for the planning baseline:

- [PP No. 35 Tahun 2024 tentang Waralaba](https://peraturan.bpk.go.id/Details/297489/pp-no-35-tahun-) is in force and replaced PP No. 42 Tahun 2007. It covers franchise criteria, prospectus, agreements, rights and duties, STPW, logo, domestic products, reporting, supervision, prohibitions, and sanctions.
- [Permendag No. 71 Tahun 2019 tentang Penyelenggaraan Waralaba](https://jdih.kemendag.go.id/peraturan/peraturan-menteri-perdagangan-nomor-71-tahun-2019-penyelenggaraan-waralaba) is still marked in force by the Ministry's JDIH; article drafts must reconcile it with later rules rather than assume every old procedure survives unchanged.
- [Permendag No. 25 Tahun 2025](https://jdih.kemendag.go.id/peraturan/peraturan-menteri-perdagangan-republik-indonesia-nomor-25-tahun-2025-tentang-tata-cara-penerbitan-surat-tanda-pendaftaran-waralaba-oleh-pemerintah-daerah-1) governs regional-government issuance of specified STPW categories.
- [PP No. 28 Tahun 2025](https://peraturan.bpk.go.id/Details/319773/pp-no-28-) replaced PP No. 5 Tahun 2021 for risk-based business licensing. OSS steps and sector licensing must be rechecked at publication time.
- [DJKI trademark procedure](https://dgip.go.id/menu-utama/merek/syarat-prosedur) and [DJKI trademark overview](https://dgip.go.id/menu-utama/merek/pengenalan) are the primary operational references for registration and protection basics.
- [UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi](https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022%20) governs personal-data processing and rights; current implementing rules and constitutional-court effects must be checked for each privacy article.
- [KPPU's franchise competition guideline](https://www.kppu.go.id/docs/Pedoman/pedoman_pasal_50b_waralaba.pdf) is useful but predates PP 35/2024, so competition-law articles require current counsel review.
- [DJP's franchise-tax overview](https://www.pajak.go.id/id/artikel/melihat-pajak-atas-bisnis-waralaba) and [PER-1/PJ/2023 royalti guidance](https://www.pajak.go.id/id/peraturan/pedoman-teknis-tata-cara-pemotongan-penyetoran-dan-pelaporan-pajak-penghasilan-pasal-23) are starting points, not substitutes for current case-specific tax advice.
- [UU No. 8 Tahun 1999 tentang Perlindungan Konsumen](https://peraturan.bpk.go.id/Home/Details/45288/uu-no-8-tahun-1999.8Presiden) is a baseline for responsible commercial claims; the exact applicability to each franchisor communication needs legal review.

## Existing coverage and risks

The repository has substantial directory and workflow depth but only three identifiable long-form posts. Archive labels such as `artikel`, `berita`, `franchisepedia`, categories, alphabet, popular, recommendation, and location routes do not prove that the operator knowledge space is covered.

| Existing URL/pattern | Observed role/problem | Decision | Destination/owner | Verification needed |
|---|---|---|---|---|
| `/` | Legacy directory homepage describes broad franchise opportunities; audience is mixed and buyer-leaning | expand | Operator-led Franchisor homepage plus directory entry points | Confirm production copy, navigation, and structured data after launch |
| `/usaha/{slug}` (34 URLs) | Legacy brand pages may compete with generated detail routes | manual review | One approved brand URL family per record | Match all 34 pages to D1 IDs; inspect backlinks, indexation, canonicals, and content parity |
| `/peluang-usaha/{slug}/` | Implemented generated brand-detail convention | keep | Commercial brand profile route | Decide its relationship to `/usaha/{slug}` before broad publication |
| `/peluang-usaha/` and filter routes | Directory/discovery route; useful but not a neutral operator guide | keep | Commercial directory | Keep filter/index controls distinct from articles and review thin filter indexation |
| `/peluang-usaha/kota/{slug}/` | Generated city filter can become a doorway surface | noindex | User navigation unless a location has unique operating evidence | Verify current output, canonical, demand, and content uniqueness before any indexation |
| `/direktori-franchise`, `/rekomendasi-franchise`, `/lokasi-usaha`, `/daftar-outlet` | Overlapping discovery labels and possible buyer intent | manual review | Consolidated directory IA | Compare content, query intent, internal links, canonicals, and live traffic |
| `/artikel`, `/berita`, `/franchisepedia` | Three generic archive concepts with unclear ownership | merge | One editorial library with topic hubs | Preserve valuable URLs; determine archive taxonomy and redirect needs |
| `/peraturan-waralaba` | Useful legal hub name but likely thin/stale | expand | FRO-06 legal and registration hub | Qualified counsel review; verify cited rules and last-reviewed date |
| Three root `.html` posts | Broad, promise-heavy buyer-oriented topics overlap each other | merge | Operator-specific guides or redirect to buyer content as evidence supports | Review headings, claims, links, traffic, and backlink history before action |
| `/category/*`, `/kategori`, `/abjad`, `/populer`, `/author` | Archive/utility surfaces are not authority content and can multiply thin URLs | noindex | Navigation or consolidated taxonomy | Crawl rendered pages, pagination, canonicals, robots, and Search Console evidence |
| `/pendaftaran`, `/daftar`, `/register`, `/login` | Multiple legacy and functional account-entry routes | canonicalize | Implemented auth/onboarding routes | Live Clerk verification, form behavior, status codes, and redirect map |
| `/profil`, `/dashboard`, `/premium` | Authenticated/product surfaces; not editorial articles | keep | Application/product owners | Protect private data; keep public metadata minimal and intent-specific |
| `/privacy-policy`, `/terms-of-service` | Required policy routes; not how-to legal advice | expand | Current network policy owners | Indonesian privacy/consumer counsel review plus deployed data-flow inventory |
| `sitemap.xml` and `sitemap_index.xml` | Duplicate indexes advertise the same three children | canonicalize | One generated sitemap index | Verify crawler history before redirect or removal |
| Legacy image-heavy sitemap entries | 1,350 image references dwarf 70 page URLs and may preserve obsolete assets | manual review | Generated sitemap and asset manifest | Check ownership, rights, usefulness, dimensions, and consuming pages |

Key risks:

- Same-domain ambiguity between legacy `/usaha/` and generated `/peluang-usaha/` brand pages.
- Buyer-leaning legacy claims such as “menguntungkan” or “keuntungan menjanjikan” conflict with the intended responsible operator role.
- Archive, category, filter, and city pages can be mistaken for editorial coverage or indexed as thin pages.
- High-stakes legal, financial, tax, competition, privacy, employment, food/product, and international advice can become stale or misleading.
- The shared network can accidentally publish duplicate or inconsistent brand data if editorial pages imply a source of truth outside canonical D1 records.
- Provider-side launch gates mean local routes are not proof of live, secure, or indexable behavior.

## Coverage matrix

| Completeness lens | Topic owners | Coverage decision |
|---|---|---|
| Definition and vocabulary | FRO-01, FRO-02, FRO-06 | Distinguish franchise, license, dealership, agency, partnership, and business opportunity |
| Taxonomy and variants | FRO-02, FRO-18, FRO-19 | Business-format, product/trade-name, area development, master, multi-unit, and cross-border structures |
| Anatomy and components | FRO-02, FRO-05, FRO-09, FRO-11 | System manual, IP stack, onboarding, field support, platform, and governance interfaces |
| Materials and physical properties | N/A | No universal material science applies; sector-specific product/safety content belongs in operating standards and specialist review |
| Mechanisms and science | FRO-03, FRO-07, FRO-10, FRO-14 | Unit economics, funnel mechanics, launch dependencies, and data-system behavior |
| History and evolution | FRO-06 | Regulatory transition and document/version history only; generic franchise history is low-priority FAQ material |
| Measurement and terminology | FRO-03, FRO-13, FRO-15 | Financial definitions, marketing-fund accounting, KPIs, audit ratings, and deployment/publication states |
| Need recognition and diagnosis | FRO-01, FRO-03, FRO-16 | Readiness gaps, fragile economics, support capacity, and performance/conflict symptoms |
| Requirements and design | FRO-02, FRO-05, FRO-06, FRO-18 | Format, IP, documents, territory, and control-system design |
| Comparison and selection | FRO-02, FRO-07, FRO-08, FRO-18, FRO-19 | Model, channel, candidate, territory, and entry-mode decisions |
| Budget and procurement | FRO-03, FRO-10, FRO-12, FRO-13 | Investment components, rollout budgets, approved supply, and fund governance without price promises |
| Preparation and launch | FRO-01, FRO-09, FRO-10 | Readiness, onboarding, site approval, opening, and stabilization |
| Operation and maintenance | FRO-11, FRO-12, FRO-14, FRO-15 | Support cadence, quality, systems, access, reporting, and audits |
| Troubleshooting and repair | FRO-16 | Early warning, corrective action, escalation, mediation, and relationship repair |
| Upgrade and replacement | FRO-14, FRO-17, FRO-18 | Platform migration, format refresh, renewal, transfer, exit, and network redesign |
| Stakeholders | all | Founder, executive, franchise-development, operations, finance, legal, marketing, data/privacy, trainer, field consultant, supplier, and franchisee counterpart |
| Geography and climate | FRO-10, FRO-12, FRO-18, FRO-19 | Included only when site, logistics, regulation, supply, currency, language, or service level changes |
| Scale and performance | FRO-03, FRO-11, FRO-15, FRO-18 | Single-unit proof through multi-unit and regional governance |
| New system versus retrofit | FRO-01, FRO-05, FRO-14, FRO-18 | Franchise-ready design and conversion of an informal existing network |
| DIY versus professional | FRO-03, FRO-05, FRO-06, FRO-14, FRO-19 | Checklists support preparation; counsel, accountant, tax, privacy, cybersecurity, and market experts own final judgment |
| Quality level | FRO-02, FRO-11, FRO-12, FRO-15 | Minimum viable controls versus mature scalable systems; price is not used as a proxy for quality |
| Safety and health | FRO-10, FRO-11, FRO-12 | Sector hazards require specialist controls; generic franchise advice cannot certify safety |
| Failure modes | FRO-03, FRO-07, FRO-10, FRO-12, FRO-16, FRO-19 | Scenario, funnel, launch, supply, conflict, and cross-border failure maps |
| Standards and regulation | FRO-05, FRO-06, FRO-13, FRO-14, FRO-19 | Current official sources plus qualified review and explicit last-reviewed dates |
| Environmental impact | FRO-12, FRO-18 | Procurement, waste, packaging, logistics, and local adaptation when material to the concept |
| Evidence quality and myths | FRO-03, FRO-04, FRO-06, FRO-15 | Source hierarchy, substantiation, audit trail, and correction of guarantee/shortcut claims |
| How-to and calculation tools | FRO-01, FRO-03, FRO-08, FRO-09, FRO-10, FRO-15 | Readiness scorecard, scenario model, qualification rubric, onboarding plan, launch checklist, and governance dashboard |
| Visual references | FRO-02, FRO-05, FRO-09, FRO-11, FRO-14 | System maps, rights matrix, learning path, support model, and data-flow diagrams |
| Case studies | all | Only verified records with consent, methodology, limitations, and no fabricated outcomes |
| FAQ/glossary | FRO-01, FRO-06 | Cluster within hubs; do not create thin synonym pages |
| Commercial support | FRO-07, FRO-08, FRO-14 | Contextual recruitment, qualification, and Franchisor platform routes remain distinct from neutral guides |
| News/trends | FRO-06, FRO-14, FRO-19 | Publish only material maintainable changes with review dates; avoid trend filler |

## Topical map

| Topic ID | Parent topic | Reader outcome | Required subtopics/questions | Evidence/formats | Boundary | Article target |
|---|---|---|---|---|---|---:|
| FRO-01 | Franchise readiness and franchisor capacity | Decide whether to franchise now, prepare first, or choose another growth path | Proven replication; founder dependence; documentation; economics; management bench; capital; support load; stop/go gates | Readiness scorecard; evidence register; process map; capacity model; expert review | Owns the decision to become a franchisor; FRO-02 owns format design and FRO-18 owns territory scaling | 6 |
| FRO-02 | Franchise architecture and model design | Select a coherent franchise format and define what is actually transferred | Franchise versus license/dealer/agency; business-format components; unit formats; rights/responsibilities; pilot design; retrofit of informal partners | Decision tree; operating-model canvas; rights matrix; system diagram | Owns system architecture; FRO-03 owns financial scenarios and FRO-06 owns enforceable documents | 6 |
| FRO-03 | Unit economics and financial model | Build decision-grade scenarios without presenting forecasts as guarantees | Unit P&L; franchisor revenue/cost; capex/working capital; fee/royalty bases; sensitivity; break-even; cohort and cash-flow view | Auditable spreadsheet; definitions; scenario table; accountant review; data provenance | Owns calculations and scenario interpretation; FRO-04 owns how figures may be communicated and FRO-13 owns fund accounting | 6 |
| FRO-04 | Disclosure, evidence, and responsible claims | Assemble substantiated offer information and communicate uncertainty honestly | Prospectus evidence; historical versus illustrative figures; earnings claims; testimonials; source/version control; correction and approval workflow | Claim register; source pack; disclosure checklist; legal and financial review | Owns substantiation and communication; FRO-06 owns legal filing/agreement duties and FRO-07 owns recruitment channels | 6 |
| FRO-05 | Intellectual property, brand, and know-how | Protect and license the assets that make replication possible | Trademark search/registration; ownership chain; manuals; copyright/trade secrets; domain/social assets; license scope; infringement response | DJKI sources; IP inventory; access matrix; counsel review; version register | Owns IP and confidential system assets; FRO-06 owns agreement drafting and FRO-14 owns technical access controls | 6 |
| FRO-06 | Indonesian franchise law, registration, and agreements | Prepare an accurate legal workstream and know when professional counsel is mandatory | PP 35/2024; Permendag 71/2019 and 25/2025; STPW; prospectus; agreement topics; OSS/licensing; reporting; competition; consumer; tax interfaces | Official law/JDIH sources; dated compliance matrix; counsel and tax review | Owns regulatory/legal process education, never individualized legal advice; FRO-04 owns evidence packs and policy routes own binding site terms/privacy | 6 |
| FRO-07 | Franchise recruitment and positioning | Build a measurable, responsible pipeline of suitable prospects | Ideal partner proposition; channel choice; content/events/referrals; lead capture; response SLA; qualification handoff; claim controls | Funnel map; channel test plan; CRM fields; compliant-copy review | Owns demand generation and initial response; FRO-08 owns selection and `/peluang-usaha/` owns live brand listings | 6 |
| FRO-08 | Candidate qualification and mutual due diligence | Select partners consistently while allowing informed two-way evaluation | Criteria; application; financial/operating capability; values; interviews; validation; scoring; bias; approval; recordkeeping; rejection | Structured rubric; interview guide; decision log; privacy and counsel review | Owns candidate assessment; Franchisee.id owns the buyer's independent due diligence and FRO-09 begins after approval | 6 |
| FRO-09 | Onboarding, training, and certification | Move an approved partner to demonstrated operating competence | Pre-opening journey; role-based curriculum; train-the-trainer; practice; assessments; certification; retraining; records | Learning map; competency rubric; checklist; observed assessment; LMS record design | Owns learning and readiness; FRO-10 owns physical opening and FRO-11 owns ongoing field support | 6 |
| FRO-10 | Site, build-out, launch, and stabilization | Open a compliant unit through controlled gates rather than date pressure | Site criteria; approval; permits; design; procurement; project plan; pre-opening audit; opening; stabilization; safety stop conditions | Stage-gate checklist; RACI; critical path; site evidence; sector specialists | Owns unit-opening delivery; FRO-12 owns ongoing supply/quality and city filter routes do not replace this guidance | 6 |
| FRO-11 | Operations and franchisee support | Design a support system that preserves standards and develops partner capability | Manuals; service desk; field visits; coaching; change control; incident escalation; peak/seasonal operation; continuity | Support catalogue; cadence map; RACI; service-level measures; field evidence | Owns recurring operating support; FRO-15 owns independent governance/audits and FRO-16 owns formal remediation/conflict | 6 |
| FRO-12 | Supply chain, vendors, product quality, and resilience | Govern inputs and quality without creating avoidable fragility | Approved suppliers; specifications; alternates; demand planning; traceability; recall; product safety; shortages; domestic sourcing; sustainability | Supplier scorecard; specification template; traceability map; sector expert review | Owns supply and product quality; FRO-13 owns fund spending and FRO-19 owns cross-border supply/tax structure | 6 |
| FRO-13 | Brand marketing, local marketing, and fund governance | Align national and local demand generation with transparent fund stewardship | Roles; local rules; brand approvals; campaign calendar; fund basis; budget; reporting; audit; crisis communications; measurement | Governance charter; budget model; campaign brief; accountant/legal review | Owns marketing execution and collective-fund governance; FRO-07 owns partner recruitment and FRO-03 owns unit economics | 6 |
| FRO-14 | Data, platform, privacy, and security | Operate shared systems with clear data ownership, access, consent, and continuity | POS/CRM/LMS; data dictionary; access; integration; analytics; privacy basis; retention; breach response; vendor risk; migration; D1 publication state | Data-flow map; DPIA-style review; access matrix; security checklist; privacy counsel | Owns network data and technology governance; site privacy policy owns binding disclosures and FRO-15 owns business oversight | 6 |
| FRO-15 | Governance, audit, and performance management | Run a fair evidence-based network governance rhythm | Decision rights; councils; KPIs; benchmarking; audits; corrective action; documentation; whistleblowing; assurance; board reporting | Governance map; metric dictionary; audit rubric; dashboard; legal/accounting review | Owns routine oversight and assurance; FRO-16 owns material underperformance/conflict and FRO-13 owns marketing-fund controls | 6 |
| FRO-16 | Underperformance, remediation, and conflict | Intervene early, diagnose causes, and escalate proportionately | Early warning; root cause; coaching; corrective plans; cure process; mediation; complaints; crisis; documentation; relationship repair | Diagnostic tree; action-plan template; escalation ladder; counsel/mediator review | Owns operational remediation and disputes; FRO-17 owns renewal/transfer/termination decisions and clauses | 6 |
| FRO-17 | Renewal, transfer, succession, and termination | Manage relationship transitions without destroying continuity, evidence, or stakeholder rights | Renewal readiness; renegotiation; sale/transfer; death/incapacity; step-in; termination; de-branding; data/assets; customer continuity; post-exit obligations | Lifecycle timeline; transition checklist; rights matrix; counsel/tax review | Owns end-of-term and exit processes; FRO-16 owns attempts to remediate and FRO-18 owns new territory awards | 6 |
| FRO-18 | Domestic territory and regional network growth | Expand across Indonesia with territory, capacity, and control matched to evidence | Territory criteria; exclusivity; whitespace; multi-unit; area development; regional support; logistics; localization; cluster sequencing; saturation | Territory model; service-capacity map; scenario analysis; competition/legal review | Owns domestic and regional expansion design; city-name pages are excluded and FRO-19 owns cross-border structures | 6 |
| FRO-19 | International and cross-border expansion | Choose an entry mode and readiness path for foreign markets or foreign brands entering Indonesia | Export readiness; master franchise; direct franchise; JV/license alternatives; local law; IP; tax/currency; supply; localization; sanctions; governance; exit | Country-screening matrix; treaty/current-law research; counsel/tax/FX review; pilot gates | Owns cross-border strategy; it never substitutes generic advice for local counsel, and FRO-18 owns Indonesian regional growth | 6 |

## Related-domain opportunities

- **Franchisee.id:** publish parallel buyer-side pages on evaluating claims, reading disclosure, comparing support, understanding fees, and conducting due diligence. Cross-link only where it helps a reader switch roles; do not canonicalize one domain to the other by default.
- **Future Franchise.id and Waralaba.id surfaces:** the shared D1 schema names these network sites, but repository existence or a network row does not prove a live editorial property. Treat collaboration as a future opportunity, not a current content dependency.
- **Duit.co.id:** may independently explain business funding, cash flow, or financial literacy from a finance-education role. Franchisor.id must retain franchise-system economics and operator governance.
- **Codev.id:** may cover software engineering. Franchisor.id owns the business requirements, data rights, privacy, and operator workflows of franchise platforms.
- **Sector domains in the owned portfolio:** may provide specialist safety, food, construction, retail, or equipment evidence. Franchisor.id should link only to reviewed pages and retain the cross-sector franchise governance layer.

Cross-domain overlap is allowed. Same-domain boundaries, not portfolio ownership, determine cannibalization.

## Consolidation plan

1. Inventory titles, canonicals, headings, index state, backlinks, and live traffic for all 70 sitemap page URLs before changing URLs.
2. Match each of the 34 `/usaha/` records to canonical D1 identity and proposed `/peluang-usaha/{slug}/` publication. Keep unmatched or ambiguous rows in manual review.
3. Choose one authoritative brand URL per intent. Preserve useful legacy history through redirect only after content parity and deployment verification; do not bulk-redirect on slug similarity alone.
4. Reframe or consolidate the three promise-heavy root posts. The operator articles FRO-03 and FRO-04 must not imply guaranteed profit, “best” status, or universal suitability.
5. Consolidate `/artikel`, `/berita`, and `/franchisepedia` into a comprehensible editorial library while preserving valuable historical URLs.
6. Keep category, alphabet, popularity, city, and filter pages for navigation only unless each indexed page has unique demand and substantive evidence. Default thin combinations to noindex/canonical review.
7. Make one generated sitemap authoritative. Exclude protected routes, internal filters without unique value, duplicate archives, and noncanonical brand URLs.
8. Validate every redirect/canonical in a staging crawl, then monitor index coverage, impressions, and unexpected 404s before deleting legacy sources.

## Internal-link architecture

- Create `/panduan-franchisor/` as the central operator hub. It links to all 19 topic hubs and to the application routes only when context warrants.
- Every article links upward to its topic hub; every topic hub lists all six children and links back to the central hub.
- Lifecycle path: FRO-01 readiness → FRO-02 model → FRO-03 economics → FRO-04 disclosure → FRO-05 IP → FRO-06 legal → FRO-07 recruitment → FRO-08 qualification → FRO-09 onboarding → FRO-10 launch → FRO-11 support → FRO-15 governance → FRO-16 remediation → FRO-17 transition.
- Growth path: FRO-12 supply + FRO-13 marketing + FRO-14 data + FRO-15 governance → FRO-18 regional scale → FRO-19 international scale.
- Diagnostic pages link to prevention, evidence, corrective action, escalation, and exit pages rather than only to a sales route.
- Commercial links are contextual: recruitment education may link to `/peluang-usaha/` publication and `/premium/`; operational guides may link to `/profil/` or `/dashboard/` only when a demonstrated task is supported.
- Brand profiles should link to relevant neutral operator methodology only when it clarifies how information is sourced. Editorial pages must not imply that a listed brand's self-reported figures were independently verified unless they were.
- Related IDs in `ARTICLE_CATALOG.md` form article-level lateral paths; no generic repeated blogroll is permitted.

## Evidence and editorial standards

- Show a visible `last reviewed` date and jurisdiction on legal, tax, privacy, competition, licensing, and international pages.
- Use official statutes, JDIH, OSS/BKPM, Ministry of Trade, DJKI, KPPU, DJP, and other competent agencies as primary sources. Archive the exact source title and access date in the editorial record.
- A qualified Indonesian franchise/commercial lawyer must review prospectus, agreement, STPW, competition, consumer, termination, and international legal content before publication. Local counsel reviews foreign-market content.
- An accountant or tax adviser reviews unit-economics definitions, royalties, marketing-fund treatment, tax examples, and cross-border currency/tax content. Scenarios must state assumptions, date, data source, exclusions, and sensitivity.
- A privacy professional or counsel reviews personal-data purpose, lawful basis, notice, retention, sharing, cross-border transfer, data-subject requests, and breach content. A security practitioner reviews access, integration, and incident controls.
- Sector specialists own food safety, product safety, construction, health, employment, environmental, and other regulated operating claims. Generic franchise expertise is insufficient.
- Never publish a revenue, margin, payback, break-even, ROI, outlet-success, or market-size number without provenance and limitations. Historical results are not promises.
- Testimonials and case studies require consent, source records, methodology, selection context, material limitations, and a prohibition on invented experience.
- Clearly label self-reported, platform-verified, independently audited, illustrative, and estimated data. Missing information is `not provided`, not zero.
- Do not publish contract templates as ready-to-sign documents. Checklists identify issues for counsel; they do not decide enforceability.
- Preserve version history for manuals, claims, prospectuses, agreements, fee schedules, training, supplier rules, and platform policies.
- Editorial QA includes factual review, claim-register check, same-domain intent check, related-link check, accessibility, privacy, and a post-publication review date.

## First bounded publication cluster

Wave `W1-foundation` contains 12 connected assets:

- FRO-01-01, FRO-01-02
- FRO-02-01
- FRO-03-01, FRO-03-02
- FRO-04-01, FRO-04-02
- FRO-05-01
- FRO-06-01
- FRO-07-01
- FRO-08-01
- FRO-15-01

The cluster begins with the go/no-go decision, defines the system and economics, establishes substantiation/IP/legal gates, then connects responsible recruitment and qualification to governance. It is broad enough to demonstrate the operator role but small enough for counsel, accountant, and editorial review.

Publish the central `/panduan-franchisor/` hub with this wave even though it is a navigation asset rather than a separate catalog article. Link each article to its parent topic hub and sequence the readiness → model → economics → evidence → IP/legal → recruitment → qualification → governance path.

Success signals for the first 90 days:

- all assets crawled, canonical, indexable as intended, and free of sitemap/route collision;
- impressions and clicks separated by operator intent, not rank alone;
- engagement with scorecard, model, or checklist tasks;
- qualified operator registration, completed profile, or brand-claim actions attributable to the cluster;
- response time and progression from operator lead to verified brand publication;
- Search Console query/page checks for same-domain cannibalization;
- factual corrections, counsel findings, and reader questions logged for revision;
- no unsupported financial promise or unreviewed legal instruction published.

Do not proceed to broad W2 publication until the W1 review gates are complete and the cluster produces either useful operator engagement or specific evidence for revision.

## Definition of done

- All 19 parent topics retain six genuinely distinct briefs, for 114 catalog rows total.
- Catalog IDs, titles, and slugs validate as unique; related IDs resolve; topic counts match.
- Every page has one primary intent, an explicit exclusion, a named owner for excluded intent, and a useful internal-link role.
- Existing titles/routes and proposed slugs have no unresolved exact collision; semantic overlaps are recorded in the anti-cannibalization register.
- The 34 legacy brand URLs have evidence-based keep/redirect decisions before broad generated publication.
- City/province/region swaps, thin filter pages, and synonym articles are not used as authority coverage.
- Legal, financial, tax, privacy, competition, safety, and international pages pass the named qualified-review gates and show current source/review dates.
- A first-wave hub and 12 assets are published as a measured cluster; ranking is not treated as the sole success metric.
- Sitemap, canonical, redirect, structured-data, protected-route, internal-link, and post-deploy crawl checks pass.
- Shared network publication continues to respect `site_franchisor_id`, canonical D1 ownership, and per-site projection rules.
