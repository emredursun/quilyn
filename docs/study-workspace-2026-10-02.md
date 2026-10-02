# Study plan and Bookmarks workspace

## Research and design decisions

Reviewed primary product/design sources on 2 October 2026:

- [Duolingo core tabs redesign](https://blog.duolingo.com/core-tabs-redesign/): consistent headings, typography and spacing, balanced with each screen's purpose. Quilyn uses the existing Home identity and reserves accent color for the next study action.
- [Coursera learning advice](https://blog.coursera.org/8-tips-for-effective-online-learning/): specific daily study goals and scheduled time. Quilyn puts an ordered daily agenda ahead of preference configuration.
- [NN/G progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/): secondary detail remains available without crowding the primary task. Estimate methodology uses a native disclosure alongside the visible planning caveat.

These are design references, not evidence that Quilyn engagement has improved. No user study or tier ranking is claimed.

## Implemented

`#plan` is an agenda with one primary next activity, time allocation, skip/restore actions, recent lessons, editable daily preferences and an outlook. Allocated time is explicitly labeled as a suggestion, not completed study time or exam readiness. The recommendation and storage contracts are unchanged.

`#plan/bookmarks` is a separate collection view with current-track count, searchable lesson cards, last-opened tab, lesson links, accessible removal and useful empty/no-match states. Filtering does not write progress. Removing an item retains the search and moves keyboard focus to the search field. Save and skip/restore operations retain a useful focus target after redraw.

Both screens use shared SVG icons, existing theme tokens, 44 px controls and responsive layouts. Styling loads with the study feature and is cached by the service worker. No dependency added. Shell query 20261002ad; cache quilyn-v76.

## Verification

- `npm run check`: 99/99 passed. Shell remains under 300 KB (approximately 297.4 KB).
- Regression covers distinct daily/collection markup, escaped bookmark content, empty states, single first activity and the lazy stylesheet sharing the shell version.
- Browser: 45-minute preference survived reload; skipping the first activity moved focus to Restore and changed the first suggestion; Restore worked.
- Bookmarks: two lessons saved through lesson toolbar; search filtered to one; removal retained search and keyboard focus; count/no-match state updated; saved module persisted across reload.
- 320 and 390 px screens: no document horizontal overflow in checked states. Light/dark themes inspected. Console warning/error was empty during the online flow.
- Offline: diagnostics mode intentionally disables the worker, so the first diagnostics-only offline attempt failed. A normal PWA session installed the shell; with its server stopped, Bookmarks reloaded and Study plan opened with the saved 45-minute preference and collection intact. This checks pre-cached shell, not uncached lessons.
- Physical iOS/Android and VoiceOver/TalkBack remain unverified.

Screenshots: [desktop light](screenshots/study-workspace-light-2026-10-02.png), [desktop dark](screenshots/study-workspace-dark-2026-10-02.png), [mobile](screenshots/study-workspace-mobile-2026-10-02.png), [Bookmarks light](screenshots/bookmarks-workspace-light-2026-10-02.png).

Local commit only; no push or production deployment.
