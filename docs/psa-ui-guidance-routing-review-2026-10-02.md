# PSA UI, guidance and routing editorial review

Reviewed 2 October 2026. Local source comparison; not a Pega runtime validation, certification endorsement, or production deployment.

## Scope and findings

SA-M10–M12: **55 questions / 220 option explanations**. Read and compared the local objectives, guide concepts/analogies, diagram labels/captions, interactive scenario/options/feedback, pitfalls, question scenarios/options/keys/hints/rationales, recap and references. Review evidence and SHA-256 of each reviewed JSON file are in `source-review-inventory-2026-10-02.json`. A regression checks the hashes so later edits cannot silently retain this evidence.

- SA-M10: corrected Full Page context versus task Form; removed Traditional UI Section and Cosmos React terminology from correct Constellation answers. Corrected hierarchical Form tabs, unsupported nesting-error and inheritance claims, and the interactive claim that supported control choices violate model-driven UI. Replaced the unrelated web cache question with dependent-picklist configuration. Clarified responsive templates, conditional field visibility and validation/authorization boundaries.
- SA-M11: corrected the erroneous Reserved category to New; made automatic status updates conditional on explicit Stage/Step configuration. Distinguished final-Stage entry from resolution after its Processes complete. Replaced unsupported generic badge/progress-component claims with source-backed task instructions/status behavior. Removed the diagram conflating persistent field text with hover tooltips.
- SA-M12: corrected the claim that individual routing automatically creates 25/30 copies. Current user follows task context, not permanently the Case creator. Removed implicit least-workload/skills behavior from a basic queue; made conditional routing explicit. Distinguished Work Group distribution, Persona labels and required access roles. Sequential Assignment Steps express the dependency; two Processes merely sharing a Stage need not execute in sequence.

Question IDs and correct-option IDs remain unchanged, but some scenarios/options changed to correct erroneous concepts. Existing quiz signature/migration logic must therefore invalidate grading for materially changed questions and preserve recovery snapshots; this is covered by the existing check suite. Old history snapshots remain historical. The PSA mock bank has no source-question IDs and was not rewritten by speculative matching.

## Official evidence

- [Application UI design v1, Platform '25](https://academy.pega.com/module/application-user-interface-design/v1): [Views](https://academy.pega.com/topic/views-constellation/v2), [UI configuration](https://academy.pega.com/topic/ui-configuration-app-studio/v5), [Forms](https://academy.pega.com/topic/form-views/v3), [Fields](https://academy.pega.com/topic/exploring-fields/v1), [Model-driven controls](https://academy.pega.com/topic/model-driven-ui-controls/v2).
- Supplementary UI references: [Portals](https://academy.pega.com/topic/portals-and-landing-pages/v7), [Dynamic field behavior](https://academy.pega.com/topic/configuring-dynamic-behavior-forms/v2), [Constellation error handling](https://support.pega.com/support-doc/understanding-error-handling-constellation-forms).
- [User guidance v7, Platform 24.2 / '25](https://academy.pega.com/module/user-guidance/v7): [Case status](https://academy.pega.com/topic/case-status/v5), [Assignment instructions](https://academy.pega.com/topic/assignment-instructions/v4). The explicit `Work-.pyStatusWork` reference is [legacy official help](https://community.pega.com/sites/pdn.pega.com/files/help_v72/basics/portal/casemanager/cm-case-status-con.htm); it is not presented as a new '25 runtime exercise.
- [Routing v8, Platform 24.2 / '25](https://academy.pega.com/module/routing-assignments-users/v8): [Routing work](https://academy.pega.com/topic/routing-work/v7), [Work Queue roles](https://academy.pega.com/topic/configuring-work-groups-and-work-queues/v7), [Access concepts](https://academy.pega.com/topic/personas-operators-and-work-access/v1).

Canonical topic pages were readable. Linked documentation pages returning only a navigation shell were not counted as read evidence. Local duration values are Quilyn study estimates, not copied official course durations.

## Verification

`npm run check`: **100/100 passed**, including feedback completeness, section links, unchanged key IDs, source-evidence hashes and regression assertions for the erroneous claims above. Initial shell remains **297.4 KB**, under 300 KB. Generated assets/index/pages regenerated using `npm run manifest:content`; `git diff --check` clean.

Browser: separate `127.0.0.1:5500` diagnostics origin, SA-M10 Q19 A+B → Correct; all four authored option explanations and review date displayed; related lesson link opened Study Guide. Captured console warning/error list empty. [Feedback capture](screenshots/psa-ui-feedback-2026-10-02.jpg). This package changes content, not shared interface behavior. No new physical-device, screen-reader or offline verification is claimed.

Asset token `20261002ae`; SW `quilyn-v77`. No push/deployment performed. Remaining: **1,148 quiz questions** without authored option feedback and **182 modules** awaiting full local source comparison. Physical device/AT validation and the final overall review remain open.
