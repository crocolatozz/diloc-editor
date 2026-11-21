const CACHE_NAME = 'diloc-editor-v1.11.1';
const CORE_ASSETS = [
  './',
  './index.html',
  './app.js',
  './CHANGELOG.md',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './splash-1320x2868.png',
  './splash-1290x2796.png',
  './splash-1284x2778.png',
  './splash-1242x2688.png',
  './splash-1206x2622.png',
  './splash-1179x2556.png',
  './splash-1170x2532.png',
  './splash-1125x2436.png',
  './splash-828x1792.png',
  './splash-750x1334.png',
  './data/operator1.json',
  './data/operator2.json',
  './data/operator3.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) =>
        Promise.allSettled(
          CORE_ASSETS.map(async (asset) => {
            try {
              const res = await fetch(new Request(asset, { cache: 'no-store' }));
              if (res && res.ok) {
                await cache.put(asset, res.clone());
              }
            } catch (_) {}
          })
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.endsWith('/version.json')) {
    event.respondWith(fetch(new Request(event.request, { cache: 'no-store' })));
    return;
  }

  const isCoreDoc =
    event.request.mode === 'navigate' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.json') ||
    url.pathname.endsWith('.md');

  const fetchReq = isCoreDoc
    ? new Request(event.request, { cache: 'no-store' })
    : event.request;

  event.respondWith(
    fetch(fetchReq)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, clone))
            .catch(() => {});
        }
        return networkRes;
      })
      .catch(() =>
        caches.match(event.request, { ignoreSearch: true }).then((cached) => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        })
      )
  );
});
