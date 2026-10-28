# Independent review: CTFL mock result analysis and keyword "Try first" checks

Scope: uncommitted changes in `core/js/learning-history.js`, `core/js/mock-view.js`, `scripts/istqb/keyword-checks.mjs` (as built into `data/istqb-ctfl/chapter-*.json`). No files edited.

## What was verified

| Check | Result |
|---|---|
| 240 CTFL mock items resolve to a ready module through `sameModule` | 240/240 |
| Lesson section `fl-x-y-z` exists in that module's `studyGuide` | 240/240 (0 broken links) |
| LO prefix and `chapter` match the resolved module | 0 mismatches |
| Other tracks (PSA, PBA, TAS1/2, TAPI, TDS1/2, AE1, TMOB, TESTIM, PSSA): module match old (`===`) vs new (`sameModule`) | 0 differences. Only CTFL module names are numbered. |
| Other tracks with `learningObjectiveId` or `kLevel` on mock items | none, so `objectiveHTML` returns `''` and the K-level block is skipped |
| Simulation mode hides rationale and objective before submit | Yes: `objectiveHTML` is inside the `examMode==='simulation'?'':...` branch (mock-view.js:337). Practice mode: `.rat` is `display:none` until `.reviewed` (views.css:328-329), same as before. |
| Escaping | `title`, `href`, `learningObjectiveId`, `kLevel`, K-level key are all `esc()`'d; the href path parts are also `encodeURIComponent`'d. learning-history `esc` does not escape `'` but all attributes use `"`. Test covers `FL-<x>`. No XSS found. |
| Deep link handling | engine.js:449-453 focuses `[data-section-id]` and shows a "no longer available" notice on a miss, so stale links fail safely. |
| K-level labels | K1 remember, K2 understand, K3 apply match the CTFL v4.0 K-level definitions. |
| `node --test` | 382/384 pass. 2 failures are review-receipt hash checks (see m6), not logic failures. |
| Keyword checks | 21 total (4/4/3/4/5/1 for ch1-6), each rendered as a `Try first` card with a collapsed solution. |

---

## Part 1: Mock exam result analysis

### Major

**M1. "What to study next" top-5 is effectively arbitrary for CTFL**
- Location: `core/js/learning-history.js` `revisionPlan` (key `objective:`+LO, `.sort(count desc).slice(0,5)`).
- Problem: every CTFL form uses 40 distinct LOs (checked all 6 forms: max 1 item per LO). So every objective group has `count: 1`. The sort is all ties, and the stable sort keeps question order. The candidate gets the first 5 missed items in the stored (shuffled) order, each labelled "1 incorrect answer(s)". It looks like a prioritised list but is not. Grouping by objective also drops the chapter-level signal the old module grouping would have given.
- Evidence: Mock Exam 1, all 11 chapter-4 items wrong plus 3 others. Output: FL-4.2.3 (C4), FL-6.2.1 (C6), FL-4.5.2, FL-4.5.3, FL-4.3.2, each count 1. The list does not say that chapter 4 was 11/11 wrong, puts a single C6 miss second, and hides 9 of the 14 missed objectives.
- Fix: rank by chapter, then list objectives. Group misses by module, sort modules by misses (tie-break on misses/total or exam weight), and show every missed LO under its chapter (collapsible, e.g. "Chapter 4 · 11 of 11 incorrect: FL-4.2.3, FL-4.5.2 ..."). If a flat list stays, tie-break by K-level (K3 first, since those carry the most practice value), then by chapter order. Always show "+N more missed objectives, see answer review" so it never looks complete. Drop the per-item "1 incorrect answer(s)" text when every count is 1.

### Minor

**m1. Objectives appear as bare IDs**
- Location: `revisionPlan` title (`FL-4.2.3 · 4. Test Analysis and Design`) and `objectiveHTML` (`Objective FL-4.2.3 · K3 · Open lesson section`).
- Problem: candidates do not know LO numbers. "FL-4.5.2" tells them nothing until they click. The LO titles already exist (`learningObjectives` / `quizTopics` in the chapter JSON) but the results page does not load them.
- Fix: in `build-istqb.mjs`, add `learningObjectiveTitle` (and, as in `practiceQuiz`, `lessonSection`) to each mock item. Render "FL-4.2.3 Decision table testing (K3)".

**m2. K-level bars borrow the exam pass colours for small, confounded samples**
- Location: `mock-view.js` cognitive-level block (`col = p >= PASS*100 ? ok : p>=50 ? warn : bad`).
- Problem: each form has 8 K1, 24 K2 and 8 K3 items. All K3 items are in chapters 4 and 5 (Mock 1: K3 = 5 in ch4 + 3 in ch5). At n=8 one question moves the bar 12.5 points, and 5/8 (63%) shows amber/"below pass", which implies a per-level pass rule that does not exist. A low K3 score is mostly a chapter 4/5 technique signal, not a general "apply" weakness.
- Fix: use a neutral colour or no threshold colour for K-level bars. Add a one-line note: "Small sample per level; K3 items come from chapters 4-5 (techniques, estimation, risk/prioritisation). Use the answer review for specifics." Optionally show K3 per chapter.

**m3. Domain breakdown order follows shuffled question order** (pre-existing, more visible now)
- Location: `doSubmit` domain loop, `Object.keys(dom)` insertion order.
- Problem: CTFL chapters appear in random order (Mock 1 starts with a ch4 item), with unnumbered names, above an ordered K1/K2/K3 block.
- Fix: when items carry `chapter`, sort domains by `chapter` and prefix the number. Other tracks keep current behaviour.

**m4. `objectiveHref` assumes a section-id convention for any track that tags `learningObjectiveId`**
- Location: `objectiveHref` / `objectiveHTML` / `revisionPlan`.
- Problem: today only CTFL tags LOs, so nothing breaks. If another bank later adds `learningObjectiveId` without matching `fl-…` style section ids, every link would land on the "section no longer available" notice. That fails safely but looks unpolished.
- Fix: prefer an explicit `q.lessonSection` (already emitted for CTFL `practiceQuiz`; add it to mock items), and fall back to the module guide link when it is missing.

**m5. "Open lesson section" during a Learning-mode attempt leaves the exam without warning**
- Location: `objectiveHTML` link, shown after "Check Answer" in practice mode.
- Problem: state is saved on unmount (`unmount` → `saveState`), so nothing is lost. But the candidate leaves the exam with no cue that they can come back.
- Fix: in practice mode only, add "(your attempt is saved)" to the link text, or offer the link only in post-submit review.

**m6. Review receipts are stale**
- Location: `tests/istqb-content.test.mjs`, two receipt tests fail. `data/istqb-ctfl/chapter-1.json changed after recorded review` and `scripts/build-istqb.mjs changed after the study additions review`.
- Problem: the 21 keyword checks and the build changes are not yet covered by the recorded review hashes.
- Fix: after this review cycle's findings are resolved, regenerate `docs/reports/istqb-assessment-status.json` (sourceSha256) and the baseline. Do not just re-hash before the fixes land.

### Positive notes
- The `sameModule` numbering strip is narrow (`^\d+\.\s+` on the module name only). It changes no other track's matching.
- The new test in `tests/saved-reading-and-revision.test.cjs` iterates all 240 items and asserts section existence. That is a good regression guard. Consider also asserting tie-break behaviour once M1 is fixed.

---

## Part 2: Keyword "Try first" checks (`scripts/istqb/keyword-checks.mjs`)

### Major

**K1. The answers sit directly above every exercise**
- Location: `build-istqb.mjs:56`, keyword section order is `note, table(keywords), ...keywordChecks, links`.
- Problem: each "Try first" card appears directly under the table that defines every term it tests. Ch5 is an example: the table defines entry criteria, exit criteria, product risk, project risk, risk analysis, risk control, test monitoring, test control and both report types, and those are exactly the answers to its 5 checks. The candidate does not have to retrieve anything, so the "Try first" label is misleading. These checks also come before the LO teaching sections, so items like quadrant numbering (Q1-Q4) and inspection roles have not been taught yet when the candidate meets them.
- Fix (pick one and label it to match):
  (a) Retrieval: move the checks into a separate section at the end of the chapter, "Keyword self-check (close the table)". Or
  (b) Pretest: put the checks before the table and say "Guess first; answers are in the table below and the lessons."
  Option (a) fits the stated "retrieve before rereading" method better.

**K2. Maintenance triggers item (4): the prompt and the solution describe different things**
- Location: ch2, "Maintenance testing triggers".
- Problem: the prompt says "writing the first version of a new feature before release". The solution says "(4) is development of a new product". A new feature added to an operational system is a planned enhancement, which the syllabus treats as a modification and so a maintenance trigger. A careful candidate who answers "(1)-(4)" is marked wrong.
- Fix: rephrase (4) as "testing the first release of a new system that has never been in production". The solution then matches.

**K3. Error/defect/failure: "the ambiguous requirement" has two defensible answers**
- Location: ch1, "Error, defect, failure and root cause".
- Problem: the analyst writing an ambiguous requirement is itself an error, and the ambiguous requirement is a defect in a work product (the syllabus says defects occur in documentation such as requirements). The solution accepts only "root cause". Candidates who answer "defect in the requirement" get no guidance.
- Fix: either reword the prompt to point at the cause ("Time pressure meant the analyst had no review of the requirement. Classify the time pressure.") or extend the solution: "The ambiguous requirement is also a defect in the specification. In this chain it acts as the root cause of the coding error."

**K4. "Parts of risk management" does not say which categories to use**
- Location: ch5.
- Problem: "Place each activity" gives no target categories. The solution expects a two-level answer (risk analysis → identification/assessment; risk control → mitigation/monitoring). Candidates cannot check their own answer against it.
- Fix: "Place each activity under risk analysis (identification or assessment) or risk control (mitigation or monitoring)."

### Minor

**k1. Confirmation vs regression: "tests that were not changed" is ambiguous.** It reads as if the *tests* were unchanged. Fix: "Test B reruns tests of checkout and invoicing, which the fix did not touch."

**k2. Error/defect item: "the code" is vague.** Fix: "the wrong condition in the code".

**k3. Some prompts give away the answer.**
- Entry/exit: "Definition of Ready" alone signals entry. Consider "the test environment is available and test data is loaded".
- Anomaly vs defect: the prompt already breaks the anomalies down (9 defects, 2 misunderstandings, 1 change request), which is the whole answer. Better to ask "Before analysis, can the reviewers call all 12 items defects? Why not?"
- Review type (3): "defined roles, collected metrics, author may not lead or act as scribe" is close to a definition of inspection. Acceptable for K2, but drop one cue.

**k4. Missing task verbs.** "Which experience-based technique?" lists (1)-(3) with no instruction. Add "Name the technique for each." The entry/exit prompt opens with two quoted fragments and no verb; start with "Classify these two criteria:".

**k5. Terms that are not native-speaker friendly or not defined in the section.** "User-story examples" (quadrants item) is vague; use "acceptance tests derived from user-story examples". The quadrant labels Q1-Q4 are expected but never defined in the keyword table. "Fault attack" appears in a solution with no gloss. Symbols "≤", "≈" and curly quotes are fine but should be checked with screen readers.

**k6. Terminology drift.** The ch4 classify item says "statement testing / branch testing" while the keyword table uses "statement coverage / branch coverage". Use the same term in both, or mention both once.

**k7. Uneven coverage of confusable keywords.** Ch3 has no check for formal vs informal review or static analysis. Ch1 has nothing on test basis vs test object or testware. Ch6 has 1 item, which is justified since it has 1 keyword. Optional additions, low priority.

### Positive notes
- All 21 prompts are self-contained scenarios. None needs an external artifact.
- Solutions are short, give a reason, and often add a contrasting point (e.g. "testing does not fix").
- The `pa-exercise` rendering escapes `title`, `prompt` and `solution`, and solutions stay collapsed in `<details>`.

---

## Correction recheck (2026-10-28)

Read-only recheck of the updated `core/js/learning-history.js`, `core/js/mock-view.js`, `scripts/istqb/keyword-checks.mjs`, `scripts/build-istqb.mjs` and the rebuilt `data/istqb-ctfl/chapter-*.json` and `learn/ctfl/*/index.html`.

`node --test`: 384 tests, 382 pass. The 2 failures are the expected review-receipt hash checks.

Re-simulation: Mock Exam 1 with all chapter-4 items wrong plus two others. The plan now shows "4. Test Analysis and Design · 11 incorrect" with all 11 missed LOs linked, then "6. Test Tools · 1" with FL-6.2.1. All links resolve. PSA (no LO tags) still returns 3 topics with no `objectives` field, so other tracks are unchanged. The simulation-mode guard on the rationale and objective line is unchanged.

### Finding status

| ID | Status | Note |
|---|---|---|
| M1 top-5 arbitrary | Resolved | Misses grouped by module and sorted by count. Every missed LO is listed. No cut for LO-tagged banks; other tracks keep top 3. |
| m1 bare LO IDs | Deferred-accepted | Keeps the reviewed bank fingerprint. The objective links still show IDs only. |
| m2 K-level colours | Resolved (see N1, N2) | Neutral `--pa-brand` colour (token exists in both themes) plus a sample note. |
| m3 domain order | Resolved | Sorted by `chapter`. Banks without `chapter` sort as 0 and keep insertion order (stable sort). The domain label still has no chapter number, which is cosmetic. |
| m4 explicit lessonSection | Deferred-accepted | Falls back safely through the engine's "section no longer available" notice. |
| m5 resume cue | Deferred-accepted | State is saved on unmount and the resume prompt exists. |
| m6 stale receipts | Open by design | Regenerate after this cycle. |
| K1 answers above exercises | Resolved | `chapter-keywords` now has 0 exercises. `keyword-self-check` is the last section in every chapter and opens with "Attempt these after studying the chapter, without looking at the keyword table". The static `learn/ctfl` pages are rebuilt. |
| K2 maintenance item (4) | Resolved | "first release of a new system that is not yet in operation". Prompt and solution now agree. |
| K3 ambiguous requirement | Resolved | The prompt asks for "the two roles". The solution gives both defect and root cause. |
| K4 risk categories | Resolved | The prompt names the analysis and control sub-categories. |
| k1 "tests that were not changed" | Resolved | "whose code was not changed". |
| k2 "the code" | Not resolved (minor) | Still "Classify the misreading, the code and the refusal". Suggest "the condition in the code". |
| k3 answer cues | Partly resolved | Review type (3) wording is fine. The entry/exit prompt still says "Definition of Ready", which gives the answer away. The anomaly prompt still contains its own explanation. Both are low impact. |
| k4 missing task verbs | Not resolved (minor) | "Which experience-based technique?" (1)-(3) and the entry/exit prompt still have no instruction verb. |
| k5 vague terms | Mostly resolved | "Tests derived from user-story examples" and the removed "fault attack" are fixed. Q1-Q4 labels are still not defined in the prompt. This is acceptable now that the check comes after the chapter teaching. |
| k6 statement/branch naming drift | Not resolved (minor) | The classify item still says "statement testing / branch testing" and the table says "... coverage". |
| k7 coverage gaps | Mostly resolved | New: "Test object, test basis and testware" (ch1) and "Static analysis versus review" (ch3). Formal vs informal review is still not exercised. |

### New issues from the corrections

- **N1 (minor), K-level descriptors removed.** Bars now read just "K1 / K2 / K3". The old "· remember / · understand / · apply" text was dropped, and candidates who do not know the K-level scale lose that meaning. Fix: pass labels such as `'K1 · remember'` to `bars()` for the K-level group.
- **N2 (minor), the sample note is wrong for K2.** "About 8 items per level: indicative only" is hard-coded. CTFL forms have 8 K1, 24 K2 and 8 K3, and other or future banks will differ. Fix: compute the note from `lv`, e.g. "K1 and K3 have 8 items each; treat as indicative", or show "n=" on each bar.
- **N3 (minor), missed LOs are listed in question order.** Within a chapter the order is shuffled (e.g. FL-4.2.3, FL-4.5.2, FL-4.5.3, FL-4.3.2 ...). Sorting by LO id would make related objectives (4.2.x techniques) appear together. Fix: sort `topic.objectives` by id. Ties between modules with equal counts also fall back to question order; chapter order would be a better tie-break.

No regressions found for other tracks, escaping (`esc(o.id)` and `esc(o.href)`), or simulation-mode hiding.
