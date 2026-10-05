# XML Modules and data review — 2026-10-05

Reviewed all TAPI-M12/M13 local objectives, sections, pitfalls, recaps, questions, hints and rationales. Added 28 option explanations for seven questions, retaining IDs and B/A/A and B/B/B/A keys. Primary references and exact hashes are in the inventory.

Separated local XML resource editing from XML network payloads; removed universal blank-response and request-error claims. Replaced unverified Technical View absence with documented XML structure and ActionModes. Input modifies existing XML elements, not only configuration fields. Resource manipulation does not guarantee disk safety if Save is configured. Omitted Save Filepath is scoped to a resource connected to a source file. Explicitly choosing a destination does not guarantee that destination is unused. Added uniqueness checks and reloading saved output to verify persistence, instead of only asserting in-memory state. Removed an unsupported course-completion claim.

Read complete primary file/export, XSD scan, XML resource, standard Module, save, add-elements, TestCase and resource-verification article bodies. Academy exercise/video files were inaccessible; source illustrations were not individually inspected. No local visuals/interactions exist in these two modules, and no Tosca execution or physical-device/AT test was performed.

`npm run manifest:content` regenerated derived files. `npm run check`: 172/172 passed; initial shell 297.4 KB. Regression covers XML transport scope, Input, connected-file saving and persisted-output checks. `git diff --check` passed. Token `20261005z`, cache `quilyn-v141`. Local commit only; no push/deployment.
