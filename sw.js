// Bump this on every deploy so clients pick up fresh assets.
const CACHE_VERSION = 'csa-buddy-sw-v5';

const PRECACHE_URLS = [
    '/aboutpage.html',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/apple-touch-icon.png',
    '/badges/apple.svg',
    '/badges/github.png',
    '/badges/google-play.png',
    '/badges/obtainium.png',
    '/bulma.min.css',
    '/ChArUco.png',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/favicon.ico',
    '/fontawesome/css/fontawesome.min.css',
    '/fontawesome/css/solid.min.css',
    '/fontawesome/webfonts/fa-solid-900.woff2',
    '/frc-control-system-layout-basic.svg',
    '/frc-control-system-layout-ctre.svg',
    '/frc-control-system-layout-rev.svg',
    '/ftc-control-system-layout-b1.svg',
    '/ftc-control-system-layout-b2.svg',
    '/index.html',
    '/reference-accessible.html',
    '/reference.html',
    '/script.js',
    '/settings.html',
    '/site.webmanifest',
    '/style.css',
    '/vivid-radio.jpg',
];

// Confirms every precache URL actually made it into the cache, rather than
// trusting that cache.addAll() resolving means all of them succeeded.
async function isFullyCached() {
    const cache = await caches.open(CACHE_VERSION);
    const matches = await Promise.all(PRECACHE_URLS.map((url) => cache.match(url)));
    return matches.every(Boolean);
}

async function notifyClients(ready) {
    const clients = await self.clients.matchAll();
    clients.forEach((client) => client.postMessage({ type: 'OFFLINE_STATUS', ready }));
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .catch((err) => console.error('Precaching failed:', err))
            .then(() => isFullyCached())
            .then((ready) => notifyClients(ready))
    );
    self.skipWaiting();
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CHECK_OFFLINE_STATUS') {
        isFullyCached().then((ready) => event.source.postMessage({ type: 'OFFLINE_STATUS', ready }));
    }
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

    if (url.pathname === '/') {
        event.respondWith(Response.redirect('/reference.html', 302));
        return;
    }

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
