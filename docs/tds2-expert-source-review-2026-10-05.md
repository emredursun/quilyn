# TDS2-M05 Expert module review — 2026-10-05

Read all five local sections, three pitfalls, five recaps and three questions. Compared them against the complete Tosca 2026.1 LTS official documentation bodies:

- [Expert module](https://docs.tricentis.com/tosca-2026.1/en-us/content/test_data_management/tds_expert_module.htm)
- [Module attributes](https://docs.tricentis.com/tosca-2026.1/en-us/content/standard_subset/test_data/tds_modules.htm)
- [Find item](https://docs.tricentis.com/tosca-2026.1/en-us/content/test_data_management/tds_find_item.htm)
- [Create item](https://docs.tricentis.com/tosca-2026.1/en-us/content/test_data_management/tds_create_item.htm)

Corrected task names, omitted lock operations, the automatic-unlock claim, Find selection limits and the broad claim that all other operations acquire an item lock. Replaced the unverifiable course walkthrough with an explicitly independent synthetic example. The underlying Academy video was inaccessible and its version is not certified; the user-facing metadata names the documentation baseline explicitly. No claim of executing Tosca or reading the proprietary exercise is made. This local module has no diagram/interactive content.

Added 12 individually written option explanations across three questions. Preserved Q1/Q2/Q3 and their C/C/B keys; added stable lesson-section references. Questions now distinguish reads, reservation, modification and deletion scope. Original queue remaining: 633 questions and 135 modules. Physical-device testing and final all-scope review remain open.

Validation: generated assets via `npm run manifest:content`; `npm run check` passed 146/146 and `git diff --check` passed. Regression checks unchanged answer keys, reviewed hash, lesson links, explicit lock release and configurable Find selection. Token 20261005i / quilyn-v124. Local commit only; no push.
