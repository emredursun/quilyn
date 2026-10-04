# SA-M46 — Debugging editorial review

Compared on 2026-10-04 for Pega Platform '25: objectives, three complete sections, analogy, three SVGs/captions, seven pitfalls, 15 questions with 60 option explanations, seven recaps and three topic references. Two SVGs corrected; matching event-color chart retained with qualified caption. Inventory records exact hash.

## Corrections

- Original module v5 is archived and applies to 8.8. Updated to v8 with Tracer v7, settings v6 and developer-tools v2; added missing third topic and corrected estimated time.
- DebugPegaAPI is a dynamic system setting, not a URL parameter. Xray overlays metadata/state; UI Inspector examines hierarchy/properties.
- PCore/PConnect methods require the appropriate Portal context and are unavailable in the App Studio shell.
- Added Constellation request-ID grouping. Qualified breakpoint scenarios to respect Service/Constellation restrictions and documented timeout behavior.
- Removed invented automatic session replacement, universal session sharing prohibition, absolute production ban and all-event capture claim.
- Corrected unrelated Q12 rationale, ambiguous timing distractor and unverified inspect/clipboard toolbar icon.

## Sources

- [Module v8](https://academy.pega.com/module/debugging-application-errors/v8)
- [Tracer v7](https://academy.pega.com/topic/tracer/v7)
- [Settings v6](https://academy.pega.com/topic/tracer-settings-management/v6)
- [Developer tools v2](https://academy.pega.com/topic/developer-tools-examining-applications/v2)

## Verification and limits

`npm run manifest:content` regenerated derived outputs. `npm run check`: **133/133 passed**, shell below 300 KB. Browser diagnostic Q12 A graded correctly with its relevant rationale; no captured warnings/errors. No executed Pega Tracer, breakpoint, PCore/PConnect, browser extension or API-setting tests; no physical-device/assistive-technology tests. Historical source inventory metadata retained; local comparison records current sources.

Asset token `20261004r`; cache `quilyn-v110`. Local commit only. Coverage **1198/1862**; **664 questions and 148 original queued modules** remain.
