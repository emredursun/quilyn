# Testim CLI and cross-browser review — 2026-10-06

TESTIM-M17: compared both sections, three objectives, one pitfall, five recaps and five questions. Added twenty option explanations. Added supported Node.js/runtime and documented global install/connect workflow. Distinguished individual test timeout from total execution duration. Corrected blanket intersection semantics: a single filter narrows the requested selection, while multiple intersection filters have documented default OR behavior and a label-specific operand setting. CLI is not the only way to trigger a remote grid run.

TESTIM-M18: compared one section, two objectives, one pitfall, three recaps and three questions. Added twelve option explanations. Fixed the incorrect grid flag: --grid selects grid name; --test-config selects browser/OS/resolution configuration. Scoped matrix execution to supported grid combinations, distinguishing a single editor grid run. Desktop-browser matrices do not establish native/physical mobile coverage.

Exact primary URLs, reviewed hashes and scope are in the inventory. Original Academy recordings/exercises/figures and live Testim/CLI execution were unavailable. No physical-device/AT certification is claimed.

Validation: two semantic regressions added; generated content refreshed. Full `npm run check` passed: 241/241 tests. Local commit only; no push.
