# Testim course-bank follow-up — 2026-10-16

## Result

Mock Exam 6 was treated as the user-confirmed Academy grading source. Its entire 55-row bank, including rationales and recovery metadata, remains unchanged from commit 87016e1. Only the graded stems, alternatives and accepted answers were used as answer-key evidence; an editorial explanation does not establish a different Academy key.

The 32 previously listed items contain no additional exact or punctuation-normalized course-question match. Semantic review found **22 wording/scope refinements** retaining the selected answer’s main intent and **10 substantive changes** needing priority Academy evidence. The 22 are not newly certified Academy answers. Related concepts were recorded without treating them as identical questions. All 32 questions remain byte-for-byte equivalent as parsed question records to 87016e1; no key was guessed.

Review also expanded to every course-bank/module link and found two additional conflicts outside that 32-row delta list:

| Location | Before | Course-aligned correction |
|---|---|---|
| TESTIM-M06 Q5; Mock Exam 2, question 11 | Reframed as TWO benefits; CI execution excluded | Original course question; THREE accepted benefits: organizing collections, running in sequence, executing from CI tools (source Mock Exam 6 question 42) |
| TESTIM-M22 Q1; Mock Exam 4, question 24 | Reframed to an unconfigured YAML snippet; False | Original Azure DevOps statement; True (source Mock Exam 6 question 49) |

These module baseline keys already disagreed with the course bank before ff98c77, so the old search for changes since that module baseline did not flag them. The earlier 14 restored questions become **16**, and updated generated mock copies become **16**.

## Compatibility and safeguards

Question IDs and stable option IDs remain intact. Test Suites now requests three selections. Feedback explains course grading separately from documentation/configuration caveats. Answer positions were rebalanced only for the two corrected Azure rows; Mock Exam 6 was not reordered or rewritten.

Changed question signatures use the existing preservation/recovery path: incompatible graded practice answers are not silently regraded; original state is archived. All 16 restored practice questions carry courseKeyReviewVersion=1 so unsigned legacy answers also stay out of the active grading state. Their original records remain recoverable, and import validation reports these entries for review. Current signed answers still restore normally. Incompatible in-progress mocks use the existing restart notice and backup recovery. Historical snapshots and SRS identities remain intact.

A new reusable check, scripts/audit-testim-course-keys.mjs, runs inside npm run check. It follows 49 course-linked module questions, 49 distinct generated mock copies (51 cross-links because two source mappings overlap), and all 55 curated questions. This catches answer text changed under the same option ID, generated-copy drift, and source-bank changes. The full-bank hash and original course fixtures also remain pinned.

## All 32 assessments

Course question numbers below are one-based. A related question is a candidate supporting context, not a verified answer key for the different question. Full old/new questions and keys remain in testim-key-review.json.

| Question | Classification | Related Mock Exam 6 questions | Finding |
|---|---|---|---|
| TESTIM-M00 / Q2 | Wording/scope; no key reversal established | Q40, Q41 | Weighted locator identification remains the selected concept. Attribute changes and locator improvement are related course topics, not the same Knowledge Check. |
| TESTIM-M03 / Q4 | Wording/scope; no key reversal established | Q25 | Condition-based waiting remains selected; the course question concerns retargeting a wait, not timeout versus fixed-delay synchronization. |
| TESTIM-M07 / Q5 | Substantive; Academy evidence needed | None | The assertion strategy and signup scenario were reframed. Mock Exam 6 has no graded question establishing whether every intermediate input must be validated. |
| TESTIM-M08 / Q1 | Wording/scope; no key reversal established | None | Row-to-data-set mapping remains selected; the added header qualification does not select a different mapping. No matching upload question is in the course bank. |
| TESTIM-M08 / Q4 | Wording/scope; no key reversal established | Q24 | Execution-wide params versus per-test configuration scope remains selected. The course covers parameter precedence, not the two file formats or their scopes. |
| TESTIM-M08 / Q5 | Wording/scope; no key reversal established | Q30 | Config-linked CSV/database input remains selected. The course configuration question instead asks about keeping sensitive data out of tests. |
| TESTIM-M09 / Q1 | Wording/scope; no key reversal established | None | Repeating actions for similar elements remains selected. The course bank contains no For each item loop question. |
| TESTIM-M09 / Q4 | Wording/scope; no key reversal established | None | The default remains Don’t repeat; a gate/failure qualification does not choose another repeat mode. No matching course question is available. |
| TESTIM-M09 / Q6 | Wording/scope; no key reversal established | None | The selected contrast remains element visibility versus element text. No While-loop Knowledge Check is in the course bank. |
| TESTIM-M10 / Q3 | Substantive; Academy evidence needed | None | Forwarded SMS-as-email was replaced with direct CLI/Twilio SMS retrieval. These have different preconditions; the course bank covers neither workflow. |
| TESTIM-M10 / Q5 | Substantive; Academy evidence needed | None | Stable OTP extraction was replaced with reuse of email exports. These are different questions; the course bank has no SMS/email extraction key. |
| TESTIM-M11 / Q2 | Wording/scope; no key reversal established | Q52 | Direct DB access still selects CLI validation, adding driver/access prerequisites. The course CLI question establishes local/CI execution, not database-step selection. |
| TESTIM-M11 / Q3 | Substantive; Academy evidence needed | None | CLI action generation was narrowed to CLI validation with draft insertion/review. The course bank has no Copilot-step support question. |
| TESTIM-M13 / Q1 | Wording/scope; no key reversal established | Q13 | Duplication measurement remains selected; scope/frequency were qualified. Auto Complete group suggestions do not verify Auto Grouping score semantics. |
| TESTIM-M13 / Q4 | Wording/scope; no key reversal established | Q10, Q14 | Parameter generation remains selected, with a naming step added. Course parameter reuse/editability does not verify Auto Grouping parameter generation. |
| TESTIM-M14 / Q5 | Substantive; Academy evidence needed | None | A preferred API-action step was replaced with a both-types-support-parameters question. No matching API-step preference key is available. |
| TESTIM-M15 / Q3 | Wording/scope; no key reversal established | None | Per-test lifecycle setup remains the selected mechanism. There is no hooks Knowledge Check in the supplied bank. |
| TESTIM-M17 / Q1 | Substantive; Academy evidence needed | Q51 | The course accepts npm installation generally, but its True/False answer does not establish the exact global versus local install command. The explanatory rationale is not treated as screenshot-key evidence. |
| TESTIM-M18 / Q3 | Substantive; Academy evidence needed | Q52 | The selected flag changed from --test-config to --grid. A question about CLI execution locations cannot establish a grid-selection flag. |
| TESTIM-M19 / Q1 | Substantive; Academy evidence needed | None | Export locations were replaced with export-data distinctions. The course bank contains no CSV export question. |
| TESTIM-M19 / Q3 | Wording/scope; no key reversal established | None | A shareable run report remains selected; broad coverage claims were narrowed. The course bank contains no PDF export question. |
| TESTIM-M20 / Q5 | Wording/scope; no key reversal established | Q32, Q45 | Result inspection and time-filtered history remain selected. Screenshot comparison and failure tagging are related diagnosis questions, not an exact result-navigation key. |
| TESTIM-M21 / Q2 | Substantive; Academy evidence needed | Q54 | Automatic GitHub branch synchronization was narrowed to configured actions and Master/PR conditions. Protect Master is a different operation, not evidence for merge synchronization. |
| TESTIM-M23 / Q2 | Wording/scope; no key reversal established | Q44 | Breakpoints and stepping still provide investigation evidence; guaranteed diagnosis was removed. The course asks about resuming a paused run. |
| TESTIM-M26 / Q2 | Substantive; Academy evidence needed | Q44 | A named step-by-step menu workflow was replaced with debug mode and stepping controls. Resuming after a breakpoint does not verify the step-by-step menu path. |
| TESTIM-M26 / Q3 | Wording/scope; no key reversal established | Q44 | Resuming from the paused location remains selected; later breakpoints are a qualification. The course supports resume behavior but uses a different trigger/stem. |
| TESTIM-M29 / Q3 | Wording/scope; no key reversal established | None | Authorization Bearer with the PAK-prefixed key remains selected. No REST-authentication course key is in the supplied bank. |
| TESTIM-M30 / Q1 | Wording/scope; no key reversal established | Q10, Q11 | Parameterized shared login remains selected; entry-step bindings were made explicit. Course reuse principles are compatible but do not supply this exact credential-binding key. |
| TESTIM-M30 / Q2 | Wording/scope; no key reversal established | Q29 | A fresh browser context for login remains selected; a blanket guarantee was reduced. The course’s general Incognito question supports the principle, not every login precondition. |
| TESTIM-M30 / Q3 | Wording/scope; no key reversal established | Q17 | Conditional login remains selected and resulting-state assertions were added. The course’s visible-element login condition is compatible, but the exact scenario/options differ. |
| TESTIM-M31 / Q2 | Wording/scope; no key reversal established | None | Appium compatibility mode remains selected; grid/device prerequisites were qualified. No mobile recording-mode course question is present. |
| TESTIM-M31 / Q4 | Wording/scope; no key reversal established | None | Hybrid/webview recording gaps remain selected. No Appium/hybrid course question is present. |

## Validation

- `npm run manifest:content`: derived files regenerated.
- `npm run check`: **364 tests passed**, including full curated-bank hash, all course-linked module/copy keys, unsigned and signed migration, import warnings and drift detection.
- `git diff --check`: passed.
- Course audit: 49 module questions, 49 distinct generated copies, 55 curated questions; zero conflicts.
- Position audit: 242 banks / 2,844 questions, zero skewed banks; topic audit: 24 banks / 81 questions, zero skewed banks.
- Local browser in an isolated test origin: Test Suites accepted all three course answers in the module and generated mock; Azure DevOps accepted True in both. Application update preserved the current signed answer.
- An unsigned legacy backup was imported through the actual Settings workflow in the isolated test origin. The revised quiz displayed its recovery notice and restored zero old graded answers for the changed question. Original-record archival and unmatched import reporting are additionally covered by automated tests. No user production storage was touched.
- Browser warning/error logs were empty on the inspected test session.
- Initial shell: **294,812 bytes**, leaving **5,188 bytes** below the 300 KB gate. Asset token: 20261016m; worker cache: quilyn-v238.

No new commit, push, merge or deployment was performed for this follow-up. Real-device/browser/assistive-technology validation listed in the earlier report remains open.
