# SA-M41 — managing application access editorial review

Full comparison on 2026-10-04 for Pega Platform '24.2 / '25: two guide sections, analogy, two diagrams/captions, seven pitfalls, 15 questions with 60 option explanations, seven recap entries and two topic references. Exact content hash and evidence are recorded in the review inventory.

## Corrections

- Entire reversed production scale fixed: **5 Production, 4 Staging, 3 QA, 2 Development, 1 Sandbox**. Added nonzero permission ≥ system-level comparison and 0 denial.
- ARO is Access of Role to Object and supports No Access. Removed grant-only and unconditional cross-role denial/general permission claims.
- Management tools are preferred where sufficient; direct Rule forms are needed for intermediate values, since the tools set 0/5.
- Fixed ambiguous Channel question, unrelated manager-group rationale, incorrect Access Manager path mention and the assertion that Personas are universally required for underlying RBAC assignment.

## Sources

- [Module v7](https://academy.pega.com/module/managing-application-access/v7)
- [Application access v6](https://academy.pega.com/topic/application-access/v6)
- [Access control v5](https://academy.pega.com/topic/access-control/v5)
- [Supplemental Persona/Access Group relationship](https://academy.pega.com/topic/personas-operators-and-work-access/v1)

## Verification and limits

Derived files regenerated. `npm run check`: **128/128 passed**; shell below 300 KB. The first run caught two option explanations shorter than the existing minimum; both expanded and the complete check rerun passed. Browser diagnostic Q7 A graded level 5 as Production with corrected rationale; no captured warnings/errors.

This is editorial source comparison, not executed Pega access evaluation or production-level testing. Real iOS/Android and VoiceOver/TalkBack remain unexecuted. Asset token `20261004m`; cache `quilyn-v105`. Local commit only; no push. Coverage **1126/1862**; **736 questions and 153 original queued modules** remain.
