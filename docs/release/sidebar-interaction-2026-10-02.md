# Sidebar interaction — 2026-10-02

Asset token `20261002w`; service worker cache `quilyn-v69`.

Module, mock/review and personal-study links use theme-specific indigo/blue hover surfaces and visible borders. Question/module badges reinforce the highlight. Active-page styling and completed-state indicators remain distinct. Hover no longer scales or shifts the row. Keyboard focus receives the same surface plus the existing focus outline. Pointer-only styling uses `@media(hover:hover)`.

Browser checks on a separate localhost origin confirmed actual pointer hover in light and dark themes, stable row geometry, and keyboard focus styling. Screenshots: [light](../screenshots/sidebar-interaction-light-2026-10-02.png), [dark](../screenshots/sidebar-interaction-dark-2026-10-02.png).

`npm run check`: all 92 tests passed, shell below 300 KB. No new dependencies or content edits in this UI commit. Physical device/screen-reader checks were not performed. Local commit only; no push or deployment.
