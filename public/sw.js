const CACHE_NAME = 'uangku-pwa-v15';
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/assets/favicon.png',
    '/assets/icon-192.png',
    '/assets/icon-512.png',
    '/assets/icon-maskable.png',
    '/assets/logo.png?v=2',
    '/assets/logo-dark.png?v=2',
    '/assets/mascot.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    // Cache static assets
    if (event.request.url.includes('/assets/') || event.request.url.includes('/build/')) {
        event.respondWith(
            caches.match(event.request).then((cached) => {
                return cached || fetch(event.request).then((response) => {
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                });
            })
        );
        return;
    }

    // Network-first for pages and dynamic Inertia requests
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});

