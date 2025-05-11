const CACHE_NAME = 'weather-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/weatherApi.js',
    '/db.js',
    '/icons/icon_192x192.ico',
    '/icons/icon_512x512.png',
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
    );
});


self.addEventListener('fetch', (e) => {
    if (e.request.url.includes('api.weatherapi.com')) {
        return;
    }

    e.respondWith(
        caches.match(e.request).then((res) => {
            return res || fetch(e.request);
        }).catch((err) => {
            console.warn('Offline and not cached:', e.request.url);
        })
    );
});
