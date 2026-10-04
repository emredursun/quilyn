# SA-M03 user-management source comparison — 2026-10-05

Compared the complete local three guide sections, analogies, SVG, two retrieval checks, four-scenario simulator, seven pitfalls, 17 question stems/options/keys/hints/rationales with 68 existing option explanations, and seven recap entries against:

- https://academy.pega.com/module/inviting-users-application/v8
- https://academy.pega.com/topic/users-and-personas/v6

Module v8 is Pega Platform 24.2, applicable to 25. Corrected its estimate to 10 minutes and the topic to five minutes. Removed unsupported universal Persona-to-Access-Group mappings, automatic assignment at login, credential delivery through invitation, automatic routing/permission guarantees, and exclusive architect-versus-business-architect onboarding responsibilities. Added the documented People and Persona tabs, default Users Persona, customizable permissions/Work Queue, shared Channels, and Persona-or-developer-role assignment. Rewrote misleading simulator feedback and onboarding scenario; preserved all question identities, lesson targets and answer keys.

Validation: `npm run manifest:content`; `npm run check` passed 139/139 tests; `git diff --check` passed. Regression checks cover stable keys/targets, role/identity distinction, default permissions and Work Queue, shared Channels, simulator onboarding, and removal of misleading guarantees. Browser testing at isolated 127.0.0.1:5500 with diagnostics enabled verified question nine's correct response/feedback and all four simulator answers to 4/4; warning/error logs were empty. Generated assets were regenerated rather than edited manually. Cache token 20261005a / service worker quilyn-v116.

Limitations: editorial source comparison, not execution in a Pega instance. Physical iOS/Android and VoiceOver/TalkBack validation remains unexecuted. Original backlog now has 142 modules; 636 questions still need option explanations/editorial review. No production deployment is claimed by this record.
