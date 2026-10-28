export const misconceptions = Object.fromEntries(`
1.1.1|Passing specified checks establishes that the product meets every user need.
1.1.2|Reporting a failure and diagnosing or correcting its cause are the same activity.
1.2.1|Testing adds value only by running the finished program.
1.2.2|Testing is a synonym for process-oriented quality assurance.
1.2.3|A defect causes a failure on every execution, and error, defect and failure are interchangeable.
1.3.1|A large passing test suite proves the absence of defects and guarantees a useful product.
1.4.1|Analysis, design, implementation and execution all mean running test scripts.
1.4.2|The same feature should always use the same process regardless of context.
1.4.3|A test case and a test log are interchangeable because both mention results.
1.4.4|The number of tests proves requirement coverage even without links to the test basis.
1.4.5|Each testing responsibility requires a separate person with a matching job title.
1.5.1|A technically correct but accusatory defect report communicates more effectively than a factual one.
1.5.2|Quality becomes exclusively the tester's responsibility when a specialist joins the team.
1.5.3|Independence eliminates the need for product knowledge and collaboration.
2.1.1|All test activities happen exactly once and only after all implementation is complete.
2.1.2|Early analysis and work product review are practices restricted to Agile projects.
2.1.3|TDD, ATDD and BDD all use the same test basis and participants.
2.1.4|A CI/CD pipeline removes the need for manual exploration, reliable data and maintenance.
2.1.5|Shift left means eliminating later system and operational testing.
2.1.6|A retrospective is complete when complaints are recorded, even without owned follow-up actions.
2.2.1|Every integration test is system integration testing, even when it checks two internal components.
2.2.2|Non-functional testing is confined to the system level and white-box testing to components.
2.2.3|Confirmation and regression have the same objective because both occur after a change.
2.3.1|A migration or retirement needs no testing unless a new business feature is added.
3.1.1|Only source code can be a static test object.
3.1.2|Reviews cannot find useful defects until executable software is available.
3.1.3|Tool-assisted testing is automatically dynamic, while manual testing is automatically static.
3.2.1|Stakeholder feedback should be postponed until final acceptance to avoid changing drafts.
3.2.2|Every recorded review anomaly is automatically a confirmed defect requiring the proposed fix.
3.2.3|The moderator, scribe and review leader have identical responsibilities.
3.2.4|An inspection is just an author-led walkthrough with a more formal name.
3.2.5|Reviews should primarily evaluate the performance of individual authors.
4.1.1|Technique families are determined by which tool executes the tests rather than the test basis.
4.2.1|Valid partitions are sufficient, and Each Choice means all combinations of input partitions.
4.2.2|A midpoint can replace an immediate boundary neighbor, or 2-value and 3-value sets are identical.
4.2.3|Rule coverage counts individual conditions or test executions instead of distinct feasible rules.
4.2.4|Visiting every state guarantees that every transition and invalid event has been checked.
4.3.1|Executing every statement guarantees every decision outcome has been exercised.
4.3.2|Full branch coverage guarantees every possible execution path and correct business behavior.
4.3.3|Structural coverage detects a required feature even when its implementation is entirely missing.
4.4.1|Error guessing means selecting arbitrary inputs without a hypothesis about likely faults.
4.4.2|Exploratory testing prohibits planning, evidence, a mission or a debrief.
4.4.3|A completed checklist guarantees completeness and should never be updated.
4.5.1|A user story is a fixed contract whose examples should be written by one discipline alone.
4.5.2|Acceptance criteria must use Given/When/Then and cannot be expressed as clear rules.
4.5.3|Acceptance examples may invent unrelated behavior, or test-first means writing tests after the feature is complete.
5.1.1|A test plan is immutable and removes uncertainty about resources, scope and schedules.
5.1.2|A tester contributes to planning only after the story has been implemented.
5.1.3|Reaching a deadline proves the quality-related exit criteria are met.
5.1.4|The simple mean is the weighted three-point estimate, or person-days directly equal calendar duration.
5.1.5|A test's original total coverage remains its additional coverage after other tests have run.
5.1.6|The test pyramid requires a large UI-heavy suite or prohibits integrated tests entirely.
5.1.7|Testing quadrants are four chronological stages that must execute in numeric order.
5.2.1|Impact and likelihood mean the same thing, or a risk score is automatically a probability.
5.2.2|Any risk reported by a tester must be a product risk rather than a project risk.
5.2.3|Risk analysis affects only execution order and never depth, technique or scope.
5.2.4|Recording a risk or finding a defect automatically fixes it and removes the risk.
5.3.1|A pass percentage is meaningful without its denominator and proves overall product quality.
5.3.2|Progress and completion reports serve identical decisions at identical times.
5.3.3|Every audience should receive the same unexplained raw logs, and urgent risk changes can wait.
5.4.1|The latest build and data are always sufficient to reproduce a historical failure.
5.5.1|High priority makes a vague report reproducible, and severity always equals urgency to fix.
6.1.1|Tools are useful only for execution, or a coverage tool determines stakeholder acceptance.
6.2.1|Buying an automation tool guarantees immediate savings, no maintenance and defect-free releases.
`.trim().split('\n').map(line=>{const [id,text]=line.split('|');return ['FL-'+id,text];}));
