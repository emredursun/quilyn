# Testim execution review — 2026-10-06

Compared all five guide sections, three objectives, five pitfalls, eight recaps and eight questions with primary technical bodies. Added 32 option explanations and stable lesson links.

Removed the unsupported guaranteed next-test failure caused by an unclosed browser; the scenario now requires actual lifecycle evidence. Scheduler can coexist with CI and supports test plans with plan-owned configuration restrictions. Incognito isolates browser state, not backend/account records.

Configuration files supply options/hooks and managed-secret references; they do not automatically encrypt literal credentials. The documented secret-reference params-file workflow converts static JSON to JavaScript/module.exports. Password-type fields govern screenshot masking; moving values into a config file does not make all artifacts safe.

Corrected CLI milliseconds versus Scheduler seconds, test timeout versus temporary 90-minute execution-list status, and path-specific timeout-retry descriptions (CLI up to three; Scheduler one extra run). Kept general failed-test retries distinct. Corrected execution-count graph versus duration graph and concurrent-test versus concurrent-execution metadata. Local editor playback is exempt under the documented quota model; applicable local library/CLI and remote runs count.

Exact primary URLs, reviewed hash and limitations are in the inventory. Original Academy recording/exercise/figures and live Testim execution were unavailable. No physical-device/AT certification is claimed.

Validation: semantic regression added; generated content refreshed. Full `npm run check` passed: 228/228 tests. Local commit only; no push.
