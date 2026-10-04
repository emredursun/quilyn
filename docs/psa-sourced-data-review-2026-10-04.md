# SA-M38 — sourced-data editorial review

Reviewed 2026-10-04 for Pega Platform '24.2 / '25. All five guide sections, the analogy, four SVG diagrams/captions, seven pitfalls, 13 questions with 52 option explanations, 12 recap entries and six topic references were compared. Review evidence and exact content SHA-256 are recorded in the source-review inventory.

## Corrections

- Reversed mapping examples corrected: Report definition with List, Lookup with Page. Removed automatic-mapping claim for every other source.
- Corrected List access, node/thread visibility, parameter instance assumptions and module/topic durations.
- References follow refresh configuration. Copies can be replaced when parameters change or a populated clipboard page is removed; copying does not make values immutable.
- Clarified selected label versus stored code, simulation purpose and optional refresh. Replaced the unrelated conditional-source rationale on the scope question; narrowed ambiguous question scenarios.

## Sources

- [Module v7](https://academy.pega.com/module/accessing-sourced-data-case/v7/in/67491)
- [Data Pages v6](https://academy.pega.com/topic/data-pages/v6)
- [Data sources v1](https://academy.pega.com/topic/data-sources/v1)
- [Refresh strategies v4](https://academy.pega.com/topic/refresh-strategies-data-pages/v4)
- [Page autopopulation v4](https://academy.pega.com/topic/page-autopopulation/v4)
- [UI controls v4](https://academy.pega.com/topic/data-access-ui-controls/v4)
- [Simulation v7](https://academy.pega.com/topic/simulated-external-data-sources/v7)
- [Official legacy page-scope documentation](https://community.pega.com/sites/pdn.pega.com/files/help_v84/rule-/rule-declare-/rule-declare-pages/main.htm) — used only to clarify scope visibility, not current UI details.

## Verification and limits

`npm run manifest:content` regenerated derived files. `npm run check`: **125/125 passed**, shell remains below 300 KB. Browser diagnostic session on 127.0.0.1:5500: question 9 selection A graded correctly and displayed the corrected SED rationale; no warnings/errors captured. No Pega runtime integration, cache or simulation was executed. Physical iOS/Android and VoiceOver/TalkBack remain unexecuted.

Shared asset token: `20261004j`; service-worker cache: `quilyn-v102`. This package is a local commit; no push or deployment. Overall coverage: **1084/1862 questions**, **778 questions and 156 original queued modules** remain.
