# Brand assets and response caching — 1 October 2026

## Response.clone failure

The reported console errors were real cache-write failures. The worker cloned responses inside a delayed `caches.open` callback, after the browser could already have consumed the response body. Network rendering could succeed while the offline cache failed to update.

Responses are now cloned synchronously before being returned to the page. `waitUntil` is registered during fetch dispatch. Cache/quota failures are caught and logged without discarding successful network responses. No user progress or downloaded package data is cleared.

Four regression tests consume the network response while cache opening is delayed: navigation, JSON and asset misses; the fourth simulates a cache quota failure. Release service worker version: v43.

## Visual identity

- Replaced emoji track icons with decorative SVG icons for business architecture, system architecture, senior architecture, testing and code automation. They use 24-unit viewboxes and a common 1.75 stroke.
- Navigation glyphs use 20 px dimensions and the same stroke, with the existing responsive touch areas preserved.
- Replaced the text logo and previous icon with one white Q mark on a flat indigo tile. The SVG master is `icon.svg`.
- Generated 192/512 px install icons, a separate square 512 px maskable icon, 180 px Apple icon, 32 px PNG favicon and a 16/32/48 px ICO. Maskable artwork stays inside the central safe zone. Manifest and HTML reference the new assets, all precached locally.
- Removed remaining decorative emoji from lesson headers and Smart Review labels. Visible text continues to identify every control.

Raster assets can be regenerated with `node scripts/build-brand.mjs` when `sharp` is installed, or by passing the path of an existing sharp module as the first argument. The application has no runtime dependency on sharp.

## Verification

31 tests passed, including icon dimension/precache checks and cache race regressions. Visual inspection of raster icon and browser track menu completed. Captured browser warnings/errors were empty during the checked flow. Initial shell stays below the existing 300 KB budget.

Physical home-screen installation on iOS/Android remains unverified. This release targets service worker v43. Commit/push/deployment status is recorded in Git and [GitHub Actions](https://github.com/emredursun/quilyn/actions), rather than asserted in this static verification record.

The brand area links to `#home`; desktop and mobile navigation were verified, including mobile drawer dismissal. Changed shell CSS/JavaScript URLs use `v=20261001b` to avoid stale HTTP-cached assets for users without a service worker.
