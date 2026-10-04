# PSA Case Life Cycle source review — completed 2026-10-05

SA-M02 comparison started 2026-10-04 and covered the complete five guide sections, analogies, three SVGs, five interactive examples, eight pitfalls, 21 questions/options/keys/hints/rationales and existing 84 explanations, and nine recap entries.

## Sources and version boundary

[Defining a Case Lifecycle v8](https://academy.pega.com/module/defining-case-lifecycle/v8) is the canonical renamed module, for 24.2 and applicable to 25. Its four topics were read completely: [Case Lifecycle v7](https://academy.pega.com/topic/case-lifecycle/v7), [design v6](https://academy.pega.com/topic/case-lifecycle-design/v6), [forms v5](https://academy.pega.com/topic/multi-step-forms/v5), [draft mode v5](https://academy.pega.com/topic/draft-mode/v5). The newer module v9 is for 26 and was not substituted silently. Duration corrected to 45 minutes with the source's topic durations.

Supplementary full sources: [designing a life cycle](https://academy.pega.com/topic/designing-case-life-cycle/v1/in/61601) for the original hotspot details, [data objects v2](https://academy.pega.com/topic/understanding-data-objects/v2) for designer-created placeholders, and [status v5](https://academy.pega.com/topic/case-status/v5) for progress communication.

## Corrections

Removed the universal Microjourney/Case Type one-to-one claim and exact artifact equivalence. Corrected the hierarchy SVG's Process gerund naming. Distinguished resolution guidance from mandatory save-time validation, including Primary/Alternate resolution paths and older Case Types without Create Stage.

Separated Process draft mode from creating a draft data object in the designer; enabling the former alone does not create the latter. Added the manual Dev Studio/automatic App Studio draft-mode boundary. Distinguished ordinary Process back-navigation settings from Multi-step Form layouts.

The simulator's rejection-loop example incorrectly prohibited returns between Primary Stages. It now tests the documented explicit Change Stage configuration for an Alternate correction path. Removed unsupported cross-studio placeholder assertions, invented Case Type identifier validation, and an unrelated CDH outbound-only mnemonic. Question 16 now tests source-backed status communication instead of broad routing/report claims. IDs, keys and lesson targets remain stable.

## Verification and limitations

`npm run manifest:content` regenerated derived content and the simulator asset; `npm run check`: **138/138 passed**, `git diff --check` passed. Regression protects draft distinction, transition exercise, Process naming and source hash; foundation key checks remain intact.

Isolated browser: Q11 option A graded correctly with the revised rationale. The rebuilt simulator loaded after a full reload; problem 2's Change Stage choice produced the correct feedback. Warning/error logs were empty. During the first SPA visit, the already-open tab held the preceding interactive manifest and showed an unavailable exercise after asset regeneration; a fresh document load resolved it. No physical-device, Pega runtime or actual translated content validation is claimed.

Question coverage unchanged at 1,226/1,862; 143 original source-review modules remain. Cache query `20261004w`, SW `quilyn-v115`. Local only.
