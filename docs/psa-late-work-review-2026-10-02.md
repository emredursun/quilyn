# PSA late-work local-content comparison — 2026-10-02

SA-M16 reviewed across objectives, guide/analogy, diagram/caption, three interactive examples, pitfalls, all 15 questions and their keys/hints/rationales, recap and topic references. Added 60 specific option explanations and real section links; IDs and answer keys preserved. Inventory stores the reviewed file hash.

Sources read:

- [Passed deadline interval v4](https://academy.pega.com/topic/passed-deadline-interval/v4).
- [Escalating late work module v6](https://academy.pega.com/module/escalating-late-work/v6), applicability 24.2/25.
- [Escalating late work challenge v7](https://academy.pega.com/challenge/escalating-late-work/v7), detailed configuration scoped to 24.2.
- [Service-Level Agreements v6](https://academy.pega.com/topic/service-level-agreements/v6), escalation context.

Corrections: recurring events do not necessarily run indefinitely or until whole-Case resolution; configured count and Assignment completion matter. Arithmetic questions state event-limit and timely-processing assumptions. A missing email no longer pretends to prove a scheduler diagnosis. Passed deadline configuration belongs to the SLA Rule, not an invented separate interval Rule. Urgency and notification configuration are distinct, including at the 100 cap. The guide now includes the linked challenge’s finite event count and the subsequent SLA editing behavior. Old interactive and diagram statements were corrected alongside the quiz.

No Pega runtime exercise, scheduler benchmark, email delivery or physical-device/AT testing is claimed. SA-M15 sources were read in preparation but its full local comparison remains pending and is not counted as completed.

Verification: `npm run manifest:content`; `npm run check` results recorded below. Query `20261002ag`; SW `quilyn-v79`. No push/deployment. Authored coverage 758/1862, leaving 1104 questions; 179 original queued modules remain.

`npm run check`: **102/102 passed**, initial shell **297.4 KB**. Regression tests cover complete feedback, real targets, evidence hash, finite-event assumptions and the urgency ceiling. Browser question 7 graded correctly and displayed all four explanations; warning/error logs empty. [Browser evidence](screenshots/psa-late-work-feedback-2026-10-02.jpg). The [physical-device test matrix](release/physical-device-at-validation-2026-10-02.md) is ready but explicitly unexecuted.
