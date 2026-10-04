# SA-M45 — Unit tests and coverage editorial review

Compared on 2026-10-04: module labeled '24.2 and applies to '25. Reviewed objectives, three complete sections, analogy, three SVGs/captions, seven pitfalls, 15 questions with 60 option explanations, seven recaps and three topic references. Two SVGs corrected; matching pyramid retained. Inventory records exact hash.

## Corrections

- Separated SysAdm4 suite execution, SysAdm4/User4 coverage contribution and pzStartOrStopMasterAppRuleCoverage session initiation.
- Normal Rule Resolution needs eligible context; a higher version number alone is insufficient.
- Current assertion examples include Decision result. Removed validation-summary-only teaching from the current example list.
- Coverage identifies exercised Rules, not exhaustive internal paths or universal report visibility.
- Removed automatic mocking and pipeline-stop claims from the standalone test diagram. Tests remain independent.
- Earlier Run/binary-file/sequential/storage details explicitly attributed to Academy v5; linked current documentation returned a page shell. Removed unverified merge path and latest-report-only claim.
- Retained the documented Create Stage restriction without inventing a universal workaround. Corrected automation-priority examples.

## Sources

- [Module v4](https://academy.pega.com/module/devops-pega-platform/v4)
- [Unit tests v6](https://academy.pega.com/topic/unit-tests/v6)
- [Earlier unit tests v5](https://academy.pega.com/topic/unit-tests/v5)
- [Creating tests v7](https://academy.pega.com/topic/creating-unit-test-cases/v7)
- [Coverage v4](https://academy.pega.com/topic/test-coverage/v4)

## Verification and limits

`npm run manifest:content` regenerated derived outputs. Final `npm run check`: **132/132 passed**, shell below 300 KB. Initial new regression asserted the privilege text in the rationale instead of its answer; corrected that assertion to check the exact answer. Browser Q11 A graded correctly; no captured warnings/errors. No executed PegaUnit, recording, storage or privilege tests; no physical-device/assistive-technology tests.

Asset token `20261004q`; cache `quilyn-v109`. Local commit only. Coverage **1183/1862**; **679 questions and 149 original queued modules** remain.
