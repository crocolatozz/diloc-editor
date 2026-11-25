const CACHE_NAME = 'diloc-editor-v1.12.5';
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
  // Download and precache new version assets in background without forcing skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
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

  // Always check version.json directly against network so background version checks stay fresh
  if (url.pathname.endsWith('/version.json')) {
    event.respondWith(fetch(new Request(event.request, { cache: 'no-store' })));
    return;
  }

  // Keep active version cache intact until user explicitly triggers Update (SKIP_WAITING -> reload)
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request, { ignoreSearch: true });
      if (cached) return cached;

      if (event.request.mode === 'navigate') {
        const cachedIndex = await cache.match('./index.html', { ignoreSearch: true });
        if (cachedIndex) return cachedIndex;
      }

      try {
        const networkRes = await fetch(event.request);
        if (networkRes && networkRes.status === 200) {
          cache.put(event.request, networkRes.clone()).catch(() => {});
        }
        return networkRes;
      } catch (_) {
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })
  );
});
