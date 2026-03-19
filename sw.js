const CACHE = 'csa-buddy-cache'
const urlsToCache = [
    './',
    './aboutpage.html',
    './ChArUco.png',
    './errorpage.html',
    './frc-control-system-layout-basic.svg',
    './frc-control-system-layout-ctre.svg',
    './frc-control-system-layout-rev.svg',
    './ftc-control-system-layout-b1.svg',
    './ftc-control-system-layout-b2.svg',
    './index.html',
    './LICENSE',
    './README.md',
    './reference-accessible.html',
    './reference.html',
    './script.js',
    './style.css',
    './vivid-radio.jpg',
    './welcomepage.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE)
            .then(
                cache => {
                    cache.addAll(urlsToCache)
                }
            )
    )
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
        .then(response => {
            // if connected to network, use network & update cache
            return caches.open(CACHE).then(cache => {
                cache.put(event.request, response.clone());
                return response;
            })
        }).catch(() => {
            // if error, try to return cache
            return caches.match(event.request);
        })
    );
});