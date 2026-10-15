# Quiz bias audit

24 banks; 81 questions; 0 skewed banks.

Single-select positions: 20 / 20 / 21 / 20. All correct-option positions (includes multi-select): 20 / 20 / 21 / 20.

Heuristic flags: shortest: 10; longest: 28; wrong-absolutes: 20.

Counts use words; longest/shortest exclude ties; detailed means at least twice the longest distractor and at least 8 words. Hints are opt-in before grading; rationales and option explanations are revealed after grading. Stem echo and absolutes are review leads, not factual findings. Anchored detection is deliberately conservative. Skew allows integer rounding for small quizzes, otherwise >40% for four options (1/N + 15 points for others). Multi-select counts measure inclusion, not mutually exclusive outcomes. Archived data_backup directories and data/review design metadata are not loaded by the site.

| Track / bank | Kind | Questions | Single A/B/C/D… | Multi correct-count distribution | All correct positions | Longest / detailed | Flags | Skew |
|---|---|---:|---|---|---|---|---|---|
| PSA / SA-M01 / section-ac1cd615694b / Studio & Integration Decision Simulator | topic | 4 | 1/1/1/1 | {} | 1/1/1/1 | 1 / 0 | shortest: 1, longest: 1 |  |
| PSA / SA-M02 / section-7adc11580ff7 / Spot the Case Life Cycle Flaw | topic | 4 | 1/1/1/1 | {} | 1/1/1/1 | 0 / 0 | shortest: 1, wrong-absolutes: 2 |  |
| PSA / SA-M03 / section-2801e37418f1 / Persona & Access Architecture Decisions | topic | 4 | 1/1/1/1 | {} | 1/1/1/1 | 1 / 0 | longest: 1, shortest: 1, wrong-absolutes: 1 |  |
| PSA / SA-M05 / section-f0700c29066e / Pega GenAI Tool Selector | topic | 4 | 1/1/1/1 | {} | 1/1/1/1 | 1 / 0 | longest: 1 |  |
| PSA / SA-M06 / section-e6d8939a3ee2 / Blueprint Decision Simulator | topic | 4 | 1/1/1/1 | {} | 1/1/1/1 | 1 / 0 | longest: 1, wrong-absolutes: 1, shortest: 1 |  |
| PSA / SA-M07 / section-69c404591e99 / Field Type & View Design Decisions | topic | 4 | 1/1/1/1 | {} | 1/1/1/1 | 2 / 0 | longest: 2, wrong-absolutes: 1 |  |
| PSA / SA-M08 / section-3c45fa685397 / Data Model Design Decisions | topic | 4 | 1/1/1/1 | {} | 1/1/1/1 | 1 / 0 | longest: 1, wrong-absolutes: 1 |  |
| PSA / SA-M09 / section-ca7ea5fe446a / Data Relationship Type Selector | topic | 4 | 1/1/1/1 | {} | 1/1/1/1 | 1 / 0 | longest: 1, wrong-absolutes: 2 |  |
| PSA / SA-M10 / section-dfe0e0dc406b / UI Design: Spot the Flaw | topic | 3 | 1/1/0/1 | {} | 1/1/0/1 | 3 / 0 | longest: 3, wrong-absolutes: 1 |  |
| PSA / SA-M11 / section-531b1bd68360 / Case Status & Guidance Design Decisions | topic | 3 | 1/1/1/0 | {} | 1/1/1/0 | 1 / 0 | wrong-absolutes: 1, longest: 1 |  |
| PSA / SA-M12 / section-5191f4bdeb33 / Routing Design Decisions | topic | 3 | 0/1/1/1 | {} | 0/1/1/1 | 3 / 0 | longest: 3, wrong-absolutes: 1 |  |
| PSA / SA-M13 / section-c6f805c4a3df / Approval Process Design Decisions | topic | 3 | 1/0/1/1 | {} | 1/0/1/1 | 3 / 0 | longest: 3 |  |
| PSA / SA-M14 / section-0e8c17b5fd42 / Cascading approval: pick the right model | topic | 4 | 1/1/1/1 | {} | 1/1/1/1 | 2 / 0 | longest: 2, wrong-absolutes: 2 |  |
| PSA / SA-M15 / section-9ade4377d31b / SLA Configuration Decisions | topic | 3 | 0/1/1/1 | {} | 0/1/1/1 | 1 / 0 | wrong-absolutes: 2, longest: 1 |  |
| PSA / SA-M16 / section-6f23b1fd2922 / Escalation Action Decisions | topic | 3 | 1/1/0/1 | {} | 1/1/0/1 | 1 / 0 | longest: 1, wrong-absolutes: 1 |  |
| PSA / SA-M17 / section-c66304e2e03c / Correspondence Configuration Decisions | topic | 3 | 1/0/1/1 | {} | 1/0/1/1 | 2 / 0 | longest: 2, wrong-absolutes: 1 |  |
| PSA / SA-M18 / section-ada5ef3ae095 / Worklist vs Work Queue Decisions | topic | 3 | 1/1/1/0 | {} | 1/1/1/0 | 0 / 0 |  |  |
| PSA / SA-M19 / section-2139f3f61dc3 / Studio & Role Assignment Decisions | topic | 3 | 1/1/0/1 | {} | 1/1/0/1 | 0 / 0 | shortest: 3, wrong-absolutes: 1 |  |
| PSA / SA-M20 / section-1331275bc537 / Collaboration Tool Matcher | topic | 3 | 1/0/1/1 | {} | 1/0/1/1 | 1 / 0 | shortest: 2, wrong-absolutes: 1, longest: 1 |  |
| PSA / SA-M21 / section-b286d565dc1b / Layer Cake Rule Placement Decisions | topic | 3 | 1/1/1/0 | {} | 1/1/1/0 | 0 / 0 |  |  |
| PSA / SA-M22 / section-ddb427b32976 / Rule Creation & Versioning Decisions | topic | 3 | 0/1/1/1 | {} | 0/1/1/1 | 1 / 0 | shortest: 1, longest: 1 |  |
| PSA / SA-M24 / section-d35136c8b812 / Automation Shape Selector | topic | 3 | 0/1/1/1 | {} | 0/1/1/1 | 0 / 0 |  |  |
| PSA / SA-M25 / section-10d20f518dce / Process Shape & Flow Action Identifier | topic | 3 | 1/1/1/0 | {} | 1/1/1/0 | 1 / 0 | longest: 1 |  |
| PSA / SA-M26 / section-8bf149b2a0a1 / Pick the calculation type | topic | 3 | 1/0/1/1 | {} | 1/0/1/1 | 1 / 0 | longest: 1, wrong-absolutes: 1 |  |

## Track totals

| Track | Questions | Single positions A/B/C/D… | Multi questions | Skewed banks |
|---|---:|---|---:|---:|
| PSA | 81 | 20/20/21/20 | 0 | 0 |

## Per-bank editorial candidates (worst first)

### PSA / SA-M01 / section-ac1cd615694b / Studio & Integration Decision Simulator

- Q3: shortest
- Q4: longest

### PSA / SA-M02 / section-7adc11580ff7 / Spot the Case Life Cycle Flaw

- Q1: shortest
- Q2: wrong-absolutes
- Q3: wrong-absolutes

### PSA / SA-M03 / section-2801e37418f1 / Persona & Access Architecture Decisions

- Q4: shortest, wrong-absolutes
- Q3: longest

### PSA / SA-M05 / section-f0700c29066e / Pega GenAI Tool Selector

- Q1: longest

### PSA / SA-M06 / section-e6d8939a3ee2 / Blueprint Decision Simulator

- Q2: longest, wrong-absolutes
- Q3: shortest

### PSA / SA-M07 / section-69c404591e99 / Field Type & View Design Decisions

- Q2: longest
- Q3: wrong-absolutes
- Q4: longest

### PSA / SA-M08 / section-3c45fa685397 / Data Model Design Decisions

- Q4: longest, wrong-absolutes

### PSA / SA-M09 / section-ca7ea5fe446a / Data Relationship Type Selector

- Q1: longest
- Q2: wrong-absolutes
- Q3: wrong-absolutes

### PSA / SA-M10 / section-dfe0e0dc406b / UI Design: Spot the Flaw

- Q2: longest, wrong-absolutes
- Q1: longest
- Q3: longest

### PSA / SA-M11 / section-531b1bd68360 / Case Status & Guidance Design Decisions

- Q1: wrong-absolutes
- Q2: longest

### PSA / SA-M12 / section-5191f4bdeb33 / Routing Design Decisions

- Q3: longest, wrong-absolutes
- Q1: longest
- Q2: longest

### PSA / SA-M13 / section-c6f805c4a3df / Approval Process Design Decisions

- Q1: longest
- Q2: longest
- Q3: longest

### PSA / SA-M14 / section-0e8c17b5fd42 / Cascading approval: pick the right model

- Q2: longest, wrong-absolutes
- Q1: longest
- Q4: wrong-absolutes

### PSA / SA-M15 / section-9ade4377d31b / SLA Configuration Decisions

- Q2: longest, wrong-absolutes
- Q1: wrong-absolutes

### PSA / SA-M16 / section-6f23b1fd2922 / Escalation Action Decisions

- Q1: longest
- Q3: wrong-absolutes

### PSA / SA-M17 / section-c66304e2e03c / Correspondence Configuration Decisions

- Q3: longest, wrong-absolutes
- Q2: longest

### PSA / SA-M19 / section-2139f3f61dc3 / Studio & Role Assignment Decisions

- Q2: shortest, wrong-absolutes
- Q1: shortest
- Q3: shortest

### PSA / SA-M20 / section-1331275bc537 / Collaboration Tool Matcher

- Q1: shortest, wrong-absolutes
- Q2: longest
- Q3: shortest

### PSA / SA-M22 / section-ddb427b32976 / Rule Creation & Versioning Decisions

- Q1: shortest
- Q3: longest

### PSA / SA-M25 / section-10d20f518dce / Process Shape & Flow Action Identifier

- Q2: longest

### PSA / SA-M26 / section-8bf149b2a0a1 / Pick the calculation type

- Q3: longest, wrong-absolutes

## Complete interactive inventory

- PSA / SA-M01 / section-e2a4f17731d5 / Retrieval Check: retrieval
- PSA / SA-M01 / section-19e16cb55056 / Retrieval Check: retrieval
- PSA / SA-M01 / section-cd19607da167 / Retrieval Check: retrieval
- PSA / SA-M01 / section-01297d19c079 / Retrieval Check: retrieval
- PSA / SA-M01 / section-1045c76ab2be / Practice: match the naming crosswalk: matching
- PSA / SA-M01 / section-ac1cd615694b / Studio & Integration Decision Simulator: topic (4 questions)
- PSA / SA-M02 / section-316d538e9022 / Retrieval Check: retrieval
- PSA / SA-M02 / section-f209fc37ec74 / Retrieval Check: retrieval
- PSA / SA-M02 / section-7adc11580ff7 / Spot the Case Life Cycle Flaw: topic (4 questions)
- PSA / SA-M02 / section-bf24340cde87 / Retrieval Check: retrieval
- PSA / SA-M02 / section-62bd5b9126af / Retrieval Check: retrieval
- PSA / SA-M03 / section-7ef7814436f7 / Retrieval Check: retrieval
- PSA / SA-M03 / section-059815985274 / Retrieval Check: retrieval
- PSA / SA-M03 / section-2801e37418f1 / Persona & Access Architecture Decisions: topic (4 questions)
- PSA / SA-M04 / section-9a18f02676f6 / Retrieval Check: retrieval
- PSA / SA-M04 / section-5fb46e113aae / Retrieval Check: retrieval
- PSA / SA-M04 / section-a2cded2e7065 / Arrange the Five Center-out Principles: ordering
- PSA / SA-M04 / section-0324a4232ef4 / Retrieval Check: retrieval
- PSA / SA-M04 / section-c212ba941159 / Retrieval Check: retrieval
- PSA / SA-M04 / section-be1172ff5f71 / Retrieval Check: retrieval
- PSA / SA-M05 / section-f0700c29066e / Pega GenAI Tool Selector: topic (4 questions)
- PSA / SA-M06 / section-e6d8939a3ee2 / Blueprint Decision Simulator: topic (4 questions)
- PSA / SA-M07 / section-69c404591e99 / Field Type & View Design Decisions: topic (4 questions)
- PSA / SA-M08 / section-3c45fa685397 / Data Model Design Decisions: topic (4 questions)
- PSA / SA-M09 / section-ca7ea5fe446a / Data Relationship Type Selector: topic (4 questions)
- PSA / SA-M10 / section-dfe0e0dc406b / UI Design: Spot the Flaw: topic (3 questions)
- PSA / SA-M11 / section-531b1bd68360 / Case Status & Guidance Design Decisions: topic (3 questions)
- PSA / SA-M12 / section-5191f4bdeb33 / Routing Design Decisions: topic (3 questions)
- PSA / SA-M13 / section-c6f805c4a3df / Approval Process Design Decisions: topic (3 questions)
- PSA / SA-M14 / section-0e8c17b5fd42 / Cascading approval: pick the right model: topic (4 questions)
- PSA / SA-M15 / section-9ade4377d31b / SLA Configuration Decisions: topic (3 questions)
- PSA / SA-M16 / section-6f23b1fd2922 / Escalation Action Decisions: topic (3 questions)
- PSA / SA-M17 / section-c66304e2e03c / Correspondence Configuration Decisions: topic (3 questions)
- PSA / SA-M18 / section-ada5ef3ae095 / Worklist vs Work Queue Decisions: topic (3 questions)
- PSA / SA-M19 / section-2139f3f61dc3 / Studio & Role Assignment Decisions: topic (3 questions)
- PSA / SA-M20 / section-1331275bc537 / Collaboration Tool Matcher: topic (3 questions)
- PSA / SA-M21 / section-b286d565dc1b / Layer Cake Rule Placement Decisions: topic (3 questions)
- PSA / SA-M22 / section-ddb427b32976 / Rule Creation & Versioning Decisions: topic (3 questions)
- PSA / SA-M24 / section-d35136c8b812 / Automation Shape Selector: topic (3 questions)
- PSA / SA-M25 / section-10d20f518dce / Process Shape & Flow Action Identifier: topic (3 questions)
- PSA / SA-M26 / section-8bf149b2a0a1 / Pick the calculation type: topic (3 questions)

Matching already randomizes both sides; ordering already randomizes items. Retrieval checks intentionally disclose model responses only when expanded; they have no multiple-choice answer position. None of these embedded exercises persists option selections or scores to localStorage/SRS/backups.
