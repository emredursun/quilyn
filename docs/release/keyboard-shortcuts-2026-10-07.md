# Quiz keyboard review — 2026-10-07

The global quiz handler previously treated modified letter keys as answer shortcuts. Ctrl/Cmd+A could select answer A instead of allowing the browser command; Alt combinations and composition input could likewise mutate selection. The handler now ignores modifier combinations, already-handled events, composition and contenteditable focus. Plain answer keys retain their behavior; native form controls remain excluded.

A regression invokes the actual handler with browser modifiers, composition, defaultPrevented and editable focus, then verifies that an ordinary A still selects an option. `npm run check`: **287/287 passed**. Initial shell remains below 300 KB. Shared asset token `20261007c`, service-worker shell `quilyn-v222`. No dependencies, content JSON or progress keys changed in this packet. No push/deployment. This is keyboard logic verification, not a physical screen-reader certification.
