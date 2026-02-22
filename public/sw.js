/* ─────────────────────────────────────────────────
   Kourous — Service Worker
   Stratégie : Cache-First pour les assets statiques,
               Network-First pour les pages HTML.
   L'app n'a aucune API externe : tout fonctionne hors-ligne.
───────────────────────────────────────────────── */

const CACHE_VERSION = 'kourous-v1';
const STATIC_SHELL = [
  '/',
  '/manifest.json',
  '/icon.png',
];

/* ── Installation : mise en cache du shell ── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(STATIC_SHELL))
  );
  self.skipWaiting();
});

/* ── Activation : suppression des vieux caches ── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ── Fetch : cache-first avec fallback réseau ── */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignorer les requêtes non-GET et les devtools
  if (request.method !== 'GET') return;
  if (request.url.includes('chrome-extension')) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          // Ne pas cacher les erreurs ou les requêtes non-basiques
          if (
            !response ||
            response.status !== 200 ||
            response.type === 'opaque'
          ) {
            return response;
          }

          const clone = response.clone();
          caches.open(CACHE_VERSION).then((cache) =>
            cache.put(request, clone)
          );

          return response;
        })
        .catch(() => {
          // Fallback offline : retourner la page d'accueil en cache
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
        });
    })
  );
});
