# CTFL v4.0 study content: pedagogy and assessment-design review

Scope: `scripts/istqb/exam-readiness.mjs`, `scripts/istqb/worked-models.mjs`, `scripts/build-istqb.mjs` (`studyMethod`, chapter orientation), and the rendered order in `data/istqb-ctfl/chapter-*.json`. I reviewed the content only and edited no files.

Rendered order for each LO section: concept rule, then "Worked example: ..." (from curriculum.mjs), then the workedModels elements, then "Close the notes: ...". The engine renders `text` elements as plain paragraphs. Nothing hides a solution behind a reveal control (`<details>` is not used for study-guide text). So every "Solution:" paragraph is visible next to its "Try first:" paragraph.

## Arithmetic verified (all correct)

- FL-4.2.1: 3 quantity partitions + 3 service partitions = 6. (5,standard) and (12,express) cover {1–20, standard, express} = 3/6 = 50%. Adding (0,other) and (21,standard) covers all 6.
- FL-4.2.2 table: row 1 gives 2-value {9,10,50,51} and 3-value {8,9,10,11,49,50,51,52}. Row 2 gives {0,9,10,50,51} and {0,1,8,9,10,11,49,50,51,52} (−1 is infeasible). Row 3 gives {1,2,3} and {0,1,2,3,4}. All three rows are correct.
- FL-4.2.4: 3 valid transitions, and the sequence badge(valid), timeout, badge(not valid) covers all 3. There are 3 invalid cells, so 3 + 3 = 6 table cells.
- FL-4.3.2: (1,1) and (−1,−1) cover 4/4 outcomes and 2/4 paths.
- FL-5.1.4: 240 × 1/4 = 60 person-hours. E = (3 + 24 + 15)/6 = 7. SD = 12/6 = 2. The curriculum example (4,7,16) gives E = 48/6 = 8 and SD = 2.
- FL-5.1.5 additional coverage: T1 (+3), then T3 (+2, now eligible), then T4 (+1), then T2 (+0). Total-coverage order with the same tie-break is T1, T2, T3, T4, so "T2 ahead of T4" is correct.
- FL-4.5.3 / FL-5.5.1: 8 + 2 = 10 is the expected value, and 12 is double restoration. Consistent.
- Timing advice: 32 K1/K2 items × 1 min + 8 K3 items × 3 min = 56 min out of 60.
- Chapter orientation percentages (20, 15, 10, 27.5, 22.5, 5) and the allocation 8+6+4+11+9+2 = 40 are correct.

---

## Critical

None found. No exercise has a wrong key, and no statement invents an official rule without a hedge.

## Major

### M1. Solutions are not separated from "Try first" prompts (all faded exercises)
- Location: worked-models.mjs, every "Try first" / "Solution" pair. Rendered as adjacent `text` paragraphs.
- Worst cases: FL-4.3.1 and FL-5.1.5 put prompt and solution in the same paragraph:
  - "Try first: premium=true is the only test. What are statement and branch coverage, and what is missing? Solution: all 3/3 statements execute (100%)..."
  - "Try first: prioritize by additional coverage among eligible tests; break equal contributions by lower test number. Solution: T1 first (3 new items)..."
- Problem: the reader sees the answer while reading the question, so the retrieval/generation benefit is lost. The comment in the source ("attempt each prompt before reading the solution immediately below it") depends on self-discipline that the layout works against.
- Suggested fix: add an element type such as `{type:'exercise', prompt:'...', solution:'...'}` and render the solution inside `<details><summary>Show solution</summary>`. At minimum, split FL-4.3.1 and FL-5.1.5 into two separate elements, as the other LOs already do.

### M2. FL-4.3.1 branch coverage is not determinable from the prompt (hidden definition of coverage items)
- Location: worked-models.mjs, FL-4.3.1.
- Quoted: "What are statement and branch coverage...? ... Of the two decision outcomes only true executes. If the control-flow model also counts the common entry/exit edges, include those explicitly in both numerator and denominator..."
- Problem: the prompt does not say what counts as a branch. Under the v4.0.1 definition (a branch is a transfer of control between two CFG nodes, conditional or unconditional), the model has 4 edges: S1→D, D→S2, D→S3, S2→S3. premium=true covers 3/4 = 75%. Counting decision outcomes only gives 1/2 = 50%. The solution never states either percentage, and its hedge sentence is hard to parse, especially for a non-native reader. FL-4.3.2 handles this well ("Using decision outcomes as the four branch coverage items"). FL-4.3.1 should do the same.
- Suggested rewrite:
  - Prompt: "Try first: the control-flow graph has four branches: S1→D, D→S2 (true), D→S3 (false) and S2→S3. The only test uses premium=true. Calculate statement coverage and branch coverage. Which branch is not exercised?"
  - Solution: "Statements: S1, S2, S3 all execute, so 3/3 = 100%. Branches: S1→D, D→S2 and S2→S3 execute, so 3/4 = 75%. D→S3 (premium=false) is not exercised. 100% statement coverage does not mean 100% branch coverage."

### M3. FL-4.3.1: the preceding "Worked example" gives away the exercise's conclusion
- Location: curriculum.mjs 4.3.1 worked example, rendered directly above the trace model.
- Quoted: "An if-without-else can execute every statement when true while never testing its false branch."
- Problem: this states the exact insight the try-first asks for, one paragraph earlier. FL-4.3.2 has the same issue with "Running both outcomes of each if covers branches, but not necessarily every combination".
- Suggested fix: when an LO has a try-first exercise, show the curriculum worked example after the solution or drop it. Alternatively, rewrite the worked example to use a different structure, for example an if/else where one test covers 2/3 statements.

### M4. FL-5.5.1 relies on a criterion that is not in the prompt
- Location: worked-models.mjs, FL-5.5.1.
- Quoted prompt: "Pending order O17 with 2 reserved units and stock 8. Cancel once. Status becomes Cancelled but stock becomes 12."
- Quoted solution: "expected Cancelled and available=10 under the once-only restoration criterion ... precondition signed-in order owner".
- Problem: the expected result (10) and the ownership precondition only come from the FL-4.5.3 story in a different chapter (chapter 4 vs chapter 5). A learner who opens FL-5.5.1 directly or through Smart Review cannot derive "expected" from the prompt. This is a hidden assumption in a report whose whole purpose is completeness.
- Suggested rewrite: "Try first: acceptance criterion AC-3: cancelling a Pending order sets it to Cancelled and restores its reserved stock once. Build 4.2, Chrome 130. You are signed in as the owner of Pending order O17 (2 reserved units; available stock 8). You cancel once. Status becomes Cancelled, but available stock becomes 12. Draft a defect report that another tester can reproduce without asking you questions."

### M5. Study-method step 2 does not match the content it describes
- Location: build-istqb.mjs `studyMethod`, steps item 2.
- Quoted: "Read the decision rule, then solve the worked example without looking. Explain why the distractors fail before checking the rationale."
- Problem: the rendered "Worked example: ..." paragraphs contain their answers in the same sentence (for example 4.2.1: "Values 9, 30 and 51 cover all three"), so they cannot be "solved without looking". Worked examples also have no distractors or rationale. Those belong to the quizzes. A candidate following the instruction literally will be confused.
- Suggested rewrite: "Read the decision rule and the worked example. Then cover the solution and attempt each 'Try first' exercise on paper before you open its solution. In quizzes, explain why each wrong option fails before you read the rationale."

### M6. K3 gaps: BVA and decision tables have no try-first exercise, and FL-5.1.5 covers only one prioritization strategy
- Location: worked-models.mjs FL-4.2.2, FL-4.2.3 and FL-5.1.5, compared with the syllabus K3 list (4.2.1, 4.2.2, 4.2.3, 4.2.4, 4.5.3, 5.1.4, 5.1.5, 5.5.1).
- Problem:
  - FL-4.2.2 and FL-4.2.3 are the most frequently examined K3 techniques, yet they are fully worked with no self-check. The fading sequence stops at step 0 there. The 4.2.2 table also duplicates the curriculum worked example (rows 1–2) instead of adding a new case.
  - FL-5.1.5 covers additional-coverage ordering only. The LO also covers risk-based and requirements-based prioritization with dependencies, which official samples commonly test.
  - Smaller gaps: no extrapolation calculation (5.1.4), and no state-transition coverage percentage (for example "2 of 3 valid transitions = 67%") (4.2.4).
- Suggested additions (keys verified):
  - **BVA (4.2.2)**: "Try first: a price field accepts 0.01 to 99.99 in steps of 0.01. Negative values cannot be entered; 0.00 and values from 100.00 can be entered but are rejected. List the 2-value and 3-value BVA sets." Solution: "Partitions: {0.00} invalid, 0.01–99.99 valid, ≥100.00 invalid. 2-value set: 0.00, 0.01, 99.99, 100.00 (4 values). 3-value set: 0.00, 0.01, 0.02, 99.98, 99.99, 100.00, 100.01 (7 values; −0.01 is infeasible and overlapping neighbours count once)."
  - **Decision table (4.2.3)**: "Try first: an account is created if the applicant is registered AND (is 18 or older OR has parental consent). Build the full table and a reduced table. Tests (T,T,F) and (F,F,F) cover how many reduced rules?" Solution: "Full table: 8 rules; allowed for (T,T,T), (T,T,F), (T,F,T). Reduced: R1 registered=F (others -) → no; R2 T,T,- → yes; R3 T,F,T → yes; R4 T,F,F → no. The tests cover R2 and R1: 2/4 = 50%."
  - **Risk-based prioritization (5.1.5)**: "Try first: T1 Low risk; T2 High, needs T3 first; T3 Medium; T4 High. Order by risk and respect dependencies." Solution: "T4 (High, eligible); T3 (needed by T2, and Medium beats Low); T2; T1. Order: T4, T3, T2, T1."
  - **Extrapolation (5.1.4)**: "Last three iterations needed 18, 22 and 20 test hours for similar scope. Using the mean as the model, estimate the next iteration." Solution: "(18+22+20)/3 = 20 hours. State the model and assumptions."

## Minor

### m1. FL-4.2.1 prompt asks for gap-leaving tests the learner cannot predict
- Quoted: "Derive the partitions and two accepted test inputs that still leave coverage gaps."
- Problem: many answers are valid, but the solution uses one specific pair, and asking someone to design deliberately incomplete tests is an odd task. The solution also combines two invalid values in (0, other). It names the oracle issue but does not say to avoid it, and isolating invalid partitions is the better habit.
- Rewrite: "Try first: derive all partitions. Then calculate Each Choice coverage for tests (5, standard) and (12, express), and add the fewest tests to reach 100% while keeping only one invalid value per test." Solution: "...3/6 = 50%. Add (0, standard), (21, express) and (5, other): 3 tests, each with one invalid value, giving 6/6."

### m2. FL-5.1.5 stray sentence and undefined "eligible"
- Quoted: "A high-risk test cannot run before its prerequisite when the dependency is mandatory."
- Problem: the table has no risk data, so this sentence is a distraction here. "Eligible" is not defined.
- Rewrite: "Try first: a test is eligible only after its prerequisite has run..." Move the risk sentence to the risk-based exercise in M6.

### m3. FL-4.3.2 asserts graph facts that were never modelled
- Quoted: "With all model edges traversed this also gives full branch and statement coverage."
- Problem: no statements or edges were defined, so the learner cannot check this claim.
- Rewrite: "Each decision outcome leads to its own statement block, so these two tests also execute every statement."

### m4. FL-5.1.4 prompt does not name the three-point formula
- Quoted: "three-point estimates a=3, m=6, b=15 person-days. Calculate both".
- Problem: candidates who learned the triangular mean (a+m+b)/3 = 8 will get a different answer. The formula appears in the concept rule above, but the prompt should stand on its own.
- Rewrite: "...Calculate E = (a + 4m + b)/6 and SD = (b − a)/6."

### m5. Dense paragraphs for non-native readers
- Locations and quotes:
  - FL-4.2.3, last text, which has six rules in one paragraph ("T/F mean satisfied/not satisfied; - means irrelevant... N/A denotes an infeasible condition... X marks... Exclude infeasible rule columns...").
  - FL-4.2.2 step 3, "union the identified boundary values".
  - exam-readiness note: "A newer publication date on the cross-scheme structure tables does not rename the CTFL qualification."
- Rewrite: split the 4.2.3 legend into a 4-row table (Symbol | Meaning) with a separate coverage sentence. Replace "union" with "combine ... and remove duplicates". Replace the readiness sentence with "The structure tables were updated in 2026, but the exam is still CTFL v4.0."

### m6. Timing advice maps to task labels, not to K levels
- Quoted: "budget roughly one minute for recall/short interpretation items and around three minutes for application items".
- Problem: candidates think in K levels, and the arithmetic reassurance is missing.
- Rewrite: "About 1 minute per K1/K2 item and 3 minutes per K3 item: 32 + 24 = 56 minutes, which leaves about 4 minutes to check selection counts and flagged items."

### m7. Study-method evidence framing is sound but incomplete
- Quoted: link label "Dunlosky et al. (2013): practice testing and distributed practice"; steps on interleaving and pretesting.
- Assessment: the advice is well hedged ("not a validated optimal schedule", "not a promise of preparation in 21 days", "no pass guarantee"). Retrieval and spacing match Dunlosky's high-utility ratings. Two gaps:
  - Dunlosky rates interleaving only moderate and does not cover worked-example fading, yet both are used without a source.
  - Step 1 ("explain the topic from memory" before first reading) is unrealistic for a beginner.
- Rewrite step 1: "Before reading, write down what you already know or guess about the topic, then attempt its two-question quiz. Wrong pre-guesses are expected and help later learning."
- Optionally add a source for fading (Renkl and Atkinson, 2003) and an expertise-reversal note: "If you already use a technique at work, skip to the Try first exercise."

### m8. Official samples: advice covers only the last one
- Quoted: "Keep an official sample paper unseen for a final external check."
- Problem: four official sample sets (A–D) exist, but the plan never says when to use the other three.
- Rewrite: "Use samples A–C as timed checks between mocks; keep sample D unseen for the final check."

### m9. Chapter orientation text is generic
- Quoted: "The complete chapter quiz mixes N original questions."
- Problem: the text is the same for every chapter and gives no chapter-specific priorities. "Mixes" is unclear.
- Rewrite: "The chapter quiz contains N original questions across all LOs of this chapter." Add, where applicable, "K3 objectives here: FL-4.2.1–4.2.4 and FL-4.5.3. Practise them on paper until you can solve unseen examples."

### m10. FL-5.5.1 solution lists fields the reporter does not normally set
- Quoted: "Include reporter/date, unique defect ID and initial workflow status."
- Problem: the tracking tool usually assigns the ID. Presenting it as something to write invites confusion.
- Rewrite: "The tool normally records the ID, reporter, date and initial status; check they are present."

## Items checked with no issue
- Exam essentials table (40 questions, 26 points / 65%, 60/75 min hedged as "confirm with provider", 8/24/8 K-level allocation, chapter allocation, no partial credit, introduction and appendices excluded): consistent with CTFL structure tables and properly hedged. Booking checklist: provider-specific facts are correctly marked as provider-dependent.
- FL-4.2.4 valid and invalid transition exercises: self-contained, prompt and solution in separate elements, and they correctly separate a modelled self-loop from an invalid transition.
- FL-4.5.3: self-contained, the clarification question is well chosen, and the answer does not invent scope.
- FL-2.2.2 / FL-5.1.4 tables: clear. (The accuracy reviewer should confirm the 2.2.2 characteristic names against v4.0.1.)

---

## Correction recheck (2026-10-28)

Files re-read: scripts/istqb/worked-models.mjs, scripts/istqb/exam-readiness.mjs, scripts/build-istqb.mjs (studyMethod, orientation, exampleAfterPractice), the exercise renderers in core/js/engine.js:521-526 and scripts/static-pages.mjs:11, and the rendered data/istqb-ctfl/chapter-4.json. `node scripts/build-istqb.mjs --check` passes, so the generated JSON is current. No files were edited.

### Status of the original findings

| # | Status | Evidence |
|---|---|---|
| M1 Prompt/solution separation | Resolved | Every try-first is now `{type:'exercise'}`. The app renders the prompt, then a collapsed `<details>` "Show solution". The static page does the same (see N1). |
| M2 FL-4.3.1 coverage items undefined | Resolved | The model lists 4 statements (D included) and 4 branches. Solution: 4/4 = 100% statements; branches S1→D, D→S2, S2→S3 = 3/4 = 75%; D→S3 is missing. Verified. |
| M3 Worked example leaks the insight | Resolved | For FL-4.3.1 and FL-4.3.2 the curriculum example now follows the exercise as "Recap example". The rendered order in chapter-4.json confirms this. No other exercise is preceded by an example that answers it. |
| M4 FL-5.5.1 hidden criterion | Resolved | AC-3 and ownership are now in the prompt. Expected 8 + 2 = 10; actual 12. |
| M5 Study step 2 mismatch | Resolved | The step now says to read the rule and example, attempt each Try first exercise on paper, and use distractor analysis in quizzes. |
| M6 K3 gaps | Resolved | New exercises: BVA price field, decision table, state coverage percentages, risk-based prioritization and extrapolation. All keys verified below. |
| m1 FL-4.2.1 task and invalid combination | Resolved | Adds (0,standard), (21,express), (5,other), one invalid value each. 3/6 = 50% becomes 6/6. |
| m2 FL-5.1.5 "eligible" and stray risk sentence | Resolved | "Eligible" is defined. The risk sentence moved to the risk exercise. |
| m3 FL-4.3.2 unmodelled graph | Resolved | All 8 branches are listed. (1,1) and (−1,−1) give 4 + 4 = 8/8. The A-then-D and B-then-C routes are never executed. Verified. |
| m4 Three-point formula unnamed | Resolved | E = (a+4m+b)/6 and SD = (b−a)/6 are now in the prompt. |
| m5 Dense wording | Resolved | Symbol legend is now a table. "Union" is replaced by "combine ... remove duplicates". The structure-tables sentence is rewritten in plain words. |
| m6 Timing by K level | Resolved | "32 + 24 = 56 minutes", about 4 minutes spare. Verified. One duplicated sentence remains (N3). |
| m7 Evidence framing | Partially resolved | Step 1 is rewritten for beginners. The expertise-reversal shortcut and the interleaving evidence hedge are added. There is still no cited source for worked-example fading; acceptable but optional. |
| m8 Sample use | Resolved | A–C are used as timed checks between mocks; D is kept unseen (study method, phase table and booking checklist). |
| m9 Generic orientation | Resolved | "The chapter quiz contains N original questions across all objectives". A K3 note lists the chapter's K3 LOs (chapters 4 and 5 only). |
| m10 Defect ID fields | Resolved | "The tracking tool normally records the ID, reporter, date and initial status: check they are present." |

Totals: 15 resolved, 1 partially resolved (m7), 0 not resolved.

### Arithmetic of new and changed exercises (all correct)
- BVA price field: partitions {0.00}, 0.01–99.99, ≥100.00. 2-value set {0.00, 0.01, 99.99, 100.00} = 4 values. 3-value set {0.00, 0.01, 0.02, 99.98, 99.99, 100.00, 100.01} = 7 values (−0.01 infeasible).
- Decision table: full table 2³ = 8 rules. Accounts are created for (T,T,T), (T,T,F) and (T,F,T). The reduced table has 4 rules. Tests (T,T,F) → R2 and (F,F,F) → R1, giving 2/4 = 50%. Adding (T,F,T) and (T,F,F) gives 4/4.
- State coverage, badge(valid) then timeout: states 2/2 = 100%; valid transitions 2/3 ≈ 67%; all transitions 2/6 ≈ 33%.
- Three-point: 7 ± 2 person-days, range 5 to 9. Extrapolation: 60/3 = 20 hours.
- Risk order: T4 (High, eligible), then T3 (prerequisite of T2; Medium beats Low), then T2, then T1.
- Unchanged keys rechecked: the FL-4.2.2 table rows, additional coverage T1, T3, T4, T2, and 1,135 min = 18 h 55 min.

### New issues

**N1 (minor). The static page drops the exercise title and "Try first" label.**
- Location: scripts/static-pages.mjs:11, `case 'exercise'`.
- Problem: it renders `<p>prompt</p><details>...`, so the prompt looks like an ordinary paragraph and is not marked as a task. The app view (engine.js) shows both the label and the title.
- Fix: `'<div class="exercise"><p><strong>Try first'+(e.title?': '+esc(e.title):'')+'</strong></p><p>'+esc(e.prompt)+'</p><details><summary>Show solution</summary><p>'+esc(e.solution)+'</p></details></div>'`.

**N2 (minor). The decision-table answer depends on how the learner numbers rules.**
- Location: worked-models.mjs, FL-4.2.3 exercise.
- Quoted: "Which reduced rules do tests (T,T,F) and (F,F,F) cover".
- Problem: learners build their own reduced table, so their R1/R2 numbering may differ from the solution's.
- Fix: in the solution, name the rules by content ("the registered=F rule and the registered=T, adult=T rule"), or ask only for the coverage percentage.

**N3 (minor). The timing text repeats itself.**
- Location: exam-readiness.mjs, timed rehearsal text.
- Quoted: "leaving about four minutes to check flagged items and selection counts" ... "Reserve time to check unanswered items and selection counts."
- Fix: delete the second sentence, or merge it into the first as "...to check flagged or unanswered items and selection counts."

**N4 (minor). New official-rule claims need source verification (accuracy reviewer).**
- Location: exam-readiness.mjs Scope row and the build-istqb.mjs studyMethod note.
- Quoted: "keyword answers are judged against the ISTQB Glossary definitions (rules 4.1.3, 2.1.4)" and "The syllabus requires accredited courses to provide at least 1,135 teaching minutes".
- Problem: both cite specific rule clauses or a requirement. I could not open the PDFs from here. If either clause number or the "at least / requires" wording is wrong, this becomes an invented rule.
- Fix: confirm the exact clause numbers and wording in rules v1.2 and syllabus v4.0.1. Otherwise soften to "the syllabus allocates 1,135 teaching minutes to accredited training".

**N5 (minor, carried over). FL-4.2.2 table row 1 repeats the worked example.**
- Location: worked-models.mjs, FL-4.2.2 table row 1.
- Problem: the non-negative-domain row restates the second half of the curriculum worked example ("If the feasible domain instead starts at zero..."). The new price exercise adds what was missing, so this is only redundancy.
