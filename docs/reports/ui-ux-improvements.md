# UI/UX improvements — local verification

Date: 2026-10-16. Branch: `codex/ux-first-improvements`.
These changes are prepared locally on this branch; no push or deployment was performed.

## Implemented

- Scheduled Smart Review cards are counted separately from new cards. Review reset is in a separate data-management disclosure.
- Global search finds modules, topics and concepts, prioritizes the active track, and retains module search if the catalogue is unavailable.
- Module provenance stays available in a native disclosure, collapsed initially on mobile.
- Practice quizzes support one-question/all-question layouts, bounded navigation, status and question selection without rewriting answers. Mobile initially shows one question.
- Lesson contents use existing section IDs, track the current section and support direct links.
- Sidebar filters distinguish started, completed, not-started and suggested revision. Topic grouping is optional; original module numbers and course order are retained.
- All 210 modules have study-area metadata. Eight Tricentis tracks now have meaningful Smart Review groups. These are study topics, not official exam weights.
- Study Plan separates today's time budget from authored module estimates. Estimates retain ranges and practice qualifiers. Recommendations explain priority and open the appropriate guide.
- Modules, sections and concepts can be saved together. Concept links focus the term in its source section. The collection searches and removes individual saved items.
- Mock results suggest up to three revision topics based on answered-but-incorrect questions. Unanswered questions are reported separately. Explicit module mappings and exact lesson titles open lessons; broader confirmed topics open the filtered library. Unmapped topics use library search rather than an invented module mapping.
- New controls use existing theme, surface, text, focus and touch-target conventions. Option explanation disclosures have a 44 px minimum summary target.

## Compatibility

The UI work preserves question IDs, module order and exam settings. The subsequent authorized Testim course-key correction changes content and keys; see [the course-key and release review](testim-course-keys-and-release-review.md) for every restoration, decision and recovery behavior.

`quilyn_study` remains version 1. `savedSections` is an optional per-track list; existing module bookmarks and reading positions remain intact. Old backups without this field remain valid. Export/import preserves new saved items, including references to content that has disappeared. Missing sections or renamed concepts are reported as unmatched during import rather than discarded. Save failures retain the previous stored list.

Module estimates are copied verbatim from existing `estTime` values by `scripts/study-estimates.mjs`; `npm run manifest:content` updates them and `npm run check` rejects stale values. The offline manifest and worker cache version were updated for the changed assets.

## Verification

- `npm run check`: 358 tests passed, including storage/backup, quota, cross-tab conflicts, navigation lifecycle, quiz grading, content validation, generated assets and QA measurement correctness.
- `git diff --check`: passed.
- Quiz audit: 242 banks / 2,844 questions; zero skewed banks. Topic audit: 24 decision banks / 81 questions; zero skewed banks.
- Initial shell source: 294.4 KB uncompressed, within the existing 300 KB gate. This is a source-size check, not a measured load-time result.
- Local browser: practice single/multi-select and navigation; saved answers after reload; lesson contents and concept focus; module/section/concept saves and search; sidebar filtering; Smart Review; Study Plan saving/skipping/restoring; mock grading, results and lesson/library recommendations.
- Local responsive checks at 320 and 390 CSS px found no page overflow on inspected views. Light/dark rendering and visible keyboard interactions were inspected. Browser error/warning logs were empty on the inspected final session.

## Additional release checks (2026-10-16)

- Reflow: home, plan, bookmarks, library, lesson, practice quiz, Smart Review, mock selection, history and mistakes at 640 and 320 CSS px in dark mode, plus all ten at 320 px in light mode: 30 checks, no document-level horizontal overflow. No duplicate IDs or unnamed visible controls were found in the 20 dark-mode DOM checks. This is a structural spot check, not a full accessibility audit; it excludes shadow-root internals.
- Keyboard: search autofocus, reverse-Tab containment, Escape dismissal and return to Search; mobile menu autofocus, reverse-Tab containment, Escape dismissal and return to Menu. Search results stayed within the narrow viewport. Native accessibility trees were inspected for these flows.
- Passive performance measurements on a separate localhost origin: first visit FCP 692 ms, LCP 760 ms, CLS 0.0054; no observed long tasks. Three warm reloads at 1280 px: median FCP 56 ms and LCP 92 ms. Three at 390 px: median FCP 40 ms and LCP 64 ms. Recorded menu/search interactions peaked at 32 ms among eight measured interaction IDs. This maximum is not a field INP score. Final inspected browser warning/error logs were empty.
- These are desktop lab measurements without CPU/network throttling. They do not predict production mobile performance. Raw observations are in `ui-ux-qa-results.json`.
- Reusable passive instrumentation: run `python3 scripts/qa/server.py --port 8920` from the repository root, open `http://localhost:8920/`, and inspect the JSON text in `#quilyn-local-qa` after manual interactions. The server binds loopback and adds a measurement script to its HTML responses only; production HTML, storage and exam logic are unchanged. Unsupported metrics are null. Use a fresh port for a fresh-storage first visit; service-worker and HTTP caches affect reloads.

## Checks requiring another environment or participants

These are still unverified, not passed. Native Safari access was attempted but the computer-use service timed out. Firefox and VoiceOver were consequently not available through the working browser-control surface. No physical iOS/Android devices or usability participants were available. A narrowed viewport is not an actual 200%/400% browser zoom test.

| Check | Concrete completion procedure | Pass condition |
| --- | --- | --- |
| Safari and Firefox | Open the local preview; complete a single/multi-select quiz, revisit saved answers, open review, submit a short practice mock, follow its revision link, export/import a test backup. | Same grading, navigation and retained records as the verified browser; no console errors. |
| Real iOS/Android | Repeat on device using a private test session against an approved preview; test portrait/landscape, virtual keyboard, menu, search, bookmarks and reload. | Reachable controls, readable content and retained selections; no page overflow or keyboard obstruction. |
| Actual browser zoom | At a 1280 px window, set browser zoom to 200% and 400%; visit the ten routes above plus search, open menu and quiz explanations. Restore 100% afterward. | Reflow without lost content, clipped controls or two-dimensional reading scroll (except genuinely tabular content). |
| VoiceOver | Navigate landmarks/headings; operate menu, search, quiz radio/checkbox groups, validation, feedback and saved-item buttons. | Meaningful labels and state announcements, usable reading order, focus containment and return. |
| Participant usability | Ask representative learners to resume a lesson, save/find a concept, complete a quiz, review a mistake and find the next revision topic without coaching. Record completion, errors and observed confusion. | Findings reviewed and any blocking confusion fixed; no fabricated participant results. |

This report does not claim WCAG conformance or permission to publish. No implementation items remain on the current agreed feature list; the environment-dependent validation above remains open.
