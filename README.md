# Quilyn — Free Certification Exam Prep

A free, offline-capable study app for IT certification exams — **Pega** (PCBA, PCSA, PCSSA), **Tricentis Tosca** (AS1, AS2, API testing, TDS1, TDS2, AE1, and mobile test automation), and **Tricentis Testim** (Product Consultant). Structured study guides, practice questions, mock exams, and spaced-repetition review. No account required, no tracking, works offline.

**[Live App →](https://emredursun.github.io/quilyn/)**

> Built as personal study material while preparing for these certifications, now shared as open source so others revising the same exams can benefit.

---

## What's inside

| Track | Modules | Exam |
|-------|---------|------|
| Pega Certified Business Architect (PCBA) | 19 modules | 65% pass · 90 min |
| Pega Certified System Architect (PCSA) | 48 modules | 65% pass · 90 min |
| Pega Certified Senior System Architect (PCSSA ’25) | 25 modules · 203 practice questions | 70% pass · 90 min · 3 × 60-question practice mocks |
| Tricentis Tosca Automation Specialist Level 1 (AS1) | 10 sections | practice + reference |
| Tricentis Tosca Automation Specialist Level 2 (AS2) | 10 sections | practice + reference |
| Tricentis Tosca API Testing | 14 sections | practice + reference |
| Tricentis Tosca Test Design Specialist Level 1 (TDS1) | 12 sections | practice + reference |
| Tricentis Tosca Test Design Specialist Level 2 (TDS2) | 7 sections | practice + reference |
| Tricentis Tosca Automation Engineer Level 1 (AE1) | 13 sections | practice + reference |
| Tricentis Tosca Mobile (Getting Started + Automating Mobile Apps on TMA + Advanced Use Cases) | 18 sections | practice + reference |
| Tricentis Testim Product Consultant | 32 sections | practice + reference |

### Per-module features
- **Study Guide** — Core Concept cards, analogies, and worked examples
- **Exam Pitfalls** — Common traps + best practices
- **Practice Quiz** — Single & multi-select questions with instant feedback, hints, and rationales
- **Quick Recap** — Cheat-sheet summary table

### App-level features
- **Mock Exams** — Timed exams with track-specific duration and pass mark, plus domain breakdown
- **Smart Review / SRS** — Spaced-repetition flashcards (Leitner 5-box) with confidence calibration
- **Global Search** — `Ctrl/⌘ K` searches across all 210 modules instantly
- **Progress Backup/Restore** — Export progress as JSON; validate and preview imports before applying them
- **Study Activity Heatmap** — Calendar view of recorded quiz, exam and review activity
- **Keyboard Shortcuts** — `A B C D` select options · `Enter` checks answer · `H` toggles hint
- **Dark / Light theme** — Saved automatically
- **PWA** — Installable; visited content is cached. Download complete available tracks in Settings for offline study
- **No account required** — All data stays in your browser

SSA mock forms reuse the module practice bank, with no question repeated between the three forms. Scores provide practice feedback rather than an independent readiness estimate.

---

## Run locally

```bash
git clone https://github.com/emredursun/quilyn.git
cd quilyn
python3 -m http.server 8000
# Open http://localhost:8000
```

> **Note:** Opening `index.html` directly from disk (`file://`) will not work because browsers block `fetch()` on that protocol. Use any static HTTP server.

---

## Development checks and implementation

Use Node 24 (see `.nvmrc`). No package installation is needed; checks use Node's built-in APIs.

```bash
npm run check             # JS syntax, content integrity, regression tests
npm run validate:content  # Registry, module and mock-question validation
npm test                 # Regression tests only
npm run manifest:content # Regenerate assets and manifests after content changes
```

The Quality GitHub Actions workflow runs `npm run check` on pushes and pull requests.

- [Implementation backlog, dependencies and acceptance criteria](docs/implementation-plan.md)
- [Design system and interaction specification](docs/design-system-spec.md)
- [Verification matrix and release gate](docs/verification-plan.md)
- [Product and engineering audit](docs/enterprise-audit.md)

The implementation is recorded in [Implementation results](docs/implementation-results.md). Local tests and browser scenarios passed; real-device accessibility, controlled performance measurements, editorial review and the first remote CI run remain release gates.

## Project structure

```
quilyn/
├── index.html                    App shell & entry point
├── manifest.json                 PWA manifest
├── sw.js                         Service worker (offline caching)
├── core/
│   ├── css/
│   │   ├── theme.css             Legacy layout & global styles
│   │   └── views.css             Mock Exam & Smart Review view styles
│   └── js/
│       ├── store.js              Reactive state (ES6 Proxy + localStorage)
│       ├── engine.js             SPA router & module view injector
│       ├── quiz-engine.js        Practice quiz with keyboard shortcuts
│       ├── mock-view.js          Timed mock exam view
│       ├── review-view.js        SRS flashcard view
│       ├── track-switcher.js     Track selector component
│       ├── app-shell.js          Theme, nav, search & settings wiring
│       ├── search.js             Global module search overlay
│       └── settings.js           Progress backup/restore & heatmap
├── icon.svg                      App icon / favicon
└── data/
    ├── registry.json             Track & module manifest
    ├── mock-exams.json           Mock exam question bank
    ├── business-architect/       19 PCBA module JSON files
    ├── system-architect/         48 PCSA module JSON files
    ├── senior-system-architect/  First 6 PCSSA modules (Application Development Intermediate)
    ├── tosca-as1/                Tricentis Tosca AS1 section JSON files
    ├── tosca-as2/                Tricentis Tosca AS2 section JSON files
    ├── tosca-api/                Tricentis Tosca API Testing section JSON files
    ├── tosca-tds1/               Tricentis Tosca TDS1 (Test Design Specialist L1) section JSON files
    ├── tosca-tds2/               Tricentis Tosca TDS2 (Test Design Specialist L2) section JSON files
    ├── tosca-ae1/                Tricentis Tosca AE1 (Automation Engineer L1) section JSON files
    ├── tosca-mobile/             Tricentis Tosca Mobile (Getting Started with Mobile Test Automation) section JSON files
    └── tosca-testim/             Tricentis Testim Product Consultant section JSON files
```

All content is authored as original study notes (concept cards, summaries, practice questions). Official third-party course materials — Tricentis exercise workbooks, transcripts, and Tosca subset (`.tsu`) files — are **not** included in this repository; the relevant modules link to the official Tricentis Academy courses instead.

---

## Adding content

1. Create a module JSON in `data/business-architect/` or `data/system-architect/` following the schema of existing files (`studyGuide`, `examPitfalls`, `practiceQuiz`, `quickRecap`).
2. Register it in `data/registry.json` with `"ready": true`.

3. Run `npm run manifest:content` to regenerate interactive assets, provenance inventory and offline packages.
4. Run `npm run check` before publishing.

The UI renders registered content automatically.

---

## Disclaimer

Quilyn is an independent, unofficial study aid created by a learner, for learners. It is **not affiliated with, endorsed by, or sponsored by** Pegasystems Inc. or Tricentis GmbH. "Pega" is a trademark of Pegasystems Inc.; "Tricentis" and "Tosca" are trademarks of Tricentis GmbH. All study notes and practice questions are original content written to aid revision and are not reproductions of official exam questions. Always refer to the official [Pega Academy](https://academy.pega.com/) and [Tricentis Academy](https://academy.tricentis.com/) for authoritative material.

---

## License

[MIT](LICENSE) — free to use, fork, and adapt. See the license for a note on content and trademarks.

### Senior System Architect learning approach

The initial SSA section covers 18 official topics with concise decision rules, worked examples, common confusions, recall prompts and 48 original scenario questions. Smart Review reuses these questions for spaced retrieval and confidence feedback. Sources are linked at topic and question level. The section targets the ’25 exam; some shared Academy pages now display ’26 while also applying to ’25. Full SSA mock exams will be added after all six exam domains are covered.
