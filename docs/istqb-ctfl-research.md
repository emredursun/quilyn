# Quilyn CTFL research and assessment design

Checked: 28 October 2026. Scope: **ISTQB Certified Tester Foundation Level (CTFL v4.0)**, using English syllabus **v4.0.1**. The user did not specify a level; Foundation was selected as the entry qualification. Advanced and specialist qualifications are outside this track. Quilyn remains an independent study aid; this research is not an accreditation or an official ISTQB review.

## Official source register

Use **istqb.org** as the scheme authority. A similarly named commercial site is not the source of record. Download links were followed from the current official qualification page, rather than assuming a search snippet or cached table revision was current.

| Source | Verified edition | Purpose |
|---|---|---|
| [CTFL qualification page](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/) | CTFL v4.0 | Qualification, examination facts, official download index |
| [Foundation syllabus](https://istqb.org/?download_id=3345&sdm_process_download=1) | v4.0.1, 15 September 2024 | Six chapters, 64 LOs, K levels, keywords and substantive scope |
| [Exam Structures and Rules](https://istqb.org/?download_id=3829&sdm_process_download=1) | v1.2, 2 May 2025 | Question targets, point values, scope and timing guidance |
| [Exam Structure Tables](https://istqb.org/?download_id=3832&sdm_process_download=1) | v1.19, 19 August 2026 | CTFL totals and mandatory/selectable LO-group quotas, printed pp. 3–5 |
| [BVA clarification by Hamburg and Roman](https://istqb.org/wp-content/uploads/2025/10/Boundary-Value-Analysis-white-paper.pdf) | Listed by ISTQB 21 October 2025 | Resolves domain endpoints, invalid-partition boundaries and complete BVA coverage |
| [Official glossary](https://glossary.istqb.org/) | Live service, accessed 28 October 2026 | Authoritative terminology in the CTFL syllabus context |

The syllabus v4.0.1 is an errata revision; the qualification is still called CTFL v4.0. Rules, tables, syllabus and sample papers have independent version numbers. The current live table link returned v1.19, superseding older search results referring to v1.13.

The PDF cross-check matched every one of the 64 LO identifiers and K levels, and all **102 keyword occurrences across the chapter lists** (some terms recur in different chapters). Public PDF SHA-256 fingerprints at review time:

- Syllabus: `3b072f81db5c7671aadacc42553e726faa93913a969cc7a89e9dc28c2318d1f1`
- Structure tables: `bacdbba4526afa3bb80081756e81cac90f7397b79e4a3618da641aa51c9fa4fc`

### Important scope detail

The older syllabus introduction describes keyword recall at K1. The later Rules v1.2, §4.1.4, explicitly says Foundation/specialist keywords are examinable for **understanding (K2)**. The study guidance therefore asks candidates to explain, distinguish and exemplify terms. LO K levels remain mapped exactly as published; keyword understanding does not silently relabel each LO.

The syllabus says its six substantive chapters are examinable; the introduction and appendices are not exam content, and referenced standards/books are examinable only to the extent summarized in the syllabus. This track does not add advanced techniques as if they were Foundation requirements.

## Examination blueprint

| Chapter | Syllabus teaching allocation | Questions per form | K1 | K2 | K3 | Topic questions |
|---|---:|---:|---:|---:|---:|---:|
| 1. Fundamentals of Testing | 180 min | 8 | 2 | 6 | 0 | 28 |
| 2. Testing Throughout the SDLC | 130 min | 6 | 2 | 4 | 0 | 20 |
| 3. Static Testing | 80 min | 4 | 2 | 2 | 0 | 16 |
| 4. Test Analysis and Design | 390 min | 11 | 0 | 6 | 5 | 28 |
| 5. Managing the Test Activities | 335 min | 9 | 1 | 5 | 3 | 32 |
| 6. Test Tools | 20 min | 2 | 1 | 1 | 0 | 4 |
| Total | 1,135 min | 40 | 8 | 24 | 8 | 128 |

Each item is one point. The pass threshold is **26/40 (65%)**. Standard time is **60 minutes**; the official table includes **75 minutes (+25%)** for eligible candidates taking the examination in a non-native language. Candidates must confirm eligibility and arrangements with their provider; a Quilyn practice timer grants no real-exam entitlement. The teaching minutes are syllabus training allocations, not measured reading times or a promise of sufficient personal study time.

Matching totals alone is insufficient. Every form also meets all **29 mandatory/selectable LO-group quotas** transcribed in `scripts/istqb/blueprint.mjs`. For example, each form includes FL-1.5.2, both lifecycle-independent/test-first K1 items, the prescribed chapter 2 group choices, two white-box K2 items, two experience-based K2 items, all five chapter 4 K3 items and all three chapter 5 K3 items.

The machine-readable [coverage matrix](../data/istqb-ctfl/coverage.json) maps all LOs to chapter, K level, source, two topic item IDs and any mock item IDs. Empty mock IDs for some selectable LOs are legitimate; all 64 objectives still have notes, examples, recall prompts and topic questions. Coverage is structural evidence, not proof of educational sufficiency for every candidate.

## Published sample papers and original forms

| Official set | Current paper edition | Questions | Matching answers |
|---|---|---|---|
| A | v1.7 | [Official questions](https://istqb.org/?download_id=3352&sdm_process_download=1) | [Official answers](https://istqb.org/?download_id=3357&sdm_process_download=1) |
| B | v1.7 | [Official questions](https://istqb.org/?download_id=3359&sdm_process_download=1) | [Official answers](https://istqb.org/?download_id=3365&sdm_process_download=1) |
| C | v1.6 | [Official questions](https://istqb.org/?download_id=3369&sdm_process_download=1) | [Official answers](https://istqb.org/?download_id=3372&sdm_process_download=1) |
| D | v1.5 | [Official questions](https://istqb.org/?download_id=3376&sdm_process_download=1) | [Official answers](https://istqb.org/?download_id=3380&sdm_process_download=1) |

These are **published samples**, not evidence of particular past live examinations. No authenticated archive of past live papers was established. Quilyn links to the originals rather than republishing their question text or importing exam dumps. The official sample guidance also warns that sample difficulty may differ from live exams; samples are not a calibrated pass prediction.

Quilyn provides **six original 40-item forms (240 items)**, distinct from the **128 original topic items**. No exact normalized stem is repeated across the 368 items. Forms intentionally revisit the same concepts; different wording does not make them statistically independent. They are plausible syllabus-aligned practice, not forecasts of undisclosed questions. There is no claim that these questions have previously appeared or will appear in a live exam.

### Item construction and scoring

- Single-select items use four alternatives; multi-select items explicitly request two answers from five alternatives.
- Keys remain bound to permanent IDs during reproducible option permutation. Single-answer positions are balanced within each bank, with hash-based assignment rather than a repeating A/B/C/D sequence.
- Scenarios state assumptions that affect the answer: integer granularity, inclusive thresholds, feasible condition combinations, initial state, allowed transitions and dependency/tie rules.
- K3 items require applying a technique to unfamiliar data: partitions, boundary sets, decision rules, event traces, acceptance cases, estimates, priorities and actionable defect reports.
- Rationales give the governing rule or calculation and address the main distractor errors. Letter-dependent explanations are avoided so option rearrangement does not break the reasoning.
- Full-set scoring is used for multi-select: an incomplete or overselected answer earns zero. There is no partial credit; all 40 items remain in the submitted score denominator.
- Conceptual answer keys received an author pass against the syllabus. Numeric and model-based keys also have independent calculation/model regression tests. The subsequent two-agent AI review and correction re-review are recorded in the [resolution report](reports/istqb-independent-review-resolution.md). They are not a human SME moderation pass.

## Learning design and its evidence

[Dunlosky, Rawson, Marsh, Nathan and Willingham (2013), *Improving Students' Learning With Effective Learning Techniques*](https://www.psychologicalscience.org/journals/pspi/1529100612453266/) rates practice testing and distributed practice highly across studied contexts. Self-explanation and interleaving have more qualified evidence. The research is general learning evidence, not a CTFL-specific validation of Quilyn or any exact schedule.

Implementation decisions inferred from that evidence:

1. **Retrieve before rereading:** each topic asks a closed-notes question, followed by a worked example and explanation. Two-item focused quizzes are formative checks.
2. **Space retrieval:** the existing Smart Review system draws on the topic bank. Candidate guidance proposes later-day revisits; suggested 1/3/7/14-day intervals are practical defaults, not an empirically optimal universal sequence.
3. **Explain decisions:** candidates should state why the chosen option fits and why alternatives fail. Correct guesses and high-confidence errors deserve review alongside wrong answers.
4. **Progress from worked examples to transfer:** notes present a short rule and example; quizzes then use different scenarios and the separate mocks change values, models and combinations.
5. **Interleave after initial learning:** mix EP/BVA, rule/state models, statement/branch metrics and estimation/prioritization to practice selecting the appropriate method.
6. **Separate learning from timed rehearsal:** existing learning mode permits checks and pauses; simulation has continuous deadlines and defers answers until submission.
7. **Make readiness evidence modest:** fresh first-attempt scores, timing and objective-level weaknesses matter more than memorized repeat scores. The local 70% module mastery label is not the official 65% threshold and is not a pass guarantee.

A flexible 21-day-plus sequence appears in chapter 1, covering fundamentals and lifecycle, then static testing, then intensive chapter 4/5 technique practice, tools, spaced review and separate-day mock attempts. Beginners or candidates with limited daily time should extend it. Leave at least one official sample unseen until the final external check.

## Quilyn audit and integration

The repository is a static, no-install JavaScript learning application. Tracks and modules are registry-driven. Existing content supports guides, pitfalls, quizzes, recaps, Smart Review, attempt history, a mistakes notebook, study plans, static reading pages and offline packages.

| Finding | Resulting change |
|---|---|
| New course can use existing JSON contract | Added CTFL registry entry and six chapter modules; kept other track IDs and stored progress identities |
| Modules lacked a focused topic quiz selector | Added optional objective-based scope control; topic attempts use fresh transient answer state and history, without overwriting saved chapter answers or awarding chapter mastery |
| Source labels assumed Pega or Tricentis | Added an ISTQB syllabus label and dedicated track icon |
| CTFL timer and pass mark differ from Pega | Registry config drives 60 min / 65%; optional 75-min practice selection preserves saved attempt duration |
| Existing mock bank shape is keyed by track and form | Added CTFL forms using the same runtime format, plus IDs, LO/K/source/provenance metadata |
| Search, reading and offline manifests are generated | Regenerated the library, static reading pages, sitemap, provenance inventory and track packages |
| An old reading-page test hard-coded 210 modules | Replaced that assertion with registry-derived counts while retaining unique-title, canonical and content checks |
| New practice selects needed theme styling | Added scoped, full-width controls with existing theme colors and 44-pixel minimum height |
| Cached clients need new assets | Advanced service-worker shell cache from v238 to v239 |

### Authoring and maintenance

`npm run build:istqb` regenerates the course from `scripts/istqb/`, then regenerates all derived manifests and pages. `npm run check` includes a deterministic output check, content validation, bias checks and regression tests. Keep permanent question IDs stable when retaining the same item; make intentional revisions when changing its meaning or answer.

Review the official qualification download index before describing the track as current in a future release. Recheck all four document version families, changed keywords/LOs, official group quotas and answer explanations. Version and review dates document the checked state; they do not promise perpetual currency.

## Attribution and practical limits

The Foundation syllabus v4.0.1 credits Renzo Cerquozzi, Wim Decoutere, Jean-François Riverin, Arnika Hryszko, Martin Klonk, Meile Posthuma, Eric Riou du Cosquer, Adam Roman, Lucjan Stapp, Stephanie Ulrich and Eshraka Zakaria, with copyright held as described in the official document by the authors and ISTQB. The linked document supplies its full acknowledgements and usage terms. Exam documents are owned by their credited authors/ISTQB. The original Quilyn explanations and questions do not transfer any rights in these third-party works.

Before positioning the forms as calibrated readiness assessments, obtain independent CTFL SME moderation and pilot evidence for ambiguity, timing, difficulty and discrimination. No empirical equivalence to live exams, guaranteed pass rate, accreditation or future-paper prediction is claimed. The full official syllabus and glossary remain part of the preparation route.

## Independent AI review follow-up

Two separately tasked AI reviewers assessed all 368 items and 64 objective sections, then rechecked the corrections. The baseline contained a critical BVA coverage error and an ambiguous automation multi-select. The corrected course derives BVA from the feasible domain and every partition boundary, rather than a fixed six-value shortcut. The original tests repeated that mistaken shortcut, so their earlier passing status was insufficient evidence. New tests derive finite extrema and feasible-neighbor unions, including outer endpoints and overlapping neighborhoods. Thirty-four items were revised, together with terminology and worked-model coverage. See the [review and adjudication record](reports/istqb-independent-review-resolution.md) for exact scope, receipts and remaining limits.
