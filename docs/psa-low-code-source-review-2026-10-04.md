# PSA low-code source review — 2026-10-04

SA-M01 was compared against the five complete source topics: all seven guide sections, analogies, seven SVGs, six interactive examples, ten pitfalls, 22 question texts/options/keys/hints/rationales and existing 88 option explanations, and twelve recap entries. Existing explanations were reviewed, not counted as new coverage.

## Sources

- [Low-code defined v9](https://academy.pega.com/module/low-code-defined/v9), Pega Platform 25, 55 minutes including quiz.
- [Low-code development v6](https://academy.pega.com/topic/low-code-application-development/v6).
- [Studios v6](https://academy.pega.com/topic/studios/v6).
- [App Studio v7](https://academy.pega.com/topic/app-studio/v7).
- [Dev Studio v7](https://academy.pega.com/topic/dev-studio/v7).
- [External integration v4](https://academy.pega.com/topic/integrating-external-applications/v4).

## Corrections

The first diagram and one pitfall contradicted the recommended App Studio workflow for technical users. Distinguished recommended authoring from the configured login default, and removed an unverified Prediction Studio licensing assertion while retaining its Access Group Portal requirement.

Corrected the generic studio diagram's App Studio-specific Workbench label, the incomplete three-region retrieval answer, and false cross-module tool-location claims. Replaced an analogy that implied traditional programming never reuses components.

Scoped co-development and shared Process access instead of assigning studios exclusively by job title or promising inheritance to every Case Type. Distinguished non-business-day exclusions from office-hours counting in question 17 and the simulator. Scoped the layer widget to the high-level structural view documented by the source. Preserved question IDs, keys and lesson targets.

## Verification and limitations

`npm run manifest:content` regenerated static content and interactive assets. `npm run check`: **136/136 passed**. An older test expected the original explanation review date; updated that assertion specifically for SA-M01's new review. All answer-key assertions remain enforced. `git diff --check` passed.

Isolated browser: question 17 option A graded correctly with the revised rationale. The simulator accepted the App Studio answer, advanced to its revised business-day scenario and showed score 1/4. Warning/error logs were empty. No executed Pega studio, SLA, robot integration or physical-device validation is claimed.

Coverage remains 1,226/1,862 questions. Source review backlog: 145 originally queued modules. Cache query `20261004u`, service worker `quilyn-v113`; local package only.
