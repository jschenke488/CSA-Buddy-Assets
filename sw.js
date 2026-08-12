// Bump this on every deploy so clients pick up fresh assets.
const CACHE_VERSION = 'csa-buddy-v205';

const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/reference.html',
    '/reference-accessible.html',
    '/settings.html',
    '/aboutpage.html',
    '/style.css',
    '/bulma.min.css',
    '/script.js',
    '/site.webmanifest',
    '/favicon.ico',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/apple-touch-icon.png',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/fontawesome/css/fontawesome.min.css',
    '/fontawesome/css/solid.min.css',
    '/fontawesome/webfonts/fa-solid-900.woff2',
    '/ChArUco.png',
    '/frc-control-system-layout-basic.svg',
    '/frc-control-system-layout-ctre.svg',
    '/frc-control-system-layout-rev.svg',
    '/ftc-control-system-layout-b1.svg',
    '/ftc-control-system-layout-b2.svg',
    '/vivid-radio.jpg',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)))
        )
    );
    self.clients.claim();
});

// Cache-first, falling back to network. Successful network responses are
// stored so the next offline visit has them too.
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;

            return fetch(event.request).then((response) => {
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, responseClone));
                }
                return response;
            }).catch(() => {
                if (event.request.mode === 'navigate') return caches.match('/reference.html');
            });
        })
    );
});
