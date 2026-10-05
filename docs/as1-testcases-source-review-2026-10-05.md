# AS1 TestCases source review — 2026-10-05

Reviewed TAS1-M03 against the primary bodies listed in its source-review inventory entry, using Tosca On-Premises 2026.1 documentation and Microsoft date-format documentation. All 23 local sections, objectives, pitfalls, recap entries, question scenarios, options, hints and rationales were inspected.

## Corrections

- TestSteps can contain multiple values/actions; creation examples are not an exhaustive count.
- WorkState describes progress; the example sequence is not an enforced approval workflow.
- Corrected the CP delimiter explanation, inheritance/override scope and current general column-add workflow.
- Added Secret/RawString to the historical value-type list and bounded WaitOn by its synchronization setting.
- Distinguished stored buffers from runtime-only creation, random generation from uniqueness and w workdays from weeks.
- Made month-end practice distinguish the actual day; removed a valid date expression from the distractors of the month-offset question.
- Scoped the reference suffix to the documented step-to-library conversion and resolution to the affected block link. Removed unsupported alphabetical sorting and universal save-based Undo limits.
- Removed unverified official/exam provenance. Added 75 option explanations to 19 independent practice questions, with stable lesson anchors.
- Corrected three independent local SVGs; inspected in desktop light theme; fixed reversed Buffer arrowheads and overlapping transition labels. Dark/mobile rendering not tested.

## Limits

Academy videos, Exercises 05–17, knowledge checks and their original illustrations were inaccessible. Their links do not establish that they were inspected or executed. Local examples are independent documentation-based practice. No Tosca execution or real iOS/Android/VoiceOver/TalkBack test occurred.

## Validation

Regenerated content artifacts. Regression assertions cover answer keys, explanation coverage, source hash, date ambiguity, workday units, value types, bounded waits and reference scope. `npm run check`: 176/176 tests passed after regeneration and visual refinements; initial shell 297.4 KB. `git diff --check` passed. This packet is a local review, not evidence of production deployment.
