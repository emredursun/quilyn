# SA-M04 Center-out source comparison — 2026-10-05

Compared the complete six guide sections, six SVG diagrams, six interactives (including sequencing code), nine pitfalls, 16 questions with all 64 existing option explanations, ten recap entries, and objectives with:

- https://academy.pega.com/module/pega-center-out-architecture/v1
- https://academy.pega.com/topic/pegas-center-out-business-architecture/v3
- https://academy.pega.com/topic/accessibility-center-out-development/v1
- https://docs.pega.com/bundle/accessibility-in-pega/page/platform/user-experience/accessibility-features-constellation.html
- https://docs.pega.com/bundle/accessibility-in-pega/page/platform/user-experience/best-practices-accessibility-constellation.html

The Academy module is Pega Platform 25, applicable to 26, with 20 minutes including its quiz. Topic estimates are 10 and five minutes. The two documentation pages were read completely after browser rendering (the text-fetch interface initially returned only the shell). Features page: updated March 21, 2025. Best practices: updated December 11, 2024.

Corrected contradictory lists of principles and benefits in diagrams and pitfalls. Removed automatic whole-application accessibility certification claims, misleading analogies, absolute connector-only migration claims, and incomplete question feedback. Added documented Constellation features and development checks. Preserved question identities and answer keys. The local I-O-U-D-V mnemonic is identified as a memory aid rather than a runtime sequence.

The sequencing exercise now has labelled native Up/Down buttons, 44px minimum control height, focus restoration, polite result announcements, and a checked-state guard. Its feedback now identifies the misplaced principle's own reference letter. A browser check found the generated event delegate did not support the initial two-argument inline action; this was corrected by binding direct event listeners before release.

Validation: generated files regenerated with `npm run manifest:content`; `npm run check` passed 140/140; `git diff --check` passed. Regression checks verify reference lists, reviewed content hash, non-drag move/boundary/locked behavior and direct event binding. Browser testing at isolated 127.0.0.1:5500 verified a labelled Up-button swap and its reversal by Enter on Down; quiz question 14 graded correctly with the application-validation explanation. Browser warning/error logs were empty. Token 20261005b / quilyn-v117.

Limits: local editorial and browser verification, not a deployed Pega instance or actual iOS/Android/VoiceOver/TalkBack test. 141 modules and 636 question explanations/editorial reviews remain. No production deployment is claimed here.
