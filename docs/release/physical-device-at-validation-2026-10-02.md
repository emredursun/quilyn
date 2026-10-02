# Physical-device and assistive-technology validation

**Status: NOT EXECUTED.** No accessible physical iPhone/Android or VoiceOver/TalkBack session has been supplied. Desktop emulation, accessibility-tree inspection and automated tests do not satisfy this gate. Record actual results; do not prefill Pass.

## Required environments

| Environment | Device / OS / browser / AT version | Build / asset token | Result |
| --- | --- | --- | --- |
| iPhone, Safari, touch | Pending | Pending | Not run |
| iPhone, Safari, VoiceOver | Pending | Pending | Not run |
| iPhone, installed Home Screen app, VoiceOver | Pending | Pending | Not run |
| Android, Chrome, touch | Pending | Pending | Not run |
| Android, Chrome, TalkBack | Pending | Pending | Not run |
| Android, installed PWA, TalkBack | Pending | Pending | Not run |

Test the committed build on an HTTPS preview or reachable local development server. Phone `localhost` is the phone, not this Mac. Installation/offline tests require a secure origin. The current local commits have not been deployed; production results against an older build cannot validate them. Use a disposable browser profile or export progress before any reset/import scenario.

For each run capture commit, URL, cache/build version, device and AT version, theme, orientation, text-size settings, time and tester. Record a screenshot or screen recording with spoken output for failures; omit personal data. Each result needs expected versus observed behavior and reproduction steps.

## Touch and installation cases

| ID | Steps | Expected result |
| --- | --- | --- |
| T01 | Open Home in portrait; scroll; rotate; repeat in both themes and larger system text. | Readable content; controls remain reachable; no unintended horizontal page overflow or overlapping bars. |
| T02 | Open hamburger, select a module, reopen and dismiss with outside tap/close; repeat after track switch. | Opaque readable drawer, reliable dismissal, no background interaction while modal drawer is open. |
| T03 | In Mock Exams and Smart Review switch PSA/PBA/PSSA repeatedly. | Relevant content loads without refresh; no stale question bank, missing sidebar or indefinite spinner. |
| T04 | Scroll a long Guide; bookmark; leave and return; use Resume; switch tabs. | Bookmark persists in the right track; Resume returns to the saved section/tab with content clear of the toolbar. |
| T05 | Configure Study plan and open Bookmarks, including an empty collection. | Dates/targets persist; saved lessons open correctly; empty state gives a usable next action. |
| T06 | Start each exam mode, answer single/multi questions, flag, navigate, pause, resume, submit and open results/history/mistakes. | Timer/progress remain readable and compact; navigation does not obscure answers; mode-specific grading and saved results match the actions. |
| T07 | Open search/settings with software keyboard; dismiss and rotate. | Focused control and dismissal remain reachable; no trapped offscreen controls. |
| T08 | Add to Home Screen/install; launch; close/relaunch; open a downloaded lesson offline. | Brand/icon, standalone launch, saved progress and available offline content behave correctly; unavailable content has an accurate message. |
| T09 | Load an earlier installed build, update to the tested build, reopen. | Update path shows the actual new build without losing progress; no response-clone console errors. |
| T10 | Export a test backup, import it, then Reset Everything from an open lesson. | Export/import restores the test state; reset does not recreate removed keys on pagehide or reload. |
| T11 | Two tabs open the same quiz/mock; answer in one, return to the other. | Stale tab shows conflict and locks answer/check/reset/navigation; no misleading unsaved selection. |

## VoiceOver / TalkBack cases

Enable the actual platform screen reader. Use swipe navigation, double-tap activation, heading/link/control navigation (VoiceOver rotor or TalkBack reading controls), and explore by touch. Run both light/dark themes; also test larger text. A desktop DOM tree is insufficient evidence.

| ID | Steps | Expected result |
| --- | --- | --- |
| A01 | Navigate Home, main navigation, learning track selector and lesson links. | Useful names, roles and current selection are spoken; decorative icons are not redundant stops. |
| A02 | Open drawer, track menu, search and settings; navigate to their edges, dismiss each. | Focus enters the opened surface, respects modal boundaries and returns to its trigger; hidden background controls are not reachable. |
| A03 | Navigate Guide/Pitfalls/Quiz/Recap and functional Resume/Bookmark controls. | Tab roles/selection and bookmark state are understandable; activation moves to useful content without losing focus. |
| A04 | Answer single and multi-select practice questions, Check, expand per-option explanation and follow related lesson. | Question and option labels, selection, required count, grading and explanations are understandable; feedback is reachable and source target is correct. |
| A05 | Complete a mock using previous/next, jump, flag, pause and submit. | Each action has an intelligible label/state; timer updates do not continuously interrupt reading; result and error messages are reachable. |
| A06 | Smart Review: read a card, reveal, grade, switch track. | Answer visibility and grading controls are announced; loading/completion is understandable; focus remains usable after rerender. |
| A07 | Edit plan, bookmark/unbookmark, open saved lessons and history/mistakes. | Form labels, validation and changed states are understandable; removing a row does not strand focus. |
| A08 | Reach an interactive lesson iframe and complete its scenarios. | Frame has a useful name; its questions/buttons/feedback can be read and activated; focus can leave the frame. |
| A09 | Repeat installed and offline flows. | Standalone display and network messages remain accessible; no platform-specific focus traps. |

## Acceptance and final review

A required scenario is complete only with physical-device evidence, a recorded result and any failure retested on the fixed commit. Mark unsupported/unavailable scenarios explicitly rather than passing them. Resolve blocking navigation, unreachable actions, invisible/inaudible state changes and data-loss failures before release.

The final whole-project review remains pending until the editorial source queue and this physical-device matrix are finished. Then run `npm run check`, review all changes and generated manifests, verify current build/cache versions and replay the critical user flows on the final commit. Push is not authorized by this test document.
