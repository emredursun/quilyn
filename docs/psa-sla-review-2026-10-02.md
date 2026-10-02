# PSA SLA local-content comparison — 2026-10-02

SA-M15: reviewed objectives, guide and analogy, all diagram labels/captions, interactive options/feedback, pitfalls, 15 question scenarios/options/keys/hints/rationales, recap and references. Authored 60 option explanations and real lesson-section targets. IDs and correct-option IDs preserved; inventory contains the reviewed local-file hash.

Official sources compared:

- [SLA topic v6](https://academy.pega.com/topic/service-level-agreements/v6).
- [Additional tasks v6](https://academy.pega.com/topic/additional-tasks-setting-goals-and-deadlines/v6), including scope-specific panels, Case urgency inheritance and time anchors.
- [Module v8](https://academy.pega.com/module/completing-work-time/v8), applicability 24.2/25.
- [Challenge v8](https://academy.pega.com/challenge/enforcing-service-level-agreements/v8), 24.2 Step configuration.
- [Passed deadline interval v4](https://academy.pega.com/topic/passed-deadline-interval/v4), used for the three-response worked example.

## Corrections

Case urgency inheritance is distinct from an existing Assignment's own SLA changes. Deadline does not inherently resolve work, but an explicitly configured resolution action can. Numerical questions now give increments and processing assumptions instead of inventing universal defaults. Missing notification is not treated as proof of an unattached SLA without configuration evidence. The invented arbitrary additional-interval sequence was replaced with goal, deadline and one passed deadline event. Goal/deadline are milestones, not a complete escalation configuration by themselves.

Case-resolution time anchors and Never are no longer assumed to exist on every lifecycle panel. The supplemental source now names Pega Infinity Studio; the challenge procedure is explicitly scoped to 24.2. No product runtime test or scheduler benchmark is claimed. SA-M15 is now completed, superseding the earlier preparation-only note in the late-work comparison record.

## Verification

`npm run manifest:content` regenerated derived files. `npm run check`: **103/103 passed**, shell **297.4 KB**. Regression tests cover complete option explanations, keys, section targets, evidence hashes and corrected SLA distinctions. Browser question 12 graded correctly and showed all four explanations; warning/error logs empty. [Browser evidence](screenshots/psa-sla-feedback-2026-10-02.jpg).

Query `20261002ah`; SW `quilyn-v80`. Total coverage **773/1862**; **1089 questions** and **178 original queued modules** remain. Physical device/AT validation and final whole-project review remain pending. Local commit only; no push/deployment.
