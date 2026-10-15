# Quiz bias release verification — 2026-10-15

Release baseline: `e1a36781390eaccf1458d26d55b7a42884f5c979` (previous production main). This report supersedes the unresolved-question lists in the two earlier investigation reports. Publication is verified separately through GitHub Actions and the production assets.

## Release scope

All 210 module quizzes, 32 mock banks and 41 topic interactives were checked. The 266 decision banks contain 2,925 questions. Position-skew flags fell from 200 to zero, with regression gates for both normal question banks and embedded topic quizzes. CSA modules 1/2 and Smart Review share the corrected data. Topic choices are now A/B/C/D = 20/20/21/20 instead of 81/0/0/0. The reports retain remaining length/wording heuristics as review leads, not verified factual defects.

## Previously unresolved questions: resolved against primary sources

| Question | Correction | Primary evidence |
|---|---|---|
| PSA Mock Exam 3 Q20 | Narrowed the question to source selection; first-true and final Otherwise remain the two answers. Removed the contradictory letter-based rationale. Refresh timing is a separate concern. | [Pega Academy: Data sources](https://academy.pega.com/topic/data-sources/v1), [Refresh strategies](https://academy.pega.com/topic/refresh-strategies-data-pages/v4/in/67491/67581) |
| TESTIM Mock Exam 2 Q30 / Mock Exam 6 Q55 | Replaced the erroneous external-integration requirement with the documented Users membership screen and built-in Insights team-activity reports. Correct answer identities updated accordingly. | [Project users management](https://docs.tricentis.com/testim/content/administration/project-user-management.htm), [Insights](https://docs.tricentis.com/testim/content/testops/insights/index.htm), [TestOps Dashboard](https://docs.tricentis.com/testim/content/testops/insights/dashboard.htm) |
| TESTIM Mock Exam 3 Q10 / Mock Exam 6 Q38 | Explicitly asks for TWO offered values outside the documented four management statuses. Existing two-answer key retained. | [Test Status](https://docs.tricentis.com/testim/content/testops/testops-management/test-status.htm) |
| TAPI Mock Exam 6 Q1 | Scoped the POST statement to the SOAP request-response HTTP binding; explanation acknowledges SOAP 1.2 response-only GET usage. Existing keyed position retained. | [W3C SOAP 1.2 Primer, section 4.1](https://www.w3.org/TR/soap12-part0/#L10309) |

These are original practice questions, not a claim about a vendor's official exam key. Question numbers denote the original bank order, which is preserved.

## User data and recovery

Pure ordering changes migrate old numeric mock selections through `previousOrder`; practice selections continue using stable option IDs. Thirty-three practice wording edits retain exact prior signatures. SRS IDs, bookmarks, module progress and historical snapshots remain unchanged.

The six source corrections affect **five mock banks** and require a different treatment: an old checked answer must not silently acquire a new technical meaning or correctness. Rows carry `answerReviewVersion: 1` and a verbatim `previousQuestion` snapshot from the production baseline. Pre-release active attempts in those five banks are archived intact to the existing recovery/backup mechanism; a content-change notice remains visible on the exam list before the user explicitly starts a fresh attempt. New-version attempts resume normally. If archiving fails, the saved attempt is neither cleared nor replaced. Completed historical snapshots and scores are not rewritten.

The final review also removed unnecessary migration work from exam-card listing and added an integration regression for archive failure, unchanged recovery contents, the visible-notice transition and explicit fresh start. The existing worker cache moves from v224 to v225 to deliver updated code and data through the app's update flow.

## Validation

Final local result: **316 tests passed, zero failures; zero skewed banks in both audits; all generated assets current; whitespace checks clean.**

- Full `npm run check`: syntax, content/schema validation, both bias gates, generated asset freshness and all regression tests.
- Every option of all 81 topic decisions graded in the renderer harness (324 selections); feedback follows its option, score updates immediately and restart retains order.
- Signed/unsigned legacy numeric selection migration, exact practice wording signatures, import validation and historical snapshot compatibility.
- Source-correction tests explicitly reject silent regrading and require recoverable original question snapshots.
- Local browser: a real old unsigned mock backup imported via Settings, detected as in-progress, then preserved through the recovery path; current mock questions load. Earlier manual checks cover practice single/multi-select, Smart Review/SRS, bookmarks, explanations, topic final results and restart.
- `git diff --check`; remote main compared with the release baseline before publishing. GitHub Quality must pass on the feature branch before main is updated; GitHub Pages success and production data are checked afterward.

Reproduce historical audit reports with `--revision e1a36781390eaccf1458d26d55b7a42884f5c979`, rather than `--revision HEAD` after this change is committed.
