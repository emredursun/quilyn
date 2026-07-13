# Quilyn — Free Certification Exam Prep

A free, offline-capable study app for IT certification exams — **Pega** (PCBA, PCSA) and **Tricentis Tosca** (AS1, AS2, API testing). Structured study guides, practice questions, mock exams, and spaced-repetition review. No account required, no tracking, works offline.

**[Live App →](https://emredursun.github.io/quilyn/)**

> Built as personal study material while preparing for these certifications, now shared as open source so others revising the same exams can benefit.

---

## What's inside

| Track | Modules | Exam |
|-------|---------|------|
| Pega Certified Business Architect (PCBA) | 19 modules | 65% pass · 90 min |
| Pega Certified System Architect (PCSA) | 48 modules | 65% pass · 90 min |
| Tricentis Tosca Automation Specialist Level 1 (AS1) | 10 sections | practice + reference |
| Tricentis Tosca Automation Specialist Level 2 (AS2) | 10 sections | practice + reference |
| Tricentis Tosca API Testing | 14 sections | practice + reference |

### Per-module features
- **Study Guide** — Core Concept cards, analogies, and worked examples
- **Exam Pitfalls** — Common traps + best practices
- **Practice Quiz** — Single & multi-select questions with instant feedback, hints, and rationales
- **Quick Recap** — Cheat-sheet summary table

### App-level features
- **Mock Exams** — Full timed exams (90 min, 65% pass mark) with domain breakdown
- **Smart Review / SRS** — Spaced-repetition flashcards (Leitner 5-box) with confidence calibration
- **Global Search** — `Ctrl/⌘ K` searches across all 67 modules instantly
- **Progress Backup/Restore** — Export your scores & SRS progress as JSON; import on any device
- **Study Activity Heatmap** — Calendar view of your study history
- **Keyboard Shortcuts** — `A B C D` select options · `Enter` checks answer · `H` toggles hint
- **Dark / Light theme** — Saved automatically
- **PWA** — Installable, works offline after first visit
- **No account required** — All data stays in your browser

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

## Project structure

```
quilyn/
├── index.html                    App shell & entry point
├── manifest.json                 PWA manifest
├── sw.js                         Service worker (offline caching)
├── core/
│   ├── css/
│   │   ├── theme.css             Design tokens & global styles
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
    ├── tosca-as1/                Tricentis Tosca AS1 section JSON files
    ├── tosca-as2/                Tricentis Tosca AS2 section JSON files
    └── tosca-api/                Tricentis Tosca API Testing section JSON files
```

All content is authored as original study notes (concept cards, summaries, practice questions). Official third-party course materials — Tricentis exercise workbooks, transcripts, and Tosca subset (`.tsu`) files — are **not** included in this repository; the relevant modules link to the official Tricentis Academy courses instead.

---

## Adding content

1. Create a module JSON in `data/business-architect/` or `data/system-architect/` following the schema of existing files (`studyGuide`, `examPitfalls`, `practiceQuiz`, `quickRecap`).
2. Register it in `data/registry.json` with `"ready": true`.

The UI renders it automatically — no code changes needed.

---

## Disclaimer

Quilyn is an independent, unofficial study aid created by a learner, for learners. It is **not affiliated with, endorsed by, or sponsored by** Pegasystems Inc. or Tricentis GmbH. "Pega" is a trademark of Pegasystems Inc.; "Tricentis" and "Tosca" are trademarks of Tricentis GmbH. All study notes and practice questions are original content written to aid revision and are not reproductions of official exam questions. Always refer to the official [Pega Academy](https://academy.pega.com/) and [Tricentis Academy](https://academy.tricentis.com/) for authoritative material.

---

## License

[MIT](LICENSE) — free to use, fork, and adapt. See the license for a note on content and trademarks.
