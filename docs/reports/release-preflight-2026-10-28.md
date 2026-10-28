# Release preflight: 2026-10-28 (ISTQB CTFL track)

Branch: `codex/ux-first-improvements`. This preflight records the tested candidate. Publication has **not** been authorized yet. Committing, pushing and live verification each need separate approval.

## Scope of this candidate

- A new track: ISTQB® CTFL v4.0, based on Syllabus v4.0.1, Exam Structures and Rules v1.2 and Exam Structures and Rules Tables v1.19 (checked against the official page on 2026-10-28). It contains:
  - a neutral introduction
  - exam essentials
  - lessons for all 64 learning objectives
  - 102 keywords with 23 keyword self-checks
  - worked models and "Try first" exercises with collapsed solutions
  - 128 topic questions
  - six 40-item practice exams
- Mock result analysis for banks tagged with learning objectives:
  - chapters in order
  - a K-level breakdown
  - missed objectives grouped by chapter and linked to their lesson sections
  - an objective link in each rationale (hidden before submission in simulation mode)
- A fix to revision matching, so numbered module names now match their unnumbered mock domains.
- Earlier UX work on this branch: compact bookmark icons in place of "Save section" text.

## Verified

- `npm run check`: 386 tests passed, 0 failed.
- `git diff --check`: passed.
- Content validation: 12 tracks, 216 modules, 1,990 practice questions and 1,222 mock questions; 7.01 MB of JSON.
- Answer-position audits: quizzes have 254 banks and 3,212 questions with 0 skewed banks. Topic exercises have 24 decision banks and 81 questions with 0 skewed banks.
- CTFL blueprint for every form: 40 items, chapters 8/6/4/11/9/2 and K-levels 8/24/8. Every form follows the official selectable-objective groups, and all 64 objectives appear in at least one form.
- Review trail: two separate AI reviews of the CTFL bank, followed by reviews of each later addition, each with a correction recheck. 0 open blocking findings. The bank change for FL-5.1.3 is recorded with its fingerprint (`istqb-fl-5-1-3-mock-coverage.md`). Receipts are enforced by tests in `docs/reports/istqb-assessment-status.json`.
- Verbatim check: a 12-word overlap scan against Syllabus v4.0.1 matched only the required trademark sentence.
- Initial shell: 299,957 bytes. This is within the 300,000-byte budget but has only 43 bytes of headroom, so the next shell change needs a size reduction. Asset token is `20261028a` and the service-worker cache is `quilyn-v242`.
- In-app browser checks (desktop and 375 px):
  - collapsed exercise solutions
  - the introduction and keyword self-check sections
  - mock objective links and the K-level breakdown
  - grouped revision links after submitting a partial mock
  - no horizontal scroll and no console errors

## Known limitations (disclosed in the track)

- The CTFL content has no human ISTQB subject-matter expert sign-off.
- Item difficulty has not been calibrated with candidate data (`istqb-pilot-protocol.md`).
- Deferred minor items:
  - mock source links point to chapter pages, not section pages
  - objective titles are not shown in mock results
  - there is no keyword check for formal versus informal reviews
- Owner decision recorded: Quilyn is free and non-commercial and is described as a preparation track. This matches the syllabus terms of use.

## Not verified

- Physical iOS and Android devices, Safari and Firefox, VoiceOver, real 200% and 400% zoom, and participant usability testing.
- The Testim editorial items still open from the 2026-10-17 preflight. This candidate does not change them.
