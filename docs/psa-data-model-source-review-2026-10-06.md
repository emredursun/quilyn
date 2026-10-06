# PSA Data Model review — 2026-10-06

SA-M08: complete local guide, objectives, eight pitfalls, six recaps, all 18 questions/options/keys/rationales and existing explanations reviewed against the full source topic bodies. The module declares Pega 24.2, applicable to 25, Constellation.

Primary sources:
- https://academy.pega.com/topic/data-modeling/v4/in/96211/66521
- https://academy.pega.com/topic/data-records/v6/in/96211/66521
- https://academy.pega.com/topic/data-pages-and-visual-data-model/v4/in/96211/66521
- https://academy.pega.com/topic/integration-designer/v7/in/96211/66521
- https://academy.pega.com/topic/data-pages/v6
- https://academy.pega.com/topic/data-pages/v3

Added conceptual/logical/physical model distinctions and simulation readiness. Separated configured generated defaults from general Page/List structures, edit modes and scope. Removed unsupported universal Case Type page counts, Operator-context assertion and diagram-specific cardinality claims. Replaced the unsupported default-count question with a simulation readiness question, retaining its A key. Removed unsupported prebuilt Vehicle example, mandatory Dev Studio statements and truncated rationales.

Read all three local SVGs and four independent scripted scenarios, including feedback. Qualified Node sharing/refresh and automatic consumer-impact wording; repaired undefined SVG ink tokens. Original source hotspots/knowledge checks were not inspected; Desktop browser smoke test passed for correct/wrong choices, Next, 3/4 final score, Restart and dark theme propagation. The generated-page diagram was inspected in light theme; complete responsive review of all diagrams remains open. No live Pega exercise or physical-device/AT test is claimed. These are 18 editorially reviewed existing explanations, not new missing-explanation completions.

Validation: generated artifacts regenerated; regression covers keys, explanation/anchor completeness, inventory hash and corrected taxonomy. `npm run check`: 192/192 tests passed after final changes; initial shell stays under 300 KB. Local commit only; no push.

## Additional browser follow-up

On 2026-10-06, replayed the remaining wrong-answer branches in scenarios 1 and 2, followed by correct answers in scenarios 3 and 4: the final header and result both showed 2/4 (50%). All answered options disabled, Next retained the score, and Restart returned to scenario 1 / 0/4. This also verifies the immediate-score fix in the actual browser after regeneration.

At 390 × 844, all three figures had 347 px client width, 780 px scroll width and 760 px SVG width. Their theme aliases resolved to actual computed colors. These are browser viewport measurements; they do not replace physical-device, screen-reader or complete per-label contrast validation.
