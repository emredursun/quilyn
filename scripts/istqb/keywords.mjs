// Original plain-language explanations; official glossary remains the terminology authority.
export const keywords = [
`coverage|The proportion of specified coverage items that tests have exercised; always state the items and denominator.
debugging|Investigating a defect's cause and implementing a correction, distinct from detecting it through testing.
defect|A flaw in a work product that can prevent it meeting a requirement or need.
error|A mistaken human action that can introduce a defect.
failure|Observed behavior in which a running system does not perform as required.
quality|How well a product's characteristics meet stated and implied needs in its context.
quality assurance|Activities aimed at confidence in, and improvement of, the processes used to create quality products.
root cause|An underlying reason contributing to an error or defect; addressing it can prevent similar problems.
test analysis|Examine the test basis to identify and prioritize what should be tested.
test basis|The information from which tests are derived, such as requirements, stories, designs or code.
test case|Preconditions, inputs, actions as needed and expected outcomes for checking a particular condition.
test completion|Consolidate outcomes, preserve useful testware, report remaining risk and record lessons at an activity boundary.
test condition|A testable aspect of a work product that identifies what needs checking.
test control|Take actions to bring testing toward its objectives after comparing status with plans.
test data|Values and records needed to prepare, execute and evaluate tests.
test design|Turn test conditions into concrete cases and identify data and environment requirements.
test execution|Run tests, compare actual with expected outcomes and record results and anomalies.
test implementation|Prepare executable procedures or scripts, suites, data and environment for execution.
test monitoring|Gather and evaluate evidence about test progress and status against the plan.
test object|The work product being evaluated, whether executable software or another artifact.
test objective|The intended purpose of a test activity, such as detecting defects or evaluating a quality risk.
test planning|Define test objectives, approach, resources, responsibilities, estimates and coordination.
test procedure|An ordered set of instructions for preparation, executing cases and follow-up actions.
test process|The context-dependent organization of planning, monitoring, control, analysis, design, implementation, execution and completion.
test result|The observed outcome of executing a test and its comparison with the expected outcome.
testing|Activities that evaluate work-product quality and find defects; includes more than running software.
testware|Artifacts produced or used for testing, including plans, cases, data, scripts, logs and reports.
traceability|Relationships linking basis items, tests, results and defects so evidence and impacts can be followed.
validation|Evaluate whether a product satisfies stakeholder needs in its intended use.
verification|Evaluate whether a work product meets its specified requirements.`,
`acceptance testing|Evaluate readiness and suitability for business, user or operational needs, including contractual or regulatory expectations where applicable.
black-box testing|Derive tests from specified behavior without using the implementation structure as the basis.
component integration testing|Evaluate interactions and interfaces between components within a system.
component testing|Evaluate an individual component, often isolated from its collaborators.
confirmation testing|Check that a particular defect has been corrected.
functional testing|Evaluate what the product does against its functional expectations.
integration testing|Evaluate interactions between combined components or systems; distinguish the relevant integration level.
maintenance testing|Evaluate an operational product and effects of changes, migrations or retirement.
non-functional testing|Evaluate how well the product behaves, such as performance, usability or reliability.
regression testing|Look for adverse effects of changes in affected, connected or apparently unchanged areas.
shift left|Introduce useful testing and feedback earlier while retaining later evidence where needed.
system integration testing|Evaluate interactions of the tested system with other systems and external services.
system testing|Evaluate the complete system against its objectives and specification.
test level|A grouping of test activities defined by object, objectives, basis, typical defects and responsibilities.
test object|The particular component, interface, complete system or other artifact currently being tested.
test type|A grouping by the characteristic or purpose being assessed, independent of test level.
white-box testing|Derive tests using internal structure, such as statements and control-flow branches.`,
`anomaly|An observation that differs from expectations and needs investigation before classification.
dynamic testing|Evaluate software by executing it and observing results.
formal review|A review conducted with a defined process, responsibilities and recorded evidence appropriate to its formality.
informal review|An examination without a required formal process or prescribed documented output.
inspection|The most formal review type, with defined roles, a complete process and collected metrics.
review|People examine a work product to identify anomalies, improve understanding and assess quality.
static analysis|Tool-supported examination of structured artifacts without executing the test object.
static testing|Examine work products through reviews or static analysis without executing them.
technical review|Technically qualified reviewers use moderated discussion to assess a technical issue and seek decisions or consensus.
walkthrough|The author leads participants through a work product to explain it, collect questions and identify anomalies.`,
`acceptance criteria|Shared conditions a story or feature must satisfy to be accepted; make expected positive and negative behavior clear.
acceptance test-driven development|Collaboratively derive acceptance examples before implementation and use them to guide the work.
black-box test technique|A systematic way to derive tests from the required behavior rather than implementation structure.
boundary value analysis|Derive cases around the limits of ordered equivalence partitions, using the specified 2-value or 3-value criterion.
branch coverage|Exercised control-flow branches divided by the total modeled branches, expressed as a percentage.
checklist-based testing|Use a maintained list of test conditions to guide checks while allowing context-specific execution.
collaboration-based test approach|Develop shared testable understanding through contributions from business, development and testing perspectives.
coverage|The proportion of the selected kind of coverage items exercised, rather than a general proof of correctness.
coverage item|A distinct element to be exercised under a criterion, such as a partition, feasible rule, transition, statement or branch.
decision table testing|Derive cases from feasible combinations of conditions and their associated actions.
equivalence partitioning|Divide a domain into groups expected to be treated alike and choose representative values from each relevant group.
error guessing|Target likely mistakes using experience of the application, domain and previous defects.
experience-based test technique|Derive tests primarily from people's knowledge and practical experience of likely failures.
exploratory testing|Integrate learning, design and execution, with observations influencing subsequent tests.
state transition testing|Derive event sequences from a model of states and valid or invalid transitions.
statement coverage|Executed executable statements divided by total executable statements, expressed as a percentage.
test technique|A repeatable method for selecting conditions, cases, data and coverage items.
white-box test technique|A method for deriving cases from the internal structure of the test object.`,
`defect management|Record, analyze, classify, track and communicate anomalies and confirmed defects through their lifecycle.
defect report|Information enabling another person to understand, reproduce, assess and resolve an anomaly.
entry criteria|Preconditions that should hold before a specified activity begins.
exit criteria|Conditions used to judge completion of a specified activity, with unmet quality targets made visible.
product risk|A potential problem in the quality or behavior of the delivered product.
project risk|A potential threat to successful execution of the project, such as staffing or supplier delay.
risk|An uncertain adverse event characterized by its likelihood and consequences.
risk analysis|Identify and assess risks so decisions can consider their nature and level.
risk assessment|Categorize already identified risks, estimate likelihood, impact and level, prioritize them and propose responses. Identification is the separate activity that produces the risk list; both belong to risk analysis.
risk control|Choose and carry out responses and monitor how risk changes.
risk identification|Determine which adverse events or quality problems could matter in the context.
risk level|An assessed measure combining likelihood and impact under a defined model.
risk management|Coordinate identification, assessment, responses and monitoring of risks.
risk mitigation|Actions intended to reduce the likelihood or consequences of an adverse event.
risk monitoring|Track known risks, responses and new evidence or emerging risks over time.
risk-based testing|Use product risk information to guide scope, depth, techniques, effort and priority.
test approach|The context-specific way testing will meet its objectives, including levels, types, techniques and resources.
test completion report|A summary of completed testing, outcomes, deviations, residual risks and lessons.
test control|Adjust the work in response to status and objectives; distinguish action from monitoring.
test monitoring|Observe and assess test status and progress to support control and reporting.
test plan|A communication artifact describing the test work's objectives, scope, approach, resources and schedule.
test planning|Develop and maintain the decisions and coordination needed to reach test objectives.
test progress report|An ongoing status account of progress, impediments, deviations, risks and proposed actions.
test pyramid|A model favoring many fast narrow tests and fewer slow broad tests to balance feedback and coverage.
test strategy|General guidance about how testing is carried out, informing context-specific plans and approaches.
testing quadrants|A model classifying tests on business/technology focus and support-team/critique-product purpose.`,
`test automation|Use tools to perform or support test activities; introduction, maintenance and interpretation still need effort.`
].map(raw=>raw.split('\n').map(line=>line.split('|')));
