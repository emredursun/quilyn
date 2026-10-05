# PSA capturing and presenting data source review — 2026-10-05

Reviewed the complete SA-M07 local guide, analogy, two SVG diagrams, four-scenario interactive, seven pitfalls, five recaps, 17 questions and 68 option explanations against the module page and all three linked topic bodies:

- https://academy.pega.com/module/capturing-and-presenting-data/v8
- https://academy.pega.com/topic/fields/v7
- https://academy.pega.com/topic/calculated-values/v6
- https://academy.pega.com/topic/views/v6

Fields: completed the simple and fancy Field Type lists (Date only, Time only, Address, User reference, Prediction, Attachment, Location), action-oriented Email/Phone/URL links, type prediction from the field name with the Text (single line) default, and the Integer leading-zero guidance. Removed the unsupported Rich Text type and the claim that a calculated value is a Field Type from the diagram. The pitfall no longer says Text is always wrong.

Calculated values: scoped recalculation to input updates and the calculation network, added function data types, expression operators and concatenation, the Email/Phone/Picklist expression exclusion, the Constellation requirement for custom App Studio decision tables, the relevant-record requirement for Dev Studio decision tables, and Case Type versus data object placement. Read-only presentation is described as a design choice for no-override requirements, not as an inherent rule.

Views: replaced unsupported View-type rules (Form editable by default, List read-only by default, Full Page and Partial always read-only) in the diagram, simulator and recap with the topic's model: a form is a type of View, not every View is a form, and each field is configured as editable or read-only, visible or hidden, required or optional. Question 11 now tests that distinction with the topic's read-only confirmation example. The fourth simulator scenario uses the topic's loan officer example. Constellation View type names stay in one caption, marked as outside this module topic.

Questions: preserved question IDs and answer keys. Corrected Currency (default currency type, no locale-validation claim), Date only, and Field Type statements to the topic wording; removed absolute claims from distractor texts; fixed a rationale that referred to options not present. Module and topic times are 45 minutes including the quiz and 15/20/5 minutes.

Validation: `npm run manifest:content`; `npm run check` passed 144/144; `git diff --check` passed. Regression covers stable keys, the source-review hash, topic URLs and timings, simulator wording and removed claims. Browser check verified both rewritten diagrams and question 11 grading with four option explanations; the simulator iframe could not be inspected visually because the browser pane was hidden, but its generated script differs from the previous version only in scenario data, which parses and renders in a DOM stub. Shared token 20261005f / quilyn-v121.

This is an editorial comparison of topic text. Embedded videos, images and knowledge-check interactions were not transcribed. Physical iOS/Android and VoiceOver/TalkBack tests remain unexecuted. Original review backlog: 137 modules and 636 questions.
