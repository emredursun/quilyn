# Separate AI review: CTFL accuracy and syllabus coverage

Reviewed: 28 October 2026. Reviewer: the separately tasked `ctfl_accuracy_review` AI agent. This is a separate AI review, not human ISTQB SME approval, accreditation or a psychometric calibration. The agent inherited the task history and had access to the authored sources, so strict blinding cannot be claimed. The reviewer independently reasoned through stems/options and then compared answer keys and rationales; candidate responses were not available.

## Reviewed baseline and inventory

CTFL mock-bank SHA-256 at the reviewed baseline: `f2c0a3a680428ec82a1c579671e7f54aca0af73294aec4d2f4e1c74039d61ea5`. The parent retained source hashes in `/tmp/quilyn-independent-review-baseline.json`. Findings below apply to this frozen baseline, before correction. Content sources were not modified by this reviewer.

| Inventory | Scope read and assessed |
|---|---|
| Objective study material | All 64 decision rules, worked examples and recall prompts in `scripts/istqb/curriculum.mjs`; generated chapter modules checked |
| Keyword explanations | All 102 chapter occurrences in `scripts/istqb/keywords.mjs` |
| Misconceptions | All 64 entries in `scripts/istqb/pitfalls.mjs` |
| Topic questions | All 128 stems, options, keys and rationales: C1 Q01–Q28; C2 Q01–Q20; C3 Q01–Q16; C4 Q01–Q28; C5 Q01–Q32; C6 Q01–Q04 |
| Mock questions | All 240 stems, options, keys and rationales: M1–M6, Q01–Q40 in every form |
| Sources and mappings | Resources, blueprint, structure revisions, generated coverage metadata and original official syllabus/table extracts |

All six forms have 40 items; their assigned chapter counts are 8/6/4/11/9/2 and assigned K counts 8/24/8. The mandatory/selectable LO-group counts match the published structure. These are structural checks and do not establish that every question actually elicits the assigned cognitive operation or has live-exam difficulty.

### Governing sources

- [ISTQB CTFL syllabus v4.0.1](https://istqb.org/?download_id=3345&sdm_process_download=1), especially §§2.2.2, 4.2.2–4.2.4, 4.5.3, 5.1.4–5.1.5, 5.2–5.2.4 and 6.2. The full local text extract `/tmp/quilyn-ctfl.txt` was available.
- [ISTQB Exam Structure Tables v1.19](https://istqb.org/?download_id=3832&sdm_process_download=1), CTFL table, printed pp.3–5.
- [Official Sample B answers v1.7](https://istqb.org/?download_id=3365&sdm_process_download=1), Q21, printed p.25, independently consulted to resolve the BVA interpretation.
- [Hamburg and Roman, *Boundary Value Analysis According to the ISTQB Foundation Level Syllabus*](https://istqb.org/wp-content/uploads/2025/10/Boundary-Value-Analysis-white-paper.pdf), especially §§2–4 and 7, hosted by ISTQB. This clarification was independently consulted; its examples are not republished as Quilyn items here.

## Disposition

**Do not approve the baseline as accurate CTFL preparation until the BVA defect and the ambiguous automation item are corrected and rechecked.** A separate factual glossary correction is also required. The other findings are content/assessment improvements, with severity and certainty distinguished below.

No additional incorrect arithmetic keys were found in the ratio, weighted three-point, extrapolation, risk exposure, coverage-percentage, priority/dependency or non-BVA model-tracing items. No additional unique-key correctness objection was identified outside the listed findings. This is a review result, not proof that no other error exists.

## Required corrections

### A1 — Critical, definite: the blanket 3-value BVA rule omits boundaries of invalid partitions

Locations: `scripts/istqb/curriculum.mjs`, FL-4.2.2 (baseline line 41), `scripts/istqb/practice.mjs` FL-4.2.2, and BVA items in `scripts/istqb/mock-applications.mjs`. Affected generated content includes chapter 4 notes/recap/pitfall guidance and the items below.

The baseline teaches that an accepted integer interval L..U needs four 2-value points and adds only L+1 and U−1 for full 3-value coverage. It therefore selects six values. ISTQB instead identifies each equivalence partition's boundary values, including invalid partitions, then unions the required neighborhoods. For a domain of all integers with partitions x<L, L≤x≤U and x>U, the finite boundary values are L−1, L, U and U+1. For separated limits, their 3-value neighborhood union has eight points: L−2,L−1,L,L+1,U−1,U,U+1,U+2. Bounded domains add their own outer endpoints and feasible neighbors; narrow partitions require deduplication.

The official whitepaper §4 explicitly rejects multiplying the number of inter-partition borders by three. Sample B Q21 also includes the non-negative domain endpoint, illustrating why the input domain must be identified first.

| Item | Baseline problem and independently derived correction under an explicitly all-integer domain |
|---|---|
| `CTFL-C4-Q05` | Its four-point 2-value key can be retained after domain clarification, but its rationale incorrectly calls six values the complete 3-value set. |
| `CTFL-C4-Q06` | For accepted 10..30, full 3-value coverage is {8,9,10,11,29,30,31,32}. None of the existing options is complete. |
| `CTFL-M1-Q34` | For accepted 20..80, full 3-value coverage is {18,19,20,21,79,80,81,82}. No existing option is complete. “Whole-number” additionally invites a non-negative-domain interpretation. |
| `CTFL-M2-Q34` | The current 2-value key 91 is correct if the domain is all integers. With the conventional non-negative meaning of “whole-number score,” domain endpoint 0 is also missing. State the domain explicitly before retaining or changing the key. |
| `CTFL-M3-Q34` | For accepted 7..12 over all integers, full 3-value coverage is {5,6,7,8,11,12,13,14}. None of the existing options is complete. A non-negative duration domain additionally needs 0 and 1. |
| `CTFL-M4-Q34` | The four-point 2-value key can be retained after explicit domain clarification. Its rationale incorrectly equates the six-point distractor with complete 3-value analysis. |
| `CTFL-M5-Q34` | For accepted 100..200 over all integers, the existing five values leave {98,201,202}, not just 201. No current single-value option completes coverage. |
| `CTFL-M6-Q34` | For accepted −5..5 over all integers, full 3-value coverage is {−7,−6,−5,−4,4,5,6,7}. None of the existing options is complete. |

The worked 10..50 example also needs the invalid-partition outer neighbors 8 and 52 under an all-integer domain. Do not simply replace the six-value shortcut with an unconditional eight-value shortcut. Teach the domain → partitions → each partition's min/max → feasible neighborhood union procedure. Include a finite/non-negative-domain example and a small-partition overlap example.

**Verification required:** replace the existing regression oracle that repeats the same accepted-endpoint formula. Test independently enumerated partition boundaries, including the official sample's non-negative-domain behavior without copying its item into the product, an all-integer case, domain extrema and overlapping neighborhoods. Recheck stored-answer migration because some correct sets and question meanings change.

### A2 — Major, ambiguous selection count: `CTFL-M2-Q32` does not uniquely distinguish the two keyed costs

Location: `scripts/istqb/mock-concepts.mjs`, automation risk-assessment item; generated `data/mock-exams.json` → CTFL → Mock Exam 2 → `CTFL-M2-Q32`.

The stem asks which TWO should be included in an automation **risk assessment**. Its key selects training/adoption effort and maintenance effort. However, the three other alternatives describe an immediate-payback guarantee, elimination of all human error and an assumption that every test is automatable. These are precisely the kinds of unrealistic expectations an automation risk assessment should examine. Syllabus §6.2 explicitly includes unrealistic expectations and inaccurate effort estimates among automation risks. The explanation dismisses the alternatives as unreliable premises, but the stem does not ask which premises to accept as true.

**Correction:** ask for TWO effort/cost categories that must be estimated, or retain the broad risk stem and use genuine benefits as distractors. Ensure the exact-two instruction has a uniquely defensible set.

### A3 — Major terminology correction: risk assessment is conflated with risk identification

Location: `scripts/istqb/keywords.mjs`, baseline line 86, chapter 5 “risk assessment” explanation; generated `data/istqb-ctfl/chapter-5.json`, chapter-keywords table.

The definition begins “Identify risks and evaluate…”. Under the CTFL syllabus §5.2 and §5.2.3, **risk analysis** comprises risk identification and risk assessment. Assessment categorizes already identified risks, evaluates likelihood/impact/level, prioritizes and proposes responses. The current explanation blurs the expressly taught hierarchy and could produce a wrong answer on a keyword-understanding question.

**Correction:** describe assessment as evaluation/categorization/prioritization of identified risks, and make the two hierarchies explicit: analysis = identification + assessment; control = mitigation + monitoring.

## Coverage and cognitive-demand findings

These findings do not assert that the existing unique keys are wrong. They identify gaps relative to presenting the notes and two-item LO checks as sufficient preparation on their own. The chapter 1 guidance already tells candidates to read the complete official syllabus; retain that qualification until the gaps are filled.

### A4 — Major preparation gap: complete LO labels do not equal complete substantive coverage

Concrete missing material:

| LO/source section | Baseline gap | Recommended addition |
|---|---|---|
| FL-5.1.4, §5.1.4 | The note says “iterative expert estimates” but never names **Wideband Delphi** or **Planning Poker**, although these are explicitly described techniques in the section. Its two topic questions and six mock items cover ratios, three-point or extrapolation only. | Name and distinguish all four techniques; explain isolated estimates, discussion, re-estimation and consensus; identify Planning Poker as a Delphi variant. Add a technique-selection/check example alongside the numeric work. |
| FL-2.2.2, §2.2.2 | Non-functional testing is defined correctly, but the enumerated quality characteristics are not taught completely in the notes/keywords. | List the eight syllabus characteristics, including the alternative names interaction capability/flexibility, and contrast examples. Do not pull an unrelated edition of ISO 25010 into the examinable list. |
| FL-4.2.3, §4.2.3 | The prose explains boolean combinations but gives no actual decision table and omits the explicit notation for irrelevant and infeasible conditions and action marking. | Add an original small table with conditions/actions, feasible columns, don't-care and infeasible distinctions; explain full versus reduced/minimized table coverage. Full minimization algorithms remain out of scope. |
| FL-4.2.4, §4.2.4 | The added coverage hierarchy is sound, but all topic/mock examples use simple unguarded graphs and there is no worked state-table example. | Add an original state table showing an invalid cell, event [guard] / action, and a valid/invalid test. |

These additions can be compact. They need not reproduce the official chapter. They should give a candidate enough to interpret the examinable representations before entering practice.

### A5 — Assessment alignment concern: some K3-tagged topic checks only ask for a denominator or missing field

Examples: `CTFL-C4-Q07` asks only the number of full boolean combinations; `CTFL-C4-Q08` supplies six feasible rules/four exercised and asks for 4/6. Both are tagged FL-4.2.3 K3, but neither requires constructing/using a table to derive a test case. `CTFL-C5-Q32`, `CTFL-M2-Q40` and `CTFL-M5-Q40` primarily ask which missing report field would help rather than preparing a defect report from a substantive scenario.

These are useful formative knowledge checks and have defensible keys. The issue is the strength of the K3 claim and whether two topic questions provide application practice for that objective. Retain them as supporting checks if desired, but pair them with an actual table-derived case or a report-selection/construction task requiring scenario facts. The stronger baseline `CTFL-M4-Q35` and `CTFL-M6-Q35` are positive examples: they require deriving uncovered rules and outputs.

The other review agent is tasked with assessment quality and should adjudicate the cognitive-demand issues independently. Do not convert this editorial judgment into a measured difficulty statistic.

## Minor improvements

### A6 — Minor, underspecified oracle: `CTFL-C5-Q31`

Location: `scripts/istqb/practice.mjs`, FL-5.5.1 rounding report.

The most complete report remains clearly preferable to its distractors. However “USD 1.25; apply 10%; expected 1.13, actual 1.12” does not say whether 10% is a discount or increase and does not state the rounding rule. A 10% discount yields 1.125, for which half-up and half-even can legitimately differ. The teaching example should not imply that 1.12 necessarily is a defect without an oracle.

Specify a 10% discount and the requirement to round the final monetary result half-up to two decimal places, or use values without a rounding tie. Cite the business-rule oracle in the report. This is a report-example quality fix, not an assertion that an alternative existing option is a better answer.

### A7 — Minor wording clarity: `CTFL-M1-Q14`

The intended answer is regression testing, but “after a search defect is fixed, a tester checks that saved searches still work” does not expressly distinguish the saved-search behavior from the original defect. Clarify that the original failure concerned a different search path and the saved-search path previously worked. That makes the confirmation/regression contrast depend on an explicit objective rather than assumed context.

### A8 — Minor LO-target precision: `CTFL-M1-Q24`

The item is assigned FL-4.5.2 and asks which criterion is most testable. Its unique key is sound, but the published LO specifically targets classification of acceptance-criteria writing options. A format-classification example would assess that target more directly; alternatively preserve this item as a supporting acceptance-criteria quality check rather than treating the assigned LO count alone as evidence of full alignment.

## Positive findings and checked derivations

- All 64 LO IDs and their assigned K levels correspond to the current syllabus; every LO has two topic items and a study section.
- All 29 selectable/mandatory group quotas and chapter/K counts were confirmed for each form.
- Ratio estimates: 180×2/3=120; 250×3/5=150; 320/4=80. Weighted three-point results: 7; 11 with SD 3; 6; 9 with SD 2, plus the notes' 8 with SD 2. Extrapolated mean 8/10/12=10.
- Dependency questions explicitly specify highest-currently-eligible selection, resolving a potential strategy ambiguity; keys A→B→C and T3→T1→T2 follow that stated rule.
- Additional-coverage items correctly recalculate marginal coverage after each chosen test and state a tie-breaker when needed.
- Decision-table rules, other than the BVA-related issue in a different technique, correctly distinguish feasible rule coverage, duplicated coverage and resulting AND/OR outcomes.
- State-model traces correctly separate state visits from transition coverage and identify invalid event sequences. The login-counter reset example leaves two consecutive failures, not four.
- Confirmation/regression, role boundaries, whole-team/independence, static/dynamic, review types/roles, acceptance formats, risk types, entry/exit criteria and tool classifications are otherwise consistent with the cited syllabus at the reviewed baseline.
- The distinction between the local 70% module label and the official 65% examination threshold is disclosed; the 60/75-minute practice configuration does not promise provider eligibility.

## Re-review requirements and limits

After correction, regenerate JSON/reading pages/manifests, rerun all content checks and the independent BVA oracle, then re-review every changed item and explanation against the new fingerprint. Preserve this report as a baseline finding record; a closure/adjudication note should state exactly which findings were fixed or accepted and with what evidence.

This review supplies no candidate-based p-values, item-total correlations, response-time distributions, form-equivalence evidence or pass-probability estimate. Separate AI reviews can find substantive errors—as A1 demonstrates—but are not a substitute for a qualified human reviewer and a well-designed candidate pilot where those forms of assurance are claimed.

---

## Correction re-review — 28 October 2026

### Scope and final reviewed version

The author supplied a correction manifest at `/tmp/quilyn-review-corrections.json`. This reviewer independently recomputed the 28 changed mock keys and six changed topic keys, read their revised rationales, inspected all new worked representations and the changed objective/keyword notes, and reran the dedicated content tests. The initial corrected mock fingerprint was `b79143115462edfca5f34e68a170c0e075f282f62bb768e2089d40fd3553c5ef`.

That pass found one additional uniqueness issue in two BVA stems: merely asking which set **achieves** complete coverage also permits a superset containing unnecessary values. Both `CTFL-C4-Q05` and `CTFL-M4-Q34` had a six-value distractor that included every required 2-value item. The author then clarified both stems to ask for the **exact minimum 2-value BVA coverage-item set**. The reviewer inspected those final stems and retained keys; this resolves the ambiguity.

**Final mock fingerprint accepted for these bounded reviewed corrections:** `6c692693517ea538be7e99306cc8fddf9b96e99c359a6987ef9799d87e06f9e8`.

This is acceptance of the reviewed changes at the stated version. It is not an assertion of whole-bank perfection, human SME certification, live-exam equivalence or empirical difficulty calibration.

### Finding closure

| Baseline finding | Disposition | Re-review evidence |
|---|---|---|
| A1 — BVA rule/keys/domain | **Closed for the reviewed corrections** | All eight BVA stems now state their domain. Full 3-value keys use every partition boundary and feasible-neighbor union. The non-negative text-length/capacity cases include 0 and 1. The notes and new model table include an all-integer example, non-negative outer endpoint and singleton overlap. Two superset ambiguities were additionally corrected with exact-minimum wording. |
| A2 — M2 Q32 exact-two risk ambiguity | **Closed** | The stem now explicitly asks for two lifecycle effort costs, with training and maintenance as the key and actual automation benefits as distractors. This removes the original confusion between accepting an unrealistic premise and assessing it as a risk. |
| A3 — Risk-assessment hierarchy | **Closed** | The glossary and FL-5.2.3 distinguish identification from assessment and place both within analysis. FL-5.2.4 also makes mitigation/monitoring within control explicit. |
| A4 — Named content/representation gaps | **Closed for the specified additions** | `scripts/istqb/worked-models.mjs` supplies all eight syllabus non-functional characteristics with examples; full/reduced decision tables and notation; a guarded state table including valid rejection self-loop and invalid cells; and the four estimation techniques including Delphi/Poker. The generator includes these elements in the corresponding objective sections. This is not a new claim that every possible syllabus detail has been independently exhaustively validated. |
| A5 — Under-demand topic/report tasks | **Closed for the cited items** | C4 Q07/Q08 now require deriving missing feasible condition combinations and their discount outcomes. C5 Q32, M2 Q40 and M5 Q40 now supply concrete locale/data/build or filter/snapshot scenarios and require choosing a report preserving the reproduction trigger and correct oracle. These are stronger application checks than the original missing-field prompts. Two items per objective remain formative checks, not mastery proof. |
| A6 — Rounding oracle | **Closed** | C5 Q31 now explicitly specifies a 10% discount and decimal round-half-up to cents. 1.25×0.9=1.125 rounds to 1.13; the keyed report preserves that operation and oracle. |
| A7 — Regression context | **Closed** | M1 Q14 now expressly says the saved-search path previously worked, is unchanged and was not the original defect case. The intended regression objective is now explicit. |
| A8 — Acceptance-format LO | **Closed** | M1 Q24 now asks to classify a Given/When/Then acceptance criterion; the keyed scenario-oriented classification directly matches FL-4.5.2. |

### Independent checks of changed keys

Letter positions below refer to the generated final bank, not authoring-source order. The reviewer reasoned through the given facts and then checked the stored key.

| Changed mock items | Recomputed key(s) |
|---|---|
| M1 Q06 / Q07 / Q14 / Q24 / Q27 / Q34 | B / D / D / D / B / C |
| M2 Q26 / Q30 / Q32 / Q34 / Q40 | B / B / {A,E} / A / C |
| M3 Q25 / Q27 / Q34 | A / D / B |
| M4 Q26 / Q32 / Q34 | C / {D,E} / A |
| M5 Q06 / Q07 / Q22 / Q24 / Q26 / Q34 / Q40 | B / A / B / C / D / C / B |
| M6 Q06 / Q07 / Q30 / Q34 | A / B / D / C |
| C4 Q05 / Q06 / Q07 / Q08 | A / A / B / C |
| C5 Q31 / Q32 | C / C |

Important recomputations:

- M1 Q34: boundaries 19,20,80,81; 3-value union {18,19,20,21,79,80,81,82}.
- M2 Q34: all-integer 2-value items {39,40,90,91}; existing 89 is extra and 91 remains missing.
- M3 Q34: boundaries 6,7,12,13; 3-value union {5,6,7,8,11,12,13,14}.
- M4 Q34: exact minimum 2-value item set {1,2,8,9}; the six-value superset is no longer another correct answer to the amended question.
- M5 Q34: the non-negative domain gives boundaries 0,99,100,200,201; full 3-value union {0,1,98,99,100,101,199,200,201,202}; the additional set is {0,1,98,201,202}.
- M6 Q34: 3-value union {−7,−6,−5,−4,4,5,6,7}.
- C4 Q06: non-negative length boundaries 0,9,10,30,31; 3-value union {0,1,8,9,10,11,29,30,31,32}.
- The singleton model x=2 has boundary union {1,2,3} and 3-value union {0,1,2,3,4}, demonstrating overlap correctly.
- In the new guarded state model, Locked → Unlocked on a valid badge, Unlocked → Locked on timeout, and the invalid-badge self-loop in Locked are three **valid** transitions. The example trace covers all three. Invalid state-table cells are correctly distinguished from a modeled rejection/self-loop.
- The reduced decision table merges the two non-member rules using the irrelevant-condition marker; its three feasible columns are the coverage items of that reduced representation. Infeasibility is separately explained and exercised by C4 Q08.

### Inventory, tests and limits after correction

The final inventory remains 64 objectives, 128 topic questions and 240 mock questions. Each of the six forms still has chapter counts 8/6/4/11/9/2 and assigned K counts 8/24/8. The dedicated content suite passed **10 tests**, including all 29 mandatory/selectable group quotas, the partition-extrema BVA oracle, finite endpoints and overlapping neighborhoods, the two new decision-table topic keys, estimates, prioritization, state models and practice/exam configuration behavior.

No remaining accuracy blocker was found in this bounded re-review. The BVA and automation corrections are substantively important, so the earlier baseline must not be described as having passed this review. Any further item or model edits require an appropriate new review/version reference. Human review and candidate-based psychometric calibration remain absent; this re-review must not be used to claim either.
