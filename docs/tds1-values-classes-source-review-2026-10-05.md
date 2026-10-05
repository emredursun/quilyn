# TDS1 values and Classes review — 2026-10-05

## M05 — TestCase Specifications

Read complete primary [dynamic-menu](https://docs.tricentis.com/tosca-2026.1/en-us/content/tosca_commander/dynamic_menu_testcasedesign.htm), [combination/filter](https://docs.tricentis.com/tosca-2026.1/en-us/content/testcase_design/instance_combinatorics.htm), [template-binding](https://docs.tricentis.com/tosca-2026.1/en-us/content/testcase_design/testcase_templates.htm) and [TestCases from TestSheet](https://docs.tricentis.com/tosca-2026.1/en-us/content/testcase_design/testcases_in_tcd.htm) articles. Compared objectives, all five local sections, three pitfalls, five recaps and four questions.

Separated empty-field filling, filter visibility, template binding and execution. Removed the unverified claim that every bulk-fill operation respects a display filter, the unconditional higher-level-entry corruption claim and unsupported color interpretation. Added documented automatic XL path prerequisites: empty TestStepValues, unique Attribute-name matches, manual checks and SchemaName inspection. Q3 now tests Reset Instances Filter; Q4 tests XL prerequisites. Existing B keys and stable IDs retained; 16 explanations added.

## M06 — Classes

Read complete [Classes](https://docs.tricentis.com/tosca-2026.1/en-us/content/testcase_design/classes.htm) and [Class references](https://docs.tricentis.com/tosca-2026.1/en-us/content/testcase_design/class_references.htm) articles. Compared objectives, all four local sections, four pitfalls, six recaps and four questions.

Added the important reverse direction: editing an unresolved reference changes its source Class. Resolving one consumer leaves other shared references intact, so it does not automatically make deleting the source safe. Corrected the creation prompt condition to Attributes without child elements; Class creates an Instance collection, Structure does not. This does not certify automatic import of every source combination. Fixed the column name to Relevance and distinguished deactivation from F11 visibility. Removed an unverified Extract Class procedure from current asserted workflows. B keys and stable IDs retained; 16 explanations added.

## Limits and validation

Academy redirects to authentication; original videos, exercise files and historical menus were not certified. Additional UI behaviors unsupported by the accessed documentation are explicitly unverified, not presented as established facts. Documentation screenshots were not individually inspected. No local visual/interactive assets in these modules; no executed Commander, physical-device or AT test.

`npm run manifest:content` regenerated derived files. `npm run check`: 161/161 passed; shell 297.4 KB within 300 KB. Two regression cases cover hashes, keys, anchors, filter mutation assumptions, XL prerequisites and bidirectional reference risk. Shared token 20261005r / quilyn-v133. Local commit only; no push.

Remaining: 586 questions without explanations and 119 local modules pending comparison. This packet completes eight questions / 32 explanations. Together with the two preceding packets in this turn: eight modules, 28 newly explained questions / 112 explanations, and 16 already-explained BA-M04 questions editorially reviewed. Source media limitations, SA-M07 external interactions, unavailable device/AT execution and final all-scope review remain open.
