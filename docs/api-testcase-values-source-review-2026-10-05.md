# API TestCase values and assembly review — 2026-10-05

Reviewed all local material in TAPI-M07/M08 against current primary article bodies; added 36 explanations for nine questions. Stable IDs and B/B/B/A and B/C/B/C/B answer keys retained. Sources and exact hashes are recorded in the inventory.

Corrections: whole-TestCase Auto fill Values is supported; clipboard filling targets an XTestStep and retains absent fields; Jump to Module uses Ctrl+Shift+J; custom TCPs are defined on supported objects and referenced through `{CP[name]}`, not defined separately on every value; DoNothing hiding concerns empty ActionMode, not every empty Value. Changed mappings still require inspection and validation after a Module refresh. Removed unverified naming suffix, ValueRange generation and verbatim Academy-summary claims.

Read current clipboard, API TestCase/menu, TCP, keyboard shortcut, context menu, Fuzzy Search, static menu and update/validation article bodies. Academy videos/exercises were inaccessible; source illustrations not individually inspected. No local visual/interactive assets in these modules and no API Scan/Commander execution. Physical device/AT testing remains unavailable.

`npm run manifest:content` regenerated derived files. `npm run check`: 170/170 passed; shell 297.4 KB. Regression covers whole-case defaults, retained clipboard values, current shortcut and TCP/action semantics. `git diff --check` passed. Token `20261005x`, cache `quilyn-v139`. Local commit only; no push/deployment.
