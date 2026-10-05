# AS1 Modules source review — 2026-10-05

TAS1-M02: all objectives, eight sections, eight pitfalls, fifteen recaps and twelve questions reviewed; 53 option explanations added. Keys D/ABC/A/D/A/B/C/D/BCFGH/A/B/C preserved with corrected scenarios.

- ModuleAttributes are scanned controls or Standard Module parameters, not merely Module metadata.
- Current identification guidance prioritizes stable properties and parent context; modern web anchors are not the default remedy for a dynamic ID.
- Anchor Auto first tries ShortestPath then Coordinate. Removed universal resolution/stability guarantees.
- ControlGroup conversion accepts eligible same-type radio buttons, buttons or links; grouped values select a member, not all controls at once. Corrected the command to Convert to ControlGroup.
- Wildcards require uniqueness review; model reuse does not guarantee correct data, business expectations or passing dependent tests.
- Five local SVGs updated, including JEWELRY typo; peer exercises explicitly independent.

Primary Tosca 2026.1 documents and exact content hash are recorded in the source-review inventory. Compared Module overview/options, scan overview/start/UI, property/anchor identification, identifier best practices, naming and Standard subset bodies/descriptions. Academy videos/exercises inaccessible; source illustrations not individually inspected. No Tosca execution or physical-device/AT tests.

Shared token 20261005ac; SW cache quilyn-v144.

All five local SVGs visually inspected in the desktop light theme. Generated manifests/pages regenerated. `npm run check`: 175/175 passed; initial shell 297.4 KB. `git diff --check` passed.
