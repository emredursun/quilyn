# Home learning workspace — 2 October 2026

## Research and design decisions

[IBM Carbon dashboard guidance](https://www.carbondesignsystem.com/building-blocks/data-visualization/dashboards) recommends prioritizing important information, limiting metrics and using space to communicate hierarchy. [Coursera's progress and next-step product rationale](https://blog.coursera.org/new-progress-tracking-features-on-coursera/) is a historical 2016 reference, not a claim about its current UI. It illustrates making the next learning action explicit alongside visible progress.

Applied to Quilyn: one primary learning action, a supporting review card, a compact module-mastery progress strip and a mock practice link. Utilities are grouped by planning/practice and records/resources. All existing destinations remain available. Module mastery is labeled as a 70%+ quiz score, not exam readiness; missing mock results are not displayed as a failed exam. Fully mastered and unavailable tracks have distinct copy. Existing recommendation logic and persistent data are preserved.

The home renderer and styles load together through the versioned runtime feature loader, with a route-generation guard against late responses. Both assets are precached for offline use. Shell query: `20261002z`; service worker: `quilyn-v72`.

## Verification

- `npm run check`: 94/94 tests passed, initial shell 297.3 KB (<300 KB).
- New regressions cover new/continuing/completed/unavailable states, truthful practice metrics, escaped titles, retained destinations and stale asynchronous home responses. Shared lazy-version coverage includes both new assets.
- Browser: light/dark desktop, 390 px and 320 px widths; no horizontal overflow at either mobile width. All dashboard/tool touch targets checked at 390 px are at least 44 px high. Continue learning opened the correct module. Switching PSA → PBA immediately replaced recommendation and progress (48 → 19 modules). Captured warning/error logs were empty.
- Physical devices and screen readers were not tested.

Screenshots: [light](screenshots/home-workspace-light-2026-10-02.png), [dark](screenshots/home-workspace-dark-2026-10-02.png), [mobile](screenshots/home-workspace-mobile-2026-10-02.png).

Saved as a local commit. No push or production deployment.
