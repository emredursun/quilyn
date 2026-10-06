# PSA data relationship review — 2026-10-06

SA-M09's complete local text and all 19 existing question explanations were compared with the full Data objects v4 and Data relationships v5 topic bodies, not only the module version label. Module v6 declares Pega Platform 25 and 24.2, Constellation.

Sources:
- https://academy.pega.com/topic/data-objects/v4/in/96211/66606
- https://academy.pega.com/topic/data-relationships/v5/in/96211/66606

Changes distinguish Case ownership from physical database layout, locally maintained records from external systems, Field Type from cardinality, and reusable associations from write permissions. The source's credit-card persistence example contradicts the former universal work-object-row assumption. Added reuse/inheritance/sourcing guidance; retained answer keys and reviewed all existing explanations. These are 19 editorially reviewed questions, not 19 newly supplied explanations.

Both local SVG texts and all four scripted scenario answer/feedback paths were read. Incorrect external-only, pyID and guaranteed live-link wording was qualified. Source figures failed to fetch; original hotspots and knowledge checks were not inspected. Browser rendering and execution of the local illustrations/interactions remain open. No live Pega exercise or physical-device/AT test is claimed.

Validation: regression test covers explanation/anchor completeness, retained keys, inventory hash and the corrected storage/source distinctions. Generated content is refreshed with `npm run manifest:content`; `npm run check`: 191/191 tests passed; initial shell remains under 300 KB. Changes are local only; no push.
