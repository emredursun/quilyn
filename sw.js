const CACHE_NAME = 'quilyn-v39';
const STATIC_ASSETS = [
  './', './index.html', './manifest.json', './icon.svg',
  './core/css/tokens.css', './core/css/learning.css', './core/css/components.css',
  './core/js/bootstrap.js', './core/css/theme.css', './core/css/views.css',
  './core/js/progress.js', './core/js/runtime.js', './core/js/offline.js',
  './core/js/store.js', './core/js/quiz-engine.js',
  './core/js/engine.js', './core/js/enhancement.js',
  './core/js/mock-view.js', './core/js/review-view.js',
  './core/js/app-shell.js', './core/js/search.js',
  './core/js/settings.js', './core/js/track-switcher.js',
  './data/interactive-manifest.json', './data/content-manifest.json', './data/registry.json', './data/mock-exams.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS.map(asset => new Request(new URL(asset, self.registration.scope), {cache:'reload'}))))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key =>  /^quilyn-v\d+$/.test(key) && key !== CACHE_NAME)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// Timestamp query parameters on registry and module requests must not prevent
// an offline cache hit for the same resource.
function cacheKey(request) {
  const url = new URL(request.url);
  return new Request(url.origin + url.pathname, { method: 'GET' });
}

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'ACTIVATE_UPDATE') self.skipWaiting();
});

async function cachedResponse(key) {
  const current = await caches.open(CACHE_NAME);
  const response = await current.match(key);
  if (response) return response;
  const meta = await caches.open('quilyn-package-index');
  const entry = await meta.match(new URL('data/offline-packages', self.registration.scope).href);
  if (entry) {
    const index = await entry.json();
    for (const packageInfo of Object.values(index)) {
      const cache = await caches.open(packageInfo.cache);
      const cached = await cache.match(key);
      if (cached) return cached;
    }
  }
  return new Response('This content has not been downloaded for offline use.', {status:503});
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  const key = sameOrigin ? cacheKey(request) : request;
  const isData = sameOrigin && url.pathname.endsWith('.json');

  if (sameOrigin && request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok) {
          event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(key, response.clone())));
        }
        return response;
      }).catch(() => cachedResponse(key))
    );
    return;
  }

  if (isData) {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok) {
          event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(key, response.clone())));
        }
        return response;
      }).catch(() => cachedResponse(key))
    );
    return;
  }

  event.respondWith(
    cachedResponse(key).then(cached => cached.ok ? cached : fetch(request).then(response => {
      if (response.ok) {
        event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(key, response.clone())));
      }
      return response;
    }))
  );
});
