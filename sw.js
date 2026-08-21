const CACHE_NAME = 'quilyn-v20';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './core/css/theme.css',
  './core/css/views.css',
  './core/js/quiz-engine.js',
  './core/js/engine.js',
  './core/js/enhancement.js',
  './core/js/mock-view.js',
  './core/js/review-view.js',
  './core/js/app-shell.js',
  './core/js/search.js',
  './core/js/settings.js',
  './core/js/track-switcher.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

/* 
 * Tier-1 Routing Strategy:
 * - JSON files: Network-First (always fresh if online), fallback to Cache (offline).
 * - Static Assets: Cache-First, fallback to Network.
 */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Network-First for data files
  if (url.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(event.request).then(response => {
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return response;
      }).catch(() => caches.match(event.request))
    );
  } else {
    // Cache-First for UI assets
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(response => {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
          return response;
        });
      })
    );
  }
});
