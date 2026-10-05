# BA-M03 source comparison — 2026-10-05

Reviewed all six local guide sections, three analogies, eight pitfalls, eight recaps, 16 questions with all 64 existing option explanations, and topic references against:

- [Module](https://academy.pega.com/module/pega-center-out-architecture/v1): 20 minutes, two topics plus quiz; Platform '25, also applicable to '26.
- [Architecture topic](https://academy.pega.com/topic/pegas-center-out-business-architecture/v3): full body and all three source diagrams inspected in the browser.
- [Accessibility topic](https://academy.pega.com/topic/accessibility-center-out-development/v1): full body.
- [Constellation features](https://docs.pega.com/bundle/accessibility-in-pega/page/platform/user-experience/accessibility-features-constellation.html) and [best practices](https://docs.pega.com/bundle/accessibility-in-pega/page/platform/user-experience/best-practices-accessibility-constellation.html): full rendered articles, not just the initially empty documentation shell. The displayed publication was Accessibility in Pega, with update dates March 21, 2025 and December 11, 2024 respectively.
- [W3C evaluation guidance](https://www.w3.org/WAI/test-evaluate/): human evaluation is still required alongside tools.

Corrected Q15's hint (three actual principles, not four). Q7 and related guide/pitfall/recap text now follow the current topic's Case Management and Case Lifecycle description. Pattern configuration is explicitly selected and configured by authors. Removed the analogy's guarantee that connection changes cannot affect business behavior and the claim that updates propagate instantly. Added the missing Constellation navigation, semantics, labels, contrast warnings, errors, content guidance and manual/automated evaluation guidance, including the Accessibility Inspector limitation.

Existing accessibility qualifications are retained: shared patterns do not certify an application's conformance. The Academy's stronger automatic-compliance language is not presented as a substitute for application evaluation. Existing IDs, section anchors, selection counts and correct-answer keys are preserved. No option explanations count as newly added.

Scope: editorial comparison, not an executed Pega application test. This module has no local diagrams or interactive exercises. Source knowledge-check controls on the architecture page did not render, so no hidden knowledge-check content or logged-in quiz is claimed as verified. Physical-device and assistive-technology tests remain blocked by lack of devices/service access. Pending original inventory: 136 modules; 636 questions still need option explanations/editorial review.

Validation: `npm run manifest:content`, `npm run check` (145/145 passed) and `git diff --check` passed. Regression covers the reviewed content hash, unchanged IDs/answer keys/lesson anchors, the corrected hint and explicit pattern configuration. Shared asset token 20261005h / quilyn-v123. Saved locally; no push.
