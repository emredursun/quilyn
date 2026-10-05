# Modular reuse and test design review — 2026-10-05

## BA-M04

Compared all six local sections, objectives, eight pitfalls, eight recaps and 16 full questions, including hints, keys and 64 existing option explanations, with both complete Academy topics and the readable Layer Cake transcript. Visually inspected both Academy diagrams: consuming business applications sit above reusable module applications; relevant records bridge Dev Studio and App Studio. Also read both complete linked Platform '25 articles.

Sources: [Modular reuse architecture](https://academy.pega.com/topic/modular-reuse-architecture/v1/in/102526), [Studio interoperability](https://academy.pega.com/topic/studio-interoperability-and-reuse-library/v1/in/102526), [Relevant records](https://docs.pega.com/bundle/platform-25/page/platform/app-dev/relevant-records-studios-interoperability.html), [Reuse Library](https://docs.pega.com/bundle/platform-25/page/platform/app-dev/journey-rl-reusable-assets-reuse-library.html).

Corrected the unrelated AIG hint, dependency direction and mandatory Center of Excellence implication. Distinguished design goals from unconditional compatibility/update guarantees. Added the technical distinction between relevant records and supported library categories: a relevant SLA need not appear in the library. Added traditional UI Section/Harness scope, Constellation Views, asset details, Business Logic authoring and data-object availability. Removed the false inference that every Data Transform/SLA must always be manually marked. Existing keys and stable IDs retained.

Limitations: source knowledge checks did not render; video reviewed through transcript, not playback. Technical article illustrations and correspondence video were not individually inspected/executed. No local diagrams or interactive exercises in this module. No Pega runtime execution.

## TDS1-M00

Read the complete local module and five current primary documentation bodies: [Requirements](https://docs.tricentis.com/tosca-2026.1/en-us/content/requirements/requirements.htm), [TestCase-Design](https://docs.tricentis.com/tosca-2026.1/en-us/content/testcase_design/testcase_design_intro.htm), [Combination methods](https://docs.tricentis.com/tosca-2026.1/en-us/content/testcase_design/instance_combinatorics.htm), [Requirement links](https://docs.tricentis.com/tosca-2026.1/en-us/content/requirements/link_reqs_to_testcases.htm), [TestSheets](https://docs.tricentis.com/tosca-2026.1/en-us/content/testcase_design/testsheets.htm).

Replaced unverified course/video claims with an explicitly independent documentation-based introduction. Separated criteria, logical design and executable tests. Removed guarantees of one failure cause, minimum tests and automatically live reporting. Added manual recalculation/default-off AutoCalculateRequirements and restart requirement. Kept the local roadmap clearly identified as Quilyn's own content. Added 12 option explanations to three questions; B keys and section/question IDs retained.

Limitations: Academy redirected to login, so its video, exact syllabus and exercises remain unverified. Documentation illustrations not separately inspected. No local diagram/interaction or Commander runtime execution.

## Validation and remaining scope

`npm run manifest:content` regenerated derived artifacts. `npm run check`: 155/155 passed; initial shell 297.4 KB within 300 KB. Two regressions check source hashes, stable keys/anchors and corrected library/recalculation claims. Shared token 20261005p / quilyn-v131. Local commit only; no push.

611 questions still lack option explanations and 125 local modules remain in the source-comparison queue. These counts do not certify inaccessible source media or interactions. Real iOS/Android and VoiceOver/TalkBack execution remains blocked by absent device/service access. SA-M07 external knowledge-check limitations and all-scope final review remain open.
