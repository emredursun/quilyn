# Testim platform integrations review — 2026-10-06

TESTIM-M21: compared both sections, three objectives, one pitfall, three recaps and three questions. Added twelve option explanations. GitHub repository actions are separate from Actions execution: Testim branches base on Master, and merge synchronization uses pull-request actions targeting Master. Added configured runner/JUnit requirements; vendor Node/action examples are not current-version recommendations.

TESTIM-M22: compared three sections, three objectives, two pitfalls, five recaps and three questions. Added eight option explanations. Corrected TTM API key versus Xray Jira/client credentials. TTM allows multiple mapped cases; bulk mapping skips existing mappings, and disconnecting the single supported TMS connection removes mappings. Added the mandatory-custom-field limitation. Remote Grid reporting eligibility is distinct from quota-counted local runs. Azure JUnit publication does not itself map work items; this is scoped to the cited workflow, not a blanket claim that every custom integration is impossible.

Exact primary URLs, hashes and scope are in the inventory. Original Academy recordings/exercises/figures and live integrations were unavailable. No physical-device/AT certification is claimed.

Validation: two semantic regressions added; generated content refreshed. Full `npm run check` passed: 245/245 tests. Local commit only; no push.
