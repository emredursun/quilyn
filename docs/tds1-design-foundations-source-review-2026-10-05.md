# TDS1 design foundations review — 2026-10-05

Reviewed the complete local objectives, guide elements, bullets, pitfalls, recaps and questions for TDS1-M01 through M04. This packet adds 68 explanations to 17 questions. Stable section/question IDs and existing answer keys retained. No local diagrams or executable interactions are present in these four modules.

## Requirements — M01

Read [Requirements](https://docs.tricentis.com/tosca-2026.1/en-us/content/requirements/requirements.htm), [Requirement links](https://docs.tricentis.com/tosca-2026.1/en-us/content/requirements/link_reqs_to_testcases.htm), and the complete observed [2024.1 column reference](https://docs.tricentis.com/tosca-2024.1/en-us/content/requirements/requirement_properties.htm).

Separated directly entered Weight from Frequency/Damage inputs. Kept the documented base-2 arithmetic; removed an unverified adjustable-base claim and mandatory 1–5 policy. Scoped top-down planning as an independent suggestion. Distinguished importance allocations, specified coverage, executed coverage and execution state; executed includes failed tests. Removed unconditional sibling-total claims; the quiz explicitly uses a flat positive-total set. Current refresh behavior is scoped to 2026.1; historical 10.2/10.3 transition and an unverified F6 refresh shortcut are no longer taught. Setting changes require restart.

## Attributes — M02

Read [Attributes](https://docs.tricentis.com/tosca-2026.1/en-us/content/testcase_design/attributes.htm), [TestSheets](https://docs.tricentis.com/tosca-2026.1/en-us/content/testcase_design/testsheets.htm), [overview](https://docs.tricentis.com/tosca-2026.1/en-us/content/testcase_design/testcase_design_intro.htm), and [Steps](https://docs.tricentis.com/tosca-2026.1/en-us/content/testcase_design/tcd_steps.htm).

The accessed pages do not substantiate the previous non-editable AttrType assertion. Replaced Q1 with documented nesting, retaining its B key. Clearly identified the four-group layout as an independent organizational example. Added naming restrictions and separated nested structure from BusinessRelevant. Parent relevance propagation and Yes/No/Result were verified.

## Instances — M03

Read complete [Instances](https://docs.tricentis.com/tosca-2026.1/en-us/content/testcase_design/instances.htm) and [combination methods](https://docs.tricentis.com/tosca-2026.1/en-us/content/testcase_design/instance_combinatorics.htm).

Added the missing StraightThrough restriction: Position becomes Inner and cannot be changed while that Character is selected. A negative input does not automatically pass/fail: explicit checks must verify the required outcome. Removed one-time-boundary-test guidance and unverified nested-instance restrictions. The age equivalence question now explicitly assumes equal behavior and no additional thresholds. Independent age/password examples are not represented as executed vendor exercises.

## Combinations — M04

Read the complete combination and Instances pages plus [dynamic menu](https://docs.tricentis.com/tosca-2026.1/en-us/content/tosca_commander/dynamic_menu_testcasedesign.htm) and [shortcuts](https://docs.tricentis.com/tosca-2026.1/en-us/content/tosca_commander/appendix.htm).

Distinguished generated design datasets from executable tests. Scoped arithmetic to simple unconstrained models; relation-aware expansion can change the set. Removed universal default/legal-industry claims. Added value/pair coverage distinction and Complete Instances behavior. Duplicate merging checks values, Character and Position. The exact previous Arrange ordering was not verified, so Q4 now tests the documented Arrange/Merge distinction. F9 visibility and F12 symbol visibility are separate, with active-window scope.

## Evidence limits and validation

Academy access redirects to authentication; original videos, exact syllabus and exercise numbering are not certified. Documentation illustrations were not individually inspected. Column mechanics remain explicitly scoped to the observed 2024.1 reference; they are not claimed executed on a 2026.1 installation. No Commander runtime, physical-device or assistive-technology execution.

`npm run manifest:content` regenerated derived artifacts. `npm run check`: 159/159 passed, initial shell 297.4 KB within 300 KB. Four regression cases check content hashes, preserved keys/anchors and corrected claims. Shared token 20261005q / quilyn-v132. Local commit only; no push.

Remaining inventory: 594 questions without option explanations and 121 pending local modules. Source media/interaction limitations, SA-M07 external checks, unavailable real-device testing and all-scope final review remain open. Together with the prior packet in this turn: six local modules compared, 20 newly explained questions / 80 option explanations, plus editorial review of 16 already-explained BA-M04 questions.
