# Review: "About this preparation track" (scripts/istqb/introduction.mjs + resources.mjs `attribution`)

Checked against the official CTFL v4.0 page on 2026-10-28 (last modified 2026-08-22) and page 2 of the downloaded Syllabus v4.0.1.

**Facts confirmed:** Syllabus v4.0.1, Exam Structures and Rules v1.2, Exam Structure Tables v1.19 ("ISTQB Exam Structures & Rules Tables v1.19"), Sample Exams A–D (A v1.7, B v1.7, C v1.6, D v1.5), 40 questions, 26 of 40 points to pass, "60 (+25% Non-Native Language)" minutes, exams delivered by Exam Providers listed at istqb.org/exam-providers/. The trademark sentence matches the syllabus wording word for word. The glossary root URL works. The official page links to `glossary.istqb.org/en_US/search?term=`, and the root is a fine link to use.

## Critical
None.

## Major

**M1. Syllabus terms of use vs. a non-accredited course (needs an owner decision, not a wording fix).**
Syllabus page 2: extracts may be copied "for non-commercial use" if the source is acknowledged. Only Accredited Training Providers may use the syllabus "as the basis for a training course", and adverts may mention the syllabus only after accreditation. The track is organised around each learning objective in chapters 1–6. Many third-party prep publishers work this way without accreditation, but the owner should decide this knowingly. In particular:
- Confirm that the track copies no verbatim syllabus text beyond short quoted LO labels. If the site is or becomes commercial, the non-commercial extract permission does not cover it.
- Use "informed by" / "aligned to" wording and avoid "course" or "training". The current text already does this ("preparation track", "reference and practice resource"). Keep it that way in marketing too.
- Consider adding: "This is not accredited training." (see rewrite in M2).

**M2. Copyright line simplifies the official notice.**
Current: "Syllabus copyright © 2024 its named authors and International Software Testing Qualifications Board (ISTQB®); see the linked document, page 2, for the complete author credits and terms."
The notice reads "Copyright Notice © International Software Testing Qualifications Board". There are separate author copyrights per version (2024 for v4.0.1, 2023 for v4.0, back to 2005), and the authors "transfer the copyright to the ISTQB®". The phrase "© 2024 its named authors and ISTQB" merges these into one claim the document does not make. "page 2" is also fragile if ISTQB re-paginates.
Rewrite of the full attribution (this also removes the duplication in M3):
> Independent study notes and questions written by Quilyn, based on the ISTQB® CTFL Syllabus v4.0.1. The syllabus is © ISTQB® and its credited authors; see the Copyright Notice in the syllabus for the full credits and terms of use. Quilyn is not affiliated with, accredited by or endorsed by ISTQB®, and this track is not accredited training.

## Minor

**m1. "60 or 75 minutes" leaves out the condition.** A reader cannot tell who gets 75.
Rewrite of the table cell: "Exam-format practice: 40 questions, 26 points to pass, 60 minutes (75 if you take the exam in a non-native language)". Provider rules decide who qualifies, and the right-hand column already points to the official rules.

**m2. Repeated disclaimer.** "not past or live exam questions and do not predict future exam content" appears in the Quality list. The attribution then says almost the same thing: "These are not official, recalled or leaked live-exam questions, and do not predict future exam content." "Original" also appears in both places. Keep one copy. Keep it in the Quality list, and add "official" there if you want: "They are not official, past or live exam questions and do not predict future exam content." Use the M2 rewrite as the attribution.

**m3. Certification sentence could name the provider list.** Current: "certification requires passing the official exam with an ISTQB exam provider." It is accurate. For non-native readers, "ISTQB-recognised exam provider" plus a link would help. Add `{label:'ISTQB exam providers', url:'https://istqb.org/exam-providers/'}` to the Official sources list. Right now nothing links to provider arrangements, even though the table lists them as an official source.

**m4. "Try first exercises" reads as a typo.** Non-native readers may parse it as a misspelling of "Try-first". Rewrite: 'Worked examples and "Try first" exercises for the K3 (apply) learning objectives'. This also explains K3 for readers who do not know K-levels yet.

**m5. AI review sentence.** "The content was reviewed by separate AI reviewers against the official documents and corrected." The disclosure is honest and appropriate. "and corrected" sounds like a guarantee that every issue was fixed. Rewrite: "The content was checked against the official documents in several AI-assisted reviews, and the issues found were corrected. No human ISTQB subject-matter expert has reviewed it."

**m6. Naming consistency.** The table says "six timed practice exams". `disclosure` (mock section) says "practice forms". The structure-tables document is titled "Exam Structures & Rules Tables v1.19", but the intro calls it "Exam Structure Tables v1.19". Consider using the official title once, e.g. "Exam Structures and Rules Tables v1.19", and in the link label too.

**m7. Slight stiffness for non-native readers.** "Official ISTQB sources remain essential for" could be "Use the official ISTQB sources for". "provider arrangements" could be "exam providers". Both are optional.

## What works well
- The version basis and the "last checked" date are clear. "Check the official CTFL page for the current versions before you book" is good practice.
- The deference is right: "Where anything here differs from an official ISTQB document, the official document applies."
- It makes no pass guarantee. "practice scores are an indication, not a prediction" is well judged.
- The tone is neutral, with no disparagement of other providers. The trademark and non-affiliation wording is in line with professional prep publishers once M2 is applied.

## Nothing critical missing
Optional addition: a one-line pointer that accredited training is optional and available from ISTQB Accredited Training Providers. The official page says training is optional, so this would be neutral. Not required.
