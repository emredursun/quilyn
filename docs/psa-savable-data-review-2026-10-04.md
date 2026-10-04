# SA-M39 — saving data editorial review

Full local-content comparison on 2026-10-04: four guide sections, analogy, two diagrams/captions, seven pitfalls, all 13 questions and 52 option explanations, eight recap entries and two topic references. Current module source identifies Pega Platform '24.2 / '25 / '26. Exact content hash and scope are recorded in the source-review inventory.

## Corrections

- Reversed autopopulation advice fixed: the current Savable Data Pages source recommends **Copy**, warning that Refer can overwrite pending edits. Question 5 answer changes A → B.
- Database save mapping is available when needed, not universally mandatory. Removed the claim that every clipboard property needs explicit column mapping.
- Activity persistence is implementation-dependent; removed universal atomic rollback guarantees across remote systems.
- Rebuilt the false trigger diagram with flow automation, Flow Action post-processing and Save-DataPage Activity invocation.
- Fixed unrelated question 9 rationale, incomplete hint, unconditional flow-placement rules and one-target generalizations; clarified implicit parameters and conditional sourcing scenarios.

## Sources

- [Module v7](https://academy.pega.com/module/saving-data-system-record/v7)
- [Savable Data Pages v5](https://academy.pega.com/topic/savable-data-pages/v5)
- [Save Data Page Automation v5](https://academy.pega.com/topic/save-data-page-automation/v5)

## Verification and limits

Derived outputs regenerated with `npm run manifest:content`. `npm run check`: **126/126 passed**; shell below 300 KB. Browser diagnostic quiz on 127.0.0.1:5500: Q5 selection B graded correctly and displayed Copy rationale; no captured console warnings/errors. No Pega save implementation, external rollback, database persistence, physical-device or assistive-technology test executed.

Asset token `20261004k`; cache `quilyn-v103`. Local commit only, no push/deployment. Coverage **1097/1862** questions; **765 questions and 155 original queued modules** remain.
