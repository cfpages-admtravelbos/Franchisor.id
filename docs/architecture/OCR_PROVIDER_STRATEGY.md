# OCR Provider Strategy

> Franchisor adaptation: this is a shared operational contract. Provider credentials must be configured separately for the Franchisor Pages project and must never be committed.

Last updated: 2026-07-22 (Asia/Jakarta)

## Decision

Use local selectable-text extraction first. Send only image-only/scanned brochure pages to external OCR. Provider failover must use one legitimate account per provider, stop on quota/rate errors, and continue with the next enabled provider. Do not create extra accounts or projects to evade a provider's limits.

Provider credential metadata is still managed from D1 because the admin explicitly requested dashboard-managed configuration, but credential values must be encrypted before storage with a root key held outside D1. The root key is the Cloudflare Pages secret `OCR_KEY`. The dashboard must never return stored credential values, must use blank password fields to preserve existing values, and must audit only configuration metadata. Without `OCR_KEY`, new credential saves and provider enablement must fail closed so plaintext is not written to D1.

The implemented dashboard deliberately uses bounded runs: one asset for dry-run and up to five queued jobs per manual batch. The protected `/ocr-worker` can process a bounded request, but this repository does not currently contain an OCR scheduling workflow. Add scheduling only through a separate reviewed change with an explicit quota/cost owner.

## Ranked provider shortlist

The provider allowance notes below were inherited from upstream research last reviewed on 2026-07-11. Limits and models are time-sensitive: verify each official provider page and the actual account console before enabling production rotation. “Recurring” means the cited allowance resets; “trial” means it is not durable capacity.

| Rank | Provider | Official free allowance | Reset/type | Brochure fit | Integration notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | OCR.Space | 500 requests/day per IP on the free endpoint | Recurring daily | Strong first fallback for page images | Simple OCR-specific API. Treat each raster page as one request. Free endpoint availability and file limits are less enterprise-grade than hyperscalers. Source: https://ocr.space/ocrapi |
| 2 | Azure AI Vision | 5,000 free transactions/month; local F0 guard 20 transactions/minute | Recurring monthly | Strong OCR accuracy and predictable quota | Multipage PDF pages count separately. Requires endpoint plus key; F0 availability varies by region/resource. Source: https://azure.microsoft.com/en-us/pricing/details/ai-vision/ |
| 3 | Cloudflare Workers AI | 10,000 neurons/day at no charge | Recurring daily, compute-based | Best infrastructure fit; useful vision fallback | Not a fixed page quota. Use a vision-capable model and measure actual neurons/page before setting a local page limit. Can use account ID plus scoped API token through REST. Source: https://developers.cloudflare.com/workers-ai/platform/pricing/ |
| 4 | Google Cloud Vision | First 1,000 OCR units/month free | Recurring monthly | Mature dense-document OCR | Each image/PDF page is a billable unit. Simple image calls can use an API key; async PDF processing has additional Google Cloud storage/auth requirements. Source: https://cloud.google.com/vision/pricing |
| 5 | Groq vision model | Llama 4 Scout free-plan limit currently 1,000 requests/day | Recurring daily, model/token limited | Useful multimodal fallback for image pages | Not a dedicated OCR endpoint; output must be constrained to transcription only and validated. Organization-level token limits may be reached before request limits. Source: https://console.groq.com/docs/rate-limits |
| 6 | Amazon Textract | New AWS customers: Detect Document Text up to 1,000 pages/month for three months | Trial, three months | Strong scanned-document OCR | Not a permanent free pool. Requires access key, secret, and region; disable automatically when the trial ends. Source: https://aws.amazon.com/textract/pricing/ |
| 7 | Veryfi | 100 documents/month on the API free plan | Recurring monthly | Useful for testing structured extraction | The published free allowance focuses on document extraction products; validate general brochure support before production use. Source: https://www.veryfi.com/pricing/ |
| 8 | Mindee | Current public pricing page does not expose a stable free quota in a scrapeable way | Account-specific/unverified | Good PDF/document pipeline evaluation | Do not count Mindee in combined known free quota until the dashboard/account confirms the exact allowance. Source: https://www.mindee.com/pricing |
| 9 | PDF.co | Paid plans publish monthly credits; free trial credits are account-specific | Account-specific/trial | Useful for PDF-to-text/OCR experiments | Credits are endpoint-dependent rather than a fixed page count. Do not count PDF.co in combined known free quota until the account quota is known. Source: https://pdf.co/pricing |
| 10 | API4AI OCR | A free RapidAPI plan is advertised; current public docs do not publish a stable quota | Account-specific/unverified | Supports JPEG, PNG, and multipage PDF | Keep disabled until the provider console confirms the exact free quota and commercial terms. Each PDF page is charged separately. Source: https://api4.ai/docs/ocr |

## Rotation policy

1. Compute a content hash and reuse successful OCR text; never resend an unchanged page.
2. Try selectable PDF text extraction before any external provider.
3. Sort enabled providers by admin priority, then skip providers in cooldown or whose configured quota counter reached its reset limit.
4. Retry transient `408`, `429`, and `5xx` responses with bounded backoff; after the retry budget, move to the next provider.
5. Mark authentication/configuration failures as blocked and require an admin action instead of repeatedly sending requests.
6. Record page count, provider, latency, response status, quota headers, and extraction confidence without logging credentials or brochure contents.
7. Trial providers must have an optional expiry date and automatically leave rotation after expiry.
8. Never spread one brochure across providers unless failover is required; this reduces privacy exposure and inconsistent OCR output.
9. Normalize every provider response into the existing proposal-knowledge text/candidate contract before admin review.
10. Keep human approval mandatory before OCR-derived values update canonical listing fields.
11. Apply local short-window provider rate guards before each external call. If a provider reaches its configured request window, mark it `cooldown`, set `cooldown_until`, and try the next eligible provider instead of firing another request immediately.

## Provider Health Transitions

| Current state | Return-to-ready policy | Admin visibility |
| --- | --- | --- |
| `unconfigured` | Save the required credential fields and enable the provider. | Dashboard shows missing credential/config requirement before enablement. |
| `disabled` | Admin explicitly enables the provider after required credentials exist. | Dashboard keeps the provider out of rotation. |
| `ready` | Stays eligible until a quota, rate, credential, or adapter error changes health. | Dashboard shows remaining known quota and last checked metadata. |
| `cooldown` | Automatically eligible again after `cooldown_until <= CURRENT_TIMESTAMP`; no manual reset needed unless the provider keeps failing. | Dashboard shows cooldown time and the latest provider error without exposing credentials. |
| `exhausted` | Eligible after the configured `quota_reset_at` passes or an admin corrects quota metadata. Do not retry during the same quota window. | Dashboard should show quota used/reset info and tell admin to wait for reset or disable the provider. |
| `blocked` | Admin must fix credential, endpoint, account, billing, or provider-console access, then save/toggle the provider to reset health to `ready`. | Dashboard shows copyable `last_error` and must not keep spending requests on this provider. |

Failed health checks should set `last_error`, `last_checked_at`, and one of `cooldown`, `exhausted`, or `blocked` depending on whether the recovery is time-based, quota-reset-based, or admin-action-based.

## D1 and dashboard implementation plan

- [x] Research and rank ten providers with official source links and free-limit caveats.
- [x] Consume the shared D1 storage for provider metadata, masked credential state, priority, enablement, quota, reset period, trial expiry, and health status. The migration is `0020_ocr_provider_configs.sql` in the migration-owning Franchisee.id repository; Franchisor.id intentionally does not copy that migration chain.
- [x] Add admin-only read/update helpers that never return stored key/secret values.
- [x] Encrypt saved credential values with AES-GCM envelopes using Cloudflare Pages secret `OCR_KEY` as the external root secret. Existing plaintext values, if any, are re-encrypted on the next save instead of being returned to the browser.
- [x] Add a dedicated `/dashboard` OCR tab with provider selector, provider-specific password credential fields, only the endpoint/account/region/model fields required by the selected provider, read-only quota/free-limit metadata, priority, enable toggle, and explicit credential-clear controls only when a stored credential exists.
- [x] Add Zod validation, audit events without secret values, regression checks, documentation maps, changelog, and session context.
- [x] Add provider adapters, quota counters, OCR job queue, content-hash cache, and bounded failover. OCR execution remains admin-triggered from `/dashboard`; provider credentials/configuration alone does not send brochure data externally.
- [x] Consume OCR job state introduced by upstream migration `0021_ocr_job_queue.sql`: `ocr_jobs`, `ocr_attempts`, `ocr_content_cache`, and `ocr_provider_usage_events`.
- [x] Add `/dashboard-data` actions `enqueue_ocr_jobs` and `run_ocr_jobs`. Enqueue only creates local D1 jobs for active proposal image assets; `run_ocr_jobs` is the explicit action that fetches the image and sends it to enabled providers.
- [x] Add `/dashboard-data` action `run_ocr_dry_run` and a `/dashboard` button for a one-asset production dry-run before broad backfills. The action requires `OCR_KEY` and at least one enabled provider, prepares at most one candidate job, and runs only that job.
- [x] Normalize successful OCR output into `franchise_asset_knowledge` plus pending `proposal_extraction` suggestions, preserving the human review requirement before canonical listing fields change.
- [x] Clarify dashboard execution semantics: Dry run is a real OCR call for one asset, while “Jalankan batch berikutnya” processes a bounded batch of up to five jobs per click to avoid request timeout and uncontrolled provider quota usage.
- [x] Add copyable provider error status in `/dashboard` so an admin can paste provider health/error context into troubleshooting without exposing stored credentials.
- [x] Add protected `/ocr-worker` support for an external scheduler or deliberate request. The route requires `OCR_SECRET`, processes at most ten jobs per request, defaults to five jobs, enforces a daily counted-usage cap, logs summaries to `operation_events`, and reuses the dashboard runner. No OCR cron/workflow is configured in this repository.
- [x] Change manual batch selection to franchise-context-first ordering: queued proposal pages for one franchise are processed by page order before the runner moves to another franchise, while content-hash cache still prevents duplicate OCR for images that were already processed.
- [x] Surface page/source context in `/dashboard` OCR results so each OCR text preview clearly shows which franchise and proposal page it came from.
- [x] Consume upstream migration `0022_ocr_provider_rate_limits.sql` for request-window metadata and `cooldown_until`; manual dashboard batches and the protected worker skip providers during cooldown.
- [x] Consume upstream migration `0029_ocr_provider_actual_limits.sql` and shared metadata in `src/lib/ocr-provider-metadata.js`. Reverify provider limits before use rather than treating the stored research values as permanent guarantees.

## Dashboard credential field rules

The admin form intentionally hides fields that do not apply to the selected provider. Free allowances, reset period, quota unit, endpoint defaults, and trial status are displayed as provider metadata instead of editable admin inputs because those values come from the provider/account terms, not from Franchisor.id.

The provider field/requirement contract lives in `src/lib/ocr-provider-metadata.js`. Dashboard field visibility, server-side activation validation, and OCR regression checks must use that shared module so browser and backend behavior do not drift when provider adapters are added.

| Provider | Visible credential/config fields |
| --- | --- |
| OCR.Space | API key only |
| Azure AI Vision | Azure Vision key, Azure Vision endpoint |
| Cloudflare Workers AI | Cloudflare API token, account ID, vision model |
| Google Cloud Vision | API key only for the initial simple image OCR path |
| Groq Vision | Groq API key, vision model |
| Amazon Textract | AWS access key ID, AWS secret access key, AWS region |
| Veryfi | Veryfi API key, Veryfi username/auth secret, client ID |
| Mindee | API key only |
| PDF.co | API key only |
| API4AI OCR | API4AI/RapidAPI key only |

## Required production setup

Set the Cloudflare Pages secret `OCR_KEY` before saving or enabling OCR providers. Use a long random value and rotate it only with a planned re-encryption pass, because existing encrypted D1 envelopes depend on this root key.

Set `OCR_SECRET` and the matching external caller configuration only if the protected worker will be used. No installed secret or external schedule is assumed by this document. `OCR_WORKER_DAILY_CAP` can impose a lower global daily ceiling than provider quotas.

Admins enqueue proposal assets from `/dashboard`; the worker only drains pending `ocr_jobs`. Follow `docs/operations/MANUAL_SETUP_CHECKLIST.md` for Cloudflare web-UI secret configuration. Do not enable unattended scheduling until a reviewed workflow or scheduler exists and a production dry-run succeeds.
