# SA-M05 GenAI source comparison — 2026-10-05

Fully read the four Academy topic bodies, including video transcripts, and compared objectives, all six original guide sections, three SVGs, the four-scenario simulator, eight pitfalls, 16 questions with 64 existing option explanations, and eight recap entries:

- https://academy.pega.com/module/pega-genai-pega-platform/v4
- https://academy.pega.com/topic/generative-ai-pega/v4
- https://academy.pega.com/topic/generating-case-type-using-pega-genai-autopilot/v2
- https://academy.pega.com/topic/generating-case-data-using-pega-genai-autopilot/v2
- https://academy.pega.com/topic/generating-personas-using-pega-genai-autopilot/v2

Module v4 is Pega Platform 25, with 30 minutes including its quiz. Corrected topic durations to 5/10/5/5 minutes. The local guide previously lacked the substantive procedures from three of the dedicated topics. Added sections on Case Type/Life Cycle/Data Model proposal review and creation, sample-record generation and Fill form with AI, and Persona proposal/Case Life Cycle association. Objectives now cover these core source outcomes.

Scoped inactive-default claims to the documented historical 23/24 releases. Removed project-speed and production-readiness guarantees, the unlimited Text-field claim, Knowledge Buddy's false customer-facing exclusion, the claim Autopilot has no role after deployment, and a copied REST/Data Transform response explanation. Clarified Platform login independence versus SaaS access, custom gateway capabilities versus unrestricted model compatibility, and versioned documentation-search guidance. Simulator feedback no longer dismisses Knowledge Buddy's contextual information or suggests a Connect summary automatically implements next-best-action policy. Stable question IDs and keys retained; question 16 targets the new testing-data section.

Validation: `npm run manifest:content`; `npm run check` passed 141/141; `git diff --check` passed. Regression verifies complete topic coverage, stable keys and targets, release-scoped defaults and removal of misleading claims. Isolated browser checks at 127.0.0.1:5500 verified the new testing-data heading, Blueprint simulator answer/feedback, question 16's correct grade and link to `section-sa05-testing-data`. Warning/error logs were empty. Token 20261005c / quilyn-v118.

Limitations: editorial and local application checks only; no executed Pega GenAI calls or production Blueprint import. Physical-device/screen-reader checks remain unexecuted. Remaining original backlog: 140 modules and 636 questions. No production deployment is claimed by this record.
