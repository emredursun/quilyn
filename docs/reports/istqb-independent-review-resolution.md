# CTFL independent AI reviews: findings and correction closure

Completed 28 October 2026. The user authorized two separately tasked AI review agents. One reviewed content accuracy and syllabus coverage; the other reviewed assessment design, cognitive demand and the pilot-analysis implementation. Neither was the authoring agent. They worked separately and did not consult each other's report during the baseline review. They inherited task context and could access keys, so this was **not strictly blinded**, and it is not independent human SME approval or accreditation.

## Outcome

Both reviewers accepted the bounded corrections after a second pass. **No critical or major blocking finding remains open in the reviewed changes.** Acceptance is for formative study and **varied rehearsal**, not calibrated live-exam equivalence or an assertion that the entire bank is defect free.

- Baseline: 64 objective sections; 102 keyword occurrences; 128 topic questions; 240 mock questions. All 368 stems, options, keys and rationales reviewed.
- Corrections: **34 items** — 6 topic items and 28 mock items — plus terminology, worked models and the BVA regression oracle.
- Baseline mock-bank SHA-256: `f2c0a3a680428ec82a1c579671e7f54aca0af73294aec4d2f4e1c74039d61ea5`.
- Final reviewed mock-bank SHA-256: `6c692693517ea538be7e99306cc8fddf9b96e99c359a6987ef9799d87e06f9e8`.
- Six forms still have 40 items each, chapter counts 8/6/4/11/9/2, K counts 8/24/8 and all 29 mandatory/selectable LO-group quotas.

The [accuracy report](istqb-independent-accuracy-review.md) and [assessment report](istqb-independent-assessment-review.md) preserve their original baseline findings and append correction re-review conclusions. The [baseline receipt](istqb-independent-review-baseline.json) preserves the initial source hashes; the [current receipt](istqb-assessment-status.json) records the final bank, module hashes, changed IDs, review scope and remaining limits. A regression checks that the saved review receipt still matches the bank and module files.

## Adjudication

| Issue | Cross-reference | Decision and evidence |
|---|---|---|
| Incomplete BVA procedure, answer sets and domain assumptions | Accuracy A1; Assessment A1 | **Fixed.** All eight BVA items now declare the feasible domain and intended coverage scope. Full coverage is derived from each partition's finite extrema and feasible neighbors. Nonnegative outer endpoints and singleton overlap are explicitly taught. Both reviewers recomputed the new keys. |
| Larger supersets also achieved the requested coverage | Second-pass Accuracy/Assessment A1 | **Fixed after re-review.** C4-Q05 and M4-Q34 explicitly ask for the exact minimum coverage-item set. This removes the ambiguity without incorrectly saying a larger test suite cannot attain full coverage. |
| Ambiguous exact-two automation-risk item and related wording risk | Accuracy A2; Assessment A2 | **Fixed.** M2-Q32 asks specifically for lifecycle effort costs; M4-Q32 asks for adverse selection risks. Nonkeys are relevant benefits, rather than unrealistic claims that themselves could be risks. Both exact-two sets rechecked. |
| Risk-assessment definition included identification | Accuracy A3 | **Fixed.** Risk analysis = identification + assessment; risk control = mitigation + monitoring. Assessment evaluates already identified risks, prioritizes them and proposes responses. |
| Missing named techniques and examinable representations | Accuracy A4 | **Fixed.** Added Wideband Delphi/Planning Poker, the eight syllabus non-functional characteristics, full/reduced decision tables and notation, and a guarded state table with invalid cells and a valid self-loop. |
| Weak K3 decision-table topic checks | Accuracy A5; Assessment A3 | **Fixed.** C4-Q07/Q08 now require deriving a missing feasible case and expected action, including an infeasible combination. |
| Report-writing items merely identified missing fields | Accuracy A5/A6; Assessment A4 | **Fixed.** C5-Q31/Q32 and M2-Q40/M5-Q40 now supply concrete anomalies and ask for correctly constructed reports with plausible competing reports. The rounding example states discount and round-half-up explicitly. |
| Fifteen unrelated or nonfunctional mock distractor sets | Assessment A5 | **Fixed within the bounded list.** Alternatives now concern neighboring testware, metrics, plans, traceability or configuration evidence. Their differences require syllabus-relevant reasoning rather than rejecting invoices, fonts, office floors or personal insults. |
| Confirmation/regression depended on an unstated original defect | Accuracy A7; Assessment A6 | **Fixed.** M1-Q14 explicitly identifies a previously working, unchanged path distinct from the original failure case. |
| Acceptance-criteria items did not target format classification directly | Accuracy A8; Assessment A7 | **Fixed.** M1-Q24 and M5-Q24 now classify scenario-oriented versus rule-oriented criteria. |
| Pilot input typing/property lookup | Assessment pilot notes | **Hardened.** Require a string pseudonym and an own-property form name. Existing exact-set grading, Wilson intervals and corrected item-total calculation were accepted in the code review. |

The bounded fifteen-item distractor list is: M1-Q06/Q07/Q27; M2-Q26/Q30; M3-Q25/Q27; M4-Q26; M5-Q06/Q07/Q22/Q26; M6-Q06/Q07/Q30. Prefix every ID with `CTFL-`.

## Why the BVA correction matters

The initial authoring shortcut and its test oracle shared the same mistake. Passing those tests did **not** independently establish that the taught method was correct. The new oracle starts from partition extrema, adds feasible neighbors and deduplicates. It checks all-integer, nonnegative, finite-domain and overlapping-neighborhood cases.

The reviewers and author verified the interpretation against the [official ISTQB-hosted BVA clarification by Hamburg and Roman](https://istqb.org/wp-content/uploads/2025/10/Boundary-Value-Analysis-white-paper.pdf), particularly §§2–4, and the [official Sample B v1.7 answer explanation for Q21](https://istqb.org/?download_id=3365&sdm_process_download=1). The product uses original examples, not copied sample-exam questions. The clarification is linked beside the BVA lesson.

## What remains unestablished

- **Candidate-based calibration:** zero candidate attempts were supplied. Item proportions correct, discrimination and option functioning remain unknown; no invented results are reported.
- **Human SME sign-off:** not supplied. Separate AI review can find substantive problems but is not a human qualification.
- **Equating:** forms differ in case integration and are explicitly labeled varied rehearsal. Matching quotas does not establish equal difficulty or live-exam equivalence.
- **Bank-wide polish:** the single multi-select association with tools, semantic recurrence and some simple introductory items remain. These were disclosed as optional broader refinements, not unresolved blockers in the bounded corrections.

The [pilot protocol](../istqb-pilot-protocol.md) describes consented first-exposure data, separate timer strata, version matching and interpretation limits. `scripts/analyze-istqb-pilot.mjs` is an offline calculation tool; synthetic regression fixtures validate its implementation and are not candidate evidence.

## Final local verification

`npm run check`: **379 passed, 0 failed**. The check includes the saved-review fingerprint/module-hash guard, the new domain/partition BVA oracle, all eight BVA keys, revised decision-table application keys and existing application regressions. `git diff --check` passed. Browser verification showed the corrected guide, worked coverage table and updated topic questions; [visual evidence](istqb-reviewed-bva-qa.png). No production deployment or candidate pilot was performed.
