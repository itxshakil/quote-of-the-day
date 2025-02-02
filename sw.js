var cacheName = 'qod-cache-v2.2';
// Change main js file name
var filesToCache = [
    '/',
    '/index.html',
    '/index.html?utm_source=homescreen',
    '/manifest.json',
    '/icons/android-icon-72x72.png',
    '/icons/android-icon-96x96.png',
    '/icons/android-icon-144x144.png',
    '/icons/apple-icon-152x152.png',
    '/icons/android-icon-192x192.png',
    '/icons/icon-512.png'
];

// Start the service worker and cache all of the app's content
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => cache.addAll(filesToCache))
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => Promise.all(keyList.map((key) => {
            if (key !== cacheName) {
                return caches.delete(key);
            }
        })))
    );
});
// Serve Cache content when offline

self.addEventListener('fetch', (event) => {
    if (event.request.url === "https://theysaidso.com/img/qod/qod-inspire.jpg") {
        event.respondWith(
            caches.open('mysite-dynamic').then(async function (cache) {
                const response = await cache.match(event.request);
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    // if we got a response from the cache, update the cache
                    if (response) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                });
                return response || fetchPromise;
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(function (response) {
                return response || fetch(event.request);
            })
        );
    }
});
