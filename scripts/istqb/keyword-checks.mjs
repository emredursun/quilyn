// Original K2 self-checks for chapter keywords that candidates commonly confuse.
// Rules v1.2 make syllabus keywords examinable for understanding; the official glossary remains the authority.
const check=(title,prompt,solution)=>({type:'exercise',title,prompt,solution});
export const keywordChecks=[
 [
  check('Error, defect, failure and root cause',
   'An analyst writes an ambiguous requirement. A developer misreads it and codes “points < 50” instead of “points ≤ 50”. In production, a customer with exactly 50 points is refused a discount. Classify the misreading, the faulty line of code and the refusal. Then explain the two roles of the ambiguous requirement.',
   'The misreading is an error (a human mistake). “points < 50” is a defect in the code. The refused discount is a failure observed while the system runs. The ambiguous requirement is itself a defect in the requirements, produced by the analyst’s error. It is also the root cause of the developer’s error: a fundamental reason that led to it. Removing such causes helps prevent similar defects.'),
  check('Test object, test basis and testware',
   'A team tests release 2.3 of a mobile app against its user stories. During testing it produces test cases, automated scripts and a test completion report. Identify the test object, the test basis and the testware.',
   'Test object: release 2.3 of the app, the work product being tested. Test basis: the user stories, from which the tests are derived. Testware: the test cases, scripts and report, the work products produced by the test process.'),
  check('Testing versus debugging',
   'A tester runs a test and observes a failure. A developer reproduces it, locates the defect and fixes the code. The tester then reruns the original test. Which of these activities are testing and which are debugging?',
   'Running the test and rerunning it are testing; the rerun is confirmation testing. Reproducing, diagnosing (locating the defect) and fixing are debugging. Testing can trigger failures or find defects directly, but it does not fix them.'),
  check('Verification, validation and quality assurance',
   'Classify each activity: (1) checking that a release meets its specified requirements; (2) checking with users that the release meets their needs in its operational environment; (3) improving the team’s review process to prevent defects.',
   '(1) Verification. (2) Validation. (3) Quality assurance: it is process-oriented and preventive. Testing itself is a product-oriented quality control activity.'),
  check('Test condition, test case, test procedure and test data',
   'For a login story: (a) “account lockout after repeated failed attempts”; (b) “user u1 enters a wrong password three times; expect the account to be locked”; (c) “create u1, run (b), then run the unlock test, in that order”; (d) the u1 credentials. Classify each item and name the activity that produces it.',
   '(a) Test condition, from test analysis. (b) Test case, from test design. (c) Test procedure, from test implementation. (d) Test data, also prepared in test implementation. Traceability links each one back to the story.')
 ],
 [
  check('Confirmation versus regression testing',
   'A defect in the discount calculation is fixed. Test A reruns the failing discount test. Test B reruns the tests for the checkout and invoice areas, whose code was not changed. Which is confirmation testing and which is regression testing?',
   'Test A is confirmation testing: it checks that the original defect is fixed. Test B is regression testing: it checks that the change has not caused unwanted effects elsewhere. Regression tests are often good candidates for automation because they are run repeatedly.'),
  check('Test level versus test type',
   'A team runs performance tests during system testing and functional tests during component testing. Which terms are test levels, which are test types, and can every test type be used at every level?',
   'System testing and component testing are test levels. Performance (non-functional) and functional testing are test types. Any of the four CTFL test types (functional, non-functional, black-box and white-box) can be performed at any test level, with a different focus at each level.'),
  check('Component integration versus system integration',
   'Test X checks the interface between the cart module and the pricing module of one application. Test Y checks the exchange between the application and an external payment service. Classify both.',
   'X is component integration testing: interactions between components of one system. Y is system integration testing: interactions with other systems and external services.'),
  check('Maintenance testing triggers',
   'Which of these trigger maintenance testing: (1) a hotfix to production code; (2) moving the system to a new cloud platform; (3) retiring an application whose data must be archived; (4) testing the first release of a new system that is not yet in operation?',
   '(1), (2) and (3). Modifications, upgrades or migrations of the operational environment, and retirement are maintenance triggers. (4) concerns a system that is not yet operational, so it is not maintenance testing.')
 ],
 [
  check('Static versus dynamic testing',
   'Test 1: reviewers read a user story and find a contradictory acceptance criterion. Test 2: a test run of the built feature shows a wrong total. Which is static testing, and what does each find?',
   'Test 1 is static testing: nothing is executed, and the review finds the defect directly. Test 2 is dynamic testing: execution causes a failure, which must then be analysed to locate the defect.'),
  check('Choose the review type',
   '(1) The author leads a session to explain a design to new team members and gather ideas. (2) Technically qualified reviewers, led by a moderator, must decide between two architecture options. (3) A review with defined roles, collected metrics and an author who cannot act as review leader or scribe aims to find as many anomalies as possible. Name each review type.',
   '(1) Walkthrough. (2) Technical review. (3) Inspection, the most formal type. An informal review follows no defined process and requires no formal documented output.'),
  check('Static analysis versus review',
   'A tool reports unreachable code and a variable used before it is assigned. Later, three colleagues read the design document and discuss its gaps. Which activity is static analysis, which is a review, and what do they have in common?',
   'The tool-based check is static analysis; the colleagues reading the document perform a review. Both are static testing: neither executes the software.'),
  check('Anomaly versus defect',
   'Reviewers log 12 anomalies. After analysis, 9 are confirmed as defects, 2 are misunderstandings by the reviewers and 1 is a change request. Why are the logged items called anomalies?',
   'An anomaly is a condition that deviates from expectation. In the review process, each logged anomaly is then evaluated and given a status and action: a defect, not a defect, or a different action such as a change request.')
 ],
 [
  check('Coverage item versus coverage',
   'For an age field you identify 3 equivalence partitions and your tests exercise 2 of them. What are the coverage items, and what is the coverage?',
   'The 3 partitions are the coverage items, derived from the test conditions. Coverage is 2/3 ≈ 67%. Always state the items and the denominator with a coverage figure.'),
  check('Classify the techniques',
   'Classify: equivalence partitioning, branch testing, error guessing, decision table testing, checklist-based testing, statement testing, exploratory testing, state transition testing.',
   'Black-box: equivalence partitioning, decision table testing, state transition testing. White-box: statement testing, branch testing. Experience-based: error guessing, exploratory testing, checklist-based testing.'),
  check('Which experience-based technique?',
   'Name the technique in each case. (1) A tester designs, executes and evaluates tests at the same time within a time-boxed charter. (2) A tester anticipates likely mistakes from past failures, such as empty input or division by zero. (3) A tester follows a list of questions derived from experience and standards.',
   '(1) Exploratory testing, here session-based. (2) Error guessing. (3) Checklist-based testing.'),
  check('Acceptance criteria versus ATDD',
   'A story states: “Orders of at least EUR 60 ship free.” The team agrees examples (EUR 60 free, EUR 59.99 charged) and writes tests from them before coding. Which part is the acceptance criterion and which is ATDD?',
   '“Orders of at least EUR 60 ship free” is an acceptance criterion: a condition the story must meet. Agreeing examples and deriving tests before implementation is acceptance test-driven development, a collaboration-based test approach.')
 ],
 [
  check('Product risk versus project risk',
   'Classify: (1) a key tester is unavailable for two weeks; (2) search may respond too slowly under peak load; (3) a supplier delivers a component late; (4) a payment calculation may be wrong.',
   'Project risks: (1) and (3). They affect the management and control of the project. Product risks: (2) and (4). They concern product quality characteristics.'),
  check('Parts of risk management',
   'Place each activity in risk analysis (identification or assessment) or risk control (mitigation or monitoring): identifying risks in a workshop; rating each risk by likelihood and impact; adding tests for a high risk; checking whether a mitigation is working.',
   'Identifying risks in a workshop: risk identification. Rating likelihood and impact: risk assessment, which determines the risk level. Both are part of risk analysis. Adding tests: risk mitigation. Checking that the mitigation works: risk monitoring. Mitigation and monitoring are part of risk control.'),
  check('Entry versus exit criteria',
   '“The test environment is available and the story is ready for testing” and “All high-risk tests have passed and the defined coverage is achieved”. Which is an entry criterion and which an exit criterion?',
   'The first is an entry criterion: a precondition for starting an activity. The second is an exit criterion: what must be achieved to declare the activity complete. In Agile, entry criteria are often called the Definition of Ready and exit criteria the Definition of Done.'),
  check('Monitoring, control and reports',
   'A test manager (1) collects pass/fail and coverage data daily; (2) reassigns testers to a blocked area; (3) sends a weekly status summary; (4) summarizes the results when testing ends. Classify each.',
   '(1) Test monitoring. (2) Test control: guiding actions based on monitoring information. (3) Test progress report. (4) Test completion report.'),
  check('Test pyramid versus testing quadrants',
   'Classify these tests into testing quadrants: a component test, tests derived from user-story examples, a usability test and a performance test. Then state what the test pyramid says about the number of tests at its lower layers.',
   'Component test: Q1 (technology-facing, supports the team). Tests from user-story examples: Q2 (business-facing, supports the team). Usability test: Q3 (business-facing, critiques the product). Performance test: Q4 (technology-facing, critiques the product). In the test pyramid, lower layers have many small, fast, isolated tests, and higher layers have fewer, more complex tests.')
 ],
 [
  check('Benefits and risks of test automation',
   'Classify each as a benefit or a risk of test automation: (1) less repetitive manual work; (2) underestimated maintenance effort; (3) more consistent test execution; (4) relying on the tool when manual testing would be more suitable; (5) faster feedback from shorter execution times.',
   'Benefits: (1), (3) and (5). Risks: (2) and (4). Other risks include unrealistic expectations and dependency on the tool vendor.')
 ]
];
