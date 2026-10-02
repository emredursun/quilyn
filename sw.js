const CACHE_NAME = 'quilyn-v66';
const STATIC_ASSETS = [
  './', './index.html', './manifest.json', './icon.svg', './favicon.ico',
  './assets/brand/icon-192.png', './assets/brand/icon-512.png',
  './assets/brand/icon-maskable-512.png', './assets/brand/apple-touch-icon.png', './assets/brand/favicon-32.png',
  './core/css/tokens.css', './core/css/learning.css', './core/css/components.css',
  './core/js/bootstrap.js', './core/css/theme.css', './core/css/views.css',
  './core/js/progress.js', './core/js/runtime.js', './core/js/learning-history.js', './core/js/study-plan.js', './core/css/learning-history.css', './core/js/offline.js',
  './core/js/library.js', './core/css/library.css', './data/library-index.json', './core/js/store.js', './core/js/quiz-engine.js',
  './core/js/engine.js', './core/js/mobile-nav.js', './core/js/enhancement.js',
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

  // Clone before returning the response to the page. Cloning inside a delayed
  // caches.open callback races the page's consumption of the response body.
  let cacheWrite = Promise.resolve();
  const network = () => fetch(request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      cacheWrite = caches.open(CACHE_NAME).then(cache => cache.put(key, copy));
    }
    return response;
  });
  const response = (sameOrigin && request.mode === 'navigate') || isData
    ? network().catch(() => cachedResponse(key))
    : cachedResponse(key).then(cached => cached.ok ? cached : network());
  event.respondWith(response);
  // Register the lifetime extension synchronously; cache/quota failures must
  // not turn successful network responses into failures for the user.
  event.waitUntil(response.then(() => cacheWrite).catch(error => {
    console.warn('Quilyn: cache update failed', error);
  }));
});
