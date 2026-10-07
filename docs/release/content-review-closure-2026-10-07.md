# Local content review closure — 2026-10-07

## Scope and evidence

The original 185-module inventory now records **185 source-compared, zero pending and zero partial** local comparisons. All 185 reviewed hashes match the authored files. Its 1,659 practice questions have an explanation for every option. The full registry's previously recorded 1,862-question explanation coverage is a broader coverage metric, not certification of every Academy recording or official examination answer.

Each inventory entry retains its own source and limitation statement. Source-compared means the documented independent local technical/editorial comparison; it does not mean every source video, imported subset, hidden quiz or installed product has been executed. This closes the original local comparison queue rather than granting full production validation.

## Final two modules

### AE1-M07 — Custom Controls

Read and rendered all three pages of original Exercise 6. Compared its objective, fifteen instructions, expected outcome and two hints with all local sections and all four quiz questions/options. Corrected Cloud versus on-prem deployment, the Tosca 16.0 TBox path, close/copy/reopen/rescan sequence, the two supplied DLL filenames, combo-box Planned/Input operation and DIV-table validation. The path is scoped to the training installation. Vision AI remains an evaluated alternative, not a mandatory universal escalation order. No DLL was executed.

### AE1-M12 — Grand Scenario

Read and rendered all seven pages, including every table and hint. The user-supplied PDF and the browser source have identical SHA256 `544f1f1102068394ffa3d5fe426135d76153d045e9abf7c80155171fe4b8281b`. Restored the four missing extensions: invoice text verification, Excel output, invoice move/rename and mail with both generated attachments. Corrected buffer naming, exercise expectations, workbook/worksheet/range separation, header/data-row selection, save/close and final attachment paths. Removed the then-unverified fourteen-step checkout prescription. Subsequent original subset inspection confirms those fourteen steps; see [the media and subset follow-up](ae1-media-subset-followup-2026-10-07.md). Independent login reuse and failure cleanup are labeled as design guidance.

The original PDF's Direct EWS example is historical, and its IMAP-sending hint is incorrect. Compared these against Microsoft's current primary documentation: [Exchange Online authentication](https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/deprecation-of-basic-authentication-exchange-online) and [Outlook.com protocol settings](https://support.microsoft.com/en-us/outlook/pop-imap-and-smtp-settings-for-outlook-com). The lesson distinguishes provider authentication/availability from the Tosca 16.0 example and SMTP sending from IMAP access. No message was sent, credentials requested, or account settings changed.

Original course PDFs are retained outside the repository. Stable Academy lesson links and PDF hashes document provenance; temporary signed download links are not committed.

## General review

- Re-read both revised local bodies and all nine question keys, distractors, hints, rationales and option explanations against the original exercise instructions and applicable manual supplements.
- Confirmed all 185 inventory hashes and all 1,659 inventory-question explanation key sets, including the new global hash regression.
- Regenerated content manifests, quality/library indexes and public reading pages with `npm run manifest:content`.
- Browser-rendered both revised lessons from the clean loopback origin. Grand Scenario displayed all seven guide sections, the shortened version metadata and the 2026-10-07 review date. At 390 × 844, both light and dark checks produced no horizontal document overflow (379 px scroll width inside a 390 px viewport). Desktop content checks also found no overflow. Temporary viewport override was reset.
- These browser checks are desktop responsive checks, not physical mobile or screen-reader tests. No code-native illustration or simulator was added by this packet.

## Validation and release state

`npm run check`: **272/272 tests passed**, including both original-exercise regressions and the 185-module hash check. Verified 41 interactive exercises and 222 static reading pages/sitemap. Initial shell **297.8 KB** uncompressed, below 300 KB. `git diff --check` passed. Shared shell token `20261007a`; service worker `quilyn-v220`. Changes are local only; no push or deployment.

## Remaining external validation

Actual iOS/Android and VoiceOver/TalkBack execution remains unavailable: the user confirmed no connected device or device-testing service. See `physical-device-at-validation-2026-10-02.md`; no rows were falsely marked passed.

Uninspected original source recordings, SCORM checks, imported subset details and installed Tosca/TMA execution remain limitations as listed per module. The two original exercise PDFs verify their prescribed instructions, not DLL runtime behavior, mailbox delivery or full solution narration. Subsequent [subset inspection](ae1-media-subset-followup-2026-10-07.md) verified the purchase subset's internal checkout/login structure statically; execution remains open. Pega Views knowledge-check controls did not render in the accessible source. These requirements cannot be inferred from successful local automated tests.
