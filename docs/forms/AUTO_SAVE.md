# Franchisor form auto-save

Last updated: 2026-07-22 (Asia/Jakarta)

## Current behavior

The Franchisor form uses browser `localStorage` as a pre-submit recovery layer. It is domain-local, expires after 72 hours, and is cleared after successful submission. The submitted record and D1-backed server state remain authoritative; this draft is not cross-device cloud storage.

Storage contract:

```text
key            franchisor_form_draft
schema_version 2
TTL            72 hours
metadata       saved_at, page_url, claim_brand_id
payload        fields collected from the form
excluded       unclaimed_id (claim linkage is managed separately)
```

A claim draft is not restored over a different active claim. If both the saved and current `claim_brand_id` exist and differ, restoration is skipped.

## Save triggers

| Trigger | Behavior |
| --- | --- |
| Input/change | Debounced save after 300 ms. |
| Periodic safety net | Save every 5 seconds while the form is active. |
| Next/back navigation | Save before changing form steps. |
| Document hidden | Save on `visibilitychange` when the tab/window is hidden. |
| Page exit | Last-chance save on `beforeunload`. |
| Role tab switch | Save before `openTab` leaves the Franchisor form. |

`FF.stopPeriodicAutoSave()` clears periodic/debounce timers. A successful submission also clears the draft and applicable claim state.

## Code ownership

- `js/form-01-state-helpers.js`: keys, TTL/schema metadata, save/restore/clear, stale and claim-mismatch guards.
- `js/form-06-submit-validation.js`: debounce/periodic configuration, event hooks, navigation wrappers, and successful-submit cleanup.
- `js/form-03-navigation-steps.js`: underlying tab/step functions wrapped by auto-save.
- `daftar/index.html`: form and `#autosave-indicator` element.
- `css/form-franchise/01-utilities.css`: indicator styling using Franchisor red `#cf322e`.

The Franchisee tab has its own flow and does not use this Franchisor draft key.

## Failure behavior

Storage access is wrapped in error handling. A storage quota/privacy-mode failure logs a warning and does not block normal form completion or server submission. The indicator appears only after a successful browser save and must not be presented as proof that D1 received the form.

## Verification checklist

- Fill multiple fields, wait 300 ms, refresh, and confirm restoration.
- Wait at least 5 seconds without input and confirm the periodic save updates `saved_at`.
- Verify next/back and role-tab switches preserve the draft.
- Hide/close/reopen the page within 72 hours and confirm restoration.
- Confirm an expired draft is removed.
- Save a claim draft for Brand A, open Brand B, and confirm Brand A does not overwrite it.
- Submit successfully and confirm the local draft and applicable claim state are cleared.
- Confirm `#autosave-indicator` uses Franchisor red and remains non-blocking.

## Optional future work

Clerk-authenticated D1 drafts may be added later for cross-device continuity. That requires explicit ownership, conflict, retention, and cleanup rules. Keep local auto-save as the immediate safety net and do not introduce a separate data platform for draft sync.

Related references: `CLAIM_TRANSITION_MATRIX.md`, `../../js/symbols_inventory.md`, `../../css/form-franchise/CSS_USAGE_MAP.md`, and `../../CODEBASE.md`.
