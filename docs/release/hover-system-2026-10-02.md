# App hover system — 2026-10-02

Asset token `20261002x`; SW cache `quilyn-v70`.

Audited hover selectors across the app styles. Added shared theme-specific feedback for module and mock cards, action buttons, header tools, tabs, learning links, source chips, search results, quiz options, library links and expandable summaries. Interactive cards lift 2 px; secondary actions lift 1 px. Primary, danger, selected, correct/incorrect and lesson utility actions retain their semantic colors. Locked/graded answers do not gain selection-like hover styling. Noninteractive reading panels no longer lift as if clickable.

Reduced-motion users receive color feedback without the new movement. Pointer-only additions are scoped to hover-capable devices. Existing keyboard focus outlines remain. Contrast regression covers hover surfaces/text and primary action colors in both themes (minimum 4.5:1).

Actual pointer card hover was checked in a separate localhost origin in light and dark themes; sidebar pointer and keyboard focus were checked in the preceding package. All 92 automated tests passed and the shell remains below 300 KB. No physical-device or real screen-reader test was performed.

Local commit only; no push or production deployment. PBA content work is delivered separately.
