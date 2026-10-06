# Content and visual review — 2026-10-06

## Verified state

The original source-review inventory has 185 modules: 183 source-compared, zero pending, two partial. All 185 recorded content hashes match current files. This describes the independent local technical comparison documented in each inventory entry; it does not certify every original Academy recording, screenshot, challenge or official quiz key.

Across the complete registry, all 1,862 lesson-practice questions have an explanation for each option (1,659 questions belong to the original 185-module inventory). Explanation presence is a coverage measurement, not evidence by itself of editorial correctness. Editorial scope and limitations remain recorded per module. The original queue figures in older dated packet notes are historical snapshots.

BA-M19 completed the remaining pending comparison: all four topic bodies plus relevant Scrum Guide sections. Corrected dual-studio Workbench access, configured integration, Pulse visibility, Assistant tabs, collaborative story authorship, readiness and Sprint selection.

A second review of the three partial local bodies removed residual unqualified wording in AE1-M07 and TMOB-M00. Neither Cloud DLL distribution nor a public mobile support matrix is evidence of the original on-prem Academy exercises. AE1-M12 remains an explicitly independent worked example; no original subset or exact checkout sequence was supplied.

## Bugs found and fixed in the general pass

- SVG color references missing from the theme caused black text on dark surfaces. All diagram references now resolve to defined colors, through scoped aliases on the figure. No global product-theme token contract changed.
- Narrow diagrams previously shrank to about 307 px, making labels tiny. Their SVG keeps a 760 px width inside a horizontally scrollable, keyboard-focusable figure below 600 px. Captions still wrap to the narrow viewport.
- SA-M08's schema illustration still asserted a universal process change; it now asks for impact review. Its terminology figure has an image role/label.
- SA-M08 and SA-M09 scenario headers showed the previous score after answering, including a contradictory final header. The header now updates immediately after scoring. Generated interactive assets were regenerated.

## Browser evidence and limits

SA-M08: executed all four correct branches to 4/4 and Restart to 0/4; earlier wrong-answer and dark propagation checks remain in its packet note. Measured its three diagrams at a 390 px viewport. The stale-score bug was observed during this pass and covered by regression after correction.

SA-M09: all four correct branches reached 4/4, with options disabled after answering and immediate score updates. Confirmed corrected SVG computed text colors in dark and light themes. At 390 px, the two figures have client width 347 px, scroll width 780 px and SVG width 760 px; horizontal scrolling moved the second figure to scrollLeft 379 and exposed the sourced-data panel. Browser warnings/errors were empty for the clean-origin check. This is desktop viewport testing, not an actual mobile device test.

TAS2-M07: inspected the independent workflow illustration in light and dark themes, including its trial-run/assertion wording. This closes its outstanding local browser illustration check; it does not verify an original Academy figure or execute Tosca.

SA-M07's figures, four local simulator scenarios and accessible source animations/hotspots were already inspected in the follow-up recorded in `docs/psa-capturing-data-source-review-2026-10-05.md`. Views knowledge-check controls failed to render; uninspected video/hidden interaction content remains unverified.

The first browser origin had an existing service-worker controller and supplied cached assets even with diagnostics enabled. Final color/layout verification used a separate loopback origin (`127.0.0.1:5500/?diagnostics=1`) to load current assets without changing existing user caches or progress. The app update mechanism still requires accepting the update for an existing worker; query tokens alone are not an override for its normalized cache keys.

## Validation and release state

`npm run manifest:content` regenerated interactive scripts, indexes, reading pages and manifests. `npm run check`: **268/268 tests passed**, 80 JavaScript files syntax checked, 41 exercises verified, 222 reading pages/sitemap verified. Initial shell **297.9 KB** uncompressed, below 300 KB. `git diff --check` passed. Shared token `20261006bp`; service worker `quilyn-v218`.

Review of the current diff found no remaining blocker for the committed local corrections. This is not full release certification: original inaccessible source material and unavailable physical-device/AT execution are explicit open requirements. Changes are recorded locally; no push or deployment performed.

## Open requirements requiring access

1. AE1-M07: original on-prem custom-control package/installation instructions. Public Cloud guidance cannot verify these.
2. AE1-M12: original Grand Scenario subset, prescribed sequence and exercise evidence.
3. TMOB-M00: outline, prerequisites, version and rendered summary now compared; complete topic recordings/narration remain uninspected.
4. Original source media/hidden interactions not inspected, as listed in module-level limitations, including SA-M07 Views checks.
5. Actual iOS/Android, VoiceOver/TalkBack and installed-product execution. The user confirmed there is no device/service access; the physical-device matrix remains unexecuted.

The two original Tricentis Academy course URLs were retried on this date and remained inaccessible to the web tool. No alternate Cloud/manual source was relabeled as proof of an unavailable Academy exercise.

## Continued access and browser audit

Direct browser navigation to the original AE1 course redirected to the Tricentis Support Hub SSO login. It explicitly requires Support Hub credentials; there was no authenticated Academy session. Requested user sign-in or the original lesson files, without requesting a password in chat. AE1-M07, AE1-M12 and TMOB-M00 remain partial until their original materials can be inspected.

Rechecked the Pega Views v6 source in a separate browser tab: both knowledge-check introductions exist but no associated interaction controls or iframe exist in the rendered DOM; warning/error logs were empty. This records the published-page limitation precisely without certifying unavailable content.

SA-M08's remaining two wrong-answer paths, mixed 2/4 final result, immediate score updates and Restart were executed in the browser. All three diagrams were measured at 390 × 844 with 347 px client width / 780 px scroll width / 760 px SVG width. This closes the remaining local scenario-path smoke checks; physical-device/AT validation remains unexecuted.

## Authenticated Academy follow-up

The user signed into Academy. Its original AE1 welcome/description verifies Tosca 16.0 as the course development version and AS1/AS2 plus licensed Tosca access as prerequisites. Lesson 06 objectives explicitly cover custom-control installation, customization examples and important facts. The exercise page lists a 406.01 KB installation PDF and two DLL lesson attachments (`FancyComboBox.dll`, `HtmlTable.dll`). Grand Scenario lists a 445.41 KB exercise PDF and solution video. Neither PDF could be read: the pages display “Downloaded” but the browser download event times out and no accessible downloaded file was produced. Inspection of the browser download page was rejected by the browser URL security policy. Requested the two original PDF files from the user; no credentials or signed resource URLs are stored here. The two AE1 modules remain partial; DLLs were not executed.

TMOB-M00 is now source-compared for its local introduction. Read the authenticated course description and prerequisites, the full SCORM syllabus, Learning Objectives and completely rendered Summary. Course 1311 is 45 minutes, developed with Tosca 2024.2, with five topics: getting started, installation, connection options, scanning options and execution options. Verified software/mobile testing knowledge, AS1, licensed Tosca Mobile access, TMA access and Android Studio setup. Corrected the local introduction to distinguish this syllabus from independent platform/advanced study extensions and newer manual versions. The three quiz keys remain B/B/B with all option explanations reviewed. This does not certify full topic narration, nested recordings or installed-product execution. The reading player used Resume rather than Restart; no assessment was submitted.

Updated source hashes and generated content. Shared token `20261006bq`; service worker `quilyn-v219`. Physical-device/AT validation remains unavailable. Changes are local only.

Follow-up validation: `npm run manifest:content` and `npm run check` passed (**269/269** tests); the new regression protects five original topics, independent extensions, licensing prerequisites, version separation and the recorded content hash. The AE1 theory video exposes an English subtitle track, but neither its download nor seek controls produced usable review material through the browser; its narration remains unverified.
