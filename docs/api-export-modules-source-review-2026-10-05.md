# API export and Module source review — 2026-10-05

Reviewed TAPI-M05 and TAPI-M06: all objectives, study sections, pitfalls, recaps, questions, hints and rationales. Added 52 option explanations for 13 questions, preserving question IDs and answer keys. Exact content hashes and primary references are recorded in the source-review inventory.

## Corrections

- Export destinations now distinguish an existing selected ComponentFolder, a new folder and structured folder export. Removed unsupported universal artifact counts, fixed folder names, selection-shortcut exclusions and future WSE predictions.
- Current API terminology is Module Attributes. Removed claims that all request/response artifacts become independent and all Technical View content is universally selectable.
- Corrected Add and buffer on a request: Insert with a buffer-reference DefaultValue. Response uses Buffer. Insert itself does not guarantee server object creation.
- Separated refreshing a Module through API Scan from retargeting a ModuleAttribute through API Testing Update. Corresponding messages receive Module edits automatically; changed mappings still require inspection and validation.
- Replaced purported verbatim Academy summaries with independent guidance. Removed unverified brace-selection and blanket case-sensitivity assertions.

## Sources and limits

Read the complete article bodies for [export](https://docs.tricentis.com/tosca-2026.1/en-us/content/tbox/api_scan_export.htm), API TestCases, Module Attributes overview, creation, steering, Scan updates, mapping updates and validation; the inventory lists their URLs.

Academy videos/exercise files were not accessible. Source illustrations were not individually inspected. Neither module has local visual/interactive assets. API Scan/Commander execution and physical-device/VoiceOver/TalkBack tests were not performed.

## Validation

- `npm run manifest:content`: regenerated derived content.
- `npm run check`: 169/169 tests passed; initial shell 297.4 KB, within 300 KB.
- Regression covers selected-folder export, request buffer defaults, automatic corresponding-message updates and mapping validation.
- `git diff --check`: passed.
- Asset token `20261005w`; service worker `quilyn-v138`. Local commit only; no push or deployment.
