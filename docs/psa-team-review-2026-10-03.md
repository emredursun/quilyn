# PSA teams local-content comparison — 2026-10-03

SA-M18: compared learning objectives, both guide sections, analogy, diagram text/caption, interactive scenarios/options/feedback, eight pitfalls, all 14 questions/options/keys/hints/rationales, recap and references. Added 56 option explanations, review dates and real lesson-section targets. Preserved question IDs and answer keys. Inventory records the reviewed local-file SHA-256.

Sources: [Teams of users v6](https://academy.pega.com/topic/teams-users/v6), [module v7](https://academy.pega.com/module/creating-and-managing-teams-users/v7), [queue configuration v7](https://academy.pega.com/topic/configuring-work-groups-and-work-queues/v7). Module applicability: Pega Platform 24.2 / 25. The supplemental procedure now names Pega Infinity Studio; treat it as a version-specific reference, not an executed 24.2 procedure.

Removed invented deputy-field automation, unsupported per-Case-Type manager scope, a universal bulk-user-management restriction and exact permission diagnosis inferred solely from a missing button. Corrected contradictory membership guidance and distinguished the introductory shared-queue model from the Default Work Queue field. Added explicit queue-role requirements to support the revised permission scenario. Interactive feedback distinguishes notifications from configured reassignment.

`npm run manifest:content` regenerated derived files. `npm run check`: **105/105 passed**, initial shell **297.4 KB**; `git diff --check` clean. Browser question 14 correctly graded A+B and displayed all four option explanations; no warning/error logs. [Browser evidence](screenshots/psa-team-feedback-2026-10-03.jpg).

Query token `20261003b`; SW `quilyn-v82`. Coverage **801/1862**; **1061 questions** and **176 original queued modules** remain. This is a local package; no push of this package. Physical device/AT tests and final whole-project review remain open. Next module: SA-M19 Team application development.
