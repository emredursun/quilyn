# SA-M42 — UI elements editorial review

Compared on 2026-10-04 for Pega Platform '25: all three guide sections, analogy, SVG table/caption, seven pitfalls, 14 questions with 56 option explanations, seven recap entries and two topic references. Inventory records the exact content hash.

## Corrections

- Source control examples are not an exhaustive support matrix. Removed false custom-development and invented exam-frequency claims.
- Resolved the internally conflicting list of If not blank/If not zero settings. Source tables place them under Visible.
- Clarified already-selected appointment date on a confirmation View and Account Type disabled in a later confirmation View; neither scenario now requires entering a value into its hidden/always-disabled control.
- Scoped themes and dynamic behavior; removed unverified theme-navigation path and universal no-refresh claim. UI disabling does not replace authorization.
- Conditional settings question now excludes the ambiguous Always/Never alternative; condition linkage accepts expression or When Rule.

## Sources

- [Module v7](https://academy.pega.com/module/configuring-ui-elements/v7)
- [Controls and presentation v7](https://academy.pega.com/topic/controls-and-presentation/v7)
- [Dynamic UI v4](https://academy.pega.com/topic/dynamic-functionality-ui-elements/v4)

## Verification and limits

`npm run manifest:content` regenerated derived outputs. `npm run check`: **129/129 passed**, shell below 300 KB. Browser diagnostic Q4 A graded correctly with its corrected rationale; no captured warnings/errors. Existing SVG was compared and retained. No executed Pega View/theme/When Rule testing or physical-device/assistive-technology testing.

Asset token `20261004n`; cache `quilyn-v106`. Local commit only. Overall coverage **1140/1862** questions; **722 questions and 152 original queued modules** remain.
