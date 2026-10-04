# SA-M40 — application security editorial review

Compared the complete local module on 2026-10-04: four guide sections, analogy, three diagrams/captions, seven pitfalls, 14 questions with 56 option explanations, nine recap entries and three topic references. Module v6 applies to Pega Platform '25; duration corrected to 40 minutes. Exact content hash and review scope are in the inventory.

## Corrections

- CBAC consistently means Client-Based Access Control. Removed class-based and claim-based contradictions and fixed the unrelated question 12 rationale.
- Removed invented exam-frequency claims and the suggestion that the AIC ordering describes different goals from CIA.
- Checklist completion refers to applicable tasks and the source-described Deployment Manager process. Guardrail compliance complements other security controls.
- Lockout escalation includes its configured failed-attempt threshold. OTP delivery does not define every possible MFA method; Operator ID need not be an email address.
- Navigation routes and authentication-service overrides are explicitly attributed to Security policies v5; they are not claimed verified in a current Pega UI.

## Sources

- [Module v6](https://academy.pega.com/module/application-security/v6)
- [Security Checklist v5](https://academy.pega.com/topic/security-checklist/v5)
- [Security policies v6](https://academy.pega.com/topic/security-policies/v6)
- [Authentication and authorization v1](https://academy.pega.com/topic/user-authentication-and-authorization/v1)
- [Earlier navigation reference, policies v5](https://academy.pega.com/topic/security-policies/v5)

## Verification and limits

`npm run manifest:content` regenerated outputs. `npm run check`: **127/127 passed**, shell below 300 KB. Browser diagnostic Q12 A graded correctly with the personal-data rationale; no captured warnings/errors. No executed Pega deployment, authentication, policy or authorization tests. Physical iOS/Android and VoiceOver/TalkBack remain open.

Asset token `20261004l`; cache `quilyn-v104`. Local commit only. Coverage **1111/1862 questions**; **751 questions and 154 original queued modules** remain.
