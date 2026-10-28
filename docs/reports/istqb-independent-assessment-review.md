# Separate AI review: CTFL assessment design and editorial demand

Reviewer: `ctfl_assessment_review`, a separate AI agent. Date: 28 October 2026. This is not a human SME sign-off, accreditation, a strictly blinded study or a psychometric calibration. The agent inherited task context, worked separately from the author and did not consult the other reviewer. Source content was held frozen during this baseline review.

**Baseline CTFL bank fingerprint:** `f2c0a3a680428ec82a1c579671e7f54aca0af73294aec4d2f4e1c74039d61ea5`.

**Decision:** hold editorial release pending the critical BVA correction and the ambiguous multi-select correction. The bank has useful formative material and correct nominal blueprint counts, but it is not yet suitable to describe as thoroughly moderated exam rehearsal. After corrections, the changed items and their generated keys need a second pass.

## Scope and method

Read all **64 objective notes and examples**, all **128 topic item stems, alternatives, keys and rationales**, and all **240 mock item stems, alternatives, keys and rationales**. The total 368-item inventory is listed below. Examined source authoring files, generated chapter JSON, the CTFL mock bank, the blueprint and the generator, rather than relying on the passing tests alone.

For each item, considered the answer implied by the stem, whether another option is defensible, the cognitive operation required, option plausibility, rationale consistency and transfer beyond the worked example. Recomputed arithmetic and traversed the stated state models for K3 items. Read the official syllabus sections on techniques and Appendix A cognitive targets. Checked the newer official BVA clarification after identifying the domain/coverage problem. Did not use an empirical candidate dataset; none was supplied.

Also reviewed the complete offline pilot-analysis implementation and its tests/protocol; ran `node --test tests/istqb-pilot.test.mjs` (4 passed, 0 failed). Read-only review: no authoring sources or question keys were modified.

## Findings requiring correction

### A1 — Critical: the generic BVA procedure omits adjacent-partition boundary values

**Affected:** `scripts/istqb/curriculum.mjs`, FL-4.2.2; `CTFL-C4-Q05` rationale and `CTFL-C4-Q06`; **all six `CTFL-Mn-Q34` items/rationales**; boundary fixtures in `tests/istqb-content.test.mjs`. Propagates to generated guide, recap, pitfalls and mock content.

The note teaches a fixed six-point 3-value set for an accepted interval. The syllabus defines boundary values for partitions, not just one side of each border. The [official ISTQB-hosted BVA clarification](https://istqb.org/wp-content/uploads/2025/10/Boundary-Value-Analysis-white-paper.pdf), §§2–4, explicitly distinguishes borders from boundary values and requires the union across identified partition boundaries. It also includes feasible outer-domain endpoints. Its nonnegative login-length example produces five 2-value and ten 3-value coverage items. Consequently, the current six-point formula is not a complete generic method.

Concrete consequences, derived separately from the bank:

- For **all integers**, with accepted interval `[-5,5]`, the complete 3-value union is `{-7,-6,-5,-4,4,5,6,7}`. `CTFL-M6-Q34` has no such correct alternative.
- For **all integers**, accepted `[10,30]`, the complete union is `{8,9,10,11,29,30,31,32}`. `CTFL-C4-Q06` currently keys six values. If the input is a length with nonnegative domain, its outer endpoint adds `0,1` as well.
- `CTFL-M1-Q34` and `CTFL-M3-Q34` say “whole-number”, which implies a nonnegative domain: the outer `0,1` are relevant when complete coverage is requested. Their present alternatives do not supply a complete all-partition 3-value answer.
- `CTFL-M5-Q34` cannot achieve full all-integer 3-value coverage by adding only one value: existing `{99,100,101,199,200}` additionally needs `98,201,202`. With a nonnegative full domain, include outer `0,1` too.
- `CTFL-M2-Q34` says whole-number score. Full 2-value coverage includes the outer `0`, in addition to `39,40,90,91`; the existing set therefore needs both `0` and `91`, not just `91`.
- A question explicitly restricted to the two accepted-partition endpoints can validly use a six-value neighborhood. That scope must be stated. It must not be taught as full generic BVA or used to avoid teaching the complete procedure.

**Required remediation:** identify the domain and all partitions before deriving boundary values; union feasible neighbor sets and deduplicate. Revise each affected stem, key, alternatives, rationale and teaching example consistently. Include at least one complete nonnegative-domain example with its outer endpoint, not merely endpoint-restricted examples. Replace the test oracle that repeats the incomplete fixed formula with a partition/domain-based derivation and regression fixtures from the official clarification.

### A2 — Major, release blocking: the automation-risk multi-select has more than two defensible responses

**ID:** `CTFL-M2-Q32` (`scripts/istqb/mock-concepts.mjs`).

The stem asks which TWO should be included in an automation **risk assessment**. The key selects maintenance and training/adoption effort. The three other options are a guarantee of immediate payback, a promise that tools eliminate all human error and the assumption that every test is automatable. Those are unrealistic expectations—the syllabus's own automation-risk concern. A candidate reasonably assessing those expectations is penalized by the full-set key. The rationale calls them unreliable premises but does not explain why unreliable expectations would be excluded from a risk assessment.

**Required remediation:** either ask specifically for two lifecycle **cost categories**, or replace the nonkeys with genuine potential benefits such as repeatability, faster repeated execution and reduction of routine manual comparison. Keep every option a comparable statement. Verify that exactly two responses satisfy the revised stem.

`CTFL-M4-Q32` has a related wording risk: “realistic concerns” is mixed with three certainty claims. Clarify whether candidates are judging factual claims or identifying risk factors; a poor certainty assumption can itself be a concern. This related item merits a bounded revision at the same time.

## Bounded major quality remediation

These findings are separate from numeric-key correctness. They matter before claiming strong preparation or fully reviewed K3 coverage. They do not imply that every simple item must become difficult.

### A3 — Major: both topic checks for decision-table application avoid deriving a case

**IDs:** `CTFL-C4-Q07`, `CTFL-C4-Q08`.

Their tasks are `2×2` rule counting and `4/6` coverage arithmetic. They can be answered without creating or applying a decision table, despite FL-4.2.3 requiring use of decision table testing to derive cases. Neither of the two formative checks establishes the central ability in that LO.

**Required remediation:** replace at least one, preferably both, with a short rule/table scenario requiring missing-case selection and expected action derivation. Include one constraint or irrelevant condition without adding advanced minimization algorithms. All alternatives should be feasible-looking case/action pairs. Preserve the two-question topic inventory by replacing rather than merely relabeling these items.

### A4 — Major: report-writing K3 items have too little report construction and too many nonfunctional alternatives

**IDs:** `CTFL-C5-Q31`, `CTFL-C5-Q32`, `CTFL-M2-Q40`, `CTFL-M5-Q40`.

- `C5-Q31`: “apply 10%” does not specify discount versus tax or the rounding rule. The selected report asserts expected `1.13` rather than deriving an oracle from a stated requirement. Its nonkeys are opinions or vague complaints. State the actual rule and rounding mode, provide observed data, then offer competing structured reports with one material defect each.
- `C5-Q32`: “occurs only with a particular locale” effectively gives away “add locale”. A candidate need not prepare a report from evidence.
- `M2-Q40`: the answer lists every useful report component; the nonkeys are raise priority, remove input and close the finding. Replace with reports that differ on triggering locale/data, actual-versus-expected behavior or version identification.
- `M5-Q40`: the stem says the selection is omitted and the answer says add the filter. Supply a concrete run and ask which complete report correctly preserves its configuration, filter, expected/actual records and evidence.

These are suitable introductory reminders, but insufficient as the sole two topic checks for “prepare a defect report”, and weak representatives of a K3 mock quota. Revised report-selection MCQs can assess preparation without requiring a free-text runtime feature.

### A5 — Major: a bounded set of mock distractors can be rejected without CTFL knowledge

**Required first batch of IDs:**

`CTFL-M1-Q06`, `CTFL-M1-Q07`, `CTFL-M1-Q27`, `CTFL-M2-Q26`, `CTFL-M2-Q30`, `CTFL-M3-Q25`, `CTFL-M3-Q27`, `CTFL-M4-Q26`, `CTFL-M5-Q06`, `CTFL-M5-Q07`, `CTFL-M5-Q22`, `CTFL-M5-Q26`, `CTFL-M6-Q06`, `CTFL-M6-Q07`, `CTFL-M6-Q30`.

Illustrations and focused replacements:

| ID/group | Current weakness | Better neighboring alternatives |
|---|---|---|
| M1-Q06, M5-Q06 | Logs/cases contrasted with an invoice, quotation, holidays or staffing request | Test case, test condition, execution log, test procedure or completion report, differentiated by purpose |
| M3-Q25 | Execution proportion contrasted with adjectives, office floor and product-name length | Execution progress, pass rate, unresolved-defect share and requirement coverage, with explicit denominators |
| M5-Q22 | Defect history contrasted with font, meeting-room count and alphabetical names | Defect history, structural branches, rule combinations and partition representatives; ask which directly grounds error guessing |
| M6-Q07 | Requirement traceability contrasted with seating plan, filename length and subscription date | Requirement-to-case/results links versus code-only links, defect-only counts or unversioned snapshots |
| M1-Q27, M6-Q30 | Exact run configuration contrasted with names/dates/counts | Matching historical configuration versus latest build/current data, missing test version or different environment |
| M2-Q26, M3-Q27, M4-Q26, M5-Q26 | Useful plan/report content contrasted with compensation, favorite slogans, impossible promises or license numbers | Plausible content from a neighboring artifact or lifecycle point |
| M1-Q07, M2-Q30, M5-Q07, M6-Q06 | Correct evidence contrasted with unrelated volume, formatting or personal judgment | Plausible but insufficient evidence that misses basis links, audience needs, changed context or a relevant denominator |

This is a bounded first remediation batch, not a claim that the rest of the bank is free of such weaknesses. Keep wrong alternatives wrong for a syllabus-relevant reason. Do not create difficulty by making wording obscure or by hiding assumptions.

## Other concrete improvements

### A6 — Minor clarification: confirmation versus regression needs the original failure separated explicitly

**ID:** `CTFL-M1-Q14`.

The original “search defect” is not described. Saved-search checks could be confirmation if saving searches was the reported failure. “Still work” suggests the intended regression interpretation, but a strict item should state that the fixed defect affected ordinary search and that saved-search behavior was previously correct and unchanged. Then the current regression key is unequivocal.

### A7 — Minor LO targeting precision

**IDs:** `CTFL-M1-Q24`, `CTFL-M5-Q24` (FL-4.5.2).

These ask testability of acceptance criteria or why negative cases matter, rather than classification of different options for writing criteria. They are substantively related to §4.5.2 but do not directly assess the published LO verb. A format comparison using rule-oriented versus scenario-oriented criteria would support the existing metadata more directly.

### A8 — Optional bank-wide improvements after the bounded batch

- Every form has exactly one multi-select, always FL-6.2.1. There is no stated official requirement for a different number, so this is not a blueprint violation. Diversifying format/LO association would reduce a learnable bank pattern.
- Consider direct complete-model practice for state-table invalid-transition coverage, not just valid path checking; the notes now name all coverage criteria, but checks mostly use valid transitions.
- Repeated “guarantee / only / every / prove” nonkeys can reward test-taking style. Some are legitimate conceptual misconceptions; remove the systematic pattern rather than mechanically banning words.
- Many K2 items classify a single obvious phrase instead of distinguishing plausible neighboring explanations. Retain a foundation layer, then add or replace selected cases with meaningful context.
- Keep delayed retrieval and explanation guidance. Two items per LO are a formative sampling decision, not evidence of individual mastery.

## Form-level editorial comparison

All forms have 40 items with nominal chapter counts `8/6/4/11/9/2`, nominal cognitive counts `8 K1 / 24 K2 / 8 K3`, and balanced single-answer positions. These checks are useful but cannot establish comparable difficulty or validity of the item targets.

| Form | Qualitative demand observed before BVA repair | Particular concern |
|---|---|---|
| 1 | Mostly direct distinctions; some valid multi-step additional-coverage and transition work | BVA flaw, saved-search ambiguity, straightforward automation benefits, unrelated evidence distractors |
| 2 | Each Choice pairing, weighted estimate plus SD and eligible-test dependency ordering increase procedural demand | BVA domain flaw, ambiguous risk multi-select, weak report alternatives |
| 3 | Several simple count/fraction, stated-mean and direct priority tasks | Relatively limited procedural integration; strongest longest-key heuristic count; BVA flaw |
| 4 | Three-condition decision-rule derivation, invalid-event trace and coverage tie-break add integration | BVA explanation/scope issue, automation selection wording and unrelated plan distractors |
| 5 | Missing-value completion and direct threshold checks, with a dependency-based order | BVA flaw, keyword-echo report task, many obvious nonkeys |
| 6 | Negative-range BVA, three-condition shipping rule, counter reset, weighted requirements and weighted estimate plus SD | Broadest mix of interacting rules; BVA key flaw; unrelated traceability/configuration nonkeys |

This is an editorial comparison of operations and cues, **not** a measured easy/medium/hard ranking. Forms 3 and 6 do not appear matched on procedural integration even though their K quotas match. Either align task rubrics across matching LOs, or label the forms as varied rehearsal and retain the existing warning against inferred live-exam equivalence. Candidate pilot evidence is required before any equivalence claim.

### Descriptive cue audit

The existing audit reports zero position-skewed CTFL banks, and no “correct answer at least twice the longest distractor” outliers. That does not assess semantic plausibility.

For a transparent local lexical screen, nonkey alternatives containing any of `all/every/always/never/only/guarantee/proof/prove/impossible/eliminate/zero` occur **28, 21, 26, 28, 33, 36 times out of 120 nonkeys** in Forms 1–6 respectively. These are review leads, not an automatic defect count. Existing longest-correct-option flags are **9, 11, 15, 12, 12, 12** per form; tied options are excluded by that heuristic. Neither statistic measures actual candidate difficulty.

## Pilot-analysis review

No critical arithmetic defect was found in the inspected implementation:

- Exact-set grading, including unanswered-as-wrong, is correct for the declared one-point MCQ scheme.
- The interval code implements the Wilson proportion interval.
- The correlation excludes the target item from the total and handles absent/zero-variance evidence with `null`.
- Matching the bank fingerprint prevents unnoticed key/version mismatch.
- First-exposure eligibility, duplicate exclusion and separate 60-/75-minute strata are sensible safeguards within the stated protocol.
- Empty input preserves unknown statistics and explicitly reports awaiting candidate data.
- No candidate IDs are copied into aggregate output; no collection or upload occurs automatically.

The four synthetic regression tests passed. They establish software behavior, not authenticity or adequacy of candidate evidence. The protocol appropriately states that normalization of actual answer identifiers and provenance verification remain necessary.

Minor future hardening: require `candidateId` to be a string rather than relying on regex coercion; use own-property form lookup; document how the first record is chosen when duplicate rows are not chronological. The protocol already warns that source-list order does not prove first exposure. These are not the present release blockers.

For meaningful distractor functioning, later add option-level relationships with ability groups or corrected totals where sample sizes support them; aggregate option rates alone do not show whether stronger candidates favor a nonkey. Do not infer an IRT scale, pass probability, live-exam equivalence or equating merely from these classical item summaries.

## References and interpretation limits

- [ISTQB CTFL Syllabus v4.0.1](https://istqb.org/?download_id=3345&sdm_process_download=1), §4.2 and Appendix A, printed p.64: K3 entails carrying out/selecting and applying a procedure; LO IDs alone do not prove that an item requires that operation.
- [ISTQB-hosted BVA clarification](https://istqb.org/wp-content/uploads/2025/10/Boundary-Value-Analysis-white-paper.pdf), §§2–4: domain, partition boundary values and union of coverage items. This source is especially material because third-party six-value shortcuts conflict with the complete method.
- [NBME Item-Writing Guide](https://www.nbme.org/sites/default/files/2021-02/NBME_Item%20Writing%20Guide_R_6.pdf), chapters 3–4: general guidance on cues, plausible alternatives and response-based item analysis. Its medical test blueprint is not being imported into CTFL.

This review does not certify human expertise, accreditation, absence of all defects or an empirical calibration. No candidate sample was available. The agent did not review another agent's findings. A correction/re-review record should be appended against a new fingerprint rather than silently rewriting this frozen baseline conclusion.

## Per-item baseline inventory

`Revise A1` = critical BVA scope/procedure/key; `Revise A2` = ambiguous multi-select; `Revise A3/A4/A5` = bounded major demand/distractor remediation; `Clarify A6/A7` = minor explicitness/targeting improvement. `Provisional retain` means no additional specific blocking issue was identified in this pass, subject to the broader cue/comparability limits above; it is not a human approval.

| Item ID | Target LO | Nominal K | Baseline disposition |
|---|---|---|---|
| CTFL-C1-Q01 | FL-1.1.1 | K1 | Provisional retain |
| CTFL-C1-Q02 | FL-1.1.1 | K1 | Provisional retain |
| CTFL-C1-Q03 | FL-1.1.2 | K2 | Provisional retain |
| CTFL-C1-Q04 | FL-1.1.2 | K2 | Provisional retain |
| CTFL-C1-Q05 | FL-1.2.1 | K2 | Provisional retain |
| CTFL-C1-Q06 | FL-1.2.1 | K2 | Provisional retain |
| CTFL-C1-Q07 | FL-1.2.2 | K1 | Provisional retain |
| CTFL-C1-Q08 | FL-1.2.2 | K1 | Provisional retain |
| CTFL-C1-Q09 | FL-1.2.3 | K2 | Provisional retain |
| CTFL-C1-Q10 | FL-1.2.3 | K2 | Provisional retain |
| CTFL-C1-Q11 | FL-1.3.1 | K2 | Provisional retain |
| CTFL-C1-Q12 | FL-1.3.1 | K2 | Provisional retain |
| CTFL-C1-Q13 | FL-1.4.1 | K2 | Provisional retain |
| CTFL-C1-Q14 | FL-1.4.1 | K2 | Provisional retain |
| CTFL-C1-Q15 | FL-1.4.2 | K2 | Provisional retain |
| CTFL-C1-Q16 | FL-1.4.2 | K2 | Provisional retain |
| CTFL-C1-Q17 | FL-1.4.3 | K2 | Provisional retain |
| CTFL-C1-Q18 | FL-1.4.3 | K2 | Provisional retain |
| CTFL-C1-Q19 | FL-1.4.4 | K2 | Provisional retain |
| CTFL-C1-Q20 | FL-1.4.4 | K2 | Provisional retain |
| CTFL-C1-Q21 | FL-1.4.5 | K2 | Provisional retain |
| CTFL-C1-Q22 | FL-1.4.5 | K2 | Provisional retain |
| CTFL-C1-Q23 | FL-1.5.1 | K2 | Provisional retain |
| CTFL-C1-Q24 | FL-1.5.1 | K2 | Provisional retain |
| CTFL-C1-Q25 | FL-1.5.2 | K1 | Provisional retain |
| CTFL-C1-Q26 | FL-1.5.2 | K1 | Provisional retain |
| CTFL-C1-Q27 | FL-1.5.3 | K2 | Provisional retain |
| CTFL-C1-Q28 | FL-1.5.3 | K2 | Provisional retain |
| CTFL-C2-Q01 | FL-2.1.1 | K2 | Provisional retain |
| CTFL-C2-Q02 | FL-2.1.1 | K2 | Provisional retain |
| CTFL-C2-Q03 | FL-2.1.2 | K1 | Provisional retain |
| CTFL-C2-Q04 | FL-2.1.2 | K1 | Provisional retain |
| CTFL-C2-Q05 | FL-2.1.3 | K1 | Provisional retain |
| CTFL-C2-Q06 | FL-2.1.3 | K1 | Provisional retain |
| CTFL-C2-Q07 | FL-2.1.4 | K2 | Provisional retain |
| CTFL-C2-Q08 | FL-2.1.4 | K2 | Provisional retain |
| CTFL-C2-Q09 | FL-2.1.5 | K2 | Provisional retain |
| CTFL-C2-Q10 | FL-2.1.5 | K2 | Provisional retain |
| CTFL-C2-Q11 | FL-2.1.6 | K2 | Provisional retain |
| CTFL-C2-Q12 | FL-2.1.6 | K2 | Provisional retain |
| CTFL-C2-Q13 | FL-2.2.1 | K2 | Provisional retain |
| CTFL-C2-Q14 | FL-2.2.1 | K2 | Provisional retain |
| CTFL-C2-Q15 | FL-2.2.2 | K2 | Provisional retain |
| CTFL-C2-Q16 | FL-2.2.2 | K2 | Provisional retain |
| CTFL-C2-Q17 | FL-2.2.3 | K2 | Provisional retain |
| CTFL-C2-Q18 | FL-2.2.3 | K2 | Provisional retain |
| CTFL-C2-Q19 | FL-2.3.1 | K2 | Provisional retain |
| CTFL-C2-Q20 | FL-2.3.1 | K2 | Provisional retain |
| CTFL-C3-Q01 | FL-3.1.1 | K1 | Provisional retain |
| CTFL-C3-Q02 | FL-3.1.1 | K1 | Provisional retain |
| CTFL-C3-Q03 | FL-3.1.2 | K2 | Provisional retain |
| CTFL-C3-Q04 | FL-3.1.2 | K2 | Provisional retain |
| CTFL-C3-Q05 | FL-3.1.3 | K2 | Provisional retain |
| CTFL-C3-Q06 | FL-3.1.3 | K2 | Provisional retain |
| CTFL-C3-Q07 | FL-3.2.1 | K1 | Provisional retain |
| CTFL-C3-Q08 | FL-3.2.1 | K1 | Provisional retain |
| CTFL-C3-Q09 | FL-3.2.2 | K2 | Provisional retain |
| CTFL-C3-Q10 | FL-3.2.2 | K2 | Provisional retain |
| CTFL-C3-Q11 | FL-3.2.3 | K1 | Provisional retain |
| CTFL-C3-Q12 | FL-3.2.3 | K1 | Provisional retain |
| CTFL-C3-Q13 | FL-3.2.4 | K2 | Provisional retain |
| CTFL-C3-Q14 | FL-3.2.4 | K2 | Provisional retain |
| CTFL-C3-Q15 | FL-3.2.5 | K1 | Provisional retain |
| CTFL-C3-Q16 | FL-3.2.5 | K1 | Provisional retain |
| CTFL-C4-Q01 | FL-4.1.1 | K2 | Provisional retain |
| CTFL-C4-Q02 | FL-4.1.1 | K2 | Provisional retain |
| CTFL-C4-Q03 | FL-4.2.1 | K3 | Provisional retain |
| CTFL-C4-Q04 | FL-4.2.1 | K3 | Provisional retain |
| CTFL-C4-Q05 | FL-4.2.2 | K3 | Revise A1 |
| CTFL-C4-Q06 | FL-4.2.2 | K3 | Revise A1 |
| CTFL-C4-Q07 | FL-4.2.3 | K3 | Revise A3 |
| CTFL-C4-Q08 | FL-4.2.3 | K3 | Revise A3 |
| CTFL-C4-Q09 | FL-4.2.4 | K3 | Provisional retain |
| CTFL-C4-Q10 | FL-4.2.4 | K3 | Provisional retain |
| CTFL-C4-Q11 | FL-4.3.1 | K2 | Provisional retain |
| CTFL-C4-Q12 | FL-4.3.1 | K2 | Provisional retain |
| CTFL-C4-Q13 | FL-4.3.2 | K2 | Provisional retain |
| CTFL-C4-Q14 | FL-4.3.2 | K2 | Provisional retain |
| CTFL-C4-Q15 | FL-4.3.3 | K2 | Provisional retain |
| CTFL-C4-Q16 | FL-4.3.3 | K2 | Provisional retain |
| CTFL-C4-Q17 | FL-4.4.1 | K2 | Provisional retain |
| CTFL-C4-Q18 | FL-4.4.1 | K2 | Provisional retain |
| CTFL-C4-Q19 | FL-4.4.2 | K2 | Provisional retain |
| CTFL-C4-Q20 | FL-4.4.2 | K2 | Provisional retain |
| CTFL-C4-Q21 | FL-4.4.3 | K2 | Provisional retain |
| CTFL-C4-Q22 | FL-4.4.3 | K2 | Provisional retain |
| CTFL-C4-Q23 | FL-4.5.1 | K2 | Provisional retain |
| CTFL-C4-Q24 | FL-4.5.1 | K2 | Provisional retain |
| CTFL-C4-Q25 | FL-4.5.2 | K2 | Provisional retain |
| CTFL-C4-Q26 | FL-4.5.2 | K2 | Provisional retain |
| CTFL-C4-Q27 | FL-4.5.3 | K3 | Provisional retain |
| CTFL-C4-Q28 | FL-4.5.3 | K3 | Provisional retain |
| CTFL-C5-Q01 | FL-5.1.1 | K2 | Provisional retain |
| CTFL-C5-Q02 | FL-5.1.1 | K2 | Provisional retain |
| CTFL-C5-Q03 | FL-5.1.2 | K1 | Provisional retain |
| CTFL-C5-Q04 | FL-5.1.2 | K1 | Provisional retain |
| CTFL-C5-Q05 | FL-5.1.3 | K2 | Provisional retain |
| CTFL-C5-Q06 | FL-5.1.3 | K2 | Provisional retain |
| CTFL-C5-Q07 | FL-5.1.4 | K3 | Provisional retain |
| CTFL-C5-Q08 | FL-5.1.4 | K3 | Provisional retain |
| CTFL-C5-Q09 | FL-5.1.5 | K3 | Provisional retain |
| CTFL-C5-Q10 | FL-5.1.5 | K3 | Provisional retain |
| CTFL-C5-Q11 | FL-5.1.6 | K1 | Provisional retain |
| CTFL-C5-Q12 | FL-5.1.6 | K1 | Provisional retain |
| CTFL-C5-Q13 | FL-5.1.7 | K2 | Provisional retain |
| CTFL-C5-Q14 | FL-5.1.7 | K2 | Provisional retain |
| CTFL-C5-Q15 | FL-5.2.1 | K1 | Provisional retain |
| CTFL-C5-Q16 | FL-5.2.1 | K1 | Provisional retain |
| CTFL-C5-Q17 | FL-5.2.2 | K2 | Provisional retain |
| CTFL-C5-Q18 | FL-5.2.2 | K2 | Provisional retain |
| CTFL-C5-Q19 | FL-5.2.3 | K2 | Provisional retain |
| CTFL-C5-Q20 | FL-5.2.3 | K2 | Provisional retain |
| CTFL-C5-Q21 | FL-5.2.4 | K2 | Provisional retain |
| CTFL-C5-Q22 | FL-5.2.4 | K2 | Provisional retain |
| CTFL-C5-Q23 | FL-5.3.1 | K1 | Provisional retain |
| CTFL-C5-Q24 | FL-5.3.1 | K1 | Provisional retain |
| CTFL-C5-Q25 | FL-5.3.2 | K2 | Provisional retain |
| CTFL-C5-Q26 | FL-5.3.2 | K2 | Provisional retain |
| CTFL-C5-Q27 | FL-5.3.3 | K2 | Provisional retain |
| CTFL-C5-Q28 | FL-5.3.3 | K2 | Provisional retain |
| CTFL-C5-Q29 | FL-5.4.1 | K2 | Provisional retain |
| CTFL-C5-Q30 | FL-5.4.1 | K2 | Provisional retain |
| CTFL-C5-Q31 | FL-5.5.1 | K3 | Revise A4 |
| CTFL-C5-Q32 | FL-5.5.1 | K3 | Revise A4 |
| CTFL-C6-Q01 | FL-6.1.1 | K2 | Provisional retain |
| CTFL-C6-Q02 | FL-6.1.1 | K2 | Provisional retain |
| CTFL-C6-Q03 | FL-6.2.1 | K1 | Provisional retain |
| CTFL-C6-Q04 | FL-6.2.1 | K1 | Provisional retain |
| CTFL-M1-Q01 | FL-1.1.1 | K1 | Provisional retain |
| CTFL-M1-Q02 | FL-1.5.2 | K1 | Provisional retain |
| CTFL-M1-Q03 | FL-1.1.2 | K2 | Provisional retain |
| CTFL-M1-Q04 | FL-1.3.1 | K2 | Provisional retain |
| CTFL-M1-Q05 | FL-1.4.1 | K2 | Provisional retain |
| CTFL-M1-Q06 | FL-1.4.3 | K2 | Revise A5 |
| CTFL-M1-Q07 | FL-1.4.4 | K2 | Revise A5 |
| CTFL-M1-Q08 | FL-1.5.3 | K2 | Provisional retain |
| CTFL-M1-Q09 | FL-2.1.2 | K1 | Provisional retain |
| CTFL-M1-Q10 | FL-2.1.3 | K1 | Provisional retain |
| CTFL-M1-Q11 | FL-2.1.1 | K2 | Provisional retain |
| CTFL-M1-Q12 | FL-2.1.4 | K2 | Provisional retain |
| CTFL-M1-Q13 | FL-2.2.1 | K2 | Provisional retain |
| CTFL-M1-Q14 | FL-2.2.3 | K2 | Clarify A6 |
| CTFL-M1-Q15 | FL-3.1.1 | K1 | Provisional retain |
| CTFL-M1-Q16 | FL-3.2.3 | K1 | Provisional retain |
| CTFL-M1-Q17 | FL-3.1.2 | K2 | Provisional retain |
| CTFL-M1-Q18 | FL-3.2.4 | K2 | Provisional retain |
| CTFL-M1-Q19 | FL-4.1.1 | K2 | Provisional retain |
| CTFL-M1-Q20 | FL-4.3.1 | K2 | Provisional retain |
| CTFL-M1-Q21 | FL-4.3.2 | K2 | Provisional retain |
| CTFL-M1-Q22 | FL-4.4.1 | K2 | Provisional retain |
| CTFL-M1-Q23 | FL-4.4.2 | K2 | Provisional retain |
| CTFL-M1-Q24 | FL-4.5.2 | K2 | Clarify A7 |
| CTFL-M1-Q25 | FL-5.2.1 | K1 | Provisional retain |
| CTFL-M1-Q26 | FL-5.1.1 | K2 | Provisional retain |
| CTFL-M1-Q27 | FL-5.4.1 | K2 | Revise A5 |
| CTFL-M1-Q28 | FL-5.1.7 | K2 | Provisional retain |
| CTFL-M1-Q29 | FL-5.2.3 | K2 | Provisional retain |
| CTFL-M1-Q30 | FL-5.3.2 | K2 | Provisional retain |
| CTFL-M1-Q31 | FL-6.1.1 | K2 | Provisional retain |
| CTFL-M1-Q32 | FL-6.2.1 | K1 | Provisional retain |
| CTFL-M1-Q33 | FL-4.2.1 | K3 | Provisional retain |
| CTFL-M1-Q34 | FL-4.2.2 | K3 | Revise A1 |
| CTFL-M1-Q35 | FL-4.2.3 | K3 | Provisional retain |
| CTFL-M1-Q36 | FL-4.2.4 | K3 | Provisional retain |
| CTFL-M1-Q37 | FL-4.5.3 | K3 | Provisional retain |
| CTFL-M1-Q38 | FL-5.1.4 | K3 | Provisional retain |
| CTFL-M1-Q39 | FL-5.1.5 | K3 | Provisional retain |
| CTFL-M1-Q40 | FL-5.5.1 | K3 | Provisional retain |
| CTFL-M2-Q01 | FL-1.2.2 | K1 | Provisional retain |
| CTFL-M2-Q02 | FL-1.5.2 | K1 | Provisional retain |
| CTFL-M2-Q03 | FL-1.2.3 | K2 | Provisional retain |
| CTFL-M2-Q04 | FL-1.3.1 | K2 | Provisional retain |
| CTFL-M2-Q05 | FL-1.4.2 | K2 | Provisional retain |
| CTFL-M2-Q06 | FL-1.4.3 | K2 | Provisional retain |
| CTFL-M2-Q07 | FL-1.4.5 | K2 | Provisional retain |
| CTFL-M2-Q08 | FL-1.5.1 | K2 | Provisional retain |
| CTFL-M2-Q09 | FL-2.1.2 | K1 | Provisional retain |
| CTFL-M2-Q10 | FL-2.1.3 | K1 | Provisional retain |
| CTFL-M2-Q11 | FL-2.1.5 | K2 | Provisional retain |
| CTFL-M2-Q12 | FL-2.1.6 | K2 | Provisional retain |
| CTFL-M2-Q13 | FL-2.2.2 | K2 | Provisional retain |
| CTFL-M2-Q14 | FL-2.3.1 | K2 | Provisional retain |
| CTFL-M2-Q15 | FL-3.2.1 | K1 | Provisional retain |
| CTFL-M2-Q16 | FL-3.2.5 | K1 | Provisional retain |
| CTFL-M2-Q17 | FL-3.1.3 | K2 | Provisional retain |
| CTFL-M2-Q18 | FL-3.2.2 | K2 | Provisional retain |
| CTFL-M2-Q19 | FL-4.1.1 | K2 | Provisional retain |
| CTFL-M2-Q20 | FL-4.3.3 | K2 | Provisional retain |
| CTFL-M2-Q21 | FL-4.3.2 | K2 | Provisional retain |
| CTFL-M2-Q22 | FL-4.4.3 | K2 | Provisional retain |
| CTFL-M2-Q23 | FL-4.4.2 | K2 | Provisional retain |
| CTFL-M2-Q24 | FL-4.5.1 | K2 | Provisional retain |
| CTFL-M2-Q25 | FL-5.1.6 | K1 | Provisional retain |
| CTFL-M2-Q26 | FL-5.1.1 | K2 | Revise A5 |
| CTFL-M2-Q27 | FL-5.4.1 | K2 | Provisional retain |
| CTFL-M2-Q28 | FL-5.2.2 | K2 | Provisional retain |
| CTFL-M2-Q29 | FL-5.1.7 | K2 | Provisional retain |
| CTFL-M2-Q30 | FL-5.3.3 | K2 | Revise A5 |
| CTFL-M2-Q31 | FL-6.1.1 | K2 | Provisional retain |
| CTFL-M2-Q32 | FL-6.2.1 | K1 | Revise A2 |
| CTFL-M2-Q33 | FL-4.2.1 | K3 | Provisional retain |
| CTFL-M2-Q34 | FL-4.2.2 | K3 | Revise A1 |
| CTFL-M2-Q35 | FL-4.2.3 | K3 | Provisional retain |
| CTFL-M2-Q36 | FL-4.2.4 | K3 | Provisional retain |
| CTFL-M2-Q37 | FL-4.5.3 | K3 | Provisional retain |
| CTFL-M2-Q38 | FL-5.1.4 | K3 | Provisional retain |
| CTFL-M2-Q39 | FL-5.1.5 | K3 | Provisional retain |
| CTFL-M2-Q40 | FL-5.5.1 | K3 | Revise A4 |
| CTFL-M3-Q01 | FL-1.1.1 | K1 | Provisional retain |
| CTFL-M3-Q02 | FL-1.5.2 | K1 | Provisional retain |
| CTFL-M3-Q03 | FL-1.2.1 | K2 | Provisional retain |
| CTFL-M3-Q04 | FL-1.3.1 | K2 | Provisional retain |
| CTFL-M3-Q05 | FL-1.4.1 | K2 | Provisional retain |
| CTFL-M3-Q06 | FL-1.4.2 | K2 | Provisional retain |
| CTFL-M3-Q07 | FL-1.4.4 | K2 | Provisional retain |
| CTFL-M3-Q08 | FL-1.5.1 | K2 | Provisional retain |
| CTFL-M3-Q09 | FL-2.1.2 | K1 | Provisional retain |
| CTFL-M3-Q10 | FL-2.1.3 | K1 | Provisional retain |
| CTFL-M3-Q11 | FL-2.1.4 | K2 | Provisional retain |
| CTFL-M3-Q12 | FL-2.1.6 | K2 | Provisional retain |
| CTFL-M3-Q13 | FL-2.2.1 | K2 | Provisional retain |
| CTFL-M3-Q14 | FL-2.2.3 | K2 | Provisional retain |
| CTFL-M3-Q15 | FL-3.1.1 | K1 | Provisional retain |
| CTFL-M3-Q16 | FL-3.2.5 | K1 | Provisional retain |
| CTFL-M3-Q17 | FL-3.1.2 | K2 | Provisional retain |
| CTFL-M3-Q18 | FL-3.2.4 | K2 | Provisional retain |
| CTFL-M3-Q19 | FL-4.1.1 | K2 | Provisional retain |
| CTFL-M3-Q20 | FL-4.3.1 | K2 | Provisional retain |
| CTFL-M3-Q21 | FL-4.3.3 | K2 | Provisional retain |
| CTFL-M3-Q22 | FL-4.4.1 | K2 | Provisional retain |
| CTFL-M3-Q23 | FL-4.4.3 | K2 | Provisional retain |
| CTFL-M3-Q24 | FL-4.5.2 | K2 | Provisional retain |
| CTFL-M3-Q25 | FL-5.3.1 | K1 | Revise A5 |
| CTFL-M3-Q26 | FL-5.1.1 | K2 | Provisional retain |
| CTFL-M3-Q27 | FL-5.3.2 | K2 | Revise A5 |
| CTFL-M3-Q28 | FL-5.1.7 | K2 | Provisional retain |
| CTFL-M3-Q29 | FL-5.2.3 | K2 | Provisional retain |
| CTFL-M3-Q30 | FL-5.4.1 | K2 | Provisional retain |
| CTFL-M3-Q31 | FL-6.1.1 | K2 | Provisional retain |
| CTFL-M3-Q32 | FL-6.2.1 | K1 | Provisional retain |
| CTFL-M3-Q33 | FL-4.2.1 | K3 | Provisional retain |
| CTFL-M3-Q34 | FL-4.2.2 | K3 | Revise A1 |
| CTFL-M3-Q35 | FL-4.2.3 | K3 | Provisional retain |
| CTFL-M3-Q36 | FL-4.2.4 | K3 | Provisional retain |
| CTFL-M3-Q37 | FL-4.5.3 | K3 | Provisional retain |
| CTFL-M3-Q38 | FL-5.1.4 | K3 | Provisional retain |
| CTFL-M3-Q39 | FL-5.1.5 | K3 | Provisional retain |
| CTFL-M3-Q40 | FL-5.5.1 | K3 | Provisional retain |
| CTFL-M4-Q01 | FL-1.1.1 | K1 | Provisional retain |
| CTFL-M4-Q02 | FL-1.5.2 | K1 | Provisional retain |
| CTFL-M4-Q03 | FL-1.2.3 | K2 | Provisional retain |
| CTFL-M4-Q04 | FL-1.3.1 | K2 | Provisional retain |
| CTFL-M4-Q05 | FL-1.4.1 | K2 | Provisional retain |
| CTFL-M4-Q06 | FL-1.4.3 | K2 | Provisional retain |
| CTFL-M4-Q07 | FL-1.4.5 | K2 | Provisional retain |
| CTFL-M4-Q08 | FL-1.5.3 | K2 | Provisional retain |
| CTFL-M4-Q09 | FL-2.1.2 | K1 | Provisional retain |
| CTFL-M4-Q10 | FL-2.1.3 | K1 | Provisional retain |
| CTFL-M4-Q11 | FL-2.1.1 | K2 | Provisional retain |
| CTFL-M4-Q12 | FL-2.1.5 | K2 | Provisional retain |
| CTFL-M4-Q13 | FL-2.2.1 | K2 | Provisional retain |
| CTFL-M4-Q14 | FL-2.3.1 | K2 | Provisional retain |
| CTFL-M4-Q15 | FL-3.1.1 | K1 | Provisional retain |
| CTFL-M4-Q16 | FL-3.2.3 | K1 | Provisional retain |
| CTFL-M4-Q17 | FL-3.1.3 | K2 | Provisional retain |
| CTFL-M4-Q18 | FL-3.2.2 | K2 | Provisional retain |
| CTFL-M4-Q19 | FL-4.1.1 | K2 | Provisional retain |
| CTFL-M4-Q20 | FL-4.3.1 | K2 | Provisional retain |
| CTFL-M4-Q21 | FL-4.3.2 | K2 | Provisional retain |
| CTFL-M4-Q22 | FL-4.4.2 | K2 | Provisional retain |
| CTFL-M4-Q23 | FL-4.4.3 | K2 | Provisional retain |
| CTFL-M4-Q24 | FL-4.5.1 | K2 | Provisional retain |
| CTFL-M4-Q25 | FL-5.2.1 | K1 | Provisional retain |
| CTFL-M4-Q26 | FL-5.1.1 | K2 | Revise A5 |
| CTFL-M4-Q27 | FL-5.4.1 | K2 | Provisional retain |
| CTFL-M4-Q28 | FL-5.1.7 | K2 | Provisional retain |
| CTFL-M4-Q29 | FL-5.2.4 | K2 | Provisional retain |
| CTFL-M4-Q30 | FL-5.3.2 | K2 | Provisional retain |
| CTFL-M4-Q31 | FL-6.1.1 | K2 | Provisional retain |
| CTFL-M4-Q32 | FL-6.2.1 | K1 | Revise A2 |
| CTFL-M4-Q33 | FL-4.2.1 | K3 | Provisional retain |
| CTFL-M4-Q34 | FL-4.2.2 | K3 | Revise A1 |
| CTFL-M4-Q35 | FL-4.2.3 | K3 | Provisional retain |
| CTFL-M4-Q36 | FL-4.2.4 | K3 | Provisional retain |
| CTFL-M4-Q37 | FL-4.5.3 | K3 | Provisional retain |
| CTFL-M4-Q38 | FL-5.1.4 | K3 | Provisional retain |
| CTFL-M4-Q39 | FL-5.1.5 | K3 | Provisional retain |
| CTFL-M4-Q40 | FL-5.5.1 | K3 | Provisional retain |
| CTFL-M5-Q01 | FL-1.2.2 | K1 | Provisional retain |
| CTFL-M5-Q02 | FL-1.5.2 | K1 | Provisional retain |
| CTFL-M5-Q03 | FL-1.1.2 | K2 | Provisional retain |
| CTFL-M5-Q04 | FL-1.3.1 | K2 | Provisional retain |
| CTFL-M5-Q05 | FL-1.4.1 | K2 | Provisional retain |
| CTFL-M5-Q06 | FL-1.4.3 | K2 | Revise A5 |
| CTFL-M5-Q07 | FL-1.4.4 | K2 | Revise A5 |
| CTFL-M5-Q08 | FL-1.5.3 | K2 | Provisional retain |
| CTFL-M5-Q09 | FL-2.1.2 | K1 | Provisional retain |
| CTFL-M5-Q10 | FL-2.1.3 | K1 | Provisional retain |
| CTFL-M5-Q11 | FL-2.1.4 | K2 | Provisional retain |
| CTFL-M5-Q12 | FL-2.1.6 | K2 | Provisional retain |
| CTFL-M5-Q13 | FL-2.2.2 | K2 | Provisional retain |
| CTFL-M5-Q14 | FL-2.2.3 | K2 | Provisional retain |
| CTFL-M5-Q15 | FL-3.2.1 | K1 | Provisional retain |
| CTFL-M5-Q16 | FL-3.2.3 | K1 | Provisional retain |
| CTFL-M5-Q17 | FL-3.1.2 | K2 | Provisional retain |
| CTFL-M5-Q18 | FL-3.2.4 | K2 | Provisional retain |
| CTFL-M5-Q19 | FL-4.1.1 | K2 | Provisional retain |
| CTFL-M5-Q20 | FL-4.3.1 | K2 | Provisional retain |
| CTFL-M5-Q21 | FL-4.3.2 | K2 | Provisional retain |
| CTFL-M5-Q22 | FL-4.4.1 | K2 | Revise A5 |
| CTFL-M5-Q23 | FL-4.4.2 | K2 | Provisional retain |
| CTFL-M5-Q24 | FL-4.5.2 | K2 | Clarify A7 |
| CTFL-M5-Q25 | FL-5.1.2 | K1 | Provisional retain |
| CTFL-M5-Q26 | FL-5.1.1 | K2 | Revise A5 |
| CTFL-M5-Q27 | FL-5.4.1 | K2 | Provisional retain |
| CTFL-M5-Q28 | FL-5.1.7 | K2 | Provisional retain |
| CTFL-M5-Q29 | FL-5.2.2 | K2 | Provisional retain |
| CTFL-M5-Q30 | FL-5.3.3 | K2 | Provisional retain |
| CTFL-M5-Q31 | FL-6.1.1 | K2 | Provisional retain |
| CTFL-M5-Q32 | FL-6.2.1 | K1 | Provisional retain |
| CTFL-M5-Q33 | FL-4.2.1 | K3 | Provisional retain |
| CTFL-M5-Q34 | FL-4.2.2 | K3 | Revise A1 |
| CTFL-M5-Q35 | FL-4.2.3 | K3 | Provisional retain |
| CTFL-M5-Q36 | FL-4.2.4 | K3 | Provisional retain |
| CTFL-M5-Q37 | FL-4.5.3 | K3 | Provisional retain |
| CTFL-M5-Q38 | FL-5.1.4 | K3 | Provisional retain |
| CTFL-M5-Q39 | FL-5.1.5 | K3 | Provisional retain |
| CTFL-M5-Q40 | FL-5.5.1 | K3 | Revise A4 |
| CTFL-M6-Q01 | FL-1.1.1 | K1 | Provisional retain |
| CTFL-M6-Q02 | FL-1.5.2 | K1 | Provisional retain |
| CTFL-M6-Q03 | FL-1.2.1 | K2 | Provisional retain |
| CTFL-M6-Q04 | FL-1.3.1 | K2 | Provisional retain |
| CTFL-M6-Q05 | FL-1.4.1 | K2 | Provisional retain |
| CTFL-M6-Q06 | FL-1.4.2 | K2 | Revise A5 |
| CTFL-M6-Q07 | FL-1.4.4 | K2 | Revise A5 |
| CTFL-M6-Q08 | FL-1.5.3 | K2 | Provisional retain |
| CTFL-M6-Q09 | FL-2.1.2 | K1 | Provisional retain |
| CTFL-M6-Q10 | FL-2.1.3 | K1 | Provisional retain |
| CTFL-M6-Q11 | FL-2.1.1 | K2 | Provisional retain |
| CTFL-M6-Q12 | FL-2.1.4 | K2 | Provisional retain |
| CTFL-M6-Q13 | FL-2.2.1 | K2 | Provisional retain |
| CTFL-M6-Q14 | FL-2.2.3 | K2 | Provisional retain |
| CTFL-M6-Q15 | FL-3.1.1 | K1 | Provisional retain |
| CTFL-M6-Q16 | FL-3.2.5 | K1 | Provisional retain |
| CTFL-M6-Q17 | FL-3.1.3 | K2 | Provisional retain |
| CTFL-M6-Q18 | FL-3.2.4 | K2 | Provisional retain |
| CTFL-M6-Q19 | FL-4.1.1 | K2 | Provisional retain |
| CTFL-M6-Q20 | FL-4.3.1 | K2 | Provisional retain |
| CTFL-M6-Q21 | FL-4.3.2 | K2 | Provisional retain |
| CTFL-M6-Q22 | FL-4.4.1 | K2 | Provisional retain |
| CTFL-M6-Q23 | FL-4.4.2 | K2 | Provisional retain |
| CTFL-M6-Q24 | FL-4.5.2 | K2 | Provisional retain |
| CTFL-M6-Q25 | FL-5.2.1 | K1 | Provisional retain |
| CTFL-M6-Q26 | FL-5.1.1 | K2 | Provisional retain |
| CTFL-M6-Q27 | FL-5.3.3 | K2 | Provisional retain |
| CTFL-M6-Q28 | FL-5.1.7 | K2 | Provisional retain |
| CTFL-M6-Q29 | FL-5.2.3 | K2 | Provisional retain |
| CTFL-M6-Q30 | FL-5.4.1 | K2 | Revise A5 |
| CTFL-M6-Q31 | FL-6.1.1 | K2 | Provisional retain |
| CTFL-M6-Q32 | FL-6.2.1 | K1 | Provisional retain |
| CTFL-M6-Q33 | FL-4.2.1 | K3 | Provisional retain |
| CTFL-M6-Q34 | FL-4.2.2 | K3 | Revise A1 |
| CTFL-M6-Q35 | FL-4.2.3 | K3 | Provisional retain |
| CTFL-M6-Q36 | FL-4.2.4 | K3 | Provisional retain |
| CTFL-M6-Q37 | FL-4.5.3 | K3 | Provisional retain |
| CTFL-M6-Q38 | FL-5.1.4 | K3 | Provisional retain |
| CTFL-M6-Q39 | FL-5.1.5 | K3 | Provisional retain |
| CTFL-M6-Q40 | FL-5.5.1 | K3 | Provisional retain |

## Focused correction re-review — 28 October 2026

**Final corrected mock-bank fingerprint:** `6c692693517ea538be7e99306cc8fddf9b96e99c359a6987ef9799d87e06f9e8`.

Read all 28 changed mock stems, alternatives, keys and rationales listed in the correction manifest, all six changed topic items (`CTFL-C4-Q05`–`Q08`, `CTFL-C5-Q31`–`Q32`), the revised BVA teaching rule/example and new worked-model representations. Inspected the changed BVA oracle/fixtures, the pilot input hardening and corresponding tests. This is a focused second pass on the bounded corrections; the unchanged inventory retains the baseline review and its limitations.

The initial corrected fingerprint `b79143115462edfca5f34e68a170c0e075f282f62bb768e2089d40fd3553c5ef` still left an answer-uniqueness issue in `C4-Q05` and `M4-Q34`: each asked which set achieved full 2-value coverage, while a nonkey superset also achieved full coverage. Reported this promptly. The final stems now explicitly request the **exact minimum coverage-item set**, making the intended four-boundary key unique. Verified both final stems and the final fingerprint after regeneration.

### Dispositions against the corrected version

| Finding | Disposition | Evidence from the second pass |
|---|---|---|
| A1 — BVA method, scope and keys | **Closed for the bounded correction** | The guide now starts from feasible domain, partitions and finite extrema, forms feasible neighbor unions and deduplicates. All eight affected topic/mock answers match the declared integer domains. `C4-Q06` and `M5-Q34` include the nonnegative outer endpoint and its neighbor; other stems explicitly use all integers. The worked examples include singleton/overlap behavior. The two 2-value questions now request exact minimum sets, excluding supersets as alternative answers. |
| A2 — Ambiguous automation multi-selects | **Closed** | `M2-Q32` now asks two effort costs; training and maintenance are the two costs, while the other three choices are benefits. `M4-Q32` now contrasts adverse selection/dependency conditions with genuine positive benefits. No third response satisfies either revised stem. |
| A3 — Decision-table topic application | **Closed** | `C4-Q07` requires deriving the missing false/false rule and its action. `C4-Q08` requires excluding an infeasible combination, identifying the remaining missing rule and applying AND. The newly supplied full/reduced tables show columns, actions and notation. These are actual case/action derivations rather than isolated count ratios. |
| A4 — Report-preparation tasks | **Closed for the four listed items** | `C5-Q31` supplies discount operation and decimal round-half-up, yielding `1.125 → 1.13`; its alternatives change operation, oracle or trigger data. `C5-Q32`, `M2-Q40` and `M5-Q40` supply concrete observed anomalies; the selected reports preserve trigger/configuration, expected/actual results and evidence. Nonkeys represent plausible reporting errors rather than personal complaints. |
| A5 — Fifteen bounded distractor sets | **Closed for all fifteen listed IDs** | Alternatives now concern neighboring testware, metrics/denominators, evidence links, run versions, report purposes or plan dimensions. Re-read every changed alternative against the stem; the keyed choice is the strongest match and the nonkeys fail for relevant, explained reasons. This is not a bank-wide claim that all distractors will function empirically. |
| A6 — Saved-search ambiguity | **Closed** | `M1-Q14` explicitly identifies a previously working, unchanged path that was not the original defect case. Regression is now unambiguous. |
| A7 — Acceptance-format LO targeting | **Closed** | `M1-Q24` classifies a Given/When/Then criterion; `M5-Q24` contrasts a scenario criterion and rule list. Both directly target the declared format-classification LO. |
| A8 — Broader enhancements and form comparability | **Residual, nonblocking for varied rehearsal** | The single-multi-select/FL-6.2.1 association and differing task integration across forms remain. They are not official blueprint violations. Do not describe the forms as equated or empirically matched. Further distractor development and candidate pilots remain appropriate. |

The guarded state-table worked example correctly distinguishes a rejected badge represented by a **valid self-loop** from a truly undefined transition. Its stated event sequence exercises the three valid transitions, and the three invalid cells are separate attempted-event targets. The added non-functional characteristic examples agree with the syllabus's eight listed characteristics. The Delphi/Planning Poker explanation distinguishes iterative expert consensus from numerical extrapolation. No new blocker was found in these representations.

The pilot tool now rejects non-string candidate IDs and inherited-property form names; the statistical calculations and no-data semantics are unchanged. Ran:

```sh
node --test tests/istqb-content.test.mjs tests/istqb-pilot.test.mjs
```

**Result: 14 passed, 0 failed.** Independently checked that each corrected boundary set includes all required finite extrema/neighbors for its explicit domain; passing tests alone were not the acceptance basis.

### Updated bounded conclusion

The critical/major release blockers identified in this review are resolved in the final corrected version. The content is **accepted by this separate AI reviewer for the bounded corrected scope as formative study material and varied exam rehearsal**. This conclusion supersedes the baseline editorial hold for those resolved findings, while preserving the baseline record above.

This remains a separate AI review, not human CTFL SME certification or accreditation. There are no candidate pilot data, measured difficulty/discrimination results, form-equating evidence or validated pass predictions. The complete forms should continue to be presented as varied practice rather than calibrated equivalents of each other or of the live examination. No new numerical claim about learner performance is warranted by this second pass.
