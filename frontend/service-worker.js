// frontend/service-worker.js
const cacheName = 'camera-app-cache-v1';
const assetsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/manifest.json',
    '/icons/icon-72x72.png', // Adicione os ícones que você colocou no diretório
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(assetsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
