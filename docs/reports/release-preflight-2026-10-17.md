# Release preflight — 2026-10-17

Branch: `codex/ux-first-improvements`. The user approved publication after the open content decisions and unavailable checks were disclosed. This preflight records the tested candidate; deployment requires separate live verification.

## Verified

- `npm run check`: 364 tests passed, zero failures or skipped tests.
- `git diff --check`: passed.
- Content: 11 tracks, 210 modules, 1,862 practice questions and 982 mock questions validated.
- Position audit: 242 banks / 2,844 questions, zero skewed banks under the documented thresholds; topic exercises: 24 decision banks / 81 questions, zero skewed banks.
- Course-key audit: 49 module links, 49 distinct generated copies and 55 curated questions, zero conflicts. Testim Mock Exam 6 remains protected by its full-bank hash.
- Initial shell: 294,812 bytes, within the 300,000-byte budget. Shared asset token `20261016m`; service-worker cache `quilyn-v238`.
- Additional Chrome check on the separate local test origin: TESTIM-M06 Q5 requires three selections and accepts the three course answers; the correct graded result survives reload. No warning/error console entries were observed in this session. Screenshot: `/private/tmp/quilyn-release-chrome-check.png` (local QA artifact, not shipped).
- Original-record preservation, unsigned legacy import warnings and signed-answer restoration are covered by regression tests. Earlier manual import and mock checks are documented in `testim-course-bank-followup.md`.

## Open decisions and unavailable verification

Ten substantive Testim differences still need Academy grading evidence. Their exact locations, old/new answers and assessments are in `testim-course-bank-followup.md`, `testim-key-review.json` and `testim-remaining-key-assessment.json`. Their current content has not been changed during this follow-up. After these limitations were disclosed, the user approved publication with the current answers retained and these editorial items left open.

Physical iOS/Android, Safari/Firefox, VoiceOver, actual 200%/400% browser zoom and participant usability checks remain unverified. Desktop Chrome and in-app browser checks do not substitute for those checks. Completion procedures are recorded in `ui-ux-improvements.md`. No new blocking defect was identified by the checks executed here; this does not establish that the unavailable checks passed.

## Publication status

The user subsequently authorized publication with “tamam canliya cikarabilirsin”. This authorizes the commit and push needed for the release. Production must not be described as updated until the actual release and live verification succeed. The unavailable checks above remain unverified after publication.
