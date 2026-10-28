// Original worked representations and self-contained practice added after the separate AI content reviews.
// Exercise solutions render collapsed so candidates attempt the prompt first.
const exercise=(title,prompt,solution)=>({type:'exercise',title,prompt,solution});

// The curriculum worked example states the insight these exercises ask for, so it follows them.
export const exampleAfterPractice=new Set(['FL-4.3.1','FL-4.3.2']);

export const workedModels = {
 'FL-2.2.2':[
  {type:'table',headers:['Non-functional characteristic in the CTFL syllabus','Example evidence'],rows:[
   ['Performance efficiency','A search finishes within its specified response-time limit under the stated load.'],
   ['Compatibility','Two supported applications coexist and exchange information as required.'],
   ['Usability / interaction capability','Representative users can complete the task and understand error feedback.'],
   ['Reliability','The service recovers after an interruption and preserves the required behavior.'],
   ['Security','An unauthorized user cannot read another account’s records.'],
   ['Maintainability','A localized change can be analyzed, implemented and tested without unintended coupling.'],
   ['Portability / flexibility','The supported deployment can move to another specified environment.'],
   ['Safety','A hazardous condition is handled without exposing people or assets to the specified unacceptable harm.']
  ]},
  {type:'note',text:'Use the characteristics listed in this syllabus edition. A correct exported total is functional evidence; the time required to export it is non-functional evidence. Either type may be checked at more than one test level.'}
 ],
 'FL-4.2.1':[
  {type:'steps',title:'Build partitions from behavior',items:['Identify the input domain and each distinct specified behavior. Include feasible invalid inputs.','Choose one representative per non-empty partition for each input. Record the expected outcome, not just the value.','For multiple inputs, distinguish Each Choice coverage from all combinations. Count covered partitions over all identified partitions.']},
  exercise('Delivery quantity and service',
   'Delivery quantity is an integer: 1–20 is accepted; smaller and larger quantities are rejected. Service is standard or express; every other service value is rejected. Derive all partitions. Calculate Each Choice coverage for tests (5, standard) and (12, express). Then add the fewest tests that reach 100%, with at most one invalid value per test.',
   'Quantity has three partitions (≤0, 1–20, ≥21); service has three (standard, express, other): six in total. The two tests cover 1–20, standard and express: 3/6 = 50%. Add (0, standard), (21, express) and (5, other). Each new test contains one invalid value, so a rejection can be traced to its cause, and coverage becomes 6/6 = 100%. Each Choice coverage does not test every combination.')
 ],
 'FL-4.2.2':[
  {type:'steps',title:'Derive coverage before choosing test data',items:[
   'State the feasible domain and precision. A possible but rejected input is invalid; a value outside the domain is infeasible.',
   'Identify every ordered equivalence partition, including invalid ones. List each finite minimum and maximum; an unbounded end has no finite extreme.',
   'For 2-value BVA, combine the boundary values of all partitions and remove duplicates. For 3-value BVA, add the immediate predecessor and successor of each boundary value when feasible.',
   'Remove duplicates when partition limits or neighborhoods overlap. Calculate coverage using this derived item set rather than a fixed multiplier.'
  ]},
  {type:'table',headers:['Domain and partitions','2-value set','3-value set'],rows:[
   ['Non-negative integers; 0≤x<10, 10≤x≤50, x>50','0,9,10,50,51','0,1,8,9,10,11,49,50,51,52'],
   ['All integers; x<2, x=2, x>2','1,2,3','0,1,2,3,4']
  ]},
  {type:'note',text:'Compared with the worked example above, a non-negative domain adds the finite minimum 0, and −1 is infeasible. A singleton partition has the same minimum and maximum, so neighborhoods overlap. No fixed six-value or eight-value shortcut is safe: the domain, partitions and requested scope determine the set.'},
  exercise('Price field with two decimals',
   'A price field accepts 0.01 to 99.99 in steps of 0.01. Negative values cannot be entered. 0.00 and every value from 100.00 upward can be entered but are rejected; there is no upper input limit. Identify the partitions, then list the 2-value and 3-value BVA sets.',
   'Partitions: {0.00} invalid, 0.01–99.99 valid, ≥100.00 invalid. The upper invalid partition has no finite maximum. 2-value set: 0.00, 0.01, 99.99, 100.00 (4 values). 3-value set: 0.00, 0.01, 0.02, 99.98, 99.99, 100.00, 100.01 (7 values). −0.01 is infeasible, and overlapping neighbors are counted once.')
 ],
 'FL-4.2.3':[
  {type:'table',headers:['Condition / action','R1','R2','R3','R4'],rows:[
   ['Member','T','T','F','F'],['Qualifying basket','T','F','T','F'],['Give discount','X','','','']
  ]},
  {type:'text',text:'For the rule Member AND Qualifying basket, the two conditions give 2×2 = 4 combinations, so the full table has four columns. A test for member=false, qualifying=false exercises R4 and expects no discount. Testing R1 twice still covers only one distinct rule.'},
  {type:'table',headers:['Condition / action','Reduced R1','Reduced R2','Reduced R3'],rows:[
   ['Member','T','T','F'],['Qualifying basket','T','F','-'],['Give discount','X','','']
  ]},
  {type:'table',headers:['Symbol','Meaning'],rows:[
   ['T / F','The condition is satisfied / not satisfied.'],
   ['-','The condition is irrelevant to the outcome of this rule.'],
   ['N/A','The condition is infeasible for this rule. It is not the same as irrelevant.'],
   ['X / blank','Perform the action / do not perform it.']
  ]},
  {type:'text',text:'When membership is false, the basket condition is irrelevant, so the two full-table columns merge into Reduced R3. Coverage counts the feasible rule columns of the table actually under test; infeasible columns are excluded. Full minimization algorithms are outside CTFL scope.'},
  exercise('Account creation rules',
   'An account is created if the applicant is registered AND (is 18 or older OR has parental consent). Conditions in order: registered, adult, consent. Build the full table, then a reduced table. Which reduced rules do tests (T,T,F) and (F,F,F) cover, and what coverage do they achieve?',
   'Full table: 2³ = 8 rules. An account is created only for (T,T,T), (T,T,F) and (T,F,T). Reduced table, four rules: not registered (others -) → no account; registered and adult (consent -) → create; registered, not adult, consent → create; registered, not adult, no consent → no account. (T,T,F) exercises the registered-and-adult rule and (F,F,F) the not-registered rule: 2/4 = 50%. Add (T,F,T) and (T,F,F) to reach 100% of the reduced table.')
 ],
 'FL-4.2.4':[
  {type:'text',text:'Original guarded example: states Locked and Unlocked. Label syntax is event [guard] / action. From Locked, badge [valid] / release goes to Unlocked; badge [not valid] / recordFailure is a valid self-loop back to Locked. From Unlocked, timeout / engage returns to Locked.'},
  {type:'table',headers:['Current state','badge [valid]','badge [not valid]','timeout'],rows:[
   ['Locked','Unlocked / release','Locked / recordFailure','Invalid'],
   ['Unlocked','Invalid','Invalid','Locked / engage']
  ]},
  {type:'note',text:'The syllabus convention leaves invalid transitions as empty cells; Invalid is written here for readability.'},
  {type:'text',text:'Start Locked: badge(valid), timeout, badge(not valid) covers all three valid transitions, including the self-loop. The rejected badge in Locked is a modeled valid transition, not an invalid transition. The three Invalid cells need separate attempted-event tests if all-transitions coverage is requested; isolate one invalid attempt per test to limit defect masking.'},
  exercise('Coverage of a short test',
   'Using the table above, one test starts Locked and runs badge(valid), then timeout. Calculate all-states, valid-transitions and all-transitions coverage.',
   'States: Locked and Unlocked are both visited, 2/2 = 100%. Valid transitions: release and engage are exercised, but the recordFailure self-loop is not: 2/3 ≈ 67%. All transitions (3 valid + 3 invalid table cells): 2/6 ≈ 33%. Full state coverage does not imply full transition coverage.'),
  exercise('Invalid transitions',
   'Using the table above, design one test for each Invalid cell. Start each test Locked, name its setup sequence and make exactly one invalid attempt. Do not chain invalid events.',
   '(1) No setup; attempt timeout in Locked. (2) badge(valid) to reach Unlocked; attempt badge(valid). (3) badge(valid) to reach Unlocked; attempt badge(not valid). These cover the three invalid cells separately. With the valid-transition sequence above they exercise all six table cells. The state model does not specify error messages: take the expected rejection behavior from the requirements, and do not assume an invalid attempt changes state.')
 ],
 'FL-4.3.1':[
  {type:'text',text:'Trace model: S1 sets fee=0; decision D tests premium; its true outcome executes S2, which sets fee=5; both paths reach S3, which returns fee. The executable statements are S1, D, S2 and S3 (the decision itself counts as a statement). The control-flow graph has four branches: S1→D, D→S2 (true), D→S3 (false) and S2→S3.'},
  exercise('One test, two coverage measures',
   'The only test uses premium=true. Calculate statement coverage and branch coverage for the model above. Which branch is not exercised?',
   'Statements: S1, D, S2 and S3 all execute, 4/4 = 100%. Branches: S1→D, D→S2 and S2→S3 execute, 3/4 = 75%. D→S3 (premium=false) is not exercised. 100% statement coverage does not imply 100% branch coverage. CTFL branch coverage counts every branch in the graph, conditional and unconditional, not only the decision outcomes.')
 ],
 'FL-4.3.2':[
  exercise('Branches versus paths',
   'Decision X tests x>0: true executes A, false executes B. Both continue to decision Y, which tests y>0: true executes C, false executes D. Both end at End. The control-flow graph has eight branches: X→A, X→B, A→Y, B→Y, Y→C, Y→D, C→End, D→End. What branch coverage do tests (1,1) and (−1,−1) achieve? Which routes through the code are never executed?',
   '(1,1) exercises X→A, A→Y, Y→C, C→End; (−1,−1) exercises X→B, B→Y, Y→D, D→End: 8/8 = 100% branch coverage, so every statement also executes. The routes A-then-D and B-then-C are never executed. Full branch coverage does not mean every path has run; path testing is outside CTFL scope. Neither result proves the specified behavior is correct.')
 ],
 'FL-4.5.3':[
  {type:'steps',title:'Derive acceptance cases before implementation',items:['Clarify the story and acceptance criteria with business, development and testing perspectives; resolve ambiguity before inventing expected results.','Derive a normal case, negative cases and any specified non-functional case. State preconditions, inputs and observable postconditions.','Trace each case to a criterion, remove duplicates and avoid adding behavior beyond the story. Automation is optional.']},
  exercise('Order cancellation story',
   'A signed-in customer may cancel their own Pending order; cancellation sets it to Cancelled and restores its reserved stock once. Shipped orders reject cancellation without changing stock. Write two acceptance cases. What does a second cancellation request require you to clarify?',
   'Given a Pending order with 2 reserved units and available stock 8, when its customer cancels, then the status is Cancelled and stock is 10. Given a Shipped order and stock 8, when its customer attempts cancellation, then cancellation is rejected, the status stays Shipped and stock stays 8. The story does not define the response to a repeated request for a Cancelled order: clarify it collaboratively while keeping the once-only stock rule. Do not invent a response code or latency requirement.')
 ],
 'FL-5.1.4':[
  {type:'table',headers:['Technique','Basis','What to do'],rows:[
   ['Ratios','Relevant completed projects','Apply the historical test/development effort ratio to comparable work.'],
   ['Extrapolation','Observations from the current project','Use an explicitly stated model, such as recent comparable iteration means.'],
   ['Wideband Delphi','Independent expert estimates','Collect isolated estimates; discuss when they fall outside the agreed range, re-estimate in isolation and repeat to consensus. Planning Poker is a card-based variant.'],
   ['Three-point','Optimistic, most likely and pessimistic expert estimates','Use the stated weighted mean and spread model; retain assumptions and effort units.']
  ]},
  {type:'note',text:'Technique-selection check: experts first estimate in isolation, discuss estimates outside the agreed range and privately estimate again. This is Wideband Delphi; using numbered effort cards is its Planning Poker variant. Taking a numerical mean of recorded iteration effort is extrapolation, not expert consensus.'},
  exercise('Ratio and three-point estimates',
   'Historical development:test effort is 4:1, and comparable development work is 240 person-hours. A different task has three-point estimates a=3, m=6, b=15 person-days. Calculate the ratio estimate, then E = (a + 4m + b)/6 and SD = (b − a)/6. Keep the units.',
   'Ratio estimate = 240 × 1/4 = 60 person-hours. E = (3 + 24 + 15)/6 = 7 person-days; SD = (15 − 3)/6 = 2 person-days, written as 7 ± 2 person-days (5 to 9). The spread alone is not a guaranteed completion interval. Neither result gives calendar duration without availability, dependencies and other scheduling assumptions.'),
  exercise('Extrapolation',
   'The last three iterations needed 18, 22 and 20 test hours for comparable scope. Using their mean as the model, estimate the next iteration and state one assumption.',
   '(18 + 22 + 20)/3 = 20 test hours. Assumption: the next iteration has comparable scope, team and conditions. If that changes, the extrapolation model no longer applies without adjustment.')
 ],
 'FL-5.1.5':[
  {type:'table',headers:['Test','Covered items','Prerequisite'],rows:[['T1','A, B, C','None'],['T2','A, B','None'],['T3','D, E','T1'],['T4','F','None']]},
  exercise('Additional coverage with a dependency',
   'A test is eligible only after its prerequisite has run. Order the tests in the table above by additional coverage among eligible tests. Break equal contributions by the lower test number.',
   'T1 first (3 new items). T3 becomes eligible and adds 2. T4 adds 1. T2 adds 0. Order: T1, T3, T4, T2. Ordering by total coverage would put T2 ahead of T4; additional coverage must be recalculated after every selection.'),
  exercise('Risk-based order with a dependency',
   'T1 is Low risk. T2 is High risk but needs T3 to run first. T3 is Medium risk. T4 is High risk. At each step, run the highest-risk test whose prerequisite has already run; break equal risk by the lower test number. Derive the order.',
   'T4 first (High and eligible). T2 is High but not yet eligible, so its prerequisite T3 runs next (Medium beats Low). Then T2, then T1. Order: T4, T3, T2, T1. A high-risk test cannot run before a mandatory prerequisite.')
 ],
 'FL-5.5.1':[
  exercise('Report a stock defect',
   'Acceptance criterion AC-3: cancelling a Pending order sets it to Cancelled and restores its reserved stock once. Build 4.2, Chrome 130. You are signed in as the owner of Pending order O17 (2 reserved units; available stock 8). You cancel once. The status becomes Cancelled, but available stock becomes 12. Draft a defect report that another tester can reproduce without asking you questions.',
   'Title: “Cancellation restores reserved stock twice”. Environment: build 4.2, Chrome 130. Preconditions: signed in as owner; O17 Pending, reserved 2, available 8. Steps: open O17 and cancel once. Expected: Cancelled and available stock 10 (AC-3). Actual: Cancelled and available stock 12. Attach timestamped before/after evidence and reference AC-3 and the test identifier. Assess severity from the inventory impact; agree priority with the responsible stakeholders. The tracking tool normally records the ID, reporter, date and initial status: check they are present. The observation does not prove which component caused it.')
 ]
};
