# Technical accuracy review: scripts/istqb/keyword-checks.mjs

Reviewer scope: technical accuracy only, against CTFL Syllabus v4.0.1 (2024-09-15, downloaded from istqb.org, download_id=3345) and Exam Structures and Rules v1.2 (download_id=3829). Page numbers are the printed syllabus pages ("Page N of 78").

Source check on the file header: Exam Rules v1.2 section 4.1.4 says "All keywords in the syllabus are Examinable for understanding their definition (K2)" and 4.1.3 makes the related Glossary keywords examinable. The header comment is accurate.

Result: 21 exercises reviewed. 0 critical, 2 major, 8 minor. Everything stays within CTFL scope. Nothing reaches beyond the syllabus.

---

## Critical

None.

---

## Major

### M1. Maintenance testing triggers: item (4) has more than one defensible answer

- Quoted prompt: "(4) writing the first version of a new feature before release"
- Quoted solution: "(4) is development of a new product, not maintenance of an operational system."
- Problem: The prompt says "new feature", but the solution treats it as a "new product". In the syllabus, adding a feature to a system that is already operational is a planned enhancement, and planned enhancements are a modification trigger for maintenance testing. A candidate who answers (1)-(4) can defend that answer from the syllabus. The solution also rests on a fact the prompt never gives: that no operational system exists.
- Official source: Syllabus 2.3, p. 31: "Modifications, such as planned enhancements (i.e., release-based), corrective changes or hot fixes." Also p. 31: "Testing the changes to an operational system ...".
- Suggested correction: Change (4) to "(4) building and testing the first release of a new system that is not yet in operation". Keep the solution, and add: "Once the system is operational, a planned enhancement such as a new feature would be a modification trigger."

### M2. Error, defect, failure and root cause: the ambiguous requirement can also be read as a defect

- Quoted prompt: "Classify the misreading, the code, the refusal and the ambiguous requirement."
- Quoted solution: "The ambiguous requirement is a root cause: a fundamental reason that led to the error."
- Problem: The syllabus lists ambiguity in a requirement as a defect type. It also says defects can sit in documentation such as a requirements specification. So "the ambiguous requirement is a defect (in the requirements), produced by the analyst's error" is just as defensible as "root cause". The prompt asks for a single classification, so only one answer appears to be correct. Calling it a root cause is fine under 1.2.3 ("a situation that leads to an error"). The problem is that the classification is not unique.
- Official source: Syllabus 1.2.3, p. 17: "Defects can be found in documentation, such as a requirements specification ...", and "A root cause is a fundamental reason for the occurrence of a problem (e.g., a situation that leads to an error)." Syllabus 3.1.3, p. 34: "Defects in requirements (e.g., inconsistencies, ambiguities, contradictions ...)".
- Suggested correction: Rephrase the prompt as "What role does the ambiguous requirement play in the developer's error?" Alternatively, extend the solution: "The ambiguity is itself a defect in the requirements, caused by the analyst's error. Relative to the coding defect, it is the root cause, because it is the situation that led to the developer's error. Root cause analysis would trace back to it."

---

## Minor

### m1. Confirmation versus regression testing: unclear phrase "tests that were not changed"
- Quoted: "Test B reruns the checkout and invoice tests that were not changed."
- Problem: The phrase says the tests were not changed. The idea being tested is that the areas were not changed. Regression testing targets unchanged parts of the system, whether or not the tests themselves changed.
- Source: Syllabus 2.2.3, p. 30: "Regression testing confirms that no adverse consequences have been caused by a change ...". Also 2.3, p. 31: "regressions in parts of the system that remain unchanged".
- Correction: "Test B reruns the existing checkout and invoice tests, areas the fix did not change."

### m2. Test level versus test type: over-general claim
- Quoted: "Test types can be applied at every test level, with a different focus at each level."
- Problem: The syllabus says "most" test activities in general. It says "all" only for the four test types it addresses.
- Source: Syllabus 2.2, p. 28: "most of those test activities can be performed at every test level". Also 2.2.2, p. 30: "All the four above mentioned test types can be applied to all test levels, although the focus will be different at each level."
- Correction: "The four test types in the syllabus (functional, non-functional, black-box, white-box) can be applied at every test level ..."

### m3. Choose the review type: "may not" can be read two ways
- Quoted: "an author who may not lead or act as scribe"
- Problem: "May not" can mean "is not allowed to" or "might not". The syllabus rule is a prohibition.
- Source: Syllabus 3.2.4, p. 37: "In inspections, the author cannot act as the review leader or scribe."
- Correction: "an author who cannot act as review leader or scribe".

### m4. Choose the review type: wording about informal review output
- Quoted: "An informal review follows no defined process and need not produce documented output."
- Problem: The syllabus says no *formal* documented output is required. It does not say no output at all.
- Source: Syllabus 3.2.4, p. 36: "Informal reviews do not follow a defined process and do not require a formal documented output."
- Correction: "... and does not require formal documented output."

### m5. Anomaly versus defect: definition goes beyond the glossary
- Quoted: "An anomaly is a deviation from expectation that still needs evaluation."
- Problem: The glossary defines an anomaly as "a condition that deviates from expectation". "That still needs evaluation" is not part of the definition. It comes from the review process context, where anomalies are analyzed before a status is assigned. A learner could take it as part of the definition.
- Source: Syllabus 3.2.2, p. 35: "Since the anomalies identified during a review are not necessarily defects, all these anomalies need to be analyzed and discussed. For every anomaly, the decision should be made on its status, ownership and required actions." Also ISTQB Glossary, "anomaly".
- Correction: "An anomaly is a condition that deviates from expectation. In a review, each logged anomaly is analyzed before it gets a status ..."

### m6. Which experience-based technique?: fault attack added to item (2)
- Quoted: "(2) Error guessing, for example through a fault attack."
- Problem: The scenario in (2) describes plain error guessing. A fault attack means building or acquiring a *list* of possible errors, defects and failures. That makes it easy to confuse with the checklist in item (3), which is exactly the distinction the exercise is testing.
- Source: Syllabus 4.4.1, p. 44: "Fault attacks are a way to implement error guessing. This test technique requires the tester to create or acquire a list of possible errors, defects and failures ...". Also 4.4.3, p. 44, on checklist-based testing.
- Correction: Drop "for example through a fault attack". Or add a contrast: "A fault attack is a structured form of error guessing, driven by a list of possible errors, defects and failures. A checklist in (3) is a list of test conditions, often phrased as questions."

### m7. Entry versus exit criteria: Definition of Ready not explained
- Quoted: the prompt uses "Definition of Ready", but the solution mentions only "Definition of Done".
- Problem: The syllabus also names Definition of Ready, and it is the Agile term for this exact entry criterion. Leaving it out misses a direct reinforcement point.
- Source: Syllabus 5.1.3, p. 50: "Entry criteria that a user story must fulfill to start the development and/or testing activities are called Definition of Ready."
- Correction: Add: "In Agile, entry criteria for a user story are called the Definition of Ready, and exit criteria are often called the Definition of Done."

### m8. Parts of risk management: the solution does not place each activity
- Quoted prompt: "Place each activity: ..."
- Problem: The solution names the sub-activities but leaves the reader to map them to the four listed activities. Also, "risk level from likelihood and impact" is only part of assessment. Assessment also includes categorization, prioritizing and proposing ways to handle risks.
- Source: Syllabus 5.2, p. 51; 5.2.3, pp. 52-53; 5.2.4, p. 53.
- Correction: "Workshop identification -> risk identification (risk analysis). Rating likelihood and impact -> risk assessment (risk analysis). Adding tests -> risk mitigation (risk control). Checking that mitigation works -> risk monitoring (risk control)."

---

## Exercises checked and correct

All solutions agree with the syllabus. Where an exercise appears above, only the noted wording needs changing.

Chapter 1
1. Error, defect, failure and root cause: correct except M2 (1.2.3, p. 17)
2. Testing versus debugging: correct (1.1.2, p. 16, debugging steps: reproduction, diagnosis, fixing; confirmation testing follows)
3. Verification, validation and quality assurance: correct (1.1, p. 15; 1.2.2, p. 17, QA is process-oriented and preventive, testing is product-oriented quality control)
4. Test condition, test case, test procedure and test data: correct (1.4.1, p. 19; 1.4.3, p. 20, test data is a test implementation work product)

Chapter 2
5. Confirmation versus regression testing: correct except m1 (2.2.3, pp. 30-31)
6. Test level versus test type: correct except m2 (2.2, 2.2.1, 2.2.2, pp. 28-30)
7. Component integration versus system integration: correct (2.2.1, p. 29)
8. Maintenance testing triggers: items (1)-(3) correct; M1 on (4) (2.3, p. 31)

Chapter 3
9. Static versus dynamic testing: correct (3.1.3, p. 34; 1.1.2, p. 16)
10. Choose the review type: correct classification (walkthrough led by author; technical review led by moderator; inspection most formal, metrics, author cannot be leader or scribe), except m3 and m4 (3.2.4, pp. 36-37)
11. Anomaly versus defect: correct except m5 (3.2.2, p. 35)

Chapter 4
12. Coverage item versus coverage: correct (4.2.1, p. 40, EP coverage items are partitions, 2/3 = 67%)
13. Classify the techniques: correct (4.1, p. 39; 4.2-4.4)
14. Which experience-based technique?: correct except m6 (4.4.1-4.4.3, pp. 43-44; session-based testing with time box and charter in 4.4.2)
15. Acceptance criteria versus ATDD: correct (4.5, 4.5.2, 4.5.3, pp. 45-46; ATDD is a test-first collaboration-based approach)

Chapter 5
16. Product risk versus project risk: correct (5.2.2, p. 52; supplier and people issues are project risks, inadequate response time and incorrect calculations are product risks)
17. Parts of risk management: correct except m8 (5.2, p. 51; 5.2.3-5.2.4, pp. 52-53)
18. Entry versus exit criteria: correct except m7 (5.1.3, p. 50)
19. Monitoring, control and reports: correct (5.3, p. 53, "Adding new resources when and where needed" is a control directive; 5.3.2, p. 54, progress report on a regular basis, completion report at the end)
20. Test pyramid versus testing quadrants: correct (5.1.6, pp. 50-51; 5.1.7, p. 51: component tests Q1, examples/user story tests Q2, usability Q3, non-functional except usability Q4)

Chapter 6
21. Benefits and risks of test automation: correct (6.2, pp. 59-60; item (4) merges two listed risks, "Using a test tool when manual testing is more appropriate" and "Relying on a tool too much", which is acceptable)

---

## Correction recheck

What I rechecked: the corrected scripts/istqb/keyword-checks.mjs, now 23 exercises (read-only). I also checked the rendered data in data/istqb-ctfl/chapter-1.json to chapter-6.json:
- Each chapter file has exactly one 'keyword-self-check' section.
- A script compared every prompt and solution in the module against the chapter JSON. All 23 match (0 mismatches).
- No old wording is left in data/istqb-ctfl or learn/ctfl. I searched for "new feature before release", "for example through a fault attack" and "may not lead" and found none.

### Status of earlier findings

| ID | Exercise | Status | Evidence |
|---|---|---|---|
| M1 | Maintenance testing triggers | Resolved | (4) now reads "testing the first release of a new system that is not yet in operation". The solution says it "concerns a system that is not yet operational". This is consistent with 2.3, p. 31. |
| M2 | Error, defect, failure and root cause | Resolved | The prompt now asks for "the two roles of the ambiguous requirement". The solution calls it "a defect in the requirements, produced by the analyst's error" and "the root cause of the developer's error". This is consistent with 1.2.3, p. 17 and 3.1.3, p. 34. |
| m1 | Confirmation versus regression testing | Resolved | "tests for the checkout and invoice areas, whose code was not changed". |
| m2 | Test level versus test type | Resolved | "Any of the four CTFL test types (functional, non-functional, black-box and white-box) can be performed at any test level". Matches 2.2.2, p. 30. |
| m3 | Choose the review type | Resolved | "an author who cannot act as review leader or scribe". Matches 3.2.4, p. 37. |
| m4 | Choose the review type | Resolved | "requires no formal documented output". Matches 3.2.4, p. 36. |
| m5 | Anomaly versus defect | Resolved | "a condition that deviates from expectation", with evaluation now described as a review-process step. Matches the glossary and 3.2.2, p. 35. |
| m6 | Which experience-based technique? | Resolved | The fault-attack reference was removed, and (2) now reads simply "Error guessing". |
| m7 | Entry versus exit criteria | Resolved | "In Agile, entry criteria are often called the Definition of Ready and exit criteria the Definition of Done". Matches 5.1.3, p. 50. One small wording difference: the syllabus says "Entry criteria that a user story must fulfill ... are called Definition of Ready". The word "often" in the new text is acceptable. |
| m8 | Parts of risk management | Resolved | The prompt now names the four slots, and the solution places each of the four activities explicitly. Matches 5.2, 5.2.3 and 5.2.4, pp. 51-53. |

### New exercises

- **Test object, test basis and testware (chapter 1): correct.** "Test object: release 2.3 ... the work product being tested" matches 1.1, p. 15: "These work products, when being tested, are known as test objects". The test basis being the user stories the tests are derived from matches the glossary sense, the basis for test analysis and design. "Testware: ... the work products produced by the test process" matches 1.4.3, p. 20: "Testware is created as output work products from the test activities", and that list includes test cases, automated test scripts and the test completion report. The prompt is unambiguous.
- **Static analysis versus review (chapter 3): correct.** 1.1, p. 15 says "Static testing includes reviews (see chapter 3) and static analysis". Unreachable code and a variable used before assignment correspond to the coding defects in 3.1.3, p. 34: "unreachable or duplicated code" and "variables with undefined values". 3.1, p. 33 says static analysis is done "with the help of a tool" and reviews by "manual examination". The shared property "neither executes the software" matches 3.1, p. 33. The prompt is unambiguous.

### Small changes elsewhere, checked
- "Test pyramid versus testing quadrants" now says "tests derived from user-story examples" for Q2. That is still correct per 5.1.7, p. 51, which lists "examples, user story tests" in Q2.
- "Confirmation versus regression testing" says regression tests are "often good candidates for automation". The syllabus says "strong candidate" (2.2.3, p. 31). The meaning is consistent, so this is not a finding.

### New accuracy issues
None. All 10 earlier findings are resolved. The two new exercises are correct, and all 23 exercises now agree with syllabus v4.0.1.
