# Graded native quiz selection — 2026-10-07

## Finding and fix

A clean-origin browser check found that grading removed every selected class from option rows. Runtime native-choice synchronization therefore showed no radio/checkbox checked after grading or restoring a saved graded answer. Correct/wrong feedback remained visible, but the native choice lost the learner's selected state.

Grading now preserves selection only on picked options, separately from correct-answer highlighting. A multi-select regression invokes the actual grading function: picked A/B stay selected, unpicked correct C remains unselected, all controls lock and correct/wrong feedback remains independent.

## Verification

- `npm run check`: **289/289 passed**, zero failed/skipped; initial shell **298.0 KB**.
- `git diff --check` passed. Shared shell token `20261007d`; service-worker shell `quilyn-v223`.
- Chrome, isolated `http://127.0.0.1:8802/` origin: revised AE1-M11 sections loaded. Ctrl+A and Cmd+A kept selected B; plain A still chose A. Correct B graded and displayed feedback.
- Bookmark created on the isolated test origin appeared in Bookmarks; study plan rendered; reopening the lesson restored the saved quiz section and graded result.
- After reloading and verifying the updated quiz script token, restored Q1 radio B was checked and disabled. Newly graded Q2 radio B also stayed checked/disabled; alternatives stayed unchecked/disabled.
- Browser warning/error log query returned no entries in this tested session.

No production or user-origin progress was changed. No push/deployment. These are desktop browser and native semantic checks, not VoiceOver/TalkBack or physical-device certification. Outstanding full source-video and installed runtime scopes remain tracked in the inventory and general follow-up review.
