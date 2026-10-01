# Mobile reading and exam layout — 1 October 2026

## Changes

- At widths up to 860 px, the main header scrolls with the document. Desktop retains its sticky header. The sticky offset is calculated from the actual header positioning.
- The exam toolbar occupies one row: timer, pause, answered count and More. More exposes Quit and Submit; it dismisses on outside pointer input, Escape or action selection. The existing bottom Submit button remains available.
- Source citations use a collapsed native details disclosure instead of dozens of hostname chips. Expanded links show distinct full URLs, wrap safely and have 44 px minimum height. The expanded list scrolls within a bounded region.
- Four lesson tabs use short visual labels and full accessible names. Quiz progress is inside the quiz panel, so it cannot squeeze the sticky tab row.
- Smart Review uses a single-row progress toolbar on narrow screens.
- The Quit confirmation now says Quit, rather than Submit. Pause and Resume use plain text labels.
- Asset query version is `20261001d`; service worker cache is `quilyn-v45`. Earlier release records describe their own v43 publication.

## Verification

Local browser verification used a separate test origin to preserve the user's active exam and saved progress. Checked 320 and 390 px portrait, 844 px landscape and 1024 px desktop layouts; no horizontal document overflow was observed in the checked flows. Light and dark exam rendering were inspected.

Measured heights: exam toolbar 61 px (previous layout 117 px), lesson tabs 56 px, Smart Review toolbar 65 px (94 px before the single-row fix). The closed source disclosure occupies 46 px. On scroll, the main header leaves the viewport.

Verified exam action disclosure, Escape dismissal, Quit/Cancel, Pause/Resume, source expansion and collapse, lesson quiz switching and Smart Review session entry/exit. A local service worker update was activated through the existing Update app control.

`npm run check`: 31 tests passed, syntax valid for 74 JavaScript files, content and interactive exercise validation passed. Initial shell source is 298.6 KB, within the existing 300 KB budget. `git diff --check` passed.

Screenshots: [exam](../screenshots/mobile-exam-compact.png), [reading](../screenshots/mobile-reading-compact.png).

Physical Android/iOS, VoiceOver and TalkBack remain unverified. Browser viewport testing does not substitute for these checks. Commit and publication status are recorded in Git and [GitHub Actions](https://github.com/emredursun/quilyn/actions).
