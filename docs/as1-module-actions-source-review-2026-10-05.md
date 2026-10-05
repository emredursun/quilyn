# AS1 Module maintenance review — 2026-10-05

Compared TAS1-M04's complete local lesson and six questions with five primary Tosca On-Premises 2026.1 bodies listed in the inventory entry.

Corrected the principal misconception: ValueRange suggests choices and permits user-specific input; it is not application validation. Preserved exact-string/semicolon guidance. Rescan now includes same-business-type mapping and deliberate property selection. Merge guidance distinguishes full versus checkout-blocked partial outcomes and removes the instruction to blindly delete a Self-Healing parameter warning.

Added 24 option explanations and lesson anchors. Retained A/B/D/C/A/B after correcting the scenarios. Updated and visually inspected the independent comparison SVG in desktop light theme; dark/mobile rendering not tested. Academy Exercise 18, video and source figures were not inspected or executed. No physical-device or AT execution occurred.

Regenerated artifacts; `npm run check`: 177/177 tests passed. Initial shell remains 297.4 KB; `git diff --check` passed. Local commit only; no production deployment claimed.
