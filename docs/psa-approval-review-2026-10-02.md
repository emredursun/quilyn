# PSA approval editorial comparison — 2026-10-02

## Scope and evidence

SA-M13 and SA-M14: reviewed all local objectives, guide concepts and analogies, SVG labels/captions, interactive scenarios/options/feedback, pitfalls, 29 practice scenarios/options/keys/hints/rationales, recap and references. Authored 116 per-option explanations with actual lesson-section targets. Question IDs and correct-option IDs remain unchanged; misleading question wording was replaced. The source inventory records a SHA-256 of each reviewed local JSON file.

Official sources read:

- [Work approval v7](https://academy.pega.com/topic/work-approval/v7): routing, external approval enablement and approved/rejected flow.
- [Designing an approval Process v8](https://academy.pega.com/module/designing-approval-process/v8): 24.2/25 applicability and objectives.
- [Cascading approvals v4](https://academy.pega.com/topic/cascading-approvals/v4): model selection and approver-list behavior.
- [Cascading approvals module v4](https://academy.pega.com/module/cascading-approvals/v4): objectives, applicability and challenge references.
- [Reporting structure challenge v7](https://academy.pega.com/challenge/configuring-cascading-approval-reporting-structure/v7): 24.2 Dev Studio configuration and conditional depth.
- [Authority matrix challenge v7](https://academy.pega.com/challenge/configuring-cascading-approvals-authority-matrix/v7): 24.2 Page List, approver property and Decision table configuration.

## Corrections

Removed the false parallel any-one cascade, universal third Send back outcome and unsupported automatic approval by timeout. Default rejection now differs clearly from an explicitly configured revision destination. Status labels no longer pretend to diagnose an unseen routing failure.

Reporting structure and authority matrix are consistently separated throughout both lessons. The matrix is not equated with a Decision table; Reporting Manager and Workgroup Manager alternatives and current-user context are explicit. Conditional depth no longer promises arbitrary middle-tier skipping. The contradictory Studio statements were replaced with the actual, version-scoped challenge workflow. SVGs and interactive examples were rewritten alongside the questions, rather than retaining their former contradictory claims.

## Verification and limits

`npm run manifest:content` regenerated assets, indexes, static pages and manifests. `npm run check`: **101/101 passed**, shell **297.4 KB**. Regression coverage checks identities, complete feedback, real section targets, evidence hashes and corrected approval semantics.

Desktop browser: M13 question 1 accepted the shared-queue answer; expanding feedback displayed all four authored explanations and the review date. No warning/error log entries. [Browser evidence](screenshots/psa-approval-feedback-2026-10-02.jpg).

This is local-content editorial comparison, not execution of the Pega challenges. The linked challenges target 24.2; the module metadata covers 24.2/25. Actual iOS/Android, VoiceOver/TalkBack validation and the final whole-project review remain pending. Total authored coverage: **743/1862**; **1119 questions** and **180 original queued modules** remain. Query token `20261002af`; SW `quilyn-v78`. Local commit only; no push or deployment.
