# PegaAcademy — Free PCBA & PCSA Exam Prep

A free, offline-capable study app for the **Pega Certified Business Architect (PCBA)** and **Pega Certified System Architect (PCSA)** certification exams.

**[Live App →](https://emredursun.github.io/certify-pega/)**

---

## What's inside

| Track | Modules | Exam |
|-------|---------|------|
| Pega Certified Business Architect (PCBA) | 19 modules | 65% pass · 90 min |
| Pega Certified System Architect (PCSA) | 48 modules | 65% pass · 90 min |

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
git clone https://github.com/emredursun/certify-pega.git
cd certify-pega
python3 -m http.server 8000
# Open http://localhost:8000
```

> **Note:** Opening `index.html` directly from disk (`file://`) will not work because browsers block `fetch()` on that protocol. Use any static HTTP server.

---

## Project structure

```
certify-pega/
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
└── data/
    ├── registry.json             Track & module manifest
    ├── mock-exams.json           Mock exam question bank
    ├── business-architect/       19 PCBA module JSON files
    └── system-architect/         48 PCSA module JSON files
```

---

## Adding content

1. Create a module JSON in `data/business-architect/` or `data/system-architect/` following the schema of existing files (`studyGuide`, `examPitfalls`, `practiceQuiz`, `quickRecap`).
2. Register it in `data/registry.json` with `"ready": true`.

The UI renders it automatically — no code changes needed.

---

## License

MIT — free to use, fork, and adapt.
