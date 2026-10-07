# General validation and review — 2026-10-07

## Scope and conclusion

Completed this follow-up code review and the available local validation listed below. Reviewed progress identity/persistence, quiz and mock grading, Smart Review loading/scheduling, history/notebook identity, study recommendations, reading-position lifecycle, mobile navigation, shell transitions, cache versioning and the existing content evidence. The review found and fixed six issues. This record is **not** a claim that every original Academy recording, installed vendor workflow or physical-device/assistive-technology requirement is complete.

## Findings fixed

1. **PSA review identity mismatch.** JSON IDs `m01`…`m48` are legacy SRS identities; registry lesson routes use `SA-M01`…`SA-M48`. Review bank keys stay unchanged while lesson/domain metadata uses the registry ID. Study recommendations count legacy due cards. Old history links resolve to canonical routes. Matching-version legacy notebook mistakes can be corrected by canonical quizzes without rewriting historical attempts or losing failure counts. Revised question signatures cannot resolve old mistakes.
2. **Incomplete multi-select review grading.** Removing a required selection or adding an extra selection previously left confidence controls visible. The controls now hide whenever the required count is not met, and the handler refuses stale/incomplete/overfull submissions. Valid grading still occurs once.
3. **Incorrect domain summaries for non-Pega tracks.** Review previously showed inherited Pega domains with zero denominators. Domain rows now come from the loaded card bank and use the same General fallback as question feedback. A real-data regression verifies that all eleven tracks' domain totals equal their complete review-bank counts, with no empty inherited rows.
4. **Stale lesson breadcrumb context.** Mock/review transitions now disconnect the lesson intersection observer and clear the old module context/title. Regression checks both transitions and browser titles.
5. **Script URL used as a session action.** The sidebar Start Session control is a native button, eliminating its `javascript:` URL and supporting normal button activation. Its style fits the existing sidebar. The real-bank regression asserts the semantic button and absence of script URLs.
6. **Mock native selection lost after grading.** Individual Check, saved-session restoration and post-submit review removed the selection class used by native input synchronization. All three paths now preserve the actual picked set, including multi-select/wrong/unanswered cases. The regression invokes those paths and the real runtime synchronization function. Light-theme selection styles exclude graded rows so correct/incorrect feedback colors remain visible.

## Browser evidence

Used isolated loopback origins; user progress on localhost:8781 and production was not changed. Initial checks ran on 127.0.0.1:8803; subsequent visual/current-code checks ran on 127.0.0.1:8804 with `?diagnostics=1`, preventing service-worker registration there. The shared asset token was updated before final reloads to avoid earlier lazy-script HTTP cache entries.

- PSA: loaded 730 review cards; selected and graded a real review item, then saw one scheduled card and one active mistake in Study plan. Opened the notebook explanation and followed its canonical `#PSA/SA-M20/guide/...` link successfully. Bookmarked the lesson and saw it in the saved collection.
- Mobile at 390 × 844: light/dark collection layouts, menu opening, Escape dismissal, Close menu dismissal and track selection closing the drawer. No horizontal document overflow: document scroll width 379 px inside 390 px viewport.
- Tosca: switched tracks and loaded Smart Review without F5. After the domain fix, TAS2 showed General 0/76 rather than eight unrelated Pega 0/0 rows. Sidebar Start Session launched a real session. No captured console warnings/errors on that isolated test tab.
- Mobile mock: opened a five-question TAS2 mini practice, selected and checked an answer, verified 1/5 answered, expanded More actions, reloaded and resumed. The picked radio remained checked and disabled after restoration. The timer remained compact above the question controls.
- SA-M08: all three local diagrams inspected in desktop light/dark and mobile light/dark; focusable horizontal containers and ArrowRight panning checked. No document overflow.
- SA-M09: both local diagrams inspected on desktop dark and mobile light/dark. Ran all four local scenarios, including a wrong answer through Enter, correct answers, next transitions, 3/4 (75%) result and Restart. These are independent local exercises, not Academy assessment or Pega execution.
- TAS2-M07: inspected the independent workflow illustration in desktop/mobile and both themes, including keyboard panning. No document overflow. Its source/runtime limitations remain explicit.

Screenshots: [mobile saved collection](../screenshots/general-review-mobile-dark-2026-10-07.jpg), [mobile mock restored selection](../screenshots/general-review-mobile-mock-2026-10-07.jpg). Temporary viewport override reset at the end.

## Automated validation

- `npm run check`: **302/302 passed**, zero failed/cancelled/skipped.
- Initial shell: **298.6 KB** uncompressed, below the 300 KB budget. Shared token `20261007h`; service-worker shell `quilyn-v224`.
- 80 JavaScript files syntax checked, 41 interactive exercises checked, 222 generated reading pages/canonical sitemap checked.
- Content format/provenance gate: eleven tracks, 210 modules, 1,862 practice questions, 982 mock questions; all 210 module source/review-date/version metadata entries present.
- Existing global regression confirms all 185 source-inventory content hashes still match authored files. No authored content JSON or generated artifacts changed in this packet; generated-artifact consistency was checked by the full gate.
- `git diff --check` passed. No dependencies added; no storage-key migration.
- Local commit only. No push or production deployment.

## Remaining validation: deliberately not marked passed

| Requirement | Current evidence / blocker |
|---|---|
| Physical iOS/Android, installation, VoiceOver/TalkBack | Not run. User confirmed no connected devices or testing service. Desktop responsive/keyboard checks do not substitute for these. [Device matrix](physical-device-at-validation-2026-10-02.md). |
| Installed Tosca/TMA/Pega execution | Not run. An isolated safe Tosca workspace is not available for this work; do not import/run into the unrelated existing workspace. Static subsets, source recordings and local simulators are not fresh runtime results. |
| Original source media/interactions | Open at the exact per-module scopes in the [source inventory](../source-review-inventory-2026-10-02.json). These include uninspected video sequences, unavailable original figures/knowledge checks and specific course interactions. Previous caption/PDF/sample-frame comparisons do not certify all source media. |

The original 185-module **local comparison** queue is source-compared with current hashes; its documented 1,659-question option explanation coverage remains intact. The three local visual-validation items above are now closed in the inventory. These local counts must not be represented as full original-media or device/runtime validation. The available local follow-up review is complete; the external/source requirements in this table remain open.
