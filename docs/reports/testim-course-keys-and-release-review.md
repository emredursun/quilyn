# Testim course keys and UX pre-release review

Latest follow-up: [course-bank review](testim-course-bank-followup.md). The original review below describes commit 87016e1. The subsequent local follow-up restores two additional module keys and two mock copies (16 of each in total), adds a 49-link course audit, and reviews all 32 remaining differences without guessing their Academy keys.

Date: 2026-10-16. Branch: codex/ux-first-improvements. This report covers local changes only; no merge, push or deployment.

## Findings and fixes

- Confirmed course keys take precedence over product documentation for grading. Documentation remains in the lesson and explicitly labelled rationale context.
- Compared every current Testim module with ff98c77, including cumulative changes from 8b11688, cbb9c59 and the other 2026-10-06 source-review commits. Found 46 changed correct-option texts. This includes wording clarifications, not necessarily 46 changes in technical meaning or selected option ID.
- Fourteen questions could be matched directly to the screenshot-verified hand-curated Mock Exam 6. Restored their course questions/options/keys across seven modules and updated 14 matching rows in generated Mock Exams 1–5. Stable module question/option IDs remain unchanged.
- Restored Mock Exam 6 rows 37 and 54 in place; all 55 original stems, option sets and course keys are pinned. The bank was not regenerated. Row 37 restores the original question wording with the same Failed + Archived key. Row 54 restores Users + external project-management integration, replacing the live Users + Insights key.
- Two additional source discrepancies were explicit: M04 Q2 had an old module key of “Parameters always take precedence”, while the verified course bank accepts “Parameters can override test data based on usage”; M27 Q3 had an old module key of “In the test results section…”, while the verified course bank accepts “The Testim dashboard”. Both now follow the verified course bank; the old module keys were not treated as authoritative.
- The remaining 32 changed answer texts lack established course-key provenance in the available evidence. They were left unchanged and are listed below for an editorial decision; no correctness was guessed.
- Fixed the cross-track library topic filter: a topic outside the selected track switches to its sole matching track or All tracks if shared. Changing the track clears an incompatible topic. Same-track mock recommendation links retain their track.
- Fixed delayed library mounts overwriting a later screen, catalogue retry after temporary failure, and explicit mock source-module priority.
- Opening a module alone no longer marks it In progress. Saved reading, quiz attempts, practice answers and completion remain the evidence.
- Concept focus has an animation-frame path plus a guarded timer fallback. Verified the actual term receives focus in a visible browser.
- Search UI moved to the on-demand search-view module; loader retries, concurrent opens and cancellation are covered.

## Data compatibility

No localStorage keys or backup versions were changed. Legacy module bookmarks, optional section/concept bookmarks, reading positions and SRS identities are retained. Old signed practice answers with changed question/key meaning are not silently regraded: the existing quiz migration drops incompatible answers from the active attempt and archives the original saved state. Historical attempt snapshots remain unchanged.

Eight mock banks now carry reviewed content changes (PSA Mock Exam 3, TAPI Mock Exam 6, and TESTIM Mock Exams 1–6). The existing recovery path preserves old in-progress attempts in backup recovery records and requires an explicit new attempt for incompatible content. Completed history is preserved. This is an intentional consequence of restoring course answers, not an option-order-only migration.

## Validation

- npm run manifest:content regenerated content-derived assets; no generated runtime files were manually edited.
- npm run check: 358 tests passed. git diff --check passed.
- Initial shell: 294,420 bytes / 300,000; 5,580 bytes of headroom (at least 3 KB).
- Position audit: 242 banks / 2,844 questions; zero skewed banks. Topic audit: 24 banks / 81 questions; zero skewed banks. See quiz-bias-course-keys-after.md.
- New tests pin all 14 restored module keys, all 55 curated Mock Exam 6 rows, 14 generated copies and rejection of superseded practice grading. Existing course-review tests now distinguish documented behavior from course grading.
- Local browser: cross-track API foundations link switched PSA → TAPI with 26 results; changing to the shared Case Management area produced 300 results across tracks. Lazy search returned 20 results. Visible concept link focused the Low-code development term, not the heading. The course Highlight, duplicate-steps reuse and module membership responses were accepted. In the hand-curated Mock Exam 6, row 54 accepted A + D and displayed the preserved course/docs discrepancy rationale.
- Additional browser regression: single/multi-select saved grades, three saved items after app update, simulation timer/answers/flags after reload, delayed explanations, targeted mock suggestions excluding 59 blanks, Smart Review grading/reload, real UI backup export validation and a hash-verified 48-module offline package download. These use disposable local QA records.

Real iOS/Android, Firefox/Safari, VoiceOver, actual browser zoom and participant usability testing remain unverified in this environment. No zero-defect guarantee or full WCAG conformance is claimed. Thirty prior reflow/theme checks and desktop performance samples are recorded in ui-ux-improvements.md and ui-ux-qa-results.json; those samples are not production mobile measurements.

## Every changed answer text: historical → live-before-fix → final decision

Full old/new stems, answer texts and rationales are preserved in testim-key-review.json. “Unchanged; decision needed” means the live-before-fix key remains; it is not a claim that the historical key was correct.

| Module / question | ff98c77 correct text | 54202c9 correct text | Final key / decision |
|---|---|---|---|
| M00 / Q2 | To uniquely identify an element using many weighted attributes, so the test keeps finding it even after minor UI changes. | To identify a target using weighted attributes and help maintain identification as attributes change. | Unchanged; decision needed |
| M02 / Q2 | It highlights all elements on the web page that match a certain criterion, such as class name or tag, to help with test script creation. | It temporarily highlights the selected target in the AUT browser while inspecting a step. | Course: It highlights all elements on the web page that match a certain criterion, such as class name or tag, to help with test script creation. |
| M02 / Q9 | It is available for use in any other test case in the suite. | It is available for reuse by other tests in the same project. | Course: It is available for use in any other test case in the suite. |
| M02 / Q12 | By duplicating the steps each time you need them in a new test. | By creating a shared group, which can be used across multiple tests. | Course: By duplicating the steps each time you need them in a new test. |
| M03 / Q4 | Wait For pauses exactly until the condition is true, avoiding both flaky too-short waits and wasteful too-long waits. | It checks the readiness condition until detected or timeout, reducing dependence on a guessed fixed delay. | Unchanged; decision needed |
| M03 / Q8 | When verifying whether the AUT enforces age restrictions correctly. | Supplying relative birthdate inputs when checking an age restriction. | Course: When verifying whether the AUT enforces age restrictions correctly. |
| M03 / Q10 | "Recover" opens the draft with unsaved changes, whereas "Dismiss" opens the test as it was last saved. | Recover opens the last available cached draft; Dismiss opens the last explicitly saved test. | Course: "Recover" opens the draft with unsaved changes, whereas "Dismiss" opens the test as it was last saved. |
| M04 / Q2 | Parameters always take precedence over test data. | The params-file value overrides the default test data value. | Course: Parameters can override test data based on usage. |
| M05 / Q1 | The next test case would fail to run | Inspect the browser/session lifecycle and the actual failure before concluding its cause. | Course: The next test case would fail to run |
| M05 / Q3 | Tests start from a fresh state on each execution | Isolation from ordinary saved cookies and login state. | Course: Tests start from a fresh state on each execution |
| M05 / Q4 | It allows users to create and maintain tests without including any sensitive data in the test itself | It can supply run options/hooks and secret references, without automatically encrypting literal credentials. | Course: It allows users to create and maintain tests without including any sensitive data in the test itself |
| M05 / Q8 | Tests run directly from the editor | A test played locally from the editor. | Course: Tests run directly from the editor |
| M06 / Q3 | Pick a specific CI tool and execute the test plan on that tool. | Configure the CI pipeline to invoke the supported Testim CLI test-plan workflow. | Course: Pick a specific CI tool and execute the test plan on that tool. |
| M06 / Q4 | Revisions are created automatically whenever changes are made to the test | Save a changed test; the previous version is stored automatically. | Course: Revisions are created automatically whenever changes are made to the test |
| M07 / Q5 | Validate each data-driven action individually — the login click's result, the displayed login text, the generated email, and the password set — rather than only the end result. | Assert the required heading and registered-account outcome, adding relevant intermediate checks for requirements and diagnosis. | Unchanged; decision needed |
| M08 / Q1 | Each row is converted into a single data set, up to a maximum of 1200 rows. | Each subsequent data row defines a data set, subject to the documented 1200-row limit. | Unchanged; decision needed |
| M08 / Q4 | A Params File (JSON) applies parameters across every test in a CLI run (execution-level only), while a Config File can override test data at either the execution level or a specific test (e.g. via overrideTestData). | Params files supply execution-wide values, while config hooks can target named tests with overrideTestData. | Unchanged; decision needed |
| M08 / Q5 | An external source, such as a CSV file or a database, linked via a Config File. | A CSV/database source linked through a Config File. | Unchanged; decision needed |
| M09 / Q1 | Running the same set of actions/validations against a list of similar, repeating elements, like table rows. | Repeat actions/validations for similar elements, such as table rows. | Unchanged; decision needed |
| M09 / Q4 | Don't repeat — the group runs once, with no loop. | Don’t repeat — the group has no configured repetition. | Unchanged; decision needed |
| M09 / Q6 | While element checks visibility/presence; While element text is checks that the element's text matches an expected value. | While element checks Visible/Not visible; While element text is checks the target’s expected text. | Unchanged; decision needed |
| M10 / Q3 | Because when the AUT/SMS provider can forward SMS content to an email address, Testim's existing email service can read it using the same Validate email / Extract Value mechanism — no separate SMS integration needed. | A CLI action using Twilio, message filters and an exported code. | Unchanged; decision needed |
| M10 / Q5 | Extracting only the stable value needed avoids breaking the test when unrelated parts of the forwarding/email template change. | Use supported emailExtractedText or emailExtractedLinks exports, with appropriate scope and assertions. | Unchanged; decision needed |
| M11 / Q2 | A CLI validation, since it runs outside the browser sandbox and can reach a database connection. | A CLI validation with the configured database driver, credentials and network access. | Unchanged; decision needed |
| M11 / Q3 | Its Generate command can produce the Node.js code for the CLI action from a plain-text description. | Generate a code draft from a description, then insert, review and test it in the configured CLI runtime. | Unchanged; decision needed |
| M13 / Q1 | How much duplicate step content exists across the project, on a 0–100 scale. | Ungrouped duplicate step sequences on master, using a weekly refreshed estimate. | Unchanged; decision needed |
| M13 / Q4 | Parameters are generated automatically as needed during group creation. | Parameters can be generated, with an extra step to provide their names. | Unchanged; decision needed |
| M14 / Q5 | Add API Action, because it allows passing parameters when performing the API call. | Both support parameters in documented fields; select the step according to required response use and assertions. | Unchanged; decision needed |
| M15 / Q3 | A scenario for a before-test hook, to run that setup logic once per test automatically instead of duplicating it. | A Configuration File beforeTest hook with the required runtime, access and cleanup. | Unchanged; decision needed |
| M17 / Q1 | npm i @testim/testim-cli | npm install -g @testim/testim-cli | Unchanged; decision needed |
| M18 / Q3 | --test-config | --grid | Unchanged; decision needed |
| M19 / Q1 | Runs > Test Runs (with Advanced Filters), and also from Test List > Tests. | Execution Runs exports executions, Counted Test Runs exports runs, and Test Library exports test metadata. | Unchanged; decision needed |
| M19 / Q3 | A shareable, presentation-ready report with execution data, coverage, and pass/fail status. | Sharing a report of the selected run, without claiming complete project or requirement coverage. | Unchanged; decision needed |
| M20 / Q5 | Open the relevant test result with one click, and review historical pass/fail analytics filterable by time period. | Inspect the applicable test/execution result and time-filtered history, correlated with the CI build. | Unchanged; decision needed |
| M21 / Q2 | The branch is automatically created in Testim under the same name, and merging in GitHub automatically merges it in Testim too. | Same-name branches base on Testim Master; pull-request merge actions merge tests into Testim Master. | Unchanged; decision needed |
| M23 / Q2 | They let you isolate the exact steps leading to the error and consistently recreate the issue, informing where a fix belongs. | They expose state and execution evidence that helps investigate the failure before choosing a test change. | Unchanged; decision needed |
| M26 / Q2 | Click the dropdown next to Play, select 'Run locally step by step', then use 'Play Next Step'. | Run locally with debugging, pause or use a breakpoint, and use stepping controls. | Unchanged; decision needed |
| M26 / Q3 | Resumes execution from the exact point it was paused, until the test ends. | Continues from the paused location; another breakpoint can pause the run again. | Unchanged; decision needed |
| M27 / Q3 | In the test results section of the relevant test run | Connect Testim to the relevant bug tracker | Course: The Testim dashboard |
| M28 / Q3 | The users sections displays which user is associated with which particular project + Users will need to integrate another project management software into Testim to check actions of other users on projects | Authorized owners on the professional plan can inspect user/action/time records in the Audit Log. + Project teammates and company administration expose user/project membership. | Course: The users sections displays which user is associated with which particular project + Users will need to integrate another project management software into Testim to check actions of other users on projects |
| M29 / Q3 | In the Authorization header as a Bearer token: Authorization: Bearer PAK-[your-api-key]. | In Authorization: Bearer followed by the copied PAK-prefixed API key. | Unchanged; decision needed |
| M30 / Q1 | By adding JavaScript parameters for username and password in the group's properties panel. | Define group username/password parameters and bind the credential entry steps to them. | Unchanged; decision needed |
| M30 / Q2 | It guarantees a clean browser with no cookies or local storage, so the login flow is reliably exercised rather than skipped due to a remembered session. | A new incognito session reduces inherited browser cookies/storage, helping establish login preconditions. | Unchanged; decision needed |
| M30 / Q3 | Add a condition that checks at runtime whether login is actually needed (e.g. is the login button visible), so the test handles both starting states. | Condition the login group on whether login is needed and assert the resulting authenticated state. | Unchanged; decision needed |
| M31 / Q2 | Appium mode, since it guarantees Appium-grid compatibility and supports local execution. | Standard Appium compatibility mode, with the required driver/device/grid setup. | Unchanged; decision needed |
| M31 / Q4 | Because Appium mode is restricted to Appium's own capabilities, which can have gaps around hybrid apps and webviews. | Some hybrid/webview flows may not be fully recordable; verify the required flow and mode. | Unchanged; decision needed |

## Changed files

Runtime: core/js/library.js, study-plan.js, search.js, search-view.js, runtime.js, learning-history.js and the preceding UX files listed in ui-ux-improvements.md; index.html and sw.js for cache versioning.

Content: data/mock-exams.json; Testim modules M02, M03, M04, M05, M06, M27 and M28; derived content-manifest/library assets; source-review inventory evidence fingerprints and restoration notes. Tests and fixtures pin the course keys and lifecycle regressions.
