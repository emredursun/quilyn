# AE1 introduction and framework review — 2026-10-06

AE1-M00/M01: all local sections, objectives, pitfalls, recaps and 11 questions reviewed. Added 44 individually written option explanations and existing lesson anchors. Original Academy access failed; the course videos, subset, exam gate and optional-section claims are not certified. Replaced unsupported examination questions with technical setup/version questions; all answer keys retained.

Public Tricentis Tosca 2026.1 LTS manual comparison includes TBox introduction, Engines Standard subset overview, upgrade changes, ActionModes, Table, Table steering examples, TC Shell interactive/script workflows, printing reports and WinX.

Key corrections:
- `$` numeric positions are relative to headers; `#` positions are absolute. Business-value matching uses constraints, with uniqueness checked. Former `$ = by value` guidance was wrong.
- Supported ActionModes depend on the referenced Module InterfaceType/control.
- WinX and legacy Win32 are distinguished. Exact old base-subset inventory and folders are not guaranteed; current manual uses Standard modules → Engines.
- Upgrades can change functionality, not just dialog appearance.
- Current reviewed TC Shell reporting uses `NONE` on the report definition. Older REST endpoint, `ASKUSER` and HTTP-success/file guarantees were removed; the original guide was unavailable.

Primary URLs and exact content hashes are recorded per module in the source-review inventory. No local diagrams/interactives exist in these two modules. No live Tosca/Windows test or physical-device/AT test is claimed.

Validation: content regenerated with `npm run manifest:content`; regression checks retained keys, anchors, explanation coverage, inventory hashes and corrected addressing/reporting. `npm run check`: 193/193 tests passed; initial shell remains below 300 KB. Local commit only; no push.
