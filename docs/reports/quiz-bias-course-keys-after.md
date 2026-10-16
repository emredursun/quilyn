# Quiz bias audit

242 banks; 2844 questions; 0 skewed banks.

Single-select positions: 628 / 633 / 602 / 570 / 0 / 0 / 0 / 0. All correct-option positions (includes multi-select): 841 / 857 / 821 / 784 / 4 / 2 / 1 / 0.

Heuristic flags: longest: 1403; shortest: 321; wrong-absolutes: 760; anchored/letter-reference: 21; detailed: 197; stem-echo: 37.

Counts use words; longest/shortest exclude ties; detailed means at least twice the longest distractor and at least 8 words. Hints are opt-in before grading; rationales and option explanations are revealed after grading. Stem echo and absolutes are review leads, not factual findings. Anchored detection is deliberately conservative. Skew allows integer rounding for small quizzes, otherwise >40% for four options (1/N + 15 points for others). Multi-select counts measure inclusion, not mutually exclusive outcomes. Archived data_backup directories and data/review design metadata are not loaded by the site.

| Track / bank | Kind | Questions | Single A/B/C/D… | Multi correct-count distribution | All correct positions | Longest / detailed | Flags | Skew |
|---|---|---:|---|---|---|---|---|---|
| PBA / BA-M01 | practice | 18 | 4/3/4/3 | {"2":3,"3":1} | 6/6/6/5 | 11 / 0 | longest: 11, shortest: 1, wrong-absolutes: 2 |  |
| PBA / BA-M02 | practice | 21 | 4/4/4/4 | {"2":3,"3":2} | 6/8/7/7 | 15 / 0 | wrong-absolutes: 5, longest: 15, anchored/letter-reference: 1, shortest: 1 |  |
| PBA / BA-M03 | practice | 16 | 3/3/3/3 | {"2":3,"3":1} | 6/5/5/5 | 13 / 2 | longest: 13, anchored/letter-reference: 3, detailed: 2, wrong-absolutes: 1, shortest: 1 |  |
| PBA / BA-M04 | practice | 16 | 3/3/3/3 | {"2":2,"3":2} | 5/6/6/5 | 6 / 0 | longest: 6, wrong-absolutes: 2 |  |
| PBA / BA-M05 | practice | 19 | 5/4/4/4 | {"2":2} | 5/5/5/6 | 11 / 2 | longest: 11, detailed: 2, wrong-absolutes: 1, stem-echo: 1 |  |
| PBA / BA-M06 | practice | 16 | 3/3/3/3 | {"2":3,"3":1} | 5/5/5/6 | 10 / 5 | shortest: 2, longest: 10, wrong-absolutes: 4, detailed: 5 |  |
| PBA / BA-M07 | practice | 13 | 2/3/3/3 | {"2":2} | 4/5/3/3 | 11 / 4 | longest: 11, stem-echo: 2, wrong-absolutes: 5, detailed: 4, shortest: 1 |  |
| PBA / BA-M08 | practice | 20 | 5/4/4/4 | {"2":2,"3":1} | 6/6/6/6 | 14 / 3 | longest: 14, wrong-absolutes: 2, stem-echo: 2, detailed: 3 |  |
| PBA / BA-M09 | practice | 20 | 5/4/5/4 | {"2":2} | 6/5/6/5 | 13 / 2 | longest: 13, detailed: 2, wrong-absolutes: 3, anchored/letter-reference: 1 |  |
| PBA / BA-M10 | practice | 20 | 4/5/4/4 | {"2":3} | 5/6/6/6 | 15 / 5 | longest: 15, detailed: 5, stem-echo: 1, wrong-absolutes: 6 |  |
| PBA / BA-M11 | practice | 15 | 3/4/3/3 | {"2":2} | 4/5/4/4 | 11 / 4 | longest: 11, detailed: 4, wrong-absolutes: 5, stem-echo: 1 |  |
| PBA / BA-M12 | practice | 17 | 4/3/3/3 | {"2":2,"3":2} | 6/7/5/5 | 13 / 2 | longest: 13, detailed: 2, shortest: 1, wrong-absolutes: 4 |  |
| PBA / BA-M13 | practice | 12 | 2/3/3/3 | {"2":1} | 3/3/4/3 | 10 / 4 | longest: 10, detailed: 4, wrong-absolutes: 3 |  |
| PBA / BA-M14 | practice | 12 | 3/3/3/2 | {"2":1} | 3/4/3/3 | 12 / 7 | longest: 12, detailed: 7, wrong-absolutes: 3, stem-echo: 1 |  |
| PBA / BA-M15 | practice | 11 | 2/3/2/3 | {"2":1} | 3/3/3/3 | 8 / 2 | longest: 8, wrong-absolutes: 2, detailed: 2 |  |
| PBA / BA-M16 | practice | 12 | 3/2/2/2 | {"2":2,"3":1} | 4/4/4/4 | 9 / 2 | longest: 9, shortest: 1, detailed: 2 |  |
| PBA / BA-M17 | practice | 9 | 2/2/2/2 | {"2":1} | 3/3/2/2 | 4 / 1 | longest: 4, wrong-absolutes: 3, stem-echo: 1, detailed: 1 |  |
| PBA / BA-M18 | practice | 12 | 3/3/2/2 | {"2":2} | 4/4/3/3 | 10 / 1 | longest: 10, wrong-absolutes: 2, detailed: 1 |  |
| PBA / BA-M19 | practice | 14 | 3/2/3/3 | {"2":3} | 4/4/5/4 | 9 / 4 | longest: 9, shortest: 1, anchored/letter-reference: 1, detailed: 4, wrong-absolutes: 1 |  |
| PSA / SA-M01 | practice | 22 | 4/4/4/5 | {"2":3,"3":2} | 8/7/7/7 | 10 / 0 | shortest: 6, wrong-absolutes: 4, longest: 10 |  |
| PSA / SA-M02 | practice | 21 | 4/4/4/4 | {"2":4,"3":1} | 7/6/7/7 | 9 / 0 | shortest: 6, wrong-absolutes: 7, longest: 9 |  |
| PSA / SA-M03 | practice | 17 | 3/3/3/4 | {"2":4} | 6/5/5/5 | 6 / 0 | longest: 6, shortest: 9, stem-echo: 1, wrong-absolutes: 3 |  |
| PSA / SA-M04 | practice | 16 | 3/3/3/3 | {"2":3,"3":1} | 5/5/6/5 | 4 / 0 | wrong-absolutes: 2, shortest: 5, longest: 4 |  |
| PSA / SA-M05 | practice | 16 | 3/3/3/3 | {"2":3,"3":1} | 5/6/5/5 | 10 / 0 | longest: 10, wrong-absolutes: 4, shortest: 4 |  |
| PSA / SA-M06 | practice | 17 | 4/3/3/3 | {"2":4} | 6/5/5/5 | 7 / 0 | shortest: 4, wrong-absolutes: 4, longest: 7 |  |
| PSA / SA-M07 | practice | 17 | 3/3/3/4 | {"2":4} | 5/5/5/6 | 7 / 0 | longest: 7, shortest: 2, wrong-absolutes: 7 |  |
| PSA / SA-M08 | practice | 18 | 3/4/4/3 | {"2":4} | 6/6/5/5 | 8 / 0 | shortest: 5, wrong-absolutes: 9, longest: 8 |  |
| PSA / SA-M09 | practice | 19 | 3/4/4/4 | {"2":4} | 6/5/6/6 | 11 / 0 | longest: 11, wrong-absolutes: 13, shortest: 5 |  |
| PSA / SA-M10 | practice | 23 | 5/4/4/5 | {"2":5} | 7/7/7/7 | 8 / 0 | longest: 8, wrong-absolutes: 8, shortest: 6 |  |
| PSA / SA-M11 | practice | 17 | 3/3/4/3 | {"2":4} | 5/5/5/6 | 9 / 0 | shortest: 4, longest: 9, wrong-absolutes: 3 |  |
| PSA / SA-M12 | practice | 15 | 3/3/3/3 | {"2":3} | 5/5/4/4 | 10 / 0 | longest: 10, wrong-absolutes: 6, shortest: 2 |  |
| PSA / SA-M13 | practice | 15 | 3/3/3/3 | {"2":3} | 4/5/4/5 | 5 / 0 | longest: 5, shortest: 5, wrong-absolutes: 5 |  |
| PSA / SA-M14 | practice | 14 | 3/3/3/2 | {"2":3} | 4/5/4/4 | 3 / 0 | shortest: 2, wrong-absolutes: 5, longest: 3 |  |
| PSA / SA-M15 | practice | 15 | 3/3/3/3 | {"2":3} | 5/4/5/4 | 10 / 2 | longest: 10, wrong-absolutes: 6, detailed: 2, stem-echo: 2, shortest: 1 |  |
| PSA / SA-M16 | practice | 15 | 3/3/3/3 | {"2":3} | 4/5/5/4 | 6 / 1 | wrong-absolutes: 4, shortest: 3, longest: 6, detailed: 1 |  |
| PSA / SA-M17 | practice | 14 | 3/2/3/3 | {"2":3} | 5/4/4/4 | 12 / 1 | longest: 12, wrong-absolutes: 4, detailed: 1 |  |
| PSA / SA-M18 | practice | 14 | 2/3/3/3 | {"2":3} | 4/4/5/4 | 8 / 5 | shortest: 5, longest: 8, detailed: 5, stem-echo: 1, wrong-absolutes: 2 |  |
| PSA / SA-M19 | practice | 13 | 2/3/2/3 | {"2":3} | 4/4/4/4 | 5 / 0 | longest: 5, wrong-absolutes: 4, stem-echo: 1, shortest: 1 |  |
| PSA / SA-M20 | practice | 14 | 3/2/3/3 | {"2":3} | 4/4/4/5 | 10 / 3 | longest: 10, detailed: 3, wrong-absolutes: 4, stem-echo: 1, shortest: 2 |  |
| PSA / SA-M21 | practice | 16 | 3/3/3/3 | {"2":2,"3":2} | 6/5/5/6 | 6 / 0 | shortest: 4, wrong-absolutes: 3, longest: 6 |  |
| PSA / SA-M22 | practice | 22 | 4/4/5/4 | {"2":5} | 7/7/6/7 | 10 / 0 | longest: 10, wrong-absolutes: 3, shortest: 5 |  |
| PSA / SA-M23 | practice | 12 | 2/3/2/2 | {"2":2,"3":1} | 4/4/4/4 | 8 / 1 | longest: 8, shortest: 2, wrong-absolutes: 6, detailed: 1 |  |
| PSA / SA-M24 | practice | 13 | 4/2/2/2 | {"2":2,"3":1} | 4/5/4/4 | 9 / 0 | longest: 9, wrong-absolutes: 4, shortest: 2, anchored/letter-reference: 1, stem-echo: 1 |  |
| PSA / SA-M25 | practice | 14 | 4/2/3/2 | {"2":3} | 5/4/4/4 | 9 / 0 | longest: 9, wrong-absolutes: 4, shortest: 2, anchored/letter-reference: 1 |  |
| PSA / SA-M26 | practice | 14 | 2/3/3/3 | {"2":3} | 4/4/4/5 | 8 / 0 | longest: 8, wrong-absolutes: 4, shortest: 2, anchored/letter-reference: 1 |  |
| PSA / SA-M27 | practice | 14 | 3/2/3/3 | {"2":3} | 4/4/5/4 | 5 / 0 | wrong-absolutes: 8, shortest: 3, longest: 5, anchored/letter-reference: 2 |  |
| PSA / SA-M28 | practice | 14 | 2/3/3/3 | {"2":3} | 5/4/4/4 | 7 / 0 | longest: 7, wrong-absolutes: 4, shortest: 3 |  |
| PSA / SA-M29 | practice | 14 | 3/3/2/3 | {"2":3} | 4/4/4/5 | 8 / 0 | longest: 8, wrong-absolutes: 3, shortest: 1, anchored/letter-reference: 1 |  |
| PSA / SA-M30 | practice | 14 | 2/3/3/3 | {"2":3} | 4/5/4/4 | 6 / 0 | shortest: 1, longest: 6, wrong-absolutes: 4 |  |
| PSA / SA-M31 | practice | 13 | 2/3/3/2 | {"2":3} | 4/4/4/4 | 6 / 0 | longest: 6, shortest: 2, wrong-absolutes: 3 |  |
| PSA / SA-M32 | practice | 14 | 3/3/2/3 | {"2":3} | 4/4/4/5 | 7 / 0 | longest: 7, wrong-absolutes: 3, shortest: 2 |  |
| PSA / SA-M33 | practice | 15 | 3/3/3/3 | {"2":3} | 5/4/4/5 | 7 / 0 | longest: 7, wrong-absolutes: 2, shortest: 1 |  |
| PSA / SA-M34 | practice | 14 | 2/3/3/3 | {"2":2,"3":1} | 5/4/5/4 | 8 / 1 | longest: 8, shortest: 3, detailed: 1, wrong-absolutes: 1 |  |
| PSA / SA-M35 | practice | 14 | 3/3/2/3 | {"2":3} | 4/5/4/4 | 10 / 0 | longest: 10, wrong-absolutes: 3, shortest: 4, stem-echo: 2 |  |
| PSA / SA-M36 | practice | 13 | 3/3/2/2 | {"2":3} | 4/4/4/4 | 4 / 0 | longest: 4, wrong-absolutes: 6, shortest: 3 |  |
| PSA / SA-M37 | practice | 13 | 2/3/3/2 | {"2":3} | 4/4/4/4 | 5 / 0 | longest: 5, shortest: 2, wrong-absolutes: 3 |  |
| PSA / SA-M38 | practice | 13 | 3/3/2/2 | {"2":3} | 4/4/4/4 | 7 / 1 | wrong-absolutes: 3, longest: 7, stem-echo: 1, detailed: 1, shortest: 2 |  |
| PSA / SA-M39 | practice | 13 | 3/2/2/3 | {"2":3} | 4/4/4/4 | 6 / 0 | longest: 6, wrong-absolutes: 7 |  |
| PSA / SA-M40 | practice | 14 | 3/3/3/2 | {"2":2,"3":1} | 4/4/5/5 | 4 / 0 | shortest: 3, longest: 4, wrong-absolutes: 1 |  |
| PSA / SA-M41 | practice | 15 | 3/3/3/3 | {"2":3} | 5/4/5/4 | 9 / 0 | longest: 9, stem-echo: 1, wrong-absolutes: 1, shortest: 2 |  |
| PSA / SA-M42 | practice | 14 | 3/3/2/3 | {"2":2,"3":1} | 5/4/5/4 | 0 / 0 | wrong-absolutes: 4, shortest: 2 |  |
| PSA / SA-M43 | practice | 14 | 3/3/3/2 | {"2":2,"3":1} | 4/4/5/5 | 5 / 0 | longest: 5, wrong-absolutes: 3, stem-echo: 1, shortest: 3 |  |
| PSA / SA-M44 | practice | 14 | 2/2/3/3 | {"2":4} | 5/4/5/4 | 6 / 0 | longest: 6, shortest: 2, wrong-absolutes: 1 |  |
| PSA / SA-M45 | practice | 15 | 3/3/3/3 | {"2":3} | 5/5/4/4 | 6 / 0 | longest: 6, wrong-absolutes: 1, shortest: 1 |  |
| PSA / SA-M46 | practice | 15 | 3/3/3/3 | {"2":3} | 4/4/5/5 | 6 / 0 | longest: 6, shortest: 2, wrong-absolutes: 2 |  |
| PSA / SA-M47 | practice | 14 | 2/3/3/3 | {"2":2,"3":1} | 4/4/5/5 | 5 / 0 | longest: 5, shortest: 2 |  |
| PSA / SA-M48 | practice | 14 | 2/3/3/3 | {"2":2,"3":1} | 4/5/5/4 | 6 / 0 | longest: 6, wrong-absolutes: 4, shortest: 4 |  |
| PSSA / SSA-M01 | practice | 8 | 2/1/1/2 | {"2":2} | 3/2/2/3 | 2 / 0 | shortest: 2, longest: 2, wrong-absolutes: 2 |  |
| PSSA / SSA-M02 | practice | 8 | 1/2/1/2 | {"2":2} | 2/3/3/2 | 2 / 0 | longest: 2, wrong-absolutes: 4 |  |
| PSSA / SSA-M03 | practice | 8 | 1/2/1/2 | {"2":2} | 3/2/2/3 | 1 / 0 | wrong-absolutes: 3, longest: 1, stem-echo: 1, shortest: 2 |  |
| PSSA / SSA-M04 | practice | 8 | 2/2/2/1 | {"2":1} | 2/3/2/2 | 2 / 0 | longest: 2, wrong-absolutes: 5 |  |
| PSSA / SSA-M05 | practice | 8 | 1/2/2/2 | {"2":1} | 2/3/2/2 | 2 / 0 | wrong-absolutes: 5, longest: 2, shortest: 1 |  |
| PSSA / SSA-M06 | practice | 8 | 2/2/1/1 | {"2":2} | 3/3/2/2 | 4 / 1 | longest: 4, wrong-absolutes: 4, shortest: 3, detailed: 1 |  |
| PSSA / SSA-M07 | practice | 8 | 2/2/2/1 | {"2":1} | 3/2/2/2 | 1 / 0 | longest: 1, wrong-absolutes: 2, shortest: 1 |  |
| PSSA / SSA-M08 | practice | 8 | 2/2/2/1 | {"2":1} | 2/2/3/2 | 1 / 0 | shortest: 1, longest: 1 |  |
| PSSA / SSA-M09 | practice | 8 | 2/2/2/1 | {"2":1} | 2/2/3/2 | 5 / 0 | longest: 5, wrong-absolutes: 3 |  |
| PSSA / SSA-M10 | practice | 8 | 2/1/2/2 | {"2":1} | 2/2/2/3 | 4 / 0 | shortest: 3, wrong-absolutes: 5, longest: 4 |  |
| PSSA / SSA-M11 | practice | 8 | 2/2/1/2 | {"2":1} | 3/2/2/2 | 3 / 0 | shortest: 4, wrong-absolutes: 3, longest: 3 |  |
| PSSA / SSA-M12 | practice | 8 | 2/2/2/1 | {"2":1} | 3/2/2/2 | 2 / 0 | longest: 2, wrong-absolutes: 3, shortest: 1 |  |
| PSSA / SSA-M13 | practice | 8 | 2/2/2/1 | {"2":1} | 2/3/2/2 | 5 / 0 | shortest: 2, longest: 5, wrong-absolutes: 3 |  |
| PSSA / SSA-M14 | practice | 8 | 1/2/2/2 | {"2":1} | 2/2/3/2 | 6 / 1 | longest: 6, shortest: 1, wrong-absolutes: 4, detailed: 1 |  |
| PSSA / SSA-M15 | practice | 8 | 2/2/2/1 | {"2":1} | 2/3/2/2 | 1 / 0 | shortest: 4, wrong-absolutes: 4, longest: 1 |  |
| PSSA / SSA-M16 | practice | 8 | 2/2/2/1 | {"2":1} | 2/3/2/2 | 2 / 1 | longest: 2, detailed: 1, shortest: 2, wrong-absolutes: 2 |  |
| PSSA / SSA-M17 | practice | 10 | 2/3/2/2 | {"2":1} | 2/3/3/3 | 5 / 0 | shortest: 1, wrong-absolutes: 4, longest: 5 |  |
| PSSA / SSA-M18 | practice | 8 | 1/2/1/2 | {"2":2} | 2/3/2/3 | 3 / 0 | longest: 3, wrong-absolutes: 5, shortest: 2 |  |
| PSSA / SSA-M19 | practice | 8 | 2/2/1/2 | {"2":1} | 2/3/2/2 | 5 / 0 | longest: 5, wrong-absolutes: 4, shortest: 1 |  |
| PSSA / SSA-M20 | practice | 8 | 2/1/2/2 | {"2":1} | 3/2/2/2 | 3 / 1 | shortest: 4, longest: 3, wrong-absolutes: 4, detailed: 1 |  |
| PSSA / SSA-M21 | practice | 8 | 2/2/1/2 | {"2":1} | 2/3/2/2 | 2 / 0 | shortest: 3, wrong-absolutes: 5, longest: 2 |  |
| PSSA / SSA-M22 | practice | 8 | 1/2/2/2 | {"2":1} | 2/3/2/2 | 4 / 1 | longest: 4, detailed: 1, wrong-absolutes: 5, shortest: 2 |  |
| PSSA / SSA-M23 | practice | 8 | 2/2/1/2 | {"2":1} | 3/2/2/2 | 3 / 1 | shortest: 3, wrong-absolutes: 5, longest: 3, detailed: 1 |  |
| PSSA / SSA-M24 | practice | 8 | 2/1/2/2 | {"2":1} | 3/2/2/2 | 6 / 1 | longest: 6, wrong-absolutes: 5, detailed: 1 |  |
| PSSA / SSA-M25 | practice | 9 | 2/2/2/2 | {"2":1} | 3/2/3/2 | 3 / 0 | wrong-absolutes: 4, longest: 3, shortest: 2 |  |
| TAS1 / TAS1-M00 | practice | 8 | 2/1/2/2 | {"3":1} | 3/2/3/2 | 6 / 0 | longest: 6, wrong-absolutes: 3, shortest: 1, anchored/letter-reference: 1 |  |
| TAS1 / TAS1-M01 | practice | 10 | 2/2/2/3 | {"3":1} | 3/3/3/3 | 5 / 0 | longest: 5, wrong-absolutes: 4, shortest: 2 |  |
| TAS1 / TAS1-M02 | practice | 12 | 3/2/3/2/0/0/0/0 | {"3":1,"5":1} | 5/4/3/3/1/1/1/0 | 6 / 0 | longest: 6, wrong-absolutes: 5, shortest: 1 |  |
| TAS1 / TAS1-M03 | practice | 19 | 3/6/4/3/0 | {"2":2,"3":1} | 5/8/5/5/0 | 3 / 0 | longest: 3, wrong-absolutes: 2, shortest: 2, anchored/letter-reference: 1 |  |
| TAS1 / TAS1-M04 | practice | 6 | 2/1/1/2 | {} | 2/1/1/2 | 2 / 0 | longest: 2, shortest: 2, wrong-absolutes: 1 |  |
| TAS1 / TAS1-M05 | practice | 6 | 1/2/1/2 | {} | 1/2/1/2 | 2 / 1 | longest: 2, detailed: 1 |  |
| TAS1 / TAS1-M06 | practice | 5 | 1/2/1/1 | {} | 1/2/1/1 | 2 / 0 | shortest: 1, longest: 2, wrong-absolutes: 1 |  |
| TAS1 / TAS1-M07 | practice | 11 | 3/3/3/2 | {} | 3/3/3/2 | 5 / 0 | longest: 5, wrong-absolutes: 2 |  |
| TAS1 / TAS1-M08 | practice | 13 | 3/3/3/3 | {"2":1} | 3/3/4/4 | 9 / 1 | longest: 9, wrong-absolutes: 2, shortest: 3, detailed: 1, anchored/letter-reference: 1 |  |
| TAS1 / TAS1-M09 | practice | 20 | 5/5/5/5 | {} | 5/5/5/5 | 11 / 2 | longest: 11, detailed: 2, wrong-absolutes: 1, stem-echo: 1 |  |
| TAS1 / TAS1-M10 | practice | 0 |  | {} |  | 0 / 0 |  |  |
| TAS2 / TAS2-M00 | practice | 5 | 1/1/1/2 | {} | 1/1/1/2 | 4 / 0 | longest: 4, wrong-absolutes: 1 |  |
| TAS2 / TAS2-M01 | practice | 8 | 2/2/2/2 | {} | 2/2/2/2 | 5 / 0 | longest: 5, wrong-absolutes: 5 |  |
| TAS2 / TAS2-M02 | practice | 7 | 2/2/2/1 | {} | 2/2/2/1 | 3 / 0 | longest: 3, wrong-absolutes: 1 |  |
| TAS2 / TAS2-M03 | practice | 7 | 2/1/1/2 | {"3":1} | 2/2/2/3 | 4 / 1 | longest: 4, wrong-absolutes: 2, detailed: 1 |  |
| TAS2 / TAS2-M04 | practice | 7 | 2/1/2/2 | {} | 2/1/2/2 | 4 / 0 | longest: 4, wrong-absolutes: 4, shortest: 1 |  |
| TAS2 / TAS2-M05 | practice | 7 | 2/2/1/2 | {} | 2/2/1/2 | 3 / 0 | shortest: 1, wrong-absolutes: 4, longest: 3 |  |
| TAS2 / TAS2-M06 | practice | 8 | 2/2/1/2 | {"3":1} | 3/2/2/3 | 5 / 1 | longest: 5, detailed: 1 |  |
| TAS2 / TAS2-M07 | practice | 10 | 3/2/3/2 | {} | 3/2/3/2 | 4 / 0 | shortest: 1, wrong-absolutes: 3, longest: 4, stem-echo: 1 |  |
| TAS2 / TAS2-M08 | practice | 11 | 3/3/3/2 | {} | 3/3/3/2 | 7 / 0 | longest: 7, wrong-absolutes: 2 |  |
| TAS2 / TAS2-M09 | practice | 6 | 1/2/2/1 | {} | 1/2/2/1 | 3 / 0 | longest: 3, wrong-absolutes: 1 |  |
| TAS2 / TAS2-M10 | practice | 0 |  | {} |  | 0 / 0 |  |  |
| TAPI / TAPI-M00 | practice | 5 | 1/1/1/2 | {} | 1/1/1/2 | 3 / 0 | shortest: 1, wrong-absolutes: 3, longest: 3 |  |
| TAPI / TAPI-M01 | practice | 5 | 2/1/1/1 | {} | 2/1/1/1 | 4 / 0 | wrong-absolutes: 5, longest: 4 |  |
| TAPI / TAPI-M02 | practice | 5 | 1/1/2/1 | {} | 1/1/2/1 | 2 / 0 | wrong-absolutes: 3, longest: 2 |  |
| TAPI / TAPI-M03 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 3 / 0 | longest: 3, wrong-absolutes: 2 |  |
| TAPI / TAPI-M04 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 2 / 0 | longest: 2, wrong-absolutes: 2 |  |
| TAPI / TAPI-M05 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 3 / 0 | longest: 3, wrong-absolutes: 3 |  |
| TAPI / TAPI-M06 | practice | 9 | 3/2/2/2 | {} | 3/2/2/2 | 6 / 1 | longest: 6, wrong-absolutes: 5, detailed: 1 |  |
| TAPI / TAPI-M07 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 3 / 1 | longest: 3, wrong-absolutes: 3, detailed: 1 |  |
| TAPI / TAPI-M08 | practice | 5 | 2/1/1/1 | {} | 2/1/1/1 | 4 / 2 | longest: 4, detailed: 2, wrong-absolutes: 2 |  |
| TAPI / TAPI-M09 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 2 / 0 | wrong-absolutes: 4, longest: 2 |  |
| TAPI / TAPI-M10 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 1 / 0 | longest: 1, wrong-absolutes: 2 |  |
| TAPI / TAPI-M11 | practice | 3 | 1/0/1/1 | {} | 1/0/1/1 | 3 / 2 | longest: 3, detailed: 2, wrong-absolutes: 2 |  |
| TAPI / TAPI-M12 | practice | 3 | 1/1/1/0 | {} | 1/1/1/0 | 2 / 2 | longest: 2, detailed: 2, wrong-absolutes: 3 |  |
| TAPI / TAPI-M13 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 1 / 0 | wrong-absolutes: 2, longest: 1 |  |
| TDS1 / TDS1-M00 | practice | 3 | 1/0/1/1 | {} | 1/0/1/1 | 2 / 0 | wrong-absolutes: 2, longest: 2 |  |
| TDS1 / TDS1-M01 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 3 / 0 | longest: 3, wrong-absolutes: 2 |  |
| TDS1 / TDS1-M02 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 1 / 0 | wrong-absolutes: 1, longest: 1 |  |
| TDS1 / TDS1-M03 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 3 / 0 | longest: 3, wrong-absolutes: 2 |  |
| TDS1 / TDS1-M04 | practice | 5 | 1/1/2/1 | {} | 1/1/2/1 | 2 / 0 | longest: 2, wrong-absolutes: 1 |  |
| TDS1 / TDS1-M05 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 4 / 0 | longest: 4, wrong-absolutes: 1 |  |
| TDS1 / TDS1-M06 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 2 / 0 | longest: 2, wrong-absolutes: 3 |  |
| TDS1 / TDS1-M07 | practice | 3 | 1/1/1/0 | {} | 1/1/1/0 | 0 / 0 |  |  |
| TDS1 / TDS1-M08 | practice | 3 | 0/1/1/1 | {} | 0/1/1/1 | 3 / 0 | longest: 3, wrong-absolutes: 1 |  |
| TDS1 / TDS1-M09 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 3 / 0 | longest: 3, wrong-absolutes: 2 |  |
| TDS1 / TDS1-M10 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 0 / 0 | wrong-absolutes: 1 |  |
| TDS1 / TDS1-M11 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 2 / 0 | longest: 2, wrong-absolutes: 1 |  |
| TDS2 / TDS2-M00 | practice | 3 | 1/1/1/0 | {} | 1/1/1/0 | 2 / 0 | longest: 2, wrong-absolutes: 1 |  |
| TDS2 / TDS2-M01 | practice | 3 | 0/1/1/1 | {} | 0/1/1/1 | 2 / 0 | longest: 2, stem-echo: 1 |  |
| TDS2 / TDS2-M02 | practice | 3 | 1/1/0/1 | {} | 1/1/0/1 | 1 / 1 | longest: 1, detailed: 1, wrong-absolutes: 1 |  |
| TDS2 / TDS2-M03 | practice | 3 | 1/0/1/1 | {} | 1/0/1/1 | 3 / 1 | longest: 3, wrong-absolutes: 1, detailed: 1 |  |
| TDS2 / TDS2-M04 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 2 / 1 | longest: 2, detailed: 1, wrong-absolutes: 1 |  |
| TDS2 / TDS2-M05 | practice | 3 | 0/1/1/1 | {} | 0/1/1/1 | 0 / 0 |  |  |
| TDS2 / TDS2-M06 | practice | 3 | 1/1/1/0 | {} | 1/1/1/0 | 2 / 0 | longest: 2, wrong-absolutes: 1 |  |
| AE1 / AE1-M00 | practice | 3 | 1/0/1/1 | {} | 1/0/1/1 | 1 / 0 | longest: 1, wrong-absolutes: 2 |  |
| AE1 / AE1-M01 | practice | 8 | 2/2/2/2 | {} | 2/2/2/2 | 4 / 0 | longest: 4, wrong-absolutes: 3 |  |
| AE1 / AE1-M02 | practice | 5 | 1/2/1/1 | {} | 1/2/1/1 | 1 / 0 | longest: 1, wrong-absolutes: 1 |  |
| AE1 / AE1-M03 | practice | 5 | 1/1/1/1 | {"3":1} | 2/1/2/2 | 4 / 1 | longest: 4, detailed: 1, wrong-absolutes: 2 |  |
| AE1 / AE1-M04 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 1 / 0 | wrong-absolutes: 3, longest: 1 |  |
| AE1 / AE1-M05 | practice | 7 | 2/2/1/2 | {} | 2/2/1/2 | 4 / 0 | longest: 4, wrong-absolutes: 1 |  |
| AE1 / AE1-M06 | practice | 5 | 2/1/1/1 | {} | 2/1/1/1 | 4 / 1 | longest: 4, wrong-absolutes: 1, detailed: 1, stem-echo: 1 |  |
| AE1 / AE1-M07 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 4 / 1 | longest: 4, detailed: 1, wrong-absolutes: 2 |  |
| AE1 / AE1-M08 | practice | 20 | 5/5/5/5 | {} | 5/5/5/5 | 7 / 1 | longest: 7, wrong-absolutes: 3, shortest: 2, detailed: 1 |  |
| AE1 / AE1-M09 | practice | 5 | 1/1/1/1 | {"3":1} | 1/2/2/2 | 4 / 0 | longest: 4, wrong-absolutes: 2 |  |
| AE1 / AE1-M10 | practice | 5 | 1/1/1/2 | {} | 1/1/1/2 | 3 / 1 | longest: 3, wrong-absolutes: 3, detailed: 1 |  |
| AE1 / AE1-M11 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 4 / 2 | longest: 4, detailed: 2, wrong-absolutes: 1 |  |
| AE1 / AE1-M12 | practice | 5 | 2/1/1/1 | {} | 2/1/1/1 | 3 / 1 | wrong-absolutes: 2, longest: 3, detailed: 1, stem-echo: 1 |  |
| TMOB / TMOB-M00 | practice | 3 | 1/1/0/1 | {} | 1/1/0/1 | 2 / 0 | longest: 2, wrong-absolutes: 2 |  |
| TMOB / TMOB-M01 | practice | 6 | 1/1/2/1 | {"3":1} | 2/2/2/2 | 3 / 1 | longest: 3, shortest: 1, detailed: 1, wrong-absolutes: 3 |  |
| TMOB / TMOB-M02 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 1 / 0 | shortest: 1, wrong-absolutes: 1, longest: 1 |  |
| TMOB / TMOB-M03 | practice | 4 | 1/1/0/1 | {"3":1} | 1/2/1/2 | 2 / 0 | longest: 2, wrong-absolutes: 1 |  |
| TMOB / TMOB-M04 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 3 / 0 | longest: 3, wrong-absolutes: 2, stem-echo: 1 |  |
| TMOB / TMOB-M05 | practice | 10 | 2/2/2/2/0 | {"3":2} | 2/4/4/4/0 | 4 / 0 | shortest: 1, wrong-absolutes: 2, longest: 4 |  |
| TMOB / TMOB-M06 | practice | 10 | 2/2/2/3 | {"2":1} | 2/3/3/3 | 5 / 0 | longest: 5, shortest: 1, wrong-absolutes: 2 |  |
| TMOB / TMOB-M07 | practice | 5 | 1/1/1/1 | {"3":1} | 2/2/1/2 | 4 / 0 | longest: 4, wrong-absolutes: 1, shortest: 1 |  |
| TMOB / TMOB-M08 | practice | 5 | 1/2/1/1 | {} | 1/2/1/1 | 3 / 0 | longest: 3, shortest: 1 |  |
| TMOB / TMOB-M09 | practice | 3 | 1/1/0/1 | {} | 1/1/0/1 | 2 / 0 | longest: 2, stem-echo: 1, wrong-absolutes: 1 |  |
| TMOB / TMOB-M10 | practice | 3 | 0/1/1/0 | {"3":1} | 1/1/2/1 | 2 / 0 | longest: 2, shortest: 1, wrong-absolutes: 1 |  |
| TMOB / TMOB-M11 | practice | 5 | 1/1/1/1 | {"3":1} | 2/1/2/2 | 4 / 0 | longest: 4, wrong-absolutes: 1 |  |
| TMOB / TMOB-M12 | practice | 5 | 1/1/1/1/0 | {"3":1} | 1/2/2/2/0 | 4 / 1 | longest: 4, wrong-absolutes: 1, shortest: 1, detailed: 1 |  |
| TMOB / TMOB-M13 | practice | 3 | 1/1/0/0 | {"3":1} | 1/2/1/1 | 1 / 0 | longest: 1 |  |
| TMOB / TMOB-M14 | practice | 3 | 1/0/1/1 | {} | 1/0/1/1 | 3 / 0 | longest: 3, wrong-absolutes: 1 |  |
| TMOB / TMOB-M15 | practice | 3 | 1/1/0/1 | {} | 1/1/0/1 | 2 / 1 | longest: 2, detailed: 1, wrong-absolutes: 1 |  |
| TMOB / TMOB-M16 | practice | 3 | 0/1/1/1 | {} | 0/1/1/1 | 1 / 1 | longest: 1, detailed: 1, wrong-absolutes: 1 |  |
| TMOB / TMOB-M17 | practice | 2 | 0/1/0/1 | {} | 0/1/0/1 | 1 / 0 | wrong-absolutes: 2, longest: 1 |  |
| TESTIM / TESTIM-M00 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 3 / 0 | longest: 3, wrong-absolutes: 1 |  |
| TESTIM / TESTIM-M01 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 2 / 0 | wrong-absolutes: 1, longest: 2, shortest: 1 |  |
| TESTIM / TESTIM-M02 | practice | 16 | 4/5/4/3 | {} | 4/5/4/3 | 5 / 0 | longest: 5, wrong-absolutes: 2 |  |
| TESTIM / TESTIM-M03 | practice | 10 | 3/3/2/2 | {} | 3/3/2/2 | 5 / 0 | longest: 5, wrong-absolutes: 2, shortest: 1 |  |
| TESTIM / TESTIM-M04 | practice | 5 | 1/2/1/1 | {} | 1/2/1/1 | 0 / 0 | wrong-absolutes: 2 |  |
| TESTIM / TESTIM-M05 | practice | 8 | 2/2/2/2 | {} | 2/2/2/2 | 4 / 0 | longest: 4, wrong-absolutes: 1 |  |
| TESTIM / TESTIM-M06 | practice | 8 | 2/2/1/1/0 | {"2":2} | 4/2/2/2/0 | 3 / 0 | longest: 3, shortest: 1 |  |
| TESTIM / TESTIM-M07 | practice | 5 | 2/1/1/1 | {} | 2/1/1/1 | 3 / 0 | wrong-absolutes: 5, longest: 3 |  |
| TESTIM / TESTIM-M08 | practice | 5 | 1/2/1/1 | {} | 1/2/1/1 | 2 / 0 | longest: 2, wrong-absolutes: 2 |  |
| TESTIM / TESTIM-M09 | practice | 6 | 1/1/2/2 | {} | 1/1/2/2 | 5 / 1 | longest: 5, detailed: 1, wrong-absolutes: 1 |  |
| TESTIM / TESTIM-M10 | practice | 5 | 1/1/2/1 | {} | 1/1/2/1 | 3 / 0 | longest: 3, wrong-absolutes: 2 |  |
| TESTIM / TESTIM-M11 | practice | 3 | 1/1/0/1 | {} | 1/1/0/1 | 2 / 0 | longest: 2, wrong-absolutes: 1 |  |
| TESTIM / TESTIM-M12 | practice | 3 | 1/1/0/1 | {} | 1/1/0/1 | 1 / 0 | longest: 1 |  |
| TESTIM / TESTIM-M13 | practice | 5 | 1/1/2/1 | {} | 1/1/2/1 | 2 / 0 | longest: 2 |  |
| TESTIM / TESTIM-M14 | practice | 5 | 1/1/2/1 | {} | 1/1/2/1 | 5 / 0 | longest: 5, wrong-absolutes: 3, stem-echo: 1 |  |
| TESTIM / TESTIM-M15 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 3 / 2 | longest: 3, detailed: 2, wrong-absolutes: 4 |  |
| TESTIM / TESTIM-M16 | practice | 3 | 1/0/0/1 | {"2":1} | 1/1/1/1 | 1 / 0 | longest: 1 |  |
| TESTIM / TESTIM-M17 | practice | 5 | 1/2/1/1 | {} | 1/2/1/1 | 1 / 0 | wrong-absolutes: 3, longest: 1, shortest: 1 |  |
| TESTIM / TESTIM-M18 | practice | 3 | 1/0/1/1 | {} | 1/0/1/1 | 1 / 0 | longest: 1 |  |
| TESTIM / TESTIM-M19 | practice | 3 | 1/1/1/0 | {} | 1/1/1/0 | 2 / 2 | longest: 2, detailed: 2, wrong-absolutes: 2, shortest: 1 |  |
| TESTIM / TESTIM-M20 | practice | 5 | 1/1/2/1 | {} | 1/1/2/1 | 3 / 0 | longest: 3, wrong-absolutes: 2, shortest: 1 |  |
| TESTIM / TESTIM-M21 | practice | 3 | 0/1/1/1 | {} | 0/1/1/1 | 1 / 0 | wrong-absolutes: 2, longest: 1 |  |
| TESTIM / TESTIM-M22 | practice | 3 | 2/1/0/0 | {} | 2/1/0/0 | 0 / 0 |  |  |
| TESTIM / TESTIM-M23 | practice | 5 | 1/2/1/1 | {} | 1/2/1/1 | 4 / 3 | longest: 4, detailed: 3, wrong-absolutes: 3 |  |
| TESTIM / TESTIM-M24 | practice | 5 | 1/1/2/1 | {} | 1/1/2/1 | 2 / 0 | longest: 2, wrong-absolutes: 1 |  |
| TESTIM / TESTIM-M25 | practice | 5 | 1/1/1/2 | {} | 1/1/1/2 | 1 / 0 | shortest: 1, wrong-absolutes: 3, longest: 1 |  |
| TESTIM / TESTIM-M26 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 3 / 0 | longest: 3, wrong-absolutes: 2 |  |
| TESTIM / TESTIM-M27 | practice | 4 | 2/2/0/0 | {} | 2/2/0/0 | 0 / 0 | shortest: 2 |  |
| TESTIM / TESTIM-M28 | practice | 4 | 1/0/1/1 | {"2":1} | 1/1/1/2 | 1 / 0 | wrong-absolutes: 3, longest: 1 |  |
| TESTIM / TESTIM-M29 | practice | 3 | 1/1/1/0 | {} | 1/1/1/0 | 2 / 0 | shortest: 1, wrong-absolutes: 1, longest: 2 |  |
| TESTIM / TESTIM-M30 | practice | 3 | 1/1/0/1 | {} | 1/1/0/1 | 3 / 0 | longest: 3, wrong-absolutes: 1 |  |
| TESTIM / TESTIM-M31 | practice | 4 | 1/1/1/1 | {} | 1/1/1/1 | 1 / 0 | wrong-absolutes: 3, longest: 1 |  |
| PSA / Mock Exam 1 | mock | 60 | 9/10/12/14 | {"2":15} | 18/14/21/22 | 29 / 11 | longest: 29, detailed: 11, shortest: 2, wrong-absolutes: 9, stem-echo: 2 |  |
| PSA / Mock Exam 2 | mock | 60 | 7/13/15/14 | {"2":11} | 11/19/20/21 | 33 / 9 | longest: 33, wrong-absolutes: 11, detailed: 9 |  |
| PSA / Mock Exam 3 | mock | 60 | 16/14/9/8 | {"2":13} | 21/23/16/13 | 30 / 10 | longest: 30, wrong-absolutes: 12, stem-echo: 2, shortest: 2, detailed: 10 |  |
| PSA / Mock Exam 4 | mock | 60 | 11/20/17/7 | {"2":5} | 11/23/21/10 | 11 / 0 | shortest: 5, longest: 11, anchored/letter-reference: 1, wrong-absolutes: 1 |  |
| PSA / Mock Exam 5 | mock | 60 | 15/10/12/8/0 | {"2":14,"3":1} | 21/20/17/17/1 | 27 / 1 | longest: 27, detailed: 1, wrong-absolutes: 8, shortest: 5 |  |
| PSA / Mock Exam 6 | mock | 60 | 17/11/9/8 | {"2":13,"3":2} | 23/22/19/13 | 20 / 0 | longest: 20, shortest: 11, wrong-absolutes: 2 |  |
| PBA / Mock Exam 1 | mock | 50 | 11/8/8/16 | {"2":7} | 14/10/14/19 | 28 / 6 | longest: 28, detailed: 6, wrong-absolutes: 4 |  |
| PBA / Mock Exam 2 | mock | 50 | 13/10/14/6 | {"2":7} | 19/14/17/7 | 32 / 9 | longest: 32, wrong-absolutes: 10, detailed: 9, shortest: 1 |  |
| PBA / Mock Exam 3 | mock | 50 | 13/9/10/10 | {"2":8} | 17/12/13/16 | 34 / 8 | longest: 34, detailed: 8, wrong-absolutes: 5, shortest: 1 |  |
| TAS1 / Mock Exam 1 | mock | 5 | 1/1/2/1 | {} | 1/1/2/1 | 1 / 0 | shortest: 1, longest: 1, wrong-absolutes: 1 |  |
| TAS2 / Mock Exam 1 | mock | 5 | 1/1/0/1 | {"2":1,"3":1} | 2/2/2/2 | 2 / 0 | longest: 2, shortest: 1 |  |
| TAPI / Mock Exam 1 | mock | 5 | 1/2/1/1 | {} | 1/2/1/1 | 4 / 0 | longest: 4, wrong-absolutes: 3 |  |
| TAPI / Mock Exam 2 | mock | 5 | 1/1/1/1/0/0 | {"3":1} | 2/2/1/1/0/1 | 2 / 0 | longest: 2, wrong-absolutes: 1 |  |
| TAPI / Mock Exam 3 | mock | 5 | 1/1/1/1 | {"3":1} | 2/1/2/2 | 2 / 0 | longest: 2, shortest: 1 |  |
| TAPI / Mock Exam 4 | mock | 4 | 1/1/1/0 | {"2":1} | 1/2/1/1 | 0 / 0 | shortest: 1 |  |
| TAPI / Mock Exam 5 | mock | 5 | 1/1/1/1 | {"2":1} | 1/2/1/2 | 2 / 0 | longest: 2, shortest: 2, wrong-absolutes: 1 |  |
| TAPI / Mock Exam 6 | mock | 5 | 1/2/1/1 | {} | 1/2/1/1 | 2 / 1 | longest: 2, wrong-absolutes: 1, detailed: 1, stem-echo: 1 |  |
| TDS1 / Mock Exam 1 | mock | 5 | 0/1/1/1 | {"2":1,"3":1} | 2/2/1/3 | 4 / 0 | longest: 4 |  |
| TDS2 / Mock Exam 1 | mock | 5 | 1/2/1/1 | {} | 1/2/1/1 | 2 / 0 | wrong-absolutes: 2, longest: 2, stem-echo: 1 |  |
| AE1 / Mock Exam 1 | mock | 5 | 1/1/0/1 | {"2":2} | 1/3/1/2 | 4 / 0 | wrong-absolutes: 2, longest: 4, shortest: 1 |  |
| TMOB / Mock Exam 1 | mock | 10 | 2/3/2/2 | {"3":1} | 3/3/3/3 | 5 / 1 | longest: 5, detailed: 1, shortest: 1 |  |
| TMOB / Mock Exam 2 | mock | 7 | 2/2/1/2 | {} | 2/2/1/2 | 7 / 2 | longest: 7, detailed: 2 |  |
| TMOB / Mock Exam 3 | mock | 8 | 2/2/2/2 | {} | 2/2/2/2 | 7 / 4 | longest: 7, detailed: 4, wrong-absolutes: 1 |  |
| TESTIM / Mock Exam 1 | mock | 32 | 9/8/8/7 | {} | 9/8/8/7 | 16 / 2 | longest: 16, wrong-absolutes: 12, anchored/letter-reference: 1, detailed: 2 |  |
| TESTIM / Mock Exam 2 | mock | 32 | 8/8/7/7 | {"2":2} | 9/10/7/8 | 16 / 2 | longest: 16, detailed: 2, shortest: 5, wrong-absolutes: 5 |  |
| TESTIM / Mock Exam 3 | mock | 32 | 8/8/8/7/0 | {"2":1} | 8/8/8/8/1 | 15 / 6 | longest: 15, wrong-absolutes: 11, detailed: 6, shortest: 1 |  |
| TESTIM / Mock Exam 4 | mock | 31 | 8/8/7/7 | {"2":1} | 9/8/7/8 | 20 / 5 | wrong-absolutes: 13, longest: 20, detailed: 5, shortest: 3 |  |
| TESTIM / Mock Exam 5 | mock | 31 | 8/9/7/7 | {} | 8/9/7/7 | 11 / 3 | wrong-absolutes: 8, longest: 11, shortest: 1, detailed: 3 |  |
| TESTIM / Mock Exam 6 | mock | 55 | 20/18/9/4/0 | {"2":3,"3":1} | 23/19/10/7/1 | 16 / 0 | longest: 16, shortest: 4, wrong-absolutes: 8, anchored/letter-reference: 4 |  |
| PSSA / Mock Exam 1 | mock | 60 | 12/12/13/13 | {"2":10} | 18/18/19/15 | 19 / 1 | shortest: 19, wrong-absolutes: 25, longest: 19, detailed: 1 |  |
| PSSA / Mock Exam 2 | mock | 60 | 8/13/18/14 | {"2":7} | 11/18/22/16 | 24 / 3 | shortest: 11, wrong-absolutes: 20, longest: 24, detailed: 3, stem-echo: 1 |  |
| PSSA / Mock Exam 3 | mock | 60 | 14/15/13/8 | {"2":10} | 19/20/18/13 | 21 / 4 | wrong-absolutes: 33, shortest: 10, longest: 21, detailed: 4 |  |

## Track totals

| Track | Questions | Single positions A/B/C/D… | Multi questions | Skewed banks |
|---|---:|---|---:|---:|
| PBA | 443 | 100/88/92/90 | 73 | 0 |
| PSA | 1090 | 215/221/216/202/0 | 236 | 0 |
| PSSA | 383 | 78/87/85/76 | 57 | 0 |
| TAS1 | 115 | 26/28/27/26/0/0/0/0 | 8 | 0 |
| TAS2 | 81 | 21/19/18/19 | 4 | 0 |
| TAPI | 92 | 24/22/22/20/0/0 | 4 | 0 |
| TDS1 | 51 | 11/12/14/12 | 2 | 0 |
| TDS2 | 27 | 6/8/7/6 | 0 | 0 |
| AE1 | 85 | 22/20/18/21 | 4 | 0 |
| TMOB | 106 | 23/27/20/25/0 | 11 | 0 |
| TESTIM | 371 | 102/101/83/73/0 | 12 | 0 |

## Per-bank editorial candidates (worst first)

### PBA / BA-M01

- Q3: longest, shortest
- Q15: longest, wrong-absolutes
- Q17: longest, wrong-absolutes
- Q2: longest
- Q4: longest
- Q6: longest
- Q9: longest
- Q11: longest
- Q14: longest
- Q16: longest
- Q18: longest

### PBA / BA-M02

- Q3: longest, anchored/letter-reference
- Q6: longest, shortest
- Q10: longest, wrong-absolutes
- Q20: longest, wrong-absolutes
- Q21: longest, wrong-absolutes
- Q22: longest, wrong-absolutes
- Q2: wrong-absolutes
- Q5: longest
- Q8: longest
- Q9: longest
- Q11: longest
- Q12: longest
- Q13: longest
- Q16: longest
- Q18: longest
- Q19: longest

### PBA / BA-M03

- Q12: longest, anchored/letter-reference, wrong-absolutes
- Q1: longest, anchored/letter-reference
- Q5: longest, anchored/letter-reference
- Q7: longest, detailed
- Q15: longest, shortest
- Q16: longest, detailed
- Q3: longest
- Q4: longest
- Q6: longest
- Q8: longest
- Q9: longest
- Q11: longest
- Q14: longest

### PBA / BA-M04

- Q8: longest, wrong-absolutes
- Q15: longest, wrong-absolutes
- Q4: longest
- Q7: longest
- Q11: longest
- Q13: longest

### PBA / BA-M05

- Q6: longest, detailed
- Q14: longest, stem-echo
- Q15: longest, detailed
- Q4: longest
- Q5: longest
- Q9: longest
- Q10: wrong-absolutes
- Q12: longest
- Q13: longest
- Q16: longest
- Q18: longest
- Q20: longest

### PBA / BA-M06

- Q7: longest, detailed, wrong-absolutes
- Q4: longest, wrong-absolutes
- Q6: longest, shortest
- Q9: longest, detailed
- Q10: longest, detailed
- Q13: longest, detailed
- Q16: longest, detailed
- Q3: shortest
- Q5: longest
- Q8: wrong-absolutes
- Q11: longest
- Q12: longest
- Q15: wrong-absolutes

### PBA / BA-M07

- Q1: longest, stem-echo, wrong-absolutes
- Q2: longest, detailed, wrong-absolutes
- Q13: longest, detailed, wrong-absolutes
- Q15: longest, detailed, stem-echo
- Q4: longest, detailed
- Q6: longest, wrong-absolutes
- Q9: longest, wrong-absolutes
- Q3: longest
- Q7: longest
- Q8: longest
- Q10: longest
- Q12: shortest

### PBA / BA-M08

- Q15: longest, detailed, stem-echo
- Q7: longest, wrong-absolutes
- Q11: longest, stem-echo
- Q13: longest, detailed
- Q19: longest, wrong-absolutes
- Q20: longest, detailed
- Q2: longest
- Q3: longest
- Q4: longest
- Q8: longest
- Q14: longest
- Q16: longest
- Q17: longest
- Q18: longest

### PBA / BA-M09

- Q7: longest, detailed
- Q8: longest, wrong-absolutes
- Q15: longest, detailed
- Q16: longest, wrong-absolutes
- Q18: longest, anchored/letter-reference
- Q20: longest, wrong-absolutes
- Q5: longest
- Q6: longest
- Q11: longest
- Q13: longest
- Q14: longest
- Q17: longest
- Q19: longest

### PBA / BA-M10

- Q6: longest, detailed, stem-echo
- Q12: longest, detailed, wrong-absolutes
- Q13: longest, detailed, wrong-absolutes
- Q16: longest, detailed, wrong-absolutes
- Q7: longest, detailed
- Q14: longest, wrong-absolutes
- Q17: longest, wrong-absolutes
- Q18: longest, wrong-absolutes
- Q1: longest
- Q3: longest
- Q4: longest
- Q5: longest
- Q9: longest
- Q10: longest
- Q19: longest

### PBA / BA-M11

- Q9: longest, detailed, stem-echo, wrong-absolutes
- Q2: longest, detailed
- Q4: longest, detailed
- Q13: longest, detailed
- Q17: longest, wrong-absolutes
- Q1: longest
- Q3: longest
- Q6: wrong-absolutes
- Q7: wrong-absolutes
- Q8: longest
- Q10: longest
- Q11: longest
- Q12: wrong-absolutes
- Q18: longest

### PBA / BA-M12

- Q2: longest, detailed
- Q7: shortest, wrong-absolutes
- Q8: longest, wrong-absolutes
- Q9: longest, wrong-absolutes
- Q16: longest, wrong-absolutes
- Q20: longest, detailed
- Q1: longest
- Q3: longest
- Q4: longest
- Q10: longest
- Q12: longest
- Q14: longest
- Q17: longest
- Q18: longest

### PBA / BA-M13

- Q2: longest, detailed
- Q3: longest, detailed
- Q4: longest, detailed
- Q6: longest, wrong-absolutes
- Q8: longest, wrong-absolutes
- Q9: longest, wrong-absolutes
- Q11: longest, detailed
- Q7: longest
- Q12: longest
- Q14: longest

### PBA / BA-M14

- Q3: longest, detailed, wrong-absolutes
- Q5: longest, detailed, stem-echo
- Q8: longest, detailed, wrong-absolutes
- Q10: longest, detailed, wrong-absolutes
- Q2: longest, detailed
- Q9: longest, detailed
- Q11: longest, detailed
- Q1: longest
- Q4: longest
- Q6: longest
- Q7: longest
- Q12: longest

### PBA / BA-M15

- Q2: longest, wrong-absolutes
- Q7: longest, wrong-absolutes
- Q12: longest, detailed
- Q14: longest, detailed
- Q1: longest
- Q6: longest
- Q8: longest
- Q9: longest

### PBA / BA-M16

- Q3: longest, detailed
- Q11: longest, detailed
- Q1: longest
- Q2: shortest
- Q5: longest
- Q6: longest
- Q7: longest
- Q8: longest
- Q12: longest
- Q15: longest

### PBA / BA-M17

- Q5: longest, wrong-absolutes
- Q6: longest, stem-echo
- Q10: longest, detailed
- Q1: longest
- Q4: wrong-absolutes
- Q8: wrong-absolutes

### PBA / BA-M18

- Q5: longest, wrong-absolutes
- Q6: longest, detailed
- Q9: longest, wrong-absolutes
- Q2: longest
- Q3: longest
- Q7: longest
- Q8: longest
- Q10: longest
- Q12: longest
- Q15: longest

### PBA / BA-M19

- Q6: longest, shortest, anchored/letter-reference
- Q8: longest, detailed
- Q9: longest, wrong-absolutes
- Q13: longest, detailed
- Q17: longest, detailed
- Q18: longest, detailed
- Q3: longest
- Q10: longest
- Q15: longest

### PSA / SA-M01

- m01_q02: shortest, wrong-absolutes
- m01_q06: longest, shortest
- m01_q10: longest, wrong-absolutes
- m01_q21: longest, wrong-absolutes
- m01_q22: longest, wrong-absolutes
- m01_q04: shortest
- m01_q05: longest
- m01_q08: longest
- m01_q09: longest
- m01_q11: shortest
- m01_q12: longest
- m01_q16: longest
- m01_q17: shortest
- m01_q19: shortest
- m01_q20: longest

### PSA / SA-M02

- m02_q21: longest, shortest, wrong-absolutes
- m02_q03: shortest, wrong-absolutes
- m02_q05: longest, wrong-absolutes
- m02_q08: longest, wrong-absolutes
- m02_q09: longest, wrong-absolutes
- m02_q16: shortest, wrong-absolutes
- m02_q01: shortest
- m02_q06: shortest
- m02_q11: longest
- m02_q13: longest
- m02_q14: longest
- m02_q15: shortest
- m02_q17: longest
- m02_q19: wrong-absolutes
- m02_q20: longest

### PSA / SA-M03

- m03_q08: longest, shortest, wrong-absolutes
- m03_q06: shortest, stem-echo
- m03_q07: shortest, wrong-absolutes
- m03_q09: shortest, wrong-absolutes
- m03_q01: longest
- m03_q02: longest
- m03_q03: shortest
- m03_q10: shortest
- m03_q12: shortest
- m03_q13: longest
- m03_q14: shortest
- m03_q15: longest
- m03_q16: shortest
- m03_q17: longest

### PSA / SA-M04

- m04_q12: shortest, wrong-absolutes
- m04_q01: wrong-absolutes
- m04_q02: shortest
- m04_q03: longest
- m04_q06: longest
- m04_q07: longest
- m04_q08: shortest
- m04_q09: shortest
- m04_q15: shortest
- m04_q16: longest

### PSA / SA-M05

- m05_q04: longest, wrong-absolutes
- m05_q07: longest, wrong-absolutes
- m05_q08: shortest, wrong-absolutes
- m05_q12: longest, shortest
- m05_q15: shortest, wrong-absolutes
- m05_q01: longest
- m05_q03: longest
- m05_q05: longest
- m05_q06: shortest
- m05_q09: longest
- m05_q11: longest
- m05_q13: longest
- m05_q16: longest

### PSA / SA-M06

- m06_q01: shortest, wrong-absolutes
- m06_q09: longest, wrong-absolutes
- m06_q13: longest, wrong-absolutes
- m06_q03: longest
- m06_q04: shortest
- m06_q05: longest
- m06_q06: longest
- m06_q10: longest
- m06_q11: shortest
- m06_q12: shortest
- m06_q14: wrong-absolutes
- m06_q17: longest

### PSA / SA-M07

- m07_q05: longest, wrong-absolutes
- m07_q12: longest, wrong-absolutes
- m07_q17: longest, wrong-absolutes
- m07_q03: longest
- m07_q04: shortest
- m07_q06: wrong-absolutes
- m07_q08: wrong-absolutes
- m07_q09: wrong-absolutes
- m07_q10: shortest
- m07_q11: longest
- m07_q13: wrong-absolutes
- m07_q14: longest
- m07_q15: longest

### PSA / SA-M08

- m08_q01: shortest, wrong-absolutes
- m08_q04: shortest, wrong-absolutes
- m08_q05: longest, wrong-absolutes
- m08_q07: longest, wrong-absolutes
- m08_q10: shortest, wrong-absolutes
- m08_q12: longest, wrong-absolutes
- m08_q16: longest, wrong-absolutes
- m08_q03: longest
- m08_q08: longest
- m08_q09: longest
- m08_q11: wrong-absolutes
- m08_q13: longest
- m08_q15: shortest
- m08_q17: wrong-absolutes
- m08_q18: shortest

### PSA / SA-M09

- m09_q19: longest, shortest, wrong-absolutes
- m09_q01: longest, wrong-absolutes
- m09_q02: longest, wrong-absolutes
- m09_q07: shortest, wrong-absolutes
- m09_q08: longest, wrong-absolutes
- m09_q12: longest, wrong-absolutes
- m09_q13: shortest, wrong-absolutes
- m09_q14: shortest, wrong-absolutes
- m09_q15: longest, wrong-absolutes
- m09_q16: longest, wrong-absolutes
- m09_q03: wrong-absolutes
- m09_q04: wrong-absolutes
- m09_q05: longest
- m09_q09: wrong-absolutes
- m09_q10: shortest
- m09_q11: longest
- m09_q17: longest
- m09_q18: longest

### PSA / SA-M10

- m10_q09: longest, wrong-absolutes
- m10_q11: shortest, wrong-absolutes
- m10_q13: longest, wrong-absolutes
- m10_q19: shortest, wrong-absolutes
- m10_q20: shortest, wrong-absolutes
- m10_q02: longest
- m10_q03: wrong-absolutes
- m10_q04: longest
- m10_q05: longest
- m10_q10: longest
- m10_q12: wrong-absolutes
- m10_q14: wrong-absolutes
- m10_q16: shortest
- m10_q17: longest
- m10_q18: shortest
- m10_q21: longest
- m10_q22: shortest

### PSA / SA-M11

- m11_q12: longest, wrong-absolutes
- m11_q13: longest, wrong-absolutes
- m11_q16: longest, wrong-absolutes
- m11_q01: shortest
- m11_q02: longest
- m11_q03: shortest
- m11_q04: shortest
- m11_q07: longest
- m11_q08: longest
- m11_q09: longest
- m11_q10: longest
- m11_q15: shortest
- m11_q17: longest

### PSA / SA-M12

- m12_q03: longest, wrong-absolutes
- m12_q10: longest, wrong-absolutes
- m12_q12: shortest, wrong-absolutes
- m12_q14: shortest, wrong-absolutes
- m12_q01: longest
- m12_q02: longest
- m12_q04: wrong-absolutes
- m12_q05: longest
- m12_q06: longest
- m12_q07: longest
- m12_q08: longest
- m12_q09: longest
- m12_q11: wrong-absolutes
- m12_q15: longest

### PSA / SA-M13

- m13_q15: longest, shortest, wrong-absolutes
- m13_q07: shortest, wrong-absolutes
- m13_q12: shortest, wrong-absolutes
- m13_q13: longest, wrong-absolutes
- m13_q01: longest
- m13_q02: longest
- m13_q03: shortest
- m13_q05: longest
- m13_q08: shortest
- m13_q09: wrong-absolutes

### PSA / SA-M14

- m14_q01: shortest, wrong-absolutes
- m14_q03: longest, wrong-absolutes
- m14_q05: longest
- m14_q09: shortest
- m14_q10: wrong-absolutes
- m14_q11: wrong-absolutes
- m14_q13: wrong-absolutes
- m14_q14: longest

### PSA / SA-M15

- m15_q10: longest, detailed, stem-echo
- m15_q04: longest, detailed
- m15_q06: longest, wrong-absolutes
- m15_q09: longest, wrong-absolutes
- m15_q11: longest, stem-echo
- m15_q12: longest, wrong-absolutes
- m15_q01: longest
- m15_q02: wrong-absolutes
- m15_q03: longest
- m15_q05: wrong-absolutes
- m15_q07: wrong-absolutes
- m15_q08: longest
- m15_q13: longest
- m15_q15: shortest

### PSA / SA-M16

- m16_q08: longest, detailed, wrong-absolutes
- m16_q02: wrong-absolutes
- m16_q04: shortest
- m16_q05: shortest
- m16_q07: shortest
- m16_q09: longest
- m16_q10: longest
- m16_q11: wrong-absolutes
- m16_q12: longest
- m16_q13: longest
- m16_q14: wrong-absolutes
- m16_q15: longest

### PSA / SA-M17

- m17_q03: longest, wrong-absolutes
- m17_q06: longest, detailed
- m17_q10: longest, wrong-absolutes
- m17_q12: longest, wrong-absolutes
- m17_q01: longest
- m17_q02: longest
- m17_q04: longest
- m17_q05: longest
- m17_q07: wrong-absolutes
- m17_q08: longest
- m17_q11: longest
- m17_q13: longest
- m17_q14: longest

### PSA / SA-M18

- m18_q02: longest, detailed, stem-echo
- m18_q05: longest, detailed, wrong-absolutes
- m18_q03: longest, detailed
- m18_q07: longest, detailed
- m18_q11: shortest, wrong-absolutes
- m18_q12: longest, detailed
- m18_q01: shortest
- m18_q04: longest
- m18_q06: shortest
- m18_q08: shortest
- m18_q09: longest
- m18_q13: shortest
- m18_q14: longest

### PSA / SA-M19

- m19_q07: longest, wrong-absolutes
- m19_q10: longest, wrong-absolutes
- m19_q12: longest, stem-echo
- m19_q13: shortest, wrong-absolutes
- m19_q03: longest
- m19_q06: longest
- m19_q08: wrong-absolutes

### PSA / SA-M20

- m20_q08: longest, stem-echo, wrong-absolutes
- m20_q03: longest, detailed
- m20_q05: longest, wrong-absolutes
- m20_q06: longest, detailed
- m20_q07: longest, detailed
- m20_q10: longest, wrong-absolutes
- m20_q01: longest
- m20_q02: longest
- m20_q04: longest
- m20_q11: wrong-absolutes
- m20_q12: longest
- m20_q13: shortest
- m20_q14: shortest

### PSA / SA-M21

- m21_q02: shortest, wrong-absolutes
- m21_q11: longest, wrong-absolutes
- m21_q01: shortest
- m21_q03: longest
- m21_q05: longest
- m21_q06: shortest
- m21_q07: longest
- m21_q09: longest
- m21_q10: shortest
- m21_q14: longest
- m21_q15: wrong-absolutes

### PSA / SA-M22

- m22_q05: longest, wrong-absolutes
- m22_q21: shortest, wrong-absolutes
- m22_q02: longest
- m22_q04: longest
- m22_q06: longest
- m22_q07: longest
- m22_q09: longest
- m22_q12: longest
- m22_q13: wrong-absolutes
- m22_q14: shortest
- m22_q15: longest
- m22_q16: longest
- m22_q17: shortest
- m22_q18: longest
- m22_q19: shortest
- m22_q20: shortest

### PSA / SA-M23

- m23_q03: shortest, wrong-absolutes
- m23_q05: longest, shortest
- m23_q06: longest, wrong-absolutes
- m23_q07: longest, wrong-absolutes
- m23_q10: longest, wrong-absolutes
- m23_q01: longest
- m23_q02: longest
- m23_q04: detailed
- m23_q08: wrong-absolutes
- m23_q09: longest
- m23_q11: wrong-absolutes
- m23_q12: longest

### PSA / SA-M24

- m24_q09: longest, stem-echo, wrong-absolutes
- m24_q03: longest, wrong-absolutes
- m24_q05: longest, shortest
- m24_q10: longest, wrong-absolutes
- m24_q13: shortest, wrong-absolutes
- m24_q01: longest
- m24_q04: longest
- m24_q06: longest
- m24_q07: anchored/letter-reference
- m24_q11: longest
- m24_q12: longest

### PSA / SA-M25

- m25_q14: longest, shortest, wrong-absolutes
- m25_q01: longest, wrong-absolutes
- m25_q02: longest, wrong-absolutes
- m25_q12: longest, anchored/letter-reference
- m25_q13: longest, wrong-absolutes
- m25_q03: longest
- m25_q07: shortest
- m25_q08: longest
- m25_q10: longest
- m25_q11: longest

### PSA / SA-M26

- m26_q12: longest, anchored/letter-reference, wrong-absolutes
- m26_q01: longest, wrong-absolutes
- m26_q03: longest, wrong-absolutes
- m26_q13: longest, wrong-absolutes
- m26_q04: longest
- m26_q06: longest
- m26_q08: longest
- m26_q09: longest
- m26_q11: shortest
- m26_q14: shortest

### PSA / SA-M27

- m27_q02: shortest, wrong-absolutes
- m27_q05: longest, anchored/letter-reference
- m27_q09: longest, wrong-absolutes
- m27_q10: longest, wrong-absolutes
- m27_q13: longest, wrong-absolutes
- m27_q14: longest, wrong-absolutes
- m27_q01: wrong-absolutes
- m27_q03: shortest
- m27_q06: wrong-absolutes
- m27_q07: wrong-absolutes
- m27_q08: anchored/letter-reference
- m27_q11: shortest

### PSA / SA-M28

- m28_q05: longest, wrong-absolutes
- m28_q10: longest, wrong-absolutes
- m28_q12: longest, wrong-absolutes
- m28_q13: longest, shortest
- m28_q14: longest, wrong-absolutes
- m28_q01: longest
- m28_q07: shortest
- m28_q08: shortest
- m28_q09: longest

### PSA / SA-M29

- m29_q05: shortest, anchored/letter-reference
- m29_q07: longest, wrong-absolutes
- m29_q13: longest, wrong-absolutes
- m29_q02: longest
- m29_q03: longest
- m29_q04: wrong-absolutes
- m29_q06: longest
- m29_q08: longest
- m29_q10: longest
- m29_q12: longest

### PSA / SA-M30

- m30_q06: longest, wrong-absolutes
- m30_q07: longest, wrong-absolutes
- m30_q10: longest, wrong-absolutes
- m30_q02: shortest
- m30_q03: longest
- m30_q09: longest
- m30_q11: longest
- m30_q13: wrong-absolutes

### PSA / SA-M31

- m31_q05: shortest, wrong-absolutes
- m31_q10: longest, wrong-absolutes
- m31_q13: longest, wrong-absolutes
- m31_q01: longest
- m31_q02: shortest
- m31_q08: longest
- m31_q11: longest
- m31_q12: longest

### PSA / SA-M32

- m32_q03: longest, wrong-absolutes
- m32_q04: shortest, wrong-absolutes
- m32_q01: longest
- m32_q02: longest
- m32_q05: shortest
- m32_q07: longest
- m32_q08: longest
- m32_q10: wrong-absolutes
- m32_q11: longest
- m32_q13: longest

### PSA / SA-M33

- m33_q08: longest, wrong-absolutes
- m33_q04: longest
- m33_q06: longest
- m33_q09: longest
- m33_q10: wrong-absolutes
- m33_q11: longest
- m33_q13: shortest
- m33_q14: longest
- m33_q15: longest

### PSA / SA-M34

- m34_q12: longest, detailed
- m34_q13: shortest, wrong-absolutes
- m34_q01: longest
- m34_q04: longest
- m34_q06: longest
- m34_q07: longest
- m34_q08: shortest
- m34_q09: longest
- m34_q10: longest
- m34_q11: longest
- m34_q14: shortest

### PSA / SA-M35

- m35_q14: longest, shortest, wrong-absolutes
- m35_q04: longest, wrong-absolutes
- m35_q09: longest, stem-echo
- m35_q11: longest, stem-echo
- m35_q13: shortest, wrong-absolutes
- m35_q01: longest
- m35_q02: longest
- m35_q03: longest
- m35_q05: longest
- m35_q06: longest
- m35_q07: shortest
- m35_q08: longest
- m35_q12: shortest

### PSA / SA-M36

- m36_q02: longest, wrong-absolutes
- m36_q04: shortest, wrong-absolutes
- m36_q05: longest, wrong-absolutes
- m36_q06: longest, wrong-absolutes
- m36_q03: shortest
- m36_q08: longest
- m36_q09: wrong-absolutes
- m36_q12: shortest
- m36_q13: wrong-absolutes

### PSA / SA-M37

- m37_q09: longest, shortest
- m37_q13: longest, wrong-absolutes
- m37_q01: longest
- m37_q02: shortest
- m37_q04: wrong-absolutes
- m37_q05: longest
- m37_q08: longest
- m37_q11: wrong-absolutes

### PSA / SA-M38

- m38_q10: longest, detailed, wrong-absolutes
- m38_q03: longest, stem-echo
- m38_q08: longest, wrong-absolutes
- m38_q02: wrong-absolutes
- m38_q04: longest
- m38_q05: longest
- m38_q06: longest
- m38_q11: shortest
- m38_q12: longest
- m38_q13: shortest

### PSA / SA-M39

- m39_q01: longest, wrong-absolutes
- m39_q05: longest, wrong-absolutes
- m39_q10: longest, wrong-absolutes
- m39_q13: longest, wrong-absolutes
- m39_q04: longest
- m39_q06: wrong-absolutes
- m39_q08: longest
- m39_q11: wrong-absolutes
- m39_q12: wrong-absolutes

### PSA / SA-M40

- m40_q02: shortest
- m40_q03: shortest
- m40_q05: longest
- m40_q06: longest
- m40_q08: wrong-absolutes
- m40_q10: longest
- m40_q13: longest
- m40_q14: shortest

### PSA / SA-M41

- m41_q08: longest, stem-echo
- m41_q10: longest, wrong-absolutes
- m41_q01: longest
- m41_q03: longest
- m41_q05: longest
- m41_q09: longest
- m41_q11: shortest
- m41_q12: longest
- m41_q13: longest
- m41_q14: longest
- m41_q15: shortest

### PSA / SA-M42

- m42_q03: wrong-absolutes
- m42_q06: shortest
- m42_q07: shortest
- m42_q09: wrong-absolutes
- m42_q10: wrong-absolutes
- m42_q11: wrong-absolutes

### PSA / SA-M43

- m43_q01: longest, wrong-absolutes
- m43_q05: stem-echo, wrong-absolutes
- m43_q02: wrong-absolutes
- m43_q03: longest
- m43_q06: shortest
- m43_q07: shortest
- m43_q08: shortest
- m43_q10: longest
- m43_q11: longest
- m43_q13: longest

### PSA / SA-M44

- m44_q14: shortest, wrong-absolutes
- m44_q02: longest
- m44_q04: longest
- m44_q06: longest
- m44_q09: longest
- m44_q10: longest
- m44_q11: shortest
- m44_q12: longest

### PSA / SA-M45

- m45_q03: longest
- m45_q04: wrong-absolutes
- m45_q06: longest
- m45_q08: longest
- m45_q11: shortest
- m45_q13: longest
- m45_q14: longest
- m45_q15: longest

### PSA / SA-M46

- m46_q03: shortest, wrong-absolutes
- m46_q06: longest, wrong-absolutes
- m46_q01: longest
- m46_q04: longest
- m46_q09: longest
- m46_q11: longest
- m46_q13: shortest
- m46_q14: longest

### PSA / SA-M47

- m47_q01: longest
- m47_q05: shortest
- m47_q07: longest
- m47_q10: longest
- m47_q11: longest
- m47_q12: shortest
- m47_q13: longest

### PSA / SA-M48

- m48_q01: longest, wrong-absolutes
- m48_q04: longest, wrong-absolutes
- m48_q07: longest, shortest
- m48_q02: wrong-absolutes
- m48_q03: shortest
- m48_q09: longest
- m48_q10: longest
- m48_q11: wrong-absolutes
- m48_q12: shortest
- m48_q13: longest
- m48_q14: shortest

### PSSA / SSA-M01

- SSA-M01-Q02: shortest
- SSA-M01-Q04: longest
- SSA-M01-Q05: wrong-absolutes
- SSA-M01-Q06: longest
- SSA-M01-Q07: shortest
- SSA-M01-Q08: wrong-absolutes

### PSSA / SSA-M02

- SSA-M02-Q08: longest, wrong-absolutes
- SSA-M02-Q01: longest
- SSA-M02-Q02: wrong-absolutes
- SSA-M02-Q03: wrong-absolutes
- SSA-M02-Q06: wrong-absolutes

### PSSA / SSA-M03

- SSA-M03-Q02: longest, stem-echo
- SSA-M03-Q01: wrong-absolutes
- SSA-M03-Q03: wrong-absolutes
- SSA-M03-Q04: wrong-absolutes
- SSA-M03-Q05: shortest
- SSA-M03-Q08: shortest

### PSSA / SSA-M04

- SSA-M04-Q08: longest, wrong-absolutes
- SSA-M04-Q01: longest
- SSA-M04-Q02: wrong-absolutes
- SSA-M04-Q04: wrong-absolutes
- SSA-M04-Q05: wrong-absolutes
- SSA-M04-Q07: wrong-absolutes

### PSSA / SSA-M05

- SSA-M05-Q02: longest, wrong-absolutes
- SSA-M05-Q05: shortest, wrong-absolutes
- SSA-M05-Q08: longest, wrong-absolutes
- SSA-M05-Q01: wrong-absolutes
- SSA-M05-Q03: wrong-absolutes

### PSSA / SSA-M06

- SSA-M06-Q02: longest, wrong-absolutes
- SSA-M06-Q03: shortest, wrong-absolutes
- SSA-M06-Q04: longest, detailed
- SSA-M06-Q06: shortest, wrong-absolutes
- SSA-M06-Q07: longest, wrong-absolutes
- SSA-M06-Q08: longest, shortest

### PSSA / SSA-M07

- SSA-M07-Q05: longest, wrong-absolutes
- SSA-M07-Q07: shortest, wrong-absolutes

### PSSA / SSA-M08

- SSA-M08-Q01: shortest
- SSA-M08-Q06: longest

### PSSA / SSA-M09

- SSA-M09-Q08: longest, wrong-absolutes
- SSA-M09-Q02: longest
- SSA-M09-Q03: longest
- SSA-M09-Q04: wrong-absolutes
- SSA-M09-Q05: longest
- SSA-M09-Q06: longest
- SSA-M09-Q07: wrong-absolutes

### PSSA / SSA-M10

- SSA-M10-Q01: shortest, wrong-absolutes
- SSA-M10-Q02: longest, wrong-absolutes
- SSA-M10-Q05: shortest, wrong-absolutes
- SSA-M10-Q06: longest, wrong-absolutes
- SSA-M10-Q03: shortest
- SSA-M10-Q04: longest
- SSA-M10-Q07: longest
- SSA-M10-Q08: wrong-absolutes

### PSSA / SSA-M11

- SSA-M11-Q03: shortest, wrong-absolutes
- SSA-M11-Q07: longest, wrong-absolutes
- SSA-M11-Q08: longest, wrong-absolutes
- SSA-M11-Q02: shortest
- SSA-M11-Q04: shortest
- SSA-M11-Q05: shortest
- SSA-M11-Q06: longest

### PSSA / SSA-M12

- SSA-M12-Q07: shortest, wrong-absolutes
- SSA-M12-Q08: longest, wrong-absolutes
- SSA-M12-Q05: longest
- SSA-M12-Q06: wrong-absolutes

### PSSA / SSA-M13

- SSA-M13-Q04: longest, wrong-absolutes
- SSA-M13-Q05: longest, wrong-absolutes
- SSA-M13-Q08: longest, wrong-absolutes
- SSA-M13-Q01: shortest
- SSA-M13-Q02: longest
- SSA-M13-Q03: shortest
- SSA-M13-Q06: longest

### PSSA / SSA-M14

- SSA-M14-Q05: longest, detailed, wrong-absolutes
- SSA-M14-Q04: longest, wrong-absolutes
- SSA-M14-Q06: longest, wrong-absolutes
- SSA-M14-Q08: longest, wrong-absolutes
- SSA-M14-Q01: longest
- SSA-M14-Q03: shortest
- SSA-M14-Q07: longest

### PSSA / SSA-M15

- SSA-M15-Q04: shortest, wrong-absolutes
- SSA-M15-Q07: shortest, wrong-absolutes
- SSA-M15-Q08: longest, wrong-absolutes
- SSA-M15-Q01: shortest
- SSA-M15-Q02: wrong-absolutes
- SSA-M15-Q03: shortest

### PSSA / SSA-M16

- SSA-M16-Q01: longest, detailed
- SSA-M16-Q03: shortest, wrong-absolutes
- SSA-M16-Q02: longest
- SSA-M16-Q06: wrong-absolutes
- SSA-M16-Q07: shortest

### PSSA / SSA-M17

- SSA-M17-Q04: longest, wrong-absolutes
- SSA-M17-Q10: longest, wrong-absolutes
- SSA-M17-Q01: shortest
- SSA-M17-Q02: wrong-absolutes
- SSA-M17-Q03: longest
- SSA-M17-Q05: longest
- SSA-M17-Q06: longest
- SSA-M17-Q09: wrong-absolutes

### PSSA / SSA-M18

- SSA-M18-Q01: longest, wrong-absolutes
- SSA-M18-Q02: longest, wrong-absolutes
- SSA-M18-Q05: shortest, wrong-absolutes
- SSA-M18-Q03: shortest
- SSA-M18-Q04: longest
- SSA-M18-Q07: wrong-absolutes
- SSA-M18-Q08: wrong-absolutes

### PSSA / SSA-M19

- SSA-M19-Q02: longest, wrong-absolutes
- SSA-M19-Q05: longest, wrong-absolutes
- SSA-M19-Q06: longest, wrong-absolutes
- SSA-M19-Q07: longest, wrong-absolutes
- SSA-M19-Q04: longest
- SSA-M19-Q08: shortest

### PSSA / SSA-M20

- SSA-M20-Q05: longest, detailed, wrong-absolutes
- SSA-M20-Q03: shortest, wrong-absolutes
- SSA-M20-Q06: shortest, wrong-absolutes
- SSA-M20-Q07: longest, wrong-absolutes
- SSA-M20-Q01: shortest
- SSA-M20-Q02: longest
- SSA-M20-Q08: shortest

### PSSA / SSA-M21

- SSA-M21-Q01: shortest, wrong-absolutes
- SSA-M21-Q03: shortest, wrong-absolutes
- SSA-M21-Q04: longest, wrong-absolutes
- SSA-M21-Q07: shortest, wrong-absolutes
- SSA-M21-Q05: longest
- SSA-M21-Q06: wrong-absolutes

### PSSA / SSA-M22

- SSA-M22-Q02: longest, detailed, wrong-absolutes
- SSA-M22-Q03: shortest, wrong-absolutes
- SSA-M22-Q05: longest, wrong-absolutes
- SSA-M22-Q06: shortest, wrong-absolutes
- SSA-M22-Q01: longest
- SSA-M22-Q07: longest
- SSA-M22-Q08: wrong-absolutes

### PSSA / SSA-M23

- SSA-M23-Q01: shortest, wrong-absolutes
- SSA-M23-Q02: shortest, wrong-absolutes
- SSA-M23-Q03: shortest, wrong-absolutes
- SSA-M23-Q04: longest, wrong-absolutes
- SSA-M23-Q05: longest, detailed
- SSA-M23-Q06: wrong-absolutes
- SSA-M23-Q08: longest

### PSSA / SSA-M24

- SSA-M24-Q05: longest, detailed, wrong-absolutes
- SSA-M24-Q07: longest, wrong-absolutes
- SSA-M24-Q08: longest, wrong-absolutes
- SSA-M24-Q01: longest
- SSA-M24-Q02: longest
- SSA-M24-Q03: wrong-absolutes
- SSA-M24-Q04: wrong-absolutes
- SSA-M24-Q06: longest

### PSSA / SSA-M25

- SSA-M25-Q05: longest, wrong-absolutes
- SSA-M25-Q06: shortest, wrong-absolutes
- SSA-M25-Q07: longest, wrong-absolutes
- SSA-M25-Q03: wrong-absolutes
- SSA-M25-Q08: longest
- SSA-M25-Q09: shortest

### TAS1 / TAS1-M00

- Q1: longest, wrong-absolutes
- Q3: longest, wrong-absolutes
- Q5: shortest, anchored/letter-reference
- Q8: longest, wrong-absolutes
- Q2: longest
- Q6: longest
- Q7: longest

### TAS1 / TAS1-M01

- Q2: longest, wrong-absolutes
- Q9: longest, wrong-absolutes
- Q10: longest, wrong-absolutes
- Q1: longest
- Q5: longest
- Q6: shortest
- Q7: shortest
- Q8: wrong-absolutes

### TAS1 / TAS1-M02

- Q1: longest, wrong-absolutes
- Q2: shortest, wrong-absolutes
- Q8: longest, wrong-absolutes
- Q3: wrong-absolutes
- Q4: longest
- Q5: longest
- Q6: longest
- Q10: wrong-absolutes
- Q11: longest

### TAS1 / TAS1-M03

- Q9: longest, wrong-absolutes
- Q-KC3: shortest, anchored/letter-reference
- Q10: shortest, wrong-absolutes
- Q7: longest
- Q11: longest

### TAS1 / TAS1-M04

- Q2: longest
- Q3: shortest
- Q4: shortest
- Q5: longest
- Q6: wrong-absolutes

### TAS1 / TAS1-M05

- Q3: longest, detailed
- Q5: longest

### TAS1 / TAS1-M06

- Q5: longest, wrong-absolutes
- Q2: shortest
- Q4: longest

### TAS1 / TAS1-M07

- KC1: longest, wrong-absolutes
- KC2: wrong-absolutes
- Q3: longest
- Q5: longest
- Q6: longest
- Q7: longest

### TAS1 / TAS1-M08

- Q1: longest, wrong-absolutes
- Q5: longest, detailed
- KC3: longest, shortest
- KC5: shortest, anchored/letter-reference
- Q2: longest
- Q3: longest
- Q4: shortest
- Q6: longest
- Q7: longest
- Q8: longest
- KC2: longest
- KC4: wrong-absolutes

### TAS1 / TAS1-M09

- Q19: longest, detailed, stem-echo
- Q4: longest, detailed
- Q10: longest, wrong-absolutes
- Q2: longest
- Q3: longest
- Q5: longest
- Q6: longest
- Q11: longest
- Q14: longest
- Q15: longest
- Q18: longest

### TAS2 / TAS2-M00

- Q1: longest, wrong-absolutes
- Q2: longest
- Q4: longest
- Q5: longest

### TAS2 / TAS2-M01

- Q1: longest, wrong-absolutes
- Q2: longest, wrong-absolutes
- Q3: longest, wrong-absolutes
- Q5: longest, wrong-absolutes
- Q8: longest, wrong-absolutes

### TAS2 / TAS2-M02

- Q1: longest
- Q2: wrong-absolutes
- Q4: longest
- Q6: longest

### TAS2 / TAS2-M03

- Q4: longest, wrong-absolutes
- Q1: longest
- Q2: longest
- Q3: longest
- Q5: detailed
- Q7: wrong-absolutes

### TAS2 / TAS2-M04

- Q1: longest, wrong-absolutes
- Q2: longest, wrong-absolutes
- Q3: longest, wrong-absolutes
- Q4: wrong-absolutes
- Q5: longest
- Q6: shortest

### TAS2 / TAS2-M05

- Q1: shortest, wrong-absolutes
- Q7: longest, wrong-absolutes
- Q2: wrong-absolutes
- Q3: longest
- Q4: wrong-absolutes
- Q5: longest

### TAS2 / TAS2-M06

- Q1: longest, detailed
- Q2: longest
- Q3: longest
- Q4: longest
- Q5: longest

### TAS2 / TAS2-M07

- Q2: shortest
- Q3: wrong-absolutes
- Q4: longest
- Q5: stem-echo
- Q6: longest
- Q7: wrong-absolutes
- Q8: wrong-absolutes
- Q9: longest
- Q10: longest

### TAS2 / TAS2-M08

- Q2: longest, wrong-absolutes
- Q4: longest, wrong-absolutes
- Q1: longest
- Q3: longest
- Q5: longest
- Q8: longest
- Q9: longest

### TAS2 / TAS2-M09

- Q4: longest, wrong-absolutes
- Q2: longest
- Q6: longest

### TAPI / TAPI-M00

- Q1: shortest, wrong-absolutes
- Q2: longest, wrong-absolutes
- Q3: longest, wrong-absolutes
- Q4: longest

### TAPI / TAPI-M01

- Q2: longest, wrong-absolutes
- Q3: longest, wrong-absolutes
- Q4: longest, wrong-absolutes
- Q5: longest, wrong-absolutes
- Q1: wrong-absolutes

### TAPI / TAPI-M02

- Q5: longest, wrong-absolutes
- Q1: wrong-absolutes
- Q3: longest
- Q4: wrong-absolutes

### TAPI / TAPI-M03

- Q4: longest, wrong-absolutes
- Q1: longest
- Q2: wrong-absolutes
- Q3: longest

### TAPI / TAPI-M04

- Q2: longest, wrong-absolutes
- Q3: longest, wrong-absolutes

### TAPI / TAPI-M05

- Q1: longest, wrong-absolutes
- Q2: longest, wrong-absolutes
- Q4: longest, wrong-absolutes

### TAPI / TAPI-M06

- Q3: longest, detailed, wrong-absolutes
- Q1: longest, wrong-absolutes
- Q2: longest, wrong-absolutes
- Q6: longest, wrong-absolutes
- Q4: wrong-absolutes
- Q5: longest
- Q7: longest

### TAPI / TAPI-M07

- Q2: longest, detailed, wrong-absolutes
- Q1: longest, wrong-absolutes
- Q3: longest
- Q4: wrong-absolutes

### TAPI / TAPI-M08

- Q5: longest, detailed, wrong-absolutes
- Q1: longest, detailed
- Q4: longest, wrong-absolutes
- Q3: longest

### TAPI / TAPI-M09

- Q2: longest, wrong-absolutes
- Q3: longest, wrong-absolutes
- Q1: wrong-absolutes
- Q4: wrong-absolutes

### TAPI / TAPI-M10

- Q3: longest, wrong-absolutes
- Q4: wrong-absolutes

### TAPI / TAPI-M11

- Q1: longest, detailed, wrong-absolutes
- Q3: longest, detailed, wrong-absolutes
- Q2: longest

### TAPI / TAPI-M12

- Q1: longest, detailed, wrong-absolutes
- Q3: longest, detailed, wrong-absolutes
- Q2: wrong-absolutes

### TAPI / TAPI-M13

- Q2: wrong-absolutes
- Q3: longest
- Q4: wrong-absolutes

### TDS1 / TDS1-M00

- Q3: longest, wrong-absolutes
- Q1: wrong-absolutes
- Q2: longest

### TDS1 / TDS1-M01

- Q3: longest, wrong-absolutes
- Q4: longest, wrong-absolutes
- Q1: longest

### TDS1 / TDS1-M02

- Q1: wrong-absolutes
- Q3: longest

### TDS1 / TDS1-M03

- Q4: longest, wrong-absolutes
- Q1: longest
- Q2: longest
- Q3: wrong-absolutes

### TDS1 / TDS1-M04

- Q4: longest, wrong-absolutes
- Q5: longest

### TDS1 / TDS1-M05

- Q4: longest, wrong-absolutes
- Q1: longest
- Q2: longest
- Q3: longest

### TDS1 / TDS1-M06

- Q1: longest, wrong-absolutes
- Q4: longest, wrong-absolutes
- Q3: wrong-absolutes

### TDS1 / TDS1-M08

- Q1: longest, wrong-absolutes
- Q2: longest
- Q3: longest

### TDS1 / TDS1-M09

- Q1: longest, wrong-absolutes
- Q4: longest, wrong-absolutes
- Q2: longest

### TDS1 / TDS1-M10

- Q1: wrong-absolutes

### TDS1 / TDS1-M11

- Q1: longest, wrong-absolutes
- Q3: longest

### TDS2 / TDS2-M00

- Q1: longest, wrong-absolutes
- Q3: longest

### TDS2 / TDS2-M01

- Q3: longest, stem-echo
- Q1: longest

### TDS2 / TDS2-M02

- Q2: longest, detailed, wrong-absolutes

### TDS2 / TDS2-M03

- Q1: longest, wrong-absolutes
- Q2: longest, detailed
- Q3: longest

### TDS2 / TDS2-M04

- Q3: longest, detailed, wrong-absolutes
- Q2: longest

### TDS2 / TDS2-M06

- Q2: longest, wrong-absolutes
- Q3: longest

### AE1 / AE1-M00

- Q1: longest, wrong-absolutes
- Q2: wrong-absolutes

### AE1 / AE1-M01

- Q1: longest, wrong-absolutes
- Q2: longest
- Q5: longest
- Q6: longest
- Q7: wrong-absolutes
- Q8: wrong-absolutes

### AE1 / AE1-M02

- Q5: longest, wrong-absolutes

### AE1 / AE1-M03

- Q1: longest, detailed
- Q4: longest, wrong-absolutes
- Q5: longest, wrong-absolutes
- Q2: longest

### AE1 / AE1-M04

- Q4: longest, wrong-absolutes
- Q2: wrong-absolutes
- Q3: wrong-absolutes

### AE1 / AE1-M05

- Q4: longest, wrong-absolutes
- Q2: longest
- Q3: longest
- Q5: longest

### AE1 / AE1-M06

- Q1: longest, wrong-absolutes
- Q2: longest, detailed
- Q3: longest, stem-echo
- Q5: longest

### AE1 / AE1-M07

- Q1: longest, detailed
- Q2: longest, wrong-absolutes
- Q3: longest, wrong-absolutes
- Q4: longest

### AE1 / AE1-M08

- Q5: longest, wrong-absolutes
- Q17: longest, wrong-absolutes
- Q20: longest, detailed
- Q1: longest
- Q2: longest
- Q6: longest
- Q9: shortest
- Q11: shortest
- Q13: longest
- Q18: wrong-absolutes

### AE1 / AE1-M09

- Q1: longest, wrong-absolutes
- Q5: longest, wrong-absolutes
- Q2: longest
- Q3: longest

### AE1 / AE1-M10

- Q4: longest, detailed, wrong-absolutes
- Q3: longest, wrong-absolutes
- Q2: longest
- Q5: wrong-absolutes

### AE1 / AE1-M11

- Q2: longest, detailed, wrong-absolutes
- Q3: longest, detailed
- Q1: longest
- Q4: longest

### AE1 / AE1-M12

- Q2: longest, detailed, stem-echo
- Q1: wrong-absolutes
- Q3: longest
- Q4: longest
- Q5: wrong-absolutes

### TMOB / TMOB-M00

- Q1: longest, wrong-absolutes
- Q2: wrong-absolutes
- Q3: longest

### TMOB / TMOB-M01

- Q2: longest, shortest, detailed, wrong-absolutes
- Q3: wrong-absolutes
- Q4: longest
- Q5: wrong-absolutes
- Q6: longest

### TMOB / TMOB-M02

- Q1: shortest, wrong-absolutes
- Q4: longest

### TMOB / TMOB-M03

- Q1: longest
- Q3: longest
- Q4: wrong-absolutes

### TMOB / TMOB-M04

- Q1: longest, wrong-absolutes
- Q2: longest, wrong-absolutes
- Q4: longest, stem-echo

### TMOB / TMOB-M05

- Q1: shortest, wrong-absolutes
- Q8: longest, wrong-absolutes
- Q2: longest
- Q3: longest
- Q5: longest

### TMOB / TMOB-M06

- Q7: longest, wrong-absolutes
- Q9: longest, wrong-absolutes
- Q2: longest
- Q3: longest
- Q5: longest
- Q6: shortest

### TMOB / TMOB-M07

- Q2: longest, wrong-absolutes
- Q5: longest, shortest
- Q3: longest
- Q4: longest

### TMOB / TMOB-M08

- Q1: longest
- Q2: shortest
- Q3: longest
- Q4: longest

### TMOB / TMOB-M09

- Q2: longest, stem-echo
- Q1: longest
- Q3: wrong-absolutes

### TMOB / TMOB-M10

- Q1: longest, shortest
- Q3: longest, wrong-absolutes

### TMOB / TMOB-M11

- Q2: longest, wrong-absolutes
- Q1: longest
- Q3: longest
- Q4: longest

### TMOB / TMOB-M12

- Q4: longest, shortest, detailed
- Q1: longest
- Q2: longest
- Q3: wrong-absolutes
- Q5: longest

### TMOB / TMOB-M13

- Q3: longest

### TMOB / TMOB-M14

- Q1: longest, wrong-absolutes
- Q2: longest
- Q3: longest

### TMOB / TMOB-M15

- Q2: longest, detailed
- Q3: longest, wrong-absolutes

### TMOB / TMOB-M16

- Q1: longest, detailed, wrong-absolutes

### TMOB / TMOB-M17

- Q2: longest, wrong-absolutes
- Q1: wrong-absolutes

### TESTIM / TESTIM-M00

- Q1: longest
- Q2: longest
- Q3: longest
- Q4: wrong-absolutes

### TESTIM / TESTIM-M01

- Q1: wrong-absolutes
- Q2: longest
- Q3: shortest
- Q4: longest

### TESTIM / TESTIM-M02

- Q11: longest, wrong-absolutes
- Q4: longest
- Q6: longest
- Q9: longest
- Q12: wrong-absolutes
- Q14: longest

### TESTIM / TESTIM-M03

- Q4: longest, wrong-absolutes
- Q3: longest
- Q5: longest
- Q6: longest
- Q8: shortest
- Q9: wrong-absolutes
- Q10: longest

### TESTIM / TESTIM-M04

- Q2: wrong-absolutes
- Q3: wrong-absolutes

### TESTIM / TESTIM-M05

- Q2: longest
- Q3: longest
- Q4: longest
- Q5: wrong-absolutes
- Q8: longest

### TESTIM / TESTIM-M06

- Q2: longest
- Q3: longest
- Q7: longest
- Q8: shortest

### TESTIM / TESTIM-M07

- Q3: longest, wrong-absolutes
- Q4: longest, wrong-absolutes
- Q5: longest, wrong-absolutes
- Q1: wrong-absolutes
- Q2: wrong-absolutes

### TESTIM / TESTIM-M08

- Q1: longest, wrong-absolutes
- Q4: wrong-absolutes
- Q5: longest

### TESTIM / TESTIM-M09

- Q3: longest, detailed
- Q6: longest, wrong-absolutes
- Q1: longest
- Q2: longest
- Q4: longest

### TESTIM / TESTIM-M10

- Q1: longest, wrong-absolutes
- Q3: longest, wrong-absolutes
- Q4: longest

### TESTIM / TESTIM-M11

- Q3: longest, wrong-absolutes
- Q2: longest

### TESTIM / TESTIM-M12

- Q3: longest

### TESTIM / TESTIM-M13

- Q2: longest
- Q5: longest

### TESTIM / TESTIM-M14

- Q1: longest, wrong-absolutes
- Q2: longest, stem-echo
- Q4: longest, wrong-absolutes
- Q5: longest, wrong-absolutes
- Q3: longest

### TESTIM / TESTIM-M15

- Q1: longest, detailed, wrong-absolutes
- Q2: longest, detailed, wrong-absolutes
- Q4: longest, wrong-absolutes
- Q3: wrong-absolutes

### TESTIM / TESTIM-M16

- Q3: longest

### TESTIM / TESTIM-M17

- Q2: longest, wrong-absolutes
- Q5: shortest, wrong-absolutes
- Q1: wrong-absolutes

### TESTIM / TESTIM-M18

- Q2: longest

### TESTIM / TESTIM-M19

- Q1: longest, detailed, wrong-absolutes
- Q2: shortest, wrong-absolutes
- Q3: longest, detailed

### TESTIM / TESTIM-M20

- Q1: longest, wrong-absolutes
- Q5: longest, wrong-absolutes
- Q2: shortest
- Q4: longest

### TESTIM / TESTIM-M21

- Q1: wrong-absolutes
- Q2: longest
- Q3: wrong-absolutes

### TESTIM / TESTIM-M23

- Q2: longest, detailed, wrong-absolutes
- Q3: longest, detailed, wrong-absolutes
- Q4: longest, detailed, wrong-absolutes
- Q1: longest

### TESTIM / TESTIM-M24

- Q5: longest, wrong-absolutes
- Q2: longest

### TESTIM / TESTIM-M25

- Q3: longest, wrong-absolutes
- Q1: shortest
- Q2: wrong-absolutes
- Q4: wrong-absolutes

### TESTIM / TESTIM-M26

- Q1: longest, wrong-absolutes
- Q2: longest, wrong-absolutes
- Q3: longest

### TESTIM / TESTIM-M27

- Q2: shortest
- Q3: shortest

### TESTIM / TESTIM-M28

- Q2: longest, wrong-absolutes
- Q1: wrong-absolutes
- Q3: wrong-absolutes

### TESTIM / TESTIM-M29

- Q1: shortest, wrong-absolutes
- Q2: longest
- Q3: longest

### TESTIM / TESTIM-M30

- Q3: longest, wrong-absolutes
- Q1: longest
- Q2: longest

### TESTIM / TESTIM-M31

- Q1: wrong-absolutes
- Q2: wrong-absolutes
- Q3: longest
- Q4: wrong-absolutes

### PSA / Mock Exam 1

- Q14: longest, detailed, stem-echo
- Q41: longest, detailed, stem-echo
- Q50: longest, detailed, wrong-absolutes
- Q2: longest, detailed
- Q4: longest, detailed
- Q6: longest, detailed
- Q8: shortest, wrong-absolutes
- Q10: longest, detailed
- Q19: longest, wrong-absolutes
- Q24: longest, wrong-absolutes
- Q26: longest, detailed
- Q27: longest, detailed
- Q40: longest, wrong-absolutes
- Q46: longest, wrong-absolutes
- Q51: longest, detailed
- Q58: longest, detailed
- Q9: longest
- Q13: longest
- Q17: wrong-absolutes
- Q18: longest
- Q20: longest
- Q21: wrong-absolutes
- Q22: longest
- Q28: shortest
- Q30: longest
- Q33: longest
- Q43: longest
- Q44: longest
- Q45: longest
- Q48: longest
- Q52: wrong-absolutes
- Q54: longest
- Q57: longest
- Q59: longest

### PSA / Mock Exam 2

- Q34: longest, detailed, wrong-absolutes
- Q38: longest, detailed, wrong-absolutes
- Q50: longest, detailed, wrong-absolutes
- Q57: longest, detailed, wrong-absolutes
- Q10: longest, wrong-absolutes
- Q29: longest, wrong-absolutes
- Q40: longest, detailed
- Q41: longest, detailed
- Q42: longest, detailed
- Q48: longest, detailed
- Q49: longest, wrong-absolutes
- Q53: longest, detailed
- Q59: longest, wrong-absolutes
- Q60: longest, wrong-absolutes
- Q3: longest
- Q6: longest
- Q7: longest
- Q8: longest
- Q9: longest
- Q11: longest
- Q14: longest
- Q15: longest
- Q20: wrong-absolutes
- Q22: longest
- Q25: longest
- Q26: longest
- Q27: wrong-absolutes
- Q31: longest
- Q32: longest
- Q37: longest
- Q44: longest
- Q47: longest
- Q51: longest
- Q55: longest
- Q56: longest

### PSA / Mock Exam 3

- Q12: longest, stem-echo, wrong-absolutes
- Q19: longest, detailed, wrong-absolutes
- Q25: longest, detailed, wrong-absolutes
- Q2: longest, wrong-absolutes
- Q14: longest, shortest
- Q23: longest, detailed
- Q27: longest, detailed
- Q29: longest, shortest
- Q31: longest, detailed
- Q39: longest, detailed
- Q45: longest, wrong-absolutes
- Q48: longest, detailed
- Q49: longest, wrong-absolutes
- Q52: longest, detailed
- Q53: longest, detailed
- Q54: longest, wrong-absolutes
- Q60: longest, detailed
- Q3: wrong-absolutes
- Q4: longest
- Q5: longest
- Q10: stem-echo
- Q11: longest
- Q13: wrong-absolutes
- Q28: longest
- Q30: longest
- Q33: longest
- Q35: longest
- Q37: wrong-absolutes
- Q40: longest
- Q41: longest
- Q42: longest
- Q43: longest
- Q44: longest
- Q46: wrong-absolutes
- Q50: wrong-absolutes
- Q59: longest

### PSA / Mock Exam 4

- Q19: shortest, anchored/letter-reference
- Q1: shortest
- Q7: longest
- Q15: longest
- Q20: longest
- Q31: longest
- Q32: longest
- Q33: shortest
- Q35: longest
- Q36: wrong-absolutes
- Q38: longest
- Q43: longest
- Q45: shortest
- Q51: longest
- Q57: shortest
- Q58: longest
- Q59: longest

### PSA / Mock Exam 5

- Q2: longest, detailed, wrong-absolutes
- Q23: longest, shortest, wrong-absolutes
- Q5: longest, wrong-absolutes
- Q7: longest, wrong-absolutes
- Q21: longest, wrong-absolutes
- Q38: longest, shortest
- Q4: longest
- Q6: longest
- Q9: wrong-absolutes
- Q12: longest
- Q13: longest
- Q15: longest
- Q17: longest
- Q19: longest
- Q24: longest
- Q26: wrong-absolutes
- Q27: longest
- Q33: longest
- Q34: longest
- Q37: wrong-absolutes
- Q39: longest
- Q40: longest
- Q42: longest
- Q44: longest
- Q46: shortest
- Q48: longest
- Q49: longest
- Q50: longest
- Q53: longest
- Q54: longest
- Q55: shortest
- Q58: shortest
- Q60: longest

### PSA / Mock Exam 6

- Q21: longest, shortest
- Q22: longest, wrong-absolutes
- Q37: longest, shortest
- Q53: longest, shortest
- Q4: longest
- Q6: longest
- Q9: longest
- Q11: longest
- Q12: shortest
- Q14: longest
- Q15: longest
- Q19: shortest
- Q28: longest
- Q31: longest
- Q35: shortest
- Q36: shortest
- Q38: shortest
- Q42: longest
- Q44: wrong-absolutes
- Q45: longest
- Q48: shortest
- Q49: shortest
- Q50: longest
- Q51: shortest
- Q52: longest
- Q54: longest
- Q57: longest
- Q58: longest
- Q60: longest

### PBA / Mock Exam 1

- Q4: longest, detailed, wrong-absolutes
- Q27: longest, detailed
- Q28: longest, wrong-absolutes
- Q33: longest, detailed
- Q34: longest, detailed
- Q36: longest, wrong-absolutes
- Q40: longest, detailed
- Q45: longest, detailed
- Q1: longest
- Q3: longest
- Q5: longest
- Q8: longest
- Q10: longest
- Q11: longest
- Q12: longest
- Q17: longest
- Q18: longest
- Q22: longest
- Q23: longest
- Q24: longest
- Q25: longest
- Q26: longest
- Q35: longest
- Q37: wrong-absolutes
- Q39: longest
- Q41: longest
- Q43: longest
- Q46: longest
- Q48: longest

### PBA / Mock Exam 2

- Q3: longest, wrong-absolutes
- Q6: longest, wrong-absolutes
- Q9: longest, wrong-absolutes
- Q15: longest, detailed
- Q16: longest, detailed
- Q18: longest, detailed
- Q22: longest, detailed
- Q23: longest, wrong-absolutes
- Q24: longest, detailed
- Q26: longest, detailed
- Q27: longest, wrong-absolutes
- Q28: longest, detailed
- Q33: longest, wrong-absolutes
- Q35: longest, detailed
- Q43: longest, detailed
- Q45: longest, wrong-absolutes
- Q50: longest, wrong-absolutes
- Q5: longest
- Q12: longest
- Q13: longest
- Q14: longest
- Q17: longest
- Q21: wrong-absolutes
- Q25: longest
- Q32: shortest
- Q34: longest
- Q36: longest
- Q37: longest
- Q38: wrong-absolutes
- Q39: longest
- Q40: longest
- Q42: longest
- Q46: longest
- Q48: longest
- Q49: longest

### PBA / Mock Exam 3

- Q35: longest, detailed, wrong-absolutes
- Q3: longest, detailed
- Q4: longest, wrong-absolutes
- Q10: longest, wrong-absolutes
- Q18: longest, detailed
- Q20: longest, detailed
- Q28: longest, wrong-absolutes
- Q34: longest, detailed
- Q38: longest, detailed
- Q39: longest, wrong-absolutes
- Q46: longest, detailed
- Q48: longest, detailed
- Q2: longest
- Q5: longest
- Q7: longest
- Q9: longest
- Q11: longest
- Q12: longest
- Q13: longest
- Q16: longest
- Q17: longest
- Q19: longest
- Q23: longest
- Q24: shortest
- Q26: longest
- Q27: longest
- Q29: longest
- Q30: longest
- Q31: longest
- Q33: longest
- Q36: longest
- Q43: longest
- Q45: longest
- Q49: longest
- Q50: longest

### TAS1 / Mock Exam 1

- Q1: shortest
- Q3: longest
- Q4: wrong-absolutes

### TAS2 / Mock Exam 1

- Q1: longest
- Q2: shortest
- Q5: longest

### TAPI / Mock Exam 1

- Q3: longest, wrong-absolutes
- Q4: longest, wrong-absolutes
- Q5: longest, wrong-absolutes
- Q2: longest

### TAPI / Mock Exam 2

- Q1: longest, wrong-absolutes
- Q4: longest

### TAPI / Mock Exam 3

- Q4: longest, shortest
- Q1: longest

### TAPI / Mock Exam 4

- Q3: shortest

### TAPI / Mock Exam 5

- Q2: longest, shortest
- Q5: longest, wrong-absolutes
- Q3: shortest

### TAPI / Mock Exam 6

- Q4: longest, detailed, stem-echo
- Q1: longest, wrong-absolutes

### TDS1 / Mock Exam 1

- Q1: longest
- Q2: longest
- Q3: longest
- Q5: longest

### TDS2 / Mock Exam 1

- Q3: longest, stem-echo
- Q1: wrong-absolutes
- Q2: wrong-absolutes
- Q4: longest

### AE1 / Mock Exam 1

- Q2: longest, wrong-absolutes
- Q4: longest, shortest
- Q1: wrong-absolutes
- Q3: longest
- Q5: longest

### TMOB / Mock Exam 1

- Q6: longest, detailed
- Q3: longest
- Q5: longest
- Q7: longest
- Q8: longest
- Q10: shortest

### TMOB / Mock Exam 2

- Q3: longest, detailed
- Q6: longest, detailed
- Q1: longest
- Q2: longest
- Q4: longest
- Q5: longest
- Q7: longest

### TMOB / Mock Exam 3

- Q8: longest, detailed, wrong-absolutes
- Q3: longest, detailed
- Q6: longest, detailed
- Q7: longest, detailed
- Q2: longest
- Q4: longest
- Q5: longest

### TESTIM / Mock Exam 1

- Q9: longest, anchored/letter-reference
- Q13: longest, wrong-absolutes
- Q14: longest, detailed
- Q15: longest, wrong-absolutes
- Q16: longest, detailed
- Q19: longest, wrong-absolutes
- Q20: longest, wrong-absolutes
- Q21: longest, wrong-absolutes
- Q23: longest, wrong-absolutes
- Q27: longest, wrong-absolutes
- Q30: longest, wrong-absolutes
- Q32: longest, wrong-absolutes
- Q1: longest
- Q2: longest
- Q8: wrong-absolutes
- Q12: wrong-absolutes
- Q22: longest
- Q24: wrong-absolutes
- Q31: longest

### TESTIM / Mock Exam 2

- Q1: longest, detailed
- Q15: longest, wrong-absolutes
- Q24: longest, detailed
- Q28: longest, wrong-absolutes
- Q2: shortest
- Q3: longest
- Q4: longest
- Q6: longest
- Q7: shortest
- Q8: wrong-absolutes
- Q9: longest
- Q10: longest
- Q12: wrong-absolutes
- Q14: longest
- Q17: longest
- Q18: longest
- Q19: longest
- Q23: shortest
- Q25: longest
- Q27: shortest
- Q29: shortest
- Q30: wrong-absolutes
- Q31: longest
- Q32: longest

### TESTIM / Mock Exam 3

- Q19: longest, detailed, wrong-absolutes
- Q22: longest, detailed, wrong-absolutes
- Q25: longest, detailed, wrong-absolutes
- Q6: longest, wrong-absolutes
- Q12: longest, wrong-absolutes
- Q14: longest, detailed
- Q16: longest, detailed
- Q18: longest, wrong-absolutes
- Q28: longest, wrong-absolutes
- Q31: longest, detailed
- Q32: longest, wrong-absolutes
- Q1: longest
- Q2: longest
- Q7: wrong-absolutes
- Q9: longest
- Q24: wrong-absolutes
- Q26: longest
- Q27: wrong-absolutes
- Q29: shortest

### TESTIM / Mock Exam 4

- Q15: longest, detailed, wrong-absolutes
- Q19: longest, detailed, wrong-absolutes
- Q25: longest, detailed, wrong-absolutes
- Q31: longest, detailed, wrong-absolutes
- Q4: longest, wrong-absolutes
- Q12: longest, wrong-absolutes
- Q13: longest, detailed
- Q16: longest, wrong-absolutes
- Q21: shortest, wrong-absolutes
- Q22: shortest, wrong-absolutes
- Q27: longest, wrong-absolutes
- Q30: shortest, wrong-absolutes
- Q1: wrong-absolutes
- Q3: longest
- Q6: longest
- Q7: longest
- Q9: wrong-absolutes
- Q10: longest
- Q11: longest
- Q14: longest
- Q17: longest
- Q18: longest
- Q20: longest
- Q23: longest
- Q28: longest

### TESTIM / Mock Exam 5

- Q25: longest, detailed, wrong-absolutes
- Q12: longest, detailed
- Q13: longest, detailed
- Q19: longest, wrong-absolutes
- Q23: longest, wrong-absolutes
- Q1: wrong-absolutes
- Q4: wrong-absolutes
- Q6: longest
- Q10: longest
- Q11: shortest
- Q15: longest
- Q18: longest
- Q20: wrong-absolutes
- Q22: longest
- Q27: wrong-absolutes
- Q30: longest
- Q31: wrong-absolutes

### TESTIM / Mock Exam 6

- Q11: longest, wrong-absolutes
- Q27: longest, anchored/letter-reference
- Q42: longest, anchored/letter-reference
- Q52: longest, wrong-absolutes
- Q55: anchored/letter-reference, wrong-absolutes
- Q1: longest
- Q2: shortest
- Q9: longest
- Q12: wrong-absolutes
- Q17: longest
- Q18: longest
- Q20: shortest
- Q21: wrong-absolutes
- Q22: longest
- Q24: wrong-absolutes
- Q26: wrong-absolutes
- Q29: longest
- Q30: longest
- Q32: wrong-absolutes
- Q33: longest
- Q36: longest
- Q37: longest
- Q38: anchored/letter-reference
- Q39: shortest
- Q40: longest
- Q45: longest
- Q47: shortest

### PSSA / Mock Exam 1

- SSA-MOCK1-Q01: shortest, wrong-absolutes
- SSA-MOCK1-Q02: shortest, wrong-absolutes
- SSA-MOCK1-Q07: shortest, wrong-absolutes
- SSA-MOCK1-Q09: shortest, wrong-absolutes
- SSA-MOCK1-Q15: shortest, wrong-absolutes
- SSA-MOCK1-Q20: shortest, wrong-absolutes
- SSA-MOCK1-Q23: shortest, wrong-absolutes
- SSA-MOCK1-Q24: shortest, wrong-absolutes
- SSA-MOCK1-Q27: longest, wrong-absolutes
- SSA-MOCK1-Q29: shortest, wrong-absolutes
- SSA-MOCK1-Q31: longest, wrong-absolutes
- SSA-MOCK1-Q32: longest, wrong-absolutes
- SSA-MOCK1-Q36: longest, detailed
- SSA-MOCK1-Q39: longest, wrong-absolutes
- SSA-MOCK1-Q46: shortest, wrong-absolutes
- SSA-MOCK1-Q47: longest, wrong-absolutes
- SSA-MOCK1-Q50: longest, wrong-absolutes
- SSA-MOCK1-Q52: shortest, wrong-absolutes
- SSA-MOCK1-Q58: shortest, wrong-absolutes
- SSA-MOCK1-Q60: longest, wrong-absolutes
- SSA-MOCK1-Q06: longest
- SSA-MOCK1-Q10: shortest
- SSA-MOCK1-Q13: wrong-absolutes
- SSA-MOCK1-Q17: longest
- SSA-MOCK1-Q19: longest
- SSA-MOCK1-Q22: longest
- SSA-MOCK1-Q25: shortest
- SSA-MOCK1-Q28: longest
- SSA-MOCK1-Q30: shortest
- SSA-MOCK1-Q33: wrong-absolutes
- SSA-MOCK1-Q34: shortest
- SSA-MOCK1-Q37: longest
- SSA-MOCK1-Q38: wrong-absolutes
- SSA-MOCK1-Q41: longest
- SSA-MOCK1-Q43: longest
- SSA-MOCK1-Q44: longest
- SSA-MOCK1-Q45: wrong-absolutes
- SSA-MOCK1-Q48: longest
- SSA-MOCK1-Q51: wrong-absolutes
- SSA-MOCK1-Q53: shortest
- SSA-MOCK1-Q54: shortest
- SSA-MOCK1-Q55: shortest
- SSA-MOCK1-Q56: longest
- SSA-MOCK1-Q57: wrong-absolutes

### PSSA / Mock Exam 2

- SSA-MOCK2-Q17: longest, detailed, wrong-absolutes
- SSA-MOCK2-Q24: longest, detailed, wrong-absolutes
- SSA-MOCK2-Q01: shortest, wrong-absolutes
- SSA-MOCK2-Q02: longest, wrong-absolutes
- SSA-MOCK2-Q05: longest, wrong-absolutes
- SSA-MOCK2-Q09: longest, wrong-absolutes
- SSA-MOCK2-Q11: longest, wrong-absolutes
- SSA-MOCK2-Q14: longest, wrong-absolutes
- SSA-MOCK2-Q23: shortest, wrong-absolutes
- SSA-MOCK2-Q33: longest, wrong-absolutes
- SSA-MOCK2-Q36: longest, wrong-absolutes
- SSA-MOCK2-Q38: longest, detailed
- SSA-MOCK2-Q46: longest, wrong-absolutes
- SSA-MOCK2-Q48: longest, wrong-absolutes
- SSA-MOCK2-Q49: shortest, wrong-absolutes
- SSA-MOCK2-Q54: longest, stem-echo
- SSA-MOCK2-Q58: shortest, wrong-absolutes
- SSA-MOCK2-Q04: longest
- SSA-MOCK2-Q06: wrong-absolutes
- SSA-MOCK2-Q10: longest
- SSA-MOCK2-Q12: shortest
- SSA-MOCK2-Q15: shortest
- SSA-MOCK2-Q16: shortest
- SSA-MOCK2-Q19: longest
- SSA-MOCK2-Q20: wrong-absolutes
- SSA-MOCK2-Q21: longest
- SSA-MOCK2-Q26: wrong-absolutes
- SSA-MOCK2-Q30: longest
- SSA-MOCK2-Q31: wrong-absolutes
- SSA-MOCK2-Q34: shortest
- SSA-MOCK2-Q41: longest
- SSA-MOCK2-Q42: longest
- SSA-MOCK2-Q43: shortest
- SSA-MOCK2-Q45: shortest
- SSA-MOCK2-Q50: longest
- SSA-MOCK2-Q53: longest
- SSA-MOCK2-Q55: longest
- SSA-MOCK2-Q56: wrong-absolutes
- SSA-MOCK2-Q59: longest
- SSA-MOCK2-Q60: shortest

### PSSA / Mock Exam 3

- SSA-MOCK3-Q19: longest, detailed, wrong-absolutes
- SSA-MOCK3-Q31: longest, detailed, wrong-absolutes
- SSA-MOCK3-Q52: longest, detailed, wrong-absolutes
- SSA-MOCK3-Q11: shortest, wrong-absolutes
- SSA-MOCK3-Q12: shortest, wrong-absolutes
- SSA-MOCK3-Q13: shortest, wrong-absolutes
- SSA-MOCK3-Q17: longest, wrong-absolutes
- SSA-MOCK3-Q25: longest, wrong-absolutes
- SSA-MOCK3-Q27: shortest, wrong-absolutes
- SSA-MOCK3-Q32: shortest, wrong-absolutes
- SSA-MOCK3-Q35: longest, wrong-absolutes
- SSA-MOCK3-Q41: longest, wrong-absolutes
- SSA-MOCK3-Q43: longest, wrong-absolutes
- SSA-MOCK3-Q46: longest, wrong-absolutes
- SSA-MOCK3-Q49: longest, wrong-absolutes
- SSA-MOCK3-Q56: longest, wrong-absolutes
- SSA-MOCK3-Q59: shortest, wrong-absolutes
- SSA-MOCK3-Q60: longest, detailed
- SSA-MOCK3-Q01: wrong-absolutes
- SSA-MOCK3-Q02: wrong-absolutes
- SSA-MOCK3-Q05: shortest
- SSA-MOCK3-Q06: longest
- SSA-MOCK3-Q07: wrong-absolutes
- SSA-MOCK3-Q09: longest
- SSA-MOCK3-Q10: wrong-absolutes
- SSA-MOCK3-Q15: wrong-absolutes
- SSA-MOCK3-Q16: wrong-absolutes
- SSA-MOCK3-Q18: shortest
- SSA-MOCK3-Q20: wrong-absolutes
- SSA-MOCK3-Q24: wrong-absolutes
- SSA-MOCK3-Q26: longest
- SSA-MOCK3-Q29: wrong-absolutes
- SSA-MOCK3-Q30: longest
- SSA-MOCK3-Q33: wrong-absolutes
- SSA-MOCK3-Q34: longest
- SSA-MOCK3-Q36: longest
- SSA-MOCK3-Q37: wrong-absolutes
- SSA-MOCK3-Q38: shortest
- SSA-MOCK3-Q39: longest
- SSA-MOCK3-Q42: longest
- SSA-MOCK3-Q44: wrong-absolutes
- SSA-MOCK3-Q50: wrong-absolutes
- SSA-MOCK3-Q51: longest
- SSA-MOCK3-Q53: wrong-absolutes
- SSA-MOCK3-Q55: shortest
- SSA-MOCK3-Q57: wrong-absolutes
- SSA-MOCK3-Q58: wrong-absolutes
