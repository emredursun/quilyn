# PSA Blueprint source review — 2026-10-05

Reviewed the complete SA-M06 local guide, three SVG diagrams, four-scenario interactive, eight pitfalls, seven recap entries, 17 questions and 68 option explanations against all linked topic bodies and their available video transcripts:

- https://academy.pega.com/module/accelerating-application-building-pega-blueprint/v3
- https://academy.pega.com/topic/pega-blueprint-overview/v2
- https://academy.pega.com/topic/generating-pega-blueprint/v3
- https://academy.pega.com/topic/importing-pega-blueprint-pega-platform/v3
- https://academy.pega.com/topic/using-pega-blueprint-create-customer-service-insurance-application/v2

Corrected the Access Roles creation/branch-placement confusion in the diagram and simulator. Scoped branch behavior to the documented new-application flow. Removed unsupported anonymous-access, exclusive-LSA permission and delivery-time claims. Repaired malformed rationales and simulator Unicode text. Added missing context, workflow/data/Persona review, technical-file versus PDF, build/inherit/reuse/skip, template and class review, merge and post-import validation, and insurance-example configuration coverage. Preserved question IDs and answer keys; project-role questions now explicitly assign their scenario responsibility. Corrected module/topic times to 65 minutes including quiz and 5/35/15/5 minutes.

Validation: `npm run manifest:content`; `npm run check` passed 142/142; `git diff --check` passed. Regression covers stable keys, source-review hash, import choices and branch-placement correction. Isolated browser checks verified simulator access/branch feedback and question 13 grading; warning/error logs were empty. Shared token 20261005d / quilyn-v119.

This is editorial source comparison, not an executed Blueprint import or production deployment. Physical iOS/Android and VoiceOver/TalkBack tests remain unexecuted. Original review backlog: 139 modules and 636 questions.
