# TDS1 links and maintenance review — 2026-10-05

## Scope and corrections

Compared objectives, every study-guide element, pitfall, recap and complete question in TDS1-M07, M08 and M09. Added 40 option explanations to 10 questions; stable question/section IDs and B/C/B, B/B/B, B/B/A/B keys retained.

- M07: read complete primary [Instance links](https://docs.tricentis.com/tosca-2026.1/en-us/content/requirements/link_reqs_with_tcd_instances.htm), [ExecutionList links](https://docs.tricentis.com/tosca-2026.1/en-us/content/requirements/requirement_sets_in_execution_section.htm), [ExecutionEntry links](https://docs.tricentis.com/tosca-2026.1/en-us/content/requirements/link_reqs_with_execution_entries.htm) and [Requirements](https://docs.tricentis.com/tosca-2026.1/en-us/content/requirements/requirements.htm) bodies. Physical test creation alone does not replace substitutes. Added explicit replacement prerequisites, list/entry scope distinction, AlwaysAdd/AskUser/NeverAdd behavior, default-off calculation and restart requirements.
- M08: read complete [combinations](https://docs.tricentis.com/tosca-2026.1/en-us/content/testcase_design/instance_combinatorics.htm) article alongside Requirements sources. Replaced an uncertified Academy shipping demonstration with an explicitly independent, unconstrained Linear Expansion example. Separated baseline completion from alternate coverage; removed the arbitrary existing nine-row count. Added Complete Instances versus Propagate Instance(s), actual link inspection and outdated-value recalculation. Q2's two-row answer now has explicit assumptions.
- M09: read complete [TestSheets](https://docs.tricentis.com/tosca-2026.1/en-us/content/testcase_design/testsheets.htm), [Classes](https://docs.tricentis.com/tosca-2026.1/en-us/content/testcase_design/classes.htm), [Class references](https://docs.tricentis.com/tosca-2026.1/en-us/content/testcase_design/class_references.htm) bodies and the [Gherkin context/action/outcome definitions](https://cucumber.io/docs/gherkin/reference/). Removed unsupported vendor thresholds, obligatory four-group layout and clipboard indentation claims. Q2 now tests the documented import command. Replaced automatic exclusion of boundary regression cases with explicitly independent risk-based guidance. Shared references and conceptual Gherkin mapping are explained without promising runtime execution.

## Limits

Original Academy videos/exercises remain inaccessible and are not certified. Source illustrations were not individually inspected. These modules have no local visual/interactive assets. Commander execution, physical-device and AT tests were not performed. Inventory hashes identify the exact reviewed local bytes; unsupported historical behaviors are removed or explicitly unverified.

## Validation

`npm run manifest:content` regenerated derived artifacts. `npm run check`: 164/164 passed, shell 297.4 KB within 300 KB. Three regression cases cover provenance hashes, answer keys, anchors, substitute replacement, link scopes, method assumptions, dashboard freshness, documented imports and retained boundary coverage. Shared token 20261005s / quilyn-v134. Local commit only; no push.

Remaining after this packet: 576 questions without explanations and 116 local module comparisons. Source-media limitations, SA-M07 external interactions, unavailable physical-device/AT execution and final all-scope review remain open.
