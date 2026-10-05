# PBA Blueprint source review — 2026-10-05

Compared all four BA-M07 guide sections, analogies and bullet lists, eight pitfalls, seven recap entries, 13 questions and 52 option explanations against the complete Pega Academy module and four topic bodies (including available transcripts):

- https://academy.pega.com/module/accelerating-application-building-pega-blueprint/v3
- https://academy.pega.com/topic/pega-blueprint-overview/v2
- https://academy.pega.com/topic/generating-pega-blueprint/v3
- https://academy.pega.com/topic/importing-pega-blueprint-pega-platform/v3
- https://academy.pega.com/topic/using-pega-blueprint-create-customer-service-insurance-application/v2

Corrected SaaS access versus Platform Operator login, Access Roles branch placement versus creation, an unsupported LSA-only import restriction and fixed-time delivery claims. Added source procedures for context, workflow, data and Persona review; PDF versus technical import file; wizard template, inheritance and reuse options; post-import configuration; and the insurance example. Kept all 13 question IDs and answer keys. Updated review date and source hash in the inventory.

Validation: `npm run manifest:content`; `npm run check` passed 143/143; `git diff --check` passed. Regression confirms 13 stable answer keys and lesson targets, source hash, wizard choices, and the corrected Access Role meaning. Isolated browser checks verified the new lesson copy and question 12 grading; warning/error logs were empty. Token 20261005e / quilyn-v120. This editorial check did not execute a Blueprint import or test physical devices and screen readers. Original backlog: 138 modules and 636 questions.
