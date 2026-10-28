# CTFL verification record

Date: 28 October 2026. Local working-tree verification; no deployment or remote CI run was performed.

## Delivered inventory

- 6 registered chapter modules covering all 64 CTFL v4.0.1 learning objectives.
- 102 official chapter keyword occurrences with original plain-language explanations.
- 64 worked examples, recall prompts and objective-specific misconception entries.
- 128 original topic questions: exactly two per LO, also usable as full chapter quizzes.
- 6 separate mock forms, each with 40 original questions: 240 mock items, 368 total items.
- Each form: chapter distribution 8/6/4/11/9/2; K distribution 8/24/8; all 29 official LO-group quotas satisfied.
- Every item has a permanent ID, LO/K mapping, source link, source review date, original-content provenance, answer key and explanatory rationale.
- Official A–D sample questions and matching answers linked from the study guide; none republished as Quilyn questions.

## Automated verification

`npm run check` passed: **372 tests, 0 failed**. It includes syntax checks, content validation, generated-output checks, offline manifest validation, static reading page and sitemap validation, and existing application regressions. The initial shell remains within its 300 KB uncompressed budget (approximately 298.0 KB); course and mock data load separately.

New assessment checks cover:

1. All 64 expected LO IDs, two questions per objective, valid lesson sections and all chapter keyword counts.
2. All six forms' chapter and K counts and mandatory/selectable LO quotas.
3. Permanent item IDs, answer indexes, option counts, explicit multi-select instructions, one-point scoring metadata, nonempty rationales and separate practice/mock identities.
4. No exact normalized repeated stem across the 368 questions. This is not a semantic-independence or difficulty measure.
5. Independent boundary-neighborhood calculations, ratio/three-point/extrapolation estimates, prioritization models and state-transition walks.
6. Topic selector behavior: a two-item quiz cannot invoke full-chapter mastery recording; returning to the chapter uses its saved answer state.
7. Standard 60-minute configuration and 26/40 threshold; provider-dependent 75-minute option; existing SSA configuration remains 90 minutes.
8. Existing mock simulation tests continue to cover continuous deadlines, resume, answer hiding, all-or-nothing set grading, unanswered submissions and stored attempt histories.

The official PDF was also extracted and compared separately: all 64 published LO IDs/K levels and all 102 keyword occurrences matched the authored inventory. Source fingerprints and the verified editions are recorded in the [research register](../istqb-ctfl-research.md).

## Editorial and bias checks

The content received an author review for units, inclusive boundaries, boolean feasibility, initial states, transition validity, dependency constraints, tie breaking and expected/actual result consistency. Position-dependent explanation references were removed; a regression rejects references to first/last/middle options, reports or sets in mock rationales. Defect-report distractors were revised to present comparable detail and meaningful reproduction errors.

The answer-position audit reports **zero skewed CTFL banks**. Every chapter bank is balanced across four single-answer positions; mock banks' single-answer counts differ by at most one. No CTFL bank has a correct-answer detail-length outlier under the existing audit's two-times-longest-distractor heuristic. Remaining longest/shortest, absolute-word and conservative letter-reference flags are review leads, not proof of factual error or absence of bias. The heuristic also flags legitimate set notation and requirement identifiers.

## Browser checks

Local in-app browser checks on a narrow viewport verified:

- Chapter 4 loads with the correct ISTQB source label and official links.
- Practice scope switches from the 28-item chapter quiz to the two-item FL-4.2.2 topic quiz.
- Selecting and checking an answer displays correct feedback, rationale and a link back to its related section.
- Six 40-question mock forms appear with the expected chapter bank shares.
- Selecting 75 minutes updates form cards; simulation starts at 75:00, shows all 40 navigation slots and hides per-question feedback/pause.
- Scoped select controls follow the active dark theme and fit the narrow viewport.
- A fresh local origin was used for final layout inspection to avoid the earlier preview service worker's cached assets.

Screenshots: [topic selector and quiz](istqb-topic-qa.png), [mock selection](istqb-mocks-qa.png). These are visual QA evidence, not a comprehensive real-device accessibility audit.

## Limits that remain visible to candidates

These are independent study notes and original practice forms, without ISTQB affiliation, endorsement or accreditation. Published official samples are not described as past live papers. No question is claimed to predict a future live exam.

There has been no independent human CTFL SME moderation, learner pilot, statistical item calibration or comparison against live exam difficulty. Coverage and passing local tests do not establish a guaranteed pass rate. Two topic answers do not establish mastery. Forms revisit concepts and techniques; repeat scores should not be treated as independent readiness evidence. A candidate should use the full syllabus, glossary and fresh official samples as described in the study route.

Before claiming calibrated readiness, collect independent item review and pilot evidence for ambiguity, time, difficulty and discrimination. Future source changes require a new version review rather than relying on this date indefinitely.

## 28 October follow-up: reading controls and assessment review

Section saves are now icon-only bookmarks aligned with their headings; concept saves sit in the card corner. A filled bookmark indicates the saved state. Accessible names, pressed state, native tooltips, keyboard focus and 44-pixel targets remain. Browser checks confirmed saving, collection navigation and removal, without changing stored bookmark identities. [Updated interface screenshot](compact-bookmarks-qa.png).

A second author pass strengthened two mock decision-table tasks, clarified the upload acceptance condition and completed the state-transition coverage hierarchy. This is not a substitute for independent review. The [review and pilot protocol](../istqb-pilot-protocol.md) records the pending independent-review choice and the absence of candidate data. The offline pilot-analysis tool is regression-tested on synthetic fixtures, which are not calibration evidence. [Current assessment status](istqb-assessment-status.json).


## Independent review completed and corrections rechecked

The user subsequently authorized two separate AI reviewers. Both assessed the full inventory and rechecked the 34 corrected items plus revised models. All bounded critical/major findings are closed at the final fingerprint recorded in the [resolution record](istqb-independent-review-resolution.md). Their reports preserve the baseline objections, including the BVA error that the original author-written test oracle had failed to detect. The updated application describes the forms as AI-reviewed varied rehearsal, without human sign-off or candidate-based calibration. Historical test counts above refer to earlier runs and must not be interpreted as validation of the superseded BVA rule.

Latest full verification after closure: **379 tests passed, 0 failed** with `npm run check`. `git diff --check` also passed. The browser preview initially had no running local HTTP server; the server was restarted and the formerly unavailable module loaded again. The corrected BVA guide, full domain/partition table, official clarification link and both revised topic question stems/options were then verified in the live application. [Reviewed BVA lesson screenshot](istqb-reviewed-bva-qa.png). This confirms local delivery of the corrected content, not a production deployment or candidate-based calibration.

## Study additions review (2026-10-28, second gap analysis)

- Exam essentials, study method and Try first exercises for 13 objectives (all 8 K3 objectives included) were reviewed by two separate AI reviewers, corrected and rechecked. See [istqb-study-additions-resolution.md](istqb-study-additions-resolution.md).
- Exercise solutions are collapsed behind "Show solution". This was verified in the browser at desktop and 375 px widths, with no horizontal scroll and no console errors.
- The question bank fingerprint is unchanged. No human SME sign-off, and no empirical difficulty calibration yet.
