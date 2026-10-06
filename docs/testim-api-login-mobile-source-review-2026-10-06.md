# Testim API, login and mobile review — 2026-10-06

Compared all local technical bodies in M29–M31: five guide sections, seven objectives, six pitfalls, thirteen recaps and ten questions. Added forty option explanations.

REST Bearer authentication remains required when additionally supplying an authorized user's encrypted-credential access key. A copied API key already includes its prefix. Shared login parameters must be bound into entry steps; parameterization is not encryption. Removing Tab/focus actions requires replay because they may trigger app behavior. Conditional login and incognito are scoped tools, not proof of authenticated identity or clean server-side state.

Mobile content now includes OS-scoped projects, single-app recording, mode-specific compatibility and the need to re-record when changing mode. VMG uses simulators/emulators and needs compatible builds; these runs are not physical-device accessibility evidence. Vendor performance claims are not universal guarantees. The Enhanced-mode migration FAQ has a contradictory final mode name; the getting-started guide clearly requires re-recording for Appium execution.

Primary URLs, reviewed hashes and per-module scope are in the inventory. Original Academy recordings/exercises/figures and live Testim execution were unavailable; revised independent guides were compared with accessible primary documentation. Physical-device/AT testing is not claimed.

Validation: semantic regressions and generated-content refresh. `npm run check`: 254/254 tests passed; shell budget passed. Local commit only; no push.
