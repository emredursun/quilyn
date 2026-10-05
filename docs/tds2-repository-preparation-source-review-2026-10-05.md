# TDS2 repository and preparation review — 2026-10-05

Reviewed the complete local TDS2-M02 and TDS2-M06 guides, pitfalls, recaps, objectives and six questions. Read the official Tosca 2026.1 LTS installation, Test Data Service, repository create/read/update/delete, Standard Module attributes, TCP inheritance/assignment, API message generation and API Scan Home-menu documentation. Exact source URLs and content hashes are recorded in the review inventory.

M02 now separates repository settings from type-name restrictions, corrects the naming question from the invalid bracketed answer B to C (CustomerDetails), includes all supported database types, explains TCP scope/overrides and addresses authentication. Replaced unverified historical installation screens and course-subset claims with the current documented workflow.

M06 no longer presents a guessed endpoint, universal four-field SQLite payload or Save as → universally importable .tsu workflow. It teaches scanning the installed versioned Swagger definition and distinguishes project save from Commander export, repository removal from permanent database deletion, and web-editor limits from the API contract. Its first question now tests contract discovery. Added 24 specific option explanations across these modules; retained question/section IDs and the other answer keys.

Limitations: Academy videos, their versions and downloadable exercises were inaccessible. No installed Tosca Server, live Swagger definition or Tosca execution was available. Exact request methods, schemas and deletion parameters are explicitly deferred to the installed API definition. These reviews certify the rewritten local documentation-based lessons, not the Academy videos. No local diagrams or interactive exercises in either module. Physical-device tests remain unexecuted because the user confirmed no device/service access.

Validation: generated files regenerated with `npm run manifest:content`; `npm run check` passed 150/150. Initial shell remains within 300 KB. Regression tests protect the corrected answer, stable IDs/anchors, reviewed hashes and the configuration/deletion/save distinctions. Token 20261005l / quilyn-v127. Local commit only; no push.

Original queue after this packet: 620 questions without option explanations and 131 modules still pending local source comparison. General all-scope review remains open.
