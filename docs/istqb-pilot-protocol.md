# CTFL review and pilot protocol

28 October 2026. This protocol distinguishes **independent content review**, **editorial demand assessment** and **candidate-based item analysis**. None is an ISTQB endorsement or accreditation.

## Current evidence

The author completed a second technical pass. It added the all-states / valid-transitions / all-transitions coverage hierarchy to FL-4.2.4, made the upload acceptance rule explicitly sufficient as well as necessary, and replaced two decision-table counting items with scenarios requiring derivation of missing rules and their actions. All six forms retain the official chapter, K-level and selectable-LO quotas.

This author pass is **not independent review**. The user authorized two separate AI review agents on 28 October 2026. Both baseline reviews and their focused correction re-reviews are complete. All bounded critical/major findings were closed after 34 item revisions; see [the resolution record](reports/istqb-independent-review-resolution.md). No human SME sign-off has been supplied. An AI review must be identified as such, even if conducted independently from the authoring session.

There are **zero pilot candidate attempts** supplied to this task. Therefore item difficulty, discrimination, distractor functioning and form difficulty equivalence are unknown. K1/K2/K3 are cognitive targets; they are not measured easy/medium/hard bands.

## Independent review handoff

Use the [source register](istqb-ctfl-research.md), [coverage matrix](../data/istqb-ctfl/coverage.json), the six `data/istqb-ctfl/chapter-*.json` files and `data/mock-exams.json` → `CTFL`. There are 128 topic items and 240 mock items.

Reviewers should solve each item from the stem/options before reading the stored key and rationale. For each permanent question ID record:

- Independently derived answer, calculation or model trace.
- Whether the key is unique and defensible under the stated assumptions.
- Exact syllabus LO/section and the cognitive operation actually required.
- Ambiguity, unstated rounding/granularity, infeasible rule combinations, state resets, guards, prerequisites and tie-breaking issues.
- Distractor plausibility, accidental answer cues, irrelevant difficulty and accessibility of wording.
- Whether the explanation teaches the governing rule and why alternatives fail without positional references.
- Editorial demand estimate with reasoning, explicitly marked as a prediction rather than an observed statistic.
- Decision: retain, revise, replace or re-review. A critical key/ambiguity finding blocks editorial release until resolved.

A second reviewer should concentrate on assessment design and compare the six forms' content/task mix. Adjudicate disagreements against the current official sources, preserving item IDs and revisions. Human credentials and sign-off must be supplied by an actual qualified reviewer; they must never be inferred from an AI role prompt.

## Candidate pilot

Recruit candidates representative of the intended CTFL preparation audience, with consent to local aggregate analysis. Use pseudonymous IDs without names, email addresses or account identifiers. Record first exposure to the form's questions, simulation mode, standard/extended timer, completed outcomes and actual elapsed time. Prior learning and language differences can affect outcomes and should be considered in study design without putting sensitive attributes in the analysis input.

Use fresh forms before feedback is viewed. Repeat practice attempts, exposed items and non-simulation sessions are unsuitable for the primary first-exposure analysis. Candidates with 60- and 75-minute arrangements are separate strata. Similar average scores from different cohorts do not establish form equivalence; an appropriate common-cohort/anchor or counterbalanced design is needed before that claim.

No universal pilot sample size or automatic acceptance threshold is asserted here. The report supplies uncertainty intervals. A local `n < 30` warning is a screening aid, not a declaration that 30 establishes validity. Plan sample sizes with an assessment specialist for the intended precision and decisions.

## Offline analysis tool

`node scripts/analyze-istqb-pilot.mjs --fingerprint` prints the exact current CTFL bank fingerprint. Then run:

```sh
node scripts/analyze-istqb-pilot.mjs --input /private/path/pilot.json --output /private/path/aggregate.json
```

The input must use this shape, with one response for **every** item in its selected current 40-item form:

```json
{
  "version": 1,
  "bankFingerprint": "REPLACE_WITH_CURRENT_FINGERPRINT",
  "attempts": [
    {
      "candidateId": "pseudonym-001",
      "form": "Mock Exam 1",
      "mode": "simulation",
      "firstExposure": true,
      "completed": true,
      "durationMinutes": 60,
      "elapsedSeconds": 3420,
      "responses": [
        {"questionId": "CTFL-M1-Q01", "selected": [0]}
      ]
    }
  ]
}
```

The abbreviated example is **not pilot evidence** and is not executable until all 40 response rows and the actual fingerprint are supplied. `selected` contains zero-based indexes from the exact bank version, not the displayed question number. The form display order may differ from stable question-ID order. Use `[]` for an unanswered item. Multi-select receives a point only for the entire correct set.

This input is a purpose-specific normalized pilot format, not a promise that an arbitrary Quilyn Settings backup can be passed unchanged. A data steward must map exported answer identifiers to the matching bank's indexes, check the item signatures and assign pseudonyms. Do not guess indexes after an item/option revision.

The tool checks the bank version, form, IDs, duplicate response slots, option indexes, timer and elapsed-time bounds. It excludes practice sessions, declared repeat exposure and incomplete sessions, and retains only one eligible row for a candidate/form pair. Duplicate records should be curated before analysis; list order is not evidence of chronological first exposure. Aggregate output does not contain candidate IDs.

For each form and timer condition it reports sample size, score/pass proportions and elapsed-time means. Each item reports:

- Proportion correct (**higher means easier in this particular cohort**) and a 95% Wilson interval.
- Corrected item-total correlation, excluding the target item from its total. Zero variance or inadequate observations produce `null`, not a fabricated zero.
- Unanswered proportion and option selection proportions. Multi-select option proportions can sum above one.
- Screening flags for small samples, negative discrimination and very high/low proportions correct. These are local review prompts, not ISTQB standards or automatic deletion decisions.

Without candidates the report explicitly says `awaiting-candidate-data` and leaves estimates null. The CLI refuses datasets marked `evidenceType: "synthetic"`; synthetic regression fixtures validate software arithmetic and never count as candidate evidence. Merely omitting that marker does not authenticate a dataset: provenance remains the data steward's responsibility.

The analysis establishes no IRT scale, calibrated probability of passing, live-exam equivalence, causal learning effect or standard-setting result. A qualified assessor must interpret findings, review flagged items and repeat the pilot after material changes.

## Method sources

[NBME Item-Writing Guide, chapter 4](https://www.nbme.org/sites/default/files/2021-02/NBME_Item%20Writing%20Guide_R_6.pdf) explains that expected item difficulty can differ from candidate responses and describes response-based difficulty, discrimination and option analysis. Its context is health-science assessment; using those general measurement concepts here does not import its exam blueprint into CTFL.

[ISTQB's official sample C answer guidance](https://istqb.org/wp-content/uploads/sdm-uploads/ISTQB_CTFL_v4.0_Sample-Exam-C-Answers_v1.6.pdf) cautions that sample difficulty can differ from live exams. Matching a sample or cognitive-level quota alone is therefore insufficient evidence of live-exam equivalence.
