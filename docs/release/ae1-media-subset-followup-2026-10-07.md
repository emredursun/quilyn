# AE1 original media and subset follow-up — 2026-10-07

## Evidence inspected

- AE1-M00: authenticated original Welcome, Course Overview and course description, including eighteen objectives, Tosca 16.0, AS1/AS2 prerequisites, optional sections and course-specific Final Exam access rules. Quilyn practice does not unlock Academy certification.
- AE1-M01: complete original English theory captions (12.078–131.936 seconds of the 138-second recording) and all seventeen visible interactive Engine information cards across three pages. Preserved five framework benefits as source claims, distinguished Excel file automation from Excel UI steering, and removed universal identical-action and compatibility claims. The original UIA card conflates Microsoft's underlying framework with Tosca's integration; local wording preserves that distinction.
- AE1-M07: complete original English theory captions (12.166–142.633 seconds of the 143-second recording) and all three SCORM self-assessment items. Added C# customization/task scope, interference with other control types and recompilation after Tosca upgrades or applicable SUT changes. Achievement checkboxes were not selected.
- AE1-M12: original downloaded solution-package ZIP, SHA256 `c33e5f8034a2e4a002e1bee71ab00299e0e5e1cf0ade3a5b10f8ffa4bc186abd`. Statically parsed its two gzip JSON TSUs: 3,067 base entities and 1,598 solution entities. Inspected Grand Scenario object trees, actual reusable-login link, fourteen purchase steps, Module inventory, XBuffer capture and seven ordered solution ExecutionList references.

Source lesson links, reviewed file hashes and explicit limitations are retained in [the inventory](../source-review-inventory-2026-10-02.json). Original training downloads and transcripts remain outside the repository. Signed URLs, training credentials and imported execution-log values are not published.

## Corrected Grand Scenario order

The solution references Login, purchase, PDF verification, Excel output, invoice movement, email delivery, then Logout. Its purchase flow has four navigation, seven checkout and three verification/download steps. Login's shared block has three actions; the login assertion is outside that block. `{XB[orderNumber]}` captures the identifier before subsequent `{B[orderNumber]}` use. These facts now have original subset evidence; the earlier PDF-only review could not certify them.

## Validation

`npm run manifest:content` regenerated manifests, library index and four public reading pages. `npm run check`: **275/275 tests passed**. Three added source regressions cover upgrade/interference, subset execution order, introductory prerequisites/optional rules and framework capability scope. The existing original exercise regression now addresses the mail section explicitly after the new purchase-inventory section. All 185 reviewed content hashes remain current. Shared shell token `20261007b`; service worker `quilyn-v221`.

## Open limitations

Caption review is not full video-visual review. Custom Controls and Grand Scenario solution players exposed no captions and remained at their terminal positions; complete solution narration/visual sequences are not certified. The framework objective checklist and original hands-on extras remain uninspected. Static subset parsing is not an import or runtime execution; stored source execution results are not fresh runtime evidence. No DLL, shop purchase, mailbox delivery or installed Tosca execution was performed.

Physical iOS/Android and VoiceOver/TalkBack access remains unavailable, as confirmed by the user. No physical-device matrix row is marked passed. This packet is a local content/source follow-up, not completion of those external validation requirements. No push or deployment.

## Framework prerequisite follow-up

Read and rendered both original Create Workspace PDF pages, including its objective, rationale and all three instructions. Added the missing course-era single-user workspace/base-subset template preparation and Standard modules > TBox XEngines inspection to AE1-M01. The single framework checklist objective was DOM/visually inspected with Resume; its achievement box was not changed. This closes inspection of these two sources, not execution of workspace creation. Original PDF hash is retained in the inventory. The full theory visuals and optional hands-on extras remain open.

Native access now reaches a running Windows 11 ARM VM with Tosca Commander, but its unrelated PLR workspace showed concurrent edits. Runtime interaction is awaiting an exclusive safe test window; no import, execution or current-workspace change is certified.

## TC Shell optional source follow-up

Read all eleven original TC Shell hands-on guide pages and visually inspected every rendered page. Compared interactive navigation/modification/run and scripted navigation/modification/run/Save, actual NodePath extraction, ordinary quotes, Commander closure and expected file verification. Added a short independent summary rather than distributing the original PDF/screenshots. Numeric task selections, local login and training paths remain version/example-scoped. Updated inventory source/hash; no shell commands from the exercise were executed.

Follow-up validation: content artifacts regenerated; `npm run check`: **277/277 tests passed**; initial shell remains **297.8 KB**. `git diff --check` passed. No shell JavaScript/CSS changes in this follow-up; the shared token and service worker remain `20261007b` / `quilyn-v221`.

## REST report source follow-up

Read and visually inspected every page of the seven-page original REST reporting guide. Added an independent summary of matching product/server versions, REST service/workspace configuration, recorded ExecutionList UniqueId, report task/output parameters and result-file verification. The source's ASKUSER instruction is scoped to that REST example; [the current versioned TC Shell guide](https://docs.tricentis.com/tosca-2026.1/en-us/content/reporting/print_report.htm) prescribes NONE for its own workflow. No API service settings changed and no request/credentials were submitted. The original PDF remains outside the repository; its hash/source lesson are recorded in the inventory.

REST follow-up validation: regenerated content artifacts; **278/278 tests passed** under `npm run check`; initial shell **297.8 KB**. All 185 inventory hashes match current content. `git diff --check` passed. No push or deployment.

## Table steering and file inventory follow-up

Read and visually inspected all eleven original Table Steering guide pages, including all seven exercise stages and parameter/value screenshots. Corrected # semantics to distinguish an unconstrained physical position from an occurrence among constrained matches, in agreement with the current primary table examples. Added header misconfiguration, removed-header behavior and duplicate-product selection as source-scoped examples, without certifying current shop results. All eight existing question keys remain unchanged.

Statically inspected the supplied base subset File Operations folder: eight XModules, with no Zip/Unzip in that folder. Replaced AE1-M08's obsolete unavailable-subset statement; no broad installed-version or runtime certification. Source/PDF hashes are recorded in the inventory. Regenerated content artifacts. `npm run check`: **280/280 tests passed**, initial shell **297.8 KB**. No push or deployment.

## JSON repetitive-node source follow-up

Read and visually inspected all nine original guide pages, including each technical table and API Scan/Module/loop screenshot. Added an independent source-scoped summary of XML/JSON export, item* template, ExplicitName, `.ResultCount == ratingsCount`, `{B[ratingsCount]}`, `#{REPETITION}` and indexed field buffers. Preserved the distinction between source-era API Scan and current XScan guidance. Re-read the two local JSON questions/options/explanations; both B keys remain correct. The source's broad robustness statement is not treated as proof of empty-input or changed-schema execution. Original PDF/hash/lesson provenance retained outside the repository/in the inventory. No runtime execution.

JSON follow-up validation: content artifacts regenerated; **281/281 tests passed** under `npm run check`; initial shell **297.8 KB**. `git diff --check` passed. Shared shell version unchanged; no push/deployment.
