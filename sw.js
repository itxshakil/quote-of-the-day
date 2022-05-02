var cacheName = 'qod-cache-v2';
// Change main js file name
var filesToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/android-icon-72x72.png',
    '/icons/android-icon-96x96.png',
    '/icons/android-icon-144x144.png',
    '/icons/apple-icon-152x152.png',
    '/icons/android-icon-192x192.png',
    '/icons/icon-512.png'
];

// Start the service worker and cache all of the app's content
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
});
// Serve Cache content when offline

self.addEventListener('fetch', function (event) {
    if (event.request.url == "https://theysaidso.com/img/qod/qod-inspire.jpg") {
        event.respondWith(
            caches.open('mysite-dynamic').then(function (cache) {
                return cache.match(event.request)
                    .then(function (response) {
                        var fetchPromise = fetch(event.request).then(function (networkResponse) {
                            // if we got a response from the cache, update the cache
                            if (response) {
                                cache.put(event.request, networkResponse.clone());
                            }
                            return networkResponse;
                        });

                        // respond from the cache, or the network
                        return response || fetchPromise;
                    });
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