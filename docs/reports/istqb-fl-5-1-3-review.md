# FL-5.1.3 mock-item review (CTFL v4.0, read-only)

Source checked: CTFL Syllabus v4.0.1 (download_id=3345, 78 pages), section 5.1.3 "Entry Criteria and Exit Criteria", PDF page 49 (printed p. 49). LO: "FL-5.1.3 (K2) Compare and contrast entry criteria and exit criteria".

Key syllabus statements used below:
- Entry criteria are "the preconditions for undertaking a given activity"; exit criteria "define what must be achieved to declare an activity completed".
- Typical exit criteria: thoroughness measures (coverage, number of unresolved defects, ...) and binary yes/no criteria (including "all defects found are reported").
- Running out of time or budget can be a valid exit criterion if "the stakeholders have reviewed and accepted the risk".
- Agile: exit criteria are often called Definition of Done; entry criteria for a user story are called Definition of Ready.

## Structural checks (task 3): all pass

| Form | Items | Ch 1-6 | K1/K2/K3 | {5.1.1, 5.1.3} item |
|---|---|---|---|---|
| Mock Exam 1 | 40 | 8/6/4/11/9/2 | 8/24/8 | FL-5.1.1 (K2) |
| Mock Exam 2 | 40 | 8/6/4/11/9/2 | 8/24/8 | FL-5.1.3 (K2), CTFL-M2-Q27 |
| Mock Exam 3 | 40 | 8/6/4/11/9/2 | 8/24/8 | FL-5.1.1 (K2) |
| Mock Exam 4 | 40 | 8/6/4/11/9/2 | 8/24/8 | FL-5.1.3 (K2), CTFL-M4-Q27 |
| Mock Exam 5 | 40 | 8/6/4/11/9/2 | 8/24/8 | FL-5.1.1 (K2) |
| Mock Exam 6 | 40 | 8/6/4/11/9/2 | 8/24/8 | FL-5.1.3 (K2), CTFL-M6-Q27 |

Exactly one item from the group in every form. Distinct LOs across forms: 64; compared with data/istqb-ctfl/coverage.json objectives (64): none missing, none extra.

## Item findings

### Critical
None. All three keys are correct and are the only defensible answer.

### Major

**M1. CTFL-M6-Q27 duplicates topic question CTFL-C5-Q06 (task 2).**
- Mock: "A deadline is reached with some exit targets unmet. Which statement is defensible?" Key: "Testing may end after residual risk is reviewed and accepted".
- Topic (data/istqb-ctfl/chapter-5.json practiceQuiz[5]): "Time expires while critical risks remain. What is the appropriate basis for ending testing?" Key: "Communicated residual risk and stakeholder acceptance".
- Same scenario, same decision, same key, and similar falsification distractors ("reclassified as invalid" vs "Reclassification of all unexecuted cases as passed"). A learner who did the topic quiz gets this mock item from memory.
- Its distractors are also implausible ("Only the test tool can accept business risk", "The deadline proves every unexecuted test would pass"), so the item is a give-away even without the topic quiz.
- Also, the item does not compare entry with exit criteria, which is the K2 verb of the LO.
- Suggested rewrite (Agile naming angle; not used in either topic question; the keyword check only mentions it in its answer text):

```
5.1.3|In an Agile team, which statement correctly contrasts Definition of Ready and Definition of Done?|Definition of Ready states what a user story needs before work on it starts; Definition of Done states what it needs to count as releasable|Definition of Ready states what a user story needs to count as releasable; Definition of Done states what it needs before work starts|Both state what a user story needs before work starts, one for the iteration and one for the release|Both state what a user story needs to count as releasable, so a team only needs one of them|In Agile development, entry criteria that a user story must meet before development or testing starts are called Definition of Ready. Exit criteria, the team's objective metrics for a releasable item, are called Definition of Done. Swapping them, or treating both as start conditions or both as end conditions, does not match the syllabus.
```
Note: mock-concepts.mjs line 98 also has a Definition of Ready row ("A team calls an environment-ready condition Definition of Ready..."). If that row is in another form's pool, check that the two never appear in the same form. A safe alternative is to rewrite line 98 itself into the row above and drop line 200.

**M2. CTFL-M2-Q27 has distractors that are not plausible.**
- "Delete the defect to align the dashboard", "Treat coverage as proof that critical defects do not matter" and "Declare exit criteria met because one metric passed" are behaviors nobody would defend. Only the last one is a real misconception. The key is the only reasonable-sounding option, so the item mostly tests ethics, not FL-5.1.3.
- Key correct per syllabus (coverage and number of unresolved defects are both thoroughness exit measures). The rationale "Exit criteria must be assessed together" is reasonable but not syllabus wording.
- Stem: "violates exit criteria" already gives the answer away (it says the criteria are not met).
- Suggested rewrite (concrete numbers, plausible misconceptions, one entry/exit contrast distractor):

```
5.1.3|The exit criteria for system testing are at least 80% requirements coverage and no open critical defects. Coverage is now 85%, but one critical defect is still open. What should the test manager report?|The exit criteria are not met, together with the remaining risk, so stakeholders can decide how to proceed|The exit criteria are met, because coverage is above the required level|The exit criteria are met, because coverage measures thoroughness better than a count of open defects|The entry criteria for system testing are not met, so system testing must start again|Exit criteria define what must be achieved to declare testing complete, and both measures here must be satisfied. Exceeding the coverage target does not make up for an open critical defect. The open defect concerns ending the activity, not its preconditions, so it does not mean the entry criteria are unmet. Stakeholders can still accept the risk, but only after it is reported.
```

### Minor

**m1. CTFL-M4-Q27 (newly rewritten): sound, small wording fix.**
- Stem: "Before system testing can be closed, every unresolved defect must be reported with an assessment of its risk. How is this condition best classified?" Key "An exit criterion for system testing" is correct: it is a binary yes/no exit criterion similar to the syllabus example "all defects found are reported".
- Distractors are plausible. The entry criterion is the real contrast. "Test completion report" is attractive because completion reports contain unfixed defects and risks, but the stem clearly asks about a *condition*, so it is clearly wrong. "Test progress report" is the weakest option but acceptable. K2 (classify by comparing entry and exit). The rationale is accurate.
- Non-native clarity: "closed" is less clear than the syllabus term "declared complete", and "reported with an assessment of its risk" is a long phrase. Optional tightening:

```
5.1.3|System testing can only be declared complete when every unresolved defect has been reported with its risk assessed. How is this condition best classified?|An exit criterion for system testing|An entry criterion for system testing|A test completion report|A test progress report|The condition must be met to declare the activity complete, so it is an exit criterion. Entry criteria are preconditions for starting an activity. Completion and progress reports are work products that communicate results; they are not criteria.
```
- No duplication. C5-Q05 classifies an *entry* criterion (environment and data ready). The keyword check classifies environment availability against coverage and high-risk passes. M4 classifies a binary defect-reporting *exit* criterion, so the content is different even though the format is similar.

**m2. Source anchor points to the chapter, not the section.** All three items use `#page=47` (Chapter 5 learning-objective page). Section 5.1.3 is on PDF page 49. This happens throughout because scripts/build-istqb.mjs:22 builds `sourceFor` per chapter. It is not wrong, but a section-level anchor (page 49) would make it easier for a reviewer to trace the source.

## Duplication summary (task 2)
- M2-Q27 vs C5-Q05 / C5-Q06 / keyword check: no duplication.
- M4-Q27 vs the same: no duplication (same classification format as C5-Q05, but the opposite criterion and different content).
- M6-Q27 vs C5-Q06: near-duplicate (Major M1).

## Correction recheck (after rebuild)

All three rewrites are in scripts/istqb/mock-concepts.mjs (lines 64, 132, 200) and the built bank matches what was intended.

| Item | Built key (after shuffle) | Index `a` | Matches intent |
|---|---|---|---|
| CTFL-M2-Q27 (K2) | "The exit criteria are not met, together with the remaining risk, so stakeholders can decide how to proceed" | [2] | Yes |
| CTFL-M4-Q27 (K2) | "An exit criterion for system testing" | [1] | Yes |
| CTFL-M6-Q27 (K2) | "Definition of Ready states what a user story needs before work on it starts; Definition of Done states what it needs to count as releasable" | [2] | Yes |

Stems, options and rationales are verbatim. The keys sit at different positions (2, 1, 2), so there is no fixed position.

Duplication:
- No chapter-5 practiceQuiz item mentions Definition of Ready/Done, an open critical defect or a coverage threshold. C5-Q05 and C5-Q06 stay distinct.
- The keyword check "Entry versus exit criteria" mentions DoR/DoD only as a closing note in its answer. Its question classifies environment availability against coverage, so M6 does not duplicate it.
- CTFL-M6-Q27 is the only built item anywhere in the bank that mentions "Definition of Ready". The line-98 row is not selected into any form, so the possible clash noted under M1 does not happen.
- No stem is repeated across the six forms.

Structure (still passing): all 6 forms have 40 items, chapters 8/6/4/11/9/2, K1/K2/K3 8/24/8, and exactly one item from {FL-5.1.1, FL-5.1.3} (1/3/5 have 5.1.1; 2/4/6 have 5.1.3). 64 of 64 LOs are covered, none missing.

Findings M1, M2 and m1 are resolved. m2 (chapter-level page anchor) is accepted as is for the whole bank. No new issues.
