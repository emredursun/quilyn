# CTFL study additions: independent review and resolution (2026-10-28)

Scope: the study material added during the second gap analysis. The question bank (topic quizzes and 6 mock forms) was not changed in this pass; its fingerprint is unchanged.

- `scripts/istqb/exam-readiness.mjs`: exam essentials and booking checklist
- `scripts/istqb/worked-models.mjs`: worked models and Try first exercises for 13 objectives
- `scripts/build-istqb.mjs`: study method, chapter orientation and the order of examples and exercises

Two separate AI reviewers checked it, each with a different role. Both then rechecked the corrections. No human ISTQB SME has signed this off.

| Review | Report | Initial findings | Recheck |
|---|---|---|---|
| Technical accuracy against syllabus v4.0.1, rules v1.2 and tables v1.19 (official PDFs) | [accuracy review](istqb-study-additions-accuracy-review.md) | 0 critical, 1 major, 8 minor | 9/9 resolved; 1 new minor, fixed |
| Learning design and candidate usefulness | [pedagogy review](istqb-study-additions-pedagogy-review.md) | 0 critical, 6 major, 10 minor | 15 resolved, 1 partial; 5 new minor: 3 fixed, 2 deferred or answered |

## Main corrections

| Finding | Resolution |
|---|---|
| FL-4.3.1 gave no branch-coverage figure. It counted only decision outcomes, but syllabus §4.3.2 counts every branch, conditional and unconditional. | The model now lists 4 branches. The answer is 4/4 statements = 100% and 3/4 branches = 75%. |
| Solutions were visible next to the prompts. | New `exercise` element. Its solution renders in a collapsed "Show solution" control in both the app and the static pages. |
| FL-4.3.1 and FL-4.3.2: the worked example gave away the exercise's answer. | The example now follows the exercise as a recap. |
| FL-5.5.1 depended on a story in another chapter. | The prompt now states acceptance criterion AC-3 and the preconditions. |
| No self-check exercise for BVA, decision tables, state coverage, extrapolation or risk-based prioritization. | New exercises added. Both reviewers recomputed every answer. |
| One completing test combined two invalid values, so one rejection could mask the other. | Each completing test now has at most one invalid value. |
| Study step 2 asked learners to solve worked examples and explain distractors, but those examples contain their answers and have no distractors. | Rewritten to "Try first, then open the solution". In quizzes, learners explain each wrong option. |
| Exam essentials omitted the Glossary keyword rule. | Added rules 4.1.3 and 2.1.4. |
| "1,135 teaching minutes" was presented as a study estimate. | Reworded: it is the minimum instruction time for accredited courses (§0.11), not a self-study estimate. |
| Other wording issues | 7 ± 2 person-days; the Wideband Delphi discussion trigger; the empty-cell convention for invalid transitions; timing per K level (32 + 24 = 56 minutes); samples A–C as checkpoints and sample D kept unseen; a K3 note in each chapter; decision-table rules named by their conditions. |

## Deferred

- No source is cited for worked-example fading. This is optional, and the advice is already hedged.
- One FL-4.2.2 table row partly overlaps the curriculum example. It is kept on purpose as a contrast for a non-negative domain.

Open critical or major findings: 0. Real difficulty calibration still requires candidates' first-attempt data (see `istqb-pilot-protocol.md`).

## Third gap analysis: keyword practice and mock result analysis (2026-10-28)

Official requirements were rechecked on the same day. The CTFL v4.0 page still lists syllabus v4.0.1, rules v1.2, structure tables v1.19 and sample sets A–D (v1.7, v1.7, v1.6, v1.5). It shows no announcement of a new version. The gaps found and closed:

| Gap | Change |
|---|---|
| Rules v1.2 §4.1.4 makes syllabus keywords examinable at K2, but the 102 keywords had a table and no retrieval practice. | 23 original "distinguish and classify" keyword self-checks, in an end-of-chapter section that the candidate attempts without the table. |
| "What to study next" linked CTFL mistakes to a library search. The numbered module names did not match the unnumbered mock domains. | Matching fixed. Mistakes are grouped by chapter, with every missed objective linked to its lesson section. |
| The official answer keys map items to an LO and a K-level, but results showed only chapters, and in shuffled order. | Chapters are listed in order, a K-level breakdown is added, and each rationale shows its objective with a lesson link (hidden until submission in simulation mode). |

| Review | Report | Initial findings | Recheck |
|---|---|---|---|
| Keyword check accuracy (syllabus v4.0.1, rules v1.2) | [keyword accuracy review](istqb-keyword-checks-accuracy-review.md) | 0 critical, 2 major, 8 minor | 10/10 resolved; no new issues |
| Analytics correctness, regressions and keyword usability | [analytics review](istqb-mock-analytics-review.md) | 0 critical, 4 major, 13 minor | All major resolved; 3 new minor issues fixed; minor items listed as deferred are accepted |

Deferred: objective titles in mock results (adding them would change the reviewed mock bank), an explicit `lessonSection` field, and a formal-versus-informal review keyword check. The mock bank fingerprint is unchanged. App asset versions moved to `20261028a` and the service worker cache to `quilyn-v242`, so returning visitors load the new code.

## Track introduction (2026-10-28)

A neutral "About this preparation track" section now opens chapter 1. It gives the purpose of the track and the official versions it is based on. It says the official syllabus is the primary source and that the official document applies where anything differs, and it states the quality limits, the independence notice and the trademark notice. The attribution now appears only once. A separate AI review ([introduction review](istqb-introduction-review.md)) found 0 critical, 2 major and 7 minor issues, and all of them were applied. The copyright wording now follows the syllabus Copyright Notice, and "not accredited training" was added.

A 12-word overlap scan of all six modules and the 240 mock items against CTFL Syllabus v4.0.1 found one match only: the required trademark sentence. Owner decision: the syllabus terms allow non-commercial extracts with the source named, and only accredited providers may base a training course on it. Quilyn should therefore stay non-commercial and be described as a preparation track, not as training. The owner confirmed on 2026-10-28 that Quilyn is free and non-commercial, so the current wording stands.
