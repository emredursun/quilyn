# Quiz storage quota fix — 2026-10-02

Asset token: `20261002v`. Service worker cache: `quilyn-v68`.

- External changes set a separate `conflicted` flag and lock the quiz once, including when older-answer archiving has already failed.
- An archive failure stops persistence without blocking selection, grading, Reset or Retry.
- Unsaved practice does not overwrite or delete older answers, abandon their history, record new attempts, or update the saved completion score. Reset and Retry retain this unsaved state.
- Regression tests run real quiz handlers with failed archiving, then verify both continued practice without writes and conflict locking without repeated notices.

Verification: `npm run check` passed all 92 tests. Initial shell remains below 300 KB (295.9 KB). `npm run manifest:content` passed with no generated changes. No dependencies added.

This fix is committed locally. No push or production deployment was performed. The pending PBA editorial package is separate from this fix.
