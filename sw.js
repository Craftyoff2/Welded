const CACHE_PREFIX = 'welded-pwa-';
const CACHE_NAME = `${CACHE_PREFIX}v4`;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const response = await fetch(new URL('./pwa-assets.json', self.registration.scope));
    const assets = await response.json();
    await Promise.all(assets.map(async path => {
      try {
        await cache.add(new URL(path, self.registration.scope));
      } catch (error) {
        console.warn('Soubor se nepodařilo uložit pro offline použití:', path, error);
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch (error) {
      if (request.mode === 'navigate') {
        return (await cache.match(new URL('./index.html', self.registration.scope))) || Response.error();
      }
      return Response.error();
    }
  })());
});
