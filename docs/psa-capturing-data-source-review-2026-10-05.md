# PSA capturing and presenting data source review — 2026-10-05

Reviewed the complete SA-M07 local guide, analogy, two SVG diagrams, four-scenario interactive, seven pitfalls, five recaps, 17 questions and 68 option explanations against the module page and all three linked topic bodies:

- https://academy.pega.com/module/capturing-and-presenting-data/v8
- https://academy.pega.com/topic/fields/v7
- https://academy.pega.com/topic/calculated-values/v6
- https://academy.pega.com/topic/views/v6

Fields: completed the simple and fancy Field Type lists (Date only, Time only, Address, User reference, Prediction, Attachment, Location), action-oriented Email/Phone/URL links, type prediction from the field name with the Text (single line) default, and the Integer leading-zero guidance. Removed the unsupported Rich Text type and the claim that a calculated value is a Field Type from the diagram. The pitfall no longer says Text is always wrong.

Calculated values: scoped recalculation to input updates and the calculation network, added function data types, expression operators and concatenation, the Email/Phone/Picklist expression exclusion, the Constellation requirement for custom App Studio decision tables, the relevant-record requirement for Dev Studio decision tables, and Case Type versus data object placement. The subsequent visual review corrected the initial text-only interpretation: the illustrated App Studio calculated-field option is explicitly read-only. This is scoped to that configuration, without asserting persistence behavior or universal Dev Studio property settings.

Views: replaced unsupported View-type rules (Form editable by default, List read-only by default, Full Page and Partial always read-only) in the diagram, simulator and recap with the topic's model: a form is a type of View, not every View is a form, and each field is configured as editable or read-only, visible or hidden, required or optional. Question 11 now tests that distinction with the topic's read-only confirmation example. The fourth simulator scenario uses the topic's loan officer example. Constellation View type names stay in one caption, marked as outside this module topic.

Questions: preserved question IDs and answer keys. Corrected Currency (default currency type, no locale-validation claim), Date only, and Field Type statements to the topic wording; removed absolute claims from distractor texts; fixed a rationale that referred to options not present. Module and topic times are 45 minutes including the quiz and 15/20/5 minutes.

Validation: `npm run manifest:content`; `npm run check` passed 144/144; `git diff --check` passed. Regression covers stable keys, the source-review hash, topic URLs and timings, simulator wording and removed claims. Browser check verified both rewritten diagrams and question 11 grading with four option explanations; the simulator iframe could not be inspected visually because the browser pane was hidden, but its generated script differs from the previous version only in scenario data, which parses and renders in a DOM stub. Shared token 20261005f / quilyn-v121.

## Visual and interactive follow-up

The browser review inspected the Fields booking example, simple/fancy field illustrations, and both the empty and completed Arrival date animation states (Text single line becomes Date only). Compared those examples with the local field diagram.

Calculated values: inspected function options, expression setup, cart totals, both Case Type/data-object comparison images, and both Dev Studio/App Studio decision-table images. All illustrated App Studio calculation dialogs label the setting read-only. The Dev Studio decision-table image also explicitly marks its record relevant. Opened all four calculation-network hotspots and compared their formulas with the underlying cart image (23.25 + 17.00 = 40.25; 8% tax 3.22; final cost 43.47). Read both calculation knowledge-check prompts/options to compare automatic updates and dependency relationships; no logged-in course submission was made.

Views: inspected all five source illustrations, including the loan applicant form and loan officer display with editable decision fields, the problem-report form, and conditional address View. The two knowledge-check locations on Views did not render interaction controls in this browser, so their hidden contents are not claimed as verified. Fields knowledge-check prompts/options were inspected; the drag-and-drop exercise was not submitted.

Executed all four local simulator scenarios in the browser: correct answers reached 4/4 (100%), answering disabled the option buttons, Next advanced the scenario and Restart returned to scenario 1 with score 0/4. This replaces the earlier limitation concerning inspection of the local iframe; a hidden browser pane does not prevent its inspection.

Follow-up validation: `npm run manifest:content`, `npm run check` (144/144 passed), and `git diff --check` passed. Regression assertions preserve the documented App Studio read-only setting and prohibit the unsupported persistence inference. Shared token 20261005g / quilyn-v122.

Physical iOS/Android and VoiceOver/TalkBack tests remain unexecuted; the user confirmed no device/service access on 2026-10-05. Source interactions that failed to render and any uninspected video content remain outside this evidence. Original module backlog remains 137; the 636 unanswered editorial-review items are unchanged by this follow-up.

## Source interaction availability recheck — 2026-10-06

Reopened the original Views v6 topic in the browser. Both “Check your knowledge” paragraphs are present, but their surrounding published content containers contain no interaction element or iframe; the page contains zero iframes and the browser warning/error log is empty. This is a source-page availability limitation, not evidence that Quilyn's local simulator failed. The missing source interactions cannot be inspected or submitted in this session. No source answer key is inferred from the surrounding prose.
