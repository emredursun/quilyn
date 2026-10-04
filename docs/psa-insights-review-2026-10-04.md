# SA-M47 — Insights editorial review

Compared on 2026-10-04 for Pega Platform '25: objectives, three full sections, analogy, three SVGs/captions, seven pitfalls, 14 questions with 56 option explanations, eight recaps and three topic references. Two SVGs corrected; matching placement diagram retained. Inventory records exact hash.

## Corrections

- Replaced unsupported default permission diagnosis for missing columns with backing-property optimization in parent/specific classes, relevant-record configuration and stale browser state. Q10 and Q14 test these explicit source checks.
- Removed an unrelated token-expiry rationale from the missing-column question.
- Added full Page Case View tab restriction: cannot place Insights directly in an arbitrary View. Distinguished Dashboards landing page from Portal authoring.
- Clarified promoted filters apply to Insights, not every non-Insight Widget. Sharing targets Access Groups, not generic role lists.
- Scoped Simple Value requirement to ungrouped summary and removed unverified Insight-editor column-formatting route and Rule-version algorithm claims.

## Sources

- [Module v6](https://academy.pega.com/module/exploring-application-data-insights/v6)
- [Explore Data v5](https://academy.pega.com/topic/explore-data-landing-page/v5)
- [Applying Insights v1](https://academy.pega.com/topic/applying-insights-across-pega-platform-components/v1)
- [Troubleshooting v1](https://academy.pega.com/topic/troubleshooting-insights-issues/v1)

## Verification and limits

`npm run manifest:content` regenerated derived outputs. `npm run check`: **134/134 passed**, shell below 300 KB. Browser diagnostic Q10 A graded correctly with corrected rationale; no captured warnings/errors. No executed Pega Insight, optimization/relevant-record, OAuth, filter or UI tests; no physical-device/assistive-technology tests.

Asset token `20261004s`; cache `quilyn-v111`. Local commit only. Coverage **1212/1862**; **650 questions and 147 original queued modules** remain.
