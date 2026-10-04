# PSA localization content review — 2026-10-04

SA-M48 was compared against both complete Academy topics, including the guide, analogy, two SVGs, seven pitfalls, all fourteen questions/options/keys/hints/rationales, and nine recap entries. Added 56 option explanations with real lesson section targets.

## Sources

- [Localizing application content v7](https://academy.pega.com/module/localizing-application-content/v7): published for 24.2, also applicable to 25. Replaces the archived 8.8 module.
- [Localization v7](https://academy.pega.com/topic/localization/v7).
- [Design considerations for localization v5](https://academy.pega.com/topic/design-considerations-localization/v5).

## Corrections

The design diagram incorrectly prohibited all Data Page controls. It now distinguishes the documented restriction on radio/drop-down controls inside tables from manual preparation of Data Page-backed values. The Additional text workflow includes rebuilding and importing the package.

The Paragraph source HTML is packaged for manual translation; it is not excluded from the ZIP. Removed contradictory guide/pitfall wording and corrected the diagram. Text-package formats and the Paragraph ZIP workflow are distinguished.

Corrected question 5's unrelated language-pack rationale. Scoped locale precedence to available translations, removed a blanket silent-error guarantee, and replaced broad Paragraph/picklist design claims with explicit preparation decisions. Added the Dev Studio localization limitation and dynamic-phrase context.

## Verification and limits

`npm run manifest:content` regenerated the manifest, quality report, library index and static lesson. `npm run check`: **135/135 passed**. Regression covers package inclusion, Data Page preparation, table-control restriction, session-refresh feedback, keys and source inventory hash. `git diff --check` passed.

In an isolated diagnostic browser origin, SA-M48 Q10 option A graded correctly and displayed the updated rationale and lesson link. Captured warning/error logs were empty. No executed Pega translation import, actual translated Portal, physical device or screen-reader validation is claimed.

Progress: 1,226 of 1,862 questions have explanations/lesson targets; 636 questions and 146 originally queued modules remain. Cache query `20261004t`; service worker `quilyn-v112`. This package is local only.
