# Cross-tab and reset fixes — 2026-10-02

Current build: asset token `20261002u`, service worker cache `quilyn-v67`.
Earlier release notes describe their historical builds and test runs.

## Changes

- A mock exam changed in another tab locks answer selection, grading, pause/resume, submission and question navigation. Disabled choices remain readable and expose `aria-disabled`.
- Persisted lesson quizzes also stop selection and grading after an external change. Transient retry quizzes remain usable.
- Reset Everything discards the active reading position and mock session without saving, cancels pending store writes, and blocks further progress writes until reload.
- The What's new page uses a user-facing introduction. The reset description includes the missing comma.
- Lazy feature scripts and styles inherit the version from the runtime script URL in the HTML shell.

## Verification

- `npm run manifest:content`: passed; generated outputs remained unchanged.
- `npm run check`: 90 tests passed, no failures.
- Initial shell: 295.6 KB uncompressed, below the 300 KB budget.
- Regression coverage includes post-conflict answer selection and answered count, navigation redraws and stale handlers, quiz selection, reset ordering, reading cleanup, mock discard, pending store writes, and lazy asset version consistency.

These changes are committed locally. No push or production deployment was performed for this release.
