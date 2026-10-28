# CTFL v4.0 technical accuracy review: exam essentials, worked models, study method

Reviewer role: independent CTFL v4.0 SME (accuracy only). Reviewed 2026-10-28.

Sources fetched from the official CTFL page (https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/) and read in full for the relevant sections:

- CTFL Syllabus v4.0.1 (download_id=3345), 78 pp., dated 2024-09-15, revision history "CTFL v4.0.1 – Errata"
- Exam Structures and Rules v1.2 (download_id=3829), 10 pp., 2025-05-02
- Exam Structures & Rules Tables v1.19 (download_id=3832), 37 pp., 2026-08-19 (CTFL overview p.3, CTFL table pp.4-5)
- Supporting: ISTQB BVA white paper (Hamburg/Roman), linked by the material as `bvaClarification`
- Official page download list (sample exam versions A 1.7, B 1.7, C 1.6, D 1.5, matching `resources.mjs`)

Files reviewed: `scripts/istqb/exam-readiness.mjs`, `scripts/istqb/worked-models.mjs`, `scripts/build-istqb.mjs` (studyMethod, chapter orientation, estTime, teaching-minute total), plus `scripts/istqb/curriculum.mjs` line 2-4 (chapter minutes/counts that feed the totals).

## Summary

| Severity | Count |
|---|---|
| Critical | 0 |
| Major | 1 |
| Minor | 8 |

No exam fact, chapter/K-level allocation, BVA set, decision table, state-transition test set, prioritization order or estimation result is wrong. The one major finding is an exercise whose solution does not give the branch-coverage figure it asks for and frames branches in a way that differs from the syllabus definition.

## Findings

### MAJOR-1: FL-4.3.1 solution does not answer "branch coverage" and conflicts with the syllabus branch definition

- File / LO: `scripts/istqb/worked-models.mjs`, `FL-4.3.1`, second text element
- Quoted: "Try first: premium=true is the only test. What are statement and branch coverage, and what is missing? Solution: all 3/3 statements execute (100%). Of the two decision outcomes only true executes. If the control-flow model also counts the common entry/exit edges, include those explicitly in both numerator and denominator; do not confuse this two-outcome comparison with a universal count of every control-flow edge."
- Problem: The prompt asks for branch coverage, but the solution never states a branch-coverage value. Instead it compares decision outcomes (1/2) and treats counting unconditional edges as an optional variant. CTFL v4.0.1 defines a branch as any transfer of control between two nodes of the control flow graph, "either unconditional (i.e., straight-line code) or conditional (i.e., a decision outcome)". Coverage is exercised branches divided by all branches. For the stated model (S1 -> D, D -true-> S2, D -false-> S3, S2 -> S3) there are 4 branches. premium=true exercises S1->D, D->S2 and S2->S3, so branch coverage is 3/4 = 75%, not "1 of 2 outcomes" (50%). Counting only decision outcomes is decision coverage, which CTFL does not define. A learner who takes away "1/2 = 50%" will choose the wrong answer on a syllabus-style branch question. The phrase "do not confuse this two-outcome comparison with a universal count of every control-flow edge" suggests the full edge count is non-standard, which is the reverse of the syllabus position. Smaller point: the model says the decision D is not an executable statement. That is allowed because the model defines it, but in real code `if (premium)` is normally counted as a statement. That makes 4/4 the usual answer, so the stipulation should be justified or dropped.
- Source: Syllabus v4.0.1 §4.3.2, p.43 (branch definition, unconditional and conditional branches, coverage formula); §4.3.1, p.42.
- Suggested correction: "Solution: statement coverage 3/3 = 100%. The control flow graph has four branches: S1->D (unconditional), D->S2 (true), D->S3 (false) and S2->S3 (unconditional). The test exercises three, so branch coverage is 3/4 = 75%. The unexercised false branch D->S3 shows why 100% statement coverage does not imply 100% branch coverage." Optionally add: "If you count only the decision outcomes, 1 of 2 is exercised. That is a decision-outcome view, and CTFL branch coverage counts every branch in the graph."

### MINOR-1: FL-4.3.2 redefines branch coverage items as decision outcomes; path coverage introduced as a measure

- File / LO: `worked-models.mjs`, `FL-4.3.2`
- Quoted: "Using decision outcomes as the four branch coverage items, tests (1,1) and (-1,-1) exercise which items?" and "…2/4 possible paths are covered."
- Problem: The conclusions are correct. Under the syllabus definition, two sequential if-without-else decisions give 6 branches (D1 true -> A, D1 false -> D2, A -> D2, D2 true -> B, D2 false -> exit, B -> exit), and TT plus FF cover all 6, so the result is still 100%. Defining the branch coverage items as "decision outcomes" repeats the terminology drift in MAJOR-1. Expressing paths as a coverage ratio (2/4) is fine as an illustration, but path coverage is not a CTFL coverage criterion. The syllabus only notes that branch coverage may miss defects that need a specific path. FL-4.3.2 is K2 (explain).
- Source: Syllabus §4.3 intro p.42 ("more rigorous white-box techniques… not discussed"), §4.3.2 p.43.
- Suggested correction: "The control flow graph has six branches (four conditional, two unconditional). Tests (1,1) and (-1,-1) exercise all six, so branch coverage is 100%." Keep the path remark as "two of the four possible paths through the code are not executed", without presenting it as a coverage measure in its own right.

### MINOR-2: FL-4.2.1 completion test combines two invalid partitions in one test

- File / LO: `worked-models.mjs`, `FL-4.2.1`, Solution
- Quoted: "Add (0, other) and (21, standard) to cover all six. This does not establish every combination or specify which error wins when two inputs are invalid; clarify that oracle separately."
- Problem: The arithmetic is correct: 3 quantity partitions and 3 service partitions; (5, standard) and (12, express) cover 1 + 2 = 3 of 6, which is 50%; the two added tests reach 6/6. The test (0, other), however, puts two invalid values in one test, so one rejection can hide the other. The solution names the oracle problem but still recommends the masking design. The syllabus raises defect masking under §4.2.4, and the same reasoning applies here.
- Source: Syllabus §4.2.1 p.39-40 (Each Choice coverage); §4.2.4 p.42 (defect masking principle).
- Suggested correction: replace with three tests, (0, standard), (21, express) and (7, other), so that each invalid partition is tested on its own. That is 5 tests in total and still 100% Each Choice coverage. Alternatively, keep four tests and state that the combined invalid test is a deliberate economy that risks masking.

### MINOR-3: FL-4.2.4 state table notation for invalid transitions

- File / LO: `worked-models.mjs`, `FL-4.2.4`, state table
- Quoted: cells "Invalid"
- Problem: The syllabus says the state table shows invalid transitions as empty cells. A labelled cell is clearer and the syllabus does allow other notations for decision tables, but learners should recognise the exam convention.
- Source: Syllabus §4.2.4 p.41 ("invalid transitions, which are represented by empty cells").
- Suggested correction: add a note: "In the syllabus convention these cells are left empty; 'Invalid' is written here for readability."

### MINOR-4: FL-4.2.3 wording "four independent feasible combinations"

- File / LO: `worked-models.mjs`, `FL-4.2.3`
- Quoted: "four independent feasible combinations give four full-table columns"
- Problem: "Independent" is not syllabus terminology and could be misread as a statistical or logical-independence claim. The syllabus says a full decision table has a column for every combination of conditions. Everything else in this LO is correct: 2^2 = 4 columns, reduced columns T/T X, T/F, F/-, the T/F/-/N/A/X/blank notation, infeasible columns excluded from the denominator, and minimisation algorithms out of scope.
- Source: Syllabus §4.2.3 p.41.
- Suggested correction: "Two Boolean conditions give 2 x 2 = 4 combinations, all feasible here, so the full table has four columns."

### MINOR-5: FL-5.1.4 three-point answer not given in the syllabus "E ± SD" form

- File / LO: `worked-models.mjs`, `FL-5.1.4`, pushed Solution
- Quoted: "Weighted three-point estimate = (3+4×6+15)/6 = 7 person-days; standard deviation estimate = (15−3)/6 = 2 person-days. This spread alone is not a guaranteed completion interval."
- Problem: The arithmetic is correct: (3 + 24 + 15)/6 = 42/6 = 7, and SD = 12/6 = 2. The ratio estimate 240 x 1/4 = 60 person-hours is also correct. The syllabus, however, presents the result as "10±2 person-hours (i.e., between 8 and 12 person-hours)" and calls SD the measurement error, and exam options usually use that form. The caveat is sound, but without the E ± SD form learners may not recognise the expected answer pattern.
- Source: Syllabus §5.1.4 p.50 (three-point example).
- Suggested correction: "E = 7 person-days, SD = 2, which the syllabus writes as 7 ± 2 person-days (5 to 9 person-days). Treat this as the estimate's spread, not a guaranteed range."

### MINOR-6: FL-5.1.4 Wideband Delphi trigger for discussion

- File / LO: `worked-models.mjs`, `FL-5.1.4` table row and note
- Quoted: "Collect isolated estimates, discuss differences, re-estimate and repeat to consensus."
- Problem: The description is essentially right. The syllabus, though, makes discussion conditional: experts discuss when estimates deviate beyond agreed boundaries. "Planning Poker is a card-based variant" matches the syllabus.
- Source: Syllabus §5.1.4 p.50.
- Suggested correction: "…discuss when estimates fall outside the agreed range, re-estimate in isolation, repeat until consensus."

### MINOR-7: Exam essentials omit rules 4.1.3 (Glossary keywords related to the syllabus)

- File / section: `exam-readiness.mjs`, table row "Scope"
- Quoted: "Keywords require understanding under rules v1.2; the LO labels retain their specified K levels."
- Problem: The row is correct for rule 4.1.4 (syllabus keywords examinable at K2). Rules 4.1.3 also says "All keywords in the Glossary related to the syllabus are Examinable", and definition 2.1.4 says answers are judged against the syllabus "(or Glossary for keywords)". Learners should know that Glossary definitions are the authoritative source for keyword answers. `build-istqb.mjs` links the glossary but does not state this rule.
- Source: Exam Structures and Rules v1.2, §2.1.4 p.6, §4.1.3-4.1.4 p.8.
- Suggested correction: append "Keyword answers are judged against the ISTQB Glossary definitions (rules 4.1.3, 2.1.4)."

### MINOR-8: "allocates 1,135 teaching minutes" omits that it is a minimum for accredited courses

- File / section: `build-istqb.mjs` studyMethod note (computed from `curriculum.mjs` chapters)
- Quoted: "The syllabus allocates 1,135 teaching minutes before extra practice"
- Problem: The total is correct: 180 + 130 + 80 + 390 + 335 + 20 = 1135, and the per-chapter values match. The syllabus frames it as "a minimum of 1135 minutes (18 hours and 55 minutes) of instruction" for accredited training courses, which is not a self-study estimate. The module `estTime` already says "(not a measured completion estimate)", so this is a nuance only.
- Source: Syllabus §0.11 p.13.
- Suggested correction: "The syllabus requires accredited courses to give at least 1,135 minutes (18 h 55 min) of instruction…"

## Items checked and found correct

### Exam facts (exam-readiness.mjs, build-istqb.mjs track.exam, studyMethod)
- 40 questions, 40 points, 26 to pass (65%): Tables v1.19 p.3; Rules 5.3.1
- One point per question, K3 included: Rules 5.2.1
- 60 min, 75 min (+25%) for candidates whose native language is not the exam language: Tables p.3; Rules 6.2.1
- Chapter allocation 8/6/4/11/9/2; chapters 4+5 = 20/40: Tables pp.4-5
- K-level allocation K1 8, K2 24, K3 8, K4 0: Tables p.4 (per-chapter K1/K2/K3 sums: 2+2+2+0+1+1 = 8; 6+4+2+6+5+1 = 24; 0+0+0+5+3+0 = 8)
- Chapter orientation percentages: 20%, 15%, 10%, 27.5%, 22.5%, 5%, all correct
- Keywords K2 under Rules v1.2 (May 2025, change 4.1.4); older syllabus §0.5 says K1 recall: both statements accurate
- All content of chapters 1-6 examinable (at least K1), including concepts without an LO: Syllabus §0.5 p.11
- Introduction and appendices not examinable; standards/books only as summarised: Syllabus §0.6 p.12 (also §0.8)
- Timing guidance (about 1 min for K1/K2, 3 min for K3, 56 min total): Tables p.4; Rules 6.1 (K2 1-2 min). The statement that these are approximate task timings, not limits, is accurate
- Self-study is an option: official CTFL page text
- Version labels: CTFL v4.0, syllabus v4.0.1 = Errata of 2024-09-15; Rules v1.2 = 2025-05-02; Tables v1.19 = 2026-08-19
- Link anchors: syllabus #page=11 (§0.5-0.6 on pp.11-12), tables #page=3 (CTFL overview; allocation on pp.4-5), chapter page anchors 14/24/32/38/47/58 match the syllabus ToC; download IDs and sample versions A 1.7, B 1.7, C 1.6, D 1.5 match the official page; provider directory URL returns 200
- Statement that the sample exams are published samples and not past live papers: accurate

### Teaching minutes
- 180/130/80/390/335/20 per chapter, sum 1135: Syllabus §0.11 p.13 and chapter headings

### FL-2.2.2
- The eight non-functional characteristics, including "Usability (interaction capability)" and "Portability (flexibility)", match Syllabus §2.2.2 p.29-30 exactly. The example evidence for each is appropriate. "Either type may be checked at more than one test level" is consistent with "All the four… test types can be applied to all test levels".

### FL-4.2.1
- Partitions (<=0, 1-20, >=21; standard, express, other), 3/6 = 50% Each Choice coverage and 6/6 after the added tests are correct. Inclusion of invalid partitions in coverage, and the statement that Each Choice does not cover combinations, match §4.2.1. (See MINOR-2 on test design.)

### FL-4.2.2 (all three rows recomputed)
- All integers; x<10, 10..50, >50: boundaries 9, 10, 50, 51. 2-value {9,10,50,51}; 3-value {8,9,10,11,49,50,51,52}. Correct
- Non-negative integers; 0..9, 10..50, >50: boundaries 0, 9, 10, 50, 51; -1 infeasible. 2-value {0,9,10,50,51}; 3-value {0,1,8,9,10,11,49,50,51,52}. Correct, and consistent with the white paper's login example (no -1 for an infeasible value)
- All integers; x<2, x=2, x>2: boundaries 1, 2 (min = max), 3. 2-value {1,2,3}; 3-value {0,1,2,3,4}. Correct
- Procedure steps (domain, partitions, boundaries, per-variant items, union, dedupe) and the "no fixed multiplier" warning match the white paper §3-4. The distinction between valid/invalid (in domain) and infeasible (outside domain) matches white paper §7. The 2-value union equalling the set of boundary values matches the white paper ("the set of all coverage items is the same as the set of all boundary values")

### FL-4.2.3
- Full table (4 columns) and reduced table (3 columns, F/- merged) are correct for Member AND Qualifying. R4 test expectation is correct. Notation T/F/-/N/A/X/blank matches §4.2.3 exactly. Coverage items are feasible columns, and infeasible columns are excluded from the denominator. "Minimization algorithms out of scope" is a direct syllabus statement

### FL-4.2.4
- Label syntax "event [guard] / action"; guarded events as table columns; the self-loop badge[not valid] counted as a valid transition
- Sequence badge(valid), timeout, badge(not valid) from Locked covers 3/3 valid transitions
- badge(valid) alone gives 100% all-states and 1/3 valid transitions
- The three invalid cells (Locked/timeout, Unlocked/badge valid, Unlocked/badge not valid) are identified correctly, each tested once with a minimal setup. Valid plus invalid tests give 6/6 all-transitions coverage
- "One invalid transition per test to avoid defect masking" matches §4.2.4 p.42

### FL-4.3.1 / 4.3.2 (apart from findings)
- Statement coverage 3/3 = 100%; "100% statement does not imply 100% branch"; TT+FF covering all branches but only 2 of 4 paths; "neither proves correct behaviour". All are consistent with §4.3.1-4.3.3

### FL-4.5.3
- Collaborative derivation from multiple perspectives, positive then negative then non-functional cases, preconditions/inputs/postconditions, no duplicates, nothing beyond the story, manual or automated execution: all match §4.5.3 p.46. The Given/When/Then cases are consistent (8 + 2 = 10; Shipped case leaves stock at 8). Flagging the repeat-cancel gap for clarification, without inventing behaviour, is correct practice

### FL-5.1.4 (apart from findings)
- Four techniques and their bases match §5.1.4 (ratios from the organisation's historical projects; extrapolation from current-project data, e.g. mean of recent iterations; Wideband Delphi; Planning Poker as its card variant; three-point). The ratio 4:1 applied to 240 h gives 60 person-hours. E = 7 and SD = 2 are correct. The technique-selection note is correct

### FL-5.1.5
- Additional-coverage order with the prerequisite: initially eligible T1(3), T2(2), T4(1), so T1 first; then T3(+2), T4(+1), T2(+0), giving T1, T3, T4, T2. Correct
- Total-coverage order T1(3), T2(2) / T3(2), T4(1) puts T2 before T4. Correct
- Dependency rule matches §5.1.5 p.50 ("the lower priority test case must be executed first")

### FL-5.5.1
- Expected 8 + 2 = 10 and actual 12 are consistent. The report fields (ID, title, date/author, test object/environment, context/test reference, reproducible steps, expected/actual, evidence, severity, priority, status, references) cover the §5.5 p.56-57 list. Severity as impact and priority set with stakeholders are correct. "Does not prove which component caused it" is correct. (The author's role, listed in §5.5, is not mentioned; this is optional.)

### studyMethod (other statements)
- "v4.0.1 errata syllabus (2024-09-15)", 40 one-point questions, 26 to pass in 60 min, 75 min for eligible non-native candidates, and the K1 vs K2 keyword statement are all accurate. Quilyn-local rules (no partial credit, 70% mastery, review intervals) are labelled as Quilyn rules and are not presented as ISTQB facts

## Correction recheck (2026-10-28)

Re-read the revised `scripts/istqb/worked-models.mjs`, `scripts/istqb/exam-readiness.mjs` and `scripts/build-istqb.mjs` (studyMethod, chapter orientation, `exampleAfterPractice`). `node scripts/build-istqb.mjs --check` passes, so `data/istqb-ctfl/chapter-*.json` is in sync with the sources. Rendered order in chapter-4.json: for FL-4.3.1 and FL-4.3.2, the exercise now comes before the "Recap example". I re-checked every key against syllabus v4.0.1.

### Status of original findings

| # | Finding | Status | Evidence |
|---|---|---|---|
| MAJOR-1 | FL-4.3.1 branch coverage missing or using decision outcomes | Resolved | The model now lists 4 statements (D counted as a statement) and 4 branches including unconditional ones. The solution gives statements 4/4 = 100%, branches 3/4 = 75%, names D→S3 as not exercised, and states that CTFL counts every branch, conditional and unconditional (§4.3.2 p.43). Correct. |
| MINOR-1 | FL-4.3.2 decision outcomes as branch items; path ratio | Resolved | Now an if-else model with 8 listed branches. TT and FF cover 8/8 = 100%. Routes A→D and B→C are named as unexecuted without a path-coverage ratio, and path testing is labelled outside CTFL scope. Correct. |
| MINOR-2 | FL-4.2.1 combined invalid values | Resolved | The prompt requires at most one invalid value per test. The added tests (0, standard), (21, express) and (5, other) are the minimum of 3 (three invalid partitions, one per test). Coverage goes from 3/6 = 50% to 6/6. Correct. |
| MINOR-3 | FL-4.2.4 "Invalid" cell notation | Resolved | A note now explains the syllabus empty-cell convention (§4.2.4 p.41). |
| MINOR-4 | FL-4.2.3 "independent combinations" | Resolved | Now reads "2×2 = 4 combinations". |
| MINOR-5 | FL-5.1.4 E ± SD form | Resolved | Now reads "7 ± 2 person-days (5 to 9)", matching the §5.1.4 p.50 example form. |
| MINOR-6 | FL-5.1.4 Wideband Delphi discussion trigger | Resolved | Table and note now say discuss "when they fall outside the agreed range" (§5.1.4 p.50). |
| MINOR-7 | Rules 4.1.3 / 2.1.4 Glossary keywords | Resolved | The Scope row now cites both rules accurately. |
| MINOR-8 | 1,135 minutes as accredited-course minimum | Resolved | Now reads "requires accredited courses to provide at least 1,135 teaching minutes (18 h 55 min)… a course minimum, not a self-study estimate" (§0.11 p.13). The sum is still correct. |

### New exercises: keys recomputed

- **FL-4.2.2 price field** (0.01–99.99, step 0.01; 0.00 and ≥100.00 enterable but rejected; negatives cannot be entered). Partitions: {0.00}, [0.01, 99.99], [100.00, ∞). Boundary values: 0.00 (a singleton, so it is both min and max), 0.01, 99.99, 100.00.
  - 2-value set: {0.00, 0.01, 99.99, 100.00}, 4 values. Correct.
  - 3-value set: {0.00, 0.01, 0.02, 99.98, 99.99, 100.00, 100.01}, 7 values; −0.01 is infeasible. Correct, consistent with the BVA white paper §3-4 and §7.
- **FL-4.2.3 account creation**, rule registered AND (adult OR consent):
  - Full table: 8 rules; an account is created only for TTT, TTF and TFT. Correct.
  - Reduced table: F-- no; TT- create; TFT create; TFF no. These 4 columns partition all 8 combinations. Correct.
  - (T,T,F) exercises R2 and (F,F,F) exercises R1, giving 2/4 = 50%. Adding TFT and TFF gives 100%. Correct.
- **FL-4.2.4 coverage %**: badge(valid), timeout gives all states 2/2 = 100%, valid transitions 2/3 ≈ 67% (self-loop missed), all transitions 2/6 ≈ 33%. Correct per §4.2.4 p.42 formulas.
- **FL-5.1.4 extrapolation**: (18 + 22 + 20)/3 = 20 test hours. The comparable-conditions assumption is stated. Correct, and matches the §5.1.4 "average of last three iterations" example.
- **FL-5.1.5 additional coverage**: unchanged, T1, T3, T4, T2. Correct.
- **FL-5.1.5 risk-based order**: the key T4, T3, T2, T1 follows the §5.1.5 dependency rule, but see NEW-1.
- **Exam readiness timing**: 32 × 1 min + 8 × 3 min = 56 min, leaving about 4 min. Matches Tables v1.19 p.4.

### New issues

**NEW-1 (minor): FL-5.1.5 "Risk-based order with a dependency" has no stated selection rule, so the key is not the only defensible answer**
- Quoted prompt: "T2 is High risk but needs T3 to run first… T4 is High risk. Order the tests by risk while respecting the dependency."
- Problem: T2 and T4 are both High. The prompt does not say whether to pick the highest-risk test among currently eligible tests, which gives T4, T3, T2, T1. Another reading is to promote a prerequisite to the priority of its dependent test, which gives T3, T2, T4, T1. That reading is defensible under the syllabus sentence "If a test case with a higher priority is dependent on a test case with a lower priority, the lower priority test case must be executed first" (§5.1.5 p.50). The additional-coverage exercise avoids this problem by stating "among eligible tests" and a tie-break.
- Suggested correction: add to the prompt: "At each step run the highest-risk test whose prerequisite has already run; break equal risk by the lower test number." With that rule the key T4, T3, T2, T1 is the only answer.

No other new accuracy issues. The remaining revised text in studyMethod, exam readiness, FL-2.2.2, FL-4.5.3 and FL-5.5.1 is consistent with the syllabus, rules v1.2 and tables v1.19.
