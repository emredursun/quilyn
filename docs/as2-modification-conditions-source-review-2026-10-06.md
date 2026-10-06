# AS2 modification and conditions review — 2026-10-06

Compared all local TAS2-M04/M05 guide text, objectives, pitfalls, recaps and 14 questions with complete Tosca 2026.1 procedures for generation, XL paths, conditional instantiation and expected-output Attributes. Added 56 individual option explanations and section anchors, retaining answer keys.

Removed mandatory deletion of old TemplateInstances, assumed additive preservation of manual work, one-link-only Value restrictions and blanket source redirection claims. Explained Result Attribute data versus Verify ActionMode. Replaced unverified current SUT behavior with hypothetical requirements.

Distinguished generation-time selection from runtime IF/WHILE. Expanded supported condition targets, removed an assumed default OR, explained explicit logical operators and limited the exclusion example to its stated non-null domain. Replaced an unverified property-error anecdote with this phase distinction. Model validation and generation no longer certify successful execution without trial runs.

No local diagrams or scripted exercises in these modules. Original Academy materials and example UI behavior remain inaccessible and unverified. No actual Tosca exercise or physical-device/AT tests executed.

Regenerated artifacts; npm run check passed 185/185 tests, initial shell below 300 KB. git diff --check passed. Local commit only; no push.
