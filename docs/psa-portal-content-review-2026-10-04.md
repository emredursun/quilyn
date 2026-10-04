# SA-M43 — Portal content editorial review

Compared on 2026-10-04 for Pega Platform '25: objectives, five complete guide sections, analogy, four SVGs and captions, seven pitfalls, 14 questions with 56 option explanations, nine recap entries and five topic references. Inventory records the exact content hash.

## Corrections

- Portal is a web Channel; the old Channel → Portal hierarchy misleadingly included other Channel types.
- Removed a false universal Portal-access grant and an unverified Users-section route. Lifecycle Persona-Channel drafting does not configure access.
- Corrected Amazon Connect to the source's Amazon Alexa example and the application component lock meaning.
- Corrected Home illustration and widget diagrams, scoped source examples, and removed unverified Quick create/Case History listings without declaring these features unsupported.
- Themes do not support inheritance. Replaced automatic theme inheritance claims with sharing and higher-Ruleset specialization; corrected styling-versus-token generation wording.
- Corrected dashboard-copy hint and no-configured-widgets versus empty-data hint. Removed unsupported upgrade guarantees.

## Sources

- [Module v8](https://academy.pega.com/module/configuring-portal-content/v8)
- [Channel interfaces v7](https://academy.pega.com/topic/channel-interfaces/v7)
- [Portals and landing pages v7](https://academy.pega.com/topic/portals-and-landing-pages/v7)
- [Dashboards v6](https://academy.pega.com/topic/dashboards/v6)
- [Landing page widgets v3](https://academy.pega.com/topic/out-box-landing-page-widgets/v3)
- [Themes and styles v4](https://academy.pega.com/topic/themes-and-styles-constellation-applications/v4)

## Verification and limits

`npm run manifest:content` regenerated derived outputs. `npm run check`: **130/130 passed**, shell below 300 KB. Browser diagnostic Q14 A+B graded correctly with corrected rationale; no captured warnings/errors. No executed Pega Portal, dashboard, widget, theme sharing or Ruleset specialization testing; no physical-device/assistive-technology testing.

Asset token `20261004o`; cache `quilyn-v107`. Local commit only. Overall coverage **1154/1862** questions; **708 questions and 151 original queued modules** remain.
